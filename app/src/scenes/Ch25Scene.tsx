import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { BEST_STOP, LINE, LINE_TRAIN, LINE_VAL, WIGGLE, ch25 } from "../data/ch25";
import { GD_RUN, TRAIN, VAL, evalPoly } from "../data/part2-fit";
import { num } from "../data/part2-toy";
import { Caption, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "./kit";
import { Banner, FullSvg } from "./part2-kit";

const tl = buildTimeline(ch25);
const S = byId(tl);
const L = ch25.labels;

// the (줄, 별점) plot
const X = (x: number) => 170 + x * 135;
const Y = (y: number) => 960 - y * 88;
const curveD = (c: number[]) =>
  Array.from({ length: 133 }, (_, i) => {
    const x = 0.3 + (5.3 * i) / 132;
    return `${i ? "L" : "M"} ${X(x).toFixed(1)} ${Y(Math.max(-0.3, Math.min(7.2, evalPoly(c, x)))).toFixed(1)}`;
  }).join(" ");
const LINE_D = curveD(LINE);
// s3 morph through these snapshots of the long training run
const MORPH = [10, 50, 200, 1000, 5000, 20000].map((it) => GD_RUN.find((r) => r.it === it)!);
const morphC = (t: number) => {
  const f = t * (MORPH.length - 1);
  const k = Math.min(MORPH.length - 2, Math.floor(f));
  const a = MORPH[k].c;
  const b = MORPH[k + 1].c;
  return a.map((v, i) => mix(v, b[i], f - k));
};

// s5: losses over (log-spaced) training time
const RUN5 = GD_RUN.filter((r) => r.it >= 5);
const LX = (it: number) => 170 + ((Math.log10(it) - Math.log10(5)) / (Math.log10(20000) - Math.log10(5))) * 820;
const LY = (l: number) => 940 - Math.min(l, 0.85) * 640;
const lossD = (key: "train" | "val") => RUN5.map((r, i) => `${i ? "L" : "M"} ${LX(r.it).toFixed(1)} ${LY(r[key]).toFixed(1)}`).join(" ");

const STUDENTS = [
  { name: L.memo, past: 100, fresh: 40, c: "var(--hl-pink)" },
  { name: L.under, past: 90, fresh: 85, c: "var(--hl-mint)" },
];

const Diamond: FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <path d={`M ${x} ${y - 17} L ${x + 17} ${y} L ${x} ${y + 17} L ${x - 17} ${y} Z`} fill="var(--paper)" stroke="var(--pen)" strokeWidth={5} opacity={o} />
);

export const Ch25Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const stuO = beat(frame, S.s1, 0.1, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const plotO = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const lossO = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const fixO = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const endO = beat(frame, S.s7, 0.3, 0.5);

  const inS3 = frame >= S.s3.from;
  const inS4 = frame >= S.s4.from;
  const morph = beat(frame, S.s3, 1.0, 4.0, EASE_IO);
  const wig = morphC(morph);
  const lineDim = inS3 ? mix(1, 0.35, beat(frame, S.s3, 0.3, 0.5)) : 1;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: two students */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: stuO }}>
          <Hand x={64} y={130} fs={38} color="var(--ink-3)">
            {L.example}
          </Hand>
          {STUDENTS.map((s, i) => {
            const x0 = 90 + i * 470;
            return (
              <div key={s.name} style={{ opacity: beat(frame, S.s1, 0.3 + i * 0.6, 0.4) }}>
                <div style={{ position: "absolute", left: x0, top: 260, width: 430, height: 600, borderRadius: 26, border: "5px solid var(--ink)", background: "var(--paper)", boxSizing: "border-box" }} />
                <div style={{ position: "absolute", left: x0, width: 430, top: 290, textAlign: "center" }}>
                  <span style={{ fontSize: 46, fontWeight: 700, background: s.c, color: "var(--chip-ink)", borderRadius: 12, padding: "2px 18px" }}>{s.name}</span>
                </div>
                {[
                  { label: L.past, v: s.past, t: 1.2 },
                  { label: L.fresh, v: s.fresh, t: 3.0 },
                ].map((r, k) => {
                  const p = beat(frame, S.s1, r.t + i * 0.3, 0.8, EASE_IO);
                  const h = (r.v / 100) * 300 * p;
                  const bx = x0 + 70 + k * 170;
                  return (
                    <div key={r.label}>
                      <div style={{ position: "absolute", left: bx, top: 760 - h, width: 120, height: h, borderRadius: "12px 12px 3px 3px", background: k === 0 ? "var(--hl-yellow)" : "var(--hl-sky)" }} />
                      <div style={{ position: "absolute", left: bx - 20, width: 160, top: 760 - h - 50, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700, opacity: p }}>
                        {r.v}
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 28 }}>{L.pts}</span>
                      </div>
                      <div style={{ position: "absolute", left: bx - 40, width: 200, top: 776, textAlign: "center", fontSize: 30, fontWeight: 700, color: "var(--ink-2)", whiteSpace: "nowrap" }}>{r.label}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* s2–s4: fitting stores */}
      {frame >= S.s2.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: plotO }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700 }}>{inS4 ? L.valTitle : L.trainTitle}</div>
          <Hand x={inS4 ? 460 : 520} y={128} fs={36} color="var(--ink-3)">
            {L.example}
          </Hand>
          <FullSvg>
            <line x1={X(0)} y1={Y(0)} x2={X(6.15)} y2={Y(0)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(7.3)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {[1, 2, 3, 4, 5, 6].map((t) => (
              <line key={`x${t}`} x1={X(t)} y1={Y(0) - 8} x2={X(t)} y2={Y(0) + 8} stroke="var(--ink)" strokeWidth={3} />
            ))}
            {[1, 2, 3, 4, 5, 6, 7].map((t) => (
              <line key={`y${t}`} x1={X(0) - 8} y1={Y(t)} x2={X(0) + 8} y2={Y(t)} stroke="var(--ink)" strokeWidth={3} />
            ))}
            {/* 별점 5 is the real maximum */}
            <line x1={X(0)} y1={Y(5)} x2={X(6.1)} y2={Y(5)} stroke="var(--ink-3)" strokeWidth={3} strokeDasharray="10 10" opacity={inS4 ? 1 : 0} />
            <path d={LINE_D} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s2, 2.4, 1.0)} fill="none" stroke="var(--hl-sky)" strokeWidth={9} strokeLinecap="round" opacity={lineDim} />
            {inS3 && <path d={curveD(wig)} fill="none" stroke="var(--pen)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={beat(frame, S.s3, 0.8, 0.3)} />}
            {/* validation errors */}
            {inS4 &&
              VAL.map(([x, y], i) => (
                <line key={`e${i}`} x1={X(x)} y1={Y(y)} x2={X(x)} y2={Y(evalPoly(WIGGLE.c, x))} stroke="var(--pen)" strokeWidth={4} strokeDasharray="8 7" opacity={beat(frame, S.s4, 2.0 + i * 0.15, 0.3)} />
              ))}
            {TRAIN.map(([x, y], i) => (
              <circle key={i} cx={X(x)} cy={Y(y)} r={15} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} opacity={beat(frame, S.s2, 0.6 + i * 0.12, 0.3)} />
            ))}
            {inS4 && VAL.map(([x, y], i) => <Diamond key={`v${i}`} x={X(x)} y={Y(y)} o={beat(frame, S.s4, 0.6 + i * 0.15, 0.3)} />)}
          </FullSvg>
          {[1, 2, 3, 4, 5, 6].map((t) => (
            <div key={`lx${t}`} style={{ position: "absolute", left: X(t) - 30, width: 60, top: Y(0) + 14, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {t}
            </div>
          ))}
          {[1, 2, 3, 4, 5, 6, 7].map((t) => (
            <div key={`ly${t}`} style={{ position: "absolute", left: X(0) - 70, width: 50, top: Y(t) - 19, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {t}
            </div>
          ))}
          <div style={{ position: "absolute", left: X(6.15) - 300, width: 290, top: Y(0) + 54, textAlign: "right", fontSize: 32, fontWeight: 700 }}>{L.axisX} →</div>
          <div style={{ position: "absolute", left: X(0) - 20, top: Y(7.3) - 54, fontSize: 32, fontWeight: 700 }}>↑ {L.axisY}</div>

          {/* scoreboard, top right inside the plot */}
          <div style={{ position: "absolute", left: 560, top: 240, display: "grid", gridTemplateColumns: "auto auto auto", gap: "4px 18px", alignItems: "baseline", fontSize: 32 }}>
            <span />
            <span style={{ fontSize: 26, color: "var(--ink-2)", fontWeight: 700 }}>{L.trainLoss}</span>
            <span style={{ fontSize: 26, color: "var(--ink-2)", fontWeight: 700, opacity: inS4 ? 1 : 0 }}>{L.valLoss}</span>
            <span style={{ fontWeight: 700, opacity: beat(frame, S.s2, 3.4, 0.4) }}>
              <span style={{ display: "inline-block", width: 30, height: 8, borderRadius: 4, background: "var(--hl-sky)", marginRight: 10, verticalAlign: "middle" }} />
              {L.line}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s2, 3.4, 0.4) }}>{num(LINE_TRAIN)}</span>
            <span style={{ fontFamily: "var(--font-mono)", opacity: inS4 ? beat(frame, S.s4, 3.2, 0.4) : 0 }}>{num(LINE_VAL)}</span>
            <span style={{ fontWeight: 700, opacity: inS3 ? beat(frame, S.s3, 5.2, 0.4) : 0 }}>
              <span style={{ display: "inline-block", width: 30, height: 8, borderRadius: 4, background: "var(--pen)", marginRight: 10, verticalAlign: "middle" }} />
              {L.wiggle}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", opacity: inS3 ? beat(frame, S.s3, 5.2, 0.4) : 0 }}>{num(WIGGLE.train)}</span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--pen)", fontWeight: 700, opacity: inS4 ? beat(frame, S.s4, 3.2, 0.4) : 0 }}>{num(WIGGLE.val)}</span>
          </div>
          {!inS3 && (
            <Hand x={X(3.9)} y={Y(1.6)} fs={42} style={{ opacity: beat(frame, S.s2, 3.6, 0.4) }}>
              ↖ {L.simple}
            </Hand>
          )}
          {inS3 && !inS4 && (
            <Hand x={X(0.4)} y={Y(6.3)} fs={42} style={{ opacity: beat(frame, S.s3, 5.6, 0.4) }}>
              {L.complex}: {L.zero}
            </Hand>
          )}
          {inS4 && (
            <>
              <Hand x={300} y={386} fs={44} style={{ opacity: beat(frame, S.s4, 3.8, 0.4) }}>
                {L.weird} →
              </Hand>
              <Banner text={L.overfit} y={Y(0.25) - 40} x={X(2.2)} fs={44} color="var(--hl-pink)" o={beat(frame, S.s4, 5.0, 0.4)} />
            </>
          )}
        </div>
      )}

      {/* s5: train vs validation loss over training */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: lossO }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700 }}>{L.curveTitle}</div>
          <div style={{ position: "absolute", left: 64, top: 190, display: "flex", gap: 24, fontSize: 34, fontWeight: 700 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 44, height: 10, borderRadius: 5, background: "var(--hl-orange)" }} /> {L.trainLoss}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 44, height: 10, borderRadius: 5, background: "var(--pen)" }} /> {L.valLoss}
            </span>
          </div>
          <FullSvg>
            <line x1={170} y1={LY(0)} x2={1010} y2={LY(0)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={170} y1={LY(0)} x2={170} y2={LY(0.85) - 20} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {[0.2, 0.4, 0.6, 0.8].map((v) => (
              <line key={v} x1={162} y1={LY(v)} x2={178} y2={LY(v)} stroke="var(--ink)" strokeWidth={3} />
            ))}
            <path d={lossD("train")} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s5, 0.8, 2.6, EASE_IO)} fill="none" stroke="var(--hl-orange)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            <path d={lossD("val")} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s5, 0.8, 2.6, EASE_IO)} fill="none" stroke="var(--pen)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            <line x1={LX(BEST_STOP.it)} y1={LY(0)} x2={LX(BEST_STOP.it)} y2={LY(0.85)} stroke="var(--ink-3)" strokeWidth={4} strokeDasharray="12 10" opacity={beat(frame, S.s5, 4.2, 0.4)} />
            <circle cx={LX(BEST_STOP.it)} cy={LY(BEST_STOP.val)} r={16} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} opacity={beat(frame, S.s5, 4.2, 0.4)} />
          </FullSvg>
          {[0.2, 0.4, 0.6, 0.8].map((v) => (
            <div key={v} style={{ position: "absolute", left: 80, width: 70, top: LY(v) - 19, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {v}
            </div>
          ))}
          <div style={{ position: "absolute", left: 600, width: 400, top: LY(0) + 16, textAlign: "right", fontSize: 34, fontWeight: 700 }}>{L.time}</div>
          <Hand x={620} y={LY(0) + 62} fs={32} color="var(--ink-3)" style={{ width: 380, textAlign: "right" }}>
            {L.timeNote}
          </Hand>
          <Hand x={LX(BEST_STOP.it) + 24} y={LY(BEST_STOP.val) - 130} fs={46} style={{ opacity: beat(frame, S.s5, 4.6, 0.4) }}>
            ↙ {L.stop}
          </Hand>
          <Hand x={LX(3000) - 60} y={LY(0.3)} fs={46} style={{ opacity: beat(frame, S.s5, 5.6, 0.4), rotate: "-4deg" }}>
            ↕ {L.apart}
          </Hand>
        </div>
      )}

      {/* s6: what to do */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: fixO }}>
          <Banner text={L.fix1} y={330} fs={46} color="var(--hl-yellow)" o={beat(frame, S.s6, 0.4, 0.4)} />
          <Banner text={L.fix2} y={450} fs={46} color="var(--hl-sky)" o={beat(frame, S.s6, 2.0, 0.4)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontSize: 52, fontWeight: 700, opacity: beat(frame, S.s6, 4.4, 0.5) }}>{L.gen}</div>
        </div>
      )}

      {/* s7 */}
      {frame >= S.s7.from && (
        <div style={{ opacity: endO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.gpt}</div>
          <Hand x={0} y={580} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 2.4, 0.5), rotate: "-2deg" }}>
            {L.real}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch25.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
