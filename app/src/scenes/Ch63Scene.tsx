import type { FC } from "react";
import { random, useCurrentFrame } from "remotion";
import { BIN_CUTS, MIX, SOURCES, ch63 } from "../data/ch63";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "./kit";
import { Box, Center, Doc, Slash, T } from "./part7-kit";

const tl = buildTimeline(ch63);
const S = byId(tl);
const L = ch63.labels;

// 10 × 10 grid of collected text, one cell = 1% (illustrative mix from MIX)
const C = 44;
const G = 8;
const GX = 72;
const GY = 280;
const cellXY = (cell: number): [number, number] => [GX + (cell % 10) * (C + G), GY + Math.floor(cell / 10) * (C + G)];

const ORDER = Array.from({ length: 100 }, (_, i) => i).sort((a, b) => random(`ch63-${a}`) - random(`ch63-${b}`));
const STARTS = MIX.reduce<number[]>((acc, m, i) => [...acc, i === 0 ? 0 : acc[i - 1] + MIX[i - 1].n], []);
const UNITS = ORDER.map((cell, k) => {
  const t = MIX.findIndex((_, i) => k >= STARTS[i] && k < STARTS[i] + MIX[i].n);
  return { cell, t, rank: k - STARTS[t] };
});
const OK = MIX.length - 1;

// bins under the grid for the three filters
const BX = [72, 392, 712];
const BY = 850;
const BW = 296;
const BH = 172;
const binXY = (b: number, rank: number): [number, number] => [BX[b] + 30 + (rank % 10) * 24, BY + 62 + Math.floor(rank / 10) * 24];

// s6: what is left packs into a 5 × 5 book
const BLOCK = 5 * C + 4 * G;
const BLX = GX + (10 * C + 9 * G) / 2 - BLOCK / 2;
const BLY = GY + (10 * C + 9 * G) / 2 - BLOCK / 2;
const blockXY = (rank: number): [number, number] => [BLX + (rank % 5) * (C + G), BLY + Math.floor(rank / 5) * (C + G)];

const RX = 630;
const RW = 394;

const FILTERS = [
  { step: "s3", title: L.f1, cards: [L.sameText, L.sameText], slash: [false, true], note: L.keepOne },
  { step: "s4", title: L.f2, cards: [L.junk1, L.junk2], slash: [true, true], note: L.noLearn },
  { step: "s5", title: L.f3, cards: [L.harm1, L.harm2], slash: [true, true], note: L.harmNote },
] as const;
const BIN_NAMES = [L.bin1, L.bin2, L.bin3];
const LEGEND = [
  { text: `${L.dup} ${L.dupX}`, c: MIX[0].c },
  { text: L.junk, c: MIX[1].c },
  { text: L.bad, c: MIX[2].c },
  { text: L.good, c: MIX[3].c },
];

const SRC_FS = 38;
const SRC_W = SOURCES.map((s) => chipWidth(s, SRC_FS));
const SRC_X = rowLayout(SRC_W, 16);
const SRC_C = ["sky", "mint", "yellow", "orange", "violet", "pink"] as const;

export const Ch63Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const sceneOn = 1 - beat(frame, S.s7, 0, 0.5);
  const srcOn = 1 - beat(frame, S.s2, 0, 0.4);
  const binsOn = beat(frame, S.s3, 0.2, 0.5);
  const pack = beat(frame, S.s6, 0.4, 1.2, EASE_IO);
  const filterSteps = [S.s3, S.s4, S.s5];

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s7.from + 15 && (
        <div style={{ opacity: sceneOn }}>
          {/* s1: sources */}
          {frame < S.s2.from + 12 &&
            SOURCES.map((s, i) => (
              <Chip key={s} text={s} color={SRC_C[i]} fs={SRC_FS} x={SRC_X[i]} y={120} style={{ opacity: beat(frame, S.s1, 0.2 + i * 0.12, 0.4) * srcOn }} />
            ))}
          <T x={GX} y={214} fs={34} bold o={beat(frame, S.s1, 0.9, 0.4) * (1 - pack)}>
            {L.collected}
          </T>

          {/* the grid of collected text */}
          {UNITS.map((u) => {
            const appear = beat(frame, S.s1, 1.0 + u.cell * 0.022, 0.3);
            const tint = u.t === OK ? 0 : beat(frame, S.s2, 1.2 + u.t * 1.0 + u.rank * 0.01, 0.4);
            let [x, y] = cellXY(u.cell);
            let size = C;
            if (u.t !== OK) {
              const fly = beat(frame, filterSteps[u.t], 2.4 + u.rank * (u.t === 2 ? 0.12 : 0.035), 0.8, EASE_IO);
              const [bx, by] = binXY(u.t, u.rank);
              x = mix(x, bx, fly);
              y = mix(y, by, fly);
              size = mix(C, 20, fly);
            } else {
              const [kx, ky] = blockXY(u.rank);
              x = mix(x, kx, pack);
              y = mix(y, ky, pack);
            }
            const r = size * 0.2;
            return (
              <div key={u.cell} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: r, background: "var(--hl-sky)", opacity: appear }}>
                {tint > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: r, background: `var(--hl-${MIX[u.t].c})`, opacity: tint }} />}
              </div>
            );
          })}

          {/* s1 right: a pile of documents */}
          {frame < S.s2.from + 15 && (
            <div style={{ opacity: beat(frame, S.s1, 1.4, 0.5) * (1 - beat(frame, S.s2, 0, 0.4)) }}>
              <Doc x={700} y={380} w={130} rot={-10} fill="var(--hl-mint)" />
              <Doc x={800} y={360} w={130} rot={8} fill="var(--hl-yellow)" />
              <Doc x={750} y={420} w={130} rot={-1} fill="var(--hl-sky)" />
              <Hand x={RX} y={630} fs={48} style={{ width: RW, whiteSpace: "pre-line", textAlign: "center" }}>
                {L.people}
              </Hand>
            </div>
          )}

          {/* s2 right: what is mixed in */}
          {frame >= S.s2.from && frame < S.s3.from + 15 && (
            <div style={{ opacity: 1 - beat(frame, S.s3, 0, 0.4) }}>
              {LEGEND.map((l, i) => {
                const o = beat(frame, S.s2, i === 3 ? 4.6 : 1.2 + i * 1.0, 0.4);
                return (
                  <div key={l.text} style={{ opacity: o }}>
                    <div style={{ position: "absolute", left: RX, top: 318 + i * 120, width: C, height: C, borderRadius: 9, background: `var(--hl-${l.c})` }} />
                    <T x={RX + C + 18} y={318 + i * 120 - 2} fs={36} bold={i < 3}>
                      {l.text}
                    </T>
                  </div>
                );
              })}
              <Hand x={0} y={850} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 5.4, 0.5), rotate: "-2deg" }}>
                {L.mixed}
              </Hand>
            </div>
          )}

          {/* s3–s5 right: the filter at work */}
          {FILTERS.map((f, fi) => {
            const st = filterSteps[fi];
            const next = [S.s4, S.s5, S.s6][fi];
            if (frame < st.from || frame >= next.from + 15) return null;
            const on = beat(frame, st, 0.2, 0.4) * (1 - beat(frame, next, 0, 0.4));
            return (
              <div key={f.title} style={{ opacity: on }}>
                <T x={RX} y={300} w={RW} fs={44} bold>
                  {f.title}
                </T>
                {f.cards.map((c, ci) => (
                  <div key={ci} style={{ opacity: beat(frame, st, 0.6 + ci * 0.4, 0.4) }}>
                    <Box x={RX} y={392 + ci * 112} w={RW - 20} h={88} r={14} bw={3} fill="var(--paper-2)">
                      <span style={{ fontSize: 34, fontWeight: 500 }}>{c}</span>
                    </Box>
                    {f.slash[ci] && <Slash x={RX + 20} y={400 + ci * 112} w={RW - 60} h={72} p={beat(frame, st, 1.4 + ci * 0.3, 0.4)} />}
                  </div>
                ))}
                <Hand x={RX} y={630} fs={46} style={{ width: RW - 20, textAlign: "center", opacity: beat(frame, st, 2.0, 0.4) }}>
                  {f.note}
                </Hand>
              </div>
            );
          })}

          {/* bins */}
          {frame >= S.s3.from &&
            BIN_NAMES.map((name, b) => {
              const used = frame >= filterSteps[b].from;
              const landed = beat(frame, filterSteps[b], 3.2 + (b === 2 ? 0.4 : 1.0), 0.4);
              return (
                <div key={name} style={{ opacity: binsOn * (used ? 1 : 0.45) }}>
                  <Box x={BX[b]} y={BY} w={BW} h={BH} dashed bw={3} r={16} fill="transparent" border="var(--ink-3)" />
                  <T x={BX[b] + 20} y={BY + 10} fs={34} bold>
                    {name}
                  </T>
                  <T x={BX[b] + BW - 120} y={BY + 10} w={100} fs={34} align="right" mono color="var(--pen)" o={landed}>
                    {BIN_CUTS[b]}
                  </T>
                </div>
              );
            })}

          {/* s6: what is left */}
          {frame >= S.s6.from && (
            <div>
              <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <rect
                  x={BLX - 30}
                  y={BLY - 30}
                  width={BLOCK + 60}
                  height={BLOCK + 60}
                  rx={22}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - beat(frame, S.s6, 1.6, 0.8)}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth={6}
                />
                <line x1={BLX - 12} y1={BLY - 30} x2={BLX - 12} y2={BLY + BLOCK + 30} stroke="var(--ink)" strokeWidth={6} opacity={beat(frame, S.s6, 2.3, 0.3)} />
              </svg>
              <T x={BLX - 60} y={BLY + BLOCK + 50} w={BLOCK + 120} fs={40} bold align="center" o={beat(frame, S.s6, 2.4, 0.4)}>
                {L.book}
              </T>
              <T x={RX} y={330} w={RW} fs={72} mono align="center" o={beat(frame, S.s6, 2.8, 0.5)}>
                {L.ratio}
              </T>
              <Chip text={L.example} color="yellow" fs={34} x={RX + (RW - chipWidth(L.example, 34)) / 2} y={450} style={{ opacity: beat(frame, S.s6, 3.4, 0.4) }} />
              <Hand x={RX} y={540} fs={46} color="var(--ink-2)" style={{ width: RW, whiteSpace: "pre-line", textAlign: "center", opacity: beat(frame, S.s6, 4.2, 0.4) }}>
                {L.differs}
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s7: what GPT-3 read */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <Center y={200} fs={54}>
            {L.gpt3}
          </Center>
          <Doc x={330} y={330} w={170} rot={-9} fill="var(--hl-mint)" />
          <Doc x={580} y={320} w={170} rot={8} fill="var(--hl-yellow)" />
          <Doc x={455} y={350} w={170} rot={-1} fill="var(--hl-sky)" />
          <Chip text={L.tokens} color="yellow" fs={62} x={540 - chipWidth(L.tokens, 62) / 2} y={620} style={{ opacity: beat(frame, S.s7, 1.2, 0.5), scale: String(mix(0.8, 1, beat(frame, S.s7, 1.2, 0.5))) }} />
          <Hand x={0} y={780} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.6, 0.5) }}>
            {L.goodData}
          </Hand>
          <Hand x={0} y={930} fs={42} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.4, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch63.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
