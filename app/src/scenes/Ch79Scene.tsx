import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { RECAP, REQUESTS_FLOW, TEASER, ch79, harmfulHelped, harmlessRefused } from "../data/ch79";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, textWidth, wrapLayout, type SceneProps } from "./kit";
import { Arrow, Bubble, Center, Mark, Note, OUTLINE } from "./part8-kit";

const tl = buildTimeline(ch79);
const S = byId(tl);
const L = ch79.labels;

// s1: a crowd of requests
const RFS = 40;
const RPOS = wrapLayout(
  REQUESTS_FLOW.map((r) => chipWidth(r.t, RFS)),
  { x0: 90, y0: 230, maxW: 900, gap: 22, lineH: 110 },
);
const GOOD_COL = ["mint", "sky", "yellow", "violet"] as const;

// s2: two arrows coming into line
const ARROW_LEN = 380;
const ANG_HUMAN = (62 * Math.PI) / 180;
const ANG_START = (14 * Math.PI) / 180;

// s5: error curves
const GX0 = 160;
const GX1 = 920;
const GY0 = 840;
const GH = 460;
const gx = (x: number) => GX0 + x * (GX1 - GX0);
const gy = (v: number) => GY0 - v * GH;
const curve = (f: (x: number) => number) =>
  Array.from({ length: 61 }, (_, i) => i / 60)
    .map((x, i) => `${i ? "L" : "M"} ${gx(x).toFixed(1)} ${gy(f(x)).toFixed(1)}`)
    .join(" ");
const HARM = curve(harmfulHelped);
const OVER = curve(harmlessRefused);

const ASK_OK_W = textWidth(L.askOk, 42) + 42 * 1.4 + 8;

// s8: chapter 1's sentence and bars
const SENT = L.sentence.split(" ");
const SENT_X = rowLayout([...SENT.map((w) => chipWidth(w, 52)), 170], 16);

export const Ch79Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1Out = 1 - beat(frame, S.s2, 0, 0.5);
  const s2Out = 1 - beat(frame, S.s3, 0, 0.5);
  const s3Out = 1 - beat(frame, S.s4, 0, 0.5);
  const s4Out = 1 - beat(frame, S.s5, 0, 0.5);
  const s5Out = 1 - beat(frame, S.s6, 0, 0.5);
  const s6Out = 1 - beat(frame, S.s7, 0, 0.5);
  const s7Out = 1 - beat(frame, S.s8, 0, 0.5);

  const turn = beat(frame, S.s2, 2.2, 2.0, EASE_IO);
  const angModel = mix(ANG_START, ANG_HUMAN, turn);
  const hHead = { x: 520 + Math.cos(ANG_HUMAN) * ARROW_LEN, y: 700 - Math.sin(ANG_HUMAN) * ARROW_LEN };
  const mHead = { x: 570 + Math.cos(angModel) * ARROW_LEN, y: 700 - Math.sin(angModel) * ARROW_LEN };

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: a crowd of requests */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1Out }}>
          <Center y={130} fs={48} o={beat(frame, S.s1, 0.2, 0.4)}>
            {L.many}
          </Center>
          {REQUESTS_FLOW.map((r, i) => {
            const a = beat(frame, S.s1, 0.4 + i * 0.25, 0.4);
            return (
              <Chip
                key={r.t}
                text={r.t}
                color={r.bad ? "pink" : GOOD_COL[i % GOOD_COL.length]}
                fs={RFS}
                x={RPOS[i].x}
                y={RPOS[i].y}
                style={{ opacity: a, translate: `0px ${mix(-24, 0, a)}px`, rotate: `${[-1, 1.2, -0.6, 0.8, -1.4][i % 5]}deg` }}
              />
            );
          })}
          {REQUESTS_FLOW.map((r, i) =>
            r.bad ? <PenCircle key={i} x={RPOS[i].x - 18} y={RPOS[i].y - 14} w={chipWidth(r.t, RFS) + 36} h={RFS * 1.5 + 28} p={beat(frame, S.s1, 3.6, 0.6)} /> : null,
          )}
          <Hand x={300} y={720} fs={60} style={{ opacity: beat(frame, S.s1, 4.2, 0.4), rotate: "-2deg" }}>
            {L.sometimes}
          </Hand>
        </div>
      )}

      {/* s2: alignment = bringing the model's behaviour in line with what people want */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2Out }}>
          <Center y={130} fs={72} o={beat(frame, S.s2, 0.2, 0.4)}>
            {L.align}
            <span style={{ fontSize: 40, fontWeight: 400, color: "var(--ink-2)", marginLeft: 14 }}>({L.alignEn})</span>
          </Center>
          <Arrow x1={520} y1={700} x2={hHead.x} y2={hHead.y} p={beat(frame, S.s2, 0.8, 0.5)} width={9} />
          <Arrow x1={570} y1={700} x2={mHead.x} y2={mHead.y} p={beat(frame, S.s2, 1.3, 0.5)} width={9} color="var(--pen)" />
          <div style={{ position: "absolute", left: hHead.x - 290, width: 240, top: hHead.y - 20, textAlign: "right", fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s2, 1.0, 0.4) }}>{L.human}</div>
          <Hand x={mHead.x + 20} y={mHead.y - 30} fs={44} style={{ opacity: beat(frame, S.s2, 1.5, 0.4) }}>
            {L.act}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: beat(frame, S.s2, 4.6, 0.5) }}>
            <span style={{ fontSize: 36, color: "var(--ink-2)" }}>{L.tools}</span>
            <span style={{ fontSize: 40, fontWeight: 500, background: "var(--hl-violet)", color: "var(--chip-ink)", borderRadius: 10, padding: "4px 16px" }}>{L.sft}</span>
            <span style={{ fontSize: 40, fontWeight: 500, background: "var(--hl-pink)", color: "var(--chip-ink)", borderRadius: 10, padding: "4px 16px" }}>{L.rlhf}</span>
          </div>
        </div>
      )}

      {/* s3: a good refusal */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3Out }}>
          <Bubble side="user" x={240} y={140} w={780} fs={42} o={beat(frame, S.s3, 0.2, 0.4)}>
            {L.askBad}
          </Bubble>
          <Bubble side="bot" x={60} y={360} w={820} fs={42} color="var(--hl-mint)" o={beat(frame, S.s3, 1.4, 0.5)}>
            {L.refuseGood}
          </Bubble>
          <Mark x={910} y={400} size={90} ok p={beat(frame, S.s3, 4.0, 0.5)} />
          <Hand x={560} y={700} fs={60} style={{ opacity: beat(frame, S.s3, 4.4, 0.4), rotate: "-3deg" }}>
            {L.goodRefusal}
          </Hand>
        </div>
      )}

      {/* s4: an over-refusal */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4Out }}>
          <Bubble side="user" x={1020 - ASK_OK_W} y={160} w={ASK_OK_W} fs={42} o={beat(frame, S.s4, 0.2, 0.4)}>
            {L.askOk}
          </Bubble>
          <Bubble side="bot" x={60} y={330} w={760} fs={42} o={beat(frame, S.s4, 1.2, 0.5)} style={{ border: "3px solid var(--line)" }}>
            {L.refuseBad}
          </Bubble>
          <Mark x={860} y={350} size={90} ok={false} p={beat(frame, S.s4, 2.6, 0.5)} />
          <Hand x={140} y={600} fs={72} style={{ opacity: beat(frame, S.s4, 3.0, 0.4), rotate: "-3deg" }}>
            <InlineCircle p={beat(frame, S.s4, 3.4, 0.6)}>{L.overRefusal}</InlineCircle>
          </Hand>
          <Hand x={180} y={740} fs={50} style={{ opacity: beat(frame, S.s4, 4.4, 0.4) }}>
            {L.scared}
          </Hand>
        </div>
      )}

      {/* s5: the balance */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5Out }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: beat(frame, S.s5, 0.2, 0.4) }}>
            <line x1={GX0 - 20} y1={GY0} x2={GX1 + 30} y2={GY0} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <path d={HARM} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s5, 1.0, 1.2)} fill="none" stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" />
            <path d={OVER} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s5, 2.6, 1.2)} fill="none" stroke="var(--hl-orange)" strokeWidth={8} strokeLinecap="round" />
            <line x1={gx(0.5)} y1={GY0} x2={gx(0.5)} y2={560} stroke="var(--ink-2)" strokeWidth={4} strokeDasharray="10 10" opacity={beat(frame, S.s5, 4.6, 0.4)} />
          </svg>
          <div style={{ position: "absolute", left: GX0 - 40, top: GY0 + 14, fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s5, 0.4, 0.4) }}>{L.loose}</div>
          <div style={{ position: "absolute", left: GX1 - 40, top: GY0 + 14, fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s5, 0.4, 0.4) }}>{L.strict}</div>
          <Center y={GY0 + 70} fs={36} o={beat(frame, S.s5, 0.4, 0.4)}>
            {L.axisX}
          </Center>
          <div style={{ position: "absolute", left: 110, top: 370, fontSize: 40, fontWeight: 700, color: "var(--pen)", opacity: beat(frame, S.s5, 1.4, 0.4) }}>{L.harmful}</div>
          <div style={{ position: "absolute", right: 60, top: 370, fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s5, 3.0, 0.4) }}>
            <span style={{ borderBottom: "8px solid var(--hl-orange)" }}>{L.harmless}</span>
          </div>
          <Chip text={L.balance} color="mint" fs={48} x={gx(0.5) - chipWidth(L.balance, 48) / 2} y={480} style={{ opacity: beat(frame, S.s5, 5.0, 0.4), scale: String(mix(0.7, 1, beat(frame, S.s5, 5.0, 0.4))) }} />
          <Note x={0} w={1020} align="right" y={1000} o={beat(frame, S.s5, 5.4, 0.4)}>
            * {L.example}
          </Note>
        </div>
      )}

      {/* s6: how to refuse well */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6Out }}>
          <Center y={150} fs={60} o={beat(frame, S.s6, 0.2, 0.4)}>
            {L.styleTitle}
          </Center>
          {[L.st1, L.st2, L.st3].map((t, i) => {
            const y = 310 + i * 170;
            return (
              <div key={t} style={{ opacity: beat(frame, S.s6, 0.8 + i * 1.2, 0.4) }}>
                <Mark x={230} y={y - 6} size={80} ok p={beat(frame, S.s6, 1.0 + i * 1.2, 0.5)} />
                <div style={{ position: "absolute", left: 350, top: y, fontSize: 58, fontWeight: 700 }}>{t}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* s7: Part 8 recap */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7Out }}>
          <Center y={140} fs={54} o={beat(frame, S.s7, 0.2, 0.4)}>
            {L.recapTitle}
          </Center>
          {RECAP.map((r, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const a = beat(frame, S.s7, 0.8 + i * 0.4, 0.3);
            return (
              <div
                key={r.t}
                style={{
                  position: "absolute",
                  left: col ? 550 : 70,
                  top: 270 + row * 130,
                  width: 460,
                  height: 96,
                  borderRadius: 16,
                  background: ["var(--hl-yellow)", "var(--hl-violet)", "var(--hl-sky)", "var(--hl-orange)", "var(--hl-pink)", "var(--hl-mint)", "var(--hl-yellow)", "var(--hl-mint)"][i],
                  color: "var(--chip-ink)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "0 22px",
                  boxSizing: "border-box",
                  opacity: a,
                  scale: String(mix(0.8, 1, a)),
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, opacity: 0.7, flexShrink: 0 }}>{r.n}</span>
                <span style={{ fontSize: 36, fontWeight: 700, whiteSpace: "nowrap" }}>{r.t}</span>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", opacity: beat(frame, S.s7, 4.6, 0.5), scale: String(mix(0.7, 1, beat(frame, S.s7, 4.6, 0.5))) }}>
            <span style={{ fontSize: 80, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 18, padding: "4px 34px" }}>{L.chatgpt}</span>
          </div>
        </div>
      )}

      {/* s8: next, Part 9 */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.2, 0.5) }}>
          {SENT.map((w, i) => (
            <Chip key={w} text={w} color={null} fs={52} x={SENT_X[i]} y={170} style={OUTLINE} />
          ))}
          <div style={{ position: "absolute", left: SENT_X[3], top: 170, width: 170, height: 78, border: "3px dashed var(--ink-3)", borderRadius: 14, display: "grid", placeItems: "center", fontSize: 52, color: "var(--ink-3)", boxSizing: "border-box" }}>?</div>
          {TEASER.map((c, i) => {
            const y = 340 + i * 110;
            const g = beat(frame, S.s8, 0.8 + i * 0.2, 0.7);
            return (
              <div key={c.w}>
                <Chip text={c.w} color={(["yellow", "mint", "sky"] as const)[i]} fs={46} x={120} y={y} />
                <div style={{ position: "absolute", left: 340, top: y + 18, height: 34, width: c.p * 900 * g, borderRadius: 17, background: `var(--hl-${["yellow", "mint", "sky"][i]})` }} />
                <div style={{ position: "absolute", left: 356 + c.p * 900, top: y + 10, fontFamily: "var(--font-mono)", fontSize: 40, opacity: g }}>{Math.round(c.p * 100)}%</div>
              </div>
            );
          })}
          <Note x={0} w={1020} align="right" y={680} o={beat(frame, S.s8, 1.6, 0.4)}>
            * {L.teaserNote}
          </Note>
          <Hand x={380} y={720} fs={64} style={{ opacity: beat(frame, S.s8, 2.4, 0.4), rotate: "-3deg" }}>
            {L.which}
          </Hand>
          <Chip text={L.nextPart} color="yellow" fs={48} x={540 - chipWidth(L.nextPart, 48) / 2} y={860} style={{ opacity: beat(frame, S.s8, 3.6, 0.5), scale: String(mix(0.8, 1, beat(frame, S.s8, 3.6, 0.5))) }} />
        </div>
      )}

      <Narration tl={tl} chapter={ch79.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
