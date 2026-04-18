import Link from "next/link";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-navy text-[#a8b8cc]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Contact */}
          <div>
            <Logo size="md" inverse />
            <div className="mt-4 space-y-1 text-sm leading-relaxed">
              <div>{siteConfig.address.street}</div>
              <div>
                {siteConfig.address.city}, {siteConfig.address.state}{" "}
                {siteConfig.address.zip}
              </div>
              <div>
                Phone:{" "}
                <Link
                  href={siteConfig.phoneHref}
                  className="text-white hover:underline"
                >
                  {siteConfig.phone}
                </Link>
              </div>
              <div>Fax: {siteConfig.fax}</div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <div className="mb-3 text-xs font-semibold tracking-wider text-white uppercase">
              Hours
            </div>
            <ul className="space-y-1 text-sm">
              {siteConfig.hours.map((h) => (
                <li key={h.days}>
                  <span className="text-white">{h.days}:</span> {h.time}
                </li>
              ))}
            </ul>
            <div className="text-peach-cream mt-3 text-sm">
              {siteConfig.onCall}
            </div>
          </div>

          {/* Accreditation */}
          <div>
            <div className="mb-3 text-xs font-semibold tracking-wider text-white uppercase">
              Accreditation
            </div>
            <div className="space-y-1 text-sm">
              <div>Medicare-certified</div>
              <div>{siteConfig.accreditation}</div>
              <div>Serving Katy since {siteConfig.foundedYear}</div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} {siteConfig.name} Home Health Services ·
          Equal opportunity employer
        </div>
      </div>
    </footer>
  );
}
