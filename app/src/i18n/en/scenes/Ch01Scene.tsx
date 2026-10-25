import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { EXAMPLES, ROUND1, ROUND2, ch01, type Candidate } from "../../../data/ch01";
import {
  Caption,
  Narration,
  Chip,
  EASE_IO,
  Hand,
  Paper,
  PenCircle,
  Tag,
  beat,
  buildTimeline,
  byId,
  chipWidth,
  mix,
  rowLayout,
  textWidth,
  type SceneProps,
} from "../../../scenes/kit";

const tl = buildTimeline(ch01);
const S = byId(tl);
const L = ch01.labels;

const FS = 58;
const SENT_Y = 150;
const CH = FS * 1.5;
const GAP = 18;
const BW1 = 270; // en: wide enough for "school"
const BW2 = 130;
// en: the sentence and the picked word come from the data (I walk to → school)
const R1 = L.words.split(" ").slice(0, 3);
const PICK = ROUND1[0].w;
const xs1 = rowLayout([...R1.map((w) => chipWidth(w, FS)), BW1], GAP);
const xs2 = rowLayout([...[...R1, PICK].map((w) => chipWidth(w, FS)), BW2], GAP);
const land = (blankX: number, bw: number, w: string) => blankX + (bw - chipWidth(w, FS)) / 2;

const LIST_X = 96;
const LIST_Y = 400;
const ROW = 108;
const LFS = 48;
const BAR_X = 330;
const SCALE = 1000;

const CandidateList: FC<{
  items: Candidate[];
  frame: number;
  originX: number;
  appear: (i: number) => number;
  grow: (i: number) => number;
  dim: number;
  opacity: number;
}> = ({ items, originX, appear, grow, dim, opacity }) => (
  <>
    {items.map((c, i) => {
      const a = appear(i);
      const g = grow(i);
      const y = LIST_Y + i * ROW;
      const o = opacity * (i === 0 ? 1 : 1 - dim * 0.7);
      return (
        <div key={c.w + i} style={{ opacity: o }}>
          <Chip
            text={c.w}
            color={c.c}
            fs={LFS}
            x={mix(originX, LIST_X, a)}
            y={mix(SENT_Y + 10, y, a)}
            style={{ opacity: a, scale: String(mix(0.6, 1, a)) }}
          />
          <div
            style={{
              position: "absolute",
              left: BAR_X,
              top: y + 20,
              height: 34,
              width: c.p * SCALE * g,
              borderRadius: 17,
              background: c.c ? `var(--hl-${c.c})` : "var(--grid-major)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: BAR_X + c.p * SCALE + 16,
              top: y + 14,
              fontFamily: "var(--font-mono)",
              fontSize: 40,
              color: "var(--ink)",
              opacity: g,
            }}
          >
            {Math.round(c.p * 100)}%
          </div>
        </div>
      );
    })}
  </>
);

export const Ch01Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  // sentence reflow from round 1 to round 2
  const reflow = beat(frame, S.s5, 0.3, 0.9, EASE_IO);
  const sentenceX = (i: number) => mix(xs1[i], xs2[i], reflow);

  const cursorOn = frame < S.s4.from + 50 && Math.floor(frame / 15) % 2 === 0;
  const blank1 = beat(frame, S.s1, 1.0, 0.4) * (1 - beat(frame, S.s4, 1.8, 0.3));
  const fly1 = beat(frame, S.s4, 0.9, 1.1, EASE_IO);
  const blank2 = beat(frame, S.s5, 0.9, 0.4) * (1 - beat(frame, S.s5, 5.9, 0.3));
  const fly2 = beat(frame, S.s5, 5.0, 1.0, EASE_IO);

  const list1Out = 1 - beat(frame, S.s5, 0, 0.5);
  const list2Out = 1 - beat(frame, S.s6, 0, 0.5);
  const stmtOut = 1 - beat(frame, S.s7, 0, 0.5);

  const mainW = textWidth(L.stmtMain, 104) + 70;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* the sentence */}
      {R1.map((w, i) => (
        <Chip
          key={w}
          text={w}
          color={null}
          fs={FS}
          x={sentenceX(i)}
          y={SENT_Y}
          style={{
            background: "var(--paper)",
            border: "2.5px solid var(--ink)",
            color: "var(--ink)",
            opacity: beat(frame, S.s1, 0.1 + i * 0.25, 0.4),
            translate: `0px ${mix(24, 0, beat(frame, S.s1, 0.1 + i * 0.25, 0.4))}px`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: xs1[3],
          top: SENT_Y,
          width: BW1,
          height: CH,
          border: "3px dashed var(--ink-3)",
          borderRadius: 14,
          opacity: blank1,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 26,
            top: 16,
            width: 5,
            height: CH - 38,
            background: "var(--ink)",
            opacity: cursorOn ? 1 : 0,
          }}
        />
      </div>
      {fly1 > 0 && (
        <Chip
          text={PICK}
          color="yellow"
          fs={FS}
          x={reflow > 0 ? mix(land(xs1[3], BW1, PICK), xs2[3], reflow) : mix(LIST_X, land(xs1[3], BW1, PICK), fly1)}
          y={mix(LIST_Y, SENT_Y, fly1)}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: xs2[4],
          top: SENT_Y,
          width: BW2,
          height: CH,
          border: "3px dashed var(--ink-3)",
          borderRadius: 14,
          opacity: blank2,
        }}
      />
      {fly2 > 0 && (
        <Chip text="." color="yellow" fs={FS} x={mix(LIST_X, land(xs2[4], BW2, "."), fly2)} y={mix(LIST_Y, SENT_Y, fly2)} />
      )}
      <Hand x={xs2[3] - 10} y={SENT_Y + CH + 18} fs={42} style={{ opacity: beat(frame, S.s5, 0.8, 0.5) * list2Out }}>
        ↑ {L.loop}
      </Hand>

      {/* round 1 candidates */}
      {frame < S.s5.from + 20 && (
        <CandidateList
          items={ROUND1}
          frame={frame}
          originX={xs1[3] + 30}
          appear={(i) => beat(frame, S.s2, 0.3 + i * 0.25, 0.7)}
          grow={(i) => beat(frame, S.s3, 0.4 + i * 0.18, 0.9)}
          dim={beat(frame, S.s4, 0, 0.5)}
          opacity={list1Out}
        />
      )}
      <PenCircle
        x={LIST_X - 16}
        y={LIST_Y - 12}
        w={chipWidth(PICK, LFS) + 32}
        h={LFS * 1.5 + 24}
        p={beat(frame, S.s4, 0.1, 0.7) * list1Out}
      />
      <Hand
        x={700}
        y={LIST_Y + 6 * ROW - 30}
        fs={34}
        color="var(--ink-3)"
        style={{ opacity: beat(frame, S.s3, 2.4, 0.5) * list1Out }}
      >
        * {L.example}
      </Hand>

      {/* round 2 candidates */}
      {frame >= S.s5.from && frame < S.s6.from + 20 && (
        <CandidateList
          items={ROUND2}
          frame={frame}
          originX={xs2[4] + 20}
          appear={(i) => beat(frame, S.s5, 1.4 + i * 0.12, 0.6)}
          grow={(i) => beat(frame, S.s5, 2.2 + i * 0.12, 0.7)}
          dim={beat(frame, S.s5, 4.3, 0.4)}
          opacity={list2Out}
        />
      )}
      <PenCircle
        x={LIST_X - 16}
        y={LIST_Y - 12}
        w={chipWidth(".", LFS) + 32}
        h={LFS * 1.5 + 24}
        p={beat(frame, S.s5, 4.4, 0.6) * list2Out}
      />

      {/* the whole job, in one line */}
      {frame >= S.s6.from && frame < S.s7.from + 20 && (
        <div style={{ opacity: stmtOut }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 450,
              textAlign: "center",
              fontSize: 46,
              color: "var(--ink-2)",
              opacity: beat(frame, S.s6, 0.5, 0.6),
            }}
          >
            {L.stmtTop}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 540,
              textAlign: "center",
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              opacity: beat(frame, S.s6, 0.9, 0.6),
              scale: String(mix(0.92, 1, beat(frame, S.s6, 0.9, 0.6))),
            }}
          >
            {L.stmtMain}
          </div>
          <PenCircle x={540 - mainW / 2} y={520} w={mainW} h={190} p={beat(frame, S.s6, 2.2, 0.8)} stroke={7} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 740,
              textAlign: "center",
              fontSize: 64,
              fontWeight: 500,
              color: "var(--ink-2)",
              opacity: beat(frame, S.s6, 1.6, 0.6),
            }}
          >
            {L.stmtLoop}
          </div>
          <Hand x={620} y={850} fs={46} style={{ opacity: beat(frame, S.s6, 3.2, 0.5), rotate: "-3deg" }}>
            {L.stmtNote}
          </Hand>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1040,
              textAlign: "center",
              fontSize: 32,
              color: "var(--ink-3)",
              opacity: beat(frame, S.s6, 4.0, 0.5),
            }}
          >
            {L.token}
          </div>
        </div>
      )}

      {/* what it takes to predict well */}
      {frame >= S.s7.from &&
        EXAMPLES.map((ex, i) => {
          const y = 440 + i * 190;
          const qw = textWidth(ex.q, 50);
          const a = beat(frame, S.s7, 0.4 + i * 0.9, 0.6);
          const b = beat(frame, S.s7, 0.8 + i * 0.9, 0.5);
          return (
            <div key={ex.q} style={{ opacity: a, translate: `0px ${mix(20, 0, a)}px` }}>
              <div style={{ position: "absolute", left: 96, top: y + 8, fontSize: 50, fontWeight: 500 }}>{ex.q}</div>
              <div style={{ position: "absolute", left: 96 + qw + 24, top: y + 4, fontSize: 54, color: "var(--ink-3)" }}>→</div>
              <Chip
                text={ex.a}
                color={(["yellow", "mint", "sky"] as const)[i]}
                fs={50}
                x={96 + qw + 100}
                y={y}
                style={{ opacity: b, scale: String(mix(0.7, 1, b)) }}
              />
              <Hand x={890} y={y + 10} fs={52} style={{ opacity: b, left: "auto", right: 60 }}>
                {ex.tag}
              </Hand>
            </div>
          );
        })}

      <Narration tl={tl} chapter={ch01.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
