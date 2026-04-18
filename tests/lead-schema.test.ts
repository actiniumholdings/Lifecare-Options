import { describe, it, expect } from "vitest";
import {
  servicesLeadSchema,
  employmentLeadSchema,
  leadSchema,
} from "@/lib/lead-schema";

describe("servicesLeadSchema", () => {
  it("accepts a valid submission", () => {
    const result = servicesLeadSchema.safeParse({
      type: "services",
      name: "Jane Doe",
      phone: "(281) 555-0100",
      email: "jane@example.com",
      careFor: "family",
      servicesInterested: ["skilled-nursing", "physical-therapy"],
      insurance: "medicare",
      timeline: "asap",
      message: "Need help with my mom after her hip surgery.",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = servicesLeadSchema.safeParse({
      type: "services",
      name: "",
      phone: "",
      email: "",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects bad email format", () => {
    const result = servicesLeadSchema.safeParse({
      type: "services",
      name: "Jane Doe",
      phone: "2815550100",
      email: "not-an-email",
      careFor: "self",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when honeypot website field is filled", () => {
    const result = servicesLeadSchema.safeParse({
      type: "services",
      name: "Bot Name",
      phone: "2815550100",
      email: "bot@bot.com",
      careFor: "self",
      website: "http://spam.com",
    });
    expect(result.success).toBe(false);
  });
});

describe("employmentLeadSchema", () => {
  it("accepts a valid submission", () => {
    const result = employmentLeadSchema.safeParse({
      type: "employment",
      name: "Maria Lopez",
      phone: "(281) 555-0200",
      email: "maria@example.com",
      position: "rn",
      yearsExperience: "5-10",
      license: "RN license #12345",
      message: "Available weekends.",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required position", () => {
    const result = employmentLeadSchema.safeParse({
      type: "employment",
      name: "Maria Lopez",
      phone: "2815550200",
      email: "maria@example.com",
      website: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("leadSchema (discriminated union)", () => {
  it("routes by type: services", () => {
    const services = leadSchema.safeParse({
      type: "services",
      name: "Alice Doe",
      phone: "2815550100",
      email: "a@a.com",
      careFor: "self",
      website: "",
    });
    expect(services.success).toBe(true);
  });

  it("routes by type: employment", () => {
    const employment = leadSchema.safeParse({
      type: "employment",
      name: "Bob Smith",
      phone: "2815550100",
      email: "b@b.com",
      position: "hha",
      yearsExperience: "1-3",
      website: "",
    });
    expect(employment.success).toBe(true);
  });
});
