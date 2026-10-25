// zh overlay of src/scenes/Ch47Scene.tsx: a full-width comma after the 'negative' note.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ch47 } from "../../../data/ch47";
import { FOCUS, K, Q, SCORE, fmt, fmtVec } from "../../../data/part5-toy";
import { Caption, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";
import { Card, Center, Example, Grid, MONO, Mark, Word, heat, heatInk } from "../../../scenes/part5-kit";
import { Vec, type Plane } from "../../../scenes/plane";

const tl = buildTimeline(ch47);
const S = byId(tl);
const L = ch47.labels;

const WORDS = [L.w0, L.w1, L.w2, L.w3];
const COLS = [180, 410, 650, 890];
const MATCH = 2;
const OTHER = 1;
const ROW_W = 330; // words row (s1–s4)
const SCORE_Y = 500;
const CELL = 128;

// table (s5–s7)
const TX = 320;
const TY = 430;
const CW = 140;
const CHH = 100;
const GAP = 10;
const colC = (j: number) => TX + j * (CW + GAP) + CW / 2;
const rowY = (i: number) => TY + i * (CHH + GAP);
const ROW_SUM = SCORE.map((r) => r.reduce((a, b) => a + b, 0));

const tint = (s: number) => heat(s / 4);
const tintInk = (s: number) => heatInk(s / 4);

// s3 plane
const PL: Plane = { ox: 290, oy: 920, unit: 116 };

const dotCalc = (q: number[], k: number[]) => `${fmt(q[0])}×${k[0] < 0 ? `(${fmt(k[0])})` : fmt(k[0])} + ${fmt(q[1])}×${k[1] < 0 ? `(${fmt(k[1])})` : fmt(k[1])}`;

export const Ch47Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const qF = Q[FOCUS];

  const topOut = 1 - beat(frame, S.s5, 0, 0.6);
  const calcOn = beat(frame, S.s2, 0.6, 0.5) * (1 - beat(frame, S.s3, 0, 0.4));
  const planeOn = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const tableOn = beat(frame, S.s5, 0.3, 0.6);

  // when each of the 간다 row's four scores appears in s2–s4
  const scoreIn = (j: number) =>
    j === MATCH ? beat(frame, S.s2, 4.6, 0.4) : j === OTHER ? beat(frame, S.s3, 4.2, 0.4) : beat(frame, S.s4, 0.6 + (j === 0 ? 0 : 0.8), 0.4);
  const colHot = (j: number) => (j === MATCH ? beat(frame, S.s2, 0.3, 0.3) * (1 - beat(frame, S.s3, 0, 0.3)) : j === OTHER ? beat(frame, S.s3, 3.0, 0.3) * (1 - beat(frame, S.s4, 0, 0.3)) : 0);

  // table cells: the 간다 row is already known; the rest fill one by one
  const order: [number, number][] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) order.push([i, j]);
  const cellIn = (i: number, j: number) => (i === FOCUS ? 1 : beat(frame, S.s5, 1.0 + order.findIndex(([a, b]) => a === i && b === j) * 0.32, 0.35));
  const sumOn = beat(frame, S.s7, 2.0, 0.5);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s4: '간다' scores each word */}
      {frame < S.s5.from + 18 && (
        <div style={{ opacity: topOut }}>
          <Center y={104} fs={34} weight={500} color="var(--ink-2)" o={beat(frame, S.s1, 0.2, 0.4)}>
            {L.qOf}
          </Center>
          <Card kind="q" x={540 - 160} y={156} w={320} fs={48} text={fmtVec(qF)} o={beat(frame, S.s1, 0.3, 0.5)} />
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {WORDS.map((_, j) => {
              const p = beat(frame, S.s1, 1.4 + j * 0.25, 0.5);
              return (
                <line
                  key={j}
                  x1={540}
                  y1={246}
                  x2={mix(540, COLS[j], p)}
                  y2={mix(246, ROW_W - 10, p)}
                  stroke={colHot(j) > 0.5 ? "var(--pen)" : "var(--ink-3)"}
                  strokeWidth={colHot(j) > 0.5 ? 7 : 4}
                  strokeDasharray={colHot(j) > 0.5 ? undefined : "8 10"}
                  strokeLinecap="round"
                  opacity={p > 0 ? 1 : 0}
                />
              );
            })}
          </svg>
          {WORDS.map((w, j) => {
            const o = beat(frame, S.s1, 0.8 + j * 0.15, 0.4);
            const s = SCORE[FOCUS][j];
            const sc = scoreIn(j);
            return (
              <div key={w} style={{ opacity: o }}>
                <Word text={w} x={COLS[j] - chipWidth(w, 48) / 2} y={ROW_W} fs={48} color={j === FOCUS ? "yellow" : null} />
                <div style={{ position: "absolute", left: COLS[j] - 110, width: 220, top: ROW_W + 86, textAlign: "center", ...MONO, fontSize: 34 }}>
                  <Mark c="mint">K {fmtVec(K[j])}</Mark>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: COLS[j] - CELL / 2,
                    top: SCORE_Y,
                    width: CELL,
                    height: 88,
                    borderRadius: 14,
                    border: colHot(j) > 0.5 ? "4px solid var(--pen)" : "3px dashed var(--ink-3)",
                    background: sc > 0 ? tint(s * sc) : "var(--paper)",
                    color: sc > 0.5 ? tintInk(s) : "var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...MONO,
                    fontSize: 48,
                    fontWeight: 700,
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ position: "absolute", opacity: 1 - sc, color: "var(--ink-3)" }}>?</span>
                  <span style={{ opacity: sc }}>{fmt(s)}</span>
                </div>
                {/* s4: each score's working, small */}
                <div style={{ position: "absolute", left: COLS[j] - 115, width: 230, top: SCORE_Y + 100, textAlign: "center", ...MONO, fontSize: 28, color: "var(--ink-2)", opacity: beat(frame, S.s4, 0.2, 0.4) }}>
                  {dotCalc(qF, K[j])}
                </div>
              </div>
            );
          })}
          <Hand x={0} y={SCORE_Y + 170} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 2.6, 0.5) }}>
            {L.rowName}
          </Hand>
          <Center y={SCORE_Y + 270} fs={36} weight={500} color="var(--ink-2)" o={beat(frame, S.s4, 3.4, 0.5)}>
            {WORDS.map((w, j) => `${w} ${fmt(SCORE[FOCUS][j])}`).join(" · ")}
          </Center>

          {/* s2: the worked dot product */}
          {frame >= S.s2.from && frame < S.s3.from + 15 && (
            <div style={{ opacity: calcOn }}>
              <Center y={650} fs={34} weight={500} color="var(--ink-2)">
                {L.rule}
              </Center>
              <div style={{ position: "absolute", left: 0, right: 0, top: 716, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...MONO, fontSize: 48 }}>
                <div>
                  (<Mark c="pink">{fmt(qF[0])}</Mark>, <Mark c="sky">{fmt(qF[1])}</Mark>) · (<Mark c="pink">{fmt(K[MATCH][0])}</Mark>, <Mark c="sky">{fmt(K[MATCH][1])}</Mark>)
                </div>
                <div style={{ opacity: beat(frame, S.s2, 2.0, 0.4) }}>= {dotCalc(qF, K[MATCH])}</div>
                <div style={{ opacity: beat(frame, S.s2, 3.4, 0.4), fontWeight: 700 }}>
                  = {fmt(qF[0] * K[MATCH][0])} + {fmt(qF[1] * K[MATCH][1])} = {fmt(SCORE[FOCUS][MATCH])}
                </div>
              </div>
            </div>
          )}

          {/* s3: as arrows (9장) */}
          {frame >= S.s3.from && frame < S.s4.from + 15 && (
            <div style={{ opacity: planeOn }}>
              <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <line x1={160} y1={PL.oy} x2={590} y2={PL.oy} stroke="var(--ink-3)" strokeWidth={3} />
                <line x1={PL.ox} y1={1066} x2={PL.ox} y2={660} stroke="var(--ink-3)" strokeWidth={3} />
              </svg>
              {K.map((k, j) => (
                <Vec key={j} pl={PL} v={k} p={beat(frame, S.s3, 0.6 + j * 0.25, 0.5)} color={j === OTHER || j === MATCH ? "var(--hl-mint)" : "var(--ink-3)"} width={j === OTHER || j === MATCH ? 10 : 6} />
              ))}
              <Vec pl={PL} v={qF} p={beat(frame, S.s3, 0.3, 0.6)} color="var(--hl-yellow)" width={12} />
              {K.map((k, j) => {
                const x = PL.ox + k[0] * PL.unit;
                const y = PL.oy - k[1] * PL.unit;
                return (
                  <div key={j} style={{ position: "absolute", top: y - 24, ...(k[0] === 0 ? { right: 1080 - x + 18 } : { left: x + 16 }), fontSize: 32, fontWeight: 700, opacity: beat(frame, S.s3, 1.0 + j * 0.25, 0.4) }}>
                    {WORDS[j]}
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: PL.ox + qF[0] * PL.unit - 40, top: PL.oy - qF[1] * PL.unit - 56, ...MONO, fontSize: 32, fontWeight: 700, opacity: beat(frame, S.s3, 0.6, 0.4) }}>Q</div>
              <div style={{ position: "absolute", left: 600, top: 700, ...MONO, fontSize: 38, lineHeight: 1.6, opacity: beat(frame, S.s3, 2.6, 0.4) }}>
                <div>
                  {fmtVec(qF)} · {fmtVec(K[OTHER])}
                </div>
                <div>= {dotCalc(qF, K[OTHER])}</div>
                <div style={{ fontWeight: 700 }}>= {fmt(SCORE[FOCUS][OTHER])}</div>
              </div>
              <Hand x={600} y={910} fs={44} color="var(--ink)" style={{ opacity: beat(frame, S.s3, 1.6, 0.4) }}>
                {L.same}
              </Hand>
              <Hand x={600} y={972} fs={44} style={{ opacity: beat(frame, S.s3, 4.6, 0.4) }}>
                {L.other}
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s5–s7: the whole score table */}
      {frame >= S.s5.from && (
        <div style={{ opacity: tableOn }}>
          <div style={{ position: "absolute", left: TX, width: 4 * CW + 3 * GAP, top: 200, textAlign: "center", fontSize: 32, fontWeight: 500, color: "var(--ink-2)" }}>{L.answers} →</div>
          <div style={{ position: "absolute", left: 56, width: 244, top: 330, textAlign: "right", fontSize: 32, fontWeight: 500, color: "var(--ink-2)" }}>↓ {L.asks}</div>
          {WORDS.map((w, j) => (
            <div key={`c${w}`}>
              <div style={{ position: "absolute", left: colC(j) - 90, width: 180, top: 252, textAlign: "center", fontSize: 38, fontWeight: 700 }}>{w}</div>
              <div style={{ position: "absolute", left: colC(j) - 90, width: 180, top: 312, textAlign: "center", ...MONO, fontSize: 28 }}>
                <Mark c="mint">{fmtVec(K[j])}</Mark>
              </div>
            </div>
          ))}
          {WORDS.map((w, i) => (
            <div key={`r${w}`} style={{ position: "absolute", left: 40, width: 262, top: rowY(i), height: CHH, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 2 }}>
              <span style={{ fontSize: 38, fontWeight: 700 }}>{w}</span>
              <span style={{ ...MONO, fontSize: 28 }}>
                <Mark c="yellow">{fmtVec(Q[i])}</Mark>
              </span>
            </div>
          ))}
          <Grid
            x={TX}
            y={TY}
            rows={4}
            cols={4}
            cw={CW}
            ch={CHH}
            gap={GAP}
            fs={48}
            cell={(i, j) => fmt(SCORE[i][j])}
            show={cellIn}
            fill={(i, j) => tint(SCORE[i][j])}
            ink={(i, j) => (SCORE[i][j] < 0 && beat(frame, S.s7, 0.8, 0.4) > 0.5 ? "var(--pen)" : tintInk(SCORE[i][j]))}
          />
          {/* s6: one row = one asking word */}
          {frame >= S.s6.from && (
            <div style={{ opacity: beat(frame, S.s6, 0.4, 0.4) * (1 - beat(frame, S.s7, 0, 0.4)) }}>
              <div style={{ position: "absolute", left: 36, top: rowY(0) - 8, width: TX + 4 * CW + 3 * GAP - 36 + 10, height: CHH + 16, borderRadius: 18, border: "5px solid var(--pen)", boxSizing: "border-box" }} />
              <PenCircle x={colC(1) - 62} y={rowY(0) + 6} w={124} h={88} p={beat(frame, S.s6, 3.6, 0.6)} />
              <Hand x={colC(1) + 52} y={rowY(0) - 52} fs={42} style={{ opacity: beat(frame, S.s6, 4.2, 0.4), rotate: "-4deg" }}>
                {L.first}
              </Hand>
              <Hand x={0} y={900} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 1.6, 0.4) }}>
                {L.rowMax}
              </Hand>
            </div>
          )}
          {/* s7: negatives and uneven sums */}
          {frame >= S.s7.from && (
            <div>
              <div style={{ position: "absolute", left: 940, width: 84, top: 312, textAlign: "center", fontSize: 30, fontWeight: 500, color: "var(--ink-2)", opacity: sumOn }}>{L.sums}</div>
              {ROW_SUM.map((v, i) => (
                <div key={i} style={{ position: "absolute", left: 940, width: 84, top: rowY(i), height: CHH, display: "flex", alignItems: "center", justifyContent: "center", ...MONO, fontSize: 44, fontWeight: 700, opacity: beat(frame, S.s7, 2.2 + i * 0.2, 0.3) }}>
                  {fmt(v)}
                </div>
              ))}
              <div style={{ position: "absolute", left: 936, top: rowY(0) - 10, width: 92, height: 4 * CHH + 3 * GAP + 20, borderRadius: 16, border: "4px dashed var(--pen)", boxSizing: "border-box", opacity: beat(frame, S.s7, 3.2, 0.4) }} />
              <Hand x={120} y={890} fs={50} style={{ opacity: beat(frame, S.s7, 1.0, 0.4) }}>
                {L.neg}，
              </Hand>
              <Hand x={560} y={890} fs={50} style={{ opacity: beat(frame, S.s7, 3.4, 0.4) }}>
                {L.uneven}
              </Hand>
              <Hand x={0} y={990} fs={46} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 4.6, 0.5) }}>
                {L.next}
              </Hand>
            </div>
          )}
        </div>
      )}

      <Example x={1024} y={104} text={L.ex} align="right" o={beat(frame, S.s1, 1.0, 0.4)} />

      <Narration tl={tl} chapter={ch47.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
