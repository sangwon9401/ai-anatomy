// en overlay of src/scenes/Ch76Scene.tsx: in s8 the blueprint rows' descriptions (longer in English) may wrap to two
// smaller lines instead of running under the 'Filled!' tag.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { TRAINING } from "../../../data/ch05";
import { percents } from "../../../data/ch45";
import { S3_KINDS, ch76, tuned } from "../../../data/ch76";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";
import { Arrow, Center, Dog, Machine, Note, Person, Treat } from "../../../scenes/part8-kit";

const tl = buildTimeline(ch76);
const S = byId(tl);
const L = ch76.labels;

// s3: probabilities before/after (β = 1)
const P0 = S3_KINDS.map((k) => k.p0);
const P1 = tuned(1, 1, S3_KINDS);
const PCT0 = percents(P0);
const PCT1 = percents(P1);
const BAR_X = 700;
const BAR_S = 300;

// s4–s6: a one-line "answer landscape" with the judge's score as height
const X = (u: number) => 120 + u * 84;
const R = (u: number) => 1.6 * Math.exp(-((u - 4.4) ** 2) / (2 * 1.2 ** 2)) - 0.3 + 2.9 * Math.exp(-((u - 8.8) ** 2) / (2 * 0.28 ** 2));
const Y = (r: number) => 820 - r * 120;
const CURVE = Array.from({ length: 141 }, (_, i) => (i / 140) * 10).map((u, i) => `${i ? "L" : "M"} ${X(u).toFixed(1)} ${Y(R(u)).toFixed(1)}`);
const AREA = `${CURVE.join(" ")} L ${X(10)} 880 L ${X(0)} 880 Z`;
const POST_U = 2.0;
const HILL_U = 4.4;
const SPIKE_U = 8.8;
const LEASH_U = 5.8;
const DOG = 120;
const dogAt = (u: number) => ({ x: X(u) - DOG * 0.55, y: Y(R(u)) - DOG * 0.88 });
const GHOSTS = [6.3, 7.6, SPIKE_U];

const SIZES = { instruct: 13, gpt3: 1750 };
const BAR_H = 520;

export const Ch76Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1Out = 1 - beat(frame, S.s2, 0, 0.5);
  const s2Out = 1 - beat(frame, S.s3, 0, 0.5);
  const s3Out = 1 - beat(frame, S.s4, 0, 0.5);
  const landOut = 1 - beat(frame, S.s7, 0, 0.5);
  const s7Out = 1 - beat(frame, S.s8, 0, 0.5);

  const sit = beat(frame, S.s1, 1.6, 0.6);
  const toss = beat(frame, S.s1, 2.6, 0.9, EASE_IO);
  const shift = beat(frame, S.s3, 1.6, 1.6, EASE_IO);

  const walk = beat(frame, S.s4, 1.0, 2.6, EASE_IO);
  const dogU = mix(POST_U, HILL_U, walk);
  const dog = dogAt(dogU);
  const ghostOut = 1 - beat(frame, S.s6, 0, 0.6);
  const leash = beat(frame, S.s6, 0.8, 0.8);
  const postTop = { x: X(POST_U), y: Y(R(POST_U)) - 96 };
  const collar = { x: dog.x + DOG * 0.62, y: dog.y + DOG * 0.42 };

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: teaching a puppy */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1Out }}>
          <Person x={110} y={330} size={230} color="var(--hl-sky)" o={beat(frame, S.s1, 0.2, 0.4)} />
          <Hand x={140} y={240} fs={70} style={{ opacity: beat(frame, S.s1, 0.6, 0.4), rotate: "-4deg" }}>
            {L.sit}
          </Hand>
          <Dog x={560} y={360} size={300} sit={sit} o={beat(frame, S.s1, 0.4, 0.4)} flip />
          {toss > 0 && <Treat x={mix(330, 500, toss)} y={mix(420, 520, toss) - Math.sin(toss * Math.PI) * 140} size={100} o={1} />}
          <Hand x={360} y={720} fs={64} style={{ opacity: beat(frame, S.s1, 3.4, 0.4), rotate: "-2deg" }}>
            {L.treat}
          </Hand>
          <Center y={830} fs={44} weight={500} o={beat(frame, S.s1, 4.4, 0.4)}>
            {L.more}
          </Center>
        </div>
      )}

      {/* s2: the loop */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2Out }}>
          <Chip text={L.q} color="sky" fs={48} x={540 - chipWidth(L.q, 48) / 2} y={150} style={{ opacity: beat(frame, S.s2, 0.2, 0.4) }} />
          <Arrow x1={640} y1={200} x2={790} y2={320} p={beat(frame, S.s2, 0.8, 0.4)} />
          <div style={{ opacity: beat(frame, S.s2, 1.0, 0.4) }}>
            <Dog x={790} y={300} size={190} flip />
            <div style={{ position: "absolute", left: 790, width: 190, top: 500, textAlign: "center", fontSize: 42, fontWeight: 700 }}>{L.model}</div>
          </div>
          <Arrow x1={860} y1={570} x2={680} y2={690} p={beat(frame, S.s2, 1.8, 0.4)} />
          <Chip text={L.answer} color="mint" fs={48} x={540 - chipWidth(L.answer, 48) / 2} y={690} style={{ opacity: beat(frame, S.s2, 2.2, 0.4) }} />
          <Arrow x1={440} y1={720} x2={250} y2={560} p={beat(frame, S.s2, 2.8, 0.4)} />
          <Machine x={70} y={350} w={300} h={190} fs={44} bg="var(--hl-orange)" o={beat(frame, S.s2, 3.2, 0.4)}>
            {L.judge}
          </Machine>
          <Arrow x1={384} y1={445} x2={770} y2={445} p={beat(frame, S.s2, 4.0, 0.6)} color="var(--pen)" width={7} />
          <div style={{ opacity: beat(frame, S.s2, 4.6, 0.4) }}>
            <Treat x={510} y={370} size={90} />
            <Hand x={440} y={470} fs={46}>
              {L.snack}
            </Hand>
          </div>
        </div>
      )}

      {/* s3: more of what scored well */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3Out }}>
          <Center y={130} fs={46} o={beat(frame, S.s3, 0.2, 0.4)}>
            {L.question}
          </Center>
          <div style={{ opacity: beat(frame, S.s3, 0.5, 0.4) }}>
            <div style={{ position: "absolute", left: 540, width: 140, top: 212, textAlign: "center", fontSize: 28, color: "var(--ink-2)" }}>{L.judgeScore}</div>
            <div style={{ position: "absolute", left: BAR_X, top: 212, fontSize: 28, color: "var(--ink-2)" }}>{L.often}</div>
          </div>
          {S3_KINDS.map((k, i) => {
            const y = 270 + i * 160;
            const p = mix(P0[i], P1[i], shift);
            return (
              <div key={k.short} style={{ opacity: beat(frame, S.s3, 0.6 + i * 0.3, 0.4) }}>
                <div style={{ position: "absolute", left: 60, top: y, width: 460, height: 130, padding: "16px 24px", borderRadius: 16, border: "3px solid var(--line)", background: "var(--paper)", boxSizing: "border-box" }}>
                  <div style={{ fontSize: 38, fontWeight: 700 }}>{k.short}</div>
                  <div style={{ fontSize: 28, color: "var(--ink-2)", marginTop: 4, whiteSpace: "nowrap" }}>{k.excerpt}</div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 556,
                    top: y + 30,
                    width: 110,
                    height: 70,
                    borderRadius: 35,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 38,
                    background: k.judge > 0 ? "var(--hl-mint)" : "var(--hl-pink)",
                    color: "var(--chip-ink)",
                  }}
                >
                  {k.judge > 0 ? `+${k.judge}` : `−${Math.abs(k.judge)}`}
                </div>
                <div style={{ position: "absolute", left: BAR_X, top: y + 36, width: P0[i] * BAR_S, height: 56, borderRadius: 12, border: "3px dashed var(--ink-3)", boxSizing: "border-box" }} />
                <div style={{ position: "absolute", left: BAR_X, top: y + 44, width: Math.max(8, p * BAR_S), height: 40, borderRadius: 10, background: "var(--hl-yellow)" }} />
                <div style={{ position: "absolute", left: BAR_X + Math.max(P0[i], p) * BAR_S + 12, top: y + 38, fontFamily: "var(--font-mono)", fontSize: 38 }}>
                  {shift < 0.5 ? PCT0[i] : PCT1[i]}%
                </div>
              </div>
            );
          })}
          <Hand x={BAR_X} y={270 + 2 * 160 + 104} fs={38} style={{ opacity: beat(frame, S.s3, 3.2, 0.4) }}>
            {L.up}
          </Hand>
          <Hand x={BAR_X} y={270 + 104} fs={38} style={{ opacity: beat(frame, S.s3, 3.2, 0.4) }}>
            {L.down}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", opacity: beat(frame, S.s3, 4.4, 0.5), scale: String(mix(0.85, 1, beat(frame, S.s3, 4.4, 0.5))) }}>
            <span style={{ fontSize: 60, fontWeight: 700, background: "var(--hl-pink)", color: "var(--chip-ink)", borderRadius: 14, padding: "2px 24px", marginRight: 22 }}>{L.rlhf}</span>
            <span style={{ fontSize: 46, fontWeight: 700 }}>{L.rlhfKo}</span>
            <div style={{ fontSize: 30, color: "var(--ink-2)", marginTop: 14 }}>{L.rlhfEn}</div>
          </div>
          <Note x={60} y={1000} o={beat(frame, S.s3, 5.0, 0.4)}>
            {L.ppo}
          </Note>
        </div>
      )}

      {/* s4–s6: the answer landscape, the blind spot and the leash */}
      {frame >= S.s4.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: landOut }}>
          <div style={{ opacity: beat(frame, S.s4, 0.2, 0.5) }}>
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path d={AREA} fill="var(--hl-yellow)" opacity={0.35} />
              <path d={CURVE.join(" ")} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinejoin="round" />
              <line x1={100} y1={880} x2={990} y2={880} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
              <line x1={100} y1={880} x2={100} y2={430} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", left: 790, width: 200, top: 896, textAlign: "right", fontSize: 32, fontWeight: 700 }}>{L.axisX}</div>
            <div style={{ position: "absolute", left: 80, top: 376, fontSize: 32, fontWeight: 700 }}>{L.axisY}</div>
            {/* the post = the original model */}
            <div style={{ position: "absolute", left: postTop.x - 9, top: postTop.y, width: 18, height: 96, borderRadius: 6, background: "var(--ink-2)" }} />
            <div style={{ position: "absolute", left: postTop.x - 140, width: 280, top: 896, textAlign: "center", fontSize: 30, color: "var(--ink-2)" }}>{L.post}</div>
            <Treat x={X(HILL_U) - 40} y={Y(R(HILL_U)) - 190} size={80} />
            <div style={{ position: "absolute", left: X(HILL_U) - 100, width: 200, top: Y(R(HILL_U)) - 240, textAlign: "center", fontSize: 32, fontWeight: 700 }}>{L.hill}</div>
          </div>

          {/* s5: the judge's blind spot */}
          <div style={{ opacity: beat(frame, S.s5, 0.6, 0.4) }}>
            <div style={{ position: "absolute", left: X(SPIKE_U) - 150, width: 260, top: Y(R(SPIKE_U)) - 160, textAlign: "center", fontSize: 32, fontWeight: 700, color: "var(--pen)" }}>{L.gap}</div>
            <Hand x={500} y={262} fs={40} style={{ opacity: beat(frame, S.s5, 1.4, 0.4), rotate: "-2deg" }}>
              {L.flatter}
            </Hand>
          </div>
          {GHOSTS.map((u, i) => {
            const g = dogAt(u);
            const o = beat(frame, S.s5, 2.0 + i * 0.8, 0.4) * ghostOut * [0.3, 0.45, 0.7][i];
            return <Dog key={u} x={g.x} y={g.y} size={DOG} o={o} />;
          })}

          {/* s6: the leash */}
          {leash > 0 && (
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path
                d={`M ${postTop.x} ${postTop.y + 10} Q ${(postTop.x + collar.x) / 2} ${Math.max(postTop.y, collar.y) + 60} ${collar.x} ${collar.y}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - leash}
                fill="none"
                stroke="var(--pen)"
                strokeWidth={6}
                strokeLinecap="round"
              />
            </svg>
          )}
          <div style={{ opacity: beat(frame, S.s6, 2.0, 0.5) }}>
            <div style={{ position: "absolute", left: X(LEASH_U), top: 470, width: 0, height: 410, borderLeft: "4px dashed var(--pen)" }} />
            <Hand x={X(LEASH_U) + 12} y={470} fs={40}>
              {L.leash}
            </Hand>
          </div>
          <Dog x={dog.x} y={dog.y} size={DOG} o={beat(frame, S.s4, 0.4, 0.4)} />

          {/* headline per step */}
          <div style={{ position: "absolute", left: 60, top: 150, fontSize: 50, fontWeight: 700, opacity: beat(frame, S.s4, 3.6, 0.4) * (frame < S.s5.from ? 1 : 0) }}>{L.toward}</div>
          <div style={{ opacity: frame >= S.s5.from && frame < S.s6.from ? beat(frame, S.s5, 0.2, 0.4) : 0 }}>
            <Hand x={60} y={150} fs={60}>
              {L.chase}
            </Hand>
          </div>
          <div style={{ opacity: frame >= S.s6.from ? beat(frame, S.s6, 3.0, 0.4) : 0 }}>
            <Hand x={60} y={150} fs={56}>
              {L.tooFar}
            </Hand>
            <Chip text={L.kl} color="pink" fs={48} x={60} y={240} />
          </div>
        </div>
      )}

      {/* s7: small but preferred */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7Out }}>
          <Center y={140} fs={54} o={beat(frame, S.s7, 0.2, 0.4)}>
            {L.who}
          </Center>
          {[
            { x: 230, name: L.instruct, size: L.instructSize, h: Math.max(8, (SIZES.instruct / SIZES.gpt3) * BAR_H), color: "var(--hl-pink)", t: 1.6 },
            { x: 760, name: L.gpt3, size: L.gpt3Size, h: BAR_H, color: "var(--hl-sky)", t: 0.8 },
          ].map((b) => {
            const g = beat(frame, S.s7, b.t, 0.8, EASE_IO);
            return (
              <div key={b.name} style={{ opacity: beat(frame, S.s7, b.t, 0.3) }}>
                <div style={{ position: "absolute", left: b.x - 110, top: 860 - b.h * g, width: 220, height: b.h * g, borderRadius: "12px 12px 2px 2px", background: b.color }} />
                <div style={{ position: "absolute", left: b.x - 200, width: 400, top: 880, textAlign: "center", fontSize: 44, fontWeight: 700 }}>
                  {b.name === L.instruct ? <InlineCircle p={beat(frame, S.s7, 4.0, 0.6)}>{b.name}</InlineCircle> : b.name}
                </div>
                <div style={{ position: "absolute", left: b.x - 200, width: 400, top: 960, textAlign: "center", fontSize: 34, color: "var(--ink-2)" }}>{b.size}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 60, top: 862, width: 960, height: 4, background: "var(--ink)", opacity: beat(frame, S.s7, 0.6, 0.3) }} />
          <Hand x={110} y={560} fs={50} style={{ opacity: beat(frame, S.s7, 3.0, 0.4), rotate: "-3deg" }}>
            {L.liked}
          </Hand>
          <Arrow x1={230} y1={640} x2={230} y2={830} p={beat(frame, S.s7, 3.4, 0.4)} color="var(--pen)" />
          <Hand x={90} y={300} fs={52} style={{ opacity: beat(frame, S.s7, 4.8, 0.4), rotate: "-2deg" }}>
            {L.small}
          </Hand>
        </div>
      )}

      {/* s8: the training half of the blueprint, now complete */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.2, 0.5) }}>
          <Center y={140} fs={50}>
            {L.trainTitle}
          </Center>
          {TRAINING.map((t, i) => {
            const y = 250 + i * 150;
            const last = i === TRAINING.length - 1;
            const fill = last ? beat(frame, S.s8, 1.4, 0.6) : 1;
            return (
              <div key={t.name}>
                <div style={{ position: "absolute", left: 120, top: y, width: 840, height: 124, borderRadius: 18, border: "3px dashed var(--ink-3)", background: "var(--paper)", opacity: 1 - fill, boxSizing: "border-box" }} />
                <div style={{ position: "absolute", left: 120, top: y, width: 840, height: 124, borderRadius: 18, background: last ? "var(--hl-pink)" : "var(--hl-mint)", opacity: fill }} />
                <div style={{ position: "absolute", left: 152, top: y + 14, fontSize: 42, fontWeight: 700, color: fill > 0.5 ? "var(--chip-ink)" : "var(--ink-3)" }}>{t.name}</div>
                <div style={{ position: "absolute", left: 152, top: y + 66, width: 640, fontSize: 24, lineHeight: 1.15, color: fill > 0.5 ? "var(--chip-ink)" : "var(--ink-3)" }}>{t.does}</div>
                <Hand x={760} y={y + 16} fs={32} color={fill > 0.5 ? "var(--chip-ink)" : "var(--ink-3)"}>
                  {t.where}
                </Hand>
                <span style={{ position: "absolute", left: 836, top: y + 66, fontSize: 28, fontWeight: 700, padding: "2px 12px", borderRadius: 8, background: "var(--paper)", color: "var(--ink)", opacity: last ? beat(frame, S.s8, 2.0, 0.4) : 1 }}>{L.filled}</span>
              </div>
            );
          })}
          <Chip text={L.sft} color="violet" fs={40} x={540 - chipWidth(L.sft, 40) / 2} y={740} style={{ opacity: beat(frame, S.s8, 2.6, 0.4) }} />
          <Chip text={L.praise} color="pink" fs={40} x={540 - chipWidth(L.praise, 40) / 2} y={820} style={{ opacity: beat(frame, S.s8, 3.2, 0.4) }} />
          <div style={{ opacity: beat(frame, S.s8, 4.0, 0.5) }}>
            <Dog x={820} y={880} size={150} sit={1} flip />
            <Treat x={760} y={960} size={70} />
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch76.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
