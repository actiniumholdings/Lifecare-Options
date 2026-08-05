import { Section } from "./Section";
import { Button } from "@/components/Button";

type Cta = { label: string; href: string };

export function CtaBand({
  headline,
  primary,
  secondary,
}: {
  headline: string;
  primary?: Cta;
  secondary?: Cta;
}) {
  return (
    <Section tone="dark" className="text-center">
      <h2 className="mx-auto max-w-2xl text-white">{headline}</h2>
      {(primary || secondary) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {primary && (
            <Button href={primary.href} variant="onDark" size="lg">
              {primary.label}
            </Button>
          )}
          {secondary && (
            <Button href={secondary.href} variant="secondary" size="lg" className="!bg-transparent !text-white hover:!bg-white/10">
              {secondary.label}
            </Button>
          )}
        </div>
      )}
    </Section>
  );
}
