import type { FC, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { PIPELINE } from "../../../data/ch05";
import { INPUT, NEXT96, VECS, ch96 } from "../../../data/ch96";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "../../../scenes/kit";
import { Arrow, ProbBar, Txt, fade, live } from "../../../scenes/part11-kit";

const tl = buildTimeline(ch96);
const S = byId(tl);
const L = ch96.labels;

const PART = Object.fromEntries(PIPELINE.map((p) => [p.key, p]));
const STATION = 1300; // world height of one stop on the flight (the next stop starts below the canvas)

// s1: the finished blueprint
const OV_Y: Record<string, number> = { tok: 210, emb: 306, pos: 402, att: 520, ffn: 616, out: 744, loop: 840 };

// token chips used throughout the flight
const CFS = 50;
const CW = INPUT.map((w) => chipWidth(w, CFS));
const TIGHT = rowLayout(CW, 0);
const SPREAD = rowLayout(CW, 90);
const centers = SPREAD.map((x, i) => x + CW[i] / 2);

const Header: FC<{ k: string; y: number; inner?: boolean; o?: number }> = ({ k, y, inner, o = 1 }) => {
  const p = PART[k];
  const x = inner ? 150 : 120;
  return (
    <div style={{ opacity: o }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 1010 - x - (inner ? 30 : 0),
          height: 84,
          borderRadius: 16,
          background: `var(--hl-${p.color})`,
          color: "var(--chip-ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          fontSize: 44,
          fontWeight: 700,
        }}
      >
        <span>{p.name}</span>
        <span style={{ fontSize: 32, fontWeight: 500, fontFamily: "var(--font-hand)" }}>{p.where}</span>
      </div>
      <div style={{ position: "absolute", left: 52, top: y + 24, width: 36, height: 36, borderRadius: "50%", background: `var(--hl-${p.color})`, border: "5px solid var(--ink)", boxSizing: "border-box" }} />
    </div>
  );
};

const Tokens: FC<{ y: number; xs: number[]; color?: "sky" | "mint" | "yellow" | null; o?: number; extra?: (i: number) => ReactNode }> = ({ y, xs, color = "sky", o = 1, extra }) => (
  <div style={{ opacity: o }}>
    {INPUT.map((w, i) => (
      <div key={w}>
        <Chip text={w} color={color} fs={CFS} x={xs[i]} y={y} style={color ? undefined : { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" }} />
        {extra?.(i)}
      </div>
    ))}
  </div>
);

export const Ch96Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  // camera: s1 overview → zoom into the top of the world → fly down one station per step → pull out at s7
  const zoom = beat(frame, S.s2, 0, 0.9, EASE_IO);
  const overview = (1 - zoom) * beat(frame, S.s1, 0, 0.01);
  const camY = STATION * [S.s3, S.s4, S.s5, S.s6].reduce((a, st) => a + beat(frame, st, 0, 1.1, EASE_IO), 0);
  const world = beat(frame, S.s2, 0.4, 0.6) * (1 - beat(frame, S.s7, 0, 0.5));
  const near = (i: number) => Math.abs(i * STATION - camY) < STATION * 1.3;
  const s7 = fade(frame, S.s7, S.s8);
  const s8 = fade(frame, S.s8);

  const split = beat(frame, S.s2, 1.6, 0.9, EASE_IO);
  const tokX = TIGHT.map((x, i) => mix(x, SPREAD[i], split));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the finished blueprint, then we fly into it */}
      {live(frame, S.s1, S.s2) && (
        <div style={{ opacity: overview, scale: String(mix(1, 2.4, zoom)), transformOrigin: "540px 250px" }}>
          <Txt x={0} y={100} w={1080} fs={60} bold align="center" style={{ opacity: beat(frame, S.s1, 0.2, 0.4) }}>
            {L.done}
          </Txt>
          <div style={{ position: "absolute", left: 190, top: 500, width: 700, height: 210, borderRadius: 20, border: "4px dashed var(--ink-3)", opacity: beat(frame, S.s1, 1.4, 0.4) }} />
          {PIPELINE.map((p, i) => {
            const inner = p.key === "att" || p.key === "ffn";
            const o = beat(frame, S.s1, 0.5 + i * 0.3, 0.4);
            return (
              <div
                key={p.key}
                style={{
                  position: "absolute",
                  left: inner ? 220 : 190,
                  top: OV_Y[p.key],
                  width: inner ? 640 : 700,
                  height: 82,
                  borderRadius: 14,
                  background: `var(--hl-${p.color})`,
                  color: "var(--chip-ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 26px",
                  opacity: o,
                  scale: String(mix(0.9, 1, o)),
                }}
              >
                <span style={{ fontSize: 40, fontWeight: 700 }}>{p.name}</span>
                <span style={{ fontSize: 30, fontFamily: "var(--font-hand)" }}>{p.where}</span>
              </div>
            );
          })}
          <Hand x={0} y={960} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.4, 0.4) }}>
            <InlineCircle p={beat(frame, S.s1, 3.8, 0.6)} pad={28}>
              {L.full}
            </InlineCircle>
          </Hand>
        </div>
      )}

      {/* s2–s6: the flight, one station per step */}
      {frame >= S.s2.from && frame < S.s7.from + 15 && (
        <div style={{ position: "absolute", inset: 0, opacity: world, clipPath: "inset(96px 0 0 0)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: STATION * 5, translate: `0px ${-camY}px` }}>
            {/* the pipe every token flows down */}
            <div style={{ position: "absolute", left: 66, top: 150, width: 8, height: STATION * 4 + 200, borderRadius: 4, background: "var(--grid-major)" }} />
            {/* the transformer block frame around attention and feed-forward */}
            <div style={{ position: "absolute", left: 120, top: STATION + 420, width: 890, height: STATION + 270, borderRadius: 26, border: "4px dashed var(--ink-3)" }} />
            <Txt x={150} y={STATION + 380} fs={30} style={{ color: "var(--ink-2)" }}>
              {L.block}
            </Txt>

            {near(0) && (
              <div>
                <Header k="tok" y={130} />
                <Tokens y={270} xs={tokX} color={split > 0.5 ? "sky" : null} />
                <Hand x={720} y={360} fs={42} style={{ opacity: beat(frame, S.s2, 2.6, 0.4) }}>
                  {L.cut}
                </Hand>
                <Header k="emb" y={460} o={beat(frame, S.s2, 3.6, 0.4)} />
                {VECS.map((v, i) => (
                  <div key={i} style={{ opacity: beat(frame, S.s2, 4.6 + i * 0.4, 0.4) }}>
                    <div style={{ position: "absolute", left: centers[i] - 90, top: 720, width: 180, height: 3, background: "var(--ink-3)" }} />
                    {v.map((x, j) => (
                      <div
                        key={j}
                        style={{
                          position: "absolute",
                          left: centers[i] - 80 + j * 42,
                          top: x > 0 ? 720 - x * 120 : 723,
                          width: 34,
                          height: Math.abs(x) * 120,
                          borderRadius: 6,
                          background: x > 0 ? "var(--hl-sky)" : "var(--hl-pink)",
                        }}
                      />
                    ))}
                    <Txt x={centers[i] - 100} y={850} w={200} fs={30} align="center" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
                      {INPUT[i]}
                    </Txt>
                  </div>
                ))}
                <Txt x={0} y={920} w={1080} fs={32} align="center" style={{ color: "var(--ink-3)", opacity: beat(frame, S.s2, 6.4, 0.4) }}>
                  {L.coords}
                </Txt>
              </div>
            )}

            {near(1) && (
              <div style={{ position: "absolute", left: 0, top: STATION, width: 1080 }}>
                <Header k="pos" y={130} />
                <Tokens
                  y={270}
                  xs={SPREAD}
                  extra={(i) => (
                    <div
                      style={{
                        position: "absolute",
                        left: SPREAD[i] + CW[i] - 22,
                        top: 248,
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        background: "var(--ink)",
                        color: "var(--paper)",
                        display: "grid",
                        placeItems: "center",
                        fontFamily: "var(--font-mono)",
                        fontSize: 30,
                        opacity: beat(frame, S.s3, 1.4 + i * 0.3, 0.3),
                      }}
                    >
                      {i + 1}
                    </div>
                  )}
                />
                <Hand x={800} y={360} fs={42} style={{ opacity: beat(frame, S.s3, 2.4, 0.4) }}>
                  {L.order}
                </Hand>
                <Header k="att" y={470} inner o={beat(frame, S.s3, 3.4, 0.4)} />
                <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                  {[0, 1].map((j) => {
                    const x1 = centers[2];
                    const x0 = centers[j];
                    const p = beat(frame, S.s3, 4.4 + j * 0.5, 0.6);
                    return (
                      <path
                        key={j}
                        d={`M ${x1} 760 C ${x1} ${650 - (1 - j) * 50}, ${x0} ${650 - (1 - j) * 50}, ${x0} 760`}
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - p}
                        fill="none"
                        stroke="var(--pen)"
                        strokeWidth={j === 0 ? 9 : 5}
                        strokeLinecap="round"
                        opacity={p > 0 ? 1 : 0}
                      />
                    );
                  })}
                </svg>
                <Tokens y={770} xs={SPREAD} color="yellow" o={beat(frame, S.s3, 4.0, 0.4)} />
                <Hand x={0} y={880} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 5.6, 0.4) }}>
                  {L.look}
                </Hand>
              </div>
            )}

            {near(2) && (
              <div style={{ position: "absolute", left: 0, top: STATION * 2, width: 1080 }}>
                <Header k="ffn" y={130} inner />
                <Tokens y={270} xs={SPREAD} color="yellow" />
                {SPREAD.map((_, i) => (
                  <div key={i} style={{ opacity: beat(frame, S.s4, 1.4 + i * 0.25, 0.4) }}>
                    <Arrow x1={centers[i]} y1={355} x2={centers[i]} y2={400} p={1} />
                    <div style={{ position: "absolute", left: centers[i] - 100, top: 404, width: 200, height: 64, borderRadius: 14, border: "3px solid var(--ink)", background: "var(--paper-2)", display: "grid", placeItems: "center", fontSize: 30, fontWeight: 700 }}>
                      {L.think}
                    </div>
                  </div>
                ))}
                <Tokens y={500} xs={SPREAD} color="mint" o={beat(frame, S.s4, 2.8, 0.4)} />
                {[4, 3, 2, 1].map((k) => (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      left: 220 + k * 16,
                      top: 730 + k * 16,
                      width: 520,
                      height: 110,
                      borderRadius: 18,
                      border: "3px solid var(--ink-3)",
                      background: "var(--paper)",
                      opacity: beat(frame, S.s4, 4.0 + (4 - k) * 0.2, 0.3),
                    }}
                  />
                ))}
                <div style={{ position: "absolute", left: 220, top: 730, width: 520, height: 110, borderRadius: 18, border: "4px solid var(--ink)", background: "var(--hl-yellow)", color: "var(--chip-ink)", display: "grid", placeItems: "center", fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s4, 3.8, 0.3) }}>
                  {PART.att.name} + {PART.ffn.name}
                </div>
                <Hand x={812} y={790} fs={48} style={{ opacity: beat(frame, S.s4, 5.0, 0.4), rotate: "-3deg" }}>
                  {L.layers}
                </Hand>
              </div>
            )}

            {near(3) && (
              <div style={{ position: "absolute", left: 0, top: STATION * 3, width: 1080 }}>
                <Header k="out" y={130} />
                <Txt x={150} y={260} fs={38} style={{ color: "var(--ink-2)", opacity: beat(frame, S.s5, 1.4, 0.4) }}>
                  {L.of50k}
                </Txt>
                {NEXT96.map((n, i) => (
                  <ProbBar
                    key={n.w}
                    x={150}
                    y={350 + i * 120}
                    label={n.w}
                    p={n.p}
                    max={52}
                    w={560}
                    fs={n.w.length > 2 ? 30 : 40}
                    color={["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)"][i]}
                    o={beat(frame, S.s5, 2.0 + i * 0.4, 0.3)}
                    grow={beat(frame, S.s5, 2.2 + i * 0.4, 0.8)}
                  />
                ))}
                <Txt x={150} y={720} fs={30} style={{ color: "var(--ink-3)", opacity: beat(frame, S.s5, 4.4, 0.4) }}>
                  {L.example}
                </Txt>
              </div>
            )}

            {near(4) && (
              <div style={{ position: "absolute", left: 0, top: STATION * 4, width: 1080 }}>
                <Header k="loop" y={130} />
                {(() => {
                  const ws = [...CW, chipWidth(NEXT96[0].w, CFS)];
                  const xs = rowLayout(ws, 24);
                  const pop = beat(frame, S.s6, 1.2, 0.4);
                  return (
                    <div>
                      {INPUT.map((w, i) => (
                        <Chip key={w} text={w} color={null} fs={CFS} x={xs[i]} y={280} style={{ background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" }} />
                      ))}
                      <Chip text={NEXT96[0].w} color="mint" fs={CFS} x={xs[3]} y={280} style={{ opacity: pop, scale: String(mix(0.5, 1, pop)) }} />
                      <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                        <path
                          d={`M ${xs[3] + ws[3] / 2} 362 C ${xs[3] + ws[3] / 2} 470, 90 470, 70 300`}
                          pathLength={1}
                          strokeDasharray={1}
                          strokeDashoffset={1 - beat(frame, S.s6, 2.0, 0.9)}
                          fill="none"
                          stroke="var(--pen)"
                          strokeWidth={6}
                          strokeLinecap="round"
                          opacity={beat(frame, S.s6, 2.0, 0.05) > 0 ? 1 : 0}
                        />
                      </svg>
                      <Hand x={420} y={450} fs={42} style={{ opacity: beat(frame, S.s6, 2.8, 0.4) }}>
                        {L.again}
                      </Hand>
                    </div>
                  );
                })()}
                {[
                  { t: L.pretrain, sub: L.pretrainCh, c: "var(--hl-sky)", x: 140, at: 4.4 },
                  { t: L.chat, sub: L.chatCh, c: "var(--hl-violet)", x: 580, at: 5.8 },
                ].map((c) => (
                  <div
                    key={c.t}
                    style={{
                      position: "absolute",
                      left: c.x,
                      top: 600,
                      width: 380,
                      height: 170,
                      borderRadius: 20,
                      background: c.c,
                      color: "var(--chip-ink)",
                      display: "grid",
                      placeItems: "center",
                      alignContent: "center",
                      gap: 6,
                      opacity: beat(frame, S.s6, c.at, 0.4),
                    }}
                  >
                    <span style={{ fontSize: 46, fontWeight: 700 }}>{c.t}</span>
                    <span style={{ fontSize: 32 }}>{c.sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* s7: same machine, different size */}
      {live(frame, S.s7, S.s8) && (
        <div style={{ opacity: s7 }}>
          <Hand x={0} y={120} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.6, 0.4) }}>
            {L.sameMachine}
          </Hand>
          <Txt x={140} y={230} w={340} fs={44} bold align="center">
            {L.gpt3}
          </Txt>
          <div
            style={{
              position: "absolute",
              left: 160,
              top: 950 - 672 * beat(frame, S.s7, 0.4, 1.2, EASE_IO),
              width: 300,
              height: 672 * beat(frame, S.s7, 0.4, 1.2, EASE_IO),
              borderRadius: 8,
              background: "repeating-linear-gradient(180deg, var(--hl-yellow) 0 5px, var(--paper) 5px 7px)",
              border: "3px solid var(--ink)",
            }}
          />
          <Txt x={70} y={975} w={480} fs={30} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s7, 1.6, 0.4) }}>
            {L.gpt3n}
          </Txt>
          <Txt x={600} y={810} w={380} fs={44} bold align="center" style={{ opacity: beat(frame, S.s7, 2.0, 0.4) }}>
            {L.mini}
          </Txt>
          <div style={{ position: "absolute", left: 640, top: 890, width: 300, height: 60, borderRadius: 8, background: "var(--hl-mint)", border: "3px solid var(--ink)", opacity: beat(frame, S.s7, 2.2, 0.4) }} />
          <Txt x={590} y={975} w={400} fs={32} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s7, 2.4, 0.4) }}>
            {L.minin}
          </Txt>
        </div>
      )}

      {/* s8: the certificate */}
      {live(frame, S.s8) && (
        <div style={{ opacity: s8, translate: `0px ${mix(30, 0, s8)}px` }}>
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 140,
              width: 860,
              height: 880,
              borderRadius: 28,
              border: "6px double var(--ink)",
              backgroundColor: "var(--paper)",
              backgroundImage: "linear-gradient(var(--grid-minor) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--grid-minor) 1.5px, transparent 1.5px)",
              backgroundSize: "36px 36px",
            }}
          />
          <Txt x={110} y={190} w={860} fs={84} bold align="center" style={{ letterSpacing: 20 }}>
            {L.cert}
          </Txt>
          <Txt x={110} y={310} w={860} fs={38} align="center" style={{ color: "var(--ink-2)" }}>
            {L.school}
          </Txt>
          <Txt x={200} y={410} fs={42}>
            {L.nameLine}
          </Txt>
          <div style={{ position: "absolute", left: 310, top: 462, width: 520, height: 4, borderRadius: 2, background: "var(--ink)" }} />
          <Hand x={330} y={404} fs={42} color="var(--ink-3)" style={{ opacity: beat(frame, S.s8, 1.0, 0.4) }}>
            {L.yourName}
          </Hand>
          <Txt x={200} y={520} w={680} fs={34} align="left" style={{ lineHeight: 1.6, whiteSpace: "normal" }}>
            {L.certBody}
          </Txt>
          <div style={{ position: "absolute", left: 200, top: 752, width: 680, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {PIPELINE.map((p, i) => (
              <span
                key={p.key}
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  padding: "2px 12px",
                  borderRadius: 8,
                  background: `var(--hl-${p.color})`,
                  color: "var(--chip-ink)",
                  opacity: beat(frame, S.s8, 2.0 + i * 0.2, 0.3),
                }}
              >
                {p.name}
              </span>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 700,
              top: 868,
              width: 200,
              height: 120,
              borderRadius: "50%",
              border: "6px solid var(--pen)",
              color: "var(--pen)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-hand)",
              fontSize: 40,
              rotate: "-12deg",
              opacity: beat(frame, S.s8, 4.6, 0.2),
              scale: String(mix(1.6, 1, beat(frame, S.s8, 4.6, 0.3))),
            }}
          >
            {L.stamp}
          </div>
          <Hand x={180} y={920} fs={58} style={{ opacity: beat(frame, S.s8, 6.4, 0.4), rotate: "-4deg" }}>
            {L.congrats}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch96.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
