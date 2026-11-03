"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { usePointerFine, usePrefersReducedMotion } from "@/lib/capabilities";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

export function MagneticLink({
  href,
  children,
  className = "",
  external = false,
}: MagneticLinkProps) {
  const fine = usePointerFine();
  const reduce = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const active = fine && !reduce;

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 12);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 12);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={active ? { x: sx, y: sy } : undefined}
      className={className}
    >
      {children}
    </motion.a>
  );
}
