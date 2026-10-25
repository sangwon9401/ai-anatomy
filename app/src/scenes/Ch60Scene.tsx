import type { FC } from "react";
import { random, useCurrentFrame } from "remotion";
import { percents } from "../data/ch45";
import { LAST_VEC, LOGITS, OTHER_VECS, REST_SUM, TOKEN_VECS, ch60, outputProbs } from "../data/ch60";
import { Blueprint, VecCells, WordChip, blueprintGeo, fmt, wordW } from "./part6-block";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";

const tl = buildTimeline(ch60);
const S = byId(tl);
const L = ch60.labels;

const WORDS = [L.w1, L.w2, L.w3];
const VECS = [...OTHER_VECS, LAST_VEC];
const OUT = outputProbs(LOGITS.map((l) => l.s));
const PCT = percents([...OUT.p, OUT.restP]);

// s3: a "barcode" of many scores; four of them are the words we follow
const N_BARS = 160;
const SPIKE: Record<number, number> = { 23: 1, 61: 0, 97: 3, 131: 2 };
const BAR_S = Array.from({ length: N_BARS }, (_, i) => (SPIKE[i] !== undefined ? LOGITS[SPIKE[i]].s : -9.1 + (random(`b60-${i}`) - 0.5) * 3));

// s4–s6 chart
const COL_X = [170, 355, 540, 725, 910];
const BW = 120;
const BASE = 700;
const SC_LOGIT = 40;
const SC_EXP = 18;
const SC_P = 600;
const REST_DOWN = 120;

export const Ch60Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const on1 = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const on2 = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const on3 = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const on46 = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const on7 = beat(frame, S.s7, 0.3, 0.6);

  const tE = beat(frame, S.s5, 1.2, 1.4, EASE_IO);
  const tP = beat(frame, S.s6, 0.4, 1.4, EASE_IO);
  const eqOn = beat(frame, S.s5, 2.6, 0.4) * (1 - beat(frame, S.s6, 0, 0.4));

  const cols = [
    ...LOGITS.map((l, i) => ({ w: l.w, c: `var(--hl-${l.c})`, logitH: l.s * SC_LOGIT, eH: OUT.ex[i] * SC_EXP, pH: OUT.p[i] * SC_P, logit: fmt(l.s), e: OUT.ex[i].toFixed(2), pct: PCT[i] })),
    { w: L.rest, c: "var(--ink-3)", logitH: -REST_DOWN, eH: REST_SUM * SC_EXP, pH: OUT.restP * SC_P, logit: L.restScore, e: REST_SUM.toFixed(2), pct: PCT[4] },
  ];

  const BPG = blueprintGeo(176);
  const inW = WORDS.map((w) => wordW(w, 40));
  const inX = [120, 120 + inW[0] + 14, 120 + inW[0] + inW[1] + 28];
  const ganX = inX[2] + inW[2] + 14;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: one vector per word comes out; the last one decides */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: on1 }}>
          {WORDS.map((w, i) => (
            <WordChip key={w} text={w} x={[270, 540, 810][i] - wordW(w, 44) / 2} y={130} fs={44} />
          ))}
          {[3, 2, 1].map((k) => (
            <div key={k} style={{ position: "absolute", left: 150 + k * 12, top: 230 + k * 12, width: 780, height: 170, borderRadius: 22, border: "3px solid var(--grid-major)", background: "var(--paper)", opacity: beat(frame, S.s1, 0.4 + (3 - k) * 0.2, 0.4) }} />
          ))}
          <div style={{ position: "absolute", left: 150, top: 230, width: 780, height: 170, borderRadius: 22, border: "4px dashed var(--ink-3)", background: "var(--paper)", display: "grid", placeItems: "center", fontSize: 44, fontWeight: 700 }}>
            {L.stack}
          </div>
          {VECS.map((v, i) => {
            const cx = [270, 540, 810][i];
            const last = i === 2;
            const a = beat(frame, S.s1, 1.2 + i * 0.3, 0.5);
            const dim = last ? 1 : mix(1, 0.3, beat(frame, S.s1, 3.4, 0.5));
            return <VecCells key={i} x={cx - 60} y={470 + mix(-40, 0, a)} v={v} cw={120} ch={58} fs={32} o={a * dim} />;
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 440 - 6, textAlign: "center", fontSize: 30, color: "var(--ink-2)", opacity: beat(frame, S.s1, 1.2, 0.4) }}>{L.after}</div>
          <PenCircle x={810 - 118} y={436} w={236} h={316} p={beat(frame, S.s1, 3.8, 0.7)} />
          <Hand x={430} y={780} fs={44} style={{ width: 600, textAlign: "right", opacity: beat(frame, S.s1, 4.6, 0.4) }}>
            {L.sawAll}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
        </div>
      )}

      {/* s2: compare with every token */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: on2 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 46, fontWeight: 700 }}>{L.compare}</div>
          <div style={{ position: "absolute", left: 56, width: 200, top: 226, textAlign: "center", fontSize: 30, fontWeight: 700, lineHeight: 1.2, wordBreak: "keep-all" }}>{L.lastVec}</div>
          <VecCells x={96} y={310} v={LAST_VEC} cw={120} ch={62} fs={34} color="yellow" />
          {LOGITS.map((l, i) => {
            const y = 290 + i * 100;
            const a = beat(frame, S.s2, 0.8 + i * 0.6, 0.5);
            const sc = beat(frame, S.s2, 1.2 + i * 0.6, 0.4);
            return (
              <div key={l.w} style={{ opacity: a }}>
                <Chip text={l.w} color={l.c} fs={38} x={300} y={y} />
                <VecCells x={474} y={y + 2} v={TOKEN_VECS[i]} dir="row" cw={86} ch={54} fs={28} gap={6} color={() => null} />
                <div style={{ position: "absolute", left: 846, top: y + 2, fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500, opacity: sc }}>= {fmt(l.s)}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 600, top: 676, fontSize: 52, color: "var(--ink-3)", opacity: beat(frame, S.s2, 3.4, 0.4) }}>{L.vdots}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, opacity: beat(frame, S.s2, 4.4, 0.4) }}>{L.dotEx}</div>
          <Hand x={0} y={850} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 5.4, 0.4) }}>
            {L.similar}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 940, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
        </div>
      )}

      {/* s3: 50,257 scores */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: on3 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", fontSize: 50, fontWeight: 700, opacity: beat(frame, S.s3, 3.6, 0.5) }}>{L.logit}</div>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
            {BAR_S.map((s, i) => {
              const h = (s + 12) * 14 * beat(frame, S.s3, 0.5 + (i / N_BARS) * 2.0, 0.4);
              const spike = SPIKE[i] !== undefined;
              return <rect key={i} x={100 + i * 5.5} y={560 - h} width={3.6} height={h} fill={spike ? `var(--hl-${LOGITS[SPIKE[i]].c})` : "var(--ink-3)"} opacity={spike ? 1 : 0.55} />;
            })}
            <line x1={90} y1={561} x2={990} y2={561} stroke="var(--ink)" strokeWidth={4} />
          </svg>
          {Object.entries(SPIKE).map(([i, k]) => {
            const l = LOGITS[k];
            const x = 100 + Number(i) * 5.5 + 1.8;
            const top = 560 - (l.s + 12) * 14 - 64;
            return <Chip key={i} text={l.w} color={l.c} fs={32} x={x - chipWidth(l.w, 32) / 2} y={top} style={{ opacity: beat(frame, S.s3, 2.6, 0.4) }} />;
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontSize: 38, fontWeight: 700, opacity: beat(frame, S.s3, 1.0, 0.4) }}>{L.vocab}</div>
          <Hand x={0} y={690} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 5.6, 0.4) }}>
            {L.matmul}
          </Hand>
        </div>
      )}

      {/* s4–s6: scores → e^x → probabilities */}
      {frame >= S.s4.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: on46 }}>
          <div style={{ position: "absolute", left: 90, top: BASE - 2, width: 900, height: 4, background: "var(--ink)" }} />
          {cols.map((c, i) => {
            const g = beat(frame, S.s4, 0.6 + i * 0.4, 0.6);
            const h = mix(mix(c.logitH * g, c.eH, tE), c.pH, tP);
            const x = COL_X[i] - BW / 2;
            const isRest = i === 4;
            const labelY = h >= 0 ? BASE - h - 52 : BASE - h + 8;
            const stage = tP > 0.5 ? 2 : tE > 0.5 ? 1 : 0;
            return (
              <div key={c.w}>
                <div style={{ position: "absolute", left: x, top: h >= 0 ? BASE - h : BASE, width: BW, height: Math.abs(h), background: c.c, borderRadius: h >= 0 ? "12px 12px 2px 2px" : "2px 2px 12px 12px", opacity: isRest ? 0.7 : 1 }} />
                {isRest && h < 0 && (
                  <svg width={BW + 20} height={30} style={{ position: "absolute", left: x - 10, top: BASE + 46, overflow: "visible" }}>
                    <path d="M 0 18 L 25 6 L 50 18 L 75 6 L 100 18 L 125 6 L 140 12" fill="none" stroke="var(--paper)" strokeWidth={8} />
                  </svg>
                )}
                <div style={{ position: "absolute", left: x - 40, width: BW + 80, top: labelY, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 500, opacity: g }}>
                  {stage === 0 ? c.logit : stage === 1 ? c.e : `${c.pct}%`}
                </div>
                {isRest ? (
                  <>
                    <Chip text={c.w} color={null} fs={36} x={COL_X[i] - chipWidth(c.w, 36) / 2} y={880} style={{ opacity: g, background: "var(--paper-2)", border: "2px solid var(--ink-3)" }} />
                    <div style={{ position: "absolute", left: x - 40, width: BW + 80, top: 940, textAlign: "center", fontSize: 28, color: "var(--ink-2)", opacity: g }}>{L.restN}</div>
                  </>
                ) : (
                  <Chip text={c.w} color={LOGITS[i].c} fs={40} x={COL_X[i] - chipWidth(c.w, 40) / 2} y={880} style={{ opacity: g }} />
                )}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 996, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
          <div style={{ position: "absolute", left: 90, top: 130, fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s5, 0.4, 0.4) * (1 - beat(frame, S.s6, 0, 0.3)) }}>{L.expTitle}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 36, opacity: eqOn }}>
            {cols.map((c) => c.e).join(" + ")} ={" "}
            <InlineCircle p={beat(frame, S.s5, 3.4, 0.6) * eqOn}>{OUT.sum.toFixed(2)}</InlineCircle>
          </div>
          <div style={{ position: "absolute", left: 590, top: 130, fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s5, 4.4, 0.4) * (1 - beat(frame, S.s6, 0, 0.3)) }}>{L.divTitle}</div>
          {/* s6: the 100% strip */}
          {(() => {
            let acc = 90;
            return cols.map((c, i) => {
              const w = (c.pH / SC_P) * 900;
              const left = acc;
              acc += w;
              return <div key={c.w} style={{ position: "absolute", left, top: 150, width: w * beat(frame, S.s6, 1.8 + i * 0.3, 0.4), height: 64, background: c.c, opacity: i === 4 ? 0.7 : 1, borderRadius: i === 0 ? "12px 0 0 12px" : i === 4 ? "0 12px 12px 0" : 0 }} />;
            });
          })()}
          <Hand x={760} y={232} fs={44} style={{ opacity: beat(frame, S.s6, 3.6, 0.4) }}>
            {L.total}
          </Hand>
          <Hand x={640} y={480} fs={42} style={{ width: 380, textAlign: "right", opacity: beat(frame, S.s6, 4.8, 0.4) }}>
            {L.gather}
          </Hand>
        </div>
      )}

      {/* s7: pick one, append, and the blueprint gets its part */}
      {frame >= S.s7.from && (
        <div style={{ opacity: on7 }}>
          {WORDS.map((w, i) => (
            <WordChip key={w} text={w} x={inX[i]} y={100} fs={40} />
          ))}
          <Chip text={LOGITS[0].w} color="mint" fs={40} x={ganX} y={100} style={{ opacity: beat(frame, S.s7, 2.6, 0.4), scale: String(mix(0.6, 1, beat(frame, S.s7, 2.6, 0.4))) }} />
          <Hand x={0} y={990} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.0, 0.4) }}>
            {L.pick}
          </Hand>
          <Blueprint y0={176} fill={{ out: beat(frame, S.s7, 1.0, 0.7) }} focus={{ keys: ["out"], t: beat(frame, S.s7, 0.6, 0.5), dim: 0.45 }} />
          <Hand x={70} y={BPG.out + 2} fs={48} style={{ opacity: beat(frame, S.s7, 1.8, 0.4), rotate: "-4deg" }}>
            {L.filled}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch60.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
