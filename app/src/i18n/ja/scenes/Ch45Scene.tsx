// ja overlay of src/scenes/Ch45Scene.tsx: the focus word comes from labels.bae (「かみ」) instead of the literal '배'.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { SENTENCES, attend, ch45, percents, type Meaning } from "../../../data/ch45";
import { MEANING_ICONS } from "../../../scenes/icons";
import {
  Caption,
  Narration,
  Chip,
  EASE_IO,
  Hand,
  Paper,
  Tag,
  beat,
  buildTimeline,
  byId,
  chipWidth,
  mix,
  rowLayout,
  type SceneProps,
} from "../../../scenes/kit";

const tl = buildTimeline(ch45);
const S = byId(tl);
const L = ch45.labels;

const FS = 56;
const ROW_Y = 200;
const CH = FS * 1.5;


// meaning triangle: 紙 (top), 神 (left), 髪 (right)
const V: [number, number][] = [
  [540, 500],
  [200, 1020],
  [880, 1020],
];
const pos = (m: Meaning): [number, number] => [
  m[0] * V[0][0] + m[1] * V[1][0] + m[2] * V[2][0],
  m[0] * V[0][1] + m[1] * V[1][1] + m[2] * V[2][1],
];
const CENTER = pos([1 / 3, 1 / 3, 1 / 3]);
const ICON = 110;
const ICON_AT: [number, number][] = [
  [540, 410],
  [110, 1010],
  [970, 1010],
];
// ja: the Japanese labels are one kanji, and Japanese captions often take three lines, so the bottom two labels
// sit above their icons instead of below (y 1072 would be under a three-line caption band)
const ICON_LABEL: [number, number][] = [
  [610, 388],
  [90, 898],
  [950, 898],
];
const NAMES = [L.fruit, L.boat, L.body];

function sentence(words: string[]) {
  const all = [...words, L.bae];
  const widths = all.map((w) => chipWidth(w, FS));
  const xs = rowLayout(widths, 22);
  const a = attend(words);
  return { all, widths, xs, centers: xs.map((x, i) => x + widths[i] / 2), weights: a.weights, pct: percents(a.weights), at: pos(a.mix) };
}
const SEA = sentence(SENTENCES.sea);
const FRUIT = sentence(SENTENCES.fruit);
const MEAL_AT = pos(attend(SENTENCES.meal).mix);

const arcH = (d: number) => 50 + d * 0.26;

const Sentence: FC<{ s: ReturnType<typeof sentence>; appear: (i: number) => number; draw: (i: number) => number; opacity: number }> = ({
  s,
  appear,
  draw,
  opacity,
}) => {
  const last = s.all.length - 1;
  const bx = s.centers[last];
  const bw = s.widths[last];
  return (
    <div style={{ opacity }}>
      <svg width={1080} height={ROW_Y} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {s.all.map((_, i) => {
          const p = draw(i);
          const sw = 3 + s.weights[i] * 32;
          const common = {
            pathLength: 1,
            strokeDasharray: 1,
            strokeDashoffset: 1 - p,
            fill: "none",
            stroke: "var(--ink)",
            strokeOpacity: 0.78,
            strokeWidth: sw,
            strokeLinecap: "round" as const,
            opacity: p > 0 ? 1 : 0,
          };
          if (i === last) {
            const x0 = bx + bw * 0.12;
            return <path key={i} d={`M ${x0} ${ROW_Y - 2} C ${x0 - 30} ${ROW_Y - 110}, ${x0 + 90} ${ROW_Y - 110}, ${x0 + 40} ${ROW_Y - 2}`} {...common} />;
          }
          // fan the start points out across the top of the focus word so thick strokes don't pile up
          const sx = bx - bw * 0.36 + (i / Math.max(1, last - 1)) * bw * 0.4;
          const x = s.centers[i];
          return <path key={i} d={`M ${sx} ${ROW_Y - 2} Q ${(sx + x) / 2} ${ROW_Y - 2 - arcH(sx - x)} ${x} ${ROW_Y - 2}`} {...common} />;
        })}
      </svg>
      {s.all.map((w, i) => (
        <Chip
          key={w}
          text={w}
          color={i === last ? "yellow" : null}
          fs={FS}
          x={s.xs[i]}
          y={ROW_Y}
          style={{
            opacity: appear(i),
            translate: `0px ${mix(20, 0, appear(i))}px`,
            ...(i === last
              ? { outline: "5px solid var(--pen)", outlineOffset: 4 }
              : { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" }),
          }}
        />
      ))}
      {s.all.map((_, i) => (
        <div
          key={`p${i}`}
          style={{
            position: "absolute",
            left: s.centers[i] - 70,
            width: 140,
            top: ROW_Y + CH + 12,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 36,
            fontWeight: 500,
            color: i === last ? "var(--ink-2)" : "var(--ink)",
            opacity: draw(i),
          }}
        >
          {s.pct[i]}%
        </div>
      ))}
    </div>
  );
};

const Dot: FC<{ x: number; y: number; r?: number; hollow?: boolean; opacity?: number }> = ({ x, y, r = 22, hollow, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: hollow ? "var(--paper)" : "var(--ink)",
      border: hollow ? "4px dashed var(--ink-3)" : "6px solid var(--hl-yellow)",
      boxSizing: "border-box",
      opacity,
    }}
  />
);

export const Ch45Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const spokes = 1 - beat(frame, S.s2, 0, 0.5);
  const tri = beat(frame, S.s2, 0, 1.0);
  const bigChip = 1 - beat(frame, S.s2, 1.0, 0.8);
  const dotIn = beat(frame, S.s2, 1.4, 0.5);
  const seaOut = 1 - beat(frame, S.s6, 0, 0.6);
  const fruitOut = 1 - beat(frame, S.s7, 0, 0.6);
  const dim = mix(1, 0.05, beat(frame, S.s8, 0, 0.5));

  const toSea = beat(frame, S.s5, 0.5, 2.0, EASE_IO);
  const toFruit = beat(frame, S.s6, 3.8, 1.8, EASE_IO);
  const dx = mix(mix(CENTER[0], SEA.at[0], toSea), FRUIT.at[0], toFruit);
  const dy = mix(mix(CENTER[1], SEA.at[1], toSea), FRUIT.at[1], toFruit);

  const triPath = `M ${V[0][0]} ${V[0][1]} L ${V[1][0]} ${V[1][1]} L ${V[2][0]} ${V[2][1]} Z`;
  const smallFs = 30;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      <div style={{ opacity: dim }}>
        {/* meaning triangle */}
        <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={triPath} fill="var(--paper-2)" opacity={tri * 0.9} />
          <path
            d={triPath}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - tri}
            fill="none"
            stroke="var(--ink-3)"
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {V.map((v, i) => (
            <line
              key={i}
              x1={CENTER[0]}
              y1={CENTER[1]}
              x2={mix(CENTER[0], v[0], beat(frame, S.s1, 0.9 + i * 0.6, 0.6))}
              y2={mix(CENTER[1], v[1], beat(frame, S.s1, 0.9 + i * 0.6, 0.6))}
              stroke="var(--ink-3)"
              strokeWidth={4}
              strokeDasharray="10 12"
              opacity={spokes}
            />
          ))}
          {/* trail of the moving dot */}
          {toSea > 0 && (
            <path
              d={`M ${CENTER[0]} ${CENTER[1]} L ${mix(CENTER[0], SEA.at[0], toSea)} ${mix(CENTER[1], SEA.at[1], toSea)}${
                toFruit > 0 ? ` L ${dx} ${dy}` : ""
              }`}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={5}
              strokeDasharray="4 14"
              strokeLinecap="round"
            />
          )}
        </svg>

        {MEANING_ICONS.map((Icon, i) => {
          const a = beat(frame, S.s1, 0.9 + i * 0.6, 0.5);
          return (
            <div key={i} style={{ opacity: a, scale: String(mix(0.6, 1, a)) }}>
              <Icon size={ICON} x={ICON_AT[i][0] - ICON / 2} y={ICON_AT[i][1] - ICON / 2} />
              <div style={{ position: "absolute", left: ICON_LABEL[i][0], top: ICON_LABEL[i][1], fontSize: 40, fontWeight: 700 }}>{NAMES[i]}</div>
            </div>
          );
        })}

        {/* the focus word alone */}
        <Chip
          text={L.bae}
          color="yellow"
          fs={140}
          x={CENTER[0] - chipWidth(L.bae, 140) / 2}
          y={CENTER[1] - 105}
          style={{ opacity: beat(frame, S.s1, 0.2, 0.6) * bigChip, scale: String(mix(0.2, 1, bigChip)) }}
        />
        {frame >= S.s2.from && <Dot x={dx} y={dy} opacity={dotIn} />}
        <div
          style={{
            position: "absolute",
            left: CENTER[0] + 34,
            top: CENTER[1] - 22,
            fontSize: 34,
            fontWeight: 500,
            opacity: beat(frame, S.s2, 1.8, 0.4) * (1 - beat(frame, S.s5, 0.3, 0.3)),
          }}
        >
          {L.alone}
        </div>
        <Hand x={380} y={CENTER[1] + 50} fs={40} style={{ opacity: beat(frame, S.s2, 2.6, 0.4) * (1 - beat(frame, S.s3, 0, 0.4)) }}>
          {L.vague}
        </Hand>
        <div style={{ position: "absolute", left: 96, top: 140, fontSize: 40, color: "var(--ink-2)", opacity: beat(frame, S.s2, 3.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.4)) }}>
          {L.vec}
        </div>

        {/* ghosts left behind when the dot moves on */}
        {toSea > 0 && <Dot x={CENTER[0]} y={CENTER[1]} r={16} hollow opacity={0.9} />}
        {toFruit > 0 && <Dot x={SEA.at[0]} y={SEA.at[1]} r={16} hollow opacity={0.9} />}

        {/* sentence 1 */}
        {frame >= S.s3.from && frame < S.s6.from + 20 && (
          <Sentence
            s={SEA}
            appear={(i) => beat(frame, S.s3, 0.3 + i * 0.25, 0.45)}
            draw={(i) => beat(frame, S.s4, 0.5 + i * 0.45, 0.7)}
            opacity={seaOut}
          />
        )}
        <Hand x={230} y={820} fs={46} style={{ opacity: beat(frame, S.s5, 2.8, 0.5) * (1 - beat(frame, S.s6, 0, 0.5)), rotate: "-4deg" }}>
          {L.toBoat}
        </Hand>
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 560,
            width: 380,
            fontSize: smallFs,
            lineHeight: 1.35,
            color: "var(--ink-3)",
            opacity: beat(frame, S.s5, 4.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5)),
          }}
        >
          {L.foot}
        </div>

        {/* sentence 2 */}
        {frame >= S.s6.from && frame < S.s7.from + 20 && (
          <Sentence
            s={FRUIT}
            appear={(i) => beat(frame, S.s6, 0.7 + i * 0.2, 0.45)}
            draw={(i) => beat(frame, S.s6, 1.8 + i * 0.35, 0.6)}
            opacity={fruitOut}
          />
        )}
        <Hand x={620} y={540} fs={46} style={{ opacity: beat(frame, S.s6, 5.8, 0.5) * (1 - beat(frame, S.s7, 0, 0.5)), rotate: "-3deg" }}>
          {L.toFruit}
        </Hand>

        {/* s7: summary + a third context */}
        {frame >= S.s7.from && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 170,
                textAlign: "center",
                fontSize: 44,
                fontWeight: 700,
                opacity: beat(frame, S.s7, 0.6, 0.5),
              }}
            >
              {L.line}
            </div>
            <Hand x={0} y={250} fs={38} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.0, 0.5) }}>
              {L.sum}
            </Hand>
            <Dot x={MEAL_AT[0]} y={MEAL_AT[1]} r={16} hollow opacity={beat(frame, S.s7, 1.4, 0.6)} />
            {[
              { at: SEA.at, text: L.seaLine, dx: 28, dy: 18, align: "left" as const },
              { at: FRUIT.at, text: L.fruitLine, dx: 30, dy: -18, align: "left" as const },
              { at: MEAL_AT, text: L.meal, dx: -28, dy: -62, align: "right" as const },
            ].map((g, i) => (
              <div
                key={g.text}
                style={{
                  position: "absolute",
                  top: g.at[1] + g.dy,
                  ...(g.align === "right" ? { right: 1080 - (g.at[0] + g.dx) } : { left: g.at[0] + g.dx }),
                  fontSize: smallFs,
                  color: "var(--ink-2)",
                  background: "var(--paper)",
                  padding: "0 6px",
                  borderRadius: 6,
                  opacity: beat(frame, S.s7, 1.0 + i * 0.4, 0.5),
                }}
              >
                {g.text}
              </div>
            ))}
          </>
        )}
      </div>

      {/* s8: teaser for 46장 */}
      {frame >= S.s8.from && (
        <div style={{ position: "absolute", inset: 0, opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.ask}</div>
          {[
            { t: L.q, d: L.qd, c: "yellow" as const },
            { t: L.k, d: L.kd, c: "mint" as const },
            { t: L.v, d: L.vd, c: "sky" as const },
          ].map((q, i) => {
            const a = beat(frame, S.s8, 1.2 + i * 0.4, 0.5);
            const x = 540 + (i - 1) * 290;
            return (
              <div key={q.t} style={{ opacity: a, scale: String(mix(0.7, 1, a)) }}>
                <Chip text={q.t} color={q.c} fs={64} x={x - chipWidth(q.t, 64) / 2} y={560} />
                <div style={{ position: "absolute", left: x - 100, width: 200, top: 680, textAlign: "center", fontSize: 38, color: "var(--ink-2)" }}>{q.d}</div>
              </div>
            );
          })}
          <Hand x={0} y={820} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 2.8, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch45.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
