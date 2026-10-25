// ja overlay of src/scenes/Ch53Scene.tsx: the '번 헤드' suffix comes from labels.headN (番ヘッド), and the s8 blueprint
// rows stack the part name over its description (the Japanese texts do not fit side by side).
import type { FC, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { PIPELINE } from "../../../data/ch05";
import { GPT2_HEADS, PART5_TOOLS, ch53 } from "../../../data/ch53";
import { GPT2_MAPS, GPT2_SENTENCES } from "../../../data/part5-gpt2";
import type { Highlighter } from "../../../data/types";
import { Caption, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "../../../scenes/kit";
import { Center, MONO } from "../../../scenes/part5-kit";

const tl = buildTimeline(ch53);
const S = byId(tl);
const L = ch53.labels;

const SENT = Object.fromEntries(GPT2_SENTENCES.map((s) => [s.key, s]));
const HEAD = Object.fromEntries(GPT2_HEADS.map((h) => [h.key, h]));
const CELL = 54;
const STEP = 57;
const MAP_Y = 380;

const mapX = (n: number) => Math.round(615 - (n * STEP) / 2);

/** A real attention map: rows look, columns are looked at; the masked triangle is drawn faint. */
const HeatMap: FC<{ sent: string; head: string; o: number; fill?: number; hot?: [number, number] | null }> = ({ sent, head, o, fill = 1, hot }) => {
  const s = SENT[sent];
  const m = GPT2_MAPS[sent][head];
  const c: Highlighter = HEAD[head].c;
  const n = s.toks.length;
  const x0 = mapX(n);
  const cells: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const masked = j > i;
      const v = masked ? 0 : m[i][j] * fill;
      cells.push(
        <div
          key={`${i}-${j}`}
          style={{
            position: "absolute",
            left: x0 + j * STEP,
            top: MAP_Y + i * STEP,
            width: CELL,
            height: CELL,
            borderRadius: 6,
            background: masked ? "var(--ink-3)" : `color-mix(in srgb, var(--hl-${c}) ${Math.round(v)}%, var(--paper-2))`,
            opacity: masked ? 0.22 : 1,
          }}
        />,
      );
    }
  }
  return (
    <div style={{ opacity: o }}>
      {cells}
      {s.toks.map((t, i) => (
        <div key={`r${i}`} style={{ position: "absolute", left: x0 - 190, width: 178, top: MAP_Y + i * STEP, height: CELL, display: "flex", alignItems: "center", justifyContent: "flex-end", ...MONO, fontSize: 30, color: hot && hot[0] === i ? "var(--pen)" : "var(--ink)", fontWeight: hot && hot[0] === i ? 700 : 500 }}>
          {t}
        </div>
      ))}
      {s.toks.map((t, j) => (
        <div
          key={`c${j}`}
          style={{
            position: "absolute",
            left: x0 + j * STEP + CELL / 2 - 6,
            top: MAP_Y - 12,
            transform: "rotate(-55deg)",
            transformOrigin: "0% 100%",
            translate: "0 -100%",
            ...MONO,
            fontSize: 28,
            whiteSpace: "nowrap",
            color: hot && hot[1] === j ? "var(--pen)" : "var(--ink)",
            fontWeight: hot && hot[1] === j ? 700 : 500,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
};

const cellAt = (sent: string, i: number, j: number) => {
  const x0 = mapX(SENT[sent].toks.length);
  return { x: x0 + j * STEP, y: MAP_Y + i * STEP };
};

/** the three lines above a map: the sentence, a title, and where the numbers come from */
const Header: FC<{ sent: string; title: string; head?: string; o: number }> = ({ sent, title, head, o }) => {
  const h = head ? HEAD[head] : null;
  return (
    <div style={{ opacity: o }}>
      <Center y={104} fs={34} weight={500} color="var(--ink-2)">
        "{SENT[sent].text}"
      </Center>
      <Center y={158} fs={42}>
        {title}
      </Center>
      <Center y={216} fs={28} weight={400} color="var(--ink-3)">
        {L.model}
        {h ? ` · L${h.layer}H${h.head} (${h.layer}${L.layer} ${h.head}${L.headN})` : ""} · {L.src}
      </Center>
    </div>
  );
};

const Note: FC<{ x: number; y: number; w: number; o: number; children: ReactNode; fs?: number; color?: string }> = ({ x, y, w, o, children, fs = 40, color = "var(--pen)" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: "var(--font-hand)", fontSize: fs, lineHeight: 1.2, color, opacity: o, wordBreak: "keep-all", background: "var(--paper)", borderRadius: 10, padding: "4px 10px" }}>
    {children}
  </div>
);

const VISIT = ["prev", "first", "copy", "subj"].map((k) => HEAD[k]);

export const Ch53Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const span = (a: keyof typeof S, b: keyof typeof S) => frame >= S[a].from && frame < S[b].from + 15;
  const fade = (a: keyof typeof S, b: keyof typeof S) => beat(frame, S[a], 0.1, 0.5) * (1 - beat(frame, S[b], 0, 0.5));

  const catMap = frame >= S.s2.from && frame < S.s5.from + 15;
  const dogHot = cellAt("dog", 7, 3);
  const catHot = cellAt("cat", 7, 1);
  const n11 = mapX(11);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: 12 layers × 12 heads */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: 1 - beat(frame, S.s2, 0, 0.5) }}>
          <Center y={120} fs={50} o={beat(frame, S.s1, 0.2, 0.4)}>
            {L.model}
          </Center>
          <Center y={196} fs={38} weight={500} color="var(--ink-2)" o={beat(frame, S.s1, 1.0, 0.4)}>
            {L.layers} · {L.perLayer}
          </Center>
          {Array.from({ length: 144 }, (_, k) => {
            const l = Math.floor(k / 12);
            const h = k % 12;
            const visit = VISIT.find((v) => v.layer === l && v.head === h);
            const o = beat(frame, S.s1, 1.4 + l * 0.12, 0.3);
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 300 + h * 54,
                  top: 290 + l * 54,
                  width: 46,
                  height: 46,
                  borderRadius: 8,
                  border: visit ? "3px solid var(--ink)" : "2px solid var(--ink-3)",
                  background: visit ? `color-mix(in srgb, var(--hl-${visit.c}) ${Math.round(beat(frame, S.s1, 4.6, 0.5) * 100)}%, var(--paper-2))` : "var(--paper-2)",
                  boxSizing: "border-box",
                  opacity: o,
                }}
              />
            );
          })}
          {Array.from({ length: 12 }, (_, l) => (
            <div key={`l${l}`} style={{ position: "absolute", left: 160, width: 124, top: 290 + l * 54, height: 46, display: "flex", alignItems: "center", justifyContent: "flex-end", ...MONO, fontSize: 28, color: "var(--ink-2)", opacity: beat(frame, S.s1, 1.4 + l * 0.12, 0.3) }}>
              {l}
              {L.layer}
            </div>
          ))}
          <Center y={950} fs={46} o={beat(frame, S.s1, 3.6, 0.5)}>
            <InlineCircle p={beat(frame, S.s1, 4.2, 0.6)}>{L.total}</InlineCircle>
          </Center>
        </div>
      )}

      {/* s2: how to read a map (cat sentence, empty) */}
      {span("s2", "s3") && (
        <div style={{ opacity: fade("s2", "s3") }}>
          <Center y={104} fs={34} weight={500} color="var(--ink-2)">
            "{SENT.cat.text}"
          </Center>
          <Center y={158} fs={40}>
            {L.rows} · {L.cols}
          </Center>
          <Center y={216} fs={30} weight={500} color="var(--ink-2)" o={beat(frame, S.s2, 2.6, 0.4)}>
            {L.tri} · {L.dark}
          </Center>
        </div>
      )}
      {catMap && (
        <div style={{ opacity: frame < S.s3.from ? beat(frame, S.s2, 0.6, 0.6) : 1 - beat(frame, S.s4, 0, 0.5) }}>
          <HeatMap sent="cat" head="prev" o={1} fill={frame < S.s3.from ? 0 : beat(frame, S.s3, 0.4, 1.2)} />
        </div>
      )}
      {span("s3", "s4") && (
        <div style={{ opacity: fade("s3", "s4") }}>
          <Header sent="cat" title={`${HEAD.prev.layer}${L.layer} ${HEAD.prev.head}${L.headN} · ${L.prevT}`} head="prev" o={1} />
          <Note x={n11 + STEP * 5} y={MAP_Y + STEP * 1} w={330} o={beat(frame, S.s3, 2.4, 0.4)}>
            ↙ {HEAD.prev.desc}
          </Note>
        </div>
      )}

      {/* s4: everything on the first word */}
      {span("s4", "s5") && (
        <div style={{ opacity: fade("s4", "s5") }}>
          <HeatMap sent="cat" head="first" o={1} fill={beat(frame, S.s4, 0.4, 1.0)} />
          <Header sent="cat" title={`${HEAD.first.layer}${L.layer} ${HEAD.first.head}${L.headN} · ${L.firstT}`} head="first" o={1} />
          <Note x={n11 + STEP * 4.5} y={MAP_Y + STEP * 0.6} w={380} fs={36} color="var(--ink)" o={beat(frame, S.s4, 3.4, 0.5)}>
            {L.first98}
          </Note>
          <Note x={n11 + STEP * 6} y={MAP_Y + STEP * 3.4} w={300} o={beat(frame, S.s4, 5.6, 0.5)}>
            {L.why}
          </Note>
        </div>
      )}

      {/* s5: the repeated sentence and the copying head */}
      {span("s5", "s6") && (
        <div style={{ opacity: fade("s5", "s6") }}>
          <HeatMap sent="dog" head="copy" o={1} fill={beat(frame, S.s5, 0.6, 1.0)} hot={beat(frame, S.s5, 3.0, 0.3) > 0.5 ? [7, 3] : null} />
          <Header sent="dog" title={`${HEAD.copy.layer}${L.layer} ${HEAD.copy.head}${L.headN} · ${L.copyT}`} head="copy" o={1} />
          <PenCircle x={dogHot.x - 14} y={dogHot.y - 12} w={CELL + 28} h={CELL + 24} p={beat(frame, S.s5, 3.2, 0.6)} />
          <div style={{ position: "absolute", left: dogHot.x - 10, top: dogHot.y + CELL + 10, ...MONO, fontSize: 34, fontWeight: 700, color: "var(--pen)", background: "var(--paper)", borderRadius: 8, padding: "0 6px", opacity: beat(frame, S.s5, 3.6, 0.4) }}>
            {GPT2_MAPS.dog.copy[7][3]}%
          </div>
          <Note x={mapX(10) + STEP * 4.4} y={MAP_Y + STEP * 0.6} w={360} fs={38} o={beat(frame, S.s5, 4.4, 0.5)}>
            {L.copyNote}
          </Note>
        </div>
      )}

      {/* s6: 'it' looks at 'cat' */}
      {span("s6", "s7") && (
        <div style={{ opacity: fade("s6", "s7") }}>
          <HeatMap sent="cat" head="subj" o={1} fill={beat(frame, S.s6, 0.4, 1.0)} hot={beat(frame, S.s6, 2.0, 0.3) > 0.5 ? [7, 1] : null} />
          <Header sent="cat" title={`${HEAD.subj.layer}${L.layer} ${HEAD.subj.head}${L.headN} · ${L.subjT}`} head="subj" o={1} />
          <PenCircle x={catHot.x - 14} y={catHot.y - 12} w={CELL + 28} h={CELL + 24} p={beat(frame, S.s6, 2.2, 0.6)} />
          <div style={{ position: "absolute", left: catHot.x + CELL + 14, top: catHot.y + 6, ...MONO, fontSize: 34, fontWeight: 700, color: "var(--pen)", background: "var(--paper)", borderRadius: 8, padding: "0 6px", opacity: beat(frame, S.s6, 2.6, 0.4) }}>
            {GPT2_MAPS.cat.subj[7][1]}%
          </div>
          <Note x={n11 + STEP * 5} y={MAP_Y + STEP * 0.8} w={330} fs={40} color="var(--ink)" o={beat(frame, S.s6, 3.6, 0.5)}>
            {L.callback}
          </Note>
          <Note x={n11 + STEP * 5.4} y={MAP_Y + STEP * 2.6} w={320} fs={38} o={beat(frame, S.s6, 5.4, 0.5)}>
            {L.careful}
          </Note>
        </div>
      )}

      {/* s7: what Part 5 gave us */}
      {span("s7", "s8") && (
        <div style={{ opacity: fade("s7", "s8") }}>
          <Center y={220} fs={58}>
            {L.recap}
          </Center>
          <div style={{ position: "absolute", left: 80, right: 80, top: 360, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
            {PART5_TOOLS.map((t, i) => (
              <span
                key={t}
                style={{
                  fontSize: 38,
                  fontWeight: 700,
                  padding: "8px 20px",
                  borderRadius: 14,
                  background: ["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)", "var(--hl-pink)", "var(--hl-violet)"][i % 5],
                  color: "var(--chip-ink)",
                  opacity: beat(frame, S.s7, 0.8 + i * 0.3, 0.3),
                  scale: String(mix(0.7, 1, beat(frame, S.s7, 0.8 + i * 0.3, 0.3))),
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* s8: the blueprint's attention part, fully understood */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <Center y={130} fs={46}>
            {L.blueprint}
          </Center>
          {PIPELINE.map((p, i) => {
            const att = p.key === "att";
            const y = 220 + i * 92;
            return (
              <div key={p.key} style={{ opacity: att ? 1 : 0.45 }}>
                <div
                  style={{
                    position: "absolute",
                    left: 150,
                    top: y,
                    width: 780,
                    height: 74,
                    borderRadius: 14,
                    border: att ? "4px solid var(--ink)" : "2.5px dashed var(--ink-3)",
                    background: att ? "var(--hl-yellow)" : "var(--paper)",
                    color: att ? "var(--chip-ink)" : "var(--ink)",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0 24px",
                    fontSize: 30,
                    lineHeight: 1.15,
                    whiteSpace: "nowrap",
                    fontWeight: att ? 700 : 500,
                  }}
                >
                  <span>{p.name}</span>
                  <span style={{ fontSize: 28, fontWeight: 400 }}>{p.does}</span>
                </div>
              </div>
            );
          })}
          <PenCircle x={130} y={220 + 3 * 92 - 14} w={820} h={102} p={beat(frame, S.s8, 1.2, 0.8)} />
          <Hand x={0} y={880} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 2.2, 0.5) }}>
            {L.understood}
          </Hand>
          <Hand x={0} y={960} fs={46} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 3.6, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch53.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
