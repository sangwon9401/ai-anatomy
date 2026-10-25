// en: overlay of src/scenes/Ch40Scene.tsx: the s7 word chips are spaced wider for 'Yesterday' and 'at school', and the
// notes use a smaller font so the English slot names ('where') fit.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { LENGTHS, RELAY, RELAY_B, SLOTS, VERBS, ch40, predictVerb, rnnRun } from "../../../data/ch40";
import { Arrow, BarRow, Box, Demo, Note, SlotNote } from "../../../scenes/part4-kit";
import {
  Caption,
  Chip,
  EASE_IO,
  Hand,
  InlineUnderline,
  Narration,
  Paper,
  PenCircle,
  Tag,
  beat,
  buildTimeline,
  byId,
  chipWidth,
  mix,
  rowLayout,
  type SceneProps,
} from "../../../scenes/kit";

const tl = buildTimeline(ch40);
const S = byId(tl);
const L = ch40.labels;

const OUTLINE = { background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)" } as const;

// s1: sentences of different lengths, same 3-word window
const LFS = 40;
const LROWS = LENGTHS.map((ws, r) => {
  const widths = ws.map((w) => chipWidth(w, LFS));
  let x = 80;
  const xs = widths.map((w) => {
    const at = x;
    x += w + 10;
    return at;
  });
  return { ws, widths, xs, y: 270 + r * 120 };
});

// s2–s6: the relay
const CELL_W = 200;
const CELL_H = 140;
const CELL_X = rowLayout([CELL_W, CELL_W, CELL_W], 100);
const CELL_Y = 420;
const NOTE_W = 292;
const NOTE_Y = 150;
const WORD_Y = 640;
const WFS = 46;
const NOTES_A = rnnRun(RELAY);
const NOTES_B = rnnRun(RELAY_B);
const P_A = predictVerb(NOTES_A[2].h);
const P_B = predictVerb(NOTES_B[2].h);
const pct = (p: number) => `${Math.round(p * 100)}%`;
const SHOW_AT = [0.8, 4.0, 7.0]; // s3: when each cell writes its note
const PASS_AT = [3.0, 6.0]; // s3: when the note travels to the next cell
const RULE_OLD = NOTES_A[0].h[0];
const RULE_MID = 0.8 * RULE_OLD;
const RULE_NEW = NOTES_A[1].h[0];
// the s7 loop: two cubic curves from the cell's right side, over the top, back into its left side
const LOOP: [number, number][][] = [
  [
    [680, 560],
    [820, 560],
    [820, 380],
    [540, 380],
  ],
  [
    [540, 380],
    [260, 380],
    [260, 560],
    [400, 560],
  ],
];
const bez = (c: [number, number][], t: number): [number, number] => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * c[0][k] + 3 * u * u * t * c[1][k] + 3 * u * t * t * c[2][k] + t * t * t * c[3][k]) as [number, number];
};
const loopAt = (f: number) => (f < 0.5 ? bez(LOOP[0], f * 2) : bez(LOOP[1], f * 2 - 1));
const f2 = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));

export const Ch40Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const relayOn = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.6));
  const ruleOn = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.4));
  const predOn = beat(frame, S.s5, 0.4, 0.5);
  const swap = beat(frame, S.s6, 0.6, 0.8, EASE_IO);
  const s7On = beat(frame, S.s7, 0.5, 0.6);

  // which notes are visible (s3 onward), and their content (A, then B in s6)
  const noteIn = (k: number) => (frame < S.s3.from ? 0 : beat(frame, S.s3, SHOW_AT[k], 0.5));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: a fixed window vs sentences of any length */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <div style={{ position: "absolute", left: 80, top: 160, fontSize: 42, fontWeight: 700 }}>{L.fixed}</div>
          {LROWS.map((row, r) => {
            const a = beat(frame, S.s1, 0.6 + r * 0.5, 0.4);
            const n = row.ws.length;
            const left = row.xs[n - 3] - 10;
            const right = row.xs[n - 1] + row.widths[n - 1] + 10;
            return (
              <div key={r} style={{ opacity: a }}>
                {row.ws.map((w, i) => (
                  <Chip key={i} text={w} fs={LFS} color={null} x={row.xs[i]} y={row.y} w={row.widths[i]} style={{ ...OUTLINE, opacity: i < n - 3 ? 0.35 : 1 }} />
                ))}
                <div style={{ position: "absolute", left, top: row.y - 10, width: right - left, height: LFS * 1.5 + 20, border: "5px solid var(--pen)", borderRadius: 14, boxSizing: "border-box", opacity: beat(frame, S.s1, 1.8 + r * 0.3, 0.4) }} />
              </div>
            );
          })}
          <Hand x={LROWS[0].xs[2] + LROWS[0].widths[2] + 40} y={LROWS[0].y + 6} fs={42} style={{ opacity: beat(frame, S.s1, 2.2, 0.4) }}>
            {L.window}
          </Hand>
          <Note x={140} y={720} w={260} h={190} rotate={-4} o={beat(frame, S.s1, 5.0, 0.5)} lines={[{ text: L.note }]} fs={48} />
          <Hand x={440} y={770} fs={50} style={{ opacity: beat(frame, S.s1, 5.6, 0.5), width: 560, whiteSpace: "normal", lineHeight: 1.25 }}>
            {L.idea}
          </Hand>
        </div>
      )}

      {/* s2–s6: the relay */}
      {frame >= S.s2.from && frame < S.s7.from + 18 && (
        <div style={{ opacity: relayOn }}>
          {/* empty note going in */}
          <div style={{ opacity: beat(frame, S.s2, 1.6, 0.4) }}>
            <div style={{ position: "absolute", left: 56, top: CELL_Y + 48, width: 58, height: 44, borderRadius: "4px 4px 4px 12px", border: "3px solid var(--ink)", background: "var(--hl-yellow)", rotate: "-4deg" }} />
            <Arrow x1={118} y1={CELL_Y + 70} x2={CELL_X[0] - 6} y2={CELL_Y + 70} p={beat(frame, S.s2, 1.8, 0.4)} width={5} />
            <Hand x={40} y={CELL_Y + CELL_H + 14} fs={32} color="var(--ink-2)" style={{ opacity: beat(frame, S.s2, 2.0, 0.4) * (1 - beat(frame, S.s3, 0, 0.4)) }}>
              {L.empty}
            </Hand>
          </div>

          {RELAY.map((w, k) => {
            const cellIn = beat(frame, S.s2, 0.6 + k * 0.3, 0.4);
            const x = CELL_X[k];
            const reading = frame >= S.s3.from && frame < S.s4.from ? beat(frame, S.s3, SHOW_AT[k] - 0.6, 0.3) * (k === 2 ? 1 : 1 - beat(frame, S.s3, PASS_AT[k] ?? 99, 0.3)) : 0;
            return (
              <div key={k}>
                <Box x={x} y={CELL_Y} w={CELL_W} h={CELL_H} o={cellIn} style={{ outline: reading > 0.5 ? "6px solid var(--pen)" : undefined, outlineOffset: 4 }}>
                  <div style={{ fontSize: 40, fontWeight: 700 }}>{L.cell}</div>
                </Box>
                {/* the word fed into this cell */}
                <div style={{ opacity: cellIn }}>
                  <Chip text={w} fs={WFS} color={k === 0 ? "mint" : null} x={x + CELL_W / 2 - chipWidth(w, WFS) / 2} y={WORD_Y} style={k === 0 ? { opacity: 1 - swap } : OUTLINE} />
                  {k === 0 && swap > 0 && <Chip text={RELAY_B[0]} fs={WFS} color="sky" x={x + CELL_W / 2 - chipWidth(RELAY_B[0], WFS) / 2} y={WORD_Y} style={{ opacity: swap }} />}
                  <Arrow x1={x + CELL_W / 2} y1={WORD_Y - 8} x2={x + CELL_W / 2} y2={CELL_Y + CELL_H + 8} p={beat(frame, S.s2, 1.0 + k * 0.3, 0.4)} width={5} />
                </div>
                {/* hand-off arrow to the next cell, with a travelling note */}
                {k < 2 && (
                  <>
                    <Arrow x1={x + CELL_W + 8} y1={CELL_Y + 70} x2={CELL_X[k + 1] - 8} y2={CELL_Y + 70} p={beat(frame, S.s2, 2.6 + k * 0.4, 0.4)} width={5} />
                    {(() => {
                      const t2 = beat(frame, S.s2, 4.0 + k * 0.9, 0.8, EASE_IO);
                      const t3 = frame >= S.s3.from ? beat(frame, S.s3, PASS_AT[k], 0.9, EASE_IO) : 0;
                      const t = frame >= S.s3.from ? t3 : t2;
                      const on = t > 0 && t < 1 ? 1 : 0;
                      return (
                        <div style={{ position: "absolute", left: mix(x + CELL_W - 20, CELL_X[k + 1] - 40, t), top: CELL_Y + 22, width: 58, height: 44, borderRadius: "4px 4px 4px 12px", border: "3px solid var(--ink)", background: "var(--hl-yellow)", rotate: "-4deg", opacity: on }} />
                      );
                    })()}
                  </>
                )}
                {/* the note this cell wrote */}
                {frame >= S.s3.from && (
                  <div style={{ opacity: noteIn(k), translate: `0px ${mix(30, 0, noteIn(k))}px` }}>
                    <SlotNote x={x + CELL_W / 2 - NOTE_W / 2} y={NOTE_Y} w={NOTE_W} slots={SLOTS} h={NOTES_A[k].h} gist={NOTES_A[k].gist} o={1 - swap} rotate={k % 2 ? 1.5 : -1.5} fs={34} />
                    {swap > 0 && <SlotNote x={x + CELL_W / 2 - NOTE_W / 2} y={NOTE_Y} w={NOTE_W} slots={SLOTS} h={NOTES_B[k].h} gist={NOTES_B[k].gist} o={swap} rotate={k % 2 ? 1.5 : -1.5} tint="var(--hl-sky)" fs={34} />}
                    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                      <line x1={x + CELL_W / 2} y1={CELL_Y - 4} x2={x + CELL_W / 2} y2={NOTE_Y + 214} stroke="var(--ink-3)" strokeWidth={4} strokeDasharray="6 8" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
          <Hand x={0} y={760} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 8.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.4)) }}>
            '{NOTES_A[0].gist[0]}' {f2(NOTES_A[0].h[0])} → {f2(NOTES_A[1].h[0])} → {f2(NOTES_A[2].h[0])}
          </Hand>

          {/* s4: one rule for every cell */}
          {frame >= S.s4.from && frame < S.s5.from + 15 && (
            <div style={{ opacity: ruleOn }}>
              {CELL_X.map((x, k) => (
                <PenCircle key={k} x={x - 16} y={CELL_Y - 12} w={CELL_W + 32} h={CELL_H + 24} p={beat(frame, S.s4, 0.6 + k * 0.25, 0.5)} stroke={5} />
              ))}
              <Hand x={0} y={752} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 1.4, 0.4) }}>
                {L.same}
              </Hand>
              <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s4, 2.6, 0.4) }}>{L.rule}</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 892, textAlign: "center", fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s4, 4.4, 0.4) }}>{L.squash}</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 34, opacity: beat(frame, S.s4, 5.6, 0.4) }}>
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}>{L.example}</span> 0.8 × ({f2(RULE_OLD)}) + 0 = {f2(RULE_MID)} → <b>{f2(RULE_NEW)}</b>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 1020, textAlign: "center", fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s4, 6.4, 0.4) }}>{L.toy}</div>
            </div>
          )}

          {/* s5–s6: the last note predicts the next word */}
          {frame >= S.s5.from && (
            <div style={{ opacity: predOn }}>
              <PenCircle x={CELL_X[2] + CELL_W / 2 - NOTE_W / 2 - 22} y={NOTE_Y - 22} w={NOTE_W + 44} h={262} p={beat(frame, S.s5, 0.6, 0.6) * (1 - swap)} />
              <div style={{ position: "absolute", left: 130, top: 744, fontSize: 40, fontWeight: 700 }}>{L.lastNote}</div>
              {VERBS.map((v, i) => {
                const p = mix(P_A[i], P_B[i], swap);
                return (
                  <BarRow key={v.w} x={130} y={812 + i * 60} label={v.w} p={p} scale={640} color={`var(--hl-${v.c})`} grow={beat(frame, S.s5, 1.4 + i * 0.2, 0.6)} fs={40} labelW={190} text={pct(p)} />
                );
              })}
              <Demo text={L.toy.split(":")[0]} o={1} top={40} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", opacity: beat(frame, S.s5, 5.0, 0.5) * (1 - swap) }}>
                <span style={{ fontSize: 34, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 10, padding: "2px 16px" }}>{L.hidden}</span>
              </div>
              <Hand x={0} y={996} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.4, 0.5) }}>
                <InlineUnderline p={beat(frame, S.s6, 4.8, 0.6)}>{L.carried}</InlineUnderline>
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s7: unrolled = folded loop */}
      {frame >= S.s7.from && (
        <div style={{ opacity: s7On }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontSize: 60, fontWeight: 700 }}>{L.rnn}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 255, textAlign: "center", fontSize: 34, color: "var(--ink-2)" }}>{L.rnnEn}</div>
          <Box x={410} y={500} w={260} h={170} o={beat(frame, S.s7, 0.8, 0.4)}>
            <div style={{ fontSize: 44, fontWeight: 700 }}>{L.cell}</div>
          </Box>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d="M 680 560 C 820 560, 820 380, 540 380 C 260 380, 260 560, 400 560"
              fill="none"
              stroke="var(--pen)"
              strokeWidth={7}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - beat(frame, S.s7, 1.4, 1.0)}
            />
            {beat(frame, S.s7, 1.4, 1.0) > 0.97 && <path d="M 380 545 L 402 560 L 382 578" fill="none" stroke="var(--pen)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
          {(() => {
            // the note rides the loop two and a half times, then rests on top
            const P = beat(frame, S.s7, 2.6, 3.0, (t) => t) * 2.5;
            if (P <= 0) return null;
            const f = P - Math.floor(P) || (P > 0 ? 1 : 0);
            const [nx, ny] = loopAt(f);
            return <div style={{ position: "absolute", left: nx - 29, top: ny - 22, width: 58, height: 44, borderRadius: "4px 4px 4px 12px", border: "3px solid var(--ink)", background: "var(--hl-yellow)", rotate: "-4deg" }} />;
          })()}
          <Hand x={700} y={330} fs={40} style={{ opacity: beat(frame, S.s7, 2.0, 0.4) }}>
            {L.note}
          </Hand>
          {RELAY.map((w, i) => {
            const a = beat(frame, S.s7, 2.4 + i * 0.6, 0.5);
            return <Chip key={w} text={w} fs={44} color={i === 0 ? "mint" : null} x={540 - chipWidth(w, 44) / 2 + (i - 1) * 300} y={790} style={{ ...(i === 0 ? {} : OUTLINE), opacity: a }} />;
          })}
          <Arrow x1={540} y1={780} x2={540} y2={686} p={beat(frame, S.s7, 2.2, 0.4)} width={6} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontSize: 40, fontWeight: 500, opacity: beat(frame, S.s7, 4.2, 0.4) }}>
            {L.unrolled} = {L.folded}
          </div>
          <Hand x={0} y={940} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 6.4, 0.4) }}>
            {L.anyLen}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1016, textAlign: "center", opacity: beat(frame, S.s7, 8.2, 0.5) }}>
            <span style={{ fontSize: 40, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 12, padding: "4px 20px" }}>{L.next}</span>
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch40.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
