import { Container } from "@/components/ui/Container";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/motion/FadeUp";

/**
 * Careers teaser. A warm, editorial recruiting nudge linking to /careers,
 * framed as an invitation to join the team rather than a generic banner.
 */
export function CareersTeaser() {
  return (
    <Container as="section" className="py-4">
      <FadeUp>
        <div className="relative overflow-hidden rounded-[calc(var(--radius)*2)] bg-card px-8 py-12 shadow-[0_18px_50px_-24px_rgba(94,64,32,0.22)] sm:px-12 sm:py-14 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <Eyebrow>We&rsquo;re Hiring</Eyebrow>
              <h2 className="mt-4 font-display text-2xl leading-tight text-navy sm:text-3xl">
                Build a career where your care is felt
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate">
                Nurses, therapists, and attendants across the Katy area: if
                you believe great care belongs at home, we&rsquo;d love to
                meet you.
              </p>
            </div>
            <div className="shrink-0">
              <Button variant="primary" size="lg" href="/careers">
                Explore careers
              </Button>
            </div>
          </div>
        </div>
      </FadeUp>
    </Container>
  );
}

export default CareersTeaser;
