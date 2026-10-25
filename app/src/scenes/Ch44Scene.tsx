import type { FC } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { AUTHORS, ROADMAP5, TIMELINE44, ch44 } from "../data/ch44";
import {
  Caption,
  Chip,
  EASE_IO,
  Hand,
  InlineCircle,
  Narration,
  Paper,
  PenCircle,
  PenUnderline,
  Tag,
  beat,
  buildTimeline,
  byId,
  chipWidth,
  mix,
  rowLayout,
  type SceneProps,
} from "./kit";
import { Center, MONO, Word } from "./part5-kit";

const tl = buildTimeline(ch44);
const S = byId(tl);
const L = ch44.labels;

// s2: author cards, 2 rows × 4
const CARD_W = 225;
const CARD_H = 76;
const CARD_X = rowLayout([CARD_W, CARD_W, CARD_W, CARD_W], 20);
const slot = (k: number): [number, number] => [CARD_X[k % 4], 400 + Math.floor(k / 4) * 104];
// where each name lands after the shuffle (a fixed permutation: "the order is random")
const SHUFFLE = [5, 2, 7, 0, 3, 6, 1, 4];

// s3–s5: the sentence, RNN cells above it, a GPU below the title
const WORDS = [L.w0, L.w1, L.w2, L.w3];
const WFS = 50;
const WW = WORDS.map((w) => chipWidth(w, WFS));
const WX = rowLayout(WW, 70);
const WC = WX.map((x, i) => x + WW[i] / 2);
const WORD_Y = 800;
const CELL_Y = 590;
const CELL_W = 150;
const CELL_H = 110;
const GPU = { x: 300, y: 170, cols: 8, rows: 3, s: 48, g: 12 };
const CORES = GPU.cols * GPU.rows;
const GPU_BOTTOM = GPU.y + GPU.rows * (GPU.s + GPU.g) - GPU.g + 20;
// which cores light for word i in the RNN run (one at a time)
const coreOf = (i: number) => 9 + i * 2;

export const Ch44Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const paperOut = 1 - beat(frame, S.s2, 0, 0.5);
  const namesOut = 1 - beat(frame, S.s3, 0, 0.5);
  const machineOut = 1 - beat(frame, S.s6, 0, 0.5);
  const shuffle = beat(frame, S.s2, 3.2, 1.4, EASE_IO);

  // s3: RNN reads one word per beat
  const rnnAt = (i: number) => beat(frame, S.s3, 1.2 + i * 1.3, 0.5);
  const rnnDone = (i: number) => beat(frame, S.s3, 1.2 + i * 1.3 + 1.0, 0.3);
  const cross = beat(frame, S.s4, 1.4, 0.8);
  const cellsDim = 1 - beat(frame, S.s4, 2.6, 0.6);
  const arcs = (k: number) => beat(frame, S.s4, 3.4 + k * 0.25, 0.6);
  const allOn = beat(frame, S.s5, 0.6, 0.5);
  const inS3 = frame >= S.s3.from && frame < S.s5.from;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the paper */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: paperOut }}>
          <div
            style={{
              position: "absolute",
              left: 170,
              top: 190,
              width: 740,
              height: 600,
              background: "var(--paper)",
              border: "3px solid var(--ink)",
              borderRadius: 10,
              boxShadow: "14px 16px 0 var(--grid-major)",
              rotate: "-1.5deg",
              opacity: beat(frame, S.s1, 0.2, 0.6),
              scale: String(mix(0.92, 1, beat(frame, S.s1, 0.2, 0.6))),
            }}
          >
            <div style={{ position: "absolute", left: 0, right: 0, top: 44, textAlign: "center", fontSize: 30, color: "var(--ink-3)" }}>{L.venue}</div>
            <div style={{ position: "absolute", left: 40, right: 40, top: 100, textAlign: "center", fontSize: 62, fontWeight: 700, lineHeight: 1.15 }}>
              {L.title1}
              <br />
              {L.title2}
            </div>
            {/* author line and abstract, drawn as grey bars */}
            <div style={{ position: "absolute", left: 70, right: 70, top: 290, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {AUTHORS.map((a) => (
                <span key={a} style={{ width: a.length * 11, height: 16, borderRadius: 8, background: "var(--ink-3)", opacity: 0.55 }} />
              ))}
            </div>
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <div key={r} style={{ position: "absolute", left: 90, width: r === 5 ? 330 : 560, top: 390 + r * 32, height: 12, borderRadius: 6, background: "var(--grid-major)" }} />
            ))}
          </div>
          <Chip text={L.year} color="yellow" fs={50} x={120} y={150} style={{ rotate: "-7deg", opacity: beat(frame, S.s1, 1.4, 0.4) }} />
          <Hand x={0} y={850} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.2, 0.5), rotate: "-1deg" }}>
            {L.motto}
          </Hand>
          <Center y={960} fs={36} weight={500} color="var(--ink-2)" o={beat(frame, S.s1, 2.4, 0.5)}>
            {L.google}
          </Center>
        </div>
      )}

      {/* s2: eight authors, order at random */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: namesOut }}>
          <Center y={240} fs={54} o={beat(frame, S.s2, 0.3, 0.5)}>
            {L.authors}
          </Center>
          {AUTHORS.map((a, i) => {
            const [x0, y0] = slot(i);
            const [x1, y1] = slot(SHUFFLE[i]);
            const o = beat(frame, S.s2, 0.6 + i * 0.18, 0.4);
            const lift = Math.sin(shuffle * Math.PI) * (i % 2 ? -40 : 40);
            return (
              <div
                key={a}
                style={{
                  position: "absolute",
                  left: mix(x0, x1, shuffle),
                  top: mix(y0, y1, shuffle) + lift,
                  width: CARD_W,
                  height: CARD_H,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  border: "3px solid var(--ink)",
                  background: "var(--paper)",
                  fontSize: 36,
                  fontWeight: 500,
                  opacity: o,
                  translate: `0px ${mix(16, 0, o)}px`,
                }}
              >
                {a}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontSize: 50, fontWeight: 700, opacity: beat(frame, S.s2, 4.6, 0.4) }}>
            {L.random}
          </div>
          <PenCircle x={262} y={660} w={556} h={124} p={beat(frame, S.s2, 5.0, 0.7)} />
          <Center y={800} fs={30} weight={400} color="var(--ink-2)" o={beat(frame, S.s2, 5.4, 0.5)}>
            {L.footnote}
          </Center>
          <Hand x={0} y={880} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 6.4, 0.5) }}>
            {L.equal}
          </Hand>
        </div>
      )}

      {/* s3–s5: RNN in a queue vs attention all at once */}
      {frame >= S.s3.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: machineOut * beat(frame, S.s3, 0, 0.5) }}>
          {/* GPU */}
          <div
            style={{
              position: "absolute",
              left: GPU.x - 24,
              top: GPU.y - 20,
              width: GPU.cols * (GPU.s + GPU.g) - GPU.g + 48,
              height: GPU.rows * (GPU.s + GPU.g) - GPU.g + 40,
              border: "3px solid var(--ink)",
              borderRadius: 18,
              background: "var(--paper)",
            }}
          />
          <div style={{ position: "absolute", left: GPU.x - 130, top: GPU.y + 60, width: 90, textAlign: "right", fontSize: 40, fontWeight: 700 }}>{L.gpu}</div>
          {Array.from({ length: CORES }, (_, k) => {
            const r = Math.floor(k / GPU.cols);
            const c = k % GPU.cols;
            let on = 0;
            if (inS3) WORDS.forEach((_, i) => k === coreOf(i) && (on = Math.max(on, rnnAt(i) * (1 - rnnDone(i)))));
            on = Math.max(on, allOn);
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: GPU.x + c * (GPU.s + GPU.g),
                  top: GPU.y + r * (GPU.s + GPU.g),
                  width: GPU.s,
                  height: GPU.s,
                  borderRadius: 8,
                  border: "2.5px solid var(--ink-3)",
                  background: on > 0.02 ? `color-mix(in srgb, var(--hl-yellow) ${Math.round(on * 100)}%, var(--paper-2))` : "var(--paper-2)",
                }}
              />
            );
          })}
          <Hand x={0} y={GPU_BOTTOM + 18} fs={44} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 3.0, 0.5) * (1 - beat(frame, S.s4, 0, 0.4)) }}>
            {L.wait}
          </Hand>
          <Hand x={0} y={GPU_BOTTOM + 14} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 1.6, 0.5), rotate: "-2deg" }}>
            {L.together}
          </Hand>

          {/* RNN cells */}
          {WORDS.map((w, i) => {
            const a = rnnAt(i);
            const x = WC[i] - CELL_W / 2;
            return (
              <div key={w} style={{ opacity: beat(frame, S.s3, 0.5, 0.5) * cellsDim }}>
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: CELL_Y,
                    width: CELL_W,
                    height: CELL_H,
                    borderRadius: 16,
                    border: "3.5px solid var(--ink)",
                    background: inS3 && a > 0 ? `color-mix(in srgb, var(--hl-sky) ${Math.round(a * (1 - rnnDone(i) * 0.6) * 100)}%, var(--paper))` : "var(--paper)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40,
                    fontWeight: 700,
                    color: inS3 && a * (1 - rnnDone(i) * 0.6) > 0.45 ? "var(--chip-ink)" : "var(--ink)",
                  }}
                >
                  {L.rnn}
                </div>
                <div style={{ position: "absolute", left: x, width: CELL_W, top: CELL_Y + CELL_H + 4, textAlign: "center", ...MONO, fontSize: 30, color: "var(--ink-2)", opacity: rnnDone(i) * (1 - beat(frame, S.s4, 0, 0.4)) }}>
                  {i + 1}
                </div>
                {i < WORDS.length - 1 && (
                  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                    <path
                      d={`M ${x + CELL_W + 8} ${CELL_Y + CELL_H / 2} L ${WC[i + 1] - CELL_W / 2 - 12} ${CELL_Y + CELL_H / 2}`}
                      stroke="var(--ink)"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${WC[i + 1] - CELL_W / 2 - 24} ${CELL_Y + CELL_H / 2 - 11} L ${WC[i + 1] - CELL_W / 2 - 10} ${CELL_Y + CELL_H / 2} L ${WC[i + 1] - CELL_W / 2 - 24} ${CELL_Y + CELL_H / 2 + 11}`}
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth={5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {/* reading arrow from the word up into its cell */}
                <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                  <line x1={WC[i]} y1={WORD_Y - 8} x2={WC[i]} y2={CELL_Y + CELL_H + 46} stroke="var(--ink-3)" strokeWidth={4} strokeDasharray="6 10" />
                </svg>
                {/* red-pen cross in s4 */}
                <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                  {[0, 1].map((d) => (
                    <path
                      key={d}
                      d={d === 0 ? `M ${x - 6} ${CELL_Y - 6} L ${x + CELL_W + 6} ${CELL_Y + CELL_H + 6}` : `M ${x + CELL_W + 6} ${CELL_Y - 6} L ${x - 6} ${CELL_Y + CELL_H + 6}`}
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - beat(frame, S.s4, 1.4 + i * 0.2 + d * 0.1, 0.4)}
                      stroke="var(--pen)"
                      strokeWidth={7}
                      strokeLinecap="round"
                      fill="none"
                      opacity={cross > 0 ? 1 : 0}
                    />
                  ))}
                </svg>
              </div>
            );
          })}
          {/* the note passed along the RNN */}
          {inS3 &&
            (() => {
              const t = interpolate(frame, [S.s3.from + 1.2 * 30, S.s3.from + (1.2 + 3 * 1.3 + 1.0) * 30], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const i = Math.min(3, Math.floor(t));
              const f = t - i;
              const x = i >= 3 ? WC[3] : mix(WC[i], WC[i + 1], EASE_IO(Math.max(0, (f - 0.6) / 0.4)));
              const o = beat(frame, S.s3, 1.2, 0.4) * (1 - beat(frame, S.s4, 0, 0.4));
              return (
                <div style={{ position: "absolute", left: x - 34, top: CELL_Y - 74, width: 68, height: 52, background: "var(--hl-yellow)", border: "2.5px solid var(--ink)", borderRadius: 6, rotate: "-6deg", opacity: o, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "var(--chip-ink)" }}>
                  {L.note}
                </div>
              );
            })()}
          <Hand x={70} y={CELL_Y - 120} fs={44} style={{ opacity: beat(frame, S.s3, 2.0, 0.5) * (1 - beat(frame, S.s4, 0, 0.4)) }}>
            {L.oneByOne} →
          </Hand>

          {/* s4: the question, then attention arcs between every pair */}
          <Center y={470} fs={46} o={beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.4))}>
            {L.ask}
          </Center>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {[
              [0, 1],
              [1, 2],
              [2, 3],
              [0, 2],
              [1, 3],
              [0, 3],
            ].map(([a, b], k) => {
              const p = arcs(k);
              const d = WC[b] - WC[a];
              const h = 40 + d * 0.32;
              return (
                <path
                  key={k}
                  d={`M ${WC[a]} ${WORD_Y - 4} Q ${(WC[a] + WC[b]) / 2} ${WORD_Y - 4 - h * 2} ${WC[b]} ${WORD_Y - 4}`}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  fill="none"
                  stroke="var(--pen)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  opacity={p > 0 ? 0.85 : 0}
                />
              );
            })}
          </svg>

          {/* the sentence */}
          {WORDS.map((w, i) => (
            <Word
              key={w}
              text={w}
              x={WX[i]}
              y={WORD_Y}
              fs={WFS}
              color={allOn > 0.5 ? "yellow" : inS3 && rnnAt(i) > 0.5 && rnnDone(i) < 0.5 ? "sky" : null}
              o={beat(frame, S.s3, 0.2 + i * 0.12, 0.4)}
            />
          ))}

          {/* s5: steps compared */}
          {frame >= S.s5.from && (
            <div style={{ opacity: beat(frame, S.s5, 2.4, 0.5) }}>
              {[
                { label: L.lineRnn, n: 4, txt: L.steps4, y: 930, c: "var(--hl-sky)" },
                { label: L.lineTf, n: 1, txt: L.steps1, y: 1010, c: "var(--hl-yellow)" },
              ].map((r, ri) => (
                <div key={r.label}>
                  <div style={{ position: "absolute", left: 56, width: 220, top: r.y, height: 56, display: "flex", alignItems: "center", justifyContent: "flex-end", fontSize: 38, fontWeight: 700 }}>{r.label}</div>
                  {Array.from({ length: r.n }, (_, k) => (
                    <div
                      key={k}
                      style={{
                        position: "absolute",
                        left: 300 + k * 136,
                        top: r.y,
                        width: 124 * beat(frame, S.s5, 2.6 + ri * 0.8 + k * 0.25, 0.3),
                        height: 56,
                        borderRadius: 10,
                        background: r.c,
                      }}
                    />
                  ))}
                  <div style={{ position: "absolute", left: 300 + r.n * 136 + 10, top: r.y + 4, ...MONO, fontSize: 36, opacity: beat(frame, S.s5, 3.0 + ri * 0.8, 0.3) }}>{r.txt}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* s6: the Transformer */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5)) }}>
          <Chip text={L.tf} color="yellow" fs={84} x={540 - chipWidth(L.tf, 84) / 2} y={230} style={{ scale: String(mix(0.7, 1, beat(frame, S.s6, 0.3, 0.6))) }} />
          <Center y={380} fs={46} weight={500} color="var(--ink-2)">
            {L.tfEn}
          </Center>
          {[L.fact1, L.fact2].map((f, i) => (
            <div key={f} style={{ position: "absolute", left: 120, top: 520 + i * 96, fontSize: 42, fontWeight: 500, opacity: beat(frame, S.s6, 2.0 + i * 1.6, 0.5), display: "flex", gap: 20, alignItems: "center" }}>
              <span style={{ color: "var(--pen)", fontFamily: "var(--font-hand)", fontSize: 54 }}>{L.ok}</span>
              {f}
            </div>
          ))}
          <PenUnderline x={190} y={580} w={700} p={beat(frame, S.s6, 2.6, 0.6)} />
          {/* the base model: 6 encoder + 6 decoder layers */}
          {[L.enc, L.dec].map((name, si) => {
            const cx = 540 + (si === 0 ? -170 : 170);
            return (
              <div key={name} style={{ opacity: beat(frame, S.s6, 5.0 + si * 0.4, 0.5) }}>
                {Array.from({ length: 6 }, (_, k) => (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      left: cx - 120,
                      top: 920 - k * 28,
                      width: 240,
                      height: 20,
                      borderRadius: 6,
                      background: si === 0 ? "var(--hl-sky)" : "var(--hl-mint)",
                      border: "2px solid var(--ink)",
                      opacity: beat(frame, S.s6, 5.0 + si * 0.4 + k * 0.08, 0.25),
                    }}
                  />
                ))}
                <div style={{ position: "absolute", left: cx - 150, width: 300, top: 954, textAlign: "center", fontSize: 34, fontWeight: 500 }}>{name}</div>
              </div>
            );
          })}
          <Hand x={0} y={1012} fs={40} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 6.0, 0.5) }}>
            {L.encNote}
          </Hand>
        </div>
      )}

      {/* s7: what came next */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: 1 - beat(frame, S.s8, 0, 0.5) }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={110} y1={410} x2={mix(110, 990, beat(frame, S.s7, 0.2, 1.2))} y2={410} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
          </svg>
          {TIMELINE44.map((t, i) => {
            const x = 130 + i * 205;
            const o = beat(frame, S.s7, 0.4 + i * 0.35, 0.4);
            return (
              <div key={t.year} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: x - 14, top: 396, width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "var(--hl-yellow)" : "var(--ink)", border: "4px solid var(--ink)", boxSizing: "border-box" }} />
                <div style={{ position: "absolute", left: x - 90, width: 180, top: 330, textAlign: "center", ...MONO, fontSize: 32, color: "var(--ink-2)" }}>{t.year}</div>
                <div style={{ position: "absolute", left: x - 100, width: 200, top: 448, textAlign: "center", fontSize: 36, fontWeight: 700 }}>{t.name}</div>
              </div>
            );
          })}
          <Center y={630} fs={38} weight={500} color="var(--ink-2)" o={beat(frame, S.s7, 2.6, 0.5)}>
            {L.gptMeans}
          </Center>
          {[
            { en: L.g, ko: L.gk },
            { en: L.p, ko: L.pk },
            { en: L.t, ko: L.tk },
          ].map((g, i) => {
            const x = 210 + i * 330;
            const o = beat(frame, S.s7, 3.0 + i * 0.5, 0.5);
            return (
              <div key={g.en} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: x - 160, width: 320, top: 710, textAlign: "center", fontSize: 50, fontWeight: 700 }}>
                  {i === 2 ? <InlineCircle p={beat(frame, S.s7, 4.6, 0.7)}>{g.en}</InlineCircle> : g.en}
                </div>
                <div style={{ position: "absolute", left: x - 160, width: 320, top: 800, textAlign: "center", fontSize: 36, color: "var(--ink-2)" }}>{g.ko}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* s8: the map of Part 5 */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <Center y={170} fs={54}>
            {L.part}
          </Center>
          {ROADMAP5.map((r, i) => {
            const col = i < 5 ? 0 : 1;
            const row = i < 5 ? i : i - 5;
            const x = col === 0 ? 90 : 580;
            const y = 300 + row * 104;
            const o = beat(frame, S.s8, 0.8 + i * 0.22, 0.35);
            const first = i === 0;
            return (
              <div key={r.n} style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 18, opacity: o }}>
                <span style={{ ...MONO, fontSize: 34, fontWeight: 700, padding: "4px 12px", borderRadius: 10, background: first ? "var(--hl-yellow)" : "var(--paper-2)", color: first ? "var(--chip-ink)" : "var(--ink-2)" }}>{r.n}</span>
                <span style={{ fontSize: 38, fontWeight: first ? 700 : 500 }}>{r.t}</span>
              </div>
            );
          })}
          <Hand x={0} y={880} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 3.4, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch44.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
