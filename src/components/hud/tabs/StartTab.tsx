"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { profile } from "@/data/profile";
import { useWebGL2 } from "@/lib/capabilities";
import { useSetting } from "@/lib/settings";

const HeroScene = dynamic(() => import("../../HeroScene"), { ssr: false });

const ticks = Array.from({ length: 48 }, (_, i) => i);

function Rings({ spin }: { spin: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[54%] aspect-square w-[min(78%,30rem)] -translate-x-1/2 -translate-y-1/2"
    >
      <svg
        viewBox="-100 -100 200 200"
        className={`absolute inset-0 ${spin ? "animate-[spin_60s_linear_infinite]" : ""}`}
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
        className={`absolute inset-[9%] ${
          spin ? "animate-[spin_40s_linear_infinite] [animation-direction:reverse]" : ""
        }`}
      >
        <circle r="96" fill="none" stroke="var(--amber)" strokeOpacity="0.35" strokeDasharray="30 12 4 12" />
        <circle cx="0" cy="-96" r="2.5" fill="var(--amber)" />
      </svg>
    </div>
  );
}

export function StartTab() {
  const ref = useRef<HTMLDivElement>(null);
  const gl = useWebGL2();
  const motion = useSetting("motion");

  return (
    <div ref={ref} className="relative h-full min-h-[26rem] overflow-hidden">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <Rings spin={motion} />
      {gl && (
        <div className="absolute inset-0" aria-hidden>
          <HeroScene eventSource={ref} animate={motion} />
        </div>
      )}

      <div className="relative flex h-full flex-col items-center justify-between px-5 py-8 text-center">
        <div>
          <p className="tag">{profile.name}</p>
          <p className="caps mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-ink sm:text-base">
            {profile.tagline}
          </p>
        </div>

        <div className="w-full lg:hidden">
          <dl className="mx-auto grid max-w-sm grid-cols-2 gap-x-4 gap-y-3 text-left">
            <div>
              <dt className="tag">Occupation</dt>
              <dd className="caps font-semibold text-mint">{profile.occupation}</dd>
            </div>
            <div>
              <dt className="tag">Corporation</dt>
              <dd className="caps font-semibold text-mint">{profile.corporation}</dd>
            </div>
          </dl>
        </div>

        <p className="tag">
          {motion
            ? "press 1–6 to jump · move your cursor over the sphere"
            : "press 1–6 to jump · motion is off, switch it on at the bottom right"}
        </p>
      </div>
    </div>
  );
}
