import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "./Logo";
import { Container } from "./ui/Container";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const t = useTranslations("common");
  const tf = useTranslations("footer");
  const tn = useTranslations("nav");
  const year = new Date().getFullYear();

  const links = [
    { href: "/services", label: tn("services") },
    { href: "/service-area", label: tn("serviceArea") },
    { href: "/about", label: tn("about") },
    { href: "/careers", label: tn("careers") },
    { href: "/contact", label: tn("contact") },
  ];

  return (
    <footer className="bg-navy-deep text-white">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-16">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Logo size="md" inverse />
            <p className="max-w-[32ch] text-sm leading-relaxed text-white/70">
              Compassionate, professional home health serving Katy and the
              surrounding Harris &amp; Fort Bend communities since{" "}
              {siteConfig.foundedYear}.
            </p>
            <p className="text-xs font-medium uppercase tracking-widest text-blue-light">
              Serving Harris &amp; Fort Bend Counties
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-light">
              Contact
            </h3>
            <div>
              <Link
                href={siteConfig.phoneHref}
                className="rounded-sm font-display text-2xl font-semibold tabular-nums text-white outline-none transition-colors hover:text-blue-light focus-visible:ring-2 focus-visible:ring-blue-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
              >
                {siteConfig.phone}
              </Link>
              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/55">
                {tf("alwaysAnswered")}
              </p>
            </div>
            <address className="space-y-1 text-sm not-italic leading-relaxed text-white/80">
              <div>{siteConfig.address.street}</div>
              <div>
                {siteConfig.address.city}, {siteConfig.address.state}{" "}
                {siteConfig.address.zip}
              </div>
              <div className="text-white/60">Fax: {siteConfig.fax}</div>
            </address>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-light">
                {tf("hours")}
              </p>
              <ul className="space-y-0.5 text-sm text-white/80">
                {siteConfig.hours.map((h) => (
                  <li key={h.days}>
                    <span className="text-white/60">{h.days}:</span> {h.time}
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-sm text-white/70">{siteConfig.onCall}</p>
            </div>
          </div>

          {/* Column 3: Quick links + accreditation */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-light">
                Quick Links
              </h3>
              <nav aria-label="Footer navigation">
                <ul className="space-y-3">
                  {links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="rounded-sm text-sm text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-blue-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/refer"
                      className="rounded-sm text-sm font-medium text-blue-light outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-blue-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
                    >
                      {tn("refer")}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="space-y-1 text-sm text-white/70">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-light">
                {tf("accreditation")}
              </p>
              <p>{tf("medicareCertified")}</p>
              <p>{siteConfig.accreditation}</p>
              {siteConfig.medicareCcn && (
                <p className="text-white/55">CCN: {siteConfig.medicareCcn}</p>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container className="py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/60">
              &copy; {year} {t("siteName")}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
              <Link
                href="/accessibility"
                className="rounded-sm outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-blue-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
              >
                Accessibility
              </Link>
              {siteConfig.stateLicense && (
                <span>Texas License&nbsp;{siteConfig.stateLicense}</span>
              )}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
