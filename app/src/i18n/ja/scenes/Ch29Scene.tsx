// ja overlay of src/scenes/Ch29Scene.tsx: the zoomed character is 「く」 (labels.ku) and, since Japanese has no spaces,
// s4 circles the one-piece 「私は」 instead of a leading space.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { PIPELINE } from "../../../data/ch05";
import { RARE, SENT, SENT_CHARS, SENT_WORDS, VOCAB_ROWS, ch29 } from "../../../data/ch29";
import { Caption, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "../../../scenes/kit";
import { Blueprint, Line, NumBox, Svg, TOKEN_COLORS, TokChip, tokenRow } from "../../../scenes/part3-kit";

const tl = buildTimeline(ch29);
const S = byId(tl);
const L = ch29.labels;

const TOKS = SENT.o200k;
const FS = 56;
const ROW = tokenRow(
  TOKS.map((t) => t[0]),
  FS,
  16,
  660,
);
const CHAR_ROW = tokenRow(SENT_CHARS, 40, 8, 330);
const WORD_ROW = tokenRow(SENT_WORDS, FS, 22, 330);
const ID_W = TOKS.map((t) => String(t[1]).length * 22 + 26);
const ID_GAP = 10;
const ID_X0 = 540 - (ID_W.reduce((a, b) => a + b, 0) + ID_GAP * (ID_W.length - 1)) / 2;
const ID_X = ID_W.map((_, i) => ID_X0 + ID_W.slice(0, i).reduce((a, b) => a + b + ID_GAP, 0));

const UNB = RARE.unbelievable.o200k;
const SLANG = RARE.slang.o200k;
const UNB_ROW = tokenRow(
  UNB.map((t) => t[0]),
  52,
  14,
  400,
);
const SLANG_ROW = tokenRow(
  SLANG.map((t) => t[0]),
  52,
  14,
  680,
);

export const Ch29Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2On = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const s3On = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const tokOn = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const s6On = beat(frame, S.s6, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);

  // s1: the sentence drops into the machine, chips come out
  const drop = beat(frame, S.s1, 1.4, 0.9, EASE_IO);
  const out = beat(frame, S.s1, 2.4, 0.9, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: sentence → tokenizer → tokens */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <div
            style={{
              position: "absolute",
              left: 540 - 330,
              width: 660,
              top: mix(250, 430, drop),
              height: 92,
              display: "grid",
              placeItems: "center",
              fontSize: 52,
              fontWeight: 500,
              borderRadius: 14,
              border: "3px solid var(--ink)",
              background: "var(--paper)",
              opacity: beat(frame, S.s1, 0.3, 0.4) * (1 - beat(frame, S.s1, 2.0, 0.3)),
            }}
          >
            {SENT.text}
          </div>
          <div
            style={{
              position: "absolute",
              left: 270,
              top: 400,
              width: 540,
              height: 160,
              borderRadius: 26,
              border: "5px solid var(--ink)",
              background: "var(--hl-violet)",
              color: "var(--chip-ink)",
              display: "grid",
              placeItems: "center",
              fontSize: 56,
              fontWeight: 700,
              opacity: beat(frame, S.s1, 0.8, 0.4),
            }}
          >
            {L.machine}
          </div>
          {TOKS.map((t, i) => (
            <TokChip
              key={i}
              text={t[0]}
              x={ROW[i].x}
              y={mix(500, ROW[i].y, out)}
              fs={FS}
              color={TOKEN_COLORS[i % TOKEN_COLORS.length]}
              style={{ opacity: Math.min(1, out * 3) }}
            />
          ))}
          <Line y={830} fs={52} o={beat(frame, S.s1, 3.6, 0.5)}>
            <InlineCircle p={beat(frame, S.s1, 4.2, 0.6)}>{L.token}</InlineCircle>
          </Line>
        </div>
      )}

      {/* s2: by character */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          <Line y={190} fs={56}>
            {L.byChar}
          </Line>
          {SENT_CHARS.map((c, i) => (
            <TokChip
              key={i}
              text={c}
              x={CHAR_ROW[i].x}
              y={CHAR_ROW[i].y}
              fs={40}
              color={TOKEN_COLORS[i % TOKEN_COLORS.length]}
              style={{ opacity: beat(frame, S.s2, 0.6 + i * 0.1, 0.25) }}
            />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 450, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26, opacity: beat(frame, S.s2, 2.2, 0.4) }}>
            <span style={{ fontSize: 64, fontWeight: 700 }}>{L.n13}</span>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 54, color: "var(--pen)" }}>{L.tooMany}</span>
          </div>
          {/* zoom on '는' */}
          <div style={{ opacity: beat(frame, S.s2, 3.6, 0.5) }}>
            <TokChip text={L.ku} x={540 - 80} y={640} fs={110} w={160} color="yellow" />
            <div style={{ position: "absolute", left: 640, top: 640, fontFamily: "var(--font-hand)", fontSize: 120, color: "var(--pen)" }}>{L.q}</div>
          </div>
          <Hand x={0} y={850} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 4.2, 0.4) }}>
            {L.noMeaning}
          </Hand>
        </div>
      )}

      {/* s3: by word */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          <Line y={190} fs={56}>
            {L.byWord}
          </Line>
          {SENT_WORDS.map((w, i) => (
            <TokChip key={i} text={w} x={WORD_ROW[i].x} y={WORD_ROW[i].y} fs={FS} color={TOKEN_COLORS[i]} style={{ opacity: beat(frame, S.s3, 0.6 + i * 0.25, 0.3) }} />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 450, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26, opacity: beat(frame, S.s3, 1.8, 0.4) }}>
            <span style={{ fontSize: 64, fontWeight: 700 }}>{L.n4}</span>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 54, color: "var(--pen)" }}>{L.looksOk}</span>
          </div>
          <div style={{ opacity: beat(frame, S.s3, 3.4, 0.5) }}>
            <TokChip text={RARE.slang.text} x={540 - 170} y={640} fs={72} w={340} color={null} style={{ border: "4px dashed var(--ink-3)", background: "var(--paper)", color: "var(--ink)" }} />
          </div>
          <Svg>
            {[0, 1].map((k) => {
              const p = beat(frame, S.s3, 4.0 + k * 0.3, 0.3);
              const [x1, y1, x2, y2] = k === 0 ? [380, 640, 700, 750] : [700, 640, 380, 750];
              return <line key={k} x1={x1} y1={y1} x2={mix(x1, x2, p)} y2={mix(y1, y2, p)} stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" opacity={p > 0 ? 1 : 0} />;
            })}
          </Svg>
          <Hand x={0} y={800} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 4.6, 0.4) }}>
            {L.unknown}
          </Hand>
          <Hand x={0} y={880} fs={44} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 5.4, 0.4) }}>
            {L.endless}
          </Hand>
        </div>
      )}

      {/* s4–s5: real tokens, then their ids */}
      {frame >= S.s4.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: tokOn }}>
          <Line y={190} fs={56}>
            {L.byToken}
          </Line>
          <Line y={300} fs={40} weight={500} color="var(--ink-2)" o={beat(frame, S.s4, 0.6, 0.4) * (1 - beat(frame, S.s5, 0, 0.4))}>
            {L.cmp}
          </Line>
          {TOKS.map((t, i) => (
            <TokChip key={i} text={t[0]} x={ROW[i].x} y={420} fs={FS} color={TOKEN_COLORS[i % TOKEN_COLORS.length]} style={{ opacity: beat(frame, S.s4, 1.2 + i * 0.25, 0.3) }} />
          ))}
          <Line y={535} fs={30} weight={500} color="var(--ink-3)" o={beat(frame, S.s4, 3.2, 0.4) * (1 - beat(frame, S.s5, 0, 0.3))}>
            {L.source}
          </Line>
          <Line y={850} fs={30} weight={500} color="var(--ink-3)" o={beat(frame, S.s5, 5.4, 0.4)}>
            {L.source}
          </Line>
          <div style={{ opacity: beat(frame, S.s4, 4.4, 0.4) * (1 - beat(frame, S.s5, 0, 0.4)) }}>
            <PenCircle x={ROW[0].x - 16} y={398} w={ROW[0].w + 32} h={124} p={beat(frame, S.s4, 4.6, 0.5)} />
            <Hand x={0} y={660} fs={52} style={{ width: 1080, textAlign: "center" }}>
              {L.space}
            </Hand>
          </div>

          {/* s5: ids under each chip, then the number row */}
          {TOKS.map((t, i) => (
            <div
              key={`id${i}`}
              style={{
                position: "absolute",
                left: ROW[i].x - 20,
                width: ROW[i].w + 40,
                top: 510,
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 30,
                color: "var(--ink-2)",
                opacity: beat(frame, S.s5, 0.5 + i * 0.2, 0.3),
              }}
            >
              {t[1]}
            </div>
          ))}
          <div style={{ position: "absolute", left: ROW[2].x - 12, top: 404, width: ROW[2].w + 24, height: 164, border: "5px solid var(--pen)", borderRadius: 18, opacity: beat(frame, S.s5, 2.4, 0.3) * (1 - beat(frame, S.s5, 4.0, 0.3)) }} />
          <Line y={660} fs={40} weight={700} o={beat(frame, S.s5, 4.0, 0.4)}>
            ↓ {L.ids}
          </Line>
          {TOKS.map((t, i) => (
            <NumBox key={`b${i}`} x={ID_X[i]} y={740} w={ID_W[i]} h={80} fs={36} color={TOKEN_COLORS[i % TOKEN_COLORS.length]} style={{ opacity: beat(frame, S.s5, 4.6 + i * 0.12, 0.3) }}>
              {t[1]}
            </NumBox>
          ))}
        </div>
      )}

      {/* s6: vocabulary */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          <Line y={170} fs={52}>
            {L.vocab}
          </Line>
          <div style={{ position: "absolute", left: 80, top: 290, width: 440, height: 620, borderRadius: 22, border: "4px solid var(--ink)", background: "var(--paper)", opacity: beat(frame, S.s6, 0.6, 0.4) }} />
          {VOCAB_ROWS.map(([id, t], i) => (
            <div key={i} style={{ position: "absolute", left: 110, top: 316 + i * 68, width: 380, height: 60, display: "flex", alignItems: "center", gap: 20, opacity: beat(frame, S.s6, 0.9 + i * 0.15, 0.3) }}>
              <span style={{ width: 150, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 34, color: "var(--ink-2)" }}>{id}</span>
              {t && <TokChip text={t} x={0} y={0} fs={38} color={TOKEN_COLORS[i % TOKEN_COLORS.length]} style={{ position: "relative" }} />}
            </div>
          ))}
          <Hand x={120} y={850} fs={44} style={{ opacity: beat(frame, S.s6, 2.4, 0.4) }}>
            {L.rows}
          </Hand>
          {/* vocabulary sizes */}
          {[
            { name: L.gpt3, v: L.v3, n: 50257, x: 620, c: "var(--hl-sky)", t: 3.2 },
            { name: L.gpt4o, v: L.v4o, n: 200019, x: 820, c: "var(--hl-mint)", t: 4.2 },
          ].map((b) => {
            const g = beat(frame, S.s6, b.t, 0.8, EASE_IO);
            const h = (b.n / 200019) * 480 * g;
            return (
              <div key={b.name} style={{ opacity: beat(frame, S.s6, b.t - 0.2, 0.3) }}>
                <div style={{ position: "absolute", left: b.x, top: 860 - h, width: 150, height: h, borderRadius: "14px 14px 3px 3px", background: b.c }} />
                <div style={{ position: "absolute", left: b.x - 30, width: 210, top: 860 - h - 56, textAlign: "center", fontSize: 40, fontWeight: 700, opacity: g }}>{b.v}</div>
                <div style={{ position: "absolute", left: b.x - 30, width: 210, top: 876, textAlign: "center", fontSize: 38, fontWeight: 700 }}>{b.name}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 590, top: 860, width: 410, height: 4, background: "var(--ink)", opacity: beat(frame, S.s6, 3.0, 0.3) }} />
        </div>
      )}

      {/* s7: rare words split into known pieces */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <Line y={170} fs={56}>
            {L.rare}
          </Line>
          <Line y={300} fs={56} weight={500} o={beat(frame, S.s7, 0.6, 0.4)}>
            {RARE.unbelievable.text} ↓
          </Line>
          {UNB.map((t, i) => (
            <TokChip key={i} text={t[0]} x={UNB_ROW[i].x} y={UNB_ROW[i].y} fs={52} color={TOKEN_COLORS[i]} style={{ opacity: beat(frame, S.s7, 1.2 + i * 0.3, 0.3) }} />
          ))}
          <Line y={580} fs={56} weight={500} o={beat(frame, S.s7, 2.8, 0.4)}>
            {RARE.slang.text} ↓
          </Line>
          {SLANG.map((t, i) => (
            <TokChip
              key={i}
              text={t[0]}
              x={SLANG_ROW[i].x}
              y={SLANG_ROW[i].y}
              fs={52}
              color={TOKEN_COLORS[i]}
              partial={t.length === 3}
              style={{ opacity: beat(frame, S.s7, 3.4 + i * 0.25, 0.3) }}
            />
          ))}
          <Hand x={0} y={800} fs={42} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.0, 0.4) }}>
            {L.bytes}
          </Hand>
          <Hand x={0} y={890} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.0, 0.4), rotate: "-1.5deg" }}>
            {L.canRead}
          </Hand>
        </div>
      )}

      {/* s8: the blueprint gets its first part */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          <Line y={110} fs={52}>
            {L.bp}
          </Line>
          <Blueprint parts={PIPELINE} filled={["loop"]} fresh="tok" p={beat(frame, S.s8, 1.0, 0.8)} y0={210} emptyText={L.empty} />
          <Hand x={0} y={960} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 3.6, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch29.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
