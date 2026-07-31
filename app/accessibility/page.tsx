import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Accessibility | Lifecare Options",
  description:
    "How Lifecare Options builds and maintains an accessible website, the standard we work to, and how to reach us if something on this site is hard to use.",
};

const LAST_REVIEWED = "July 31, 2026";

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl md:text-3xl">{heading}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1>Accessibility</h1>

      <p className="text-slate mt-6 text-lg leading-relaxed">
        We bring care into people&apos;s homes, and a good share of the people
        we serve live with a disability, a vision or hearing change, or a
        condition that makes a screen harder to use. If this website is hard to
        use, it is a barrier to care. We treat it that way.
      </p>

      <Section heading="The standard we work to">
        <p>
          We are working toward conformance with the{" "}
          <Link
            href="https://www.w3.org/WAI/WCAG21/quickref/"
            className="text-care-blue underline underline-offset-2 hover:text-navy"
          >
            Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
          </Link>
          . These are the internationally recognized guidelines for accessible
          web content, and Level AA is the level referenced by the federal rules
          that apply to health care providers.
        </p>
        <p>
          We describe this as a goal we are actively working toward rather than
          a finished achievement. Accessibility is not a box that gets checked
          once. Content changes, browsers change, and the guidelines themselves
          are revised. We would rather tell you plainly where we stand and keep
          improving than claim a perfect score.
        </p>
      </Section>

      <Section heading="What we have done">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Built the site with semantic HTML structure and labeled landmarks,
            so screen readers and other assistive technology can navigate it.
          </li>
          <li>
            Included automated accessibility testing in our development process,
            so common issues are caught before changes go live.
          </li>
          <li>
            Given every interactive element a clearly visible keyboard focus
            outline, so the site can be operated without a mouse.
          </li>
          <li>
            Honored the operating system&apos;s{" "}
            <span className="whitespace-nowrap">reduce motion</span> setting.
            Visitors who have asked their device to limit animation get a still
            image instead of the moving one, and no motion effects.
          </li>
          <li>
            Written descriptive alternative text for meaningful images, so their
            content is available to people who cannot see them.
          </li>
          <li>
            Kept our phone line staffed by a person during business hours, with
            on-call nursing around the clock, so no one has to use the website
            to reach us.
          </li>
        </ul>
      </Section>

      <Section heading="Where we know we fall short">
        <p>
          Being straightforward about limitations is part of an honest
          accessibility statement:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-navy font-semibold">
              We have not yet completed an independent audit.
            </strong>{" "}
            Our testing to date has been internal. We have not engaged a
            third-party accessibility firm or conducted formal usability testing
            with people who use assistive technology daily. Until we do, we
            cannot represent that this site fully conforms to WCAG 2.1 AA.
          </li>
          <li>
            <strong className="text-navy font-semibold">
              Automated testing only goes so far.
            </strong>{" "}
            Automated tools reliably catch only a portion of accessibility
            problems. Many criteria require human judgment, and those are the
            ones most likely to still be present.
          </li>
        </ul>
        <p>
          If you run into something not listed here, we want to know. That is
          how this list gets shorter.
        </p>
      </Section>

      <Section heading="Tell us about a problem, or ask for another format">
        <p>
          If any part of this site is difficult to use, or you need information
          from it in a different format, contact us and we will get it to you
          another way. We can take your information over the phone, by mail, or
          in person. You do not need to explain why, and there is no cost.
        </p>
        <div className="border-cream-edge bg-white/60 mt-6 rounded-lg border p-6">
          <div className="font-display text-2xl">
            <Link
              href={siteConfig.phoneHref}
              className="hover:text-care-blue"
            >
              {siteConfig.phone}
            </Link>
          </div>
          <div className="text-slate mt-1 text-sm">
            Our main line, answered by a person. The fastest way to reach us.
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <div>{siteConfig.address.street}</div>
            <div>
              {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.zip}
            </div>
            <div>Fax: {siteConfig.fax}</div>
          </div>
          <div className="mt-4 text-sm">
            You can also use the{" "}
            <Link
              href="/#contact"
              className="text-care-blue underline underline-offset-2 hover:text-navy"
            >
              contact form
            </Link>{" "}
            on our home page.
          </div>
        </div>
        <p className="text-slate text-sm">
          We aim to respond to accessibility feedback within three business
          days. If your message is about getting care, call us instead. That is
          always faster.
        </p>
      </Section>

      <Section heading="The rules that apply to us">
        <p>
          We are a Medicare-certified home health agency in Texas. Several
          overlapping frameworks govern the accessibility of what we offer
          online, and we think it is worth being specific about which ones,
          rather than gesturing at the law in general.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold">
              Americans with Disabilities Act, Title III
            </h3>
            <p className="mt-2">
              The professional office of a health care provider is a place of
              public accommodation under Title III of the ADA, and the
              Department of Justice&apos;s longstanding position is that the
              ADA&apos;s requirements extend to the goods and services a
              business offers on the web. The Department has not issued a
              regulation setting a specific technical standard for private
              businesses, so there is no single certification to point to.
              Conformance with a recognized standard such as WCAG is the
              accepted way to meet the obligation, which is why we work to one.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Section 504 of the Rehabilitation Act
            </h3>
            <p className="mt-2">
              As a Medicare-certified provider we receive federal financial
              assistance, which makes us subject to Section 504 and the
              Department of Health and Human Services regulations at 45 CFR Part
              84. Those regulations adopt WCAG 2.1 Level AA as the standard for
              web content. Our compliance date under those rules is May 10,
              2028. We are working toward the standard now rather than waiting
              for the deadline.
            </p>
            <p className="text-slate mt-2 text-sm">
              Separately from any deadline, Section 504 already requires us to
              communicate effectively with people with disabilities and to make
              reasonable modifications on request. Those duties apply today, and
              the contact options above are how we meet them.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Section 1557 of the Affordable Care Act
            </h3>
            <p className="mt-2">
              Section 1557 prohibits disability discrimination in health
              programs and activities. Its regulation on websites and mobile
              applications, at 45 CFR 92.204, requires compliance with the
              Section 504 requirements described above rather than setting a
              separate standard of its own.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Texas law</h3>
            <p className="mt-2">
              Texas does not impose a separate technical standard for the
              websites of private businesses. The Texas Accessibility Standards,
              administered by the Texas Department of Licensing and Regulation,
              govern physical buildings and facilities, and they apply to our
              Katy office rather than to this site. Chapter 121 of the Texas
              Human Resources Code protects the right of people with
              disabilities to use public facilities and provides a route to
              enforce accessibility standards that are required by other
              applicable state or federal law. In practice, the technical
              standard we are held to is the federal one described above.
            </p>
          </div>
        </div>
      </Section>

      <Section heading="Physical accessibility">
        <p>
          Nearly all of our care is delivered in the home, so most people never
          need to visit us. If you do need to come to our Katy office, or if you
          need us to arrange a visit differently because of a disability, call
          ahead and we will make arrangements.
        </p>
      </Section>

      <div className="border-cream-edge text-slate mt-16 border-t pt-6 text-sm">
        <p>
          This statement was last reviewed on {LAST_REVIEWED}. We review it when
          we make significant changes to the site and at least once a year.
        </p>
      </div>
    </div>
  );
}
