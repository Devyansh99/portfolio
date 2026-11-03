"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { profile } from "@/data/profile";
import { useCanRender3D } from "@/lib/capabilities";
import { useSetting } from "@/lib/settings";

const HeroScene = dynamic(() => import("../../HeroScene"), { ssr: false });

export function StartTab() {
  const ref = useRef<HTMLDivElement>(null);
  const can3D = useCanRender3D();
  const motion = useSetting("motion");

  return (
    <div ref={ref} className="relative h-full min-h-[26rem] overflow-hidden">
      <div className="bg-grid absolute inset-0" aria-hidden />
      {can3D && motion && (
        <div className="absolute inset-0" aria-hidden>
          <HeroScene eventSource={ref} />
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
          press 1–6 to jump · move your cursor over the sphere
        </p>
      </div>
    </div>
  );
}
