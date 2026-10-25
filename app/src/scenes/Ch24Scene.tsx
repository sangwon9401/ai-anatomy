import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CURVES, LOSS_AFTER, LOSS_BEFORE, ONLY_A, ch24 } from "../data/ch24";
import { num } from "../data/part2-toy";
import { Caption, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "./kit";
import { ArrowLine, Banner, FullSvg } from "./part2-kit";

const tl = buildTimeline(ch24);
const S = byId(tl);
const L = ch24.labels;

const signed = (v: number) => (v > 0 ? `+${num(v)}` : num(v));

// s3–s4: the book as six bundles
const CARD = { w: 260, h: 118 };
const STACK_X = 64;
const DONE_X = 756;
const PILE_Y = (k: number) => 690 - k * 30;
const STATION = { x: 380, y: 400, w: 320, h: 200 };
const BUNDLE_T = (k: number) => (k < 3 ? { step: "s3" as const, t0: 2.0 + k * 2.3, d: 2.0 } : { step: "s4" as const, t0: 0.3 + (k - 3) * 1.05, d: 0.95 });

// s5: loss per problem solved
const LMAX = 1.2;
const CX = (n: number) => 170 + n * 4.5;
const CY = (l: number) => 960 - l * 520;
const JUMP_AT = CURVES[0].loss.findIndex((l) => l > LMAX);

const Card: FC<{ x: number; y: number; o?: number; label: string; hot?: boolean }> = ({ x, y, o = 1, label, hot }) => (
  <div style={{ position: "absolute", left: x, top: y, width: CARD.w, height: CARD.h, borderRadius: 12, border: "4px solid var(--ink)", background: hot ? "var(--hl-yellow)" : "var(--paper)", boxSizing: "border-box", opacity: o, padding: "10px 16px" }}>
    <div style={{ fontSize: 34, fontWeight: 700, color: hot ? "var(--chip-ink)" : "var(--ink)" }}>{label}</div>
    <div style={{ marginTop: 8, display: "grid", gap: 7 }}>
      {[0.85, 0.6].map((f, i) => (
        <div key={i} style={{ height: 6, width: `${f * 100}%`, borderRadius: 3, background: hot ? "var(--chip-ink)" : "var(--ink-3)", opacity: 0.45 }} />
      ))}
    </div>
  </div>
);

export const Ch24Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const tabO = beat(frame, S.s1, 0.1, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const bookO = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const runO = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const bowlO = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const gpuO = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const endO = beat(frame, S.s7, 0.3, 0.5);

  // bundles: 0 = in the stack, 0..1 = travelling/being graded, 2 = done
  const back = beat(frame, S.s4, 4.8, 0.9, EASE_IO);
  const phase = Array.from({ length: 6 }, (_, k) => {
    const { step, t0, d } = BUNDLE_T(k);
    if (frame < S[step].from) return 0;
    const a = beat(frame, S[step], t0, d * 0.3, EASE_IO);
    const b = beat(frame, S[step], t0 + d * 0.7, d * 0.3, EASE_IO);
    return a + b;
  });
  const doneCount = phase.filter((p) => p >= 2).length;
  const active = phase.findIndex((p) => p > 0 && p < 2);
  const grading = active >= 0 && phase[active] >= 1 && phase[active] < 1.02;
  const knobTurn = phase.reduce((a, p) => a + Math.min(1, Math.max(0, p - 1)), 0);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: only 가게 A */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: tabO }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 50, fontWeight: 700 }}>{L.s1title}</div>
          {[L.col0, L.col1, L.col2].map((c, i) => (
            <div key={c} style={{ position: "absolute", left: [100, 360, 690][i], width: [200, 280, 300][i], top: 236, textAlign: i ? "center" : "left", fontSize: 36, fontWeight: 700, color: "var(--ink-2)", opacity: i === 2 ? beat(frame, S.s1, 2.0, 0.4) : 1 }}>
              {c}
            </div>
          ))}
          {ONLY_A.map((r, i) => {
            const y = 316 + i * 92;
            const worse = Math.abs(r.after) > Math.abs(r.before);
            const better = Math.abs(r.after) < Math.abs(r.before);
            return (
              <div key={r.name} style={{ opacity: beat(frame, S.s1, 0.4 + i * 0.2, 0.4) }}>
                <div style={{ position: "absolute", left: 100, top: y, fontSize: 40, fontWeight: 700 }}>{r.name}</div>
                <div style={{ position: "absolute", left: 360, width: 280, top: y, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 42 }}>{signed(r.before)}</div>
                <div style={{ position: "absolute", left: 690, width: 300, top: y - 4, textAlign: "center", opacity: beat(frame, S.s1, 2.2 + i * 0.25, 0.4) }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 42, fontWeight: 700, padding: "0 14px", borderRadius: 10, background: worse ? "var(--hl-pink)" : better ? "var(--hl-mint)" : "transparent", color: worse || better ? "var(--chip-ink)" : "var(--ink)" }}>{signed(r.after)}</span>
                </div>
              </div>
            );
          })}
          <PenCircle x={770} y={392} w={140} h={84} p={beat(frame, S.s1, 4.2, 0.6)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontSize: 44, fontWeight: 700, opacity: beat(frame, S.s1, 4.8, 0.4) }}>
            {L.total}: <span style={{ fontFamily: "var(--font-mono)" }}>{num(LOSS_BEFORE)}</span> → <span style={{ fontFamily: "var(--font-mono)", color: "var(--pen)" }}>{num(LOSS_AFTER)}</span>
          </div>
          <Hand x={0} y={910} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 6.0, 0.4) }}>
            {L.worse}
          </Hand>
        </div>
      )}

      {/* s2: one giant book */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: bookO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.book}</div>
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 250 + i * 8, top: 300 + i * 30, width: 420, height: 300, borderRadius: 14, border: "4px solid var(--ink)", background: i === 8 ? "var(--hl-sky)" : "var(--paper)", boxSizing: "border-box" }} />
          ))}
          <div style={{ position: "absolute", left: 314, top: 600, width: 420, textAlign: "center", fontSize: 44, fontWeight: 700, color: "var(--chip-ink)" }}>{L.probs}</div>
          <FullSvg>
            {(() => {
              const cx = 880;
              const cy = 420;
              const a = (frame - S.s2.from) * 0.25;
              return (
                <g opacity={beat(frame, S.s2, 2.0, 0.4)}>
                  <circle cx={cx} cy={cy} r={90} fill="var(--paper)" stroke="var(--ink)" strokeWidth={6} />
                  <line x1={cx} y1={cy} x2={cx + Math.sin(a) * 66} y2={cy - Math.cos(a) * 66} stroke="var(--pen)" strokeWidth={7} strokeLinecap="round" />
                  <line x1={cx} y1={cy} x2={cx + Math.sin(a / 12) * 44} y2={cy - Math.cos(a / 12) * 44} stroke="var(--ink)" strokeWidth={8} strokeLinecap="round" />
                </g>
              );
            })()}
          </FullSvg>
          <Hand x={0} y={880} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 2.6, 0.4) }}>
            {L.allAtOnce}
          </Hand>
          <Hand x={0} y={950} fs={44} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 4.0, 0.4) }}>
            {L.tooSlow}
          </Hand>
        </div>
      )}

      {/* s3–s4: bundle by bundle */}
      {frame >= S.s3.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: runO }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700 }}>
            {L.count} <span style={{ fontFamily: "var(--font-mono)" }}>{Math.min(6, doneCount + (active >= 0 ? 1 : 0))} / 6</span>
          </div>
          <Hand x={460} y={128} fs={44} style={{ opacity: beat(frame, S.s3, 3.2, 0.4) }}>
            {L.minibatch}
          </Hand>
          <div style={{ position: "absolute", left: STATION.x, top: STATION.y, width: STATION.w, height: STATION.h, borderRadius: 20, border: "5px dashed var(--ink-3)", boxSizing: "border-box" }} />
          <div style={{ position: "absolute", left: STATION.x - 40, width: STATION.w + 80, top: STATION.y + STATION.h + 18, textAlign: "center", fontSize: 34, fontWeight: 700 }}>{L.station}</div>
          {/* the knob turns once per graded bundle */}
          <div style={{ position: "absolute", left: STATION.x + STATION.w / 2 - 36, top: STATION.y - 96, width: 72, height: 72, borderRadius: "50%", border: "5px solid var(--ink)", background: "var(--paper)", boxSizing: "border-box", rotate: `${knobTurn * 50}deg` }}>
            <div style={{ position: "absolute", left: 28, top: 6, width: 6, height: 26, borderRadius: 3, background: "var(--pen)" }} />
          </div>
          <div style={{ position: "absolute", left: STACK_X, width: CARD.w, top: 828, textAlign: "center", fontSize: 34, fontWeight: 700, color: "var(--ink-2)" }}>{L.book}</div>
          <div style={{ position: "absolute", left: DONE_X, width: CARD.w, top: 828, textAlign: "center", fontSize: 34, fontWeight: 700, color: "var(--ink-2)" }}>{L.done}</div>
          {Array.from({ length: 6 }, (_, k) => {
            const p = phase[k];
            // stack slot: bundle k sits at height (5 − k) so bundle 0 is on top
            const sx = STACK_X;
            const sy = PILE_Y(5 - k);
            const mx = STATION.x + (STATION.w - CARD.w) / 2;
            const my = STATION.y + (STATION.h - CARD.h) / 2;
            const dx = DONE_X;
            const dy = PILE_Y(k);
            let x = sx;
            let y = sy;
            if (p > 0 && p <= 1) {
              x = mix(sx, mx, p);
              y = mix(sy, my, p);
            } else if (p > 1) {
              x = mix(mx, dx, p - 1);
              y = mix(my, dy, p - 1);
            }
            if (back > 0) {
              x = mix(x, sx, back);
              y = mix(y, sy, back);
            }
            const z = back > 0 ? 10 + (5 - k) : p > 0 && p < 2 ? 20 : p >= 2 ? 10 + k : 10 + (5 - k);
            return (
              <div key={k} style={{ position: "relative", zIndex: z }}>
                <Card x={x} y={y} label={L.bundle} hot={p > 0 && p < 2} />
              </div>
            );
          })}
          {grading && (
            <Hand x={STATION.x + STATION.w - 30} y={STATION.y - 10} fs={60} style={{ rotate: "-12deg" }}>
              ○
            </Hand>
          )}
          {frame >= S.s4.from && (
            <>
              <Banner text={L.epoch} y={920} fs={50} o={beat(frame, S.s4, 3.6, 0.4)} />
              <Hand x={0} y={1010} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 5.8, 0.4) }}>
                {L.again}
              </Hand>
            </>
          )}
        </div>
      )}

      {/* s5: loss over the whole book, per problem solved */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: bowlO }}>
          <div style={{ position: "absolute", left: 64, top: 116, fontSize: 46, fontWeight: 700 }}>{L.cmp}</div>
          <div style={{ position: "absolute", left: 64, top: 186, width: 960, display: "flex", flexWrap: "wrap", gap: "10px 16px" }}>
            {CURVES.map((c, i) => (
              <span key={c.batch} style={{ fontSize: 32, fontWeight: 700, padding: "2px 14px", borderRadius: 10, background: `var(--hl-${c.c})`, color: "var(--chip-ink)", opacity: beat(frame, S.s5, 0.8 + i * 1.8, 0.4) }}>
                {[L.b1, L.b10, L.b60][i]}
              </span>
            ))}
          </div>
          <Hand x={64} y={1030} fs={32} color="var(--ink-3)">
            {L.example}
          </Hand>
          <FullSvg>
            <clipPath id="ch24-chart">
              <rect x={CX(0) - 10} y={CY(LMAX) - 10} width={CX(180) - CX(0) + 30} height={CY(0) - CY(LMAX) + 20} />
            </clipPath>
            <line x1={CX(0)} y1={CY(0)} x2={CX(188)} y2={CY(0)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={CX(0)} y1={CY(0)} x2={CX(0)} y2={CY(LMAX) - 16} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {[60, 120, 180].map((t) => (
              <line key={t} x1={CX(t)} y1={CY(0) - 8} x2={CX(t)} y2={CY(0) + 8} stroke="var(--ink)" strokeWidth={3} />
            ))}
            {[0.5, 1].map((v) => (
              <line key={v} x1={CX(0) - 8} y1={CY(v)} x2={CX(0) + 8} y2={CY(v)} stroke="var(--ink)" strokeWidth={3} />
            ))}
            <g clipPath="url(#ch24-chart)">
              {CURVES.map((c, i) => {
                const pts = c.loss.map((l, k) => [CX(k * c.batch), CY(Math.min(l, LMAX + 0.05))] as [number, number]);
                return (
                  <g key={c.batch}>
                    <path
                      d={pts.map(([x, y], k) => `${k ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")}
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - beat(frame, S.s5, 0.8 + i * 1.8, 1.4)}
                      fill="none"
                      stroke={`var(--hl-${c.c})`}
                      strokeWidth={i === 0 ? 4 : 9}
                      strokeLinejoin="round"
                    />
                    {i > 0 && pts.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={i === 2 ? 12 : 8} fill={`var(--hl-${c.c})`} stroke="var(--ink)" strokeWidth={3} opacity={beat(frame, S.s5, 1.8 + i * 1.8, 0.3)} />)}
                  </g>
                );
              })}
            </g>
          </FullSvg>
          {[0, 60, 120, 180].map((t) => (
            <div key={t} style={{ position: "absolute", left: CX(t) - 40, width: 80, top: CY(0) + 14, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {t}
            </div>
          ))}
          {[0.5, 1].map((v) => (
            <div key={v} style={{ position: "absolute", left: CX(0) - 80, width: 60, top: CY(v) - 19, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {v}
            </div>
          ))}
          <div style={{ position: "absolute", left: CX(188) - 300, width: 290, top: CY(0) + 56, textAlign: "right", fontSize: 32, fontWeight: 700 }}>{L.solved} →</div>
          <div style={{ position: "absolute", left: CX(0) - 20, top: CY(LMAX) - 70, fontSize: 32, fontWeight: 700 }}>↑ {L.lossAxis}</div>
          <Hand x={CX(JUMP_AT) + 26} y={CY(LMAX) - 20} fs={40} style={{ opacity: beat(frame, S.s5, 2.4, 0.4) }}>
            ← {L.jump}
          </Hand>
        </div>
      )}

      {/* s6: computers and GPT-3 */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: gpuO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontSize: 48, fontWeight: 700 }}>{L.gpu}</div>
          <FullSvg>
            {Array.from({ length: 10 }, (_, i) => (
              <g key={i} opacity={beat(frame, S.s6, 0.8, 0.4)}>
                <rect x={150 + i * 80} y={360} width={62} height={80} rx={10} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={3} />
                <ArrowLine x1={181 + i * 80} y1={450} x2={181 + i * 80} y2={530} p={beat(frame, S.s6, 1.4, 0.5)} w={4} head={12} />
              </g>
            ))}
          </FullSvg>
          <Banner text={L.gptBatch} y={640} fs={48} o={beat(frame, S.s6, 3.6, 0.4)} />
          <Banner text={L.gptAll} y={760} fs={44} color="var(--hl-sky)" o={beat(frame, S.s6, 5.2, 0.4)} />
        </div>
      )}

      {/* s7 */}
      {frame >= S.s7.from && (
        <div style={{ opacity: endO }}>
          <Banner text={L.sumA} y={360} fs={48} color="var(--hl-mint)" o={beat(frame, S.s7, 0.4, 0.4)} />
          <Banner text={L.sumB} y={480} fs={48} color="var(--hl-yellow)" o={beat(frame, S.s7, 1.4, 0.4)} />
          <Hand x={0} y={640} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.4, 0.5), rotate: "-2deg" }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch24.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
