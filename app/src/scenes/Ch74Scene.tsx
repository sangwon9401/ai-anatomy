import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ROUNDS, SCENE_ORDER, ch74, pairsOf } from "../data/ch74";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, PenUnderline, Tag, beat, buildTimeline, byId, chipWidth, mix, textWidth, type SceneProps } from "./kit";
import { Arrow, Badge, Bubble, Center, Machine, Note, Person } from "./part8-kit";

const tl = buildTimeline(ch74);
const S = byId(tl);
const L = ch74.labels;

const R1 = ROUNDS[0];
const AFS = 38;
const CARD_X = 150;
const CARD_W = 716;
const CARD_H: Record<string, number> = { A: 100, B: 214, C: 100 };
const TOP = 330;
const GAP = 26;
const slotY = (order: string[]) => {
  const y: Record<string, number> = {};
  let acc = TOP;
  for (const id of order) {
    y[id] = acc;
    acc += CARD_H[id] + GAP;
  }
  return y;
};
const Y0 = slotY(["A", "B", "C"]);
const Y1 = slotY(SCENE_ORDER);
const RANK = Object.fromEntries(SCENE_ORDER.map((id, i) => [id, i]));
const LETTER_BG: Record<string, string> = { A: "var(--hl-pink)", B: "var(--hl-mint)", C: "var(--hl-sky)", D: "var(--hl-violet)" };
const SHORT = Object.fromEntries(R1.answers.map((a) => [a.id, a.short]));
const PAIRS = pairsOf(SCENE_ORDER);

// s5: four answers, six pairs
const NODES: Record<string, [number, number]> = { A: [360, 340], B: [720, 340], C: [720, 660], D: [360, 660] };
const EDGES = pairsOf(["A", "B", "C", "D"]);

const QW = textWidth(R1.q, 40) + 40 * 1.4 + 8;

export const Ch74Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1Out = 1 - beat(frame, S.s2, 0, 0.5);
  const cardsOut = 1 - beat(frame, S.s4, 0, 0.5);
  const s4Out = 1 - beat(frame, S.s5, 0, 0.5);
  const s5Out = 1 - beat(frame, S.s6, 0, 0.5);
  const s6Out = 1 - beat(frame, S.s7, 0, 0.5);
  const reorder = beat(frame, S.s3, 3.6, 1.0, EASE_IO);
  const edgeP = EDGES.map((_, i) => beat(frame, S.s5, 0.8 + i * 0.55, 0.4));
  const count = edgeP.filter((p) => p >= 1).length;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: writing is hard, choosing is easy */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1Out }}>
          {[
            { x: 70, head: L.write, color: "orange" as const, t: 0.3 },
            { x: 560, head: L.choose, color: "mint" as const, t: 2.0 },
          ].map((c) => (
            <div key={c.head} style={{ opacity: beat(frame, S.s1, c.t, 0.5) }}>
              <div style={{ position: "absolute", left: c.x, top: 200, width: 450, height: 600, border: "3px solid var(--ink)", borderRadius: 20, background: "var(--paper)", boxSizing: "border-box" }} />
              <Chip text={c.head} color={c.color} fs={40} x={c.x + 225 - chipWidth(c.head, 40) / 2} y={236} />
            </div>
          ))}
          {/* left: blank lines to fill */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: "absolute", left: 120, top: 360 + i * 70, width: 350, height: 0, borderTop: "3px dashed var(--ink-3)", opacity: beat(frame, S.s1, 0.6 + i * 0.1, 0.3) }} />
          ))}
          <Hand x={150} y={700} fs={56} style={{ opacity: beat(frame, S.s1, 1.2, 0.4), rotate: "-3deg" }}>
            {L.hard}
          </Hand>
          {/* right: two finished answers, circle one */}
          {[0, 1].map((k) => (
            <div key={k} style={{ position: "absolute", left: 610, top: 340 + k * 150, width: 350, height: 110, borderRadius: 14, background: "var(--paper-2)", padding: "24px 22px", boxSizing: "border-box", opacity: beat(frame, S.s1, 2.4 + k * 0.2, 0.3) }}>
              <div style={{ height: 12, width: k ? "88%" : "60%", borderRadius: 6, background: "var(--ink-3)" }} />
              <div style={{ height: 12, width: k ? "70%" : "40%", borderRadius: 6, background: "var(--ink-3)", marginTop: 20 }} />
            </div>
          ))}
          <PenCircle x={592} y={476} w={386} h={140} p={beat(frame, S.s1, 3.4, 0.6)} />
          <Hand x={650} y={700} fs={56} style={{ opacity: beat(frame, S.s1, 4.0, 0.4), rotate: "-3deg" }}>
            {L.easy}
          </Hand>
        </div>
      )}

      {/* s2–s3: one question, three answers, then a ranking */}
      {frame >= S.s2.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: cardsOut }}>
          <Bubble side="user" x={1020 - QW} y={120} w={QW} fs={40} o={beat(frame, S.s2, 0.2, 0.4)}>
            {R1.q}
          </Bubble>
          <Hand x={70} y={246} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s2, 0.8, 0.4) }}>
            {L.modelSame}
          </Hand>
          {R1.answers.map((a, i) => {
            const y = mix(Y0[a.id], Y1[a.id], reorder);
            const o = beat(frame, S.s2, 1.4 + i * 0.7, 0.5);
            const r = RANK[a.id];
            const rp = beat(frame, S.s3, 1.0 + r * 0.7, 0.4);
            return (
              <div key={a.id} style={{ opacity: o, translate: `${mix(-30, 0, o)}px 0px` }}>
                <Badge x={96} y={y + 48} r={38} text={a.id} bg={LETTER_BG[a.id]} ink="var(--chip-ink)" />
                <div
                  style={{
                    position: "absolute",
                    left: CARD_X,
                    top: y,
                    width: CARD_W,
                    height: CARD_H[a.id],
                    padding: "18px 26px",
                    fontSize: AFS,
                    lineHeight: 1.45,
                    background: "var(--paper)",
                    border: `3px solid ${r === 0 && rp > 0 ? "var(--ink)" : "var(--line)"}`,
                    borderRadius: 16,
                    wordBreak: "keep-all",
                    boxSizing: "border-box",
                  }}
                >
                  {a.text}
                </div>
                <Hand x={898} y={y + 18} fs={50} style={{ opacity: rp }}>
                  <InlineCircle p={beat(frame, S.s3, 1.2 + r * 0.7, 0.5)} pad={10}>
                    {[L.rank1, L.rank2, L.rank3][r]}
                  </InlineCircle>
                </Hand>
              </div>
            );
          })}
          <div style={{ opacity: beat(frame, S.s3, 0.2, 0.4) }}>
            <Person x={150} y={840} size={110} />
            <Hand x={280} y={880} fs={48}>
              {L.person}
            </Hand>
          </div>
        </div>
      )}

      {/* s4: the ranking becomes pairs */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4Out }}>
          <Center y={130} fs={54} o={beat(frame, S.s4, 0.2, 0.4)}>
            {L.pairsTitle}
          </Center>
          <div style={{ opacity: beat(frame, S.s4, 0.6, 0.4) }}>
            <div style={{ position: "absolute", left: 200, width: 240, top: 236, textAlign: "center", fontSize: 36, fontWeight: 500, color: "var(--ink-2)" }}>{L.betterHead}</div>
            <div style={{ position: "absolute", left: 640, width: 240, top: 236, textAlign: "center", fontSize: 36, fontWeight: 500, color: "var(--ink-2)" }}>{L.worseHead}</div>
          </div>
          {PAIRS.map(([b, w], i) => {
            const y = 320 + i * 170;
            const a = beat(frame, S.s4, 1.2 + i * 1.0, 0.5);
            return (
              <div key={b + w} style={{ opacity: a, translate: `0px ${mix(20, 0, a)}px` }}>
                <Badge x={320} y={y + 50} r={50} text={b} bg={LETTER_BG[b]} ink="var(--chip-ink)" />
                <div style={{ position: "absolute", left: 500, width: 80, top: y + 4, textAlign: "center", fontSize: 76, fontWeight: 700 }}>{L.gt}</div>
                <Badge x={760} y={y + 50} r={50} text={w} bg="var(--paper)" ink="var(--ink)" />
                <div style={{ position: "absolute", left: 760 - 50, top: y, width: 100, height: 100, borderRadius: "50%", border: "3px solid var(--ink)", boxSizing: "border-box" }} />
                <div style={{ position: "absolute", left: 170, width: 300, top: y + 108, textAlign: "center", fontSize: 30, color: "var(--ink-2)" }}>{SHORT[b]}</div>
                <div style={{ position: "absolute", left: 610, width: 300, top: y + 108, textAlign: "center", fontSize: 30, color: "var(--ink-2)" }}>{SHORT[w]}</div>
              </div>
            );
          })}
          <Hand x={150} y={860} fs={46} style={{ opacity: beat(frame, S.s4, 5.0, 0.5), rotate: "-1deg" }}>
            {L.row}
          </Hand>
        </div>
      )}

      {/* s5: four answers make six pairs */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5Out }}>
          <Center y={140} fs={54} o={beat(frame, S.s5, 0.2, 0.4)}>
            {L.four}
          </Center>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {EDGES.map(([a, b], i) => {
              const [x1, y1] = NODES[a];
              const [x2, y2] = NODES[b];
              return (
                <path
                  key={a + b}
                  d={`M ${x1} ${y1} L ${x2} ${y2}`}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - edgeP[i]}
                  stroke="var(--pen)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={edgeP[i] > 0 ? 1 : 0}
                />
              );
            })}
          </svg>
          {Object.entries(NODES).map(([id, [x, y]], i) => (
            <Badge key={id} x={x} y={y} r={56} text={id} bg={LETTER_BG[id]} ink="var(--chip-ink)" o={beat(frame, S.s5, 0.3 + i * 0.1, 0.4)} />
          ))}
          <div style={{ position: "absolute", left: 830, top: 470, fontFamily: "var(--font-mono)", fontSize: 72, fontWeight: 500, opacity: beat(frame, S.s5, 0.8, 0.3) }}>
            {count}
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 48 }}>{L.pairUnit}</span>
          </div>
          <Center y={790} fs={42} weight={500} o={beat(frame, S.s5, 4.4, 0.4)}>
            {L.comb}
          </Center>
          <Note x={0} w={1080} align="center" y={880} o={beat(frame, S.s5, 5.0, 0.4)}>
            {L.instruct}
          </Note>
        </div>
      )}

      {/* s6: what people judge by */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6Out }}>
          <Center y={150} fs={42} weight={500} color="var(--ink-2)" o={beat(frame, S.s6, 0.2, 0.4)}>
            {L.criteria}
          </Center>
          {[
            { t: L.c1, c: "sky" as const },
            { t: L.c2, c: "yellow" as const },
            { t: L.c3, c: "mint" as const },
          ].map((k, i) => {
            const a = beat(frame, S.s6, 0.8 + i * 0.9, 0.4);
            return <Chip key={k.t} text={k.t} color={k.c} fs={60} x={540 - chipWidth(k.t, 60) / 2} y={240 + i * 130} style={{ opacity: a, scale: String(mix(0.7, 1, a)) }} />;
          })}
          <Center y={700} fs={70} o={beat(frame, S.s6, 4.6, 0.5)}>
            {L.pref}
          </Center>
          <PenUnderline x={540 - textWidth(L.pref, 70) / 2} y={800} w={textWidth(L.pref, 70)} p={beat(frame, S.s6, 5.4, 0.6)} />
          <Center y={840} fs={34} weight={400} color="var(--ink-2)" o={beat(frame, S.s6, 5.0, 0.4)}>
            {L.prefEn}
          </Center>
        </div>
      )}

      {/* s7: too many answers for people → a judging AI */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.2, 0.5) }}>
          <Center y={170} fs={46} o={beat(frame, S.s7, 0.4, 0.4)}>
            {L.tooMany}
          </Center>
          {[...PAIRS, ...PAIRS.slice(0, 2)].map(([b, w], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 90 + (i % 2) * 14,
                top: 470 - i * 10,
                width: 330,
                height: 120,
                borderRadius: 14,
                border: "3px solid var(--ink)",
                background: "var(--paper)",
                rotate: `${[-4, 3, -2, 5, -5][i]}deg`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 22,
                fontSize: 52,
                fontWeight: 700,
                opacity: beat(frame, S.s7, 0.8 + i * 0.3, 0.3),
              }}
            >
              <span style={{ background: LETTER_BG[b], color: "var(--chip-ink)", borderRadius: 10, padding: "0 16px" }}>{b}</span>
              {L.gt}
              <span>{w}</span>
            </div>
          ))}
          <Arrow x1={470} y1={520} x2={600} y2={520} p={beat(frame, S.s7, 2.8, 0.4)} width={7} />
          <Machine x={620} y={400} w={380} h={240} fs={50} o={beat(frame, S.s7, 3.2, 0.5)}>
            {L.judge}
          </Machine>
          <Chip text={L.next} color="yellow" fs={44} x={810 - chipWidth(L.next, 44) / 2} y={680} style={{ opacity: beat(frame, S.s7, 4.2, 0.4) }} />
        </div>
      )}

      <Narration tl={tl} chapter={ch74.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
