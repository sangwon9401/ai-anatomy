import type { CSSProperties, FC, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { SCENE_DOCS, ch88 } from "../data/ch88";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Arrow, Box, Bubble, FullSvg, Line, PenCheck, PenCross } from "./part10-kit";

const tl = buildTimeline(ch88);
const S = byId(tl);
const L = ch88.labels;

/** A document card: highlighter header with the title, then a body (grey text lines by default). */
const DocCard: FC<{ x: number; y: number; w: number; h: number; title: string; c: string; o?: number; fs?: number; children?: ReactNode; style?: CSSProperties }> = ({
  x,
  y,
  w,
  h,
  title,
  c,
  o = 1,
  fs = 32,
  children,
  style,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 16, background: "var(--paper)", border: "3.5px solid var(--ink)", overflow: "hidden", opacity: o, boxSizing: "border-box", ...style }}>
    <div style={{ height: fs * 1.8, background: `var(--hl-${c})`, color: "var(--chip-ink)", fontSize: fs, fontWeight: 700, display: "flex", alignItems: "center", padding: "0 20px", whiteSpace: "nowrap" }}>{title}</div>
    <div style={{ padding: "16px 20px" }}>
      {children ??
        [0.9, 0.75, 0.82].map((f, i) => <div key={i} style={{ height: 12, width: `${f * 100}%`, borderRadius: 6, background: "var(--line)", marginTop: i ? 14 : 4 }} />)}
    </div>
  </div>
);

const Magnifier: FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <FullSvg opacity={o}>
    <circle cx={x} cy={y} r={58} fill="var(--paper)" fillOpacity={0.35} stroke="var(--ink)" strokeWidth={9} />
    <line x1={x + 42} y1={y + 42} x2={x + 100} y2={y + 100} stroke="var(--ink)" strokeWidth={16} strokeLinecap="round" />
  </FullSvg>
);

const PILE = [
  { x: 120, y: 340 },
  { x: 560, y: 340 },
  { x: 120, y: 580 },
  { x: 560, y: 580 },
];
// the magnifier visits every card and stops on the festival notice
const SWEEP = [PILE[3], PILE[2], PILE[1], PILE[0]].map((p) => ({ x: p.x + 220, y: p.y + 120 }));

export const Ch88Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const qOn = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.4));
  const modelOn = beat(frame, S.s1, 0.8, 0.5) * (1 - beat(frame, S.s3, 0, 0.4));
  const s1On = 1 - beat(frame, S.s2, 0, 0.4);
  const s2On = 1 - beat(frame, S.s3, 0, 0.4);
  const pileOn = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const barsOn = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.4));
  const promptOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const answerOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.4));
  const ragOn = beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.4));

  // magnifier position along the sweep
  const legs = SWEEP.length - 1;
  const sweepT = beat(frame, S.s3, 1.6, 3.6, EASE_IO) * legs;
  const leg = Math.min(legs - 1, Math.floor(sweepT));
  const mag = { x: mix(SWEEP[leg].x, SWEEP[leg + 1].x, sweepT - leg), y: mix(SWEEP[leg].y, SWEEP[leg + 1].y, sweepT - leg) };

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s5.from + 15 && <Bubble x={460} y={130} w={560} side="user" fs={40} text={L.q} o={qOn} />}

      {/* s1–s2: the model alone */}
      {frame < S.s3.from + 15 && (
        <div style={{ opacity: modelOn }}>
          <Box x={330} y={330} w={420} h={150} label={L.model} fs={60} />
          {frame < S.s2.from + 15 && (
            <div style={{ opacity: s1On }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 130 + (i % 2) * 16,
                    top: 760 - i * 58,
                    width: 240,
                    height: 50,
                    borderRadius: 8,
                    border: "3.5px solid var(--ink)",
                    background: ["var(--hl-sky)", "var(--hl-mint)", "var(--hl-orange)"][i],
                    opacity: beat(frame, S.s1, 2.2 + i * 0.2, 0.4),
                  }}
                />
              ))}
              <Hand x={110} y={836} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s1, 2.8, 0.4) }}>
                {L.seen}
              </Hand>
              <Arrow x1={260} y1={630} x2={400} y2={494} p={beat(frame, S.s1, 3.0, 0.5)} />
              <DocCard x={640} y={600} w={330} h={220} title={L.notice} c="yellow" o={beat(frame, S.s1, 4.0, 0.4)}>
                <div style={{ fontSize: 30, fontWeight: 500 }}>{L.noticeTitle}</div>
                <div style={{ height: 12, width: "80%", borderRadius: 6, background: "var(--line)", marginTop: 16 }} />
              </DocCard>
              <PenCross x={805} y={710} r={70} p={beat(frame, S.s1, 5.0, 0.5)} />
              <Hand x={680} y={840} fs={46} style={{ opacity: beat(frame, S.s1, 5.4, 0.4) }}>
                {L.never}
              </Hand>
            </div>
          )}
          {frame >= S.s2.from && (
            <div style={{ opacity: s2On }}>
              <Arrow x1={400} y1={492} x2={400} y2={598} p={beat(frame, S.s2, 0.4, 0.3)} />
              <Bubble x={120} y={610} w={600} side="ai" fs={46} text={L.madeUp} o={beat(frame, S.s2, 0.8, 0.4)} />
              <PenCircle x={100} y={590} w={640} h={130} p={beat(frame, S.s2, 2.6, 0.6)} />
              <Hand x={120} y={790} fs={48} style={{ opacity: beat(frame, S.s2, 3.4, 0.4) }}>
                {L.halluc}
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s3: search the pile */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: pileOn }}>
          {SCENE_DOCS.map((d, i) => (
            <DocCard key={d.title} x={PILE[i].x} y={PILE[i].y} w={400} h={200} title={d.title} c={d.c} o={beat(frame, S.s3, 0.5 + i * 0.15, 0.4)} />
          ))}
          <Magnifier x={mag.x} y={mag.y} o={beat(frame, S.s3, 1.4, 0.3)} />
          <Hand x={120} y={820} fs={46} color="var(--ink-2)" style={{ opacity: beat(frame, S.s3, 0.8, 0.4) }}>
            {L.pile}
          </Hand>
          <PenCircle x={PILE[0].x - 20} y={PILE[0].y - 20} w={440} h={240} p={beat(frame, S.s3, 5.4, 0.6)} />
        </div>
      )}

      {/* s4: closeness scores */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: barsOn }}>
          <Hand x={80} y={290} fs={44} color="var(--ink-2)">
            {L.closeness}
          </Hand>
          {SCENE_DOCS.map((d, i) => {
            const y = 380 + i * 120;
            const g = beat(frame, S.s4, 1.0 + i * 0.3, 0.6);
            return (
              <div key={d.title} style={{ opacity: beat(frame, S.s4, 0.8 + i * 0.3, 0.4) }}>
                <Chip text={d.title} color={d.c} fs={36} x={80} y={y} />
                <div style={{ position: "absolute", left: 480, top: y + 6, height: 42, width: d.sim * 420 * g, borderRadius: 10, background: "var(--ink-2)" }} />
                <div style={{ position: "absolute", left: 492 + d.sim * 420, top: y, fontFamily: "var(--font-mono)", fontSize: 38 }}>{d.sim.toFixed(2)}</div>
              </div>
            );
          })}
          <PenCircle x={60} y={360} w={chipWidth(SCENE_DOCS[0].title, 36) + 40} h={94} p={beat(frame, S.s4, 4.0, 0.6)} />
          <div style={{ position: "absolute", right: 60, top: 880, fontSize: 28, color: "var(--ink-3)" }}>{L.example}</div>
        </div>
      )}

      {/* s5: document + question = one prompt */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: promptOn }}>
          <div style={{ position: "absolute", left: 90, top: 170, width: 900, height: 400, borderRadius: 22, background: "var(--paper)", border: "4px solid var(--ink)" }} />
          <Chip text={L.promptTitle} color={null} fs={32} x={120} y={146} style={{ background: "var(--ink)", color: "var(--paper)" }} />
          <Chip text={L.docTag} color="yellow" fs={36} x={130} y={220} style={{ opacity: beat(frame, S.s5, 0.8, 0.4) }} />
          <div style={{ position: "absolute", left: 130, top: 300, fontSize: 38, fontWeight: 500, opacity: beat(frame, S.s5, 1.2, 0.4) }}>{L.docText}</div>
          <div style={{ position: "absolute", left: 130, top: 378, width: 820, borderTop: "3px dashed var(--ink-3)", opacity: beat(frame, S.s5, 2.0, 0.4) }} />
          <div style={{ position: "absolute", left: 130, top: 404, fontSize: 38, fontWeight: 500, color: "var(--ink-2)", opacity: beat(frame, S.s5, 2.4, 0.4) }}>{L.ask}</div>
          <div style={{ position: "absolute", left: 130, top: 474, fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s5, 3.2, 0.4) }}>{L.qLine}</div>
          <Arrow x1={540} y1={584} x2={540} y2={662} p={beat(frame, S.s5, 4.2, 0.4)} />
          <Box x={330} y={672} w={420} h={150} label={L.model} fs={60} o={beat(frame, S.s5, 4.4, 0.4)} />
        </div>
      )}

      {/* s6: answer with a source */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: answerOn }}>
          <DocCard x={90} y={200} w={900} h={190} title={L.noticeTitle} c="yellow" fs={34}>
            <div style={{ fontSize: 38, fontWeight: 500 }}>
              {L.docPre}{" "}
              <span style={{ background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 8px", outline: beat(frame, S.s6, 1.2, 0.3) > 0.5 ? "4px solid var(--pen)" : "none" }}>{L.date}</span>
              {L.docPost}
            </div>
          </DocCard>
          <Arrow x1={420} y1={402} x2={420} y2={520} p={beat(frame, S.s6, 1.6, 0.5)} color="var(--pen)" dashed />
          <Hand x={450} y={430} fs={42} style={{ opacity: beat(frame, S.s6, 1.8, 0.4) }}>
            {L.copy}
          </Hand>
          <Bubble x={120} y={540} w={640} side="ai" fs={48} text={L.answer} o={beat(frame, S.s6, 2.0, 0.4)} />
          <Chip
            text={L.source}
            color={null}
            fs={36}
            x={120}
            y={700}
            style={{ background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)", opacity: beat(frame, S.s6, 3.6, 0.4) }}
          />
          <PenCheck x={850} y={595} r={44} p={beat(frame, S.s6, 4.4, 0.5)} />
        </div>
      )}

      {/* s7: the name */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: ragOn }}>
          <Line y={170} fs={56}>
            {L.rag}
          </Line>
          {[
            { t: L.step1, c: "var(--hl-sky)" },
            { t: L.step2, c: "var(--hl-yellow)" },
            { t: L.step3, c: "var(--hl-mint)" },
          ].map((b, i) => (
            <div key={b.t}>
              <Box x={60 + i * 345} y={320} w={270} h={130} label={b.t} fs={40} color={b.c} o={beat(frame, S.s7, 0.8 + i * 0.6, 0.4)} />
              {i < 2 && <Arrow x1={340 + i * 345} y1={385} x2={395 + i * 345} y2={385} p={beat(frame, S.s7, 1.1 + i * 0.6, 0.3)} />}
            </div>
          ))}
          {[L.r, L.a, L.g].map((t, i) => (
            <div key={t} style={{ position: "absolute", left: 200, top: 540 + i * 76, fontSize: 42, fontWeight: 500, opacity: beat(frame, S.s7, 3.0 + i * 0.5, 0.4) }}>
              <b style={{ fontFamily: "var(--font-mono)", fontSize: 48, color: "var(--pen)", marginRight: 4 }}>{t[0]}</b>
              {t.slice(1)}
            </div>
          ))}
          <Hand x={0} y={830} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.4, 0.4) }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s8: a wrong document gives a wrong answer */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <DocCard x={90} y={170} w={760} h={190} title={L.oldTitle} c="orange" fs={34}>
            <div style={{ fontSize: 36, fontWeight: 500 }}>{L.oldText}</div>
          </DocCard>
          <Hand x={760} y={130} fs={56} style={{ rotate: "8deg", opacity: beat(frame, S.s8, 1.0, 0.3), scale: String(mix(1.4, 1, beat(frame, S.s8, 1.0, 0.3))) }}>
            {L.lastYear}
          </Hand>
          <Arrow x1={420} y1={372} x2={420} y2={470} p={beat(frame, S.s8, 1.6, 0.4)} dashed />
          <Bubble x={120} y={490} w={640} side="ai" fs={48} text={L.oldAnswer} o={beat(frame, S.s8, 2.0, 0.4)} />
          <Chip text={L.oldSource} color={null} fs={34} x={120} y={640} style={{ background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)", opacity: beat(frame, S.s8, 2.4, 0.4) }} />
          <PenCross x={860} y={545} r={44} p={beat(frame, S.s8, 3.0, 0.5)} />
          <Hand x={120} y={760} fs={48} style={{ opacity: beat(frame, S.s8, 3.6, 0.4) }}>
            {L.wrongDoc}
          </Hand>
          <div style={{ position: "absolute", left: 120, top: 880, display: "flex", alignItems: "center", gap: 20, opacity: beat(frame, S.s8, 5.0, 0.4) }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, border: "4px solid var(--ink)", background: "var(--paper)" }} />
            <span style={{ fontSize: 46, fontWeight: 700 }}>{L.checkIt}</span>
          </div>
          <PenCheck x={148} y={904} r={30} p={beat(frame, S.s8, 5.6, 0.4)} />
        </div>
      )}

      <Narration tl={tl} chapter={ch88.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
