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
  const stage = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r || r.width === 0 || r.height === 0) return;
    pointer.current.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    pointer.current.y = Math.max(-1, Math.min(1, -(((e.clientY - r.top) / r.height) * 2 - 1)));
  };

  const onLeave = () => {
    pointer.current.x = 0;
    pointer.current.y = 0;
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerUp={onLeave}
      onPointerCancel={onLeave}
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

        <div
          ref={stage}
          className="relative h-[min(38svh,22rem)] min-h-56 w-full max-w-md shrink-0 lg:absolute lg:inset-0 lg:z-0 lg:h-auto lg:min-h-0 lg:max-w-none"
        >
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
          <p className="tag pointer-events-none absolute inset-x-0 bottom-0 lg:hidden">
            drag the sphere
          </p>
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
          boot ok · press 1-6 to jump · / opens the shell · move your cursor over the sphere
        </p>
      </div>
    </div>
  );
}
