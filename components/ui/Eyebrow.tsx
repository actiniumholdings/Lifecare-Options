import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-xs font-semibold uppercase tracking-[0.16em] text-blue-deep ${className}`}
    >
      {children}
    </div>
  );
}
