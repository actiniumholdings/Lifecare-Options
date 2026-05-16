"use client";

import { motion } from "motion/react";
import { Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { TrustBadge } from "@/components/TrustBadge";
import { TrustSentence } from "@/components/TrustSentence";
import { ServicesList } from "@/components/ServicesList";
import { LeadForm } from "@/components/LeadForm";
import { HeroIllustration } from "@/components/HeroIllustration";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { StaggerWords } from "@/components/motion/StaggerWords";
import { easeOut, softSpring } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { siteConfig } from "@/lib/site-config";

function Hero() {
  const reduced = useReducedMotionSafe();
  const ifMotion = <T,>(animated: T, still: T): T => (reduced ? still : animated);

  return (
    <section className="px-4 py-12 md:px-6 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div
            className="text-[10px] font-semibold tracking-[0.18em] uppercase text-navy/65"
            initial={ifMotion({ opacity: 0 }, { opacity: 1 })}
            animate={{ opacity: 1 }}
            transition={{ ...easeOut, duration: 0.4, delay: 0 }}
          >
            Home Health · Katy, TX
          </motion.div>

          <StaggerWords
            as="h1"
            className="mt-3"
            text={["Quality care,", "felt at home."]}
            trigger="load"
            delay={100}
          />

          <motion.p
            className="text-slate mt-5 max-w-xl text-lg leading-relaxed"
            initial={ifMotion({ opacity: 0, y: 12 }, { opacity: 1, y: 0 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOut, duration: 0.5, delay: 0.25 }}
          >
            Medicare-certified skilled nursing, therapy, and personal care,
            delivered across Katy, Fort Bend, and Harris counties since{" "}
            {siteConfig.foundedYear}.
          </motion.p>

          <div className="mt-7 flex flex-wrap gap-3">
            <motion.div
              initial={ifMotion({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: 0.4 }}
            >
              <Button href={siteConfig.phoneHref} size="lg">
                <Phone size={16} />
                Call {siteConfig.phone}
              </Button>
            </motion.div>
            <motion.div
              initial={ifMotion({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: 0.48 }}
            >
              <Button variant="secondary" size="lg" href="#contact">
                Request info ↓
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="aspect-[1024/572] overflow-hidden rounded-lg"
          initial={ifMotion({ opacity: 0 }, { opacity: 1 })}
          animate={{ opacity: 1 }}
          transition={{ ...easeOut, duration: 0.8, delay: 0.2 }}
        >
          <HeroIllustration className="h-full w-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Editorial trust pull-quote (replaces former trust strip) */}
      <TrustSentence />

      {/* 3. About band */}
      <section className="px-4 py-16 md:px-6 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <StaggerWords
              as="h2"
              className=""
              text="Serving Katy families since 2008."
            />
            <FadeUp delay={120}>
              <p className="text-slate mt-5 text-base leading-relaxed">
                Lifecare Options has served Katy families since 2008. We&apos;re
                a CHAP-accredited, Medicare-certified home health agency,
                locally owned and small enough to know your name. Our clinicians
                bring skilled care into the home, where healing is most natural,
                and we&apos;re on-call 24/7 for whatever comes next.
              </p>
            </FadeUp>
          </div>
          <Stagger className="flex flex-wrap gap-2">
            <StaggerItem>
              <TrustBadge>Medicare-certified</TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>{siteConfig.accreditation}</TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>
                Serving Katy since {siteConfig.foundedYear}
              </TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>24/7 on-call</TrustBadge>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* 4. Services — numbered editorial list */}
      <ServicesList />

      {/* 5. Contact / Lead form */}
      <section id="contact" className="px-4 py-16 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <StaggerWords as="h2" className="" text="Get in touch." />
            <p className="text-slate mt-3">
              Or call us directly:{" "}
              <a
                href={siteConfig.phoneHref}
                className="font-semibold text-navy hover:text-care-blue"
              >
                {siteConfig.phone}
              </a>
              , answered 24/7.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
