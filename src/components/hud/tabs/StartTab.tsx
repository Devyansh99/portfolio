"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type { PointerEvent } from "react";
import { profile } from "@/data/profile";
import { useWebGL2 } from "@/lib/capabilities";

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

export function StartTab() {
  const gl = useWebGL2();
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
        <div className="absolute inset-0" aria-hidden>
          <HeroScene pointer={pointer} />
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

        <p className="tag">press 1–6 to jump · move your cursor over the sphere</p>
      </div>
    </div>
  );
}
