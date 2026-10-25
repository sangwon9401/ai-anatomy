import type { CSSProperties, FC } from "react";
import { useCurrentFrame } from "remotion";
import { ACC_PCT, ACC_RIGHT, HIDDEN_MAX, PATCH, PATCH_VALUES, SHOWN_HIDDEN, THREE_OUT, ch26 } from "../data/ch26";
import { DIGIT3_PNG, HIDDEN_MASKS, SAMPLE_PNGS } from "../data/part2-mnist";
import { Caption, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "./kit";
import { ArrowLine, Banner, FullSvg } from "./part2-kit";

const tl = buildTimeline(ch26);
const S = byId(tl);
const L = ch26.labels;

/** a box whose ink is a PNG's alpha, painted with a colour token */
const masked = (png: string, color: string): CSSProperties => ({
  background: color,
  WebkitMaskImage: `url(${png})`,
  maskImage: `url(${png})`,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
});

// s1 layout
const DIG = { x: 64, y: 240, s: 504 };
const CELL = DIG.s / 28;
const ZOOM = { x: 618, y: 300, c: 96 };

// s2 network layout
const COLS = { in: 290, hid: 560, out: 830 };
const IN_N = 7;
const inY = (i: number) => 330 + i * 82;
const hidY = (i: number) => 310 + i * 80;
const outY = (k: number) => 300 + k * 64;

export const Ch26Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1O = beat(frame, S.s1, 0.1, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2O = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const s3O = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const s4O = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const s5O = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const s6O = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7O = beat(frame, S.s7, 0.3, 0.5);
  const probs = THREE_OUT.probs;
  const pMax = Math.max(...probs);
  const flow = beat(frame, S.s2, 1.2, 2.0, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: a digit is 784 numbers */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1O }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 50, fontWeight: 700 }}>{L.title}</div>
          <Hand x={470} y={130} fs={36} color="var(--ink-3)">
            ({L.mnist})
          </Hand>
          <div style={{ position: "absolute", left: DIG.x, top: DIG.y, width: DIG.s, height: DIG.s, borderRadius: 8, border: "4px solid var(--ink)", background: "var(--paper)", boxSizing: "content-box" }}>
            <div style={{ position: "absolute", inset: 0, ...masked(DIGIT3_PNG, "var(--ink)"), opacity: beat(frame, S.s1, 0.3, 0.6) }} />
          </div>
          <FullSvg>
            <g opacity={beat(frame, S.s1, 1.6, 0.6) * 0.9}>
              {Array.from({ length: 29 }, (_, i) => (
                <g key={i}>
                  <line x1={DIG.x + i * CELL + 4} y1={DIG.y + 4} x2={DIG.x + i * CELL + 4} y2={DIG.y + DIG.s + 4} stroke="var(--grid-major)" strokeWidth={1.5} />
                  <line x1={DIG.x + 4} y1={DIG.y + i * CELL + 4} x2={DIG.x + DIG.s + 4} y2={DIG.y + i * CELL + 4} stroke="var(--grid-major)" strokeWidth={1.5} />
                </g>
              ))}
            </g>
            {/* the zoomed patch, marked on the digit */}
            <rect
              x={DIG.x + 4 + PATCH.col * CELL}
              y={DIG.y + 4 + PATCH.row * CELL}
              width={PATCH.n * CELL}
              height={PATCH.n * CELL}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={5}
              opacity={beat(frame, S.s1, 3.0, 0.4)}
            />
            <path
              d={`M ${DIG.x + 4 + (PATCH.col + PATCH.n) * CELL} ${DIG.y + 4 + PATCH.row * CELL} L ${ZOOM.x} ${ZOOM.y}`}
              stroke="var(--pen)"
              strokeWidth={3}
              strokeDasharray="8 8"
              opacity={beat(frame, S.s1, 3.4, 0.4)}
            />
          </FullSvg>
          <div style={{ opacity: beat(frame, S.s1, 3.6, 0.5) }}>
            {PATCH_VALUES.map((row, r) =>
              row.map((v, c) => (
                <div
                  key={`${r}-${c}`}
                  style={{
                    position: "absolute",
                    left: ZOOM.x + c * ZOOM.c,
                    top: ZOOM.y + r * ZOOM.c,
                    width: ZOOM.c,
                    height: ZOOM.c,
                    border: "2px solid var(--grid-major)",
                    boxSizing: "border-box",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 30,
                    fontWeight: 700,
                    color: v > 0.5 ? "var(--paper)" : "var(--ink)",
                    background: `color-mix(in srgb, var(--ink) ${Math.round(v * 100)}%, var(--paper))`,
                  }}
                >
                  {v.toFixed(2)}
                </div>
              )),
            )}
            <Hand x={ZOOM.x} y={ZOOM.y - 56} fs={38}>
              {L.zoom}
            </Hand>
          </div>
          <div style={{ position: "absolute", left: DIG.x, width: DIG.s + 8, top: DIG.y + DIG.s + 28, textAlign: "center", fontSize: 44, fontWeight: 700, opacity: beat(frame, S.s1, 2.0, 0.4) }}>{L.grid}</div>
          <Hand x={ZOOM.x - 10} y={ZOOM.y + 4 * ZOOM.c + 24} fs={42} style={{ opacity: beat(frame, S.s1, 5.2, 0.4) }}>
            {L.scale}
          </Hand>
        </div>
      )}

      {/* s2: 784 → 64 → 10 */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2O }}>
          <div style={{ position: "absolute", left: 64, top: 140, width: 130, height: 130, borderRadius: 8, border: "3px solid var(--ink)", background: "var(--paper)" }}>
            <div style={{ position: "absolute", inset: 0, ...masked(DIGIT3_PNG, "var(--ink)") }} />
          </div>
          <FullSvg>
            <ArrowLine x1={200} y1={205} x2={COLS.in - 40} y2={inY(0) - 10} w={4} head={12} color="var(--ink-3)" />
            {Array.from({ length: IN_N }, (_, i) =>
              SHOWN_HIDDEN.map((_, j) => <line key={`a${i}-${j}`} x1={COLS.in} y1={inY(i)} x2={COLS.hid} y2={hidY(j)} stroke="var(--ink-3)" strokeWidth={1.5} opacity={0.5} />),
            )}
            {SHOWN_HIDDEN.map((_, j) =>
              probs.map((__, k) => <line key={`b${j}-${k}`} x1={COLS.hid} y1={hidY(j)} x2={COLS.out} y2={outY(k)} stroke="var(--ink-3)" strokeWidth={1.5} opacity={0.5} />),
            )}
            {Array.from({ length: IN_N }, (_, i) => (
              <circle key={`i${i}`} cx={COLS.in} cy={inY(i)} r={22} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
            ))}
            {SHOWN_HIDDEN.map(([, v], j) => (
              <g key={`h${j}`}>
                <circle cx={COLS.hid} cy={hidY(j)} r={26} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={4} />
                <circle cx={COLS.hid} cy={hidY(j)} r={22} fill="var(--hl-yellow)" opacity={flow * (v / HIDDEN_MAX)} />
              </g>
            ))}
            {probs.map((p, k) => (
              <g key={`o${k}`}>
                <circle cx={COLS.out} cy={outY(k)} r={24} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={4} />
                <circle cx={COLS.out} cy={outY(k)} r={20} fill="var(--hl-mint)" opacity={beat(frame, S.s2, 3.4, 0.6) * Math.min(1, p / pMax + 0.04)} />
              </g>
            ))}
          </FullSvg>
          {probs.map((_, k) => (
            <div key={k} style={{ position: "absolute", left: COLS.out + 36, top: outY(k) - 22, fontFamily: "var(--font-mono)", fontSize: 34, fontWeight: 700 }}>
              {k}
            </div>
          ))}
          <div style={{ position: "absolute", left: COLS.in - 30, top: inY(IN_N - 1) + 30, fontSize: 40, fontWeight: 700, color: "var(--ink-3)" }}>⋮</div>
          <div style={{ position: "absolute", left: COLS.hid - 10, top: hidY(7) + 30, fontSize: 40, fontWeight: 700, color: "var(--ink-3)" }}>⋮</div>
          {[
            { x: COLS.in, t: L.inputs },
            { x: COLS.hid, t: L.hidden },
            { x: COLS.out + 20, t: L.outputs },
          ].map((c) => (
            <div key={c.t} style={{ position: "absolute", left: c.x - 130, width: 260, top: 950, textAlign: "center", fontSize: 34, fontWeight: 700 }}>
              {c.t}
            </div>
          ))}
          <Hand x={COLS.hid - 150} y={1000} fs={34} color="var(--ink-3)" style={{ width: 300, textAlign: "center" }}>
            {L.drawn}
          </Hand>
          <Hand x={380} y={170} fs={42} style={{ opacity: beat(frame, S.s2, 4.4, 0.4) }}>
            {L.on} · {L.relu}
          </Hand>
        </div>
      )}

      {/* s3: probabilities */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3O }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700 }}>{L.probTitle}</div>
          <div style={{ position: "absolute", left: 830, top: 116, width: 150, height: 150, borderRadius: 8, border: "3px solid var(--ink)", background: "var(--paper)" }}>
            <div style={{ position: "absolute", inset: 0, ...masked(DIGIT3_PNG, "var(--ink)") }} />
          </div>
          {probs.map((p, k) => {
            const y = 300 + k * 68;
            const g = beat(frame, S.s3, 0.8 + k * 0.08, 0.8, EASE_IO);
            const hot = k === 3 || k === 5;
            return (
              <div key={k}>
                <div style={{ position: "absolute", left: 90, width: 60, top: y - 4, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700, color: k === 3 ? "var(--pen)" : "var(--ink)" }}>{k}</div>
                <div style={{ position: "absolute", left: 170, top: y + 6, width: 660, height: 38, borderRadius: 19, background: "var(--paper-2)" }} />
                <div style={{ position: "absolute", left: 170, top: y + 6, width: Math.max(4, p * 660 * g), height: 38, borderRadius: 19, background: k === 3 ? "var(--hl-yellow)" : k === 5 ? "var(--hl-sky)" : "var(--ink-3)" }} />
                <div style={{ position: "absolute", left: 850, top: y, fontFamily: "var(--font-mono)", fontSize: 34, fontWeight: hot ? 700 : 500, color: hot ? "var(--ink)" : "var(--ink-2)", opacity: beat(frame, S.s3, 2.0, 0.4) }}>
                  {(p * 100).toFixed(1)}%
                </div>
              </div>
            );
          })}
          <Hand x={270} y={300 + 5 * 68 - 4} fs={42} style={{ opacity: beat(frame, S.s3, 4.4, 0.4) }}>
            ← {L.confuse}
          </Hand>
        </div>
      )}

      {/* s4: trained on MNIST */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4O }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 52, fontWeight: 700 }}>{L.trainTitle}</div>
          {SAMPLE_PNGS.map((png, k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: 110 + (k % 5) * 180,
                top: 260 + Math.floor(k / 5) * 200,
                width: 150,
                height: 150,
                borderRadius: 10,
                border: "3px solid var(--ink-3)",
                background: "var(--paper)",
                boxSizing: "border-box",
                opacity: beat(frame, S.s4, 0.5 + k * 0.12, 0.3),
              }}
            >
              <div style={{ position: "absolute", inset: 4, ...masked(png, "var(--ink)") }} />
            </div>
          ))}
          <Banner text={L.loop} y={730} fs={44} color="var(--hl-mint)" o={beat(frame, S.s4, 3.6, 0.4)} />
          <Hand x={0} y={830} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 5.0, 0.4) }}>
            ↻ {L.batch}
          </Hand>
        </div>
      )}

      {/* s5: test accuracy */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5O }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontSize: 50, fontWeight: 700 }}>{L.test}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 150, fontWeight: 700, opacity: beat(frame, S.s5, 1.0, 0.5) }}>
            <span style={{ background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 24, padding: "0 30px" }}>{ACC_PCT}%</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", fontSize: 46, fontWeight: 500, opacity: beat(frame, S.s5, 2.4, 0.4) }}>
            10,000 → <b style={{ fontFamily: "var(--font-mono)" }}>{ACC_RIGHT.toLocaleString("en-US")}</b>
            {L.right}
          </div>
          <Hand x={0} y={740} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 4.0, 0.4) }}>
            {L.measured}
          </Hand>
        </div>
      )}

      {/* s6: what hidden neurons look for */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6O }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 52, fontWeight: 700 }}>{L.seeTitle}</div>
          {HIDDEN_MASKS.map((m, k) => {
            const x = 70 + k * 240;
            return (
              <div key={m.unit} style={{ opacity: beat(frame, S.s6, 0.6 + k * 0.4, 0.4) }}>
                <div style={{ position: "absolute", left: x, top: 300, width: 220, height: 220, borderRadius: 14, border: "4px solid var(--ink)", background: "var(--paper)", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, ...masked(m.pos, "var(--ink)") }} />
                  <div style={{ position: "absolute", inset: 0, ...masked(m.neg, "var(--pen)") }} />
                </div>
                <div style={{ position: "absolute", left: x, width: 228, top: 536, textAlign: "center", fontSize: 32, color: "var(--ink-2)" }}>
                  {L.neuron} {m.unit + 1}
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 100, top: 640, display: "grid", gap: 18, fontSize: 38, fontWeight: 500, opacity: beat(frame, S.s6, 2.6, 0.4) }}>
            <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 44, height: 44, borderRadius: 8, background: "var(--ink)" }} /> {L.plus}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 44, height: 44, borderRadius: 8, background: "var(--pen)" }} /> {L.minus}
            </span>
          </div>
          <Hand x={0} y={880} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.6, 0.5), rotate: "-2deg" }}>
            {L.self}
          </Hand>
        </div>
      )}

      {/* s7 */}
      {frame >= S.s7.from && (
        <div style={{ opacity: s7O }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontSize: 60, fontWeight: 700 }}>{L.go}</div>
          <Hand x={0} y={540} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 1.6, 0.4) }}>
            ↓ {L.down}
          </Hand>
          <div style={{ position: "absolute", left: 440, top: 660, width: 200, height: 200, borderRadius: 16, border: "4px dashed var(--ink-3)", opacity: beat(frame, S.s7, 2.4, 0.4) }}>
            <div style={{ position: "absolute", inset: 10, ...masked(DIGIT3_PNG, "var(--pen)"), opacity: mix(0, 1, beat(frame, S.s7, 2.8, 1.0)) }} />
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch26.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
