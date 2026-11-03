"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { banners } from "@/data/banners";
import { profile } from "@/data/profile";
import { useDeviceTier, useWebGL2 } from "@/lib/capabilities";
import { ScanPortrait } from "../ScanPortrait";
import { Frame } from "../Frame";
import { Tagline } from "../Tagline";

const HeroScene = dynamic(() => import("../../HeroScene"), { ssr: false });

const ticks = Array.from({ length: 48 }, (_, i) => i);

function Rings() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(66%,25rem)] -translate-x-1/2 -translate-y-1/2"
    >
      <svg
        viewBox="-100 -100 200 200"
        className="absolute inset-0 animate-[spin_60s_linear_infinite]"
      >
        <circle r="96" fill="none" stroke="var(--mint)" strokeOpacity="0.25" strokeDasharray="2 6" />
        {ticks.map((i) => (
          <line
            key={i}
            x1="0"
            y1="-92"
            x2="0"
            y2={i % 6 === 0 ? "-84" : "-88"}
            stroke="var(--mint)"
            strokeOpacity={i % 6 === 0 ? 0.7 : 0.3}
            transform={`rotate(${(i * 360) / ticks.length})`}
          />
        ))}
      </svg>
      <svg
        viewBox="-100 -100 200 200"
        className="absolute inset-[9%] animate-[spin_40s_linear_infinite] [animation-direction:reverse]"
      >
        <circle r="96" fill="none" stroke="var(--amber)" strokeOpacity="0.35" strokeDasharray="30 12 4 12" />
        <circle cx="0" cy="-96" r="2.5" fill="var(--amber)" />
      </svg>
    </div>
  );
}

export function StartTab({ active }: { active: boolean }) {
  const gl = useWebGL2();
  const tier = useDeviceTier();
  const [ready, setReady] = useState(false);
  const pointer = useRef({ x: 0, y: 0 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const onLeave = () => {
    pointer.current.x = 0;
    pointer.current.y = 0;
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative h-full min-h-[26rem] overflow-hidden"
    >
      <div className="bg-grid absolute inset-0" aria-hidden />
      <Rings />
      {gl && (
        <div
          aria-hidden
          className={`absolute inset-0 transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <HeroScene
            pointer={pointer}
            active={active}
            low={tier === "low"}
            onReady={() => setReady(true)}
          />
        </div>
      )}

      <div className="relative flex h-full flex-col items-center justify-between px-5 py-8 text-center">
        <div className="@container w-full">
          <pre aria-hidden className="ascii mx-auto hidden w-fit text-left @xl:block">
            {banners.start}
          </pre>
          <h1
            tabIndex={-1}
            className="text-3xl font-bold tracking-tight text-ink sm:text-5xl @xl:sr-only"
          >
            {profile.name.toLowerCase()}
          </h1>
          <p className="tag mt-2">ai engineer · cs &amp; ai, plaksha</p>
          <Tagline />
        </div>

        <div className="flex w-full flex-col items-center gap-4 lg:hidden">
          <Frame className="size-24 shrink-0 bg-surface">
            <ScanPortrait inset="inset-1.5" sizes="96px" />
</Frame>
          <dl className="grid max-w-sm grid-cols-2 gap-x-6 gap-y-3 text-left">
            <div>
              <dt className="tag">Occupation</dt>
              <dd className="caps font-semibold text-mint">{profile.occupation}</dd>
            </div>
            <div>
              <dt className="tag">Corporation</dt>
              <dd className="caps font-semibold text-mint">{profile.corporation}</dd>
            </div>
            <div className="col-span-2">
              <dt className="tag">Status</dt>
              <dd className="caps font-semibold text-mint">{profile.status}</dd>
            </div>
          </dl>
        </div>

        <p className="cursor tag hidden lg:block">
          boot ok · press 1-6 to jump · / for commands · move your cursor over the sphere
        </p>
      </div>
    </div>
  );
}
