import type { ReactNode } from "react";
import { Container } from "./Container";

const TONE_CLASS: Record<"light" | "sky" | "dark", string> = {
  light: "bg-mist text-navy",
  sky: "bg-sky-soft text-navy-deep",
  dark: "bg-navy text-mist",
};

export function Section({
  tone = "light",
  id,
  className = "",
  children,
}: {
  tone?: "light" | "sky" | "dark";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative py-14 md:py-24 ${TONE_CLASS[tone]} ${className}`}
    >
      {tone === "dark" && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-care-blue/40"
        />
      )}
      <Container>{children}</Container>
    </section>
  );
}
