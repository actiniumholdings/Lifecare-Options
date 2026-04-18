import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { sendLeadEmail } from "@/lib/send-lead-email";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Honeypot: if the "website" field is non-empty, it's a bot.
  // Return 200 so bots don't learn they were detected.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof (body as { website: unknown }).website === "string" &&
    (body as { website: string }).website.length > 0
  ) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  try {
    await sendLeadEmail(parsed.data);
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Email delivery failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
