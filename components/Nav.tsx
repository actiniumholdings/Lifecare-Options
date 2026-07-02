"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FocusEvent } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Container } from "./ui/Container";
import { siteConfig } from "@/lib/site-config";

const SCROLL_THRESHOLD = 12;

type SubLink = { href: string; label: string };

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

/**
 * Accessible disclosure for the desktop "Services" nav entry: the label is a
 * real link to /services, and an adjacent button toggles a submenu of the
 * two pillars + RPM. Opens on hover, on trigger click (toggle), or via
 * ArrowDown/Enter/Space on the focused trigger. Deliberately does NOT open
 * on mere button focus — that raced with Escape's programmatic refocus and
 * reopened the menu. Closes on Escape, blur-outside, or an outside click.
 */
function ServicesDropdown({
  label,
  href,
  items,
}: {
  label: string;
  href: string;
  items: SubLink[];
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        // Don't steal keyboard focus: if focus is currently inside the
        // menu (e.g. a submenu link), the pointer leaving the wrapper
        // shouldn't close it out from under the keyboard user.
        if (wrapperRef.current?.contains(document.activeElement)) return;
        setOpen(false);
      }}
      onBlur={handleBlur}
    >
      <NavLink href={href} label={label} />
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={`${label} submenu`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          // ArrowDown opens the menu from the focused trigger. Enter/Space
          // already toggle via the native button click event above — no
          // separate handling needed, and critically, focus alone must
          // never open the menu (that's what let Escape's refocus reopen it).
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-navy/50 outline-none transition-colors hover:text-navy focus-visible:text-navy focus-visible:ring-2 focus-visible:ring-blue-deep focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <ul
        id={menuId}
        className={`absolute left-0 top-full z-10 mt-3 min-w-60 rounded-[var(--radius)] border border-navy/10 bg-canvas py-2 shadow-[0_12px_32px_-12px_rgba(8,29,51,0.25)] transition-all duration-150 ease-out before:absolute before:inset-x-0 before:-top-3 before:h-3 before:content-[''] motion-reduce:transition-none ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        {items.map((sub) => (
          <li key={sub.href}>
            <Link
              href={sub.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 font-sans text-sm text-navy/80 outline-none transition-colors hover:bg-navy/[0.04] hover:text-navy focus-visible:bg-navy/[0.04] focus-visible:text-navy"
            >
              {sub.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
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

  const links: { href: string; label: string; children?: SubLink[] }[] = [
    {
      href: "/services",
      label: t("services"),
      children: [
        { href: "/services/skilled", label: t("skilled") },
        { href: "/services/attendant", label: t("attendant") },
        { href: "/remote-patient-monitoring", label: t("rpm") },
      ],
    },
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
            {links.map((item) =>
              item.children ? (
                <ServicesDropdown
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  items={item.children}
                />
              ) : (
                <NavLink key={item.href} {...item} />
              )
            )}
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
            <Button variant="primary" href="/refer">
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
                <div key={item.href} className="flex flex-col">
                  <Link
                    href={item.href}
                    onClick={close}
                    className="rounded-[var(--radius)] px-2 py-3 font-display text-xl text-navy transition-colors hover:bg-navy/[0.04] hover:text-blue-deep"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-3 flex flex-col border-l border-navy/10 pl-3">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={close}
                          className="rounded-[var(--radius)] px-2 py-2 font-sans text-base text-navy/70 transition-colors hover:bg-navy/[0.04] hover:text-blue-deep"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
              <Button variant="primary" size="lg" href="/refer" className="w-full">
                {t("refer")}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
