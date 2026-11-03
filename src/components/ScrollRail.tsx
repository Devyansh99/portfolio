"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useSyncExternalStore } from "react";
import { sections } from "@/data/sections";
import { getSection, subscribeScene } from "@/lib/scene-store";

export function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const top = useTransform(scrollYProgress, (v) => `${v * 100}%`);
  const active = useSyncExternalStore(subscribeScene, getSection, () => "hero");
  const current = sections.find((s) => s.scene === active);

  return (
    <div
      aria-hidden
      className="fixed bottom-24 right-6 top-24 z-40 hidden w-px bg-line md:block"
    >
      {sections.map((s, i) => (
        <span
          key={s.scene}
          className="absolute -left-1 h-px w-3 bg-line-strong"
          style={{ top: `${(i / (sections.length - 1)) * 100}%` }}
        />
      ))}
      <motion.span
        className="absolute -left-1 size-[9px] -translate-y-1/2 rounded-full bg-mint"
        style={{ top }}
      />
      <span className="label absolute -left-14 top-1/2 origin-right -translate-y-1/2 -rotate-90 whitespace-nowrap">
        {current?.label}
      </span>
    </div>
  );
}
