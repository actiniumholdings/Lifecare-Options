import { services } from "@/lib/site-config";
import { Eyebrow } from "./Eyebrow";

/**
 * Numbered editorial cards on the warm band. Remote Patient Monitoring is
 * pulled out as a "Now offering" feature above the grid — it keeps the
 * announcement bar honest and leaves the six standard disciplines to fill
 * two clean rows of three.
 */
export function ServicesGrid() {
  const featured = services.find((s) => s.name === "Remote Patient Monitoring");
  const standard = services.filter(
    (s) => s.name !== "Remote Patient Monitoring"
  );

  return (
    <section
      id="services"
      className="bg-peach relative overflow-hidden px-4 py-16 md:px-6 md:py-26"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[56rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-white/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow flanked>Our services</Eyebrow>
          <h2 className="mt-4">
            Seven disciplines,{" "}
            <em className="text-care-blue font-normal italic">
              one coordinated plan.
            </em>
          </h2>
          <p className="text-slate mt-4 leading-relaxed">
            Physician-ordered home health covered by Medicare. Our team works
            together around your care plan, with no handoff gaps.
          </p>
        </div>

        {featured && (
          <div className="border-borderline mb-4 rounded-2xl border bg-white p-6 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
              <div className="text-alert-red text-[0.6875rem] font-semibold tracking-[0.18em] whitespace-nowrap uppercase">
                Now offering
              </div>
              <div className="flex-1">
                <div className="font-display text-2xl md:text-3xl">
                  {featured.name}
                </div>
                <p className="text-slate mt-2 leading-relaxed">
                  {featured.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {standard.map((service, idx) => (
            <div
              key={service.name}
              className="group border-borderline hover:border-care-blue relative overflow-hidden rounded-2xl border bg-white px-7 pt-8 pb-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-20px_rgba(15,43,71,0.22)] motion-reduce:hover:translate-y-0"
            >
              <span
                aria-hidden
                className="font-display group-hover:text-care-blue/20 pointer-events-none absolute -top-4 right-3 text-[5.75rem] leading-none text-navy/[0.06] transition-colors duration-300"
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="relative">{service.name}</h3>
              <p className="text-slate relative mt-2.5 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
