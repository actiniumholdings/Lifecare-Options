/**
 * Editorial pull-quote credentials line. Replaces the previous icon-stacked
 * trust-strip template. One sentence carries every credibility claim; the
 * reader's eye stops, registers, moves on.
 */
export function TrustSentence() {
  return (
    <section className="px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-7xl border-y border-navy/[0.18] py-8 md:py-10">
        <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-navy/60">
          Credentials
        </div>
        <p className="mt-3 max-w-4xl font-display text-2xl leading-tight text-navy md:text-3xl">
          <em className="not-italic font-semibold">Medicare-certified.</em>{" "}
          <em>CHAP-accredited.</em>{" "}
          Serving <em className="not-italic font-semibold">Katy</em> families
          since <em className="not-italic font-semibold">2008</em>.
        </p>
      </div>
    </section>
  );
}
