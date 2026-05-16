type HeroIllustrationProps = {
  className?: string;
};

/**
 * Hero illustration: two abstract figures (caregiver + patient) with a heart
 * suspended between them. Custom SVG in the brand palette — navy primary,
 * care-blue secondary, peach-cream warm background. Replaces the placeholder
 * gradient block from Phase 0.
 *
 * Rendered inline (not via next/image) so the motion wrapper in the hero can
 * animate scale/fade without intermediate raster optimization and so colors
 * can stay in sync with the design tokens.
 */
export function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <svg
      viewBox="0 0 600 450"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="An illustration of a caregiver and patient figures with a heart between them, representing connection and care."
      className={className}
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdeedd" />
          <stop offset="100%" stopColor="#fff4e3" />
        </linearGradient>
      </defs>

      {/* warm background */}
      <rect width="600" height="450" fill="url(#hero-bg)" />

      {/* soft concentric care-blue circles behind the figures (suggest embrace) */}
      <circle cx="300" cy="265" r="170" fill="#5a8bb8" opacity="0.14" />
      <circle cx="300" cy="265" r="120" fill="#5a8bb8" opacity="0.16" />

      {/* left figure — caregiver (taller, navy) */}
      <g transform="translate(225, 125)">
        {/* head */}
        <circle cx="0" cy="0" r="30" fill="#0f2b47" />
        {/* shoulders/torso — single elegant curve */}
        <path
          d="
            M -52 56
            C -56 75, -55 95, -52 115
            L -52 230
            L 52 230
            L 52 115
            C 55 95, 56 75, 52 56
            C 40 42, 22 36, 0 36
            C -22 36, -40 42, -52 56
            Z
          "
          fill="#0f2b47"
        />
      </g>

      {/* right figure — patient (slightly shorter, care-blue, leaning very slightly inward) */}
      <g transform="translate(375, 160)">
        {/* head */}
        <circle cx="0" cy="0" r="26" fill="#5a8bb8" />
        {/* shoulders/torso */}
        <path
          d="
            M -45 50
            C -49 67, -48 84, -45 100
            L -45 195
            L 45 195
            L 45 100
            C 48 84, 49 67, 45 50
            C 35 38, 18 32, 0 32
            C -18 32, -35 38, -45 50
            Z
          "
          fill="#5a8bb8"
        />
      </g>

      {/* floating heart between the figures, slightly above shoulder line */}
      <g transform="translate(300, 175)">
        <path
          d="
            M 0 22
            C 0 22, -26 4, -26 -14
            C -26 -24, -16 -32, -8 -28
            C -3 -25, 0 -18, 0 -18
            C 0 -18, 3 -25, 8 -28
            C 16 -32, 26 -24, 26 -14
            C 26 4, 0 22, 0 22
            Z
          "
          fill="#0f2b47"
        />
      </g>

      {/* subtle ground shadow */}
      <ellipse cx="300" cy="390" rx="200" ry="14" fill="#0f2b47" opacity="0.07" />
    </svg>
  );
}
