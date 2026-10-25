import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { NEXT, RANGE, SMALL, STUDENT_AFTER, STUDENT_BEFORE, TEACHER, ch90, quantize, sizeGB } from "../data/ch90";
import { Caption, Chip, EASE_IO, Hand, InlineUnderline, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Arrow, Box, FullSvg, Line, PenCheck } from "./part10-kit";

const tl = buildTimeline(ch90);
const S = byId(tl);
const L = ch90.labels;

// 0.82 stored as a 32-bit float (IEEE 754), byte by byte
const BITS_082 = "00111111010100011110101110000101";

const Knob: FC<{ x: number; y: number; r: number; angle: number; o?: number; hot?: boolean }> = ({ x, y, r, angle, o = 1, hot = false }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: hot ? "var(--hl-yellow)" : "var(--paper)", border: `4px solid var(--ink)`, opacity: o, rotate: `${angle}deg`, boxSizing: "border-box" }}>
    <div style={{ position: "absolute", left: r - 5, top: r * 0.14, width: 6, height: r * 0.6, borderRadius: 3, background: "var(--pen)" }} />
  </div>
);

// rulers from −RANGE to +RANGE
const RX0 = 100;
const RX1 = 980;
const rx = (v: number) => RX0 + ((v + RANGE) / (2 * RANGE)) * (RX1 - RX0);
const ticks = (n: number, y: number, h: number) => {
  let d = "";
  for (let k = 0; k < n; k++) {
    const x = RX0 + ((RX1 - RX0) * k) / (n - 1);
    d += `M ${x.toFixed(2)} ${y - h} V ${y + h} `;
  }
  return d;
};
const RULERS = [
  { y: 330, label: L.r32, n: 600, h: 14, w: 1.2 },
  { y: 560, label: L.r8, n: 256, h: 18, w: 1.6 },
  { y: 790, label: L.r4, n: 16, h: 24, w: 4 },
].map((r) => ({ ...r, d: ticks(r.n, r.y, r.h) }));
const W082 = 0.82;
const Q8 = quantize(W082, 8, RANGE);
const Q4 = quantize(W082, 4, RANGE);

const BAR_X = [150, 370, 590, 810];
const BAR_W = 140;
const BASE = 920;
const PX_PER_GB = 40;
const SIZES = [32, 16, 8, 4].map((b) => sizeGB(SMALL, b));
const SIZE_LABELS = [L.gb12, L.gb6, L.gb3, L.gb15];
const BIT_LABELS = [L.b32, L.b16, L.b8, L.b4];

export const Ch90Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1On = 1 - beat(frame, S.s2, 0, 0.4);
  const s2On = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.4));
  const s3On = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const s4On = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.4));
  const rulersOn = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.4));
  const s7On = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.4));
  const learn = beat(frame, S.s4, 2.6, 2.4, EASE_IO);
  const tallH = 620 * beat(frame, S.s2, 1.4, 1.2, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: 175 billion knobs, 32 bits each */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", opacity: beat(frame, S.s1, 0.2, 0.4) }}>
            <span style={{ fontSize: 52, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 22px" }}>{L.knobs}</span>
          </div>
          {Array.from({ length: 32 }, (_, i) => {
            const hot = i === 11;
            return <Knob key={i} x={150 + (i % 8) * 112} y={290 + Math.floor(i / 8) * 104} r={36} angle={((i * 47) % 120) - 60} o={beat(frame, S.s1, 0.4 + i * 0.02, 0.3) * (hot ? 1 : mix(1, 0.35, beat(frame, S.s1, 2.4, 0.4)))} hot={hot && frame > S.s1.from + 2.4 * 30} />;
          })}
          <Arrow x1={486} y1={442} x2={420} y2={690} p={beat(frame, S.s1, 2.8, 0.5)} color="var(--pen)" />
          {[0, 1, 2, 3].map((g) => (
            <div key={g} style={{ opacity: beat(frame, S.s1, 3.2 + g * 0.3, 0.3) }}>
              {Array.from({ length: 8 }, (_, k) => {
                const bit = BITS_082[g * 8 + k];
                return (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      left: 72 + g * 238 + k * 27,
                      top: 700,
                      width: 25,
                      height: 46,
                      borderRadius: 5,
                      background: bit === "1" ? "var(--ink)" : "var(--paper)",
                      border: "2px solid var(--ink)",
                      boxSizing: "border-box",
                      color: bit === "1" ? "var(--paper)" : "var(--ink)",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: 28,
                    }}
                  >
                    {bit}
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 72 + g * 238, width: 214, top: 756, textAlign: "center", fontSize: 30, color: "var(--ink-2)" }}>{L.byte}</div>
            </div>
          ))}
          <Hand x={0} y={840} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 4.6, 0.4) }}>
            {L.oneKnob}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 920, textAlign: "center", fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s1, 5.2, 0.4) }}>{L.bitsOf}</div>
        </div>
      )}

      {/* s2: 700GB vs a phone */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          <Line y={150} fs={46}>
            {L.eq}
          </Line>
          <Chip text={L.total} color="pink" fs={56} x={540 - chipWidth(L.total, 56) / 2} y={226} style={{ opacity: beat(frame, S.s2, 0.8, 0.4) }} />
          <div style={{ position: "absolute", left: 200, top: 980 - tallH, width: 220, height: tallH, borderRadius: "16px 16px 4px 4px", background: "var(--hl-pink)", border: "4px solid var(--ink)", boxSizing: "border-box" }} />
          <div style={{ position: "absolute", left: 200, width: 220, top: 980 - tallH + 16, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500, color: "var(--chip-ink)", opacity: beat(frame, S.s2, 2.4, 0.3) }}>{L.gb700}</div>
          <div style={{ opacity: beat(frame, S.s2, 2.8, 0.4) }}>
            <div style={{ position: "absolute", left: 640, top: 640, width: 190, height: 340, borderRadius: 30, border: "5px solid var(--ink)", background: "var(--paper)", boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: 700, top: 656, width: 70, height: 8, borderRadius: 4, background: "var(--ink-3)" }} />
            <div style={{ position: "absolute", left: 670, top: 960 - 11, width: 130, height: 11, borderRadius: 3, background: "var(--hl-mint)", border: "2px solid var(--ink)" }} />
            <div style={{ position: "absolute", left: 600, width: 270, top: 990, textAlign: "center", fontSize: 34, fontWeight: 700 }}>{L.phone}</div>
          </div>
          <Hand x={620} y={480} fs={60} style={{ opacity: beat(frame, S.s2, 4.0, 0.3), rotate: "-5deg" }}>
            {L.noWay}
          </Hand>
        </div>
      )}

      {/* s3: teacher → student */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          <Box x={80} y={260} w={440} h={360} label={L.teacher} fs={52} color="var(--hl-violet)" o={beat(frame, S.s3, 0.3, 0.4)} />
          <Hand x={80} y={640} fs={44} color="var(--ink-2)" style={{ width: 440, textAlign: "center", opacity: beat(frame, S.s3, 0.9, 0.4) }}>
            {L.big}
          </Hand>
          <Arrow x1={540} y1={460} x2={680} y2={460} p={beat(frame, S.s3, 1.8, 0.5)} color="var(--pen)" width={8} />
          <Hand x={530} y={390} fs={42} style={{ opacity: beat(frame, S.s3, 2.2, 0.4) }}>
            {L.copy}
          </Hand>
          <Box x={700} y={370} w={250} h={180} label={L.student} fs={40} color="var(--hl-mint)" o={beat(frame, S.s3, 2.6, 0.4)} />
          <Hand x={680} y={570} fs={44} color="var(--ink-2)" style={{ width: 290, textAlign: "center", opacity: beat(frame, S.s3, 3.0, 0.4) }}>
            {L.small}
          </Hand>
          <Line y={800} fs={56} o={beat(frame, S.s3, 4.2, 0.4)}>
            <InlineUnderline p={beat(frame, S.s3, 4.6, 0.6)}>{L.distill}</InlineUnderline>
          </Line>
        </div>
      )}

      {/* s4: copy the whole probability bars */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          <Line y={140} fs={46}>
            {L.context}
          </Line>
          {[
            { x0: 80, title: L.tBars, ps: TEACHER, c: "var(--hl-violet)" },
            { x0: 580, title: L.sBars, ps: TEACHER.map((_, i) => mix(STUDENT_BEFORE[i], STUDENT_AFTER[i], learn)), c: "var(--hl-mint)" },
          ].map((g) => (
            <div key={g.title}>
              <div style={{ position: "absolute", left: g.x0, width: 420, top: 240, textAlign: "center", fontSize: 38, fontWeight: 700 }}>{g.title}</div>
              <div style={{ position: "absolute", left: g.x0, top: 758, width: 420, height: 4, background: "var(--ink)" }} />
              {g.ps.map((p, i) => {
                const h = p * 640;
                const x = g.x0 + 10 + i * 104;
                return (
                  <div key={i}>
                    <div style={{ position: "absolute", left: x, top: 758 - h, width: 84, height: h, borderRadius: "10px 10px 2px 2px", background: g.c }} />
                    <div style={{ position: "absolute", left: x - 20, width: 124, top: 758 - h - 44, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30 }}>{Math.round(p * 100)}%</div>
                    <div style={{ position: "absolute", left: x - 20, width: 124, top: 772, textAlign: "center", fontSize: 30, fontWeight: 500 }}>{NEXT[i]}</div>
                  </div>
                );
              })}
            </div>
          ))}
          <Hand x={0} y={850} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 5.4, 0.4) }}>
            {L.more}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s4, 1.4, 0.4) }}>{L.oneHot}</div>
          <div style={{ position: "absolute", right: 60, top: 1000, fontSize: 28, color: "var(--ink-3)" }}>{L.example}</div>
        </div>
      )}

      {/* s5–s6: rulers with fewer ticks */}
      {frame >= S.s5.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: rulersOn }}>
          <Line y={140} fs={54}>
            {L.quant}
          </Line>
          <FullSvg>
            {RULERS.map((r, i) => {
              const a = beat(frame, S.s5, 0.8 + i * 1.2, 0.6);
              return (
                <g key={i} opacity={a}>
                  <line x1={RX0} y1={r.y} x2={RX1} y2={r.y} stroke="var(--ink)" strokeWidth={4} />
                  <path d={r.d} stroke="var(--ink)" strokeWidth={r.w} />
                </g>
              );
            })}
          </FullSvg>
          {RULERS.map((r, i) => (
            <div key={i} style={{ opacity: beat(frame, S.s5, 0.8 + i * 1.2, 0.6) }}>
              <div style={{ position: "absolute", left: RX0, top: r.y - 92, fontSize: 40, fontWeight: 700 }}>{r.label}</div>
              <div style={{ position: "absolute", left: RX0 - 40, width: 80, top: r.y + 30, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-2)" }}>−1.2</div>
              <div style={{ position: "absolute", left: RX1 - 40, width: 80, top: r.y + 30, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-2)" }}>1.2</div>
            </div>
          ))}

          {/* s6: measure 0.82 on each ruler */}
          {frame >= S.s6.from && (
            <>
              <FullSvg>
                <line x1={rx(W082)} y1={300} x2={rx(W082)} y2={830} stroke="var(--pen)" strokeWidth={3} strokeDasharray="8 8" opacity={beat(frame, S.s6, 0.4, 0.4)} />
                <circle cx={rx(W082)} cy={RULERS[0].y} r={14} fill="var(--pen)" opacity={beat(frame, S.s6, 0.4, 0.3)} />
                <circle cx={mix(rx(W082), rx(Q8), beat(frame, S.s6, 1.6, 0.5))} cy={RULERS[1].y} r={14} fill="var(--hl-mint)" stroke="var(--ink)" strokeWidth={4} opacity={beat(frame, S.s6, 1.2, 0.3)} />
                <circle cx={mix(rx(W082), rx(Q4), beat(frame, S.s6, 3.2, 0.6))} cy={RULERS[2].y} r={16} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} opacity={beat(frame, S.s6, 2.8, 0.3)} />
              </FullSvg>
              <Hand x={rx(W082) - 70} y={RULERS[0].y - 92} fs={46} style={{ opacity: beat(frame, S.s6, 0.6, 0.3) }}>
                {L.w}
              </Hand>
              <div style={{ position: "absolute", left: 520, width: 290, top: RULERS[1].y - 76, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500, opacity: beat(frame, S.s6, 2.0, 0.3) }}>{L.q8}</div>
              <div style={{ position: "absolute", left: 520, width: 290, top: RULERS[2].y - 84, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500, opacity: beat(frame, S.s6, 3.8, 0.3) }}>{L.q4}</div>
              <Hand x={0} y={910} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.8, 0.4) }}>
                {L.off}
              </Hand>
              <div style={{ position: "absolute", right: 60, top: 1000, fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s6, 0.6, 0.4) }}>{L.example}</div>
            </>
          )}
        </div>
      )}

      {/* s7: a 3B model at 32 / 16 / 8 / 4 bits */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <Line y={140} fs={52}>
            {L.model3}
          </Line>
          <div style={{ position: "absolute", left: 100, top: BASE, width: 880, height: 4, background: "var(--ink)" }} />
          {SIZES.map((gb, i) => {
            const g = beat(frame, S.s7, 0.8 + i * 0.7, 0.6);
            const h = gb * PX_PER_GB * g;
            const color = gb > 8 ? "var(--hl-pink)" : gb > 8 * 0.5 ? "var(--hl-orange)" : "var(--hl-mint)";
            return (
              <div key={i}>
                <div style={{ position: "absolute", left: BAR_X[i], top: BASE - h, width: BAR_W, height: h, borderRadius: "12px 12px 2px 2px", background: color }} />
                <div style={{ position: "absolute", left: BAR_X[i] - 30, width: BAR_W + 60, top: BASE - gb * PX_PER_GB - 52, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500, opacity: beat(frame, S.s7, 1.2 + i * 0.7, 0.3) }}>
                  {SIZE_LABELS[i]}
                </div>
                <div style={{ position: "absolute", left: BAR_X[i] - 30, width: BAR_W + 60, top: BASE + 14, textAlign: "center", fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s7, 0.6, 0.3) }}>{BIT_LABELS[i]}</div>
              </div>
            );
          })}
          <div style={{ opacity: beat(frame, S.s7, 3.8, 0.4) }}>
            <div style={{ position: "absolute", left: 100, top: BASE - 8 * PX_PER_GB - 2, width: 880, borderTop: "5px dashed var(--pen)" }} />
            <div style={{ position: "absolute", left: 640, width: 340, top: BASE - 8 * PX_PER_GB - 58, textAlign: "right", fontSize: 36, fontWeight: 700, color: "var(--pen)" }}>{L.line}</div>
          </div>
          <Hand x={BAR_X[1]} y={BASE - 6 * PX_PER_GB + 24} fs={42} color="var(--chip-ink)" style={{ width: BAR_W, textAlign: "center", opacity: beat(frame, S.s7, 4.4, 0.4) }}>
            {L.tight}
          </Hand>
          <Hand x={BAR_X[2] + 20} y={BASE - 8 * PX_PER_GB + 40} fs={52} style={{ opacity: beat(frame, S.s7, 5.0, 0.4), rotate: "-4deg" }}>
            {L.fits}
          </Hand>
        </div>
      )}

      {/* s8: why on the phone */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 90, top: 200, width: 300, height: 560, borderRadius: 44, border: "6px solid var(--ink)", background: "var(--paper)", boxSizing: "border-box" }} />
          <div style={{ position: "absolute", left: 200, top: 222, width: 80, height: 10, borderRadius: 5, background: "var(--ink-3)" }} />
          <div style={{ position: "absolute", left: 120, top: 280, width: 200, padding: "12px 16px", borderRadius: "20px 20px 6px 20px", background: "var(--hl-sky)", color: "var(--chip-ink)", fontSize: 28, fontWeight: 500, boxSizing: "border-box" }}>{L.chatQ}</div>
          <div style={{ position: "absolute", left: 140, top: 400, width: 220, padding: "12px 16px", borderRadius: "20px 20px 20px 6px", background: "var(--paper-2)", border: "2px solid var(--line)", fontSize: 28, fontWeight: 500, boxSizing: "border-box" }}>{L.chatA}</div>
          <Chip text={L.onDevice} color="mint" fs={30} x={240 - chipWidth(L.onDevice, 30) / 2} y={660} />
          {[
            { t: L.offline, y: 250 },
            { t: L.private, y: 380 },
          ].map((r, i) => (
            <div key={r.t} style={{ opacity: beat(frame, S.s8, 0.8 + i * 1.2, 0.4) }}>
              <div style={{ position: "absolute", left: 500, top: r.y, width: 520, fontSize: 42, fontWeight: 700, lineHeight: 1.3, wordBreak: "keep-all" }}>{r.t}</div>
              <PenCheck x={460} y={r.y + 28} r={22} p={beat(frame, S.s8, 1.0 + i * 1.2, 0.4)} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 460, top: 520, width: 560, fontSize: 34, lineHeight: 1.4, color: "var(--ink-2)", wordBreak: "keep-all", opacity: beat(frame, S.s8, 3.4, 0.4) }}>{L.npu}</div>
          <Hand x={460} y={700} fs={48} style={{ opacity: beat(frame, S.s8, 5.2, 0.4) }}>
            {L.weak}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch90.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
