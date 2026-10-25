import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { lossA } from "../../../data/ch21";
import { RUNS, RUN_LOSS, ch22 } from "../../../data/ch22";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";
import { FullSvg } from "../../../scenes/part2-kit";

const tl = buildTimeline(ch22);
const S = byId(tl);
const L = ch22.labels;
const LR_WORD = L.lrAxis; // "learning rate", circled inside L.rule

// the valley (same as chapter 21)
const X = (w: number) => 190 + w * 310;
const Y = (l: number) => 975 - l * 125;
const W_LO = 1.5 - Math.sqrt(4.4) / 2;
const W_HI = 1.5 + Math.sqrt(4.4) / 2;
const CURVE = Array.from({ length: 81 }, (_, i) => {
  const w = W_LO + ((W_HI - W_LO) * i) / 80;
  return `${i ? "L" : "M"} ${X(w).toFixed(1)} ${Y(lossA(w)).toFixed(1)}`;
}).join(" ");
const BR = 24;
// how many hops each run shows in its step, and when
const HOPS = [5, 3, 2];
const HOP_T0 = [1.0, 1.0, 1.2];
const HOP_DT = [0.9, 1.1, 1.6];
const RUN_STEP = ["s2", "s3", "s4"] as const;

// s5: loss per step chart
const CX = (k: number) => 210 + k * 76;
const CY = (l: number) => 880 - Math.min(l, 2.05) * 250;
// s6: a learning-rate schedule sketch (warm-up, then cosine decay to 10%)
const SX = (t: number) => 170 + t * 800;
const SY = (v: number) => 860 - v * 420;
const sched = (t: number) => (t < 0.08 ? t / 0.08 : 0.1 + 0.9 * 0.5 * (1 + Math.cos((Math.PI * (t - 0.08)) / 0.92)));
const SCHED = Array.from({ length: 101 }, (_, i) => `${i ? "L" : "M"} ${SX(i / 100).toFixed(1)} ${SY(sched(i / 100)).toFixed(1)}`).join(" ");

const Ball: FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r={BR} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={5} />
    <circle cx={x - 8} cy={y - 8} r={6} fill="var(--paper)" opacity={0.8} />
  </g>
);

export const Ch22Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const valleyO = beat(frame, S.s1, 0.1, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const chartO = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const schedO = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const endO = beat(frame, S.s7, 0.3, 0.5);

  // which run is on the valley now
  const ri: number = frame >= S.s4.from ? 2 : frame >= S.s3.from ? 1 : frame >= S.s2.from ? 0 : -1;
  const run = ri >= 0 ? RUNS[ri] : null;
  let ballW = RUNS[0].ws[0];
  let lift = 0;
  let done = 0;
  if (run) {
    const st = S[RUN_STEP[ri]];
    for (let k = 0; k < HOPS[ri]; k++) {
      const t = beat(frame, st, HOP_T0[ri] + k * HOP_DT[ri], HOP_DT[ri] * 0.6, EASE_IO);
      if (t > 0) {
        ballW = mix(run.ws[k], run.ws[k + 1], t);
        lift = Math.sin(Math.PI * t) * (ri === 2 ? 160 : 40);
        if (t >= 1) done = k + 1;
      }
    }
  }
  const runIn = run ? beat(frame, S[RUN_STEP[ri]], 0.1, 0.4) : 0;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s4: the valley */}
      {frame < S.s5.from + 15 && (
        <div style={{ opacity: valleyO }}>
          {ri < 0 ? (
            <>
              {/* en: the formula comes from L.rule with "learning rate" circled; a smaller size keeps the longer English inside the canvas */}
              <div style={{ position: "absolute", left: 0, right: 0, top: 136, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 700 }}>
                {L.rule.split(LR_WORD)[0]}
                <InlineCircle p={beat(frame, S.s1, 1.6, 0.6)}>{LR_WORD}</InlineCircle>
                {L.rule.split(LR_WORD)[1]}
              </div>
              <Hand x={0} y={226} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 2.4, 0.4) }}>
                {L.stride}
              </Hand>
            </>
          ) : (
            run && (
              <div style={{ opacity: runIn }}>
                <Chip text={[L.small, L.good, L.big][ri]} color={run.c} fs={50} x={64} y={124} style={{ fontWeight: 700 }} />
                <Hand x={64 + chipWidth([L.small, L.good, L.big][ri], 50) + 30} y={136} fs={46} style={{ opacity: done >= HOPS[ri] ? 1 : 0 }}>
                  {[L.turtle, L.arrive, L.bounce][ri]}
                </Hand>
                <div style={{ position: "absolute", left: 64, top: 214, fontFamily: "var(--font-mono)", fontSize: 34, color: "var(--ink-2)" }}>
                  w: {run.ws.slice(0, done + 1).map((w) => String(+w.toFixed(3))).join(" → ")}
                </div>
              </div>
            )
          )}
          <Hand x={64} y={270} fs={34} color="var(--ink-3)" style={{ opacity: ri < 0 ? 0 : 1 }}>
            {L.example}
          </Hand>
          <FullSvg>
            <line x1={X(0)} y1={Y(0)} x2={X(2.72)} y2={Y(0)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(4.6)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <path d={`M ${X(2.72) - 16} ${Y(0) - 12} L ${X(2.72) + 2} ${Y(0)} L ${X(2.72) - 16} ${Y(0) + 12}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <path d={`M ${X(0) - 12} ${Y(4.6) + 16} L ${X(0)} ${Y(4.6) - 2} L ${X(0) + 12} ${Y(4.6) + 16}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {[0.5, 1, 1.5, 2, 2.5].map((t) => (
              <line key={t} x1={X(t)} y1={Y(0) - 8} x2={X(t)} y2={Y(0) + 8} stroke="var(--ink)" strokeWidth={3} />
            ))}
            <path d={CURVE} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s1, 0.4, 1.2)} fill="none" stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" />
            {/* the trail of this run */}
            {run &&
              run.ws.slice(0, done + 1).map((w, k) => (
                <g key={k}>
                  {k > 0 && (
                    <path
                      d={`M ${X(run.ws[k - 1])} ${Y(lossA(run.ws[k - 1]))} Q ${(X(run.ws[k - 1]) + X(w)) / 2} ${Math.min(Y(lossA(run.ws[k - 1])), Y(lossA(w))) - (ri === 2 ? 200 : 60)} ${X(w)} ${Y(lossA(w))}`}
                      fill="none"
                      stroke={`var(--hl-${run.c})`}
                      strokeWidth={5}
                      strokeDasharray="10 9"
                    />
                  )}
                  <circle cx={X(w)} cy={Y(lossA(w))} r={10} fill={`var(--hl-${run.c})`} stroke="var(--ink)" strokeWidth={3} />
                </g>
              ))}
            {ri === 2 && done >= 2 && (
              <path
                d={`M ${X(run!.ws[2])} ${Y(lossA(run!.ws[2]))} Q ${X(1.6)} ${Y(6.4)} ${X(2.5)} ${Y(4.6)}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - beat(frame, S.s4, 5.0, 0.8)}
                fill="none"
                stroke="var(--pen)"
                strokeWidth={6}
                strokeLinecap="round"
              />
            )}
            <Ball x={X(ballW)} y={Y(lossA(ballW)) - BR - lift} />
          </FullSvg>
          {[0.5, 1, 1.5, 2, 2.5].map((t) => (
            <div key={t} style={{ position: "absolute", left: X(t) - 40, width: 80, top: Y(0) + 14, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {t}
            </div>
          ))}
          <div style={{ position: "absolute", left: X(2.72) - 330, width: 320, top: Y(0) + 56, textAlign: "right", fontSize: 34, fontWeight: 700 }}>{L.axisW} →</div>
          <div style={{ position: "absolute", left: X(0) - 20, top: Y(4.6) - 62, fontSize: 34, fontWeight: 700 }}>↑ {L.axisL}</div>
          {ri === 2 && (
            <Hand x={X(1.2)} y={Y(4.4) - 40} fs={42} style={{ opacity: beat(frame, S.s4, 5.6, 0.4) }}>
              {L.out}
            </Hand>
          )}
        </div>
      )}

      {/* s5: loss per step for the three learning rates */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: chartO }}>
          <div style={{ position: "absolute", left: 64, top: 122, fontSize: 50, fontWeight: 700 }}>{L.chart}</div>
          <div style={{ position: "absolute", left: 64, top: 210, display: "flex", gap: 16 }}>
            {RUNS.map((r, i) => (
              <span key={r.lr} style={{ fontSize: 34, fontWeight: 700, padding: "2px 14px", borderRadius: 10, background: `var(--hl-${r.c})`, color: "var(--chip-ink)", opacity: beat(frame, S.s5, 0.8 + i * 0.6, 0.4) }}>
                {[L.small, L.good, L.big][i]}
              </span>
            ))}
          </div>
          <FullSvg>
            <line x1={CX(0)} y1={CY(0)} x2={CX(10.4)} y2={CY(0)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={CX(0)} y1={CY(0)} x2={CX(0)} y2={CY(2.05) - 20} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {[1, 2].map((v) => (
              <line key={v} x1={CX(0) - 8} y1={CY(v)} x2={CX(0) + 8} y2={CY(v)} stroke="var(--ink)" strokeWidth={3} />
            ))}
            {RUN_LOSS.map((ls, i) => {
              const pts = ls.slice(0, i === 2 ? 3 : 11).map((l, k) => [CX(k), CY(l)] as [number, number]);
              const d = pts.map(([x, y], k) => `${k ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
              return (
                <g key={i}>
                  <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s5, 0.8 + i * 0.6, 1.0)} fill="none" stroke={`var(--hl-${RUNS[i].c})`} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
                  {pts.map(([x, y], k) => (
                    <circle key={k} cx={x} cy={y} r={7} fill={`var(--hl-${RUNS[i].c})`} stroke="var(--ink)" strokeWidth={2.5} opacity={beat(frame, S.s5, 1.6 + i * 0.6, 0.3)} />
                  ))}
                </g>
              );
            })}
          </FullSvg>
          {[0, 5, 10].map((k) => (
            <div key={k} style={{ position: "absolute", left: CX(k) - 40, width: 80, top: CY(0) + 14, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {k}
            </div>
          ))}
          {[1, 2].map((v) => (
            <div key={v} style={{ position: "absolute", left: CX(0) - 70, width: 50, top: CY(v) - 19, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {v}
            </div>
          ))}
          <div style={{ position: "absolute", left: CX(10.4) - 200, width: 190, top: CY(0) + 56, textAlign: "right", fontSize: 34, fontWeight: 700 }}>{L.step} →</div>
          <div style={{ position: "absolute", left: CX(0) - 20, top: CY(2.05) - 82, fontSize: 34, fontWeight: 700 }}>↑ {L.axisL}</div>
          <Hand x={CX(8)} y={CY(RUN_LOSS[0][8]) - 76} fs={44} style={{ opacity: beat(frame, S.s5, 4.0, 0.4) }}>
            {L.slow}
          </Hand>
          <Hand x={CX(1.7)} y={CY(0) - 110} fs={44} style={{ opacity: beat(frame, S.s5, 4.6, 0.4) }}>
            {L.fast}!
          </Hand>
          <Hand x={CX(2.3)} y={CY(2.05) - 10} fs={44} style={{ opacity: beat(frame, S.s5, 5.2, 0.4) }}>
            ↑ {L.up}
          </Hand>
        </div>
      )}

      {/* s6: schedules */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: schedO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.schedTitle}</div>
          <Hand x={0} y={218} fs={36} color="var(--ink-3)" style={{ width: 1080, textAlign: "center" }}>
            {L.sketch}
          </Hand>
          <FullSvg>
            <line x1={SX(0)} y1={SY(0)} x2={SX(1.04)} y2={SY(0)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={SX(0)} y1={SY(0)} x2={SX(0)} y2={SY(1.15)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <path d={SCHED} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s6, 0.8, 2.4, EASE_IO)} fill="none" stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" />
          </FullSvg>
          <div style={{ position: "absolute", left: SX(1.04) - 300, width: 290, top: SY(0) + 20, textAlign: "right", fontSize: 34, fontWeight: 700 }}>{L.timeAxis} →</div>
          <div style={{ position: "absolute", left: SX(0) - 20, top: SY(1.15) - 60, fontSize: 34, fontWeight: 700 }}>↑ {L.lrAxis}</div>
          <Hand x={250} y={700} fs={40} style={{ opacity: beat(frame, S.s6, 1.4, 0.4) }}>
            ↖ {L.warm}
          </Hand>
          <Hand x={690} y={520} fs={44} style={{ opacity: beat(frame, S.s6, 3.0, 0.4) }}>
            {L.decay} ↘
          </Hand>
        </div>
      )}

      {/* s7 */}
      {frame >= S.s7.from && (
        <div style={{ opacity: endO }}>
          {[L.sum1, L.sum2, L.sum3].map((t, i) => (
            <div key={t} style={{ position: "absolute", left: 0, right: 0, top: 330 + i * 110, textAlign: "center", opacity: beat(frame, S.s7, 0.6 + i * 0.7, 0.4) }}>
              <span style={{ fontSize: 50, fontWeight: 700, padding: "4px 22px", borderRadius: 14, background: `var(--hl-${RUNS[[0, 2, 1][i]].c})`, color: "var(--chip-ink)" }}>{t}</span>
            </div>
          ))}
          <Hand x={0} y={720} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.6, 0.5), rotate: "-2deg" }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch22.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
