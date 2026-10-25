import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { I2, PRESETS, WORKED, apply, ch11, lerpM, type M2 } from "../data/ch11";
import { Caption, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "./kit";

const tl = buildTimeline(ch11);
const S = byId(tl);
const L = ch11.labels;

const OX = 540;
const OY = 650;
const U = 70;
const P = (v: [number, number]): [number, number] => [OX + v[0] * U, OY - v[1] * U];
const M = Object.fromEntries(PRESETS.map((p) => [p.key, p.m])) as Record<string, M2>;
const R = (deg: number): M2 => {
  const t = (deg * Math.PI) / 180;
  return [Math.cos(t), -Math.sin(t), Math.sin(t), Math.cos(t)];
};
const WORD_M: M2 = [1.2, -0.6, 0.5, 1.1];
const WORDS: { w: string; v: [number, number]; c: string }[] = [
  { w: L.cat, v: [2.2, 0.8], c: "var(--hl-yellow)" },
  { w: L.dog, v: [2.6, 1.6], c: "var(--hl-mint)" },
  { w: L.car, v: [-1.6, 2.2], c: "var(--hl-sky)" },
];
const K = Array.from({ length: 15 }, (_, i) => i - 7);
const r1 = (x: number) => (Math.abs(x) < 0.05 ? "0" : (Math.round(x * 10) / 10).toString().replace("-", "−"));

function matrixAt(frame: number): M2 {
  if (frame < S.s3.from) return I2;
  if (frame < S.s4.from) return lerpM(I2, M.stretch, beat(frame, S.s3, 0.8, 1.6, EASE_IO));
  if (frame < S.s5.from) {
    const back = beat(frame, S.s4, 0.2, 0.7, EASE_IO);
    const turn = beat(frame, S.s4, 0.9, 1.5, EASE_IO);
    const push = beat(frame, S.s4, 4.4, 1.6, EASE_IO);
    if (turn === 0) return lerpM(M.stretch, I2, back);
    if (push === 0) return R(30 * turn);
    return lerpM(R(30), M.shear, push);
  }
  if (frame < S.s6.from) return M.shear;
  const home = beat(frame, S.s6, 0, 0.8, EASE_IO);
  const word = beat(frame, S.s6, 2.0, 1.6, EASE_IO);
  return word === 0 ? lerpM(M.shear, I2, home) : lerpM(I2, WORD_M, word);
}

const Arrow: FC<{ to: [number, number]; color: string; w?: number }> = ({ to, color, w = 9 }) => {
  const [x, y] = P(to);
  const a = Math.atan2(y - OY, x - OX);
  const h = w * 3;
  if (Math.hypot(x - OX, y - OY) < 4) return null;
  return (
    <g>
      <line x1={OX} y1={OY} x2={x - Math.cos(a) * h * 0.6} y2={y - Math.sin(a) * h * 0.6} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${x} ${y} L ${x - h * Math.cos(a - 0.45)} ${y - h * Math.sin(a - 0.45)} L ${x - h * Math.cos(a + 0.45)} ${y - h * Math.sin(a + 0.45)} Z`} fill={color} />
    </g>
  );
};

const MatrixTag: FC<{ m: M2; x: number; y: number; fs?: number }> = ({ m, x, y, fs = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: fs }}>
    <div style={{ width: fs * 0.35, alignSelf: "stretch", borderLeft: "5px solid var(--ink)", borderTop: "5px solid var(--ink)", borderBottom: "5px solid var(--ink)" }} />
    <div style={{ display: "grid", gridTemplateColumns: `repeat(2, ${fs * 2.5}px)`, textAlign: "center", lineHeight: 1.35 }}>
      {m.map((v, i) => (
        <span key={i}>{r1(v)}</span>
      ))}
    </div>
    <div style={{ width: fs * 0.35, alignSelf: "stretch", borderRight: "5px solid var(--ink)", borderTop: "5px solid var(--ink)", borderBottom: "5px solid var(--ink)" }} />
  </div>
);

export const Ch11Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const m = matrixAt(frame);
  const gridOn = beat(frame, S.s1, 0, 0.6) * (1 - beat(frame, S.s7, 0, 0.5));
  // the worked vector fades out at the end of s2 and comes back at (1, 2) for the grid transforms
  const vecOn = frame < S.s3.from ? 1 - beat(frame, S.s2, 8.4, 0.3) : beat(frame, S.s3, 0, 0.4) * (1 - beat(frame, S.s6, 0, 0.4));
  const worked = beat(frame, S.s2, 4.6, 1.0, EASE_IO);
  const v: [number, number] = frame < S.s3.from ? [mix(WORKED.v[0], 4, worked), mix(WORKED.v[1], 2, worked)] : apply(m, WORKED.v);
  const presetLabel =
    frame < S.s4.from ? L.stretch : frame < S.s4.from + 4.4 * 30 ? L.rotate : L.shear;
  const showPreset = frame >= S.s3.from && frame < S.s6.from;
  const wordsOn = beat(frame, S.s6, 0.8, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: gridOn }}>
        <defs>
          <clipPath id="ch11-clip">
            <rect x={56} y={140} width={968} height={960} rx={24} />
          </clipPath>
        </defs>
        <g clipPath="url(#ch11-clip)">
          {K.map((k) => {
            const a = P(apply(m, [k, -8]));
            const b = P(apply(m, [k, 8]));
            const c = P(apply(m, [-8, k]));
            const d = P(apply(m, [8, k]));
            const axis = k === 0;
            return (
              <g key={k}>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={axis ? "var(--ink)" : "var(--hl-sky)"} strokeWidth={axis ? 4 : 2.5} opacity={axis ? 0.9 : 0.75} />
                <line x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} stroke={axis ? "var(--ink)" : "var(--hl-sky)"} strokeWidth={axis ? 4 : 2.5} opacity={axis ? 0.9 : 0.75} />
              </g>
            );
          })}
          <polygon
            points={[[0, 0], [1, 0], [1, 1], [0, 1]].map((q) => P(apply(m, q as [number, number])).join(",")).join(" ")}
            fill="var(--hl-yellow)"
            opacity={0.45 * beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.4))}
          />
          {frame < S.s6.from + 15 && (
            <g opacity={vecOn}>
              <Arrow to={v} color="var(--hl-yellow)" w={12} />
              <Arrow to={v} color="var(--ink)" w={3} />
            </g>
          )}
          {frame >= S.s6.from &&
            WORDS.map((w) => (
              <g key={w.w} opacity={wordsOn}>
                <Arrow to={apply(m, w.v)} color={w.c} w={11} />
              </g>
            ))}
          {/* s5: a straight line stays straight, the origin stays put */}
          {frame >= S.s5.from && frame < S.s6.from + 15 && (
            <g opacity={beat(frame, S.s5, 0.6, 0.4) * (1 - beat(frame, S.s6, 0, 0.4))}>
              <line x1={P(apply(m, [-8, 2]))[0]} y1={P(apply(m, [-8, 2]))[1]} x2={P(apply(m, [8, 2]))[0]} y2={P(apply(m, [8, 2]))[1]} stroke="var(--pen)" strokeWidth={7} />
              <circle cx={OX} cy={OY} r={16} fill="var(--pen)" />
            </g>
          )}
        </g>
      </svg>

      {frame >= S.s6.from &&
        WORDS.map((w) => {
          const [x, y] = P(apply(m, w.v));
          return (
            <div key={w.w} style={{ position: "absolute", left: x + (w.v[0] < 0 ? -150 : 16), top: y - 56, fontSize: 38, fontWeight: 700, opacity: wordsOn, background: "var(--paper)", padding: "0 8px", borderRadius: 8 }}>
              {w.w}
            </div>
          );
        })}

      {/* s1–s2: one worked multiplication */}
      {frame < S.s3.from + 15 && (
        <div style={{ opacity: beat(frame, S.s1, 0.6, 0.5) * (1 - beat(frame, S.s3, 0, 0.4)) }}>
          <div style={{ position: "absolute", left: 70, top: 160, padding: "22px 28px", borderRadius: 22, background: "var(--paper)", border: "3px solid var(--ink)" }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>{L.times}</div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14, opacity: beat(frame, S.s2, 0.3, 0.4) }}>
              <div style={{ position: "relative", width: 250, height: 112 }}>
                {/* row highlights sit under the numbers: painted first */}
                <div style={{ position: "absolute", left: 14, top: 4, width: 214, height: 48, borderRadius: 10, background: "var(--hl-pink)", opacity: 0.7 * beat(frame, S.s2, 1.6, 0.3) * (1 - beat(frame, S.s2, 3.2, 0.3)) }} />
                <div style={{ position: "absolute", left: 14, top: 56, width: 214, height: 48, borderRadius: 10, background: "var(--hl-sky)", opacity: 0.8 * beat(frame, S.s2, 3.2, 0.3) }} />
                <MatrixTag m={WORKED.m} x={0} y={0} fs={38} />
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 40 }}>· ({WORKED.v.join(", ")})</span>
            </div>
            <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 36, lineHeight: 1.6 }}>
              <div style={{ opacity: beat(frame, S.s2, 1.6, 0.4) }}>
                {L.row1}: 2×1 + 1×2 = <b>4</b>
              </div>
              <div style={{ opacity: beat(frame, S.s2, 3.2, 0.4) }}>
                {L.row2}: 0×1 + 1×2 = <b>2</b>
              </div>
              <div style={{ opacity: beat(frame, S.s2, 4.6, 0.4), color: "var(--pen)", fontWeight: 700 }}>→ (4, 2)</div>
            </div>
          </div>
        </div>
      )}

      {showPreset && (
        <div style={{ opacity: beat(frame, S.s3, 0.2, 0.4) }}>
          <div style={{ position: "absolute", left: 70, top: 160, padding: "16px 22px", borderRadius: 20, background: "var(--paper)", border: "3px solid var(--ink)", display: "flex", gap: 22, alignItems: "center" }}>
            <div style={{ position: "relative", width: 230, height: 100 }}>
              <MatrixTag m={m} x={0} y={0} fs={34} />
            </div>
            <span style={{ fontSize: 42, fontWeight: 700 }}>{presetLabel}</span>
          </div>
          <Hand x={620} y={170} fs={44} color="var(--ink-2)" style={{ opacity: beat(frame, S.s3, 1.0, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            {L.every}
          </Hand>
        </div>
      )}

      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: 1 - beat(frame, S.s6, 0, 0.4) }}>
          <Hand x={640} y={300} fs={50} style={{ opacity: beat(frame, S.s5, 0.8, 0.4), rotate: "-3deg" }}>
            {L.straight}
          </Hand>
          <Hand x={OX + 30} y={OY + 30} fs={50} style={{ opacity: beat(frame, S.s5, 1.8, 0.4) }}>
            ← {L.origin}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontSize: 60, fontWeight: 700, opacity: beat(frame, S.s5, 3.0, 0.4) }}>
            <span style={{ background: "var(--paper)", padding: "0 20px", borderRadius: 14 }}>
              <InlineCircle p={beat(frame, S.s5, 3.6, 0.6)}>{L.linear}</InlineCircle>
            </span>
          </div>
        </div>
      )}

      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: 1 - beat(frame, S.s7, 0, 0.4) }}>
          <div style={{ position: "absolute", left: 70, top: 160, padding: "16px 24px", borderRadius: 20, background: "var(--paper)", border: "3px solid var(--ink)", opacity: beat(frame, S.s6, 1.2, 0.4) }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>{L.gpt}</div>
            <div style={{ fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s6, 3.8, 0.4) }}>→ {L.newSpace}</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 980, textAlign: "center", fontSize: 36, opacity: beat(frame, S.s6, 5.0, 0.4) }}>
            <span style={{ background: "var(--paper)", padding: "4px 16px", borderRadius: 10 }}>{L.qkv}</span>
          </div>
        </div>
      )}

      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontSize: 70, fontWeight: 700 }}>{L.sum}</div>
          <Hand x={0} y={620} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 1.4, 0.5) }}>
            {L.learn}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch11.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
