import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { DISTS, DRAWS, ch13 } from "../data/ch13";
import { Caption, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "./kit";

const tl = buildTimeline(ch13);
const S = byId(tl);
const L = ch13.labels;

const BASE = 820;
const SCALE = 760; // px per probability 1.0
const [DICE, BREAKFAST, FLAT] = DISTS;
// a long-tailed "next piece" distribution: a few tall bars and many tiny ones
// sorted from most to least likely (illustrative shape, not measured)
const GPT_BARS = Array.from({ length: 150 }, (_, i) => 0.5 / (1 + i * 0.9) ** 1.25);
const TOP3 = [0, 1, 2];
const TOP3_LABEL_X = [190, 330, 470];

const Bars: FC<{
  items: { w: string; p: number; c: string }[];
  x0: number;
  w: number;
  gap: number;
  grow: number;
  scale?: number;
  base?: number;
  labels?: boolean;
  fs?: number;
  fmt?: (p: number) => string;
}> = ({
  items,
  x0,
  w,
  gap,
  grow,
  scale = SCALE,
  base = BASE,
  labels = true,
  fs = 40,
  fmt = (p) => `${Math.round(p * 100)}%`,
}) => (
  <>
    {items.map((it, i) => {
      const h = it.p * scale * grow;
      const x = x0 + i * (w + gap);
      return (
        <div key={it.w}>
          <div style={{ position: "absolute", left: x, top: base - h, width: w, height: h, background: `var(--hl-${it.c})`, borderRadius: "12px 12px 3px 3px" }} />
          {labels && (
            <>
              <div style={{ position: "absolute", left: x - 30, width: w + 60, top: base - h - 52, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: fs * 0.8, opacity: grow }}>
                {fmt(it.p)}
              </div>
              <div style={{ position: "absolute", left: x - 40, width: w + 80, top: base + 14, textAlign: "center", fontSize: fs, fontWeight: 700 }}>{it.w}</div>
            </>
          )}
        </div>
      );
    })}
  </>
);

export const Ch13Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const diceOn = 1 - beat(frame, S.s3, 0, 0.5);
  const breakOn = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const gptOn = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const drawOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const cmpOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));

  const drawn = DRAWS.map((_, i) => beat(frame, S.s5, 1.0 + i * 0.5, 0.25));
  const counts = BREAKFAST.items.map((it) => DRAWS.filter((d, i) => d === it.w && drawn[i] >= 1).length);
  const current = drawn.reduce((acc, v, i) => (v > 0 ? i : acc), -1);
  const pizzaAt = DRAWS.indexOf("피자");

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s2: a fair die */}
      {frame < S.s3.from + 15 && (
        <div style={{ opacity: diceOn }}>
          <div style={{ position: "absolute", left: 460, top: 140, width: 160, height: 160, borderRadius: 30, border: "6px solid var(--ink)", background: "var(--paper)", opacity: beat(frame, S.s1, 0.2, 0.4), rotate: `${mix(-30, -8, beat(frame, S.s1, 0.2, 0.8))}deg` }}>
            {[
              [40, 40],
              [80, 80],
              [120, 120],
            ].map(([x, y], i) => (
              <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 26, height: 26, borderRadius: "50%", background: "var(--ink)" }} />
            ))}
          </div>
          <Bars items={DICE.items} x0={160} w={100} gap={36} grow={beat(frame, S.s1, 1.2, 0.8)} fmt={() => "1/6"} />
          <div style={{ position: "absolute", left: 140, top: BASE - 2, width: 800, height: 5, background: "var(--ink)" }} />
          <Hand x={680} y={400} fs={50} style={{ opacity: beat(frame, S.s1, 2.6, 0.4) }}>
            {L.sixth}
          </Hand>
          <div style={{ position: "absolute", left: 120, top: 360, fontSize: 52, fontWeight: 700, opacity: beat(frame, S.s2, 0.6, 0.4) }}>{L.dist}</div>
          <Hand x={620} y={490} fs={56} style={{ opacity: beat(frame, S.s2, 2.6, 0.4) }}>
            <InlineCircle p={beat(frame, S.s2, 3.0, 0.6)}>{L.total}</InlineCircle>
          </Hand>
        </div>
      )}

      {/* s3: a peaked distribution */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: breakOn }}>
          <div style={{ position: "absolute", left: 120, top: 200, fontSize: 52, fontWeight: 700 }}>{L.breakfast}</div>
          <Bars items={BREAKFAST.items} x0={200} w={140} gap={60} grow={beat(frame, S.s3, 0.8, 1.0)} />
          <div style={{ position: "absolute", left: 140, top: BASE - 2, width: 800, height: 5, background: "var(--ink)" }} />
          <Hand x={600} y={300} fs={56} style={{ opacity: beat(frame, S.s3, 3.2, 0.4), rotate: "-3deg" }}>
            {L.peaked}
          </Hand>
        </div>
      )}

      {/* s4: GPT's distribution over ~50k pieces */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: gptOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 50, fontWeight: 700 }}>{L.gpt}</div>
          {GPT_BARS.map((p, i) => {
            const h = p * 900 * beat(frame, S.s4, 0.8 + (i % 30) * 0.03, 0.6);
            return <div key={i} style={{ position: "absolute", left: 90 + i * 6, top: BASE - h, width: 4, height: h, background: TOP3.includes(i) ? "var(--hl-yellow)" : "var(--hl-sky)", borderRadius: 2 }} />;
          })}
          <div style={{ position: "absolute", left: 80, top: BASE - 2, width: 920, height: 4, background: "var(--ink)" }} />
          <div style={{ position: "absolute", left: 1000, top: BASE - 40, fontSize: 40, color: "var(--ink-2)" }}>…</div>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {TOP3.map((i, k) => (
              <line
                key={i}
                x1={92 + i * 6}
                y1={BASE - GPT_BARS[i] * 900}
                x2={TOP3_LABEL_X[k]}
                y2={BASE - GPT_BARS[0] * 900 + 40 + k * 70}
                stroke="var(--ink-3)"
                strokeWidth={2.5}
                opacity={beat(frame, S.s4, 2.4 + k * 0.3, 0.4)}
              />
            ))}
          </svg>
          {TOP3.map((i, k) => (
            <Hand key={i} x={TOP3_LABEL_X[k] + 8} y={BASE - GPT_BARS[0] * 900 + 14 + k * 70} fs={40} color="var(--ink)" style={{ opacity: beat(frame, S.s4, 2.4 + k * 0.3, 0.4) }}>
              {[L.go, L.went, L.late][k]}
            </Hand>
          ))}
          <Hand x={0} y={BASE + 60} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 3.6, 0.4) }}>
            {L.many}
          </Hand>
        </div>
      )}

      {/* s5: drawing from the distribution */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: drawOn }}>
          <Bars items={BREAKFAST.items} x0={200} w={140} gap={60} grow={1} scale={600} base={620} fs={36} />
          <div style={{ position: "absolute", left: 140, top: 618, width: 800, height: 5, background: "var(--ink)" }} />
          {current >= 0 && (
            <div
              style={{
                position: "absolute",
                left: 200 + BREAKFAST.items.findIndex((it) => it.w === DRAWS[current]) * 200 + 70 - 22,
                top: 620 - BREAKFAST.items.find((it) => it.w === DRAWS[current])!.p * 600 - 120,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--pen)",
                scale: String(mix(1.6, 1, drawn[current])),
              }}
            />
          )}
          <div style={{ position: "absolute", left: 120, top: 760, fontSize: 36, fontWeight: 700 }}>{L.count}</div>
          {BREAKFAST.items.map((it, i) => (
            <div key={it.w} style={{ position: "absolute", left: 200 + i * 200, width: 140, top: 820, textAlign: "center" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", minHeight: 40 }}>
                {Array.from({ length: counts[i] }, (_, k) => (
                  <span key={k} style={{ width: 20, height: 34, borderRadius: 4, background: `var(--hl-${it.c})`, border: "2px solid var(--ink)" }} />
                ))}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 40, marginTop: 6 }}>{counts[i]}</div>
            </div>
          ))}
          <Hand x={620} y={210} fs={48} style={{ opacity: beat(frame, S.s5, 1.0 + pizzaAt * 0.5 + 0.3, 0.4), rotate: "-3deg" }}>
            {L.sometimes}
          </Hand>
        </div>
      )}

      {/* s6: sharp vs flat */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: cmpOn }}>
          <Bars items={BREAKFAST.items} x0={90} w={80} gap={24} grow={beat(frame, S.s6, 0.6, 0.8)} scale={700} base={760} labels={false} />
          <Bars items={FLAT.items} x0={600} w={80} gap={24} grow={beat(frame, S.s6, 1.2, 0.8)} scale={700} base={760} labels={false} />
          <div style={{ position: "absolute", left: 70, top: 758, width: 420, height: 5, background: "var(--ink)" }} />
          <div style={{ position: "absolute", left: 580, top: 758, width: 420, height: 5, background: "var(--ink)" }} />
          <Hand x={80} y={800} fs={46} style={{ opacity: beat(frame, S.s6, 2.2, 0.4) }}>
            {L.sharp}
          </Hand>
          <Hand x={590} y={800} fs={46} style={{ opacity: beat(frame, S.s6, 3.0, 0.4) }}>
            {L.flat}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 940, textAlign: "center", fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s6, 4.2, 0.4) }}>{L.temp}</div>
        </div>
      )}

      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontSize: 58, fontWeight: 700 }}>{L.sum}</div>
          <Hand x={0} y={600} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 1.4, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch13.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
