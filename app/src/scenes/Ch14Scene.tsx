import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { SCORES, ch14, softmax } from "../data/ch14";
import {
  Caption,
  Narration,
  Chip,
  EASE_IO,
  Hand,
  Paper,
  InlineCircle,
  InlineUnderline,
  PenCircle,
  Tag,
  beat,
  buildTimeline,
  byId,
  chipWidth,
  mix,
  type SceneProps,
} from "./kit";

const tl = buildTimeline(ch14);
const S = byId(tl);
const L = ch14.labels;

const XC = [225, 435, 645, 855];
const BW = 128;
const BASE = 800;
const SC_SCORE = 70;
const { ex: EX, sum: SUM, p: P } = softmax(SCORES.map((s) => s.s));
const SC_EXP = 440 / Math.max(...EX);
const SC_P = 640;
const CHIP_Y = 960;
const SUP = ["3", "2", "1", "−1"];

const fmtScore = (s: number) => (s < 0 ? `−${Math.abs(s).toFixed(1)}` : s.toFixed(1));

// y = e^x sketch for the corner graph
const GX = (x: number) => 40 + ((x + 2) / 5.2) * 290;
const GY = (y: number) => 240 - (y / 22) * 210;
const CURVE = Array.from({ length: 41 }, (_, i) => -2 + (i * 5.1) / 40)
  .map((x, i) => `${i === 0 ? "M" : "L"} ${GX(x).toFixed(1)} ${GY(Math.exp(x)).toFixed(1)}`)
  .join(" ");

export const Ch14Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s2Out = 1 - beat(frame, S.s3, 0, 0.4);
  const graphIn = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const ratioOn = 1 - beat(frame, S.s5, 0, 0.4);
  const eqOn = 1 - beat(frame, S.s6, 0, 0.4);
  const dim = mix(1, 0.05, beat(frame, S.s7, 0, 0.6));

  const bars = SCORES.map((c, i) => {
    const g1 = beat(frame, S.s1, 1.0 + i * 0.15, 0.8);
    const t3 = beat(frame, S.s3, 1.6 + i * 0.1, 1.2, EASE_IO);
    const t6 = beat(frame, S.s6, 0.3 + i * 0.1, 1.2, EASE_IO);
    const h = mix(mix(c.s * SC_SCORE * g1, EX[i] * SC_EXP, t3), P[i] * SC_P, t6);
    return { ...c, i, g1, t3, t6, h, top: BASE - Math.max(h, 0) };
  });

  const stackW = 840;
  let acc = 0;
  const stack = P.map((p, i) => {
    const left = 120 + acc;
    acc += p * stackW;
    return { left, w: p * stackW * beat(frame, S.s6, 2.0 + i * 0.35, 0.5), c: SCORES[i].c };
  });

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      <div style={{ opacity: dim }}>
        {/* zero line + axis name */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: BASE - 2,
            height: 4,
            width: 870 * beat(frame, S.s1, 0, 0.6),
            background: "var(--ink)",
            borderRadius: 2,
          }}
        />
        <div style={{ position: "absolute", left: 82, top: BASE - 24, fontFamily: "var(--font-mono)", fontSize: 34, color: "var(--ink-3)" }}>0</div>

        {bars.map((b) => {
          const lx = XC[b.i] - 110;
          const labelY = b.h >= 0 ? b.top - 58 : BASE + Math.abs(b.h) + 6;
          return (
            <div key={b.w}>
              <div
                style={{
                  position: "absolute",
                  left: XC[b.i] - BW / 2,
                  top: b.h >= 0 ? b.top : BASE,
                  width: BW,
                  height: Math.abs(b.h),
                  background: `var(--hl-${b.c})`,
                  borderRadius: b.h >= 0 ? "14px 14px 3px 3px" : "3px 3px 14px 14px",
                }}
              />
              <div style={{ position: "absolute", left: lx, width: 220, top: labelY, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 42 }}>
                <span style={{ position: "absolute", left: 0, right: 0, opacity: b.g1 * (1 - b.t3) }}>{fmtScore(b.s)}</span>
                <span style={{ position: "absolute", left: 0, right: 0, opacity: b.t3 * (1 - b.t6) }}>{EX[b.i].toFixed(2)}</span>
                <span style={{ position: "absolute", left: 0, right: 0, opacity: b.t6 }}>{(P[b.i] * 100).toFixed(1)}%</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: lx,
                  width: 220,
                  top: labelY - 46,
                  textAlign: "center",
                  fontSize: 34,
                  color: "var(--ink-3)",
                  opacity: b.t3 * (1 - b.t6) * (1 - beat(frame, S.s5, 3.2, 0.3)),
                }}
              >
                e<sup>{SUP[b.i]}</sup>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: lx,
                  width: 220,
                  top: labelY - 50,
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 34,
                  color: "var(--pen)",
                  opacity: beat(frame, S.s5, 3.4 + b.i * 0.15, 0.4) * eqOn,
                }}
              >
                ÷ {SUM.toFixed(2)}
              </div>
              <Chip
                text={b.w}
                color={b.c}
                fs={50}
                x={XC[b.i] - chipWidth(b.w, 50) / 2}
                y={CHIP_Y}
                style={{ opacity: beat(frame, S.s1, 0.3 + b.i * 0.15, 0.5) }}
              />
            </div>
          );
        })}

        {/* s2: what's wrong with raw scores */}
        <PenCircle x={760} y={BASE - 20} w={190} h={110} p={beat(frame, S.s2, 0.3, 0.7) * s2Out} />
        <Hand x={700} y={BASE - 100} fs={46} style={{ opacity: beat(frame, S.s2, 1.0, 0.4) * s2Out }}>
          {L.neg}
        </Hand>
        <div style={{ position: "absolute", left: 120, top: 140, fontSize: 58, fontWeight: 500, opacity: beat(frame, S.s2, 2.2, 0.5) * s2Out }}>
          {L.sum}
        </div>
        <Hand x={640} y={136} fs={70} style={{ opacity: beat(frame, S.s2, 3.0, 0.4) * s2Out }}>
          {L.notOne}
        </Hand>

        {/* s3: y = e^x */}
        <div style={{ position: "absolute", left: 600, top: 70, width: 400, height: 300, opacity: graphIn }}>
          <svg width={400} height={300} style={{ overflow: "visible" }}>
            <line x1={GX(-2)} y1={GY(0)} x2={GX(3.2)} y2={GY(0)} stroke="var(--ink-3)" strokeWidth={3} />
            <line x1={GX(0)} y1={GY(0) + 10} x2={GX(0)} y2={GY(22)} stroke="var(--ink-3)" strokeWidth={3} />
            <path
              d={CURVE}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - beat(frame, S.s3, 0.5, 1.0)}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={6}
              strokeLinecap="round"
            />
          </svg>
          <div style={{ position: "absolute", left: -10, top: 20, fontSize: 40, fontWeight: 500 }}>
            y = e<sup>x</sup>
          </div>
          <Hand x={40} y={262} fs={46} style={{ opacity: beat(frame, S.s3, 1.2, 0.4) }}>
            {L.e}
          </Hand>
          <Hand x={40} y={316} fs={36} color="var(--ink-3)" style={{ opacity: beat(frame, S.s3, 4.0, 0.5) }}>
            {L.eLater}
          </Hand>
        </div>

        {/* s4: big gets bigger */}
        <div style={{ opacity: ratioOn }}>
          <div style={{ position: "absolute", left: 470, top: 110, fontSize: 40, opacity: beat(frame, S.s4, 0.4, 0.5) }}>{L.ratioA}</div>
          <div style={{ position: "absolute", left: 470, top: 180, fontSize: 40, fontWeight: 500, opacity: beat(frame, S.s4, 1.8, 0.5) }}>
            e<sup>x</sup>
            {L.ratioB} <InlineUnderline p={beat(frame, S.s4, 2.6, 0.6)}>{L.ratioB2}</InlineUnderline>
          </div>
          <Hand x={620} y={270} fs={54} style={{ opacity: beat(frame, S.s4, 3.5, 0.5), rotate: "-2deg" }}>
            {L.bigger}
          </Hand>
        </div>

        {/* s5: add them all up */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 130,
            display: "flex",
            justifyContent: "center",
            gap: 14,
            fontFamily: "var(--font-mono)",
            fontSize: 42,
            opacity: eqOn,
          }}
        >
          {EX.map((e, i) => (
            <span key={i} style={{ display: "flex", gap: 14, opacity: beat(frame, S.s5, 0.4 + i * 0.35, 0.4) }}>
              {i > 0 && <span style={{ color: "var(--ink-3)" }}>+</span>}
              <span style={{ background: `var(--hl-${SCORES[i].c})`, color: "var(--chip-ink)", borderRadius: 8, padding: "0 6px" }}>{e.toFixed(2)}</span>
            </span>
          ))}
          <span style={{ opacity: beat(frame, S.s5, 1.9, 0.5) }}>
            = <InlineCircle p={beat(frame, S.s5, 2.4, 0.6)}>{SUM.toFixed(2)}</InlineCircle>
          </span>
        </div>

        {/* s6: 100% */}
        {stack.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.left,
              top: 150,
              width: s.w,
              height: 70,
              background: `var(--hl-${s.c})`,
              borderRadius: i === 0 ? "12px 0 0 12px" : i === stack.length - 1 ? "0 12px 12px 0" : 0,
            }}
          />
        ))}
        <Hand x={790} y={250} fs={52} style={{ opacity: beat(frame, S.s6, 4.0, 0.4) }}>
          <InlineCircle p={beat(frame, S.s6, 4.3, 0.6)}>{L.total}</InlineCircle>
        </Hand>
      </div>

      {/* s7: the formula */}
      {frame >= S.s7.from && (
        <div style={{ position: "absolute", inset: 0, opacity: beat(frame, S.s7, 0.4, 0.6) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontSize: 72, fontWeight: 700 }}>{L.fTitle}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", justifyContent: "center", alignItems: "center", gap: 28, fontSize: 52, fontWeight: 500 }}>
            <span>{L.fLeft} =</span>
            <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ padding: "0 16px 10px" }}>
                e<sup style={{ fontSize: 34 }}>{L.fMine}</sup>
              </span>
              <span style={{ alignSelf: "stretch", height: 5, background: "var(--ink)", borderRadius: 3 }} />
              <span style={{ padding: "10px 16px 0" }}>
                {L.fAll} e<sup style={{ fontSize: 34 }}>{L.axis}</sup>
                {L.fSum}
              </span>
            </span>
          </div>
          <Hand x={150} y={720} fs={46} color="var(--ink)" style={{ opacity: beat(frame, S.s7, 1.6, 0.5) }}>
            {L.step1}
          </Hand>
          <Hand x={150} y={800} fs={46} color="var(--ink)" style={{ opacity: beat(frame, S.s7, 2.6, 0.5) }}>
            {L.step2}
          </Hand>
          <Hand x={480} y={930} fs={50} style={{ opacity: beat(frame, S.s7, 4.4, 0.5), rotate: "-3deg" }}>
            {L.seeYou}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch14.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
