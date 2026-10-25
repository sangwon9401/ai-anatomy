// ja overlay of src/scenes/Ch28Scene.tsx: the Hangul-syllable steps (s3–s7) are rebuilt around kana
// (three scripts, the hiragana block, dakuten = +1, katakana = +96). s1, s2 and s8 keep the Korean layout.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CHO, NEXT_TO_GA, WORLD, ch28, utf8 } from "../../../data/ch28";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, hl, mix, type SceneProps } from "../../../scenes/kit";
import { GlyphCard, Line, NumBox, PenArrow, Svg } from "../../../scenes/part3-kit";

const tl = buildTimeline(ch28);
const S = byId(tl);
const L = ch28.labels;

// s3: the three scripts and their blocks
const SCRIPTS = [
  { g: "あ", name: L.hira, range: L.hiraRange, c: "sky" as const, x: 210 },
  { g: "ア", name: L.kata, range: L.kataRange, c: "yellow" as const, x: 540 },
  { g: "字", name: L.kanji, range: L.kanjiRange, c: "pink" as const, x: 870 },
];

// s4: the hiragana block in rows of ten
const COLS = 10;
const CELL = 78;
const GRID_X = 540 - (COLS * CELL - 6) / 2;
const SMALL = new Set([..."ぁぃぅぇぉっゃゅょゎゕゖ"]);
const DAKU = new Set([..."がぎぐげござじずぜぞだぢづでどばぱびぴぶぷべぺぼぽゔ"]);

// s5: か and ゛ fly into one block
const PARTS = [
  { j: L.ka, name: L.base, c: "sky" as const, from: [300, 330], to: [540, 735], fs: [110, 220] },
  { j: L.mark, name: L.dakuten, c: "pink" as const, from: [780, 330], to: [672, 612], fs: [110, 150] },
];

const A_BYTES = utf8(L.a);

export const Ch28Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2On = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const s3On = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const s4On = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const s5On = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const s6On = beat(frame, S.s6, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);

  // s6: the slots get their numbers
  const filled = beat(frame, S.s6, 2.0, 0.5);
  // s4: highlight the small kana, then the voiced ones
  const smallOn = beat(frame, S.s4, 3.4, 0.5);
  const dakuOn = beat(frame, S.s4, 5.2, 0.5);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: recap from ch06 */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Line y={220} fs={50} weight={500} o={beat(frame, S.s1, 0.3, 0.5)}>
            {L.recap}
          </Line>
          <GlyphCard x={190} y={390} size={300} glyph={L.a} fs={190} style={{ opacity: beat(frame, S.s1, 0.8, 0.5) }} />
          <div style={{ position: "absolute", left: 530, top: 480, fontSize: 90, fontWeight: 700, color: "var(--ink-3)", opacity: beat(frame, S.s1, 1.4, 0.4) }}>→</div>
          <Chip text="12354" color="yellow" fs={72} x={650} y={486} style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s1, 1.6, 0.5) }} />
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

      {/* s3: three scripts, three blocks */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          {SCRIPTS.map((s, i) => {
            const a = beat(frame, S.s3, 0.5 + i * 0.9, 0.5);
            const r = beat(frame, S.s3, 3.4 + i * 0.5, 0.4);
            return (
              <div key={s.g} style={{ opacity: a }}>
                <GlyphCard x={s.x - 100} y={200} size={200} glyph={s.g} fs={128} color={s.c} />
                <div style={{ position: "absolute", left: s.x - 150, width: 300, top: 424, textAlign: "center", fontSize: 42, fontWeight: 700 }}>{s.name}</div>
                <div style={{ position: "absolute", left: s.x - 150, width: 300, top: 500, textAlign: "center", fontSize: 40, color: "var(--ink-3)", opacity: r }}>↓</div>
                <div style={{ position: "absolute", left: s.x - 160, width: 320, top: 560, display: "flex", justifyContent: "center", opacity: r }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 500, padding: "6px 14px", borderRadius: 12, border: "3px solid var(--ink)", background: "var(--paper)" }}>{s.range}</span>
                </div>
              </div>
            );
          })}
          <Line y={720} fs={50} o={beat(frame, S.s3, 5.0, 0.5)}>
            <InlineCircle p={beat(frame, S.s3, 5.6, 0.6)}>{L.blocks}</InlineCircle>
          </Line>
          <Hand x={0} y={860} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 6.4, 0.5) }}>
            {L.kanjiMany}
          </Hand>
        </div>
      )}

      {/* s4: the hiragana block */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          <Line y={128} fs={46} o={beat(frame, S.s4, 0.3, 0.4)}>
            {L.hiraTable}
          </Line>
          {CHO.map((k, i) => {
            const a = beat(frame, S.s4, 0.6 + i * 0.025, 0.25);
            const c = SMALL.has(k) ? "sky" : DAKU.has(k) ? "yellow" : null;
            const on = c === "sky" ? smallOn : c === "yellow" ? dakuOn : 0;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: GRID_X + (i % COLS) * CELL,
                  top: 206 + Math.floor(i / COLS) * CELL,
                  width: CELL - 6,
                  height: CELL - 6,
                  borderRadius: 10,
                  border: "2px solid var(--line)",
                  background: "var(--paper)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 44,
                  fontWeight: 500,
                  opacity: a,
                }}
              >
                {c && <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: hl(c), opacity: on }} />}
                <span style={{ position: "relative", color: on > 0.5 ? "var(--chip-ink)" : "var(--ink)" }}>{k}</span>
              </div>
            );
          })}
          <Chip text={L.smallNote} color="sky" fs={36} x={540 - chipWidth(L.smallNote, 36) - 16} y={924} style={{ opacity: smallOn }} />
          <Chip text={L.dakuNote} color="yellow" fs={36} x={556} y={924} style={{ opacity: dakuOn }} />
          <Hand x={0} y={1002} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 6.6, 0.5) }}>
            {L.order}
          </Hand>
        </div>
      )}

      {/* s5: か + ゛ = が */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5On }}>
          <Line y={120} fs={46} o={beat(frame, S.s5, 0.2, 0.4)}>
            {L.parts}
          </Line>
          {PARTS.map((p, i) => {
            const a = beat(frame, S.s5, 0.6 + i * 0.6, 0.5);
            return (
              <div key={p.j} style={{ opacity: a }}>
                <GlyphCard x={p.from[0] - 85} y={p.from[1] - 85} size={170} glyph={p.j} fs={110} color={p.c} />
                <div style={{ position: "absolute", left: p.from[0] - 150, width: 300, top: p.from[1] + 100, textAlign: "center", fontSize: 38, fontWeight: 700 }}>{p.name}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 540 - 40, top: 270, fontSize: 80, fontWeight: 700, color: "var(--ink-3)", opacity: beat(frame, S.s5, 1.4, 0.4) }}>＋</div>
          {/* the character block */}
          <div
            style={{
              position: "absolute",
              left: 370,
              top: 560,
              width: 340,
              height: 340,
              borderRadius: 30,
              border: "4px dashed var(--ink-3)",
              opacity: beat(frame, S.s5, 2.4, 0.4),
            }}
          />
          {PARTS.map((p, i) => {
            const m = beat(frame, S.s5, 2.8 + i * 0.35, 0.9, EASE_IO);
            const gone = beat(frame, S.s5, 4.4, 0.5);
            if (m <= 0) return null;
            const size = 240;
            return (
              <div
                key={`fly${p.j}`}
                style={{
                  position: "absolute",
                  left: mix(p.from[0], p.to[0], m) - size / 2,
                  top: mix(p.from[1], p.to[1], m) - size / 2,
                  width: size,
                  height: size,
                  display: "grid",
                  placeItems: "center",
                  fontSize: mix(p.fs[0], p.fs[1], m),
                  fontWeight: 700,
                  lineHeight: 1,
                  opacity: 1 - gone,
                }}
              >
                <span style={{ background: hl(p.c), color: "var(--chip-ink)", borderRadius: 12, padding: "0 6px", lineHeight: 1.05 }}>{p.j}</span>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 370,
              top: 560,
              width: 340,
              height: 340,
              display: "grid",
              placeItems: "center",
              fontSize: 250,
              fontWeight: 700,
              lineHeight: 1,
              opacity: beat(frame, S.s5, 4.4, 0.5),
            }}
          >
            {L.ga}
          </div>
          <Line y={930} fs={56} o={beat(frame, S.s5, 5.0, 0.4)}>
            {L.eq}
          </Line>
          <Hand x={0} y={1012} fs={42} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 6.2, 0.4) }}>
            {L.markCode}
          </Hand>
        </div>
      )}

      {/* s6: the formula */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          <Line y={190} fs={50} o={beat(frame, S.s6, 0.3, 0.4)}>
            {L.formula}
          </Line>
          {(() => {
            const slot = (name: string, n: number, c: "sky" | "pink" | "yellow", w: number) => (
              <span
                style={{
                  display: "inline-grid",
                  placeItems: "center",
                  width: w,
                  height: 82,
                  borderRadius: 14,
                  background: hl(c),
                  color: "var(--chip-ink)",
                  position: "relative",
                  fontWeight: 700,
                }}
              >
                <span style={{ position: "absolute", fontFamily: "var(--font-sans)", fontSize: 34, opacity: 1 - filled }}>{name}</span>
                <span style={{ position: "absolute", fontFamily: "var(--font-mono)", fontSize: 54, opacity: filled }}>{n}</span>
              </span>
            );
            const row = { display: "flex", justifyContent: "center", alignItems: "center", gap: 14, fontFamily: "var(--font-mono)", fontSize: 54, fontWeight: 500 } as const;
            return (
              <div style={{ position: "absolute", left: 56, right: 56, top: 330, ...row, opacity: beat(frame, S.s6, 0.8, 0.5) }}>
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}>{L.num}</span> = {slot(L.slotBase, 12363, "sky", 220)} + {slot(L.slotDaku, 1, "pink", 130)} + {slot(L.slotKata, 96, "yellow", 190)}
              </div>
            );
          })()}
          <Hand x={150} y={430} fs={42} style={{ opacity: beat(frame, S.s6, 1.6, 0.4) }}>
            ↑ {L.ka}
          </Hand>
          <Line y={540} fs={54} mono weight={500} o={beat(frame, S.s6, 3.4, 0.5)}>
            {L.calc1}
          </Line>
          <div style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", justifyContent: "center", opacity: beat(frame, S.s6, 4.8, 0.5) }}>
            <span style={{ fontSize: 64, fontWeight: 700, padding: "6px 28px", borderRadius: 16, background: "var(--hl-yellow)", color: "var(--chip-ink)" }}>
              {L.gaKata} = <span style={{ fontFamily: "var(--font-mono)" }}>12460</span>
            </span>
          </div>
          <PenCircle x={340} y={656} w={400} h={140} p={beat(frame, S.s6, 5.4, 0.7)} />
          <Hand x={0} y={850} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 6.2, 0.4) }}>
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
            { from: L.ka, to: L.kaKata, code: 12459, plus: "+96", note: L.toKata, y: 600, t: 4.2 },
            { from: L.ha, to: L.pa, code: 12401, plus: "+2", note: L.maru, y: 800, t: 5.6 },
          ].map((r) => {
            const a = beat(frame, S.s7, r.t, 0.5);
            return (
              <div key={r.to} style={{ opacity: a }}>
                <GlyphCard x={110} y={r.y} size={140} glyph={r.from} fs={90} color="yellow" />
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
            { ch: L.a, code: 12354, bytes: A_BYTES, y: 560, t: 2.6, n: L.three },
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
