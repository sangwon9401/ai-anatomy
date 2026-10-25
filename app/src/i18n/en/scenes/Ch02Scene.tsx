import type { CSSProperties, FC } from "react";
import { useCurrentFrame } from "remotion";
import { ANSWER, BRANCH, END, MISTAKE, QUESTION, ch02 } from "../../../data/ch02";
import {
  Caption,
  Narration,
  Chip,
  EASE_IO,
  Hand,
  InlineCircle,
  Paper,
  PenCircle,
  PenUnderline,
  Tag,
  beat,
  buildTimeline,
  byId,
  chipWidth,
  mix,
  textWidth,
  wrapLayout,
  type SceneProps,
} from "../../../scenes/kit";

const tl = buildTimeline(ch02);
const S = byId(tl);
const L = ch02.labels;

const FS = 46;
const OUTLINE: CSSProperties = { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" };
const DARK: CSSProperties = { background: "var(--ink)", color: "var(--paper)" };

const STRIP = [...QUESTION, ...ANSWER];
const SW = STRIP.map((w) => chipWidth(w, FS));
const SP = wrapLayout(SW, { y0: 120 });
const SHOWN = QUESTION.length + 5; // question + the five pieces already written in the chat

const MX = 300;
const MY = 470;
const MW = 480;
const MH = 230;
const OUT_Y = 790;
const outX = (w: string) => 540 - chipWidth(w, FS) / 2;

const MFS = 52;
const MSTRIP = [...MISTAKE.question, ...MISTAKE.answer];
const MW_ = MSTRIP.map((w) => chipWidth(w, MFS));
const MP = wrapLayout(MW_, { y0: 180, lineH: 96 });
const MQ = MISTAKE.question.length;

const Arrow: FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string }> = ({ x1, y1, x2, y2, p, color = "var(--ink)" }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: p > 0 ? 1 : 0 }}>
    <line x1={x1} y1={y1} x2={mix(x1, x2, p)} y2={mix(y1, y2, p)} stroke={color} strokeWidth={6} strokeLinecap="round" />
    {p > 0.95 && <path d={`M ${x2 - 14} ${y2 - 16} L ${x2} ${y2} L ${x2 + 14} ${y2 - 16}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

export const Ch02Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const chatOut = 1 - beat(frame, S.s2, 0, 0.5);
  const machineOn = beat(frame, S.s2, 0.6, 0.6) * (1 - beat(frame, S.s5, 0, 0.5));
  const stripOn = 1 - beat(frame, S.s6, 0, 0.5);
  const countOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const mistakeOn = 1 - beat(frame, S.s7, 0, 0.5);

  // three trips round the loop: [pop at, fly start] in seconds within the step
  const rounds = [
    { w: ANSWER[5], step: S.s2, pop: 3.0, flyStep: S.s3, fly: 0.2 },
    { w: ANSWER[6], step: S.s3, pop: 2.4, flyStep: S.s3, fly: 3.0 },
    { w: ANSWER[7], step: S.s3, pop: 5.0, flyStep: S.s3, fly: 5.6 },
  ];
  const pulse = (t: number) => Math.max(0, 1 - Math.abs(frame - (S.s3.from + t * 30)) / 12);
  const inPulse = Math.max(pulse(1.8), pulse(4.4), Math.max(0, 1 - Math.abs(frame - (S.s2.from + 2.4 * 30)) / 12), Math.max(0, 1 - Math.abs(frame - (S.s4.from + 0.1 * 30)) / 12));

  const userQ = QUESTION.join(" ");
  const userW = textWidth(userQ, 48) + 70;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the chat as students know it */}
      {frame < S.s2.from + 20 && (
        <div style={{ opacity: chatOut }}>
          <div
            style={{
              position: "absolute",
              left: 1020 - userW,
              top: 150,
              width: userW,
              padding: "18px 35px",
              fontSize: 48,
              fontWeight: 500,
              background: "var(--hl-sky)",
              color: "var(--chip-ink)",
              borderRadius: "34px 34px 8px 34px",
              opacity: beat(frame, S.s1, 0.1, 0.4),
            }}
          >
            {userQ}
          </div>
          <div style={{ position: "absolute", left: 64, top: 270, fontSize: 30, color: "var(--ink-3)", opacity: beat(frame, S.s1, 0.6, 0.3) }}>ChatGPT</div>
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 320,
              width: 860,
              padding: "22px 34px",
              fontSize: 48,
              lineHeight: 1.5,
              background: "var(--paper-2)",
              border: "2px solid var(--line)",
              borderRadius: "34px 34px 34px 8px",
              opacity: beat(frame, S.s1, 0.6, 0.3),
            }}
          >
            {ANSWER.slice(0, 5).map((w, i) => (
              <span key={i} style={{ opacity: beat(frame, S.s1, 0.9 + i * 0.75, 0.15) }}>
                {w}{" "}
              </span>
            ))}
            <span style={{ display: "inline-block", width: 5, height: 50, background: "var(--ink)", verticalAlign: "-8px", opacity: Math.floor(frame / 12) % 2 ? 1 : 0 }} />
          </div>
          <Hand x={560} y={560} fs={54} style={{ opacity: beat(frame, S.s1, 4.4, 0.4), rotate: "-3deg" }}>
            {L.really}
          </Hand>
        </div>
      )}

      {/* s2–s5: the strip of text so far */}
      {frame >= S.s2.from && frame < S.s6.from + 20 && (
        <div style={{ opacity: stripOn }}>
          {STRIP.map((w, i) => {
            if (i >= SHOWN) {
              const r = rounds[i - SHOWN];
              const fly = beat(frame, r.flyStep, r.fly, 1.0, EASE_IO);
              if (fly <= 0) return null;
              return (
                <Chip key={i} text={w} color="mint" fs={FS} x={mix(outX(w), SP[i].x, fly)} y={mix(OUT_Y, SP[i].y, fly)} />
              );
            }
            const a = beat(frame, S.s2, 0.4 + i * 0.07, 0.4);
            return <Chip key={i} text={w} color={i < QUESTION.length ? null : "mint"} fs={FS} x={SP[i].x} y={SP[i].y} style={{ ...(i < QUESTION.length ? OUTLINE : {}), opacity: a }} />;
          })}
        </div>
      )}

      {/* the machine */}
      {frame >= S.s2.from && frame < S.s5.from + 20 && (
        <div style={{ opacity: machineOn }}>
          <div
            style={{
              position: "absolute",
              left: MX,
              top: MY,
              width: MW,
              height: MH,
              border: "5px solid var(--ink)",
              borderRadius: 28,
              background: "var(--paper-2)",
              display: "grid",
              placeItems: "center",
              fontSize: 76,
              fontWeight: 700,
            }}
          >
            {L.model}
          </div>
          <Arrow x1={540} y1={385} x2={540} y2={MY - 10} p={beat(frame, S.s2, 1.0, 0.5)} color={inPulse > 0 ? "var(--pen)" : "var(--ink)"} />
          <Hand x={570} y={384} fs={38} color="var(--ink-2)" style={{ opacity: beat(frame, S.s2, 1.3, 0.4) }}>
            {L.soFar}
          </Hand>
          <Arrow x1={540} y1={MY + MH + 8} x2={540} y2={OUT_Y - 8} p={beat(frame, S.s2, 2.6, 0.4)} />
          <Hand x={740} y={OUT_Y + 6} fs={38} color="var(--ink-2)" style={{ opacity: beat(frame, S.s2, 3.2, 0.4) * (1 - beat(frame, S.s3, 0.8, 0.3)) }}>
            ← {L.next}
          </Hand>

          {rounds.map((r, i) => {
            const pop = beat(frame, r.step, r.pop, 0.4);
            const fly = beat(frame, r.flyStep, r.fly, 0.05);
            if (pop <= 0 || fly >= 1) return null;
            return <Chip key={i} text={r.w} color="mint" fs={FS} x={outX(r.w)} y={OUT_Y} style={{ opacity: pop, scale: String(mix(0.5, 1, pop)) }} />;
          })}

          {/* loop arrow back to the end of the strip */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d={`M 700 ${OUT_Y + 36} C 1040 ${OUT_Y + 36}, 1040 420, 960 300`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - beat(frame, S.s3, 0.4, 1.0)}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={6}
              strokeLinecap="round"
              opacity={(beat(frame, S.s3, 0.4, 0.05) > 0 ? 1 : 0) * (1 - 0.7 * beat(frame, S.s4, 1.4, 0.4))}
            />
          </svg>
          <Hand x={770} y={866} fs={42} style={{ opacity: beat(frame, S.s3, 1.2, 0.4) * (1 - beat(frame, S.s4, 1.4, 0.4)) }}>
            {L.loop}
          </Hand>
          {/* en: "autoregressive" is much longer than the Korean term, so it sits a little further left and smaller */}
          <Hand x={804} y={506} fs={40} style={{ opacity: beat(frame, S.s3, 7.0, 0.5) * (1 - beat(frame, S.s4, 1.4, 0.4)) }}>
            <InlineCircle p={beat(frame, S.s3, 7.4, 0.6)}>{L.auto}</InlineCircle>
          </Hand>

          {/* s4: the end token */}
          <Chip
            text={END}
            color={null}
            fs={FS}
            x={outX(END)}
            y={OUT_Y}
            style={{ ...DARK, opacity: beat(frame, S.s4, 0.6, 0.4), scale: String(mix(0.5, 1, beat(frame, S.s4, 0.6, 0.4))) }}
          />
          <Hand x={812} y={540} fs={70} style={{ opacity: beat(frame, S.s4, 1.6, 0.3), rotate: "-10deg", scale: String(mix(1.4, 1, beat(frame, S.s4, 1.6, 0.3))) }}>
            <InlineCircle p={beat(frame, S.s4, 1.8, 0.5)}>{L.stop}</InlineCircle>
          </Hand>
          <Hand x={80} y={OUT_Y + 110} fs={44} style={{ opacity: beat(frame, S.s4, 2.6, 0.4) }}>
            {L.end}
          </Hand>
        </div>
      )}

      {/* s5: one piece = one run */}
      {frame >= S.s5.from && frame < S.s6.from + 20 && (
        <div style={{ opacity: countOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.count}</div>
          {Array.from({ length: 9 }, (_, i) => {
            const on = beat(frame, S.s5, 0.8 + i * 0.13, 0.2);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 116 + i * 96,
                  top: 540,
                  width: 80,
                  height: 80,
                  borderRadius: 14,
                  border: "3px solid var(--ink)",
                  background: on > 0.5 ? (i === 8 ? "var(--ink)" : "var(--hl-mint)") : "var(--paper)",
                  color: i === 8 && on > 0.5 ? "var(--paper)" : "var(--ink)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 34,
                }}
              >
                {i + 1}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 680, textAlign: "center", fontSize: 44, fontWeight: 500, opacity: beat(frame, S.s5, 2.4, 0.4) }}>
            {L.hundred}
          </div>
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 363 + (i % 10) * 36,
                top: 760 + Math.floor(i / 10) * 36,
                width: 30,
                height: 30,
                borderRadius: 6,
                background: beat(frame, S.s5, 2.7 + i * 0.016, 0.05) > 0.5 ? "var(--hl-mint)" : "var(--grid-major)",
              }}
            />
          ))}
          <Hand x={760} y={900} fs={46} style={{ opacity: beat(frame, S.s5, 4.8, 0.4), rotate: "-3deg" }}>
            {L.longer}
          </Hand>
        </div>
      )}

      {/* s6: no erasing */}
      {frame >= S.s6.from && frame < S.s7.from + 20 && (
        <div style={{ opacity: mistakeOn }}>
          {MSTRIP.map((w, i) => {
            const ai = i - MQ;
            const t = i < MQ ? 0.4 : ai < 3 ? 0.9 + ai * 0.3 : 3.4 + (ai - 3) * 0.3;
            const a = beat(frame, S.s6, t, 0.3);
            return (
              <Chip
                key={i}
                text={w}
                color={i < MQ ? null : "mint"}
                fs={MFS}
                x={MP[i].x}
                y={MP[i].y}
                style={{ ...(i < MQ ? OUTLINE : {}), opacity: a, translate: `0px ${mix(14, 0, a)}px` }}
              />
            );
          })}
          <PenCircle
            x={MP[MQ + MISTAKE.wrong].x - 16}
            y={MP[MQ + MISTAKE.wrong].y - 12}
            w={MW_[MQ + MISTAKE.wrong] + 32}
            h={MFS * 1.5 + 24}
            p={beat(frame, S.s6, 1.9, 0.6)}
          />
          <Hand x={100} y={520} fs={50} style={{ opacity: beat(frame, S.s6, 2.4, 0.4) }}>
            {L.noErase}
          </Hand>
          <PenUnderline
            x={MP[MQ + MISTAKE.fix].x}
            y={MP[MQ + MISTAKE.fix].y + MFS * 1.5 + 4}
            w={MP[MQ + MISTAKE.fix + 1].x + MW_[MQ + MISTAKE.fix + 1] - MP[MQ + MISTAKE.fix].x}
            p={beat(frame, S.s6, 5.3, 0.6)}
          />
          <Hand x={100} y={610} fs={50} style={{ opacity: beat(frame, S.s6, 5.8, 0.4) }}>
            {L.fixLater}
          </Hand>
        </div>
      )}

      {/* s7: same question, different draws */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          {wrapLayout(QUESTION.map((w) => chipWidth(w, 48)), { y0: 170 }).map((pos, i) => (
            <Chip key={i} text={QUESTION[i]} color={null} fs={48} x={pos.x} y={pos.y} style={OUTLINE} />
          ))}
          <Chip text={BRANCH.prefix[0]} color="mint" fs={48} x={80} y={520} />
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {[
              { y: 430, p: beat(frame, S.s7, 0.9, 0.6) },
              { y: 720, p: beat(frame, S.s7, 1.6, 0.6) },
            ].map((b, i) => (
              <path
                key={i}
                d={`M 270 556 C 320 556, 320 ${b.y + 36}, 370 ${b.y + 36}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - b.p}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={6}
                strokeLinecap="round"
              />
            ))}
          </svg>
          {[
            { words: BRANCH.a.words, p: BRANCH.a.p, y: 400, t: 1.2, c: "yellow" as const },
            { words: BRANCH.b.words, p: BRANCH.b.p, y: 690, t: 1.9, c: "sky" as const },
          ].map((b) => {
            const pos = wrapLayout(b.words.map((w) => chipWidth(w, 44)), { x0: 380, y0: b.y, maxW: 660 });
            return (
              <div key={b.y}>
                {b.words.map((w, i) => (
                  <Chip key={w} text={w} color={b.c} fs={44} x={pos[i].x} y={pos[i].y} style={{ opacity: beat(frame, S.s7, b.t + i * 0.3, 0.3) }} />
                ))}
                <div
                  style={{
                    position: "absolute",
                    left: 250,
                    top: b.y < 600 ? b.y - 50 : b.y + 80,
                    fontFamily: "var(--font-mono)",
                    fontSize: 36,
                    fontWeight: 500,
                    opacity: beat(frame, S.s7, b.t, 0.4),
                  }}
                >
                  {Math.round(b.p * 100)}%
                </div>
              </div>
            );
          })}
          <Hand x={120} y={900} fs={52} style={{ opacity: beat(frame, S.s7, 3.6, 0.4), rotate: "-2deg" }}>
            {L.sample}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch02.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
