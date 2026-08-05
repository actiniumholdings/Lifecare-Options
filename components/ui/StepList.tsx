export interface Step {
  title: string;
  body: string;
}

/**
 * Numbered 1-2-3 flow (spec §6: "When you call" / "how care starts").
 * Semantic <ol>; connector line between circles on desktop.
 */
export function StepList({
  steps,
  tone = "light",
}: {
  steps: Step[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <ol className="grid gap-10 sm:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 font-display text-lg font-semibold ${
              dark
                ? "border-peach/60 text-peach"
                : "border-blue-deep/40 text-blue-deep"
            }`}
          >
            {i + 1}
          </span>
          <h3
            className={`mt-4 font-display text-xl font-semibold ${
              dark ? "text-white" : "text-navy"
            }`}
          >
            {step.title}
          </h3>
          <p className={`mt-2 leading-relaxed ${dark ? "text-white/75" : "text-slate"}`}>
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
