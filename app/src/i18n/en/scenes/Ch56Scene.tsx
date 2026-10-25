// en overlay of src/scenes/Ch56Scene.tsx: word chips laid out by width; the layer label reads "Layer 1" (word before the number).
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { DRIFT, PHONE, RES_F, RES_X, ch56, cosine } from "../../../data/ch56";
import { Block, Layer, PenArrow, VecBars, VecCells, WordChip, along, blockGeo, partRect, sidePath, wordW } from "../../../scenes/part6-block";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";

const tl = buildTimeline(ch56);
const S = byId(tl);
const L = ch56.labels;

const G = blockGeo("full");
const BX = 100;
const BY = 246;

const KEEP = DRIFT.map((v) => Math.round(Math.max(0, cosine(v, DRIFT[0])) * 100));
const OUT = RES_X.map((v, i) => v + RES_F[i]);
const OUT_KEEP = Math.round(cosine(OUT, RES_X) * 100);

// s6: parts stacked in a column; the gaps the learning signal climbs through, bottom to top
const BOX_Y = [270, 400, 530, 660, 790];
const SIG: [number, number][] = [[900, 856], ...BOX_Y.slice().reverse().map((y, i, r): [number, number] => [y - 2, i < r.length - 1 ? r[i + 1] + 66 : 236])];
const SIG_W = [12, 9, 6, 4, 2.5, 1.5];
const SIG_O = [1, 0.85, 0.7, 0.5, 0.35, 0.25];

const Person: FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <svg width={80} height={90} style={{ position: "absolute", left: x - 40, top: y - 45, overflow: "visible", opacity: o }}>
    <circle cx={40} cy={26} r={20} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
    <path d="M 8 86 C 10 56, 70 56, 72 86" fill="var(--hl-sky)" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

const Dot: FC<{ x: number; y: number; ring: string; r?: number; o?: number }> = ({ x, y, ring, r = 18, o = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: "var(--ink)",
      border: `6px solid ${ring}`,
      boxSizing: "border-box",
      opacity: o,
    }}
  />
);

const MiniBox: FC<{ x: number; y: number; w: number; h: number; text: string; o?: number }> = ({ x, y, w, h, text, o = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 14,
      background: "var(--hl-yellow)",
      color: "var(--chip-ink)",
      display: "grid",
      placeItems: "center",
      fontSize: 34,
      fontWeight: 700,
      opacity: o,
    }}
  >
    {text}
  </div>
);

export const Ch56Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const on1 = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const on2 = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const on3 = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const on4 = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const on5 = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const on6 = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const on7 = beat(frame, S.s7, 0.3, 0.6);

  // s5: one dot rides the highway, a copy takes the detour, and they meet at each ⊕
  const p1 = sidePath(G, 1);
  const p2 = sidePath(G, 2);
  const a = beat(frame, S.s5, 1.0, 0.6, (t) => t);
  const b = beat(frame, S.s5, 1.6, 2.4, EASE_IO);
  const c = beat(frame, S.s5, 4.6, 0.5, (t) => t);
  const d = beat(frame, S.s5, 5.1, 2.4, EASE_IO);
  const e = beat(frame, S.s5, 7.9, 0.8, (t) => t);
  let road: [number, number];
  let side: [number, number] | null = null;
  if (e > 0) road = [G.hx, mix(p2[3][1], G.h, e)];
  else if (d > 0) {
    road = [G.hx, mix(p2[0][1], p2[3][1], d)];
    side = d < 1 ? along(p2, d) : null;
  } else if (c > 0) road = [G.hx, mix(p1[3][1], p2[0][1], c)];
  else if (b > 0) {
    road = [G.hx, mix(p1[0][1], p1[3][1], b)];
    side = b < 1 ? along(p1, b) : null;
  } else road = [G.hx, mix(0, p1[0][1], a)];
  const merge = Math.max(beat(frame, S.s5, 4.0, 0.3) * (1 - beat(frame, S.s5, 4.4, 0.4)), beat(frame, S.s5, 7.5, 0.3) * (1 - beat(frame, S.s5, 7.9, 0.4)));
  const attR = partRect(G, "att");

  // s6: the learning signal climbs back up
  const climb = beat(frame, S.s6, 1.4, 2.4, (t) => t);
  const climbR = beat(frame, S.s6, 4.2, 1.6, (t) => t);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the telephone game */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: on1 }}>
          {PHONE.map((line, i) => {
            const y = 160 + i * 166;
            const o = beat(frame, S.s1, 0.4 + i * 0.7, 0.4);
            return (
              <div key={i} style={{ opacity: o }}>
                <Person x={190} y={y + 46} o={1} />
                <div style={{ position: "absolute", left: 270, top: y, height: 96, padding: "0 34px", borderRadius: 24, border: "3px solid var(--ink)", background: "var(--paper)", fontSize: 56, lineHeight: "92px", fontWeight: 500, whiteSpace: "pre" }}>
                  {[...line].map((ch, j) => (
                    <span key={j} style={{ color: ch !== PHONE[0][j] ? "var(--pen)" : "var(--ink)", fontWeight: ch !== PHONE[0][j] ? 700 : 500 }}>
                      {ch}
                    </span>
                  ))}
                </div>
                {i < PHONE.length - 1 && <div style={{ position: "absolute", left: 176, top: y + 104, fontSize: 40, color: "var(--ink-3)" }}>↓</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* s2: a vector replaced layer after layer */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: on2 }}>
          <div style={{ position: "absolute", left: 600, top: 150, fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s2, 0.6, 0.4) }}>{L.keep}</div>
          {DRIFT.map((v, i) => {
            const y = 220 + i * 150;
            const o = beat(frame, S.s2, 0.6 + i * 0.8, 0.5);
            return (
              <div key={i} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: 90, top: y + 34, fontSize: 38, fontWeight: 700 }}>{i === 0 ? L.orig : `${L.layer} ${i}`}</div>
                <VecBars x={250} y={y + 70} v={v} bw={52} gap={16} scale={20} />
                <div style={{ position: "absolute", left: 600, top: y + 46, width: 280, height: 40, borderRadius: 20, background: "var(--paper-2)" }} />
                <div style={{ position: "absolute", left: 600, top: y + 46, width: 280 * (KEEP[i] / 100), height: 40, borderRadius: 20, background: "var(--hl-mint)" }} />
                <div style={{ position: "absolute", left: 896, top: y + 40, fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500 }}>{KEEP[i]}%</div>
              </div>
            );
          })}
          <Hand x={0} y={980} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 5.4, 0.4) }}>
            {L.blur}
          </Hand>
          <div style={{ position: "absolute", left: 90, top: 150, fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s2, 0.6, 0.4) }}>{L.toy}</div>
        </div>
      )}

      {/* s3: replace vs add */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: on3 }}>
          {[
            { cx: 290, title: L.swap, t: 0.6 },
            { cx: 790, title: L.add, t: 2.4 },
          ].map((col, k) => {
            const o = beat(frame, S.s3, col.t, 0.5);
            const xw = chipWidth(L.x, 48);
            return (
              <div key={k} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: col.cx - 200, width: 400, top: 160, textAlign: "center", fontSize: 46, fontWeight: 700 }}>{col.title}</div>
                <Chip text={L.x} color="sky" fs={48} x={col.cx - xw / 2} y={250} />
                <MiniBox x={col.cx - 110} y={380} w={220} h={80} text={L.fx.replace("(x)", "")} />
                <Layer>
                  <PenArrow x1={col.cx} y1={326} x2={col.cx} y2={372} p={1} color="var(--ink-3)" width={5} />
                  {k === 0 ? (
                    <PenArrow x1={col.cx} y1={466} x2={col.cx} y2={560} p={1} color="var(--ink-3)" width={5} />
                  ) : (
                    <>
                      <path d={`M ${col.cx - xw / 2 - 6} 286 L ${col.cx - 190} 286 L ${col.cx - 190} 600 L ${col.cx - 38} 600`} fill="none" stroke="var(--hl-orange)" strokeWidth={14} strokeLinejoin="round" />
                      <PenArrow x1={col.cx} y1={466} x2={col.cx} y2={566} p={1} color="var(--ink-3)" width={5} />
                    </>
                  )}
                </Layer>
                {k === 1 && (
                  <div style={{ position: "absolute", left: col.cx - 30, top: 570, width: 60, height: 60, borderRadius: "50%", border: "4px solid var(--ink)", background: "var(--hl-orange)", display: "grid", placeItems: "center", fontSize: 40, fontWeight: 700, color: "var(--chip-ink)" }}>+</div>
                )}
                {k === 0 ? (
                  <Chip text={L.fx} color="mint" fs={48} x={col.cx - chipWidth(L.fx, 48) / 2} y={566} />
                ) : (
                  <Chip text={L.xfx} color="yellow" fs={48} x={col.cx - chipWidth(L.xfx, 48) / 2} y={680} />
                )}
              </div>
            );
          })}
          <Hand x={150} y={680} fs={44} style={{ opacity: beat(frame, S.s3, 1.8, 0.4) }}>
            {L.lost}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 72, fontWeight: 500, opacity: beat(frame, S.s3, 4.6, 0.5) }}>
            <InlineCircle p={beat(frame, S.s3, 5.2, 0.6)}>{L.xfx}</InlineCircle>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center", fontSize: 34, color: "var(--ink-2)", opacity: beat(frame, S.s3, 6.0, 0.4) }}>
            {L.xMeans} · {L.fMeans}
          </div>
        </div>
      )}

      {/* s4: the numbers */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: on4 }}>
          {[
            { label: L.origVec, v: RES_X, y: 300, color: "sky" as const, t: 0.5, pen: false },
            { label: L.plusF, v: RES_F, y: 400, color: "mint" as const, t: 1.6, pen: true },
            { label: L.out, v: OUT, y: 540, color: "yellow" as const, t: 3.0, pen: false },
          ].map((r) => {
            const o = beat(frame, S.s4, r.t, 0.5);
            return (
              <div key={r.label} style={{ opacity: o, translate: `0px ${mix(16, 0, o)}px` }}>
                <div style={{ position: "absolute", left: 80, top: r.y + 8, fontSize: 40, fontWeight: 700, color: r.pen ? "var(--pen)" : "var(--ink)" }}>{r.label}</div>
                <VecCells x={420} y={r.y} v={r.v} dir="row" cw={128} ch={64} fs={38} gap={10} color={r.color} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 410, top: 502, width: 562, height: 5, borderRadius: 3, background: "var(--ink)", opacity: beat(frame, S.s4, 2.6, 0.4) }} />
          <Hand x={0} y={690} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 4.2, 0.5), rotate: "-2deg" }}>
            <InlineCircle p={beat(frame, S.s4, 4.6, 0.6)}>{L.stays}</InlineCircle>
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontSize: 38, opacity: beat(frame, S.s4, 5.6, 0.4) }}>
            {L.keep} <b style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>{OUT_KEEP}%</b>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s4, 0.5, 0.4) }}>{L.toy}</div>
        </div>
      )}

      {/* s5: the highway inside the block */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: on5 }}>
          {[L.w1, L.w2, L.w3].map((w, i) => (
            <WordChip key={w} text={w} x={120 + [L.w1, L.w2, L.w3].slice(0, i).reduce((a, t) => a + wordW(t, 40) + 14, 0)} y={134} fs={40} />
          ))}
          <Block x={BX} y={BY} focus={{ keys: ["add1", "add2"], t: beat(frame, S.s5, 0.4, 0.5), dim: 0.55 }}>
            {side && <Dot x={side[0]} y={side[1]} ring="var(--hl-yellow)" r={16} />}
            <Dot x={road[0]} y={road[1]} ring="var(--hl-orange)" r={mix(18, 24, merge)} />
          </Block>
          <Layer>
            <PenArrow x1={BX + G.hx} y1={200} x2={BX + G.hx} y2={BY - 6} p={1} color="var(--ink-3)" width={5} />
          </Layer>
          <Chip text={L.road} color="orange" fs={38} x={790} y={150} style={{ opacity: beat(frame, S.s5, 0.6, 0.4) }} />
          <Hand x={790} y={214} fs={36} style={{ width: 234, whiteSpace: "normal", wordBreak: "keep-all", opacity: beat(frame, S.s5, 1.0, 0.4) }}>
            {L.straight}
          </Hand>
          <Hand x={790} y={BY + attR.y + 26} fs={38} style={{ width: 234, whiteSpace: "normal", wordBreak: "keep-all", opacity: beat(frame, S.s5, 2.2, 0.4) }}>
            {L.side}
          </Hand>
          <Hand x={790} y={BY + G.rows.add1.y + 4} fs={38} style={{ width: 234, whiteSpace: "normal", wordBreak: "keep-all", opacity: beat(frame, S.s5, 4.0, 0.4) }}>
            {L.plusNote}
          </Hand>
        </div>
      )}

      {/* s6: the learning signal, without and with the highway */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: on6 }}>
          {[
            { cx: 290, title: L.noRoad, roadX: null as number | null, t: 0.4 },
            { cx: 800, title: L.withRoad, roadX: 640, t: 0.8 },
          ].map((col, k) => (
            <div key={k} style={{ opacity: beat(frame, S.s6, col.t, 0.5) }}>
              <div style={{ position: "absolute", left: col.cx - 230, width: 460, top: 170, textAlign: "center", fontSize: 42, fontWeight: 700 }}>{col.title}</div>
              {col.roadX !== null && (
                <Layer>
                  <line x1={col.roadX} y1={250} x2={col.roadX} y2={880} stroke="var(--hl-orange)" strokeWidth={18} />
                  {BOX_Y.map((y) => (
                    <line key={y} x1={col.roadX! + 9} y1={y + 32} x2={col.cx - 120} y2={y + 32} stroke="var(--ink-3)" strokeWidth={4} />
                  ))}
                </Layer>
              )}
              {BOX_Y.map((y) => (
                <MiniBox key={y} x={col.cx - 120} y={y} w={240} h={64} text={L.part} />
              ))}
            </div>
          ))}
          <Layer>
            {/* without: the signal passes through every part and weakens */}
            {SIG.map(([y0, y1], i) => {
              const p = Math.max(0, Math.min(1, climb * SIG.length - i));
              return p > 0 ? <line key={i} x1={290} y1={y0} x2={290} y2={mix(y0, y1, p)} stroke="var(--pen)" strokeWidth={SIG_W[i]} strokeLinecap="round" opacity={SIG_O[i]} /> : null;
            })}
            <PenArrow x1={640} y1={900} x2={640} y2={240} p={climbR} width={10} />
          </Layer>
          <div style={{ position: "absolute", left: 0, right: 0, top: 918, textAlign: "center", fontSize: 36, color: "var(--pen)", fontWeight: 700, opacity: beat(frame, S.s6, 1.0, 0.4) }}>{L.signal}</div>
          <Hand x={290 - 200} y={980} fs={46} style={{ width: 400, textAlign: "center", opacity: beat(frame, S.s6, 3.8, 0.4) }}>
            {L.weak}
          </Hand>
          <Hand x={800 - 200} y={980} fs={46} style={{ width: 400, textAlign: "center", opacity: beat(frame, S.s6, 5.8, 0.4) }}>
            {L.strong}
          </Hand>
        </div>
      )}

      {/* s7: the name */}
      {frame >= S.s7.from && (
        <div style={{ opacity: on7 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontSize: 76, fontWeight: 700 }}>{L.name}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 336, textAlign: "center", fontSize: 36, color: "var(--ink-2)" }}>{L.en}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 70, fontWeight: 500, opacity: beat(frame, S.s7, 0.8, 0.5) }}>
            <InlineCircle p={beat(frame, S.s7, 1.2, 0.6)}>{L.xfx}</InlineCircle>
          </div>
          <Hand x={0} y={580} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.4, 0.5) }}>
            {L.diff}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontSize: 42, fontWeight: 700, opacity: beat(frame, S.s7, 5.0, 0.5) }}>{L.deep}</div>
          <div style={{ position: "absolute", left: 120, width: 840, top: 800, textAlign: "center", fontSize: 30, lineHeight: 1.4, color: "var(--ink-2)", wordBreak: "keep-all", opacity: beat(frame, S.s7, 6.0, 0.5) }}>{L.resnet}</div>
        </div>
      )}

      <Narration tl={tl} chapter={ch56.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
