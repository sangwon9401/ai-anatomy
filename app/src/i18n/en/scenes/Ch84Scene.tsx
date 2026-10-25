import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ANSWER84, HELPS, QUESTION84, RISKY, SCENE_ROUNDS, TREE, ch84 } from "../../../data/ch84";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenCircle, PenUnderline, Tag, beat, buildTimeline, byId, chipWidth, mix, textWidth, wrapLayout, type SceneProps } from "../../../scenes/kit";
import { Card, CurveArrow, Dial } from "../../../scenes/part9-kit";

const tl = buildTimeline(ch84);
const S = byId(tl);
const L = ch84.labels;

// the answer line, built chunk by chunk
const AFS = 46;
const AW = ANSWER84.map((w) => chipWidth(w, AFS));
const AP = wrapLayout(AW, { x0: 64, y0: 210, lineH: 130, gap: 14 });
const AP5 = wrapLayout(AW, { x0: 64, y0: 330, lineH: 150, gap: 14 });

// candidate rows
const RY = (i: number) => 500 + i * 100;
const CFS = 42;
const BAR_X = 440;
const SCALE = 600;

// s2 round 1 times; s3 rounds 2–4 start at these seconds
const R3 = [0.5, 2.4, 4.3];
const FINAL_AT = 6.3;

const Rows: FC<{ round: (typeof SCENE_ROUNDS)[number]; on: number; grow: number; circle: number; honest?: number }> = ({ round, on, grow, circle, honest = 0 }) => {
  const opts = TREE[round];
  return (
    <div style={{ opacity: on }}>
      {opts.map((o, i) => (
        <div key={o.w}>
          <Chip text={o.w} color={o.c} fs={CFS} x={90} y={RY(i)} />
          <div style={{ position: "absolute", left: BAR_X, top: RY(i) + 18, height: 30, width: o.p * SCALE * grow, borderRadius: 15, background: `var(--hl-${o.c})` }} />
          <div style={{ position: "absolute", left: BAR_X + o.p * SCALE + 14, top: RY(i) + 12, fontFamily: "var(--font-mono)", fontSize: 38, opacity: grow }}>{Math.round(o.p * 100)}%</div>
        </div>
      ))}
      <PenCircle x={74} y={RY(0) - 12} w={chipWidth(opts[0].w, CFS) + 32} h={CFS * 1.5 + 24} p={circle} />
      {honest > 0 && (
        <Hand x={BAR_X + opts[3].p * SCALE + 110} y={RY(3) + 6} fs={44} style={{ opacity: honest }}>
          {L.honestNote}
        </Hand>
      )}
    </div>
  );
};

export const Ch84Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const chatOn = 1 - beat(frame, S.s2, 0, 0.5);
  const buildOn = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const cardsOn = beat(frame, S.s4, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const chainOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const riskOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const helpOn = beat(frame, S.s7, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));

  // when each answer chunk lands in the line
  const land = [beat(frame, S.s2, 4.0, 0.9, EASE_IO), ...R3.map((t) => beat(frame, S.s3, t + 1.1, 0.8, EASE_IO)), beat(frame, S.s3, FINAL_AT, 0.5)];

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the confident answer */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: chatOn }}>
          {(() => {
            const w = textWidth(QUESTION84, 40) + 70;
            return (
              <div style={{ position: "absolute", left: 1010 - w, top: 150, width: w, padding: "16px 35px", fontSize: 40, fontWeight: 500, background: "var(--hl-sky)", color: "var(--chip-ink)", borderRadius: "34px 34px 8px 34px", whiteSpace: "nowrap", opacity: beat(frame, S.s1, 0.1, 0.4) }}>
                {QUESTION84}
              </div>
            );
          })()}
          <div style={{ position: "absolute", left: 70, top: 270, fontSize: 30, color: "var(--ink-3)", opacity: beat(frame, S.s1, 0.7, 0.3) }}>{L.chatgpt}</div>
          <div style={{ position: "absolute", left: 64, top: 316, width: 780, padding: "22px 34px", fontSize: 46, lineHeight: 1.5, fontWeight: 500, background: "var(--paper-2)", border: "2px solid var(--line)", borderRadius: "34px 34px 34px 8px", opacity: beat(frame, S.s1, 0.7, 0.3) }}>
            {[...L.answer1.split(" "), "\n", ...L.answer2.split(" ")].map((w, i) =>
              w === "\n" ? <br key={i} /> : (
                <span key={i} style={{ opacity: beat(frame, S.s1, 1.0 + i * 0.3, 0.15) }}>
                  {w}{" "}
                </span>
              ),
            )}
          </div>
          <Hand x={480} y={540} fs={54} style={{ opacity: beat(frame, S.s1, 3.6, 0.4), rotate: "-3deg" }}>
            {L.none}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 60, fontWeight: 700, opacity: beat(frame, S.s1, 5.4, 0.5) }}>{L.halluc}</div>
          <PenUnderline x={540 - (textWidth(L.halluc, 60) * 0.86) / 2} y={800} w={textWidth(L.halluc, 60) * 0.86} p={beat(frame, S.s1, 6.2, 0.7)} />
          <div style={{ position: "absolute", left: 70, top: 1010, fontSize: 30, color: "var(--ink-3)", opacity: beat(frame, S.s1, 4.2, 0.4) }}>{L.madeUp}</div>
        </div>
      )}

      {/* s2–s3: one chunk at a time */}
      {frame >= S.s2.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: buildOn }}>
          <div style={{ position: "absolute", left: 64, top: 124, fontSize: 34, color: "var(--ink-2)" }}>
            {L.q} {QUESTION84}
          </div>
          {ANSWER84.map((w, i) => {
            const t = land[i];
            if (t <= 0) return null;
            const fromY = i === ANSWER84.length - 1 ? AP[i].y + 30 : RY(0);
            return <Chip key={w} text={w} color="yellow" fs={AFS} x={i === ANSWER84.length - 1 ? AP[i].x : mix(90, AP[i].x, t)} y={mix(fromY, AP[i].y, t)} style={{ opacity: Math.min(1, t * 3) }} />;
          })}
          {ANSWER84.map((w, i) => (
            <Hand key={`m${w}`} x={AP[i].x} y={AP[i].y + AFS * 1.5 + 2} fs={36} style={{ width: AW[i], textAlign: "center", opacity: beat(frame, S.s3, 7.0 + i * 0.15, 0.3) }}>
              {L.plausible}
            </Hand>
          ))}

          {/* round 1 */}
          {frame < S.s3.from + 12 && (
            <Rows
              round="start"
              on={beat(frame, S.s2, 0.6, 0.4) * (1 - beat(frame, S.s3, 0, 0.35))}
              grow={beat(frame, S.s2, 1.0, 0.8)}
              circle={beat(frame, S.s2, 2.8, 0.6)}
              honest={beat(frame, S.s2, 5.6, 0.4)}
            />
          )}
          {/* rounds 2–4 */}
          {SCENE_ROUNDS.slice(1).map((r, k) => {
            const t0 = R3[k];
            if (frame < S.s3.from || frame > S.s3.from + (t0 + 2.2) * 30) return null;
            return <Rows key={r} round={r} on={beat(frame, S.s3, t0, 0.3) * (1 - beat(frame, S.s3, t0 + 1.7, 0.3))} grow={beat(frame, S.s3, t0 + 0.1, 0.5)} circle={beat(frame, S.s3, t0 + 0.6, 0.4)} />;
          })}
          <div style={{ position: "absolute", right: 70, top: 900, fontSize: 30, color: "var(--ink-3)", opacity: beat(frame, S.s2, 1.6, 0.4) * (1 - beat(frame, S.s3, FINAL_AT, 0.4)) }}>* {L.example}</div>

          {/* the verdict */}
          <Hand x={0} y={560} fs={64} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 8.0, 0.4), rotate: "-2deg" }}>
            {L.fake}
          </Hand>
          <PenUnderline x={540 - textWidth(L.fake, 58) / 2} y={642} w={textWidth(L.fake, 58)} p={beat(frame, S.s3, 8.5, 0.6)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 40, color: "var(--ink-2)", opacity: beat(frame, S.s3, 8.8, 0.4) }}>{L.none}</div>
        </div>
      )}

      {/* s4: what the model learned, and what it never checks */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: cardsOn }}>
          {[
            { x: 70, head: L.learned, body: L.learnedWhat, mark: L.markO, c: "mint" as const, t: 0.5 },
            { x: 560, head: L.notLearned, body: L.notWhat, mark: L.markX, c: "pink" as const, t: 2.4 },
          ].map((k) => (
            <div key={k.head} style={{ opacity: beat(frame, S.s4, k.t, 0.5) }}>
              <Card x={k.x} y={220} w={450} h={470} />
              <Chip text={k.head} color={k.c} fs={42} x={k.x + 225 - chipWidth(k.head, 42) / 2} y={260} />
              <div style={{ position: "absolute", left: k.x + 20, width: 410, top: 380, textAlign: "center", fontSize: 46, fontWeight: 700, wordBreak: "keep-all" }}>{k.body}</div>
              <Hand x={k.x} y={470} fs={150} style={{ width: 450, textAlign: "center", opacity: beat(frame, S.s4, k.t + 0.8, 0.3), lineHeight: 1 }}>
                {k.mark}
              </Hand>
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", fontSize: 48, fontWeight: 700, opacity: beat(frame, S.s4, 4.4, 0.5) }}>{L.score}</div>
        </div>
      )}

      {/* s5: the first button sets the rest */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: chainOn }}>
          {ANSWER84.map((w, i) => (
            <Chip key={w} text={w} color="yellow" fs={AFS} x={AP5[i].x} y={AP5[i].y} />
          ))}
          <PenCircle x={AP5[0].x - 16} y={AP5[0].y - 12} w={AW[0] + 32} h={AFS * 1.5 + 24} p={beat(frame, S.s5, 0.8, 0.6)} />
          <Hand x={AP5[0].x + 10} y={AP5[0].y - 90} fs={48} style={{ opacity: beat(frame, S.s5, 1.2, 0.4) }}>
            {L.first}
          </Hand>
          {ANSWER84.slice(0, -1).map((_, i) => {
            const a = AP5[i];
            const b = AP5[i + 1];
            const p = beat(frame, S.s5, 2.0 + i * 0.5, 0.5);
            if (a.y === b.y && a.y > AP5[0].y) {
              // English wraps to two chips on the second line: arc below them, clear of the line above
              const x1 = a.x + AW[i] / 2;
              const x2 = b.x + AW[i + 1] / 2;
              const y = a.y + AFS * 1.5 + 8;
              return <CurveArrow key={i} d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + 60} ${x2} ${y}`} end={[x2, y]} endAngle={Math.atan2(-60, x2 - (x1 + x2) / 2)} p={p} color="var(--pen)" />;
            }
            if (a.y === b.y) {
              const x1 = a.x + AW[i] / 2;
              const x2 = b.x + AW[i + 1] / 2;
              const y = a.y - 8;
              return <CurveArrow key={i} d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y - 60} ${x2} ${y}`} end={[x2, y]} endAngle={Math.atan2(60, x2 - (x1 + x2) / 2)} p={p} color="var(--pen)" />;
            }
            const x1 = a.x + AW[i] * 0.5;
            const y1 = a.y + AFS * 1.5 + 6;
            const x2 = b.x + AW[i + 1] * 0.5;
            const y2 = b.y - 6;
            return <CurveArrow key={i} d={`M ${x1} ${y1} C ${x1} ${y1 + 60}, ${x2} ${y2 - 60}, ${x2} ${y2}`} end={[x2, y2]} endAngle={Math.PI / 2} p={p} color="var(--pen)" />;
          })}
          <Hand x={Math.max(560, AP5[4].x + AW[4] + 30)} y={AP5[4].y + 10} fs={46} style={{ opacity: beat(frame, S.s5, 4.4, 0.4) }}>
            {L.follow}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s5, 5.2, 0.5) }}>{L.noErase}</div>
          <Hand x={0} y={800} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 6.4, 0.5), rotate: "-2deg" }}>
            {L.button}
          </Hand>
        </div>
      )}

      {/* s6: where it happens most */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: riskOn }}>
          <Hand x={0} y={140} fs={60} style={{ width: 1080, textAlign: "center" }}>
            {L.risky}
          </Hand>
          {RISKY.map((r, i) => {
            const x = 70 + (i % 2) * 490;
            const y = 260 + Math.floor(i / 2) * 320;
            const a = beat(frame, S.s6, 0.8 + i * 0.8, 0.4);
            return (
              <div key={r.w} style={{ opacity: a, scale: String(mix(0.9, 1, a)) }}>
                <Card x={x} y={y} w={450} h={280} />
                <Chip text={r.w} color={r.c} fs={46} x={x + 225 - chipWidth(r.w, 46) / 2} y={y + 56} />
                <div style={{ position: "absolute", left: x + 20, width: 410, top: y + 160, textAlign: "center", fontSize: 34, color: "var(--ink-2)", wordBreak: "keep-all" }}>{r.ex}</div>
                <div style={{ position: "absolute", left: x + 380, top: y + 18, width: 50, height: 50, borderRadius: "50%", border: "4px solid var(--pen)", color: "var(--pen)", display: "grid", placeItems: "center", fontSize: 34, fontWeight: 700 }}>!</div>
              </div>
            );
          })}
        </div>
      )}

      {/* s7: what helps */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: helpOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.helpsTitle}</div>
          {HELPS.map((h, i) => {
            const y = 300 + i * 220;
            const a = beat(frame, S.s7, 0.8 + i * 1.4, 0.4);
            return (
              <div key={h.n} style={{ opacity: a, translate: `${mix(-20, 0, a)}px 0px` }}>
                <div style={{ position: "absolute", left: 80, top: y, fontSize: 80, fontWeight: 700, color: "var(--pen)", lineHeight: 1 }}>{h.n}</div>
                <div style={{ position: "absolute", left: 200, top: y + 4, fontSize: 48, fontWeight: 700 }}>{h.w}</div>
                <div style={{ position: "absolute", left: 200, top: y + 78, fontSize: 36, color: "var(--ink-2)" }}>{h.ex}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* s8: temperature doesn't fix it */}
      {frame >= S.s8.from && (
        <div style={{ opacity: beat(frame, S.s8, 0.3, 0.5) }}>
          <Hand x={90} y={170} fs={48}>
            {L.low}
          </Hand>
          <Dial x={240} y={420} r={140} t={0.2} label={`${L.temp} 0.2`} />
          <div style={{ position: "absolute", left: 450, top: 300, width: 570, padding: "22px 30px", fontSize: 40, lineHeight: 1.5, fontWeight: 500, background: "var(--paper-2)", border: "2px solid var(--line)", borderRadius: "34px 34px 34px 8px", opacity: beat(frame, S.s8, 1.2, 0.4) }}>
            {L.answer1}
            <br />
            {L.answer2}
          </div>
          <Hand x={450} y={510} fs={50} style={{ opacity: beat(frame, S.s8, 2.6, 0.4), rotate: "-2deg" }}>
            {L.same}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 80, fontWeight: 700, opacity: beat(frame, S.s8, 5.0, 0.5) }}>{L.key}</div>
          <PenUnderline x={540 - textWidth(L.key, 80) / 2} y={830} w={textWidth(L.key, 80)} p={beat(frame, S.s8, 5.8, 0.7)} />
        </div>
      )}

      <Narration tl={tl} chapter={ch84.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
