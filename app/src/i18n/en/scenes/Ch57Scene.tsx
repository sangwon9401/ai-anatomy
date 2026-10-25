// en overlay of src/scenes/Ch57Scene.tsx: word chips laid out by width; the counter reads "Layer 24" (word before the number).
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { EARLY, GAIN, GROW, GROW_STRIP, LATE, ROWS, SHIFT, ch57, layerNorm } from "../../../data/ch57";
import { Block, Layer, PenArrow, VecBars, VecCells, WordChip, blockGeo, fmt, partRect, vecSize, wordW } from "../../../scenes/part6-block";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";

const tl = buildTimeline(ch57);
const S = byId(tl);
const L = ch57.labels;

const G = blockGeo("full");
const BX = 100;
const BY = 246;

const N_EARLY = layerNorm(EARLY);
const N_LATE = layerNorm(LATE);
const N_ROWS = ROWS.map((r) => ({ ...r, ...layerNorm(r.v) }));
const N_OUT = layerNorm(EARLY, GAIN, SHIFT);

// s1
const G_BASE = 560;
const G_BAND = 110;
const G_SCALE = 40;
const G_BW = 70;
const G_GAP = 26;
const G_X = 540 - (GROW_STRIP.length * (G_BW + G_GAP) - G_GAP) / 2;

const num = (v: number) => (Number.isInteger(v) ? fmt(v, 0) : fmt(v, 1));

export const Ch57Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const on1 = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const on2 = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const on3 = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const on4 = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const on5 = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const on6 = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const on7 = beat(frame, S.s7, 0.3, 0.6);

  // s1: one vector grows while the layer counter runs
  const g = beat(frame, S.s1, 1.2, 4.2, EASE_IO);
  const gk = (() => {
    const f = g * (GROW.length - 1);
    const i = Math.min(GROW.length - 2, Math.floor(f));
    return mix(GROW[i].k, GROW[i + 1].k, f - i);
  })();
  const layerNow = Math.round(mix(1, 96, g));

  // s3 bars
  const B3_BW = 110;
  const B3_GAP = 40;
  const B3_X = 540 - (4 * (B3_BW + B3_GAP) - B3_GAP) / 2;
  const B3_BASE = 820;
  const B3_SC = 18;

  const n1R = partRect(G, "norm1");
  const n2R = partRect(G, "norm2");

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: bigger and bigger */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: on1 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 72, fontWeight: 500 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 52, fontWeight: 700 }}>{L.layer} </span>
            {layerNow}
          </div>
          <Layer>
            {[-1, 1].map((sgn) => (
              <line key={sgn} x1={G_X - 30} y1={G_BASE + sgn * G_BAND} x2={1080 - G_X + 30} y2={G_BASE + sgn * G_BAND} stroke="var(--ink-3)" strokeWidth={3} strokeDasharray="12 12" />
            ))}
          </Layer>
          {GROW_STRIP.map((v, i) => {
            const h = Math.abs(v) * G_SCALE * gk;
            const over = h > G_BAND;
            return (
              <div key={i}>
                <div
                  style={{
                    position: "absolute",
                    left: G_X + i * (G_BW + G_GAP),
                    top: v >= 0 ? G_BASE - h : G_BASE,
                    width: G_BW,
                    height: h,
                    borderRadius: v >= 0 ? "10px 10px 2px 2px" : "2px 2px 10px 10px",
                    background: over ? "var(--pen)" : v >= 0 ? "var(--hl-sky)" : "var(--hl-pink)",
                  }}
                />
                {/* the layer-1 size, for comparison */}
                <div
                  style={{
                    position: "absolute",
                    left: G_X + i * (G_BW + G_GAP) - 3,
                    top: v >= 0 ? G_BASE - Math.abs(v) * G_SCALE - 3 : G_BASE,
                    width: G_BW + 6,
                    height: Math.abs(v) * G_SCALE + 3,
                    border: "3px dashed var(--ink)",
                    borderRadius: 10,
                    boxSizing: "border-box",
                    opacity: g > 0.05 ? 0.6 : 0,
                  }}
                />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: G_X - 30, top: G_BASE + G_BAND + 8, fontSize: 30, color: "var(--ink-2)" }}>{L.fine}</div>
          <div style={{ position: "absolute", left: G_X - 30, top: G_BASE - 2, width: 1080 - 2 * G_X + 60, height: 4, background: "var(--ink)" }} />
          <Hand x={0} y={880} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.6, 0.4) }}>
            {L.grow}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
        </div>
      )}

      {/* s2: same word, 4× the size */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: on2 }}>
          {[
            { v: EARLY, label: L.early, cx: 290, t: 0.5 },
            { v: LATE, label: L.late, cx: 790, t: 1.6 },
          ].map((c) => {
            const o = beat(frame, S.s2, c.t, 0.6);
            const bw = 56;
            const gap = 14;
            const w = 4 * bw + 3 * gap;
            const cw = vecSize(4, 98, 56, 8, "row").w;
            return (
              <div key={c.label} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: c.cx - 220, width: 440, top: 240, textAlign: "center", fontSize: 40, fontWeight: 700 }}>{c.label}</div>
                <VecBars x={c.cx - w / 2} y={680} v={c.v} bw={bw} gap={gap} scale={4.6 * o} />
                <VecCells x={c.cx - cw / 2} y={712} v={c.v} dir="row" cw={98} ch={56} fs={34} gap={8} digits={0} color="sky" />
              </div>
            );
          })}
          <Hand x={0} y={830} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 3.4, 0.4) }}>
            {L.same}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 920, textAlign: "center", fontSize: 38, fontWeight: 500, opacity: beat(frame, S.s2, 5.0, 0.4) }}>{L.shaky}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
        </div>
      )}

      {/* s3: mean and spread of one word's own numbers */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: on3 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 44, fontWeight: 700, opacity: beat(frame, S.s3, 0.6, 0.4) }}>
            {L.step1} · {L.step2} <span style={{ fontWeight: 500, color: "var(--ink-2)" }}>{L.ch15}</span>
          </div>
          <Chip text={L.w3} color="yellow" fs={40} x={540 - chipWidth(L.w3, 40) / 2} y={236} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
          {EARLY.map((v, i) => {
            const h = v * B3_SC * beat(frame, S.s3, 1.0 + i * 0.12, 0.5);
            const x = B3_X + i * (B3_BW + B3_GAP);
            return (
              <div key={i}>
                <div style={{ position: "absolute", left: x, top: B3_BASE - h, width: B3_BW, height: h, borderRadius: "12px 12px 2px 2px", background: "var(--hl-sky)" }} />
                <div style={{ position: "absolute", left: x - 10, width: B3_BW + 20, top: B3_BASE + 12, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40 }}>{v}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: B3_X - 40, top: B3_BASE - 2, width: 4 * (B3_BW + B3_GAP) + 40, height: 4, background: "var(--ink)" }} />
          {(() => {
            const my = B3_BASE - N_EARLY.mean * B3_SC;
            const sp = N_EARLY.sd * B3_SC;
            const a = beat(frame, S.s3, 2.6, 0.6);
            const b = beat(frame, S.s3, 4.6, 0.6);
            const right = B3_X + 4 * (B3_BW + B3_GAP) - B3_GAP;
            return (
              <>
                <Layer>
                  <line x1={B3_X - 30} y1={my} x2={mix(B3_X - 30, right + 30, a)} y2={my} stroke="var(--pen)" strokeWidth={5} strokeDasharray="16 10" />
                  <g opacity={b} stroke="var(--pen)" strokeWidth={5} strokeLinecap="round" fill="none">
                    <line x1={right + 44} y1={my - sp} x2={right + 44} y2={my + sp} />
                    <line x1={right + 32} y1={my - sp} x2={right + 56} y2={my - sp} />
                    <line x1={right + 32} y1={my + sp} x2={right + 56} y2={my + sp} />
                  </g>
                </Layer>
                <Hand x={B3_X - 40} y={my - 64} fs={40} style={{ opacity: a }}>
                  {L.mean} {N_EARLY.mean}
                </Hand>
                <Hand x={right + 64} y={my - 60} fs={40} style={{ opacity: b, width: 120, whiteSpace: "normal", lineHeight: 1.05 }}>
                  {L.spread} {N_EARLY.sd}
                </Hand>
              </>
            );
          })()}
        </div>
      )}

      {/* s4: both sizes land on the same numbers */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: on4 }}>
          {[
            { v: EARLY, n: N_EARLY, y: 220, t: 0.5 },
            { v: LATE, n: N_LATE, y: 400, t: 2.4 },
          ].map((r) => {
            const a = beat(frame, S.s4, r.t, 0.5);
            const b = beat(frame, S.s4, r.t + 0.9, 0.5);
            return (
              <div key={r.y}>
                <VecCells x={66} y={r.y} v={r.v} dir="row" cw={90} ch={64} fs={36} gap={8} digits={0} color="sky" o={a} />
                <div style={{ position: "absolute", left: 454, width: 156, top: r.y - 46, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--pen)", whiteSpace: "nowrap", opacity: b }}>
                  −{r.n.mean} ÷{r.n.sd}
                </div>
                <div style={{ position: "absolute", left: 454, width: 156, top: r.y + 2, textAlign: "center", fontSize: 48, opacity: b }}>{L.arrow}</div>
                <VecCells x={610} y={r.y} v={r.n.z} dir="row" cw={92} ch={64} fs={36} gap={8} color="mint" o={b} />
              </div>
            );
          })}
          <Hand x={610} y={500} fs={60} style={{ width: 392, textAlign: "center", opacity: beat(frame, S.s4, 4.4, 0.4), rotate: "-2deg" }}>
            <InlineCircle p={beat(frame, S.s4, 4.8, 0.6)}>{L.equal}</InlineCircle>
          </Hand>
          <VecBars x={540 - (4 * 96 - 26) / 2} y={800} v={N_EARLY.z} bw={70} gap={26} scale={100} pos="mint" neg="mint" o={beat(frame, S.s4, 5.6, 0.5)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
        </div>
      )}

      {/* s5: each word with its own numbers */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: on5 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", fontSize: 60, fontWeight: 700 }}>{L.title}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 224, textAlign: "center", fontSize: 32, color: "var(--ink-2)" }}>{L.en}</div>
          {N_ROWS.map((r, i) => {
            const y = 320 + i * 160;
            const a = beat(frame, S.s5, 0.8 + i * 0.9, 0.5);
            const b = beat(frame, S.s5, 1.3 + i * 0.9, 0.5);
            return (
              <div key={r.w} style={{ opacity: a }}>
                <WordChip text={r.w} x={60} y={y + 4} fs={36} />
                <VecCells x={216} y={y} v={r.v} dir="row" cw={86} ch={62} fs={30} gap={4} digits={1} color={() => null} />
                <div style={{ position: "absolute", left: 216, width: 356, top: y + 70, textAlign: "center", fontSize: 28, color: "var(--ink-2)" }}>
                  {L.mean} {num(r.mean)} · {L.spread} {num(r.sd)}
                </div>
                <div style={{ position: "absolute", left: 582, width: 76, top: y + 2, textAlign: "center", fontSize: 44, opacity: b }}>{L.arrow}</div>
                <VecCells x={668} y={y} v={r.z} dir="row" cw={86} ch={62} fs={30} gap={4} color="mint" o={b} />
              </div>
            );
          })}
          <Hand x={0} y={830} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 4.4, 0.4) }}>
            {L.own}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 910, textAlign: "center", fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s5, 5.4, 0.4) }}>{L.real}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 980, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
        </div>
      )}

      {/* s6: scale and shift */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: on6 }}>
          {[
            { label: L.z, v: N_OUT.z, y: 230, color: "mint" as const, t: 0.4, pen: false },
            { label: L.gain, v: GAIN, y: 330, color: "violet" as const, t: 1.4, pen: true },
            { label: L.shift, v: SHIFT, y: 430, color: "violet" as const, t: 2.4, pen: true },
            { label: L.out, v: N_OUT.out, y: 570, color: "yellow" as const, t: 3.8, pen: false },
          ].map((r) => {
            const o = beat(frame, S.s6, r.t, 0.5);
            return (
              <div key={r.label} style={{ opacity: o, translate: `0px ${mix(16, 0, o)}px` }}>
                <div style={{ position: "absolute", left: 70, top: r.y + 10, fontSize: 38, fontWeight: 700, color: r.pen ? "var(--pen)" : "var(--ink)" }}>{r.label}</div>
                <VecCells x={490} y={r.y} v={r.v} dir="row" cw={120} ch={64} fs={36} gap={10} color={r.color} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 480, top: 532, width: 530, height: 5, borderRadius: 3, background: "var(--ink)", opacity: beat(frame, S.s6, 3.4, 0.4) }} />
          <Hand x={0} y={720} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 5.0, 0.4) }}>
            {L.learned}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
        </div>
      )}

      {/* s7: where it sits in the block */}
      {frame >= S.s7.from && (
        <div style={{ opacity: on7 }}>
          {[L.w1, L.w2, L.w3].map((w, i) => (
            <WordChip key={w} text={w} x={120 + [L.w1, L.w2, L.w3].slice(0, i).reduce((a, t) => a + wordW(t, 40) + 14, 0)} y={134} fs={40} />
          ))}
          <Layer>
            <PenArrow x1={BX + G.hx} y1={200} x2={BX + G.hx} y2={BY - 6} p={1} color="var(--ink-3)" width={5} />
          </Layer>
          <Block x={BX} y={BY} focus={{ keys: ["norm1", "norm2"], t: beat(frame, S.s7, 0.6, 0.6), dim: 0.4 }} />
          <PenCircle x={BX + n1R.x - 20} y={BY + n1R.y - 18} w={n1R.w + 40} h={n1R.h + 36} p={beat(frame, S.s7, 1.6, 0.6)} />
          <PenCircle x={BX + n2R.x - 20} y={BY + n2R.y - 18} w={n2R.w + 40} h={n2R.h + 36} p={beat(frame, S.s7, 2.4, 0.6)} />
          {[n1R, n2R].map((r, i) => (
            <Hand key={i} x={790} y={BY + r.y - 4} fs={36} style={{ width: 234, whiteSpace: "normal", wordBreak: "keep-all", opacity: beat(frame, S.s7, 2.0 + i * 0.8, 0.4) }}>
              {L.before}
            </Hand>
          ))}
          <Chip text={L.keepRoad} color="orange" fs={34} x={120} y={BY + G.h + 40} style={{ opacity: beat(frame, S.s7, 5.0, 0.4) }} />
        </div>
      )}

      <Narration tl={tl} chapter={ch57.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
