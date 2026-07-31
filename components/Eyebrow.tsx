import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Small caps label above a section heading, flanked by hairlines — the design
 * system's recurring section opener. `flanked` puts a rule on both sides for
 * centered sections; the default puts one on the left only.
 */
export function Eyebrow({
  children,
  flanked = false,
  className,
}: {
  children: ReactNode;
  flanked?: boolean;
  className?: string;
}) {
  const rule = (
    <span
      aria-hidden
      className="bg-care-blue-deep inline-block h-px w-8 shrink-0"
    />
  );

  return (
    <div
      className={twMerge(
        "text-care-blue-deep inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase",
        className
      )}
    >
      {rule}
      {children}
      {flanked && rule}
    </div>
  );
}
