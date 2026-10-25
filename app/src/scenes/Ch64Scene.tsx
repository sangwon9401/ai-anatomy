import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { SENT, ch64 } from "../data/ch64";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, PenUnderline, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "./kit";
import { Arrow, Box, Center, Doc, Layer, T } from "./part7-kit";

const tl = buildTimeline(ch64);
const S = byId(tl);
const L = ch64.labels;

const COLORS = ["yellow", "mint", "sky", "orange", "violet"] as const;

// the sentence on top
const FS = 52;
const SW = SENT.map((w) => chipWidth(w, FS));
const SX = rowLayout(SW, 16);

// question rows
const FR = 46;
const RX0 = 200;
const RGAP = 14;
const ROW_Y = [300, 450, 600, 750];
const RW = SENT.map((w) => chipWidth(w, FR));
const ROWS = SENT.slice(1).map((answer, k) => {
  const xs: number[] = [];
  let x = RX0;
  for (let i = 0; i <= k; i++) {
    xs.push(x);
    x += RW[i] + RGAP;
  }
  const slotW = Math.max(chipWidth(answer, FR), 110);
  return { k, xs, slotX: x, slotW, answer, y: ROW_Y[k] };
});
const CH = FR * 1.5;

// when each row appears / gets its answer: [step, ctx, slot, reveal]
const ROW_T = [
  { st: "s3", ctx: 0.6, slot: 1.2, reveal: 5.4 },
  { st: "s4", ctx: 0.4, slot: 0.9, reveal: 3.4 },
  { st: "s4", ctx: 4.4, slot: 4.9, reveal: 6.9 },
  { st: "s5", ctx: 0.4, slot: 0.9, reveal: 2.2 },
] as const;

const MASK_R = 980;

export const Ch64Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0, 0.3) * (1 - beat(frame, S.s2, 0, 0.4));
  const sentOn = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const lift = beat(frame, S.s3, 0, 0.8, EASE_IO);
  const sentY = mix(290, 140, lift);
  const s2Notes = 1 - beat(frame, S.s3, 0, 0.4);
  const labelsOn = 1 - beat(frame, S.s6, 0, 0.4);
  const mask = beat(frame, S.s6, 0.6, 0.8);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: answers written by people vs the whole internet */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Box x={90} y={160} w={520} h={96} r={16} bw={3} fill="var(--paper-2)" o={beat(frame, S.s1, 0.3, 0.4)}>
            <span style={{ fontSize: 38, fontWeight: 500 }}>{L.spamMsg}</span>
          </Box>
          <Layer o={beat(frame, S.s1, 0.9, 0.3)}>
            <Arrow x1={630} y1={208} x2={740} y2={208} p={beat(frame, S.s1, 0.9, 0.4)} />
          </Layer>
          <Chip text={L.spam} color="pink" fs={48} x={760} y={172} style={{ opacity: beat(frame, S.s1, 1.3, 0.4) }} />
          <Hand x={640} y={270} fs={42} style={{ opacity: beat(frame, S.s1, 1.8, 0.4) }}>
            {L.byPerson}
          </Hand>
          <T x={90} y={400} fs={46} bold o={beat(frame, S.s1, 4.4, 0.4)}>
            {L.allWeb}
          </T>
          {Array.from({ length: 21 }, (_, i) => {
            const c = i % 7;
            const r = Math.floor(i / 7);
            const o = beat(frame, S.s1, 4.8 + i * 0.06, 0.3);
            return (
              <div key={i} style={{ opacity: o }}>
                <Doc x={100 + c * 128} y={480 + r * 140} w={86} fill={`var(--hl-${COLORS[(i * 3) % 5]})`} rot={((i * 37) % 9) - 4} />
                <Hand x={160 + c * 128} y={452 + r * 140} fs={44}>
                  ?
                </Hand>
              </div>
            );
          })}
          <Hand x={0} y={925} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 7.2, 0.5), rotate: "-2deg" }}>
            {L.impossible}
          </Hand>
        </div>
      )}

      {/* the sentence */}
      {frame >= S.s2.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: sentOn }}>
          {SENT.map((w, i) => (
            <Chip key={i} text={w} color={COLORS[i]} fs={FS} x={SX[i]} y={sentY} style={{ opacity: beat(frame, S.s2, 3.0 + i * 0.25, 0.4) }} />
          ))}
          {/* answers come from the sentence itself */}
          {ROWS.map((r) => {
            const t = ROW_T[r.k];
            const p = beat(frame, S[t.st], t.reveal, 0.5);
            return <PenUnderline key={r.k} x={SX[r.k + 1] + 6} y={sentY + FS * 1.5 + 4} w={SW[r.k + 1] - 12} p={p} />;
          })}
          <div style={{ opacity: s2Notes }}>
            <Hand x={0} y={420} fs={40} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 4.8, 0.4) }}>
              {L.finer}
            </Hand>
            <Center y={600} fs={60} o={beat(frame, S.s2, 0.6, 0.5)}>
              <InlineCircle p={beat(frame, S.s2, 1.4, 0.7)}>{L.textIs}</InlineCircle>
            </Center>
          </div>

          {/* question rows */}
          {ROWS.map((r) => {
            const t = ROW_T[r.k];
            const st = S[t.st];
            if (frame < st.from) return null;
            const ctx = beat(frame, st, t.ctx, 0.4);
            const slot = beat(frame, st, t.slot, 0.3);
            const rev = beat(frame, st, t.reveal, 0.5);
            return (
              <div key={r.k}>
                <T x={64} y={r.y + 16} fs={34} color="var(--ink-2)" o={ctx * labelsOn}>
                  {L.q} {r.k + 1}
                </T>
                {r.xs.map((x, i) => (
                  <Chip key={i} text={SENT[i]} color={COLORS[i]} fs={FR} x={x} y={r.y} style={{ opacity: ctx }} />
                ))}
                <Box x={r.slotX} y={r.y} w={r.slotW} h={CH} r={12} bw={4} dashed border="var(--pen)" fill="transparent" o={slot * (1 - rev)}>
                  <span style={{ fontSize: FR, fontWeight: 700, color: "var(--pen)" }}>?</span>
                </Box>
                <Chip text={r.answer} color={COLORS[r.k + 1]} fs={FR} x={r.slotX + (r.slotW - chipWidth(r.answer, FR)) / 2} y={r.y} style={{ opacity: rev, outline: "4px solid var(--pen)", outlineOffset: 3, scale: String(mix(0.7, 1, rev)) }} />
                {/* s6: the mask hides everything after the slot */}
                <div
                  style={{
                    position: "absolute",
                    left: r.slotX + r.slotW + 12,
                    top: r.y - 6,
                    width: Math.max(0, MASK_R - (r.slotX + r.slotW + 12)) * mask,
                    height: CH + 12,
                    borderRadius: 10,
                    background: "var(--ink-3)",
                    opacity: 0.35,
                  }}
                />
              </div>
            );
          })}
          <Hand x={700} y={ROW_Y[0] + 4} fs={46} style={{ opacity: beat(frame, S.s3, 6.4, 0.4) * labelsOn, rotate: "-3deg" }}>
            {L.answerFrom}
          </Hand>

          {/* s5: count + name */}
          <div style={{ opacity: labelsOn }}>
            <Center y={880} fs={46} o={beat(frame, S.s5, 3.4, 0.4)}>
              {L.count}
            </Center>
            <Chip text={L.ssl} color="yellow" fs={50} x={540 - chipWidth(L.ssl, 50) / 2} y={960} style={{ opacity: beat(frame, S.s5, 6.2, 0.4) }} />
            <T x={540 + chipWidth(L.ssl, 50) / 2 + 16} y={984} fs={30} color="var(--ink-2)" o={beat(frame, S.s5, 6.6, 0.4)}>
              {L.sslEn}
            </T>
          </div>

          {/* s6: all four at once */}
          {frame >= S.s6.from && (
            <>
              <Hand x={0} y={880} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 0.3, 0.4) }}>
                {L.together}
              </Hand>
              <Center y={970} fs={40} bold={false} o={beat(frame, S.s6, 2.6, 0.4)}>
                {L.mask}
              </Center>
            </>
          )}
        </div>
      )}

      {/* s7: the whole internet becomes questions */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <Center y={170} fs={48}>
            {L.gpt3}
          </Center>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {Array.from({ length: 24 }, (_, i) => {
              const x = 110 + (i % 8) * 110;
              const y = 270 + Math.floor(i / 8) * 100;
              const o = beat(frame, S.s7, 0.6 + i * 0.05, 0.3);
              return (
                <g key={i} opacity={o}>
                  {[0, 1, 2, 3].map((k) => (
                    <rect key={k} x={x} y={y + k * 18} width={14 + k * 14} height={12} rx={3} fill={`var(--hl-${COLORS[(i + k) % 5]})`} />
                  ))}
                  {[0, 1, 2, 3].map((k) => (
                    <rect key={`a${k}`} x={x + 18 + k * 14} y={y + k * 18} width={12} height={12} rx={3} fill="none" stroke="var(--pen)" strokeWidth={2.5} />
                  ))}
                </g>
              );
            })}
          </svg>
          <Chip text={L.tokens} color="yellow" fs={60} x={540 - chipWidth(L.tokens, 60) / 2} y={600} style={{ opacity: beat(frame, S.s7, 2.0, 0.4) }} />
          <Center y={720} fs={56} o={beat(frame, S.s7, 3.4, 0.4)}>
            {L.equals}
          </Center>
          <Hand x={0} y={830} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.4, 0.4), rotate: "-2deg" }}>
            {L.noKey}
          </Hand>
          <Hand x={0} y={960} fs={42} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 7.4, 0.4) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch64.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
