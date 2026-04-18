import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TrustBadge } from "@/components/TrustBadge";
import { LeadForm } from "@/components/LeadForm";
import { siteConfig, services } from "@/lib/site-config";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="text-care-blue text-xs font-semibold tracking-[0.1em] uppercase">
              Home Health · Katy, TX
            </div>
            <h1 className="mt-3 text-5xl leading-[1.05] md:text-6xl">
              Quality care,
              <br />
              felt at home.
            </h1>
            <p className="text-slate mt-5 max-w-xl text-lg leading-relaxed">
              Medicare-certified skilled nursing, therapy, and personal care —
              delivered across Katy, Fort Bend, and Harris counties since{" "}
              {siteConfig.foundedYear}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="#contact" size="lg">
                Request info →
              </Button>
              <Button variant="secondary" size="lg" href={siteConfig.phoneHref}>
                Call {siteConfig.phone}
              </Button>
            </div>
          </div>
          <div
            className="from-borderline to-peach-cream aspect-[4/3] rounded-2xl bg-gradient-to-br"
            aria-hidden
          />
        </div>
      </section>

      {/* 2. Trust strip */}
      <section className="border-borderline bg-mist border-y px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <div className="font-display text-xl">Medicare-certified</div>
            <div className="text-slate text-xs">
              + {siteConfig.accreditation}
            </div>
          </div>
          <div>
            <div className="font-display text-xl">
              Serving Katy since {siteConfig.foundedYear}
            </div>
            <div className="text-slate text-xs">Locally owned</div>
          </div>
          <div>
            <div className="font-display text-xl">24/7 on-call nursing</div>
            <div className="text-slate text-xs">Always reachable</div>
          </div>
        </div>
      </section>

      {/* 3. About band */}
      <section className="px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-4xl leading-[1.1]">
              Serving Katy families since 2008.
            </h2>
            <p className="text-slate mt-5 text-base leading-relaxed">
              Lifecare Options has served Katy families since 2008. We&apos;re
              a CHAP-accredited, Medicare-certified home health agency, locally
              owned and small enough to know your name. Our clinicians bring
              skilled care into the home — where healing is most natural — and
              we&apos;re on-call 24/7 for whatever comes next.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <TrustBadge>Medicare-certified</TrustBadge>
            <TrustBadge>{siteConfig.accreditation}</TrustBadge>
            <TrustBadge>
              Serving Katy since {siteConfig.foundedYear}
            </TrustBadge>
            <TrustBadge>24/7 on-call</TrustBadge>
          </div>
        </div>
      </section>

      {/* 4. Services at a glance */}
      <section className="bg-mist px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="text-care-blue text-xs font-semibold tracking-[0.1em] uppercase">
              Our services
            </div>
            <h2 className="mt-2 text-4xl leading-[1.1]">
              Six disciplines, one coordinated plan
            </h2>
            <p className="text-slate mt-3 text-base">
              Physician-ordered home health covered by Medicare. Our team works
              together around your care plan — no handoff gaps.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {services.map((s, i) => {
              const variant =
                i % 3 === 0 ? "peach" : i % 3 === 1 ? "white" : "mist";
              return (
                <Card key={s.name} variant={variant}>
                  <div className="font-display text-xl">{s.name}</div>
                  <div className="text-slate mt-2 text-sm">{s.description}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Contact / Lead form */}
      <section id="contact" className="bg-white px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-4xl">Get in touch</h2>
            <p className="text-slate mt-3">
              Fill out the form below and our team will reach out within 1
              business day.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
