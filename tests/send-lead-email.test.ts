import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Lead } from "@/lib/lead-schema";
import { sendLeadEmail } from "@/lib/send-lead-email";

const mockSend = vi.fn();

vi.mock("resend", () => ({
  // Class-based mock — vi.fn() with arrow-fn mockImplementation isn't
  // reliably callable with `new` after mockReset().
  Resend: class {
    emails = { send: mockSend };
  },
}));

describe("sendLeadEmail", () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockSend.mockResolvedValue({ data: { id: "abc" }, error: null });
    process.env.RESEND_API_KEY = "test-key";
  });

  it("sends a Services email with [Services] subject prefix", async () => {
    const lead: Lead = {
      type: "services",
      name: "Jane",
      phone: "2815550100",
      email: "jane@example.com",
      careFor: "family",
      servicesInterested: [],
      message: "",
      website: "",
    };
    await sendLeadEmail(lead);
    expect(mockSend).toHaveBeenCalledOnce();
    const args = mockSend.mock.calls[0]?.[0];
    expect(args?.subject).toMatch(/^\[Services\]/);
    expect(args?.subject).toContain("Jane");
  });

  it("sends an Employment email with [Employment] subject prefix", async () => {
    const lead: Lead = {
      type: "employment",
      name: "Maria",
      phone: "2815550200",
      email: "maria@example.com",
      position: "rn",
      yearsExperience: "5-10",
      license: "",
      message: "",
      website: "",
    };
    await sendLeadEmail(lead);
    const args = mockSend.mock.calls[0]?.[0];
    expect(args?.subject).toMatch(/^\[Employment\]/);
  });

  it("includes the full payload in the email body", async () => {
    const lead: Lead = {
      type: "services",
      name: "Jane",
      phone: "2815550100",
      email: "jane@example.com",
      careFor: "self",
      servicesInterested: ["skilled-nursing"],
      insurance: "medicare",
      timeline: "asap",
      message: "Need help.",
      website: "",
    };
    await sendLeadEmail(lead);
    const body = mockSend.mock.calls[0]?.[0]?.text;
    expect(body).toContain("skilled-nursing");
    expect(body).toContain("medicare");
    expect(body).toContain("asap");
    expect(body).toContain("Need help.");
  });

  it("routes email to intake@mylifecareoptions.com with user's email as reply-to", async () => {
    const lead: Lead = {
      type: "services",
      name: "Jane",
      phone: "2815550100",
      email: "jane@example.com",
      careFor: "self",
      servicesInterested: [],
      message: "",
      website: "",
    };
    await sendLeadEmail(lead);
    const args = mockSend.mock.calls[0]?.[0];
    expect(args?.to).toBe("intake@mylifecareoptions.com");
    expect(args?.replyTo).toBe("jane@example.com");
  });

  it("throws if RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const lead: Lead = {
      type: "services",
      name: "Jane",
      phone: "2815550100",
      email: "jane@example.com",
      careFor: "self",
      servicesInterested: [],
      message: "",
      website: "",
    };
    await expect(sendLeadEmail(lead)).rejects.toThrow(/RESEND_API_KEY/);
  });
});
