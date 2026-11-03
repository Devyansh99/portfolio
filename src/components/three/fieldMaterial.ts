import * as THREE from "three";

export const vertexShader = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aSeed;
attribute float aTint;

uniform float uMix;
uniform float uTime;
uniform float uTerrain;
uniform float uDpr;
uniform float uSize;
uniform float uDent;
uniform vec2 uCursor;
uniform vec2 uImpact;
uniform float uImpactT;

varying float vActive;
varying float vTint;

void main() {
  float m = smoothstep(0.0, 1.0, clamp(uMix * 1.4 - aSeed * 0.4, 0.0, 1.0));
  vec3 p = mix(aFrom, aTo, m);
  vTint = aTint * uTerrain;
  float hot = 0.0;

  if (uTerrain > 0.001) {
    vec2 q = p.xz * 0.35 + vec2(0.0, uTime * 0.15);
    float rough = (sin(q.x * 3.1 + q.y * 2.3) + sin(q.x * 1.7 - q.y * 4.1 + 1.3)) * 0.06;
    vec2 dc = p.xz - uCursor;
    float dent = exp(-dot(dc, dc) * 1.8);
    float t = uTime - uImpactT;
    float d = length(p.xz - uImpact);
    float ring = exp(-pow(d - t * 3.0, 2.0) * 6.0) * exp(-1.5 * max(t, 0.0)) * step(0.0, t);
    p.y += uTerrain * (rough - uDent * 0.55 * dent + ring * 0.35);
    hot = uTerrain * clamp(dent * uDent + ring, 0.0, 1.0);
  }

  vActive = hot;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uDpr * clamp(9.0 / -mv.z, 0.6, 1.9) * (1.0 + hot * 0.8);
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uField;
uniform vec3 uMint;
uniform vec3 uAmber;
uniform float uOpacity;

varying float vActive;
varying float vTint;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float dist = length(c);
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.15, dist) * uOpacity;
  vec3 col = mix(uField, uMint, vActive);
  col = mix(col, uAmber, vTint);
  gl_FragColor = vec4(col, alpha);
}
`;

export function createFieldUniforms() {
  return {
    uMix: { value: 1 },
    uTime: { value: 0 },
    uTerrain: { value: 1 },
    uDpr: { value: 1 },
    uSize: { value: 1.7 },
    uDent: { value: 0 },
    uOpacity: { value: 0 },
    uCursor: { value: new THREE.Vector2(0, -2) },
    uImpact: { value: new THREE.Vector2(0, -2) },
    uImpactT: { value: -100 },
    uField: { value: new THREE.Color("#8c9690") },
    uMint: { value: new THREE.Color("#3dffb0") },
    uAmber: { value: new THREE.Color("#ffb547") },
  };
}
