import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { PIPELINE } from "../data/ch05";
import { COMPARE, NEXT, PROJECT, STYLES, ch92 } from "../data/ch92";
import { RUN_CURVE } from "../data/part11-run";
import { Caption, Chip, Hand, InlineCircle, Narration, Paper, PenCircle, PenUnderline, Tag, beat, buildTimeline, byId, chipWidth, mix, textWidth, type SceneProps } from "./kit";
import { Arrow, Box, Curve, ProbBar, Txt, fade, live } from "./part11-kit";

const tl = buildTimeline(ch92);
const S = byId(tl);
const L = ch92.labels;

// s1: the blueprint column (left) and the phone it will train in (right)
const BP_X = 70;
const BP_W = 500;
const BP_Y: Record<string, number> = { tok: 250, emb: 336, pos: 422, att: 526, ffn: 612, out: 726, loop: 812 };
const PHONE = { x: 660, y: 262, w: 340, h: 600 };

// s3–s4: comparison table
const COL_G = 645;
const COL_M = 895;
const ROW_Y = (i: number) => 280 + i * 118;

// s7: what each corpus taught
const STYLE_Y = (i: number) => 170 + i * 250;
const STYLE_FS = 36;

export const Ch92Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1 = fade(frame, S.s1, S.s2, 0);
  const s2 = fade(frame, S.s2, S.s3);
  const s34 = fade(frame, S.s3, S.s5);
  const s5 = fade(frame, S.s5, S.s6);
  const s6 = fade(frame, S.s6, S.s7);
  const s7 = fade(frame, S.s7, S.s8);
  const s8 = fade(frame, S.s8);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the course's blueprint goes into a phone */}
      {live(frame, S.s1, S.s2) && (
        <div style={{ opacity: s1 }}>
          <Txt x={0} y={120} w={1080} fs={64} bold align="center" style={{ opacity: beat(frame, S.s1, 0.2, 0.5) }}>
            {L.title}
          </Txt>
          <div
            style={{
              position: "absolute",
              left: BP_X,
              top: 504,
              width: BP_W,
              height: 196,
              borderRadius: 20,
              border: "4px dashed var(--ink-3)",
              opacity: beat(frame, S.s1, 1.6, 0.4),
            }}
          />
          {PIPELINE.map((p, i) => {
            const inner = p.key === "att" || p.key === "ffn";
            const o = beat(frame, S.s1, 0.8 + i * 0.25, 0.4);
            return (
              <div
                key={p.key}
                style={{
                  position: "absolute",
                  left: inner ? BP_X + 24 : BP_X,
                  top: BP_Y[p.key],
                  width: inner ? BP_W - 48 : BP_W,
                  height: 72,
                  borderRadius: 14,
                  background: `var(--hl-${p.color})`,
                  color: "var(--chip-ink)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 24,
                  fontSize: 36,
                  fontWeight: 700,
                  opacity: o,
                  translate: `${mix(-20, 0, o)}px 0px`,
                }}
              >
                {p.name}
              </div>
            );
          })}

          <div style={{ opacity: beat(frame, S.s1, 3.4, 0.5) }}>
            <div
              style={{
                position: "absolute",
                left: PHONE.x,
                top: PHONE.y,
                width: PHONE.w,
                height: PHONE.h,
                borderRadius: 48,
                border: "6px solid var(--ink)",
                background: "var(--paper)",
              }}
            />
            <div style={{ position: "absolute", left: PHONE.x + PHONE.w / 2 - 40, top: PHONE.y + 22, width: 80, height: 10, borderRadius: 5, background: "var(--ink-3)" }} />
            <Txt x={PHONE.x} y={PHONE.y + 64} w={PHONE.w} fs={34} bold align="center">
              {L.mine}
            </Txt>
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <line x1={PHONE.x + 40} y1={PHONE.y + 160} x2={PHONE.x + 40} y2={PHONE.y + 470} stroke="var(--ink-3)" strokeWidth={4} strokeLinecap="round" />
              <line x1={PHONE.x + 40} y1={PHONE.y + 470} x2={PHONE.x + 300} y2={PHONE.y + 470} stroke="var(--ink-3)" strokeWidth={4} strokeLinecap="round" />
            </svg>
            <Curve xs={RUN_CURVE} x={PHONE.x + 48} y={PHONE.y + 170} w={250} h={300} top={6} p={beat(frame, S.s1, 4.2, 2.4)} />
            <Hand x={PHONE.x + 170} y={PHONE.y + 190} fs={38} style={{ opacity: beat(frame, S.s1, 5.4, 0.4) }}>
              {L.loss} ↓
            </Hand>
          </div>
          <Arrow x1={BP_X + BP_W + 14} y1={560} x2={PHONE.x - 14} y2={560} p={beat(frame, S.s1, 3.0, 0.5)} color="var(--pen)" />
          <Hand x={600} y={900} fs={54} style={{ opacity: beat(frame, S.s1, 6.4, 0.4), rotate: "-3deg" }}>
            {L.real}
          </Hand>
        </div>
      )}

      {/* s2: the four steps of the project */}
      {live(frame, S.s2, S.s3) && (
        <div style={{ opacity: s2 }}>
          {PROJECT.map((p, i) => {
            const y = 200 + i * 170;
            const o = beat(frame, S.s2, 0.4 + i * 1.1, 0.5);
            return (
              <div key={p.ch} style={{ opacity: o, translate: `0px ${mix(16, 0, o)}px` }}>
                <Box x={150} y={y} w={780} h={120} style={{ background: i === 0 ? "var(--hl-yellow)" : "var(--paper-2)", placeItems: "center start" }}>
                  <span style={{ marginLeft: 36, fontSize: 48, fontWeight: 700, color: i === 0 ? "var(--chip-ink)" : "var(--ink)" }}>
                    {p.n} {p.name}
                  </span>
                </Box>
                <Txt x={790} y={y + 36} fs={38} style={{ fontFamily: "var(--font-mono)", color: i === 0 ? "var(--chip-ink)" : "var(--ink-2)" }}>
                  {p.ch}
                </Txt>
                {i < PROJECT.length - 1 && <Arrow x1={540} y1={y + 128} x2={540} y2={y + 162} p={beat(frame, S.s2, 0.9 + i * 1.1, 0.3)} />}
              </div>
            );
          })}
          <Txt x={0} y={900} w={1080} fs={40} align="center" style={{ color: "var(--ink-3)", opacity: beat(frame, S.s2, 5.4, 0.5) }}>
            {L.ch96}
          </Txt>
        </div>
      )}

      {/* s3–s4: same blueprint, smaller numbers */}
      {live(frame, S.s3, S.s5) && (
        <div style={{ opacity: s34 }}>
          <Txt x={COL_G - 130} y={170} w={260} fs={46} bold align="center">
            {L.gpt3}
          </Txt>
          <Chip text={L.mini} color="mint" fs={44} x={COL_M - chipWidth(L.mini, 44) / 2} y={164} />
          {COMPARE.map((r, i) => {
            const step = i < 2 ? S.s3 : S.s4;
            const o = beat(frame, step, i < 2 ? 1.2 + i * 2.2 : 0.6 + (i - 2) * 2.4, 0.5);
            const y = ROW_Y(i);
            return (
              <div key={r.k} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: 60, top: y - 18, width: 960, height: 2, background: "var(--grid-major)" }} />
                <Txt x={70} y={y + 12} fs={40}>
                  {L[r.k]}
                </Txt>
                <Txt x={COL_G - 130} y={y + 8} w={260} fs={48} align="center" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
                  {r.gpt3}
                </Txt>
                <Txt x={COL_M - 110} y={y + 8} w={220} fs={52} bold align="center" style={{ fontFamily: "var(--font-mono)" }}>
                  {r.mini}
                </Txt>
              </div>
            );
          })}
          <PenCircle x={COL_M - 90} y={ROW_Y(4) - 6} w={180} h={92} p={beat(frame, S.s4, 7.2, 0.6)} />
          <Hand x={600} y={ROW_Y(4) + 96} fs={40} style={{ opacity: beat(frame, S.s4, 7.6, 0.4) }}>
            = {L.vocabNote}
          </Hand>
          <Hand x={150} y={950} fs={56} style={{ opacity: beat(frame, S.s3, 6.4, 0.5), rotate: "-2deg" }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s5: knob count */}
      {live(frame, S.s5, S.s6) && (
        <div style={{ opacity: s5 }}>
          <Txt x={0} y={190} w={1080} fs={56} bold align="center">
            {L.knobs}
          </Txt>
          <div style={{ opacity: beat(frame, S.s5, 0.8, 0.5) }}>
            <Txt x={80} y={330} fs={44} bold>
              {L.gpt3}
            </Txt>
            <Txt x={80} y={396} w={920} fs={76} align="right" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
              {L.gpt3Knobs}
            </Txt>
          </div>
          <div style={{ opacity: beat(frame, S.s5, 3.6, 0.5) }}>
            <Txt x={80} y={560} fs={44} bold>
              {L.mini}
            </Txt>
            <div style={{ position: "absolute", left: 1000 - textWidth(L.miniKnobs, 76) - 50, top: 616, width: textWidth(L.miniKnobs, 76) + 60, height: 110, borderRadius: 16, background: "var(--hl-mint)" }} />
            <Txt x={80} y={626} w={900} fs={76} bold align="right" style={{ fontFamily: "var(--font-mono)", color: "var(--chip-ink)" }}>
              {L.miniKnobs}
            </Txt>
          </div>
          <Hand x={0} y={830} fs={72} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 6.0, 0.4) }}>
            <InlineCircle p={beat(frame, S.s5, 6.4, 0.7)} pad={34}>{L.ratio}</InlineCircle>
          </Hand>
        </div>
      )}

      {/* s6: it still predicts the next piece (real checkpoint output) */}
      {live(frame, S.s6, S.s7) && (
        <div style={{ opacity: s6 }}>
          <Chip
            text={L.prompt}
            color={null}
            fs={54}
            x={540 - chipWidth(L.prompt, 54) / 2}
            y={170}
            style={{ background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)", opacity: beat(frame, S.s6, 0.4, 0.4) }}
          />
          <Arrow x1={540} y1={262} x2={540} y2={326} p={beat(frame, S.s6, 0.9, 0.3)} />
          <Box x={320} y={340} w={440} h={130} style={{ opacity: beat(frame, S.s6, 1.1, 0.4), fontSize: 56, fontWeight: 700 }}>
            {L.mini}
          </Box>
          <Arrow x1={540} y1={480} x2={540} y2={544} p={beat(frame, S.s6, 1.8, 0.3)} />
          <Txt x={0} y={558} w={1080} fs={40} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s6, 2.0, 0.4) }}>
            {L.next}
          </Txt>
          {NEXT.map((n, i) => (
            <ProbBar
              key={n.w}
              x={150}
              y={640 + i * 110}
              label={n.w}
              p={n.p}
              max={NEXT[0].p}
              w={560}
              color={["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)"][i]}
              o={beat(frame, S.s6, 2.4 + i * 0.3, 0.3)}
              grow={beat(frame, S.s6, 2.6 + i * 0.3, 0.8)}
            />
          ))}
          <Hand x={150} y={980} fs={44} style={{ opacity: beat(frame, S.s6, 5.2, 0.4) }}>
            {L.realOut}
          </Hand>
        </div>
      )}

      {/* s7: the model writes like what it read (real checkpoint outputs) */}
      {live(frame, S.s7, S.s8) && (
        <div style={{ opacity: s7 }}>
          {STYLES.map((st, i) => {
            const y = STYLE_Y(i);
            const o = beat(frame, S.s7, 0.4 + i * 1.6, 0.4);
            const w2 = beat(frame, S.s7, 1.0 + i * 1.6, 0.4);
            return (
              <div key={st.name} style={{ opacity: o }}>
                <Chip text={st.name} color={st.color} fs={42} x={70} y={y} />
                <Txt x={70} y={y + 82} fs={30} style={{ color: "var(--ink-3)" }}>
                  {L.seen}
                </Txt>
                <Txt x={260} y={y + 76} fs={STYLE_FS} style={{ color: "var(--ink-2)" }}>
                  {st.seen}
                </Txt>
                <div style={{ opacity: w2 }}>
                  <Txt x={70} y={y + 148} fs={30} style={{ color: "var(--pen)" }}>
                    {L.wrote}
                  </Txt>
                  <Txt x={260} y={y + 140} fs={STYLE_FS} bold>
                    {st.wrote}
                  </Txt>
                  <PenUnderline x={260} y={y + 190} w={textWidth(st.wrote, STYLE_FS)} p={beat(frame, S.s7, 1.3 + i * 1.6, 0.5)} />
                </div>
              </div>
            );
          })}
          <Hand x={70} y={918} fs={54} style={{ opacity: beat(frame, S.s7, 6.0, 0.4), rotate: "-2deg" }}>
            {L.alike}
          </Hand>
          <Txt x={70} y={1000} fs={32} style={{ color: "var(--ink-2)", opacity: beat(frame, S.s7, 6.6, 0.4) }}>
            {L.noCopy}
          </Txt>
        </div>
      )}

      {/* s8: how much data */}
      {live(frame, S.s8) && (
        <div style={{ opacity: s8 }}>
          {STYLES.map((st, i) => (
            <div key={st.name} style={{ opacity: beat(frame, S.s8, 0.3 + i * 0.3, 0.4) }}>
              <Box x={70 + i * 325} y={180} w={290} h={150} style={{ background: `var(--hl-${st.color})`, color: "var(--chip-ink)", gridTemplateRows: "auto auto", alignContent: "center", gap: 6, border: "none" }}>
                <span style={{ fontSize: 38, fontWeight: 700 }}>{st.name}</span>
                <span style={{ fontSize: 34, fontFamily: "var(--font-mono)" }}>{[L.lines120, L.lines69, L.lines82][i]}</span>
              </Box>
            </div>
          ))}
          <Txt x={0} y={410} w={1080} fs={54} bold align="center" style={{ opacity: beat(frame, S.s8, 1.4, 0.4) }}>
            {L.size}
          </Txt>
          <Txt x={0} y={498} w={1080} fs={40} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s8, 3.6, 0.4) }}>
            {L.gptData}
          </Txt>
          <div style={{ opacity: beat(frame, S.s8, 4.2, 0.6) }}>
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path d="M 520 900 L 760 600 L 830 670 L 900 610 L 1010 900 Z" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={5} strokeLinejoin="round" />
              <circle cx={250} cy={892} r={6} fill="var(--ink)" />
              <line x1={80} y1={903} x2={1020} y2={903} stroke="var(--ink-3)" strokeWidth={4} strokeLinecap="round" />
            </svg>
            <Txt x={640} y={800} w={260} fs={40} bold align="center">
              {L.gpt3}
            </Txt>
            <Txt x={130} y={830} w={240} fs={32} align="center" style={{ color: "var(--ink-2)" }}>
              {L.mini} ↓
            </Txt>
          </div>
          <Hand x={90} y={640} fs={54} style={{ opacity: beat(frame, S.s8, 5.6, 0.4), rotate: "-4deg" }}>
            {L.dust}
          </Hand>
          <Hand x={0} y={970} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 7.6, 0.4) }}>
            <InlineCircle p={beat(frame, S.s8, 8.0, 0.6)} pad={34}>{L.pick}</InlineCircle>
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch92.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
