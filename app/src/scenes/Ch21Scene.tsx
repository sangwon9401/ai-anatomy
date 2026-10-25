import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { PATH, ch21, lossA, slopeA } from "../data/ch21";
import { Caption, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "./kit";
import { ArrowLine, Banner, FullSvg } from "./part2-kit";

const tl = buildTimeline(ch21);
const S = byId(tl);
const L = ch21.labels;

// loss plot: w 0–2.6 across, loss 0–4.4 up
const X = (w: number) => 190 + w * 310;
const Y = (l: number) => 975 - l * 125;
const W_LO = 1.5 - Math.sqrt(4.4) / 2;
const W_HI = 1.5 + Math.sqrt(4.4) / 2;
const CURVE = Array.from({ length: 81 }, (_, i) => {
  const w = W_LO + ((W_HI - W_LO) * i) / 80;
  return `${i ? "L" : "M"} ${X(w).toFixed(1)} ${Y(lossA(w)).toFixed(1)}`;
}).join(" ");
const BR = 24;
const FOG_W = [0.5, 0.66, 0.82, 1.18, 1.34, 1.5, 1.66, 1.82, 1.98, 2.14, 2.3, 2.46];
const DOTS = [0.5, 1, 1.5, 2, 2.5];

// s8: a bowl for two knobs (illustration): f(u, v) = u²/2 + 4v², rotated
const BOWL_C: [number, number] = [620, 630];
const BS = 92; // px per bowl unit
const ROT = (-18 * Math.PI) / 180;
const toXY = (u: number, v: number): [number, number] => [BOWL_C[0] + (u * Math.cos(ROT) - v * Math.sin(ROT)) * BS, BOWL_C[1] + (u * Math.sin(ROT) + v * Math.cos(ROT)) * BS];
const LEVELS = [0.4, 1.4, 3, 5.2, 8];
const BOWL_PATH = (() => {
  let u = -3.7;
  let v = 0.95;
  const pts: [number, number][] = [toXY(u, v)];
  for (let i = 0; i < 9; i++) {
    u -= 0.2 * u;
    v -= 0.2 * 8 * v;
    pts.push(toXY(u, v));
  }
  return pts;
})();

const Ball: FC<{ w: number; lift?: number; o?: number }> = ({ w, lift = 0, o = 1 }) => (
  <g opacity={o}>
    <circle cx={X(w)} cy={Y(lossA(w)) - BR - lift} r={BR} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={5} />
    <circle cx={X(w) - 8} cy={Y(lossA(w)) - BR - lift - 8} r={6} fill="var(--paper)" opacity={0.8} />
  </g>
);

export const Ch21Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const plotO = beat(frame, S.s1, 0.1, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const bowlO = beat(frame, S.s8, 0.4, 0.5);

  // where the ball is
  let w = PATH[0];
  let lift = 0;
  const hop6 = beat(frame, S.s6, 3.0, 0.9, EASE_IO);
  if (frame >= S.s6.from) {
    w = mix(PATH[0], PATH[1], hop6);
    lift = Math.sin(Math.PI * hop6) * 50;
  }
  if (frame >= S.s7.from) {
    w = PATH[1];
    lift = 0;
    for (let k = 1; k < PATH.length - 1; k++) {
      const t = beat(frame, S.s7, 0.6 + (k - 1) * 0.8, 0.6, EASE_IO);
      if (t > 0) {
        w = mix(PATH[k], PATH[k + 1], t);
        lift = Math.sin(Math.PI * t) * 34 * (1 - (k - 1) * 0.25);
      }
    }
  }
  const fogIn = beat(frame, S.s3, 0.6, 0.8);
  const fogOut = beat(frame, S.s7, 3.8, 1.0);
  const curveDraw = beat(frame, S.s2, 1.8, 1.4, EASE_IO);
  const slopeHere = slopeA(w);
  const tan = frame >= S.s4.from && frame < S.s7.from ? beat(frame, S.s4, 2.6, 0.5) * (1 - beat(frame, S.s6, 2.6, 0.3)) : 0;

  const panel = (step: "s4" | "s5" | "s6" | "s7") => {
    const on = frame >= S[step].from && (step === "s7" || frame < S[({ s4: "s5", s5: "s6", s6: "s7" } as const)[step]].from);
    return on ? beat(frame, S[step], 0.3, 0.4) : 0;
  };

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s8.from + 15 && (
        <div style={{ opacity: plotO }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700 }}>{L.title}</div>
          <Hand x={530} y={130} fs={36} color="var(--ink-3)">
            {L.example}
          </Hand>
          <FullSvg>
            {/* axes */}
            <line x1={X(0)} y1={Y(0)} x2={X(2.72)} y2={Y(0)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(4.6)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <path d={`M ${X(2.72) - 16} ${Y(0) - 12} L ${X(2.72) + 2} ${Y(0)} L ${X(2.72) - 16} ${Y(0) + 12}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <path d={`M ${X(0) - 12} ${Y(4.6) + 16} L ${X(0)} ${Y(4.6) - 2} L ${X(0) + 12} ${Y(4.6) + 16}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {[0.5, 1, 1.5, 2, 2.5].map((t) => (
              <line key={t} x1={X(t)} y1={Y(0) - 8} x2={X(t)} y2={Y(0) + 8} stroke="var(--ink)" strokeWidth={3} />
            ))}
            {[1, 2, 3, 4].map((t) => (
              <line key={`y${t}`} x1={X(0) - 8} y1={Y(t)} x2={X(0) + 8} y2={Y(t)} stroke="var(--ink)" strokeWidth={3} />
            ))}
            {/* s2: sample points, then the valley */}
            {DOTS.map((d, i) => (
              <circle key={d} cx={X(d)} cy={Y(lossA(d))} r={11} fill="var(--pen)" opacity={beat(frame, S.s2, 0.4 + i * 0.25, 0.3) * (1 - curveDraw * 0.6)} />
            ))}
            <path d={CURVE} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - curveDraw} fill="none" stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" opacity={frame >= S.s2.from ? 1 : 0} />
            {/* fog */}
            {FOG_W.map((fw, i) => {
              const near = Math.abs(fw - w) < 0.3 ? 0 : 1;
              return (
                <ellipse
                  key={i}
                  cx={X(fw)}
                  cy={Y(Math.min(lossA(fw), 4.4))}
                  rx={Math.min(86, 1020 - X(fw))}
                  ry={70 + (i % 3) * 10}
                  fill="var(--paper-2)"
                  opacity={0.94 * fogIn * (1 - fogOut) * near}
                />
              );
            })}
            {/* s4–s5: the slope under the ball */}
            {tan > 0 && (
              <line
                x1={X(w - 0.22)}
                y1={Y(lossA(w) - slopeHere * 0.22)}
                x2={X(w + 0.22)}
                y2={Y(lossA(w) + slopeHere * 0.22)}
                stroke="var(--pen)"
                strokeWidth={7}
                strokeLinecap="round"
                opacity={tan}
              />
            )}
            {/* s4: the nudge */}
            {frame >= S.s4.from && frame < S.s6.from && <ArrowLine x1={X(1)} y1={Y(0) - 26} x2={X(1) + 70} y2={Y(0) - 26} p={beat(frame, S.s4, 0.6, 0.5)} color="var(--pen)" w={5} head={14} />}
            {/* s6: the step */}
            {frame >= S.s6.from && frame < S.s7.from && <ArrowLine x1={X(1)} y1={Y(0) - 26} x2={X(1.4)} y2={Y(0) - 26} p={beat(frame, S.s6, 2.2, 0.7)} color="var(--pen)" w={6} head={16} />}
            <Ball w={w} lift={lift} />
          </FullSvg>
          {/* axis text */}
          {[0.5, 1, 1.5, 2, 2.5].map((t) => (
            <div key={t} style={{ position: "absolute", left: X(t) - 40, width: 80, top: Y(0) + 14, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {t}
            </div>
          ))}
          {[1, 2, 3, 4].map((t) => (
            <div key={`y${t}`} style={{ position: "absolute", left: X(0) - 70, width: 50, top: Y(t) - 19, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {t}
            </div>
          ))}
          <div style={{ position: "absolute", left: X(2.72) - 330, width: 320, top: Y(0) + 56, textAlign: "right", fontSize: 34, fontWeight: 700 }}>{L.axisW} →</div>
          <div style={{ position: "absolute", left: X(0) - 20, top: Y(4.6) - 62, fontSize: 34, fontWeight: 700 }}>↑ {L.axisL}</div>

          {/* s1 */}
          <Hand x={X(1) + 40} y={Y(1) - 120} fs={42} style={{ opacity: beat(frame, S.s1, 1.4, 0.4) * (1 - beat(frame, S.s2, 0, 0.3)) }}>
            {L.now}
          </Hand>
          {/* s2 */}
          <Hand x={X(0.05)} y={Y(2.4)} fs={44} style={{ opacity: beat(frame, S.s2, 3.2, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
            {L.valley}
          </Hand>
          <PenCircle x={X(1.5) - 70} y={Y(0) - 70} w={140} h={90} p={beat(frame, S.s2, 4.2, 0.6) * (1 - beat(frame, S.s3, 0, 0.3))} />
          <Hand x={X(1.5) - 150} y={Y(1.5)} fs={42} style={{ width: 300, textAlign: "center", opacity: beat(frame, S.s2, 4.6, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
            {L.goal}
            <br />↓
          </Hand>
          {/* s3 */}
          <Hand x={64} y={210} fs={46} style={{ opacity: beat(frame, S.s3, 1.8, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            {L.fog}
          </Hand>

          {/* info panels, top right */}
          <div style={{ position: "absolute", left: 64, top: 200, opacity: panel("s4"), display: "grid", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500 }}>
              {L.nudgeW}, {L.nudgeL}
            </span>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 42, color: "var(--pen)", opacity: beat(frame, S.s4, 3.4, 0.4) }}>{L.nudgeD}</span>
          </div>
          <div style={{ position: "absolute", left: 64, top: 200, opacity: panel("s5"), display: "grid", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700 }}>{L.slope}</span>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 42, color: "var(--pen)", opacity: beat(frame, S.s5, 3.0, 0.4) }}>{L.slopeNote}</span>
          </div>
          <div style={{ position: "absolute", left: 64, top: 200, opacity: panel("s6"), display: "grid", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700 }}>{L.rule}</span>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 42, color: "var(--pen)", opacity: beat(frame, S.s6, 1.6, 0.4) }}>{L.lr}</span>
          </div>
          {frame >= S.s6.from && frame < S.s7.from && (
            <Hand x={X(1.4) + 40} y={Y(0.04) - 130} fs={42} style={{ opacity: beat(frame, S.s6, 4.2, 0.4) }}>
              {L.loss14}
            </Hand>
          )}
          <div style={{ position: "absolute", left: 64, top: 200, opacity: panel("s7"), display: "grid", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700 }}>{L.repeat}</span>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 42, color: "var(--pen)", opacity: beat(frame, S.s7, 3.6, 0.4) }}>{L.done}</span>
          </div>
          {frame >= S.s7.from && <Banner text={L.gd} y={Y(3.2)} fs={52} o={beat(frame, S.s7, 4.4, 0.5)} />}
        </div>
      )}

      {/* s8: two knobs make a bowl */}
      {frame >= S.s8.from && (
        <div style={{ opacity: bowlO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.bowl}</div>
          <Hand x={0} y={206} fs={36} color="var(--ink-3)" style={{ width: 1080, textAlign: "center" }}>
            {L.bowlEx}
          </Hand>
          <FullSvg>
            {LEVELS.map((c, i) => {
              const a = Math.sqrt(2 * c) * BS;
              const b = Math.sqrt(c / 4) * BS;
              return (
                <ellipse
                  key={c}
                  cx={BOWL_C[0]}
                  cy={BOWL_C[1]}
                  rx={a}
                  ry={b}
                  transform={`rotate(${(ROT * 180) / Math.PI} ${BOWL_C[0]} ${BOWL_C[1]})`}
                  fill={i === 0 ? "var(--hl-mint)" : "none"}
                  stroke="var(--ink-3)"
                  strokeWidth={4}
                  opacity={beat(frame, S.s8, 0.6 + (LEVELS.length - i) * 0.15, 0.4)}
                />
              );
            })}
            <path
              d={BOWL_PATH.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - beat(frame, S.s8, 1.8, 2.4, EASE_IO)}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={6}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle cx={BOWL_PATH[0][0]} cy={BOWL_PATH[0][1]} r={20} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} opacity={beat(frame, S.s8, 1.4, 0.3)} />
            <ArrowLine x1={110} y1={990} x2={370} y2={990} p={beat(frame, S.s8, 0.8, 0.5)} w={5} />
            <ArrowLine x1={110} y1={990} x2={110} y2={810} p={beat(frame, S.s8, 0.8, 0.5)} w={5} />
          </FullSvg>
          <div style={{ position: "absolute", left: 386, top: 970, fontSize: 32, fontWeight: 700, color: "var(--ink-2)", opacity: beat(frame, S.s8, 1.0, 0.4) }}>{L.k1}</div>
          <div style={{ position: "absolute", left: 64, top: 756, fontSize: 32, fontWeight: 700, color: "var(--ink-2)", opacity: beat(frame, S.s8, 1.0, 0.4) }}>{L.k2}</div>
          <Hand x={560} y={960} fs={48} style={{ opacity: beat(frame, S.s8, 5.0, 0.5), rotate: "-2deg" }}>
            {L.many}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch21.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
