import type { ReactNode } from "react";
import { Container } from "./Container";

export function Section({
  tone = "light",
  id,
  className = "",
  children,
}: {
  tone?: "light" | "dark";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === "dark" ? "bg-navy text-mist" : "bg-mist text-navy";
  return (
    <section
      id={id}
      className={`relative py-14 md:py-24 ${toneClass} ${className}`}
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
