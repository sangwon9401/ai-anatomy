import type { FC } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { RUNS, SCORES81, ch81 } from "../../../data/ch81";
import { joinPieces, softmaxT } from "../../../data/part9-toy";
import { Caption, Chip, EASE_IO, FPS, Hand, InlineCircle, Narration, Paper, PenCircle, PenUnderline, Tag, beat, buildTimeline, byId, chipWidth, mix, textWidth, type SceneProps } from "../../../scenes/kit";
import { Card, Dial, pct1 } from "../../../scenes/part9-kit";

const tl = buildTimeline(ch81);
const S = byId(tl);
const L = ch81.labels;

const SC = SCORES81.map((s) => s.s);
const XC = [260, 460, 660, 860];
const BW = 130;
const BASE = 900;
const PX = 400; // px for probability 1
const CHIP_Y = 920;
const ROW_Y = 1010;
const DIAL = { x: 870, y: 310, r: 135 };

const fmtNum = (v: number) => (v < -0.005 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));
const fmtT = (t: number) => (t >= 9.95 ? "10" : t.toFixed(1));

/** temperature over time: 1 → 0.5 (s3) → 2 (s4) */
function tempAt(frame: number) {
  const k = (step: (typeof S)[string], a: number, b: number) => interpolate(frame, [step.from + a * FPS, step.from + b * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IO });
  const down = k(S.s3, 0.6, 2.0);
  const up = k(S.s4, 0.4, 2.0);
  // interpolate in log space so the dial moves evenly
  const lt = mix(mix(Math.log(1), Math.log(0.5), down), Math.log(2), up);
  return Math.exp(lt);
}

const MiniBars: FC<{ x0: number; t: number; grow: number; title: string; note: string; noteO: number }> = ({ x0, t, grow, title, note, noteO }) => {
  const p = softmaxT(SC, t);
  return (
    <div>
      <div style={{ position: "absolute", left: x0, width: 420, top: 400, textAlign: "center", fontSize: 44, fontWeight: 700, opacity: grow }}>{title}</div>
      <div style={{ position: "absolute", left: x0 + 10, top: 858, width: 400, height: 5, background: "var(--ink)", opacity: grow }} />
      {SCORES81.map((c, i) => {
        const h = p[i] * 340 * grow;
        const x = x0 + 25 + i * 96;
        return (
          <div key={c.w}>
            <div style={{ position: "absolute", left: x, top: 860 - h, width: 76, height: h, background: `var(--hl-${c.c})`, borderRadius: "10px 10px 2px 2px" }} />
            <div style={{ position: "absolute", left: x - 30, width: 136, top: 860 - h - 44, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28, opacity: grow }}>{Math.round(p[i] * 100)}%</div>
            <div style={{ position: "absolute", left: x - 30, width: 136, top: 872, textAlign: "center", fontSize: 30, fontWeight: 700, opacity: grow }}>{c.w}</div>
          </div>
        );
      })}
      <Hand x={x0} y={940} fs={42} style={{ width: 420, textAlign: "center", opacity: noteO }}>
        {note}
      </Hand>
    </div>
  );
};

export const Ch81Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const t = tempAt(frame);
  const p = softmaxT(SC, t);

  const mainOn = 1 - beat(frame, S.s5, 0, 0.5);
  const dialOn = beat(frame, S.s1, 2.8, 0.6) * (1 - beat(frame, S.s5, 0, 0.5));
  const recapOn = 1 - beat(frame, S.s2, 0, 0.4);
  const formulaOn = beat(frame, S.s2, 1.0, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const divided = beat(frame, S.s2, 3.0, 0.5);
  const miniOn = beat(frame, S.s5, 0.4, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const runsOn = beat(frame, S.s6, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s4: the main chart */}
      {frame < S.s5.from + 15 && (
        <div style={{ opacity: mainOn }}>
          <div style={{ position: "absolute", left: XC[0] - 80, top: BASE - 2, width: XC[3] - XC[0] + 160, height: 5, background: "var(--ink)", borderRadius: 2 }} />
          {SCORES81.map((c, i) => {
            const g = beat(frame, S.s1, 0.4 + i * 0.15, 0.8);
            const h = p[i] * PX * g;
            return (
              <div key={c.w}>
                <div style={{ position: "absolute", left: XC[i] - BW / 2, top: BASE - h, width: BW, height: h, background: `var(--hl-${c.c})`, borderRadius: "14px 14px 3px 3px" }} />
                <div style={{ position: "absolute", left: XC[i] - 110, width: 220, top: BASE - h - 56, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, opacity: g }}>{pct1(p[i])}</div>
                <Chip text={c.w} color={c.c} fs={48} x={XC[i] - chipWidth(c.w, 48) / 2} y={CHIP_Y} style={{ opacity: beat(frame, S.s1, 0.2 + i * 0.12, 0.4) }} />
                <div style={{ position: "absolute", left: XC[i] - 100, width: 200, top: ROW_Y, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 38, opacity: beat(frame, S.s1, 1.4, 0.4) }}>
                  {fmtNum(c.s / t)}
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 56, top: ROW_Y + 6, fontSize: 30, color: "var(--ink-2)", opacity: beat(frame, S.s1, 1.4, 0.4) * (1 - divided) }}>{L.score}</div>
          <div style={{ position: "absolute", left: 56, top: ROW_Y + 6, fontSize: 30, color: "var(--ink-2)", opacity: divided }}>{L.divided}</div>

          {/* s1: recap line */}
          <div style={{ position: "absolute", left: 70, top: 160, fontSize: 42, fontWeight: 500, opacity: beat(frame, S.s1, 0.2, 0.5) * recapOn }}>{L.recap}</div>
          <Hand x={680} y={462} fs={46} style={{ opacity: beat(frame, S.s1, 3.4, 0.4) * recapOn, rotate: "-3deg" }}>
            {L.dial}
          </Hand>

          <div style={{ position: "absolute", right: 70, top: 540, fontSize: 30, color: "var(--ink-3)", opacity: beat(frame, S.s1, 1.6, 0.4) }}>{L.example}</div>

          {/* s2–s4: hand notes */}
          <Hand x={70} y={360} fs={50} style={{ opacity: beat(frame, S.s2, 3.6, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
            {L.same}
          </Hand>
          <Hand x={70} y={360} fs={50} style={{ opacity: beat(frame, S.s3, 2.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)), rotate: "-2deg" }}>
            {L.sharp}
          </Hand>
          <Hand x={70} y={360} fs={50} style={{ opacity: beat(frame, S.s4, 2.4, 0.4) * (1 - beat(frame, S.s5, 0, 0.3)), rotate: "-2deg" }}>
            {L.flat}
          </Hand>
          <PenCircle x={XC[3] - 90} y={BASE - p[3] * PX - 70} w={180} h={76} p={beat(frame, S.s4, 4.2, 0.6) * (1 - beat(frame, S.s5, 0, 0.3))} />
          <PenCircle x={XC[0] - 100} y={BASE - p[0] * PX - 70} w={200} h={76} p={beat(frame, S.s3, 3.2, 0.6) * (1 - beat(frame, S.s4, 0, 0.3))} />
        </div>
      )}

      {/* formula (s2–s5) */}
      {frame >= S.s2.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: formulaOn }}>
          <div style={{ position: "absolute", left: 70, top: 150, fontSize: 48, fontWeight: 500 }}>{L.fLeft}</div>
          <div style={{ position: "absolute", left: 70, top: 226, fontSize: 48, fontWeight: 700 }}>
            {L.fRight.split("÷")[0]}÷{" "}
            <span style={{ margin: "0 14px 0 18px" }}>
              <InlineCircle p={beat(frame, S.s2, 2.0, 0.6)}>{L.temp}</InlineCircle>
            </span>
            )
          </div>
        </div>
      )}

      {/* the dial (s1–s4) */}
      {frame < S.s5.from + 15 && <Dial x={DIAL.x} y={DIAL.y} r={DIAL.r} t={t} label={`${L.tempShort} ${fmtT(t)}`} opacity={dialOn} />}

      {/* s5: both ends of the dial */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: miniOn }}>
          <MiniBars x0={70} t={0.1} grow={beat(frame, S.s5, 0.6, 0.8)} title={L.near0} note={L.greedy} noteO={beat(frame, S.s5, 2.4, 0.4)} />
          <MiniBars x0={590} t={10} grow={beat(frame, S.s5, 3.6, 0.8)} title={L.high} note={L.even} noteO={beat(frame, S.s5, 5.0, 0.4)} />
          <div style={{ position: "absolute", left: 540, top: 470, width: 3, height: 520, background: "var(--line)" }} />
        </div>
      )}

      {/* s6: sentences at three temperatures */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: runsOn }}>
          <div style={{ position: "absolute", left: 70, top: 110, fontSize: 40, fontWeight: 700 }}>{L.runsHead}</div>
          {RUNS.map((g, gi) => {
            const y = 190 + gi * 285;
            const a = beat(frame, S.s6, 0.5 + gi * 1.8, 0.5);
            const tagText = [L.loop, L.natural, L.odd][gi];
            return (
              <div key={g.t} style={{ opacity: a, translate: `0px ${mix(18, 0, a)}px` }}>
                <Card x={56} y={y} w={968} h={260} />
                <Dial x={150} y={y + 112} r={66} t={g.t} ticks={[0, 3]} />
                <div style={{ position: "absolute", left: 50, width: 200, top: y + 196, textAlign: "center", fontSize: 32, fontWeight: 700 }}>
                  {L.tempShort} {g.t.toFixed(1)}
                </div>
                {g.runs.map((r, ri) => (
                  <div
                    key={ri}
                    style={{ position: "absolute", left: 260, top: y + 28 + ri * 72, fontSize: 36, fontWeight: 500, whiteSpace: "nowrap", opacity: beat(frame, S.s6, 0.8 + gi * 1.8 + ri * 0.35, 0.3) }}
                  >
                    {joinPieces(r)}
                  </div>
                ))}
                {g.runs.length === 1 && (
                  <Hand x={260} y={y + 110} fs={44} style={{ opacity: beat(frame, S.s6, 1.4, 0.4) }}>
                    {L.allSame}
                  </Hand>
                )}
                <Chip text={tagText} color={(["sky", "mint", "orange"] as const)[gi]} fs={34} x={1000 - chipWidth(tagText, 34)} y={y + 192} style={{ opacity: beat(frame, S.s6, 1.2 + gi * 1.8, 0.4) }} />
              </div>
            );
          })}
          <div style={{ position: "absolute", right: 56, top: 1046, fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s6, 1.0, 0.4) }}>{L.toy}</div>
        </div>
      )}

      {/* s7: when to use which */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          {[
            { x: 70, t: 0.3, title: L.low, when: L.lowWhen, ex: L.lowEx, c: "sky" as const },
            { x: 560, t: 1.8, title: L.highT, when: L.highWhen, ex: L.highEx, c: "orange" as const },
          ].map((k, i) => (
            <div key={k.title} style={{ opacity: beat(frame, S.s7, 0.5 + i * 1.6, 0.5) }}>
              <Card x={k.x} y={170} w={450} h={500} />
              <Dial x={k.x + 225} y={330} r={100} t={k.t} />
              <Chip text={k.title} color={k.c} fs={46} x={k.x + 225 - chipWidth(k.title, 46) / 2} y={460} />
              <div style={{ position: "absolute", left: k.x, width: 450, top: 548, textAlign: "center", fontSize: 38, fontWeight: 700 }}>{k.when}</div>
              <div style={{ position: "absolute", left: k.x, width: 450, top: 604, textAlign: "center", fontSize: 32, color: "var(--ink-2)" }}>{k.ex}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontSize: 50, fontWeight: 700, opacity: beat(frame, S.s7, 4.4, 0.5) }}>{L.key}</div>
          <PenUnderline x={540 - textWidth(L.key, 50) / 2} y={830} w={textWidth(L.key, 50)} p={beat(frame, S.s7, 5.2, 0.7)} />
          <Hand x={0} y={900} fs={44} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.2, 0.5) }}>
            {L.name}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch81.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
