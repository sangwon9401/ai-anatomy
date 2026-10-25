import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { FOLD_AT, FOLD_TABLE, ch18 } from "../data/ch18";
import { SPICE_PTS, V_SPLIT } from "../data/part2-toy";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { at, type Plane } from "./plane";
import { ArrowLine, Axes2, Banner, ClassMark, FullSvg, polyPath } from "./part2-kit";

const tl = buildTimeline(ch18);
const S = byId(tl);
const L = ch18.labels;

const PL: Plane = { ox: 190, oy: 930, unit: 145 };
const XMAX = 5.6;
const YMAX = 4.6;
const PTS = SPICE_PTS.map(([m, l]) => ({ m, l, good: V_SPLIT(m, l) }));
const vAt = (m: number) => Math.abs(m - FOLD_AT) + 1.5;
const V_LINE = polyPath(PL, [[0, vAt(0)], [FOLD_AT, vAt(FOLD_AT)], [XMAX, vAt(XMAX)]]);
const ARM = polyPath(PL, [[FOLD_AT, vAt(FOLD_AT)], [XMAX, vAt(XMAX)]]);
const ARM_SHADE = polyPath(PL, [[FOLD_AT, vAt(FOLD_AT)], [XMAX, vAt(XMAX)], [XMAX, YMAX], [FOLD_AT, YMAX]], true);
const [FX] = at(PL, [FOLD_AT, 0]);

// s2–s3 layout
const INB = { x: 64, y: 330, w: 210, h: 130 };
const NEU = [
  { y: 300, text: L.n1, label: L.h1, c: "var(--hl-orange)" },
  { y: 530, text: L.n2, label: L.h2, c: "var(--hl-sky)" },
];
const NX = 470;
const NR = 84;
const TAB = { y: 680, rowH: 82, labelX: 64, x0: 340, colW: 134 };
const colX = (i: number) => TAB.x0 + i * TAB.colW + TAB.colW / 2;

// s6 panels: boundaries in unit-square coordinates (0,0 bottom-left)
const PANEL = { y: 330, s: 290, xs: [70, 395, 720] };
const BOUNDS: [number, number][][] = [
  [[0, 0.85], [0.5, 0.2], [1, 0.85]],
  [[0, 0.8], [0.25, 0.22], [0.5, 0.8], [0.75, 0.22], [1, 0.8]],
  Array.from({ length: 15 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const r = 0.3 + 0.1 * Math.sin(3 * a) + 0.04 * Math.cos(5 * a);
    return [0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a)] as [number, number];
  }),
];
const panelPath = (k: number, pts: [number, number][], close: boolean) =>
  pts.map(([u, v], i) => `${i ? "L" : "M"} ${(PANEL.xs[k] + u * PANEL.s).toFixed(1)} ${(PANEL.y + (1 - v) * PANEL.s).toFixed(1)}`).join(" ") + (close ? " Z" : "");
const LAYERS_ICON = [1, 2, 4];

// s7 network
const NET_COLS = [
  { x: 200, n: 3, label: L.input },
  { x: 420, n: 5, label: `${L.hidden} 1` },
  { x: 640, n: 5, label: `${L.hidden} 2` },
  { x: 860, n: 1, label: L.output },
];
const nodeY = (n: number, i: number) => 520 + (i - (n - 1) / 2) * 92;

export const Ch18Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const inFold = frame >= S.s4.from;
  const planeO = inFold ? beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5)) : 1 - beat(frame, S.s2, 0, 0.5);
  const netO = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const panelsO = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const mlpO = beat(frame, S.s7, 0.3, 0.5);

  const t = inFold ? beat(frame, S.s4, 1.2, 2.6, EASE_IO) : 0;
  const cos = Math.cos(Math.PI * t);
  const inS5 = frame >= S.s5.from;
  const fm = (m: number) => (m < FOLD_AT ? FOLD_AT + (m - FOLD_AT) * cos + 0.09 * t : m);
  const fl = (m: number, l: number) => (m < FOLD_AT ? l - 0.07 * t : l);
  const paperL = Math.min(at(PL, [FOLD_AT - FOLD_AT * cos, 0])[0], at(PL, [XMAX + 0.05, 0])[0]);
  const [, paperTop] = at(PL, [0, YMAX]);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1, s4–s5: the (맵기, 줄) plane */}
      {(frame < S.s2.from + 15 || (frame >= S.s4.from && frame < S.s6.from + 15)) && (
        <div style={{ opacity: planeO }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700 }}>{inS5 ? L.folded : inFold ? L.fold : L.q1}</div>
          <Hand x={inS5 ? 600 : 500} y={130} fs={38} style={{ opacity: inS5 ? beat(frame, S.s5, 2.4, 0.4) : inFold ? 0 : beat(frame, S.s1, 2.0, 0.4) }}>
            {inS5 ? L.layer2 : L.q2}
          </Hand>
          <Axes2 pl={PL} x={[0, XMAX]} y={[0, YMAX]} p={inFold ? 1 : beat(frame, S.s1, 0.1, 0.6)} xTicks={[1, 2, 3, 4, 5]} yTicks={[1, 2, 3, 4]} labelX={inS5 ? undefined : L.spicy} labelY={L.line} />
          <FullSvg>
            {/* the left half of the paper, folding over */}
            {inFold && (
              <rect
                x={Math.min(paperL, FX)}
                y={paperTop}
                width={Math.abs(FX - paperL)}
                height={PL.oy - paperTop}
                fill={cos >= 0 ? "var(--paper-2)" : "var(--hl-sky)"}
                opacity={cos >= 0 ? 0.7 : 0.3}
                stroke="var(--ink-3)"
                strokeWidth={3}
              />
            )}
            {!inFold && <path d={V_LINE} fill="none" stroke="var(--ink-3)" strokeWidth={6} strokeDasharray="16 14" opacity={beat(frame, S.s1, 2.6, 0.5)} />}
            {inFold && (
              <line x1={FX} y1={paperTop - 20} x2={FX} y2={PL.oy + 10} stroke="var(--pen)" strokeWidth={5} strokeDasharray="14 10" opacity={beat(frame, S.s4, 0.4, 0.4)} />
            )}
            {inS5 && (
              <g>
                <path d={ARM_SHADE} fill="var(--hl-mint)" opacity={0.3 * beat(frame, S.s5, 1.4, 0.5)} />
                <path d={ARM} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s5, 0.5, 1.0)} fill="none" stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" />
              </g>
            )}
            {PTS.map((p, i) => {
              const [x, y] = at(PL, [fm(p.m), fl(p.m, p.l)]);
              return <ClassMark key={i} x={x} y={y} good={p.good} o={inFold ? 1 : beat(frame, S.s1, 0.8 + i * 0.1, 0.35)} />;
            })}
          </FullSvg>
          {inS5 && (
            <div style={{ opacity: beat(frame, S.s5, 3.2, 0.5) }}>
              {[0, 1, 2].map((d) => (
                <div key={d} style={{ position: "absolute", left: at(PL, [FOLD_AT + d, 0])[0] - 30, width: 60, top: PL.oy + 50, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 700, color: "var(--pen)" }}>
                  {d}
                </div>
              ))}
              <div style={{ position: "absolute", left: FX - 20, top: PL.oy + 96, fontSize: 32, fontWeight: 700, color: "var(--pen)" }}>{L.farAxis} →</div>
            </div>
          )}
        </div>
      )}

      {/* s2–s3: the first layer, two ReLU neurons */}
      {frame >= S.s2.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: netO }}>
          <Chip text={L.layer1} color="violet" fs={44} x={NX - chipWidth(L.layer1, 44) / 2} y={140} style={{ fontWeight: 700 }} />
          <FullSvg>
            {NEU.map((n, i) => {
              const p = beat(frame, S.s2, 0.8 + i * 0.5, 0.5);
              return (
                <g key={i}>
                  <line x1={INB.x + INB.w} y1={INB.y + INB.h / 2} x2={mix(INB.x + INB.w, NX - NR, p)} y2={mix(INB.y + INB.h / 2, n.y, p)} stroke="var(--ink)" strokeWidth={5} opacity={p > 0 ? 1 : 0} />
                  <ArrowLine x1={NX + NR} y1={n.y} x2={NX + NR + 46} y2={n.y} p={beat(frame, S.s2, 2.4 + i * 0.6, 0.3)} w={5} head={14} />
                  <ArrowLine x1={NX + NR + 196} y1={n.y} x2={NX + NR + 240} y2={n.y} p={beat(frame, S.s2, 3.4 + i * 0.6, 0.3)} w={5} head={14} />
                </g>
              );
            })}
          </FullSvg>
          <div style={{ position: "absolute", left: INB.x, top: INB.y, width: INB.w, height: INB.h, borderRadius: 18, border: "4px solid var(--ink)", background: "var(--paper)", boxSizing: "border-box", display: "grid", placeItems: "center", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s2, 0.4, 0.4) }}>
            {L.spicy}
          </div>
          {NEU.map((n, i) => (
            <div key={i}>
              <div style={{ position: "absolute", left: NX - NR, top: n.y - NR, width: NR * 2, height: NR * 2, borderRadius: "50%", border: "5px solid var(--ink)", boxSizing: "border-box", background: "var(--paper-2)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 700, opacity: beat(frame, S.s2, 1.0 + i * 0.5, 0.4) }}>
                {n.text}
              </div>
              <Chip text={L.relu} color="violet" fs={38} x={NX + NR + 56} y={n.y - 28.5} w={130} style={{ fontWeight: 700, border: "3px solid var(--ink)", opacity: beat(frame, S.s2, 2.6 + i * 0.6, 0.4) }} />
              <div style={{ position: "absolute", left: NX + NR + 252, top: n.y - 26, fontSize: 38, fontWeight: 700, whiteSpace: "nowrap", opacity: beat(frame, S.s2, 3.6 + i * 0.6, 0.4) }}>
                <span style={{ background: n.c, color: "var(--chip-ink)", borderRadius: 10, padding: "0 10px" }}>{n.label}</span>
              </div>
            </div>
          ))}

          {/* the table */}
          <div style={{ opacity: beat(frame, S.s2, 5.0, 0.5) }}>
            <div style={{ position: "absolute", left: TAB.labelX, top: TAB.y, fontSize: 36, fontWeight: 700, color: "var(--ink-2)" }}>{L.spicy}</div>
            {FOLD_TABLE.map((r, i) => (
              <div key={r.m} style={{ position: "absolute", left: colX(i) - 40, width: 80, top: TAB.y - 4, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700, color: "var(--ink-2)" }}>
                {r.m}
              </div>
            ))}
            <div style={{ position: "absolute", left: TAB.labelX, top: TAB.y + 58, width: 950, height: 3, background: "var(--line)" }} />
            {[
              { label: L.h1, key: "h1" as const, c: "var(--hl-orange)", o: beat(frame, S.s2, 5.4, 0.4) },
              { label: L.h2, key: "h2" as const, c: "var(--hl-sky)", o: beat(frame, S.s2, 6.0, 0.4) },
              { label: L.sumRow, key: "d" as const, c: "var(--hl-mint)", o: beat(frame, S.s3, 0.4, 0.4) },
            ].map((row, ri) => (
              <div key={row.key} style={{ opacity: row.o }}>
                <div style={{ position: "absolute", left: TAB.labelX, top: TAB.y + (ri + 1) * TAB.rowH, fontSize: 34, fontWeight: 700, whiteSpace: "nowrap" }}>{row.label}</div>
                {FOLD_TABLE.map((r, i) => {
                  const v = r[row.key];
                  return (
                    <div
                      key={r.m}
                      style={{
                        position: "absolute",
                        left: colX(i) - 40,
                        width: 80,
                        top: TAB.y + (ri + 1) * TAB.rowH - 6,
                        height: 60,
                        borderRadius: 12,
                        display: "grid",
                        placeItems: "center",
                        fontFamily: "var(--font-mono)",
                        fontSize: 42,
                        fontWeight: 700,
                        background: v > 0 ? row.c : "transparent",
                        color: v > 0 ? "var(--chip-ink)" : "var(--ink-3)",
                      }}
                    >
                      {v}
                    </div>
                  );
                })}
              </div>
            ))}
            {/* s3: equal distances pair up */}
            <FullSvg>
              {[
                [0, 4],
                [1, 3],
              ].map(([a, b], k) => {
                const y = TAB.y + 3 * TAB.rowH + 62;
                const p = beat(frame, S.s3, 2.2 + k * 1.2, 0.7);
                return (
                  <path
                    key={k}
                    d={`M ${colX(a)} ${y} Q ${(colX(a) + colX(b)) / 2} ${y + 70 - k * 24} ${colX(b)} ${y}`}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - p}
                    fill="none"
                    stroke="var(--pen)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    opacity={p > 0 ? 1 : 0}
                  />
                );
              })}
            </FullSvg>
            <Hand x={TAB.labelX} y={TAB.y + 3 * TAB.rowH + 64} fs={40} style={{ opacity: beat(frame, S.s3, 4.6, 0.4) }}>
              = {L.far}
            </Hand>
          </div>
        </div>
      )}

      {/* s6: more layers, more folds */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: panelsO }}>
          {BOUNDS.map((b, k) => {
            const o = beat(frame, S.s6, 0.6 + k * 1.3, 0.5);
            const close = k === 2;
            const shade = close ? panelPath(k, b, true) : `${panelPath(k, b, false)} L ${PANEL.xs[k] + PANEL.s} ${PANEL.y} L ${PANEL.xs[k]} ${PANEL.y} Z`;
            const label = [L.once, L.twice, L.many][k];
            const nL = LAYERS_ICON[k];
            return (
              <div key={k} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: PANEL.xs[k], width: PANEL.s, top: PANEL.y - 70, textAlign: "center", fontSize: 40, fontWeight: 700 }}>{label}</div>
                <FullSvg>
                  <rect x={PANEL.xs[k]} y={PANEL.y} width={PANEL.s} height={PANEL.s} rx={18} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
                  <path d={shade} fill="var(--hl-mint)" opacity={0.4} />
                  <path d={panelPath(k, b, close)} fill="none" stroke="var(--pen)" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
                  {/* a tiny network: input, nL layers, output */}
                  {(() => {
                    const cols = nL + 2;
                    const x0 = PANEL.xs[k] + 30;
                    const dx = (PANEL.s - 60) / (cols - 1);
                    const ys = (c: number) => (c === 0 || c === cols - 1 ? [0] : [-1, 0, 1]);
                    const yy = 820;
                    const els = [];
                    for (let c = 0; c < cols - 1; c++)
                      for (const a of ys(c)) for (const bb of ys(c + 1)) els.push(<line key={`${c}-${a}-${bb}`} x1={x0 + c * dx} y1={yy + a * 46} x2={x0 + (c + 1) * dx} y2={yy + bb * 46} stroke="var(--ink-3)" strokeWidth={2.5} />);
                    for (let c = 0; c < cols; c++)
                      for (const a of ys(c))
                        els.push(<circle key={`n${c}-${a}`} cx={x0 + c * dx} cy={yy + a * 46} r={13} fill={c === 0 || c === cols - 1 ? "var(--paper)" : "var(--hl-violet)"} stroke="var(--ink)" strokeWidth={3} />);
                    return els;
                  })()}
                </FullSvg>
              </div>
            );
          })}
          <Hand x={0} y={940} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.6, 0.4) }}>
            {L.deeper}
          </Hand>
        </div>
      )}

      {/* s7: MLP and GPT */}
      {frame >= S.s7.from && (
        <div style={{ opacity: mlpO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", fontSize: 58, fontWeight: 700 }}>{L.mlp}</div>
          <FullSvg>
            {NET_COLS.slice(0, -1).map((col, c) =>
              Array.from({ length: col.n }, (_, i) =>
                Array.from({ length: NET_COLS[c + 1].n }, (_, j) => (
                  <line key={`${c}-${i}-${j}`} x1={col.x} y1={nodeY(col.n, i)} x2={NET_COLS[c + 1].x} y2={nodeY(NET_COLS[c + 1].n, j)} stroke="var(--ink-3)" strokeWidth={3} opacity={beat(frame, S.s7, 0.6 + c * 0.4, 0.4)} />
                )),
              ),
            )}
            {NET_COLS.map((col, c) =>
              Array.from({ length: col.n }, (_, i) => (
                <circle
                  key={`n${c}-${i}`}
                  cx={col.x}
                  cy={nodeY(col.n, i)}
                  r={28}
                  fill={c === 0 ? "var(--hl-yellow)" : c === NET_COLS.length - 1 ? "var(--hl-mint)" : "var(--hl-violet)"}
                  stroke="var(--ink)"
                  strokeWidth={4}
                  opacity={beat(frame, S.s7, 0.4 + c * 0.4, 0.4)}
                />
              )),
            )}
          </FullSvg>
          {NET_COLS.map((col, c) => (
            <div key={c} style={{ position: "absolute", left: col.x - 80, width: 160, top: 770, textAlign: "center", fontSize: 34, fontWeight: 700, color: "var(--ink-2)", opacity: beat(frame, S.s7, 0.4 + c * 0.4, 0.4) }}>
              {col.label}
            </div>
          ))}
          <Banner text={L.gpt} y={870} fs={46} o={beat(frame, S.s7, 3.6, 0.5)} />
          <Hand x={0} y={968} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.0, 0.5) }}>
            {L.ffn}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch18.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
