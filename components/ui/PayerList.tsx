/**
 * Payer/condition chip row (spec §6). White-bordered chips on dark bands,
 * navy-bordered on light — legible on both by construction.
 */
export function PayerList({
  payers,
  note,
  tone = "light",
}: {
  payers: string[];
  note?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const chip = dark
    ? "border-white/30 bg-white/5 text-white"
    : "border-navy/20 bg-card text-navy";
  return (
    <div>
      <ul className="flex flex-wrap gap-2.5">
        {payers.map((payer) => (
          <li
            key={payer}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${chip}`}
          >
            {payer}
          </li>
        ))}
      </ul>
      {note && (
        <p className={`mt-4 max-w-xl text-sm ${dark ? "text-white/70" : "text-slate"}`}>
          {note}
        </p>
      )}
    </div>
  );
}
