import type { FC } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CALC_RATE, MA, MB, MC, PICK, RACE_CELLS, ch68, calcTime, pickTerms, studentTime } from "../data/ch68";
import { Caption, Chip, EASE_IO, FPS, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "./kit";
import { Box, Center, Layer, T } from "./part7-kit";

const tl = buildTimeline(ch68);
const S = byId(tl);
const L = ch68.labels;

const CELL = 56;
const GAP = 6;
const MW = 4 * CELL + 3 * GAP;
const MY = 300;
const MXS = [90, 419, 748];
const cellXY = (m: number, i: number, j: number): [number, number] => [MXS[m] + j * (CELL + GAP), MY + i * (CELL + GAP)];

const T_CALC = calcTime(RACE_CELLS);
const T_STUD = studentTime(RACE_CELLS);
const TOKENS = L.sentence.split(" ");
const TOK_W = TOKENS.map((t) => chipWidth(t, 46));
const TOK_X = rowLayout(TOK_W, 16);

const Matrix: FC<{ m: number; vals: (number | null)[][]; fill?: (i: number, j: number) => string | null; o?: number }> = ({ m, vals, fill, o = 1 }) => (
  <div style={{ opacity: o }}>
    {vals.map((row, i) =>
      row.map((v, j) => {
        const [x, y] = cellXY(m, i, j);
        const f = fill?.(i, j) ?? null;
        return (
          <div
            key={`${i}-${j}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CELL,
              height: CELL,
              boxSizing: "border-box",
              borderRadius: 10,
              border: v === null ? "3px dashed var(--ink-3)" : "3px solid var(--line)",
              background: f ?? (v === null ? "transparent" : "var(--paper-2)"),
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 32,
              fontWeight: 500,
              color: f ? "var(--chip-ink)" : "var(--ink)",
            }}
          >
            {v ?? ""}
          </div>
        );
      }),
    )}
  </div>
);

/** Outline around a row of A or a column of B. */
const Band: FC<{ m: number; row?: number; col?: number; color: string; p: number }> = ({ m, row, col, color, p }) => {
  if (p <= 0) return null;
  const [x, y] = row !== undefined ? cellXY(m, row, 0) : cellXY(m, 0, col!);
  const w = row !== undefined ? MW : CELL;
  const h = row !== undefined ? CELL : MW;
  return <div style={{ position: "absolute", left: x - 8, top: y - 8, width: w + 16, height: h + 16, boxSizing: "border-box", borderRadius: 14, border: `6px solid ${color}`, opacity: p }} />;
};

const Student: FC<{ x: number; y: number; o: number; bob: number }> = ({ x, y, o, bob }) => (
  <g opacity={o} transform={`translate(${x} ${y - bob}) scale(1.4)`}>
    <circle cx={0} cy={-18} r={12} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={3} />
    <path d="M -16 14 C -16 -4, 16 -4, 16 14 Z" fill="var(--hl-sky)" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" />
  </g>
);

export const Ch68Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const bigOn = beat(frame, S.s1, 0, 0.4) * (1 - beat(frame, S.s2, 0, 0.4));
  const matOn = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const zoom = beat(frame, S.s1, 0.6, 3.0, EASE_IO);
  const cellPx = mix(100, 15, zoom);

  // what C shows in each step
  const pickFill = beat(frame, S.s2, 5.2, 0.4);
  const cpuFilled = Math.floor(interpolate(frame, [S.s3.from + 0.8 * FPS, S.s3.from + 7.2 * FPS], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const gpuGo = beat(frame, S.s5, 2.4, 0.5);
  let cVals: (number | null)[][] = MC.map((r) => r.map(() => null));
  let cFill: (i: number, j: number) => string | null = () => null;
  if (frame < S.s3.from) {
    cVals = MC.map((r, i) => r.map((v, j) => (i === PICK.i && j === PICK.j && pickFill > 0.5 ? v : null)));
    cFill = (i, j) => (i === PICK.i && j === PICK.j && pickFill > 0.5 ? "var(--hl-yellow)" : null);
  } else if (frame < S.s4.from) {
    cVals = MC.map((r, i) => r.map((v, j) => (i * 4 + j < cpuFilled ? v : null)));
    cFill = (i, j) => (i * 4 + j === cpuFilled - 1 ? "var(--hl-orange)" : null);
  } else if (frame < S.s5.from) {
    cFill = (i, j) => (i === 0 && j === 3 ? "var(--hl-mint)" : i === 3 && j === 1 ? "var(--hl-pink)" : null);
    cVals = MC.map((r, i) => r.map((v, j) => ((i === 0 && j === 3) || (i === 3 && j === 1) ? v : null)));
  } else {
    cVals = MC.map((r) => r.map((v) => (gpuGo > 0.5 ? v : null)));
    cFill = () => (gpuGo > 0.5 ? "var(--hl-yellow)" : null);
  }
  const s2Bands = beat(frame, S.s2, 2.6, 0.4) * (1 - beat(frame, S.s3, 0, 0.3));
  const s4Bands = beat(frame, S.s4, 0.8, 0.4) * (1 - beat(frame, S.s5, 0, 0.3));
  const cpuRow = Math.floor(Math.max(0, cpuFilled - 1) / 4);
  const cpuCol = Math.max(0, cpuFilled - 1) % 4;

  // s6 race clock: 0 → 1 s, then fast-forward to 500 s
  const t1 = interpolate(frame, [S.s6.from + 1.0 * FPS, S.s6.from + 2.6 * FPS], [0, T_STUD], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = interpolate(frame, [S.s6.from + 4.4 * FPS, S.s6.from + 7.4 * FPS], [T_STUD, T_CALC], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IO });
  const clock = frame < S.s6.from + 4.4 * FPS ? t1 : t2;
  const calcP = Math.min(1, (clock * CALC_RATE) / RACE_CELLS);
  const studP = Math.min(1, clock / T_STUD);
  const raceOn = beat(frame, S.s6, 0.2, 0.4) * (1 - beat(frame, S.s7, 0, 0.4));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: one of GPT-3's matrices */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: bigOn }}>
          <Center y={170} fs={46} o={beat(frame, S.s1, 0.3, 0.4)}>
            {L.gpt3Layer}
          </Center>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <pattern id="ch68-grid" width={cellPx} height={cellPx} patternUnits="userSpaceOnUse" x={240} y={260}>
                <rect width={cellPx} height={cellPx} fill="var(--hl-sky)" />
                <rect width={cellPx} height={cellPx} fill="none" stroke="var(--paper)" strokeWidth={Math.max(1, cellPx * 0.08)} />
              </pattern>
            </defs>
            <rect x={240} y={260} width={600} height={600} rx={10} fill="url(#ch68-grid)" stroke="var(--ink)" strokeWidth={5} opacity={beat(frame, S.s1, 0.4, 0.4)} />
          </svg>
          <Chip text={L.size} color="yellow" fs={50} x={540 - chipWidth(L.size, 50) / 2} y={890} style={{ opacity: beat(frame, S.s1, 3.6, 0.4) }} />
          <Hand x={0} y={985} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.2, 0.4) }}>
            {L.cells}
          </Hand>
        </div>
      )}

      {/* s2–s5: a 4 × 4 product */}
      {frame >= S.s2.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: matOn }}>
          <Matrix m={0} vals={MA} o={beat(frame, S.s2, 0.3, 0.4)} />
          <T x={MXS[0] + MW} y={MY + MW / 2 - 34} w={MXS[1] - MXS[0] - MW} fs={52} align="center" o={beat(frame, S.s2, 0.5, 0.4)}>
            {L.times}
          </T>
          <Matrix m={1} vals={MB} o={beat(frame, S.s2, 0.6, 0.4)} />
          <T x={MXS[1] + MW} y={MY + MW / 2 - 34} w={MXS[2] - MXS[1] - MW} fs={52} align="center" o={beat(frame, S.s2, 0.8, 0.4)}>
            {L.equals}
          </T>
          <Matrix m={2} vals={cVals} fill={cFill} o={beat(frame, S.s2, 0.9, 0.4)} />
          <T x={MXS[2]} y={MY - 70} w={MW} fs={32} bold align="center" color="var(--ink-2)" o={beat(frame, S.s2, 1.4, 0.4)}>
            {L.cellCount}
          </T>

          {/* s2: one cell = one row · one column */}
          <Band m={0} row={PICK.i} color="var(--pen)" p={s2Bands} />
          <Band m={1} col={PICK.j} color="var(--pen)" p={s2Bands} />
          {frame < S.s3.from + 10 && (
            <div style={{ opacity: 1 - beat(frame, S.s3, 0, 0.3) }}>
              <Center y={640} fs={42} mono bold={false} o={beat(frame, S.s2, 3.4, 0.5)}>
                {pickTerms()} = {MC[PICK.i][PICK.j]}
              </Center>
              <Hand x={0} y={730} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 5.6, 0.4) }}>
                {L.rowCol}
              </Hand>
            </div>
          )}

          {/* s3: one calculator, one cell at a time */}
          {frame >= S.s3.from && frame < S.s4.from + 10 && (
            <div style={{ opacity: beat(frame, S.s3, 0.2, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
              <Band m={0} row={cpuRow} color="var(--hl-orange)" p={cpuFilled > 0 && cpuFilled < 16 ? 1 : 0} />
              <Band m={1} col={cpuCol} color="var(--hl-orange)" p={cpuFilled > 0 && cpuFilled < 16 ? 1 : 0} />
              <Box x={300} y={640} w={480} h={110} r={20} fill="var(--hl-orange)">
                <span style={{ fontSize: 40, fontWeight: 700, color: "var(--chip-ink)" }}>{L.cpu}</span>
              </Box>
              <Center y={790} fs={44} bold={false}>
                {L.turn} <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{cpuFilled} / 16</span>
              </Center>
              <Hand x={0} y={880} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 7.4, 0.4) }}>
                {L.wait}
              </Hand>
            </div>
          )}

          {/* s4: cells don't wait for each other */}
          <Band m={0} row={0} color="var(--hl-mint)" p={s4Bands} />
          <Band m={1} col={3} color="var(--hl-mint)" p={s4Bands} />
          <Band m={0} row={3} color="var(--hl-pink)" p={s4Bands} />
          <Band m={1} col={1} color="var(--hl-pink)" p={s4Bands} />
          {frame >= S.s4.from && frame < S.s5.from + 10 && (
            <div style={{ opacity: 1 - beat(frame, S.s5, 0, 0.3) }}>
              <Hand x={0} y={660} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 2.4, 0.4), rotate: "-2deg" }}>
                {L.noWait}
              </Hand>
              <Center y={770} fs={42} bold={false} o={beat(frame, S.s4, 4.4, 0.4)}>
                {L.onlyNeeds}
              </Center>
            </div>
          )}

          {/* s5: many simple calculators at once */}
          {frame >= S.s5.from && (
            <div style={{ opacity: beat(frame, S.s5, 0.2, 0.4) }}>
              <Box x={250} y={630} w={580} h={100} r={20} fill="var(--hl-yellow)">
                <span style={{ fontSize: 40, fontWeight: 700, color: "var(--chip-ink)" }}>{L.gpu}</span>
              </Box>
              <Layer>
                {Array.from({ length: 16 }, (_, k) => (
                  <Student key={k} x={120 + k * 56} y={800} o={beat(frame, S.s5, 0.8 + k * 0.04, 0.3)} bob={gpuGo > 0 && gpuGo < 1 ? 8 : 0} />
                ))}
              </Layer>
              <Hand x={0} y={880} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 3.2, 0.4) }}>
                {L.allAtOnce}
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s6: the race */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: raceOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 190, display: "flex", justifyContent: "center", gap: 20, alignItems: "center" }}>
            <span style={{ fontSize: 50, fontWeight: 700 }}>{L.task}</span>
            <span style={{ fontSize: 30, background: "var(--paper-2)", color: "var(--ink-2)", borderRadius: 8, padding: "2px 12px" }}>{L.example}</span>
          </div>
          {[
            { y: 320, label: L.calc, p: calcP, c: "var(--hl-orange)", end: L.sec500, doneAt: T_CALC },
            { y: 540, label: L.students, p: studP, c: "var(--hl-yellow)", end: L.sec1, doneAt: T_STUD },
          ].map((lane) => (
            <div key={lane.label}>
              <T x={100} y={lane.y} fs={38} bold>
                {lane.label}
              </T>
              <div style={{ position: "absolute", left: 100, top: lane.y + 64, width: 880, height: 64, borderRadius: 14, background: "var(--paper-2)", border: "3px solid var(--line)", boxSizing: "border-box" }} />
              <div style={{ position: "absolute", left: 100, top: lane.y + 64, width: 880 * lane.p, height: 64, borderRadius: 14, background: lane.c }} />
              <T x={100} y={lane.y + 140} w={880} fs={40} bold align="right" color="var(--pen)" o={clock >= lane.doneAt - 1e-6 ? 1 : 0}>
                {lane.end} {L.done}
              </T>
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontSize: 44 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 72, fontWeight: 700 }}>{clock < 10 ? clock.toFixed(1) : Math.round(clock)}</span>
            <span style={{ fontWeight: 700, marginLeft: 8 }}>{L.sec}</span>
          </div>
          <Hand x={700} y={900} fs={42} color="var(--ink-2)" style={{ opacity: frame >= S.s6.from + 4.2 * FPS && frame < S.s6.from + 7.6 * FPS ? 1 : 0 }}>
            {L.ff}
          </Hand>
        </div>
      )}

      {/* s7: thousands of GPUs, and a model that suits them */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <Layer>
            {Array.from({ length: 24 }, (_, k) => {
              const x = 150 + (k % 8) * 112;
              const y = 230 + Math.floor(k / 8) * 100;
              return k % 8 < 7 ? <line key={`h${k}`} x1={x + 40} y1={y + 30} x2={x + 112} y2={y + 30} stroke="var(--ink-3)" strokeWidth={3} /> : null;
            })}
          </Layer>
          {Array.from({ length: 24 }, (_, k) => {
            const x = 150 + (k % 8) * 112;
            const y = 230 + Math.floor(k / 8) * 100;
            return (
              <Box key={k} x={x - 30} y={y} w={84} h={60} r={10} bw={3} fill="var(--hl-yellow)" o={beat(frame, S.s7, 0.4 + k * 0.04, 0.3)}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "var(--chip-ink)" }}>{L.gpuChip}</span>
              </Box>
            );
          })}
          <Center y={560} fs={46} o={beat(frame, S.s7, 1.6, 0.4)}>
            {L.many}
          </Center>
          {TOKENS.map((t, i) => (
            <Chip key={t} text={t} color={(["yellow", "mint", "sky", "orange"] as const)[i]} fs={46} x={TOK_X[i]} y={700} style={{ opacity: beat(frame, S.s7, 4.4, 0.4) }} />
          ))}
          <Center y={800} fs={40} bold={false} o={beat(frame, S.s7, 5.0, 0.4)}>
            {L.together}
          </Center>
          <Hand x={0} y={930} fs={44} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 8.0, 0.4) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch68.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
