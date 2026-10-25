import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CONTEXT, DOG, KNOWN, OUTPUTS, WINDOW_SENT, ch39, top } from "../data/ch39";
import { softmax } from "../data/ch14";
import { BarRow, CurveArrow, Demo } from "./part4-kit";
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

const tl = buildTimeline(ch39);
const S = byId(tl);
const L = ch39.labels;

const OUTLINE = { background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)" } as const;
const fmt = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));

// s1: n-gram counts for 고양이가 (설명용 예시)
const CAT = KNOWN[0];
const CAT_COUNTS = Object.entries(CAT.counts!).map(([w, c]) => ({ w, c }));

// s3: the embedding plane
const PL = { ox: 540, oy: 620, unit: 330 };
const ALL = [...KNOWN.slice(0, 1), DOG, ...KNOWN.slice(1)];
const px = (e: readonly [number, number], pl = PL): [number, number] => [pl.ox + e[0] * pl.unit, pl.oy - e[1] * pl.unit];
const GROUPS = [
  { name: L.animal, members: [KNOWN[0].w, DOG.w], lx: 170, ly: 300 },
  { name: L.people, members: [KNOWN[1].w, KNOWN[2].w], lx: 860, ly: 300 },
  { name: L.weather, members: [KNOWN[3].w, KNOWN[4].w], lx: 170, ly: 900 },
].map((g) => {
  const pts = ALL.filter((w) => g.members.includes(w.w)).map((w) => px(w.e));
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  const rx = Math.max(...pts.map((p) => Math.abs(p[0] - cx))) + 130;
  const ry = Math.max(...pts.map((p) => Math.abs(p[1] - cy))) + 70;
  return { ...g, cx: cx + 50, cy, rx, ry };
});

// s4–s5: the network, drawn bottom → top and centred at x = 600
const AX = 600;
const IN_FS = 48;
const IN_W = CONTEXT.map((c) => chipWidth(c.w, IN_FS));
const IN_X = rowLayout(IN_W, 90, AX);
const IN_CX = IN_X.map((x, i) => x + IN_W[i] / 2);
const IN_Y = 950;
const CELL_W = 80;
const CELL_H = 56;
const VEC_Y = 862;
const STRIP_Y = 720;
const STRIP_X = AX - (6 * (CELL_W + 4)) / 2;
const CELLS = CONTEXT.flatMap((c, i) =>
  c.v.map((v, k) => ({ v, c: c.c, x0: IN_CX[i] - CELL_W - 2 + k * (CELL_W + 4), x1: STRIP_X + (i * 2 + k) * (CELL_W + 4), key: `${i}${k}` })),
);
const HID = [0, 1, 2, 3, 4].map((i) => ({ x: AX - 220 + i * 110, glow: [0.9, 0.3, 0.75, 0.5, 0.85][i] }));
const HID_Y = 565;
const HID_R = 36;
const OUT_FS = 40;
const OUT_W = OUTPUTS.map((o) => chipWidth(o.w, OUT_FS));
const OUT_X = rowLayout(OUT_W, 64, AX);
const OUT_CX = OUT_X.map((x, i) => x + OUT_W[i] / 2);
const OUT_Y = 350;
const PROBS = softmax(OUTPUTS.map((o) => o.s)).p;
const BAR_SC = 260;

// s6: cat vs dog
const MINI = { ox: 330, oy: 640, unit: 260 };
const CAT_TOP = top(CAT.e, 3);
const DOG_TOP = top(DOG.e, 3);

// s8: the fixed window
const WFS = 46;
const W_WORDS = [...WINDOW_SENT, "?"];
const WW = W_WORDS.map((w) => (w === "?" ? 150 : chipWidth(w, WFS)));
const WX = rowLayout(WW, 12);

export const Ch39Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2On = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const s3On = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const netOn = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const s6On = beat(frame, S.s6, 0.4, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.4, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.3, 0.5);

  const join = beat(frame, S.s4, 2.0, 1.2, EASE_IO);
  const toProb = beat(frame, S.s5, 0.6, 1.2, EASE_IO);
  const demoOn = Math.max(s1On, s3On, netOn > 0.5 ? 1 : 0, s6On) * (frame < S.s7.from ? 1 : 0);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}
      <Demo text={L.demo} o={demoOn} />

      {/* s1: n-gram has never seen 강아지가 */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <div style={{ position: "absolute", left: 90, top: 150, fontSize: 44, fontWeight: 700 }}>{L.ngram}</div>
          <div style={{ position: "absolute", left: 80, top: 240, width: 920, height: 360, borderRadius: 18, border: "4px solid var(--ink)", background: "var(--paper)" }} />
          <div style={{ position: "absolute", left: 120, top: 268, fontSize: 50, fontWeight: 700 }}>{L.catBlank}</div>
          {CAT_COUNTS.map((c, i) => (
            <BarRow
              key={c.w}
              x={120}
              y={360 + i * 56}
              label={c.w}
              p={c.c / 20}
              scale={900}
              color="var(--hl-yellow)"
              grow={beat(frame, S.s1, 0.8 + i * 0.25, 0.5)}
              fs={38}
              labelW={190}
              text={`${c.c}${L.times}`}
            />
          ))}
          <div style={{ position: "absolute", left: 80, top: 650, width: 920, height: 230, borderRadius: 18, border: "4px dashed var(--ink-3)", background: "var(--paper)", opacity: beat(frame, S.s1, 2.4, 0.5) }} />
          <div style={{ opacity: beat(frame, S.s1, 2.6, 0.5) }}>
            <div style={{ position: "absolute", left: 120, top: 680, fontSize: 50, fontWeight: 700 }}>{L.dogBlank}</div>
            <div style={{ position: "absolute", left: 120, top: 776, fontFamily: "var(--font-mono)", fontSize: 50, color: "var(--pen)" }}>
              <InlineCircle p={beat(frame, S.s1, 3.4, 0.6)}>0{L.times}</InlineCircle>
            </div>
            <Hand x={300} y={776} fs={50} style={{ opacity: beat(frame, S.s1, 4.0, 0.4) }}>
              {L.never}
            </Hand>
          </div>
          <Hand x={0} y={930} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.6, 0.5) }}>
            {L.notKnow}
          </Hand>
        </div>
      )}

      {/* s2: 2003 */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 130, fontWeight: 500 }}>{L.year}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontSize: 46, fontWeight: 500, color: "var(--ink-2)", opacity: beat(frame, S.s2, 0.9, 0.4) }}>{L.who}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 510, textAlign: "center", opacity: beat(frame, S.s2, 1.8, 0.5) }}>
            <span style={{ fontSize: 66, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 16, padding: "6px 28px" }}>{L.nnlm}</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontSize: 36, color: "var(--ink-2)", opacity: beat(frame, S.s2, 2.4, 0.4) }}>{L.nnlmEn}</div>
          <Hand x={0} y={790} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 4.4, 0.5) }}>
            {L.idea}
          </Hand>
        </div>
      )}

      {/* s3: every word gets a vector */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{L.planeTitle}</div>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={PL.ox - PL.unit - 20} y1={PL.oy} x2={PL.ox + PL.unit + 20} y2={PL.oy} stroke="var(--ink-3)" strokeWidth={3} />
            <line x1={PL.ox} y1={PL.oy + PL.unit + 20} x2={PL.ox} y2={PL.oy - PL.unit - 20} stroke="var(--ink-3)" strokeWidth={3} />
            {GROUPS.map((g, i) => (
              <ellipse
                key={g.name}
                cx={g.cx}
                cy={g.cy}
                rx={g.rx}
                ry={g.ry}
                fill="none"
                stroke="var(--pen)"
                strokeWidth={4}
                strokeDasharray="12 10"
                opacity={beat(frame, S.s3, 3.0 + i * 0.5, 0.5)}
              />
            ))}
          </svg>
          {ALL.map((w, i) => {
            const [x, y] = px(w.e);
            const a = beat(frame, S.s3, 0.8 + i * 0.25, 0.4);
            const dog = w.w === DOG.w;
            return (
              <div key={w.w} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: "50%", background: dog ? "var(--hl-yellow)" : "var(--ink)", border: "4px solid var(--ink)", boxSizing: "border-box" }} />
                <div style={{ position: "absolute", left: x + 24, top: y - 26, fontSize: 38, fontWeight: 500, background: "var(--paper)", borderRadius: 6, padding: "0 4px" }}>{w.w}</div>
              </div>
            );
          })}
          {GROUPS.map((g, i) => (
            <Hand key={g.name} x={g.lx} y={g.ly} fs={46} style={{ opacity: beat(frame, S.s3, 3.2 + i * 0.5, 0.4) }}>
              {g.name}
            </Hand>
          ))}
          <Hand x={0} y={990} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 5.4, 0.5) }}>
            {L.close}
          </Hand>
        </div>
      )}

      {/* s4–s5: vectors → join → neurons → scores → softmax */}
      {frame >= S.s4.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: netOn }}>
          {CONTEXT.map((c, i) => (
            <Chip key={c.w} text={c.w} fs={IN_FS} color={c.c} x={IN_X[i]} y={IN_Y} w={IN_W[i]} style={{ opacity: beat(frame, S.s4, 0.4 + i * 0.2, 0.4) }} />
          ))}
          {CELLS.map((cell, j) => {
            const a = beat(frame, S.s4, 1.0 + Math.floor(j / 2) * 0.2, 0.4);
            return (
              <div
                key={cell.key}
                style={{
                  position: "absolute",
                  left: mix(cell.x0, cell.x1, join),
                  top: mix(VEC_Y, STRIP_Y, join),
                  width: CELL_W,
                  height: CELL_H,
                  borderRadius: 8,
                  border: "3px solid var(--ink)",
                  background: `var(--hl-${cell.c})`,
                  color: "var(--chip-ink)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 28,
                  fontWeight: 500,
                  boxSizing: "border-box",
                  opacity: a,
                }}
              >
                {fmt(cell.v)}
              </div>
            );
          })}
          <Hand x={56} y={VEC_Y + 6} fs={40} style={{ opacity: beat(frame, S.s4, 1.2, 0.4) * (1 - join) }}>
            {L.emb}
          </Hand>
          <Hand x={56} y={STRIP_Y + 4} fs={44} style={{ opacity: beat(frame, S.s4, 3.0, 0.4) }}>
            {L.concat}
          </Hand>

          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {CELLS.map((cell) =>
              HID.map((h, k) => (
                <line
                  key={`${cell.key}-${k}`}
                  x1={cell.x1 + CELL_W / 2}
                  y1={STRIP_Y}
                  x2={h.x}
                  y2={HID_Y + HID_R}
                  stroke="var(--ink-3)"
                  strokeWidth={2.5}
                  opacity={0.7 * beat(frame, S.s4, 3.6, 0.6)}
                />
              )),
            )}
            {HID.map((h, k) =>
              OUT_CX.map((ox, m) => (
                <line key={`${k}-${m}`} x1={h.x} y1={HID_Y - HID_R} x2={ox} y2={OUT_Y + OUT_FS * 1.5} stroke="var(--ink-3)" strokeWidth={2.5} opacity={0.7 * beat(frame, S.s4, 5.2, 0.6)} />
              )),
            )}
          </svg>
          {HID.map((h, k) => {
            const a = beat(frame, S.s4, 4.0 + k * 0.1, 0.4);
            const lit = beat(frame, S.s4, 4.6 + k * 0.1, 0.4);
            return (
              <div key={k} style={{ position: "absolute", left: h.x - HID_R, top: HID_Y - HID_R, width: HID_R * 2, height: HID_R * 2, borderRadius: "50%", border: "4px solid var(--ink)", background: "var(--paper)", boxSizing: "border-box", opacity: a, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "var(--hl-yellow)", opacity: h.glow * lit }} />
              </div>
            );
          })}
          <Hand x={56} y={HID_Y - 24} fs={42} style={{ opacity: beat(frame, S.s4, 4.4, 0.4) }}>
            {L.layer}
          </Hand>

          {OUTPUTS.map((o, i) => {
            const a = beat(frame, S.s4, 5.8 + i * 0.15, 0.4);
            const h = PROBS[i] * BAR_SC * toProb;
            return (
              <div key={o.w} style={{ opacity: a }}>
                <Chip text={o.w} fs={OUT_FS} color={o.c} x={OUT_X[i]} y={OUT_Y} w={OUT_W[i]} />
                <div style={{ position: "absolute", left: OUT_CX[i] - 48, top: OUT_Y - 8 - h, width: 96, height: h, background: `var(--hl-${o.c})`, borderRadius: "12px 12px 2px 2px" }} />
                <div style={{ position: "absolute", left: OUT_CX[i] - 90, width: 180, top: OUT_Y - 70 - h, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 42, fontWeight: 500 }}>
                  <span style={{ position: "absolute", left: 0, right: 0, opacity: 1 - toProb }}>{o.s < 0 ? `−${Math.abs(o.s)}` : o.s}</span>
                  <span style={{ position: "absolute", left: 0, right: 0, opacity: toProb }}>{(PROBS[i] * 100).toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
          <Hand x={56} y={OUT_Y - 66} fs={44} style={{ opacity: beat(frame, S.s4, 6.4, 0.4) * (1 - toProb) }}>
            {L.score}
          </Hand>
          <Hand x={56} y={190} fs={40} style={{ opacity: beat(frame, S.s5, 1.6, 0.4), width: 180, whiteSpace: "normal", lineHeight: 1.25 }}>
            {L.softmax}
          </Hand>
        </div>
      )}

      {/* s6: close vectors give close answers */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          {(() => {
            const [cx, cy] = px(CAT.e, MINI);
            const [dx, dy] = px(DOG.e, MINI);
            const ex = (cx + dx) / 2;
            const ey = (cy + dy) / 2;
            return (
              <>
                {ALL.filter((w) => w.w !== CAT.w && w.w !== DOG.w).map((w) => {
                  const [x, y] = px(w.e, MINI);
                  return <div key={w.w} style={{ position: "absolute", left: x - 12, top: y - 12, width: 24, height: 24, borderRadius: "50%", background: "var(--ink-3)", opacity: 0.45 }} />;
                })}
                <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                  <ellipse cx={ex} cy={ey} rx={78} ry={58} fill="none" stroke="var(--pen)" strokeWidth={4} strokeDasharray="12 10" opacity={beat(frame, S.s6, 1.0, 0.5)} />
                </svg>
                {[
                  { w: CAT, x: cx, y: cy, ly: cy + 30, lx: cx },
                  { w: DOG, x: dx, y: dy, ly: dy - 82, lx: dx - 60 },
                ].map((d) => (
                  <div key={d.w.w}>
                    <div style={{ position: "absolute", left: d.x - 15, top: d.y - 15, width: 30, height: 30, borderRadius: "50%", background: d.w === DOG ? "var(--hl-yellow)" : "var(--ink)", border: "4px solid var(--ink)", boxSizing: "border-box" }} />
                    <div style={{ position: "absolute", left: d.lx - 90, width: 180, top: d.ly, textAlign: "center", fontSize: 36, fontWeight: 500 }}>{d.w.w}</div>
                  </div>
                ))}
                <Hand x={ex - 110} y={ey + 120} fs={42} style={{ width: 220, textAlign: "center", opacity: beat(frame, S.s6, 1.4, 0.4) }}>
                  {L.nearIn}
                </Hand>
                <CurveArrow x1={ex + 84} y1={ey - 24} cx={470} cy={240} x2={560} y2={226} p={beat(frame, S.s6, 1.8, 0.6)} color="var(--ink-3)" width={4} />
                <CurveArrow x1={ex + 84} y1={ey + 24} cx={470} cy={560} x2={560} y2={536} p={beat(frame, S.s6, 3.4, 0.6)} color="var(--ink-3)" width={4} />
              </>
            );
          })()}
          {[
            { w: CAT.w, t: CAT_TOP, y: 196, at: 2.2 },
            { w: DOG.w, t: DOG_TOP, y: 506, at: 3.8 },
          ].map((panel) => (
            <div key={panel.w} style={{ opacity: beat(frame, S.s6, panel.at, 0.4) }}>
              <div style={{ position: "absolute", left: 580, top: panel.y, fontSize: 42, fontWeight: 700 }}>{panel.w} ___</div>
              {panel.t.map((t, i) => (
                <BarRow key={t.w} x={580} y={panel.y + 76 + i * 60} label={t.w} p={t.p} scale={560} color={`var(--hl-${t.c})`} grow={beat(frame, S.s6, panel.at + 0.3 + i * 0.15, 0.5)} fs={36} labelW={150} />
              ))}
            </div>
          ))}
          <Hand x={580} y={790} fs={48} style={{ opacity: beat(frame, S.s6, 5.0, 0.4) }}>
            → {L.sameOut}!
          </Hand>
          <Hand x={0} y={920} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 6.2, 0.5) }}>
            {L.unseen}
          </Hand>
        </div>
      )}

      {/* s7: both the weights and the word vectors learn */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontSize: 52, fontWeight: 700 }}>{L.learnTitle}</div>
          {[
            { t: L.weights, x: 120, c: "var(--hl-violet)", at: 1.0 },
            { t: L.vectors, x: 580, c: "var(--hl-mint)", at: 2.0 },
          ].map((card) => (
            <div key={card.t} style={{ position: "absolute", left: card.x, top: 290, width: 380, height: 300, borderRadius: 22, border: "4px solid var(--ink)", background: "var(--paper)", opacity: beat(frame, S.s7, card.at, 0.5) }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 24, textAlign: "center", fontSize: 42, fontWeight: 700 }}>
                <span style={{ background: card.c, color: "var(--chip-ink)", borderRadius: 10, padding: "2px 14px" }}>{card.t}</span>
              </div>
            </div>
          ))}
          {/* weights: a few lines changing thickness */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: beat(frame, S.s7, 1.2, 0.5) }}>
            {[0, 1, 2].map((a) =>
              [0, 1].map((b) => {
                const wob = Math.sin(frame / 10 + a * 1.7 + b * 2.3) * beat(frame, S.s7, 1.6, 0.5);
                return <line key={`${a}${b}`} x1={190} y1={420 + a * 60} x2={430} y2={450 + b * 90} stroke="var(--ink)" strokeWidth={4 + 3 * wob} strokeLinecap="round" opacity={0.75} />;
              }),
            )}
            {[0, 1, 2].map((a) => (
              <circle key={`l${a}`} cx={190} cy={420 + a * 60} r={14} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
            ))}
            {[0, 1].map((b) => (
              <circle key={`r${b}`} cx={430} cy={450 + b * 90} r={14} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} />
            ))}
          </svg>
          {/* vectors: cat and dog drifting closer */}
          {(() => {
            const d = beat(frame, S.s7, 2.6, 2.0, EASE_IO);
            const pts = [
              { w: CAT.w, x: mix(650, 705, d), y: mix(460, 450, d), ly: -60 },
              { w: DOG.w, x: mix(890, 790, d), y: mix(510, 488, d), ly: 20 },
            ];
            return (
              <div style={{ opacity: beat(frame, S.s7, 2.2, 0.5) }}>
                {pts.map((p) => (
                  <div key={p.w}>
                    <div style={{ position: "absolute", left: p.x - 14, top: p.y - 14, width: 28, height: 28, borderRadius: "50%", background: p.w === DOG.w ? "var(--hl-yellow)" : "var(--ink)", border: "4px solid var(--ink)", boxSizing: "border-box" }} />
                    <div style={{ position: "absolute", left: p.x - 70, width: 140, top: p.y + p.ly, textAlign: "center", fontSize: 30 }}>{p.w}</div>
                  </div>
                ))}
              </div>
            );
          })()}
          <Hand x={0} y={640} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 4.6, 0.5) }}>
            {L.drift}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", opacity: beat(frame, S.s7, 6.0, 0.5) }}>
            <span style={{ fontSize: 42, fontWeight: 700, background: "var(--hl-sky)", color: "var(--chip-ink)", borderRadius: 14, padding: "6px 22px" }}>{L.w2v}</span>
          </div>
        </div>
      )}

      {/* s8: the window is fixed */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          {W_WORDS.map((w, i) => {
            const out = i < 2;
            if (w === "?")
              return (
                <div key={i} style={{ position: "absolute", left: WX[i], top: 400, width: WW[i], height: WFS * 1.5, border: "4px dashed var(--ink-3)", borderRadius: 12, boxSizing: "border-box", display: "grid", placeItems: "center", fontSize: 44, color: "var(--ink-3)" }}>
                  ?
                </div>
              );
            return <Chip key={w} text={w} fs={WFS} color={null} x={WX[i]} y={400} w={WW[i]} style={{ ...OUTLINE, opacity: out ? mix(1, 0.35, beat(frame, S.s8, 2.0, 0.5)) : 1 }} />;
          })}
          {(() => {
            const a = beat(frame, S.s8, 1.0, 0.6);
            const left = WX[2] - 14;
            const right = WX[4] + WW[4] + 14;
            return (
              <div style={{ opacity: a }}>
                <div style={{ position: "absolute", left, top: 384, width: right - left, height: WFS * 1.5 + 32, border: "6px solid var(--pen)", borderRadius: 18, boxSizing: "border-box" }} />
                <Hand x={left} y={312} fs={44}>
                  {L.windowNote}
                </Hand>
                <CurveArrow x1={right - 30} y1={384} cx={right + 40} cy={330} x2={WX[5] + WW[5] / 2} y2={392} p={beat(frame, S.s8, 1.6, 0.5)} width={5} />
              </div>
            );
          })()}
          <Hand x={WX[0] - 10} y={520} fs={44} color="var(--ink-2)" style={{ opacity: beat(frame, S.s8, 2.4, 0.4) }}>
            {L.outside}
          </Hand>
          <Hand x={WX[5] - 60} y={520} fs={46} style={{ opacity: beat(frame, S.s8, 3.4, 0.4) }}>
            {L.which}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", opacity: beat(frame, S.s8, 5.4, 0.5) }}>
            <span style={{ fontSize: 46, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 14, padding: "6px 22px" }}>{L.next}</span>
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch39.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
