export function Stat({
  value,
  label,
  tone = "light",
}: {
  value: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const labelColor = tone === "dark" ? "text-mist/70" : "text-slate";
  return (
    <div>
      <div className="font-display text-navy text-3xl leading-none md:text-4xl">
        {value}
      </div>
      <div className={`mt-1 text-sm ${labelColor}`}>{label}</div>
    </div>
  );
}
