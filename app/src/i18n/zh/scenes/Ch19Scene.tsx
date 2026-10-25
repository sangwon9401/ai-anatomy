import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { SPICY_A, ch19 } from "../../../data/ch19";
import { NET, STORE_A, forward, num } from "../../../data/part2-toy";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";
import { Banner, FullSvg } from "../../../scenes/part2-kit";
import { EdgeLine, HID, HR, IN_TAG_T, InputBox, Node, OR, OUT, Particle, Tag2, inEdge, on, outEdge } from "../../../scenes/part2-net";

const tl = buildTimeline(ch19);
const S = byId(tl);
const L = ch19.labels;

const F0 = forward(NET, STORE_A.x);
const F1 = forward(NET, SPICY_A);
const NAMES = [L.spicy, L.line, L.price];
const wTag = (w: number) => `×${num(w)}`;
const BIAS_FS = 30;
const PROBS = [
  { w: "学校", p: 0.52, c: "var(--hl-yellow)" },
  { w: "图书馆", p: 0.21, c: "var(--hl-mint)" },
  { w: "公园", p: 0.12, c: "var(--hl-sky)" },
];

export const Ch19Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const netO = beat(frame, S.s1, 0.2, 0.5) * mix(1, 0, beat(frame, S.s7, 0, 0.5));
  const gptO = beat(frame, S.s7, 0.4, 0.5);
  const at = (step: keyof typeof S, sec: number) => frame >= S[step].from + sec * 30;

  // what each node shows
  const s6 = frame >= S.s6.from;
  const spicy5 = beat(frame, S.s6, 0.4, 0.5);
  const h1Text = s6 && at("s6", 2.4) ? num(F1.h[0]) : at("s2", 2.3) ? num(F0.h[0]) : "";
  const h2Text = s6 && at("s6", 2.4) ? num(F1.h[1]) : at("s3", 3.8) ? num(F0.h[1]) : at("s3", 1.9) ? num(F0.z[1]) : "";
  const outText = s6 && at("s6", 3.8) ? num(F1.y) : at("s4", 1.9) ? num(F0.y) : "";
  const h2On = s6 && at("s6", 2.4);
  const h2Off = !s6 && at("s3", 3.8);

  const calc = s6 ? (at("s6", 3.8) ? { t: L.calc6, o: beat(frame, S.s6, 3.8, 0.4) } : null)
    : frame >= S.s4.from ? (at("s4", 1.9) ? { t: L.calc3, o: frame >= S.s5.from ? 1 : beat(frame, S.s4, 1.9, 0.4) } : null)
    : frame >= S.s3.from ? (at("s3", 1.9) ? { t: L.calc2, o: beat(frame, S.s3, 1.9, 0.4) } : null)
    : at("s2", 2.3) ? { t: L.calc1, o: beat(frame, S.s2, 2.3, 0.4) } : null;

  // particles
  type P = { x: number; y: number; o: number };
  const parts: P[] = [];
  const push = (seg: ReturnType<typeof inEdge>, t: number, o = 1) => {
    if (t > 0 && t < 1) {
      const [x, y] = on(seg, t);
      parts.push({ x, y, o });
    }
  };
  if (frame >= S.s2.from && frame < S.s3.from) for (let i = 0; i < 3; i++) push(inEdge(i, 0), beat(frame, S.s2, 0.5 + i * 0.25, 1.4, EASE_IO));
  if (frame >= S.s3.from && frame < S.s4.from) for (let i = 0; i < 3; i++) push(inEdge(i, 1), beat(frame, S.s3, 0.3 + i * 0.2, 1.3, EASE_IO), NET.W1[1][i] === 0 ? 0.3 : 1);
  if (frame >= S.s4.from && frame < S.s5.from) for (let j = 0; j < 2; j++) push(outEdge(j), beat(frame, S.s4, 0.4, 1.3, EASE_IO), F0.h[j] === 0 ? 0.3 : 1);
  if (frame >= S.s5.from && frame < S.s6.from) {
    const f = frame - S.s5.from;
    const fade = beat(frame, S.s5, 0.4, 0.4) * (1 - beat(frame, S.s5, 6.6, 0.4));
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) push(inEdge(i, j), ((f / 46 + i * 0.13) % 1), fade * (NET.W1[j][i] === 0 ? 0.3 : 1));
    for (let j = 0; j < 2; j++) push(outEdge(j), ((f / 46 + 0.5 + j * 0.1) % 1), fade);
  }
  if (s6 && frame < S.s7.from) {
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) push(inEdge(i, j), beat(frame, S.s6, 1.0 + i * 0.12, 1.2, EASE_IO), NET.W1[j][i] === 0 ? 0.3 : 1);
    for (let j = 0; j < 2; j++) push(outEdge(j), beat(frame, S.s6, 2.6, 1.1, EASE_IO));
  }

  const appear = (k: number) => beat(frame, S.s1, 0.4 + k * 0.35, 0.5);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s7.from + 15 && (
        <div style={{ opacity: netO }}>
          {/* header */}
          {frame < S.s5.from && (
            <>
              <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700 }}>{L.title}</div>
              <Hand x={64} y={182} fs={36} color="var(--ink-3)">
                {L.example}
              </Hand>
            </>
          )}
          {frame >= S.s5.from && frame < S.s6.from && (
            <>
              <Banner text={L.forward} y={120} fs={50} o={beat(frame, S.s5, 0.3, 0.4)} />
              <Hand x={0} y={196} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 1.2, 0.4) }}>
                {L.dir}
              </Hand>
            </>
          )}
          {s6 && <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700, opacity: beat(frame, S.s6, 0.2, 0.4) }}>{L.s6title}</div>}

          <FullSvg>
            {[0, 1].map((j) =>
              [0, 1, 2].map((i) => (
                <EdgeLine
                  key={`e${i}${j}`}
                  s={inEdge(i, j)}
                  p={appear(3 + j)}
                  color={NET.W1[j][i] === 0 ? "var(--ink-3)" : "var(--ink)"}
                  dash={NET.W1[j][i] === 0 ? "10 10" : undefined}
                  w={NET.W1[j][i] === 0 ? 3 : 5}
                />
              )),
            )}
            {[0, 1].map((j) => (
              <EdgeLine key={`o${j}`} s={outEdge(j)} p={appear(6)} />
            ))}
            {parts.map((p, k) => (
              <Particle key={k} x={p.x} y={p.y} o={p.o} />
            ))}
          </FullSvg>

          {/* inputs */}
          {NAMES.map((n, i) => (
            <InputBox
              key={n}
              i={i}
              name={n}
              o={appear(i * 0.4)}
              value={
                i === 0 && s6 ? (
                  <span style={{ position: "relative" }}>
                    <span style={{ opacity: 1 - spicy5 }}>{STORE_A.x[0]}</span>
                    <span style={{ position: "absolute", left: 0, color: "var(--pen)", opacity: spicy5 }}>{SPICY_A[0]}</span>
                  </span>
                ) : (
                  STORE_A.x[i]
                )
              }
            />
          ))}

          {/* weight tags */}
          {[0, 1].map((j) =>
            [0, 1, 2].map((i) => {
              const [x, y] = on(inEdge(i, j), IN_TAG_T[j]);
              if (NET.W1[j][i] === 0) return null;
              return <Tag2 key={`w${i}${j}`} x={x} y={y} text={wTag(NET.W1[j][i])} o={appear(4 + j)} />;
            }),
          )}
          {[0, 1].map((j) => {
            const [x, y] = on(outEdge(j), 0.5);
            return <Tag2 key={`v${j}`} x={x} y={y} text={wTag(NET.v[j])} o={appear(6.4)} />;
          })}

          {/* nodes */}
          <Node c={HID[0]} r={HR} fill={h1Text ? "var(--hl-yellow)" : "var(--paper-2)"} label={L.h1} o={appear(2)}>
            {h1Text}
          </Node>
          <Node c={HID[1]} r={HR} fill={h2On ? "var(--hl-orange)" : h2Off ? "var(--paper-2)" : h2Text ? "var(--hl-yellow)" : "var(--paper-2)"} ink={h2Off ? "var(--ink-3)" : "var(--chip-ink)"} label={L.h2} o={appear(2.4)}>
            {h2Text}
          </Node>
          <Node c={OUT} r={OR} fill={outText ? "var(--hl-mint)" : "var(--paper-2)"} label={L.out} o={appear(5.6)}>
            {outText}
          </Node>
          {/* biases */}
          {[
            { c: HID[0], r: HR, b: NET.b1[0] },
            { c: HID[1], r: HR, b: NET.b1[1] },
            { c: OUT, r: OR, b: NET.c },
          ].map((n, k) => {
            const t = `${L.bias} ${n.b > 0 ? "+" : ""}${num(n.b)}`;
            return <Chip key={k} text={t} color="violet" fs={BIAS_FS} x={n.c[0] - chipWidth(t, BIAS_FS) / 2} y={n.c[1] + n.r + 10} style={{ opacity: appear(k === 2 ? 6 : 3 + k) }} />;
          })}
          <Hand x={HID[1][0] + HR + 12} y={HID[1][1] - 20} fs={42} style={{ opacity: h2Off ? beat(frame, S.s3, 3.9, 0.4) : h2On ? beat(frame, S.s6, 2.5, 0.4) : 0 }}>
            {h2On ? L.on : L.off}
          </Hand>
          <Hand x={64} y={886} fs={36} color="var(--ink-3)" style={{ opacity: frame < S.s2.from + 15 ? appear(5) * (1 - beat(frame, S.s2, 0, 0.4)) : 0 }}>
            {L.zeroW}
          </Hand>
          {s6 && (
            <Hand x={630} y={1010} fs={42} style={{ opacity: beat(frame, S.s6, 4.6, 0.4) }}>
              {L.minus}
            </Hand>
          )}

          {/* calculation line */}
          {calc && (
            <div style={{ position: "absolute", left: 0, right: 0, top: s6 ? 940 : 960, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 500, opacity: calc.o }}>{calc.t}</div>
          )}
        </div>
      )}

      {/* s7: GPT runs the same way through 96 layers */}
      {frame >= S.s7.from && (
        <div style={{ opacity: gptO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.gpt}</div>
          <Chip text={L.text} color={null} fs={44} x={540 - chipWidth(L.text, 44) / 2} y={220} style={{ background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)" }} />
          <FullSvg>
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x={300} y={330 + i * 34} width={480} height={24} rx={8} fill={i % 2 ? "var(--hl-sky)" : "var(--hl-violet)"} opacity={beat(frame, S.s7, 0.6 + i * 0.08, 0.3)} />
            ))}
            {(() => {
              const t = beat(frame, S.s7, 1.4, 2.6, EASE_IO);
              if (t <= 0 || t >= 1) return null;
              return <Particle x={540} y={mix(300, 750, t)} r={15} />;
            })()}
          </FullSvg>
          <Hand x={810} y={480} fs={44} style={{ opacity: beat(frame, S.s7, 1.2, 0.4) }}>
            {L.many}
          </Hand>
          <div style={{ position: "absolute", left: 300, top: 770, fontSize: 32, fontWeight: 700, color: "var(--ink-2)", opacity: beat(frame, S.s7, 3.8, 0.4) }}>{L.probs}</div>
          {PROBS.map((b, i) => (
            <div key={b.w} style={{ opacity: beat(frame, S.s7, 4.0 + i * 0.2, 0.4) }}>
              <div style={{ position: "absolute", left: 300, width: 120, top: 818 + i * 50, fontSize: 32 }}>{b.w}</div>
              <div style={{ position: "absolute", left: 430, top: 826 + i * 50, height: 30, width: b.p * 600, borderRadius: 15, background: b.c }} />
              <div style={{ position: "absolute", left: 440 + b.p * 600, top: 818 + i * 50, fontFamily: "var(--font-mono)", fontSize: 30 }}>{Math.round(b.p * 100)}%</div>
            </div>
          ))}
          <Hand x={0} y={990} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.0, 0.4), rotate: "-1.5deg" }}>
            {L.right} → {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch19.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
