// en: overlay of src/scenes/Ch41Scene.tsx: word labels under the bars are staggered (English words are wider),
// the GPU word chips are smaller, and the notes show what 'Yesterday' wrote ('past', as in ch40) instead of the word.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { GIST, SLOTS, VERBS, predictVerb } from "../../../data/ch40";
import { BACK, GPU_WORDS, LONG, LONG_LSTM, LONG_NOTES, ch41 } from "../../../data/ch41";
import { Arrow, BarRow, Box, Demo } from "../../../scenes/part4-kit";
import {
  Caption,
  Chip,
  EASE_IO,
  Hand,
  InlineCircle,
  Narration,
  Paper,
  PenCircle,
  Tag,
  beat,
  buildTimeline,
  byId,
  chipWidth,
  mix,
  wrapLayout,
  type SceneProps,
} from "../../../scenes/kit";

const tl = buildTimeline(ch41);
const S = byId(tl);
const L = ch41.labels;

const OUTLINE = { background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)" } as const;

// the long sentence, wrapped
const FS = 44;
const WORDS = [...LONG, "?"];
const WW = WORDS.map((w) => (w === "?" ? 130 : chipWidth(w, FS)));
const WP = wrapLayout(WW, { x0: 80, y0: 190, maxW: 920, gap: 14, lineH: 92 });

const N = LONG.length;

// s1: a dashed arc from 어제 round the left edge and under the second row to the blank
const ARC_Y = WP[N].y + FS * 1.5 + 40;
const ARC = (() => {
  const x0 = WP[0].x - 6;
  const y0 = WP[0].y + (FS * 1.5) / 2;
  const qx = WP[N].x + WW[N] / 2;
  const qy = WP[N].y + FS * 1.5 + 6;
  return `M ${x0} ${y0} C ${x0 - 30} ${y0 + 20}, ${x0 - 30} ${ARC_Y}, ${x0 + 40} ${ARC_Y} L ${qx - 40} ${ARC_Y} C ${qx} ${ARC_Y}, ${qx} ${ARC_Y - 10}, ${qx} ${qy}`;
})();

// bar chart of how strongly 어제 survives on the note
const PITCH = 84;
const BX0 = 540 - (N * PITCH) / 2;
const bx = (i: number) => BX0 + i * PITCH + PITCH / 2;
const BASE = 930;
const BAR_H = 280;
const RNN_T = LONG_NOTES.map((n) => Math.abs(n.h[0]));
const LSTM_T = LONG_LSTM.map((n) => Math.abs(n.h[0]));
const P_RNN = predictVerb(LONG_NOTES[N - 1].h);
const READ_T = (i: number) => 0.8 + i * 0.55; // s2: when word i is read

// s6 GPUs
const GPU_W = 140;
const GPU_X = (i: number) => 70 + i * 160;
const GPU_Y = 380;
const ACTIVE_AT = [1.2, 3.0, 4.8];

const pct = (p: number) => `${Math.round(p * 100)}%`;

export const Ch41Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const dim = frame < S.s5.from ? mix(1, 0.35, beat(frame, S.s4, 0, 0.5)) : mix(0.35, 1, beat(frame, S.s5, 0, 0.5));
  const sentOn = beat(frame, S.s1, 0.2, 0.5) * dim * (1 - beat(frame, S.s6, 0, 0.5));
  const chartOn = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const predOn = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const backOn = beat(frame, S.s4, 0.4, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const lstmOn = beat(frame, S.s5, 0.4, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const gpuOn = beat(frame, S.s6, 0.4, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const ganttOn = beat(frame, S.s7, 0.4, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const sumOn = beat(frame, S.s8, 0.4, 0.5);

  // s2: index of the word being read
  const read = frame < S.s2.from ? -1 : LONG.reduce((acc, _, i) => (beat(frame, S.s2, READ_T(i), 0.3) > 0 ? i : acc), -1);
  const readStrength = read < 0 ? 1 : RNN_T[read];

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s5: the long sentence */}
      {frame < S.s6.from + 15 && (
        <div style={{ opacity: sentOn }}>
          {WORDS.map((w, i) => {
            const a = beat(frame, S.s1, 0.4 + i * 0.12, 0.3);
            const isReading = frame >= S.s2.from && frame < S.s3.from && i === read;
            if (w === "?")
              return (
                <div key={i} style={{ position: "absolute", left: WP[i].x, top: WP[i].y, width: WW[i], height: FS * 1.5, border: "4px dashed var(--ink-3)", borderRadius: 12, boxSizing: "border-box", display: "grid", placeItems: "center", fontSize: 44, color: "var(--ink-3)", opacity: a }}>
                  ?
                </div>
              );
            return (
              <Chip
                key={i}
                text={w}
                fs={FS}
                color={i === 0 ? "mint" : null}
                x={WP[i].x}
                y={WP[i].y}
                w={WW[i]}
                style={{ ...(i === 0 ? {} : OUTLINE), opacity: a, outline: isReading ? "5px solid var(--pen)" : undefined, outlineOffset: 3 }}
              />
            );
          })}
          <PenCircle x={WP[0].x - 16} y={WP[0].y - 12} w={WW[0] + 32} h={FS * 1.5 + 24} p={beat(frame, S.s1, 3.2, 0.6) * (1 - beat(frame, S.s2, 0, 0.3))} />
          {/* 어제 … ? are far apart */}
          <div style={{ opacity: 1 - beat(frame, S.s2, 0, 0.3) }}>
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path
                d={ARC}
                fill="none"
                stroke="var(--pen)"
                strokeWidth={5}
                strokeDasharray="12 10"
                strokeLinecap="round"
                opacity={beat(frame, S.s1, 3.6, 0.3)}
              />
            </svg>
            <Hand x={0} y={ARC_Y + 14} fs={42} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.9, 0.4) }}>
              {L.far}
            </Hand>
          </div>
          <Hand x={0} y={ARC_Y + 120} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.3)) }}>
            {L.answer}
          </Hand>
          <div style={{ opacity: beat(frame, S.s1, 6.6, 0.5) * (1 - beat(frame, S.s2, 0, 0.3)) }}>
            <div style={{ position: "absolute", left: 300, top: 700, width: 480, height: 110, rotate: "-2deg", background: "var(--hl-yellow)", border: "3px solid var(--ink)", borderRadius: "6px 6px 6px 22px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 24, padding: "0 26px", color: "var(--chip-ink)" }}>
              <b style={{ fontSize: 38 }}>{SLOTS[0]}</b>
              <span style={{ fontFamily: "var(--font-hand)", fontSize: 68, flex: 1 }}>{GIST[LONG[0]]}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 36 }}>−{RNN_T[0].toFixed(2)}</span>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{L.survive}</div>
          </div>
        </div>
      )}

      {/* s2: 어제 fades note by note */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: chartOn }}>
          <div style={{ position: "absolute", left: 300, top: 410, width: 480, height: 96, rotate: "-2deg", background: "var(--hl-yellow)", border: "3px solid var(--ink)", borderRadius: "6px 6px 6px 22px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 24, padding: "0 26px", color: "var(--chip-ink)" }}>
            <b style={{ fontSize: 36 }}>{SLOTS[0]}</b>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 62, opacity: Math.max(0.06, readStrength), flex: 1 }}>{GIST[LONG[0]]}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 34 }}>−{readStrength.toFixed(2)}</span>
          </div>
          <div style={{ position: "absolute", left: BX0, top: 560, fontSize: 38, fontWeight: 700 }}>{L.strength}</div>
          <div style={{ position: "absolute", left: BX0, top: BASE - 2, width: N * PITCH, height: 4, background: "var(--ink)", borderRadius: 2 }} />
          {LONG.map((w, i) => {
            const g = beat(frame, S.s2, READ_T(i), 0.4);
            const h = RNN_T[i] * BAR_H * g;
            return (
              <div key={i} style={{ opacity: g }}>
                <div style={{ position: "absolute", left: bx(i) - 30, top: BASE - h, width: 60, height: h, background: "var(--hl-sky)", borderRadius: "10px 10px 2px 2px" }} />
                <div style={{ position: "absolute", left: bx(i) - 42, width: 84, top: BASE - h - 40, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28 }}>{RNN_T[i].toFixed(2)}</div>
                <div style={{ position: "absolute", left: bx(i) - 42, width: 84, top: BASE + 10 + (i % 2) * 34, textAlign: "center", fontSize: 28, color: "var(--ink-2)", display: "flex", justifyContent: "center", whiteSpace: "nowrap" }}>{w}</div>
              </div>
            );
          })}
          <Hand x={620} y={700} fs={46} style={{ opacity: beat(frame, S.s2, 7.2, 0.4), rotate: "-3deg" }}>
            {L.faded}
          </Hand>
          <Demo text={L.toy} o={1} />
        </div>
      )}

      {/* s3: the wrong answer */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: predOn }}>
          {VERBS.map((v, i) => (
            <BarRow key={v.w} x={150} y={560 + i * 70} label={v.w} p={P_RNN[i]} scale={800} color={`var(--hl-${v.c})`} grow={beat(frame, S.s3, 0.6 + i * 0.2, 0.6)} fs={44} labelW={200} text={pct(P_RNN[i])} />
          ))}
          <PenCircle x={150 + 200 + P_RNN[1] * 800 + 2} y={614} w={140} h={92} p={beat(frame, S.s3, 1.8, 0.6)} />
          <Hand x={560} y={500} fs={52} style={{ opacity: beat(frame, S.s3, 2.4, 0.4), rotate: "-3deg" }}>
            {L.wrong}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", opacity: beat(frame, S.s3, 4.6, 0.5) }}>
            <span style={{ fontSize: 46, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 22px" }}>{L.longdep}</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center", fontSize: 38, color: "var(--ink-2)", opacity: beat(frame, S.s3, 5.4, 0.5) }}>{L.longdepD}</div>
          <Demo text={L.toy} o={1} />
        </div>
      )}

      {/* s4: blame fades going backwards */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: backOn }}>
          <div style={{ position: "absolute", left: BX0, top: 470, fontSize: 40, fontWeight: 700 }}>{L.blame}</div>
          <Arrow x1={bx(N - 1)} y1={560} x2={bx(0)} y2={560} p={beat(frame, S.s4, 0.8, 1.6, EASE_IO)} color="var(--pen)" width={6} />
          <Hand x={bx(N - 1) - 300} y={500} fs={40} style={{ opacity: beat(frame, S.s4, 1.0, 0.4), width: 300, textAlign: "right" }}>
            {L.back}
          </Hand>
          {LONG.map((w, i) => {
            const k = N - 1 - i;
            const a = beat(frame, S.s4, 1.0 + k * 0.3, 0.4);
            const r = 10 + 34 * BACK[k];
            return (
              <div key={i} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: bx(i) - r, top: 680 - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "var(--hl-pink)", border: "3px solid var(--ink)", boxSizing: "border-box" }} />
                <div style={{ position: "absolute", left: bx(i) - 42, width: 84, top: 740, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28 }}>{BACK[k].toFixed(2)}</div>
                <div style={{ position: "absolute", left: bx(i) - 42, width: 84, top: 790 + (i % 2) * 34, textAlign: "center", fontSize: 28, color: "var(--ink-2)", display: "flex", justifyContent: "center", whiteSpace: "nowrap" }}>{w}</div>
              </div>
            );
          })}
          <PenCircle x={bx(0) - 56} y={622} w={112} h={210} p={beat(frame, S.s4, 5.0, 0.6)} stroke={5} />
          <Hand x={0} y={880} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 5.6, 0.5) }}>
            {L.barely}
          </Hand>
        </div>
      )}

      {/* s5: LSTM keeps it longer */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: lstmOn }}>
          <div style={{ position: "absolute", left: BX0, top: 430, display: "flex", gap: 18, alignItems: "center", opacity: beat(frame, S.s5, 0.6, 0.4) }}>
            <span style={{ fontSize: 46, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 12, padding: "2px 18px" }}>{L.lstm}</span>
            <span style={{ fontSize: 40, fontWeight: 500 }}>{L.lstmD}</span>
          </div>
          <div style={{ position: "absolute", left: BX0, top: 530, display: "flex", gap: 26, fontSize: 32, opacity: beat(frame, S.s5, 1.2, 0.4) }}>
            <span>
              <span style={{ display: "inline-block", width: 26, height: 26, borderRadius: 6, background: "var(--hl-sky)", verticalAlign: -3, marginRight: 8 }} />
              {L.rnnBars}
            </span>
            <span>
              <span style={{ display: "inline-block", width: 26, height: 26, borderRadius: 6, background: "var(--hl-mint)", verticalAlign: -3, marginRight: 8 }} />
              {L.lstmBars}
            </span>
          </div>
          <div style={{ position: "absolute", left: BX0, top: BASE - 2, width: N * PITCH, height: 4, background: "var(--ink)", borderRadius: 2 }} />
          {LONG.map((w, i) => {
            const g = beat(frame, S.s5, 1.6 + i * 0.18, 0.4);
            return (
              <div key={i}>
                <div style={{ position: "absolute", left: bx(i) - 32, top: BASE - RNN_T[i] * BAR_H, width: 30, height: RNN_T[i] * BAR_H, background: "var(--hl-sky)", borderRadius: "8px 8px 2px 2px" }} />
                <div style={{ position: "absolute", left: bx(i) + 2, top: BASE - LSTM_T[i] * BAR_H * g, width: 30, height: LSTM_T[i] * BAR_H * g, background: "var(--hl-mint)", borderRadius: "8px 8px 2px 2px" }} />
                <div style={{ position: "absolute", left: bx(i) - 42, width: 84, top: BASE + 10 + (i % 2) * 34, textAlign: "center", fontSize: 28, color: "var(--ink-2)", display: "flex", justifyContent: "center", whiteSpace: "nowrap" }}>{w}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: bx(N - 1) - 90, width: 180, top: BASE - LSTM_T[N - 1] * BAR_H - 44, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, opacity: beat(frame, S.s5, 4.0, 0.4) }}>
            {LSTM_T[N - 1].toFixed(2)}
          </div>
          <Hand x={0} y={1018} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 6.2, 0.5) }}>
            {L.still}
          </Hand>
          <Demo text={L.toy} o={1} />
        </div>
      )}

      {/* s6: GPUs waiting in line */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: gpuOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.queue}</div>
          {GPU_WORDS.map((w, i) => {
            const active = ACTIVE_AT.reduce((acc, t, k) => (beat(frame, S.s6, t, 0.2) > 0 ? k : acc), -1);
            const isOn = i === active;
            const done = i < active;
            const x = GPU_X(i);
            return (
              <div key={i} style={{ opacity: beat(frame, S.s6, 0.6 + i * 0.1, 0.3) }}>
                <Box x={x} y={GPU_Y} w={GPU_W} h={120} color={isOn ? "var(--hl-orange)" : "var(--paper-2)"} border={isOn ? 6 : 4} radius={16}>
                  <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    {L.gpu} {i + 1}
                  </div>
                </Box>
                {i < GPU_WORDS.length - 1 && <Arrow x1={x + GPU_W + 2} y1={GPU_Y + 60} x2={x + 158} y2={GPU_Y + 60} p={1} width={4} color="var(--ink-3)" />}
                <Chip text={w} fs={30} color={i === 0 ? "mint" : null} x={x + GPU_W / 2 - chipWidth(w, 30) / 2} y={GPU_Y + 150} style={i === 0 ? undefined : OUTLINE} />
                <div style={{ position: "absolute", left: x - 10, width: GPU_W + 20, top: GPU_Y + 230, textAlign: "center", fontSize: 30, fontWeight: isOn ? 700 : 400, color: isOn ? "var(--pen)" : "var(--ink-3)" }}>
                  {isOn ? L.working : done ? L.done : L.waiting}
                </div>
                {!isOn && !done && (
                  <Hand x={x + 80} y={GPU_Y - 60 + Math.sin(frame / 12 + i) * 6} fs={40} color="var(--ink-3)">
                    {L.zzz}
                  </Hand>
                )}
              </div>
            );
          })}
          <Hand x={0} y={760} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 6.4, 0.5) }}>
            {L.wait}
          </Hand>
        </div>
      )}

      {/* s7: sequential vs all at once */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: ganttOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{L.special}</div>
          <div style={{ position: "absolute", left: 60, top: 322, width: 220, fontSize: 34, fontWeight: 700, lineHeight: 1.25 }}>{L.seq}</div>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 300 + i * 70, top: 320, width: 62, height: 62, borderRadius: 10, background: "var(--hl-sky)", border: "3px solid var(--ink)", boxSizing: "border-box", opacity: beat(frame, S.s7, 0.8 + i * 0.25, 0.25) }} />
          ))}
          <div style={{ position: "absolute", left: 60, top: 528, width: 200, fontSize: 34, fontWeight: 700, lineHeight: 1.25, opacity: beat(frame, S.s7, 3.8, 0.4) }}>{L.par}</div>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 300, top: 450 + i * 22, width: 62, height: 18, borderRadius: 5, background: "var(--hl-mint)", border: "2px solid var(--ink)", boxSizing: "border-box", opacity: beat(frame, S.s7, 4.0, 0.3) }} />
          ))}
          <Arrow x1={300} y1={700} x2={1010} y2={700} p={beat(frame, S.s7, 0.4, 0.6)} width={5} />
          <div style={{ position: "absolute", left: 880, top: 716, fontSize: 32, color: "var(--ink-2)" }}>{L.time} →</div>
          <PenCircle x={280} y={430} w={104} h={250} p={beat(frame, S.s7, 4.6, 0.6)} stroke={5} />
          <Hand x={0} y={830} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.0, 0.5) }}>
            <InlineCircle p={beat(frame, S.s7, 6.4, 0.6)}>{L.thousand}</InlineCircle>
          </Hand>
        </div>
      )}

      {/* s8: two limits */}
      {frame >= S.s8.from && (
        <div style={{ opacity: sumOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontSize: 56, fontWeight: 700 }}>{L.sumTitle}</div>
          {[
            { t: L.sum1, d: L.sum1d, x: 90, at: 0.8 },
            { t: L.sum2, d: L.sum2d, x: 560, at: 1.8 },
          ].map((c, i) => (
            <div key={c.t} style={{ position: "absolute", left: c.x, top: 300, width: 430, height: 330, borderRadius: 22, border: "4px solid var(--ink)", background: "var(--paper)", opacity: beat(frame, S.s8, c.at, 0.5) }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{c.t}</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", fontSize: 32, color: "var(--ink-2)" }}>{c.d}</div>
              {i === 0 ? (
                <div style={{ position: "absolute", left: 95, top: 110, width: 240, height: 130, rotate: "-3deg", background: "var(--hl-yellow)", border: "3px solid var(--ink)", borderRadius: "6px 6px 6px 22px", display: "grid", placeItems: "center", fontFamily: "var(--font-hand)", fontSize: 66, color: "var(--chip-ink)" }}>
                  <span style={{ opacity: 0.15 }}>{GIST[LONG[0]]}</span>
                </div>
              ) : (
                [0, 1, 2].map((k) => (
                  <div key={k} style={{ position: "absolute", left: 40 + k * 125, top: 130, width: 105, height: 90, borderRadius: 12, border: "3px solid var(--ink)", background: k === 0 ? "var(--hl-orange)" : "var(--paper-2)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--chip-ink)" }}>
                    {L.gpu}
                  </div>
                ))
              )}
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", opacity: beat(frame, S.s8, 4.0, 0.5) }}>
            <span style={{ fontSize: 46, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 14, padding: "6px 22px" }}>{L.fix}</span>
          </div>
          <Hand x={0} y={840} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 6.6, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch41.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
