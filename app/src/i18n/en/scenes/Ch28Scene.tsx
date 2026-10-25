// en: chapter 28 is rewritten for English (ASCII → Unicode → UTF-8); the Korean scene builds Hangul syllables.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CHO, JONG, JUNG, NEXT_TO_GA, WORLD, ch28, utf8 } from "../../../data/ch28";
import { Caption, Chip, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, hl, mix, type SceneProps } from "../../../scenes/kit";
import { GlyphCard, Line, NumBox, PenArrow, Svg } from "../../../scenes/part3-kit";

const tl = buildTimeline(ch28);
const S = byId(tl);
const L = ch28.labels;

// s3: the ASCII letters and digits
const COLS = [
  { title: L.upper, n: 26, items: CHO, c: "sky" as const, x: 70 },
  { title: L.lower, n: 26, items: JUNG, c: "yellow" as const, x: 390 },
  { title: L.digits, n: 10, items: JONG, c: "pink" as const, x: 710 },
];
const CELL = 60;

// s7: characters built from parts (code points checked with a script; the accent piece U+0301 is drawn as ´)
const PARTS_E = { base: "e", baseCode: 101, mark: "´", markCode: 769, whole: "é" };
const PARTS_THUMB = { base: "👍", baseCode: 128077, mark: "🏽", markCode: 127997, whole: "👍🏽" };

const BYTE_ROWS = [
  { ch: "A", code: 65, n: L.one, y: 250, t: 0.8 },
  { ch: "é", code: 233, n: L.two, y: 460, t: 2.2 },
  { ch: "😀", code: 128512, n: L.four, y: 670, t: 3.6 },
].map((r) => ({ ...r, bytes: utf8(r.ch) }));

export const Ch28Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2On = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const s3On = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const s4On = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const fOn = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);

  // s6: the place slots get their numbers
  const filled = beat(frame, S.s6, 1.2, 0.5);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: recap from ch06 */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Line y={220} fs={50} weight={500} o={beat(frame, S.s1, 0.3, 0.5)}>
            {L.recap}
          </Line>
          <GlyphCard x={190} y={390} size={300} glyph="A" fs={190} style={{ opacity: beat(frame, S.s1, 0.8, 0.5) }} />
          <div style={{ position: "absolute", left: 530, top: 480, fontSize: 90, fontWeight: 700, color: "var(--ink-3)", opacity: beat(frame, S.s1, 1.4, 0.4) }}>→</div>
          <Chip text="65" color="yellow" fs={72} x={650} y={486} style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s1, 1.6, 0.5) }} />
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

      {/* s3: ASCII, 128 numbers */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          <Line y={130} fs={48} o={beat(frame, S.s3, 0.2, 0.4)}>
            {L.ascii}
          </Line>
          {COLS.map((col, ci) => {
            const ta = beat(frame, S.s3, 0.5 + ci * 0.8, 0.4);
            return (
              <div key={col.title}>
                <div style={{ position: "absolute", left: col.x, width: 300, top: 222, textAlign: "center", fontSize: 40, fontWeight: 700, opacity: ta }}>
                  {col.title} <span style={{ fontFamily: "var(--font-mono)", background: hl(col.c), color: "var(--chip-ink)", borderRadius: 10, padding: "0 10px" }}>{col.n}</span>
                </div>
                {col.items.map((j, k) => {
                  const a = beat(frame, S.s3, 0.7 + ci * 0.8 + k * 0.025, 0.25);
                  return (
                    <div
                      key={k}
                      style={{
                        position: "absolute",
                        left: col.x + (k % 5) * CELL,
                        top: 300 + Math.floor(k / 5) * CELL,
                        width: CELL - 6,
                        height: CELL - 6,
                        borderRadius: 10,
                        border: "2px solid var(--line)",
                        background: "var(--paper)",
                        color: "var(--ink)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 40,
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
          <Line y={730} fs={60} mono weight={500} o={beat(frame, S.s3, 3.4, 0.5)}>
            26 + 26 + 10 + 66 = <InlineCircle p={beat(frame, S.s3, 4.0, 0.6)}>128</InlineCircle>
          </Line>
          <Line y={828} fs={38} weight={500} color="var(--ink-2)" o={beat(frame, S.s3, 4.4, 0.4)}>
            {L.others}
          </Line>
          <Hand x={0} y={910} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 5.4, 0.5), rotate: "-1.5deg" }}>
            {L.kept}
          </Hand>
        </div>
      )}

      {/* s4: neighbours by number */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          {NEXT_TO_GA.map((g, i) => {
            const x = 88 + i * 186;
            const a = beat(frame, S.s4, 0.5 + i * 0.5, 0.4);
            return (
              <div key={g.ch} style={{ opacity: a }}>
                <GlyphCard x={x} y={230} size={160} glyph={g.ch} fs={100} color={i === 0 ? "yellow" : null} />
                <div style={{ position: "absolute", left: x - 20, width: 200, top: 404, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 34 }}>{g.code}</div>
              </div>
            );
          })}
          <Svg>
            {NEXT_TO_GA.slice(1).map((_, i) => {
              const x1 = 88 + i * 186 + 110;
              const x2 = 88 + (i + 1) * 186 + 50;
              return <PenArrow key={i} x1={x1} y1={222} x2={x2} y2={222} bend={50} p={beat(frame, S.s4, 0.8 + i * 0.5, 0.4)} />;
            })}
          </Svg>
          {NEXT_TO_GA.slice(1).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 88 + i * 186 + 112, width: 100, top: 128, textAlign: "center", fontSize: 40, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--pen)", opacity: beat(frame, S.s4, 1.0 + i * 0.5, 0.3) }}>
              +1
            </div>
          ))}
          <Hand x={0} y={470} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 3.0, 0.4) }}>
            {L.plus1}
          </Hand>
          {[
            { to: "Z", code: 90, plus: "+25", note: L.last, y: 600, t: 4.4 },
            { to: "a", code: 97, plus: "+32", note: L.small, y: 800, t: 6.0 },
          ].map((r) => {
            const a = beat(frame, S.s4, r.t, 0.5);
            return (
              <div key={r.to} style={{ opacity: a }}>
                <GlyphCard x={110} y={r.y} size={140} glyph="A" fs={90} color="yellow" />
                <div style={{ position: "absolute", left: 270, top: r.y + 44, fontSize: 46, fontFamily: "var(--font-mono)", color: "var(--pen)", width: 190, textAlign: "center" }}>{r.plus} →</div>
                <GlyphCard x={470} y={r.y} size={140} glyph={r.to} fs={90} />
                <div style={{ position: "absolute", left: 640, top: r.y + 6, fontFamily: "var(--font-mono)", fontSize: 40, color: "var(--ink-2)" }}>{r.code}</div>
                <Hand x={640} y={r.y + 58} fs={52}>
                  {r.note}
                </Hand>
              </div>
            );
          })}
        </div>
      )}

      {/* s5–s6: the rule */}
      {frame >= S.s5.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: fOn }}>
          <Line y={150} fs={48} o={beat(frame, S.s5, 0.3, 0.4) * (1 - beat(frame, S.s6, 0, 0.4))}>
            {L.rule}
          </Line>
          {/* s6: H is the 8th letter */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: beat(frame, S.s6, 0.3, 0.5) }}>
            <span style={{ fontSize: 46, fontWeight: 700, padding: "4px 20px", borderRadius: 14, background: hl("sky"), color: "var(--chip-ink)" }}>{L.eighth}</span>
          </div>
          {(() => {
            const slot = (c: "sky" | "yellow") => (
              <span
                style={{
                  display: "inline-grid",
                  placeItems: "center",
                  width: 180,
                  height: 82,
                  borderRadius: 14,
                  background: hl(c),
                  color: "var(--chip-ink)",
                  position: "relative",
                  fontWeight: 700,
                }}
              >
                <span style={{ position: "absolute", fontFamily: "var(--font-sans)", fontSize: 38, opacity: 1 - filled }}>{L.place}</span>
                <span style={{ position: "absolute", fontFamily: "var(--font-mono)", fontSize: 54, opacity: filled }}>8</span>
              </span>
            );
            const row = { display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 18, fontFamily: "var(--font-mono)", fontSize: 54, fontWeight: 500 } as const;
            return (
              <>
                <div style={{ position: "absolute", left: 100, top: 280, ...row, opacity: beat(frame, S.s5, 0.8, 0.5) }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, width: 190, textAlign: "right" }}>{L.capital}</span> = <span style={{ borderBottom: "6px solid var(--pen)" }}>64</span> + {slot("sky")}
                </div>
                <Hand x={720} y={292} fs={44} style={{ opacity: beat(frame, S.s5, 2.4, 0.4) * (1 - beat(frame, S.s6, 0, 0.4)) }}>
                  {L.start}
                </Hand>
                <div style={{ position: "absolute", left: 100, top: 400, ...row, opacity: beat(frame, S.s5, 4.0, 0.5) }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, width: 190, textAlign: "right" }}>{L.smallL}</span> = <span style={{ borderBottom: "6px solid var(--pen)" }}>96</span> + {slot("yellow")}
                </div>
                <Hand x={720} y={412} fs={44} style={{ opacity: beat(frame, S.s5, 5.0, 0.4) * (1 - beat(frame, S.s6, 0, 0.4)) }}>
                  {L.start2}
                </Hand>
              </>
            );
          })()}
          {/* s6: compute */}
          <Line y={560} fs={56} mono weight={500} o={beat(frame, S.s6, 2.0, 0.5)}>
            {L.calc1}
          </Line>
          <Line y={650} fs={56} mono weight={500} o={beat(frame, S.s6, 3.4, 0.5)}>
            {L.calc2}
          </Line>
          <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", gap: 40, opacity: beat(frame, S.s6, 4.6, 0.5) }}>
            {[
              ["H", "72", "sky"],
              ["h", "104", "yellow"],
            ].map(([g, n, c]) => (
              <span key={g} style={{ fontSize: 60, fontWeight: 700, padding: "6px 28px", borderRadius: 16, background: hl(c as "sky"), color: "var(--chip-ink)" }}>
                {g} = <span style={{ fontFamily: "var(--font-mono)" }}>{n}</span>
              </span>
            ))}
          </div>
          <PenCircle x={110} y={742} w={860} h={206} p={beat(frame, S.s6, 5.2, 0.7)} />
          <Hand x={0} y={960} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 5.8, 0.4) }}>
            {L.gap}
          </Hand>
        </div>
      )}

      {/* s7: built from parts */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <Line y={140} fs={48}>
            {L.parts}
          </Line>
          {[
            { p: PARTS_E, y: 280, t: 0.6, codes: [PARTS_E.baseCode, PARTS_E.markCode], note: L.accent, markFs: 190, whole: String(233), wholeNote: L.oneNum },
            { p: PARTS_THUMB, y: 660, t: 4.2, codes: [PARTS_THUMB.baseCode, PARTS_THUMB.markCode], note: L.tone, markFs: 110, whole: "", wholeNote: L.twoNums },
          ].map((r) => {
            const a = (k: number) => beat(frame, S.s7, r.t + k * 0.6, 0.4);
            return (
              <div key={r.p.whole}>
                <div style={{ opacity: a(0) }}>
                  <GlyphCard x={80} y={r.y} size={170} glyph={r.p.base} fs={110} />
                  <div style={{ position: "absolute", left: 60, width: 210, top: r.y + 184, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 34 }}>{r.codes[0]}</div>
                </div>
                <div style={{ position: "absolute", left: 262, top: r.y + 46, fontSize: 64, fontWeight: 700, color: "var(--ink-3)", opacity: a(1) }}>+</div>
                <div style={{ opacity: a(1) }}>
                  <GlyphCard x={320} y={r.y} size={170} glyph={r.p.mark} fs={r.markFs} color="pink" />
                  <div style={{ position: "absolute", left: 300, width: 210, top: r.y + 184, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 34 }}>{r.codes[1]}</div>
                  <Hand x={255} y={r.y - 64} fs={42} style={{ width: 300, textAlign: "center" }}>
                    {r.note}
                  </Hand>
                </div>
                <div style={{ position: "absolute", left: 512, top: r.y + 46, fontSize: 64, fontWeight: 700, color: "var(--ink-3)", opacity: a(2) }}>→</div>
                <div style={{ opacity: a(2), scale: String(mix(1.12, 1, a(2))) }}>
                  <GlyphCard x={600} y={r.y} size={170} glyph={r.p.whole} fs={110} color="yellow" />
                </div>
                <div style={{ opacity: beat(frame, S.s7, r.t + 2.0, 0.4) }}>
                  <Hand x={535} y={r.y - 64} fs={42} style={{ width: 300, textAlign: "center" }}>
                    {r.wholeNote}
                  </Hand>
                  <div style={{ position: "absolute", left: 580, width: 210, top: r.y + 184, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 34, color: "var(--pen)", fontWeight: 700 }}>{r.whole}</div>
                </div>
              </div>
            );
          })}
          <PenCircle x={584} y={264} w={202} h={202} p={beat(frame, S.s7, 2.6, 0.6)} />
          <PenCircle x={584} y={644} w={202} h={202} p={beat(frame, S.s7, 6.2, 0.6)} />
        </div>
      )}

      {/* s8: bytes */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          <Line y={140} fs={48}>
            {L.byte}
          </Line>
          {BYTE_ROWS.map((r) => {
            const a = beat(frame, S.s8, r.t, 0.5);
            const end = 495 + r.bytes.length * 124 - 12;
            const right = end + 24 + 160 < 1024;
            return (
              <div key={r.ch} style={{ opacity: a }}>
                <GlyphCard x={60} y={r.y} size={150} glyph={r.ch} fs={96} />
                <div style={{ position: "absolute", left: 226, top: r.y + 48, fontSize: 44, color: "var(--ink-3)" }}>→</div>
                <div style={{ position: "absolute", left: 270, top: r.y + 50, fontFamily: "var(--font-mono)", fontSize: 42 }}>{r.code}</div>
                <div style={{ position: "absolute", left: 440, top: r.y + 48, fontSize: 44, color: "var(--ink-3)", opacity: beat(frame, S.s8, r.t + 0.5, 0.3) }}>→</div>
                {r.bytes.map((b, k) => (
                  <NumBox key={k} x={495 + k * 124} y={r.y + 32} w={112} h={88} fs={42} color="mint" style={{ opacity: beat(frame, S.s8, r.t + 0.7 + k * 0.2, 0.3) }}>
                    {b}
                  </NumBox>
                ))}
                <Hand x={right ? end + 24 : end - 170} y={right ? r.y + 40 : r.y + 132} fs={54} style={{ opacity: beat(frame, S.s8, r.t + 1.2, 0.4), width: 170, textAlign: right ? "left" : "right" }}>
                  {r.n}
                </Hand>
              </div>
            );
          })}
          <Line y={900} fs={40} weight={500} color="var(--ink-2)" o={beat(frame, S.s8, 5.2, 0.5)}>
            {L.split}
          </Line>
          <Hand x={0} y={975} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 6.2, 0.5), rotate: "-1.5deg" }}>
            {L.material}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch28.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
