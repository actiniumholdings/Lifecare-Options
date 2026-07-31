"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type HeroIllustrationProps = {
  className?: string;
};

// Native dimensions of public/images/hero-photo.jpg (also the video poster).
const PHOTO_W = 2048;
const PHOTO_H = 1143;

const HERO_ALT =
  "A home-health caregiver sits close beside an elderly woman on a sofa in a sunlit living room, one arm around her shoulder and holding her hand as they smile warmly at each other. Potted plants and a bookshelf are softly blurred behind them.";

// SSR-safe "are we hydrated on the client?" flag, without setState-in-effect:
// the server snapshot is false, the client snapshot is true.
const emptySubscribe = () => () => {};
function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Hero media: a warm photograph of a home-health caregiver beside an elderly
 * woman, progressively enhanced to a muted, looping video on the client when
 * motion is allowed.
 *
 * Server render, no-JS visitors, crawlers, and reduced-motion users all get
 * the still photograph (which is also the video's poster), so the accessible
 * image is always present. Only after hydration, and only when the user has
 * not asked for reduced motion, does the still upgrade to the autoplaying
 * loop — the matching poster makes that swap seamless. Aspect ratio is held
 * by the wrapper in app/page.tsx (`aspect-[1024/572]`).
 */
export function HeroIllustration({ className }: HeroIllustrationProps) {
  const reduced = useReducedMotionSafe();
  const isClient = useIsClient();

  if (!isClient || reduced) {
    return (
      <Image
        src="/images/hero-photo.jpg"
        alt={HERO_ALT}
        width={PHOTO_W}
        height={PHOTO_H}
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        className={className}
      />
    );
  }

  return (
    <>
      {/* Decorative, silent enhancement: hidden from assistive tech (the
          sr-only description below carries the meaning, and the reduced-motion
          branch above exposes the same scene as a described image). */}
      <video
        className={className}
        poster="/images/hero-photo.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <span className="sr-only">{HERO_ALT}</span>
    </>
  );
}
