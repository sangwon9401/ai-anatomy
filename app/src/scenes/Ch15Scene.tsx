import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { FIT, MATH, TOOLS, ch15, stats } from "../data/ch15";
import { Caption, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "./kit";

const tl = buildTimeline(ch15);
const S = byId(tl);
const L = ch15.labels;

const PANELS = [
  { xs: MATH, label: L.math, x0: 90, color: "var(--hl-sky)", ...stats(MATH) },
  { xs: FIT, label: L.fit, x0: 590, color: "var(--hl-mint)", ...stats(FIT) },
];
const BW = 64;
const GAP = 16;
const RAW_PX = 4; // px per point, same for both tests so the size mismatch shows
const Z_PX = 110;
const sgn = (v: number, digits = 0) => (Math.abs(v) < 1e-9 ? "0" : `${v > 0 ? "+" : "−"}${Math.abs(v).toFixed(digits)}`);
// s5: a vector's numbers growing layer by layer
const STRIP = Array.from({ length: 22 }, (_, i) => Math.sin(i * 1.9 + 0.5) * 0.8 + Math.sin(i * 0.6) * 0.3);
const GROWTH = [1, 1.7, 2.9, 4.9];

export const Ch15Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const panelsOn = 1 - beat(frame, S.s5, 0, 0.5);
  const center = beat(frame, S.s2, 0.6, 1.4, EASE_IO);
  const scale = beat(frame, S.s3, 0.8, 1.4, EASE_IO);
  const base = mix(860, 620, center);
  const layersOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const fix = beat(frame, S.s5, 4.2, 1.2, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s5.from + 15 && (
        <div style={{ opacity: panelsOn }}>
          {PANELS.map((p, pi) => (
            <div key={p.label}>
              <div style={{ position: "absolute", left: p.x0, width: 5 * BW + 4 * GAP, top: 150, textAlign: "center", fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s1, 0.3 + pi * 0.4, 0.4) }}>{p.label}</div>
              <div style={{ position: "absolute", left: p.x0 - 10, top: base - 2, width: 5 * BW + 4 * GAP + 20, height: 5, background: "var(--ink)" }} />
              {p.xs.map((x, i) => {
                const raw = x * RAW_PX;
                const dev = (x - p.mean) * RAW_PX;
                const z = ((x - p.mean) / p.sd) * Z_PX;
                const h = mix(mix(raw, dev, center), z, scale) * beat(frame, S.s1, 0.6 + pi * 0.4 + i * 0.08, 0.6);
                const top = h >= 0 ? base - h : base;
                const label = scale > 0.5 ? sgn((x - p.mean) / p.sd, 1) : center > 0.5 ? sgn(x - p.mean) : String(x);
                const star = i === 4 && frame >= S.s4.from;
                return (
                  <div key={i}>
                    <div style={{ position: "absolute", left: p.x0 + i * (BW + GAP), top, width: BW, height: Math.abs(h), background: star ? "var(--hl-yellow)" : p.color, borderRadius: h >= 0 ? "10px 10px 2px 2px" : "2px 2px 10px 10px" }} />
                    <div style={{ position: "absolute", left: p.x0 + i * (BW + GAP) - 20, width: BW + 40, top: h >= 0 ? top - 44 : base + Math.abs(h) + 6, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28 }}>
                      {star ? <InlineCircle p={beat(frame, S.s4, 0.8 + pi * 0.6, 0.6)} pad={8}>{label}</InlineCircle> : label}
                    </div>
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: p.x0, width: 5 * BW + 4 * GAP, top: 230, textAlign: "center", fontSize: 30, color: "var(--ink-2)", opacity: beat(frame, S.s2, 1.8, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
                {L.mean} {p.mean}
              </div>
              <div style={{ position: "absolute", left: p.x0, width: 5 * BW + 4 * GAP, top: 230, textAlign: "center", fontSize: 30, color: "var(--ink-2)", opacity: beat(frame, S.s3, 0.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
                ÷ {L.sd} {p.sd}
              </div>
            </div>
          ))}
          <Hand x={330} y={940} fs={50} style={{ opacity: beat(frame, S.s1, 2.6, 0.4) * (1 - beat(frame, S.s2, 0, 0.3)) }}>
            {L.hard}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s2, 0.3, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>{L.step1}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s3, 0.3, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>{L.step2}</div>
          <Hand x={40} y={base - 22} fs={34} color="var(--ink-2)" style={{ opacity: center * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            0
          </Hand>
          <Hand x={380} y={900} fs={56} style={{ opacity: beat(frame, S.s3, 3.0, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)), rotate: "-3deg" }}>
            {L.same}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontSize: 60, fontWeight: 700, opacity: beat(frame, S.s4, 3.6, 0.4) }}>{L.norm}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontSize: 38, lineHeight: 1.6, opacity: beat(frame, S.s4, 2.0, 0.4) }}>
            {L.m85} · {L.f17}
          </div>
        </div>
      )}

      {/* s5–s6: numbers drifting through layers, then normalised */}
      {frame >= S.s5.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: layersOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontSize: 46, fontWeight: 700 }}>{fix > 0.5 ? L.fix : L.grow}</div>
          {GROWTH.map((g, row) => {
            const y = 340 + row * 170;
            const amp = mix(g, 1, row === 0 ? 0 : fix);
            const o = beat(frame, S.s5, 0.6 + row * 0.6, 0.4);
            return (
              <div key={row} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: 60, top: y - 22, fontSize: 32, fontWeight: 700, color: "var(--ink-2)" }}>
                  {L.layer} {row + 1}
                </div>
                <div style={{ position: "absolute", left: 180, top: y, width: 820, height: 3, background: "var(--ink-3)" }} />
                {STRIP.map((v, i) => {
                  const h = Math.min(Math.abs(v) * 36 * amp, 78);
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: 190 + i * 36,
                        top: v > 0 ? y - h : y + 3,
                        width: 24,
                        height: h,
                        borderRadius: 4,
                        background: Math.abs(v) * 36 * amp > 78 ? "var(--pen)" : v > 0 ? "var(--hl-sky)" : "var(--hl-pink)",
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", opacity: beat(frame, S.s6, 0.4, 0.4) }}>
            <span style={{ fontSize: 44, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 20px" }}>{L.ln}</span>
          </div>
        </div>
      )}

      {/* s7: the whole toolbox */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontSize: 58, fontWeight: 700 }}>{L.done}</div>
          <div style={{ position: "absolute", left: 90, right: 90, top: 400, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
            {TOOLS.map((t, i) => (
              <span
                key={t}
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  padding: "8px 22px",
                  borderRadius: 14,
                  background: ["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)", "var(--hl-pink)", "var(--hl-violet)"][i % 5],
                  color: "var(--chip-ink)",
                  opacity: beat(frame, S.s7, 0.8 + i * 0.2, 0.3),
                  scale: String(mix(0.7, 1, beat(frame, S.s7, 0.8 + i * 0.2, 0.3))),
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch15.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
