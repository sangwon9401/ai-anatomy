import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ch48 } from "../data/ch48";
import { BIG_D, BIG_RAW, BIG_SCALED, BIG_SCORES, FOCUS, PAINT, RAW_WEIGHT, SCALED, SCORE, WEIGHT, fmt, pct } from "../data/part5-toy";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Center, Example, MONO, PctStack } from "./part5-kit";

const tl = buildTimeline(ch48);
const S = byId(tl);
const L = ch48.labels;

const WORDS = [L.w0, L.w1, L.w2, L.w3];
const XC = [225, 435, 645, 855];
const BW = 128;
const BASE = 760;
const SC_S = 80;
const SC_P = 520;
const CHIP_Y = 930;

const SC = SCORE[FOCUS];
const SCD = SCALED[FOCUS];
const RAW_P = pct(RAW_WEIGHT);
const P = pct(WEIGHT[FOCUS]);
const BIG_P = pct(BIG_RAW);
const BIG_SP = pct(BIG_SCALED);
const ROOT_BIG = Math.sqrt(BIG_D);

export const Ch48Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const barsOut = 1 - beat(frame, S.s6, 0, 0.5);
  const t2 = beat(frame, S.s2, 0.4, 1.2, EASE_IO);
  const t3 = beat(frame, S.s3, 0.2, 1.0, EASE_IO);
  const t4 = beat(frame, S.s4, 1.6, 1.2, EASE_IO);
  const t5 = beat(frame, S.s5, 0.3, 1.2, EASE_IO);
  const ghost = beat(frame, S.s5, 2.0, 0.5);

  const bars = SC.map((s, i) => {
    const g1 = beat(frame, S.s1, 0.6 + i * 0.15, 0.7);
    let h = s * SC_S * g1;
    h = mix(h, RAW_WEIGHT[i] * SC_P, t2);
    h = mix(h, s * SC_S, t3);
    h = mix(h, SCD[i] * SC_S, t4);
    h = mix(h, WEIGHT[FOCUS][i] * SC_P, t5);
    return { s, i, g1, h, top: BASE - Math.max(h, 0) };
  });

  const topText = (o: number, children: string, y = 150, fs = 46) => (
    <Center y={y} fs={fs} o={o}>
      {children}
    </Center>
  );

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s5: the '간다' row as bars */}
      {frame < S.s6.from + 15 && (
        <div style={{ opacity: barsOut }}>
          <div style={{ position: "absolute", left: 120, top: BASE - 2, height: 4, width: 860 * beat(frame, S.s1, 0, 0.6), background: "var(--ink)", borderRadius: 2 }} />
          {bars.map((b) => {
            const ghostTop = BASE - RAW_WEIGHT[b.i] * SC_P;
            const labelTop = b.h >= 0 ? Math.min(b.top, ghost > 0 ? ghostTop : b.top) - 56 : BASE + Math.abs(b.h) + 6;
            const oScore = Math.max(b.g1 * (1 - t2), t3 * (1 - t4));
            return (
              <div key={b.i}>
                {/* s5: where the bar was without dividing */}
                <div
                  style={{
                    position: "absolute",
                    left: XC[b.i] - BW / 2 - 6,
                    top: ghostTop,
                    width: BW + 12,
                    height: BASE - ghostTop,
                    border: "4px dashed var(--ink-3)",
                    borderBottom: "none",
                    borderRadius: "14px 14px 0 0",
                    boxSizing: "border-box",
                    opacity: ghost,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: XC[b.i] - BW / 2,
                    top: b.h >= 0 ? b.top : BASE,
                    width: BW,
                    height: Math.abs(b.h),
                    background: `var(--hl-${PAINT[b.i]})`,
                    borderRadius: b.h >= 0 ? "14px 14px 3px 3px" : "3px 3px 14px 14px",
                  }}
                />
                <div style={{ position: "absolute", left: XC[b.i] - 110, width: 220, top: labelTop, textAlign: "center", ...MONO, fontSize: 42 }}>
                  <span style={{ position: "absolute", left: 0, right: 0, opacity: oScore }}>{fmt(b.s)}</span>
                  <span style={{ position: "absolute", left: 0, right: 0, opacity: t2 * (1 - t3) }}>{RAW_P[b.i].toFixed(1)}%</span>
                  <span style={{ position: "absolute", left: 0, right: 0, opacity: t4 * (1 - t5) }}>{fmt(SCD[b.i])}</span>
                  <span style={{ position: "absolute", left: 0, right: 0, opacity: t5 }}>{P[b.i].toFixed(1)}%</span>
                </div>
                {/* s4: ÷ 1.41 over each bar */}
                <div
                  style={{
                    position: "absolute",
                    left: XC[b.i] - 110,
                    width: 220,
                    top: b.s >= 0 ? b.top - 100 : BASE - 52,
                    textAlign: "center",
                    ...MONO,
                    fontSize: 34,
                    color: "var(--pen)",
                    opacity: beat(frame, S.s4, 0.8 + b.i * 0.15, 0.4) * (1 - beat(frame, S.s5, 0, 0.4)),
                  }}
                >
                  {L.div}
                </div>
                <Chip text={WORDS[b.i]} color={PAINT[b.i]} fs={48} x={XC[b.i] - chipWidth(WORDS[b.i], 48) / 2} y={CHIP_Y} style={{ opacity: beat(frame, S.s1, 0.3 + b.i * 0.12, 0.4) }} />
              </div>
            );
          })}
          <Example x={56} y={1020} text={L.ex} o={beat(frame, S.s1, 1.4, 0.4)} />

          {/* s1 */}
          {topText(beat(frame, S.s1, 0.2, 0.4) * (1 - beat(frame, S.s2, 0, 0.3)), L.rowName)}
          <Hand x={0} y={228} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.3)) }}>
            {L.same14}
          </Hand>
          {/* s2 */}
          {topText(beat(frame, S.s2, 0.2, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)), L.plain)}
          <Hand x={0} y={228} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 2.0, 0.5) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
            {L.like14}
          </Hand>
          {/* s3 */}
          {frame >= S.s3.from && frame < S.s5.from + 15 && (
            <div style={{ opacity: 1 - beat(frame, S.s5, 0, 0.4) }}>
              <Hand x={0} y={118} fs={42} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 0.3, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
                {L.oneMore}
              </Hand>
              <Center y={176} fs={64} o={beat(frame, S.s3, 0.8, 0.5)}>
                <InlineCircle p={beat(frame, S.s3, 1.6, 0.6)}>{L.divide}</InlineCircle>
              </Center>
              <Center y={290} fs={38} weight={500} o={beat(frame, S.s3, 2.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.3))}>
                {L.dIs}
              </Center>
              <Center y={350} fs={36} weight={500} color="var(--ink-2)" o={beat(frame, S.s3, 3.6, 0.4) * (1 - beat(frame, S.s4, 0, 0.3))}>
                {L.dHere}
              </Center>
              <Center y={300} fs={50} o={beat(frame, S.s4, 0.3, 0.4)}>
                <span style={{ ...MONO }}>{L.root2}</span>
              </Center>
            </div>
          )}
          {/* s5 */}
          {frame >= S.s5.from && (
            <div>
              {topText(beat(frame, S.s5, 0.2, 0.4), L.scaled, 140)}
              <Hand x={640} y={214} fs={52} style={{ opacity: beat(frame, S.s5, 3.4, 0.5), rotate: "-3deg" }}>
                {L.softer}
              </Hand>
              <div style={{ position: "absolute", left: 120, top: 228, fontSize: 30, color: "var(--ink-2)", opacity: ghost }}>{L.before}</div>
            </div>
          )}
        </div>
      )}

      {/* s6–s7: 128 entries */}
      {frame >= S.s6.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.5)) }}>
          <Center y={120} fs={50}>
            {L.big}
          </Center>
          <Center y={190} fs={30} weight={400} color="var(--ink-3)">
            {L.bigNote}
          </Center>
          {/* raw */}
          <div style={{ position: "absolute", left: 120, top: 270, fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s6, 1.0, 0.4) }}>{L.plain}</div>
          <div style={{ position: "absolute", left: 120, right: 120, top: 330, display: "flex", justifyContent: "space-between", opacity: beat(frame, S.s6, 1.6, 0.4) }}>
            {WORDS.map((w, i) => (
              <span key={w} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ fontSize: 32 }}>{w}</span>
                <span style={{ ...MONO, fontSize: 42, fontWeight: 700 }}>{fmt(BIG_SCORES[i])}</span>
              </span>
            ))}
          </div>
          <PctStack y={410} ps={BIG_P} grow={beat(frame, S.s6, 3.6, 1.0)} labels={BIG_P.map((p, i) => (i === 2 ? `${WORDS[i]} ≈ 100%` : `${p}%`))} o={beat(frame, S.s6, 3.2, 0.4)} />
          <Hand x={700} y={500} fs={50} style={{ opacity: beat(frame, S.s6, 5.0, 0.4), rotate: "-3deg" }}>
            {L.almost}
          </Hand>
          <div style={{ position: "absolute", left: 120, top: 506, fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s6, 6.4, 0.5) }}>{L.gpt3}</div>

          {/* scaled */}
          <Hand x={120} y={578} fs={44} style={{ opacity: beat(frame, S.s7, 0.4, 0.4) }}>
            {L.stuck}
          </Hand>
          <div style={{ position: "absolute", left: 120, top: 670, fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s7, 3.0, 0.4) }}>{L.root128}</div>
          <div style={{ position: "absolute", left: 120, right: 120, top: 730, display: "flex", justifyContent: "space-between", opacity: beat(frame, S.s7, 3.6, 0.4) }}>
            {WORDS.map((w, i) => (
              <span key={w} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ fontSize: 32 }}>{w}</span>
                <span style={{ ...MONO, fontSize: 42, fontWeight: 700 }}>{fmt(BIG_SCORES[i] / ROOT_BIG)}</span>
              </span>
            ))}
          </div>
          <PctStack y={810} ps={BIG_SP} grow={beat(frame, S.s7, 4.6, 1.0)} labels={BIG_SP.map((p) => `${p.toFixed(1)}%`)} o={beat(frame, S.s7, 4.2, 0.4)} />
          <Hand x={0} y={912} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.2, 0.5) }}>
            {L.fixed}
          </Hand>
          <Example x={56} y={1000} text={L.ex} />
        </div>
      )}

      {/* s8: the recipe */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
            {[L.p1, L.p2, L.p3, L.p4].map((t, i) => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 18, opacity: beat(frame, S.s8, 0.6 + i * 0.4, 0.4) }}>
                {i > 0 && <span style={{ fontSize: 44, color: "var(--ink-3)" }}>→</span>}
                <span
                  style={{
                    fontSize: 38,
                    fontWeight: 700,
                    padding: "10px 18px",
                    borderRadius: 14,
                    border: "3px solid var(--ink)",
                    background: i === 3 ? "var(--hl-yellow)" : "var(--paper)",
                    color: i === 3 ? "var(--chip-ink)" : "var(--ink)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </span>
              </span>
            ))}
          </div>
          <PctStack y={430} ps={P} grow={beat(frame, S.s8, 2.4, 1.0)} labels={P.map((p) => `${p.toFixed(1)}%`)} o={beat(frame, S.s8, 2.0, 0.4)} />
          <div style={{ position: "absolute", left: 120, right: 120, top: 530, display: "flex", opacity: beat(frame, S.s8, 2.8, 0.4) }}>
            {(() => {
              let acc = 0;
              return P.map((p, i) => {
                const left = acc;
                acc += p;
                return (
                  <span key={i} style={{ position: "absolute", left: `${left + p / 2}%`, translate: "-50% 0", fontSize: 32, fontWeight: 500, whiteSpace: "nowrap" }}>
                    {WORDS[i]}
                  </span>
                );
              });
            })()}
          </div>
          <Hand x={0} y={620} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 3.6, 0.5) }}>
            {L.sum100}
          </Hand>
          <Hand x={0} y={800} fs={48} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 4.6, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch48.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};

