import { z } from "zod";

/**
 * Shared base fields used by both services and employment lead forms.
 * Honeypot field `website` must be empty — non-empty = bot.
 */
const baseFields = {
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email").max(200),
  message: z.string().trim().max(500).optional().default(""),
  website: z.literal("").describe("Honeypot — must be empty"),
};

export const servicesLeadSchema = z.object({
  type: z.literal("services"),
  ...baseFields,
  careFor: z.enum(["self", "family", "referring"], {
    message: "Please tell us who the care is for",
  }),
  servicesInterested: z
    .array(
      z.enum([
        "skilled-nursing",
        "physical-therapy",
        "occupational-therapy",
        "speech-therapy",
        "medical-social-work",
        "home-health-aide",
        "not-sure",
      ])
    )
    .optional()
    .default([]),
  insurance: z
    .enum(["medicare", "medicaid", "private", "private-pay", "not-sure"])
    .optional(),
  timeline: z.enum(["asap", "2-weeks", "month", "researching"]).optional(),
});

export const employmentLeadSchema = z.object({
  type: z.literal("employment"),
  ...baseFields,
  position: z.enum(["rn", "lvn", "hha", "caregiver", "other"], {
    message: "Please select a position",
  }),
  yearsExperience: z.enum(["lt1", "1-3", "3-5", "5-10", "10plus"], {
    message: "Please select years of experience",
  }),
  license: z.string().trim().max(200).optional().default(""),
});

export const leadSchema = z.discriminatedUnion("type", [
  servicesLeadSchema,
  employmentLeadSchema,
]);

export type ServicesLead = z.infer<typeof servicesLeadSchema>;
export type EmploymentLead = z.infer<typeof employmentLeadSchema>;
export type Lead = z.infer<typeof leadSchema>;
