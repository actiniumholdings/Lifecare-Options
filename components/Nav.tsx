"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { siteConfig } from "@/lib/site-config";

const SCROLL_THRESHOLD = 12;

/** A desktop nav link with a refined blue underline that grows on hover/focus. */
function NavLink({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative rounded-sm px-1 py-1 font-sans text-[0.95rem] font-medium text-navy/80 outline-none transition-colors hover:text-navy focus-visible:text-navy focus-visible:ring-2 focus-visible:ring-blue-deep focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      {label}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-0.5 left-1 right-1 h-px origin-left scale-x-0 bg-blue-deep transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  );
}

export function Nav() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape-to-close + body-scroll-lock while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const links = [
    { href: "/services", label: t("services") },
    { href: "/service-area", label: t("serviceArea") },
    { href: "/about", label: t("about") },
    { href: "/careers", label: t("careers") },
    { href: "/contact", label: t("contact") },
  ];

  const close = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 bg-canvas/90 backdrop-blur-md transition-all duration-300 ${
        scrolled || open
          ? "border-b border-navy/10 shadow-[0_1px_20px_-8px_rgba(8,29,51,0.25)]"
          : "border-b border-transparent"
      }`}
    >
      <Container
        className={`flex items-center justify-between gap-6 transition-all duration-300 ${
          scrolled ? "py-3" : "py-4 lg:py-5"
        }`}
      >
        <Logo size="md" />

        {/* Desktop nav + actions */}
        <div className="hidden items-center gap-7 md:flex">
          <nav aria-label="Primary" className="flex items-center gap-6">
            {links.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span className="h-6 w-px bg-navy/10" aria-hidden="true" />
            <Link
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-1.5 rounded-sm font-sans text-sm font-medium tabular-nums text-navy outline-none transition-colors hover:text-blue-deep focus-visible:ring-2 focus-visible:ring-blue-deep focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <Phone size={15} aria-hidden="true" />
              {siteConfig.phone}
            </Link>
            <Button variant="accent" href="/refer">
              {t("refer")}
            </Button>
          </div>
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? tc("closeMenu") : tc("openMenu")}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-[var(--radius)] border border-navy/15 text-navy outline-none transition-colors hover:bg-navy/[0.04] focus-visible:ring-2 focus-visible:ring-blue-deep focus-visible:ring-offset-2 focus-visible:ring-offset-canvas md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {/* Mobile menu panel (inline dropdown — avoids the fixed-in-backdrop clip). */}
      {open && (
        <div className="border-t border-navy/10 bg-canvas md:hidden">
          <Container className="flex flex-col py-4">
            <nav aria-label="Mobile" className="flex flex-col">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="rounded-[var(--radius)] px-2 py-3 font-display text-xl text-navy transition-colors hover:bg-navy/[0.04] hover:text-blue-deep"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-4 border-t border-navy/10 pt-5">
              <Link
                href={siteConfig.phoneHref}
                onClick={close}
                className="inline-flex items-center gap-2 font-sans text-base font-semibold tabular-nums text-navy hover:text-blue-deep"
              >
                <Phone size={18} aria-hidden="true" />
                {siteConfig.phone}
              </Link>
              <Button variant="accent" size="lg" href="/refer" className="w-full">
                {t("refer")}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
