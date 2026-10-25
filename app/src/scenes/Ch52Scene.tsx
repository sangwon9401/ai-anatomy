import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { HEADS52, ch52 } from "../data/ch52";
import { FOCUS, WEIGHT, pct } from "../data/part5-toy";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "./kit";
import { Center, Example, MONO, PctStack, Word } from "./part5-kit";

const tl = buildTimeline(ch52);
const S = byId(tl);
const L = ch52.labels;

const WORDS = [L.w0, L.w1, L.w2, L.w3];
const FS = 60;
const WWS = WORDS.map((w) => chipWidth(w, FS));
const WX = rowLayout(WWS, 60);
const WC = WX.map((x, i) => x + WWS[i] / 2);
const P = pct(WEIGHT[FOCUS]);

// head boxes (s2, s4, s7)
const BOX_W = 280;
const BOX_X = rowLayout([BOX_W, BOX_W, BOX_W], 34);
const ASKS = [L.who, L.when, L.where];

// s3 mini maps
const MC = 42;
const MG = 4;
const MAP_W = 4 * MC + 3 * MG;

const HeadBox: FC<{ i: number; y: number; o: number; progress?: number; label?: string }> = ({ i, y, o, progress, label }) => {
  const h = HEADS52[i];
  const x = BOX_X[i];
  return (
    <div style={{ opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: BOX_W, height: 170, borderRadius: 18, border: "3.5px solid var(--ink)", background: "var(--paper)", boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ height: 56, background: `var(--hl-${h.c})`, color: "var(--chip-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700 }}>{label ?? h.name}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 74, display: "flex", justifyContent: "center", gap: 12 }}>
          {(["yellow", "mint", "sky"] as const).map((c, k) => (
            <span key={c} style={{ width: 54, height: 46, borderRadius: 8, background: `var(--hl-${c})`, color: "var(--chip-ink)", display: "flex", alignItems: "center", justifyContent: "center", ...MONO, fontSize: 28, fontWeight: 700 }}>
              {[L.q, L.k, L.v][k]}
            </span>
          ))}
        </div>
        {progress !== undefined && (
          <div style={{ position: "absolute", left: 24, right: 24, top: 136, height: 14, borderRadius: 7, background: "var(--paper-2)" }}>
            <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 7, background: `var(--hl-${h.c})` }} />
          </div>
        )}
      </div>
    </div>
  );
};

/** a head's 2-cell result vector, drawn as two coloured blocks */
const ResultVec: FC<{ i: number; x: number; y: number; o?: number }> = ({ i, x, y, o = 1 }) => (
  <div style={{ opacity: o }}>
    {[0, 1].map((k) => (
      <div key={k} style={{ position: "absolute", left: x + k * 60, top: y, width: 54, height: 54, borderRadius: 8, border: "3px solid var(--ink)", background: `var(--hl-${HEADS52[i].c})`, opacity: k === 0 ? 1 : 0.75, boxSizing: "border-box" }} />
    ))}
  </div>
);

export const Ch52Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const up = beat(frame, S.s2, 0, 0.8, EASE_IO);
  const sentY = mix(520, 200, up);
  const sentOn = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const s2Mid = beat(frame, S.s2, 0.8, 0.5) * (1 - beat(frame, S.s3, 0, 0.4));
  const s3On = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const s45On = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const run = beat(frame, S.s4, 1.2, 2.2);
  const join = beat(frame, S.s5, 0.4, 1.2, EASE_IO);
  const mixOn = beat(frame, S.s5, 2.2, 0.5);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* the sentence (s1–s5) */}
      {frame < S.s6.from + 15 && (
        <div style={{ opacity: sentOn }}>
          {WORDS.map((w, i) => (
            <Word key={w} text={w} x={WX[i]} y={sentY} fs={FS} color={i === FOCUS ? "yellow" : null} focus={i === FOCUS} />
          ))}
          {/* s1: the three questions */}
          {[0, 1, 2].map((i) => {
            const o = beat(frame, S.s1, 1.0 + i * 0.6, 0.4) * (1 - beat(frame, S.s2, 0, 0.4));
            return <Chip key={i} text={ASKS[i]} color={HEADS52[i].c} fs={44} x={WC[i] - chipWidth(ASKS[i], 44) / 2} y={sentY - 110} style={{ opacity: o, rotate: `${i % 2 ? 3 : -3}deg` }} />;
          })}
          <Center y={250} fs={52} o={beat(frame, S.s1, 0.4, 0.4) * (1 - beat(frame, S.s2, 0, 0.3))}>
            {L.many}
          </Center>
          <Hand x={0} y={sentY + 130} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.3)) }}>
            {L.wants}
          </Hand>
        </div>
      )}

      {/* s2: one pass = one row of ratios; so: several heads */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2Mid }}>
          <Center y={330} fs={38} weight={500}>
            {L.oneHead}
          </Center>
          <PctStack y={392} ps={P} grow={beat(frame, S.s2, 1.2, 1.0)} labels={P.map((p) => `${p.toFixed(1)}%`)} />
          <Hand x={0} y={484} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 2.6, 0.4) }}>
            {L.oneWay}
          </Hand>
          <Center y={590} fs={40} o={beat(frame, S.s2, 4.0, 0.4)}>
            {L.sets}
          </Center>
          {[0, 1, 2].map((i) => (
            <HeadBox key={i} i={i} y={660} o={beat(frame, S.s2, 4.6 + i * 0.4, 0.4)} />
          ))}
          <Chip text={L.headEn} color="yellow" fs={46} x={540 - chipWidth(L.headEn, 46) / 2} y={880} style={{ opacity: beat(frame, S.s2, 6.6, 0.5) }} />
        </div>
      )}

      {/* s3: each head looks somewhere else */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {HEADS52.map((h, i) => {
              const p = beat(frame, S.s3, 0.6 + i * 1.0, 0.7);
              const x0 = WC[FOCUS] - 40 + i * 30;
              const x1 = WC[h.target];
              const y0 = 200 + FS * 1.5 + 4;
              const dip = 90 + (x0 - x1) * 0.32;
              return (
                <path
                  key={i}
                  d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${y0 + dip * 2} ${x1} ${y0}`}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  fill="none"
                  stroke={`var(--hl-${h.c})`}
                  strokeWidth={14}
                  strokeLinecap="round"
                  opacity={p > 0 ? 1 : 0}
                />
              );
            })}
          </svg>
          {HEADS52.map((h, i) => {
            const x0 = WC[FOCUS] - 40 + i * 30;
            const x1 = WC[h.target];
            const dip = 90 + (x0 - x1) * 0.32;
            const y = 200 + FS * 1.5 + 4 + dip - 6;
            return (
              <div key={i} style={{ position: "absolute", left: (x0 + x1) / 2 - 170, width: 340, top: y, textAlign: "center", fontSize: 34, fontWeight: 700, whiteSpace: "nowrap", opacity: beat(frame, S.s3, 1.0 + i * 1.0, 0.4) }}>
                <span style={{ background: "var(--paper)", padding: "0 8px", borderRadius: 8 }}>
                  {h.name} · {h.ask}
                </span>
              </div>
            );
          })}
          {/* each head's whole map, small */}
          {HEADS52.map((h, i) => {
            const x = BOX_X[i] + (BOX_W - MAP_W) / 2;
            const y = 740;
            const o = beat(frame, S.s3, 4.2 + i * 0.4, 0.4);
            return (
              <div key={`m${i}`} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: x - 30, width: MAP_W + 60, top: y - 50, textAlign: "center", fontSize: 30, fontWeight: 700 }}>{h.name}</div>
                {h.map.map((row, r) =>
                  row.map((v, c) => (
                    <div
                      key={`${r}${c}`}
                      style={{
                        position: "absolute",
                        left: x + c * (MC + MG),
                        top: y + r * (MC + MG),
                        width: MC,
                        height: MC,
                        borderRadius: 6,
                        background: c > r ? "var(--ink-3)" : `color-mix(in srgb, var(--hl-${h.c}) ${Math.round((v / 100) * 100)}%, var(--paper-2))`,
                        opacity: c > r ? 0.35 : 1,
                      }}
                    />
                  )),
                )}
              </div>
            );
          })}
          <Hand x={0} y={960} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 5.8, 0.4) }}>
            {L.differ}
          </Hand>
          <Example x={1024} y={1016} text={L.ex} align="right" o={beat(frame, S.s3, 4.2, 0.4)} />
        </div>
      )}

      {/* s4–s5: in parallel, then joined and mixed */}
      {frame >= S.s4.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s45On }}>
          <Hand x={0} y={330} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 0.8, 0.4) * (1 - beat(frame, S.s5, 0, 0.3)) }}>
            {L.parallel}
          </Hand>
          {[0, 1, 2].map((i) => (
            <HeadBox key={i} i={i} y={410} o={1} progress={run} />
          ))}
          {[0, 1, 2].map((i) => {
            const sx = BOX_X[i] + BOX_W / 2 - 57;
            const sy = 620;
            const tx = 150 + i * 120;
            const ty = 760;
            return (
              <div key={i}>
                <ResultVec i={i} x={mix(sx, tx, join)} y={mix(sy, ty, join)} o={beat(frame, S.s4, 3.6, 0.4)} />
                <div style={{ position: "absolute", left: BOX_X[i] + BOX_W / 2 - 80, width: 160, top: 684, textAlign: "center", fontSize: 30, opacity: beat(frame, S.s4, 3.8, 0.4) * (1 - join) }}>
                  {L.result} {i + 1}
                </div>
              </div>
            );
          })}
          <div style={{ opacity: beat(frame, S.s5, 1.4, 0.4) }}>
            <div style={{ position: "absolute", left: 140, width: 360, top: 830, textAlign: "center", fontSize: 32, fontWeight: 500 }}>{L.concat}</div>
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path d="M 520 787 L 600 787" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" opacity={mixOn} />
              <path d="M 588 775 L 602 787 L 588 799" fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={mixOn} />
              <path d="M 790 787 L 850 787" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" opacity={beat(frame, S.s5, 3.2, 0.4)} />
              <path d="M 838 775 L 852 787 L 838 799" fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={beat(frame, S.s5, 3.2, 0.4)} />
            </svg>
            <div style={{ position: "absolute", left: 612, top: 760, width: 170, height: 56, borderRadius: 12, border: "3px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, opacity: mixOn }}>{L.mixM}</div>
            {[0, 1].map((k) => (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 866 + k * 60,
                  top: 760,
                  width: 54,
                  height: 54,
                  borderRadius: 8,
                  border: "3px solid var(--ink)",
                  boxSizing: "border-box",
                  background: `color-mix(in srgb, var(--hl-pink) 34%, color-mix(in srgb, var(--hl-violet) 50%, var(--hl-orange)))`,
                  opacity: beat(frame, S.s5, 3.6, 0.4),
                }}
              />
            ))}
            <div style={{ position: "absolute", left: 836, width: 180, top: 830, textAlign: "center", fontSize: 32, fontWeight: 700, opacity: beat(frame, S.s5, 3.6, 0.4) }}>{L.final}</div>
            <Hand x={0} y={920} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 4.8, 0.5) }}>
              {L.gather}
            </Hand>
          </div>
        </div>
      )}

      {/* s6: GPT-3's numbers */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5)) }}>
          <Center y={150} fs={48}>
            {L.gpt3}
          </Center>
          {Array.from({ length: 96 }, (_, k) => {
            const r = Math.floor(k / 12);
            const c = k % 12;
            const o = beat(frame, S.s6, 0.8 + k * 0.025, 0.25);
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 160 + c * 64,
                  top: 250 + r * 48,
                  width: 56,
                  height: 40,
                  borderRadius: 6,
                  background: `var(--hl-${HEADS52[k % 3].c})`,
                  border: "2px solid var(--ink-3)",
                  boxSizing: "border-box",
                  opacity: o,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 160, top: 640, fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s6, 3.4, 0.4) }}>{L.heads96}</div>
          <div style={{ position: "absolute", right: 1080 - 920, top: 640, fontSize: 36, fontWeight: 500, opacity: beat(frame, S.s6, 4.0, 0.4) }}>{L.dim128}</div>
          <Center y={730} fs={66} o={beat(frame, S.s6, 5.0, 0.5)} style={{ ...MONO }}>
            {L.product}
          </Center>
          <Center y={840} fs={40} weight={500} color="var(--ink-2)" o={beat(frame, S.s6, 6.0, 0.5)}>
            {L.tokenVec}
          </Center>
        </div>
      )}

      {/* s7: roles are learned */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          {[0, 1, 2].map((i) => {
            const t = beat(frame, S.s7, 1.6 + i * 0.4, 0.4);
            return (
              <div key={i}>
                <HeadBox i={i} y={300} o={1} label={t > 0.5 ? `${HEADS52[i].name} · ${HEADS52[i].ask}` : `${HEADS52[i].name} · ?`} />
              </div>
            );
          })}
          <Hand x={0} y={540} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.2, 0.5) }}>
            {L.learned}
          </Hand>
          <Hand x={0} y={720} fs={48} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 4.6, 0.5) }}>
            {L.next}
          </Hand>
          <Example x={56} y={1000} text={L.ex} />
        </div>
      )}

      <Narration tl={tl} chapter={ch52.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};

