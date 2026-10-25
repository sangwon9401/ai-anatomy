import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ch12 } from "../../../data/ch12";
import { Caption, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "../../../scenes/kit";

const tl = buildTimeline(ch12);
const S = byId(tl);
const L = ch12.labels;

const Machine: FC<{ x: number; y: number; w: number; h: number; label: string; fs?: number; o?: number; color?: string }> = ({ x, y, w, h, label, fs = 52, o = 1, color = "var(--hl-violet)" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 26,
      border: "5px solid var(--ink)",
      background: color,
      color: "var(--chip-ink)",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: fs,
      fontWeight: 700,
      opacity: o,
    }}
  >
    {label}
  </div>
);

const Ball: FC<{ x: number; y: number; n: string | number; o: number; color?: string }> = ({ x, y, n, o, color = "var(--hl-yellow)" }) => (
  <div
    style={{
      position: "absolute",
      left: x - 46,
      top: y - 46,
      width: 92,
      height: 92,
      borderRadius: "50%",
      background: color,
      border: "4px solid var(--ink)",
      color: "var(--chip-ink)",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 40,
      fontWeight: 700,
      opacity: o,
    }}
  >
    {n}
  </div>
);

const Knob: FC<{ x: number; y: number; r: number; angle: number; o?: number }> = ({ x, y, r, angle, o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "var(--paper)", border: `${Math.max(3, r / 10)}px solid var(--ink)`, opacity: o, rotate: `${angle}deg` }}>
    <div style={{ position: "absolute", left: r - Math.max(2, r / 14), top: r * 0.12, width: Math.max(4, r / 7), height: r * 0.62, borderRadius: 4, background: "var(--pen)" }} />
  </div>
);

// travel from (x0) through a machine to (x1): in [0,1] enters, out [0,1] leaves
const travel = (pIn: number, pOut: number, x0: number, xm: number, x1: number) => (pOut > 0 ? mix(xm, x1, pOut) : mix(x0, xm, pIn));

export const Ch12Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const oneOn = 1 - beat(frame, S.s3, 0, 0.5);
  const twoOn = beat(frame, S.s3, 0.2, 0.6) * (1 - beat(frame, S.s4, 0, 0.5));
  const knobOn = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const gptOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const fieldOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const MY = 560;

  // s2 two runs through f
  const runs = [
    { i: 3, o: 7, inT: 0.6, outT: 2.0 },
    { i: 5, o: 11, inT: 3.8, outT: 5.2 },
  ];
  // s4 the slope knob turns 2 → 3
  const turn = beat(frame, S.s4, 2.6, 1.4, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s2: one machine */}
      {frame < S.s3.from + 15 && (
        <div style={{ opacity: oneOn }}>
          <Machine x={300} y={MY - 130} w={480} h={260} label={frame < S.s2.from + 12 ? "f" : L.f} fs={frame < S.s2.from + 12 ? 120 : 46} o={beat(frame, S.s1, 0.3, 0.5)} />
          <div style={{ position: "absolute", left: 90, top: MY + 150, fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s1, 1.4, 0.4) }}>{L.input} →</div>
          <div style={{ position: "absolute", left: 830, top: MY + 150, fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s1, 2.0, 0.4) }}>→ {L.output}</div>
          {runs.map((r, k) => {
            const pin = beat(frame, S.s2, r.inT, 1.0, EASE_IO);
            const pout = beat(frame, S.s2, r.outT, 1.0, EASE_IO);
            const gone = k === 0 ? beat(frame, S.s2, 3.6, 0.3) : 0;
            return (
              <div key={k} style={{ opacity: 1 - gone }}>
                {pout === 0 && <Ball x={travel(pin, 0, 140, 540, 940)} y={MY} n={r.i} o={pin > 0 && pin < 1 ? 1 : pin >= 1 ? 0 : beat(frame, S.s2, r.inT - 0.3, 0.3)} />}
                {pout > 0 && <Ball x={mix(540, 940, pout)} y={MY} n={r.o} o={1} color="var(--hl-mint)" />}
              </div>
            );
          })}
          <Hand x={330} y={MY + 250} fs={50} style={{ opacity: beat(frame, S.s2, 6.4, 0.4) }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s3: composition f then g */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: twoOn }}>
          <Machine x={130} y={MY - 110} w={370} h={220} label={L.f} fs={36} />
          <Machine x={600} y={MY - 110} w={330} h={220} label={L.g} fs={42} color="var(--hl-orange)" />
          {(() => {
            const a = beat(frame, S.s3, 0.8, 0.9, EASE_IO);
            const b = beat(frame, S.s3, 1.9, 1.0, EASE_IO);
            const c = beat(frame, S.s3, 3.1, 1.0, EASE_IO);
            if (c > 0) return <Ball x={mix(765, 1010, c)} y={MY} n={49} o={1} color="var(--hl-mint)" />;
            if (b > 0) return <Ball x={mix(315, 765, b)} y={MY} n={7} o={b < 0.9 ? 1 : 1 - (b - 0.9) * 10} color="var(--hl-yellow)" />;
            return <Ball x={mix(40, 315, a)} y={MY} n={3} o={a < 0.95 ? 1 : 0} />;
          })()}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d={`M 160 ${MY - 150} Q 540 ${MY - 260} 920 ${MY - 150}`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - beat(frame, S.s3, 4.4, 0.7)}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={6}
              strokeLinecap="round"
            />
          </svg>
          <Hand x={470} y={MY - 290} fs={56} style={{ opacity: beat(frame, S.s3, 4.8, 0.4) }}>
            {L.compose}
          </Hand>
        </div>
      )}

      {/* s4: knobs = parameters */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: knobOn }}>
          <Machine x={300} y={MY - 200} w={480} h={230} label={turn < 0.5 ? L.f : L.newF} fs={50} />
          {[
            { x: 430, label: L.knobA, value: turn < 0.5 ? 2 : 3, angle: mix(-40, 40, turn) },
            { x: 650, label: L.knobB, value: 1, angle: 0 },
          ].map((k) => (
            <div key={k.label}>
              <Knob x={k.x} y={MY + 120} r={62} angle={k.angle} />
              <div style={{ position: "absolute", left: k.x - 80, width: 160, top: MY + 196, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 700 }}>{k.value}</div>
              <div style={{ position: "absolute", left: k.x - 90, width: 180, top: MY + 254, textAlign: "center", fontSize: 30, color: "var(--ink-2)" }}>{k.label}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: MY + 330, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 44, opacity: beat(frame, S.s4, 4.2, 0.4) }}>
            3 → <b>{turn < 0.5 ? 7 : 10}</b>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 52, fontWeight: 700, opacity: beat(frame, S.s4, 5.4, 0.5) }}>
            <InlineCircle p={beat(frame, S.s4, 6.0, 0.6)}>{L.knobs}</InlineCircle>
          </div>
        </div>
      )}

      {/* s5: GPT is a chain of functions */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: gptOn }}>
          <div style={{ position: "absolute", left: 60, top: 200, fontSize: 40, fontWeight: 700, padding: "8px 20px", borderRadius: 14, border: "3px solid var(--ink)", background: "var(--paper)" }}>{L.text}</div>
          <div style={{ position: "absolute", left: 120, top: 330, width: 840, height: 500, borderRadius: 30, border: "5px solid var(--ink)", background: "var(--paper-2)" }} />
          <div style={{ position: "absolute", left: 150, top: 340, fontSize: 40, fontWeight: 700 }}>{L.gpt}</div>
          {Array.from({ length: 14 }, (_, i) => {
            const row = Math.floor(i / 7);
            const col = row === 0 ? i % 7 : 6 - (i % 7);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 170 + col * 110,
                  top: 440 + row * 190,
                  width: 80,
                  height: 80,
                  borderRadius: 14,
                  border: "4px solid var(--ink)",
                  background: i % 2 ? "var(--hl-violet)" : "var(--hl-sky)",
                  opacity: beat(frame, S.s5, 0.8 + i * 0.12, 0.3),
                }}
              />
            );
          })}
          <Hand x={560} y={750} fs={44} style={{ opacity: beat(frame, S.s5, 3.0, 0.4) }}>
            {L.many}
          </Hand>
          <div style={{ position: "absolute", left: 120, top: 870, fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s5, 3.6, 0.4) }}>{L.probs}</div>
          {[
            { w: "school", p: 0.52, c: "yellow" },
            { w: "the", p: 0.21, c: "mint" },
            { w: "work", p: 0.12, c: "sky" },
          ].map((b, i) => (
            <div key={b.w} style={{ opacity: beat(frame, S.s5, 4.0 + i * 0.2, 0.4) }}>
              <div style={{ position: "absolute", left: 120, top: 930 + i * 52, fontSize: 30 }}>{b.w}</div>
              <div style={{ position: "absolute", left: 250, top: 938 + i * 52, height: 30, width: b.p * 900, borderRadius: 15, background: `var(--hl-${b.c})` }} />
            </div>
          ))}
        </div>
      )}

      {/* s6: so many knobs */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: fieldOn }}>
          {Array.from({ length: 48 }, (_, i) => {
            const x = 130 + (i % 8) * 118;
            const y = 300 + Math.floor(i / 8) * 118;
            const wiggle = Math.sin(frame / 9 + i * 1.3) * 28 * beat(frame, S.s6, 2.4, 0.6);
            return <Knob key={i} x={x} y={y} r={38} angle={((i * 47) % 120) - 60 + wiggle} o={beat(frame, S.s6, 0.4 + i * 0.02, 0.3)} />;
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", opacity: beat(frame, S.s6, 1.2, 0.4) }}>
            <span style={{ fontSize: 56, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 22px" }}>{L.billion}</span>
          </div>
          <Hand x={0} y={1030} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 3.2, 0.4) }}>
            {L.learn}
          </Hand>
        </div>
      )}

      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontSize: 62, fontWeight: 700 }}>{L.sum}</div>
          <Hand x={0} y={600} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 1.4, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch12.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
