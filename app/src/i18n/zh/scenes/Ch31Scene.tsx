// zh overlay of src/scenes/Ch31Scene.tsx: '学校' is four byte pieces in GPT-3 (two per character), and the bars are scaled
// for the smaller Chinese counts (12 / 74 at most instead of 28 / 143); full-width colon in the source line.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { EN_SAMPLES, HANGUL_TOKENS, LONG, MAIN, SCHOOL_BYTES, TOKENIZERS, ch31 } from "../../../data/ch31";
import { Caption, EASE_IO, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "../../../scenes/kit";
import { Line, TOKEN_COLORS, TokChip, tokenRow } from "../../../scenes/part3-kit";

const tl = buildTimeline(ch31);
const S = byId(tl);
const L = ch31.labels;

const EN3 = MAIN.r50k_base.en;
const KO3 = MAIN.r50k_base.ko;
const EN_ROW = tokenRow(
  EN3.map((t) => t[0]),
  42,
  10,
  300,
);
const KO_ROW = tokenRow(
  KO3.map((t) => t[0]),
  42,
  8,
  510,
  968,
  72,
);
const SAMPLE_ROW = tokenRow(EN_SAMPLES, 46, 14, 300, 800, 90);

// s6–s7 grouped bars: [korean, english] per tokenizer
const SHORT = TOKENIZERS.map((t) => [MAIN[t.key].ko.length, MAIN[t.key].en.length]);
const LONGC = TOKENIZERS.map((t) => [LONG[t.key].ko.length, LONG[t.key].en.length]);
const GX = [230, 540, 850];
const BASE = 800;
const BAR_W = 96;
const MODELS = [L.model3, L.model4, L.model4o];
const RATIOS = [L.r1, L.r2, L.r3];

export const Ch31Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const gpt3On = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const s4On = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const s5On = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const barsOn = beat(frame, S.s6, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);
  const toLong = beat(frame, S.s7, 0.4, 1.2, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: same meaning, two languages */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          {[
            { lab: L.ko, text: MAIN.ko, c: "var(--hl-pink)", y: 300, t: 0.4 },
            { lab: L.en, text: MAIN.en, c: "var(--hl-sky)", y: 520, t: 1.2 },
          ].map((r) => (
            <div key={r.lab} style={{ opacity: beat(frame, S.s1, r.t, 0.5) }}>
              <div style={{ position: "absolute", left: 90, top: r.y, fontSize: 40, fontWeight: 700, padding: "2px 18px", borderRadius: 12, background: r.c, color: "var(--chip-ink)" }}>{r.lab}</div>
              <div style={{ position: "absolute", left: 90, top: r.y + 76, width: 900, height: 100, borderRadius: 18, border: "3px solid var(--ink)", background: "var(--paper)", display: "grid", placeItems: "center", fontSize: 50, fontWeight: 500 }}>{r.text}</div>
            </div>
          ))}
          <Hand x={0} y={790} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.0, 0.5) }}>
            {L.amount}
          </Hand>
        </div>
      )}

      {/* s2–s3: GPT-3's tokenizer */}
      {frame >= S.s2.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: gpt3On }}>
          <Line y={140} fs={34} weight={500} color="var(--ink-2)">
            {L.gpt3src}
          </Line>
          {[
            { lab: L.en, n: EN3.length, c: "var(--hl-sky)", y: 210, t: 0.6 },
            { lab: L.ko, n: KO3.length, c: "var(--hl-pink)", y: 420, t: 2.2 },
          ].map((r) => (
            <div key={r.lab} style={{ position: "absolute", left: 60, top: r.y, display: "flex", alignItems: "baseline", gap: 18, opacity: beat(frame, S.s2, r.t, 0.4) }}>
              <span style={{ fontSize: 38, fontWeight: 700, padding: "2px 16px", borderRadius: 12, background: r.c, color: "var(--chip-ink)" }}>{r.lab}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 60, fontWeight: 500 }}>{r.n}</span>
              <span style={{ fontSize: 36, fontWeight: 700 }}>{L.pieces}</span>
            </div>
          ))}
          {EN3.map((t, i) => (
            <TokChip key={i} text={t[0]} x={EN_ROW[i].x} y={EN_ROW[i].y} fs={42} color={TOKEN_COLORS[i % 6]} style={{ opacity: beat(frame, S.s2, 0.8 + i * 0.08, 0.3) }} />
          ))}
          {KO3.map((t, i) => (
            <TokChip
              key={i}
              text={t[0]}
              x={KO_ROW[i].x}
              y={KO_ROW[i].y}
              fs={42}
              partial={t.length === 3}
              color={TOKEN_COLORS[i % 6]}
              style={{ opacity: beat(frame, S.s2, 2.4 + i * 0.05, 0.25) }}
            />
          ))}
          <Hand x={760} y={406} fs={66} style={{ opacity: beat(frame, S.s2, 4.4, 0.4), rotate: "-4deg" }}>
            {L.times4}
          </Hand>

          {/* s3: one word, many byte pieces */}
          <div style={{ opacity: beat(frame, S.s3, 1.6, 0.5) }}>
            <div style={{ position: "absolute", left: 60, top: 720, fontSize: 46, fontWeight: 700 }}>{L.school}</div>
            {SCHOOL_BYTES.map((b, k) => (
              <TokChip
                key={k}
                text={b}
                x={250 + [0, 156, 256, 412][k]}
                y={712}
                w={k % 2 === 0 ? 146 : 90}
                fs={34}
                partial
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", opacity: beat(frame, S.s3, 2.0 + k * 0.25, 0.3) }}
              />
            ))}
            <div style={{ position: "absolute", left: 250, width: 246, top: 790, textAlign: "center", fontSize: 40, fontWeight: 700, borderTop: "4px solid var(--pen)", paddingTop: 4 }}>{L.hak}</div>
            <div style={{ position: "absolute", left: 506, width: 246, top: 790, textAlign: "center", fontSize: 40, fontWeight: 700, borderTop: "4px solid var(--pen)", paddingTop: 4 }}>{L.gyo}</div>
          </div>
          <Hand x={0} y={880} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 4.0, 0.4) }}>
            {L.bytesNote}
          </Hand>
          <Line y={970} fs={32} weight={500} color="var(--ink-3)" o={beat(frame, S.s3, 4.8, 0.4)}>
            {L.dashed}
          </Line>
        </div>
      )}

      {/* s4: no Hangul in GPT-3's list */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          <Line y={170} fs={54}>
            {L.vocab3}
          </Line>
          <div style={{ position: "absolute", left: 110, top: 270, width: 860, height: 330, borderRadius: 22, border: "4px solid var(--ink)", background: "var(--paper)", opacity: beat(frame, S.s4, 0.5, 0.4) }} />
          {EN_SAMPLES.map((t, i) => (
            <TokChip key={i} text={t} x={SAMPLE_ROW[i].x} y={SAMPLE_ROW[i].y} fs={46} color={TOKEN_COLORS[i % 6]} style={{ opacity: beat(frame, S.s4, 0.8 + i * 0.12, 0.3) }} />
          ))}
          <Hand x={0} y={630} fs={48} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 2.4, 0.4) }}>
            {L.mostlyEn}
          </Hand>
          <Line y={780} fs={68} o={beat(frame, S.s4, 3.8, 0.5)}>
            {L.hangul0} <InlineCircle p={beat(frame, S.s4, 4.6, 0.6)}>{L.zero}</InlineCircle>
          </Line>
        </div>
      )}

      {/* s5: why it matters */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5On }}>
          <Line y={160} fs={54}>
            {L.cost}
          </Line>
          {[
            { h: L.c1, d: L.c1d, c: "var(--hl-yellow)" },
            { h: L.c2, d: L.c2d, c: "var(--hl-mint)" },
            { h: L.c3, d: L.c3d, c: "var(--hl-sky)" },
          ].map((r, i) => {
            const a = beat(frame, S.s5, 0.8 + i * 1.6, 0.5);
            return (
              <div key={r.h} style={{ position: "absolute", left: 100, top: 280 + i * 190, width: 880, height: 150, borderRadius: 22, border: "3px solid var(--ink)", background: "var(--paper)", display: "flex", alignItems: "center", gap: 30, padding: "0 30px", boxSizing: "border-box", opacity: a, translate: `${mix(-30, 0, a)}px 0px` }}>
                <span style={{ fontSize: 50, fontWeight: 700, padding: "4px 20px", borderRadius: 14, background: r.c, color: "var(--chip-ink)", whiteSpace: "nowrap" }}>{r.h}</span>
                <span style={{ fontSize: 40, fontWeight: 500 }}>{r.d}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* s6–s7: three tokenizers, short sentence then a long paragraph */}
      {frame >= S.s6.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: barsOn }}>
          <Line y={130} fs={44} o={1 - toLong}>
            {MAIN.ko}
          </Line>
          <Line y={130} fs={44} o={toLong}>
            {L.long}
          </Line>
          <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", gap: 30, fontSize: 34, fontWeight: 700 }}>
            <span>
              <span style={{ display: "inline-block", width: 30, height: 30, borderRadius: 6, background: "var(--hl-pink)", verticalAlign: -4, marginRight: 10 }} />
              {L.ko}
            </span>
            <span>
              <span style={{ display: "inline-block", width: 30, height: 30, borderRadius: 6, background: "var(--hl-sky)", verticalAlign: -4, marginRight: 10 }} />
              {L.en}
            </span>
          </div>
          <div style={{ position: "absolute", left: 80, top: BASE - 2, width: 920, height: 5, background: "var(--ink)", borderRadius: 3 }} />
          {GX.map((cx, g) => {
            const a = beat(frame, S.s6, 0.6 + g * 1.2, 0.8, EASE_IO);
            return (
              <div key={g}>
                {[0, 1].map((k) => {
                  const h = mix(SHORT[g][k] * 30, LONGC[g][k] * 5.5, toLong) * a;
                  const x = cx - BAR_W - 6 + k * (BAR_W + 12);
                  return (
                    <div key={k}>
                      <div style={{ position: "absolute", left: x, top: BASE - h, width: BAR_W, height: h, borderRadius: "12px 12px 2px 2px", background: k === 0 ? "var(--hl-pink)" : "var(--hl-sky)" }} />
                      <div style={{ position: "absolute", left: x - 20, width: BAR_W + 40, top: BASE - h - 50, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 500, opacity: a }}>
                        {toLong > 0.5 ? LONGC[g][k] : SHORT[g][k]}
                      </div>
                    </div>
                  );
                })}
                <div style={{ position: "absolute", left: cx - 150, width: 300, top: BASE + 16, textAlign: "center", fontSize: 40, fontWeight: 700, opacity: a }}>{MODELS[g]}</div>
                <div style={{ position: "absolute", left: cx - 150, width: 300, top: BASE + 72, textAlign: "center", fontSize: 28, color: "var(--ink-2)", opacity: a * (1 - toLong) }}>
                  {L.hangulN} {HANGUL_TOKENS[g].toLocaleString("en-US")}
                </div>
                <Hand x={cx - 110} y={BASE + 70} fs={48} style={{ width: 220, textAlign: "center", opacity: beat(frame, S.s7, 2.0 + g * 0.6, 0.4) }}>
                  {RATIOS[g]}
                </Hand>
              </div>
            );
          })}
          <Hand x={GX[2] - 160} y={440} fs={50} style={{ opacity: beat(frame, S.s6, 4.8, 0.4) * (1 - toLong), rotate: "-4deg" }}>
            {L.same}
          </Hand>
          <PenCircle x={GX[0] - 120} y={BASE + 68} w={240} h={70} p={beat(frame, S.s7, 4.4, 0.5)} />
          <PenCircle x={GX[2] - 120} y={BASE + 68} w={240} h={70} p={beat(frame, S.s7, 5.0, 0.5)} />
          <Line y={950} fs={28} weight={500} color="var(--ink-3)" o={beat(frame, S.s6, 3.0, 0.4)}>
            {L.src}：r50k_base · cl100k_base · o200k_base
          </Line>
        </div>
      )}

      {/* s8: the answer */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          <Line y={260} fs={62}>
            <InlineCircle p={beat(frame, S.s8, 0.6, 0.6)}>{L.q}</InlineCircle>
          </Line>
          {[
            { t: L.a1, c: "var(--hl-pink)", y: 440, at: 1.6 },
            { t: L.a2, c: "var(--hl-mint)", y: 560, at: 3.0 },
          ].map((r) => (
            <div key={r.t} style={{ position: "absolute", left: 0, right: 0, top: r.y, display: "flex", justifyContent: "center", opacity: beat(frame, S.s8, r.at, 0.5) }}>
              <span style={{ fontSize: 48, fontWeight: 700, padding: "6px 26px", borderRadius: 14, background: r.c, color: "var(--chip-ink)" }}>{r.t}</span>
            </div>
          ))}
          <Hand x={0} y={740} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 4.6, 0.5) }}>
            {L.dep}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch31.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
