import type { FC } from "react";
import { random, useCurrentFrame } from "remotion";
import { ALL_LAYERS, DEPTH_NOTES, MODELS, PEEK, PEEK_LAYERS, ch58 } from "../../../data/ch58";
import { Block, Layer, WordChip, blockGeo } from "../../../scenes/part6-block";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";

const tl = buildTimeline(ch58);
const S = byId(tl);
const L = ch58.labels;
const G = blockGeo("full");

/** The block in miniature: highway on the left, attention and feed-forward side by side (same colours as everywhere). */
const Brick: FC<{ x: number; y: number; w?: number; h?: number; o?: number; dy?: number }> = ({ x, y, w = 520, h = 84, o = 1, dy = 0 }) => {
  const inner = (w - 110) / 2;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, translate: `0px ${dy}px` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 16, border: "3px dashed var(--ink-3)", background: "var(--paper)" }} />
      <div style={{ position: "absolute", left: 34, top: -2, width: 12, height: h + 4, background: "var(--hl-orange)" }} />
      {[L.att, L.ffn].map((t, i) => (
        <div
          key={t}
          style={{
            position: "absolute",
            left: 70 + i * (inner + 16),
            top: 12,
            width: inner,
            height: h - 24,
            borderRadius: 12,
            background: "var(--hl-yellow)",
            color: "var(--chip-ink)",
            display: "grid",
            placeItems: "center",
            fontSize: 30,
            fontWeight: 700,
            // ja: "フィード\nフォワード" goes on two lines
            whiteSpace: "pre-line",
            lineHeight: 1.0,
            textAlign: "center",
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
};

const STACK_X = 300;
const STACK_Y = [200, 304, 408, 512, 616];
const LAST_Y = 806;
const ROAD_X = STACK_X + 40;

const TOWER_W = 180;
const TOWER_TOP = 330;
const SLICE = 7;

const DEPTH_Y = DEPTH_NOTES.map((_, i) => 230 + i * 150);
const DEPTH_TINT = [14, 32, 56, 80, 100];
const BAND = { shallow: L.shallow, middle: L.middle, deep: L.deep };

const W3 = ["1", "2", "3"].map((s) => Array.from({ length: 16 }, (_, i) => random(`w58-${s}-${i}`) * 2 - 1));

export const Ch58Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const on1 = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const on2 = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const on3 = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const on45 = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const on6 = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const on7 = beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const on8 = beat(frame, S.s8, 0.3, 0.6);
  const gan = PEEK[0];
  const ganW = chipWidth(L.gan, 40);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: stack them like lego */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: on1 }}>
          {[L.w1, L.w2, L.w3].map((w, i) => (
            <WordChip key={w} text={w} x={STACK_X + [0, 125, 250][i]} y={104} fs={40} />
          ))}
          <Layer>
            <line x1={ROAD_X} y1={168} x2={ROAD_X} y2={mix(168, LAST_Y + 120, beat(frame, S.s1, 0.4, 3.6, (t) => t))} stroke="var(--hl-orange)" strokeWidth={12} />
          </Layer>
          {STACK_Y.map((y, i) => {
            const a = beat(frame, S.s1, 0.6 + i * 0.55, 0.5);
            return (
              <div key={y}>
                <Brick x={STACK_X} y={y} o={a} dy={mix(-40, 0, a)} />
                <div style={{ position: "absolute", left: STACK_X - 140, width: 110, top: y + 20, textAlign: "right", fontSize: 36, fontWeight: 700, opacity: a }}>
                  {i + 1}
                  {L.layer}
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: STACK_X + 230, top: 704, fontSize: 60, color: "var(--ink-3)", opacity: beat(frame, S.s1, 3.6, 0.4) }}>{L.dots}</div>
          <Brick x={STACK_X} y={LAST_Y} o={beat(frame, S.s1, 4.0, 0.5)} />
          <div style={{ position: "absolute", left: STACK_X - 140, width: 110, top: LAST_Y + 20, textAlign: "right", fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s1, 4.0, 0.5) }}>
            96{L.layer}
          </div>
          <Hand x={0} y={940} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 4.8, 0.4) }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s2: 12, 48, 96 layers */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: on2 }}>
          {MODELS.map((m, i) => {
            const cx = 230 + i * 310;
            const a = beat(frame, S.s2, 0.4 + i * 1.0, 0.5);
            const grow = beat(frame, S.s2, 0.6 + i * 1.0, 1.0, EASE_IO);
            return (
              <div key={m.name} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: cx - 150, width: 300, top: 160, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{m.name}</div>
                <div style={{ position: "absolute", left: cx - 150, width: 300, top: 216, textAlign: "center", fontSize: 30, color: "var(--ink-2)" }}>({m.year})</div>
                <div style={{ position: "absolute", left: cx - 150, width: 300, top: 260, textAlign: "center", fontSize: 40, fontWeight: 700 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>{m.layers}</span>
                  {L.layer}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: cx - TOWER_W / 2,
                    top: TOWER_TOP,
                    width: TOWER_W,
                    height: m.layers * SLICE * grow,
                    backgroundImage: `linear-gradient(90deg, var(--hl-orange) 0 12px, transparent 12px), repeating-linear-gradient(to bottom, var(--hl-yellow) 0 5px, transparent 5px ${SLICE}px)`,
                    borderRadius: 4,
                  }}
                />
              </div>
            );
          })}
          <Hand x={100} y={520} fs={46} style={{ width: 280, whiteSpace: "normal", wordBreak: "keep-all", opacity: beat(frame, S.s2, 4.4, 0.4), rotate: "-3deg" }}>
            {L.design}
          </Hand>
        </div>
      )}

      {/* s3: same shape, different numbers */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: on3 }}>
          <Hand x={120} y={190} fs={46} style={{ opacity: beat(frame, S.s3, 0.8, 0.4) }}>
            {L.shape}
          </Hand>
          <Hand x={680} y={190} fs={46} style={{ width: 330, whiteSpace: "normal", wordBreak: "keep-all", opacity: beat(frame, S.s3, 2.6, 0.4) }}>
            {L.nums}
          </Hand>
          {W3.map((ws, k) => {
            const y = 320 + k * 170;
            const a = beat(frame, S.s3, 0.5 + k * 0.3, 0.5);
            const b = beat(frame, S.s3, 2.2 + k * 0.4, 0.5);
            return (
              <div key={k}>
                <div style={{ position: "absolute", left: 40, width: 60, top: y + 22, textAlign: "right", fontSize: 34, fontWeight: 700, opacity: a }}>
                  {k + 1}
                  {L.layer}
                </div>
                <Brick x={120} y={y} w={500} o={a} />
                {ws.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 700 + (i % 4) * 30,
                      top: y - 8 + Math.floor(i / 4) * 26,
                      width: 26,
                      height: 22,
                      borderRadius: 4,
                      background: `color-mix(in srgb, var(--hl-${v >= 0 ? "sky" : "pink"}) ${Math.round(Math.abs(v) * 100)}%, var(--paper-2))`,
                      opacity: b,
                    }}
                  />
                ))}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 360, top: 800, fontSize: 60, color: "var(--ink-3)", opacity: beat(frame, S.s3, 3.6, 0.4) }}>{L.dots}</div>
        </div>
      )}

      {/* s4–s5: what '학교에' carries at each depth */}
      {frame >= S.s4.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: on45 }}>
          <Layer>
            <line x1={276} y1={DEPTH_Y[0] + 30} x2={276} y2={DEPTH_Y[4] + 30} stroke="var(--hl-orange)" strokeWidth={10} opacity={beat(frame, S.s4, 0.4, 0.5)} />
          </Layer>
          {DEPTH_NOTES.map((d, i) => {
            const y = DEPTH_Y[i];
            const a = beat(frame, S.s4, 0.5 + i * 0.25, 0.5);
            const step = i < 3 ? S.s4 : S.s5;
            const n = beat(frame, step, i < 3 ? 1.6 + i * 1.6 : 1.0 + (i - 3) * 2.0, 0.5);
            const prevBand = i > 0 ? DEPTH_NOTES[i - 1].band : null;
            return (
              <div key={d.layer}>
                <div style={{ position: "absolute", left: 56, width: 130, top: y + 10, textAlign: "right", fontSize: 34, fontWeight: 700, opacity: a }}>
                  {d.layer}
                  {L.layer}
                </div>
                <Chip
                  text={L.word}
                  color={null}
                  fs={40}
                  x={276 - chipWidth(L.word, 40) / 2}
                  y={y}
                  style={{ opacity: a, background: `color-mix(in srgb, var(--hl-yellow) ${DEPTH_TINT[i]}%, var(--paper))`, color: DEPTH_TINT[i] > 50 ? "var(--chip-ink)" : "var(--ink)", border: "2.5px solid var(--ink)" }}
                />
                <div style={{ position: "absolute", left: 380, width: 470, top: y + 6, fontSize: 36, lineHeight: 1.25, wordBreak: "keep-all", opacity: n }}>{d.note}</div>
                {d.band !== prevBand && (
                  <Hand x={870} y={y + 4} fs={40} style={{ opacity: n }}>
                    {BAND[d.band]}
                  </Hand>
                )}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 990, textAlign: "center", fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s4, 1.6, 0.4) }}>
            {L.toy} · {L.rough}
          </div>
        </div>
      )}

      {/* s6: peek at the next word after each depth */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: on6 }}>
          <Hand x={0} y={150} fs={44} style={{ width: 1080, textAlign: "center" }}>
            {L.peek}
          </Hand>
          <Chip text={L.gan} color="yellow" fs={40} x={540 - ganW / 2} y={222} />
          {PEEK_LAYERS.map((l, i) => {
            const y = 330 + i * 106;
            const a = beat(frame, S.s6, 0.8 + i * 0.6, 0.6);
            const w = (gan.p[i] / 60) * 600 * a;
            return (
              <div key={l} style={{ opacity: beat(frame, S.s6, 0.6 + i * 0.6, 0.3) }}>
                <div style={{ position: "absolute", left: 56, width: 150, top: y + 4, textAlign: "right", fontSize: 36, fontWeight: 700 }}>
                  {l}
                  {L.layer}
                </div>
                <div style={{ position: "absolute", left: 230, top: y, width: 600, height: 56, borderRadius: 12, background: "var(--paper-2)" }} />
                <div style={{ position: "absolute", left: 230, top: y, width: w, height: 56, borderRadius: 12, background: "var(--hl-yellow)" }} />
                <div style={{ position: "absolute", left: 850, top: y + 4, fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500 }}>{Math.round(gan.p[i] * a)}%</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 990, textAlign: "center", fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
        </div>
      )}

      {/* s7: where GPT-3's numbers are */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: on7 }}>
          <Brick x={280} y={200} o={beat(frame, S.s7, 0.4, 0.5)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s7, 0.8, 0.5) }}>{L.perLayer}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s7, 2.4, 0.5) }}>{L.times}</div>
          <div style={{ position: "absolute", left: 90, top: 560, width: 900, height: 90, borderRadius: 16, background: "var(--paper-2)", border: "3px solid var(--ink-3)", boxSizing: "border-box", opacity: beat(frame, S.s7, 3.6, 0.4) }} />
          <div style={{ position: "absolute", left: 90, top: 560, width: 900 * (ALL_LAYERS / 175e9) * beat(frame, S.s7, 4.0, 1.2, EASE_IO), height: 90, borderRadius: 16, background: "var(--hl-yellow)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 670, textAlign: "center", fontSize: 34, color: "var(--ink-2)", opacity: beat(frame, S.s7, 3.6, 0.4) }}>{L.total}</div>
          <Hand x={0} y={760} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.6, 0.4), rotate: "-2deg" }}>
            <InlineCircle p={beat(frame, S.s7, 6.0, 0.6)}>{L.almost}</InlineCircle>
          </Hand>
        </div>
      )}

      {/* s8: why it can go this deep */}
      {frame >= S.s8.from && (
        <div style={{ opacity: on8 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontSize: 46, fontWeight: 700 }}>{L.thanks}</div>
          <Block x={100} y={220} focus={{ keys: ["add1", "add2", "norm1", "norm2"], t: beat(frame, S.s8, 0.6, 0.6), dim: 0.3 }} layers={beat(frame, S.s8, 0.6, 1.0)} />
          <Chip text={L.road} color="orange" fs={36} x={540 - 20 - chipWidth(L.road, 36)} y={890} style={{ opacity: beat(frame, S.s8, 1.4, 0.4) }} />
          <Chip text={L.norm} color="violet" fs={36} x={560} y={890} style={{ opacity: beat(frame, S.s8, 2.2, 0.4) }} />
          <Hand x={820} y={220 + G.h - 110} fs={60} style={{ opacity: beat(frame, S.s8, 3.0, 0.4) }}>
            × 96{L.layer}
          </Hand>
          <Hand x={0} y={980} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 5.0, 0.4) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch58.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
