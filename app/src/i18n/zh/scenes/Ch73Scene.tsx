import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { DEMOS, STRIP_A, STRIP_Q, WEIGHTS_AFTER, WEIGHTS_BEFORE, ch73 } from "../../../data/ch73";
import { Caption, Chip, Hand, InlineUnderline, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, textWidth, wrapLayout, type SceneProps } from "../../../scenes/kit";
import { Arrow, Bubble, Center, Mark, Note, OUTLINE, Person } from "../../../scenes/part8-kit";

const tl = buildTimeline(ch73);
const S = byId(tl);
const L = ch73.labels;

const typed = (s: string, t: number) => {
  const cs = Array.from(s);
  return cs.slice(0, Math.round(cs.length * t)).join("");
};

const SFS = 46;
const STRIP = [...STRIP_Q, ...STRIP_A];
const SW = STRIP.map((w) => chipWidth(w, SFS));
const SP = wrapLayout(SW, { y0: 180, lineH: 92 });
const NQ = STRIP_Q.length;

const fmtW = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));

// s7: a growing pile of hand-written answer sheets
const PILE = [-6, 4, -3, 7, -8, 2, 5, -4];

export const Ch73Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1Out = 1 - beat(frame, S.s2, 0, 0.5);
  const s2Out = 1 - beat(frame, S.s3, 0, 0.5);
  const s3Out = 1 - beat(frame, S.s4, 0, 0.5);
  const s4Out = 1 - beat(frame, S.s5, 0, 0.5);
  const s5Out = 1 - beat(frame, S.s6, 0, 0.5);
  const s6Out = 1 - beat(frame, S.s7, 0, 0.5);

  const askW = textWidth(L.ask, 42) + 42 * 1.4 + 8;
  const newQW = textWidth(L.newQ, 44) + 44 * 1.4 + 8;
  const tweak = beat(frame, S.s4, 1.4, 1.2);
  const bookW = [chipWidth(L.oldBook, 54), chipWidth(L.newBook, 54)];
  const bookX = rowLayout([bookW[0], 90, bookW[1]], 24);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: a person writes a model answer */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1Out }}>
          <Person x={90} y={150} size={160} o={beat(frame, S.s1, 0.2, 0.5)} color="var(--hl-violet)" />
          <Hand x={280} y={200} fs={56} style={{ opacity: beat(frame, S.s1, 0.8, 0.5), rotate: "-2deg" }}>
            {L.byHand}
          </Hand>
          <div
            style={{
              position: "absolute",
              left: 90,
              top: 380,
              width: 900,
              padding: "30px 40px",
              background: "var(--paper)",
              border: "3px solid var(--ink)",
              borderRadius: 18,
              boxShadow: "10px 10px 0 var(--grid-major)",
              opacity: beat(frame, S.s1, 1.0, 0.5),
              boxSizing: "border-box",
            }}
          >
            <Chip text={L.qHead} color="sky" fs={32} x={0} y={0} style={{ position: "static", display: "inline-flex" }} />
            <div style={{ fontSize: 48, fontWeight: 700, marginTop: 10 }}>{L.q1}</div>
            <div style={{ height: 3, background: "var(--line)", margin: "24px 0" }} />
            <Chip text={L.aHead} color="violet" fs={32} x={0} y={0} style={{ position: "static", display: "inline-flex" }} />
            <div style={{ fontSize: 44, lineHeight: 1.5, marginTop: 10, minHeight: 66 * 3, wordBreak: "keep-all" }}>{typed(L.a1, beat(frame, S.s1, 1.8, 3.2, (x) => x))}</div>
          </div>
        </div>
      )}

      {/* s2: many demonstrations */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2Out }}>
          {DEMOS.map((d, i) => {
            const a = beat(frame, S.s2, 0.3 + i * 0.5, 0.5);
            return (
              <div
                key={d.q}
                style={{
                  position: "absolute",
                  left: i % 2 ? 550 : 70,
                  top: i < 2 ? 140 : 450,
                  width: 460,
                  height: 270,
                  padding: "24px 28px",
                  background: "var(--paper)",
                  border: "3px solid var(--ink)",
                  borderRadius: 18,
                  boxShadow: "10px 10px 0 var(--grid-major), 20px 20px 0 var(--paper-2)",
                  opacity: a,
                  translate: `0px ${mix(24, 0, a)}px`,
                  rotate: `${[-1.2, 1, 0.8, -1][i]}deg`,
                  boxSizing: "border-box",
                  wordBreak: "keep-all",
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.35 }}>{d.q}</div>
                <div style={{ marginTop: 16, fontSize: 36, lineHeight: 1.45, background: "var(--hl-violet)", color: "var(--chip-ink)", borderRadius: 10, padding: "6px 14px" }}>{d.a}</div>
              </div>
            );
          })}
          <Hand x={90} y={800} fs={46} color="var(--ink-2)" style={{ opacity: beat(frame, S.s2, 2.6, 0.4) }}>
            {L.eachQ}
          </Hand>
          <Hand x={700} y={860} fs={72} style={{ opacity: beat(frame, S.s2, 3.6, 0.4), rotate: "-6deg" }}>
            {L.many}
          </Hand>
          <Note x={90} y={1000} o={beat(frame, S.s2, 4.2, 0.4)}>
            {L.sample}
          </Note>
        </div>
      )}

      {/* s3: same next-piece practice, new textbook */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3Out }}>
          {STRIP.map((w, i) => {
            const isQ = i < NQ;
            const a = beat(frame, S.s3, 0.2 + (isQ ? i * 0.12 : 0.6), 0.4);
            const r = isQ ? 1 : beat(frame, S.s3, 1.6 + (i - NQ) * 0.55, 0.35);
            const marker = w === "问：" || w === "答："; // zh overlay: the only change (the Korean scene hard-codes its markers)
            return (
              <div key={i} style={{ opacity: a }}>
                {!isQ && (
                  <div style={{ position: "absolute", left: SP[i].x, top: SP[i].y, width: SW[i], height: SFS * 1.5, border: "3px dashed var(--ink-3)", borderRadius: 12, opacity: 1 - r, boxSizing: "border-box" }} />
                )}
                <Chip
                  text={w}
                  color={isQ ? null : "violet"}
                  fs={SFS}
                  x={SP[i].x}
                  y={SP[i].y}
                  style={{
                    ...(isQ ? OUTLINE : {}),
                    ...(marker ? { color: "var(--pen)", fontWeight: 700 } : {}),
                    opacity: r,
                    scale: String(isQ ? 1 : mix(0.6, 1, r)),
                  }}
                />
              </div>
            );
          })}
          <Hand x={SP[NQ].x - 10} y={SP[SP.length - 1].y + 100} fs={46} style={{ opacity: beat(frame, S.s3, 1.6, 0.4) }}>
            ↑ {L.guess}
          </Hand>

          <Center y={540} fs={44} o={beat(frame, S.s3, 4.6, 0.4)}>
            {L.book}
          </Center>
          <div style={{ opacity: beat(frame, S.s3, 5.0, 0.4) }}>
            <Chip text={L.oldBook} color={null} fs={54} x={bookX[0]} y={640} style={{ border: "2px solid var(--ink-3)" }} />
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path
                d={`M ${bookX[0] - 8} ${688} L ${bookX[0] + bookW[0] + 8} ${674}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - beat(frame, S.s3, 5.8, 0.4)}
                stroke="var(--pen)"
                strokeWidth={7}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <Arrow x1={bookX[1] + 6} y1={680} x2={bookX[1] + 84} y2={680} p={beat(frame, S.s3, 6.0, 0.4)} />
          <Chip text={L.newBook} color="violet" fs={54} x={bookX[2]} y={640} style={{ opacity: beat(frame, S.s3, 6.3, 0.4), scale: String(mix(0.7, 1, beat(frame, S.s3, 6.3, 0.4))) }} />
          <Hand x={290} y={830} fs={54} style={{ opacity: beat(frame, S.s3, 7.0, 0.5), rotate: "-2deg" }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s4: tweak the numbers a little; name it */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4Out }}>
          <Center y={130} fs={34} weight={500} color="var(--ink-2)" o={beat(frame, S.s4, 0.2, 0.4)}>
            {L.numbers}
          </Center>
          {WEIGHTS_BEFORE.map((v, i) => {
            const changed = v !== WEIGHTS_AFTER[i];
            const x = 100 + (i % 5) * 178;
            const y = 210 + Math.floor(i / 5) * 96;
            const a = beat(frame, S.s4, 0.3 + i * 0.03, 0.3);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 158,
                  height: 78,
                  borderRadius: 12,
                  background: changed && tweak > 0 ? "var(--hl-yellow)" : "var(--paper-2)",
                  color: changed && tweak > 0 ? "var(--chip-ink)" : "var(--ink)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 36,
                  opacity: a,
                }}
              >
                {fmtW(changed ? (tweak < 0.5 ? v : WEIGHTS_AFTER[i]) : v)}
              </div>
            );
          })}
          <Hand x={620} y={600} fs={52} style={{ opacity: beat(frame, S.s4, 2.2, 0.4), rotate: "-3deg" }}>
            {L.tweak}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", opacity: beat(frame, S.s4, 4.2, 0.5), scale: String(mix(0.8, 1, beat(frame, S.s4, 4.2, 0.5))) }}>
            <span style={{ fontSize: 84, fontWeight: 700, background: "var(--hl-violet)", color: "var(--chip-ink)", borderRadius: 18, padding: "4px 30px" }}>{L.sft}</span>
            <div style={{ fontSize: 52, fontWeight: 700, marginTop: 26 }}>{L.sftKo}</div>
            <div style={{ fontSize: 32, color: "var(--ink-2)", marginTop: 4 }}>{L.sftEn}</div>
          </div>
        </div>
      )}

      {/* s5: before vs after */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5Out }}>
          <Bubble side="user" x={1020 - askW} y={130} w={askW} fs={42} o={beat(frame, S.s5, 0.2, 0.4)}>
            {L.ask}
          </Bubble>
          {[
            { x: 60, head: L.before, t: 1.0 },
            { x: 560, head: L.after, t: 2.4 },
          ].map((c) => (
            <div key={c.head} style={{ position: "absolute", left: c.x, top: 300, width: 460, textAlign: "center", fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s5, c.t, 0.4) }}>
              {c.head}
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 380,
              width: 460,
              padding: "22px 28px",
              background: "var(--paper)",
              border: "3px solid var(--ink-3)",
              borderRadius: 10,
              fontSize: 38,
              lineHeight: 1.5,
              color: "var(--ink-2)",
              wordBreak: "keep-all",
              opacity: beat(frame, S.s5, 1.3, 0.4),
              boxSizing: "border-box",
            }}
          >
            {L.beforeOut}
          </div>
          <Bubble side="bot" x={560} y={380} w={460} fs={40} color="var(--hl-mint)" o={beat(frame, S.s5, 2.7, 0.4)}>
            {L.afterOut}
          </Bubble>
          <Mark x={250} y={680} size={90} ok={false} p={beat(frame, S.s5, 3.6, 0.5)} />
          <Mark x={745} y={680} size={90} ok p={beat(frame, S.s5, 4.2, 0.5)} />
        </div>
      )}

      {/* s6: a question it has never seen */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6Out }}>
          <Bubble side="user" x={1020 - newQW} y={160} w={newQW} fs={44} o={beat(frame, S.s6, 0.2, 0.4)}>
            {L.newQ}
          </Bubble>
          <Bubble side="bot" x={60} y={320} w={860} fs={44} color="var(--hl-mint)" o={beat(frame, S.s6, 1.0, 0.4)}>
            {L.newA}
          </Bubble>
          <Hand x={560} y={590} fs={56} style={{ opacity: beat(frame, S.s6, 2.0, 0.4), rotate: "-3deg" }}>
            {L.neverSeen}
          </Hand>
          <Center y={760} fs={44} o={beat(frame, S.s6, 3.4, 0.5)}>
            <InlineUnderline p={beat(frame, S.s6, 4.2, 0.6)}>{L.shape}</InlineUnderline>
          </Center>
        </div>
      )}

      {/* s7: writing is slow */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.2, 0.5) }}>
          <Person x={110} y={240} size={190} color="var(--hl-violet)" />
          {PILE.map((r, i) => {
            const a = beat(frame, S.s7, 0.5 + i * 0.35, 0.3);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 400 + (i % 4) * 10,
                  top: 420 - i * 22,
                  width: 300,
                  height: 160,
                  borderRadius: 10,
                  border: "3px solid var(--ink)",
                  background: "var(--paper)",
                  rotate: `${r}deg`,
                  opacity: a,
                  padding: "26px 24px",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ height: 12, width: "70%", borderRadius: 6, background: "var(--hl-sky)" }} />
                <div style={{ height: 12, width: "90%", borderRadius: 6, background: "var(--hl-violet)", marginTop: 18 }} />
                <div style={{ height: 12, width: "60%", borderRadius: 6, background: "var(--hl-violet)", marginTop: 14 }} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 400, top: 610, width: 320, textAlign: "center", fontSize: 34, color: "var(--ink-2)", opacity: beat(frame, S.s7, 1.0, 0.4) }}>{L.write}</div>
          <Hand x={150} y={690} fs={52} style={{ opacity: beat(frame, S.s7, 3.0, 0.4), rotate: "-2deg" }}>
            {L.hard}
          </Hand>
          <Center y={840} fs={54} o={beat(frame, S.s7, 4.6, 0.4)}>
            {L.pick}
          </Center>
          <Chip text={L.next} color="yellow" fs={44} x={540 - chipWidth(L.next, 44) / 2} y={930} style={{ opacity: beat(frame, S.s7, 5.2, 0.4) }} />
        </div>
      )}

      <Narration tl={tl} chapter={ch73.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
