import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import messages from "@/messages/en.json";

/**
 * Client direction (2026-07-03): payer PROGRAM names must not appear in
 * MARKETING copy used as coverage claims — e.g. "covered by Medicare",
 * "available through Texas Medicaid", "Medicare, Medicaid, or private pay".
 *
 * This does NOT apply to:
 *  - the "Medicare-certified" CREDENTIAL (a certification claim, not a
 *    coverage/payer claim) or "Medicare and CHAP standards" / "federal
 *    Medicare standards" (standards claims);
 *  - the functional intake-form Insurance dropdown (components/LeadForm.tsx),
 *    which is a working form field, not marketing prose.
 */

// Matches payer-names used as a coverage/marketing claim — including
// verb-based phrasings ("bill/accept Medicaid", "Medicare covers…") — while
// deliberately NOT matching the "Medicare-certified" / "Certified by Medicare"
// credential or "Medicare … standards" claims (see the sanity check below).
const COVERAGE_MARKETING_PATTERN =
  /covered by medicare|medicare covers|through (texas )?medicaid|medicaid waiver|medicaid,|, medicaid|\bprivate pay\b|medicare advantage|(bill|accept)(s|ed|ing)? (medicare|medicaid)|(covered|coverage) (by|through|under) (medicare|medicaid)/i;

// Credential/standards phrasings that are explicitly allowed and must NOT be
// flagged by the pattern above (sanity-check the regex itself, since it's
// easy to accidentally over-match "Medicare-certified" style strings).
const ALLOWED_CREDENTIAL_PHRASES = [
  "Medicare-certified",
  "Medicare and CHAP standards",
  "federal Medicare standards",
  "Certified by Medicare to deliver skilled nursing, therapy, and home health aide services.",
];

function collectStrings(node: unknown, out: string[] = []): string[] {
  if (typeof node === "string") {
    out.push(node);
  } else if (Array.isArray(node)) {
    for (const item of node) collectStrings(item, out);
  } else if (node && typeof node === "object") {
    for (const value of Object.values(node)) collectStrings(value, out);
  }
  return out;
}

describe("compliance: payer-name marketing copy", () => {
  it("regex sanity check: allowed credential phrases are NOT flagged", () => {
    for (const phrase of ALLOWED_CREDENTIAL_PHRASES) {
      expect(phrase).not.toMatch(COVERAGE_MARKETING_PATTERN);
    }
  });

  it("no string in messages/en.json uses a payer name as a coverage/marketing claim", () => {
    const strings = collectStrings(messages);
    const offenders = strings.filter((s) => COVERAGE_MARKETING_PATTERN.test(s));
    expect(offenders).toEqual([]);
  });

  it("no string in messages/es.json uses a payer name as a coverage/marketing claim", () => {
    const esPath = resolve(__dirname, "../messages/es.json");
    const esMessages = JSON.parse(readFileSync(esPath, "utf-8"));
    const strings = collectStrings(esMessages);
    const offenders = strings.filter((s) => COVERAGE_MARKETING_PATTERN.test(s));
    expect(offenders).toEqual([]);
  });

  it("Medicare-certified credential strings remain present (not collateral damage)", () => {
    const strings = collectStrings(messages);
    expect(strings.some((s) => /medicare-certified/i.test(s))).toBe(true);
  });

  it("no hardcoded component/page copy uses a payer name as a coverage/marketing claim", () => {
    // Scan all component + page source (the sweep hand-fixed hardcoded copy in
    // HowItWorks, ServicesList, etc.) so a future regression anywhere is caught,
    // not just in one file. LeadForm is the functional intake field (excluded).
    const roots = [resolve(__dirname, "../components"), resolve(__dirname, "../app")];
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = resolve(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (
          /\.tsx?$/.test(entry.name) &&
          !/\.test\.tsx?$/.test(entry.name) &&
          entry.name !== "LeadForm.tsx"
        )
          files.push(full);
      }
    };
    for (const root of roots) walk(root);

    const offenders: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, "utf-8");
      if (COVERAGE_MARKETING_PATTERN.test(source)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });
});
