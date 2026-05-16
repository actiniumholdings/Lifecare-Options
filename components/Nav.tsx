"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { siteConfig } from "@/lib/site-config";

const SCROLL_THRESHOLD = 8;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
        frame = 0;
      });
    };
    // Initialize from current scroll (handles mid-page hot reload).
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Mobile-menu-open forces "scrolled" styling regardless of position.
  const scrolledStyling = isScrolled || open;

  const headerClasses = [
    "sticky top-0 z-50 border-b border-borderline transition-all duration-200 ease-out motion-reduce:transition-none",
    scrolledStyling
      ? "bg-white/98 backdrop-blur shadow-sm"
      : "bg-white/95 backdrop-blur",
  ].join(" ");

  const containerClasses = [
    "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-6 transition-all duration-200 ease-out motion-reduce:transition-none",
    scrolledStyling ? "py-3" : "py-4",
  ].join(" ");

  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
        <Logo size="md" />

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={siteConfig.phoneHref}
            className="text-sm text-navy hover:text-care-blue"
          >
            {siteConfig.phone}
          </Link>
          <Button href="#contact">Request info →</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="p-2 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="border-t border-borderline bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            <Link
              href={siteConfig.phoneHref}
              onClick={() => setOpen(false)}
              className="py-2 text-base text-navy"
            >
              Call {siteConfig.phone}
            </Link>
            <Button href="#contact" size="lg">
              Request info →
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
