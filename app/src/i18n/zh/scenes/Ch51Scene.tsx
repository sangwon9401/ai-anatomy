// zh overlay of src/scenes/Ch51Scene.tsx: a full-width colon after the "result unchanged" note.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ch51 } from "../../../data/ch51";
import { FOCUS, MASKED, OUT_MASKED, SCORE, allowed, fmt, fmtVec, pct } from "../../../data/part5-toy";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "../../../scenes/kit";
import { Center, Example, MONO, Word, heat, heatInk } from "../../../scenes/part5-kit";

const tl = buildTimeline(ch51);
const S = byId(tl);
const L = ch51.labels;

const WORDS = [L.w0, L.w1, L.w2, L.w3];
const TX = 320;
const TY = 430;
const CW = 150;
const CH = 96;
const G = 10;
const cx = (j: number) => TX + j * (CW + G);
const cy = (i: number) => TY + i * (CH + G);
const TW = 4 * CW + 3 * G;
const TH = 4 * CH + 3 * G;
const MP = MASKED.map((r) => pct(r));

const tintS = (s: number) => heat(s / 4);
const tintP = (p: number) => heat(p / 60);

// s2 sentence
const SFS = 56;
const SW = WORDS.map((w) => chipWidth(w, SFS));
const SXS = rowLayout(SW, 60);
const SC = SXS.map((x, i) => x + SW[i] / 2);

// the outline of the cells a word may see (lower-left staircase)
const STAIR = (() => {
  const pts: [number, number][] = [[TX - 6, TY - 6]];
  for (let i = 0; i < 4; i++) {
    pts.push([cx(i) + CW + 6, cy(i) - (i === 0 ? 6 : G / 2)]);
    pts.push([cx(i) + CW + 6, cy(i) + CH + (i === 3 ? 6 : G / 2)]);
  }
  pts.push([TX - 6, TY + TH + 6]);
  return pts.map((p) => p.join(",")).join(" ");
})();

export const Ch51Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const tableOn = frame < S.s2.from ? beat(frame, S.s1, 0.2, 0.5) : frame < S.s3.from ? 1 - beat(frame, S.s2, 0, 0.5) : beat(frame, S.s3, 0, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const drop = beat(frame, S.s3, 1.0, 1.4, EASE_IO);
  const inf = beat(frame, S.s4, 0.6, 0.5);
  const toP = beat(frame, S.s5, 0.4, 1.0, EASE_IO);
  const showTable = frame < S.s2.from + 15 || (frame >= S.s3.from && frame < S.s8.from + 15);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {showTable && (
        <div style={{ opacity: tableOn }}>
          <div style={{ position: "absolute", left: TX, width: TW, top: 300, textAlign: "center", fontSize: 32, fontWeight: 500, color: "var(--ink-2)" }}>{L.answers} →</div>
          <div style={{ position: "absolute", left: 40, width: 260, top: 380, textAlign: "right", fontSize: 30, fontWeight: 500, color: "var(--ink-2)" }}>↓ {L.asks}</div>
          {WORDS.map((w, j) => (
            <div key={`c${w}`} style={{ position: "absolute", left: cx(j) - 10, width: CW + 20, top: 360, textAlign: "center", fontSize: 38, fontWeight: 700 }}>
              {w}
            </div>
          ))}
          {WORDS.map((w, i) => (
            <div key={`r${w}`} style={{ position: "absolute", left: 40, width: 262, top: cy(i), height: CH, display: "flex", alignItems: "center", justifyContent: "flex-end", fontSize: 40, fontWeight: 700 }}>
              {w}
            </div>
          ))}
          {/* cells */}
          {SCORE.map((row, i) =>
            row.map((s, j) => {
              const ok = allowed(i, j);
              const p = MP[i][j];
              return (
                <div
                  key={`${i}${j}`}
                  style={{
                    position: "absolute",
                    left: cx(j),
                    top: cy(i),
                    width: CW,
                    height: CH,
                    borderRadius: 10,
                    background: ok && toP > 0.5 ? tintP(p) : tintS(s),
                    color: ok && toP > 0.5 ? heatInk(p / 60) : heatInk(s / 4),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...MONO,
                    fontSize: 44,
                  }}
                >
                  {ok ? (
                    <span style={{ position: "relative" }}>
                      <span style={{ opacity: 1 - toP }}>{fmt(s)}</span>
                      <span style={{ position: "absolute", left: "50%", top: 0, translate: "-50% 0", opacity: toP, fontSize: 38, whiteSpace: "nowrap" }}>{p === 100 ? "100" : p.toFixed(1)}%</span>
                    </span>
                  ) : (
                    fmt(s)
                  )}
                </div>
              );
            }),
          )}
          {/* the curtain */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <clipPath id="ch51-table">
                <rect x={TX - 8} y={TY - 8} width={TW + 16} height={TH + 16} rx={14} />
              </clipPath>
            </defs>
            <g clipPath="url(#ch51-table)">
              <g transform={`translate(0 ${mix(-TH - 40, 0, drop)})`}>
                {SCORE.map((row, i) =>
                  row.map((_, j) => (!allowed(i, j) ? <rect key={`${i}${j}`} x={cx(j) - 3} y={cy(i) - 3} width={CW + 6} height={CH + 6} rx={12} fill="var(--ink-2)" /> : null)),
                )}
              </g>
            </g>
          </svg>
          {SCORE.map((row, i) =>
            row.map((_, j) =>
              !allowed(i, j) ? (
                <div
                  key={`m${i}${j}`}
                  style={{
                    position: "absolute",
                    left: cx(j),
                    top: cy(i),
                    width: CW,
                    height: CH,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...MONO,
                    fontSize: 42,
                    fontWeight: 700,
                    color: "var(--paper)",
                  }}
                >
                  <span style={{ position: "absolute", opacity: inf * (1 - toP) }}>{L.inf}</span>
                  <span style={{ position: "absolute", opacity: toP }}>0%</span>
                </div>
              ) : null,
            ),
          )}

          {/* s1: 나는 row looks ahead */}
          {frame < S.s2.from + 15 && (
            <div style={{ opacity: beat(frame, S.s1, 1.6, 0.4) }}>
              <div style={{ position: "absolute", left: cx(1) - 8, top: cy(0) - 8, width: 3 * CW + 2 * G + 16, height: CH + 16, borderRadius: 16, border: "5px solid var(--pen)", boxSizing: "border-box" }} />
              <Hand x={0} y={880} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.0, 0.5) }}>
                {L.sees}
              </Hand>
            </div>
          )}

          {/* s3 */}
          <Hand x={0} y={880} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 2.6, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            {L.curtain}
          </Hand>
          <Center y={960} fs={38} weight={500} o={beat(frame, S.s3, 4.0, 0.4) * (1 - beat(frame, S.s4, 0, 0.3))}>
            {L.selfPast}
          </Center>
          {/* s4 */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontSize: 50, fontWeight: 700, opacity: beat(frame, S.s4, 2.6, 0.4) * (1 - beat(frame, S.s5, 0, 0.3)) }}>
            e<sup style={{ fontSize: 32 }}>{L.inf}</sup> {L.e0}
          </div>
          {/* s5: rows 나는, 오늘 */}
          {frame >= S.s5.from && frame < S.s6.from + 15 && (
            <div style={{ opacity: beat(frame, S.s5, 1.6, 0.4) * (1 - beat(frame, S.s6, 0, 0.3)) }}>
              {[0, 1].map((i) => (
                <div key={i} style={{ position: "absolute", left: 32, top: cy(i) - 6, width: TX + TW - 32 + 8, height: CH + 12, borderRadius: 16, border: "5px solid var(--pen)", boxSizing: "border-box" }} />
              ))}
              <Hand x={0} y={880} fs={48} style={{ width: 1080, textAlign: "center" }}>
                {L.resoft}
              </Hand>
            </div>
          )}
          {/* s6: the last row is unchanged */}
          {frame >= S.s6.from && frame < S.s7.from + 15 && (
            <div style={{ opacity: beat(frame, S.s6, 0.4, 0.4) * (1 - beat(frame, S.s7, 0, 0.3)) }}>
              <div style={{ position: "absolute", left: 32, top: cy(FOCUS) - 6, width: TX + TW - 32 + 8, height: CH + 12, borderRadius: 16, border: "5px solid var(--pen)", boxSizing: "border-box" }} />
              <Hand x={TX + TW - 160} y={cy(FOCUS) + CH + 10} fs={46} style={{ rotate: "-4deg" }}>
                {L.same}
              </Hand>
              <div style={{ position: "absolute", left: 0, right: 0, top: 940, textAlign: "center", fontSize: 40, fontWeight: 500, opacity: beat(frame, S.s6, 2.6, 0.4) }}>
                {L.out}：<span style={{ ...MONO, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 10px" }}>{fmtVec(OUT_MASKED[FOCUS])}</span>
              </div>
            </div>
          )}
          {/* s7: the triangle of visible cells */}
          {frame >= S.s7.from && (
            <div style={{ opacity: 1 - beat(frame, S.s8, 0, 0.4) }}>
              <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <polygon points={STAIR} fill="none" stroke="var(--pen)" strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s7, 0.4, 1.2)} />
              </svg>
              <Hand x={56} y={TY + TH + 14} fs={40} style={{ opacity: beat(frame, S.s7, 1.4, 0.4) }}>
                ↑ {L.seen}
              </Hand>
              <Chip text={L.term} color="yellow" fs={48} x={540 - chipWidth(L.term, 48) / 2 + 90} y={TY + TH + 20} style={{ opacity: beat(frame, S.s7, 3.0, 0.5) }} />
              <Center y={TY + TH + 120} fs={36} weight={500} o={beat(frame, S.s7, 4.2, 0.5)}>
                {L.allAtOnce}
              </Center>
            </div>
          )}
          <Example x={1024} y={232} text={L.ex} align="right" o={1 - beat(frame, S.s7, 0, 0.3)} />
        </div>
      )}

      {/* s2: why peeking spoils training */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: beat(frame, S.s2, 0.4, 0.5) * (1 - beat(frame, S.s3, 0, 0.4)) }}>
          <Center y={160} fs={46}>
            {L.train}
          </Center>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {[0, 1, 2].map((i) => {
              const p = beat(frame, S.s2, 1.6 + i * 0.8, 0.6);
              const x0 = SC[i] + 10;
              const x1 = SC[i + 1] - 10;
              return (
                <path
                  key={i}
                  d={`M ${x0} 520 Q ${(x0 + x1) / 2} 440 ${x1} 520`}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  fill="none"
                  stroke="var(--pen)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  opacity={p > 0 ? 1 : 0}
                />
              );
            })}
          </svg>
          {WORDS.map((w, i) => (
            <Word key={w} text={w} x={SXS[i]} y={530} fs={SFS} o={beat(frame, S.s2, 0.6 + i * 0.12, 0.4)} />
          ))}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: SC[i] - 100, width: 200, top: 640, textAlign: "center", fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s2, 1.2 + i * 0.8, 0.4) }}>
              {L.nextQ}
            </div>
          ))}
          <Hand x={0} y={330} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 2.4, 0.5) }}>
            {L.peek}
          </Hand>
          <Hand x={0} y={800} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 4.6, 0.5), rotate: "-1deg" }}>
            {L.noStudy}
          </Hand>
        </div>
      )}

      {/* s8: writing one word at a time */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <Center y={170} fs={46}>
            {L.gen}
          </Center>
          {WORDS.map((_, line) => {
            const o = beat(frame, S.s8, 0.8 + line * 0.7, 0.4);
            const y = 290 + line * 120;
            return (
              <div key={line} style={{ opacity: o }}>
                {WORDS.map((w, i) => {
                  const x = SXS[i];
                  const known = i <= line;
                  return known ? (
                    <Word key={w} text={w} x={x} y={y} fs={SFS} color={i === line ? "yellow" : null} />
                  ) : (
                    <div key={w} style={{ position: "absolute", left: x, top: y, width: SW[i], height: SFS * 1.5, borderRadius: 12, border: "3px dashed var(--ink-3)", boxSizing: "border-box" }} />
                  );
                })}
              </div>
            );
          })}
          <Hand x={SXS[2] - 10} y={290 + 0 * 120 - 50} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, S.s8, 3.6, 0.4) }}>
            {L.notYet} →
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch51.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
