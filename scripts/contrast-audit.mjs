#!/usr/bin/env node
/**
 * WCAG AA contrast audit across every rendered route.
 *
 * This is a standalone Node script — it is NOT part of the app bundle and is
 * never imported by app code. It drives real headless Chrome against the
 * already-running dev server (`npm run dev`, http://localhost:3000) and asks
 * the browser itself for computed styles, so the numbers reflect exactly
 * what a real browser paints (fonts, inherited colors, alpha compositing,
 * Tailwind v4 tokens, etc.) rather than a static approximation.
 *
 * Why raw CDP instead of puppeteer:
 *   Neither `puppeteer` nor `puppeteer-core` is present in node_modules, and
 *   the task brief forbids adding a new dependency for this. Node 22+ ships
 *   a native `WebSocket` global and `fetch`, which is everything needed to
 *   speak the Chrome DevTools Protocol directly:
 *     1. Launch `Google Chrome --headless=new --remote-debugging-port=<p>`
 *        with a scratch --user-data-dir.
 *     2. Talk to the browser's HTTP endpoint (`/json/new`, `/json/close`) to
 *        open/close a tab, and to its `webSocketDebuggerUrl` (native
 *        WebSocket) to enable the Page/Runtime/Emulation domains, navigate,
 *        and Runtime.evaluate an in-page audit function.
 *
 * Animation handling:
 *   Several components (components/motion/FadeUp.tsx, Stagger.tsx, etc.) use
 *   `whileInView` fade/slide-in animations gated on `useReducedMotion()`.
 *   When that hook reports "reduced", they render the FINAL state
 *   synchronously with no IntersectionObserver/animation involved at all.
 *   We emulate `prefers-reduced-motion: reduce` via CDP's
 *   `Emulation.setEmulatedMedia` before navigating, so every element is
 *   audited in its settled, final-paint state — never mid-fade.
 *
 * Effective color computation (in-page, browser-computed):
 *   - Foreground: getComputedStyle(el).color, alpha-composited over the
 *     element's effective background if the text color itself has alpha<1.
 *   - Effective background: walk from the element itself up through
 *     ancestors, alpha-compositing each ancestor's backgroundColor "over"
 *     the accumulated result (closer ancestors paint on top of farther
 *     ones), stopping at the first fully-opaque layer; falls back to white
 *     (the page canvas) if nothing opaque is found.
 *   - Contrast ratio: standard WCAG relative-luminance formula.
 *   - Threshold: 3.0 for "large" text (>=24px, or >=18.66px AND
 *     font-weight>=700), else 4.5.
 *
 * Skips (not failures): aria-hidden (self or ancestor), display:none,
 * visibility:hidden, opacity:0 (via Element.checkVisibility), zero-size
 * boxes, sr-only-style 1x1 clipped boxes, and boxes fully translated off the
 * left/right/top/bottom of the document (closed drawers/off-canvas menus).
 * Below-the-fold content IS still audited (real content, just scrolled).
 */

import { spawn, execSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE_URL = process.env.CONTRAST_AUDIT_BASE_URL ?? "http://localhost:3000";
const CDP_PORT = Number(process.env.CONTRAST_AUDIT_PORT ?? 9333);
const CHROME_PATH =
  process.env.CONTRAST_AUDIT_CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const ROUTES = [
  "/",
  "/services",
  "/services/skilled",
  "/services/attendant",
  "/service-area",
  "/about",
  "/careers",
  "/refer",
  "/contact",
  "/remote-patient-monitoring",
  "/accessibility",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeout(ms, label) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`timeout waiting for ${label}`)), ms),
  );
}

async function waitForCdp(port) {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://localhost:${port}/json/version`);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await sleep(150);
  }
  throw new Error(`Chrome CDP endpoint on port ${port} never came up`);
}

/** Minimal CDP client for a single page target over the native WebSocket. */
class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.eventHandlers = new Map();
    this.readyPromise = new Promise((resolve, reject) => {
      this.ws.addEventListener("open", () => resolve());
      this.ws.addEventListener("error", (e) => reject(e));
    });
    this.ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== undefined && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        const handlers = this.eventHandlers.get(msg.method);
        if (handlers) for (const h of [...handlers]) h(msg.params);
      }
    });
  }

  ready() {
    return this.readyPromise;
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, handler) {
    if (!this.eventHandlers.has(method)) this.eventHandlers.set(method, []);
    this.eventHandlers.get(method).push(handler);
  }

  once(method) {
    return new Promise((resolve) => {
      const handler = (params) => {
        const list = this.eventHandlers.get(method);
        const idx = list.indexOf(handler);
        if (idx >= 0) list.splice(idx, 1);
        resolve(params);
      };
      this.on(method, handler);
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {
      // ignore
    }
  }
}

/**
 * Runs INSIDE the browser page via Runtime.evaluate. Must be fully
 * self-contained (no outer-scope closures) since it is shipped as a string.
 */
function auditPageInBrowser() {
  // Tailwind v4's opacity modifiers (text-white/70, bg-white/[0.06], ...) are
  // implemented with relative-color syntax, so Chrome's computed style often
  // serializes `color`/`background-color` as `oklab(...)` rather than
  // `rgb()`/`rgba()`. Rather than reimplement oklab->sRGB math, let a 1x1
  // canvas 2D context — which accepts and normalizes any valid CSS color,
  // including oklab/oklch/lab/color-mix — do the parsing for us. Its
  // `fillStyle` getter always reports back either `#rrggbb` (alpha 1) or
  // `rgba(r, g, b, a)` (alpha < 1), which is trivial to parse.
  const _colorCanvas = document.createElement("canvas");
  _colorCanvas.width = 1;
  _colorCanvas.height = 1;
  const _colorCtx = _colorCanvas.getContext("2d");

  // As it turns out, Chrome's canvas fillStyle getter preserves modern color
  // notations (oklab/oklch) rather than always down-converting to rgb() —
  // so for those we do the OKLab -> linear-sRGB -> sRGB math ourselves
  // (Björn Ottosson's reference conversion, same one the CSS Color 4 spec
  // uses). Legacy notations (rgb/hex/named/hsl/color-mix, ...) still go
  // through canvas, which normalizes them to #rrggbb / rgba() for us.
  function parsePercentOrNumber(s) {
    if (s === undefined) return undefined;
    return s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s);
  }

  function srgbFromLinear(c) {
    const clamped = Math.min(1, Math.max(0, c));
    const v =
      clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, v)) * 255);
  }

  function oklabToRgb(L, a, b, alpha) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;
    const rl = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const gl = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
    return { r: srgbFromLinear(rl), g: srgbFromLinear(gl), b: srgbFromLinear(bl), a: alpha };
  }

  function parseColor(str) {
    if (!str || str === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

    const oklab = str.match(
      /^oklab\(\s*([\d.]+%?)\s+(-?[\d.]+%?)\s+(-?[\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i,
    );
    if (oklab) {
      const L = parsePercentOrNumber(oklab[1]);
      const a = parseFloat(oklab[2]);
      const b = parseFloat(oklab[3]);
      const alpha = oklab[4] !== undefined ? parsePercentOrNumber(oklab[4]) : 1;
      return oklabToRgb(L, a, b, alpha);
    }

    const oklch = str.match(
      /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+(-?[\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i,
    );
    if (oklch) {
      const L = parsePercentOrNumber(oklch[1]);
      const C = parseFloat(oklch[2]);
      const Hrad = (parseFloat(oklch[3]) * Math.PI) / 180;
      const alpha = oklch[4] !== undefined ? parsePercentOrNumber(oklch[4]) : 1;
      return oklabToRgb(L, C * Math.cos(Hrad), C * Math.sin(Hrad), alpha);
    }

    // Legacy notation — let canvas normalize it.
    _colorCtx.fillStyle = "#000000";
    _colorCtx.fillStyle = str;
    const normalized = _colorCtx.fillStyle;
    const hexMatch = normalized.match(/^#([0-9a-f]{6})$/i);
    if (hexMatch) {
      const n = parseInt(hexMatch[1], 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
    }
    const rgbaMatch = normalized.match(/rgba?\(([^)]+)\)/i);
    if (rgbaMatch) {
      const parts = rgbaMatch[1].split(",").map((s) => parseFloat(s.trim()));
      if (parts.some((n) => Number.isNaN(n))) return null;
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
    }
    return null;
  }

  // Composite `top` (painted in front) over `bottom` (painted behind).
  function over(top, bottom) {
    const a = top.a + bottom.a * (1 - top.a);
    if (a <= 0) return { r: 255, g: 255, b: 255, a: 0 };
    const mix = (k) => (top[k] * top.a + bottom[k] * bottom.a * (1 - top.a)) / a;
    return { r: mix("r"), g: mix("g"), b: mix("b"), a };
  }

  function effectiveBackground(el) {
    let result = { r: 0, g: 0, b: 0, a: 0 };
    let node = el;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      const bg = parseColor(cs.backgroundColor);
      if (bg && bg.a > 0) {
        result = over(result, bg);
        if (result.a >= 0.999) return result;
      }
      node = node.parentElement;
    }
    // Nothing opaque found up to <html> — fall back to the page canvas (white).
    return over(result, { r: 255, g: 255, b: 255, a: 1 });
  }

  function relLuminance(c) {
    const lin = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  }

  function contrastRatio(c1, c2) {
    const L1 = relLuminance(c1);
    const L2 = relLuminance(c2);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function selectorFor(el) {
    const cls =
      el.className && typeof el.className === "string" && el.className.trim()
        ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
        : "";
    return el.tagName.toLowerCase() + cls;
  }

  // The backgroundColor ancestor-walk cannot see raster/vector imagery
  // (<img>/<video>/<canvas>/<svg>) or CSS gradients — those paint pixels
  // that never show up as a `background-color`. When such a layer spatially
  // overlaps the text element, the computed ratio is unreliable (this is the
  // same reason axe-core reports "incomplete" rather than pass/fail for
  // text over images). Flag these separately for manual/visual review
  // instead of a hard failure.
  const mediaEls = [...document.querySelectorAll("img, video, canvas, svg")];

  function hasUnreliableBackdrop(el, rect) {
    let node = el;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return true;
      node = node.parentElement;
    }
    for (const m of mediaEls) {
      if (el.contains(m) || m.contains(el)) continue;
      const r2 = m.getBoundingClientRect();
      if (r2.width === 0 || r2.height === 0) continue;
      const overlaps = !(
        rect.right < r2.left ||
        rect.left > r2.right ||
        rect.bottom < r2.top ||
        rect.top > r2.bottom
      );
      if (overlaps) return true;
    }
    return false;
  }

  const results = [];
  const needsReview = [];
  let audited = 0;
  let skippedUnparseable = 0;
  const all = document.querySelectorAll("body *");

  for (const el of all) {
    // Only elements with a DIRECT (non-descendant) non-whitespace text node.
    let text = "";
    for (const child of el.childNodes) {
      if (child.nodeType === 3 && child.textContent && child.textContent.trim()) {
        text += child.textContent.trim() + " ";
      }
    }
    text = text.trim();
    if (!text) continue;

    if (el.closest('[aria-hidden="true"]')) continue;

    if (typeof el.checkVisibility === "function") {
      const visible = el.checkVisibility({
        checkOpacity: true,
        checkVisibilityCSS: true,
      });
      if (!visible) continue;
    }

    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.width <= 1 && rect.height <= 1) continue; // sr-only-style clipped box
    // Fully off the left/right/top edge of the document (closed drawers etc.)
    if (rect.right <= 0 || rect.left >= document.documentElement.scrollWidth) continue;
    if (rect.bottom <= 0) continue;

    const fg = parseColor(cs.color);
    if (!fg) {
      // Unrecognized color syntax (e.g. lab()/color()) — do not silently
      // drop it from view; surface it so a real gap is never mistaken for
      // a clean pass. See the oklab() lesson: parseColor() returning null
      // here once meant hundreds of elements were skipped without a trace.
      skippedUnparseable++;
      continue;
    }
    if (fg.a === 0) continue;

    const bg = effectiveBackground(el);
    const effFg = fg.a < 1 ? over(fg, bg) : fg;

    audited++;

    const ratio = contrastRatio(effFg, bg);

    const fontSize = parseFloat(cs.fontSize);
    const fontWeight = parseInt(cs.fontWeight, 10) || 400;
    const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const need = isLarge ? 3.0 : 4.5;

    if (ratio < need - 0.005) {
      const entry = {
        selector: selectorFor(el),
        text: text.slice(0, 60),
        fg: `rgb(${Math.round(effFg.r)}, ${Math.round(effFg.g)}, ${Math.round(effFg.b)})`,
        bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        ratio: Math.round(ratio * 100) / 100,
        need,
      };
      if (hasUnreliableBackdrop(el, rect)) {
        needsReview.push(entry);
      } else {
        results.push(entry);
      }
    }
  }

  return { audited, failures: results, needsReview, skippedUnparseable };
}

async function auditRoute(port, route) {
  const tabInfo = await (
    await fetch(`http://localhost:${port}/json/new?about:blank`, { method: "PUT" })
  ).json();

  const client = new CdpClient(tabInfo.webSocketDebuggerUrl);
  await client.ready();

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });

  const loadPromise = client.once("Page.loadEventFired");
  const nav = await client.send("Page.navigate", { url: BASE_URL + route });
  if (nav.errorText) {
    client.close();
    await fetch(`http://localhost:${port}/json/close/${tabInfo.id}`).catch(() => {});
    throw new Error(`navigation to ${route} failed: ${nav.errorText}`);
  }

  await Promise.race([loadPromise, timeout(20000, `load of ${route}`)]);
  // Let hydration/layout settle. prefers-reduced-motion already removes
  // whileInView animation, so this is just paint/hydration slack, not a
  // wait for animation to finish.
  await sleep(400);

  const evalResult = await client.send("Runtime.evaluate", {
    expression: `(${auditPageInBrowser.toString()})()`,
    returnByValue: true,
    awaitPromise: true,
  });

  client.close();
  await fetch(`http://localhost:${port}/json/close/${tabInfo.id}`).catch(() => {});

  if (evalResult.exceptionDetails) {
    throw new Error(
      `in-page audit threw on ${route}: ${JSON.stringify(evalResult.exceptionDetails)}`,
    );
  }

  return evalResult.result.value;
}

async function main() {
  // Best-effort: clear out any stray Chrome left on our port from a prior
  // interrupted run before starting a fresh one.
  try {
    execSync(`pkill -f "remote-debugging-port=${CDP_PORT}"`, { stdio: "ignore" });
    await sleep(300);
  } catch {
    // nothing was running — fine
  }

  const userDataDir = mkdtempSync(join(tmpdir(), "contrast-audit-chrome-"));
  const chrome = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      "--disable-gpu",
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      "--window-size=1440,3000",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let exitCode = 0;
  let totalAudited = 0;
  let totalFailures = 0;
  let totalNeedsReview = 0;
  let totalSkippedUnparseable = 0;

  try {
    await waitForCdp(CDP_PORT);

    for (const route of ROUTES) {
      try {
        const { audited, failures, needsReview, skippedUnparseable } = await auditRoute(
          CDP_PORT,
          route,
        );
        totalAudited += audited;
        totalFailures += failures.length;
        totalNeedsReview += needsReview.length;
        totalSkippedUnparseable += skippedUnparseable;
        for (const f of failures) {
          console.log(
            `${route} | ${f.selector} | "${f.text}" | ${f.fg} | ${f.bg} | ${f.ratio} | FAIL need ${f.need}`,
          );
        }
        for (const f of needsReview) {
          console.log(
            `${route} | ${f.selector} | "${f.text}" | ${f.fg} | ${f.bg} | ${f.ratio} | NEEDS_REVIEW (text over image/gradient — auto-computed ratio unreliable) need ${f.need}`,
          );
        }
        if (failures.length === 0 && needsReview.length === 0) {
          console.log(`${route} | OK (${audited} text elements audited)`);
        }
      } catch (err) {
        console.error(`${route} | ERROR | ${err.message}`);
        exitCode = 2;
      }
    }
  } finally {
    chrome.kill("SIGKILL");
    try {
      rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }

  console.log("");
  console.log(
    `Contrast audit: ${ROUTES.length} routes, ${totalAudited} text elements audited, ${totalFailures} AA failures, ${totalNeedsReview} flagged for manual review (text over images/gradients), ${totalSkippedUnparseable} skipped for unparseable color syntax.`,
  );
  if (totalSkippedUnparseable > 0) {
    console.warn(
      `WARNING: ${totalSkippedUnparseable} element(s) had a color the script could not parse (not rgb/hex/oklab/oklch) and were excluded from the audit — coverage is incomplete until this is investigated.`,
    );
  }

  if (totalFailures > 0) exitCode = 1;
  process.exit(exitCode);
}

main().catch((err) => {
  console.error("Contrast audit crashed:", err);
  process.exit(2);
});
