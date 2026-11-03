import { mulberry32 } from "@/lib/rng";

function project(x: number, z: number) {
  const d = 7 - z;
  return { sx: 50 + (x / d) * 70, sy: 38 + (2.4 / d) * 70, d };
}

function buildPaths() {
  const r = mulberry32(9);
  const near: string[] = [];
  const far: string[] = [];
  const lane: string[] = [];
  const cols = 48;
  const rows = 32;
  for (let row = 0; row < rows; row++) {
    for (let c = 0; c < cols; c++) {
      const x = -7 + (14 * (c + r())) / cols;
      const z = -16 + (20 * (row + r())) / rows;
      const { sx, sy, d } = project(x, z);
      const seg = `M${sx.toFixed(2)} ${sy.toFixed(2)}h0`;
      (d < 9 ? near : far).push(seg);
    }
  }
  for (let k = 0; k < 14; k++) {
    for (let s = 0; s < 4; s++) {
      const z = -16 + (20 * (k + s / 8)) / 14;
      const { sx, sy } = project(0, z);
      lane.push(`M${sx.toFixed(2)} ${sy.toFixed(2)}h0`);
    }
  }
  return { near: near.join(""), far: far.join(""), lane: lane.join("") };
}

const paths = buildPaths();

export function FieldPoster({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
    >
      <path
        d={paths.far}
        stroke="var(--field)"
        strokeWidth="0.28"
        strokeLinecap="round"
        opacity="0.7"
        fill="none"
      />
      <path
        d={paths.near}
        stroke="var(--field)"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={paths.lane}
        stroke="var(--amber)"
        strokeWidth="0.55"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
