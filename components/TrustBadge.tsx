export function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ec] px-3 py-1.5 text-xs font-medium text-success-green">
      <span aria-hidden>✓</span>
      {children}
    </span>
  );
}
