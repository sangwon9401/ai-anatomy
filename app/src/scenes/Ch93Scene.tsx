import type { FC } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { AFTER30, DEMO_LINES, IDS, MERGED30, PAIRS, TOKENS_BY_MERGE, TRADE, VOCAB_HEAD, ch93 } from "../data/ch93";
import type { Highlighter } from "../data/types";
import { Caption, Chip, EASE_IO, Hand, InlineUnderline, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, wrapLayout, type SceneProps } from "./kit";
import { Arrow, Box, Txt, fade, live } from "./part11-kit";

const tl = buildTimeline(ch93);
const S = byId(tl);
const L = ch93.labels;

const PALETTE: Highlighter[] = ["yellow", "mint", "sky", "pink", "violet", "orange"];
const colorOf = (id: number) => PALETTE[id % PALETTE.length];

/** x of each piece in a row; spaces become a narrow gap of width `space`. */
function row(pieces: string[], fs: number, gap: number, space: number, center?: number, x0 = 80) {
  const ws = pieces.map((p) => (p === " " ? space : chipWidth(p, fs)));
  const total = ws.reduce((a, b) => a + b, 0) + gap * (pieces.length - 1);
  let x = center === undefined ? x0 : center - total / 2;
  return ws.map((w) => {
    const at = { x, w };
    x += w + gap;
    return at;
  });
}

// s1: one sentence, one token per character
const S1_FS = 52;
const S1 = row(
  IDS.map(([p]) => p),
  S1_FS,
  12,
  48,
  540,
);

// s3–s4: three lines where 는+다 appears, before and after the merge
const LFS = 42;
const LINE_Y = [660, 770, 880];
const splitLine = (l: string) => [...l];
const DEMO = DEMO_LINES.map((l) => {
  const before = splitLine(l);
  const after = [...before.slice(0, -2), "는다"];
  return { before, after, pb: row(before, LFS, 8, 22), pa: row(after, LFS, 8, 22) };
});

const OUTLINE = { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" };

export const Ch93Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1 = fade(frame, S.s1, S.s2, 0);
  const s2 = fade(frame, S.s2, S.s3);
  const s3table = fade(frame, S.s3, S.s4);
  const lines = fade(frame, S.s3, S.s5);
  const s4top = fade(frame, S.s4, S.s5, 2.6);
  const s5 = fade(frame, S.s5, S.s6);
  const s6 = fade(frame, S.s6, S.s7);
  const s7 = fade(frame, S.s7);
  const merge = beat(frame, S.s4, 1.0, 1.2, EASE_IO);

  // s5: merges counted up 1 → 30
  const k = Math.round(interpolate(frame, [S.s5.from + 1.0 * 30, S.s5.from + 5.5 * 30], [1, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const merged = wrapLayout(
    MERGED30.map((t) => chipWidth(t, 36)),
    { x0: 80, y0: 370, maxW: 920, gap: 12, lineH: 72 },
  );
  const after30 = row(AFTER30, 36, 8, 22, 540);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: characters → token numbers */}
      {live(frame, S.s1, S.s2) && (
        <div style={{ opacity: s1 }}>
          <Txt x={0} y={150} w={1080} fs={60} bold align="center" style={{ opacity: beat(frame, S.s1, 0.2, 0.4) }}>
            {IDS.map(([p]) => p).join("")}
          </Txt>
          <Arrow x1={540} y1={250} x2={540} y2={300} p={beat(frame, S.s1, 0.9, 0.3)} />
          {IDS.map(([p, id], i) => {
            const o = beat(frame, S.s1, 1.2 + i * 0.22, 0.3);
            const pos = S1[i];
            const idO = beat(frame, S.s1, 3.8 + i * 0.12, 0.3);
            return (
              <div key={i}>
                {p === " " ? (
                  <div style={{ position: "absolute", left: pos.x, top: 320, width: pos.w, height: S1_FS * 1.5, borderRadius: 12, border: "3px dashed var(--ink-3)", opacity: o }} />
                ) : (
                  <Chip text={p} color={colorOf(id)} fs={S1_FS} x={pos.x} y={320} style={{ opacity: o, translate: `0px ${mix(-12, 0, o)}px` }} />
                )}
                <Txt x={pos.x - 20} y={414} w={pos.w + 40} fs={32} align="center" style={{ fontFamily: "var(--font-mono)", opacity: idO }}>
                  {id}
                </Txt>
              </div>
            );
          })}
          <Txt x={0} y={480} w={1080} fs={36} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s1, 5.4, 0.4) }}>
            ↑ {L.reads}
          </Txt>
          <Hand x={0} y={620} fs={66} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 6.6, 0.4) }}>
            <InlineUnderline p={beat(frame, S.s1, 7.0, 0.6)}>{L.oneToOne}</InlineUnderline>
          </Hand>
        </div>
      )}

      {/* s2: the corpus in numbers */}
      {live(frame, S.s2, S.s3) && (
        <div style={{ opacity: s2 }}>
          <Txt x={0} y={160} w={1080} fs={44} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s2, 0.4, 0.4) }}>
            {L.tokens}
          </Txt>
          <Txt x={0} y={214} w={1080} fs={96} bold align="center" style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s2, 0.6, 0.4) }}>
            {L.tokensN}
          </Txt>
          <Txt x={0} y={380} w={1080} fs={44} align="center" style={{ color: "var(--ink-2)", opacity: beat(frame, S.s2, 2.6, 0.4) }}>
            {L.vocab}
          </Txt>
          <Txt x={0} y={434} w={1080} fs={96} bold align="center" style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s2, 2.8, 0.4) }}>
            {L.vocabN}
          </Txt>
          <Txt x={80} y={630} fs={36} bold style={{ opacity: beat(frame, S.s2, 4.2, 0.4) }}>
            {L.dict}
          </Txt>
          {wrapLayout(
            [...VOCAB_HEAD, L.more].map((t, i) => (i === VOCAB_HEAD.length ? 200 : chipWidth(t, 38))),
            { x0: 80, y0: 690, maxW: 920, gap: 10, lineH: 74 },
          ).map((pos, i) =>
            i === VOCAB_HEAD.length ? (
              <Txt key="more" x={pos.x + 6} y={pos.y + 6} fs={38} style={{ color: "var(--ink-2)", opacity: beat(frame, S.s2, 4.4 + i * 0.08, 0.3) }}>
                {L.more}
              </Txt>
            ) : (
              <Chip key={i} text={VOCAB_HEAD[i]} color={null} fs={38} x={pos.x} y={pos.y} style={{ opacity: beat(frame, S.s2, 4.4 + i * 0.08, 0.3) }} />
            ),
          )}
          <Hand x={80} y={900} fs={48} style={{ opacity: beat(frame, S.s2, 6.4, 0.4), rotate: "-2deg" }}>
            {L.newline}
          </Hand>
        </div>
      )}

      {/* s3: count the pairs */}
      {live(frame, S.s3, S.s4) && (
        <div style={{ opacity: s3table }}>
          <Txt x={0} y={150} w={1080} fs={46} bold align="center">
            {L.count}
          </Txt>
          {PAIRS.map((p, i) => {
            const y = 250 + i * 92;
            const o = beat(frame, S.s3, 0.8 + i * 0.5, 0.4);
            return (
              <div key={p.a + p.b} style={{ opacity: o }}>
                {i === 0 && <div style={{ position: "absolute", left: 300, top: y - 8, width: 480, height: 82, borderRadius: 14, background: "var(--hl-yellow)", opacity: beat(frame, S.s3, 3.4, 0.4) }} />}
                <Chip text={p.a} color={null} fs={44} x={360} y={y} style={OUTLINE} />
                <Txt x={450} y={y + 4} fs={44} style={{ color: "var(--ink-3)" }}>
                  +
                </Txt>
                <Chip text={p.b} color={null} fs={44} x={494} y={y} style={OUTLINE} />
                <Txt x={620} y={y + 4} fs={46} bold style={{ fontFamily: "var(--font-mono)", color: i === 0 ? "var(--chip-ink)" : "var(--ink)" }}>
                  {p.n}
                  {L.times}
                </Txt>
              </div>
            );
          })}
          <Hand x={810} y={236} fs={54} style={{ opacity: beat(frame, S.s3, 4.0, 0.4), rotate: "-6deg" }}>
            {L.top}
          </Hand>
        </div>
      )}

      {/* s3–s4: the merge happening inside the lines */}
      {live(frame, S.s3, S.s5) && (
        <div style={{ opacity: lines }}>
          {DEMO.map((d, li) => {
            const y = LINE_Y[li];
            const o = beat(frame, S.s3, 5.2 + li * 0.4, 0.4);
            const n = d.before.length;
            return (
              <div key={li} style={{ opacity: o }}>
                {d.before.map((p, i) => {
                  if (p === " ") return null;
                  const isPair = i >= n - 2;
                  const tx = isPair ? mix(d.pb[i].x, d.pa[n - 2].x + (i - (n - 2)) * 30, merge) : d.pb[i].x;
                  return (
                    <Chip
                      key={i}
                      text={p}
                      color={isPair ? (frame >= S.s3.from + 6.6 * 30 ? "yellow" : null) : null}
                      fs={LFS}
                      x={tx}
                      y={y}
                      style={{ opacity: isPair ? 1 - merge : 1 }}
                    />
                  );
                })}
                <Chip text="는다" color="yellow" fs={LFS} x={d.pa[n - 2].x} y={y} style={{ opacity: merge, scale: String(mix(0.8, 1, merge)) }} />
              </div>
            );
          })}
        </div>
      )}

      {/* s4: the counters after one merge */}
      {live(frame, S.s4, S.s5) && (
        <div style={{ opacity: s4top }}>
          <Txt x={0} y={170} w={1080} fs={40} align="center" style={{ color: "var(--ink-2)" }}>
            {L.after}
          </Txt>
          <Txt x={0} y={250} w={1080} fs={58} bold align="center">
            {L.t1}
          </Txt>
          <Txt x={0} y={350} w={1080} fs={58} bold align="center" style={{ opacity: beat(frame, S.s4, 4.6, 0.4) }}>
            {L.v1}
          </Txt>
          <Hand x={760} y={560} fs={52} style={{ opacity: beat(frame, S.s4, 2.4, 0.4), rotate: "-4deg" }}>
            {L.merge}!
          </Hand>
        </div>
      )}

      {/* s5: thirty merges */}
      {live(frame, S.s5, S.s6) && (
        <div style={{ opacity: s5 }}>
          <Txt x={0} y={150} w={1080} fs={40} align="center" style={{ color: "var(--ink-2)" }}>
            {L.after.replace("1", String(k))}
          </Txt>
          <Txt x={0} y={210} w={1080} fs={64} bold align="center" style={{ fontFamily: "var(--font-mono)" }}>
            {L.tokens} {TOKENS_BY_MERGE[k].toLocaleString("en-US")}개
          </Txt>
          <Txt x={80} y={318} fs={32} style={{ color: "var(--ink-2)" }}>
            {L.merged}
          </Txt>
          {MERGED30.map((t, i) =>
            i < k ? <Chip key={t} text={t} color={PALETTE[i % PALETTE.length]} fs={36} x={merged[i].x} y={merged[i].y} /> : null,
          )}
          <div style={{ opacity: beat(frame, S.s5, 6.0, 0.5) }}>
            <Txt x={0} y={760} w={1080} fs={34} align="center" style={{ color: "var(--ink-2)" }}>
              {L.example}
            </Txt>
            {AFTER30.map((p, i) =>
              p === " " ? null : (
                <Chip key={i} text={p} color={p.length > 1 ? "yellow" : null} fs={36} x={after30[i].x} y={830} style={p.length > 1 ? undefined : OUTLINE} />
              ),
            )}
          </div>
        </div>
      )}

      {/* s6: the trade-off */}
      {live(frame, S.s6, S.s7) && (
        <div style={{ opacity: s6 }}>
          {[L.mergesCol, L.tokensCol, L.vocabCol].map((h, i) => (
            <Txt key={h} x={[90, 380, 700][i]} y={170} w={[220, 300, 300][i]} fs={40} bold align="center" style={{ color: "var(--ink-2)" }}>
              {h}
            </Txt>
          ))}
          {TRADE.map((r, i) => {
            const y = 270 + i * 110;
            return (
              <div key={r.merges} style={{ opacity: beat(frame, S.s6, 0.5 + i * 0.6, 0.4) }}>
                <div style={{ position: "absolute", left: 80, top: y - 20, width: 920, height: 2, background: "var(--grid-major)" }} />
                <Txt x={90} y={y} w={220} fs={48} align="center" style={{ fontFamily: "var(--font-mono)" }}>
                  {r.merges}
                </Txt>
                <Txt x={380} y={y} w={300} fs={48} bold align="center" style={{ fontFamily: "var(--font-mono)" }}>
                  {r.tokens}
                </Txt>
                <Txt x={700} y={y} w={300} fs={48} bold align="center" style={{ fontFamily: "var(--font-mono)" }}>
                  {r.vocab}
                </Txt>
              </div>
            );
          })}
          <Arrow x1={530} y1={600} x2={530} y2={690} p={beat(frame, S.s6, 2.6, 0.4)} color="var(--pen)" />
          <Hand x={560} y={616} fs={46} style={{ opacity: beat(frame, S.s6, 2.8, 0.4) }}>
            {L.fewer}
          </Hand>
          <Arrow x1={850} y1={690} x2={850} y2={600} p={beat(frame, S.s6, 3.6, 0.4)} color="var(--pen)" />
          <Hand x={880} y={616} fs={46} style={{ opacity: beat(frame, S.s6, 3.8, 0.4) }}>
            {L.moreV}
          </Hand>
          <Txt x={0} y={760} w={1080} fs={40} align="center" style={{ opacity: beat(frame, S.s6, 5.0, 0.4) }}>
            {L.emb}
          </Txt>
          <Chip text={L.gpt3} color="violet" fs={46} x={540 - chipWidth(L.gpt3, 46) / 2} y={870} style={{ opacity: beat(frame, S.s6, 7.4, 0.4) }} />
        </div>
      )}

      {/* s7: the tokenizer goes into the model */}
      {live(frame, S.s7) && (
        <div style={{ opacity: s7 }}>
          <Box x={80} y={300} w={420} h={220} style={{ background: "var(--hl-yellow)", border: "none", color: "var(--chip-ink)", alignContent: "center", gap: 10, gridTemplateRows: "auto auto" }}>
            <span style={{ fontSize: 46, fontWeight: 700 }}>{L.mine}</span>
            <span style={{ fontSize: 30 }}>{L.mineSub}</span>
          </Box>
          <Arrow x1={516} y1={410} x2={592} y2={410} p={beat(frame, S.s7, 1.6, 0.4)} color="var(--pen)" width={7} />
          <Box x={600} y={300} w={400} h={220} style={{ opacity: beat(frame, S.s7, 2.0, 0.4), fontSize: 46, fontWeight: 700 }}>
            {L.model}
          </Box>
          {MERGED30.slice(0, 4).map((t, i) => (
            <Chip key={t} text={t} color={PALETTE[i]} fs={36} x={90 + i * 108} y={560} style={{ opacity: beat(frame, S.s7, 0.8 + i * 0.15, 0.3) }} />
          ))}
          <Hand x={0} y={720} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.0, 0.4), rotate: "-1deg" }}>
            {L.zero}
          </Hand>
          <PenCircle x={90} y={686} w={900} h={136} p={beat(frame, S.s7, 6.6, 0.7)} />
        </div>
      )}

      <Narration tl={tl} chapter={ch93.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
