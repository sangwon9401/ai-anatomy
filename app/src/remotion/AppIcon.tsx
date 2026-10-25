import type { FC } from "react";
import { AbsoluteFill } from "remotion";

// Launcher icon art. Adaptive icons crop to the middle ~66%, so the mark stays inside that.
type Layer = "fg" | "bg" | "full" | "splash";

const Grid: FC<{ size: number }> = ({ size }) => (
  <AbsoluteFill
    style={{
      backgroundColor: "#fbfcfe",
      backgroundImage:
        "linear-gradient(#cfdcec 3px, transparent 3px), linear-gradient(90deg, #cfdcec 3px, transparent 3px), linear-gradient(#e6edf6 2px, transparent 2px), linear-gradient(90deg, #e6edf6 2px, transparent 2px)",
      backgroundSize: `${size / 4}px ${size / 4}px, ${size / 4}px ${size / 4}px, ${size / 16}px ${size / 16}px, ${size / 16}px ${size / 16}px`,
      backgroundPosition: `${size / 8}px ${size / 8}px`,
    }}
  />
);

const Mark: FC<{ size: number; scale: number }> = ({ size, scale }) => {
  const w = size * 0.56 * scale;
  return (
    <AbsoluteFill style={{ display: "grid", placeItems: "center" }}>
      <div style={{ position: "relative", width: w, height: w * 0.5, rotate: "-4deg" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#ffe35a",
            borderRadius: `${w * 0.07}px ${w * 0.11}px ${w * 0.08}px ${w * 0.1}px`,
            display: "grid",
            placeItems: "center",
            fontFamily: "IBM Plex Sans KR, sans-serif",
            fontWeight: 700,
            fontSize: w * 0.38,
            letterSpacing: "-0.02em",
            color: "#1c2a4a",
          }}
        >
          AI
        </div>
        <svg viewBox="0 0 100 50" style={{ position: "absolute", left: "-12%", top: "-22%", width: "124%", height: "144%", overflow: "visible" }}>
          <path
            d="M 9 14 C 22 -2, 86 -3, 96 20 C 103 38, 30 52, 7 34 C -2 26, 12 6, 58 3"
            fill="none"
            stroke="#d93b3b"
            strokeWidth={3.6}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const AppIcon: FC<{ layer: Layer; size: number }> = ({ layer, size }) => (
  <AbsoluteFill>
    {layer !== "fg" && <Grid size={size} />}
    {layer !== "bg" && <Mark size={size} scale={layer === "fg" ? 0.62 : layer === "splash" ? 0.34 : 1} />}
  </AbsoluteFill>
);
