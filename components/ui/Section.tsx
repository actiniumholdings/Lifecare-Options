import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

export type SectionTone = "light" | "dark";

export interface SectionProps {
  /** "light" = warm ivory; "dark" = premium navy with white text + blue accents. */
  tone?: SectionTone;
  /** Optional blue uppercase eyebrow above the title. */
  eyebrow?: ReactNode;
  /** Optional Fraunces display headline. */
  title?: ReactNode;
  /** Optional supporting copy beneath the title. */
  intro?: ReactNode;
  /** Center the header block (eyebrow/title/intro). */
  centered?: boolean;
  id?: string;
  className?: string;
  /** Override the inner Container width/padding if needed. */
  containerClassName?: string;
  children?: ReactNode;
}

/**
 * A full-width band with generous vertical rhythm. Alternate light (ivory)
 * and dark (navy) tones for editorial drama. Renders the eyebrow → Fraunces
 * title → intro header when those props are supplied.
 */
export function Section({
  tone = "light",
  eyebrow,
  title,
  intro,
  centered = false,
  id,
  className,
  containerClassName,
  children,
}: SectionProps) {
  const toneClasses =
    tone === "dark" ? "bg-navy text-white" : "bg-canvas text-navy";

  const classes = ["py-20 sm:py-28 lg:py-32", toneClasses, className]
    .filter(Boolean)
    .join(" ");

  const hasHeader = Boolean(eyebrow || title || intro);
  const align = centered ? "text-center mx-auto" : "";

  return (
    <section id={id} className={classes}>
      <Container className={containerClassName}>
        {hasHeader && (
          <header className={`flex flex-col gap-5 ${centered ? "items-center" : ""}`}>
            {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
            {title && (
              <h2
                className={`font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl ${
                  tone === "dark" ? "text-white" : "text-navy"
                } ${centered ? "max-w-3xl" : "max-w-2xl"} ${align}`}
              >
                {title}
              </h2>
            )}
            {intro && (
              <p
                className={`max-w-2xl text-lg leading-relaxed ${
                  tone === "dark" ? "text-white/75" : "text-slate"
                } ${align}`}
              >
                {intro}
              </p>
            )}
          </header>
        )}
        {children && (
          <div className={hasHeader ? "mt-14 sm:mt-16" : ""}>{children}</div>
        )}
      </Container>
    </section>
  );
}

export default Section;
