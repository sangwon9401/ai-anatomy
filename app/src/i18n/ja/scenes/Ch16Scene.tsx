import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ch16 } from "../../../data/ch16";
import { NEURON, STORE_A, TUNED_LINE_W, neuron, num } from "../../../data/part2-toy";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";

const tl = buildTimeline(ch16);
const S = byId(tl);
const L = ch16.labels;

// ---- s1: a sketch of a nerve cell ----
const BODY: [number, number] = [540, 620];
const DENDRITES: [number, number][][] = [
  [[170, 330], [330, 420], [478, 568]],
  [[120, 600], [300, 590], [462, 610]],
  [[170, 900], [330, 800], [480, 676]],
  [[330, 250], [420, 400], [505, 548]],
  [[330, 1000], [430, 840], [508, 694]],
];
const qb = (p: [number, number][], t: number): [number, number] => {
  const u = 1 - t;
  return [u * u * p[0][0] + 2 * u * t * p[1][0] + t * t * p[2][0], u * u * p[0][1] + 2 * u * t * p[1][1] + t * t * p[2][1]];
};
const AXON_END = 900;

// ---- s2–s6: the artificial neuron ----
const ROWS = [380, 570, 760];
const BOX = { x: 64, w: 220, h: 128 };
const WX = 304; // weight chip left
const BALL_X = 548;
const N: [number, number] = [740, 570];
const NR = 100;
const W_FS = 38;
// the weight chips use the mono font: 0.6em per character
const monoChip = (t: string, fs: number) => [...t].length * 0.6 * fs + fs * 0.9;
const INPUTS = [
  { name: "辛さ", v: STORE_A.x[0], unit: L.spicyU, c: "var(--hl-orange)" },
  { name: "待ち", v: STORE_A.x[1], unit: L.lineU, c: "var(--hl-sky)" },
  { name: "値段", v: STORE_A.x[2], unit: L.priceU, c: "var(--hl-pink)" },
];
const SCORE0 = neuron(STORE_A.x, NEURON.w, NEURON.b);
const W_TUNED = [NEURON.w[0], TUNED_LINE_W, NEURON.w[2]];
const SCORE1 = neuron(STORE_A.x, W_TUNED, NEURON.b);

const wText = (w: number) => `× ${num(w)}`;
const VX = 590; // verdict chip left

const Ball: FC<{ x: number; y: number; text: string; o: number; color: string; r?: number }> = ({ x, y, text, o, color, r = 46 }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: color,
      border: "4px solid var(--ink)",
      boxSizing: "border-box",
      color: "var(--chip-ink)",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 38,
      fontWeight: 700,
      opacity: o,
      scale: String(mix(0.6, 1, o)),
    }}
  >
    {text}
  </div>
);

const Knob: FC<{ x: number; y: number; r: number; angle: number; o?: number }> = ({ x, y, r, angle, o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "var(--paper)", border: "4px solid var(--ink)", boxSizing: "border-box", opacity: o, rotate: `${angle}deg` }}>
    <div style={{ position: "absolute", left: r - 5, top: r * 0.14, width: 6, height: r * 0.6, borderRadius: 3, background: "var(--pen)" }} />
  </div>
);

// where the line from a product ball meets the neuron's rim
const rim = (y: number): [number, number] => {
  const dx = N[0] - BALL_X;
  const dy = N[1] - y;
  const d = Math.hypot(dx, dy);
  return [N[0] - (dx / d) * NR, N[1] - (dy / d) * NR];
};

export const Ch16Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const bioOn = 1 - beat(frame, S.s2, 0, 0.5);
  const netIn = beat(frame, S.s2, 0.3, 0.6);
  const netOut = 1 - beat(frame, S.s7, 0, 0.5);
  const factsOn = beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));

  // s6: the 줄 knob turns 1 → 1.5
  const turn = beat(frame, S.s6, 0.8, 1.4, EASE_IO);
  const tuned = turn > 0.5;
  const w = tuned ? W_TUNED : NEURON.w;
  const score = tuned ? SCORE1 : SCORE0;

  // s4: the products flow into the neuron, then the sum shows
  const flow = beat(frame, S.s4, 0.4, 1.2, EASE_IO);
  const sumShown = beat(frame, S.s4, 3.4, 0.4);
  const flow6 = beat(frame, S.s6, 2.4, 1.0, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: a nerve cell */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: bioOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 54, fontWeight: 700, opacity: beat(frame, S.s1, 0.2, 0.5) }}>{L.bio}</div>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {DENDRITES.map((d, i) => {
              const p = beat(frame, S.s1, 0.3 + i * 0.1, 0.7);
              const [tx, ty] = d[0];
              return (
                <g key={i} opacity={p > 0 ? 1 : 0}>
                  <path d={`M ${d[0][0]} ${d[0][1]} Q ${d[1][0]} ${d[1][1]} ${d[2][0]} ${d[2][1]}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke="var(--ink)" strokeWidth={9} strokeLinecap="round" />
                  <path d={`M ${tx} ${ty} l -46 -30 M ${tx} ${ty} l -50 22`} fill="none" stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" opacity={p} />
                </g>
              );
            })}
            <line x1={BODY[0] + 70} y1={BODY[1]} x2={mix(BODY[0] + 70, AXON_END, beat(frame, S.s1, 0.9, 0.6))} y2={BODY[1]} stroke="var(--ink)" strokeWidth={12} strokeLinecap="round" />
            <path
              d={`M ${AXON_END} ${BODY[1]} l 60 -60 M ${AXON_END} ${BODY[1]} l 76 0 M ${AXON_END} ${BODY[1]} l 60 60`}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={8}
              strokeLinecap="round"
              opacity={beat(frame, S.s1, 1.4, 0.3)}
            />
            <circle cx={BODY[0]} cy={BODY[1]} r={84} fill="var(--hl-violet)" stroke="var(--ink)" strokeWidth={7} opacity={beat(frame, S.s1, 0.1, 0.5)} />
            <circle cx={BODY[0]} cy={BODY[1]} r={84} fill="var(--hl-yellow)" opacity={beat(frame, S.s1, 3.4, 0.4) * (1 - beat(frame, S.s1, 4.4, 0.6))} />
            {/* incoming signals */}
            {DENDRITES.map((d, i) => {
              const t = beat(frame, S.s1, 1.6 + i * 0.25, 1.2, EASE_IO);
              if (t <= 0 || t >= 1) return null;
              const [x, y] = qb(d, t);
              return <circle key={`s${i}`} cx={x} cy={y} r={16} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} />;
            })}
            {/* outgoing signal */}
            {(() => {
              const t = beat(frame, S.s1, 4.0, 1.2, EASE_IO);
              if (t <= 0) return null;
              return <circle cx={mix(BODY[0] + 90, AXON_END + 50, t)} cy={BODY[1]} r={22} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={5} />;
            })()}
          </svg>
          <Hand x={64} y={190} fs={46} style={{ opacity: beat(frame, S.s1, 1.8, 0.4) }}>
            {L.dendrite}
          </Hand>
          <Hand x={590} y={716} fs={46} style={{ opacity: beat(frame, S.s1, 3.4, 0.4) }}>
            {L.body}
          </Hand>
          <Hand x={700} y={460} fs={46} style={{ opacity: beat(frame, S.s1, 4.8, 0.4) }}>
            {L.axon} →
          </Hand>
        </div>
      )}

      {/* s2–s6: the artificial neuron */}
      {frame >= S.s2.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: netIn * netOut }}>
          <div style={{ position: "absolute", left: 64, top: 128, fontSize: 52, fontWeight: 700 }}>{L.title}</div>
          <Chip text={L.store} color="yellow" fs={40} x={64} y={214} />
          <Hand x={64 + chipWidth(L.store, 40) + 24} y={218} fs={38} color="var(--ink-3)">
            {L.example}
          </Hand>

          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {ROWS.map((y, i) => {
              const p1 = beat(frame, S.s2, 1.2 + i * 0.3, 0.5);
              const p2 = beat(frame, S.s2, 2.2 + i * 0.3, 0.5);
              const [rx, ry] = rim(y);
              return (
                <g key={i}>
                  <line x1={BOX.x + BOX.w} y1={y} x2={mix(BOX.x + BOX.w, BALL_X, p1)} y2={y} stroke="var(--ink)" strokeWidth={5} opacity={p1 > 0 ? 1 : 0} />
                  <line x1={BALL_X} y1={y} x2={mix(BALL_X, rx, p2)} y2={mix(y, ry, p2)} stroke="var(--ink)" strokeWidth={5} opacity={p2 > 0 ? 1 : 0} />
                </g>
              );
            })}
            {/* bias line */}
            <line x1={N[0]} y1={N[1] - NR - 70} x2={N[0]} y2={N[1] - NR} stroke="var(--ink)" strokeWidth={5} opacity={beat(frame, S.s4, 1.6, 0.4)} />
            {/* output arrow */}
            {(() => {
              const p = beat(frame, S.s5, 0.2, 0.6);
              const x1 = N[0] + NR;
              const x2 = mix(x1, 862, p);
              return (
                <g opacity={p > 0 ? 1 : 0}>
                  <line x1={x1} y1={N[1]} x2={x2} y2={N[1]} stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" />
                  <path d={`M ${x2 - 18} ${N[1] - 14} L ${x2 + 2} ${N[1]} L ${x2 - 18} ${N[1] + 14}`} fill="none" stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })()}
            {/* s4: signals flowing into the neuron */}
            {ROWS.map((y, i) => {
              const t = i === 1 && frame >= S.s6.from ? flow6 : flow;
              if (t <= 0 || t >= 1) return null;
              const [rx, ry] = rim(y);
              return <circle key={`f${i}`} cx={mix(BALL_X, rx, t)} cy={mix(y, ry, t)} r={12} fill="var(--pen)" />;
            })}
          </svg>

          {INPUTS.map((inp, i) => {
            const o = beat(frame, S.s2, 0.6 + i * 0.3, 0.5);
            return (
              <div
                key={inp.name}
                style={{
                  position: "absolute",
                  left: BOX.x,
                  top: ROWS[i] - BOX.h / 2,
                  width: BOX.w,
                  height: BOX.h,
                  borderRadius: 18,
                  border: "4px solid var(--ink)",
                  background: "var(--paper)",
                  boxSizing: "border-box",
                  padding: "10px 18px",
                  opacity: o,
                  translate: `${mix(-30, 0, o)}px 0px`,
                }}
              >
                <div style={{ fontSize: 34, fontWeight: 700, color: "var(--ink-2)", lineHeight: 1.1 }}>{inp.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 56, fontWeight: 700, lineHeight: 1 }}>{inp.v}</span>
                  <span style={{ fontSize: 30, color: "var(--ink-2)" }}>{inp.unit}</span>
                </div>
              </div>
            );
          })}

          {/* s3: weights and products */}
          {ROWS.map((y, i) => {
            const o = beat(frame, S.s3, 0.4 + i * 0.4, 0.4);
            const t = wText(w[i]);
            const cw = monoChip(t, W_FS);
            return (
              <div key={`w${i}`}>
                <Chip text={t} color={null} fs={W_FS} x={WX} y={y - W_FS * 0.75} w={cw} style={{ fontFamily: "var(--font-mono)", opacity: o, background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)" }} />
                <Ball x={BALL_X} y={y} text={num(STORE_A.x[i] * w[i])} o={beat(frame, S.s3, 2.0 + i * 0.4, 0.4)} color={INPUTS[i].c} />
              </div>
            );
          })}
          <Hand x={WX} y={292} fs={42} style={{ opacity: beat(frame, S.s3, 3.6, 0.4) * (1 - beat(frame, S.s6, 0, 0.3)) }}>
            {L.weight}
          </Hand>
          <PenCircle x={WX - 18} y={ROWS[2] - 50} w={monoChip(wText(NEURON.w[2]), W_FS) + 36} h={100} p={beat(frame, S.s3, 5.0, 0.6) * (1 - beat(frame, S.s4, 0, 0.3))} />
          <Hand x={WX - 6} y={ROWS[2] + 62} fs={42} style={{ opacity: beat(frame, S.s3, 5.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            {L.minus}
          </Hand>

          {/* the neuron */}
          <div
            style={{
              position: "absolute",
              left: N[0] - NR,
              top: N[1] - NR,
              width: NR * 2,
              height: NR * 2,
              borderRadius: "50%",
              border: "6px solid var(--ink)",
              boxSizing: "border-box",
              background: sumShown > 0 ? (score >= 4 && turn >= 1 ? "var(--hl-mint)" : "var(--hl-yellow)") : "var(--paper-2)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 60,
              fontWeight: 700,
              color: sumShown > 0 ? "var(--chip-ink)" : "var(--ink-3)",
              opacity: beat(frame, S.s2, 0.8, 0.5),
            }}
          >
            {sumShown > 0 ? num(score) : "+"}
          </div>

          {/* s4: bias */}
          <Chip text={L.bias} color="violet" fs={38} x={N[0] - chipWidth(L.bias, 38) / 2} y={N[1] - NR - 70 - 57} style={{ opacity: beat(frame, S.s4, 1.4, 0.4) }} />
          <Hand x={N[0] + chipWidth(L.bias, 38) / 2 + 14} y={N[1] - NR - 124} fs={40} style={{ opacity: beat(frame, S.s4, 2.0, 0.4) }}>
            {L.biasNote}
          </Hand>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 890,
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 54,
              fontWeight: 500,
              opacity: beat(frame, S.s4, 2.6, 0.5),
            }}
          >
            {tuned ? (
              <>
                1.5 + <span style={{ color: "var(--pen)" }}>3</span> − 2 + 2 = <b>4.5</b>
              </>
            ) : (
              <>
                1.5 + 2 − 2 + <span style={{ background: "var(--hl-violet)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 8px" }}>2</span> = <b>3.5</b>
              </>
            )}
          </div>

          {/* s5: output and verdict */}
          <div style={{ position: "absolute", left: 884, top: N[1] - 40, fontFamily: "var(--font-mono)", fontSize: 56, fontWeight: 700, opacity: beat(frame, S.s5, 0.7, 0.4) }}>
            {num(score)}
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 34, fontWeight: 500 }}>{L.pt}</span>
          </div>
          <div style={{ position: "absolute", left: 80, width: 470, top: 994, textAlign: "right", fontFamily: "var(--font-hand)", fontSize: 50, color: "var(--pen)", opacity: beat(frame, S.s5, 1.4, 0.4) }}>{L.rule}</div>
          <Chip
            text={tuned ? L.yes : L.no}
            color={tuned ? "mint" : "pink"}
            fs={46}
            x={VX}
            y={990}
            style={{ fontWeight: 700, opacity: beat(frame, S.s5, 2.4, 0.4) }}
          />
          {tuned && <PenCircle x={VX - 24} y={970} w={chipWidth(L.yes, 46) + 48} h={110} p={beat(frame, S.s6, 4.0, 0.6)} />}

          {/* s6: turning the 줄 knob */}
          <Knob x={WX + 70} y={ROWS[1] - 80} r={30} angle={mix(-40, 40, turn)} o={beat(frame, S.s6, 0.3, 0.4)} />
          <Hand x={WX + 14} y={292} fs={42} style={{ opacity: beat(frame, S.s6, 0.4, 0.4) }}>
            <InlineCircle p={beat(frame, S.s6, 1.0, 0.6)} pad={10}>
              {L.turn}
            </InlineCircle>
          </Hand>
        </div>
      )}

      {/* s7: perceptron and GPT */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: factsOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontSize: 50, fontWeight: 700 }}>
            {L.formula}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", opacity: beat(frame, S.s7, 0.8, 0.4) }}>
            <span style={{ fontSize: 50, fontWeight: 700, background: "var(--hl-sky)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 24px" }}>{L.perceptron}</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", opacity: beat(frame, S.s7, 2.6, 0.4) }}>
            <span style={{ fontSize: 56, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 24px" }}>{L.gpt}</span>
          </div>
          <Hand x={0} y={770} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 4.0, 0.4) }}>
            {L.mostly}
          </Hand>
        </div>
      )}

      {/* s8: wrap-up */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontSize: 60, fontWeight: 700 }}>{L.end1}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 530, textAlign: "center", fontSize: 52, fontWeight: 500, opacity: beat(frame, S.s8, 1.2, 0.4) }}>{L.end2}</div>
          <Hand x={0} y={700} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 3.0, 0.5), rotate: "-2deg" }}>
            {L.weak}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch16.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
