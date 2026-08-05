"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  servicesLeadSchema,
  employmentLeadSchema,
  type ServicesLead,
  type EmploymentLead,
} from "@/lib/lead-schema";
import { Button } from "./Button";

// Use input types (pre-default-applied) for useForm generics since
// react-hook-form’s resolver signature requires field alignment between
// the form’s internal values and the resolver’s declared input.
type ServicesLeadInput = z.input<typeof servicesLeadSchema>;
type EmploymentLeadInput = z.input<typeof employmentLeadSchema>;

type Tab = "services" | "employment";

const SERVICE_OPTIONS = [
  { value: "skilled-nursing", label: "Skilled Nursing" },
  { value: "physical-therapy", label: "Physical Therapy" },
  { value: "occupational-therapy", label: "Occupational Therapy" },
  { value: "speech-therapy", label: "Speech Therapy" },
  { value: "medical-social-work", label: "Medical Social Work" },
  { value: "home-health-aide", label: "Home Health Aide" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

const inputClass =
  "w-full rounded-lg border border-border bg-surface-warm/60 px-4 py-3 text-base text-navy placeholder:text-slate/60 focus:outline-none focus:border-navy focus:bg-surface-warm";
const labelClass = "block text-sm font-semibold text-navy mb-1.5";
const errorClass = "mt-1 text-xs text-alert";

export function LeadForm({
  defaultTab = "services",
}: {
  /** Which tab opens first: services (contact page) or employment (careers). */
  defaultTab?: Tab;
} = {}) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "ok" | "error"
  >("idle");

  if (submitState === "ok") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-8 text-center shadow-[0_1px_0_rgba(15,43,71,0.08),_0_4px_16px_rgba(15,43,71,0.06)] md:p-12">
          <h3 className="text-2xl">Thanks. We got it.</h3>
          <p className="text-slate mt-3 text-sm">
            {tab === "services"
              ? "Our intake team will reach out within 1 business day."
              : "We’ll review your application and be in touch within 2 business days."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg bg-white p-6 shadow-[0_1px_0_rgba(15,43,71,0.08),_0_4px_16px_rgba(15,43,71,0.06)] md:p-8">
        <div
          role="tablist"
          aria-label="Form type"
          className="inline-flex rounded-full bg-surface-warm p-1 mb-6"
        >
          <button
            role="tab"
            aria-selected={tab === "services"}
            onClick={() => setTab("services")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              tab === "services"
                ? "bg-navy text-white"
                : "bg-transparent text-navy/70 hover:text-navy"
            }`}
          >
            Services inquiry
          </button>
          <button
            role="tab"
            aria-selected={tab === "employment"}
            onClick={() => setTab("employment")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              tab === "employment"
                ? "bg-navy text-white"
                : "bg-transparent text-navy/70 hover:text-navy"
            }`}
          >
            Work with us
          </button>
        </div>

        <div>
          {tab === "services" ? (
            <ServicesFormFields
              onSuccess={() => setSubmitState("ok")}
              onError={() => setSubmitState("error")}
              onSubmitting={() => setSubmitState("submitting")}
              isSubmitting={submitState === "submitting"}
            />
          ) : (
            <EmploymentFormFields
              onSuccess={() => setSubmitState("ok")}
              onError={() => setSubmitState("error")}
              onSubmitting={() => setSubmitState("submitting")}
              isSubmitting={submitState === "submitting"}
            />
          )}
          {submitState === "error" && (
            <p className="text-alert mt-3 text-sm">
              Something went wrong. Please try again or call (281) 646-9546.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type FormHandlers = {
  onSuccess: () => void;
  onError: () => void;
  onSubmitting: () => void;
  isSubmitting: boolean;
};

function ServicesFormFields({
  onSuccess,
  onError,
  onSubmitting,
  isSubmitting,
}: FormHandlers) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServicesLeadInput, unknown, ServicesLead>({
    resolver: zodResolver(servicesLeadSchema),
    defaultValues: { type: "services", website: "", servicesInterested: [] },
  });

  const onSubmit = async (data: ServicesLead) => {
    onSubmitting();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      onError();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="hidden" {...register("type")} />
      {/* Honeypot — must remain empty */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="svc-name" className={labelClass}>
          Full name *
        </label>
        <input
          id="svc-name"
          type="text"
          className={inputClass}
          {...register("name")}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="svc-phone" className={labelClass}>
            Phone *
          </label>
          <input
            id="svc-phone"
            type="tel"
            className={inputClass}
            {...register("phone")}
          />
          {errors.phone && (
            <p className={errorClass}>{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="svc-email" className={labelClass}>
            Email *
          </label>
          <input
            id="svc-email"
            type="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Who is the care for? *</legend>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <input
              id="svc-careFor-self"
              type="radio"
              value="self"
              {...register("careFor")}
            />
            <label htmlFor="svc-careFor-self">Myself</label>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <input
              id="svc-careFor-family"
              type="radio"
              value="family"
              {...register("careFor")}
            />
            <label htmlFor="svc-careFor-family">Family member</label>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <input
              id="svc-careFor-referring"
              type="radio"
              value="referring"
              {...register("careFor")}
            />
            <label htmlFor="svc-careFor-referring">
              Patient I&apos;m referring
            </label>
          </div>
        </div>
        {errors.careFor && (
          <p className={errorClass}>{errors.careFor.message}</p>
        )}
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Services of interest</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {SERVICE_OPTIONS.map((s) => {
            const id = `svc-interest-${s.value}`;
            return (
              <div key={s.value} className="flex items-center gap-2 text-sm">
                <input
                  id={id}
                  type="checkbox"
                  value={s.value}
                  {...register("servicesInterested")}
                />
                <label htmlFor={id}>{s.label}</label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="svc-insurance" className={labelClass}>
            Insurance
          </label>
          <select
            id="svc-insurance"
            className={inputClass}
            {...register("insurance")}
          >
            <option value="">Select…</option>
            <option value="medicare">Medicare</option>
            <option value="medicaid">Medicaid</option>
            <option value="private">Private insurance</option>
            <option value="private-pay">Private pay</option>
            <option value="not-sure">Not sure</option>
          </select>
        </div>
        <div>
          <label htmlFor="svc-timeline" className={labelClass}>
            Timeline
          </label>
          <select
            id="svc-timeline"
            className={inputClass}
            {...register("timeline")}
          >
            <option value="">Select…</option>
            <option value="asap">ASAP</option>
            <option value="2-weeks">Within 2 weeks</option>
            <option value="month">Within a month</option>
            <option value="researching">Just researching</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="svc-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="svc-message"
          rows={4}
          maxLength={500}
          className={inputClass}
          {...register("message")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? "Sending…" : "Request info →"}
      </Button>
    </form>
  );
}

function EmploymentFormFields({
  onSuccess,
  onError,
  onSubmitting,
  isSubmitting,
}: FormHandlers) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmploymentLeadInput, unknown, EmploymentLead>({
    resolver: zodResolver(employmentLeadSchema),
    defaultValues: { type: "employment", website: "" },
  });

  const onSubmit = async (data: EmploymentLead) => {
    onSubmitting();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      onError();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="hidden" {...register("type")} />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="emp-name" className={labelClass}>
          Full name *
        </label>
        <input
          id="emp-name"
          type="text"
          className={inputClass}
          {...register("name")}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="emp-phone" className={labelClass}>
            Phone *
          </label>
          <input
            id="emp-phone"
            type="tel"
            className={inputClass}
            {...register("phone")}
          />
          {errors.phone && (
            <p className={errorClass}>{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="emp-email" className={labelClass}>
            Email *
          </label>
          <input
            id="emp-email"
            type="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="emp-position" className={labelClass}>
            Position *
          </label>
          <select
            id="emp-position"
            className={inputClass}
            {...register("position")}
          >
            <option value="">Select…</option>
            <option value="rn">Registered Nurse (RN)</option>
            <option value="lvn">Licensed Vocational Nurse (LVN)</option>
            <option value="hha">Home Health Aide (HHA)</option>
            <option value="caregiver">Caregiver</option>
            <option value="other">Other</option>
          </select>
          {errors.position && (
            <p className={errorClass}>{errors.position.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="emp-years" className={labelClass}>
            Years of experience *
          </label>
          <select
            id="emp-years"
            className={inputClass}
            {...register("yearsExperience")}
          >
            <option value="">Select…</option>
            <option value="lt1">Less than 1 year</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10plus">10+ years</option>
          </select>
          {errors.yearsExperience && (
            <p className={errorClass}>{errors.yearsExperience.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="emp-license" className={labelClass}>
          Texas license / certification
        </label>
        <input
          id="emp-license"
          type="text"
          placeholder="e.g. RN license #12345"
          className={inputClass}
          {...register("license")}
        />
      </div>

      <div>
        <label htmlFor="emp-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="emp-message"
          rows={4}
          maxLength={500}
          className={inputClass}
          {...register("message")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? "Sending…" : "Submit inquiry →"}
      </Button>
    </form>
  );
}
