import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { SCENE, TEST, ch75, sigmoid } from "../data/ch75";
import { ROUNDS } from "../data/ch74";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, textWidth, type SceneProps } from "./kit";
import { Arrow, Badge, Bubble, Center, Machine, Mark, Note } from "./part8-kit";

const tl = buildTimeline(ch75);
const S = byId(tl);
const L = ch75.labels;

const fmt = (v: number) => (Math.abs(v) < 0.05 ? "0.0" : v < 0 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));
const pct = (p: number) => `${Math.round(p * 100)}%`;
const SHORT = Object.fromEntries(ROUNDS[0].answers.map((a) => [a.id, a.short]));

// s1 gauge: −3 … +3 on a half circle
const GX = 905;
const GY = 580;
const GR = 105;
const gaugeAng = (s: number) => Math.PI - ((Math.max(-3, Math.min(3, s)) + 3) / 6) * Math.PI;

// s3–s4: score bars around a zero line
const ZX = 700;
const PX = 72;
const ROWS = [
  { id: "B", y: 300, from: SCENE.before.B, to: SCENE.after.B, bg: "var(--hl-mint)" },
  { id: "A", y: 520, from: SCENE.before.A, to: SCENE.after.A, bg: "var(--hl-pink)" },
];

const P_BEFORE = sigmoid(SCENE.before.B - SCENE.before.A);
const P_AFTER = sigmoid(SCENE.after.B - SCENE.after.A);
const FLATTER = 2.6; // illustrative: a score the judge wrongly gives to empty praise

const NEWQ_W = textWidth(L.newQ, 40) + 40 * 1.4 + 8;

const ScorePill: FC<{ x: number; y: number; v: number; o?: number }> = ({ x, y, v, o = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 150,
      height: 78,
      borderRadius: 39,
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 46,
      fontWeight: 500,
      background: v > 1 ? "var(--hl-mint)" : v < 0 ? "var(--hl-pink)" : "var(--paper-2)",
      color: v > 1 || v < 0 ? "var(--chip-ink)" : "var(--ink)",
      opacity: o,
      scale: String(mix(0.6, 1, o)),
    }}
  >
    {fmt(v)}
  </div>
);

export const Ch75Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1Out = 1 - beat(frame, S.s2, 0, 0.5);
  const s2Out = 1 - beat(frame, S.s3, 0, 0.5);
  const barsOut = 1 - beat(frame, S.s5, 0, 0.5);
  const s5Out = 1 - beat(frame, S.s6, 0, 0.5);
  const s6Out = 1 - beat(frame, S.s7, 0, 0.5);

  const needle = gaugeAng(SCENE.after.B * beat(frame, S.s1, 3.0, 1.0, EASE_IO));
  const grow = beat(frame, S.s3, 1.0, 0.8);
  const fix = beat(frame, S.s4, 0.8, 1.6, EASE_IO);
  const s3Note = 1 - beat(frame, S.s4, 0, 0.4);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: answer in, one score out */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1Out }}>
          <Center y={200} fs={64} o={beat(frame, S.s1, 0.2, 0.4)}>
            {L.rm}
            <span style={{ fontSize: 34, fontWeight: 400, color: "var(--ink-2)", marginLeft: 16 }}>{L.rmEn}</span>
          </Center>
          <div style={{ opacity: beat(frame, S.s1, 0.8, 0.4) }}>
            <div style={{ position: "absolute", left: 60, top: 430, width: 300, height: 230, borderRadius: 16, border: "3px solid var(--ink)", background: "var(--paper)", padding: "22px 24px", boxSizing: "border-box" }}>
              <Chip text={L.input} color="sky" fs={32} x={0} y={0} style={{ position: "static", display: "inline-flex" }} />
              {[0.9, 0.75, 0.85, 0.5].map((w, i) => (
                <div key={i} style={{ height: 12, width: `${w * 100}%`, borderRadius: 6, background: "var(--ink-3)", marginTop: i ? 16 : 24 }} />
              ))}
            </div>
          </div>
          <Arrow x1={372} y1={545} x2={424} y2={545} p={beat(frame, S.s1, 1.4, 0.3)} />
          <Machine x={434} y={435} w={300} h={220} fs={50} bg="var(--hl-orange)" o={beat(frame, S.s1, 1.6, 0.4)}>
            {L.rm}
          </Machine>
          <Arrow x1={746} y1={545} x2={790} y2={545} p={beat(frame, S.s1, 2.4, 0.3)} />
          <div style={{ opacity: beat(frame, S.s1, 2.6, 0.4) }}>
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path d={`M ${GX - GR} ${GY} A ${GR} ${GR} 0 0 1 ${GX + GR} ${GY}`} fill="none" stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" />
              {[-3, -1.5, 0, 1.5, 3].map((t) => {
                const a = gaugeAng(t);
                return <line key={t} x1={GX + Math.cos(a) * (GR - 16)} y1={GY - Math.sin(a) * (GR - 16)} x2={GX + Math.cos(a) * GR} y2={GY - Math.sin(a) * GR} stroke="var(--ink)" strokeWidth={4} />;
              })}
              <line x1={GX} y1={GY} x2={GX + Math.cos(needle) * (GR - 24)} y2={GY - Math.sin(needle) * (GR - 24)} stroke="var(--pen)" strokeWidth={7} strokeLinecap="round" />
              <circle cx={GX} cy={GY} r={10} fill="var(--pen)" />
            </svg>
            <div style={{ position: "absolute", left: GX - GR - 30, top: GY + 10, fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-2)" }}>{L.gaugeMin}</div>
            <div style={{ position: "absolute", left: GX + GR - 26, top: GY + 10, fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-2)" }}>{L.gaugeMax}</div>
            <div style={{ position: "absolute", left: GX - 80, width: 160, top: GY + 46, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 54, fontWeight: 500, opacity: beat(frame, S.s1, 3.8, 0.4) }}>
              {fmt(SCENE.after.B)}
            </div>
            <div style={{ position: "absolute", left: GX - 80, width: 160, top: GY - GR - 56, textAlign: "center", fontSize: 32, color: "var(--ink-2)" }}>{L.score}</div>
          </div>
          <Hand x={300} y={800} fs={64} style={{ opacity: beat(frame, S.s1, 4.4, 0.4), rotate: "-2deg" }}>
            {L.oneNumber}
          </Hand>
          <Note x={0} w={1020} align="right" y={1000} o={beat(frame, S.s1, 4.8, 0.4)}>
            * {L.example}
          </Note>
        </div>
      )}

      {/* s2: same body as GPT, a different head */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2Out }}>
          <div style={{ position: "absolute", left: 220, top: 140, width: 640, height: 440, borderRadius: 28, border: "4px dashed var(--ink-3)", opacity: beat(frame, S.s2, 0.2, 0.4) }} />
          <div style={{ position: "absolute", left: 250, top: 156, fontSize: 32, fontWeight: 500, color: "var(--ink-2)", opacity: beat(frame, S.s2, 0.2, 0.4) }}>{L.rm}</div>
          {[2, 1, 0].map((k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: 300 + k * 16,
                top: 250 + k * 16,
                width: 440,
                height: 200,
                borderRadius: 20,
                border: "3px solid var(--ink)",
                background: k === 0 ? "var(--hl-yellow)" : "var(--paper)",
                color: "var(--chip-ink)",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                fontSize: 42,
                fontWeight: 700,
                lineHeight: 1.3,
                opacity: beat(frame, S.s2, 0.5 + (2 - k) * 0.2, 0.4),
              }}
            >
              {k === 0 && (
                <span>
                  {L.block}
                  <br />
                  <span style={{ fontSize: 34, fontWeight: 500 }}>{L.layers}</span>
                </span>
              )}
            </div>
          ))}
          <Hand x={290} y={500} fs={44} style={{ opacity: beat(frame, S.s2, 1.8, 0.4), rotate: "-1deg" }}>
            {L.sameBody}
          </Hand>
          <Arrow x1={540} y1={590} x2={540} y2={668} p={beat(frame, S.s2, 2.6, 0.4)} />
          <div style={{ opacity: beat(frame, S.s2, 3.0, 0.4) }}>
            <Chip text={L.probs} color={null} fs={40} x={290 - chipWidth(L.probs, 40) / 2} y={690} style={{ border: "2px solid var(--ink-3)", color: "var(--ink-3)" }} />
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path
                d={`M ${290 - chipWidth(L.probs, 40) / 2 - 10} 740 L ${290 + chipWidth(L.probs, 40) / 2 + 10} 726`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - beat(frame, S.s2, 3.6, 0.4)}
                stroke="var(--pen)"
                strokeWidth={7}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <Chip text={L.oneScore} color="orange" fs={52} x={790 - chipWidth(L.oneScore, 52) / 2} y={680} style={{ opacity: beat(frame, S.s2, 4.2, 0.4), scale: String(mix(0.7, 1, beat(frame, S.s2, 4.2, 0.4))) }} />
          <Hand x={560} y={820} fs={54} style={{ opacity: beat(frame, S.s2, 5.0, 0.4), rotate: "-3deg" }}>
            {L.newHead}
          </Hand>
        </div>
      )}

      {/* s3–s4: a clumsy judge gets corrected */}
      {frame >= S.s3.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: barsOut }}>
          <Center y={150} fs={44} o={beat(frame, S.s3, 0.2, 0.4)}>
            {L.humanSays}
          </Center>
          <div style={{ position: "absolute", left: ZX - 2, top: 264, width: 4, height: 430, background: "var(--ink)", opacity: beat(frame, S.s3, 0.6, 0.4) }} />
          <div style={{ position: "absolute", left: ZX - 40, width: 80, top: 700, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)", opacity: beat(frame, S.s3, 0.6, 0.4) }}>0</div>
          <div style={{ position: "absolute", left: ZX - 100, width: 200, top: 220, textAlign: "center", fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s3, 0.6, 0.4) }}>{L.score}</div>
          {ROWS.map((r, i) => {
            const v = mix(r.from * grow, r.to, fix);
            const w = Math.abs(v) * PX;
            const a = beat(frame, S.s3, 0.4 + i * 0.3, 0.4);
            const end = v >= 0 ? ZX + w : ZX - w;
            return (
              <div key={r.id} style={{ opacity: a }}>
                <Badge x={100} y={r.y + 60} r={44} text={r.id} bg={r.bg} ink="var(--chip-ink)" />
                <div style={{ position: "absolute", left: 160, top: r.y + 22, width: 440, fontSize: 40, fontWeight: 500 }}>{SHORT[r.id]}</div>
                <div style={{ position: "absolute", left: Math.min(ZX, end), top: r.y + 30, width: w, height: 60, borderRadius: 10, background: r.bg }} />
                <div
                  style={{
                    position: "absolute",
                    left: v >= 0 ? end + 14 : end - 134,
                    width: 120,
                    textAlign: v >= 0 ? "left" : "right",
                    top: r.y + 30,
                    fontFamily: "var(--font-mono)",
                    fontSize: 44,
                    opacity: grow,
                  }}
                >
                  {fmt(v)}
                </div>
                <div style={{ position: "absolute", left: (r.to >= 0 ? ZX + r.to * PX : ZX + r.to * PX) - 18, top: r.y - 44, fontSize: 56, fontWeight: 700, color: "var(--pen)", opacity: beat(frame, S.s4, 2.6, 0.4) }}>
                  {r.id === "B" ? L.arrowUp : L.arrowDown}
                </div>
              </div>
            );
          })}
          <div style={{ opacity: s3Note }}>
            <Mark x={160} y={770} size={80} ok={false} p={beat(frame, S.s3, 2.6, 0.5)} />
            <Hand x={270} y={784} fs={56} style={{ opacity: beat(frame, S.s3, 3.0, 0.4) }}>
              {L.backwards}
            </Hand>
          </div>
          <div style={{ opacity: beat(frame, S.s4, 3.0, 0.4) }}>
            <Mark x={160} y={770} size={80} ok p={beat(frame, S.s4, 3.0, 0.5)} />
            <Hand x={270} y={784} fs={56}>
              {L.fix}
            </Hand>
          </div>
        </div>
      )}

      {/* s5: the two scores through a softmax */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5Out }}>
          <Center y={140} fs={56} o={beat(frame, S.s5, 0.2, 0.4)}>
            {L.winTitle}
          </Center>
          <Center y={222} fs={36} weight={500} color="var(--ink-2)" o={beat(frame, S.s5, 0.5, 0.4)}>
            {L.winSub}
          </Center>
          <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, fontSize: 44, fontWeight: 500, opacity: beat(frame, S.s5, 1.0, 0.5) }}>
            <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ padding: "0 14px 8px" }}>
                e<sup style={{ fontSize: 30 }}>{L.expB}</sup>
              </span>
              <span style={{ alignSelf: "stretch", height: 5, background: "var(--ink)", borderRadius: 3 }} />
              <span style={{ padding: "8px 14px 0" }}>
                e<sup style={{ fontSize: 30 }}>{L.expA}</sup> + e<sup style={{ fontSize: 30 }}>{L.expB}</sup>
              </span>
            </span>
          </div>
          {[
            { y: 500, name: L.beforeTrain, p: P_BEFORE, t: 2.2, s: `A ${fmt(SCENE.before.A)}${L.sep}B ${fmt(SCENE.before.B)}` },
            { y: 700, name: L.afterTrain, p: P_AFTER, t: 3.8, s: `A ${fmt(SCENE.after.A)}${L.sep}B ${fmt(SCENE.after.B)}` },
          ].map((r) => {
            const a = beat(frame, S.s5, r.t, 0.5);
            const g = beat(frame, S.s5, r.t + 0.3, 0.8, EASE_IO);
            const bw = 840 * r.p * g;
            return (
              <div key={r.name} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: 120, top: r.y, fontSize: 38, fontWeight: 700 }}>{r.name}</div>
                <div style={{ position: "absolute", left: 340, top: r.y + 4, fontFamily: "var(--font-mono)", fontSize: 32, color: "var(--ink-2)" }}>{r.s}</div>
                <div style={{ position: "absolute", left: 120, top: r.y + 64, width: 840, height: 76, borderRadius: 14, background: "var(--hl-pink)" }} />
                <div style={{ position: "absolute", left: 120, top: r.y + 64, width: bw, height: 76, borderRadius: "14px 0 0 14px", background: "var(--hl-mint)" }} />
                <div style={{ position: "absolute", left: 140, top: r.y + 76, fontSize: 36, fontWeight: 700, color: "var(--chip-ink)", opacity: g, whiteSpace: "nowrap" }}>
                  {L.winB} {pct(r.p)}
                </div>
                <div style={{ position: "absolute", right: 140, top: r.y + 76, fontSize: 36, fontWeight: 700, color: "var(--chip-ink)", opacity: g, whiteSpace: "nowrap" }}>
                  {L.winA} {pct(1 - r.p)}
                </div>
              </div>
            );
          })}
          <Hand x={330} y={900} fs={56} style={{ opacity: beat(frame, S.s5, 5.6, 0.4), rotate: "-2deg" }}>
            {L.match}
          </Hand>
        </div>
      )}

      {/* s6: scoring answers it has never seen */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6Out }}>
          <Bubble side="user" x={1020 - NEWQ_W} y={130} w={NEWQ_W} fs={40} o={beat(frame, S.s6, 0.2, 0.4)}>
            {L.newQ}
          </Bubble>
          {SCENE.test.map((a, i) => {
            const y = 290 + i * 190;
            return (
              <div key={a.id} style={{ opacity: beat(frame, S.s6, 0.8 + i * 0.8, 0.4) }}>
                <div style={{ position: "absolute", left: 60, top: y, width: 700, minHeight: 150, padding: "20px 26px", fontSize: 36, lineHeight: 1.45, borderRadius: 16, border: "3px solid var(--line)", background: "var(--paper)", wordBreak: "keep-all", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                  {a.text}
                </div>
                <ScorePill x={820} y={y + 36} v={a.s} o={beat(frame, S.s6, 1.3 + i * 0.8, 0.4)} />
              </div>
            );
          })}
          <Hand x={360} y={880} fs={54} style={{ opacity: beat(frame, S.s6, 3.8, 0.4), rotate: "-2deg" }}>
            {L.newAns}
          </Hand>
          <Note x={60} y={1000} o={beat(frame, S.s6, 4.2, 0.4)}>
            * {L.example}
          </Note>
        </div>
      )}

      {/* s7: it can be fooled */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.2, 0.5) }}>
          <Center y={150} fs={52}>
            {L.notPerfect}
          </Center>
          {[
            { text: TEST.answers[0].text, v: SCENE.test[0].s, y: 290, t: 0.6 },
            { text: L.flatter, v: FLATTER, y: 500, t: 1.6 },
          ].map((r) => (
            <div key={r.y} style={{ opacity: beat(frame, S.s7, r.t, 0.4) }}>
              <div style={{ position: "absolute", left: 60, top: r.y, width: 700, minHeight: 150, padding: "20px 26px", fontSize: 36, lineHeight: 1.45, borderRadius: 16, border: "3px solid var(--line)", background: "var(--paper)", wordBreak: "keep-all", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                {r.text}
              </div>
              <ScorePill x={820} y={r.y + 36} v={r.v} o={beat(frame, S.s7, r.t + 0.5, 0.4)} />
            </div>
          ))}
          <PenCircle x={800} y={518} w={190} h={118} p={beat(frame, S.s7, 3.0, 0.6)} />
          <Hand x={780} y={680} fs={60} style={{ opacity: beat(frame, S.s7, 3.4, 0.4), rotate: "-6deg" }}>
            {L.fooled}
          </Hand>
          <Chip text={L.next} color="yellow" fs={46} x={540 - chipWidth(L.next, 46) / 2} y={830} style={{ opacity: beat(frame, S.s7, 5.0, 0.4) }} />
          <Note x={60} y={1000} o={beat(frame, S.s7, 4.4, 0.4)}>
            * {L.example}
          </Note>
        </div>
      )}

      <Narration tl={tl} chapter={ch75.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
