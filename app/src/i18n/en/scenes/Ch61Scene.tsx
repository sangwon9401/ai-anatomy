// en overlay of src/scenes/Ch61Scene.tsx: the feed-forward boxes in s7 are wider (236 instead of 200) so 'Feed-forward' fits,
// and in s2 the tokens split off from where each English word starts in the sentence.
import type { CSSProperties, FC } from "react";
import { useCurrentFrame } from "remotion";
import { ATT_PCT, D_ATT, D_FFN, EMB, FINAL, IDS, LOGITS, OUT, OUT_PCT, POS, STATIONS, TOKENS, X0, X1, X2, ch61 } from "../../../data/ch61";
import type { Highlighter } from "../../../data/types";
import { BP_X, Blueprint, Layer, PenArrow, VecCells, WordChip, blueprintGeo, fmt, wordW } from "../../../scenes/part6-block";
import { Caption, Chip, EASE_IO, Hand, InlineUnderline, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, textWidth, type SceneProps } from "../../../scenes/kit";

const tl = buildTimeline(ch61);
const S = byId(tl);
const L = ch61.labels;

// ---- header: where we are on the trip ----
const GROUP = [0, 1, 2, 3, 3, 3, 3, 4, 4, 5];
const GROUP_COLOR: Highlighter[] = ["sky", "sky", "sky", "yellow", "mint", "mint"];
const STEP_STATION: Record<string, number> = { s2: 0, s3: 1, s4: 2, s5: 3, s6: 4, s7: 5, s8: 6, s9: 7, s10: 8, s11: 9 };

const Header: FC<{ station: number; o: number; fade: number }> = ({ station, o, fade }) => {
  const st = STATIONS[station];
  const g = GROUP[station];
  return (
    <div style={{ opacity: o }}>
      {GROUP_COLOR.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 64 + i * 42,
            top: 112,
            width: 30,
            height: 30,
            borderRadius: 8,
            boxSizing: "border-box",
            background: i <= g ? `var(--hl-${c})` : "var(--paper)",
            border: i <= g ? "none" : "3px dashed var(--ink-3)",
            outline: i === g ? "4px solid var(--pen)" : "none",
            outlineOffset: 3,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 340, top: 104, fontSize: 36, fontWeight: 700, whiteSpace: "nowrap", opacity: fade }}>
        {st.name} <span style={{ fontFamily: "var(--font-hand)", fontWeight: 400, color: "var(--pen)", fontSize: 34 }}>({st.where})</span>
      </div>
    </div>
  );
};

// ---- the three travellers ----
const CX = [270, 540, 810];
const CHIP_Y = 206;
const ID_Y = 282;
const VEC_Y = 340;
const CW = 136;
const CH = 58;
const GAP = 8;
const VEC_H = 4 * CH + 3 * GAP;
const VEC_B = VEC_Y + VEC_H;
const DW = 66;
const DX = 76;

const Cells: FC<{ v: number[]; x: number; o?: number; w?: number; color?: Highlighter }> = ({ v, x, o = 1, w = CW, color }) => (
  <VecCells x={x} y={VEC_Y} v={v} cw={w} ch={CH} gap={GAP} fs={w < 100 ? 28 : 32} o={o} color={color} />
);

/** values that switch from `a` to `b` around `t` = 0.5 (crossfade) */
const Swap: FC<{ a: number[]; b: number[]; t: number; x: number }> = ({ a, b, t, x }) => (
  <>
    {t < 1 && <Cells v={a} x={x} o={1 - t} />}
    {t > 0 && <Cells v={b} x={x} o={t} />}
  </>
);

/** a small column that slides into the main one and is added to it */
const Delta: FC<{ v: number[]; cx: number; color: Highlighter; show: number; merge: number; label?: string }> = ({ v, cx, color, show, merge, label }) => (
  <div style={{ opacity: show * (1 - merge), translate: `${mix(0, -DX, merge)}px 0px` }}>
    <div style={{ position: "absolute", left: cx + DX - 4, width: DW + 8, top: VEC_Y - 50, textAlign: "center", fontSize: 40, fontWeight: 700, color: "var(--pen)" }}>+</div>
    <Cells v={v} x={cx + DX} w={DW} color={color} />
    {label && <div style={{ position: "absolute", left: cx + DX - 20, width: DW + 40, top: VEC_B + 8, textAlign: "center", fontSize: 28, color: "var(--ink-2)" }}>{label}</div>}
  </div>
);

// s2: a glimpse of the vocabulary
const VOCAB_ROWS = [
  { id: L.vdots, w: "", hit: -1 },
  { id: `#${IDS[0]}`, w: TOKENS[0], hit: 0 },
  { id: L.vdots, w: "", hit: -1 },
  { id: `#${IDS[1]}`, w: TOKENS[1], hit: 1 },
  { id: L.vdots, w: "", hit: -1 },
  { id: `#${IDS[2]}`, w: TOKENS[2], hit: 2 },
  { id: L.vdots, w: "", hit: -1 },
];

// s3: the embedding table
const TABLE_ROWS = 9;
const HIT_ROW = [1, 4, 7];

// s9–s11 rows
const ROW_Y = (i: number) => 336 + i * 104;
const ROWS = [
  ...LOGITS.map((l, i) => ({ w: l.w, c: l.c as Highlighter | null, score: `${fmt(l.s)}${L.pt}`, pct: OUT_PCT[i], p: OUT.p[i] })),
  { w: L.rest, c: null as Highlighter | null, score: `${L.restScore}${L.pt}`, pct: OUT_PCT[4], p: OUT.restP },
];
const BAR_X = 580;
const BAR_W = 380 / 0.6;

const SENT_FS = 40;
const SENT_W = TOKENS.map((w) => wordW(w, SENT_FS));
const SENT_X = (() => {
  let x = 120;
  return SENT_W.map((w) => {
    const at = x;
    x += w + 14;
    return at;
  });
})();
const SLOT_X = SENT_X[2] + SENT_W[2] + 14;

export const Ch61Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const stepNow = tl.find((s) => frame >= s.from && frame < s.to) ?? tl[tl.length - 1];
  const station = STEP_STATION[stepNow.id];

  const on1 = beat(frame, S.s1, 0.2, 0.6) * (1 - beat(frame, S.s2, 0, 0.5));
  const onB = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s9, 0, 0.5));
  const onC = beat(frame, S.s9, 0.2, 0.5) * (1 - beat(frame, S.s12, 0, 0.5));
  const on12 = beat(frame, S.s12, 0.3, 0.6);
  const headO = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s12, 0, 0.5));
  const headFade = beat(frame, stepNow, 0, 0.35);

  // s2: the sentence splits into tokens
  const split = beat(frame, S.s2, 1.2, 1.0, EASE_IO);
  const idsOn = beat(frame, S.s2, 2.8, 0.5);
  // s3: embeddings arrive
  const tableOn = beat(frame, S.s3, 0.4, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const embIn = (i: number) => beat(frame, S.s3, 2.4 + i * 0.4, 0.6);
  // s4: + position
  const posShow = beat(frame, S.s4, 0.6, 0.5);
  const posMerge = beat(frame, S.s4, 3.4, 0.8, EASE_IO);
  // s5: attention
  const normFlash = beat(frame, S.s5, 0.5, 0.4) * (1 - beat(frame, S.s5, 2.2, 0.4));
  const arcsOn = (k: number) => beat(frame, S.s5, 2.6 + k * 0.5, 0.7);
  const s5Out = 1 - beat(frame, S.s6, 0, 0.4);
  // s6: + attention result
  const attShow = beat(frame, S.s6, 0.4, 0.5);
  const attMerge = beat(frame, S.s6, 3.2, 0.8, EASE_IO);
  // s7: feed-forward
  const ffnBox = beat(frame, S.s7, 0.6, 0.5) * (1 - beat(frame, S.s8, 0, 0.4));
  const ffnShow = beat(frame, S.s7, 2.0, 0.5);
  const ffnMerge = beat(frame, S.s7, 4.6, 0.8, EASE_IO);
  // s8: × 96
  const count = beat(frame, S.s8, 0.6, 4.4, EASE_IO);
  const toFinal = beat(frame, S.s8, 3.6, 1.0);

  const valuesAt = (i: number) => {
    if (frame >= S.s8.from) return <Swap a={X2[i]} b={FINAL[i]} t={toFinal} x={CX[i] - CW / 2} />;
    if (frame >= S.s7.from) return <Swap a={X1[i]} b={X2[i]} t={ffnMerge} x={CX[i] - CW / 2} />;
    if (frame >= S.s6.from) return <Swap a={X0[i]} b={X1[i]} t={attMerge} x={CX[i] - CW / 2} />;
    if (frame >= S.s4.from) return <Swap a={EMB[i]} b={X0[i]} t={posMerge} x={CX[i] - CW / 2} />;
    if (frame >= S.s3.from) return <Cells v={EMB[i]} x={CX[i] - CW / 2} o={embIn(i)} />;
    return null;
  };

  // s9–s11
  const scoreOn = (i: number) => beat(frame, S.s9, 1.6 + i * 0.4, 0.5);
  const toProb = beat(frame, S.s10, 0.4, 1.2, EASE_IO);
  const pickP = beat(frame, S.s11, 0.8, 0.6);
  const fly = beat(frame, S.s11, 2.2, 1.0, EASE_IO);

  // s1 / s12 overview
  const BPG = blueprintGeo(236);
  const loopP = beat(frame, S.s12, 1.6, 1.6);
  const s12W = [...TOKENS, L.w4].map((w) => wordW(w, 38));
  const s12X = (() => {
    let x = 230;
    return s12W.map((w) => {
      const at = x;
      x += w + 12;
      return at;
    });
  })();
  const s1End = 230 + TOKENS.map((w) => wordW(w, 38) + 12).reduce((a, b) => a + b, 0);
  const s12End = s12X[3] + s12W[3] + 12;

  const flyFrom = { x: 350, y: ROW_Y(0) };
  const ganW = chipWidth(L.w4, SENT_FS);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the whole machine */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: on1 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 92, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{L.title}</div>
          {TOKENS.map((w, i) => (
            <WordChip key={w} text={w} x={230 + TOKENS.slice(0, i).reduce((a, t) => a + wordW(t, 38) + 12, 0)} y={160} fs={38} o={beat(frame, S.s1, 0.6 + i * 0.15, 0.4)} />
          ))}
          <div style={{ position: "absolute", left: s1End, top: 160, fontSize: 40, fontWeight: 700, color: "var(--pen)", opacity: beat(frame, S.s1, 1.4, 0.4) }}>
            {L.arrow} {L.q}
          </div>
          <Blueprint y0={236} show={{ tok: beat(frame, S.s1, 1.0, 0.4), emb: beat(frame, S.s1, 1.4, 0.4), pos: beat(frame, S.s1, 1.8, 0.4), block: beat(frame, S.s1, 2.4, 0.5), out: beat(frame, S.s1, 3.2, 0.4), loop: beat(frame, S.s1, 3.6, 0.4) }} layers={beat(frame, S.s1, 2.8, 0.8)} />
        </div>
      )}

      {headO > 0 && station !== undefined && <Header station={station} o={headO} fade={headFade} />}

      {/* s2–s8: the three word vectors travel */}
      {frame >= S.s2.from && frame < S.s9.from + 15 && (
        <div style={{ opacity: onB }}>
          <div style={{ position: "absolute", right: 70, top: 160, fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s3, 0, 0.4) }}>{L.toy}</div>
          {/* s2: one sentence → three tokens */}
          {split < 1 && (
            <WordChip text={L.sentence} x={540 - wordW(L.sentence, 48) / 2} y={CHIP_Y} fs={48} o={1 - split} style={{ scale: String(mix(1, 0.9, split)) }} />
          )}
          {TOKENS.map((w, i) => {
            const ww = wordW(w, 44);
            const x0 = 540 - wordW(L.sentence, 48) / 2 + textWidth(TOKENS.slice(0, i).map((t) => `${t} `).join(""), 48);
            return <WordChip key={w} text={w} x={mix(x0, CX[i] - ww / 2, split)} y={CHIP_Y} fs={44} o={split} />;
          })}
          {IDS.map((id, i) => (
            <div key={id} style={{ position: "absolute", left: CX[i] - 90, width: 180, top: ID_Y, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 500, color: "var(--ink-2)", opacity: idsOn }}>
              #{id}
            </div>
          ))}
          {frame < S.s3.from + 15 && (
            <div style={{ opacity: beat(frame, S.s2, 2.0, 0.5) * (1 - beat(frame, S.s3, 0, 0.4)) }}>
              <div style={{ position: "absolute", left: 290, top: 420, width: 500, height: 420, borderRadius: 20, border: "4px solid var(--ink)", background: "var(--paper)" }} />
              <div style={{ position: "absolute", left: 290, width: 500, top: 436, textAlign: "center", fontSize: 34, fontWeight: 700 }}>{L.vocab}</div>
              {VOCAB_ROWS.map((r, k) => (
                <div key={k} style={{ position: "absolute", left: 330, width: 420, top: 500 + k * 54, height: 46, borderRadius: 10, background: r.hit >= 0 ? "var(--hl-sky)" : "transparent", display: "flex", alignItems: "center", gap: 24, padding: "0 18px", boxSizing: "border-box", fontSize: 30, color: r.hit >= 0 ? "var(--chip-ink)" : "var(--ink-3)", opacity: r.hit >= 0 ? beat(frame, S.s2, 2.8 + r.hit * 0.3, 0.4) : 1 }}>
                  <span style={{ fontFamily: "var(--font-mono)", width: 120 }}>{r.id}</span>
                  <span>{r.w}</span>
                </div>
              ))}
              <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.idToy}</div>
            </div>
          )}

          {/* s3: the embedding table */}
          {frame >= S.s3.from && frame < S.s4.from + 15 && (
            <div style={{ opacity: tableOn }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontSize: 34, fontWeight: 700 }}>{L.table}</div>
              {Array.from({ length: TABLE_ROWS }, (_, r) => {
                const hit = HIT_ROW.indexOf(r);
                return (
                  <div key={r}>
                    {hit >= 0 && (
                      <div style={{ position: "absolute", left: 200, width: 150, top: 702 + r * 30 - 6, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink)", opacity: beat(frame, S.s3, 1.0 + hit * 0.3, 0.4) }}>
                        #{IDS[hit]}
                      </div>
                    )}
                    {Array.from({ length: 10 }, (_, c) => (
                      <div
                        key={c}
                        style={{
                          position: "absolute",
                          left: 370 + c * 44,
                          top: 704 + r * 30,
                          width: 40,
                          height: 24,
                          borderRadius: 4,
                          background: hit >= 0 && beat(frame, S.s3, 1.0 + hit * 0.3, 0.4) > 0.5 ? "var(--hl-sky)" : "var(--paper-2)",
                          border: "1.5px solid var(--line)",
                        }}
                      />
                    ))}
                  </div>
                );
              })}
              <Hand x={0} y={980} fs={42} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 2.2, 0.4) }}>
                {L.lookup} · {L.real}
              </Hand>
            </div>
          )}

          {frame >= S.s8.from &&
            CX.map((cx) => (
              <div key={cx} style={{ position: "absolute", left: cx - CW / 2 - 14, top: VEC_Y - 14, width: CW + 28, height: VEC_H + 28, borderRadius: 18, background: "var(--hl-yellow)", opacity: 0.55 * count * (1 - beat(frame, S.s9, 0, 0.4)) }} />
            ))}
          {TOKENS.map((_, i) => (
            <div key={i}>{valuesAt(i)}</div>
          ))}

          {/* s4: + position */}
          {frame >= S.s4.from && frame < S.s5.from + 10 &&
            POS.map((p, i) => <Delta key={i} v={p} cx={CX[i]} color="violet" show={posShow} merge={posMerge} label={`${i + 1}${L.nth}`} />)}
          {frame >= S.s4.from && frame < S.s5.from + 15 && (
            <div style={{ opacity: 1 - beat(frame, S.s5, 0, 0.4) }}>
              <Hand x={0} y={690} fs={46} style={{ width: 1080, textAlign: "center", opacity: posShow }}>
                {L.posNote}
              </Hand>
              <Layer>
                <PenArrow x1={540} y1={790} x2={540} y2={880} p={beat(frame, S.s4, 5.0, 0.5)} width={7} />
              </Layer>
              <Hand x={570} y={810} fs={46} style={{ opacity: beat(frame, S.s4, 5.4, 0.4) }}>
                {L.toBlock}
              </Hand>
            </div>
          )}

          {/* s5: normalise, then attention */}
          {frame >= S.s5.from && frame < S.s6.from + 15 && (
            <div style={{ opacity: s5Out }}>
              {CX.map((cx) => (
                <div key={cx} style={{ position: "absolute", left: cx - CW / 2 - 10, top: VEC_Y - 10, width: CW + 20, height: VEC_H + 20, borderRadius: 16, border: "6px solid var(--hl-violet)", boxSizing: "border-box", opacity: normFlash }} />
              ))}
              <Chip text={L.norm} color="violet" fs={36} x={540 - chipWidth(L.norm, 36) / 2} y={VEC_B + 30} style={{ opacity: normFlash }} />
              <Layer>
                {[0, 1, 2].map((j, k) => {
                  const p = arcsOn(k);
                  const w = 4 + ATT_PCT[2][j] * 0.32;
                  const x1 = CX[2] - 20 + k * 20;
                  const d = j === 2 ? `M ${x1 - 20} ${VEC_B + 6} C ${x1 - 50} ${VEC_B + 120}, ${x1 + 70} ${VEC_B + 120}, ${x1 + 30} ${VEC_B + 6}` : `M ${x1} ${VEC_B + 6} Q ${(x1 + CX[j]) / 2} ${VEC_B + 6 + (CX[2] - CX[j]) * 0.5} ${CX[j]} ${VEC_B + 6}`;
                  return <path key={j} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke="var(--pen)" strokeWidth={w} strokeLinecap="round" opacity={p > 0 ? 0.85 : 0} />;
                })}
              </Layer>
              {[0, 1, 2].map((j, k) => (
                <div key={j} style={{ position: "absolute", left: j === 2 ? CX[2] + 60 : CX[j] - 130, width: 110, top: VEC_B + 14, textAlign: j === 2 ? "left" : "right", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500, color: "var(--pen)", opacity: arcsOn(k) }}>
                  {ATT_PCT[2][j]}%
                </div>
              ))}
              <Hand x={80} y={900} fs={42} style={{ opacity: beat(frame, S.s5, 4.6, 0.4) }}>
                {L.looks}
              </Hand>
              <div style={{ opacity: beat(frame, S.s5, 5.6, 0.4) }}>
                {[0, 1, 2].map((r) =>
                  [0, 1, 2].map((c) => (
                    <div key={`${r}${c}`} style={{ position: "absolute", left: 850 + c * 38, top: 870 + r * 38, width: 34, height: 34, borderRadius: 5, background: c <= r ? "var(--hl-yellow)" : "var(--ink-3)", opacity: c <= r ? 1 : 0.5 }} />
                  )),
                )}
                <Hand x={800} y={990} fs={34}>
                  {L.mask}
                </Hand>
              </div>
            </div>
          )}

          {/* s6: + what attention mixed in */}
          {frame >= S.s6.from && frame < S.s7.from + 10 && D_ATT.map((d, i) => <Delta key={i} v={d} cx={CX[i]} color="mint" show={attShow} merge={attMerge} />)}
          {frame >= S.s6.from && frame < S.s7.from + 15 && (
            <Hand x={0} y={700} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 1.0, 0.4) * (1 - beat(frame, S.s7, 0, 0.4)) }}>
              {L.addNote}
            </Hand>
          )}

          {/* s7: feed-forward, word by word */}
          {frame >= S.s7.from && frame < S.s8.from + 15 && (
            <div style={{ opacity: ffnBox }}>
              {CX.map((cx) => (
                <div key={cx}>
                  <div style={{ position: "absolute", left: cx - 118, top: 720, width: 236, height: 74, borderRadius: 16, background: "var(--hl-yellow)", border: "4px solid var(--ink)", boxSizing: "border-box", display: "grid", placeItems: "center", fontSize: 32, fontWeight: 700, color: "var(--chip-ink)" }}>{L.ffn}</div>
                  <Layer>
                    <PenArrow x1={cx + 60} y1={714} x2={cx + DX + DW / 2} y2={VEC_B + 12} p={beat(frame, S.s7, 1.6, 0.5)} color="var(--ink-3)" width={5} />
                  </Layer>
                </div>
              ))}
              <Hand x={0} y={840} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 1.2, 0.4) }}>
                {L.ffnNote}
              </Hand>
            </div>
          )}
          {frame >= S.s7.from && frame < S.s8.from + 10 && D_FFN.map((d, i) => <Delta key={i} v={d} cx={CX[i]} color="yellow" show={ffnShow} merge={ffnMerge} />)}

          {/* s8: × 96 */}
          {frame >= S.s8.from && (
            <div style={{ opacity: 1 - beat(frame, S.s9, 0, 0.4) }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 680, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 88, fontWeight: 500, opacity: beat(frame, S.s8, 0.4, 0.4) }}>
                {Math.max(1, Math.round(mix(1, 96, count)))}
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 60, fontWeight: 700 }}>{L.layer}</span>
              </div>
              <Hand x={0} y={830} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 1.4, 0.4) }}>
                {L.same}
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s9–s11: scores, probabilities, pick */}
      {frame >= S.s9.from && frame < S.s12.from + 15 && (
        <div style={{ opacity: onC }}>
          <div style={{ position: "absolute", right: 70, top: 160, fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
          {TOKENS.map((w, i) => (
            <WordChip key={w} text={w} x={SENT_X[i]} y={196} fs={SENT_FS} />
          ))}
          <div style={{ position: "absolute", left: SLOT_X, top: 196, width: ganW + 10, height: SENT_FS * 1.5, borderRadius: 10, border: "4px dashed var(--pen)", boxSizing: "border-box", display: "grid", placeItems: "center", fontSize: 40, fontWeight: 700, color: "var(--pen)", opacity: 1 - fly }}>
            {L.q}
          </div>
          <div style={{ position: "absolute", left: 60, width: 200, top: 290, textAlign: "center", fontSize: 28, fontWeight: 700, lineHeight: 1.2, wordBreak: "keep-all" }}>{L.lastVec}</div>
          <VecCells x={92} y={366} v={FINAL[2]} cw={136} ch={60} fs={32} color="yellow" />
          <Layer>
            <PenArrow x1={248} y1={500} x2={330} y2={500} p={beat(frame, S.s9, 1.0, 0.5)} color="var(--ink-3)" width={6} />
          </Layer>
          <div style={{ position: "absolute", left: 60, width: 220, top: 640, textAlign: "center", fontSize: 28, color: "var(--ink-2)", opacity: beat(frame, S.s9, 1.0, 0.4) }}>{L.compare}</div>
          {ROWS.map((r, i) => {
            const y = ROW_Y(i);
            const o = scoreOn(i);
            const isRest = i === 4;
            const chipStyle: CSSProperties = isRest ? { background: "var(--paper-2)", border: "2px solid var(--ink-3)" } : {};
            return (
              <div key={r.w} style={{ opacity: o }}>
                <Chip text={r.w} color={r.c} fs={38} x={350} y={y} style={chipStyle} />
                {isRest && <div style={{ position: "absolute", left: 350, top: y + 60, fontSize: 28, color: "var(--ink-2)" }}>{L.restN}</div>}
                <div style={{ position: "absolute", left: BAR_X, top: y + 4, fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500, opacity: 1 - toProb }}>{r.score}</div>
                <div style={{ position: "absolute", left: BAR_X, top: y + 2, width: r.p * BAR_W * toProb, height: 54, borderRadius: 12, background: r.c ? `var(--hl-${r.c})` : "var(--ink-3)", opacity: isRest ? 0.7 : 1 }} />
                <div style={{ position: "absolute", left: BAR_X + r.p * BAR_W + 14, top: y + 4, fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500, opacity: toProb }}>{r.pct}%</div>
              </div>
            );
          })}
          <Hand x={700} y={ROW_Y(4) + 76} fs={46} style={{ opacity: beat(frame, S.s10, 2.4, 0.4) * (1 - beat(frame, S.s11, 0, 0.3)) }}>
            {L.total}
          </Hand>
          <PenCircle x={330} y={ROW_Y(0) - 16} w={680} h={92} p={pickP} />
          <Hand x={700} y={ROW_Y(4) + 76} fs={52} style={{ opacity: beat(frame, S.s11, 1.2, 0.4), rotate: "-4deg" }}>
            {L.pick}
          </Hand>
          {fly > 0 && (
            <Chip text={L.w4} color="mint" fs={SENT_FS} x={mix(flyFrom.x, SLOT_X + 5, fly)} y={mix(flyFrom.y, 196, fly)} style={{ scale: String(mix(1, 1.08, Math.sin(fly * Math.PI))) }} />
          )}
        </div>
      )}

      {/* s12: back to the top */}
      {frame >= S.s12.from && (
        <div style={{ opacity: on12 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 82, textAlign: "center", fontSize: 42, fontWeight: 700 }}>
            <InlineUnderline p={beat(frame, S.s12, 4.6, 0.7)}>{L.oneWord}</InlineUnderline>
          </div>
          {[...TOKENS, L.w4].map((w, i) => (i < 3 ? <WordChip key={w} text={w} x={s12X[i]} y={160} fs={38} /> : <Chip key={w} text={w} color="mint" fs={38} x={s12X[i]} y={160} />))}
          <div style={{ position: "absolute", left: s12End, top: 160, fontSize: 40, fontWeight: 700, color: "var(--pen)", opacity: beat(frame, S.s12, 3.2, 0.4) }}>
            {L.arrow} {L.q}
          </div>
          <Blueprint y0={236} />
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d={`M ${BP_X - 10} ${BPG.loop + 30} L 150 ${BPG.loop + 30} Q 110 ${BPG.loop + 30} 110 ${BPG.loop - 10} L 110 230 Q 110 190 150 190 L 220 190`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - loopP}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={loopP > 0 ? 1 : 0}
            />
          </svg>
          <Hand x={42} y={540} fs={34} style={{ width: 66, whiteSpace: "normal", wordBreak: "keep-all", lineHeight: 1.1, opacity: beat(frame, S.s12, 2.8, 0.4) }}>
            {L.again}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch61.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
