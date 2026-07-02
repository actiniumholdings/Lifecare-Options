"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { siteConfig } from "@/lib/site-config";

const SCROLL_THRESHOLD = 8;

export function Nav() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > SCROLL_THRESHOLD
  );

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Escape-to-close + body-scroll-lock while mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const scrolledStyling = isScrolled || open;

  const headerClasses = [
    "sticky top-0 z-50 border-b border-border transition-all duration-200 ease-out motion-reduce:transition-none",
    scrolledStyling
      ? "bg-white/98 backdrop-blur shadow-sm"
      : "bg-white/95 backdrop-blur",
  ].join(" ");

  const containerClasses = [
    "mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 md:px-6 transition-all duration-200 ease-out motion-reduce:transition-none",
    scrolledStyling ? "py-3" : "py-4",
  ].join(" ");

  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
        <Logo size="md" />

        {/* Always-visible phone chip — both desktop and mobile see it */}
        <Link
          data-testid="mobile-phone-chip"
          href={siteConfig.phoneHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-2 text-xs font-semibold text-mist hover:bg-navy/90 md:hidden"
          aria-label={`Call ${siteConfig.phone}`}
        >
          <Phone size={14} />
          <span className="whitespace-nowrap">{siteConfig.phone}</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={siteConfig.phoneHref}
            className="inline-flex items-center gap-1.5 text-sm text-navy hover:text-blue-deep"
          >
            <Phone size={14} />
            {siteConfig.phone}
          </Link>
          <Button href="#contact">{t("requestInfo")} →</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
          className="p-2 text-navy md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="border-t border-border bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            <Button href="#contact" size="lg">
              {t("requestInfo")} →
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
