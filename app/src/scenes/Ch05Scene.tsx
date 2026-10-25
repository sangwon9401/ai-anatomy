import type { CSSProperties, FC } from "react";
import { useCurrentFrame } from "remotion";
import { PIPELINE, ch05, type Part } from "../data/ch05";
import { Caption, Narration, Chip, EASE_IO, Hand, InlineCircle, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "./kit";

const tl = buildTimeline(ch05);
const S = byId(tl);
const L = ch05.labels;

const SX = 230;
const SW = 620;
const SH = 80;
const IN_SX = 262;
const IN_SW = 556;
// y of each pipeline part, top to bottom
const Y: Record<string, number> = { tok: 220, emb: 316, pos: 412, att: 556, ffn: 660, out: 796, loop: 892 };
const BRACKET = { top: 516, bottom: 760 };
const OUT_Y = 998;

const INPUT = L.input.split(" ");
const IN_W = INPUT.map((w) => chipWidth(w, 44));
const IN_X = rowLayout(IN_W, 14);

// when each part appears: [step, seconds]
const SHOW: Record<string, [string, number]> = {
  tok: ["s2", 1.2],
  emb: ["s2", 3.0],
  pos: ["s2", 5.0],
  att: ["s3", 1.0],
  ffn: ["s3", 2.8],
  out: ["s4", 0.3],
  loop: ["s4", 1.6],
};

const Slot: FC<{ part: Part; o: number; empty: number }> = ({ part, o, empty }) => {
  const inner = part.key === "att" || part.key === "ffn";
  const base: CSSProperties = {
    position: "absolute",
    left: inner ? IN_SX : SX,
    top: Y[part.key],
    width: inner ? IN_SW : SW,
    height: SH,
    borderRadius: 16,
    padding: "8px 26px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };
  return (
    <div style={{ opacity: o, translate: `${mix(-24, 0, o)}px 0px` }}>
      <div style={{ ...base, background: `var(--hl-${part.color})`, color: "var(--chip-ink)", opacity: 1 - empty }}>
        <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>{part.name}</div>
        <div style={{ fontSize: 24, lineHeight: 1.3, opacity: 0.85 }}>{part.does}</div>
      </div>
      <div style={{ ...base, background: "var(--paper)", border: "3px dashed var(--ink-3)", color: "var(--ink-3)", opacity: empty }}>
        <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>{part.name}</div>
        <div style={{ fontSize: 24, lineHeight: 1.3 }}>{L.empty}</div>
      </div>
      {inner ? (
        <Hand x={IN_SX + IN_SW - 110} y={Y[part.key] + 18} fs={32} color="var(--chip-ink)" style={{ opacity: 0.8 }}>
          {part.where}
        </Hand>
      ) : (
        <Hand x={870} y={Y[part.key] + 18} fs={32} color="var(--ink-2)">
          {part.where}
        </Hand>
      )}
    </div>
  );
};

const Card: FC<{ y: number; title: string; sub?: string; o: number; color: string }> = ({ y, title, sub, o, color }) => (
  <div
    style={{
      position: "absolute",
      left: 190,
      width: 700,
      top: y,
      padding: "18px 30px",
      borderRadius: 20,
      background: color,
      color: "var(--chip-ink)",
      opacity: o,
      translate: `0px ${mix(20, 0, o)}px`,
    }}
  >
    <div style={{ fontSize: 42, fontWeight: 700 }}>{title}</div>
    {sub && <div style={{ fontSize: 30, marginTop: 4 }}>{sub}</div>}
  </div>
);

const Down: FC<{ y: number; o: number }> = ({ y, o }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontSize: 52, fontWeight: 700, opacity: o }}>↓</div>
);

export const Ch05Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const boxIn = beat(frame, S.s1, 0.8, 0.6);
  const boxOpen = beat(frame, S.s2, 0, 0.9, EASE_IO);
  const overlay = beat(frame, S.s5, 0, 0.6) * (1 - beat(frame, S.s7, 0, 0.6));
  const dim = mix(1, 0.08, overlay);
  const emptyT = beat(frame, S.s7, 1.6, 0.8);
  const shown = (key: string) => {
    const [step, t] = SHOW[key];
    return beat(frame, S[step], t, 0.5);
  };

  const outW = chipWidth(L.output, 46);
  const loopP = beat(frame, S.s4, 3.0, 1.4);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      <div style={{ opacity: dim }}>
        {INPUT.map((w, i) => (
          <Chip
            key={w}
            text={w}
            color={null}
            fs={44}
            x={IN_X[i]}
            y={110}
            style={{ background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)", opacity: beat(frame, S.s1, 0.2 + i * 0.15, 0.4) }}
          />
        ))}

        {/* block bracket + the stack of layers behind it */}
        {[3, 2, 1].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: SX + k * 12,
              top: BRACKET.top + k * 12,
              width: SW,
              height: BRACKET.bottom - BRACKET.top,
              borderRadius: 22,
              border: "3px solid var(--grid-major)",
              background: "var(--paper)",
              opacity: beat(frame, S.s3, 4.4 + (3 - k) * 0.2, 0.4),
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: SX,
            top: BRACKET.top,
            width: SW,
            height: BRACKET.bottom - BRACKET.top,
            borderRadius: 22,
            border: "4px dashed var(--ink-3)",
            background: "var(--paper)",
            opacity: beat(frame, S.s3, 0.3, 0.5),
          }}
        />
        <div style={{ position: "absolute", left: SX + 24, top: BRACKET.top + 6, fontSize: 28, fontWeight: 500, color: "var(--ink-2)", opacity: beat(frame, S.s3, 0.5, 0.4) }}>
          {L.block}
        </div>
        <Hand x={900} y={580} fs={44} style={{ opacity: beat(frame, S.s3, 4.0, 0.4) }}>
          {L.blockLayers}
        </Hand>
        <div style={{ position: "absolute", left: 896, top: 636, fontSize: 24, color: "var(--ink-2)", opacity: beat(frame, S.s3, 4.4, 0.4) }}>{L.gpt3}</div>

        {PIPELINE.map((p) => (
          <Slot key={p.key} part={p} o={shown(p.key)} empty={p.filled ? 0 : emptyT} />
        ))}

        <Chip
          text={L.output}
          color="mint"
          fs={46}
          x={540 - outW / 2}
          y={OUT_Y}
          style={{ opacity: beat(frame, S.s1, 2.0, 0.4), scale: String(mix(0.6, 1, beat(frame, S.s1, 2.0, 0.4))) }}
        />

        {/* loop back to the top */}
        <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path
            d={`M ${540 - outW / 2 - 12} ${OUT_Y + 34} L 150 ${OUT_Y + 34} Q 110 ${OUT_Y + 34} 110 ${OUT_Y - 6} L 110 190 Q 110 150 150 150 L ${IN_X[0] - 16} 150`}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - loopP}
            fill="none"
            stroke="var(--pen)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={loopP > 0 ? 1 : 0}
          />
        </svg>
        <Hand x={24} y={560} fs={38} style={{ opacity: beat(frame, S.s4, 4.2, 0.4), width: 80, whiteSpace: "normal", lineHeight: 1.1 }}>
          {L.again}
        </Hand>

        {/* s1: the closed machine */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 200,
            width: 680,
            height: 760,
            borderRadius: 32,
            border: "6px solid var(--ink)",
            background: "var(--paper-2)",
            display: "grid",
            placeItems: "center",
            fontSize: 130,
            fontWeight: 700,
            opacity: boxIn * (1 - boxOpen),
            scale: String(mix(1, 1.08, boxOpen)),
          }}
        >
          {L.gpt}
        </div>

        <div style={{ position: "absolute", right: 40, top: 112, opacity: beat(frame, S.s7, 2.6, 0.4) }}>
          <span style={{ fontSize: 30, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 10, padding: "6px 14px" }}>
            {L.data} {L.filled}
          </span>
        </div>
      </div>

      {/* s5–s6: how the numbers get good */}
      {overlay > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: overlay }}>
          <div style={{ opacity: 1 - beat(frame, S.s6, 0, 0.4) }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 64, fontWeight: 700 }}>{L.pretrain}</div>
            <Card y={330} title={L.data} sub={L.web} o={beat(frame, S.s5, 0.8, 0.5)} color="var(--hl-sky)" />
            <Down y={478} o={beat(frame, S.s5, 1.6, 0.3)} />
            <Card y={550} title={L.practice} o={beat(frame, S.s5, 2.0, 0.5)} color="var(--hl-yellow)" />
            <Down y={660} o={beat(frame, S.s5, 2.8, 0.3)} />
            <Card y={730} title={L.fix} o={beat(frame, S.s5, 3.2, 0.5)} color="var(--hl-mint)" />
            <Hand x={190} y={880} fs={50} style={{ opacity: beat(frame, S.s5, 4.4, 0.4) }}>
              {L.mess}
            </Hand>
            <div style={{ position: "absolute", left: 190, top: 950, fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s5, 5.2, 0.4) }}>{L.numbers}</div>
          </div>
          {frame >= S.s6.from && (
            <div style={{ opacity: beat(frame, S.s6, 0.3, 0.4) }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 64, fontWeight: 700 }}>{L.chat}</div>
              <Card y={330} title={L.sft} sub={L.ch73} o={beat(frame, S.s6, 0.7, 0.5)} color="var(--hl-violet)" />
              <Card y={500} title={L.rlhf} sub={L.ch76} o={beat(frame, S.s6, 1.6, 0.5)} color="var(--hl-pink)" />
              <Down y={650} o={beat(frame, S.s6, 2.6, 0.3)} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", opacity: beat(frame, S.s6, 3.0, 0.5), scale: String(mix(0.7, 1, beat(frame, S.s6, 3.0, 0.5))) }}>
                <span style={{ fontSize: 80, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 18, padding: "6px 34px" }}>{L.chatgpt}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <Hand x={720} y={980} fs={72} style={{ opacity: beat(frame, S.s7, 4.6, 0.4), rotate: "-8deg" }}>
        <InlineCircle p={beat(frame, S.s7, 5.0, 0.6)}>{L.go}</InlineCircle>
      </Hand>

      <Narration tl={tl} chapter={ch05.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
