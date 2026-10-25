import type { FC } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ADAPT_2D, MOMENTUM_PATH, PLAIN_2D, PLAIN_PATH, START_X, VA, VB, X_MAX, bumpy, ch67, slope } from "../data/ch67";
import { Caption, Chip, FPS, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, type SceneProps } from "./kit";
import { Arrow, Box, Center, Layer, T } from "./part7-kit";

const tl = buildTimeline(ch67);
const S = byId(tl);
const L = ch67.labels;

// 1D landscape
const XP = (x: number) => 100 + x * 88;
const YP = (f: number) => 930 - f * 95;
const CURVE = Array.from({ length: 201 }, (_, i) => (i / 200) * X_MAX)
  .map((x, i) => `${i === 0 ? "M" : "L"} ${XP(x).toFixed(1)} ${YP(bumpy(x)).toFixed(1)}`)
  .join(" ");
const BR = 26;
function ballAt(x: number): [number, number] {
  const k = (-95 / 88) * slope(x); // pixel slope dy/dx (y grows downwards)
  const n = Math.hypot(k, 1);
  return [XP(x) + (k / n) * BR, YP(bumpy(x)) - (1 / n) * BR];
}
/** Position along a precomputed path at fractional step t. */
const along = (xs: number[], t: number) => {
  const i = Math.min(xs.length - 1, Math.floor(t));
  const j = Math.min(xs.length - 1, i + 1);
  return xs[i] + (xs[j] - xs[i]) * (t - i);
};
const Ball: FC<{ x: number; color: string; o?: number }> = ({ x, color, o = 1 }) => {
  const [cx, cy] = ballAt(x);
  return <div style={{ position: "absolute", left: cx - BR, top: cy - BR, width: BR * 2, height: BR * 2, borderRadius: "50%", background: color, border: "4px solid var(--ink)", boxSizing: "border-box", opacity: o }} />;
};

// 2D valley
const MX = 780;
const MY = 630;
const UX = 140;
const UY = 200;
const P2 = ([x, y]: [number, number]): [number, number] => [MX + x * UX, MY - y * UY];
const LEVELS = [0.3, 1, 2.5, 5, 9, 15.5];
const PANEL = { x: 70, y: 300, w: 940, h: 660 };

const Path2D: FC<{ pts: [number, number][]; n: number; color: string; o?: number }> = ({ pts, n, color, o = 1 }) => {
  const shown = pts.slice(0, Math.max(1, Math.floor(n) + 1)).map(P2);
  return (
    <g opacity={o}>
      <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
      {shown.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={9} fill={color} stroke="var(--ink)" strokeWidth={2.5} />
      ))}
    </g>
  );
};

const LOOP = [L.loop1, L.loop2, L.loop3, L.update];

export const Ch67Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const landOn = beat(frame, S.s1, 0, 0.4) * (1 - beat(frame, S.s4, 0, 0.4));
  const valleyOn = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const adamOn = beat(frame, S.s6, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.4));

  // fractional step along each path (linear in time, like a real roll)
  const tPlain = interpolate(frame, [S.s2.from + 0.6 * FPS, S.s2.from + 3.6 * FPS], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tMom = interpolate(frame, [S.s3.from + 0.8 * FPS, S.s3.from + 5.8 * FPS], [0, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const plainX = along(PLAIN_PATH, tPlain);
  const momX = along(MOMENTUM_PATH, tMom);
  const momOn = frame >= S.s3.from ? beat(frame, S.s3, 0.2, 0.4) : 0;

  const n4 = interpolate(frame, [S.s4.from + 1.2 * FPS, S.s4.from + 5.2 * FPS], [0, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n5 = interpolate(frame, [S.s5.from + 0.8 * FPS, S.s5.from + 4.8 * FPS], [0, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [sx, sy] = ballAt(PLAIN_PATH[PLAIN_PATH.length - 1]);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s3: a bumpy landscape */}
      {frame < S.s4.from + 15 && (
        <div style={{ opacity: landOn }}>
          <Layer>
            <line x1={XP(0) - 20} y1={YP(-0.25)} x2={XP(X_MAX) + 20} y2={YP(-0.25)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={XP(0) - 20} y1={YP(-0.25)} x2={XP(0) - 20} y2={YP(6.3)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <path d={CURVE} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beat(frame, S.s1, 0.4, 1.6)} fill="none" stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" />
          </Layer>
          <T x={XP(X_MAX) - 260} y={YP(-0.25) + 14} w={280} fs={34} bold align="right">
            {L.axisX}
          </T>
          <T x={XP(0) - 40} y={YP(6.3) - 50} fs={34} bold>
            {L.axisY}
          </T>
          <Chip text={L.example} color={null} fs={30} x={1024 - chipWidth(L.example, 30)} y={130} />
          {/* legend */}
          <div style={{ position: "absolute", left: 64, top: 130, display: "flex", gap: 28, alignItems: "center", fontSize: 36, fontWeight: 700 }}>
            <span style={{ display: "flex", gap: 10, alignItems: "center", opacity: beat(frame, S.s1, 2.0, 0.4) }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--hl-sky)", border: "3px solid var(--ink)" }} />
              {L.plain}
            </span>
            <span style={{ display: "flex", gap: 10, alignItems: "center", opacity: momOn }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--hl-pink)", border: "3px solid var(--ink)" }} />
              {L.inertia}
            </span>
          </div>
          <Center y={230} fs={42} bold={false} color="var(--ink-2)" o={beat(frame, S.s1, 2.4, 0.4) * (1 - beat(frame, S.s2, 0, 0.4))}>
            {L.review}
          </Center>
          <Hand x={XP(START_X) + 44} y={YP(bumpy(START_X)) - 50} fs={46} style={{ opacity: beat(frame, S.s1, 2.2, 0.4) * (1 - beat(frame, S.s2, 0.4, 0.3)) }}>
            {L.start}
          </Hand>

          <Ball x={plainX} color="var(--hl-sky)" o={beat(frame, S.s1, 1.8, 0.4) * (frame >= S.s3.from ? 0.55 : 1)} />

          {/* s2: stuck */}
          {frame >= S.s2.from && (
            <div style={{ opacity: 1 - beat(frame, S.s3, 0, 0.4) * 0.6 }}>
              <PenCircle x={sx - 50} y={sy - 50} w={100} h={100} p={beat(frame, S.s2, 4.0, 0.6)} />
              <Hand x={92} y={885} fs={44} style={{ opacity: beat(frame, S.s2, 4.4, 0.4) }}>
                {L.stuck}
              </Hand>
              <Hand x={150} y={815} fs={38} color="var(--ink-2)" style={{ opacity: beat(frame, S.s2, 5.6, 0.4) * (1 - beat(frame, S.s3, 0, 0.4)) }}>
                {L.flat}
              </Hand>
              <Layer o={beat(frame, S.s2, 6.6, 0.4)}>
                <Arrow x1={XP(7)} y1={770} x2={XP(7)} y2={860} dashed width={5} color="var(--ink-2)" />
              </Layer>
              <Hand x={XP(7) - 150} y={706} fs={46} color="var(--ink-2)" style={{ width: 300, textAlign: "center", opacity: beat(frame, S.s2, 6.6, 0.4) }}>
                {L.deeper}
              </Hand>
            </div>
          )}

          {/* s3: momentum */}
          {frame >= S.s3.from && (
            <>
              <Ball x={momX} color="var(--hl-pink)" o={momOn} />
              <Center y={230} fs={46} o={beat(frame, S.s3, 0.6, 0.4)}>
                {L.memory}
              </Center>
              <Hand x={330} y={640} fs={50} style={{ opacity: beat(frame, S.s3, 3.0, 0.4), rotate: "-3deg" }}>
                {L.over}
              </Hand>
            </>
          )}
        </div>
      )}

      {/* s4–s5: a long narrow valley seen from above */}
      {frame >= S.s4.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: valleyOn }}>
          <div style={{ position: "absolute", left: 64, top: 200, display: "flex", gap: 28, alignItems: "center", fontSize: 36, fontWeight: 700 }}>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--hl-sky)", border: "3px solid var(--ink)" }} />
              {L.plain}
            </span>
            <span style={{ display: "flex", gap: 10, alignItems: "center", opacity: beat(frame, S.s5, 0.3, 0.4) }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--hl-pink)", border: "3px solid var(--ink)" }} />
              {L.adaptive}
            </span>
          </div>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <clipPath id="ch67-panel">
                <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={24} />
              </clipPath>
            </defs>
            <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={24} fill="var(--paper)" stroke="var(--line)" strokeWidth={3} />
            <g clipPath="url(#ch67-panel)">
              {LEVELS.map((c, i) => (
                <ellipse key={c} cx={MX} cy={MY} rx={Math.sqrt((2 * c) / VA) * UX} ry={Math.sqrt((2 * c) / VB) * UY} fill="none" stroke={i === 0 ? "var(--ink-3)" : "var(--grid-major)"} strokeWidth={4} />
              ))}
              <circle cx={MX} cy={MY} r={12} fill="var(--ink)" />
              <Path2D pts={PLAIN_2D} n={n4} color="var(--hl-sky)" o={frame >= S.s5.from ? 1 - beat(frame, S.s5, 0, 0.5) * 0.55 : 1} />
              {frame >= S.s5.from && <Path2D pts={ADAPT_2D} n={n5} color="var(--hl-pink)" />}
            </g>
          </svg>
          <Hand x={MX + 30} y={MY - 84} fs={38} color="var(--ink-2)">
            {L.goal}
          </Hand>
          <T x={PANEL.x + 24} y={PANEL.y + PANEL.h - 56} fs={32} bold color="var(--ink-2)">
            {L.knobAAxis}
          </T>
          <T x={PANEL.x + 24} y={PANEL.y + 16} fs={32} bold color="var(--ink-2)">
            {L.knobBAxis}
          </T>
          <Hand x={90} y={560} fs={46} style={{ opacity: beat(frame, S.s4, 3.0, 0.4) * (1 - beat(frame, S.s5, 0, 0.4)), rotate: "-4deg" }}>
            {L.zigzag}
          </Hand>
          <Hand x={P2(PLAIN_2D[30])[0] - 120} y={MY + 90} fs={46} style={{ opacity: beat(frame, S.s4, 5.6, 0.4) * (1 - beat(frame, S.s5, 0, 0.4)) }}>
            {L.slow}
          </Hand>
          <Hand x={0} y={985} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 5.4, 0.4) }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s6: Adam = both */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: adamOn }}>
          <Center y={190} fs={54} o={beat(frame, S.s6, 0.4, 0.4)}>
            {L.adamEq}
          </Center>
          <Box x={110} y={320} w={400} h={380} r={26} bw={4} fill="var(--paper-2)" o={beat(frame, S.s6, 1.2, 0.4)}>
            <span />
          </Box>
          <Box x={570} y={320} w={400} h={380} r={26} bw={4} fill="var(--paper-2)" o={beat(frame, S.s6, 2.2, 0.4)}>
            <span />
          </Box>
          <div style={{ opacity: beat(frame, S.s6, 1.4, 0.4) }}>
            <Layer>
              {[0, 1, 2].map((i) => (
                <line key={i} x1={170 + i * 14} y1={450 + i * 40} x2={260 + i * 14} y2={450 + i * 40} stroke="var(--ink-3)" strokeWidth={7} strokeLinecap="round" />
              ))}
            </Layer>
            <div style={{ position: "absolute", left: 300, top: 420, width: 120, height: 120, borderRadius: "50%", background: "var(--hl-pink)", border: "5px solid var(--ink)", boxSizing: "border-box" }} />
            <T x={110} y={600} w={400} fs={48} bold align="center">
              {L.inertia}
            </T>
          </div>
          <div style={{ opacity: beat(frame, S.s6, 2.4, 0.4) }}>
            <T x={610} y={380} fs={34} color="var(--ink-2)">
              {L.knobB}
            </T>
            <div style={{ position: "absolute", left: 610, top: 430, width: 90, height: 34, borderRadius: 10, background: "var(--hl-sky)" }} />
            <T x={712} y={426} fs={34} bold>
              {L.smaller}
            </T>
            <T x={610} y={480} fs={34} color="var(--ink-2)">
              {L.knobA}
            </T>
            <div style={{ position: "absolute", left: 610, top: 530, width: 260, height: 34, borderRadius: 10, background: "var(--hl-mint)" }} />
            <T x={882} y={526} fs={34} bold>
              {L.bigger}
            </T>
            <T x={570} y={600} w={400} fs={48} bold align="center">
              {L.adaptive}
            </T>
          </div>
          <Chip text={L.year} color="yellow" fs={42} x={540 - chipWidth(L.year, 42) / 2} y={760} style={{ opacity: beat(frame, S.s6, 4.4, 0.4) }} />
          <Hand x={0} y={870} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 6.0, 0.4) }}>
            {L.gptUses}
          </Hand>
        </div>
      )}

      {/* s7: back to the loop */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          {LOOP.map((n, i) => {
            const on = i === 3;
            return (
              <Box key={n} x={60 + i * 250} y={400} w={210} h={100} r={16} bw={on ? 5 : 3} border={on ? "var(--ink)" : "var(--line)"} fill={on ? "var(--hl-mint)" : "var(--paper-2)"}>
                <span style={{ fontSize: 34, fontWeight: 700, color: on ? "var(--chip-ink)" : "var(--ink-2)" }}>{n}</span>
              </Box>
            );
          })}
          <Layer>
            {[0, 1, 2].map((i) => (
              <Arrow key={i} x1={60 + i * 250 + 216} y1={450} x2={60 + (i + 1) * 250 - 6} y2={450} width={4} head={14} color="var(--ink-3)" />
            ))}
          </Layer>
          <Chip text={L.adam} color="pink" fs={52} x={60 + 3 * 250 + 105 - chipWidth(L.adam, 52) / 2} y={545} style={{ opacity: beat(frame, S.s7, 1.0, 0.4) }} />
          <PenCircle x={60 + 3 * 250 + 105 - chipWidth(L.adam, 52) / 2 - 24} y={527} w={chipWidth(L.adam, 52) + 48} h={114} p={beat(frame, S.s7, 1.6, 0.6)} />
          <Hand x={0} y={720} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.4, 0.5) }}>
            {L.smarter}
          </Hand>
          <Center y={850} fs={38} bold={false} color="var(--ink-2)" o={beat(frame, S.s7, 1.2, 0.4)}>
            {L.simple}
          </Center>
        </div>
      )}

      <Narration tl={tl} chapter={ch67.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
