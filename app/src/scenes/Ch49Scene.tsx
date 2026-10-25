import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { SENTENCES, attend, type Meaning } from "../data/ch45";
import { ch49 } from "../data/ch49";
import { FOCUS, OUT, PAINT, V, WEIGHT, dec3, fmtVec, paintMix, pct } from "../data/part5-toy";
import { MEANING_ICONS } from "./icons";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Card, Center, Example, MONO, PctStack } from "./part5-kit";

const tl = buildTimeline(ch49);
const S = byId(tl);
const L = ch49.labels;

const WORDS = [L.w0, L.w1, L.w2, L.w3];
const COLS = [180, 410, 650, 890];
const W3 = dec3(WEIGHT[FOCUS]);
const P = pct(WEIGHT[FOCUS]);
const OUTV = OUT[FOCUS];
const BLEND = paintMix(WEIGHT[FOCUS]);

// s2–s3: tubes and the cup
const CARD_Y = 380;
const TUBE_Y = 470;
const TUBE_W = 132;
const TUBE_H = 130;
const NOZZLE_Y = TUBE_Y + TUBE_H + 34;
const CUP = { cx: 400, top: 800, bottom: 990, wTop: 280, wBot: 210 };
const cupPath = `M ${CUP.cx - CUP.wTop / 2} ${CUP.top} L ${CUP.cx + CUP.wTop / 2} ${CUP.top} L ${CUP.cx + CUP.wBot / 2} ${CUP.bottom} L ${CUP.cx - CUP.wBot / 2} ${CUP.bottom} Z`;

// s6: the plane of Values
const OX = 200;
const OY = 905;
const U = 188;
const at = (v: readonly number[]): [number, number] => [OX + v[0] * U, OY - v[1] * U];
const HULL = [V[1], V[2], V[0]];

// s7: ch45's meaning triangle, small
const TRI: [number, number][] = [
  [540, 330],
  [330, 690],
  [750, 690],
];
const triAt = (m: Meaning): [number, number] => [0, 1].map((k) => m[0] * TRI[0][k] + m[1] * TRI[1][k] + m[2] * TRI[2][k]) as [number, number];
const SEA_AT = triAt(attend(SENTENCES.sea).mix);
const MID_AT = triAt([1 / 3, 1 / 3, 1 / 3]);

export const Ch49Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const stackOn = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const tubesOn = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const cupOn = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const fill = beat(frame, S.s3, 1.2, 3.6, EASE_IO);
  const planeOn = beat(frame, S.s6, 0.3, 0.6) * (1 - beat(frame, S.s7, 0, 0.5));
  const pull = beat(frame, S.s6, 1.6, 1.6, EASE_IO);
  const [mx, my] = at(OUTV);

  const level = CUP.bottom - (CUP.bottom - CUP.top - 18) * fill;
  const wAt = (y: number) => mix(CUP.wBot, CUP.wTop, (CUP.bottom - y) / (CUP.bottom - CUP.top));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s5: the ratios */}
      {frame < S.s6.from + 15 && (
        <div style={{ opacity: stackOn, translate: `0px ${mix(300, 0, beat(frame, S.s2, 0, 0.8, EASE_IO))}px` }}>
          <Center y={112} fs={38} weight={500} color="var(--ink-2)">
            {L.ratio}
          </Center>
          <PctStack y={176} ps={P} grow={beat(frame, S.s1, 0.6, 1.2)} labels={P.map((p) => `${p.toFixed(1)}%`)} />
          <Example x={56} y={330} text={L.ex} o={beat(frame, S.s1, 2.0, 0.4) * (1 - beat(frame, S.s2, 0, 0.3))} />
          {(() => {
            let acc = 0;
            return P.map((p, i) => {
              const c = 120 + (acc + p / 2) * 8.4;
              acc += p;
              return (
                <div key={i} style={{ position: "absolute", left: c - 60, width: 120, top: 262, textAlign: "center", fontSize: 30, fontWeight: 500, opacity: beat(frame, S.s1, 1.6 + i * 0.15, 0.3) }}>
                  {WORDS[i]}
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* s2–s3: each Value is a tube of paint */}
      {frame >= S.s2.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: tubesOn }}>
          <Center y={316} fs={34} weight={500} color="var(--ink-2)">
            {L.values}
          </Center>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {WORDS.map((_, i) => {
              const p = beat(frame, S.s3, 0.8 + i * 0.35, 0.9);
              const x0 = COLS[i];
              const x1 = CUP.cx - 70 + i * 46;
              const y1 = CUP.top + 10;
              return (
                <path
                  key={i}
                  d={`M ${x0} ${NOZZLE_Y} C ${x0} ${NOZZLE_Y + 90}, ${x1} ${y1 - 110}, ${x1} ${y1}`}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  fill="none"
                  stroke={`var(--hl-${PAINT[i]})`}
                  strokeWidth={4 + WEIGHT[FOCUS][i] * 46}
                  strokeLinecap="round"
                  opacity={p > 0 ? 1 : 0}
                />
              );
            })}
          </svg>
          {WORDS.map((w, i) => {
            const a = beat(frame, S.s2, 0.6 + i * 0.3, 0.4);
            const squeeze = 1 - 0.35 * WEIGHT[FOCUS][i] * beat(frame, S.s3, 0.8 + i * 0.35, 0.9);
            const x = COLS[i] - TUBE_W / 2;
            return (
              <div key={w} style={{ opacity: a }}>
                <Card kind="v" x={COLS[i] - 105} y={CARD_Y} w={210} fs={36} text={fmtVec(V[i])} />
                {/* tube: crimped end, body, nozzle */}
                <div style={{ position: "absolute", left: x + 8, top: TUBE_Y, width: TUBE_W - 16, height: 14, borderRadius: 4, background: "var(--ink-3)" }} />
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: TUBE_Y + 14,
                    width: TUBE_W,
                    height: TUBE_H - 14,
                    borderRadius: "10px 10px 26px 26px",
                    border: "3px solid var(--ink)",
                    background: `var(--hl-${PAINT[i]})`,
                    boxSizing: "border-box",
                    scale: `1 ${squeeze}`,
                    transformOrigin: "50% 100%",
                  }}
                />
                <div style={{ position: "absolute", left: x, top: TUBE_Y + 14, width: TUBE_W, height: TUBE_H - 14, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 22, boxSizing: "border-box", fontSize: 34, fontWeight: 700, color: "var(--chip-ink)" }}>
                  {w}
                </div>
                <div style={{ position: "absolute", left: COLS[i] - 20, top: TUBE_Y + TUBE_H, width: 40, height: 34, borderRadius: "4px 4px 8px 8px", border: "3px solid var(--ink)", background: "var(--paper-2)", boxSizing: "border-box" }} />
                <div
                  style={{
                    position: "absolute",
                    left: COLS[i] + 26,
                    top: NOZZLE_Y + 6,
                    ...MONO,
                    fontSize: 30,
                    fontWeight: 700,
                    opacity: beat(frame, S.s3, 1.2 + i * 0.35, 0.4),
                  }}
                >
                  {P[i].toFixed(1)}%
                </div>
              </div>
            );
          })}
          <Hand x={620} y={NOZZLE_Y + 120} fs={46} style={{ opacity: beat(frame, S.s3, 4.6, 0.5), rotate: "-3deg" }}>
            {L.most}
          </Hand>
        </div>
      )}

      {/* s3–s5: the cup */}
      {frame >= S.s3.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: cupOn }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <clipPath id="ch49-cup">
                <path d={cupPath} />
              </clipPath>
            </defs>
            <g clipPath="url(#ch49-cup)">
              <rect x={CUP.cx - CUP.wTop / 2} y={level} width={CUP.wTop} height={CUP.bottom - level} style={{ fill: BLEND }} />
              <line x1={CUP.cx - wAt(level) / 2} y1={level} x2={CUP.cx + wAt(level) / 2} y2={level} stroke="var(--ink)" strokeOpacity={0.25} strokeWidth={3} />
            </g>
            <path d={`M ${CUP.cx - CUP.wTop / 2 - 8} ${CUP.top} L ${CUP.cx - CUP.wBot / 2} ${CUP.bottom} L ${CUP.cx + CUP.wBot / 2} ${CUP.bottom} L ${CUP.cx + CUP.wTop / 2 + 8} ${CUP.top}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", left: 56, top: 870, fontSize: 32, fontWeight: 500, color: "var(--ink-2)" }}>{L.cup}</div>
        </div>
      )}

      {/* s4–s5: the weighted sum written out */}
      {frame >= S.s4.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5)) }}>
          <Center y={330} fs={40}>
            {L.sumRule}
          </Center>
          <div style={{ position: "absolute", left: 130, top: 410, display: "grid", gap: 12, ...MONO, fontSize: 38 }}>
            {V.map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: beat(frame, S.s4, 0.9 + i * 0.7, 0.4) }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: `var(--hl-${PAINT[i]})`, border: "2.5px solid var(--ink)" }} />
                <span>
                  {W3[i].toFixed(3)} × {fmtVec(v)} = ({(W3[i] * v[0]).toFixed(3)}, {(W3[i] * v[1]).toFixed(3)})
                </span>
              </div>
            ))}
            <div style={{ height: 4, background: "var(--ink)", borderRadius: 2, marginLeft: 46, opacity: beat(frame, S.s4, 4.0, 0.4) }} />
            <div style={{ marginLeft: 46, fontWeight: 700, opacity: beat(frame, S.s4, 4.4, 0.4) }}>
              = ({W3.reduce((a, w, i) => a + w * V[i][0], 0).toFixed(3)}, {W3.reduce((a, w, i) => a + w * V[i][1], 0).toFixed(3)})
            </div>
          </div>
          {/* s5: the new vector */}
          <div style={{ opacity: beat(frame, S.s5, 0.4, 0.5) }}>
            <div style={{ position: "absolute", left: 572, top: 800, fontSize: 36, fontWeight: 700 }}>{L.result}</div>
            <div style={{ position: "absolute", left: 572, top: 852, ...MONO, fontSize: 48, fontWeight: 700 }}>
              {L.approx} <InlineCircle p={beat(frame, S.s5, 1.0, 0.6)}>{fmtVec(OUTV)}</InlineCircle>
            </div>
            <Hand x={572} y={952} fs={40} style={{ opacity: beat(frame, S.s5, 2.6, 0.5) }}>
              {L.newVec}
            </Hand>
          </div>
        </div>
      )}

      {/* s6: Values on a plane; the mix sits between them */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: planeOn }}>
          <Center y={140} fs={50}>
            {L.between}
          </Center>
          <Hand x={0} y={220} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 3.2, 0.5) }}>
            {L.pulled}
          </Hand>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={150} y1={OY} x2={960} y2={OY} stroke="var(--ink-3)" strokeWidth={3} />
            <line x1={OX} y1={OY + 50} x2={OX} y2={440} stroke="var(--ink-3)" strokeWidth={3} />
            {[1, 2, 3, 4].map((t) => (
              <line key={`x${t}`} x1={OX + t * U} y1={OY - 8} x2={OX + t * U} y2={OY + 8} stroke="var(--ink-3)" strokeWidth={3} />
            ))}
            {[1, 2].map((t) => (
              <line key={`y${t}`} x1={OX - 8} y1={OY - t * U} x2={OX + 8} y2={OY - t * U} stroke="var(--ink-3)" strokeWidth={3} />
            ))}
            <polygon points={HULL.map((v) => at(v).join(",")).join(" ")} fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth={4} strokeDasharray="10 10" opacity={beat(frame, S.s6, 1.0, 0.5)} />
            {V.map((v, i) => {
              const [x, y] = at(v);
              return (
                <line
                  key={i}
                  x1={x}
                  y1={y}
                  x2={mix(x, mx, pull)}
                  y2={mix(y, my, pull)}
                  stroke="var(--pen)"
                  strokeOpacity={0.7}
                  strokeWidth={3 + WEIGHT[FOCUS][i] * 22}
                  strokeLinecap="round"
                  opacity={pull > 0 ? 1 : 0}
                />
              );
            })}
          </svg>
          {[1, 2, 3, 4].map((t) => (
            <div key={`lx${t}`} style={{ position: "absolute", left: OX + t * U - 30, width: 60, top: OY + 14, textAlign: "center", ...MONO, fontSize: 28, color: "var(--ink-2)" }}>
              {t}
            </div>
          ))}
          {[1, 2].map((t) => (
            <div key={`ly${t}`} style={{ position: "absolute", left: OX - 66, width: 46, top: OY - t * U - 18, textAlign: "right", ...MONO, fontSize: 28, color: "var(--ink-2)" }}>
              {t}
            </div>
          ))}
          {V.map((v, i) => {
            const [x, y] = at(v);
            const o = beat(frame, S.s6, 0.5 + i * 0.15, 0.4);
            const right = i !== 0;
            const dy = i === 1 ? 52 : i === 3 ? 16 : -62;
            return (
              <div key={i} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: "50%", background: `var(--hl-${PAINT[i]})`, border: "4px solid var(--ink)", boxSizing: "border-box" }} />
                <div style={{ position: "absolute", top: y + dy, ...(right ? { left: x + (i === 3 ? 24 : 10) } : { right: 1080 - x + 18 }), fontSize: 32, fontWeight: 700, whiteSpace: "nowrap", background: "var(--paper)", padding: "0 6px", borderRadius: 8 }}>
                  {WORDS[i]} <span style={{ ...MONO, fontSize: 28, fontWeight: 500 }}>{fmtVec(v)}</span>
                </div>
              </div>
            );
          })}
          <div style={{ opacity: pull }}>
            <div style={{ position: "absolute", left: mx - 26, top: my - 26, width: 52, height: 52, borderRadius: "50%", background: BLEND, border: "5px solid var(--ink)", outline: "5px solid var(--pen)", outlineOffset: 3, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: mx + 36, top: my + 2, fontSize: 32, fontWeight: 700, color: "var(--pen)", whiteSpace: "nowrap", background: "var(--paper)", padding: "0 6px", borderRadius: 8 }}>
              {L.mixed} <span style={{ ...MONO, fontSize: 28 }}>{fmtVec(OUTV)}</span>
            </div>
          </div>
          <Example x={760} y={1000} text={L.ex} />
        </div>
      )}

      {/* s7: the same move as 45장's '배' */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.5)) }}>
          <Center y={140} fs={46}>
            {L.callback}
          </Center>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d={`M ${TRI[0].join(" ")} L ${TRI[1].join(" ")} L ${TRI[2].join(" ")} Z`} fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth={4} strokeLinejoin="round" />
            <path
              d={`M ${MID_AT[0]} ${MID_AT[1]} L ${mix(MID_AT[0], SEA_AT[0], beat(frame, S.s7, 1.0, 1.6, EASE_IO))} ${mix(MID_AT[1], SEA_AT[1], beat(frame, S.s7, 1.0, 1.6, EASE_IO))}`}
              stroke="var(--pen)"
              strokeWidth={5}
              strokeDasharray="4 14"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          {MEANING_ICONS.map((Icon, i) => {
            const pos: [number, number][] = [
              [540, 260],
              [270, 720],
              [810, 720],
            ];
            return <Icon key={i} size={90} x={pos[i][0] - 45} y={pos[i][1] - 45} />;
          })}
          {(() => {
            const t = beat(frame, S.s7, 1.0, 1.6, EASE_IO);
            const x = mix(MID_AT[0], SEA_AT[0], t);
            const y = mix(MID_AT[1], SEA_AT[1], t);
            return <div style={{ position: "absolute", left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: "50%", background: "var(--ink)", border: "6px solid var(--hl-yellow)", boxSizing: "border-box" }} />;
          })()}
          <Hand x={SEA_AT[0] - 300} y={SEA_AT[1] - 96} fs={42} style={{ opacity: beat(frame, S.s7, 2.6, 0.4), rotate: "-4deg" }}>
            {L.boat}
          </Hand>
          <Chip text={L.term} color="yellow" fs={52} x={540 - chipWidth(L.term, 52) / 2} y={810} style={{ opacity: beat(frame, S.s7, 4.0, 0.5) }} />
          <Center y={910} fs={40} weight={500} o={beat(frame, S.s7, 4.6, 0.5)}>
            {L.termDef}
          </Center>
        </div>
      )}

      {/* s8: one row so far; next, every row at once */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          {[0, 1].map((side) => {
            const x0 = side === 0 ? 150 : 600;
            const all = side === 1;
            return (
              <div key={side} style={{ opacity: side === 0 ? 1 : beat(frame, S.s8, 2.4, 0.5) }}>
                <div style={{ position: "absolute", left: x0 - 40, width: 410, top: 230, textAlign: "center", fontSize: 36, fontWeight: 700 }}>{all ? L.allWords : L.oneWord}</div>
                {WORDS.map((w, i) => (
                  <div key={w}>
                    <div style={{ position: "absolute", left: x0 - 40, width: 110, top: 320 + i * 90, height: 70, display: "flex", alignItems: "center", justifyContent: "flex-end", fontSize: 30, fontWeight: 500 }}>{w}</div>
                    {[0, 1, 2, 3].map((j) => (
                      <div
                        key={j}
                        style={{
                          position: "absolute",
                          left: x0 + 84 + j * 62,
                          top: 320 + i * 90,
                          width: 54,
                          height: 70,
                          borderRadius: 8,
                          background: all || i === FOCUS ? "var(--hl-yellow)" : "var(--paper-2)",
                          opacity: all ? beat(frame, S.s8, 2.8, 0.4) : 1,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
          <Hand x={0} y={720} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 3.6, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch49.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};

