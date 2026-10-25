import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CHO, JONG, JUNG, NEXT_TO_GA, WORLD, ch28, utf8 } from "../data/ch28";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, hl, mix, type SceneProps } from "./kit";
import { GlyphCard, Line, NumBox, PenArrow, Svg } from "./part3-kit";

const tl = buildTimeline(ch28);
const S = byId(tl);
const L = ch28.labels;

// s3: the three sounds of '한' and where they sit inside the syllable block
const PARTS = [
  { j: "ㅎ", name: L.cho, c: "sky" as const, idx: 18, from: [210, 330], to: [478, 660] },
  { j: "ㅏ", name: L.jung, c: "yellow" as const, idx: 0, from: [540, 330], to: [608, 660] },
  { j: "ㄴ", name: L.jong, c: "pink" as const, idx: 4, from: [870, 330], to: [540, 800] },
];

// s4: the three jamo lists
const COLS = [
  { title: L.cho, n: 19, items: CHO, pick: 18, c: "sky" as const, x: 70 },
  { title: L.jung, n: 21, items: JUNG, pick: 0, c: "yellow" as const, x: 390 },
  { title: L.jong, n: 28, items: JONG, pick: 4, c: "pink" as const, x: 710 },
];
const CELL = 60;

const HAN_BYTES = utf8("한");

export const Ch28Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2On = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const s3On = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const s4On = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const fOn = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);

  // s6: the slots get their numbers
  const filled = beat(frame, S.s6, 1.6, 0.5);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: recap from ch06 */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Line y={220} fs={50} weight={500} o={beat(frame, S.s1, 0.3, 0.5)}>
            {L.recap}
          </Line>
          <GlyphCard x={190} y={390} size={300} glyph="가" fs={190} style={{ opacity: beat(frame, S.s1, 0.8, 0.5) }} />
          <div style={{ position: "absolute", left: 530, top: 480, fontSize: 90, fontWeight: 700, color: "var(--ink-3)", opacity: beat(frame, S.s1, 1.4, 0.4) }}>→</div>
          <Chip text="44032" color="yellow" fs={72} x={650} y={486} style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s1, 1.6, 0.5) }} />
          <Hand x={0} y={800} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.4, 0.5) }}>
            {L.how}
          </Hand>
        </div>
      )}

      {/* s2: one table for the world */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          <Line y={190} fs={56}>
            {L.unicode}
          </Line>
          {WORLD.map((w, i) => {
            const x = 75 + i * 240;
            const a = beat(frame, S.s2, 1.0 + i * 1.2, 0.5);
            return (
              <div key={w.ch} style={{ opacity: a, translate: `0px ${mix(30, 0, a)}px` }}>
                <GlyphCard x={x} y={360} size={210} glyph={w.ch} fs={120} />
                <div style={{ position: "absolute", left: x, width: 210, top: 590, textAlign: "center", fontSize: 40, color: "var(--ink-3)" }}>↓</div>
                <div style={{ position: "absolute", left: x - 15, width: 240, top: 650, display: "flex", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 500, padding: "6px 16px", borderRadius: 12, background: hl(w.c), color: "var(--chip-ink)" }}>{w.code}</span>
                </div>
              </div>
            );
          })}
          <Hand x={0} y={830} fs={62} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 6.4, 0.5), rotate: "-2deg" }}>
            <InlineCircle p={beat(frame, S.s2, 6.9, 0.6)}>{L.many}</InlineCircle>
          </Hand>
        </div>
      )}

      {/* s3: ㅎ + ㅏ + ㄴ = 한 */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          {PARTS.map((p, i) => {
            const a = beat(frame, S.s3, 0.5 + i * 0.6, 0.5);
            return (
              <div key={p.j} style={{ opacity: a }}>
                <GlyphCard x={p.from[0] - 85} y={p.from[1] - 85} size={170} glyph={p.j} fs={110} color={p.c} />
                <div style={{ position: "absolute", left: p.from[0] - 150, width: 300, top: p.from[1] + 100, textAlign: "center", fontSize: 38, fontWeight: 700 }}>{p.name}</div>
              </div>
            );
          })}
          {/* the syllable block */}
          <div
            style={{
              position: "absolute",
              left: 380,
              top: 560,
              width: 320,
              height: 340,
              borderRadius: 30,
              border: "4px dashed var(--ink-3)",
              opacity: beat(frame, S.s3, 2.4, 0.4),
            }}
          />
          {PARTS.map((p, i) => {
            const m = beat(frame, S.s3, 2.8 + i * 0.35, 0.9, EASE_IO);
            const gone = beat(frame, S.s3, 4.6, 0.5);
            if (m <= 0) return null;
            return (
              <div
                key={`fly${p.j}`}
                style={{
                  position: "absolute",
                  left: mix(p.from[0], p.to[0], m) - 70,
                  top: mix(p.from[1], p.to[1], m) - 70,
                  width: 140,
                  height: 140,
                  display: "grid",
                  placeItems: "center",
                  fontSize: mix(110, 130, m),
                  fontWeight: 700,
                  color: "var(--ink)",
                  opacity: 1 - gone,
                }}
              >
                <span style={{ background: hl(p.c), color: "var(--chip-ink)", borderRadius: 12, padding: "0 8px", lineHeight: 1.1 }}>{p.j}</span>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 380,
              top: 560,
              width: 320,
              height: 340,
              display: "grid",
              placeItems: "center",
              fontSize: 270,
              fontWeight: 700,
              lineHeight: 1,
              opacity: beat(frame, S.s3, 4.6, 0.5),
            }}
          >
            {L.han}
          </div>
          <Line y={950} fs={56} o={beat(frame, S.s3, 5.2, 0.4)}>
            {L.eq}
          </Line>
        </div>
      )}

      {/* s4: 19 × 21 × 28 */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          {COLS.map((col, ci) => {
            const ta = beat(frame, S.s4, 0.3 + ci * 1.0, 0.4);
            return (
              <div key={col.title}>
                <div style={{ position: "absolute", left: col.x, width: 300, top: 170, textAlign: "center", fontSize: 38, fontWeight: 700, opacity: ta }}>
                  {col.title} <span style={{ fontFamily: "var(--font-mono)", background: hl(col.c), color: "var(--chip-ink)", borderRadius: 10, padding: "0 10px" }}>{col.n}</span>
                </div>
                {col.items.map((j, k) => {
                  const a = beat(frame, S.s4, 0.5 + ci * 1.0 + k * 0.03, 0.25);
                  const pick = k === col.pick;
                  return (
                    <div
                      key={k}
                      style={{
                        position: "absolute",
                        left: col.x + (k % 5) * CELL,
                        top: 260 + Math.floor(k / 5) * CELL,
                        width: CELL - 6,
                        height: CELL - 6,
                        borderRadius: 10,
                        border: j === "" ? "3px dashed var(--ink-3)" : "2px solid var(--line)",
                        background: pick ? hl(col.c) : "var(--paper)",
                        color: pick ? "var(--chip-ink)" : "var(--ink)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 48,
                        fontWeight: 500,
                        opacity: a,
                      }}
                    >
                      {j}
                    </div>
                  );
                })}
              </div>
            );
          })}
          <Hand x={712} y={624} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, S.s4, 2.8, 0.4) }}>
            ↑ {L.none}
          </Hand>
          <Line y={720} fs={64} mono weight={500} o={beat(frame, S.s4, 3.8, 0.5)}>
            19 × 21 × 28 = <InlineCircle p={beat(frame, S.s4, 4.6, 0.6)}>11,172</InlineCircle>
          </Line>
          <Hand x={0} y={860} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 5.6, 0.5) }}>
            {L.all}
          </Hand>
        </div>
      )}

      {/* s5–s6: the formula */}
      {frame >= S.s5.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: fOn }}>
          <Line y={150} fs={48} o={beat(frame, S.s5, 0.3, 0.4) * (1 - beat(frame, S.s6, 0, 0.4))}>
            {L.formula}
          </Line>
          {/* s6: the three sound numbers */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", gap: 30, opacity: beat(frame, S.s6, 0.3, 0.5) }}>
            {PARTS.map((p) => (
              <span key={p.j} style={{ fontSize: 46, fontWeight: 700, padding: "4px 20px", borderRadius: 14, background: hl(p.c), color: "var(--chip-ink)" }}>
                {p.j} = <span style={{ fontFamily: "var(--font-mono)" }}>{p.idx}</span>
              </span>
            ))}
          </div>
          {(() => {
            const slot = (k: number, w: number) => (
              <span
                style={{
                  display: "inline-grid",
                  placeItems: "center",
                  width: w,
                  height: 82,
                  borderRadius: 14,
                  background: hl(PARTS[k].c),
                  color: "var(--chip-ink)",
                  position: "relative",
                  fontWeight: 700,
                }}
              >
                <span style={{ position: "absolute", fontSize: 34, opacity: 1 - filled }}>{PARTS[k].name}</span>
                <span style={{ position: "absolute", fontFamily: "var(--font-mono)", fontSize: 54, opacity: filled }}>{PARTS[k].idx}</span>
              </span>
            );
            const row = { display: "flex", justifyContent: "center", alignItems: "center", gap: 14, fontFamily: "var(--font-mono)", fontSize: 54, fontWeight: 500 } as const;
            return (
              <>
                <div style={{ position: "absolute", left: 60, right: 60, top: 280, ...row, justifyContent: "flex-start", paddingLeft: 90, opacity: beat(frame, S.s5, 0.8, 0.5) }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}>{L.num}</span> = <span style={{ borderBottom: "6px solid var(--pen)" }}>44032</span>
                </div>
                <Hand x={560} y={282} fs={46} style={{ opacity: beat(frame, S.s5, 2.0, 0.4) * (1 - beat(frame, S.s6, 0, 0.4)) }}>
                  ← {L.start}
                </Hand>
                <div style={{ position: "absolute", left: 60, right: 60, top: 390, ...row, opacity: beat(frame, S.s5, 3.0, 0.5) }}>
                  + ( {slot(0, 170)} × 21 + {slot(1, 220)} ) × 28
                </div>
                <div style={{ position: "absolute", left: 60, right: 60, top: 500, ...row, justifyContent: "flex-start", paddingLeft: 90, opacity: beat(frame, S.s5, 4.4, 0.5) }}>
                  + {slot(2, 170)}
                </div>
              </>
            );
          })()}
          {/* s6: compute */}
          <Line y={650} fs={50} mono weight={500} o={beat(frame, S.s6, 2.6, 0.5)}>
            {L.calc1}
          </Line>
          <Line y={740} fs={50} mono weight={500} o={beat(frame, S.s6, 3.8, 0.5)}>
            {L.calc2}
          </Line>
          <div style={{ position: "absolute", left: 0, right: 0, top: 870, display: "flex", justifyContent: "center", opacity: beat(frame, S.s6, 5.0, 0.5) }}>
            <span style={{ fontSize: 60, fontWeight: 700, padding: "6px 28px", borderRadius: 16, background: "var(--hl-yellow)", color: "var(--chip-ink)" }}>
              한 = <span style={{ fontFamily: "var(--font-mono)" }}>54620</span>
            </span>
          </div>
          <PenCircle x={330} y={846} w={420} h={140} p={beat(frame, S.s6, 5.6, 0.7)} />
          <Hand x={0} y={1000} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 6.2, 0.4) }}>
            {L.real}
          </Hand>
        </div>
      )}

      {/* s7: neighbours by number */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          {NEXT_TO_GA.map((g, i) => {
            const x = 88 + i * 186;
            const a = beat(frame, S.s7, 0.5 + i * 0.5, 0.4);
            return (
              <div key={g.ch} style={{ opacity: a }}>
                <GlyphCard x={x} y={230} size={160} glyph={g.ch} fs={100} color={i === 0 ? "yellow" : null} />
                <div style={{ position: "absolute", left: x - 20, width: 200, top: 404, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 32 }}>{g.code}</div>
              </div>
            );
          })}
          <Svg>
            {NEXT_TO_GA.slice(1).map((_, i) => {
              const x1 = 88 + i * 186 + 110;
              const x2 = 88 + (i + 1) * 186 + 50;
              return <PenArrow key={i} x1={x1} y1={222} x2={x2} y2={222} bend={50} p={beat(frame, S.s7, 0.8 + i * 0.5, 0.4)} />;
            })}
          </Svg>
          {NEXT_TO_GA.slice(1).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 88 + i * 186 + 112, width: 100, top: 128, textAlign: "center", fontSize: 40, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--pen)", opacity: beat(frame, S.s7, 1.0 + i * 0.5, 0.3) }}>
              +1
            </div>
          ))}
          <Hand x={0} y={470} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.0, 0.4) }}>
            {L.plus1}
          </Hand>
          {[
            { to: L.gae, code: 44060, plus: "+28", note: L.vowel, y: 600, t: 4.2 },
            { to: L.kka, code: 44620, plus: "+588", note: L.first, y: 800, t: 5.6 },
          ].map((r) => {
            const a = beat(frame, S.s7, r.t, 0.5);
            return (
              <div key={r.to} style={{ opacity: a }}>
                <GlyphCard x={110} y={r.y} size={140} glyph={L.ga} fs={90} color="yellow" />
                <div style={{ position: "absolute", left: 270, top: r.y + 44, fontSize: 46, fontFamily: "var(--font-mono)", color: "var(--pen)", width: 190, textAlign: "center" }}>{r.plus} →</div>
                <GlyphCard x={470} y={r.y} size={140} glyph={r.to} fs={90} />
                <div style={{ position: "absolute", left: 630, top: r.y + 10, fontFamily: "var(--font-mono)", fontSize: 34, color: "var(--ink-2)" }}>{r.code}</div>
                <Hand x={630} y={r.y + 58} fs={52}>
                  {r.note}
                </Hand>
              </div>
            );
          })}
        </div>
      )}

      {/* s8: bytes */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          <Line y={150} fs={48}>
            {L.byte}
          </Line>
          {[
            { ch: "A", code: 65, bytes: [65], y: 300, t: 0.8, n: L.one },
            { ch: "한", code: 54620, bytes: HAN_BYTES, y: 560, t: 2.6, n: L.three },
          ].map((r) => {
            const a = beat(frame, S.s8, r.t, 0.5);
            return (
              <div key={r.ch} style={{ opacity: a }}>
                <GlyphCard x={70} y={r.y} size={170} glyph={r.ch} fs={110} />
                <div style={{ position: "absolute", left: 256, top: r.y + 54, fontSize: 48, color: "var(--ink-3)" }}>→</div>
                <div style={{ position: "absolute", left: 306, top: r.y + 54, fontFamily: "var(--font-mono)", fontSize: 46 }}>{r.code}</div>
                <div style={{ position: "absolute", left: 456, top: r.y + 54, fontSize: 48, color: "var(--ink-3)", opacity: beat(frame, S.s8, r.t + 0.6, 0.3) }}>→</div>
                {r.bytes.map((b, k) => (
                  <NumBox key={k} x={510 + k * 140} y={r.y + 40} w={124} h={90} fs={44} color="mint" style={{ opacity: beat(frame, S.s8, r.t + 0.8 + k * 0.3, 0.3) }}>
                    {b}
                  </NumBox>
                ))}
                <Hand x={510 + r.bytes.length * 140 + 6} y={r.y + 46} fs={60} style={{ opacity: beat(frame, S.s8, r.t + 1.4, 0.4) }}>
                  {r.n}
                </Hand>
              </div>
            );
          })}
          <Line y={820} fs={42} weight={500} color="var(--ink-2)" o={beat(frame, S.s8, 4.6, 0.5)}>
            {L.split}
          </Line>
          <Hand x={0} y={920} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 6.0, 0.5), rotate: "-1.5deg" }}>
            {L.material}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch28.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
