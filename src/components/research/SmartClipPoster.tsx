import { mulberry32 } from "@/lib/rng";

function buildProfile() {
  const r = mulberry32(23);
  let road = "";
  let accel = "";
  for (let i = 0; i <= 120; i++) {
    const x = (i / 120) * 300;
    const bowl =
      Math.exp(-(((x - 90) / 14) ** 2)) * 26 + Math.exp(-(((x - 220) / 11) ** 2)) * 18;
    road += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${(70 + bowl).toFixed(1)} `;
    accel += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${(140 - bowl * 1.3 + (r() - 0.5) * 3).toFixed(1)} `;
  }
  return { road, accel };
}

const shape = buildProfile();

export function SmartClipPoster() {
  return (
    <svg
      viewBox="0 0 300 180"
      className="h-full w-full"
      role="img"
      aria-label="Road profile with two potholes, the sensor trace below it, and a recording buffer around the first pothole"
    >
      <path d={shape.road} fill="none" stroke="var(--paper-ink)" strokeWidth="1.4" />
      <path d={shape.accel} fill="none" stroke="var(--paper-muted)" strokeWidth="1" />
      <rect
        x="62"
        y="34"
        width="56"
        height="74"
        fill="none"
        stroke="var(--stamp)"
        strokeWidth="1.4"
        strokeDasharray="4 3"
      />
      <rect x="236" y="22" width="46" height="18" fill="var(--stamp)" opacity="0.85" />
      <text x="241" y="34" fontSize="8" fill="var(--paper)" fontFamily="monospace">
        7 s clip
      </text>
    </svg>
  );
}
