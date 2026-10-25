import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { MAIN, MAIN_W, RECAP, SRC_COLORS, ch43 } from "../data/ch43";
import { Demo } from "./part4-kit";
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
  type SceneProps,
} from "./kit";

const tl = buildTimeline(ch43);
const S = byId(tl);
const L = ch43.labels;

const SRC = MAIN.src;
const TGT = MAIN.tgt;
const SFS = 52;
const SW = SRC.map((w) => chipWidth(w, SFS));
const SX = rowLayout(SW, 50);
const SCX = SX.map((x, i) => x + SW[i] / 2);
const SRC_Y = 330;
const NOTE_Y = 196;
const NOTE_W = 124;
const PCT_Y = SRC_Y + SFS * 1.5 + 14;
const TFS = 48;
const TW = TGT.map((w) => chipWidth(w, TFS));
const TX = rowLayout(TW, 40);
const TCX = TX.map((x, i) => x + TW[i] / 2);
const TGT_Y = 760;
const TODAY = TGT.length - 1;
const fmtScore = (v: number) => v.toFixed(1);

// when each target word gets written: [step, seconds into the step]
const WRITE: [keyof typeof S, number][] = [
  ["s2", 0.8],
  ["s3", 0.6],
  ["s4", 0.5],
  ["s4", 3.0],
  ["s4", 5.5],
];

// s5: the mixed note next to the decoder
const MIXED = { x: 170, y: 890, w: 300, h: 90 };

// s6 grid
const G = { x: 330, y: 300, cw: 160, ch: 86 };

export const Ch43Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const cardOn = beat(frame, S.s1, 0.4, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const srcOn = beat(frame, S.s1, 3.6, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const gridOn = beat(frame, S.s6, 0.4, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const recapOn = beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const endOn = beat(frame, S.s8, 0.3, 0.5);

  // which target word is being written now, and how far the spotlight has moved to it
  const written = WRITE.map(([st, t]) => (frame >= S[st].from ? beat(frame, S[st], t, 0.5) : 0));
  const cur = written.reduce((acc, v, i) => (v > 0 ? i : acc), -1);
  const prev = Math.max(0, cur - 1);
  const move = cur <= 0 ? 1 : written[cur];
  const weightsNow = cur < 0 ? SRC.map(() => 0) : MAIN_W[cur].w.map((w, s) => mix(cur === 0 ? 0 : MAIN_W[prev].w[s], w, move));
  const tcx = cur < 0 ? TCX[0] : mix(TCX[prev], TCX[cur], move);
  const coneOn = cur < 0 ? 0 : cur === 0 ? written[0] : 1;

  // s5: percentages → scores → percentages, then notes mixed
  const toScore = beat(frame, S.s5, 0.6, 0.5) * (1 - beat(frame, S.s5, 3.0, 0.5));
  const mixT = beat(frame, S.s5, 4.6, 1.4, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: 2014, keep every note */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: cardOn }}>
          <div style={{ position: "absolute", left: 140, top: 500, width: 800, height: 250, borderRadius: 24, border: "4px solid var(--ink)", background: "var(--paper)", boxShadow: "8px 8px 0 var(--grid-major)" }} />
          <div style={{ position: "absolute", left: 180, top: 530, fontFamily: "var(--font-mono)", fontSize: 84, fontWeight: 500 }}>{L.year}</div>
          <div style={{ position: "absolute", left: 420, top: 548, fontSize: 40, fontWeight: 700 }}>{L.who}</div>
          <div style={{ position: "absolute", left: 420, top: 610, fontSize: 32, color: "var(--ink-2)", width: 500 }}>{L.attention}</div>
          <Hand x={420} y={672} fs={38} style={{ opacity: beat(frame, S.s1, 1.6, 0.4) }}>
            {L.cho}
          </Hand>
          <Hand x={0} y={850} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.4, 0.5) }}>
            <InlineCircle p={beat(frame, S.s1, 5.8, 0.6)}>{L.keep}</InlineCircle>
          </Hand>
        </div>
      )}

      {/* s1–s5: source words with their kept notes, spotlights from the decoder */}
      {frame < S.s6.from + 15 && (
        <div style={{ opacity: srcOn }}>
          {/* spotlight cones under everything */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {SRC.map((_, s) => {
              const w = weightsNow[s];
              return (
                <polygon
                  key={s}
                  points={`${tcx - 22},${TGT_Y - 6} ${tcx + 22},${TGT_Y - 6} ${SX[s] + SW[s] + 8},${SRC_Y + SFS * 1.5 + 4} ${SX[s] - 8},${SRC_Y + SFS * 1.5 + 4}`}
                  fill="var(--hl-yellow)"
                  opacity={coneOn * Math.min(0.85, w * 0.95)}
                />
              );
            })}
          </svg>
          {SRC.map((w, s) => {
            const a = beat(frame, S.s1, 3.6 + s * 0.3, 0.4);
            const pct = cur < 0 ? 0 : Math.round(mix(cur === 0 ? 0 : MAIN_W[prev].pct[s], MAIN_W[cur].pct[s], move));
            // s5: the note flies down into the mixed note, shrinking by its weight
            const fly = s < 4 ? mixT : 0;
            const nx = mix(SCX[s] - NOTE_W / 2, MIXED.x + MIXED.w / 2 - NOTE_W / 2, fly);
            const ny = mix(NOTE_Y, MIXED.y + 8, fly);
            const ns = mix(1, 0.6, fly);
            return (
              <div key={w} style={{ opacity: a }}>
                <div
                  style={{
                    position: "absolute",
                    left: nx,
                    top: ny,
                    width: NOTE_W,
                    height: 76,
                    rotate: `${(s % 2 ? 3 : -3) * (1 - fly)}deg`,
                    scale: String(ns),
                    background: "var(--hl-yellow)",
                    border: "3px solid var(--ink)",
                    borderRadius: "6px 6px 6px 18px",
                    boxSizing: "border-box",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-hand)",
                    fontSize: 32,
                    color: "var(--chip-ink)",
                    opacity: fly > 0.85 ? (1 - fly) / 0.15 : 1,
                  }}
                >
                  {L.note} {s + 1}
                </div>
                <Chip text={w} fs={SFS} color={SRC_COLORS[s]} x={SX[s]} y={SRC_Y} w={SW[s]} />
                {cur >= 0 && (
                  <div style={{ position: "absolute", left: SCX[s] - 80, width: 160, top: PCT_Y, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500 }}>
                    <span style={{ position: "absolute", left: 0, right: 0, opacity: 1 - toScore }}>{pct}%</span>
                    <span style={{ position: "absolute", left: 0, right: 0, opacity: toScore, color: "var(--ink-2)" }}>{fmtScore(MAIN.scores[TODAY][s])}</span>
                  </div>
                )}
              </div>
            );
          })}
          {/* target words written so far */}
          {TGT.map((w, t) => {
            const a = written[t];
            const isCur = t === cur;
            return <Chip key={w} text={w} fs={TFS} color="orange" x={TX[t]} y={TGT_Y + mix(20, 0, a)} w={TW[t]} style={{ opacity: a, outline: isCur ? "5px solid var(--pen)" : undefined, outlineOffset: 4 }} />;
          })}
          <Demo text={L.demo} o={cur >= 0 ? 1 : 0} />
          <Hand x={TX[0]} y={TGT_Y + 100} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s2, 2.0, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
            {L.dec}
          </Hand>
          <Hand x={680} y={560} fs={48} style={{ opacity: beat(frame, S.s3, 1.6, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)), rotate: "-4deg" }}>
            {L.jump}
          </Hand>
          <Hand x={0} y={TGT_Y + 110} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 7.0, 0.5) * (1 - beat(frame, S.s5, 0, 0.3)) }}>
            {L.differ}
          </Hand>
          {/* s5 labels */}
          <Hand x={56} y={PCT_Y + 66} fs={40} style={{ opacity: toScore }}>
            {L.score}
          </Hand>
          <Hand x={56} y={PCT_Y + 66} fs={40} style={{ opacity: beat(frame, S.s5, 3.2, 0.4) }}>
            {L.softmax} → %
          </Hand>
          {(() => {
            const a = beat(frame, S.s5, 5.8, 0.5);
            let acc = 0;
            return (
              <div style={{ opacity: a }}>
                <div style={{ position: "absolute", left: MIXED.x, top: MIXED.y, width: MIXED.w, height: MIXED.h, rotate: "-2deg", background: "var(--paper)", border: "4px solid var(--ink)", borderRadius: "6px 6px 6px 20px", boxSizing: "border-box", overflow: "hidden" }}>
                  {MAIN_W[TODAY].w.map((w, s) => {
                    const left = acc;
                    acc += w;
                    return <div key={s} style={{ position: "absolute", left: `${left * 100}%`, width: `${w * 100}%`, top: 0, bottom: 0, background: `var(--hl-${SRC_COLORS[s]})` }} />;
                  })}
                </div>
                <div style={{ position: "absolute", left: MIXED.x + MIXED.w + 24, top: MIXED.y + 4, fontSize: 36, fontWeight: 700 }}>{L.mix}</div>
                <Hand x={MIXED.x + MIXED.w + 24} y={MIXED.y + 54} fs={34} color="var(--ink-2)" style={{ opacity: beat(frame, S.s5, 7.0, 0.4) }}>
                  {L.mixNote}
                </Hand>
              </div>
            );
          })()}
        </div>
      )}

      {/* s6: the alignment grid */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: gridOn }}>
          {SRC.map((w, s) => (
            <div key={w} style={{ position: "absolute", left: G.x + s * G.cw, width: G.cw, top: G.y - 66, textAlign: "center" }}>
              <span style={{ fontSize: 38, fontWeight: 700, background: `var(--hl-${SRC_COLORS[s]})`, color: "var(--chip-ink)", borderRadius: 8, padding: "0 10px" }}>{w}</span>
            </div>
          ))}
          {TGT.map((w, t) => (
            <div key={w} style={{ opacity: beat(frame, S.s6, 0.6 + t * 0.4, 0.4) }}>
              <div style={{ position: "absolute", left: 90, width: G.x - 110, top: G.y + t * G.ch + 18, textAlign: "right", fontSize: 40, fontWeight: 700 }}>{w}</div>
              {SRC.map((_, s) => {
                const wv = MAIN_W[t].w[s];
                return (
                  <div key={s} style={{ position: "absolute", left: G.x + s * G.cw + 4, top: G.y + t * G.ch + 4, width: G.cw - 8, height: G.ch - 8, borderRadius: 10, background: "var(--paper-2)", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, background: "var(--hl-yellow)", opacity: Math.min(1, wv * 1.15) }} />
                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 32, color: "var(--chip-ink)" }}>{MAIN_W[t].pct[s]}%</div>
                  </div>
                );
              })}
            </div>
          ))}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d={TGT.map((_, t) => {
                const s = MAIN_W[t].w.indexOf(Math.max(...MAIN_W[t].w));
                return `${t ? "L" : "M"} ${G.x + s * G.cw + G.cw / 2} ${G.y + t * G.ch + G.ch / 2}`;
              }).join(" ")}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - beat(frame, S.s6, 3.2, 1.2)}
            />
          </svg>
          <Hand x={0} y={G.y + TGT.length * G.ch + 40} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.6, 0.5) }}>
            {L.zigzag}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: G.y + TGT.length * G.ch + 130, textAlign: "center", opacity: beat(frame, S.s6, 5.6, 0.5) }}>
            <span style={{ fontSize: 46, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 22px" }}>{L.align}</span>
          </div>
          <Demo text={L.demo} o={1} />
        </div>
      )}

      {/* s7: Part 4 recap */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: recapOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 52, fontWeight: 700 }}>{L.recap}</div>
          {RECAP.map((c, i) => {
            const a = beat(frame, S.s7, 0.8 + i * 0.6, 0.4);
            const y = 250 + i * 104;
            return (
              <div key={c.ch} style={{ opacity: a, translate: `${mix(30, 0, a)}px 0px` }}>
                <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 84, borderRadius: 16, border: "3px solid var(--ink)", background: i === RECAP.length - 1 ? "var(--hl-yellow)" : "var(--paper)" }} />
                <div style={{ position: "absolute", left: 116, top: y + 18, fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 500, color: i === RECAP.length - 1 ? "var(--chip-ink)" : "var(--ink-2)" }}>{c.ch}</div>
                <div style={{ position: "absolute", left: 200, top: y + 18, fontSize: 38, fontWeight: 500, color: i === RECAP.length - 1 ? "var(--chip-ink)" : "var(--ink)" }}>{c.t}</div>
                {c.year && (
                  <div style={{ position: "absolute", right: 116, top: y + 20, fontFamily: "var(--font-mono)", fontSize: 32, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 10px" }}>{c.year}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* s8: 2017, attention only */}
      {frame >= S.s8.from && (
        <div style={{ opacity: endOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 120, fontWeight: 500 }}>{L.y2017}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s8, 1.0, 0.5) }}>{L.question}</div>
          {/* the relay, crossed out */}
          <div style={{ opacity: beat(frame, S.s8, 2.0, 0.5) }}>
            {[0, 1, 2, 3].map((k) => (
              <div key={k} style={{ position: "absolute", left: 160 + k * 90, top: 520, width: 70, height: 56, borderRadius: 10, border: "3px solid var(--ink)", background: "var(--hl-violet)", opacity: 0.55 }} />
            ))}
            <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path d="M 140 500 L 520 600" stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s8, 2.6, 0.4)} fill="none" />
              <path d="M 140 600 L 520 500" stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s8, 2.9, 0.4)} fill="none" />
              {/* attention: every word looks at every word */}
              {[0, 1, 2, 3].flatMap((a) =>
                [0, 1, 2, 3]
                  .filter((b) => b > a)
                  .map((b) => (
                    <path
                      key={`${a}${b}`}
                      d={`M ${620 + a * 100} 590 Q ${620 + ((a + b) / 2) * 100} ${590 - (b - a) * 45} ${620 + b * 100} 590`}
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth={4}
                      opacity={beat(frame, S.s8, 3.4 + (a + b) * 0.1, 0.4) * 0.8}
                    />
                  )),
              )}
            </svg>
            {[0, 1, 2, 3].map((k) => (
              <div key={k} style={{ position: "absolute", left: 620 + k * 100 - 22, top: 590, width: 44, height: 44, borderRadius: "50%", border: "3px solid var(--ink)", background: "var(--hl-yellow)", opacity: beat(frame, S.s8, 3.2, 0.4) }} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", opacity: beat(frame, S.s8, 5.0, 0.5) }}>
            <span style={{ fontSize: 54, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 14, padding: "6px 26px" }}>{L.aiayn}</span>
          </div>
          <Hand x={0} y={860} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 6.6, 0.5) }}>
            {L.part5}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch43.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
