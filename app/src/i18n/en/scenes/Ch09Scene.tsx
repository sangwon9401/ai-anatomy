import type { FC, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { FRIENDS } from "../../../data/ch07";
import { ch09, dot } from "../../../data/ch09";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "../../../scenes/kit";
import { Vec, at, type Plane } from "../../../scenes/plane";

const tl = buildTimeline(ch09);
const S = byId(tl);
const L = ch09.labels;

const PL: Plane = { ox: 540, oy: 700, unit: 52 };
const [MINJI, JUNHO, SEOYEON] = FRIENDS;
const A_LEN = Math.hypot(...MINJI.v);
const A_ANG = Math.atan2(MINJI.v[1], MINJI.v[0]);
const fmt = (v: number) => (Math.abs(v) < 0.05 ? "0" : v > 0 ? v.toFixed(1) : `−${Math.abs(v).toFixed(1)}`);

// s6: attention preview — "It" scores the words before it (illustrative numbers)
// en: English word order is subject–verb–object, so "ate" comes before "the fish" (same scores per word)
const ATT = [L.cat, L.ate, L.fish, L.it];
const ATT_SCORE = [3.1, 0.4, 5.2];
const ATT_W = ATT.map((w) => chipWidth(w, 52));
const ATT_X = rowLayout(ATT_W, 26);

const Card: FC<{ o: number; children: ReactNode }> = ({ o, children }) => (
  <div style={{ position: "absolute", left: 56, top: 110, width: 470, padding: "18px 24px", borderRadius: 20, background: "var(--paper)", border: "3px solid var(--ink)", opacity: o }}>{children}</div>
);

export const Ch09Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const planeOn = 1 - beat(frame, S.s6, 0, 0.5);
  const pairOn = 1 - beat(frame, S.s4, 0, 0.5);
  const rotOn = beat(frame, S.s4, 0.2, 0.5);

  // s4–s5: a blue arrow sweeping round the pink one
  const offset = (Math.PI / 2) * (beat(frame, S.s4, 1.6, 1.6, EASE_IO) + beat(frame, S.s4, 4.4, 1.6, EASE_IO)) - ((Math.PI * 5) / 6) * beat(frame, S.s5, 0, 1.0, EASE_IO);
  const len = mix(5, 9, beat(frame, S.s5, 1.4, 2.0, EASE_IO));
  const b: [number, number] = [len * Math.cos(A_ANG + offset), len * Math.sin(A_ANG + offset)];
  const live = A_LEN * len * Math.cos(offset);
  const rightAngle = Math.max(0, 1 - Math.abs(offset - Math.PI / 2) / 0.12);
  const [ox, oy] = at(PL, [0, 0]);

  const c = (n: number | string, color: string) => (
    <span style={{ background: `var(--hl-${color})`, color: "var(--chip-ink)", borderRadius: 8, padding: "0 6px" }}>{n}</span>
  );

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s6.from + 20 && (
        <div style={{ opacity: planeOn }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: beat(frame, S.s1, 0, 0.6) }}>
            <line x1={240} y1={oy} x2={1030} y2={oy} stroke="var(--ink-3)" strokeWidth={4} />
            <line x1={ox} y1={980} x2={ox} y2={170} stroke="var(--ink-3)" strokeWidth={4} />
          </svg>

          {/* s1–s3: two worked examples */}
          <div style={{ opacity: pairOn }}>
            <Vec pl={PL} v={SEOYEON.v} p={beat(frame, S.s1, 1.4, 0.8)} color="var(--hl-sky)" width={12} />
            <Vec pl={PL} v={JUNHO.v} p={beat(frame, S.s3, 0.4, 0.8)} color="var(--hl-mint)" width={12} />
            {[SEOYEON, JUNHO].map((f, i) => {
              const [x, y] = at(PL, f.v);
              const o = i === 0 ? beat(frame, S.s1, 2.0, 0.4) : beat(frame, S.s3, 1.0, 0.4);
              return (
                <div key={f.name} style={{ position: "absolute", ...(x > 800 ? { right: 1080 - x + 20 } : { left: x + 16 }), top: y - 58, fontSize: 34, fontWeight: 700, opacity: o, whiteSpace: "nowrap" }}>
                  {f.name} <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 500 }}>({f.v.join(", ")})</span>
                </div>
              );
            })}
            <Card o={beat(frame, S.s1, 0.3, 0.5)}>
              <div style={{ fontSize: 44, fontWeight: 700 }}>{L.dotLabel}</div>
              <div style={{ fontSize: 30, color: "var(--ink-2)" }}>{L.rule}</div>
              <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 38, lineHeight: 1.6, opacity: beat(frame, S.s2, 0.3, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
                <div>
                  ({c(8, "pink")}, {c(3, "yellow")}) · ({c(7, "pink")}, {c(4, "yellow")})
                </div>
                <div style={{ opacity: beat(frame, S.s2, 1.4, 0.4) }}>= 8×7 + 3×4</div>
                <div style={{ opacity: beat(frame, S.s2, 3.0, 0.4) }}>= 56 + 12</div>
                <div style={{ opacity: beat(frame, S.s2, 4.4, 0.4), fontWeight: 700 }}>= {dot(MINJI.v, SEOYEON.v)}</div>
              </div>
              <div style={{ position: "absolute", left: 24, top: 132, fontFamily: "var(--font-mono)", fontSize: 38, lineHeight: 1.6, opacity: beat(frame, S.s3, 0.3, 0.4) }}>
                <div>(8, 3) · (2, 9)</div>
                <div style={{ opacity: beat(frame, S.s3, 1.6, 0.4) }}>= 16 + 27</div>
                <div style={{ opacity: beat(frame, S.s3, 3.0, 0.4), fontWeight: 700 }}>= {dot(MINJI.v, JUNHO.v)}</div>
                <div style={{ opacity: beat(frame, S.s3, 4.2, 0.4), color: "var(--pen)" }}>
                  {dot(MINJI.v, SEOYEON.v)} &gt; {dot(MINJI.v, JUNHO.v)}
                </div>
              </div>
            </Card>
          </div>

          {/* the pink reference arrow (Mia) stays throughout */}
          <Vec pl={PL} v={MINJI.v} p={beat(frame, S.s1, 0.8, 0.8)} color="var(--hl-pink)" width={12} />
          <div style={{ position: "absolute", left: at(PL, MINJI.v)[0] - 90, top: at(PL, MINJI.v)[1] + 18, fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s1, 1.4, 0.4) }}>{L.minji}</div>

          {/* s4–s5: rotate and stretch */}
          {frame >= S.s4.from && (
            <div style={{ opacity: rotOn }}>
              <Vec pl={PL} v={b} p={1} color="var(--hl-sky)" width={12} />
              <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: rightAngle }}>
                <path
                  d={`M ${ox + 34 * Math.cos(-A_ANG)} ${oy + 34 * Math.sin(-A_ANG)} L ${ox + 48 * Math.cos(-A_ANG - Math.PI / 4)} ${oy + 48 * Math.sin(-A_ANG - Math.PI / 4)} L ${ox + 34 * Math.cos(-A_ANG - Math.PI / 2)} ${oy + 34 * Math.sin(-A_ANG - Math.PI / 2)}`}
                  fill="none"
                  stroke="var(--pen)"
                  strokeWidth={5}
                />
              </svg>
              <Card o={1}>
                <div style={{ fontSize: 34, color: "var(--ink-2)" }}>{L.dotLabel}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 84, fontWeight: 700, color: live < -0.05 ? "var(--pen)" : Math.abs(live) <= 0.05 ? "var(--ink-3)" : "var(--ink)" }}>{fmt(live)}</div>
                <div style={{ position: "relative", height: 26, marginTop: 6, borderRadius: 13, background: "var(--paper-2)" }}>
                  <div style={{ position: "absolute", left: "50%", top: -6, width: 3, height: 38, background: "var(--ink-3)" }} />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      height: 26,
                      borderRadius: 13,
                      background: live < 0 ? "var(--pen)" : "var(--hl-sky)",
                      left: live < 0 ? `${50 + (live / 80) * 50}%` : "50%",
                      width: `${(Math.abs(live) / 80) * 50}%`,
                    }}
                  />
                </div>
              </Card>
              <Hand x={600} y={150} fs={46} style={{ opacity: beat(frame, S.s4, 1.0, 0.3) * (1 - beat(frame, S.s4, 1.6, 0.3)) }}>
                {L.same}
              </Hand>
              <Hand x={600} y={150} fs={46} style={{ opacity: beat(frame, S.s4, 3.2, 0.3) * (1 - beat(frame, S.s4, 4.4, 0.3)) }}>
                {L.right}
              </Hand>
              <Hand x={600} y={150} fs={46} style={{ opacity: beat(frame, S.s4, 6.0, 0.3) * (1 - beat(frame, S.s5, 0, 0.3)) }}>
                {L.opposite}
              </Hand>
              <Hand x={600} y={150} fs={46} style={{ opacity: beat(frame, S.s5, 2.0, 0.4) }}>
                {L.longer}
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s6: where GPT uses it */}
      {frame >= S.s6.from && frame < S.s7.from + 20 && (
        <div style={{ opacity: beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5)) }}>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {ATT_SCORE.map((sc, i) => {
              const x1 = ATT_X[3] + ATT_W[3] / 2;
              const x2 = ATT_X[i] + ATT_W[i] / 2;
              const h = 80 + (x1 - x2) * 0.3;
              return (
                <path
                  key={i}
                  d={`M ${x1} 600 Q ${(x1 + x2) / 2} ${600 - h} ${x2} 600`}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - beat(frame, S.s6, 1.2 + i * 0.4, 0.6)}
                  fill="none"
                  stroke="var(--ink)"
                  strokeOpacity={0.75}
                  strokeWidth={3 + sc * 2.4}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          {ATT.map((w, i) => (
            <Chip
              key={w}
              text={w}
              color={i === 3 ? "yellow" : null}
              fs={52}
              x={ATT_X[i]}
              y={600}
              style={i === 3 ? { outline: "5px solid var(--pen)", outlineOffset: 4 } : { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" }}
            />
          ))}
          {ATT_SCORE.map((sc, i) => (
            <div key={i} style={{ position: "absolute", left: ATT_X[i], width: ATT_W[i], top: 700, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 38, opacity: beat(frame, S.s6, 1.6 + i * 0.4, 0.4) }}>
              {sc}
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontSize: 44, fontWeight: 700, opacity: beat(frame, S.s6, 3.2, 0.4) }}>{L.attention}</div>
        </div>
      )}

      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", fontSize: 72, fontWeight: 700 }}>{L.sum}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 50, opacity: beat(frame, S.s7, 1.2, 0.5) }}>
            (a<sub>1</sub>, a<sub>2</sub>) · (b<sub>1</sub>, b<sub>2</sub>) = a<sub>1</sub>b<sub>1</sub> + a<sub>2</sub>b<sub>2</sub>
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch09.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
