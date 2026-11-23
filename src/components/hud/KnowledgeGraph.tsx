"use client";

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import type { Simulation, SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { projects } from "@/data/projects";
import { skillGroups, skillUsage } from "@/data/skills";
import { projectCodes as codes } from "@/data/codes";

type GNode = SimulationNodeDatum & {
  id: string;
  label: string;
  kind: "project" | "skill";
  deg: number;
};
type GLink = SimulationLinkDatum<GNode> & { key: string; skill: string; project: string };

const groupOf: Record<string, string> = {};
for (const g of skillGroups) for (const s of g.items) groupOf[s] = g.command.split(" ")[0];

const filters = [
  "all",
  ...skillGroups
    .map((g) => g.command.split(" ")[0])
    .filter((name) => Object.keys(skillUsage).some((s) => groupOf[s] === name)),
];

const titleOf = (id: string) => projects.find((p) => p.id === id)?.title ?? id;
const skillRadius = (deg: number) => 4 + deg * 1.2;

export function KnowledgeGraph() {
  const [filter, setFilter] = useState("all");
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<SVGGElement>(null);
  const nodeEls = useRef(new Map<string, SVGGElement>());
  const linkEls = useRef(new Map<string, SVGLineElement>());
  const positions = useRef(new Map<string, { x: number; y: number }>());
  const view = useRef({ x: 0, y: 0, k: 1 });
  const sim = useRef<Simulation<GNode, GLink> | null>(null);
  const simNodes = useRef<GNode[]>([]);
  const drag = useRef<{ node: GNode; moved: boolean } | null>(null);
  const pan = useRef<{ sx: number; sy: number; vx: number; vy: number } | null>(null);

  const graph = useMemo(() => {
    const skills = Object.keys(skillUsage).filter((s) => filter === "all" || groupOf[s] === filter);
    const used = new Set(skills.flatMap((s) => skillUsage[s]));
    const nodes: GNode[] = [
      ...projects
        .filter((p) => used.has(p.id))
        .map((p) => ({ id: p.id, label: p.title, kind: "project" as const, deg: 0 })),
      ...skills.map((s) => ({ id: s, label: s, kind: "skill" as const, deg: skillUsage[s].length })),
    ];
    const links: GLink[] = skills.flatMap((s) =>
      skillUsage[s].map((p) => ({ key: `${s}|${p}`, source: s, target: p, skill: s, project: p })),
    );
    const near = new Map<string, Set<string>>();
    for (const n of nodes) near.set(n.id, new Set([n.id]));
    for (const l of links) {
      near.get(l.skill)?.add(l.project);
      near.get(l.project)?.add(l.skill);
    }
    return { nodes, links, near };
  }, [filter]);

  const applyView = () => {
    const v = view.current;
    viewRef.current?.setAttribute("transform", `translate(${v.x},${v.y}) scale(${v.k})`);
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const narrow = box.width < 600;
    const scale = narrow ? 0.75 : 1;
    const width = box.width / scale;
    const height = box.height / scale;
    const f = narrow ? 0.7 : 1;
    view.current = { x: 0, y: 0, k: scale };
    applyView();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes: GNode[] = graph.nodes.map((n) => ({ ...n, ...positions.current.get(n.id) }));
    const links: GLink[] = graph.links.map((l) => ({ ...l }));
    simNodes.current = nodes;

    const draw = () => {
      for (const n of nodes) {
        n.x = Math.max(24, Math.min(width - 24, n.x ?? 0));
        n.y = Math.max(20, Math.min(height - 20, n.y ?? 0));
        const el = nodeEls.current.get(n.id);
        if (!el) continue;
        el.setAttribute("transform", `translate(${n.x ?? 0},${n.y ?? 0})`);
        const label = el.lastElementChild;
        const r = n.kind === "project" ? 13 : skillRadius(n.deg);
        const flip = (n.x ?? 0) > width * 0.6;
        label?.setAttribute("x", String(flip ? -(r + 5) : r + 5));
        label?.setAttribute("text-anchor", flip ? "end" : "start");
        positions.current.set(n.id, { x: n.x ?? 0, y: n.y ?? 0 });
      }
      for (const l of links) {
        const el = linkEls.current.get(l.key);
        const s = l.source as GNode;
        const t = l.target as GNode;
        if (!el) continue;
        el.setAttribute("x1", String(s.x ?? 0));
        el.setAttribute("y1", String(s.y ?? 0));
        el.setAttribute("x2", String(t.x ?? 0));
        el.setAttribute("y2", String(t.y ?? 0));
      }
    };

    const s = forceSimulation(nodes)
      .force(
        "link",
        forceLink<GNode, GLink>(links)
          .id((d) => d.id)
          .distance((l) => (75 + (1 - Math.min(skillUsage[l.skill].length, 6) / 6) * 45) * f)
          .strength(0.35),
      )
      .force("charge", forceManyBody<GNode>().strength((d) => (d.kind === "project" ? -650 : -190) * f))
      .force("center", forceCenter(width / 2 - (narrow ? 30 : 50), height / 2))
      .force("collide", forceCollide<GNode>((d) => (d.kind === "project" ? 30 : skillRadius(d.deg) + 12) * f))
      .force("x", forceX(width / 2 - (narrow ? 30 : 50)).strength(0.06))
      .force("y", forceY(height / 2).strength(0.09))
      .on("tick", draw);

    if (still) {
      s.stop();
      s.tick(300);
      draw();
    }
    sim.current = s;
    return () => {
      s.stop();
    };
  }, [graph]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(
      () => svg.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }),
      250,
    );
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = svg.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const v = view.current;
      const k = Math.max(0.4, Math.min(3, v.k * Math.exp(-e.deltaY * 0.002)));
      v.x = px - ((px - v.x) * k) / v.k;
      v.y = py - ((py - v.y) * k) / v.k;
      v.k = k;
      applyView();
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.clearTimeout(t);
      svg.removeEventListener("wheel", onWheel);
    };
  }, []);

  const zoomBy = (f: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const v = view.current;
    const k = Math.max(0.4, Math.min(3, v.k * f));
    v.x = r.width / 2 - ((r.width / 2 - v.x) * k) / v.k;
    v.y = r.height / 2 - ((r.height / 2 - v.y) * k) / v.k;
    v.k = k;
    applyView();
  };

  const resetView = () => {
    const w = svgRef.current?.getBoundingClientRect().width ?? 800;
    view.current = { x: 0, y: 0, k: w < 600 ? 0.75 : 1 };
    applyView();
    sim.current?.alpha(0.5).restart();
  };

  const toGraph = (e: ReactPointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    const v = view.current;
    return { x: (e.clientX - r.left - v.x) / v.k, y: (e.clientY - r.top - v.y) / v.k };
  };

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    const id = (e.target as Element).closest("[data-id]")?.getAttribute("data-id");
    const node = id ? simNodes.current.find((n) => n.id === id) : undefined;
    if (node) {
      const p = toGraph(e);
      node.fx = p.x;
      node.fy = p.y;
      drag.current = { node, moved: false };
      sim.current?.alphaTarget(0.3).restart();
      e.currentTarget.setPointerCapture(e.pointerId);
    } else if (e.pointerType === "mouse") {
      const v = view.current;
      pan.current = { sx: e.clientX, sy: e.clientY, vx: v.x, vy: v.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (drag.current) {
      const p = toGraph(e);
      drag.current.node.fx = p.x;
      drag.current.node.fy = p.y;
      drag.current.moved = true;
    } else if (pan.current) {
      view.current.x = pan.current.vx + e.clientX - pan.current.sx;
      view.current.y = pan.current.vy + e.clientY - pan.current.sy;
      applyView();
    }
  };

  const onPointerUp = () => {
    if (drag.current) {
      const { node, moved } = drag.current;
      if (!moved) setPinned((p) => (p === node.id ? null : node.id));
      node.fx = null;
      node.fy = null;
      sim.current?.alphaTarget(0);
      drag.current = null;
    } else if (pan.current) {
      const moved =
        Math.abs(view.current.x - pan.current.vx) + Math.abs(view.current.y - pan.current.vy) > 3;
      if (!moved) setPinned(null);
      pan.current = null;
    }
  };

  const focus = pinned ?? hover;
  const near = focus ? graph.near.get(focus) : undefined;
  const focusNode = focus ? graph.nodes.find((n) => n.id === focus) : undefined;
  const linked = focus ? [...(near ?? [])].filter((id) => id !== focus) : [];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFilter(f);
              setPinned(null);
            }}
            className={`border px-2.5 py-1 transition-colors ${
              filter === f ? "border-mint text-mint" : "border-line text-muted hover:border-mint/60 hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto flex gap-1">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => zoomBy(1 / 1.25)}
            className="size-7 border border-line text-muted hover:border-mint hover:text-mint"
          >
            −
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => zoomBy(1.25)}
            className="size-7 border border-line text-muted hover:border-mint hover:text-mint"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Reset view"
            onClick={resetView}
            className="size-7 border border-line text-muted hover:border-mint hover:text-mint"
          >
            ⟲
          </button>
        </span>
      </div>

      <svg
        ref={svgRef}
        role="group"
        aria-label="Graph linking each project to the skills it uses"
        className="block h-[26rem] w-full cursor-grab touch-pan-y border border-line bg-bg active:cursor-grabbing sm:h-[32rem]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <g ref={viewRef}>
          <g>
            {graph.links.map((l) => {
              const on = focus !== null && (l.skill === focus || l.project === focus);
              return (
                <line
                  key={l.key}
                  ref={(el) => {
                    if (el) linkEls.current.set(l.key, el);
                    else linkEls.current.delete(l.key);
                  }}
                  style={{
                    stroke: on
                      ? focusNode?.kind === "project"
                        ? "var(--amber)"
                        : "var(--mint)"
                      : "var(--line)",
                    strokeWidth: on ? 1.6 : 1,
                    opacity: focus && !on ? 0.35 : 1,
                  }}
                />
              );
            })}
          </g>
          <g>
            {graph.nodes.map((n) => {
              const dim = near !== undefined && !near.has(n.id);
              const isFocus = n.id === focus;
              const r = n.kind === "project" ? 13 : skillRadius(n.deg);
              return (
                <g
                  key={n.id}
                  data-id={n.id}
                  ref={(el) => {
                    if (el) nodeEls.current.set(n.id, el);
                    else nodeEls.current.delete(n.id);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={
                    n.kind === "project"
                      ? `${n.label}: ${graph.near.get(n.id)!.size - 1} skills`
                      : `${n.label}: used in ${skillUsage[n.id].map(titleOf).join(", ")}`
                  }
                  onPointerEnter={() => setHover(n.id)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPinned((p) => (p === n.id ? null : n.id));
                    }
                  }}
                  className="cursor-pointer outline-none transition-opacity duration-150"
                  style={{ opacity: dim ? 0.18 : 1, touchAction: "none" }}
                >
                  <circle
                    r={r}
                    style={
                      n.kind === "project"
                        ? { fill: "var(--surface-2)", stroke: "var(--amber)", strokeWidth: isFocus ? 2.5 : 1.5 }
                        : {
                            fill: isFocus ? "var(--mint)" : "var(--mint-dim)",
                            stroke: "var(--mint)",
                            strokeWidth: 1,
                          }
                    }
                  />
                  {n.kind === "project" && (
                    <text
                      textAnchor="middle"
                      dy={4}
                      className="pointer-events-none select-none font-mono text-[10px]"
                      style={{ fill: "var(--amber)" }}
                    >
                      {codes[n.id]}
                    </text>
                  )}
                  <text
                    x={r + 5}
                    dy={4}
                    className={`pointer-events-none select-none font-mono ${
                      n.kind === "project" ? "text-xs" : "text-[10.5px]"
                    }`}
                    style={{
                      fill: isFocus
                        ? n.kind === "project"
                          ? "var(--amber)"
                          : "var(--mint)"
                        : n.kind === "project"
                          ? "var(--ink)"
                          : "var(--muted)",
                    }}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      <p className="mt-2 min-h-10 text-xs text-muted" aria-live="polite">
        {focusNode ? (
          focusNode.kind === "project" ? (
            <>
              <span className="text-amber">
                {codes[focusNode.id]} {focusNode.label}
              </span>{" "}
              uses {linked.length} skills: {linked.join(", ")}{" "}
              <a href={`#creations/${focusNode.id}`} className="text-mint underline-offset-2 hover:underline">
                open project →
              </a>
            </>
          ) : (
            <>
              <span className="text-mint">{focusNode.label}</span> → {linked.map(titleOf).join(", ")}
            </>
          )
        ) : (
          "drag a node to pull it · click to pin · drag empty space to pan · ctrl + scroll or pinch to zoom"
        )}
      </p>
    </div>
  );
}
