// zh overlay of src/scenes/Ch35Scene.tsx: Chinese word literals (小狗, 包, 钥匙) in place of 강아지, 배, 버스.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { BAE_SENTENCES, ODD_ROUNDS, UNIVERSE, UNI_GROUPS, ch35, nearest, wordAt, type P2 } from "../../../data/ch35";
import { Caption, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, hl, mix, type SceneProps } from "../../../scenes/kit";
import { Line, PenArrow, Svg } from "../../../scenes/part3-kit";

const tl = buildTimeline(ch35);
const S = byId(tl);
const L = ch35.labels;

const SX = (x: number) => 110 + x * 86;
const SY = (y: number) => 1000 - y * 80;
const sp = (v: P2): [number, number] => [SX(v[0]), SY(v[1])];
const DOG_NEAR = nearest("小狗", 4);
const ODD = ODD_ROUNDS[0];
const centroid = (g: number): P2 => {
  const m = UNIVERSE.filter((x) => x.g === g);
  return [m.reduce((s, x) => s + x.v[0], 0) / m.length, m.reduce((s, x) => s + x.v[1], 0) / m.length];
};
const BAE = wordAt("包").v;
const BAE_LINKS = [
  { g: 1, label: L.fruit },
  { g: 2, label: L.boat },
  { g: 3, label: L.belly },
];

/** The whole map; `o(word)` gives each word's opacity, `hot` words get bold labels. */
const MapLayer: FC<{ o: (w: string, g: number) => number; hot?: string[]; appear?: (g: number) => number }> = ({ o, hot = [], appear = () => 1 }) => (
  <>
    {UNIVERSE.map((x) => {
      const [px, py] = sp(x.v);
      const a = appear(x.g) * o(x.w, x.g);
      const isBae = x.g < 0;
      return (
        <div key={x.w} style={{ opacity: a }}>
          <div
            style={{
              position: "absolute",
              left: px - 13,
              top: py - 13,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: isBae ? "var(--paper)" : hl(UNI_GROUPS[x.g].c),
              border: isBae ? "5px solid var(--pen)" : "3px solid var(--ink)",
              boxSizing: "border-box",
            }}
          />
          <div style={{ position: "absolute", left: px + 18, top: py - 24, fontSize: 34, fontWeight: hot.includes(x.w) || isBae ? 700 : 500, whiteSpace: "nowrap", color: isBae ? "var(--pen)" : "var(--ink)" }}>{x.w}</div>
        </div>
      );
    })}
  </>
);

export const Ch35Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const mapOn = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);

  const inS = (a: string, b: string) => frame >= S[a].from && frame < S[b].from;
  // focus sets per step
  const dogFocus = beat(frame, S.s2, 1.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const oddFocus = beat(frame, S.s4, 0.4, 0.5) * (1 - beat(frame, S.s5, 0, 0.4));
  const baeFocus = beat(frame, S.s5, 0.4, 0.5);
  const dogSet = ["小狗", ...DOG_NEAR.map((n) => n.w)];

  const opacity = (w: string, g: number) => {
    let o = 1;
    if (dogFocus > 0) o = Math.min(o, dogSet.includes(w) ? 1 : mix(1, 0.2, dogFocus));
    if (oddFocus > 0) o = Math.min(o, ODD.includes(w) ? 1 : mix(1, 0.2, oddFocus));
    if (baeFocus > 0) o = Math.min(o, w === "包" || [1, 2, 3].includes(g) ? mix(1, frame >= S.s6.from ? 0.45 : 0.85, baeFocus) : mix(1, 0.15, baeFocus));
    if (w === "包" && baeFocus > 0) o = 1;
    return o;
  };

  const [dx, dy] = sp(wordAt("小狗").v);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s7.from + 15 && (
        <div style={{ opacity: mapOn }}>
          {/* headers */}
          <Line y={110} fs={44} o={1 - beat(frame, S.s2, 0, 0.3)}>
            {L.title}
          </Line>
          {inS("s2", "s4") || (frame >= S.s4.from - 10 && frame < S.s4.from + 15) ? (
            <div style={{ position: "absolute", left: 300, top: 104, width: 480, height: 70, borderRadius: 35, border: "4px solid var(--ink)", background: "var(--paper)", display: "flex", alignItems: "center", gap: 14, padding: "0 28px", boxSizing: "border-box", fontSize: 40, opacity: beat(frame, S.s2, 0.2, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
              <span style={{ color: "var(--ink-3)" }}>{L.search}</span>
              <b>{L.dog.slice(0, Math.max(0, Math.round(beat(frame, S.s2, 0.4, 0.6) * 3)))}</b>
            </div>
          ) : null}
          <Line y={110} fs={48} o={beat(frame, S.s4, 0.2, 0.4) * (1 - beat(frame, S.s5, 0, 0.3))}>
            {L.odd}
          </Line>
          <Line y={110} fs={50} o={beat(frame, S.s5, 0.2, 0.4)}>
            {L.baeQ}
          </Line>

          {/* s2–s3: rings and lines from 小狗 */}
          <Svg>
            {[0, 1, 2].map((k) => {
              const p = beat(frame, S.s2, 1.0 + k * 0.3, 1.0);
              return <circle key={k} cx={dx} cy={dy} r={30 + p * 150} fill="none" stroke="var(--pen)" strokeWidth={4} opacity={(1 - p) * (p > 0 ? 1 : 0)} />;
            })}
            {DOG_NEAR.map((n, i) => {
              const [nx, ny] = sp(n.v);
              const p = beat(frame, S.s2, 2.0 + i * 0.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.3));
              return <line key={n.w} x1={dx} y1={dy} x2={mix(dx, nx, p)} y2={mix(dy, ny, p)} stroke="var(--pen)" strokeWidth={4} strokeDasharray="8 8" opacity={p > 0 ? 1 : 0} />;
            })}
          </Svg>
          <MapLayer o={opacity} hot={frame < S.s4.from ? dogSet : frame < S.s5.from ? ODD : ["包"]} appear={(g) => beat(frame, S.s1, 0.6 + (g < 0 ? 6 : g) * 0.35, 0.4)} />
          {/* s3: distances */}
          <div style={{ position: "absolute", left: 70, top: 740, width: 420, opacity: beat(frame, S.s2, 2.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{frame < S.s3.from ? L.ranks : L.distNote}</div>
            {DOG_NEAR.map((n, i) => (
              <div key={n.w} style={{ marginTop: 6, display: "flex", gap: 16, alignItems: "baseline", fontSize: 38, opacity: beat(frame, S.s2, 2.6 + i * 0.3, 0.3) }}>
                <span style={{ color: "var(--pen)", fontWeight: 700 }}>{i + 1}.</span>
                <span style={{ fontWeight: 700, width: 130 }}>{n.w}</span>
                <span style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s3, 0.8 + i * 0.3, 0.3) }}>{n.d.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Hand x={570} y={472} fs={40} color="var(--ink-2)" style={{ lineHeight: 1.2, opacity: beat(frame, S.s3, 3.6, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            {L.cosine1}
            <br />
            {L.cosine2}
          </Hand>

          {/* s4: odd one out */}
          {(() => {
            const c = centroid(1);
            const [cx, cy] = sp([c[0] - 0.25, c[1] + 0.45]);
            const [bx, by] = sp(wordAt("钥匙").v);
            const p = beat(frame, S.s4, 1.6, 0.6) * (1 - beat(frame, S.s5, 0, 0.3));
            return (
              <>
                <Svg>
                  <ellipse cx={cx + 30} cy={cy} rx={170} ry={130} fill="none" stroke="var(--pen)" strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} />
                  <PenArrow x1={cx + 20} y1={cy + 140} x2={bx + 10} y2={by - 40} p={beat(frame, S.s4, 2.6, 0.6) * (1 - beat(frame, S.s5, 0, 0.3))} bend={-40} />
                </Svg>
                <Hand x={bx - 300} y={by - 220} fs={56} style={{ opacity: beat(frame, S.s4, 3.4, 0.4) * (1 - beat(frame, S.s5, 0, 0.3)), rotate: "-3deg" }}>
                  {L.oddAns}
                </Hand>
              </>
            );
          })()}

          {/* s5: 包 sits between three groups */}
          <Svg>
            {BAE_LINKS.map((b, i) => {
              const [x1, y1] = sp(BAE);
              const [x2, y2] = sp(centroid(b.g));
              const p = beat(frame, S.s5, 1.4 + i * 0.5, 0.6) * (1 - beat(frame, S.s6, 0, 0.4));
              return <line key={b.g} x1={x1} y1={y1} x2={mix(x1, x2, p)} y2={mix(y1, y2, p)} stroke="var(--pen)" strokeWidth={5} strokeDasharray="12 10" opacity={p > 0 ? 1 : 0} />;
            })}
          </Svg>
          {BAE_LINKS.map((b, i) => {
            const [x1, y1] = sp(BAE);
            const [x2, y2] = sp(centroid(b.g));
            return (
              <Hand key={b.g} x={(x1 + x2) / 2 + [20, 30, -170][i]} y={(y1 + y2) / 2 + [-40, -10, -50][i]} fs={46} style={{ opacity: beat(frame, S.s5, 1.8 + i * 0.5, 0.4) * (1 - beat(frame, S.s6, 0, 0.4)) }}>
                {b.label}
              </Hand>
            );
          })}
          <PenCircle x={sp(BAE)[0] - 50} y={sp(BAE)[1] - 50} w={160} h={100} p={beat(frame, S.s5, 0.8, 0.6)} />
          <Hand x={0} y={1020} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 3.8, 0.4) * (1 - beat(frame, S.s6, 0, 0.4)) }}>
            {L.many}
          </Hand>

          {/* s6: the sentence decides */}
          {BAE_SENTENCES.map((s, i) => {
            const [x1, y1] = sp(BAE);
            const [x2, y2] = sp(centroid(s.g));
            const a = beat(frame, S.s6, 0.8 + i * 1.6, 0.5);
            return (
              <div key={s.text} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 200 + i * 80, display: "flex", justifyContent: "center" }}>
                  <span style={{ fontSize: 40, fontWeight: 700, padding: "4px 20px", borderRadius: 12, background: hl(UNI_GROUPS[s.g].c), color: "var(--chip-ink)" }}>{s.text}</span>
                </div>
                <Svg>
                  <PenArrow x1={x1} y1={y1} x2={mix(x1, x2, 0.75)} y2={mix(y1, y2, 0.75)} p={beat(frame, S.s6, 1.3 + i * 1.6, 0.6)} w={7} />
                </Svg>
              </div>
            );
          })}
          <Hand x={0} y={1020} fs={42} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.6, 0.4) }}>
            {L.attn}
          </Hand>
        </div>
      )}

      {/* s7: a 2-D shadow of thousands of dimensions */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <Line y={150} fs={52}>
            {L.dims}
          </Line>
          <Svg>
            {(() => {
              const t = frame / 30;
              const a = t * 0.6;
              // a wire cube floating above a sheet, and its shadow on the sheet
              const cube: [number, number, number][] = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z] as [number, number, number])));
              const rot = ([x, y, z]: [number, number, number]): [number, number, number] => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
              const top = (p: [number, number, number]): [number, number] => [540 + p[0] * 110 + p[2] * 40, 400 - p[1] * 90 + p[2] * 25];
              const shadow = (p: [number, number, number]): [number, number] => [540 + p[0] * 130 + p[2] * 60, 800 + p[2] * 40 + p[1] * 12];
              const edges: [number, number][] = [];
              cube.forEach((p, i) => cube.forEach((q, j) => {
                if (j > i && p.filter((v, k) => v !== q[k]).length === 1) edges.push([i, j]);
              }));
              const rc = cube.map(rot);
              return (
                <>
                  <path d="M 180 740 L 900 740 L 980 900 L 100 900 Z" fill="var(--paper-2)" stroke="var(--line)" strokeWidth={3} />
                  {edges.map(([i, j], k) => {
                    const [x1, y1] = shadow(rc[i]);
                    const [x2, y2] = shadow(rc[j]);
                    return <line key={`s${k}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-3)" strokeWidth={5} opacity={beat(frame, S.s7, 1.6, 0.5)} />;
                  })}
                  {edges.map(([i, j], k) => {
                    const [x1, y1] = top(rc[i]);
                    const [x2, y2] = top(rc[j]);
                    return <line key={`c${k}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" opacity={beat(frame, S.s7, 0.6, 0.5)} />;
                  })}
                  {[0, 7].map((i) => {
                    const [x1, y1] = top(rc[i]);
                    const [x2, y2] = shadow(rc[i]);
                    return <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--pen)" strokeWidth={3} strokeDasharray="8 8" opacity={beat(frame, S.s7, 1.2, 0.5)} />;
                  })}
                </>
              );
            })()}
          </Svg>
          <Line y={930} fs={46} o={beat(frame, S.s7, 2.6, 0.5)}>
            {L.shadow}
          </Line>
          <Hand x={0} y={1010} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 4.0, 0.5) }}>
            {L.twist}
          </Hand>
        </div>
      )}

      {/* s8 */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          {[L.sum1, L.sum2, L.sum3].map((t, i) => (
            <div key={t} style={{ position: "absolute", left: 0, right: 0, top: 320 + i * 140, display: "flex", justifyContent: "center", opacity: beat(frame, S.s8, 0.6 + i * 1.0, 0.5) }}>
              <span style={{ fontSize: 54, fontWeight: 700, padding: "8px 30px", borderRadius: 16, background: ["var(--hl-yellow)", "var(--hl-sky)", "var(--hl-mint)"][i], color: "var(--chip-ink)" }}>
                {i === 2 ? <InlineCircle p={beat(frame, S.s8, 3.6, 0.6)}>{t}</InlineCircle> : t}
              </span>
            </div>
          ))}
        </div>
      )}

      <Narration tl={tl} chapter={ch35.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
