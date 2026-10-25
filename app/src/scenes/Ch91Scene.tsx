import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ABILITIES, CARDS, ch91 } from "../data/ch91";
import { Caption, Hand, Narration, Paper, PenUnderline, Tag, beat, buildTimeline, byId, mix, type SceneProps, type TimedStep } from "./kit";
import { Line } from "./part10-kit";

const tl = buildTimeline(ch91);
const S = byId(tl);
const L = ch91.labels;

/** One icon per card, drawn in a 100×100 box. */
const Icon: FC<{ k: string; size: number }> = ({ k, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    {k === "copy" && (
      <>
        <circle cx={50} cy={50} r={38} fill="var(--paper)" stroke="var(--ink)" strokeWidth={7} />
        <text x={50} y={67} textAnchor="middle" fontSize={50} fontWeight={700} fill="var(--ink)" fontFamily="var(--font-sans)">
          {L.c}
        </text>
      </>
    )}
    {k === "bias" && (
      <>
        <line x1={50} y1={18} x2={50} y2={86} stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" />
        <line x1={30} y1={88} x2={70} y2={88} stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" />
        <line x1={12} y1={40} x2={88} y2={24} stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" />
        <path d="M 12 40 L 2 64 L 22 64 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
        <path d="M 88 24 L 78 48 L 98 48 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
        <path d="M 0 64 Q 12 76 24 64" fill="var(--ink)" />
        <path d="M 76 48 Q 88 60 100 48" fill="var(--ink)" />
      </>
    )}
    {k === "privacy" && (
      <>
        <path d="M 30 46 V 32 a 20 20 0 0 1 40 0 V 46" fill="none" stroke="var(--ink)" strokeWidth={8} />
        <rect x={18} y={46} width={64} height={46} rx={10} fill="var(--paper)" stroke="var(--ink)" strokeWidth={6} />
        <circle cx={50} cy={66} r={6} fill="var(--ink)" />
        <line x1={50} y1={68} x2={50} y2={80} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      </>
    )}
    {k === "career" && (
      <>
        <line x1={50} y1={10} x2={50} y2={94} stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" />
        <path d="M 50 18 H 86 L 96 28 L 86 38 H 50 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={5} strokeLinejoin="round" />
        <path d="M 50 48 H 14 L 4 58 L 14 68 H 50 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={5} strokeLinejoin="round" />
      </>
    )}
  </svg>
);

const CardFace: FC<{
  i: number;
  x: number;
  y: number;
  w: number;
  h: number;
  o: number;
  rot?: number;
}> = ({ i, x, y, w, h, o, rot = 0 }) => {
  const c = CARDS[i];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 22,
        background: `var(--hl-${c.c})`,
        border: "4px solid var(--ink)",
        color: "var(--chip-ink)",
        opacity: o,
        rotate: `${rot}deg`,
        boxSizing: "border-box",
        display: "grid",
        justifyItems: "center",
        alignContent: "center",
        gap: h * 0.08,
      }}
    >
      <div
        style={{
          background: "var(--paper)",
          borderRadius: "50%",
          padding: w * 0.06,
          border: "3px solid var(--ink)",
        }}
      >
        <Icon k={c.key} size={w * 0.42} />
      </div>
      <div style={{ fontSize: Math.max(30, w * 0.18), fontWeight: 700 }}>{c.title}</div>
    </div>
  );
};

const NUMS = [L.n1, L.n2, L.n3, L.n4];
const TAGS = [L.some, L.other, L.another];
const CARD_STEPS = ["s2", "s3", "s4", "s5"];

const CardStep: FC<{ i: number; step: TimedStep; frame: number }> = ({ i, step, frame }) => {
  const c = CARDS[i];
  const viewY = 505;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 120,
          width: 960,
          height: 120,
          borderRadius: 22,
          background: `var(--hl-${c.c})`,
          border: "4px solid var(--ink)",
          color: "var(--chip-ink)",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "0 28px",
        }}
      >
        <div
          style={{
            background: "var(--paper)",
            borderRadius: "50%",
            padding: 8,
            border: "3px solid var(--ink)",
          }}
        >
          <Icon k={c.key} size={64} />
        </div>
        <span style={{ fontSize: 56, fontWeight: 700 }}>
          {NUMS[i]} {c.title}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          width: 960,
          top: 276,
          fontSize: 46,
          fontWeight: 700,
          lineHeight: 1.35,
          wordBreak: "keep-all",
          opacity: beat(frame, step, 0.6, 0.4),
        }}
      >
        {c.q}
      </div>
      {c.key === "bias" && (
        <Hand x={60} y={410} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, step, 1.4, 0.4) }}>
          {L.biasEx}
        </Hand>
      )}
      {c.sceneViews.map((v, k) => {
        const a = beat(frame, step, 2.0 + k * 1.3, 0.4);
        const left = k % 2 === 0;
        return (
          <div
            key={v}
            style={{
              opacity: a,
              translate: `${mix(left ? -24 : 24, 0, a)}px 0px`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: left ? 84 : 224,
                top: viewY + k * 165 - 40,
                fontSize: 30,
                fontWeight: 700,
                color: "var(--ink-2)",
              }}
            >
              {TAGS[k]}
            </div>
            <div
              style={{
                position: "absolute",
                left: left ? 60 : 200,
                top: viewY + k * 165,
                width: 820,
                padding: "16px 26px",
                boxSizing: "border-box",
                borderRadius: left ? "30px 30px 30px 8px" : "30px 30px 8px 30px",
                background: "var(--paper)",
                border: "3px solid var(--ink)",
                fontSize: 40,
                fontWeight: 500,
                lineHeight: 1.35,
                wordBreak: "keep-all",
              }}
            >
              {v}
            </div>
          </div>
        );
      })}
      <Hand
        x={0}
        y={960}
        fs={50}
        style={{
          width: 1080,
          textAlign: "center",
          opacity: beat(frame, step, 6.4, 0.4),
        }}
      >
        {L.me}
      </Hand>
    </>
  );
};

export const Ch91Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = 1 - beat(frame, S.s2, 0, 0.4);
  const s6On = beat(frame, S.s6, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.4));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: four cards dealt */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Line y={190} fs={60} o={beat(frame, S.s1, 0.2, 0.4)}>
            {L.cards}
          </Line>
          {CARDS.map((_, i) => {
            const a = beat(frame, S.s1, 0.8 + i * 0.35, 0.5);
            return <CardFace key={i} i={i} x={90 + i * 240} y={mix(560, 360, a)} w={220} h={300} o={a} rot={mix(12, (i - 1.5) * 3, a)} />;
          })}
          <Hand
            x={0}
            y={760}
            fs={52}
            style={{
              width: 1080,
              textAlign: "center",
              opacity: beat(frame, S.s1, 4.4, 0.4),
            }}
          >
            {L.weDecide}
          </Hand>
        </div>
      )}

      {/* s2–s5: one card each */}
      {CARD_STEPS.map((id, i) => {
        const step = S[id];
        const next = tl[step.index + 1];
        if (frame < step.from || frame >= next.from + 15) return null;
        const o = beat(frame, step, 0.1, 0.4) * (1 - beat(frame, next, 0, 0.4));
        return (
          <div key={id} style={{ opacity: o }}>
            <CardStep i={i} step={step} frame={frame} />
          </div>
        );
      })}

      {/* s6: no single answer */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          {CARDS.map((_, i) => (
            <CardFace key={i} i={i} x={80 + i * 235} y={180} w={210} h={250} o={beat(frame, S.s6, 0.4 + i * 0.15, 0.4)} rot={(i - 1.5) * 2} />
          ))}
          <Line y={560} fs={62} o={beat(frame, S.s6, 1.4, 0.4)}>
            {L.noOne}
          </Line>
          <PenUnderline x={250} y={650} w={580} p={beat(frame, S.s6, 2.0, 0.6)} />
          <Hand
            x={0}
            y={720}
            fs={48}
            style={{
              width: 1080,
              textAlign: "center",
              opacity: beat(frame, S.s6, 3.6, 0.4),
            }}
          >
            {L.know}
          </Hand>
        </div>
      )}

      {/* s7: Part 10 recap */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <Line y={200} fs={58}>
            {L.recap}
          </Line>
          <div
            style={{
              position: "absolute",
              left: 90,
              right: 90,
              top: 330,
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              justifyContent: "center",
            }}
          >
            {ABILITIES.map((a, i) => (
              <span
                key={a.t}
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  padding: "10px 24px",
                  borderRadius: 14,
                  background: `var(--hl-${a.c})`,
                  color: "var(--chip-ink)",
                  opacity: beat(frame, S.s7, 0.8 + i * 0.35, 0.3),
                  scale: String(mix(0.7, 1, beat(frame, S.s7, 0.8 + i * 0.35, 0.3))),
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 32,
                    fontWeight: 500,
                    marginRight: 12,
                  }}
                >
                  {a.ch}
                </span>
                {a.t}
              </span>
            ))}
          </div>
          <Hand
            x={0}
            y={760}
            fs={54}
            style={{
              width: 1080,
              textAlign: "center",
              opacity: beat(frame, S.s7, 4.2, 0.4),
            }}
          >
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch91.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
