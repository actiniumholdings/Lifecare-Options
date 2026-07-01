import Link from "next/link";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-navy text-cream/65">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Contact — phone gets visual weight */}
          <div>
            <Logo size="md" inverse />
            <div className="mt-5 text-cream">
              <Link
                href={siteConfig.phoneHref}
                className="font-display text-3xl font-medium leading-none hover:text-cream md:text-4xl"
              >
                {siteConfig.phone}
              </Link>
              <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-cream/65">
                Always answered
              </div>
            </div>
            <div className="mt-5 space-y-1 text-sm leading-relaxed">
              <div>{siteConfig.address.street}</div>
              <div>
                {siteConfig.address.city}, {siteConfig.address.state}{" "}
                {siteConfig.address.zip}
              </div>
              <div>Fax: {siteConfig.fax}</div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <div className="mb-3 text-xs font-semibold tracking-wider text-cream uppercase">
              Hours
            </div>
            <ul className="space-y-1 text-sm">
              {siteConfig.hours.map((h) => (
                <li key={h.days}>
                  <span className="text-cream">{h.days}:</span>{" "}
                  <span className="italic">{h.time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-sm text-cream">
              {siteConfig.onCall}
            </div>
          </div>

          {/* Accreditation */}
          <div>
            <div className="mb-3 text-xs font-semibold tracking-wider text-cream uppercase">
              Accreditation
            </div>
            <div className="space-y-1 text-sm">
              <div>Medicare-certified</div>
              <div>{siteConfig.accreditation}</div>
              {siteConfig.medicareCcn && (
                <div className="text-cream/65">
                  CCN: {siteConfig.medicareCcn}
                </div>
              )}
              {siteConfig.stateLicense && (
                <div className="text-cream/65">
                  TX License: {siteConfig.stateLicense}
                </div>
              )}
              <div>Serving Katy since {siteConfig.foundedYear}</div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-cream/10 pt-6 text-center text-xs uppercase tracking-[0.08em]">
          © {new Date().getFullYear()} {siteConfig.name} Home Health Services
          · Equal opportunity employer
        </div>
      </div>
    </footer>
  );
}
