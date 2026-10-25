// zh overlay of src/scenes/Ch34Scene.tsx: Chinese word literals for the two maps, and the blank sits at the end of the
// Chinese sentence (chip 4) with chips 1–3 as hints.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CANDIDATES, CONTEXT, DRINKS, MAPS, WINDOW, ch34, vecOf, type P2 } from "../../../data/ch34";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, hl, mix, rowLayout, type SceneProps } from "../../../scenes/kit";
import { Axes, Pt, Vec, at, type Plane } from "../../../scenes/plane";
import { Line, PenArrow, Svg } from "../../../scenes/part3-kit";

const tl = buildTimeline(ch34);
const S = byId(tl);
const L = ch34.labels;

const FS = 50;
const CTX_W = CONTEXT.map((w) => chipWidth(w, FS));
const CTX_X = rowLayout(CTX_W, 16);
const BLANK = 4;
const CAND_W = CANDIDATES.map((c) => chipWidth(c.w, 52));
const CAND_X = rowLayout(CAND_W, 34);
const WIN_W = WINDOW.map((w) => chipWidth(w, 48));
const WIN_X = rowLayout(WIN_W, 14);

const PEOPLE = MAPS[0];
const CAP = MAPS[1];
const PL: Plane = { ox: 150, oy: 950, unit: 104 };
const DPL: Plane = { ox: 120, oy: 1010, unit: 100 };

const Word: FC<{ pl: Plane; v: P2; w: string; c: string; o: number; dx?: number; dy?: number; r?: number; fs?: number }> = ({ pl, v, w, c, o, dx = 24, dy = -60, r = 18, fs = 40 }) => {
  const [x, y] = at(pl, v);
  return (
    <>
      <Pt pl={pl} v={v} r={r} color={c} o={o} />
      <div style={{ position: "absolute", left: x + dx, top: y + dy, fontSize: fs, fontWeight: 700, whiteSpace: "nowrap", opacity: o }}>{w}</div>
    </>
  );
};

export const Ch34Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const ctxOn = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const winOn = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const drinkOn = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const peopleOn = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const capOn = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);

  // s3: the window slides to '咖啡'
  const center = frame < S.s3.from + 1.6 * 30 ? 0 : frame < S.s3.from + 2.8 * 30 ? 1 : 2;
  const train = beat(frame, S.s4, 1.0, 2.4, EASE_IO);

  const [man, woman, king, queen] = ["男人", "女人", "国王", "女王"].map((w) => vecOf(PEOPLE, w));
  const mid: P2 = [king[0] - man[0], king[1] - man[1]];
  const land: P2 = [mid[0] + woman[0], mid[1] + woman[1]];
  const [kor, seoul, jpn] = ["中国", "北京", "日本"].map((w) => vecOf(CAP, w));
  const cland: P2 = [seoul[0] - kor[0] + jpn[0], seoul[1] - kor[1] + jpn[1]];

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s2: guess from the neighbours */}
      {frame < S.s3.from + 15 && (
        <div style={{ opacity: ctxOn }}>
          <Hand x={0} y={200} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 0.3, 0.4) * (1 - beat(frame, S.s2, 0, 0.4)) }}>
            {L.guess}
          </Hand>
          {CONTEXT.map((w, i) => {
            const hint = i === 1 || i === 2 || i === 3;
            const lit = hint ? beat(frame, S.s1, 3.2 + i * 0.2, 0.4) : 0;
            return (
              <Chip
                key={w}
                text={w}
                color={i === BLANK ? null : lit > 0.5 ? "yellow" : null}
                fs={FS}
                x={CTX_X[i]}
                y={330}
                style={{
                  opacity: beat(frame, S.s1, 0.6 + i * 0.25, 0.3),
                  ...(i === BLANK ? { background: "var(--paper)", border: "4px dashed var(--pen)", color: "var(--pen)" } : lit > 0.5 ? {} : { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" }),
                }}
              />
            );
          })}
          <Hand x={0} y={460} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 4.4, 0.4) * (1 - beat(frame, S.s2, 0, 0.4)) }}>
            {L.hint}
          </Hand>
          {/* s2: candidates */}
          {CANDIDATES.map((c, i) => {
            const a = beat(frame, S.s2, 0.5 + i * 0.5, 0.4);
            return (
              <div key={c.w} style={{ opacity: a }}>
                <Chip text={c.w} color={c.fits ? "orange" : "sky"} fs={52} x={CAND_X[i]} y={560} />
                <div style={{ position: "absolute", left: CAND_X[i], width: CAND_W[i], top: 470, textAlign: "center", fontFamily: "var(--font-hand)", fontSize: 64, color: "var(--pen)", opacity: beat(frame, S.s2, 0.8 + i * 0.5, 0.3) }}>
                  {c.fits ? L.ok : L.no}
                </div>
              </div>
            );
          })}
          <Hand x={CAND_X[0]} y={650} fs={42} style={{ opacity: beat(frame, S.s2, 2.6, 0.4) }}>
            ↑ {L.fits}
          </Hand>
          <Hand x={CAND_X[3]} y={650} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s2, 2.8, 0.4) }}>
            ↑ {L.nofit}
          </Hand>
          <Line y={790} fs={50} o={beat(frame, S.s2, 3.8, 0.5)}>
            <InlineCircle p={beat(frame, S.s2, 4.4, 0.6)}>{L.hypo}</InlineCircle>
          </Line>
          <div style={{ position: "absolute", left: 0, right: 0, top: 890, display: "flex", justifyContent: "center", opacity: beat(frame, S.s2, 5.6, 0.4) }}>
            <span style={{ fontSize: 46, fontWeight: 700, padding: "4px 22px", borderRadius: 14, background: "var(--hl-mint)", color: "var(--chip-ink)" }}>{L.hypoName}</span>
          </div>
        </div>
      )}

      {/* s3: Word2Vec's practice */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: winOn }}>
          <Line y={150} fs={58}>
            {L.w2v}
          </Line>
          {(() => {
            const lo = Math.max(0, center - 2);
            const hi = Math.min(WINDOW.length - 1, center + 2);
            const x0 = WIN_X[lo] - 14;
            const x1 = WIN_X[hi] + WIN_W[hi] + 14;
            return (
              <>
                <div style={{ position: "absolute", left: x0, top: 376, width: x1 - x0, height: 120, borderRadius: 20, border: "4px dashed var(--ink-3)", opacity: beat(frame, S.s3, 0.9, 0.3) }} />
                {WINDOW.map((w, i) => {
                  const inWin = i >= lo && i <= hi && i !== center;
                  return (
                    <Chip
                      key={w}
                      text={w}
                      color={i === center ? "yellow" : inWin ? "sky" : null}
                      fs={48}
                      x={WIN_X[i]}
                      y={400}
                      style={{ opacity: beat(frame, S.s3, 0.4 + i * 0.1, 0.3), ...(i === center || inWin ? {} : { background: "var(--paper)", border: "2.5px solid var(--line)", color: "var(--ink-3)" }) }}
                    />
                  );
                })}
                <Svg>
                  {WINDOW.map((_, i) => {
                    if (i < lo || i > hi || i === center) return null;
                    const cx = WIN_X[center] + WIN_W[center] / 2;
                    const tx = WIN_X[i] + WIN_W[i] / 2;
                    return <PenArrow key={`${center}-${i}`} x1={cx} y1={392} x2={tx} y2={392} bend={30 + Math.abs(i - center) * 30} p={beat(frame, S.s3, 1.0, 0.1) > 0 ? 1 : 0} />;
                  })}
                </Svg>
                <Hand x={0} y={236} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 1.2, 0.4) }}>
                  {L.guessIt}
                </Hand>
              </>
            );
          })()}
          <Line y={590} fs={46} o={beat(frame, S.s3, 3.6, 0.4)}>
            {L.practice}
          </Line>
          <Hand x={0} y={690} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 5.0, 0.4) }}>
            {L.millions}
          </Hand>
        </div>
      )}

      {/* s4: before / after practice */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: drinkOn }}>
          <Line y={170} fs={50} o={1 - beat(frame, S.s4, 1.6, 0.4)}>
            {L.before}
          </Line>
          <Line y={170} fs={50} o={beat(frame, S.s4, 1.8, 0.4)}>
            {L.after}
          </Line>
          {DRINKS.map((d) => {
            const v: P2 = [mix(d.from[0], d.to[0], train), mix(d.from[1], d.to[1], train)];
            return <Word key={d.w} pl={DPL} v={v} w={d.w} c={hl(d.c)} o={beat(frame, S.s4, 0.4, 0.4)} fs={44} />;
          })}
          <Svg>
            <ellipse cx={at(DPL, [2.55, 5.85])[0] + 40} cy={at(DPL, [2.55, 5.85])[1] - 20} rx={190} ry={120} fill="none" stroke="var(--pen)" strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s4, 3.8, 0.6)} opacity={beat(frame, S.s4, 3.8, 0.05)} />
          </Svg>
          <Hand x={0} y={960} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 4.6, 0.4) }}>
            {L.noOne}
          </Hand>
        </div>
      )}

      {/* s5–s6: directions carry meaning; king − man + woman */}
      {frame >= S.s5.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: peopleOn }}>
          <Line y={130} fs={50} o={1 - beat(frame, S.s6, 0, 0.4)}>
            {L.dir}
          </Line>
          <Line y={130} fs={54} o={beat(frame, S.s6, 0.2, 0.4)}>
            {L.calc}
          </Line>
          <Line y={200} fs={40} mono weight={500} o={beat(frame, S.s6, 5.2, 0.4)}>
            {L.calcNum}
          </Line>
          <Axes pl={PL} x={[0, 8.4]} y={[0, 6.4]} p={beat(frame, S.s5, 0.2, 0.6)} ticks={[0, 2, 4, 6]} />
          <div style={{ opacity: mix(1, 0.35, beat(frame, S.s6, 0.4, 0.4)) }}>
            <Vec pl={PL} from={man} v={woman} p={beat(frame, S.s5, 2.0, 0.7)} color="var(--pen)" width={8} />
            <Vec pl={PL} from={king} v={queen} p={beat(frame, S.s5, 3.4, 0.7)} color="var(--pen)" width={8} />
          </div>
          {[
            { w: "男人", v: man, c: "var(--hl-sky)", dx: -130, dy: -20 },
            { w: "女人", v: woman, c: "var(--hl-pink)", dx: -130, dy: -20 },
            { w: "国王", v: king, c: "var(--hl-sky)", dx: 28, dy: -20 },
            { w: "女王", v: queen, c: "var(--hl-pink)", dx: 28, dy: -66 },
          ].map((p, i) => (
            <Word key={p.w} pl={PL} v={p.v} w={p.w} c={p.c} o={beat(frame, S.s5, 0.6 + i * 0.3, 0.3)} dx={p.dx} dy={p.dy} fs={46} />
          ))}
          <Hand x={at(PL, [4.5, 4])[0] - 40} y={at(PL, [4.5, 4])[1] - 30} fs={52} style={{ opacity: beat(frame, S.s5, 4.6, 0.4) * (1 - beat(frame, S.s6, 0, 0.3)), rotate: "-4deg" }}>
            {L.same}
          </Hand>
          {/* s6: head-to-tail arithmetic */}
          <Vec pl={PL} from={king} v={mid} p={beat(frame, S.s6, 1.2, 0.8)} color="var(--ink)" width={8} />
          <Vec pl={PL} from={mid} v={land} p={beat(frame, S.s6, 2.6, 0.9)} color="var(--ink)" width={8} />
          <Hand x={at(PL, [6, 1.5])[0] + 24} y={at(PL, [6, 1.5])[1] + 10} fs={50} color="var(--ink)" style={{ opacity: beat(frame, S.s6, 1.6, 0.3) }}>
            {L.minus}
          </Hand>
          <Hand x={at(PL, [6, 3])[0] - 170} y={at(PL, [6, 3])[1] - 40} fs={50} color="var(--ink)" style={{ opacity: beat(frame, S.s6, 3.0, 0.3) }}>
            {L.plus}
          </Hand>
          {(() => {
            const [x, y] = at(PL, land);
            const o = beat(frame, S.s6, 3.6, 0.3);
            return (
              <>
                <div style={{ position: "absolute", left: x - 14, top: y - 14, width: 28, height: 28, rotate: "45deg", background: "var(--ink)", opacity: o }} />
                <PenCircle x={x - 70} y={y - 80} w={170} h={140} p={beat(frame, S.s6, 4.0, 0.6)} />
                <Hand x={x - 230} y={y - 100} fs={58} style={{ opacity: beat(frame, S.s6, 4.4, 0.4) }}>
                  {L.land}
                </Hand>
              </>
            );
          })()}
        </div>
      )}

      {/* s7: capitals */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: capOn }}>
          <Line y={130} fs={54}>
            {L.capital}
          </Line>
          <Axes pl={PL} x={[0, 8.4]} y={[0, 6.8]} p={1} ticks={[0, 2, 4, 6]} />
          {CAP.words.map((p, i) => {
            const key = ["中国", "北京", "日本", "东京"].includes(p.w);
            return <Word key={p.w} pl={PL} v={p.v} w={p.w} c={p.v[1] > 4 ? "var(--hl-sky)" : "var(--hl-mint)"} o={beat(frame, S.s7, 0.4 + i * 0.2, 0.3) * (key ? 1 : 0.45)} fs={44} dy={p.v[1] > 4 ? -66 : 18} />;
          })}
          <Vec pl={PL} from={kor} v={jpn} p={beat(frame, S.s7, 1.6, 0.7)} color="var(--pen)" width={8} />
          <Vec pl={PL} from={seoul} v={cland} p={beat(frame, S.s7, 2.8, 0.8)} color="var(--pen)" width={8} />
          <Hand x={at(PL, [2.9, 6.2])[0] - 70} y={at(PL, [2.9, 6.2])[1] + 14} fs={46} style={{ opacity: beat(frame, S.s7, 2.2, 0.3) }}>
            {L.minusKor}
          </Hand>
          <Hand x={at(PL, [3.4, 2.8])[0] - 10} y={at(PL, [3.4, 2.8])[1] + 64} fs={46} style={{ opacity: beat(frame, S.s7, 3.4, 0.3) }}>
            {L.same}
          </Hand>
          {(() => {
            const [x, y] = at(PL, cland);
            return (
              <>
                <div style={{ position: "absolute", left: x - 14, top: y - 14, width: 28, height: 28, rotate: "45deg", background: "var(--ink)", opacity: beat(frame, S.s7, 3.6, 0.3) }} />
                <PenCircle x={x - 80} y={y - 70} w={170} h={130} p={beat(frame, S.s7, 3.9, 0.6)} />
              </>
            );
          })()}
          <Hand x={0} y={1024} fs={42} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 4.8, 0.4) }}>
            {L.real} · {L.example}
          </Hand>
        </div>
      )}

      {/* s8 */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          <Line y={380} fs={72}>
            <InlineCircle p={beat(frame, S.s8, 0.8, 0.6)}>{L.sum}</InlineCircle>
          </Line>
          <Hand x={0} y={540} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 2.6, 0.5) }}>
            {L.gpt}
          </Hand>
          <div style={{ position: "absolute", left: 56, right: 56, top: 700, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, opacity: beat(frame, S.s8, 1.6, 0.5) }}>
            {[L.hypoName, L.w2v, `${L.calc} ${L.land}`].map((t, i) => (
              <span key={t} style={{ fontSize: 36, fontWeight: 700, padding: "6px 18px", borderRadius: 12, background: ["var(--hl-mint)", "var(--hl-sky)", "var(--hl-yellow)"][i], color: "var(--chip-ink)", whiteSpace: "nowrap" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch34.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
