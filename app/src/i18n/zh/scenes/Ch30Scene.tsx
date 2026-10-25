// zh overlay of src/scenes/Ch30Scene.tsx: the merged pair in s1 and s3 comes from the first learned merge instead of literal Hangul.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { PRESETS } from "../../../data/part3-tokens";
import { DIARY, MERGE_COLORS, NEW_WORDS, SCENE_BPE, ch30, countPairs, encode, totalPieces } from "../../../data/ch30";
import type { Highlighter } from "../../../data/types";
import { Caption, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "../../../scenes/kit";
import { Line, TOKEN_COLORS, TokChip, tokenRow } from "../../../scenes/part3-kit";

const tl = buildTimeline(ch30);
const S = byId(tl);
const L = ch30.labels;

const { stages: STAGES, merges: MERGES } = SCENE_BPE;
const MERGED = MERGES.map((m) => m.a + m.b);
const colorOf = (piece: string): Highlighter | null => {
  const i = MERGED.indexOf(piece);
  return i >= 0 ? MERGE_COLORS[i] : null;
};
const TOTALS = STAGES.map((s) => totalPieces(s, DIARY));
const PAIRS = STAGES.map((s) => countPairs(s, DIARY).slice(0, 4));

const FS = 50;
const SLOT = 86;
const GAP = 10;
const X0 = 84;
const ROW_Y = (r: number) => 300 + r * 108;

// when each merge happens: [step, seconds]
const MERGE_AT: [string, number][] = [
  ["s4", 1.0],
  ["s5", 0.8],
  ["s5", 2.6],
  ["s5", 4.4],
];

const NEW = NEW_WORDS.map((w) => encode(w, MERGES)[0]);
const REAL = PRESETS[9];
const REAL_ROW = tokenRow(
  REAL.o200k.map((t) => t[0]),
  54,
  12,
  420,
);

const Row: FC<{ r: number; stage: number; o: number }> = ({ r, stage, o }) => {
  let a = 0;
  return (
    <>
      {STAGES[stage][r].map((piece, k) => {
        const n = [...piece].length;
        const x = X0 + a * (SLOT + GAP);
        a += n;
        const c = colorOf(piece);
        return (
          <TokChip
            key={k}
            text={piece}
            x={x}
            y={ROW_Y(r)}
            w={n * SLOT + (n - 1) * GAP}
            fs={FS}
            color={c}
            style={{ opacity: o, ...(c ? {} : { background: "var(--paper)", border: "3px solid var(--line)", color: "var(--ink)" }) }}
          />
        );
      })}
    </>
  );
};

export const Ch30Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const corpusOn = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const sideOn = 1 - beat(frame, S.s6, 0, 0.5);
  const s7On = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);

  const ts = MERGE_AT.map(([st, t]) => beat(frame, S[st], t, 0.6, EASE_IO));
  const done = ts.filter((t) => t >= 1).length;
  const tMid = done < ts.length ? ts[done] : 0; // transition in progress
  const shown = tMid > 0.5 ? done + 1 : done; // stage whose numbers are shown

  // s6: everything but the 学习 rows dims
  const focus = beat(frame, S.s6, 0.3, 0.5);
  const rowO = (r: number) => (r === 0 || r === 2 ? 1 : mix(1, 0.25, focus));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: two pieces that often go together become one */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Line y={300} fs={58}>
            {L.title}
          </Line>
          <Line y={390} fs={36} weight={500} color="var(--ink-2)" o={beat(frame, S.s1, 0.6, 0.4)}>
            {L.sub}
          </Line>
          {(() => {
            const j = beat(frame, S.s1, 2.4, 0.8, EASE_IO);
            const pop = beat(frame, S.s1, 3.2, 0.4);
            return (
              <>
                <TokChip text={MERGES[0].a} x={mix(330, 440, j)} y={600} fs={80} w={100} style={{ opacity: beat(frame, S.s1, 1.0, 0.4) * (1 - pop), background: "var(--paper)", border: "3px solid var(--line)", color: "var(--ink)" }} />
                <TokChip text={MERGES[0].b} x={mix(650, 540, j)} y={600} fs={80} w={100} style={{ opacity: beat(frame, S.s1, 1.2, 0.4) * (1 - pop), background: "var(--paper)", border: "3px solid var(--line)", color: "var(--ink)" }} />
                <TokChip text={MERGED[0]} x={440} y={600} fs={80} w={200} color="yellow" style={{ opacity: pop, scale: String(mix(1.15, 1, pop)) }} />
              </>
            );
          })()}
          <Hand x={0} y={800} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.8, 0.5) }}>
            {L.often}
          </Hand>
        </div>
      )}

      {/* s2–s6: the corpus and its merges */}
      {frame >= S.s2.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: corpusOn }}>
          <div style={{ position: "absolute", left: X0, top: 196, fontSize: 40, fontWeight: 700 }}>{L.corpus}</div>
          {DIARY.map((c, r) => {
            const a = beat(frame, S.s2, 0.6 + r * 0.3, 0.4);
            return (
              <div key={c.w} style={{ opacity: a * rowO(r) }}>
                {tMid > 0 && tMid < 1 ? (
                  <>
                    <Row r={r} stage={done} o={1 - tMid} />
                    <Row r={r} stage={done + 1} o={tMid} />
                  </>
                ) : (
                  <Row r={r} stage={done} o={1} />
                )}
                <div style={{ position: "absolute", left: X0 + 4 * (SLOT + GAP) + 6, top: ROW_Y(r) + 12, fontFamily: "var(--font-mono)", fontSize: 40, color: "var(--ink-2)" }}>
                  {L.x}
                  {c.n}
                </div>
              </div>
            );
          })}

          {/* s3: underline every 完+了 pair */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: 1 - beat(frame, S.s4, 0.6, 0.4) }}>
            {DIARY.map((c, r) => {
              const k = [...c.w].findIndex((ch, i, arr) => ch === MERGES[0].a && arr[i + 1] === MERGES[0].b);
              if (k < 0) return null;
              const x1 = X0 + k * (SLOT + GAP) + 6;
              const x2 = X0 + (k + 2) * (SLOT + GAP) - GAP - 6;
              const y = ROW_Y(r) + 84;
              const p = beat(frame, S.s3, 1.6 + r * 0.25, 0.4);
              return <path key={r} d={`M ${x1} ${y} C ${x1 + 40} ${y + 10}, ${x2 - 40} ${y - 6}, ${x2} ${y + 4}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" opacity={p > 0 ? 1 : 0} />;
            })}
          </svg>

          {/* right side: piece counter, pair counts, new tokens */}
          <div style={{ opacity: sideOn }}>
            <div style={{ position: "absolute", left: 640, top: 196, width: 380, textAlign: "center", opacity: beat(frame, S.s2, 3.6, 0.4) }}>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{L.pieces}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 86, fontWeight: 500, lineHeight: 1.2 }}>{TOTALS[shown]}</div>
            </div>
            <div style={{ opacity: beat(frame, S.s3, 0.4, 0.4) }}>
              <div style={{ position: "absolute", left: 640, top: 380, fontSize: 34, fontWeight: 700 }}>{L.pairs}</div>
              {PAIRS[Math.min(shown, PAIRS.length - 1)].map((p, i) => (
                <div key={`${shown}-${i}`} style={{ position: "absolute", left: 640, top: 436 + i * 64, height: 56, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 190, fontSize: 34, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {p.a}+{p.b}
                  </span>
                  <span style={{ display: "block", height: 26, width: (p.n / 9) * 110, borderRadius: 13, background: i === 0 ? "var(--hl-orange)" : "var(--grid-major)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 36 }}>{p.n}</span>
                </div>
              ))}
              <PenCircle x={622} y={426} w={230} h={74} p={beat(frame, S.s3, 3.4, 0.5) * (1 - beat(frame, S.s4, 0.6, 0.3))} />
              <Hand x={846} y={378} fs={40} style={{ opacity: beat(frame, S.s3, 3.8, 0.4) * (1 - beat(frame, S.s4, 0.6, 0.3)), rotate: "-4deg" }}>
                {L.most}
              </Hand>
            </div>
            <div style={{ position: "absolute", left: 640, top: 720, fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s4, 1.2, 0.4) }}>{L.vocab}</div>
            {MERGED.map((m, i) => (
              <TokChip key={m} text={m} x={640 + (i % 2) * 180} y={780 + Math.floor(i / 2) * 92} fs={48} w={160} color={MERGE_COLORS[i]} style={{ opacity: ts[i] > 0.5 ? 1 : 0, scale: String(mix(1.2, 1, Math.min(1, Math.max(0, (ts[i] - 0.5) * 2)))) }} />
            ))}
          </div>

          {/* s6: grammar nobody taught */}
          <div style={{ opacity: beat(frame, S.s6, 0.8, 0.4) }}>
            <PenCircle x={X0 - 14} y={ROW_Y(0) - 14} w={SLOT * 2 + GAP + 28} h={104} p={beat(frame, S.s6, 1.0, 0.5)} />
            <PenCircle x={X0 + 2 * (SLOT + GAP) - 14} y={ROW_Y(0) - 14} w={SLOT * 2 + GAP + 28} h={104} p={beat(frame, S.s6, 1.5, 0.5)} />
          </div>
          <Hand x={630} y={330} fs={56} style={{ opacity: beat(frame, S.s6, 2.2, 0.5), lineHeight: 1.35 }}>
            {L.noGrammar}
            <br />
            {L.noGrammar2}
          </Hand>
          <Hand x={630} y={520} fs={48} color="var(--ink-2)" style={{ opacity: beat(frame, S.s6, 3.6, 0.5) }}>
            {L.justCount}
          </Hand>
        </div>
      )}

      {/* s7: new words, known pieces */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <Line y={180} fs={54}>
            {L.newWord} → {L.known}
          </Line>
          {NEW_WORDS.map((w, r) => {
            const y = 330 + r * 290;
            const pieces = NEW[r];
            const ws = pieces.map((p) => [...p].length * 100 + ([...p].length - 1) * 10);
            const total = ws.reduce((a, b) => a + b, 0) + 24 * (ws.length - 1);
            let x = 540 - total / 2;
            const cut = beat(frame, S.s7, 1.6 + r * 2.0, 0.6, EASE_IO);
            return (
              <div key={w} style={{ opacity: beat(frame, S.s7, 0.5 + r * 2.0, 0.4) }}>
                <Line y={y} fs={60} weight={500}>
                  {w} ↓
                </Line>
                {pieces.map((p, k) => {
                  const at = x;
                  x += ws[k] + 24;
                  const c = colorOf(p);
                  return (
                    <TokChip
                      key={k}
                      text={p}
                      x={at}
                      y={mix(y, y + 110, cut)}
                      w={ws[k]}
                      fs={60}
                      color={c}
                      style={{ opacity: cut, ...(c ? {} : { background: "var(--paper)", border: "3px solid var(--line)", color: "var(--ink)" }) }}
                    />
                  );
                })}
              </div>
            );
          })}
          <Hand x={0} y={940} fs={46} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.4, 0.4) }}>
            {L.knownList} {MERGED.join(" · ")}
          </Hand>
        </div>
      )}

      {/* s8: the real tokenizer learned the same kind of pieces */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          <Line y={190} fs={52}>
            {L.real}
          </Line>
          <Line y={270} fs={32} weight={500} color="var(--ink-3)">
            {L.realSrc}
          </Line>
          {REAL.o200k.map((t, i) => (
            <TokChip key={i} text={t[0]} x={REAL_ROW[i].x} y={REAL_ROW[i].y} fs={54} color={TOKEN_COLORS[i % 2 === 0 ? 1 : 0]} style={{ opacity: beat(frame, S.s8, 0.8 + i * 0.25, 0.3) }} />
          ))}
          <Line y={640} fs={58} o={beat(frame, S.s8, 3.4, 0.5)}>
            <InlineCircle p={beat(frame, S.s8, 4.0, 0.6)}>{L.size}</InlineCircle>
          </Line>
          <Line y={790} fs={34} weight={500} color="var(--ink-2)" o={beat(frame, S.s8, 5.2, 0.5)}>
            {L.bytes}
          </Line>
        </div>
      )}

      <Narration tl={tl} chapter={ch30.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
