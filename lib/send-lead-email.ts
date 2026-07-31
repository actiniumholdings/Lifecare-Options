import { Resend } from "resend";
import type { Lead } from "./lead-schema";

// mylifecareoptions.com is verified in Resend, and RESEND_FROM is set in Vercel
// production to "Lifecare Options <no-reply@mylifecareoptions.com>". The sandbox
// sender remains as a local/preview fallback only — it can deliver to the Resend
// account address and nowhere else, so it is not viable in production.
const FROM_ADDRESS =
  process.env.RESEND_FROM ??
  "Lifecare Options <onboarding@resend.dev>";

// Where submitted forms land. Not in site-config.ts on purpose: that file is
// public-facing display copy, and this is internal routing to the parent company.
// Both recipients are on the To line, so replies from either are visible to both.
const LEAD_DESTINATION = [
  "lc@actiniumholdings.com",
  "clint.ives@actiniumholdings.com",
];

function formatBody(lead: Lead): string {
  const lines: string[] = [];
  lines.push(`Type: ${lead.type}`);
  lines.push(`Name: ${lead.name}`);
  lines.push(`Phone: ${lead.phone}`);
  lines.push(`Email: ${lead.email}`);

  if (lead.type === "services") {
    lines.push(`Care for: ${lead.careFor}`);
    if (lead.servicesInterested && lead.servicesInterested.length > 0) {
      lines.push(`Services interested: ${lead.servicesInterested.join(", ")}`);
    }
    if (lead.insurance) lines.push(`Insurance: ${lead.insurance}`);
    if (lead.timeline) lines.push(`Timeline: ${lead.timeline}`);
  } else {
    lines.push(`Position: ${lead.position}`);
    lines.push(`Years of experience: ${lead.yearsExperience}`);
    if (lead.license) lines.push(`License / certification: ${lead.license}`);
  }

  if (lead.message) {
    lines.push("");
    lines.push("Message:");
    lines.push(lead.message);
  }

  return lines.join("\n");
}

export async function sendLeadEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  const resend = new Resend(apiKey);

  const label = lead.type === "services" ? "Service Inquiry" : "Job Request";
  const subject = `${label} - ${lead.name}`;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: LEAD_DESTINATION,
    replyTo: lead.email,
    subject,
    text: formatBody(lead),
  });

  if (error) {
    throw new Error(`Resend failed: ${error.message}`);
  }
}
