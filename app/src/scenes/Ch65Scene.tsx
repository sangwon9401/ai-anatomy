import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { LADDER, NEXT, QUESTIONS65, ch65, meanSurprise, surprise } from "../data/ch65";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "./kit";
import { Box, Center, Meter, T } from "./part7-kit";

const tl = buildTimeline(ch65);
const S = byId(tl);
const L = ch65.labels;

// s1 bars
const XC = [225, 435, 645, 855];
const BW = 130;
const BASE = 840;
const SCALE = 900;
const CTX = ["나는", "오늘", "학교에"];
const CTX_W = [...CTX.map((w) => chipWidth(w, 48)), 110];
const CTX_X = rowLayout(CTX_W, 14);

// s2 weather
const RAIN = [
  { cx: 290, chip: L.rain90, p: 0.9, word: L.little },
  { cx: 790, chip: L.rain10, p: 0.1, word: L.big },
];

// s3–s4 ladder
const LY = [250, 400, 550, 700];
const LBAR_X = 250;
const LBAR_W = 460;

// s5 graph
const OX = 170;
const OY = 880;
const PX = (p: number) => OX + p * 780;
const SY = (s: number) => OY - s * 120;
const CURVE = Array.from({ length: 80 }, (_, i) => 0.035 + ((1 - 0.035) * i) / 79)
  .map((p, i) => `${i === 0 ? "M" : "L"} ${PX(p).toFixed(1)} ${SY(surprise(p)).toFixed(1)}`)
  .join(" ");
const XTICKS = [
  { p: 0, t: "0" },
  { p: 1 / 8, t: "1/8" },
  { p: 1 / 4, t: "1/4" },
  { p: 1 / 2, t: "1/2" },
  { p: 1, t: "1" },
];

// s6 meters
const METERS = [
  { cx: 290, chip: L.go52, p: 0.52, c: "yellow" as const },
  { cx: 790, chip: L.go12, p: 0.12, c: "pink" as const },
];

const MEAN = meanSurprise(QUESTIONS65.map((q) => q.p));
const pct = (p: number) => `${Math.round(p * 100)}%`;

export const Ch65Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0, 0.3) * (1 - beat(frame, S.s2, 0, 0.4));
  const s2On = beat(frame, S.s2, 0.2, 0.4) * (1 - beat(frame, S.s3, 0, 0.4));
  const ladderOn = beat(frame, S.s3, 0.2, 0.4) * (1 - beat(frame, S.s5, 0, 0.4));
  const graphOn = beat(frame, S.s5, 0.2, 0.4) * (1 - beat(frame, S.s6, 0, 0.4));
  const metersOn = beat(frame, S.s6, 0.2, 0.4) * (1 - beat(frame, S.s7, 0, 0.4));

  const ladderT = [
    { st: S.s3, t: 2.2 },
    { st: S.s3, t: 5.2 },
    { st: S.s4, t: 0.4 },
    { st: S.s4, t: 1.8 },
  ];

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the model bet 52% on 간다 */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          {CTX.map((w, i) => (
            <Chip key={w} text={w} color={null} fs={48} x={CTX_X[i]} y={140} style={{ opacity: beat(frame, S.s1, 0.2 + i * 0.15, 0.3) }} />
          ))}
          <Box x={CTX_X[3]} y={140} w={110} h={72} r={12} dashed border="var(--pen)" fill="transparent" o={beat(frame, S.s1, 0.7, 0.3)}>
            <span style={{ fontSize: 46, fontWeight: 700, color: "var(--pen)" }}>?</span>
          </Box>
          <div style={{ position: "absolute", left: 100, top: BASE - 2, width: 880, height: 5, background: "var(--ink)" }} />
          {NEXT.map((n, i) => {
            const g = beat(frame, S.s1, 1.0 + i * 0.15, 0.8);
            const h = n.p * SCALE * g;
            return (
              <div key={n.w}>
                <div style={{ position: "absolute", left: XC[i] - BW / 2, top: BASE - h, width: BW, height: h, background: `var(--hl-${n.c})`, borderRadius: "14px 14px 3px 3px" }} />
                <T x={XC[i] - 100} y={BASE - h - 58} w={200} fs={42} mono align="center" o={g}>
                  {pct(n.p)}
                </T>
                <T x={XC[i] - 100} y={BASE + 16} w={200} fs={44} bold align="center">
                  {n.w}
                </T>
              </div>
            );
          })}
          <Chip text={L.example} color={null} fs={32} x={1024 - chipWidth(L.example, 32)} y={250} style={{ opacity: beat(frame, S.s1, 1.6, 0.4) }} />
          <PenCircle x={XC[0] - 95} y={BASE + 2} w={190} h={92} p={beat(frame, S.s1, 3.4, 0.6)} />
          <Hand x={XC[0] - 70} y={BASE + 110} fs={46} style={{ opacity: beat(frame, S.s1, 3.8, 0.4) }}>
            {L.answer}
          </Hand>
          <Hand x={560} y={420} fs={56} style={{ opacity: beat(frame, S.s1, 5.6, 0.5), rotate: "-3deg" }}>
            {L.howWrong}
          </Hand>
        </div>
      )}

      {/* s2: expected vs unexpected rain */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          {RAIN.map((r, i) => {
            const t0 = 0.6 + i * 3.2;
            const needle = beat(frame, S.s2, t0 + 1.4, 1.0, EASE_IO);
            return (
              <div key={r.chip} style={{ opacity: beat(frame, S.s2, t0, 0.4) }}>
                <Chip text={r.chip} color="sky" fs={40} x={r.cx - chipWidth(r.chip, 40) / 2} y={220} />
                <Hand x={r.cx - 200} y={320} fs={52} style={{ width: 400, textAlign: "center", opacity: beat(frame, S.s2, t0 + 0.8, 0.4) }}>
                  {L.rained}
                </Hand>
                <Meter cx={r.cx} cy={720} r={200} v={surprise(r.p) * needle} max={4} showTicks={false} />
                <T x={r.cx - 200} y={770} w={400} fs={50} bold align="center" o={beat(frame, S.s2, t0 + 2.2, 0.4)}>
                  {r.word}
                </T>
              </div>
            );
          })}
        </div>
      )}

      {/* s3–s4: every halving adds one */}
      {frame >= S.s3.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: ladderOn }}>
          <T x={70} y={170} fs={36} bold color="var(--ink-2)">
            {L.prob}
          </T>
          <T x={780} y={170} w={160} fs={36} bold align="center" color="var(--ink-2)">
            {L.surprise}
          </T>
          {LADDER.map((r, k) => {
            const { st, t } = ladderT[k];
            const o = beat(frame, st, t, 0.4);
            const shrink = beat(frame, st, t + 0.3, 0.7, EASE_IO);
            const prevW = k === 0 ? 1 : LADDER[k - 1].p;
            const w = mix(prevW, r.p, shrink) * LBAR_W;
            const val = beat(frame, st, t + 1.0, 0.4);
            return (
              <div key={r.label} style={{ opacity: o }}>
                <T x={70} y={LY[k] + 2} w={160} fs={52} mono>
                  {r.label}
                </T>
                <div style={{ position: "absolute", left: LBAR_X, top: LY[k], width: LBAR_W, height: 64, boxSizing: "border-box", border: "3px dashed var(--ink-3)", borderRadius: 12 }} />
                <div style={{ position: "absolute", left: LBAR_X, top: LY[k], width: w, height: 64, background: "var(--hl-sky)", borderRadius: 12 }} />
                <T x={780} y={LY[k] - 4} w={160} fs={64} mono bold align="center" o={val}>
                  {surprise(r.p).toFixed(0)}
                </T>
                {k > 0 && (
                  <>
                    <Hand x={LBAR_X + LBAR_W + 14} y={LY[k] - 80} fs={50} color="var(--ink-2)" style={{ opacity: o }}>
                      ÷ 2
                    </Hand>
                    <Hand x={940} y={LY[k] - 80} fs={52} style={{ opacity: val }}>
                      +1
                    </Hand>
                  </>
                )}
              </div>
            );
          })}
          <Hand x={0} y={850} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 7.0, 0.5) }}>
            <InlineCircle p={beat(frame, S.s3, 7.4, 0.6)}>{L.halve}</InlineCircle>
          </Hand>
          <Center y={960} fs={46} o={beat(frame, S.s4, 4.4, 0.5)}>
            {L.times}
          </Center>
        </div>
      )}

      {/* s5: the curve */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: graphOn }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={OX} y1={OY} x2={PX(1.06)} y2={OY} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={OX} y1={OY} x2={OX} y2={SY(5.4)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {XTICKS.map((t) => (
              <line key={t.t} x1={PX(t.p)} y1={OY - 8} x2={PX(t.p)} y2={OY + 8} stroke="var(--ink)" strokeWidth={3} />
            ))}
            {[1, 2, 3, 4, 5].map((s) => (
              <line key={s} x1={OX - 8} y1={SY(s)} x2={OX + 8} y2={SY(s)} stroke="var(--ink)" strokeWidth={3} />
            ))}
            <path d={CURVE} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s5, 1.6, 1.6, EASE_IO)} fill="none" stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" />
          </svg>
          {XTICKS.map((t) => (
            <T key={t.t} x={PX(t.p) - 40} y={OY + 16} w={80} fs={30} mono align="center" color="var(--ink-2)">
              {t.t}
            </T>
          ))}
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <T key={s} x={OX - 70} y={SY(s) - 20} w={50} fs={30} mono align="right" color="var(--ink-2)">
              {s}
            </T>
          ))}
          <T x={PX(1) - 320} y={OY + 62} w={340} fs={34} bold align="right">
            {L.axisP}
          </T>
          <T x={OX - 24} y={SY(5.4) - 60} fs={34} bold>
            {L.axisS}
          </T>
          {LADDER.map((r, k) => {
            const o = beat(frame, S.s5, 0.4 + k * 0.25, 0.3);
            const x = PX(r.p);
            const y = SY(surprise(r.p));
            return (
              <div key={r.label} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: "50%", background: "var(--hl-sky)", border: "4px solid var(--ink)", boxSizing: "border-box" }} />
              </div>
            );
          })}
          <Hand x={250} y={290} fs={46} style={{ opacity: beat(frame, S.s5, 3.4, 0.4) }}>
            {L.soar}
          </Hand>
          <Chip text={L.formula} color="yellow" fs={44} x={470} y={430} style={{ opacity: beat(frame, S.s5, 5.6, 0.4) }} />
          <Hand x={490} y={520} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s5, 7.0, 0.4) }}>
            {L.log}
          </Hand>
        </div>
      )}

      {/* s6: 52% vs 12% */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: metersOn }}>
          {METERS.map((m, i) => {
            const t0 = 0.4 + i * 3.0;
            const needle = beat(frame, S.s6, t0 + 0.8, 1.0, EASE_IO);
            return (
              <div key={m.chip} style={{ opacity: beat(frame, S.s6, t0, 0.4) }}>
                <Chip text={m.chip} color={m.c} fs={46} x={m.cx - chipWidth(m.chip, 46) / 2} y={230} />
                <Meter cx={m.cx} cy={620} r={160} v={surprise(m.p) * needle} max={4} />
                <T x={m.cx - 150} y={660} w={300} fs={30} align="center" color="var(--ink-2)" o={needle}>
                  {L.surprise}
                </T>
                <T x={m.cx - 150} y={700} w={300} fs={64} mono bold align="center" o={beat(frame, S.s6, t0 + 1.6, 0.4)}>
                  {surprise(m.p).toFixed(2)}
                </T>
              </div>
            );
          })}
          <Hand x={0} y={880} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 7.0, 0.5), rotate: "-2deg" }}>
            {L.lessSurprise}
          </Hand>
        </div>
      )}

      {/* s7: the average is the loss */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.2, 0.4) }}>
          <T x={70} y={150} fs={34} bold color="var(--ink-2)">
            {L.colQ}
          </T>
          <T x={620} y={150} w={190} fs={34} bold align="center" color="var(--ink-2)">
            {L.colP}
          </T>
          <T x={830} y={150} w={170} fs={34} bold align="center" color="var(--ink-2)">
            {L.colS}
          </T>
          {QUESTIONS65.map((q, k) => {
            const y = 220 + k * 100;
            const o = beat(frame, S.s7, 0.5 + k * 0.4, 0.3);
            return (
              <div key={q.ctx} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: 70, top: y, display: "flex", alignItems: "center", gap: 12, fontSize: 38, fontWeight: 500, whiteSpace: "nowrap" }}>
                  <span>{q.ctx}</span>
                  <span style={{ color: "var(--ink-3)" }}>→</span>
                  <span style={{ background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 10, padding: "0 14px" }}>{q.ans}</span>
                </div>
                <T x={620} y={y} w={190} fs={42} mono align="center">
                  {pct(q.p)}
                </T>
                <T x={830} y={y} w={170} fs={42} mono bold align="center">
                  {surprise(q.p).toFixed(2)}
                </T>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 600, top: 625, width: 420, height: 4, background: "var(--ink)", opacity: beat(frame, S.s7, 2.2, 0.3) }} />
          <Chip text={L.example} color={null} fs={30} x={70} y={650} style={{ opacity: beat(frame, S.s7, 2.2, 0.3) }} />
          <T x={620} y={648} w={190} fs={42} bold align="center" o={beat(frame, S.s7, 2.4, 0.4)}>
            {L.mean}
          </T>
          <T x={830} y={640} w={170} fs={56} mono bold align="center" o={beat(frame, S.s7, 2.6, 0.4)}>
            <InlineCircle p={beat(frame, S.s7, 3.0, 0.6)} pad={10}>
              {MEAN.toFixed(2)}
            </InlineCircle>
          </T>
          <div style={{ position: "absolute", left: 0, right: 0, top: 770, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: beat(frame, S.s7, 3.8, 0.4) }}>
            <span style={{ fontSize: 50, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 12, padding: "2px 20px" }}>{L.ce}</span>
            <span style={{ fontSize: 42, fontWeight: 500 }}>{L.loss}</span>
          </div>
          <Hand x={0} y={880} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.2, 0.5), rotate: "-2deg" }}>
            {L.learn}
          </Hand>
          <Center y={985} fs={32} bold={false} color="var(--ink-2)" o={beat(frame, S.s7, 8.0, 0.5)}>
            {L.base}
          </Center>
        </div>
      )}

      <Narration tl={tl} chapter={ch65.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
