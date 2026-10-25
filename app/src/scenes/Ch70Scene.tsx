import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { DROP_PER_10X, GPT3_N, SIZES70, TOKENS_PER_PARAM, ch70, koN, lossOf } from "../data/ch70";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Box, Center, Knob, Layer, T } from "./part7-kit";

const tl = buildTimeline(ch70);
const S = byId(tl);
const L = ch70.labels;

// main plot
const OX = 150;
const OY = 900;
const XEND = 970;
const XLIN = (n: number) => 170 + (n / 2e11) * 780;
const XLOG = (n: number) => 200 + (Math.log10(n) - 7) * 150;
const Y = (l: number) => OY - (l - 2) * 170;
const SAMPLES = Array.from({ length: 60 }, (_, i) => 10 ** (7 + (i / 59) * (Math.log10(2e11) - 7)));
const LIN_TICKS = [
  { n: 0, t: "0" },
  { n: 1e11, t: "1,000억" },
  { n: 2e11, t: "2,000억" },
];
const Y_TICKS = [2, 3, 4, 5];

// s1 model squares
const SQ = [30, 46, 70, 106, 160];
const SQ_X = [120, 260, 420, 600, 810];

// s3 rulers
const RULER_X = [180, 360, 540, 720, 900];
const RULER_B = ["1", "10", "100", "1,000", "10,000"];

// s6 mini plots
const MINI = [L.axisX, L.data, L.compute];

export const Ch70Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0, 0.4) * (1 - beat(frame, S.s2, 0, 0.4));
  const morph = beat(frame, S.s4, 0.4, 1.6, EASE_IO);
  let dimF = 1;
  if (frame >= S.s3.from && frame < S.s4.from) dimF = mix(1, 0.1, beat(frame, S.s3, 0, 0.5));
  else if (frame >= S.s4.from) dimF = mix(0.1, 1, beat(frame, S.s4, 0, 0.4));
  let plotO = 0;
  if (frame >= S.s2.from && frame < S.s6.from + 12) plotO = beat(frame, S.s2, 0.2, 0.5) * dimF * (1 - beat(frame, S.s6, 0, 0.4));
  if (frame >= S.s7.from) plotO = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.4));
  const showLog = frame >= S.s4.from ? morph : 0;
  const X = (n: number) => mix(XLIN(n), XLOG(n), showLog);
  const curve = SAMPLES.map((n, i) => `${i === 0 ? "M" : "L"} ${X(n).toFixed(1)} ${Y(lossOf(n)).toFixed(1)}`).join(" ");
  const rulersOn = beat(frame, S.s3, 0.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.4));
  const miniOn = beat(frame, S.s6, 0.3, 0.4) * (1 - beat(frame, S.s7, 0, 0.4));
  const chinOn = beat(frame, S.s8, 0.3, 0.5);
  const inS7 = frame >= S.s7.from;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: models of different sizes */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Chip text={L.study} color="yellow" fs={44} x={540 - chipWidth(L.study, 44) / 2} y={220} style={{ opacity: beat(frame, S.s1, 0.4, 0.4) }} />
          <Center y={330} fs={40} bold={false} o={beat(frame, S.s1, 1.0, 0.4)}>
            {L.sizes}
          </Center>
          {SIZES70.map((n, i) => (
            <div key={n} style={{ opacity: beat(frame, S.s1, 1.6 + i * 0.4, 0.4) }}>
              <Box x={SQ_X[i] + 80 - SQ[i] / 2} y={680 - SQ[i]} w={SQ[i]} h={SQ[i]} r={10} fill="var(--hl-sky)" />
              <T x={SQ_X[i]} y={700} w={160} fs={36} bold align="center">
                {koN(n)}
              </T>
            </div>
          ))}
          <Hand x={0} y={850} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.4, 0.5), rotate: "-2deg" }}>
            {L.q}
          </Hand>
        </div>
      )}

      {/* main plot */}
      {plotO > 0 && (
        <div style={{ opacity: plotO }}>
          <Layer>
            <line x1={OX} y1={OY} x2={XEND} y2={OY} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={OX} y1={OY} x2={OX} y2={Y(5.6)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {Y_TICKS.map((v) => (
              <line key={v} x1={OX - 8} y1={Y(v)} x2={OX + 8} y2={Y(v)} stroke="var(--ink)" strokeWidth={3} />
            ))}
            {LIN_TICKS.map((t) => (
              <line key={t.t} x1={XLIN(t.n)} y1={OY - 8} x2={XLIN(t.n)} y2={OY + 8} stroke="var(--ink)" strokeWidth={3} opacity={1 - showLog} />
            ))}
            {SIZES70.map((n) => (
              <line key={n} x1={XLOG(n)} y1={OY - 8} x2={XLOG(n)} y2={OY + 8} stroke="var(--ink)" strokeWidth={3} opacity={showLog} />
            ))}
            <path d={curve} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s2, 1.0, 1.2)} fill="none" stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" />
            {inS7 && (
              <>
                <line x1={XLOG(2e11)} y1={Y(lossOf(2e11))} x2={XLOG(2e11) + (XLOG(1e12) - XLOG(2e11)) * beat(frame, S.s7, 1.0, 1.2)} y2={mix(Y(lossOf(2e11)), Y(lossOf(1e12)), beat(frame, S.s7, 1.0, 1.2))} stroke="var(--pen)" strokeWidth={5} strokeDasharray="14 12" />
              </>
            )}
          </Layer>
          {Y_TICKS.map((v) => (
            <T key={v} x={OX - 70} y={Y(v) - 20} w={50} fs={30} mono align="right" color="var(--ink-2)">
              {v}
            </T>
          ))}
          {LIN_TICKS.map((t) => (
            <T key={t.t} x={XLIN(t.n) - 80} y={OY + 16} w={160} fs={30} align="center" color="var(--ink-2)" o={1 - showLog}>
              {t.t}
            </T>
          ))}
          {SIZES70.map((n) => (
            <T key={n} x={XLOG(n) - 80} y={OY + 16} w={160} fs={30} align="center" color="var(--ink-2)" o={showLog}>
              {koN(n)}
            </T>
          ))}
          <T x={XEND - 300} y={OY + 60} w={300} fs={34} bold align="right">
            {L.axisXArrow}
          </T>
          <T x={OX - 24} y={Y(5.6) - 56} fs={34} bold>
            {L.axisY}
          </T>
          <Chip text={L.example} color={null} fs={30} x={1024 - chipWidth(L.example, 30)} y={Y(5.6) - 56} />
          {SIZES70.map((n, i) => (
            <div key={n} style={{ position: "absolute", left: X(n) - 15, top: Y(lossOf(n)) - 15, width: 30, height: 30, borderRadius: "50%", background: "var(--hl-sky)", border: "4px solid var(--ink)", boxSizing: "border-box", opacity: beat(frame, S.s2, 0.6 + i * 0.15, 0.3) }} />
          ))}

          {/* s2 notes */}
          <div style={{ opacity: 1 - beat(frame, S.s3, 0, 0.3) }}>
            <Hand x={230} y={440} fs={46} style={{ opacity: beat(frame, S.s2, 2.6, 0.4) }}>
              {L.crowd}
            </Hand>
            <Hand x={620} y={Y(3) - 110} fs={46} style={{ opacity: beat(frame, S.s2, 5.0, 0.4) }}>
              {L.flatQ}
            </Hand>
          </div>

          {/* s4: equal steps */}
          {frame >= S.s4.from && frame < S.s6.from + 12 && (
            <div style={{ opacity: 1 - beat(frame, S.s6, 0, 0.3) }}>
              {SIZES70.slice(0, -1).map((n, i) => (
                <Hand key={n} x={XLOG(n) + 90} y={Y(lossOf(n)) - 20} fs={40} style={{ opacity: beat(frame, S.s4, 3.6 + i * 0.4, 0.3) }}>
                  −{DROP_PER_10X}
                </Hand>
              ))}
              <Hand x={560} y={430} fs={60} style={{ opacity: beat(frame, S.s4, 2.4, 0.4), rotate: "-3deg" }}>
                {L.line}
              </Hand>
            </div>
          )}

          {/* s5: the name */}
          {frame >= S.s5.from && frame < S.s6.from + 12 && (
            <div style={{ opacity: beat(frame, S.s5, 0.3, 0.4) * (1 - beat(frame, S.s6, 0, 0.3)) }}>
              <Chip text={L.logName} color="yellow" fs={44} x={540 - chipWidth(L.logName, 44) / 2} y={150} />
              <T x={56} y={1025} w={968} fs={32} align="center" o={beat(frame, S.s5, 3.6, 0.4)}>
                {L.link65} → {L.link70}
              </T>
            </div>
          )}

          {/* s7: predicting bigger models */}
          {inS7 && (
            <>
              <div style={{ position: "absolute", left: XLOG(GPT3_N) - 22, top: Y(lossOf(GPT3_N)) - 22, width: 44, height: 44, borderRadius: "50%", background: "var(--hl-yellow)", border: "5px solid var(--pen)", boxSizing: "border-box", opacity: beat(frame, S.s7, 2.4, 0.4) }} />
              <T x={XLOG(GPT3_N) - 60} y={Y(lossOf(GPT3_N)) - 80} w={120} fs={36} bold align="center" o={beat(frame, S.s7, 2.6, 0.4)}>
                {L.gpt3}
              </T>
              <Hand x={590} y={800} fs={52} style={{ opacity: beat(frame, S.s7, 3.6, 0.4) }}>
                {L.predict}
              </Hand>
            </>
          )}
        </div>
      )}

      {/* s3: two rulers */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: rulersOn }}>
          {[
            { y: 400, title: L.rulerA, vals: ["0", "1", "2", "3", "4"], step: L.plus1, c: "var(--ink-2)", t0: 0.6 },
            { y: 740, title: L.rulerB, vals: RULER_B, step: L.times10, c: "var(--pen)", t0: 2.6 },
          ].map((r) => (
            <div key={r.title} style={{ opacity: beat(frame, S.s3, r.t0, 0.4) }}>
              <T x={140} y={r.y - 190} fs={42} bold>
                {r.title}
              </T>
              <Layer>
                <line x1={140} y1={r.y} x2={940} y2={r.y} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
                {RULER_X.map((x) => (
                  <line key={x} x1={x} y1={r.y - 16} x2={x} y2={r.y + 16} stroke="var(--ink)" strokeWidth={4} />
                ))}
                {RULER_X.slice(0, -1).map((x, i) => (
                  <path key={i} d={`M ${x + 8} ${r.y - 24} Q ${x + 90} ${r.y - 70} ${x + 172} ${r.y - 24}`} fill="none" stroke={r.c} strokeWidth={4} opacity={beat(frame, S.s3, r.t0 + 0.6 + i * 0.25, 0.3)} />
                ))}
              </Layer>
              {RULER_X.slice(0, -1).map((x, i) => (
                <Hand key={i} x={x + 62} y={r.y - 118} fs={40} color={r.c} style={{ opacity: beat(frame, S.s3, r.t0 + 0.6 + i * 0.25, 0.3) }}>
                  {r.step}
                </Hand>
              ))}
              {RULER_X.map((x, i) => (
                <T key={x} x={x - 80} y={r.y + 26} w={160} fs={40} mono align="center">
                  {r.vals[i]}
                </T>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* s6: the same straight line three times */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: miniOn }}>
          {MINI.map((name, k) => {
            const x0 = 80 + k * 320;
            const o = beat(frame, S.s6, 0.4 + k * 0.8, 0.4);
            return (
              <div key={name} style={{ opacity: o }}>
                <T x={x0} y={270} w={280} fs={40} bold align="center">
                  {name}
                </T>
                <Layer>
                  <line x1={x0 + 20} y1={620} x2={x0 + 270} y2={620} stroke="var(--ink)" strokeWidth={4} />
                  <line x1={x0 + 20} y1={620} x2={x0 + 20} y2={350} stroke="var(--ink)" strokeWidth={4} />
                  <line x1={x0 + 50} y1={390} x2={mix(x0 + 50, x0 + 250, beat(frame, S.s6, 0.8 + k * 0.8, 0.6))} y2={mix(390, 580, beat(frame, S.s6, 0.8 + k * 0.8, 0.6))} stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" />
                  {[0, 1, 2, 3].map((i) => (
                    <circle key={i} cx={x0 + 50 + i * 66.7} cy={390 + i * 63.3} r={11} fill="var(--hl-sky)" stroke="var(--ink)" strokeWidth={3} />
                  ))}
                </Layer>
                <T x={x0} y={634} w={280} fs={28} align="center" color="var(--ink-2)">
                  {L.times10} →
                </T>
              </div>
            );
          })}
          <Chip text={L.law} color="yellow" fs={58} x={540 - chipWidth(L.law, 58) / 2} y={760} style={{ opacity: beat(frame, S.s6, 4.8, 0.4) }} />
          <Center y={870} fs={38} bold={false} color="var(--ink-2)" o={beat(frame, S.s6, 5.4, 0.4)}>
            {L.study}
          </Center>
        </div>
      )}

      {/* s8: Chinchilla */}
      {frame >= S.s8.from && (
        <div style={{ opacity: chinOn }}>
          <Chip text={L.chinchilla} color="mint" fs={46} x={540 - chipWidth(L.chinchilla, 46) / 2} y={190} />
          <Knob x={330} y={450} r={70} angle={30} o={beat(frame, S.s8, 0.8, 0.4)} />
          <T x={430} y={410} w={80} fs={64} bold align="center" o={beat(frame, S.s8, 1.2, 0.4)}>
            =
          </T>
          {Array.from({ length: TOKENS_PER_PARAM }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 540 + (i % 5) * 70, top: 330 + Math.floor(i / 5) * 62, width: 56, height: 46, borderRadius: 8, background: `var(--hl-${(["yellow", "sky", "pink", "orange", "violet"] as const)[i % 5]})`, opacity: beat(frame, S.s8, 1.4 + i * 0.08, 0.2) }} />
          ))}
          <Center y={620} fs={46} o={beat(frame, S.s8, 3.4, 0.4)}>
            {L.perParam}
          </Center>
          <Center y={710} fs={40} bold={false} o={beat(frame, S.s8, 5.0, 0.4)}>
            {L.exampleCalc}
          </Center>
          <Hand x={0} y={830} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 7.0, 0.4), rotate: "-2deg" }}>
            {L.together}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch70.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
