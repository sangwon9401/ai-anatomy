import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ATT_PARAMS, FFN_PARAMS, FFN_WORDS, ch55, ffn, gelu } from "../data/ch55";
import { Block, Blueprint, Layer, PenArrow, VecCells, WordChip, blockGeo, blueprintGeo, partRect, wordW } from "./part6-block";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";

const tl = buildTimeline(ch55);
const S = byId(tl);
const L = ch55.labels;

const G = blockGeo("full");
const BX = 100;
const BY = 246;
const WORDS = [L.w1, L.w2, L.w3];

// s3–s4: the toy network for 학교에
const SCHOOL = FFN_WORDS[2];
const RUN = ffn(SCHOOL.x);
const IN_Y = 330;
const HID_Y = 580;
const OUT_Y = 840;
const IN_X = [315, 465, 615, 765];
const HID_X = Array.from({ length: 16 }, (_, i) => 120 + i * 56);
const NODE_R = 46;
const HID_R = 23;
const HMAX = Math.max(...RUN.h);
const TAGGED = 12;

// s6: GPT-3 widths, to scale
const BAR_FULL = 880;
const BAR_D = BAR_FULL / 4;

// s7: where GPT-3's 1,750억 numbers are
const TOTAL = 175e9;
const SEG = [
  { w: FFN_PARAMS / TOTAL, c: "var(--hl-yellow)" },
  { w: ATT_PARAMS / TOTAL, c: "var(--hl-sky)" },
  { w: 1 - (FFN_PARAMS + ATT_PARAMS) / TOTAL, c: "var(--ink-3)" },
];

// GELU glyph for the corner note
const GLX = (x: number) => 26 + x * 13;
const GLY = (y: number) => 40 - y * 13;
const GELU_PATH = Array.from({ length: 31 }, (_, i) => -2 + (i * 4.4) / 30)
  .map((x, i) => `${i === 0 ? "M" : "L"} ${GLX(x + 2).toFixed(1)} ${GLY(gelu(x)).toFixed(1)}`)
  .join(" ");

const Node: FC<{ x: number; y: number; r: number; fill: string; o?: number; text?: string; fs?: number }> = ({ x, y, r, fill, o = 1, text, fs = 30 }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      border: "4px solid var(--ink)",
      boxSizing: "border-box",
      background: "var(--paper)",
      opacity: o,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", inset: 0, background: fill }} />
    {text && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: fs, fontWeight: 500, color: "var(--chip-ink)" }}>{text}</div>}
  </div>
);

const fmt1 = (v: number) => {
  const r = Number(v.toFixed(1));
  return r < 0 ? `−${Math.abs(r).toFixed(1)}` : r.toFixed(1);
};

export const Ch55Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const blockOn = beat(frame, S.s1, 0.2, 0.6) * (1 - beat(frame, S.s2, 0, 0.5));
  const focusT = beat(frame, S.s1, 1.6, 0.8);
  const copiesOn = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const netOn = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const sumOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const realOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const shareOn = beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const bpOn = beat(frame, S.s8, 0.3, 0.6);

  const ffnRect = partRect(G, "ffn");
  const lines1 = beat(frame, S.s3, 1.0, 0.8);
  const fire = beat(frame, S.s3, 3.2, 1.2, EASE_IO);
  const lines2 = beat(frame, S.s3, 4.6, 0.8);
  const outP = beat(frame, S.s3, 5.6, 0.6);

  const BPG = blueprintGeo(176);
  const bpFfn = BPG.block + blockGeo("mini").rows.ffn.y;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the block, attention done, feed-forward next */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: blockOn }}>
          {WORDS.map((w, i) => (
            <WordChip key={w} text={w} x={120 + [0, 125, 250][i]} y={134} fs={40} />
          ))}
          <Block x={BX} y={BY} focus={{ keys: ["ffn"], t: focusT }} />
          <PenCircle x={BX + ffnRect.x - 26} y={BY + ffnRect.y - 22} w={ffnRect.w + 52} h={ffnRect.h + 44} p={beat(frame, S.s1, 2.4, 0.8)} />
          <Hand x={790} y={BY + ffnRect.y + 4} fs={40} style={{ width: 230, whiteSpace: "normal", wordBreak: "keep-all", opacity: beat(frame, S.s1, 3.2, 0.4) }}>
            {L.here}
          </Hand>
        </div>
      )}

      {/* s2: every word through its own copy of the same machine */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: copiesOn }}>
          {WORDS.map((w, i) => {
            const cx = 230 + i * 310;
            const a = beat(frame, S.s2, 0.5 + i * 0.25, 0.5);
            const pass = beat(frame, S.s2, 2.0 + i * 0.3, 0.9, EASE_IO);
            const ww = wordW(w, 44);
            return (
              <div key={w} style={{ opacity: a }}>
                <WordChip text={w} x={cx - ww / 2} y={260} fs={44} />
                <Layer>
                  <PenArrow x1={cx} y1={336} x2={cx} y2={376} p={1} color="var(--ink-3)" width={5} />
                  <PenArrow x1={cx} y1={636} x2={cx} y2={676} p={pass} color="var(--ink-3)" width={5} />
                </Layer>
                <div style={{ position: "absolute", left: cx - 125, top: 386, width: 250, height: 240, borderRadius: 22, background: "var(--hl-yellow)", border: "4px solid var(--ink)", boxSizing: "border-box" }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", fontSize: 34, fontWeight: 700, color: "var(--chip-ink)" }}>{L.ffn}</div>
                  <svg width={250} height={240} style={{ position: "absolute", left: -4, top: -4 }}>
                    <path d="M 95 78 L 155 78 L 215 140 L 155 202 L 95 202 L 35 140 Z" fill="var(--paper)" stroke="var(--chip-ink)" strokeWidth={3} opacity={0.9} />
                    {[0, 1, 2, 3].map((k) => (
                      <circle key={`a${k}`} cx={101 + k * 16} cy={96} r={6} fill="var(--chip-ink)" />
                    ))}
                    {Array.from({ length: 9 }, (_, k) => (
                      <circle key={`b${k}`} cx={61 + k * 16} cy={140} r={6} fill="var(--hl-yellow)" stroke="var(--chip-ink)" strokeWidth={2.5} />
                    ))}
                    {[0, 1, 2, 3].map((k) => (
                      <circle key={`c${k}`} cx={101 + k * 16} cy={184} r={6} fill="var(--chip-ink)" />
                    ))}
                  </svg>
                </div>
                <WordChip text={w} x={cx - ww / 2} y={688} fs={44} color="yellow" o={pass} />
              </div>
            );
          })}
          {[385, 695].map((x) => (
            <div key={x} style={{ position: "absolute", left: x - 2, top: 260, width: 0, height: 500, borderLeft: "4px dashed var(--ink-3)", opacity: beat(frame, S.s2, 4.6, 0.4) }} />
          ))}
          <Hand x={0} y={810} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 3.6, 0.4) }}>
            {L.same}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 890, textAlign: "center", fontSize: 38, color: "var(--ink-2)", opacity: beat(frame, S.s2, 4.8, 0.4) }}>{L.alone}</div>
        </div>
      )}

      {/* s3–s4: inside: 4 → 16 → 4 */}
      {frame >= S.s3.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: netOn }}>
          <Chip text={SCHOOL.w} color="yellow" fs={44} x={90} y={126} />
          <div style={{ position: "absolute", left: 90 + chipWidth(SCHOOL.w, 44) + 24, top: 134, fontSize: 40, fontWeight: 700 }}>{L.inside}</div>
          <div style={{ position: "absolute", left: 800, top: 140, fontSize: 28, color: "var(--ink-3)" }}>{L.toy}</div>
          <Layer>
            {IN_X.map((x, a) =>
              HID_X.map((hx, b) => (
                <line key={`${a}-${b}`} x1={x} y1={IN_Y + NODE_R} x2={hx} y2={HID_Y - HID_R} stroke="var(--ink-3)" strokeWidth={2} opacity={0.4 * beat(frame, S.s3, 1.0 + b * 0.03, 0.5)} />
              )),
            )}
            {HID_X.map((hx, b) =>
              IN_X.map((x, a) => (
                <line key={`o${a}-${b}`} x1={hx} y1={HID_Y + HID_R} x2={x} y2={OUT_Y - NODE_R} stroke="var(--ink-3)" strokeWidth={2} opacity={0.4 * lines2} />
              )),
            )}
          </Layer>
          {IN_X.map((x, k) => (
            <Node key={k} x={x} y={IN_Y} r={NODE_R} fill="var(--hl-sky)" text={fmt1(SCHOOL.x[k])} o={beat(frame, S.s3, 0.5 + k * 0.1, 0.4)} />
          ))}
          <div style={{ position: "absolute", left: 836, top: IN_Y - 22, fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s3, 0.8, 0.4) }}>{L.four}</div>
          {HID_X.map((hx, b) => {
            const act = Math.max(0, RUN.h[b]) / HMAX;
            return <Node key={b} x={hx} y={HID_Y} r={HID_R} fill={`color-mix(in srgb, var(--hl-yellow) ${Math.round(act * fire * 100)}%, var(--paper))`} o={lines1} />;
          })}
          <div style={{ position: "absolute", left: 96, top: HID_Y + 34, fontSize: 34, fontWeight: 700, opacity: lines1 }}>{L.wide}</div>
          <div style={{ position: "absolute", left: 720, top: HID_Y - 128, width: 300, opacity: beat(frame, S.s3, 2.6, 0.5) * (1 - beat(frame, S.s4, 0.6, 0.4)) }}>
            <svg width={90} height={60} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <line x1={0} y1={GLY(0)} x2={84} y2={GLY(0)} stroke="var(--ink-3)" strokeWidth={2} />
              <path d={GELU_PATH} fill="none" stroke="var(--pen)" strokeWidth={4} strokeLinecap="round" />
            </svg>
            <Hand x={92} y={10} fs={34}>
              {L.gelu}
            </Hand>
          </div>
          {IN_X.map((x, k) => (
            <Node key={`y${k}`} x={x} y={OUT_Y} r={NODE_R} fill="var(--hl-mint)" text={fmt1(RUN.y[k])} o={outP} />
          ))}
          <div style={{ position: "absolute", left: 836, top: OUT_Y - 22, fontSize: 34, fontWeight: 700, opacity: outP }}>{L.back}</div>

          {/* s4: one neuron with a (made-up) name tag */}
          <PenCircle x={HID_X[TAGGED] - 40} y={HID_Y - 40} w={80} h={80} p={beat(frame, S.s4, 1.4, 0.7)} />
          <div style={{ opacity: beat(frame, S.s4, 2.4, 0.5) }}>
            <Layer>
              <PenArrow x1={HID_X[TAGGED] - 30} y1={HID_Y - 120} x2={HID_X[TAGGED] - 4} y2={HID_Y - 46} p={beat(frame, S.s4, 2.4, 0.5)} />
            </Layer>
            <Hand x={0} y={HID_Y - 186} fs={42} style={{ width: 1010, textAlign: "right" }}>
              <span style={{ background: "var(--paper)", padding: "0 8px", borderRadius: 8 }}>{L.tagN}</span>
            </Hand>
          </div>
        </div>
      )}

      {/* s5: add it back */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: sumOn }}>
          <Chip text={SCHOOL.w} color="yellow" fs={44} x={90} y={190} />
          {[
            { label: L.orig, v: SCHOOL.x, y: 350, color: "sky" as const, t: 0.5, pen: false },
            { label: L.thought, v: RUN.y, y: 450, color: "mint" as const, t: 1.6, pen: true },
            { label: L.result, v: RUN.out, y: 590, color: "yellow" as const, t: 3.0, pen: false },
          ].map((r) => {
            const a = beat(frame, S.s5, r.t, 0.5);
            return (
              <div key={r.label} style={{ opacity: a, translate: `0px ${mix(16, 0, a)}px` }}>
                <div style={{ position: "absolute", left: 90, top: r.y + 8, fontSize: 40, fontWeight: 700, color: r.pen ? "var(--pen)" : "var(--ink)" }}>{r.label}</div>
                <VecCells x={420} y={r.y} v={r.v} dir="row" cw={128} ch={64} fs={38} gap={10} color={r.color} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 410, top: 552, width: 562, height: 5, borderRadius: 3, background: "var(--ink)", opacity: beat(frame, S.s5, 2.6, 0.4) }} />
          <Hand x={0} y={740} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 4.0, 0.5), rotate: "-2deg" }}>
            <InlineCircle p={beat(frame, S.s5, 4.4, 0.6)}>{L.knowledge}</InlineCircle>
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s5, 1.0, 0.4) }}>{L.toy}</div>
        </div>
      )}

      {/* s6: real sizes, to scale */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: realOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 52, fontWeight: 700 }}>{L.real}</div>
          {(() => {
            const g1 = beat(frame, S.s6, 0.8, 0.6);
            const g2 = beat(frame, S.s6, 2.4, 1.0, EASE_IO);
            const g3 = beat(frame, S.s6, 4.6, 1.0, EASE_IO);
            const bar = (y: number, w: number, c: string, text: string, o: number) => (
              <div style={{ position: "absolute", left: 540 - w / 2, top: y, width: w, height: 96, borderRadius: 16, background: c, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 46, fontWeight: 500, color: "var(--chip-ink)", opacity: o }}>
                {text}
              </div>
            );
            return (
              <>
                <Layer>
                  <polygon points={`${540 - BAR_D / 2},376 ${540 + BAR_D / 2},376 ${540 + BAR_FULL / 2},466 ${540 - BAR_FULL / 2},466`} fill="var(--paper-2)" opacity={g2} />
                  <polygon points={`${540 - BAR_FULL / 2},562 ${540 + BAR_FULL / 2},562 ${540 + BAR_D / 2},652 ${540 - BAR_D / 2},652`} fill="var(--paper-2)" opacity={g3} />
                </Layer>
                {bar(280, BAR_D, "var(--hl-sky)", L.n1, g1)}
                {bar(466, mix(BAR_D, BAR_FULL, g2), "var(--hl-yellow)", L.n2, g2)}
                {bar(652, mix(BAR_FULL, BAR_D, g3), "var(--hl-mint)", L.n1, g3)}
              </>
            );
          })()}
          <Hand x={880} y={380} fs={60} style={{ opacity: beat(frame, S.s6, 3.4, 0.4) }}>
            {L.times}
          </Hand>
          <Hand x={0} y={790} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 3.8, 0.4) }}>
            {L.gelu}
          </Hand>
        </div>
      )}

      {/* s7: where the numbers live */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: shareOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontSize: 52, fontWeight: 700 }}>{L.total}</div>
          {(() => {
            let acc = 90;
            return SEG.map((s, i) => {
              const w = s.w * 900;
              const left = acc;
              acc += w;
              return <div key={i} style={{ position: "absolute", left, top: 360, width: w * beat(frame, S.s7, 0.8 + i * 0.6, 0.6), height: 120, background: s.c, borderRadius: i === 0 ? "16px 0 0 16px" : i === 2 ? "0 16px 16px 0" : 0 }} />;
            });
          })()}
          <div style={{ position: "absolute", left: 90, width: SEG[0].w * 900, top: 500, textAlign: "center", fontSize: 38, fontWeight: 700, opacity: beat(frame, S.s7, 1.2, 0.4) }}>{L.ffnPart}</div>
          <div style={{ position: "absolute", left: 90 + SEG[0].w * 900, width: SEG[1].w * 900, top: 500, textAlign: "center", fontSize: 32, fontWeight: 500, color: "var(--ink-2)", opacity: beat(frame, S.s7, 1.8, 0.4) }}>{L.attPart}</div>
          <Hand x={90} y={600} fs={58} style={{ width: SEG[0].w * 900, textAlign: "center", opacity: beat(frame, S.s7, 3.0, 0.4) }}>
            <InlineCircle p={beat(frame, S.s7, 3.4, 0.6)}>{L.twoThirds}</InlineCircle>
          </Hand>
          <Hand x={0} y={760} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.0, 0.5), rotate: "-2deg" }}>
            = {L.store}
          </Hand>
        </div>
      )}

      {/* s8: the blueprint gets its part */}
      {frame >= S.s8.from && (
        <div style={{ opacity: bpOn }}>
          <Hand x={0} y={104} fs={44} color="var(--ink)" style={{ width: 1080, textAlign: "center" }}>
            {L.talk} · {L.think}
          </Hand>
          <Blueprint y0={176} fill={{ out: 0, ffn: beat(frame, S.s8, 1.6, 0.7) }} focus={{ keys: ["ffn", "att"], t: beat(frame, S.s8, 0.8, 0.6), dim: 0.45 }} />
          <Hand x={870} y={bpFfn + 12} fs={48} style={{ opacity: beat(frame, S.s8, 2.4, 0.4), rotate: "-4deg" }}>
            {L.filled}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch55.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
