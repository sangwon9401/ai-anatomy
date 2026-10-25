// ja overlay of src/scenes/Ch80Scene.tsx: the Korean words drawn as literals now come from the data (WHEEL, GREEDY_LOOP).
import type { FC } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { GREEDY_LOOP, PROMPT80, SPINS, SPIN_FIRST, WHEEL, ch80 } from "../../../data/ch80";
import { Caption, Chip, EASE, EASE_IO, FPS, Hand, Narration, Paper, PenCircle, PenUnderline, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, textWidth, type SceneProps } from "../../../scenes/kit";
import { Card, CurveArrow, OUTLINE, Wheel, landOn } from "../../../scenes/part9-kit";

const tl = buildTimeline(ch80);
const S = byId(tl);
const L = ch80.labels;

const FS = 56;
const SENT_Y = 150;
const CH = FS * 1.5;
const BW = 210;
const XS = rowLayout([...PROMPT80.map((w) => chipWidth(w, FS)), BW], 18);
const BLANK_X = XS[3];
const inBlank = (w: string) => BLANK_X + (BW - chipWidth(w, FS)) / 2;

const LIST_X = 96;
const LIST_Y = 400;
const ROW = 94;
const LFS = 46;
const BAR_X = 330;
const SCALE = 1000;

const colorOf = (w: string) => WHEEL.find((c) => c.w === w)!.c;
const idxOf = (w: string) => WHEEL.findIndex((c) => c.w === w);

// s5: one slow spin that lands on WHEEL[1] (行った)
const SPIN1 = landOn(WHEEL, idxOf(SPIN_FIRST), 0, 4, 0.42);
// s6: twelve quick spins, each landing on its result (positions inside the slice vary a little)
const SPIN_T0 = 0.5;
const SPIN_DT = 0.42;
const SPIN_ROT: number[] = [];
SPINS.reduce((from, w, i) => {
  const r = landOn(WHEEL, idxOf(w), from, 1, 0.25 + ((i * 37) % 50) / 100);
  SPIN_ROT.push(r);
  return r;
}, SPIN1);
const TALLY = WHEEL.slice(0, 4).map(({ w }) => ({ w, n: SPINS.filter((s) => s === w).length }));
const TOP = WHEEL[0].w;

// s4: the loop, one line per round
const LOOP_LINES = [GREEDY_LOOP.slice(1, 4), GREEDY_LOOP.slice(4, 7), [GREEDY_LOOP[7], "…"]];
const LOOP_Y = [280, 390, 500];
const LFS4 = 52;
const CYC = [
  { w: GREEDY_LOOP[1], x: 540, y: 668 },
  { w: GREEDY_LOOP[2], x: 800, y: 960 },
  { w: GREEDY_LOOP[3], x: 280, y: 960 },
];
const CFS = 48;
const RUN_X = rowLayout([...PROMPT80, TOP].map((w) => chipWidth(w, 46)), 12, 600);

export const Ch80Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const listOut = 1 - beat(frame, S.s3, 0, 0.5);
  const greedyHead = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const runsOn = beat(frame, S.s3, 0.4, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const loopOn = 1 - beat(frame, S.s5, 0, 0.5);
  const sampleHead = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const sentOn = 1 - beat(frame, S.s7, 0, 0.5);

  // greedy pick flies into the blank (s2), leaves at s5
  const fly = beat(frame, S.s2, 2.4, 1.0, EASE_IO);
  const greedyChipOn = 1 - beat(frame, S.s5, 0, 0.4);
  const blankOn = beat(frame, S.s1, 0.9, 0.4) * (1 - beat(frame, S.s2, 3.3, 0.2)) + beat(frame, S.s5, 0.2, 0.4) * (1 - beat(frame, S.s5, 4.6, 0.2));

  // wheel
  const wheelIn = beat(frame, S.s5, 0.4, 0.6);
  const spin1 = beat(frame, S.s5, 1.4, 3.2, EASE);
  const move = beat(frame, S.s6, 0, 0.6, EASE_IO);
  let rot = SPIN1 * spin1;
  let shown = -1; // how many s6 spins have finished
  if (frame >= S.s6.from) {
    const t = (frame - S.s6.from) / FPS;
    for (let i = 0; i < SPINS.length; i++) {
      const a = SPIN_T0 + i * SPIN_DT;
      if (t >= a) {
        const from = i === 0 ? SPIN1 : SPIN_ROT[i - 1];
        rot = interpolate(t, [a, a + SPIN_DT * 0.9], [from, SPIN_ROT[i]], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
        if (t >= a + SPIN_DT * 0.9) shown = i;
      }
    }
  }
  const wcx = mix(540, 300, move);
  const wcy = mix(700, 640, move);
  const wr = mix(290, 200, move);
  const wheelOn = wheelIn * (1 - beat(frame, S.s7, 0, 0.5));
  const firstLand = beat(frame, S.s5, 4.7, 0.4);
  const blankWord = frame >= S.s6.from && shown >= 0 ? SPINS[shown] : SPIN_FIRST;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* the sentence */}
      <div style={{ opacity: sentOn }}>
        {PROMPT80.map((w, i) => (
          <Chip key={w} text={w} color={null} fs={FS} x={XS[i]} y={SENT_Y} style={{ ...OUTLINE, opacity: beat(frame, S.s1, 0.1 + i * 0.2, 0.4) }} />
        ))}
        <div style={{ position: "absolute", left: BLANK_X, top: SENT_Y, width: BW, height: CH, border: "3px dashed var(--ink-3)", borderRadius: 14, opacity: Math.min(1, blankOn) }} />
        {fly > 0 && frame < S.s5.from + 15 && (
          <Chip text={TOP} color="yellow" fs={FS} x={mix(LIST_X, inBlank(TOP), fly)} y={mix(LIST_Y, SENT_Y, fly)} style={{ opacity: greedyChipOn }} />
        )}
        {frame >= S.s5.from && firstLand > 0 && (
          <Chip
            key={`${blankWord}${shown}`}
            text={blankWord}
            color={colorOf(blankWord)}
            fs={FS}
            x={inBlank(blankWord)}
            y={SENT_Y}
            style={{ opacity: firstLand, scale: String(frame >= S.s6.from ? 1 : mix(0.6, 1, firstLand)) }}
          />
        )}
      </div>

      {/* s1–s2: the candidates */}
      {frame < S.s3.from + 15 && (
        <div style={{ opacity: listOut }}>
          {WHEEL.map((c, i) => {
            const y = LIST_Y + i * ROW;
            const a = beat(frame, S.s1, 0.4 + i * 0.18, 0.5);
            const g = beat(frame, S.s1, 0.9 + i * 0.15, 0.8);
            const dim = i === 0 ? 1 : 1 - beat(frame, S.s2, 1.0, 0.5) * 0.7;
            return (
              <div key={c.w} style={{ opacity: a * dim }}>
                <Chip text={c.c ? c.w : L.other} color={c.c} fs={LFS} x={LIST_X} y={y} />
                <div style={{ position: "absolute", left: BAR_X, top: y + 18, height: 34, width: c.p * SCALE * g, borderRadius: 17, background: c.c ? `var(--hl-${c.c})` : "var(--grid-major)" }} />
                <div style={{ position: "absolute", left: BAR_X + c.p * SCALE + 16, top: y + 12, fontFamily: "var(--font-mono)", fontSize: 40, opacity: g }}>{Math.round(c.p * 100)}%</div>
              </div>
            );
          })}
          <PenCircle x={LIST_X - 16} y={LIST_Y - 12} w={chipWidth(TOP, LFS) + 32} h={LFS * 1.5 + 24} p={beat(frame, S.s2, 1.2, 0.7)} />
          <Hand x={640} y={262} fs={50} style={{ opacity: beat(frame, S.s1, 2.4, 0.4) * (1 - beat(frame, S.s2, 0, 0.3)), rotate: "-3deg" }}>
            {L.how}
          </Hand>
          <Hand x={1000} y={LIST_Y + 6 * ROW - 6} fs={34} color="var(--ink-3)" style={{ opacity: beat(frame, S.s1, 2.8, 0.5), translate: "-100% 0" }}>
            * {L.example}
          </Hand>
        </div>
      )}

      {/* s2–s3 header: greedy */}
      {frame >= S.s2.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: greedyHead }}>
          <Chip text={L.way1} color={null} fs={34} x={96} y={260} style={OUTLINE} />
          <div style={{ position: "absolute", left: 96 + chipWidth(L.way1, 34) + 18, top: 246, fontSize: 56, fontWeight: 700 }}>{L.greedy}</div>
          <div style={{ position: "absolute", left: 98, top: 322, fontSize: 30, color: "var(--ink-2)" }}>{L.greedyEn}</div>
          <Hand x={96 + chipWidth(L.way1, 34) + 18 + textWidth(L.greedy, 56) + 40} y={252} fs={50} style={{ opacity: beat(frame, S.s2, 1.6, 0.4), rotate: "-3deg" }}>
            {L.top}
          </Hand>
        </div>
      )}

      {/* s3: three runs, same answer */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: runsOn }}>
          {[0, 1, 2].map((r) => {
            const y = 430 + r * 140;
            const a = beat(frame, S.s3, 0.5 + r * 0.7, 0.4);
            const ws = RUN_X;
            return (
              <div key={r} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: 70, top: y + 12, fontSize: 36, color: "var(--ink-2)" }}>
                  <span style={{ fontFamily: "var(--font-mono)" }}>{r + 1}</span>
                  {L.run}
                </div>
                {[...PROMPT80, TOP].map((w, i) => (
                  <Chip key={w} text={w} color={i === 3 ? "yellow" : null} fs={46} x={ws[i]} y={y} style={i === 3 ? undefined : OUTLINE} />
                ))}
              </div>
            );
          })}
          {[0, 1, 2].map((r) => (
            <PenUnderline
              key={r}
              x={RUN_X[3] - 6}
              y={430 + r * 140 + 46 * 1.5 + 2}
              w={chipWidth(TOP, 46) + 12}
              p={beat(frame, S.s3, 2.8 + r * 0.35, 0.4)}
            />
          ))}
          <Hand x={0} y={880} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 3.4, 0.4) }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s4: greedy goes round in circles */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: loopOn }}>
          {LOOP_LINES.map((line, li) => {
            let x = XS[0];
            return line.map((w, i) => {
              const k = li * 3 + i;
              const a = beat(frame, S.s4, 0.4 + k * 0.32, 0.3);
              const cx = x;
              x += chipWidth(w, LFS4) + 14;
              if (w === "…") {
                return (
                  <div key={`${li}${i}`} style={{ position: "absolute", left: cx, top: LOOP_Y[li] - 4, fontSize: 60, fontWeight: 700, opacity: a }}>
                    …
                  </div>
                );
              }
              return <Chip key={`${li}${i}`} text={w} color="mint" fs={LFS4} x={cx} y={LOOP_Y[li]} style={{ opacity: a, translate: `0px ${mix(14, 0, a)}px` }} />;
            });
          })}
          <Hand x={XS[0] + GREEDY_LOOP.slice(1, 4).reduce((s, w) => s + chipWidth(w, LFS4) + 14, 0) + 20} y={LOOP_Y[1] + 6} fs={58} style={{ opacity: beat(frame, S.s4, 2.6, 0.3), rotate: "-6deg" }}>
            {L.again}
          </Hand>

          {/* the cycle */}
          <div style={{ opacity: beat(frame, S.s4, 3.6, 0.5) }}>
            {CYC.map((n) => (
              <Chip key={n.w} text={n.w} color="mint" fs={CFS} x={n.x - chipWidth(n.w, CFS) / 2} y={n.y - CFS * 0.75} />
            ))}
          </div>
          <CurveArrow d="M 620 712 Q 760 760 790 912" end={[790, 912]} endAngle={Math.atan2(912 - 760, 790 - 760)} p={beat(frame, S.s4, 4.0, 0.6)} color="var(--pen)" />
          <CurveArrow d="M 700 1000 Q 540 1060 380 1000" end={[380, 1000]} endAngle={Math.atan2(1000 - 1060, 380 - 540)} p={beat(frame, S.s4, 4.5, 0.6)} color="var(--pen)" />
          <CurveArrow d="M 290 912 Q 320 760 460 712" end={[460, 712]} endAngle={Math.atan2(712 - 760, 460 - 320)} p={beat(frame, S.s4, 5.0, 0.6)} color="var(--pen)" />
          <Hand x={0} y={810} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 5.6, 0.4) }}>
            {L.loop}
          </Hand>
        </div>
      )}

      {/* s5–s6 header: sampling */}
      {frame >= S.s5.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: sampleHead }}>
          <Chip text={L.way2} color={null} fs={34} x={96} y={260} style={OUTLINE} />
          <div style={{ position: "absolute", left: 96 + chipWidth(L.way2, 34) + 18, top: 246, fontSize: 56, fontWeight: 700 }}>{L.sampling}</div>
          <Hand x={96 + chipWidth(L.way2, 34) + 18 + textWidth(L.sampling, 56) + 40} y={256} fs={44} style={{ opacity: beat(frame, S.s5, 0.9, 0.4) }}>
            {L.wheel}
          </Hand>
        </div>
      )}

      {/* the wheel */}
      {frame >= S.s5.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: wheelOn, scale: String(mix(0.85, 1, wheelIn)), transformOrigin: `${wcx}px ${wcy}px` }}>
          <Wheel items={WHEEL} cx={wcx} cy={wcy} r={wr} rot={rot} fs={mix(46, 38, move)} minLabel={move > 0.5 ? 0.06 : 0.04} otherLabel={L.other} />
        </div>
      )}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <Hand x={700} y={1000} fs={48} style={{ opacity: beat(frame, S.s5, 5.2, 0.4) * (1 - move), rotate: "-3deg" }}>
          {L.thisTime}
        </Hand>
      )}

      {/* s6: many spins */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: 1 - beat(frame, S.s7, 0, 0.5) }}>
          <div style={{ position: "absolute", left: 538, top: 368, fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s6, 0.4, 0.4) }}>{L.spins}</div>
          {SPINS.map((w, i) =>
            i <= shown ? (
              <Chip key={i} text={w} color={colorOf(w)} fs={40} x={535 + (i % 3) * 160} y={430 + Math.floor(i / 3) * 85} style={{ scale: String(mix(0.6, 1, beat(frame, S.s6, SPIN_T0 + i * SPIN_DT + SPIN_DT * 0.9, 0.2))) }} />
            ) : null,
          )}
          {(() => {
            const fs = 40;
            const widths = TALLY.map((t) => chipWidth(t.w, fs) + 10 + textWidth(`${t.n}${L.times}`, fs));
            const xs = rowLayout(widths, 34);
            return TALLY.map((t, i) => (
              <div key={t.w} style={{ opacity: beat(frame, S.s6, 5.7 + i * 0.15, 0.4) }}>
                <Chip text={t.w} color={colorOf(t.w)} fs={fs} x={xs[i]} y={880} />
                <div style={{ position: "absolute", left: xs[i] + chipWidth(t.w, fs) + 10, top: 884, fontSize: fs, fontWeight: 500 }}>
                  <span style={{ fontFamily: "var(--font-mono)" }}>{t.n}</span>
                  {L.times}
                </div>
              </div>
            ));
          })()}
          <Hand x={0} y={975} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 6.4, 0.4) }}>
            {L.vary}
          </Hand>
        </div>
      )}

      {/* s7: side by side */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.4, 0.5) }}>
          {[
            { x: 70, title: L.greedy, c: "yellow" as const, lines: [L.gTop, L.gSame, L.gLoop] },
            { x: 560, title: L.sampling, c: "mint" as const, lines: [L.sTop, L.sVary, L.sOdd] },
          ].map((card, ci) => (
            <Card key={card.title} x={card.x} y={200} w={450} h={420}>
              <Chip text={card.title} color={card.c} fs={52} x={36} y={34} />
              {card.lines.map((ln, li) => (
                <div key={ln} style={{ position: "absolute", left: 40, top: 150 + li * 92, fontSize: 38, fontWeight: 500, opacity: beat(frame, S.s7, 0.8 + ci * 0.4 + li * 0.5, 0.4) }}>
                  · {ln}
                </div>
              ))}
            </Card>
          ))}
          <Chip text={L.chatgpt} color="sky" fs={48} x={540 - chipWidth(L.chatgpt, 48) / 2} y={730} style={{ opacity: beat(frame, S.s7, 3.4, 0.4) }} />
          <PenUnderline x={540 - chipWidth(L.chatgpt, 48) / 2} y={730 + 48 * 1.5 + 6} w={chipWidth(L.chatgpt, 48)} p={beat(frame, S.s7, 3.9, 0.7)} />
          <Hand x={0} y={880} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.2, 0.4) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch80.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
