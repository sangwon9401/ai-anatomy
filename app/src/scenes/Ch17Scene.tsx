import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { TRY_LINES, ch17 } from "../data/ch17";
import { SPICE_PTS, V_SPLIT, gelu } from "../data/part2-toy";
import { Caption, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { at, type Plane } from "./plane";
import { Axes2, ClassMark, FullSvg, polyPath, sample } from "./part2-kit";

const tl = buildTimeline(ch17);
const S = byId(tl);
const L = ch17.labels;

// the (맵기, 줄) plane
const PL: Plane = { ox: 190, oy: 930, unit: 145 };
const XMAX = 5.6;
const YMAX = 4.6;
const PTS = SPICE_PTS.map(([m, l]) => ({ m, l, good: V_SPLIT(m, l) }));
const lineShade = (k: number, q: number) => polyPath(PL, [[0, q], [XMAX, q + XMAX * k], [XMAX, YMAX], [0, YMAX]], true);
const lineStroke = (k: number, q: number) => polyPath(PL, [[0, q], [XMAX, q + XMAX * k]]);
const vAt = (m: number) => Math.abs(m - 3) + 1.5;
const V_LINE = polyPath(PL, [[0, vAt(0)], [3, vAt(3)], [XMAX, vAt(XMAX)]]);
const V_SHADE = polyPath(PL, [[0, vAt(0)], [3, vAt(3)], [XMAX, vAt(XMAX)], [XMAX, YMAX], [0, YMAX]], true);

// s3: three straight lines
const P3: Plane = { ox: 260, oy: 860, unit: 58 };
const LINES3 = [
  { f: (x: number) => 2 * x + 1, x0: -1.25, x1: 3.6, color: "var(--hl-orange)", w: 9 },
  { f: (x: number) => -x + 3, x0: -1.5, x1: 4.5, color: "var(--hl-sky)", w: 9 },
  { f: (x: number) => x + 4, x0: -1.5, x1: 4.5, color: "var(--ink)", w: 7 },
];

// s4, s6: activation function plots
const FP: Plane = { ox: 540, oy: 690, unit: 112 };
const RELU_PATH = polyPath(FP, [[-3.5, 0], [0, 0], [3.5, 3.5]]);
const GELU_PATH = polyPath(FP, sample(gelu, -3.5, 3.5, 140));
const DIP = at(FP, [-0.75, gelu(-0.75)]);
// zoom box: x −3.2…0.7, y −0.22…0.08, stretched
const ZB = { x: 520, y: 796, w: 490, h: 274 };
const ZX = (x: number) => ZB.x + 20 + ((x + 3.2) / 3.9) * (ZB.w - 40);
const ZY = (y: number) => ZB.y + 60 + ((0.1 - y) / 0.32) * (ZB.h - 130);
const ZOOM = sample(gelu, -3.2, 0.7, 160)
  .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${ZX(x).toFixed(1)} ${ZY(y).toFixed(1)}`)
  .join(" ");

const Machine: FC<{ x: number; y: number; a: string; b: string; o: number }> = ({ x, y, a, b, o }) => {
  const fs = 44;
  const aw = chipWidth(a, fs) + 10;
  const box = 170;
  return (
    <div style={{ position: "absolute", left: x, top: y, height: 80, display: "flex", alignItems: "center", gap: 14, opacity: o }}>
      <span style={{ width: aw, height: fs * 1.5, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: fs, fontWeight: 700, borderRadius: 12, background: "var(--hl-yellow)", color: "var(--chip-ink)" }}>{a}</span>
      <span style={{ fontSize: 40 }}>→</span>
      <span style={{ width: box, height: 76, display: "grid", placeItems: "center", fontSize: 38, fontWeight: 700, borderRadius: 16, border: "4px solid var(--ink)", background: "var(--hl-violet)", color: "var(--chip-ink)" }}>{L.relu}</span>
      <span style={{ fontSize: 40 }}>→</span>
      <span style={{ width: chipWidth(b, fs) + 10, height: fs * 1.5, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: fs, fontWeight: 700, borderRadius: 12, background: "var(--hl-mint)", color: "var(--chip-ink)" }}>{b}</span>
    </div>
  );
};

export const Ch17Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  // s2: the tried line moves 16장 → second → third
  const m1 = beat(frame, S.s2, 2.2, 1.2, EASE_IO);
  const m2 = beat(frame, S.s2, 4.0, 1.2, EASE_IO);
  const k = mix(mix(TRY_LINES[0].k, TRY_LINES[1].k, m1), TRY_LINES[2].k, m2);
  const q = mix(mix(TRY_LINES[0].q, TRY_LINES[1].q, m1), TRY_LINES[2].q, m2);
  const lineIn = beat(frame, S.s2, 0.4, 0.8);
  const wrongNow = PTS.filter((p) => (p.l >= k * p.m + q) !== p.good);
  const settled = beat(frame, S.s2, 5.6, 0.5);

  const inS5 = frame >= S.s5.from;
  const planeO = inS5 ? beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5)) : 1 - beat(frame, S.s3, 0, 0.5);
  const vDraw = beat(frame, S.s5, 0.8, 1.2, EASE_IO);
  const s3On = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const s4On = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const s6On = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));

  const plane = (
    <div style={{ opacity: planeO }}>
      <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700 }}>{inS5 ? L.vSplit : L.title}</div>
      <Hand x={inS5 ? 610 : 540} y={130} fs={38} color="var(--ink-3)">
        {inS5 ? L.how : L.example}
      </Hand>
      <Axes2 pl={PL} x={[0, XMAX]} y={[0, YMAX]} p={inS5 ? 1 : beat(frame, S.s1, 0.1, 0.6)} xTicks={[1, 2, 3, 4, 5]} yTicks={[1, 2, 3, 4]} labelX={L.spicy} labelY={L.line} />
      <FullSvg>
        {!inS5 && frame >= S.s2.from && (
          <g opacity={lineIn}>
            <path d={lineShade(k, q)} fill="var(--hl-mint)" opacity={0.28} />
            <path d={lineStroke(k, q)} fill="none" stroke="var(--pen)" strokeWidth={7} strokeLinecap="round" />
          </g>
        )}
        {inS5 && (
          <g>
            <path d={V_SHADE} fill="var(--hl-mint)" opacity={0.28 * beat(frame, S.s5, 1.8, 0.6)} />
            <path d={V_LINE} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - vDraw} fill="none" stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {PTS.map((p, i) => {
          const [x, y] = at(PL, [p.m, p.l]);
          return <ClassMark key={i} x={x} y={y} good={p.good} o={inS5 ? 1 : beat(frame, S.s1, 0.9 + i * 0.12, 0.35)} />;
        })}
      </FullSvg>
      {/* legend */}
      <div style={{ position: "absolute", left: 700, top: 196, display: "flex", gap: 30, alignItems: "center", fontSize: 36, fontWeight: 500, opacity: inS5 ? 1 : beat(frame, S.s1, 2.8, 0.4) }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width={44} height={44}>
            <ClassMark x={22} y={22} good r={17} />
          </svg>
          {L.good}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width={44} height={44}>
            <ClassMark x={22} y={22} good={false} r={17} />
          </svg>
          {L.bad}
        </span>
      </div>
      {/* s2: wrong count and marks */}
      {!inS5 && frame >= S.s2.from && (
        <>
          <Hand x={760} y={at(PL, [XMAX, TRY_LINES[0].q + XMAX * TRY_LINES[0].k])[1] - 76} fs={38} style={{ opacity: lineIn * (1 - m1) }}>
            {L.neuron16}
          </Hand>
          <div style={{ position: "absolute", left: 700, top: 262, fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s2, 1.2, 0.4) }}>
            {L.wrong}: <span style={{ fontFamily: "var(--font-mono)", color: "var(--pen)" }}>{wrongNow.length}</span>
          </div>
          {PTS.filter((p) => (p.l >= TRY_LINES[2].k * p.m + TRY_LINES[2].q) !== p.good).map((p, i) => {
            const [x, y] = at(PL, [p.m, p.l]);
            return <PenCircle key={i} x={x - 44} y={y - 40} w={88} h={80} p={settled} />;
          })}
          <Hand x={150} y={1004} fs={46} style={{ opacity: beat(frame, S.s2, 6.2, 0.4) }}>
            {L.atLeast}
          </Hand>
        </>
      )}
    </div>
  );

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {(frame < S.s3.from + 15 || (frame >= S.s5.from && frame < S.s6.from + 15)) && plane}

      {/* s3: adding straight lines gives a straight line */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.s3title}</div>
          <FullSvg>
            <line x1={at(P3, [-1.6, 0])[0]} y1={P3.oy} x2={at(P3, [4.7, 0])[0]} y2={P3.oy} stroke="var(--ink-3)" strokeWidth={4} />
            <line x1={P3.ox} y1={at(P3, [0, -1.6])[1]} x2={P3.ox} y2={at(P3, [0, 8.8])[1]} stroke="var(--ink-3)" strokeWidth={4} />
            {LINES3.map((ln, i) => (
              <path
                key={i}
                d={polyPath(P3, [[ln.x0, ln.f(ln.x0)], [ln.x1, ln.f(ln.x1)]])}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - beat(frame, S.s3, 0.8 + i * 1.4, 0.8)}
                fill="none"
                stroke={ln.color}
                strokeWidth={ln.w}
                strokeLinecap="round"
              />
            ))}
          </FullSvg>
          {[
            { t: L.l1, c: "var(--hl-orange)", pre: "", y: 420 },
            { t: `(${L.l2})`, c: "var(--hl-sky)", pre: "+", y: 540 },
            { t: L.l3, c: null, pre: "=", y: 660 },
          ].map((r, i) => (
            <div key={i} style={{ position: "absolute", left: 610, top: r.y, display: "flex", alignItems: "center", gap: 16, fontFamily: "var(--font-mono)", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s3, 0.8 + i * 1.4, 0.4) }}>
              <span style={{ width: 40, textAlign: "center" }}>{r.pre}</span>
              <span style={{ padding: "2px 14px", borderRadius: 10, background: r.c ?? "transparent", color: r.c ? "var(--chip-ink)" : "var(--ink)", border: r.c ? "none" : "4px solid var(--ink)" }}>{r.t}</span>
            </div>
          ))}
          <Hand x={600} y={800} fs={52} style={{ opacity: beat(frame, S.s3, 5.2, 0.4), rotate: "-2deg" }}>
            {L.straight}
          </Hand>
        </div>
      )}

      {/* s4: ReLU */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 56, fontWeight: 700 }}>{L.reluTitle}</div>
          <Hand x={0} y={208} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 1.4, 0.4) }}>
            {L.reluRule}
          </Hand>
          <Axes2 pl={FP} x={[-3.6, 3.7]} y={[-0.8, 3.6]} p={beat(frame, S.s4, 0.4, 0.5)} xTicks={[-3, -2, -1, 1, 2, 3]} yTicks={[1, 2, 3]} />
          <FullSvg>
            <path d={RELU_PATH} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s4, 1.0, 1.2, EASE_IO)} fill="none" stroke="var(--pen)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            {[
              { v: [-2, 0] as [number, number], t: 3.0 },
              { v: [3, 3] as [number, number], t: 4.0 },
            ].map((d, i) => {
              const [x, y] = at(FP, d.v);
              return <circle key={i} cx={x} cy={y} r={16} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} opacity={beat(frame, S.s4, d.t, 0.3)} />;
            })}
          </FullSvg>
          <Machine x={300} y={850} a={L.in1} b={L.out1} o={beat(frame, S.s4, 3.0, 0.4)} />
          <Machine x={300} y={960} a={L.in2} b={L.out2} o={beat(frame, S.s4, 4.0, 0.4)} />
        </div>
      )}

      {/* s6: GELU */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 56, fontWeight: 700 }}>{L.geluTitle}</div>
          <Hand x={0} y={208} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 1.0, 0.4) }}>
            {L.geluNote}
          </Hand>
          <Axes2 pl={FP} x={[-3.6, 3.7]} y={[-0.8, 3.6]} p={1} xTicks={[-3, -2, -1, 1, 2, 3]} yTicks={[1, 2, 3]} />
          <FullSvg>
            <path d={RELU_PATH} fill="none" stroke="var(--ink-3)" strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" />
            <path d={GELU_PATH} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s6, 0.6, 1.4, EASE_IO)} fill="none" stroke="var(--pen)" strokeWidth={9} strokeLinecap="round" />
          </FullSvg>
          <div style={{ position: "absolute", left: 130, top: 330, display: "grid", gap: 8, fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s6, 2.0, 0.4) }}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 50, height: 8, borderRadius: 4, background: "var(--pen)" }} /> GELU
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ink-2)" }}>
              <span style={{ width: 50, height: 0, borderTop: "6px dashed var(--ink-3)" }} /> {L.relu}
            </span>
          </div>
          <PenCircle x={DIP[0] - 110} y={DIP[1] - 46} w={190} h={92} p={beat(frame, S.s6, 3.2, 0.6)} />
          {/* zoomed view of the dip */}
          <div style={{ opacity: beat(frame, S.s6, 3.8, 0.5) }}>
            <FullSvg>
              <line x1={DIP[0]} y1={DIP[1] + 46} x2={ZX(-1.6)} y2={ZB.y} stroke="var(--pen)" strokeWidth={3} strokeDasharray="8 8" />
              <rect x={ZB.x} y={ZB.y} width={ZB.w} height={ZB.h} rx={18} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
              <line x1={ZX(-3.2)} y1={ZY(0)} x2={ZX(0.7)} y2={ZY(0)} stroke="var(--ink-3)" strokeWidth={6} strokeDasharray="14 12" />
              <clipPath id="ch17-zoom">
                <rect x={ZB.x} y={ZB.y} width={ZB.w} height={ZB.h} rx={18} />
              </clipPath>
              <path d={ZOOM} fill="none" stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" clipPath="url(#ch17-zoom)" />
              <circle cx={ZX(-0.75)} cy={ZY(gelu(-0.75))} r={12} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} />
            </FullSvg>
            <div style={{ position: "absolute", left: ZX(-0.75) - 90, width: 180, top: ZY(gelu(-0.75)) + 18, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 700 }}>−0.17</div>
            <div style={{ position: "absolute", left: ZX(0) - 84, width: 60, top: ZY(0) - 48, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>0</div>
            <Hand x={ZB.x + 20} y={ZB.y + 12} fs={36} color="var(--ink-2)">
              {L.zoom}
            </Hand>
          </div>
          <Hand x={110} y={1000} fs={44} style={{ opacity: beat(frame, S.s6, 4.4, 0.4) }}>
            {L.dip}
          </Hand>
        </div>
      )}

      {/* s7: summary */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontSize: 60, fontWeight: 700 }}>{L.sumA}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontSize: 44, opacity: beat(frame, S.s7, 1.0, 0.4) }}>{L.sumB}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontSize: 44, fontWeight: 700, opacity: beat(frame, S.s7, 2.4, 0.4) }}>
            <span style={{ background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 12, padding: "2px 18px" }}>{L.sumC}</span>
          </div>
          <Hand x={0} y={720} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 4.0, 0.5), rotate: "-2deg" }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch17.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};

