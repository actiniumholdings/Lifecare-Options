import { Fragment } from "react";
import { siteConfig } from "@/lib/site-config";

/**
 * Navy band of credentials in italic display type, separated by a small
 * asterism. Every item is a verifiable fact about the agency — per the design
 * system's "no fake stats" rule, nothing invented goes in here.
 */
export function TrustTicker() {
  const items = [
    "Medicare-certified",
    siteConfig.accreditation,
    `Serving Katy since ${siteConfig.foundedYear}`,
    "Locally owned",
    siteConfig.onCall,
  ];

  return (
    <section className="bg-navy px-4 py-5 md:px-6">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-center gap-x-6 gap-y-2 md:gap-x-9">
        {items.map((item, i) => (
          <Fragment key={item}>
            <li className="font-display text-peach text-base italic md:text-lg">
              {item}
            </li>
            {i < items.length - 1 && (
              <li aria-hidden className="text-peach/45 text-xs">
                ✦
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </section>
  );
}
