import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
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

// Matches payer-names used as a coverage/marketing claim.
const COVERAGE_MARKETING_PATTERN =
  /covered by medicare|through (texas )?medicaid|medicaid,|, medicaid|\bprivate pay\b|medicare advantage/i;

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

  it("home HowItWorks component names no payer program (Medicaid / private pay)", () => {
    const source = readFileSync(
      resolve(__dirname, "../components/home/HowItWorks.tsx"),
      "utf-8",
    );
    expect(source).not.toMatch(/medicaid/i);
    expect(source).not.toMatch(/private pay/i);
  });
});
