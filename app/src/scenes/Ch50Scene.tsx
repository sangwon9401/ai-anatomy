import type { FC, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { ch50 } from "../data/ch50";
import { FOCUS, K, OUT, Q, SCORE, V, WEIGHT, X, dec3, fmt, fmtVec } from "../data/part5-toy";
import { Caption, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "./kit";
import { Center, Example, Grid, MONO, gridH, gridW, heat, heatInk } from "./part5-kit";

const tl = buildTimeline(ch50);
const S = byId(tl);
const L = ch50.labels;

const WORDS = [L.w0, L.w1, L.w2, L.w3];
const KT = () => (
  <>
    K<sup style={{ fontSize: "0.6em" }}>T</sup>
  </>
);
const A3 = WEIGHT.map(dec3);
const MATCH = 2;

const tintW = (w: number) => heat(w / 0.6);
const tintS = (s: number) => heat(s / 4);

// s3–s4 score table and its factors
const SX = 380;
const SY = 570;
const SCW = 132;
const SCH = 64;
const SG = 8;
const QX = 166;
const QCW = 84;
const KTY = 410;

// s5: ratio table (moves left), V above the output
const AX = 150;
const AY = 600;
const ACW = 118;
const OX = 712;
const OCW = 126;
const VY = 330;
const VCH = 56;

const Label: FC<{ x: number; y: number; children: ReactNode; o?: number; fs?: number }> = ({ x, y, children, o = 1, fs = 48 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: fs, fontWeight: 700, fontStyle: "italic", opacity: o, whiteSpace: "nowrap" }}>{children}</div>
);

export const Ch50Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.4));
  const s2On = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.4));
  const factorsOn = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const tableOn = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const toA = beat(frame, S.s4, 0.8, 1.0, EASE_IO);
  const move = beat(frame, S.s5, 0.2, 1.0, EASE_IO);
  const vOn = beat(frame, S.s5, 1.0, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));

  // s3: the worked cell, then the rest
  const hotRow = beat(frame, S.s3, 2.2, 0.4) * (1 - beat(frame, S.s4, 0, 0.3));
  const cellS = (i: number, j: number) => (i === FOCUS && j === MATCH ? beat(frame, S.s3, 3.0, 0.4) : beat(frame, S.s3, 4.8 + (i * 4 + j) * 0.14, 0.3));
  // s5: the worked output cell, then the rest
  const hotA = beat(frame, S.s5, 1.8, 0.4) * (1 - beat(frame, S.s6, 0, 0.3));
  const cellO = (i: number, j: number) => (i === FOCUS && j === 0 ? beat(frame, S.s5, 2.6, 0.4) : beat(frame, S.s5, 4.6 + (i * 2 + j) * 0.2, 0.3));

  const gx = mix(SX, AX, move);
  const gy = mix(SY, AY, move);
  const gcw = mix(SCW, ACW, move);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: one row done, three to go */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Center y={160} fs={46}>
            {L.once}
          </Center>
          {WORDS.map((w, i) => {
            const done = i === FOCUS;
            const o = beat(frame, S.s1, 0.5 + i * 0.2, 0.4);
            return (
              <div key={w} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: 140, width: 220, top: 280 + i * 110, height: 80, display: "flex", alignItems: "center", justifyContent: "flex-end", fontSize: 42, fontWeight: 700 }}>{w}</div>
                <div
                  style={{
                    position: "absolute",
                    left: 400,
                    top: 280 + i * 110,
                    width: 380,
                    height: 80,
                    borderRadius: 14,
                    border: done ? "3.5px solid var(--ink)" : "3px dashed var(--ink-3)",
                    background: done ? "var(--hl-yellow)" : "var(--paper)",
                    color: done ? "var(--chip-ink)" : "var(--ink-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...MONO,
                    fontSize: 42,
                    fontWeight: 700,
                    boxSizing: "border-box",
                  }}
                >
                  {done ? fmtVec(OUT[FOCUS]) : "?"}
                </div>
              </div>
            );
          })}
          <Hand x={0} y={760} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 2.8, 0.5) }}>
            {L.thousand}
          </Hand>
        </div>
      )}

      {/* s2: stack the word vectors, make Q, K, V at once */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          <Center y={120} fs={42}>
            {L.stack}
          </Center>
          <Grid x={457} y={220} rows={4} cols={2} cw={80} ch={54} gap={6} fs={36} brackets cell={(i, j) => fmt(X[i][j])} rowHead={(i) => WORDS[i]} headW={130} headFs={32} />
          <Label x={660} y={290}>
            {L.x}
          </Label>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {[230, 540, 850].map((cx, k) => {
              const p = beat(frame, S.s2, 1.4 + k * 0.4, 0.6);
              return (
                <g key={k} opacity={p > 0 ? 1 : 0}>
                  <path d={`M 540 470 C 540 510, ${cx} 500, ${cx} ${mix(470, 530, p)}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
                  {p > 0.95 && <path d={`M ${cx} 588 L ${cx} 608 M ${cx - 11} 597 L ${cx} 610 L ${cx + 11} 597`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
                </g>
              );
            })}
          </svg>
          {[
            { k: "Q", m: Q, c: "yellow" },
            { k: "K", m: K, c: "mint" },
            { k: "V", m: V, c: "sky" },
          ].map((r, k) => {
            const cx = [230, 540, 850][k];
            const o = beat(frame, S.s2, 2.0 + k * 0.4, 0.5);
            return (
              <div key={r.k} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: cx - 70, width: 140, top: 530, textAlign: "center", fontSize: 36, fontWeight: 700, fontStyle: "italic" }}>
                  × {L.w}
                  <sub style={{ fontSize: 24, fontStyle: "normal" }}>{r.k}</sub>
                </div>
                <Grid x={cx - 79} y={626} rows={4} cols={2} cw={76} ch={50} gap={6} fs={34} brackets cell={(i, j) => fmt(r.m[i][j])} fill={() => `color-mix(in srgb, var(--hl-${r.c}) 35%, var(--paper))`} />
                <div style={{ position: "absolute", left: cx - 40, width: 80, top: 870, textAlign: "center", fontSize: 44, fontWeight: 700, fontStyle: "italic" }}>{r.k}</div>
              </div>
            );
          })}
          <Hand x={0} y={950} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 4.4, 0.5) }}>
            {L.allAtOnce}
          </Hand>
        </div>
      )}

      {/* s3–s5: the score table becomes the ratio table */}
      {frame >= S.s3.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: tableOn }}>
          <Center y={120} fs={46} o={1 - beat(frame, S.s4, 0, 0.3)}>
            {L.q} × <KT /> {L.step2}
          </Center>
          <Center y={120} fs={44} o={beat(frame, S.s4, 0.2, 0.4) * (1 - beat(frame, S.s5, 0, 0.3))}>
            {L.step3}
          </Center>
          <Center y={120} fs={46} o={beat(frame, S.s5, 0.2, 0.4)}>
            {L.step4}
          </Center>

          {/* factors: Q on the left, Kᵀ on top */}
          <div style={{ opacity: factorsOn }}>
            {/* highlight bands under the numbers */}
            <div style={{ position: "absolute", left: QX - 10, top: SY + FOCUS * (SCH + SG) - 4, width: gridW(2, QCW, SG) + 20, height: SCH + 8, borderRadius: 12, background: "var(--hl-yellow)", opacity: hotRow * 0.75 }} />
            <div style={{ position: "absolute", left: SX + MATCH * (SCW + SG) - 4, top: KTY - 10, width: SCW + 8, height: gridH(2, SCH, SG) + 20, borderRadius: 12, background: "var(--hl-mint)", opacity: hotRow * 0.75 }} />
            <Grid x={QX} y={SY} rows={4} cols={2} cw={QCW} ch={SCH} gap={SG} fs={38} brackets cell={(i, j) => fmt(Q[i][j])} rowHead={(i) => WORDS[i]} headW={96} headFs={28} />
            <Label x={QX + gridW(2, QCW, SG) / 2 - 16} y={SY - 72}>
              {L.q}
            </Label>
            <Grid x={SX} y={KTY} rows={2} cols={4} cw={SCW} ch={SCH} gap={SG} fs={38} brackets cell={(i, j) => fmt(K[j][i])} colHead={(j) => WORDS[j]} headFs={28} headH={44} />
            <Label x={SX + gridW(4, SCW, SG) + 24} y={KTY + 34}>
              <KT />
            </Label>
            <Hand x={SX - 20} y={250} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, S.s3, 1.0, 0.4) }}>
              <KT /> {L.lieDown}
            </Hand>
          </div>

          {/* s4: row sums */}
          <div style={{ opacity: beat(frame, S.s4, 2.4, 0.4) * (1 - move) }}>
            <div style={{ position: "absolute", left: SX + gridW(4, SCW, SG) + 22, width: 110, top: SY - 50, textAlign: "center", fontSize: 28, color: "var(--ink-2)" }}>{L.rowSum}</div>
            {WORDS.map((_, i) => (
              <div key={i} style={{ position: "absolute", left: SX + gridW(4, SCW, SG) + 22, width: 110, top: SY + i * (SCH + SG), height: SCH, display: "flex", alignItems: "center", justifyContent: "center", ...MONO, fontSize: 36, fontWeight: 700, color: "var(--pen)" }}>
                = 1
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 120, top: 230, ...MONO, fontSize: 34, lineHeight: 1.75, opacity: beat(frame, S.s4, 0.4, 0.4) * (1 - move) }}>
            <div>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}>{L.w3}</span> {SCORE[FOCUS].map((v) => fmt(v)).join(", ")}
            </div>
            <div style={{ opacity: beat(frame, S.s4, 1.0, 0.4) }}>→ ÷ 1.41 → {SCORE[FOCUS].map((v) => fmt(v / Math.SQRT2)).join(", ")}</div>
            <div style={{ opacity: beat(frame, S.s4, 1.8, 0.4) }}>
              → <span style={{ fontFamily: "var(--font-sans)" }}>{L.sm}</span> → {A3[FOCUS].map((v) => v.toFixed(3)).join(", ")}
            </div>
          </div>

          {/* s5: ratio-table row band */}
          <div style={{ position: "absolute", left: gx - 8, top: gy + FOCUS * (SCH + SG) - 4, width: gridW(4, gcw, SG) + 16, height: SCH + 8, borderRadius: 12, border: "5px solid var(--hl-yellow)", boxSizing: "border-box", opacity: hotA }} />

          {/* the table itself: scores, then ratios */}
          <Grid
            x={gx}
            y={gy}
            rows={4}
            cols={4}
            cw={gcw}
            ch={SCH}
            gap={SG}
            fs={toA > 0.5 ? 32 : 40}
            cell={(i, j) => (
              <span style={{ position: "relative", display: "inline-block", minWidth: 80, textAlign: "center" }}>
                <span style={{ opacity: 1 - toA }}>{fmt(SCORE[i][j])}</span>
                <span style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: toA }}>{A3[i][j].toFixed(3)}</span>
              </span>
            )}
            show={(i, j) => (frame >= S.s4.from ? 1 : cellS(i, j))}
            fill={(i, j) => (toA > 0.5 ? tintW(WEIGHT[i][j]) : tintS(SCORE[i][j]))}
            ink={(i, j) => (toA > 0.5 ? heatInk(WEIGHT[i][j] / 0.6) : heatInk(SCORE[i][j] / 4))}
            rowHead={move > 0.5 ? (i) => WORDS[i] : undefined}
            headW={110}
            headFs={28}
          />
          <div
            style={{
              position: "absolute",
              left: SX + MATCH * (SCW + SG) - 5,
              top: SY + FOCUS * (SCH + SG) - 5,
              width: SCW + 10,
              height: SCH + 10,
              borderRadius: 12,
              border: "5px solid var(--pen)",
              boxSizing: "border-box",
              opacity: beat(frame, S.s3, 3.0, 0.3) * (1 - beat(frame, S.s4, 0, 0.3)),
            }}
          />
          <div style={{ position: "absolute", left: SX, top: SY + gridH(4, SCH, SG) + 26, ...MONO, fontSize: 32, opacity: beat(frame, S.s3, 3.2, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            {L.w3}: {fmtVec(Q[FOCUS])} · {L.w2}: {fmtVec(K[MATCH])} = {fmt(SCORE[FOCUS][MATCH])}
          </div>
          <Hand x={SX} y={SY + gridH(4, SCH, SG) + 84} fs={48} style={{ opacity: beat(frame, S.s3, 6.8, 0.5) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            {L.is47}
          </Hand>
          <div style={{ position: "absolute", left: gx, width: gridW(4, gcw, SG), top: gy - 56, textAlign: "center", fontSize: 32, fontWeight: 700, opacity: move }}>{L.ratios}</div>

          {/* s5: V above the output */}
          <div style={{ opacity: vOn }}>
            <div style={{ position: "absolute", left: OX + 0 * (OCW + SG) - 4, top: VY - 10, width: OCW + 8, height: gridH(4, VCH, 6) + 20, borderRadius: 12, background: "var(--hl-sky)", opacity: hotA * 0.75 }} />
            <Grid x={OX} y={VY} rows={4} cols={2} cw={OCW} ch={VCH} gap={6} fs={36} brackets cell={(i, j) => fmt(V[i][j])} />
            <Label x={OX - 70} y={VY + 90}>
              {L.v}
            </Label>
            <Grid
              x={OX}
              y={AY}
              rows={4}
              cols={2}
              cw={OCW}
              ch={SCH}
              gap={SG}
              fs={36}
              brackets
              cell={(i, j) => fmt(OUT[i][j])}
              show={(i, j) => cellO(i, j)}
              fill={() => "var(--paper-2)"}
            />
            <div
              style={{
                position: "absolute",
                left: OX - 5,
                top: AY + FOCUS * (SCH + SG) - 5,
                width: OCW + 10,
                height: SCH + 10,
                borderRadius: 12,
                border: "5px solid var(--pen)",
                boxSizing: "border-box",
                opacity: beat(frame, S.s5, 2.6, 0.3),
              }}
            />
            <div style={{ position: "absolute", left: OX, width: gridW(2, OCW, SG), top: AY + gridH(4, SCH, SG) + 14, textAlign: "center", fontSize: 32, fontWeight: 700 }}>{L.newV}</div>
            <div style={{ position: "absolute", left: AX - 100, top: AY + gridH(4, SCH, SG) + 70, ...MONO, fontSize: 28, color: "var(--ink-2)", opacity: beat(frame, S.s5, 3.0, 0.4) }}>
              {A3[FOCUS].map((w, j) => `${w.toFixed(3)}×${fmt(V[j][0])}`).join(" + ")} ≈ {fmt(OUT[FOCUS][0])}
            </div>
            <Hand x={AX} y={AY + gridH(4, SCH, SG) + 120} fs={48} style={{ opacity: beat(frame, S.s5, 4.0, 0.5) }}>
              {L.is49}
            </Hand>
          </div>
        </div>
      )}

      {/* s6: one formula */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5)) }}>
          <Center y={120} fs={40} weight={500} color="var(--ink-2)">
            {L.formula} · {L.paper}
          </Center>
          <div style={{ position: "absolute", left: 0, right: 0, top: 280, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontSize: 70, fontWeight: 700 }}>
            <span>softmax(</span>
            <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", fontSize: 60 }}>
              <span style={{ padding: "0 12px 6px", fontStyle: "italic" }}>
                <InlineCircle p={beat(frame, S.s6, 1.4, 0.5)}>
                  Q<KT />
                </InlineCircle>
              </span>
              <span style={{ alignSelf: "stretch", height: 5, background: "var(--ink)", borderRadius: 3 }} />
              <span style={{ padding: "6px 12px 0" }}>√d</span>
            </span>
            <span>)</span>
            <span style={{ fontStyle: "italic", marginLeft: 10 }}>
              <InlineCircle p={beat(frame, S.s6, 3.4, 0.5)}>V</InlineCircle>
            </span>
          </div>
          <Hand x={560} y={204} fs={42} style={{ opacity: beat(frame, S.s6, 1.8, 0.4) }}>
            {L.f2} ↓
          </Hand>
          <Hand x={270} y={500} fs={42} style={{ opacity: beat(frame, S.s6, 2.6, 0.4) }}>
            ↑ {L.f3}
          </Hand>
          <Hand x={760} y={500} fs={42} style={{ opacity: beat(frame, S.s6, 3.8, 0.4) }}>
            ↑ {L.f4}
          </Hand>
          <Center y={740} fs={36} weight={500} o={beat(frame, S.s6, 4.8, 0.5)}>
            {L.f1} → {L.c2} {L.q} × <KT /> → {L.c3} × {L.v}
          </Center>
          <Hand x={0} y={830} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 5.8, 0.5), rotate: "-1deg" }}>
            {L.three}
          </Hand>
        </div>
      )}

      {/* s7: GPU does every cell at once */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 220, top: 260, width: 640, height: 400, border: "4px solid var(--ink)", borderRadius: 26, background: "var(--paper)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{L.gpu}</div>
          {Array.from({ length: 40 }, (_, k) => {
            const r = Math.floor(k / 8);
            const c = k % 8;
            const on = beat(frame, S.s7, 1.2, 0.5);
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 262 + c * 70,
                  top: 296 + r * 70,
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  border: "2.5px solid var(--ink-3)",
                  background: `color-mix(in srgb, var(--hl-yellow) ${Math.round(on * 100)}%, var(--paper-2))`,
                }}
              />
            );
          })}
          <Hand x={0} y={720} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 1.8, 0.5) }}>
            {L.together}
          </Hand>
          <Center y={840} fs={42} weight={500} o={beat(frame, S.s7, 3.0, 0.5)}>
            {L.long}
          </Center>
        </div>
      )}

      <Example x={1024} y={1016} text={L.ex} align="right" o={beat(frame, S.s1, 1.0, 0.4) * (1 - beat(frame, S.s6, 0, 0.4))} />

      <Narration tl={tl} chapter={ch50.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
