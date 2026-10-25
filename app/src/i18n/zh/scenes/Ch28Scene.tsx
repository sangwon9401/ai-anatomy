// zh overlay of src/scenes/Ch28Scene.tsx: the Korean scene assembles Hangul from jamo with a formula; this one shows
// 汉字 in Unicode (the CJK block, radical-and-stroke order, 部首 + 声旁, no formula) and keeps the s1, s2 and s8 layouts.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
// zh-only exports (BLOCK_START, SAME_PART, CJK_SORTED_END) come straight from the zh data overlay
import { BLOCK_START, CJK_SORTED_END, HANGUL_BASE, NEXT_TO_GA, SAME_PART, WORLD, ch28, utf8 } from "../data/ch28";
import { Caption, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, hl, mix, type SceneProps } from "../../../scenes/kit";
import { GlyphCard, Line, NumBox, PenArrow, Svg } from "../../../scenes/part3-kit";

const tl = buildTimeline(ch28);
const S = byId(tl);
const L = ch28.labels;

// s3: the two parts of '江' and where they sit inside the character block
const PARTS = [
  { j: "氵", name: L.radical, desc: L.radicalD, c: "sky" as const, from: [300, 330], to: [478, 730] },
  { j: "工", name: L.phon, desc: L.phonD, c: "yellow" as const, from: [780, 330], to: [612, 730] },
];

// s4: the first cells of the CJK block
const CELL = 84;
const COLS = 10;
const GX0 = 540 - (COLS * CELL) / 2;

// s5 / s7: a number line over the radical-sorted block 19968 … 40869
const NX0 = 110;
const NX1 = 970;
const nx = (code: number) => NX0 + ((code - HANGUL_BASE) / (CJK_SORTED_END - HANGUL_BASE)) * (NX1 - NX0);

const ZHONG_BYTES = utf8("中");

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

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: recap from ch06 */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Line y={220} fs={50} weight={500} o={beat(frame, S.s1, 0.3, 0.5)}>
            {L.recap}
          </Line>
          <GlyphCard x={190} y={390} size={300} glyph="中" fs={190} style={{ opacity: beat(frame, S.s1, 0.8, 0.5) }} />
          <div style={{ position: "absolute", left: 530, top: 480, fontSize: 90, fontWeight: 700, color: "var(--ink-3)", opacity: beat(frame, S.s1, 1.4, 0.4) }}>→</div>
          <div style={{ position: "absolute", left: 650, top: 486, opacity: beat(frame, S.s1, 1.6, 0.5) }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 72, fontWeight: 500, padding: "4px 26px", borderRadius: 16, background: "var(--hl-yellow)", color: "var(--chip-ink)" }}>20013</span>
          </div>
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

      {/* s3: 氵 + 工 = 江 */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          {PARTS.map((p, i) => {
            const a = beat(frame, S.s3, 0.5 + i * 0.8, 0.5);
            return (
              <div key={p.j} style={{ opacity: a }}>
                <GlyphCard x={p.from[0] - 85} y={p.from[1] - 85} size={170} glyph={p.j} fs={110} color={p.c} />
                <div style={{ position: "absolute", left: p.from[0] - 150, width: 300, top: p.from[1] + 100, textAlign: "center", fontSize: 40, fontWeight: 700 }}>{p.name}</div>
                <div style={{ position: "absolute", left: p.from[0] - 150, width: 300, top: p.from[1] + 152, textAlign: "center", fontFamily: "var(--font-hand)", fontSize: 38, color: "var(--pen)", opacity: beat(frame, S.s3, 1.8 + i * 0.8, 0.4) }}>
                  {p.desc}
                </div>
              </div>
            );
          })}
          {/* the character block */}
          <div
            style={{
              position: "absolute",
              left: 380,
              top: 590,
              width: 320,
              height: 300,
              borderRadius: 30,
              border: "4px dashed var(--ink-3)",
              opacity: beat(frame, S.s3, 3.2, 0.4),
            }}
          />
          {PARTS.map((p, i) => {
            const m = beat(frame, S.s3, 3.5 + i * 0.35, 0.9, EASE_IO);
            const gone = beat(frame, S.s3, 5.0, 0.5);
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
              top: 590,
              width: 320,
              height: 300,
              display: "grid",
              placeItems: "center",
              fontSize: 250,
              fontWeight: 700,
              lineHeight: 1,
              opacity: beat(frame, S.s3, 5.0, 0.5),
            }}
          >
            {L.han}
          </div>
          <Line y={940} fs={56} o={beat(frame, S.s3, 5.6, 0.4)}>
            {L.eq}
          </Line>
        </div>
      )}

      {/* s4: the CJK block starts at 一 */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          <Line y={150} fs={54}>
            {L.block}
          </Line>
          {BLOCK_START.map((g, k) => {
            const a = beat(frame, S.s4, 0.6 + k * 0.05, 0.25);
            const first = k === 0;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: GX0 + (k % COLS) * CELL,
                  top: 300 + Math.floor(k / COLS) * CELL,
                  width: CELL - 8,
                  height: CELL - 8,
                  borderRadius: 12,
                  border: first ? "3px solid var(--ink)" : "2px solid var(--line)",
                  background: first ? hl("yellow") : "var(--paper)",
                  color: first ? "var(--chip-ink)" : "var(--ink)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 48,
                  fontWeight: 500,
                  opacity: a,
                }}
              >
                {g}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: GX0 + COLS * CELL - 70, top: 300 + 3 * CELL - 4, fontSize: 48, color: "var(--ink-3)", opacity: beat(frame, S.s4, 2.2, 0.3) }}>…</div>
          <Hand x={GX0 - 10} y={240} fs={42} style={{ opacity: beat(frame, S.s4, 1.6, 0.4) }}>
            ↓ {L.from} <span style={{ fontFamily: "var(--font-mono)", fontSize: 36 }}>19968</span>
          </Hand>
          <Line y={640} fs={42} weight={500} o={beat(frame, S.s4, 3.2, 0.5)}>
            {L.sorted}
          </Line>
          <Hand x={0} y={760} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 5.0, 0.5), rotate: "-1.5deg" }}>
            <InlineCircle p={beat(frame, S.s4, 5.6, 0.6)}>{L.total}</InlineCircle>
          </Hand>
        </div>
      )}

      {/* s5: radical first, then strokes */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5On }}>
          <Line y={140} fs={54}>
            {L.rule}
          </Line>
          <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", alignItems: "center", gap: 28 }}>
            <span style={{ fontSize: 48, fontWeight: 700, padding: "6px 24px", borderRadius: 14, background: "var(--hl-sky)", color: "var(--chip-ink)", opacity: beat(frame, S.s5, 0.6, 0.4) }}>{L.r1}</span>
            <span style={{ fontSize: 48, fontWeight: 700, padding: "6px 24px", borderRadius: 14, background: "var(--hl-mint)", color: "var(--chip-ink)", opacity: beat(frame, S.s5, 2.0, 0.4) }}>{L.r2}</span>
          </div>
          <Hand x={150} y={330} fs={42} style={{ opacity: beat(frame, S.s5, 1.2, 0.4) }}>
            ↑ {L.r1n}
          </Hand>
          {/* the number line with three radicals on it */}
          <div style={{ position: "absolute", left: NX0, top: 600, width: NX1 - NX0, height: 6, borderRadius: 3, background: "var(--ink)", opacity: beat(frame, S.s5, 3.0, 0.4) }} />
          {[
            { g: "一", code: 19968, lab: L.rad1, t: 3.4, c: "yellow" as const },
            { g: "水", code: 27700, lab: L.rad85, t: 4.0, c: "sky" as const },
            { g: "龠", code: 40864, lab: L.rad214, t: 4.6, c: "pink" as const },
          ].map((m) => {
            const x = nx(m.code);
            const a = beat(frame, S.s5, m.t, 0.4);
            return (
              <div key={m.g} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: x - 3, top: 584, width: 6, height: 38, background: "var(--ink)" }} />
                <GlyphCard x={x - 60} y={448} size={120} glyph={m.g} fs={76} color={m.c} />
                <div style={{ position: "absolute", left: x - 110, width: 220, top: 636, textAlign: "center", fontSize: 34, fontWeight: 700 }}>{m.lab}</div>
                <div style={{ position: "absolute", left: x - 110, width: 220, top: 682, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>{m.code}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center", opacity: beat(frame, S.s5, 5.6, 0.5) }}>
            <span style={{ fontSize: 56, fontWeight: 700, padding: "6px 28px", borderRadius: 16, background: "var(--hl-yellow)", color: "var(--chip-ink)" }}>{L.jiang}</span>
          </div>
        </div>
      )}

      {/* s6: neighbours by number */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          {NEXT_TO_GA.map((g, i) => {
            const x = 88 + i * 186;
            const a = beat(frame, S.s6, 0.5 + i * 0.5, 0.4);
            return (
              <div key={g.ch} style={{ opacity: a }}>
                <GlyphCard x={x} y={330} size={160} glyph={g.ch} fs={100} color={g.ch === "江" ? "yellow" : null} />
                <div style={{ position: "absolute", left: x - 20, width: 200, top: 504, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 32 }}>{g.code}</div>
              </div>
            );
          })}
          <Svg>
            {NEXT_TO_GA.slice(1).map((_, i) => {
              const x1 = 88 + i * 186 + 110;
              const x2 = 88 + (i + 1) * 186 + 50;
              return <PenArrow key={i} x1={x1} y1={322} x2={x2} y2={322} bend={50} p={beat(frame, S.s6, 0.8 + i * 0.5, 0.4)} />;
            })}
          </Svg>
          {NEXT_TO_GA.slice(1).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 88 + i * 186 + 112, width: 100, top: 228, textAlign: "center", fontSize: 40, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--pen)", opacity: beat(frame, S.s6, 1.0 + i * 0.5, 0.3) }}>
              {L.plus1}
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", opacity: beat(frame, S.s6, 3.4, 0.4) }}>
            <span style={{ fontSize: 46, fontWeight: 700, padding: "4px 22px", borderRadius: 14, background: "var(--hl-sky)", color: "var(--chip-ink)" }}>{L.water3}</span>
          </div>
          <Hand x={0} y={740} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.4, 0.4) }}>
            {L.next}
          </Hand>
        </div>
      )}

      {/* s7: same right part, far apart: no formula */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <Line y={150} fs={54}>
            {L.same}
          </Line>
          <div style={{ position: "absolute", left: NX0, top: 600, width: NX1 - NX0, height: 6, borderRadius: 3, background: "var(--ink)", opacity: beat(frame, S.s7, 0.4, 0.4) }} />
          <div style={{ position: "absolute", left: NX0 - 60, width: 120, top: 624, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s7, 0.4, 0.4) }}>19968</div>
          <div style={{ position: "absolute", left: NX1 - 60, width: 120, top: 624, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s7, 0.4, 0.4) }}>40869</div>
          {SAME_PART.map((g, i) => {
            // cards evenly spaced above the line, each with a leader to its real place on the line
            const cx = 160 + i * 190;
            const x = nx(g.code);
            const a = beat(frame, S.s7, 0.8 + i * 0.5, 0.4);
            return (
              <div key={g.ch} style={{ opacity: a }}>
                <GlyphCard x={cx - 55} y={280} size={110} glyph={g.ch} fs={70} color={g.ch === "江" ? "yellow" : null} />
                <div style={{ position: "absolute", left: cx - 80, width: 160, top: 400, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30 }}>{g.code}</div>
                <Svg>
                  <line x1={cx} y1={448} x2={x} y2={590} stroke="var(--pen)" strokeWidth={3} strokeDasharray="8 7" />
                </Svg>
                <div style={{ position: "absolute", left: x - 10, top: 593, width: 20, height: 20, borderRadius: 10, background: "var(--pen)" }} />
              </div>
            );
          })}
          <Hand x={0} y={700} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.4, 0.4) }}>
            {L.far}
          </Hand>
          <Hand x={0} y={850} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.0, 0.4), rotate: "-1.5deg" }}>
            <InlineCircle p={beat(frame, S.s7, 5.6, 0.6)}>{L.noFormula}</InlineCircle>
          </Hand>
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
            { ch: "中", code: 20013, bytes: ZHONG_BYTES, y: 560, t: 2.6, n: L.three },
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
                <Hand x={510 + r.bytes.length * 140 + 6} y={r.y + 46} fs={52} style={{ opacity: beat(frame, S.s8, r.t + 1.4, 0.4) }}>
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
