import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { HIGH_LINES, LOW_LINE, NEXT_AT, PROMPT, SOURCES, STITCH, WRONG, ch95 } from "../../../data/ch95";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, textWidth, type SceneProps } from "../../../scenes/kit";
import { Arrow, Box, ProbBar, Txt, fade, live } from "../../../scenes/part11-kit";

const tl = buildTimeline(ch95);
const S = byId(tl);
const L = ch95.labels;

const OUTLINE = { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" };
const BAR_COLORS = ["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)", "var(--hl-pink)"];
const BAR_MAX = 71.3;

// s1: the strip grows one token at a time (English tokens are longer than Korean syllables: smaller chips)
const FS = 30;
const STRIP = [PROMPT, " ", ...LOW_LINE];
const SW = STRIP.map((p) => (p === " " ? 18 : chipWidth(p, FS)));
const SX = (() => {
  const total = SW.reduce((a, b) => a + b, 0) + 10 * (SW.length - 1);
  let x = 540 - total / 2;
  return SW.map((w) => {
    const at = x;
    x += w + 10;
    return at;
  });
})();
const OUT_Y = 700;
const POP = (i: number) => 1.0 + i * 0.68; // second into s1 when output i pops
const NL_W = FS * 1.84; // = chipWidth of one Korean syllable, as in the original scene

/** A dark line-break token with a return arrow. */
const NlChip: FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <div style={{ position: "absolute", left: x, top: y, width: NL_W, height: FS * 1.5, borderRadius: 12, background: "var(--ink)", opacity: o, scale: String(mix(0.6, 1, o)) }}>
    <svg width={NL_W} height={FS * 1.5} viewBox="0 0 40 40" style={{ display: "block" }}>
      <path d="M 29 10 L 29 24 L 12 24 M 18 18 L 12 24 L 18 30" fill="none" stroke="var(--paper)" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export const Ch95Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1 = fade(frame, S.s1, S.s2, 0);
  const bars = fade(frame, S.s2, S.s4);
  const s4 = fade(frame, S.s4, S.s5);
  const s5 = fade(frame, S.s5, S.s6);
  const s6 = fade(frame, S.s6, S.s7);
  const s7 = fade(frame, S.s7);

  // s1: how many tokens have landed in the strip
  const runs = LOW_LINE.map((_, i) => beat(frame, S.s1, POP(i), 0.05)).filter((v) => v > 0).length + (beat(frame, S.s1, POP(LOW_LINE.length), 0.05) > 0 ? 1 : 0);

  // s2 → s3: bars morph from temperature 1 to 0.3
  const to03 = beat(frame, S.s3, 0.8, 1.2, EASE_IO);
  const to16 = beat(frame, S.s5, 0.6, 1.2, EASE_IO);
  const barP = (i: number, which: "s23" | "s5") =>
    which === "s23" ? mix(NEXT_AT["1"][i].p, NEXT_AT["0.3"][i].p, to03) : mix(NEXT_AT["0.3"][i].p, NEXT_AT["1.6"][i].p, to16);

  const bars4 = (which: "s23" | "s5", y0: number, gap: number, grow: (i: number) => number) =>
    NEXT_AT["1"].map((n, i) => <ProbBar key={n.w} x={120} y={y0 + i * gap} label={n.w} p={barP(i, which)} max={BAR_MAX} w={540} color={BAR_COLORS[i]} grow={grow(i)} />);

  const prompt = (y: number, o = 1) => (
    <div style={{ opacity: o }}>
      <Chip text={PROMPT} color={null} fs={52} x={120} y={y} style={OUTLINE} />
      <div style={{ position: "absolute", left: 140 + chipWidth(PROMPT, 52), top: y, width: 110, height: 78, borderRadius: 14, border: "3px dashed var(--ink-3)" }} />
    </div>
  );

  const tempChip = (text: string, o = 1) => <Chip text={text} color="orange" fs={44} x={1010 - chipWidth(text, 44)} y={176} style={{ opacity: o }} />;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: write one token at a time until the line break */}
      {live(frame, S.s1, S.s2) && (
        <div style={{ opacity: s1 }}>
          <Chip text={PROMPT} color={null} fs={FS} x={SX[0]} y={200} style={{ ...OUTLINE, opacity: beat(frame, S.s1, 0.2, 0.4) }} />
          {LOW_LINE.map((p, i) => {
            const pop = beat(frame, S.s1, POP(i), 0.25);
            const fly = beat(frame, S.s1, POP(i) + 0.3, 0.32, EASE_IO);
            if (pop <= 0) return null;
            const j = i + 2;
            if (p === " ")
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: mix(540 - NL_W / 2, SX[j], fly),
                    top: mix(OUT_Y, 200, fly),
                    width: mix(NL_W, SW[j], fly),
                    height: FS * 1.5,
                    borderRadius: 12,
                    border: "3px dashed var(--ink-3)",
                    boxSizing: "border-box",
                    opacity: pop * (1 - fly),
                  }}
                />
              );
            return (
              <Chip
                key={i}
                text={p}
                color="mint"
                fs={FS}
                x={mix(540 - SW[j] / 2, SX[j], fly)}
                y={mix(OUT_Y, 200, fly)}
                style={{ opacity: pop, scale: String(mix(0.6, 1, pop)) }}
              />
            );
          })}
          <Arrow x1={540} y1={300} x2={540} y2={412} p={beat(frame, S.s1, 0.5, 0.3)} />
          <Box x={340} y={420} w={400} h={170} style={{ fontSize: 56, fontWeight: 700, opacity: beat(frame, S.s1, 0.4, 0.4) }}>
            {L.model}
          </Box>
          <Arrow x1={540} y1={598} x2={540} y2={688} p={beat(frame, S.s1, 0.8, 0.3)} />
          <NlChip x={540 - NL_W / 2} y={OUT_Y} o={beat(frame, S.s1, POP(LOW_LINE.length), 0.3)} />
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d={`M 640 ${OUT_Y + 38} C 960 ${OUT_Y + 38}, 1000 420, 960 300`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - beat(frame, S.s1, 1.4, 0.8)}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={6}
              strokeLinecap="round"
              opacity={beat(frame, S.s1, 1.4, 0.05) > 0 ? 1 : 0}
            />
          </svg>
          <Hand x={572} y={618} fs={38} style={{ opacity: beat(frame, S.s1, 2.0, 0.4) }}>
            {L.pick}
          </Hand>
          <Txt x={0} y={830} w={1080} fs={40} align="center" style={{ opacity: beat(frame, S.s1, 1.2, 0.4) }}>
            {L.runs}: <b style={{ fontFamily: "var(--font-mono)" }}>{runs}</b>
          </Txt>
          <Hand x={0} y={910} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, POP(LOW_LINE.length) + 0.5, 0.4) }}>
            <InlineCircle p={beat(frame, S.s1, POP(LOW_LINE.length) + 0.8, 0.6)} pad={28}>
              {L.stop}
            </InlineCircle>
          </Hand>
        </div>
      )}

      {/* s2–s3: the distribution after "A ", then at temperature 0.3 */}
      {live(frame, S.s2, S.s4) && (
        <div style={{ opacity: bars }}>
          {prompt(170)}
          <div style={{ position: "relative" }}>
            {tempChip(L.t1, 1 - to03)}
            {tempChip(L.t03, to03)}
          </div>
          {bars4("s23", 320, frame < S.s3.from ? 130 : mix(130, 104, to03), (i) => beat(frame, S.s2, 1.0 + i * 0.4, 0.8))}
          <div style={{ opacity: 1 - beat(frame, S.s3, 0, 0.4) }}>
            {SOURCES.map((t, i) => (
              <Txt key={t} x={232} y={320 + i * 130 + 72} fs={30} style={{ color: "var(--ink-2)", opacity: beat(frame, S.s2, 3.6 + i * 0.6, 0.4) }}>
                {t}
              </Txt>
            ))}
            <Hand x={120} y={860} fs={44} style={{ opacity: beat(frame, S.s2, 6.2, 0.4) }}>
              {L.learned}
            </Hand>
            <Txt x={120} y={930} fs={30} style={{ color: "var(--ink-3)", opacity: beat(frame, S.s2, 6.6, 0.4) }}>
              {L.real}
            </Txt>
          </div>
          {frame >= S.s3.from && (
            <div>
              {Array.from({ length: 5 }, (_, k) => (
                <Txt key={k} x={120} y={770 + k * 50} fs={32} style={{ opacity: beat(frame, S.s3, 3.6 + k * 0.35, 0.3) }}>
                  {PROMPT} {LOW_LINE.join("")}
                </Txt>
              ))}
              <Hand x={730} y={860} fs={50} style={{ opacity: beat(frame, S.s3, 6.0, 0.4), rotate: "-4deg" }}>
                {L.same}
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s4: stitched from two proverbs */}
      {live(frame, S.s4, S.s5) && (
        <div style={{ opacity: s4 }}>
          {STITCH.map((st, i) => {
            const y = 190 + i * 150;
            const at = st.line.indexOf(st.keep);
            const pre = st.line.slice(0, at);
            const post = st.line.slice(at + st.keep.length);
            return (
              <Txt key={st.line} x={0} y={y} w={1080} fs={46} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s4, 0.4 + i * 0.6, 0.4) }}>
                {pre}
                <span style={{ background: i === 0 ? "var(--hl-yellow)" : "var(--hl-sky)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 6px" }}>{st.keep}</span>
                {post}
              </Txt>
            );
          })}
          <Txt x={0} y={262} w={1080} fs={40} align="center" style={{ color: "var(--ink-3)", opacity: beat(frame, S.s4, 0.8, 0.3) }}>
            {L.plus}
          </Txt>
          <Arrow x1={540} y1={420} x2={540} y2={510} p={beat(frame, S.s4, 2.0, 0.4)} color="var(--pen)" />
          <Txt x={0} y={540} w={1080} fs={48} bold align="center" style={{ opacity: beat(frame, S.s4, 2.4, 0.5) }}>
            <span style={{ background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 10, padding: "0 8px" }}>{STITCH[0].keep}</span>{" "}
            <span style={{ background: "var(--hl-sky)", color: "var(--chip-ink)", borderRadius: 10, padding: "0 8px" }}>{STITCH[1].keep}</span>
          </Txt>
          <Hand x={0} y={700} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 4.0, 0.4) }}>
            <InlineCircle p={beat(frame, S.s4, 4.3, 0.6)} pad={28}>
              {L.notInData}
            </InlineCircle>
          </Hand>
          <Txt x={0} y={830} w={1080} fs={40} align="center" style={{ opacity: beat(frame, S.s4, 5.6, 0.4) }}>
            {L.stitched}
          </Txt>
        </div>
      )}

      {/* s5: temperature 1.6 */}
      {live(frame, S.s5, S.s6) && (
        <div style={{ opacity: s5 }}>
          {prompt(170)}
          {tempChip(L.t16)}
          {bars4("s5", 320, 104, () => 1)}
          {HIGH_LINES.map((t, i) => (
            <Txt key={t} x={120} y={770 + i * 60} w={900} fs={38} style={{ opacity: beat(frame, S.s5, 2.4 + i * 0.8, 0.4) }}>
              {t}
            </Txt>
          ))}
          <Hand x={560} y={970} fs={48} style={{ opacity: beat(frame, S.s5, 5.4, 0.4), rotate: "-2deg" }}>
            {L.varied}
          </Hand>
        </div>
      )}

      {/* s6: a confident mistake */}
      {live(frame, S.s6, S.s7) && (
        <div style={{ opacity: s6 }}>
          <Chip text={L.textbook} color="mint" fs={42} x={540 - chipWidth(L.textbook, 42) / 2} y={190} />
          <Txt x={0} y={380} w={1080} fs={54} bold align="center" style={{ opacity: beat(frame, S.s6, 0.6, 0.5) }}>
            {WRONG.before}
            <span style={{ position: "relative", display: "inline-block" }}>
              {WRONG.bad}
              <span
                style={{
                  position: "absolute",
                  left: -6,
                  right: -6,
                  top: "52%",
                  height: 6,
                  borderRadius: 3,
                  background: "var(--pen)",
                  rotate: "-8deg",
                  clipPath: `inset(0 ${100 - beat(frame, S.s6, 3.6, 0.4) * 100}% 0 0)`,
                }}
              />
            </span>
            {WRONG.after}
          </Txt>
          <Hand x={540 - textWidth(WRONG.before + WRONG.bad + WRONG.after, 54) / 2 + textWidth(WRONG.before, 54) - 4} y={300} fs={60} style={{ opacity: beat(frame, S.s6, 4.0, 0.4) }}>
            {WRONG.fix}
          </Hand>
          <Hand x={0} y={540} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.4, 0.4) }}>
            {L.wrong}
          </Hand>
          <Txt x={0} y={640} w={1080} fs={40} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s6, 5.6, 0.4) }}>
            {L.sounds}
          </Txt>
          <Chip text={L.halluc} color="pink" fs={56} x={540 - chipWidth(L.halluc, 56) / 2} y={760} style={{ opacity: beat(frame, S.s6, 7.0, 0.4), scale: String(mix(0.7, 1, beat(frame, S.s6, 7.0, 0.4))) }} />
        </div>
      )}

      {/* s7: your turn */}
      {live(frame, S.s7) && (
        <div style={{ opacity: s7 }}>
          <Txt x={0} y={190} w={1080} fs={54} bold align="center">
            {L.try}
          </Txt>
          <div style={{ position: "absolute", left: 200, top: 320, width: 680, height: 110, borderRadius: 18, border: "4px solid var(--ink)", background: "var(--paper)", opacity: beat(frame, S.s7, 0.8, 0.4) }} />
          <Txt x={240} y={342} fs={52} style={{ opacity: beat(frame, S.s7, 1.0, 0.4) }}>
            {PROMPT}
            <span style={{ display: "inline-block", width: 4, height: 54, background: "var(--ink)", marginLeft: 6, verticalAlign: "-8px", opacity: Math.floor(frame / 12) % 2 ? 1 : 0 }} />
          </Txt>
          <div style={{ opacity: beat(frame, S.s7, 1.6, 0.4) }}>
            <div style={{ position: "absolute", left: 200, top: 540, width: 680, height: 12, borderRadius: 6, background: "var(--line)" }} />
            <div style={{ position: "absolute", left: mix(260, 640, (Math.sin((frame - S.s7.from) / 22) + 1) / 2) - 26, top: 520, width: 52, height: 52, borderRadius: "50%", background: "var(--ink)" }} />
            <Txt x={200} y={590} fs={34} style={{ color: "var(--ink-2)" }}>
              0.1
            </Txt>
            <Txt x={680} y={590} w={200} fs={34} align="right" style={{ color: "var(--ink-2)" }}>
              2.0
            </Txt>
          </div>
          <PenCircle x={150} y={760} w={780} h={140} p={beat(frame, S.s7, 4.4, 0.7)} />
          <Hand x={0} y={790} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.8, 0.4) }}>
            {L.same2}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch95.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
