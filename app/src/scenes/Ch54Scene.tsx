import type { CSSProperties, FC } from "react";
import { useCurrentFrame } from "remotion";
import { PIPELINE } from "../data/ch05";
import { ch54 } from "../data/ch54";
import { BLOCK_ORDER, BLOCK_TEXT, KIND, kindOf, type BlockKey } from "../data/part6-block";
import { Block, Layer, PenArrow, WordChip, along, blockGeo, blockRoute, partCenter, wordW } from "./part6-block";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";

const tl = buildTimeline(ch54);
const S = byId(tl);
const L = ch54.labels;

const G = blockGeo("full");
const BX = 100;
const BY = 246;
const HX = BX + G.hx;
const WORDS = [L.w1, L.w2, L.w3];
const WFS = 40;
const WX = (() => {
  let x = 120;
  return WORDS.map((w) => {
    const at = x;
    x += wordW(w, WFS) + 14;
    return at;
  });
})();
const W_END = WX[2] + wordW(WORDS[2], WFS);
const IN_Y = 134;
const OUT_Y = 904;

// ---- s1: the ch05 blueprint, as the student last saw it (parts learned so far are filled) ----
const RX = 230;
const RW = 620;
const RY: Record<string, number> = { tok: 196, emb: 270, pos: 344, att: 470, ffn: 556, out: 668, loop: 742 };
const R_BRACKET = { top: 436, bottom: 644 };
const LEARNED = new Set(["tok", "emb", "pos", "att", "loop"]);

const OldSlot: FC<{ k: string }> = ({ k }) => {
  const p = PIPELINE.find((q) => q.key === k)!;
  const inner = k === "att" || k === "ffn";
  const filled = LEARNED.has(k);
  const st: CSSProperties = {
    position: "absolute",
    left: inner ? RX + 32 : RX,
    top: RY[k],
    width: inner ? RW - 64 : RW,
    height: 64,
    boxSizing: "border-box",
    borderRadius: 14,
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    fontSize: 34,
    fontWeight: 700,
    ...(filled
      ? { background: `var(--hl-${p.color})`, color: "var(--chip-ink)" }
      : { background: "var(--paper)", border: "3px dashed var(--ink-3)", color: "var(--ink-3)" }),
  };
  return (
    <>
      <div style={st}>
        {p.name}
        {!filled && <span style={{ marginLeft: 16, fontSize: 28, fontWeight: 500 }}>{L.empty}</span>}
      </div>
      {!inner && (
        <Hand x={RX + RW + 20} y={RY[k] + 14} fs={30} color="var(--ink-2)">
          {p.where}
        </Hand>
      )}
    </>
  );
};

// ---- the part notes on the right ----
const NOTE_X = 790;
const NOTES: { kind: "att" | "ffn" | "add" | "norm"; y: number; text: string }[] = [
  { kind: "norm", y: BY + G.rows.norm1.y + 2, text: L.norm },
  { kind: "att", y: BY + G.rows.att.y + 22, text: L.att },
  { kind: "add", y: BY + G.rows.add1.y + 50, text: L.add },
  { kind: "ffn", y: BY + G.rows.ffn.y + 22, text: L.ffn },
];

// ---- s7: a dot rides the route; parts light up in the order it reaches them ----
const ROUTE = blockRoute(G);
const SAMPLES = Array.from({ length: 601 }, (_, i) => along(ROUTE, i / 600));
const REACH: Record<BlockKey, number> = Object.fromEntries(
  BLOCK_ORDER.map((k) => {
    const [cx, cy] = partCenter(G, k);
    let best = 0;
    let bd = Infinity;
    SAMPLES.forEach(([x, y], i) => {
      const d = Math.hypot(x - cx, y - cy);
      if (d < bd - 0.5) {
        bd = d;
        best = i / 600;
      }
    });
    return [k, best];
  }),
) as Record<BlockKey, number>;
const SEQ_FS = 34;
const SEQ_ROWS: BlockKey[][] = [
  ["norm1", "att", "add1"],
  ["norm2", "ffn", "add2"],
];
const ARROW_W = 52;
const seqLayout = (row: BlockKey[]) => {
  const ws = row.map((k) => chipWidth(KIND[kindOf(k)].name, SEQ_FS));
  const total = ws.reduce((a, b) => a + b, 0) + ARROW_W * (row.length - 1);
  let x = 430 - total / 2;
  return ws.map((w) => {
    const at = x;
    x += w + ARROW_W;
    return { x: at, w };
  });
};
const SEQ = SEQ_ROWS.map(seqLayout);
const DOT_START = 0.6;
const DOT_DUR = 6.4;

export const Ch54Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  // s1 → s2: the old blueprint zooms away, the open block takes its place
  const zoom = beat(frame, S.s2, 0, 1.0, EASE_IO);
  const oldOn = beat(frame, S.s1, 0.2, 0.6) * (1 - zoom);
  const blockOn = beat(frame, S.s2, 0.4, 0.8);

  const fill: Partial<Record<BlockKey, number>> = {
    att: beat(frame, S.s3, 0.4, 0.6),
    ffn: beat(frame, S.s4, 0.4, 0.6),
    add1: beat(frame, S.s5, 0.4, 0.6),
    add2: beat(frame, S.s5, 0.7, 0.6),
    norm1: beat(frame, S.s6, 0.4, 0.6),
    norm2: beat(frame, S.s6, 0.7, 0.6),
  };
  const noteOn = { att: beat(frame, S.s3, 1.6, 0.5), ffn: beat(frame, S.s4, 1.6, 0.5), add: beat(frame, S.s5, 2.4, 0.5), norm: beat(frame, S.s6, 1.6, 0.5) };

  const s7 = frame >= S.s7.from;
  const dotT = beat(frame, S.s7, DOT_START, DOT_DUR, (t) => t);
  const seqOn = beat(frame, S.s7, 0.2, 0.4) * (1 - beat(frame, S.s8, 0, 0.5));
  const outOn = beat(frame, S.s2, 2.6, 0.5) * (1 - beat(frame, S.s7, 0, 0.4)) + beat(frame, S.s8, 0.3, 0.5);
  const [dx, dy] = along(ROUTE, dotT);
  const dotO = s7 && frame < S.s8.from + 10 ? beat(frame, S.s7, DOT_START - 0.3, 0.3) * (1 - beat(frame, S.s8, 0, 0.3)) : 0;
  const layers = beat(frame, S.s8, 1.2, 1.4);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: ch05's blueprint */}
      {frame < S.s2.from + 32 && (
        <div style={{ opacity: oldOn, scale: String(mix(1, 2.2, zoom)), transformOrigin: `540px ${(R_BRACKET.top + R_BRACKET.bottom) / 2}px`, position: "absolute", inset: 0 }}>
          {WORDS.map((w, i) => (
            <WordChip key={w} text={w} x={WX[i] + 110} y={112} fs={WFS} o={beat(frame, S.s1, 0.3 + i * 0.12, 0.4)} />
          ))}
          {[3, 2, 1].map((k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: RX + k * 12,
                top: R_BRACKET.top + k * 12,
                width: RW,
                height: R_BRACKET.bottom - R_BRACKET.top,
                borderRadius: 22,
                border: "3px solid var(--grid-major)",
                background: "var(--paper)",
                opacity: beat(frame, S.s1, 3.0 + (3 - k) * 0.25, 0.4),
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: RX,
              top: R_BRACKET.top,
              width: RW,
              height: R_BRACKET.bottom - R_BRACKET.top,
              borderRadius: 22,
              border: "4px dashed var(--ink-3)",
              background: "var(--paper)",
            }}
          />
          <div style={{ position: "absolute", left: RX + 24, top: R_BRACKET.top + 2, fontSize: 28, fontWeight: 500, color: "var(--ink-2)" }}>{BLOCK_TEXT.block}</div>
          {Object.keys(RY).map((k) => (
            <OldSlot key={k} k={k} />
          ))}
          <div
            style={{
              position: "absolute",
              left: RX - 12,
              top: R_BRACKET.top - 12,
              width: RW + 24,
              height: R_BRACKET.bottom - R_BRACKET.top + 24,
              borderRadius: 28,
              border: "6px solid var(--pen)",
              opacity: beat(frame, S.s1, 4.6, 0.5),
            }}
          />
          <Hand x={0} y={836} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.6, 0.4), rotate: "-2deg" }}>
            {L.open}
          </Hand>
        </div>
      )}

      {/* s2–s8: the open block */}
      {frame >= S.s2.from && (
        <div style={{ opacity: blockOn, scale: String(mix(0.6, 1, blockOn)), transformOrigin: `${BX + G.w / 2}px ${BY + G.h / 2}px`, position: "absolute", inset: 0 }}>
          {WORDS.map((w, i) => (
            <WordChip key={w} text={w} x={WX[i]} y={IN_Y} fs={WFS} />
          ))}
          <div style={{ position: "absolute", left: W_END + 28, top: IN_Y - 6, fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s2, 1.2, 0.4) }}>
            {L.inNote}
          </div>
          <div style={{ position: "absolute", left: W_END + 28, top: IN_Y + 40, fontSize: 28, color: "var(--ink-2)", opacity: beat(frame, S.s2, 1.8, 0.4) }}>{L.inSize}</div>

          <Block x={BX} y={BY} fill={fill} layers={layers} />
          <Layer>
            <PenArrow x1={HX} y1={IN_Y + 66} x2={HX} y2={BY - 6} p={1} color="var(--ink-3)" width={5} />
            <PenArrow x1={HX} y1={BY + G.h + 4} x2={HX} y2={OUT_Y - 6} p={1} color="var(--ink-3)" width={5} />
          </Layer>

          <Chip text={L.road} color="orange" fs={36} x={NOTE_X} y={BY + G.rows.add1.y - 6} style={{ opacity: beat(frame, S.s5, 1.6, 0.5) }} />
          {NOTES.map((n) => (
            <Hand key={n.kind} x={NOTE_X} y={n.y} fs={38} style={{ opacity: noteOn[n.kind], width: 234, whiteSpace: "normal", wordBreak: "keep-all", lineHeight: 1.1 }}>
              {n.text}
            </Hand>
          ))}

          {/* output: same words, new meaning */}
          <div style={{ opacity: outOn }}>
            {WORDS.map((w, i) => (
              <WordChip key={w} text={w} x={WX[i]} y={OUT_Y} fs={WFS} color="yellow" />
            ))}
            <Hand x={W_END + 28} y={OUT_Y + 4} fs={44} style={{ opacity: frame < S.s8.from ? 1 : beat(frame, S.s8, 0.4, 0.4) }}>
              {L.outNote}
            </Hand>
          </div>

          {/* s7: the order */}
          {s7 && frame < S.s8.from + 20 && (
            <div style={{ opacity: seqOn }}>
              {SEQ_ROWS.map((row, r) =>
                row.map((k, i) => {
                  const lit = dotT >= REACH[k] - 0.01 ? 1 : 0;
                  const at = SEQ[r][i];
                  const y = 922 + r * 78;
                  return (
                    <div key={k}>
                      <Chip text={KIND[kindOf(k)].name} color={lit ? KIND[kindOf(k)].color : null} fs={SEQ_FS} x={at.x} y={y} w={at.w} style={{ opacity: mix(0.35, 1, lit) }} />
                      {i < row.length - 1 && (
                        <div style={{ position: "absolute", left: at.x + at.w, width: ARROW_W, top: y + 2, textAlign: "center", fontSize: SEQ_FS, color: "var(--ink-3)" }}>{L.arrow}</div>
                      )}
                    </div>
                  );
                }),
              )}
              <Hand x={710} y={958} fs={44} style={{ opacity: beat(frame, S.s7, DOT_START + DOT_DUR + 0.2, 0.4) }}>
                {L.oneLayer}
              </Hand>
            </div>
          )}

          {dotO > 0 && (
            <div
              style={{
                position: "absolute",
                left: BX + dx - 18,
                top: BY + dy - 18,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--ink)",
                border: "6px solid var(--hl-yellow)",
                boxSizing: "border-box",
                opacity: dotO,
              }}
            />
          )}

          {/* s8: stack it */}
          <Hand x={NOTE_X + 30} y={BY + G.h - 96} fs={60} style={{ opacity: beat(frame, S.s8, 2.4, 0.4) }}>
            {L.layers}
          </Hand>
          <div style={{ position: "absolute", left: NOTE_X + 36, top: BY + G.h - 26, fontSize: 30, color: "var(--ink-2)", opacity: beat(frame, S.s8, 2.8, 0.4) }}>{L.gpt3}</div>
        </div>
      )}

      <Narration tl={tl} chapter={ch54.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
