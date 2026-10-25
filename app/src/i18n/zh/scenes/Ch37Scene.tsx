// zh overlay of src/scenes/Ch37Scene.tsx: full-width parentheses around the chapter-1 note.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CHAIN, NOVEL, PIZZA, ch37, fmtPct } from "../../../data/ch37";
import { Arrow, BarRow, Box, CurveArrow, Demo } from "../../../scenes/part4-kit";
import {
  Caption,
  Chip,
  EASE_IO,
  Hand,
  InlineCircle,
  Narration,
  Paper,
  PenCircle,
  Tag,
  beat,
  buildTimeline,
  byId,
  chipWidth,
  mix,
  rowLayout,
  type SceneProps,
} from "../../../scenes/kit";

const tl = buildTimeline(ch37);
const S = byId(tl);
const L = ch37.labels;

const OUTLINE = { background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)" } as const;

// s1: the two sentences, big
const FS1 = 58;
const A_WORDS = CHAIN.map((c) => c.w);
const B_WORDS = [...A_WORDS.slice(0, 3), PIZZA.w];
const ROW1 = (() => {
  const widths = A_WORDS.map((w) => chipWidth(w, FS1));
  return { widths, xs: rowLayout(widths, 20) };
})();

// s3–s6: the chain of words, split apart
const FS = 56;
const CW = A_WORDS.map((w) => chipWidth(w, FS));
const XS_TIGHT = rowLayout(CW, 4);
const XS = rowLayout(CW, 84);
const CX = XS.map((x, i) => x + CW[i] / 2);
const ROW_Y = 290;
const STRIP_Y = 660;
const BASE = 790;
const BAR_SC = 560;
const BAR_W = 116;

const A_P = CHAIN.reduce((a, c) => a * c.p, 1);
const B_P = CHAIN.slice(0, 3).reduce((a, c) => a * c.p, 1) * PIZZA.p;
const RATIO = Math.round(A_P / B_P);

// s7: next-word bars from ch01 (illustrative)
const NEXT = [
  { w: CHAIN[3].w, p: 0.52, c: "var(--hl-yellow)" },
  { w: L.gaws, p: 0.21, c: "var(--hl-mint)" },
  { w: L.late, p: 0.12, c: "var(--hl-sky)" },
  { w: PIZZA.w, p: PIZZA.p, c: "var(--hl-pink)" },
];

// 正 tally strokes in a 140×140 box
const TALLY: [number, number, number, number][] = [
  [12, 12, 128, 12],
  [70, 12, 70, 130],
  [70, 70, 120, 70],
  [26, 58, 26, 130],
  [4, 130, 136, 130],
];

export const Ch37Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2On = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const s3Top = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const chainOn = beat(frame, S.s3, 3.0, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const split = beat(frame, S.s3, 5.6, 1.0, EASE_IO);
  const rise = beat(frame, S.s4, 0.1, 0.9, EASE_IO);
  const toPizza = beat(frame, S.s6, 0.5, 0.9, EASE_IO);
  const s7On = beat(frame, S.s7, 0.4, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.3, 0.5);

  // s4: the word whose probability is being found right now (look-back bracket over the words before it)
  const POP = [1.0, 2.8, 4.6, 6.4];
  const pops = POP.map((t) => beat(frame, S.s4, t, 0.6));
  const current = frame < S.s4.from ? -1 : pops.reduce((acc, v, i) => (v > 0 ? i : acc), -1);
  const lookOut = 1 - beat(frame, S.s5, 0, 0.4);
  const chainY = mix(STRIP_Y, ROW_Y, rise);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: two sentences */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          {[A_WORDS, B_WORDS].map((words, r) => (
            <div key={r}>
              {words.map((w, i) => (
                <Chip
                  key={w}
                  text={w}
                  fs={FS1}
                  color={i === 3 ? (r === 0 ? "yellow" : "pink") : null}
                  x={ROW1.xs[i]}
                  y={330 + r * 230}
                  w={ROW1.widths[i]}
                  style={{ ...(i < 3 ? OUTLINE : {}), opacity: beat(frame, S.s1, 0.4 + r * 1.8 + i * 0.25, 0.4) }}
                />
              ))}
            </div>
          ))}
          <Hand x={0} y={800} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 4.6, 0.5) }}>
            {L.which}
          </Hand>
        </div>
      )}

      {/* s2: a machine that gives each sentence a probability */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          <Box x={330} y={300} w={420} h={210}>
            <div style={{ fontSize: 60, fontWeight: 700 }}>{L.lm}</div>
            <div style={{ fontSize: 32, fontWeight: 500, marginTop: 4 }}>{L.lmEn}</div>
          </Box>
          <div style={{ position: "absolute", left: 96, top: 375, fontSize: 42, fontWeight: 700 }}>{L.inSent}</div>
          <Arrow x1={196} y1={405} x2={316} y2={405} p={beat(frame, S.s2, 0.8, 0.5)} />
          <Arrow x1={764} y1={405} x2={884} y2={405} p={beat(frame, S.s2, 1.3, 0.5)} />
          <div style={{ position: "absolute", left: 900, top: 375, fontSize: 42, fontWeight: 700, opacity: beat(frame, S.s2, 1.5, 0.4) }}>{L.outProb}</div>
          {[
            { words: A_WORDS, w: 420, c: "var(--hl-yellow)", t: L.high, at: 2.2 },
            { words: B_WORDS, w: 12, c: "var(--hl-pink)", t: L.low, at: 3.4 },
          ].map((r, i) => {
            const g = beat(frame, S.s2, r.at, 0.8);
            const y = 620 + i * 120;
            return (
              <div key={i} style={{ opacity: beat(frame, S.s2, r.at - 0.4, 0.4) }}>
                <div style={{ position: "absolute", left: 96, top: y, fontSize: 40, fontWeight: 500 }}>{r.words.join(" ")}</div>
                <div style={{ position: "absolute", left: 500, top: y + 4, height: 44, width: Math.max(8, r.w * g), borderRadius: 22, background: r.c }} />
                <Hand x={500 + Math.max(8, r.w * g) + 20} y={y - 4} fs={50} style={{ opacity: g }}>
                  {r.t}
                </Hand>
              </div>
            );
          })}
          <Hand x={0} y={900} fs={56} color="var(--ink)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 5.0, 0.5) }}>
            <InlineCircle p={beat(frame, S.s2, 5.5, 0.6)}>{L.chatgpt}</InlineCircle>
          </Hand>
        </div>
      )}

      {/* s3: too many new sentences to count whole */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3Top }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontSize: 50, fontWeight: 700 }}>{L.whole}</div>
          {NOVEL.map((s, i) => (
            <div key={s} style={{ position: "absolute", left: 96, top: 270 + i * 100, display: "flex", gap: 18, alignItems: "center", opacity: beat(frame, S.s3, 0.8 + i * 0.5, 0.4) }}>
              <span style={{ fontSize: 38, color: "var(--ink-2)", background: "var(--paper-2)", borderRadius: 10, padding: "4px 14px" }}>{s}</span>
              <span style={{ fontSize: 30, fontWeight: 500, background: "var(--hl-orange)", color: "var(--chip-ink)", borderRadius: 8, padding: "2px 10px" }}>{L.novel}</span>
            </div>
          ))}
          <Hand x={0} y={480} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 2.0, 0.4) }}>
            {L.tooMany}
          </Hand>
          {/* cut lines between the words */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {[0, 1, 2].map((i) => {
              const x = mix(XS_TIGHT[i] + CW[i] + 2, XS[i] + CW[i] + 42, split);
              const p = beat(frame, S.s3, 4.4 + i * 0.25, 0.4);
              return (
                <line
                  key={i}
                  x1={x}
                  y1={STRIP_Y - 30}
                  x2={x}
                  y2={mix(STRIP_Y - 30, STRIP_Y + FS * 1.5 + 30, p)}
                  stroke="var(--pen)"
                  strokeWidth={5}
                  strokeDasharray="12 10"
                  strokeLinecap="round"
                  opacity={p > 0 ? 1 - split : 0}
                />
              );
            })}
          </svg>
          <Hand x={0} y={820} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 6.6, 0.5) }}>
            {L.split}
          </Hand>
        </div>
      )}

      {/* s3–s6: the chain of words, bars and the product */}
      {frame >= S.s3.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: chainOn }}>
          {A_WORDS.map((w, i) => {
            const x = mix(XS_TIGHT[i], XS[i], split);
            const isLast = i === 3;
            return (
              <div key={w}>
                <Chip text={w} fs={FS} color={isLast ? "yellow" : null} x={x} y={chainY} w={CW[i]} style={isLast ? { opacity: 1 - toPizza } : OUTLINE} />
                {isLast && toPizza > 0 && <Chip text={PIZZA.w} fs={FS} color="pink" x={x} y={chainY} w={CW[i]} style={{ opacity: toPizza }} />}
              </div>
            );
          })}

          {/* s4: probability of each word given the words before it */}
          <Demo text={L.demo} o={beat(frame, S.s4, 0.6, 0.4)} />
          {frame >= S.s4.from &&
            CHAIN.map((c, i) => {
              const g = pops[i];
              const p = i === 3 ? mix(c.p, PIZZA.p, toPizza) : c.p;
              const h = p * BAR_SC * g;
              const color = i === 3 ? (toPizza > 0.5 ? "var(--hl-pink)" : "var(--hl-yellow)") : `var(--hl-${c.c})`;
              return (
                <div key={c.w} style={{ opacity: g }}>
                  <div style={{ position: "absolute", left: CX[i] - BAR_W / 2, top: BASE - h, width: BAR_W, height: Math.max(h, 4), background: color, borderRadius: "14px 14px 3px 3px" }} />
                  <div style={{ position: "absolute", left: CX[i] - 100, width: 200, top: BASE - h - 62, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 46, fontWeight: 500 }}>
                    {i === 3 && toPizza > 0.5 ? fmtPct(PIZZA.p) : fmtPct(c.p)}
                  </div>
                </div>
              );
            })}
          {frame >= S.s4.from && (
            <div style={{ position: "absolute", left: XS[0] - 20, top: BASE - 2, width: XS[3] + CW[3] - XS[0] + 40, height: 4, background: "var(--ink)", borderRadius: 2, opacity: pops[0] }} />
          )}
          {/* look-back bracket over the words before the current one */}
          {current >= 0 && (
            <div style={{ opacity: lookOut }}>
              {current === 0 ? (
                <Hand x={CX[0] - 150} y={ROW_Y - 92} fs={44} style={{ opacity: pops[0] * (1 - pops[1]) }}>
                  {L.first}
                </Hand>
              ) : (
                (() => {
                  const k = current;
                  const a = pops[k];
                  const left = XS[0];
                  const right = XS[k - 1] + CW[k - 1];
                  const y = ROW_Y - 26;
                  return (
                    <div key={k} style={{ opacity: a }}>
                      <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                        <path
                          d={`M ${left} ${y + 14} L ${left} ${y} L ${right} ${y} L ${right} ${y + 14}`}
                          fill="none"
                          stroke="var(--pen)"
                          strokeWidth={5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pathLength={1}
                          strokeDasharray={1}
                          strokeDashoffset={1 - a}
                        />
                      </svg>
                      <CurveArrow x1={(left + right) / 2 + 30} y1={y} cx={(right + CX[k]) / 2 + 20} cy={y - 90} x2={CX[k]} y2={ROW_Y - 10} p={beat(frame, S.s4, POP[k] + 0.2, 0.5)} width={5} />
                      <Hand x={left} y={y - 70} fs={42} style={{ opacity: a }}>
                        {L.look}
                      </Hand>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* s5: multiply them */}
          {frame >= S.s5.from && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 850,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 14,
                fontFamily: "var(--font-mono)",
                fontSize: 50,
                fontWeight: 500,
              }}
            >
              {CHAIN.map((c, i) => {
                const last = i === 3;
                return (
                  <span key={c.w} style={{ display: "flex", gap: 14, alignItems: "center", opacity: beat(frame, S.s5, 0.4 + i * 0.4, 0.4) }}>
                    {i > 0 && <span style={{ color: "var(--ink-3)" }}>{L.times}</span>}
                    <span
                      style={{
                        background: last && toPizza > 0.5 ? "var(--hl-pink)" : `var(--hl-${c.c})`,
                        color: "var(--chip-ink)",
                        borderRadius: 8,
                        padding: "0 8px",
                        opacity: i < 3 ? mix(1, 0.45, toPizza) : 1,
                      }}
                    >
                      {last && toPizza > 0.5 ? fmtPct(PIZZA.p) : fmtPct(c.p)}
                    </span>
                  </span>
                );
              })}
              <span style={{ opacity: beat(frame, S.s5, 2.4, 0.4) }}>
                {L.eq}{" "}
                <InlineCircle p={toPizza > 0.5 ? beat(frame, S.s6, 1.6, 0.6) : beat(frame, S.s5, 2.8, 0.6) * (1 - toPizza * 2)}>
                  <b>{toPizza > 0.5 ? fmtPct(B_P) : fmtPct(A_P)}</b>
                </InlineCircle>
              </span>
            </div>
          )}
          <Hand x={600} y={950} fs={48} style={{ opacity: beat(frame, S.s5, 4.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.4)), rotate: "-2deg" }}>
            {L.smaller}
          </Hand>

          {/* s6: the 피자 sentence */}
          {frame >= S.s6.from && (
            <>
              <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <path
                  d={`M ${XS[0]} ${ROW_Y - 12} L ${XS[0]} ${ROW_Y - 28} L ${XS[2] + CW[2]} ${ROW_Y - 28} L ${XS[2] + CW[2]} ${ROW_Y - 12}`}
                  fill="none"
                  stroke="var(--ink-3)"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - beat(frame, S.s6, 1.8, 0.6)}
                />
              </svg>
              <Hand x={XS[0]} y={ROW_Y - 96} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s6, 2.2, 0.4) }}>
                {L.same}
              </Hand>
              <div style={{ position: "absolute", left: 0, right: 0, top: 946, textAlign: "center", fontSize: 40, fontWeight: 500, opacity: beat(frame, S.s6, 3.4, 0.5) }}>
                <span style={{ color: "var(--ink-2)" }}>{L.was}</span> <span style={{ fontFamily: "var(--font-mono)" }}>{fmtPct(A_P)}</span>
                <span style={{ color: "var(--ink-3)" }}> {L.vs} </span>
                <span style={{ color: "var(--ink-2)" }}>{L.now}</span> <span style={{ fontFamily: "var(--font-mono)" }}>{fmtPct(B_P)}</span>
              </div>
              <Hand x={0} y={1022} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.6, 0.4) }}>
                <InlineCircle p={beat(frame, S.s6, 5.0, 0.6)}>
                  {RATIO}
                  {L.ratio}
                </InlineCircle>
              </Hand>
              <PenCircle x={CX[3] - 90} y={BASE - 80} w={180} h={110} p={beat(frame, S.s6, 1.2, 0.6)} />
            </>
          )}
        </div>
      )}

      {/* s7: next-word prediction is the same game */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontSize: 54, fontWeight: 700, lineHeight: 1.35 }}>
            {L.rule.split(" = ")[0]}
            <br />= {L.rule.split(" = ")[1]}
          </div>
          <div style={{ position: "absolute", left: 120, top: 420, fontSize: 46, fontWeight: 500, display: "flex", gap: 16, alignItems: "center", opacity: beat(frame, S.s7, 1.6, 0.4) }}>
            {L.prefix}
            <span style={{ display: "inline-block", width: 150, height: 62, border: "4px dashed var(--ink-3)", borderRadius: 12 }} />
          </div>
          <Hand x={680} y={424} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, S.s7, 2.0, 0.4) }}>
            （{L.ch01}）
          </Hand>
          {NEXT.map((n, i) => (
            <BarRow key={n.w} x={120} y={540 + i * 86} label={n.w} p={n.p} scale={1000} color={n.c} grow={beat(frame, S.s7, 2.4 + i * 0.25, 0.6)} fs={44} />
          ))}
          <Demo text={L.demo} o={beat(frame, S.s7, 2.4, 0.4)} />
          <Hand x={0} y={940} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.2, 0.5) }}>
            {L.mult}
          </Hand>
        </div>
      )}

      {/* s8: where do the numbers come from? */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontSize: 58, fontWeight: 700 }}>{L.where}</div>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {[0, 1, 2].map((g) =>
              TALLY.slice(0, g < 2 ? 5 : 3).map(([x1, y1, x2, y2], k) => {
                const p = beat(frame, S.s8, 1.0 + (g * 5 + k) * 0.22, 0.25);
                const ox = 540 - 250 + g * 180;
                const oy = 480;
                return (
                  <line
                    key={`${g}-${k}`}
                    x1={ox + x1}
                    y1={oy + y1}
                    x2={ox + mix(x1, x2, p)}
                    y2={oy + mix(y1, y2, p)}
                    stroke="var(--pen)"
                    strokeWidth={9}
                    strokeLinecap="round"
                    opacity={p > 0 ? 1 : 0}
                  />
                );
              }),
            )}
          </svg>
          <Hand x={0} y={700} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 4.4, 0.5) }}>
            {L.count}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 840, textAlign: "center", opacity: beat(frame, S.s8, 5.6, 0.5) }}>
            <span style={{ fontSize: 46, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 14, padding: "6px 22px" }}>{L.next}</span>
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch37.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
