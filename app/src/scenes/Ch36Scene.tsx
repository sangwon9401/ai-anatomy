import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { PIPELINE } from "../data/ch05";
import { PARTICLE_ROWS, PART3_TOOLS, TIME_A, TIME_B, TOK_VEC, WAVE_NAMES, WAVE_COLORS, add4, ch36, fmt, pe, type V4 } from "../data/ch36";
import { Caption, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, hl, mix, type SceneProps } from "./kit";
import { Line, Svg, TOKEN_COLORS, TokChip, tokenRow } from "./part3-kit";

const tl = buildTimeline(ch36);
const S = byId(tl);
const L = ch36.labels;

const ROW_A = tokenRow(TIME_A, 60, 14, 0, 640);
const ROW_B = tokenRow(TIME_B, 60, 14, 0, 640);
const fmt1 = (x: number) => (x < 0 ? `−${Math.abs(x).toFixed(1)}` : x.toFixed(1));
const tokColor = (t: string) => TOKEN_COLORS[["10", "시", " ", "11", "분"].indexOf(t)];

const Clock: FC<{ cx: number; cy: number; r: number; h: number; m: number; o?: number }> = ({ cx, cy, r, h, m, o = 1 }) => {
  const ha = (((h % 12) + m / 60) * 30 * Math.PI) / 180;
  const ma = (m * 6 * Math.PI) / 180;
  return (
    <g opacity={o}>
      <circle cx={cx} cy={cy} r={r} fill="var(--paper)" stroke="var(--ink)" strokeWidth={6} />
      {Array.from({ length: 12 }, (_, k) => {
        const a = (k * 30 * Math.PI) / 180;
        return <line key={k} x1={cx + Math.sin(a) * r * 0.82} y1={cy - Math.cos(a) * r * 0.82} x2={cx + Math.sin(a) * r * 0.94} y2={cy - Math.cos(a) * r * 0.94} stroke="var(--ink-2)" strokeWidth={k % 3 ? 3 : 6} />;
      })}
      <line x1={cx} y1={cy} x2={cx + Math.sin(ha) * r * 0.5} y2={cy - Math.cos(ha) * r * 0.5} stroke="var(--ink)" strokeWidth={10} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + Math.sin(ma) * r * 0.78} y2={cy - Math.cos(ma) * r * 0.78} stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={8} fill="var(--ink)" />
    </g>
  );
};

const Dial: FC<{ cx: number; cy: number; r: number; angle: number; color: string }> = ({ cx, cy, r, angle, color }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="var(--paper)" stroke="var(--ink)" strokeWidth={5} />
    {[0, 1, 2, 3].map((k) => (
      <line key={k} x1={cx + Math.sin((k * Math.PI) / 2) * r * 0.85} y1={cy - Math.cos((k * Math.PI) / 2) * r * 0.85} x2={cx + Math.sin((k * Math.PI) / 2) * r} y2={cy - Math.cos((k * Math.PI) / 2) * r} stroke="var(--ink-3)" strokeWidth={4} />
    ))}
    <line x1={cx} y1={cy} x2={cx + Math.sin(angle) * r * 0.8} y2={cy - Math.cos(angle) * r * 0.8} stroke={color} strokeWidth={9} strokeLinecap="round" />
    <circle cx={cx} cy={cy} r={7} fill="var(--ink)" />
  </g>
);

/** A column vector of 4 boxed numbers. */
const Col: FC<{ x: number; y: number; v: V4; w?: number; color?: string; o?: number }> = ({ x, y, v, w = 116, color, o = 1 }) => (
  <div style={{ opacity: o }}>
    {v.map((n, k) => (
      <div
        key={k}
        style={{
          position: "absolute",
          left: x,
          top: y + k * 62,
          width: w,
          height: 56,
          borderRadius: 10,
          border: "2.5px solid var(--ink)",
          background: color ?? "var(--paper)",
          color: color ? "var(--chip-ink)" : "var(--ink)",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 30,
          boxSizing: "border-box",
        }}
      >
        {fmt(n)}
      </div>
    ))}
  </div>
);

// s5 waves
const WX0 = 160;
const WPX = 44; // px per position
const WY = [300, 440, 580, 720];
const AMP = 52;
const wavePath = (k: number) =>
  Array.from({ length: 121 }, (_, i) => (i / 120) * 15)
    .map((p, i) => `${i ? "L" : "M"} ${(WX0 + p * WPX).toFixed(1)} ${(WY[k] - pe(p)[k] * AMP).toFixed(1)}`)
    .join(" ");

// s6 heat map
const HX0 = 160;
const HCW = 44;
const HY0 = 250;
const HRH = 72;

export const Ch36Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2On = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const s3On = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const s4On = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const s5On = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const s6On = beat(frame, S.s6, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);

  const readP = 3 * beat(frame, S.s5, 1.6, 1.6, EASE_IO);
  // s6: sweep 0 → 15, then settle back on 3
  const sweep = beat(frame, S.s6, 0.8, 3.4, EASE_IO);
  const back = beat(frame, S.s6, 4.6, 1.0, EASE_IO);
  const hp = mix(15 * sweep, 3, back);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: particles carry roles */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          {PARTICLE_ROWS.map((row, r) => {
            const y = [230, 410, 700][r];
            const a = beat(frame, S.s1, [0.4, 1.6, 4.6][r], 0.5);
            return (
              <div key={r} style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 18, opacity: a }}>
                {row.parts.map(([w, p], k) => (
                  <span key={k} style={{ fontSize: 60, fontWeight: 700, padding: "4px 18px", borderRadius: 14, border: "3px solid var(--ink)", background: "var(--paper)" }}>
                    {w}
                    {p && (
                      <span style={{ background: r === 2 ? "var(--hl-pink)" : "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 6px", marginLeft: 2 }}>
                        {r === 0 ? <InlineCircle p={beat(frame, S.s1, 3.0 + k * 0.4, 0.5)} pad={10}>{p}</InlineCircle> : p}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            );
          })}
          <Line y={320} fs={64} o={beat(frame, S.s1, 2.2, 0.4)}>
            {L.eq}
          </Line>
          <Hand x={590} y={342} fs={46} style={{ opacity: beat(frame, S.s1, 2.4, 0.4) }}>
            {L.sameMeaning}
          </Hand>
          <Hand x={0} y={530} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.4, 0.4) }}>
            {L.particle}
          </Hand>
          <Line y={612} fs={64} color="var(--pen)" o={beat(frame, S.s1, 4.6, 0.4)}>
            {L.neq}
          </Line>
          <Hand x={0} y={820} fs={48} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.4, 0.4) }}>
            {L.diff}
          </Hand>
        </div>
      )}

      {/* s2: same pieces, different order */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          <Line y={160} fs={50}>
            {L.orderMatters}
          </Line>
          {[
            { row: ROW_A, toks: TIME_A, y: 330, h: 10, m: 11, t: 0.6 },
            { row: ROW_B, toks: TIME_B, y: 610, h: 11, m: 10, t: 2.0 },
          ].map((r) => (
            <div key={r.y} style={{ opacity: beat(frame, S.s2, r.t, 0.5) }}>
              {r.toks.map((t, i) => (
                <TokChip key={i} text={t} x={r.row[i].x - 160} y={r.y} fs={60} color={tokColor(t)} />
              ))}
            </div>
          ))}
          <Svg>
            <Clock cx={860} cy={375} r={105} h={10} m={11} o={beat(frame, S.s2, 1.2, 0.5)} />
            <Clock cx={860} cy={655} r={105} h={11} m={10} o={beat(frame, S.s2, 2.6, 0.5)} />
          </Svg>
          <div style={{ position: "absolute", left: 380 - 40, top: 470, width: 80, textAlign: "center", fontSize: 70, fontWeight: 700, color: "var(--pen)", opacity: beat(frame, S.s2, 3.4, 0.4) }}>{L.neq}</div>
          <Line y={850} fs={30} weight={500} color="var(--ink-3)" o={beat(frame, S.s2, 4.0, 0.4)}>
            {L.src}
          </Line>
        </div>
      )}

      {/* s3: a bag of pieces */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          <Line y={160} fs={50}>
            {L.attn}
          </Line>
          {[
            { x: 90, text: TIME_A.join(""), t: 0.6 },
            { x: 590, text: TIME_B.join(""), t: 1.4 },
          ].map((b) => (
            <div key={b.x} style={{ opacity: beat(frame, S.s3, b.t, 0.5) }}>
              <div style={{ position: "absolute", left: b.x, width: 400, top: 280, textAlign: "center", fontSize: 44, fontWeight: 700 }}>{b.text}</div>
              <Svg>
                <path
                  d={`M ${b.x + 60} 400 C ${b.x + 20} 520, ${b.x + 10} 700, ${b.x + 90} 760 L ${b.x + 310} 760 C ${b.x + 390} 700, ${b.x + 380} 520, ${b.x + 340} 400 Z`}
                  fill="var(--paper-2)"
                  stroke="var(--ink)"
                  strokeWidth={5}
                  strokeLinejoin="round"
                />
                <path d={`M ${b.x + 50} 400 Q ${b.x + 200} 370 ${b.x + 350} 400`} fill="none" stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" />
              </Svg>
              {/* the same scattered pieces in both bags */}
              {[
                ["11", 70, 450],
                ["시", 230, 470],
                ["10", 120, 580],
                ["분", 250, 600],
                [" ", 180, 680],
              ].map(([t, dx, dy], i) => (
                <TokChip key={i} text={t as string} x={b.x + (dx as number)} y={(dy as number) + mix(-60, 0, beat(frame, S.s3, b.t + 0.3 + i * 0.12, 0.4))} fs={52} color={tokColor(t as string)} style={{ opacity: beat(frame, S.s3, b.t + 0.3 + i * 0.12, 0.3) }} />
              ))}
            </div>
          ))}
          <div style={{ position: "absolute", left: 500, width: 80, top: 540, textAlign: "center", fontSize: 76, fontWeight: 700, opacity: beat(frame, S.s3, 3.0, 0.4) }}>{L.eq}</div>
          <Hand x={0} y={830} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 3.6, 0.4), rotate: "-1.5deg" }}>
            {L.bag}
          </Hand>
        </div>
      )}

      {/* s4: add a position number? */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          <Line y={150} fs={54}>
            {L.addPos}
          </Line>
          <Line y={240} fs={40} o={beat(frame, S.s4, 0.6, 0.4)}>
            {L.tokVec}
          </Line>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: beat(frame, S.s4, 0.8, 0.4) }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 46, padding: "4px 18px", borderRadius: 12, background: "var(--hl-sky)", color: "var(--chip-ink)", whiteSpace: "nowrap" }}>[{TOK_VEC["10"].map(fmt1).join(", ")}]</span>
          </div>
          <Line y={440} fs={48} o={beat(frame, S.s4, 2.6, 0.4)}>
            {L.plain}
          </Line>
          {[
            { lab: L.pos1, add: 1, y: 530, t: 3.4 },
            { lab: L.pos2000, add: 2000, y: 670, t: 4.8 },
          ].map((r) => (
            <div key={r.add} style={{ opacity: beat(frame, S.s4, r.t, 0.4) }}>
              <Line y={r.y} fs={38} weight={700}>
                {r.lab}
              </Line>
              <Line y={r.y + 56} fs={40} mono weight={500} color={r.add > 1 ? "var(--pen)" : "var(--ink)"}>
                [{TOK_VEC["10"].map((x) => (x + r.add).toFixed(1)).join(", ")}]
              </Line>
            </div>
          ))}
          <Hand x={0} y={820} fs={62} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 6.0, 0.4), rotate: "-2deg" }}>
            {L.buried}
          </Hand>
        </div>
      )}

      {/* s5: sine waves */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5On }}>
          <Line y={130} fs={50}>
            {L.waves}
          </Line>
          <Svg>
            {WY.map((y, k) => (
              <g key={k} opacity={beat(frame, S.s5, 0.4 + k * 0.25, 0.4)}>
                <line x1={WX0} y1={y} x2={WX0 + 15 * WPX} y2={y} stroke="var(--grid-major)" strokeWidth={3} />
                <path d={wavePath(k)} fill="none" stroke={hl(WAVE_COLORS[k])} strokeWidth={8} strokeLinecap="round" />
              </g>
            ))}
            <line x1={WX0 + readP * WPX} y1={230} x2={WX0 + readP * WPX} y2={790} stroke="var(--pen)" strokeWidth={5} strokeDasharray="10 8" opacity={beat(frame, S.s5, 1.4, 0.3)} />
            {WY.map((y, k) => (
              <circle key={k} cx={WX0 + readP * WPX} cy={y - pe(readP)[k] * AMP} r={11} fill="var(--pen)" opacity={beat(frame, S.s5, 1.4, 0.3)} />
            ))}
          </Svg>
          {WY.map((y, k) => (
            <div key={k} style={{ position: "absolute", left: 40, width: 110, top: y - 22, fontSize: 30, fontWeight: 700, textAlign: "right", opacity: beat(frame, S.s5, 0.4 + k * 0.25, 0.4) }}>
              {WAVE_NAMES[k]}
            </div>
          ))}
          {Array.from({ length: 16 }, (_, p) => (
            <div key={p} style={{ position: "absolute", left: WX0 + p * WPX - 22, width: 44, top: 800, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28, color: p === 3 ? "var(--pen)" : "var(--ink-3)", opacity: beat(frame, S.s5, 1.0, 0.4) }}>
              {p}
            </div>
          ))}
          <div style={{ position: "absolute", left: 840, width: 200, top: 205, textAlign: "center", fontSize: 30, fontWeight: 700, whiteSpace: "nowrap", opacity: beat(frame, S.s5, 3.4, 0.4) }}>{L.readAt}</div>
          {WY.map((y, k) => (
            <div key={`v${k}`} style={{ position: "absolute", left: 870, width: 140, top: y - 28, height: 56, borderRadius: 10, background: hl(WAVE_COLORS[k]), color: "var(--chip-ink)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 34, opacity: beat(frame, S.s5, 3.6 + k * 0.2, 0.3) }}>
              {fmt(pe(3)[k])}
            </div>
          ))}
          <Hand x={0} y={870} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 5.2, 0.4) }}>
            {L.range}
          </Hand>
          <Line y={960} fs={30} weight={500} color="var(--ink-3)" o={beat(frame, S.s5, 5.8, 0.4)}>
            {L.speedsNote}
          </Line>
        </div>
      )}

      {/* s6: a different pattern at every position, like clock hands */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          <Line y={130} fs={50}>
            {L.clockTitle}
          </Line>
          {Array.from({ length: 16 }, (_, p) => (
            <div key={`n${p}`} style={{ position: "absolute", left: HX0 + p * HCW, width: HCW, top: 206, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-3)" }}>
              {p}
            </div>
          ))}
          {WAVE_NAMES.map((n, k) => (
            <div key={n} style={{ position: "absolute", left: 30, width: 120, top: HY0 + k * HRH + 18, textAlign: "right", fontSize: 28, fontWeight: 700 }}>
              {n}
            </div>
          ))}
          {Array.from({ length: 16 }, (_, p) =>
            pe(p).map((v, k) => (
              <div
                key={`${p}-${k}`}
                style={{
                  position: "absolute",
                  left: HX0 + p * HCW + 2,
                  top: HY0 + k * HRH + 2,
                  width: HCW - 4,
                  height: HRH - 4,
                  borderRadius: 6,
                  background: v >= 0 ? "var(--hl-orange)" : "var(--hl-violet)",
                  opacity: (0.15 + 0.85 * Math.abs(v)) * beat(frame, S.s6, 0.3 + p * 0.03, 0.3),
                }}
              />
            )),
          )}
          <div style={{ position: "absolute", left: HX0 + hp * HCW - 4, top: HY0 - 6, width: HCW + 8, height: HRH * 4 + 12, borderRadius: 10, border: "5px solid var(--pen)", opacity: beat(frame, S.s6, 0.8, 0.3) }} />
          <Svg>
            <Dial cx={380} cy={720} r={100} angle={hp * 1} color="var(--hl-orange)" />
            <Dial cx={700} cy={720} r={100} angle={hp / 4} color="var(--hl-sky)" />
          </Svg>
          <div style={{ position: "absolute", left: 280, width: 200, top: 830, textAlign: "center", fontSize: 34, fontWeight: 700 }}>{L.fast}</div>
          <div style={{ position: "absolute", left: 600, width: 200, top: 830, textAlign: "center", fontSize: 34, fontWeight: 700 }}>{L.slow}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 34, color: "var(--pen)" }}>
            {L.posNo} {Math.round(hp)}
          </div>
          <Hand x={0} y={910} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 3.0, 0.4) }}>
            {L.clock}
          </Hand>
        </div>
      )}

      {/* s7: add the pattern to the same token at two positions */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <Line y={130} fs={52}>
            {L.addTitle}
          </Line>
          {[
            { x: 60, lab: L.at0, p: 0, t: 0.6 },
            { x: 560, lab: L.at3, p: 3, t: 2.6 },
          ].map((b) => {
            const a = beat(frame, S.s7, b.t, 0.5);
            return (
              <div key={b.p} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: b.x, width: 460, top: 220, textAlign: "center", fontSize: 38, fontWeight: 700 }}>{b.lab}</div>
                <div style={{ position: "absolute", left: b.x, width: 116, top: 290, textAlign: "center", fontSize: 30, color: "var(--ink-2)" }}>{L.ten}</div>
                <div style={{ position: "absolute", left: b.x + 172, width: 116, top: 290, textAlign: "center", fontSize: 30, color: "var(--ink-2)" }}>
                  {L.posNo} {b.p}
                </div>
                <Col x={b.x} y={340} v={TOK_VEC["10"]} color="var(--hl-sky)" />
                <div style={{ position: "absolute", left: b.x + 116, width: 56, top: 430, textAlign: "center", fontSize: 50, fontWeight: 700 }}>+</div>
                <Col x={b.x + 172} y={340} v={pe(b.p)} color="var(--hl-orange)" o={beat(frame, S.s7, b.t + 0.5, 0.4)} />
                <div style={{ position: "absolute", left: b.x + 288, width: 56, top: 430, textAlign: "center", fontSize: 50, fontWeight: 700, opacity: beat(frame, S.s7, b.t + 1.0, 0.3) }}>=</div>
                <Col x={b.x + 344} y={340} v={add4(TOK_VEC["10"], pe(b.p))} o={beat(frame, S.s7, b.t + 1.2, 0.4)} />
              </div>
            );
          })}
          <Hand x={0} y={640} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 4.8, 0.4), rotate: "-1.5deg" }}>
            {L.differ}
          </Hand>
          <Line y={760} fs={32} weight={500} color="var(--ink-2)" o={beat(frame, S.s7, 5.6, 0.4)}>
            {L.from0} · {L.learned}
          </Line>
        </div>
      )}

      {/* s8: Part 3 wrap-up */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          <Line y={130} fs={54}>
            {L.done}
          </Line>
          <div style={{ position: "absolute", left: 80, right: 80, top: 240, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {PART3_TOOLS.map((t, i) => (
              <span
                key={t}
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  padding: "8px 22px",
                  borderRadius: 14,
                  background: ["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)", "var(--hl-pink)", "var(--hl-violet)"][i % 5],
                  color: "var(--chip-ink)",
                  opacity: beat(frame, S.s8, 0.6 + i * 0.2, 0.3),
                  scale: String(mix(0.7, 1, beat(frame, S.s8, 0.6 + i * 0.2, 0.3))),
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontSize: 36, fontWeight: 700, color: "var(--ink-2)", opacity: beat(frame, S.s8, 2.6, 0.4) }}>{L.bp}</div>
          {PIPELINE.slice(0, 3).map((part, i) => {
            const fill = i < 2 ? 1 : beat(frame, S.s8, 3.4, 0.7);
            return (
              <div key={part.key} style={{ opacity: beat(frame, S.s8, 2.8 + i * 0.2, 0.4) }}>
                <div style={{ position: "absolute", left: 230, top: 590 + i * 96, width: 620, height: 80, borderRadius: 16, border: "3px dashed var(--ink-3)", background: "var(--paper)", opacity: 1 - fill }} />
                <div style={{ position: "absolute", left: 230, top: 590 + i * 96, width: 620, height: 80, borderRadius: 16, background: hl(part.color), color: "var(--chip-ink)", display: "flex", alignItems: "center", gap: 20, padding: "0 24px", boxSizing: "border-box", opacity: fill, scale: i === 2 ? String(mix(1.08, 1, fill)) : undefined }}>
                  <span style={{ fontSize: 36, fontWeight: 700 }}>{part.name}</span>
                  <span style={{ fontSize: 28 }}>{part.does}</span>
                </div>
                <div style={{ position: "absolute", left: 870, top: 610 + i * 96, fontFamily: "var(--font-hand)", fontSize: 34, color: "var(--ink-2)" }}>{part.where}</div>
              </div>
            );
          })}
          <Hand x={0} y={920} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 5.0, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch36.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
