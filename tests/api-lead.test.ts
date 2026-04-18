import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/send-lead-email", () => ({
  sendLeadEmail: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "@/app/api/lead/route";
import { sendLeadEmail } from "@/lib/send-lead-email";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/lead", () => {
  beforeEach(() => {
    vi.mocked(sendLeadEmail).mockClear();
    vi.mocked(sendLeadEmail).mockResolvedValue(undefined);
  });

  it("returns 200 and sends email for a valid services submission", async () => {
    const res = await POST(
      makeRequest({
        type: "services",
        name: "Jane",
        phone: "2815550100",
        email: "jane@example.com",
        careFor: "self",
        website: "",
      })
    );
    expect(res.status).toBe(200);
    expect(sendLeadEmail).toHaveBeenCalledOnce();
  });

  it("returns 200 for a valid employment submission", async () => {
    const res = await POST(
      makeRequest({
        type: "employment",
        name: "Maria",
        phone: "2815550200",
        email: "maria@example.com",
        position: "rn",
        yearsExperience: "5-10",
        website: "",
      })
    );
    expect(res.status).toBe(200);
    expect(sendLeadEmail).toHaveBeenCalledOnce();
  });

  it("returns 400 for invalid submission", async () => {
    const res = await POST(
      makeRequest({
        type: "services",
        name: "",
        phone: "",
        email: "",
        website: "",
      })
    );
    expect(res.status).toBe(400);
    expect(sendLeadEmail).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without sending email", async () => {
    const res = await POST(
      makeRequest({
        type: "services",
        name: "Bot",
        phone: "2815550100",
        email: "bot@bot.com",
        careFor: "self",
        website: "http://spam.com",
      })
    );
    expect(res.status).toBe(200); // Return 200 so bots don't know they're caught
    expect(sendLeadEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON body", async () => {
    const res = await POST(
      new Request("http://localhost/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not-json",
      })
    );
    expect(res.status).toBe(400);
    expect(sendLeadEmail).not.toHaveBeenCalled();
  });

  it("returns 500 if email delivery fails", async () => {
    vi.mocked(sendLeadEmail).mockRejectedValueOnce(new Error("resend down"));
    const res = await POST(
      makeRequest({
        type: "services",
        name: "Jane",
        phone: "2815550100",
        email: "jane@example.com",
        careFor: "self",
        website: "",
      })
    );
    expect(res.status).toBe(500);
  });
});
