import type { FC, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { CODES, HEART, NEIGHBORS, RGB, ch06 } from "../../../data/ch06";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "../../../scenes/kit";

const tl = buildTimeline(ch06);
const S = byId(tl);
const L = ch06.labels;

const CELL = 72;
const GX = 540 - (CELL * 10) / 2;
const GY = 190;
const gray = (v: number) => `rgb(${v} ${v} ${v})`;
const WAVE = (x: number) => 620 - 150 * Math.sin((x - 80) / 70) * Math.cos((x - 80) / 230) - 40 * Math.sin((x - 80) / 23);
const wavePath = (from: number, to: number) =>
  Array.from({ length: 120 }, (_, i) => from + ((to - from) * i) / 119)
    .map((x, i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${WAVE(x).toFixed(1)}`)
    .join(" ");
const NUM_X = (code: number) => 100 + ((code - 31000) / 8000) * 880;
const SAMPLE_X = (i: number) => 80 + i * 36.8;
// the loudest sample in each third of the wave gets a number
const PEAKS = [0, 9, 18].map((start) =>
  Array.from({ length: 8 }, (_, k) => start + k).reduce((best, i) => (Math.abs(620 - WAVE(SAMPLE_X(i))) > Math.abs(620 - WAVE(SAMPLE_X(best))) ? i : best), start),
);

const Tile: FC<{ x: number; label: string; nums: string; o: number; numO: number; children: ReactNode }> = ({ x, label, nums, o, numO, children }) => (
  <div style={{ opacity: o, translate: `0px ${mix(30, 0, o)}px` }}>
    <div style={{ position: "absolute", left: x, top: 330, width: 280, height: 280, borderRadius: 24, border: "4px solid var(--ink)", background: "var(--paper)", overflow: "hidden", display: "grid", placeItems: "center" }}>
      {children}
    </div>
    <div style={{ position: "absolute", left: x, width: 280, top: 630, textAlign: "center", fontSize: 42, fontWeight: 700 }}>{label}</div>
    <div style={{ position: "absolute", left: x - 10, width: 300, top: 700, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)", opacity: numO }}>
      {nums}
    </div>
  </div>
);

export const Ch06Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const tilesOut = 1 - beat(frame, S.s2, 0, 0.5);
  const zoom = beat(frame, S.s2, 0.4, 1.4, EASE_IO);
  const gridOn = beat(frame, S.s2, 0.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.5));
  const gridDim = mix(1, 0.08, beat(frame, S.s3, 0.2, 0.5));
  const rgbOn = beat(frame, S.s3, 0.6, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const waveOn = beat(frame, S.s4, 0.4, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const codesOn = 1 - beat(frame, S.s6, 0, 0.5);
  const lineOn = 1 - beat(frame, S.s7, 0, 0.5);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: three kinds of data */}
      {frame < S.s2.from + 20 && (
        <div style={{ opacity: tilesOut }}>
          <Tile x={60} label={L.photo} nums="255, 60, 0, …" o={beat(frame, S.s1, 0.4, 0.5)} numO={beat(frame, S.s1, 2.6, 0.5)}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 22px)" }}>
              {HEART.flat().map((v, i) => (
                <div key={i} style={{ width: 22, height: 22, background: gray(v) }} />
              ))}
            </div>
          </Tile>
          <Tile x={400} label={L.song} nums="0.31, −0.12, …" o={beat(frame, S.s1, 0.8, 0.5)} numO={beat(frame, S.s1, 3.0, 0.5)}>
            <svg width={240} height={160} viewBox="80 470 920 300">
              <path d={wavePath(80, 1000)} fill="none" stroke="var(--ink)" strokeWidth={14} strokeLinecap="round" />
            </svg>
          </Tile>
          <Tile x={740} label={L.letter} nums={String(CODES[0].code)} o={beat(frame, S.s1, 1.2, 0.5)} numO={beat(frame, S.s1, 3.4, 0.5)}>
            <div style={{ fontSize: 170, fontWeight: 700 }}>{CODES[0].ch}</div>
          </Tile>
        </div>
      )}

      {/* s2–s3: zoom into pixels */}
      {frame >= S.s2.from && frame < S.s4.from + 20 && (
        <div style={{ opacity: gridOn }}>
          <div style={{ position: "absolute", left: GX, top: GY, width: CELL * 10, height: CELL * 10, scale: String(mix(0.32, 1, zoom)), opacity: gridDim }}>
            {HEART.map((row, r) =>
              row.map((v, c) => (
                <div
                  key={`${r}-${c}`}
                  style={{
                    position: "absolute",
                    left: c * CELL,
                    top: r * CELL,
                    width: CELL,
                    height: CELL,
                    background: gray(v),
                    outline: "1px solid rgb(180 190 205)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 21,
                    color: v < 128 ? "rgb(240 244 250)" : "rgb(28 42 74)",
                  }}
                >
                  <span style={{ opacity: beat(frame, S.s2, 2.2 + (r + c) * 0.04, 0.3) }}>{v}</span>
                </div>
              )),
            )}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 950, display: "flex", justifyContent: "center", gap: 40, fontSize: 34, fontWeight: 500, opacity: beat(frame, S.s2, 3.4, 0.4) * gridDim }}>
            <span>
              <span style={{ display: "inline-block", width: 30, height: 30, background: gray(0), verticalAlign: "-4px", marginRight: 10, borderRadius: 4 }} />
              {L.black}
            </span>
            <span>
              <span style={{ display: "inline-block", width: 30, height: 30, background: gray(255), border: "2px solid var(--ink-3)", verticalAlign: "-4px", marginRight: 10, borderRadius: 4 }} />
              {L.white}
            </span>
          </div>
          <Hand x={GX + CELL * 10 - 120} y={GY - 70} fs={44} style={{ opacity: beat(frame, S.s2, 1.6, 0.4) * gridDim }}>
            {L.pixel}
          </Hand>

          {/* s3: one colour pixel = three numbers */}
          <div style={{ opacity: rgbOn }}>
            <div style={{ position: "absolute", left: 110, top: 280, width: 860, height: 700, borderRadius: 28, background: "var(--paper)", border: "3px solid var(--line)" }} />
            {[
              { name: L.red, v: RGB.r, c: "rgb(229 72 77)" },
              { name: L.green, v: RGB.g, c: "rgb(56 176 112)" },
              { name: L.blue, v: RGB.b, c: "rgb(64 132 230)" },
            ].map((ch, i) => {
              const a = beat(frame, S.s3, 1.0 + i * 0.4, 0.5);
              return (
                <div key={ch.name} style={{ opacity: a }}>
                  <div style={{ position: "absolute", left: 150, top: 320 + i * 130, width: 140, fontSize: 40, fontWeight: 700 }}>{ch.name}</div>
                  <div style={{ position: "absolute", left: 300, top: 330 + i * 130, width: 450, height: 50, borderRadius: 25, background: "var(--paper-2)", border: "3px solid var(--ink)" }} />
                  <div style={{ position: "absolute", left: 300, top: 330 + i * 130, width: (450 * ch.v * a) / 255, height: 50, borderRadius: 25, background: ch.c }} />
                  <div style={{ position: "absolute", left: 770, top: 326 + i * 130, fontFamily: "var(--font-mono)", fontSize: 44 }}>{ch.v}</div>
                </div>
              );
            })}
            <div
              style={{
                position: "absolute",
                left: 440,
                top: 740,
                width: 200,
                height: 200,
                borderRadius: 30,
                background: `rgb(${RGB.r} ${RGB.g} ${RGB.b})`,
                border: "5px solid var(--ink)",
                opacity: beat(frame, S.s3, 2.6, 0.5),
                scale: String(mix(0.6, 1, beat(frame, S.s3, 2.6, 0.5))),
              }}
            />
            <Hand x={680} y={810} fs={48} style={{ opacity: beat(frame, S.s3, 3.2, 0.4) }}>
              {L.mixed}
            </Hand>
          </div>
        </div>
      )}

      {/* s4: sound = samples */}
      {frame >= S.s4.from && frame < S.s5.from + 20 && (
        <div style={{ opacity: waveOn }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={70} y1={620} x2={1010} y2={620} stroke="var(--ink-3)" strokeWidth={3} strokeDasharray="8 10" />
            <path d={wavePath(80, 1000)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s4, 0.5, 1.2)} fill="none" stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" />
            {Array.from({ length: 26 }, (_, i) => {
              const x = 80 + i * 36.8;
              const o = beat(frame, S.s4, 2.0 + i * 0.06, 0.2);
              return (
                <g key={i} opacity={o}>
                  <line x1={x} y1={620} x2={x} y2={WAVE(x)} stroke="var(--pen)" strokeWidth={4} />
                  <circle cx={x} cy={WAVE(x)} r={9} fill="var(--pen)" />
                </g>
              );
            })}
          </svg>
          {PEAKS.map((i) => {
            const x = 80 + i * 36.8;
            const v = (620 - WAVE(x)) / 190;
            return (
              <div key={i} style={{ position: "absolute", left: x - 70, width: 140, top: WAVE(x) + (v > 0 ? -70 : 26), textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 500, opacity: beat(frame, S.s4, 3.6, 0.4) }}>
                {v >= 0 ? v.toFixed(2) : `−${Math.abs(v).toFixed(2)}`}
              </div>
            );
          })}
          <Hand x={300} y={920} fs={54} style={{ opacity: beat(frame, S.s4, 4.4, 0.4), rotate: "-2deg" }}>
            {L.second}
          </Hand>
        </div>
      )}

      {/* s5: letters have numbers */}
      {frame >= S.s5.from && frame < S.s6.from + 20 && (
        <div style={{ opacity: codesOn }}>
          {CODES.map((c, i) => {
            const a = beat(frame, S.s5, 0.5 + i * 0.9, 0.5);
            const x = 90 + i * 310;
            return (
              <div key={c.ch} style={{ opacity: a, translate: `0px ${mix(30, 0, a)}px` }}>
                <div style={{ position: "absolute", left: x, top: 330, width: 280, height: 280, borderRadius: 24, border: "4px solid var(--ink)", background: "var(--paper)", display: "grid", placeItems: "center", fontSize: 180, fontWeight: 700 }}>
                  {c.ch}
                </div>
                <div style={{ position: "absolute", left: x, width: 280, top: 640, textAlign: "center", fontSize: 30, color: "var(--ink-3)" }}>↓</div>
                <Chip text={String(c.code)} color="yellow" fs={50} x={x + 140 - (String(c.code).length * 29 + 45) / 2} y={700} style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s5, 1.0 + i * 0.9, 0.4) }} />
              </div>
            );
          })}
          <Hand x={320} y={880} fs={52} style={{ opacity: beat(frame, S.s5, 3.8, 0.4) }}>
            {L.unicode}
          </Hand>
        </div>
      )}

      {/* s6: numbers carry no meaning */}
      {frame >= S.s6.from && frame < S.s7.from + 20 && (
        <div style={{ opacity: lineOn }}>
          <div style={{ position: "absolute", left: 100, top: 698, width: 880 * beat(frame, S.s6, 0.4, 0.8), height: 6, background: "var(--ink)", borderRadius: 3 }} />
          {[31000, 33000, 35000, 37000, 39000].map((t) => (
            <div key={t} style={{ opacity: beat(frame, S.s6, 1.0, 0.4) }}>
              <div style={{ position: "absolute", left: NUM_X(t) - 2, top: 688, width: 4, height: 26, background: "var(--ink)" }} />
              <div style={{ position: "absolute", left: NUM_X(t) - 70, width: 140, top: 730, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--ink-3)" }}>{t}</div>
            </div>
          ))}
          {NEIGHBORS.map((n, i) => {
            const x = NUM_X(n.code);
            const up = n.ch !== "虫";
            const a = beat(frame, S.s6, 1.4 + i * 0.35, 0.4);
            return (
              <div key={n.ch} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: x - 12, top: 689, width: 24, height: 24, borderRadius: "50%", background: n.ch === "虹" ? "var(--hl-yellow)" : "var(--paper)", border: "4px solid var(--ink)" }} />
                <div style={{ position: "absolute", left: x - 2, top: up ? 600 : 712, width: 4, height: 88, background: "var(--ink-3)" }} />
                <div style={{ position: "absolute", left: x - 70, width: 140, top: up ? 500 : 800, textAlign: "center" }}>
                  <div style={{ fontSize: 60, fontWeight: 700 }}>{n.ch}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--ink-2)" }}>{n.code}</div>
                </div>
              </div>
            );
          })}
          <Hand x={70} y={420} fs={44} style={{ opacity: beat(frame, S.s6, 3.2, 0.4) }}>
            {L.near}
          </Hand>
          <Hand x={760} y={960} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, S.s6, 4.0, 0.4) }}>
            {L.far}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontSize: 52, fontWeight: 700, opacity: beat(frame, S.s6, 4.8, 0.5) }}>{L.nameTag}</div>
        </div>
      )}

      {/* s7: what AI needs instead */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <Chip text={L.apple} color="pink" fs={64} x={110} y={500} />
          <div style={{ position: "absolute", left: 330, top: 500, fontSize: 80, fontWeight: 700, color: "var(--ink-3)" }}>→</div>
          {Array.from({ length: 12 }, (_, i) => {
            const h = 30 + Math.abs(Math.sin(i * 1.7 + 0.4)) * 150;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 470 + i * 46,
                  top: 600 - h * beat(frame, S.s7, 0.8 + i * 0.06, 0.4),
                  width: 34,
                  height: h * beat(frame, S.s7, 0.8 + i * 0.06, 0.4),
                  background: i % 2 ? "var(--hl-sky)" : "var(--hl-mint)",
                  borderRadius: "8px 8px 2px 2px",
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontSize: 54, fontWeight: 700, opacity: beat(frame, S.s7, 2.0, 0.5) }}>{L.vector}</div>
          <Hand x={360} y={790} fs={48} style={{ opacity: beat(frame, S.s7, 3.2, 0.4) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch06.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
