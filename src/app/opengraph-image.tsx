import { ImageResponse } from "next/og";

export const alt = "Devyansh Agarwal, AI engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#05070a",
          color: "#d7e0dc",
          border: "2px solid #3dffb0",
        }}
      >
        <div style={{ fontSize: 28, color: "#6f807a", letterSpacing: 4 }}>
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#3dffb0",
              lineHeight: 1,
            }}
          >
            Devyansh Agarwal
          </div>
          <div style={{ fontSize: 40, marginTop: 24, color: "#ffb547" }}>
            AI Engineer · CS & AI at Plaksha University
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#6f807a" }}>
          Projects · Research · Experience
        </div>
      </div>
    ),
    size,
  );
}
