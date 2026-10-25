import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { BOOKS, KEY_WORDS, ch46 } from "../data/ch46";
import { FOCUS, K, Q, V, W_K, W_Q, W_V, WEIGHT, X, fmt, fmtVec, type M2 } from "../data/part5-toy";
import { Caption, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Card, Center, Example, Grid, MONO, Word } from "./part5-kit";

const tl = buildTimeline(ch46);
const S = byId(tl);
const L = ch46.labels;

const WORDS = [L.w0, L.w1, L.w2, L.w3];
const COLS = [170, 400, 650, 900];
const WFS = 52;
const wx = (i: number) => COLS[i] - chipWidth(WORDS[i], WFS) / 2;
const ROW1 = 300;
const arcLift = (d: number) => 90 + d * 0.2;

// library
const BOOK_W = 170;
const BOOK_GAP = 34;
const BOOK_X0 = 540 - (4 * BOOK_W + 3 * BOOK_GAP) / 2;
const BOOK_H = [330, 300, 360, 320];
const SHELF_Y = 960;
const MATCH = 2; // "학교 이야기"
const bookX = (i: number) => BOOK_X0 + i * (BOOK_W + BOOK_GAP);
const labelY = (i: number) => SHELF_Y - BOOK_H[i] + 44;

// s5–s6 card rows
const ROW_Q = 330;
const ROW_K = 540;
const ROW_V = 680;
const CARD_W = 212;
const CFS = 36;
const CARD_H = CFS * 1.7;

const MATS: { kind: "q" | "k" | "v"; m: M2; out: number[] }[] = [
  { kind: "q", m: W_Q, out: Q[FOCUS] },
  { kind: "k", m: W_K, out: K[FOCUS] },
  { kind: "v", m: W_V, out: V[FOCUS] },
];
const x3 = X[FOCUS];
const rowCalc = (m: M2) =>
  [0, 1]
    .map((r) => {
      const a = m[r * 2];
      const b = m[r * 2 + 1];
      const t = (c: number, x: number) => (c < 0 ? `(${fmt(c)})×${fmt(x)}` : `${fmt(c)}×${fmt(x)}`);
      return `${t(a, x3[0])} + ${t(b, x3[1])} = ${fmt(a * x3[0] + b * x3[1])}`;
    });

export const Ch46Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const introOut = 1 - beat(frame, S.s2, 0, 0.5);
  const libOut = 1 - beat(frame, S.s5, 0, 0.6);
  const cardsOut = 1 - beat(frame, S.s7, 0, 0.6);
  const s6 = beat(frame, S.s6, 0.3, 0.6);
  const makeDim = 1 - beat(frame, S.s8, 0, 0.6);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: who should '간다' look at? */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: introOut }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {[0, 1, 2].map((j) => {
              const p = beat(frame, S.s1, 0.8 + j * 0.3, 0.6);
              const x0 = COLS[FOCUS] - 30 + j * 14;
              const x1 = COLS[j];
              return (
                <path
                  key={j}
                  d={`M ${x0} ${ROW1 - 2} Q ${(x0 + x1) / 2} ${ROW1 - 2 - arcLift(x0 - x1)} ${x1} ${ROW1 - 2}`}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  fill="none"
                  stroke="var(--ink-3)"
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={p > 0 ? 1 : 0}
                />
              );
            })}
          </svg>
          {[0, 1, 2].map((j) => (
            <Hand key={j} x={(COLS[j] + COLS[FOCUS] - 30 + j * 14) / 2 - 12} y={ROW1 - 2 - arcLift(COLS[FOCUS] - 30 + j * 14 - COLS[j]) / 2 - 62} fs={48} style={{ opacity: beat(frame, S.s1, 1.8 + j * 0.2, 0.3) }}>
              ?
            </Hand>
          ))}
          {WORDS.map((w, i) => (
            <Word key={w} text={w} x={wx(i)} y={ROW1} fs={WFS} color={i === FOCUS ? "yellow" : null} focus={i === FOCUS} o={beat(frame, S.s1, 0.1 + i * 0.1, 0.4)} />
          ))}
          <Center y={ROW1 + 120} fs={50} o={beat(frame, S.s1, 2.4, 0.5)}>
            {L.howMuch}
          </Center>
        </div>
      )}

      {/* s1–s4: the library */}
      {frame < S.s5.from + 18 && (
        <div style={{ opacity: libOut * beat(frame, S.s1, 4.0, 0.7) }}>
          <div style={{ position: "absolute", left: 110, top: SHELF_Y, width: 860, height: 22, borderRadius: 6, background: "var(--ink-3)" }} />
          {BOOKS.map((b, i) => {
            const x = bookX(i);
            const top = SHELF_Y - BOOK_H[i];
            const isMatch = i === MATCH;
            const lab = beat(frame, S.s3, 0.4 + i * 0.3, 0.4);
            return (
              <div key={b}>
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top,
                    width: BOOK_W,
                    height: BOOK_H[i],
                    borderRadius: "10px 10px 4px 4px",
                    border: "3.5px solid var(--ink)",
                    background: "var(--paper-2)",
                    boxSizing: "border-box",
                    translate: isMatch ? `0px ${-40 * beat(frame, S.s4, 0.2, 0.6)}px` : undefined,
                  }}
                >
                  <div style={{ position: "absolute", left: 18, right: 18, bottom: 40, height: 5, borderRadius: 3, background: "var(--ink-3)" }} />
                  <div style={{ position: "absolute", left: 18, right: 18, bottom: 58, height: 5, borderRadius: 3, background: "var(--ink-3)" }} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: x + 8,
                    top: labelY(i),
                    width: BOOK_W - 16,
                    height: 60,
                    borderRadius: 8,
                    background: "var(--hl-mint)",
                    color: "var(--chip-ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    fontWeight: 500,
                    opacity: lab,
                    translate: isMatch ? `0px ${-40 * beat(frame, S.s4, 0.2, 0.6)}px` : undefined,
                  }}
                >
                  {b}
                </div>
              </div>
            );
          })}
          <Hand x={0} y={SHELF_Y + 32} fs={42} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 4.6, 0.5) * (1 - beat(frame, S.s2, 0, 0.4)) }}>
            {L.library}
          </Hand>

          {/* s2: the question card */}
          <div style={{ opacity: beat(frame, S.s2, 0.6, 0.5) }}>
            <div style={{ position: "absolute", left: 60, top: 150, width: 500, height: 200, borderRadius: 16, border: "3.5px solid var(--ink)", background: "var(--paper)", overflow: "hidden" }}>
              <div style={{ height: 62, background: "var(--hl-yellow)", color: "var(--chip-ink)", display: "flex", alignItems: "center", gap: 14, paddingLeft: 20, fontSize: 36, fontWeight: 700 }}>
                <span style={{ ...MONO }}>{L.qTab}</span>
                <span>{L.qName}</span>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 92, textAlign: "center", fontFamily: "var(--font-hand)", fontSize: 42 }}>{L.qText}</div>
            </div>
          </div>

          {/* s3: question ↔ labels */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {BOOKS.map((b, i) => {
              const p = beat(frame, S.s3, 1.6 + i * 0.3, 0.5);
              const isMatch = i === MATCH;
              const hot = isMatch ? beat(frame, S.s3, 3.4, 0.4) : 0;
              const lift = isMatch ? -40 * beat(frame, S.s4, 0.2, 0.6) : 0;
              const ex = bookX(i) + BOOK_W / 2;
              const ey = labelY(i) - 6 + lift;
              return (
                <line
                  key={b}
                  x1={310}
                  y1={356}
                  x2={mix(310, ex, p)}
                  y2={mix(356, ey, p)}
                  stroke={hot > 0.5 ? "var(--pen)" : "var(--ink-3)"}
                  strokeWidth={mix(4, 8, hot)}
                  strokeDasharray={hot > 0.5 ? undefined : "8 10"}
                  strokeLinecap="round"
                  opacity={p > 0 ? mix(1, isMatch ? 1 : 0.35, beat(frame, S.s3, 3.4, 0.4)) : 0}
                />
              );
            })}
          </svg>
          <PenCircle x={bookX(MATCH) - 6} y={labelY(MATCH) - 14 - 40 * beat(frame, S.s4, 0.2, 0.6)} w={BOOK_W + 12} h={88} p={beat(frame, S.s3, 3.6, 0.6)} />
          <Hand x={bookX(1) - 30} y={labelY(MATCH) - 92} fs={46} style={{ opacity: beat(frame, S.s3, 4.2, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)), rotate: "-4deg" }}>
            {L.match}
          </Hand>

          {/* s4: the contents */}
          <div style={{ opacity: beat(frame, S.s4, 1.0, 0.5) }}>
            <div style={{ position: "absolute", left: 600, top: 150, width: 420, height: 200, borderRadius: 16, border: "3.5px solid var(--ink)", background: "var(--paper)", overflow: "hidden" }}>
              <div style={{ height: 62, background: "var(--hl-sky)", color: "var(--chip-ink)", display: "flex", alignItems: "center", gap: 14, paddingLeft: 20, fontSize: 36, fontWeight: 700 }}>
                <span style={{ ...MONO }}>{L.v}</span>
                <span>{L.vName}</span>
              </div>
              <div style={{ position: "absolute", left: 24, right: 24, top: 82, fontFamily: "var(--font-hand)", fontSize: 36, lineHeight: 1.2, whiteSpace: "normal", wordBreak: "keep-all" }}>{L.vText}</div>
            </div>
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path
                d={`M ${bookX(MATCH) + BOOK_W / 2 + 30} ${labelY(MATCH) - 60} C ${bookX(MATCH) + BOOK_W / 2 + 60} 480, 820 470, 810 368`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - beat(frame, S.s4, 1.2, 0.6)}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={6}
                strokeLinecap="round"
              />
              <path d="M 794 388 L 810 362 L 828 386" fill="none" stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={beat(frame, S.s4, 1.7, 0.2)} />
            </svg>
          </div>
          <Hand x={0} y={SHELF_Y + 36} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 3.6, 0.5) }}>
            {L.pick} → {L.take}
          </Hand>
        </div>
      )}

      {/* s5–s6: every word holds three cards */}
      {frame >= S.s5.from && frame < S.s7.from + 18 && (
        <div style={{ opacity: cardsOut * beat(frame, S.s5, 0.3, 0.5) }}>
          {WORDS.map((w, i) => (
            <Word key={w} text={w} x={wx(i)} y={196} fs={WFS} color={i === FOCUS ? "yellow" : null} focus={i === FOCUS && s6 > 0.5} />
          ))}
          {/* s6: how well 간다's question fits each label */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {WORDS.map((_, j) => {
              const p = beat(frame, S.s6, 1.4 + j * 0.25, 0.6);
              const x0 = COLS[FOCUS] - 60 + j * 24;
              const y0 = ROW_Q + CARD_H + 6;
              const x1 = COLS[j];
              const y1 = ROW_K - 6;
              return (
                <path
                  key={j}
                  d={`M ${x0} ${y0} C ${x0} ${y0 + 50}, ${x1} ${y1 - 50}, ${x1} ${y1}`}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  fill="none"
                  stroke="var(--pen)"
                  strokeOpacity={0.85}
                  strokeWidth={3 + WEIGHT[FOCUS][j] * 30}
                  strokeLinecap="round"
                  opacity={p > 0 ? 1 : 0}
                />
              );
            })}
          </svg>
          {WORDS.map((w, i) => {
            const isF = i === FOCUS;
            const qO = isF ? 1 : mix(1, 0.3, s6);
            const vO = i === MATCH ? 1 : mix(1, 0.4, s6);
            const a = (k: number) => beat(frame, S.s5, 0.8 + k * 0.6 + i * 0.12, 0.4);
            return (
              <div key={w}>
                <Card kind="q" x={COLS[i] - CARD_W / 2} y={ROW_Q} w={CARD_W} fs={CFS} sans tfs={isF && s6 > 0.5 ? 30 : CFS} text={isF && s6 > 0.5 ? L.ask : L.qd} o={a(0) * qO} />
                <Card kind="k" x={COLS[i] - CARD_W / 2} y={ROW_K} w={CARD_W} fs={CFS} sans text={s6 > 0.5 ? KEY_WORDS[i] : L.kd} o={a(1)} />
                <Card kind="v" x={COLS[i] - CARD_W / 2} y={ROW_V} w={CARD_W} fs={CFS} sans text={L.vd} o={a(2) * vO} />
              </div>
            );
          })}
          <PenCircle x={COLS[MATCH] - CARD_W / 2 - 14} y={ROW_V - 16} w={CARD_W + 28} h={CARD_H + 32} p={beat(frame, S.s6, 3.6, 0.6)} />
          <Hand x={0} y={ROW_V + 96} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.2, 0.5) }}>
            {L.take2}
          </Hand>
          <Example x={56} y={900} text={L.ex} o={beat(frame, S.s6, 0.6, 0.4)} />
          <div style={{ position: "absolute", left: 56, top: 960, fontSize: 30, color: "var(--ink-3)", opacity: beat(frame, S.s6, 5.4, 0.5) }}>{L.real}</div>
        </div>
      )}

      {/* s7–s8: the cards are matrix × vector */}
      {frame >= S.s7.from && (
        <div style={{ opacity: makeDim * beat(frame, S.s7, 0.2, 0.5) }}>
          <Center y={150} fs={46}>
            {L.make}
          </Center>
          <Center y={226} fs={38} weight={500} o={beat(frame, S.s7, 0.6, 0.4)}>
            {L.xLine} <span style={{ ...MONO, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 8px" }}>{fmtVec(x3)}</span>
          </Center>
          <Example x={1024} y={1010} text={L.ex} align="right" />
          {MATS.map((r, ri) => {
            const y = 340 + ri * 220;
            const o = beat(frame, S.s7, 1.4 + ri * 1.4, 0.5);
            return (
              <div key={r.kind} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: 66, top: y + 18, fontSize: 48, fontWeight: 700, fontStyle: "italic" }}>
                  {L.w}
                  <sub style={{ fontSize: 30, fontStyle: "normal" }}>{r.kind.toUpperCase()}</sub>
                </div>
                <Grid x={186} y={y} rows={2} cols={2} cw={84} ch={50} gap={4} fs={40} brackets cell={(i, j) => fmt(r.m[i * 2 + j])} />
                <div style={{ position: "absolute", left: 392, top: y + 26, ...MONO, fontSize: 42 }}>× {fmtVec(x3)}</div>
                <div style={{ position: "absolute", left: 600, top: y + 26, ...MONO, fontSize: 42 }}>=</div>
                <Card kind={r.kind} x={650} y={y + 10} w={300} fs={42} text={fmtVec(r.out)} />
                <div style={{ position: "absolute", left: 186, top: y + 130, display: "flex", gap: 48, ...MONO, fontSize: 28, color: "var(--ink-2)", opacity: beat(frame, S.s7, 2.0 + ri * 1.4, 0.4) }}>
                  {rowCalc(r.m).map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* s8: learned numbers; next: how well do Q and K fit? */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <Center y={250} fs={46}>
            {L.learn}
          </Center>
          <Center y={400} fs={44} weight={500} color="var(--ink-2)" o={beat(frame, S.s8, 1.4, 0.4)}>
            {L.meas}
          </Center>
          <div style={{ opacity: beat(frame, S.s8, 1.8, 0.5) }}>
            <Card kind="q" x={150} y={500} w={290} fs={46} text={fmtVec(Q[FOCUS])} />
            <div style={{ position: "absolute", left: 150, width: 290, top: 600, textAlign: "center", fontSize: 36 }}>{L.w3}</div>
            <div style={{ position: "absolute", left: 450, width: 80, top: 486, textAlign: "center", ...MONO, fontSize: 72 }}>·</div>
            <Card kind="k" x={540} y={500} w={290} fs={46} text={fmtVec(K[MATCH])} />
            <div style={{ position: "absolute", left: 540, width: 290, top: 600, textAlign: "center", fontSize: 36 }}>{L.w2}</div>
            <div style={{ position: "absolute", left: 846, top: 508, ...MONO, fontSize: 52 }}>= ?</div>
          </div>
          <Hand x={0} y={700} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 3.0, 0.5) }}>
            {L.dotHint}
          </Hand>
          <Hand x={0} y={840} fs={50} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 4.4, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch46.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
