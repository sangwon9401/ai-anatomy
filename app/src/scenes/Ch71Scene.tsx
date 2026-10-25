import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ACCURACY, CAND_COLORS, PART7_TOOLS, SHOTS, TASKS, ch71, guess } from "../data/ch71";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Box, Center, Doc, HBar, Knob, Layer, T } from "./part7-kit";

const tl = buildTimeline(ch71);
const S = byId(tl);
const L = ch71.labels;

const TASK = TASKS[0];
const D0 = guess(TASK, 0);
const D1 = guess(TASK, 1);
const D3 = guess(TASK, 3);
const pct = (p: number) => `${Math.round(p * 100)}%`;

// prompt card
const CX = 80;
const CW = 560;
const CY = 170;
const LINE = 80;

// s6 graph
const GX = (i: number) => 220 + i * 170;
const GY = (a: number) => 880 - a * 6;

const TOOL_C = ["yellow", "mint", "sky", "pink", "violet", "orange"] as const;

export const Ch71Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0, 0.4) * (1 - beat(frame, S.s2, 0, 0.4));
  const promptOn = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.4));

  // how many examples are in the prompt (fractional while one slides in)
  const e1 = beat(frame, S.s3, 0.8, 0.6, EASE_IO);
  const e2 = beat(frame, S.s4, 0.4, 0.6, EASE_IO);
  const e3 = beat(frame, S.s4, 1.2, 0.6, EASE_IO);
  const nEx = e1 + e2 + e3;
  const toD1 = beat(frame, S.s3, 2.4, 1.0, EASE_IO);
  const toD3 = beat(frame, S.s4, 2.2, 1.2, EASE_IO);
  const dist = D0.map((p, i) => mix(mix(p, D1[i], toD1), D3[i], toD3));
  const cardH = 100 + (1 + nEx) * LINE;
  const exO = [e1, e2, e3];

  const cmpOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const graphOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.4));
  const kindsOn = beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.4));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the GPT-3 paper */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Doc x={430} y={180} w={220} fill="var(--paper-2)" o={beat(frame, S.s1, 0.3, 0.4)} />
          <Center y={490} fs={44} bold mono={false} o={beat(frame, S.s1, 0.8, 0.4)}>
            {L.paperEn}
          </Center>
          <Chip text={L.paperKo} color="yellow" fs={50} x={540 - chipWidth(L.paperKo, 50) / 2} y={580} style={{ opacity: beat(frame, S.s1, 2.4, 0.4) }} />
          <Center y={690} fs={36} bold={false} color="var(--ink-2)" o={beat(frame, S.s1, 1.4, 0.4)}>
            {L.paperMeta}
          </Center>
          <Hand x={0} y={810} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.6, 0.5), rotate: "-2deg" }}>
            {L.fewMeaning}
          </Hand>
        </div>
      )}

      {/* s2–s4: the prompt grows, the guess changes */}
      {frame >= S.s2.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: promptOn }}>
          <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: cardH, boxSizing: "border-box", borderRadius: 22, border: "4px solid var(--ink)", background: "var(--paper)" }} />
          <T x={CX + 28} y={CY + 18} fs={30} color="var(--ink-2)">
            {L.prompt}
          </T>
          {TASK.examples.map((ex, i) => (
            <T key={ex} x={CX + 28} y={CY + 70 + i * LINE} fs={44} o={exO[i]} style={{ translate: `${mix(-30, 0, exO[i])}px 0` }}>
              {ex}
            </T>
          ))}
          <div style={{ position: "absolute", left: CX + 28, top: CY + 70 + nEx * LINE, fontSize: 46, fontWeight: 700, whiteSpace: "nowrap", opacity: beat(frame, S.s2, 0.4, 0.4) }}>
            {TASK.query} <span style={{ color: "var(--pen)" }}>{L.q}</span>
          </div>

          {/* the model's numbers never move */}
          <div style={{ opacity: beat(frame, S.s2, 1.0, 0.4) }}>
            {[0, 1, 2].map((k) => (
              <Knob key={k} x={740 + k * 100} y={250} r={38} angle={[-30, 20, 50][k]} />
            ))}
            <T x={680} y={310} w={340} fs={32} bold align="center">
              {L.frozen}
            </T>
          </div>

          <T x={CX} y={620} fs={36} bold color="var(--ink-2)" o={beat(frame, S.s2, 1.4, 0.4)}>
            {L.guess}
          </T>
          <Chip text={L.example} color={null} fs={30} x={1024 - chipWidth(L.example, 30)} y={624} style={{ opacity: beat(frame, S.s2, 1.4, 0.4) }} />
          {TASK.cands.map((c, i) => (
            <HBar key={c} x={CX} y={690 + i * 76} word={c} p={dist[i] * beat(frame, S.s2, 1.8 + i * 0.12, 0.6)} scale={560} color={`var(--hl-${CAND_COLORS[i]})`} wordW={190} fs={44} bold={i === 0} value={pct(dist[i])} />
          ))}

          {/* notes */}
          {frame < S.s3.from + 10 && (
            <div style={{ opacity: 1 - beat(frame, S.s3, 0, 0.3) }}>
              <PenCircle x={CX - 16} y={690 + 2 * 76 - 22} w={600} h={96} p={beat(frame, S.s2, 4.0, 0.6)} />
              <Hand x={660} y={400} fs={50} style={{ width: 360, whiteSpace: "normal", textAlign: "center", opacity: beat(frame, S.s2, 4.8, 0.4) }}>
                {L.wanted}
              </Hand>
            </div>
          )}
          {frame >= S.s3.from && frame < S.s4.from + 10 && (
            <Hand x={660} y={420} fs={52} style={{ width: 360, textAlign: "center", opacity: beat(frame, S.s3, 3.6, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)), rotate: "-3deg" }}>
              {L.notice}
            </Hand>
          )}
          {frame >= S.s4.from && (
            <>
              <PenCircle x={CX - 16} y={690 - 22} w={880} h={96} p={beat(frame, S.s4, 3.6, 0.6)} />
              <Hand x={660} y={420} fs={58} style={{ width: 360, textAlign: "center", opacity: beat(frame, S.s4, 4.0, 0.4), rotate: "-3deg" }}>
                {L.sure}
              </Hand>
            </>
          )}
        </div>
      )}

      {/* s5: learning vs in-context learning */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: cmpOn }}>
          {[
            { x: 64, title: L.train, sub: L.trainDo, moving: true, c: "var(--paper-2)" },
            { x: 586, title: L.icl, sub: L.iclDo, moving: false, c: "var(--hl-yellow)" },
          ].map((b, bi) => (
            <div key={b.title} style={{ opacity: beat(frame, S.s5, 0.5 + bi * 1.6, 0.4) }}>
              <Box x={b.x} y={260} w={430} h={520} r={26} fill={b.c}>
                <span />
              </Box>
              <T x={b.x} y={290} w={430} fs={44} bold align="center" color={bi === 1 ? "var(--chip-ink)" : "var(--ink)"}>
                {b.title}
              </T>
              {bi === 1 && (
                <T x={b.x} y={350} w={430} fs={28} align="center" color="var(--chip-ink)">
                  {L.iclEn}
                </T>
              )}
              {[0, 1, 2].map((k) => (
                <Knob key={k} x={b.x + 115 + k * 100} y={450} r={38} angle={[-30, 20, 50][k] + (b.moving ? Math.sin(frame / 7 + k * 2) * 40 * beat(frame, S.s5, 1.0, 0.4) : 0)} />
              ))}
              <T x={b.x + 25} y={560} w={380} fs={38} align="center" color={bi === 1 ? "var(--chip-ink)" : "var(--ink)"}>
                {b.sub}
              </T>
            </div>
          ))}
          <Hand x={494} y={480} fs={52} style={{ width: 92, textAlign: "center" }}>
            vs
          </Hand>
        </div>
      )}

      {/* s6: accuracy vs number of examples */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: graphOn }}>
          <Layer>
            <line x1={160} y1={880} x2={960} y2={880} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            <line x1={160} y1={880} x2={160} y2={GY(100) - 20} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
            {[0, 25, 50, 75, 100].map((a) => (
              <line key={a} x1={152} y1={GY(a)} x2={168} y2={GY(a)} stroke="var(--ink)" strokeWidth={3} />
            ))}
            {ACCURACY.map((m, k) => {
              const p = beat(frame, S.s6, 1.0 + k * 1.2, 1.0, EASE_IO);
              const pts = m.v.map((a, i) => [GX(i), GY(a)] as const);
              const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
              return (
                <g key={m.name}>
                  <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke="var(--ink)" strokeWidth={5} />
                  {pts.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={12} fill={`var(--hl-${m.c})`} stroke="var(--ink)" strokeWidth={3} opacity={p > i / 4 ? 1 : 0} />
                  ))}
                </g>
              );
            })}
          </Layer>
          {[0, 25, 50, 75, 100].map((a) => (
            <T key={a} x={60} y={GY(a) - 20} w={84} fs={30} mono align="right" color="var(--ink-2)">
              {a}%
            </T>
          ))}
          {SHOTS.map((n, i) => (
            <T key={n} x={GX(i) - 40} y={896} w={80} fs={32} mono align="center" color="var(--ink-2)">
              {n}
            </T>
          ))}
          <T x={560} y={944} w={400} fs={34} bold align="right">
            {L.axisX}
          </T>
          <T x={136} y={GY(100) - 78} fs={34} bold>
            {L.axisY}
          </T>
          <Chip text={L.example} color={null} fs={30} x={1024 - chipWidth(L.example, 30)} y={GY(100) - 76} />
          {ACCURACY.map((m, k) => (
            <T key={m.name} x={GX(4) - 150} y={GY(m.v[4]) - 60} w={150} fs={32} bold align="right" o={beat(frame, S.s6, 2.0 + k * 1.2, 0.4)}>
              {m.name}
            </T>
          ))}
          <Hand x={240} y={GY(100) + 10} fs={48} style={{ opacity: beat(frame, S.s6, 5.4, 0.4) }}>
            {L.bigGain}
          </Hand>
        </div>
      )}

      {/* s7: zero / one / few */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: kindsOn }}>
          {[
            { name: L.zero, en: L.zeroEn, n: L.zeroN, k: 0 },
            { name: L.one, en: L.oneEn, n: L.oneN, k: 1 },
            { name: L.few, en: L.fewEn, n: L.fewN, k: 3 },
          ].map((c, i) => {
            const x = 80 + i * 320;
            return (
              <div key={c.name} style={{ opacity: beat(frame, S.s7, 0.5 + i * 1.6, 0.4) }}>
                <Box x={x} y={280} w={280} h={420} r={22} fill="var(--paper)">
                  <span />
                </Box>
                <Chip text={c.name} color={(["sky", "mint", "yellow"] as const)[i]} fs={44} x={x + 140 - chipWidth(c.name, 44) / 2} y={306} />
                <T x={x} y={374} w={280} fs={28} align="center" color="var(--ink-2)">
                  {c.en}
                </T>
                {Array.from({ length: c.k }, (_, j) => (
                  <div key={j} style={{ position: "absolute", left: x + 34, top: 430 + j * 52, width: 212, height: 30, borderRadius: 8, background: "var(--line)" }} />
                ))}
                <div style={{ position: "absolute", left: x + 34, top: 430 + c.k * 52, width: 150, height: 30, borderRadius: 8, background: "var(--ink-3)" }} />
                <T x={x + 192} y={422 + c.k * 52} fs={36} bold color="var(--pen)">
                  ?
                </T>
                <T x={x} y={630} w={280} fs={34} bold align="center">
                  {c.n}
                </T>
              </div>
            );
          })}
          <Hand x={0} y={790} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.4, 0.4) }}>
            {L.ch85}
          </Hand>
        </div>
      )}

      {/* s8: Part 7 recap */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <Center y={220} fs={56}>
            {L.recap}
          </Center>
          <div style={{ position: "absolute", left: 90, right: 90, top: 340, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
            {PART7_TOOLS.map((t, i) => (
              <span
                key={t}
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  padding: "8px 22px",
                  borderRadius: 14,
                  background: `var(--hl-${TOOL_C[i % TOOL_C.length]})`,
                  color: "var(--chip-ink)",
                  opacity: beat(frame, S.s8, 0.8 + i * 0.25, 0.3),
                  scale: String(mix(0.7, 1, beat(frame, S.s8, 0.8 + i * 0.25, 0.3))),
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <Center y={800} fs={46} o={beat(frame, S.s8, 7.0, 0.5)}>
            {L.next}
          </Center>
          <Hand x={0} y={890} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 7.8, 0.5) }}>
            {L.nextQ}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch71.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
