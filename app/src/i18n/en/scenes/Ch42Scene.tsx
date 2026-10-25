// en: overlay of src/scenes/Ch42Scene.tsx: smaller word chips (Spanish words and the 11-word English sentence
// are wider than the Korean ones) and a few labels moved clear of each other.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CORRECT, EN, EN_FROM, FULL, KO, KO_COLORS, ch42 } from "../../../data/ch42";
import { Arrow, Box, Demo } from "../../../scenes/part4-kit";
import {
  Caption,
  Chip,
  EASE_IO,
  Hand,
  InlineCircle,
  Narration,
  Paper,
  Tag,
  beat,
  buildTimeline,
  byId,
  chipWidth,
  mix,
  rowLayout,
  wrapLayout,
  type SceneProps,
} from "../../../scenes/kit";

const tl = buildTimeline(ch42);
const S = byId(tl);
const L = ch42.labels;

const MINI = { width: 54, height: 40, borderRadius: "4px 4px 4px 12px", border: "3px solid var(--ink)", background: "var(--hl-yellow)", rotate: "-4deg", boxSizing: "border-box" } as const;

// s1: the two sentences
const FS1 = 46; // en: the Spanish words are wider
const KW = KO.map((w) => chipWidth(w, FS1));
const KX = rowLayout(KW, 40);
const EW = EN.map((w) => chipWidth(w, FS1));
const EX = rowLayout(EW, 30);

// s3–s4: unrolled encoder and decoder
const ENC_W = 170;
const ENC_X = rowLayout([ENC_W, ENC_W, ENC_W, ENC_W], 60);
const ENC_Y = 300;
const DEC_W = 130;
const DEC_OUT = [...EN, L.end];
const DEC_IN = [L.start, ...EN];
const DEC_X = rowLayout(DEC_OUT.map(() => DEC_W), 26);
const DEC_Y = 710;
const CORR_Y = 566;
const SUM = { x: 450, y: CORR_Y - 36, w: 190, h: 72 };
const ENC_T = (k: number) => 0.8 + k * 0.9;
const DEC_T = (k: number) => 1.0 + k * 1.15;
// the wrap-around path the summary note travels: right side of the encoder → corridor → first decoder cell
const PATH_PTS: [number, number][] = [
  [ENC_X[3] + ENC_W, ENC_Y + 50],
  [1016, ENC_Y + 50],
  [1016, CORR_Y],
  [DEC_X[0] - 28, CORR_Y],
  [DEC_X[0] - 28, DEC_Y + 48],
  [DEC_X[0] - 6, DEC_Y + 48],
];
const PATH_D = PATH_PTS.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");

// s5: short vs long into the same-size note
const LONG_WORDS = L.longKo.split(" ");
const SFS = 40;
const SHORT_POS = wrapLayout(KO.map((w) => chipWidth(w, SFS)), { x0: 90, y0: 250, maxW: 400, gap: 10, lineH: 70 });
// en: 11 English words, so a smaller size for the long sentence
const LFS = 34;
const LONG_POS = wrapLayout(LONG_WORDS.map((w) => chipWidth(w, LFS)), { x0: 570, y0: 250, maxW: 450, gap: 10, lineH: 58 });
const NOTE5 = [
  { x: 110, y: 560, w: 360, h: 110 },
  { x: 610, y: 560, w: 360, h: 110 },
];
const SLOT_VALUES = ["0.3", "−0.8", "0.5", "0.1"];

// s6: the bottle
const OUT_FS = 36;
const OUT_POS = wrapLayout(FULL.out.map((w) => chipWidth(w, OUT_FS)), { x0: 90, y0: 720, maxW: 900, gap: 12, lineH: 66 });

export const Ch42Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2On = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const relayOn = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const s5On = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const s6On = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.3, 0.5);
  const travel = beat(frame, S.s3, 4.6, 1.6, EASE_IO);

  // a point along the wrap path
  const lens = PATH_PTS.slice(1).map((p, i) => Math.hypot(p[0] - PATH_PTS[i][0], p[1] - PATH_PTS[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  const along = (t: number): [number, number] => {
    let d = t * total;
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i]) {
        const f = d / lens[i];
        return [mix(PATH_PTS[i][0], PATH_PTS[i + 1][0], f), mix(PATH_PTS[i][1], PATH_PTS[i + 1][1], f)];
      }
      d -= lens[i];
    }
    return PATH_PTS[PATH_PTS.length - 1];
  };
  const toSum = Math.min(1, travel * 1.8); // first part: to the summary spot on the corridor
  const sumStop = (() => {
    // fraction of the path where the corridor passes the summary note
    const d = lens[0] + lens[1] + (PATH_PTS[2][0] - (SUM.x + SUM.w / 2));
    return d / total;
  })();

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: word order and length differ */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {EN.map((_, j) => {
              const i = EN_FROM[j];
              const p = beat(frame, S.s1, 2.0 + j * 0.5, 0.6);
              const x1 = KX[i] + KW[i] / 2;
              const x2 = EX[j] + EW[j] / 2;
              return <line key={j} x1={x1} y1={300 + FS1 * 1.5 + 6} x2={mix(x1, x2, p)} y2={mix(300 + FS1 * 1.5 + 6, 620 - 6, p)} stroke="var(--ink-3)" strokeWidth={5} strokeLinecap="round" opacity={p > 0 ? 1 : 0} />;
            })}
          </svg>
          {KO.map((w, i) => (
            <Chip key={w} text={w} fs={FS1} color={KO_COLORS[i]} x={KX[i]} y={300} w={KW[i]} style={{ opacity: beat(frame, S.s1, 0.4 + i * 0.15, 0.4) }} />
          ))}
          {EN.map((w, j) => (
            <Chip key={w} text={w} fs={FS1} color={KO_COLORS[EN_FROM[j]]} x={EX[j]} y={620} w={EW[j]} style={{ opacity: beat(frame, S.s1, 2.2 + j * 0.5, 0.4) }} />
          ))}
          <Hand x={0} y={820} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.4, 0.5) }}>
            {L.diff}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 910, textAlign: "center", fontSize: 38, color: "var(--ink-2)", opacity: beat(frame, S.s1, 6.4, 0.5) }}>{L.noOneByOne}</div>
        </div>
      )}

      {/* s2: two RNNs */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 76, fontWeight: 500 }}>{L.s2s}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", fontSize: 36, fontWeight: 500, opacity: beat(frame, S.s2, 0.8, 0.4) }}>{L.s2sD}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontSize: 34, color: "var(--ink-2)", opacity: beat(frame, S.s2, 1.4, 0.4) }}>{L.year}</div>
          {[
            { x: 90, c: "var(--hl-sky)", t: L.enc, d: L.encD, at: 3.0 },
            { x: 650, c: "var(--hl-orange)", t: L.dec, d: L.decD, at: 4.4 },
          ].map((b) => (
            <Box key={b.t} x={b.x} y={470} w={340} h={180} color={b.c} o={beat(frame, S.s2, b.at, 0.5)}>
              <div style={{ fontSize: 52, fontWeight: 700 }}>{b.t}</div>
              <div style={{ fontSize: 32, fontWeight: 500, marginTop: 4 }}>{b.d}</div>
            </Box>
          ))}
          <div style={{ ...MINI, position: "absolute", left: 513, top: 540, opacity: beat(frame, S.s2, 5.4, 0.4) }} />
          <Arrow x1={436} y1={560} x2={506} y2={560} p={beat(frame, S.s2, 5.4, 0.4)} width={5} />
          <Arrow x1={572} y1={560} x2={644} y2={560} p={beat(frame, S.s2, 5.8, 0.4)} width={5} />
          <div style={{ position: "absolute", left: 90, width: 340, top: 720, textAlign: "center", fontSize: 38, fontWeight: 500, opacity: beat(frame, S.s2, 3.4, 0.4) }}>{KO.join(" ")}</div>
          <Arrow x1={260} y1={712} x2={260} y2={658} p={beat(frame, S.s2, 3.6, 0.4)} width={5} />
          <div style={{ position: "absolute", left: 600, width: 440, top: 724, textAlign: "center", fontSize: 32, fontWeight: 500, whiteSpace: "nowrap", opacity: beat(frame, S.s2, 6.4, 0.4) }}>{EN.join(" ")}</div>
          <Arrow x1={820} y1={658} x2={820} y2={712} p={beat(frame, S.s2, 6.2, 0.4)} width={5} />
        </div>
      )}

      {/* s3–s4: encoder reads, decoder writes */}
      {frame >= S.s3.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: relayOn }}>
          <div style={{ position: "absolute", left: ENC_X[0], top: ENC_Y - 64, fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s3, 0.4, 0.4) }}>
            <span style={{ background: "var(--hl-sky)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 12px" }}>{L.enc}</span>
          </div>
          {KO.map((w, k) => {
            const a = beat(frame, S.s3, ENC_T(k) - 0.4, 0.4);
            return (
              <div key={w} style={{ opacity: a }}>
                <Box x={ENC_X[k]} y={ENC_Y} w={ENC_W} h={100} color="var(--hl-sky)" radius={18} border={4} />
                <Chip text={w} fs={40} color={KO_COLORS[k]} x={ENC_X[k] + ENC_W / 2 - chipWidth(w, 40) / 2} y={ENC_Y + 140} />
                <Arrow x1={ENC_X[k] + ENC_W / 2} y1={ENC_Y + 134} x2={ENC_X[k] + ENC_W / 2} y2={ENC_Y + 106} p={a} width={4} />
                {k < 3 && <Arrow x1={ENC_X[k] + ENC_W + 4} y1={ENC_Y + 50} x2={ENC_X[k + 1] - 6} y2={ENC_Y + 50} p={beat(frame, S.s3, ENC_T(k) + 0.2, 0.3)} width={4} />}
                {k < 3 &&
                  (() => {
                    const t = beat(frame, S.s3, ENC_T(k) + 0.3, 0.6, EASE_IO);
                    return t > 0 && t < 1 ? <div style={{ ...MINI, position: "absolute", left: mix(ENC_X[k] + ENC_W - 30, ENC_X[k + 1] - 26, t), top: ENC_Y + 4 }} /> : null;
                  })()}
              </div>
            );
          })}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d={PATH_D} fill="none" stroke="var(--ink-3)" strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s3, 4.2, 0.6)} />
          </svg>
          {/* the summary note rides the path, then rests on the corridor */}
          {travel > 0 &&
            (() => {
              const t = frame < S.s4.from ? mix(0, sumStop, toSum) : mix(sumStop, 1, beat(frame, S.s4, 0.2, 0.6, EASE_IO));
              const [px, py] = along(t);
              const resting = frame < S.s4.from && toSum >= 1;
              return (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: resting ? SUM.x : px - 27,
                      top: resting ? SUM.y : py - 20,
                      width: resting ? SUM.w : 54,
                      height: resting ? SUM.h : 40,
                      borderRadius: "6px 6px 6px 16px",
                      border: "3px solid var(--ink)",
                      background: "var(--hl-yellow)",
                      rotate: "-3deg",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 34,
                      fontWeight: 700,
                      color: "var(--chip-ink)",
                      boxSizing: "border-box",
                    }}
                  >
                    {resting ? L.summary : ""}
                  </div>
                  {frame >= S.s4.from && (
                    <div style={{ position: "absolute", left: SUM.x, top: SUM.y, width: SUM.w, height: SUM.h, borderRadius: "6px 6px 6px 16px", border: "3px dashed var(--ink-3)", display: "grid", placeItems: "center", fontSize: 34, fontWeight: 700, color: "var(--ink-3)", boxSizing: "border-box", background: "var(--paper)" }}>
                      {L.summary}
                    </div>
                  )}
                </>
              );
            })()}
          <Hand x={SUM.x + SUM.w + 24} y={CORR_Y + 30} fs={42} style={{ opacity: beat(frame, S.s3, 6.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            = {L.whole}
          </Hand>

          {/* decoder */}
          {frame >= S.s4.from && (
            <>
              <div style={{ position: "absolute", left: DEC_X[0], top: DEC_Y + 230, fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s4, 0.4, 0.4) }}>
                <span style={{ background: "var(--hl-orange)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 12px" }}>{L.dec}</span>
              </div>
              {DEC_OUT.map((w, k) => {
                const a = beat(frame, S.s4, DEC_T(k) - 0.5, 0.4);
                const out = beat(frame, S.s4, DEC_T(k), 0.4);
                const isEnd = w === L.end;
                const inW = DEC_IN[k];
                const cx = DEC_X[k] + DEC_W / 2;
                return (
                  <div key={k} style={{ opacity: a }}>
                    <Box x={DEC_X[k]} y={DEC_Y} w={DEC_W} h={96} color="var(--hl-orange)" radius={16} border={4} />
                    <Chip
                      text={inW}
                      fs={26}
                      color={k === 0 ? null : KO_COLORS[EN_FROM[k - 1]]}
                      x={cx - chipWidth(inW, 26) / 2}
                      y={DEC_Y + 128}
                      style={k === 0 ? { background: "var(--paper-2)", color: "var(--ink-2)" } : undefined}
                    />
                    <Arrow x1={cx} y1={DEC_Y + 124} x2={cx} y2={DEC_Y + 102} p={a} width={4} />
                    <div style={{ opacity: out }}>
                      <Chip
                        text={w}
                        fs={26}
                        color={isEnd ? null : KO_COLORS[EN_FROM[k]]}
                        x={cx - chipWidth(w, 26) / 2}
                        y={DEC_Y - 76}
                        style={isEnd ? { background: "var(--ink)", color: "var(--paper)" } : undefined}
                      />
                      <Arrow x1={cx} y1={DEC_Y - 4} x2={cx} y2={DEC_Y - 22} p={out} width={4} />
                    </div>
                    {k < DEC_OUT.length - 1 && (
                      <>
                        <Arrow x1={DEC_X[k] + DEC_W + 3} y1={DEC_Y + 48} x2={DEC_X[k + 1] - 4} y2={DEC_Y + 48} p={beat(frame, S.s4, DEC_T(k) + 0.1, 0.3)} width={4} />
                        <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                          <path
                            d={`M ${cx + chipWidth(w, 26) / 2 - 4} ${DEC_Y - 50} C ${DEC_X[k] + DEC_W + 30} ${DEC_Y - 50}, ${DEC_X[k] + DEC_W - 4} ${DEC_Y + 150}, ${DEC_X[k + 1] + 10} ${DEC_Y + 150}`}
                            fill="none"
                            stroke="var(--pen)"
                            strokeWidth={3.5}
                            strokeDasharray="6 7"
                            opacity={beat(frame, S.s4, DEC_T(k) + 0.4, 0.4)}
                          />
                        </svg>
                      </>
                    )}
                  </div>
                );
              })}
              <Hand x={DEC_X[1] + 60} y={DEC_Y + 226} fs={40} style={{ opacity: beat(frame, S.s4, 7.6, 0.4) }}>
                {L.auto}
              </Hand>
            </>
          )}
        </div>
      )}

      {/* s5: the note's size is fixed */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5On }}>
          {[
            { words: KO, pos: SHORT_POS, note: NOTE5[0], at: 1.4, colors: KO_COLORS },
            { words: LONG_WORDS, pos: LONG_POS, note: NOTE5[1], at: 4.0, colors: null },
          ].map((g, gi) => {
            const pour = beat(frame, S.s5, g.at + 0.8, 1.0, EASE_IO);
            const strain = gi === 1 ? beat(frame, S.s5, g.at + 1.6, 0.4) : 0;
            const wob = gi === 1 ? Math.sin((frame - S.s5.from) / 2.2) * 3 * strain * (1 - beat(frame, S.s5, g.at + 2.6, 0.6)) : 0;
            const blockBottom = Math.max(...g.pos.map((p) => p.y)) + (gi === 1 ? LFS : SFS) * 1.5;
            return (
              <div key={gi}>
                {g.words.map((w, i) => (
                  <Chip
                    key={i}
                    text={w}
                    fs={gi === 1 ? LFS : SFS}
                    color={g.colors ? g.colors[i] : "violet"}
                    x={g.pos[i].x}
                    y={g.pos[i].y}
                    style={{ opacity: beat(frame, S.s5, g.at - 0.8 + i * 0.08, 0.3) * mix(1, 0.45, pour) }}
                  />
                ))}
                <Arrow x1={g.note.x + g.note.w / 2} y1={blockBottom + 14} x2={g.note.x + g.note.w / 2} y2={g.note.y - 10} p={pour} width={6} color={gi === 1 ? "var(--pen)" : "var(--ink)"} />
                <div
                  style={{
                    position: "absolute",
                    left: g.note.x,
                    top: g.note.y,
                    width: g.note.w,
                    height: g.note.h,
                    border: `${gi === 1 && strain > 0.5 ? 6 : 4}px solid ${gi === 1 && strain > 0.5 ? "var(--pen)" : "var(--ink)"}`,
                    borderRadius: "6px 6px 6px 20px",
                    background: "var(--hl-yellow)",
                    color: "var(--chip-ink)",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 34,
                    boxSizing: "border-box",
                    rotate: `${wob}deg`,
                    scale: gi === 1 ? `${mix(1, 1.04, strain)} ${mix(1, 0.86, strain)}` : undefined,
                    opacity: beat(frame, S.s5, 0.6, 0.4),
                  }}
                >
                  {SLOT_VALUES.map((v, k) => (
                    <span key={k} style={{ opacity: mix(0.25, 1, pour) }}>
                      {v}
                    </span>
                  ))}
                </div>
                {gi === 1 && (
                  <Hand x={g.note.x + g.note.w - 150} y={g.note.y - 84} fs={60} style={{ opacity: strain, rotate: "-8deg" }}>
                    {L.squeeze}
                  </Hand>
                )}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 38, fontWeight: 500, opacity: beat(frame, S.s5, 6.0, 0.4) }}>
            {L.both}
          </div>
          <Hand x={0} y={800} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 6.8, 0.5) }}>
            <InlineCircle p={beat(frame, S.s5, 7.2, 0.6)}>{L.fixed}</InlineCircle>
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 910, textAlign: "center", fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s5, 8.0, 0.5) }}>{L.real}</div>
        </div>
      )}

      {/* s6: the bottleneck */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d="M 120 150 L 960 150 L 960 210 C 960 330, 620 360, 600 450 L 600 560 L 480 560 L 480 450 C 460 360, 120 330, 120 210 Z"
              fill="var(--paper-2)"
              stroke="var(--ink)"
              strokeWidth={5}
              strokeLinejoin="round"
              opacity={beat(frame, S.s6, 0.4, 0.5)}
            />
          </svg>
          {LONG_WORDS.map((w, i) => {
            const pos = wrapLayout(LONG_WORDS.map((x) => chipWidth(x, 36)), { x0: 170, y0: 176, maxW: 760, gap: 10, lineH: 60 })[i];
            return <Chip key={i} text={w} fs={36} color="violet" x={pos.x} y={pos.y} style={{ opacity: beat(frame, S.s6, 0.8 + i * 0.1, 0.3) }} />;
          })}
          <div style={{ ...MINI, position: "absolute", left: 513, top: 480, opacity: beat(frame, S.s6, 1.6, 0.4) }} />
          <Hand x={630} y={470} fs={46} style={{ opacity: beat(frame, S.s6, 2.0, 0.4) }}>
            {L.bottleneck}
          </Hand>
          <Arrow x1={540} y1={566} x2={540} y2={700} p={beat(frame, S.s6, 2.6, 0.5)} width={6} />
          {FULL.out.map((w, i) => {
            const lost = w === "???";
            return (
              <Chip
                key={i}
                text={w}
                fs={OUT_FS}
                color={lost ? null : "orange"}
                x={OUT_POS[i].x}
                y={OUT_POS[i].y}
                style={{ opacity: beat(frame, S.s6, 3.0 + i * 0.3, 0.3), ...(lost ? { background: "var(--paper)", border: "3px dashed var(--pen)", color: "var(--pen)" } : {}) }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 90, width: 900, top: OUT_POS[OUT_POS.length - 1].y + 74, fontSize: 30, lineHeight: 1.35, color: "var(--ink-2)", wordBreak: "keep-all", overflowWrap: "normal", opacity: beat(frame, S.s6, 5.4, 0.4) }}>
            {L.correct} {CORRECT.join(" ")}
          </div>
          <Hand x={90} y={OUT_POS[OUT_POS.length - 1].y + 168} fs={42} style={{ opacity: beat(frame, S.s6, 6.0, 0.4) }}>
            {L.lostLabel}: {FULL.lost.join(", ")} → {L.longer}
          </Hand>
          <Demo text={L.demo} o={1} />
        </div>
      )}

      {/* s7: what if the decoder could look back? */}
      {frame >= S.s7.from && (
        <div style={{ opacity: s7On }}>
          {KO.map((w, i) => (
            <Chip key={w} text={w} fs={FS1} color={KO_COLORS[i]} x={KX[i]} y={300} w={KW[i]} />
          ))}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {KO.map((_, i) => {
              const p = beat(frame, S.s7, 1.4 + i * 0.25, 0.5);
              const x1 = 540;
              const y1 = 600;
              const x2 = KX[i] + KW[i] / 2;
              const y2 = 300 + FS1 * 1.5 + 10;
              return <line key={i} x1={x1} y1={y1} x2={mix(x1, x2, p)} y2={mix(y1, y2, p)} stroke="var(--pen)" strokeWidth={5} strokeDasharray="12 10" strokeLinecap="round" opacity={p > 0 ? 1 : 0} />;
            })}
          </svg>
          <Box x={460} y={600} w={160} h={100} color="var(--hl-orange)" radius={16} border={4} o={beat(frame, S.s7, 0.6, 0.4)}>
            <div style={{ fontSize: 30, fontWeight: 700 }}>{L.dec}</div>
          </Box>
          <Chip text="school" fs={40} color="violet" x={540 - chipWidth("school", 40) / 2} y={740} style={{ opacity: beat(frame, S.s7, 0.8, 0.4) }} />
          <Hand x={0} y={850} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.0, 0.5) }}>
            {L.ask}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", opacity: beat(frame, S.s7, 5.0, 0.5) }}>
            <span style={{ fontSize: 44, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 22px" }}>{L.next}</span>
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch42.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
