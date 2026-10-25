import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { FAST, FAST_CHECK, PROBLEM, THINK, ch87 } from "../data/ch87";
import { Caption, Chip, EASE_IO, Hand, InlineUnderline, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Arrow, Box, Bubble, CurveArrow, FullSvg, Line, PenCheck, PenCross } from "./part10-kit";

const tl = buildTimeline(ch87);
const S = byId(tl);
const L = ch87.labels;

const ProblemCard: FC<{ o: number }> = ({ o }) => (
  <div style={{ position: "absolute", left: 60, top: 110, width: 960, height: 232, borderRadius: 22, background: "var(--paper)", border: "4px solid var(--ink)", opacity: o, boxSizing: "border-box" }}>
    <Chip text={L.problem} color="orange" fs={32} x={28} y={-26} />
    <div style={{ position: "absolute", left: 40, top: 34, fontSize: 44, fontWeight: 500, lineHeight: 1.45 }}>
      {PROBLEM.map((l, i) => (
        <div key={i} style={{ fontWeight: i === 2 ? 700 : 500 }}>
          {l}
        </div>
      ))}
    </div>
  </div>
);

// s6 chain-of-thought row: question, three steps, answer
const ROW_B = [
  { x: 60, w: 160, label: L.qBox },
  { x: 268, w: 150, label: L.stepBox },
  { x: 466, w: 150, label: L.stepBox },
  { x: 664, w: 150, label: L.stepBox },
  { x: 862, w: 158, label: L.aBox },
];
const Link: FC<{ cx: number; cy: number; o: number }> = ({ cx, cy, o }) => (
  <FullSvg opacity={o}>
    <ellipse cx={cx - 9} cy={cy} rx={17} ry={11} fill="none" stroke="var(--ink)" strokeWidth={5} />
    <ellipse cx={cx + 9} cy={cy} rx={17} ry={11} fill="none" stroke="var(--ink)" strokeWidth={5} />
  </FullSvg>
);
const SCRIBBLE = [300, 360, 250, 330, 210, 290];
const PIECES = 24;

export const Ch87Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const cardO = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const s1On = 1 - beat(frame, S.s2, 0, 0.4);
  const fastOn = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const barsOn = 1 - beat(frame, S.s3, 0, 0.4);
  const outMove = beat(frame, S.s3, 0.2, 0.8, EASE_IO);
  const thinkOn = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const lineT = [S.s4.from + 1.4 * 30, S.s4.from + 3.4 * 30, S.s4.from + 5.4 * 30, S.s5.from + 0.6 * 30, S.s5.from + 2.8 * 30];
  const s6On = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.4));
  const s7On = beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.4));
  const outW = chipWidth(L.out, 52);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s6.from + 15 && <ProblemCard o={cardO} />}

      {/* s1: the tempting answer */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Hand x={80} y={470} fs={50} color="var(--ink-2)" style={{ opacity: beat(frame, S.s1, 2.4, 0.4) }}>
            {L.first}
          </Hand>
          <Hand x={360} y={600} fs={150} style={{ opacity: beat(frame, S.s1, 3.4, 0.3), rotate: "-6deg", scale: String(mix(1.3, 1, beat(frame, S.s1, 3.4, 0.3))) }}>
            {L.guess}
          </Hand>
        </div>
      )}

      {/* s2–s3: answering at once */}
      {frame >= S.s2.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: fastOn }}>
          <Arrow x1={400} y1={350} x2={400} y2={462} p={beat(frame, S.s2, 0.5, 0.4)} />
          <Bubble x={620} y={372} w={400} side="user" fs={40} text={L.askFast} o={beat(frame, S.s2, 0.4, 0.4)} />
          <Box x={220} y={472} w={360} h={128} label={L.model} fs={54} />
          <Hand x={600} y={520} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s2, 2.0, 0.4) * barsOn }}>
            {L.firstPiece}
          </Hand>
          <div style={{ opacity: barsOn }}>
            {FAST.map((c, i) => {
              const g = beat(frame, S.s2, 2.4 + i * 0.2, 0.6);
              const y = 650 + i * 76;
              return (
                <div key={c.w} style={{ opacity: g }}>
                  <div style={{ position: "absolute", left: 80, width: 200, top: y, textAlign: "right", fontSize: 42, fontWeight: 700 }}>{c.w}</div>
                  <div style={{ position: "absolute", left: 300, top: y + 8, height: 46, width: c.p * 680 * g, borderRadius: 12, background: `var(--hl-${c.c})` }} />
                  <div style={{ position: "absolute", left: 312 + c.p * 680, top: y + 4, fontFamily: "var(--font-mono)", fontSize: 38 }}>{Math.round(c.p * 100)}%</div>
                </div>
              );
            })}
            <div style={{ position: "absolute", right: 60, top: 1010, fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s2, 3.0, 0.4) }}>{L.example}</div>
            <PenCircle x={140} y={636} w={160} h={80} p={beat(frame, S.s2, 4.4, 0.5)} />
          </div>
          <Chip
            text={L.out}
            color="pink"
            fs={52}
            x={mix(540 - outW / 2, 80, outMove)}
            y={mix(905, 650, outMove)}
            style={{ opacity: beat(frame, S.s2, 5.0, 0.4), scale: String(mix(0.6, 1, beat(frame, S.s2, 5.0, 0.4))) }}
          />

          {/* s3: check it */}
          {frame >= S.s3.from && (
            <div>
              <Chip text={L.check} color={null} fs={34} x={430} y={662} style={{ opacity: beat(frame, S.s3, 0.8, 0.4), background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" }} />
              {FAST_CHECK.map((l, i) => (
                <div key={l} style={{ position: "absolute", left: 80, top: 760 + i * 66, fontSize: 42, fontWeight: i === 2 ? 700 : 500, color: i === 2 ? "var(--pen)" : "var(--ink)", opacity: beat(frame, S.s3, 1.4 + i * 1.0, 0.4) }}>
                  {l}
                </div>
              ))}
              <PenCross x={860} y={830} r={44} p={beat(frame, S.s3, 4.0, 0.5)} />
              <Hand x={800} y={900} fs={48} style={{ opacity: beat(frame, S.s3, 4.2, 0.3) }}>
                {L.wrong}
              </Hand>
              <Hand x={80} y={972} fs={42} style={{ opacity: beat(frame, S.s3, 5.4, 0.4) }}>
                {L.once}
              </Hand>
              <Hand x={80} y={1024} fs={38} color="var(--ink-2)" style={{ opacity: beat(frame, S.s3, 6.2, 0.4) }}>
                {L.onceMore}
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s4–s5: writing the working first */}
      {frame >= S.s4.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: thinkOn }}>
          <Bubble x={560} y={372} w={460} side="user" fs={40} text={L.askSlow} o={beat(frame, S.s4, 0.4, 0.4)} />
          <div style={{ position: "absolute", left: 60, top: 470, width: 960, height: 470, borderRadius: 24, border: "4px dashed var(--ink-3)", background: "var(--paper-2)" }} />
          <Chip text={L.think} color="violet" fs={34} x={88} y={446} style={{ opacity: beat(frame, S.s4, 0.8, 0.4) }} />
          {THINK.map((l, i) => {
            const a = interpolateIn(frame, lineT[i]);
            return (
              <div key={l} style={{ position: "absolute", left: 100, top: 520 + i * 80, fontSize: 46, fontWeight: 500, opacity: a, translate: `${mix(-20, 0, a)}px 0px` }}>
                {l}
              </div>
            );
          })}
          <PenCheck x={720} y={872} r={30} p={beat(frame, S.s5, 3.6, 0.4)} />
          <CurveArrow d="M 900 850 C 1010 800, 1010 580, 900 540" end={[900, 540]} ang={Math.atan2(-40, -110)} p={beat(frame, S.s5, 4.4, 0.8)} />
          <Hand x={560} y={950} fs={42} style={{ opacity: beat(frame, S.s5, 5.0, 0.4) }}>
            {L.reread}
          </Hand>
          <Chip text={L.answer} color="mint" fs={52} x={100} y={958} style={{ opacity: beat(frame, S.s5, 1.6, 0.4), scale: String(mix(0.6, 1, beat(frame, S.s5, 1.6, 0.4))) }} />
        </div>
      )}

      {/* s6: chain of thought */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          <div style={{ position: "absolute", left: 60, top: 150, fontSize: 40, fontWeight: 700 }}>{L.rowFast}</div>
          <Box x={60} y={212} w={160} h={100} label={L.qBox} fs={38} />
          <Arrow x1={232} y1={262} x2={300} y2={262} p={beat(frame, S.s6, 0.8, 0.3)} />
          <Box x={310} y={212} w={158} h={100} label={L.aBox} fs={38} color="var(--hl-pink)" o={beat(frame, S.s6, 0.9, 0.3)} />
          <PenCross x={530} y={262} r={30} p={beat(frame, S.s6, 1.4, 0.4)} />
          <div style={{ position: "absolute", left: 60, top: 400, fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s6, 1.8, 0.4) }}>{L.rowCot}</div>
          {ROW_B.map((b, i) => (
            <Box key={i} x={b.x} y={462} w={b.w} h={100} label={b.label} fs={38} color={i === 0 ? "var(--paper-2)" : i === 4 ? "var(--hl-mint)" : "var(--hl-violet)"} o={beat(frame, S.s6, 2.0 + i * 0.4, 0.3)} />
          ))}
          {ROW_B.slice(1).map((b, i) => (
            <Link key={i} cx={(ROW_B[i].x + ROW_B[i].w + b.x) / 2} cy={512} o={beat(frame, S.s6, 2.2 + i * 0.4, 0.3)} />
          ))}
          <PenCheck x={941} y={612} r={28} p={beat(frame, S.s6, 4.0, 0.4)} />
          <Line y={700} fs={54} o={beat(frame, S.s6, 4.4, 0.4)}>
            <InlineUnderline p={beat(frame, S.s6, 4.8, 0.6)}>{L.cot}</InlineUnderline>
          </Line>
          <Hand x={0} y={820} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 5.6, 0.4) }}>
            {L.cotNote}
          </Hand>
        </div>
      )}

      {/* s7: reasoning models */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <Chip text={L.reasoning} color="violet" fs={52} x={60} y={130} />
          <Hand x={60 + chipWidth(L.reasoning, 52) + 24} y={144} fs={42} color="var(--ink-2)">
            {L.since}
          </Hand>
          <Box x={60} y={290} w={190} h={110} label={L.qBox} fs={40} o={beat(frame, S.s7, 0.6, 0.4)} />
          <Arrow x1={262} y1={345} x2={318} y2={345} p={beat(frame, S.s7, 0.9, 0.3)} />
          <div style={{ position: "absolute", left: 330, top: 240, width: 450, height: 210, borderRadius: 24, border: "4px dashed var(--ink-3)", background: "var(--paper-2)", opacity: beat(frame, S.s7, 1.0, 0.4) }}>
            <div style={{ position: "absolute", left: 24, top: 12, fontSize: 34, fontWeight: 700, color: "var(--ink-2)" }}>{L.thinking}</div>
            {SCRIBBLE.map((w, i) => (
              <div key={i} style={{ position: "absolute", left: 24 + (i % 2) * 30, top: 66 + i * 22, width: w * beat(frame, S.s7, 1.3 + i * 0.25, 0.4), height: 10, borderRadius: 5, background: "var(--ink-3)", opacity: 0.6 }} />
            ))}
          </div>
          <Arrow x1={792} y1={345} x2={828} y2={345} p={beat(frame, S.s7, 2.8, 0.3)} />
          <Box x={840} y={290} w={180} h={110} label={L.aBox} fs={40} color="var(--hl-mint)" o={beat(frame, S.s7, 3.0, 0.4)} />
          <Line y={490} fs={44} weight={500} o={beat(frame, S.s7, 3.4, 0.4)}>
            {L.trained}
          </Line>
          <Box x={60} y={600} w={430} h={150} label={L.trainA} fs={38} color="var(--hl-sky)" o={beat(frame, S.s7, 4.4, 0.4)} style={{ padding: "0 24px", textAlign: "center", wordBreak: "keep-all", lineHeight: 1.3 }} />
          <Arrow x1={502} y1={675} x2={578} y2={675} p={beat(frame, S.s7, 5.0, 0.3)} />
          <Box x={590} y={600} w={430} h={150} label={L.trainB} fs={38} color="var(--hl-yellow)" o={beat(frame, S.s7, 5.2, 0.4)} style={{ padding: "0 24px", textAlign: "center", wordBreak: "keep-all", lineHeight: 1.3 }} />
          <CurveArrow d="M 805 762 C 760 860, 320 860, 275 768" end={[275, 768]} ang={Math.atan2(-80, -20)} p={beat(frame, S.s7, 5.8, 0.7)} color="var(--ink-3)" width={5} />
          <Hand x={0} y={880} fs={40} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.4, 0.4) }}>
            {L.known}
          </Hand>
        </div>
      )}

      {/* s8: the trade-off */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 60, width: 440, top: 170, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{L.rowFast}</div>
          <div style={{ position: "absolute", left: 580, width: 440, top: 170, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{L.rowCot}</div>
          <Chip text={L.out} color="pink" fs={44} x={280 - chipWidth(L.out, 44) / 2} y={300} />
          {Array.from({ length: PIECES }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 600 + (i % 6) * 68,
                top: 260 + Math.floor(i / 6) * 46,
                width: 58,
                height: 34,
                borderRadius: 8,
                background: "var(--hl-violet)",
                opacity: beat(frame, S.s8, 0.6 + i * 0.06, 0.2),
              }}
            />
          ))}
          <Chip text={L.answer} color="mint" fs={44} x={800 - chipWidth(L.answer, 44) / 2} y={460} style={{ opacity: beat(frame, S.s8, 2.2, 0.3) }} />
          <Hand x={60} y={560} fs={42} style={{ width: 440, textAlign: "center", opacity: beat(frame, S.s8, 2.6, 0.4) }}>
            {L.fastSide}
          </Hand>
          <Hand x={580} y={560} fs={42} style={{ width: 440, textAlign: "center", opacity: beat(frame, S.s8, 3.0, 0.4) }}>
            {L.slowSide}
          </Hand>
          <div style={{ position: "absolute", left: 540, top: 170, width: 3, height: 460, background: "var(--line)" }} />
          <Line y={700} fs={40} weight={500} color="var(--ink-2)" o={beat(frame, S.s8, 3.6, 0.4)}>
            {L.pieces}
          </Line>
          <Line y={820} fs={50} o={beat(frame, S.s8, 4.6, 0.4)} color="var(--pen)">
            {L.verify}
          </Line>
        </div>
      )}

      <Narration tl={tl} chapter={ch87.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};

function interpolateIn(frame: number, at: number) {
  return Math.max(0, Math.min(1, (frame - at) / 12));
}
