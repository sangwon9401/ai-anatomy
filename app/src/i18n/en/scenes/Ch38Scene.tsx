// en: overlay of src/scenes/Ch38Scene.tsx: the counted word is 'to', the s2 prefixes are English, and the
// subject circled in s7 is the 2nd word ('cat') instead of the 1st.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CORPUS, END, PATH, START, TABLE_ROWS, ch38, countSeq, followers } from "../../../data/ch38";
import {
  Caption,
  Chip,
  EASE_IO,
  Hand,
  InlineCircle,
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
  textWidth,
  type SceneProps,
} from "../../../scenes/kit";

const tl = buildTimeline(ch38);
const S = byId(tl);
const L = ch38.labels;

const OUTLINE = { background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)" } as const;

// notebook
const NB = { x: 70, y: 140, w: 940, h: 660 };
const LINES = CORPUS.slice(0, 8).map((s) => s.split(" "));
const LFS = 38;
const LY = (i: number) => NB.y + 92 + i * 60;
const SCHOOL = "to";

// s4 counts
const AFTER = followers([SCHOOL]);
const AFTER_TOTAL = AFTER.reduce((a, f) => a + f.c, 0);

// s5–s6 pair table
const TFS = 32;
const ROW0 = 252;
const ROW_H = 104;
const LABEL_X = 70;
const LABEL_W = 200;
const F_X = 312;
const ROWS = TABLE_ROWS.map((r, k) => {
  const fs = followers([r]);
  const widths = fs.map((f) => chipWidth(f.w, TFS));
  let x = F_X;
  const xs = widths.map((w) => {
    const at = x;
    x += w + 12;
    return at;
  });
  const chosen = [...PATH, END][k];
  return { r, fs, widths, xs, y: ROW0 + k * ROW_H, chosen: fs.findIndex((f) => f.w === chosen) };
});
const PICK_T = (k: number) => 1.4 + k * 1.1;

// the sentence built from the table
const SFS = 44;
const SW = PATH.map((w) => chipWidth(w, SFS));
const SX = rowLayout(SW, 14);
const SCX = SX.map((x, i) => x + SW[i] / 2);

// s8 longer contexts
const LONGER = [
  { label: L.look1, seq: PATH.slice(2, 3) },
  { label: L.look2, seq: PATH.slice(1, 3) },
  { label: L.look3, seq: PATH.slice(0, 3) },
].map((r) => ({ ...r, n: countSeq(r.seq) }));

const pct = (p: number) => `${Math.round(p * 100)}%`;

export const Ch38Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const nbOn = beat(frame, S.s1, 0.2, 0.6) * (1 - beat(frame, S.s5, 0, 0.5));
  const s2On = 1 - beat(frame, S.s3, 0, 0.4);
  const s3Hand = beat(frame, S.s3, 0.6, 0.5) * (1 - beat(frame, S.s4, 0, 0.4));
  const schoolHl = beat(frame, S.s3, 2.6, 0.5);
  const nextHl = beat(frame, S.s3, 4.4, 0.5);
  const tableOn = beat(frame, S.s5, 0.4, 0.6) * (1 - beat(frame, S.s7, 0, 0.5));
  const gramOn = beat(frame, S.s5, 5.0, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const lift = beat(frame, S.s7, 0.2, 1.0, EASE_IO);
  const s7On = 1 - beat(frame, S.s8, 0, 0.5);
  const s8On = beat(frame, S.s8, 0.3, 0.5);
  const sentY = mix(930, 400, lift);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s4: the notebook */}
      {frame < S.s5.from + 15 && (
        <div style={{ opacity: nbOn }}>
          <div
            style={{
              position: "absolute",
              left: NB.x,
              top: NB.y,
              width: NB.w,
              height: NB.h,
              borderRadius: 18,
              border: "4px solid var(--ink)",
              background: "var(--paper)",
              boxShadow: "8px 8px 0 var(--grid-major)",
            }}
          />
          <div style={{ position: "absolute", left: NB.x + 40, top: NB.y + 22, fontSize: 40, fontWeight: 700 }}>{L.corpus}</div>
          {LINES.map((words, i) => {
            const isSchool = i < 4;
            const o = beat(frame, S.s1, 0.8 + i * 0.25, 0.4);
            return (
              <div key={i} style={{ position: "absolute", left: NB.x + 40, top: LY(i), fontSize: LFS, lineHeight: 1.3, zIndex: 0, opacity: o, whiteSpace: "nowrap" }}>
                {words.map((w, j) => {
                  // s2: the 3-word prefix in line 0; s3–s4: 'to' and the word after it
                  const prefix = i === 0 && j < 3 ? beat(frame, S.s2, 1.0, 0.6) * s2On : 0;
                  const school = isSchool && w === SCHOOL ? schoolHl : 0;
                  const after = isSchool && words[j - 1] === SCHOOL ? nextHl : 0;
                  const hlc = after > 0 ? (w === AFTER[0].w ? "var(--hl-yellow)" : "var(--hl-pink)") : school > 0 ? "var(--hl-sky)" : "var(--hl-yellow)";
                  const a = Math.max(prefix, school, after);
                  return (
                    <span key={j} style={{ position: "relative", marginRight: LFS * 0.28 }}>
                      <span style={{ position: "absolute", left: -6, right: -6, top: 2, bottom: 0, borderRadius: 8, background: hlc, opacity: a, zIndex: -1 }} />
                      {w}
                    </span>
                  );
                })}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: NB.x + 40, top: LY(8) + 4, fontSize: 32, color: "var(--ink-3)", opacity: beat(frame, S.s1, 3.0, 0.4) }}>{L.more}</div>
          <Hand x={700} y={NB.y + 26} fs={46} style={{ opacity: beat(frame, S.s1, 4.4, 0.4) * (1 - beat(frame, S.s2, 0, 0.3)), rotate: "-3deg" }}>
            {L.count}
          </Hand>

          {/* s2: counting whole prefixes */}
          {frame >= S.s2.from && (
            <div style={{ opacity: s2On }}>
              {[
                { seq: ["I", "walk", SCHOOL], t: 1.6, hl: "var(--hl-yellow)" },
                { seq: ["We", "walk", SCHOOL], t: 4.6, hl: "var(--paper-2)" },
              ].map((q, i) => {
                const n = countSeq(q.seq);
                const y = 850 + i * 110;
                const a = beat(frame, S.s2, q.t, 0.5);
                const tw = textWidth(q.seq.join(" "), 42) + 28;
                return (
                  <div key={i} style={{ opacity: a }}>
                    <div style={{ position: "absolute", left: 96, top: y, fontSize: 42, fontWeight: 500, background: q.hl, color: "var(--chip-ink)", borderRadius: 10, padding: "2px 14px" }}>
                      {q.seq.join(" ")}
                    </div>
                    <div style={{ position: "absolute", left: 96 + tw + 30, top: y + 2, fontSize: 42, color: "var(--ink-3)" }}>{L.arrow}</div>
                    <div style={{ position: "absolute", left: 96 + tw + 100, top: y + 2, fontFamily: "var(--font-mono)", fontSize: 46, fontWeight: 500 }}>
                      {n === 0 ? (
                        <InlineCircle p={beat(frame, S.s2, q.t + 0.8, 0.6)}>
                          <span style={{ color: "var(--pen)" }}>{L.zero}</span>
                        </InlineCircle>
                      ) : (
                        `${n}${L.times}`
                      )}
                    </div>
                    {n > 0 && (
                      <Hand x={96 + tw + 220} y={y - 2} fs={44} style={{ opacity: beat(frame, S.s2, q.t + 0.8, 0.4) }}>
                        {L.only}
                      </Hand>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* s3: only the word right before */}
          <Hand x={0} y={870} fs={58} style={{ width: 1080, textAlign: "center", opacity: s3Hand }}>
            <InlineUnderline p={beat(frame, S.s3, 1.2, 0.7) * s3Hand}>{L.trick}</InlineUnderline>
          </Hand>

          {/* s4: count what came after 'to' */}
          {frame >= S.s4.from && (
            <div style={{ opacity: beat(frame, S.s4, 0.3, 0.5) }}>
              <div style={{ position: "absolute", left: 96, top: 830, fontSize: 38, fontWeight: 700 }}>
                {L.after}: <span style={{ fontFamily: "var(--font-mono)" }}>{L.total}</span>
              </div>
              {AFTER.map((f, i) => {
                const y = 900 + i * 86;
                const g = beat(frame, S.s4, 1.2 + i * 2.2, 0.8);
                return (
                  <div key={f.w}>
                    <Chip text={f.w} fs={42} color={i === 0 ? "yellow" : "pink"} x={96} y={y} />
                    <div style={{ position: "absolute", left: 290, top: y + 6, fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 500, opacity: g }}>
                      {f.c}
                      {L.times}
                    </div>
                    <div style={{ position: "absolute", left: 400, top: y + 12, height: 40, width: f.p * 380 * g, borderRadius: 20, background: i === 0 ? "var(--hl-yellow)" : "var(--hl-pink)" }} />
                    <div style={{ position: "absolute", left: 400 + f.p * 380 + 20, top: y + 6, fontFamily: "var(--font-mono)", fontSize: 44, opacity: beat(frame, S.s4, 2.0 + i * 2.2, 0.4) }}>
                      {f.c}/{AFTER_TOTAL} = {pct(f.p)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* s5–s6: the pair table */}
      {frame >= S.s5.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: tableOn }}>
          <div style={{ position: "absolute", left: LABEL_X, top: 140, fontSize: 52, fontWeight: 700 }}>{L.pairTitle}</div>
          <div style={{ opacity: gramOn }}>
            <Hand x={560} y={128} fs={40}>
              {L.gram2}
            </Hand>
            <Hand x={560} y={178} fs={40} color="var(--ink-2)">
              {L.gram3}
            </Hand>
          </div>
          <Hand x={620} y={150} fs={44} style={{ opacity: beat(frame, S.s6, 0.6, 0.4), rotate: "-3deg" }}>
            {L.shannon}
          </Hand>
          {ROWS.map((row, k) => {
            const a = beat(frame, S.s5, 0.8 + k * 0.35, 0.4);
            const labelHl = k > 0 ? beat(frame, S.s6, PICK_T(k - 1) + 0.3, 0.3) : 0;
            const picked = beat(frame, S.s6, PICK_T(k), 0.4);
            return (
              <div key={row.r} style={{ opacity: a }}>
                <Chip
                  text={row.r}
                  fs={TFS + 2}
                  color={labelHl > 0.5 ? "yellow" : null}
                  x={LABEL_X + LABEL_W - chipWidth(row.r, TFS + 2)}
                  y={row.y}
                  style={labelHl > 0.5 ? undefined : row.r === START ? { background: "var(--paper-2)", color: "var(--ink-2)" } : OUTLINE}
                />
                <div style={{ position: "absolute", left: LABEL_X + LABEL_W + 10, top: row.y + 2, fontSize: 36, color: "var(--ink-3)" }}>{L.arrow}</div>
                {row.fs.map((f, j) => {
                  const isPick = j === row.chosen && picked > 0;
                  const isEnd = f.w === END;
                  return (
                    <div key={f.w}>
                      <Chip
                        text={f.w}
                        fs={TFS}
                        color={isPick ? "yellow" : null}
                        x={row.xs[j]}
                        y={row.y}
                        style={isPick ? undefined : isEnd ? { background: "var(--ink)", color: "var(--paper)" } : { background: "var(--paper-2)", color: "var(--ink)" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: row.xs[j],
                          width: row.widths[j],
                          top: row.y + TFS * 1.5 + 2,
                          textAlign: "center",
                          fontFamily: "var(--font-mono)",
                          fontSize: 28,
                          color: isPick ? "var(--pen)" : "var(--ink-2)",
                          fontWeight: isPick ? 700 : 400,
                        }}
                      >
                        {isPick ? pct(f.p) : `${f.c}${L.times}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: F_X, top: ROW0 + ROWS.length * ROW_H - 8, fontSize: 30, color: "var(--ink-3)", opacity: beat(frame, S.s5, 3.2, 0.4) * (1 - beat(frame, S.s6, 0, 0.4)) }}>
            {L.rowsMore}
          </div>
        </div>
      )}

      {/* s6–s7: the sentence it wrote */}
      {frame >= S.s6.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          {PATH.map((w, i) => {
            const a = beat(frame, S.s6, PICK_T(i) + 0.3, 0.4);
            return <Chip key={w} text={w} fs={SFS} color="yellow" x={SX[i]} y={sentY + mix(16, 0, a)} w={SW[i]} style={{ opacity: a }} />;
          })}
          {frame >= S.s7.from && (
            <>
              <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                {PATH.slice(0, -1).map((_, i) => {
                  const p = beat(frame, S.s7, 1.4 + i * 0.4, 0.4);
                  const y0 = sentY + SFS * 1.5 + 10;
                  return (
                    <g key={i} opacity={p > 0 ? 1 : 0}>
                      <path
                        d={`M ${SCX[i]} ${y0} Q ${(SCX[i] + SCX[i + 1]) / 2} ${y0 + 70} ${SCX[i + 1]} ${y0}`}
                        fill="none"
                        stroke="var(--ink-3)"
                        strokeWidth={4}
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - p}
                      />
                      <circle cx={(SCX[i] + SCX[i + 1]) / 2} cy={y0 + 52} r={14} fill="var(--paper)" stroke="var(--pen)" strokeWidth={4} opacity={p} />
                    </g>
                  );
                })}
                <path
                  d={`M ${SCX[1]} ${sentY - 10} Q ${(SCX[1] + SCX[3]) / 2} ${sentY - 130} ${SCX[3]} ${sentY - 10}`}
                  fill="none"
                  stroke="var(--pen)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - beat(frame, S.s7, 4.6, 0.6)}
                />
              </svg>
              <Hand x={0} y={sentY + SFS * 1.5 + 90} fs={44} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.2, 0.4) }}>
                {L.pairOk}
              </Hand>
              {/* en: the subject is the 2nd word ("My cat") */}
              <PenCircle x={SX[1] - 14} y={sentY - 10} w={SW[1] + 28} h={SFS * 1.5 + 20} p={beat(frame, S.s7, 4.2, 0.5)} />
              <PenCircle x={SX[3] - 14} y={sentY - 10} w={SW[3] + 28} h={SFS * 1.5 + 20} p={beat(frame, S.s7, 4.4, 0.5)} />
              <Hand x={0} y={sentY - 210} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.2, 0.4) }}>
                {L.huh}
              </Hand>
              <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontSize: 44, fontWeight: 700, opacity: beat(frame, S.s7, 6.4, 0.5) }}>{L.forgot}</div>
            </>
          )}
        </div>
      )}

      {/* s8: longer contexts are rarely seen */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          {LONGER.map((r, i) => {
            const y = 200 + i * 130;
            const a = beat(frame, S.s8, 0.6 + i * 1.0, 0.5);
            const text = r.seq.join(" ");
            const tw = chipWidth(text, 42);
            return (
              <div key={r.label} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: 70, top: y + 6, width: 180, fontSize: 38, fontWeight: 700 }}>{r.label}</div>
                <Chip text={text} fs={42} color="sky" x={250} y={y} w={tw} />
                <div style={{ position: "absolute", left: 250 + tw + 24, top: y + 4, fontSize: 42, color: "var(--ink-3)" }}>{L.arrow}</div>
                <div style={{ position: "absolute", left: 250 + tw + 90, top: y + 4, fontFamily: "var(--font-mono)", fontSize: 46, fontWeight: 500, color: r.n === 0 ? "var(--pen)" : "var(--ink)" }}>
                  {r.n === 0 ? <InlineCircle p={beat(frame, S.s8, 3.0, 0.6)}>{L.zero}</InlineCircle> : `${r.n}${L.times}`}
                </div>
              </div>
            );
          })}
          <Hand x={0} y={600} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 4.0, 0.5) }}>
            {L.longer}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", opacity: beat(frame, S.s8, 6.0, 0.5) }}>
            <span style={{ fontSize: 46, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 14, padding: "6px 22px" }}>{L.next}</span>
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch38.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
