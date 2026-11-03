import type { SceneId } from "@/data/sections";
import { gauss, mulberry32, type Rand } from "@/lib/rng";

export type ShapeId = string;

type Builder = (n: number, r: Rand) => Float32Array;

const TERRAIN_X = 7;
const TERRAIN_Z0 = -16;
const TERRAIN_Z1 = 4;

function out(n: number) {
  return new Float32Array(n * 3);
}

function put(a: Float32Array, i: number, x: number, y: number, z: number) {
  a[i * 3] = x;
  a[i * 3 + 1] = y;
  a[i * 3 + 2] = z;
}

const terrain: Builder = (n, r) => {
  const a = out(n);
  const lane = Math.floor(n * 0.03);
  for (let i = 0; i < lane; i++) {
    const seg = (i / lane) * 14;
    const k = Math.floor(seg);
    const f = seg - k;
    const z = TERRAIN_Z0 + (TERRAIN_Z1 - TERRAIN_Z0) * ((k + f * 0.5) / 14);
    put(a, i, (r() - 0.5) * 0.06, 0, z);
  }
  const m = n - lane;
  const cols = Math.ceil(Math.sqrt(m * 0.7));
  const rows = Math.ceil(m / cols);
  for (let j = 0; j < m; j++) {
    const c = j % cols;
    const row = Math.floor(j / cols);
    const x = -TERRAIN_X + 2 * TERRAIN_X * ((c + r()) / cols);
    const z =
      TERRAIN_Z0 + (TERRAIN_Z1 - TERRAIN_Z0) * ((row + r()) / rows) ** 0.7;
    put(a, lane + j, x, 0, z);
  }
  return a;
};

const cloud: Builder = (n, r) => {
  const a = out(n);
  for (let i = 0; i < n; i++) {
    const x = gauss(r);
    const y = gauss(r);
    const z = gauss(r);
    const len = Math.hypot(x, y, z) || 1;
    const rad = 1.6 + r() * 0.8;
    put(a, i, (x / len) * rad, (y / len) * rad * 0.8, (z / len) * rad);
  }
  return a;
};

const drift: Builder = (n, r) => {
  const a = out(n);
  for (let i = 0; i < n; i++) {
    put(a, i, (r() - 0.5) * 18, (r() - 0.5) * 8, -6 + r() * 8);
  }
  return a;
};

const flatline: Builder = (n, r) => {
  const a = out(n);
  for (let i = 0; i < n; i++) {
    const x = (r() - 0.5) * 16;
    const pulse = 0.9 * Math.exp(-((x / 0.35) ** 2)) * Math.sin(x * 8);
    put(a, i, x, pulse + (r() - 0.5) * 0.05, (r() - 0.5) * 0.4);
  }
  return a;
};

const BOWLS: [number, number][] = [
  [-1, -1.5],
  [0.8, 0.2],
  [-0.2, 2],
];

const sadakvision: Builder = (n, r) => {
  const a = out(n);
  const roadCount = Math.floor(n * 0.6);
  for (let i = 0; i < roadCount; i++) {
    const x = (r() - 0.5) * 4.4;
    const z = (r() - 0.5) * 6;
    let y = 0;
    for (const [cx, cz] of BOWLS) {
      y -= 0.35 * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / 0.18);
    }
    put(a, i, x, y - 0.4, z);
  }
  const sx = 0.9;
  const sy = 0.5;
  for (let i = roadCount; i < n; i++) {
    const [cx, cz] = BOWLS[i % 3];
    const edge = Math.floor(r() * 12);
    const t = r() - 0.5;
    const hx = sx / 2;
    const hy = sy / 2;
    let x = 0;
    let y = 0;
    let z = 0;
    if (edge < 4) {
      x = t * sx;
      y = edge & 1 ? hy : -hy;
      z = edge & 2 ? hx : -hx;
    } else if (edge < 8) {
      y = t * sy;
      x = edge & 1 ? hx : -hx;
      z = edge & 2 ? hx : -hx;
    } else {
      z = t * sx;
      x = edge & 1 ? hx : -hx;
      y = edge & 2 ? hy : -hy;
    }
    put(a, i, cx + x, y + 0.2, cz + z);
  }
  return a;
};

const cognalytix: Builder = (n, r) => {
  const a = out(n);
  const heights: number[] = [];
  const hr = mulberry32(31);
  for (let i = 0; i < 36; i++) heights.push(0.4 + hr() * 2);
  for (let i = 0; i < n; i++) {
    const cell = Math.floor(r() * 36);
    const cx = cell % 6;
    const cz = Math.floor(cell / 6);
    const h = heights[cell];
    const y = r() * h;
    const u = (r() - 0.5) * 0.44;
    const side = Math.floor(r() * 4);
    let dx = 0;
    let dz = 0;
    if (side === 0) {
      dx = u;
      dz = -0.22;
    } else if (side === 1) {
      dx = u;
      dz = 0.22;
    } else if (side === 2) {
      dx = -0.22;
      dz = u;
    } else {
      dx = 0.22;
      dz = u;
    }
    put(a, i, (cx - 2.5) * 0.75 + dx, y - 1.2, (cz - 2.5) * 0.75 + dz);
  }
  return a;
};

const acadika: Builder = (n, r) => {
  const a = out(n);
  for (let i = 0; i < n; i++) {
    const k = i % 8;
    const ang = (k / 7 - 0.5) * 2.2;
    const u = r() * 2;
    const v = (r() - 0.5) * 2.4;
    put(
      a,
      i,
      u * Math.cos(ang) - 0.8,
      v + 0.15 * Math.sin(u * 3),
      u * Math.sin(ang),
    );
  }
  return a;
};

const higan: Builder = (n, r) => {
  const a = out(n);
  for (let i = 0; i < n; i++) {
    const t = r();
    const x = -3.2 + 6.4 * t + 0.25 * Math.cos(t * 22);
    const y = 0.5 * Math.sin(t * 22) + 0.35 * Math.sin(t * 7.3);
    put(a, i, x, y + (r() - 0.5) * 0.06, (r() - 0.5) * 0.3);
  }
  return a;
};

const adaptivebandit: Builder = (n, r) => {
  const a = out(n);
  const means = [-0.6, 0.9, 0.1, -1, 0.5];
  for (let i = 0; i < n; i++) {
    const k = i % 5;
    put(
      a,
      i,
      (k - 2) * 1.1 + (r() - 0.5) * 0.5,
      means[k] + gauss(r) * 0.45,
      (r() - 0.5) * 0.5,
    );
  }
  return a;
};

const glioblastoma: Builder = (n, r) => {
  const a = out(n);
  for (let i = 0; i < n; i++) {
    const k = i % 12;
    const rad = 1.6 * Math.sin((Math.PI * (k + 0.8)) / 13.6) ** 0.6;
    const y = (k - 5.5) * 0.28;
    const denseSlice = k > 3 && k < 9;
    if (denseSlice && r() < 0.35) {
      const ang = r() * Math.PI * 2;
      const rr = Math.sqrt(r()) * 0.5;
      put(a, i, 0.4 + rr * Math.cos(ang), y, 0.2 + rr * Math.sin(ang));
    } else {
      const ang = r() * Math.PI * 2;
      const rr = Math.sqrt(r()) * rad;
      put(a, i, rr * Math.cos(ang), y, rr * Math.sin(ang));
    }
  }
  return a;
};

const BUILDINGS: [number, number, number, number][] = [
  [-2.6, 1.4, 1, 1.1],
  [0, 2.0, 1.1, 1.1],
  [2.6, 1.1, 1, 1.1],
];

const dorm: Builder = (n, r) => {
  const a = out(n);
  for (let i = 0; i < n; i++) {
    const roll = r();
    if (roll < 0.5) {
      const [bx, h, w, d] = BUILDINGS[i % 3];
      const face = Math.floor(r() * 3);
      let x = (r() - 0.5) * w;
      let y = r() * h;
      let z = (r() - 0.5) * d;
      if (face === 0) z = z > 0 ? d / 2 : -d / 2;
      else if (face === 1) x = x > 0 ? w / 2 : -w / 2;
      else y = r() > 0.5 ? h : 0;
      put(a, i, bx + x, y - 1, z);
    } else if (roll < 0.7) {
      put(a, i, (r() - 0.5) * 7, (r() - 0.5) * 2, 1.6);
    } else if (roll < 0.8) {
      put(a, i, gauss(r) * 0.3, gauss(r) * 0.3 - 0.2, 3 + gauss(r) * 0.3);
    } else {
      const s = Math.floor(r() * 2);
      const t = r();
      const x0 = BUILDINGS[s][0];
      const x1 = BUILDINGS[s + 1][0];
      put(a, i, x0 + (x1 - x0) * t, -0.4, 0);
    }
  }
  return a;
};

const builders: Record<string, Builder> = {
  terrain,
  cloud,
  drift,
  flatline,
  sadakvision,
  cognalytix,
  acadika,
  higan,
  adaptivebandit,
  glioblastoma,
  "digital-dorm-war": dorm,
};

const cache = new Map<number, Record<string, Float32Array>>();

export function buildShapes(side: number): Record<string, Float32Array> {
  const hit = cache.get(side);
  if (hit) return hit;
  const n = side * side;
  const result: Record<string, Float32Array> = {};
  let seed = 101;
  for (const [id, build] of Object.entries(builders)) {
    result[id] = build(n, mulberry32(seed++));
  }
  cache.set(side, result);
  return result;
}

export function buildSeeds(n: number): Float32Array {
  const r = mulberry32(5);
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) s[i] = r();
  return s;
}

export function buildTints(n: number): Float32Array {
  const t = new Float32Array(n);
  const lane = Math.floor(n * 0.03);
  for (let i = 0; i < lane; i++) t[i] = 1;
  return t;
}

export function shapeForSection(
  section: SceneId,
  project: string | null,
  narrow: boolean,
): ShapeId {
  switch (section) {
    case "hero":
      return "terrain";
    case "projects":
      return narrow ? "drift" : (project && builders[project] ? project : "cloud");
    case "contact":
      return "flatline";
    default:
      return "drift";
  }
}
