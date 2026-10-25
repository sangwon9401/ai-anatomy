import type { FC } from "react";
import { random, useCurrentFrame } from "remotion";
import { COPIED, DIARY, FRESH, LOOP, WINDOW_IN, WINDOW_OUT, ch94 } from "../../../data/ch94";
import { RUN_CURVE, RUN_EVERY, RUN_REACH } from "../../../data/part11-run";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";
import { Arrow, Box, Curve, Txt, fade, live } from "../../../scenes/part11-kit";

const tl = buildTimeline(ch94);
const S = byId(tl);
const L = ch94.labels;

/** A token chip; the line break is a dark chip with a return arrow, the space a dashed empty chip. */
const Tok: FC<{ p: string; x: number; y: number; fs: number; on?: boolean; o?: number }> = ({ p, x, y, fs, on, o = 1 }) => {
  const w = chipWidth("字", fs);
  const h = fs * 1.5;
  if (p === "\n")
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: fs * 0.25, background: "var(--ink)", opacity: o }}>
        <svg width={w} height={h} viewBox="0 0 40 40" style={{ display: "block" }}>
          <path d="M 29 10 L 29 24 L 12 24 M 18 18 L 12 24 L 18 30" fill="none" stroke="var(--paper)" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  if (p === " ") return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: fs * 0.25, border: "3px dashed var(--ink-3)", boxSizing: "border-box", opacity: o }} />;
  return <Chip text={p} color={on ? "yellow" : null} fs={fs} x={x} y={y} w={w} style={{ opacity: o, ...(on ? {} : { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" }) }} />;
};

// s1 knobs
const KNOBS = Array.from({ length: 15 }, (_, i) => ({ cx: 340 + (i % 5) * 100, cy: 300 + Math.floor(i / 5) * 84, a: random(`knob${i}`) * Math.PI * 2 }));

// s2 window columns
const WFS = 40;
const COL_X = (i: number) => 190 + i * 82;

// s4 loop
const LOOP_POS: [number, number][] = [
  [540, 330],
  [840, 600],
  [540, 870],
  [240, 600],
];
const LOOP_COLORS = ["var(--hl-yellow)", "var(--hl-pink)", "var(--hl-sky)", "var(--hl-mint)"];
const RING = { cx: 540, cy: 600, r: 270 };

// s5 chart
// zh: the 谚语 run starts at 6.24 (ln 506), so the chart goes up to 7
const CH = { x: 170, y: 860, w: 800, h: 540, maxStep: 1500, maxLoss: 7 };
// zh: copies among 80 lines written by the 1,500-step checkpoint (temperature 0.8, rng 99)
const COPIED_OF_80 = 62;
const cx = (step: number) => CH.x + (step / CH.maxStep) * CH.w;
const cy = (loss: number) => CH.y - (loss / CH.maxLoss) * CH.h;
const lossAt = (step: number) => RUN_CURVE[Math.round(step / RUN_EVERY)];

export const Ch94Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1 = fade(frame, S.s1, S.s2, 0);
  const s2 = fade(frame, S.s2, S.s3);
  const s3 = fade(frame, S.s3, S.s4);
  const s4 = fade(frame, S.s4, S.s5);
  const s5 = fade(frame, S.s5, S.s6);
  const s6 = fade(frame, S.s6, S.s7);
  const s7 = fade(frame, S.s7, S.s8);
  const s8 = fade(frame, S.s8);

  // s2: which column is being predicted
  const col = Math.floor(Math.max(0, (frame - S.s2.from - 3.0 * 30) / 12));
  // s4: a dot travelling once round the loop
  const lap = beat(frame, S.s4, 5.6, 3.0, EASE_IO);
  const ang = -Math.PI / 2 + lap * Math.PI * 2;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: an untrained model */}
      {live(frame, S.s1, S.s2) && (
        <div style={{ opacity: s1 }}>
          <Box x={270} y={170} w={540} h={370} style={{ placeItems: "start center", paddingTop: 18, fontSize: 48, fontWeight: 700, opacity: beat(frame, S.s1, 0.2, 0.5) }}>
            {L.model}
          </Box>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: beat(frame, S.s1, 0.8, 0.5) }}>
            {KNOBS.map((k, i) => {
              const a = k.a + Math.sin(frame / 9 + i) * 0.5 * (1 - beat(frame, S.s1, 3.0, 0.6));
              return (
                <g key={i}>
                  <circle cx={k.cx} cy={k.cy} r={32} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
                  <line x1={k.cx} y1={k.cy} x2={k.cx + Math.cos(a) * 24} y2={k.cy + Math.sin(a) * 24} stroke="var(--pen)" strokeWidth={5} strokeLinecap="round" />
                </g>
              );
            })}
          </svg>
          <Txt x={0} y={560} w={1080} fs={42} bold align="center" style={{ opacity: beat(frame, S.s1, 1.6, 0.4) }}>
            {L.knobs}
          </Txt>
          <Hand x={0} y={622} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 2.4, 0.4) }}>
            {L.random}
          </Hand>
          <Arrow x1={540} y1={700} x2={540} y2={760} p={beat(frame, S.s1, 4.6, 0.3)} />
          <Txt x={0} y={780} w={1080} fs={34} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s1, 4.9, 0.4) }}>
            {L.first}
          </Txt>
          <div style={{ position: "absolute", left: 140, top: 840, width: 800, height: 100, borderRadius: 18, border: "3px solid var(--line)", background: "var(--paper-2)", opacity: beat(frame, S.s1, 5.2, 0.4) }} />
          <Txt x={140} y={866} w={800} fs={46} align="center" style={{ letterSpacing: 1 }}>
            {[...DIARY[0].text].slice(0, Math.round(mix(0, [...DIARY[0].text].length, beat(frame, S.s1, 5.4, 1.6)))).join("")}
          </Txt>
        </div>
      )}

      {/* s2: one window, predict the next token at every position */}
      {live(frame, S.s2, S.s3) && (
        <div style={{ opacity: s2 }}>
          <Txt x={0} y={160} w={1080} fs={50} bold align="center">
            {L.eachNext}
          </Txt>
          <Txt x={60} y={322} fs={38} bold>
            {L.input}
          </Txt>
          <Txt x={60} y={512} fs={38} bold style={{ color: "var(--pen)" }}>
            {L.target}
          </Txt>
          {WINDOW_IN.map((p, i) => (
            <Tok key={`i${i}`} p={p} x={COL_X(i)} y={310} fs={WFS} o={beat(frame, S.s2, 0.6 + i * 0.12, 0.3)} />
          ))}
          {WINDOW_OUT.map((p, i) => {
            const shown = i <= col;
            return (
              <div key={`o${i}`}>
                <Arrow x1={COL_X(i) + 37} y1={386} x2={COL_X(i) + 37} y2={490} p={shown ? 1 : 0} color={i === col ? "var(--pen)" : "var(--ink-3)"} width={4} />
                <Tok p={p} x={COL_X(i)} y={500} fs={WFS} on={i === col} o={shown ? 1 : 0} />
              </div>
            );
          })}
          <div style={{ opacity: beat(frame, S.s2, 5.0, 0.4) }}>
            <Tok p={"\n"} x={260} y={640} fs={34} />
            <Txt x={338} y={646} fs={34} style={{ color: "var(--ink-2)" }}>
              {L.newline}
            </Txt>
            <Tok p="，" x={560} y={640} fs={34} />
            <Txt x={638} y={646} fs={34} style={{ color: "var(--ink-2)" }}>
              {L.space}
            </Txt>
          </div>
          {Array.from({ length: 8 }, (_, k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: 190 + k * 10,
                top: 760 + k * 22,
                width: 700,
                height: 34,
                borderRadius: 8,
                border: "2.5px solid var(--ink-2)",
                background: "repeating-linear-gradient(90deg, var(--hl-sky) 0 26px, var(--paper) 26px 29.1px)",
                opacity: beat(frame, S.s2, 6.0 + k * 0.15, 0.3),
              }}
            />
          ))}
          <Hand x={700} y={950} fs={46} style={{ opacity: beat(frame, S.s2, 7.4, 0.4), rotate: "-3deg" }}>
            {L.window}
          </Hand>
        </div>
      )}

      {/* s3: the first loss */}
      {live(frame, S.s3, S.s4) && (
        <div style={{ opacity: s3 }}>
          <Txt x={0} y={170} w={1080} fs={44} align="center" style={{ color: "var(--ink-2)" }}>
            {L.loss}
          </Txt>
          <Txt x={0} y={220} w={1080} fs={124} bold align="center" style={{ fontFamily: "var(--font-mono)" }}>
            {L.lossStart}
          </Txt>
          <Hand x={0} y={400} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 4.6, 0.4) }}>
            = {L.guess}
          </Hand>
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 140 + i * 20,
                top: 820 - 190 * beat(frame, S.s3, 1.6 + i * 0.03, 0.4),
                width: 14,
                height: 190 * beat(frame, S.s3, 1.6 + i * 0.03, 0.4),
                borderRadius: "4px 4px 0 0",
                background: i === 7 ? "var(--pen)" : "var(--hl-sky)",
              }}
            />
          ))}
          <div style={{ position: "absolute", left: 120, top: 820, width: 840, height: 4, background: "var(--ink)" }} />
          <Txt x={0} y={846} w={1080} fs={36} align="center" style={{ opacity: beat(frame, S.s3, 3.0, 0.4) }}>
            {L.flat}
          </Txt>
        </div>
      )}

      {/* s4: the training loop */}
      {live(frame, S.s4, S.s5) && (
        <div style={{ opacity: s4 }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {LOOP.map((_, i) => {
              const a0 = -Math.PI / 2 + (i * Math.PI) / 2 + 0.42;
              const a1 = a0 + Math.PI / 2 - 0.84;
              const p = beat(frame, S.s4, 0.9 + i * 1.0, 0.5);
              const x0 = RING.cx + RING.r * Math.cos(a0);
              const y0 = RING.cy + RING.r * Math.sin(a0);
              const x1 = RING.cx + RING.r * Math.cos(a1);
              const y1 = RING.cy + RING.r * Math.sin(a1);
              const hx = (d: number) => x1 - 20 * Math.cos(a1 + Math.PI / 2 + d);
              const hy = (d: number) => y1 - 20 * Math.sin(a1 + Math.PI / 2 + d);
              return (
                <g key={i} opacity={p > 0 ? 1 : 0}>
                  <path d={`M ${x0} ${y0} A ${RING.r} ${RING.r} 0 0 1 ${x1} ${y1}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" />
                  {p > 0.95 && <path d={`M ${hx(0.5)} ${hy(0.5)} L ${x1} ${y1} L ${hx(-0.5)} ${hy(-0.5)}`} fill="none" stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
                </g>
              );
            })}
            {lap > 0 && lap < 1 && <circle cx={RING.cx + RING.r * Math.cos(ang)} cy={RING.cy + RING.r * Math.sin(ang)} r={16} fill="var(--ink)" />}
          </svg>
          {LOOP.map((n, i) => {
            const [x, y] = LOOP_POS[i];
            const o = beat(frame, S.s4, 0.4 + i * 1.0, 0.4);
            return (
              <div key={n.name} style={{ opacity: o }}>
                <div
                  style={{
                    position: "absolute",
                    left: x - 150,
                    top: y - 58,
                    width: 300,
                    height: 116,
                    borderRadius: 20,
                    background: LOOP_COLORS[i],
                    color: "var(--chip-ink)",
                    display: "grid",
                    placeItems: "center",
                    alignContent: "center",
                    gap: 2,
                  }}
                >
                  <span style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1 }}>{n.name}</span>
                  <span style={{ fontSize: 28, lineHeight: 1.1 }}>{n.ch}</span>
                </div>
              </div>
            );
          })}
          <Txt x={440} y={540} w={200} fs={46} bold align="center" style={{ whiteSpace: "pre-line", lineHeight: 1.25, opacity: beat(frame, S.s4, 4.6, 0.4) }}>
            {L.oneStep.replace(" ", "\n")}
          </Txt>
        </div>
      )}

      {/* s5: the real loss curve */}
      {live(frame, S.s5, S.s6) && (
        <div style={{ opacity: s5 }}>
          <Chip text={L.realRun} color="sky" fs={32} x={1010 - chipWidth(L.realRun, 32)} y={150} />
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={CH.x} y1={CH.y} x2={CH.x + CH.w + 20} y2={CH.y} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={CH.x} y1={CH.y} x2={CH.x} y2={CH.y - CH.h - 20} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {[2, 4, 6].map((v) => (
              <line key={v} x1={CH.x} y1={cy(v)} x2={CH.x + CH.w} y2={cy(v)} stroke="var(--grid-major)" strokeWidth={2} />
            ))}
            <line x1={CH.x} y1={cy(RUN_CURVE[0])} x2={CH.x + CH.w} y2={cy(RUN_CURVE[0])} stroke="var(--ink-3)" strokeWidth={3} strokeDasharray="12 10" />
          </svg>
          {[0, 2, 4, 6].map((v) => (
            <Txt key={v} x={CH.x - 70} y={cy(v) - 20} w={50} fs={30} align="right" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
              {v}
            </Txt>
          ))}
          {[0, 500, 1000, 1500].map((v) => (
            <Txt key={v} x={cx(v) - 60} y={CH.y + 14} w={120} fs={30} align="center" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
              {v.toLocaleString("en-US")}
            </Txt>
          ))}
          <Txt x={CH.x - 20} y={CH.y - CH.h - 76} fs={36} bold>
            ↑ {L.loss}
          </Txt>
          <Txt x={CH.x + CH.w - 120} y={CH.y + 56} w={160} fs={36} bold align="right">
            {L.axisSteps} →
          </Txt>
          <Hand x={CH.x + CH.w - 290} y={cy(RUN_CURVE[0]) - 52} fs={36} color="var(--ink-2)">
            {L.guess}
          </Hand>
          <Curve xs={RUN_CURVE} x={CH.x} y={CH.y - CH.h} w={CH.w} h={CH.h} top={CH.maxLoss} p={beat(frame, S.s5, 0.8, 4.2)} />
          {[
            { step: RUN_REACH.below2, label: L.below2, t: 4.6 },
            { step: RUN_REACH.below1, label: L.below1, t: 6.0 },
          ].map((m) => (
            <div key={m.label} style={{ opacity: beat(frame, S.s5, m.t, 0.4) }}>
              <div style={{ position: "absolute", left: cx(m.step) - 14, top: cy(lossAt(m.step)) - 14, width: 28, height: 28, borderRadius: "50%", background: "var(--ink)", border: "5px solid var(--paper)" }} />
              <Hand x={cx(m.step) + 24} y={cy(lossAt(m.step)) - 74} fs={42}>
                {m.label}
              </Hand>
            </div>
          ))}
          <Txt x={CH.x + CH.w - 360} y={cy(4.4)} w={360} fs={36} align="right" style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s5, 7.4, 0.4) }}>
            {L.end}
          </Txt>
        </div>
      )}

      {/* s6: the generation diary */}
      {live(frame, S.s6, S.s7) && (
        <div style={{ opacity: s6 }}>
          <Txt x={70} y={150} fs={52} bold>
            {L.diary}
          </Txt>
          <Chip text={L.realRun} color="sky" fs={32} x={1010 - chipWidth(L.realRun, 32)} y={160} />
          {DIARY.slice(1).map((d, i) => {
            const y = 260 + i * 196;
            const o = beat(frame, S.s6, 0.6 + i * 1.5, 0.4);
            return (
              <div key={d.step} style={{ opacity: o, translate: `0px ${mix(14, 0, o)}px` }}>
                <Chip text={d.step} color={(["pink", "orange", "yellow", "mint"] as const)[i]} fs={36} x={70} y={y} />
                <Txt x={110 + chipWidth(d.step, 36)} y={y + 8} fs={34} style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
                  {L.loss} {d.loss}
                </Txt>
                <Txt x={70} y={y + 74} w={940} fs={50} bold={i === 3}>
                  {d.text}
                </Txt>
              </div>
            );
          })}
        </div>
      )}

      {/* s7: copied vs new */}
      {live(frame, S.s7, S.s8) && (
        <div style={{ opacity: s7 }}>
          {[
            { tag: L.copied, text: COPIED, note: L.inData, color: "pink" as const, y: 170, t: 0.5 },
            { tag: L.fresh, text: FRESH, note: L.notInData, color: "mint" as const, y: 420, t: 1.6 },
          ].map((c) => (
            <div key={c.tag} style={{ opacity: beat(frame, S.s7, c.t, 0.4) }}>
              <div style={{ position: "absolute", left: 70, top: c.y, width: 940, height: 210, borderRadius: 22, border: "3px solid var(--line)", background: "var(--paper-2)" }} />
              <Chip text={c.tag} color={c.color} fs={38} x={100} y={c.y + 24} />
              <Txt x={100} y={c.y + 96} fs={50} bold>
                {c.text}
              </Txt>
              <Txt x={0} y={c.y + 34} w={980} fs={32} align="right" style={{ color: "var(--ink-2)" }}>
                {c.note}
              </Txt>
            </div>
          ))}
          <Txt x={0} y={680} w={1080} fs={48} bold align="center" style={{ opacity: beat(frame, S.s7, 3.4, 0.4) }}>
            {L.stat}
          </Txt>
          {Array.from({ length: 80 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 182 + (i % 20) * 36,
                top: 770 + Math.floor(i / 20) * 36,
                width: 28,
                height: 28,
                borderRadius: 6,
                background: i < COPIED_OF_80 ? "var(--hl-pink)" : "var(--hl-mint)",
                opacity: beat(frame, S.s7, 3.8 + i * 0.02, 0.1),
              }}
            />
          ))}
          <Hand x={0} y={940} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.2, 0.4), rotate: "-1deg" }}>
            {L.exam}
          </Hand>
        </div>
      )}

      {/* s8: your turn */}
      {live(frame, S.s8) && (
        <div style={{ opacity: s8 }}>
          <div style={{ position: "absolute", left: 370, top: 190, width: 340, height: 600, borderRadius: 48, border: "6px solid var(--ink)", background: "var(--paper)" }} />
          <div style={{ position: "absolute", left: 500, top: 212, width: 80, height: 10, borderRadius: 5, background: "var(--ink-3)" }} />
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={410} y1={270} x2={410} y2={560} stroke="var(--ink-3)" strokeWidth={4} strokeLinecap="round" />
            <line x1={410} y1={560} x2={670} y2={560} stroke="var(--ink-3)" strokeWidth={4} strokeLinecap="round" />
          </svg>
          <Curve xs={RUN_CURVE} x={418} y={280} w={250} h={280} top={7} p={beat(frame, S.s8, 1.6, 3.0)} />
          <div
            style={{
              position: "absolute",
              left: 410,
              top: 640,
              width: 260,
              height: 84,
              borderRadius: 42,
              background: "var(--ink)",
              color: "var(--paper)",
              display: "grid",
              placeItems: "center",
              fontSize: 38,
              fontWeight: 700,
              scale: String(1 + 0.06 * Math.max(0, Math.sin((frame - S.s8.from) / 6)) * (1 - beat(frame, S.s8, 1.6, 0.2))),
            }}
          >
            {L.start}
          </div>
          <Hand x={0} y={860} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 4.6, 0.4) }}>
            <InlineCircle p={beat(frame, S.s8, 5.0, 0.6)} pad={30}>
              {L.noServer}
            </InlineCircle>
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch94.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
