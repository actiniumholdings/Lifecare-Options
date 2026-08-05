import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";

function Icon({ path }: { path: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-care-blue"
    >
      {path.split("||").map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

const REASONS: { title: string; body: string; icon: string }[] = [
  {
    title: "One coordinated team",
    body: "Skilled nursing, therapy, and personal support under one plan of care, so you never have to juggle providers as needs change.",
    icon: "M3 21h18||M5 21V7l8-4v18||M19 21V11l-6-4||M9 9v.01||M9 12v.01||M9 15v.01",
  },
  {
    title: "Licensed & CHAP-accredited",
    body: "State-licensed, CHAP-accredited professionals, supervised and coordinated. Care you can verify and trust.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z||M9 12l2 2 4-4",
  },
  {
    title: "Coordinated with your doctor",
    body: "We work directly with physicians and families, keeping everyone aligned on one plan of care.",
    icon: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2||M9 2h6v4H9z||M12 11v6||M9 14h6",
  },
  {
    title: "Katy, through and through",
    body: "A local team that knows Katy, Fort Bend, and West Houston — responsive and close to the families we serve.",
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z||M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },
];

/**
 * Premium navy "Why Lifecare" band — four differentiator cards with restrained
 * blue-iconed framing. Translucent surfaces on navy keep the dark drama while
 * giving each card a distinct, tactile edge.
 */
export function WhyLifecare() {
  return (
    <section className="relative overflow-hidden bg-navy-deep text-white">
      {/* Faded photographic backdrop (replaces the old logo watermark). */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/images/attendant-daily.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/50 via-transparent to-navy-deep/60" />
      </div>
      <Container className="relative py-20 sm:py-28 lg:py-32">
        <FadeUp>
          <header className="max-w-2xl">
            <Eyebrow tone="dark">Why Lifecare</Eyebrow>
            <h2 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
              Premium care, without the runaround
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              The reasons families and discharge planners across the Katy area
              choose us, and stay with us.
            </p>
          </header>
        </FadeUp>

        <Stagger
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
          stagger={0.1}
        >
          {REASONS.map((r) => (
            <FadeUp as="article" key={r.title} className="h-full">
              <div className="group flex h-full flex-col rounded-[var(--radius)] border border-white/10 bg-white/[0.04] p-7 transition-[transform,background-color,border-color] duration-300 hover:-translate-y-1 hover:border-care-blue/30 hover:bg-white/[0.06]">
                <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] border border-care-blue/25 bg-care-blue/[0.08]">
                  <Icon path={r.icon} />
                </span>
                <h3 className="mt-5 font-display text-lg leading-snug text-white">
                  {r.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/70">
                  {r.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export default WhyLifecare;
