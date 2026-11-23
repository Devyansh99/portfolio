"use client";

import { banners } from "@/data/banners";
import { profile } from "@/data/profile";
import { useDeviceTier } from "@/lib/capabilities";
import { ScanPortrait } from "../ScanPortrait";
import { Frame } from "../Frame";
import { Tagline } from "../Tagline";
import { TokenPipeline } from "../TokenPipeline";

export function StartTab({ active }: { active: boolean }) {
  const tier = useDeviceTier();

  return (
    <div
      className="relative min-h-full touch-pan-y overflow-x-clip lg:h-full lg:min-h-[26rem] lg:overflow-hidden"
    >
      <div className="bg-grid absolute inset-0" aria-hidden />

      <div className="relative flex min-h-full flex-col items-center gap-4 px-4 py-5 text-center sm:px-5 lg:h-full lg:justify-between lg:gap-0 lg:py-8">
        <div className="@container relative z-10 w-full">
          <pre aria-hidden className="ascii mx-auto hidden w-fit text-left @xl:block">
            {banners.start}
          </pre>
          <h1
            tabIndex={-1}
            className="mt-2 break-words text-3xl font-bold tracking-tight text-ink sm:text-4xl @xl:text-2xl"
          >
            {profile.name}
          </h1>
          <p className="tag mt-2">AI engineer · CS &amp; AI, Plaksha</p>
          <Tagline />
        </div>

        <div className="relative h-[min(46svh,22rem)] min-h-64 w-full shrink-0 lg:my-4 lg:h-auto lg:min-h-0 lg:flex-1">
          <TokenPipeline active={active} low={tier === "low"} />
        </div>

        <div className="relative z-10 flex w-full max-w-md items-center gap-4 text-left lg:hidden">
          <Frame className="aspect-[4/5] w-36 shrink-0 bg-surface sm:w-44">
            <ScanPortrait inset="inset-1.5" sizes="176px" />
          </Frame>
          <dl className="grid min-w-0 flex-1 gap-y-3">
            <div>
              <dt className="tag">Occupation</dt>
              <dd className="break-words font-semibold text-mint">{profile.occupation}</dd>
            </div>
            <div>
              <dt className="tag">Corporation</dt>
              <dd className="break-words font-semibold text-mint">{profile.corporation}</dd>
            </div>
            <div>
              <dt className="tag">Status</dt>
              <dd className="break-words font-semibold text-mint">{profile.status}</dd>
            </div>
          </dl>
        </div>

        <p className="cursor tag relative z-10 hidden lg:block">
          boot ok · press 1-6 to jump · / opens the shell · hover the network · click for a ripple
        </p>
      </div>
    </div>
  );
}
