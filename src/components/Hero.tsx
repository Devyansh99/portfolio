"use client";

import type { PointerEvent } from "react";
import { heroCtas } from "@/data/copy";
import { profile } from "@/data/profile";
import { usePointerFine } from "@/lib/capabilities";
import { registerImpact } from "@/lib/scene-store";
import { HeroTrace } from "./HeroTrace";
import { MagneticLink } from "./MagneticLink";

export function Hero() {
  const fine = usePointerFine();

  const onDown = (e: PointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    registerImpact(e);
  };

  return (
    <section
      id="top"
      data-scene="hero"
      onPointerDown={onDown}
      className="relative flex min-h-svh flex-col justify-end px-5 pb-8 pt-28 md:px-10"
    >
      <div className="mx-auto w-full max-w-[1360px]">
        <div className="flex items-baseline justify-between gap-6">
          <p className="label">{profile.role}</p>
          <p className="label hidden md:block">{profile.location}</p>
        </div>

        <div className="mt-6 grid grid-cols-12 items-end gap-x-6">
          <h1 className="font-display font-condensed text-display-xl col-span-12 text-ink lg:col-span-8">
            Devyansh
            <br />
            Agarwal
          </h1>
          <div className="col-span-12 mt-8 lg:col-span-4 lg:mt-0 lg:pb-3">
            <p className="text-lead text-ink">{profile.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
              <MagneticLink
                href="#work"
                className="border-b border-mint pb-0.5 text-mint"
              >
                {heroCtas.work} ↓
              </MagneticLink>
              <MagneticLink
                href="#research"
                className="border-b border-line-strong pb-0.5 hover:border-mint hover:text-mint"
              >
                {heroCtas.paper}
              </MagneticLink>
              <MagneticLink
                href={`mailto:${profile.email}`}
                className="border-b border-line-strong pb-0.5 hover:border-mint hover:text-mint"
              >
                {heroCtas.email}
              </MagneticLink>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <HeroTrace />
          {fine && <p className="label mt-2">{heroCtas.hint}</p>}
        </div>
      </div>
    </section>
  );
}
