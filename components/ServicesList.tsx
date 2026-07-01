import { services } from "@/lib/site-config";

/**
 * Numbered editorial list of disciplines. RPM sits on top as a small
 * "Now offering" ribbon; the six standard disciplines render as a
 * two-column numbered list with hairline rules between rows. Replaces
 * the previous icon-card grid.
 */
export function ServicesList() {
  const featured = services.find((s) => s.name === "Remote Patient Monitoring");
  const standard = services.filter(
    (s) => s.name !== "Remote Patient Monitoring",
  );

  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-navy/60">
            Our services
          </div>
          <h2 className="mt-2">
            <em>Seven</em> disciplines, one coordinated plan.
          </h2>
          <p className="mt-3 text-slate">
            Physician-ordered home health covered by Medicare. Our team works
            together around your care plan, with no handoff gaps.
          </p>
        </div>

        {featured && (
          <div className="mb-10 rounded-lg border border-border bg-white p-6 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-6">
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-alert">
                Now offering
              </div>
              <div className="flex-1">
                <div className="font-display text-2xl italic md:text-3xl">
                  {featured.name}
                </div>
                <div className="mt-2 text-base text-slate md:text-lg">
                  {featured.description}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-x-12 gap-y-0 md:grid-cols-2">
          {standard.map((service, idx) => {
            const numeral = String(idx + 1).padStart(2, "0");
            return (
              <div
                key={service.name}
                className="flex items-baseline gap-5 border-b border-navy/[0.12] py-5"
              >
                <span className="font-display text-3xl font-medium text-care-blue tabular-nums">
                  {numeral}
                </span>
                <div>
                  <div className="font-display text-xl font-medium">
                    {service.name}
                  </div>
                  <div className="mt-1 text-sm text-slate">
                    {service.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
