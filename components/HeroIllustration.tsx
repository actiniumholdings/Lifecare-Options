import Image from "next/image";

type HeroIllustrationProps = {
  className?: string;
};

// Native dimensions of public/images/hero-sketch.jpg
const SKETCH_W = 1024;
const SKETCH_H = 572;

/**
 * Hero illustration: hand-drawn pencil sketch of a caregiver seated beside an
 * elderly woman on a couch, hand gently resting on her shoulder. Served via
 * next/image (lazy modern-format optimization). Aspect ratio is preserved by
 * the wrapper in app/page.tsx (`aspect-[1024/559]`).
 */
export function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <Image
      src="/images/hero-sketch.jpg"
      alt="A pencil-sketch illustration of a caregiver seated beside an elderly woman on a couch, the caregiver’s hand resting gently on her shoulder. Behind them, a sunlit window, a lamp, and potted plants."
      width={SKETCH_W}
      height={SKETCH_H}
      priority
      sizes="(max-width: 768px) 100vw, 50vw"
      className={className}
    />
  );
}
