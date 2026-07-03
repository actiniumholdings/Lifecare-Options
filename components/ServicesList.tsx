import {
  Stethoscope,
  PersonSimpleWalk,
  HandHeart,
  ChatCircleDots,
  UsersThree,
  House,
  Heartbeat,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { services } from "@/lib/site-config";
import type { ServiceIconName } from "@/lib/site-config";

const iconMap: Record<ServiceIconName, Icon> = {
  Stethoscope,
  PersonSimpleWalk,
  HandHeart,
  ChatCircleDots,
  UsersThree,
  House,
  Heartbeat,
};

/**
 * Kharazmi-style service cards — care-blue icon tile, name, description,
 * and a subtle "Learn more" affordance. All 7 disciplines render in a
 * responsive grid; RPM keeps no special "Now offering" treatment here
 * (the hero section handles that callout).
 */
export function ServicesList() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-navy/60">
            Our services
          </div>
          <h2 className="mt-2">
            <em>Seven</em> disciplines, one coordinated plan.
          </h2>
          <p className="mt-3 text-slate">
            Physician-ordered home health covered by Medicare. Our team works
            together around your care plan, with no handoff gaps.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const IconComponent = iconMap[service.iconName];
            return (
              <div
                key={service.name}
                className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_10px_30px_-12px_rgba(15,43,71,0.15)]"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-care-blue/15 text-blue-deep">
                  <IconComponent size={24} weight="duotone" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold text-navy">
                    {service.name}
                  </div>
                  <p className="mt-1 text-sm text-slate">{service.description}</p>
                </div>
                <div className="mt-auto text-sm font-medium text-blue-deep">
                  Learn more →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
