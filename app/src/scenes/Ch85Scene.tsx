import type { CSSProperties, FC } from "react";
import { useCurrentFrame } from "remotion";
import { COMPARES, INGREDIENTS, S1_BARS, TOOLS9, ch85, type Compare } from "../data/ch85";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenUnderline, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, textWidth, type SceneProps, type TimedStep } from "./kit";
import { Arrow, OUTLINE } from "./part9-kit";

const tl = buildTimeline(ch85);
const S = byId(tl);
const L = ch85.labels;

const PFS = 34;
const BOX: CSSProperties = {
  border: "2.5px solid var(--ink)",
  borderRadius: 18,
  background: "var(--paper)",
  padding: "12px 22px",
  fontSize: PFS,
  lineHeight: 1.45,
  wordBreak: "keep-all",
};
const BUBBLE: CSSProperties = {
  borderRadius: "26px 26px 26px 8px",
  padding: "12px 24px",
  fontSize: PFS,
  lineHeight: 1.45,
  fontWeight: 500,
  wordBreak: "keep-all",
  maxWidth: 820,
};
const ORDINAL = [L.first, L.second, L.third, L.fourth];
const NOTES = [L.roleNote, L.exampleNote, L.stepNote, L.formatNote];

/** One "same request, with and without an ingredient" comparison (s2–s5). */
const ComparePanel: FC<{ c: Compare; k: number; step: TimedStep; frame: number }> = ({ c, k, step, frame }) => {
  const b = (t: number, d = 0.4) => beat(frame, step, t, d);
  const hi = b(3.0, 0.6);
  const addSpan = (
    <span style={{ background: `linear-gradient(90deg, var(--hl-yellow) ${hi * 100}%, transparent ${hi * 100}%)`, color: hi > 0.5 ? "var(--chip-ink)" : "var(--ink)", borderRadius: 6, padding: "0 4px" }}>
      {c.add}
    </span>
  );
  return (
    <div>
      <Chip text={ORDINAL[k]} color={null} fs={34} x={80} y={128} style={OUTLINE} />
      <Chip text={c.ing} color="yellow" fs={48} x={80 + chipWidth(ORDINAL[k], 34) + 18} y={118} />

      <div style={{ position: "absolute", left: 80, top: 214, width: 920, display: "flex", flexDirection: "column", gap: 12, opacity: b(0.4) }}>
        <div style={{ fontSize: 32, color: "var(--ink-2)" }}>{L.plain}</div>
        <div style={BOX}>{c.plain}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: b(1.2) }}>
          <div style={{ ...BUBBLE, background: "var(--paper-2)", border: "2px solid var(--line)" }}>{c.plainAnswer}</div>
          {c.bad && (
            <Hand x={0} y={0} fs={80} style={{ position: "relative", lineHeight: 1, opacity: b(1.7, 0.3) }}>
              {L.markX}
            </Hand>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", left: 80, top: 590, width: 920, display: "flex", flexDirection: "column", gap: 12, opacity: b(2.4) }}>
        <div style={{ fontSize: 32, color: "var(--ink-2)" }}>{L.withIt}</div>
        <div style={BOX}>
          {c.before ? (
            <>
              {addSpan} {c.plain}
            </>
          ) : (
            <>
              {c.plain} {addSpan}
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: b(4.0) }}>
          <div style={{ ...BUBBLE, background: "var(--hl-mint)", color: "var(--chip-ink)" }}>{c.goodAnswer}</div>
          <Hand x={0} y={0} fs={80} style={{ position: "relative", lineHeight: 1, opacity: b(4.6, 0.3) }}>
            {L.markO}
          </Hand>
        </div>
      </div>

      <Hand x={0} y={985} fs={46} style={{ width: 1080, textAlign: "center", opacity: b(5.4) }}>
        {NOTES[k]}
      </Hand>
      <div style={{ position: "absolute", right: 70, top: 214, fontSize: 28, color: "var(--ink-3)", opacity: b(1.2) }}>* {L.example}</div>
    </div>
  );
};

export const Ch85Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const steps = [S.s2, S.s3, S.s4, S.s5];
  const s1On = 1 - beat(frame, S.s2, 0, 0.5);
  const roleIn = beat(frame, S.s1, 4.4, 0.8, EASE_IO);
  const morph = beat(frame, S.s1, 5.2, 1.0, EASE_IO);
  const sixOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));

  const ingW = INGREDIENTS.map((w) => chipWidth(w, 46));
  const ingX = rowLayout(ingW, 30);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: a prompt is the start of a document */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Hand x={0} y={108} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 2.2, 0.5) }}>
            {L.is}
          </Hand>
          <Chip text={L.prompt} color="yellow" fs={34} x={80} y={196} style={{ opacity: beat(frame, S.s1, 0.2, 0.4) }} />
          <div style={{ position: "absolute", left: 80, top: 256, width: 920, minHeight: 100, ...BOX, fontSize: 40, display: "flex", alignItems: "center", flexWrap: "wrap", opacity: beat(frame, S.s1, 0.3, 0.4) }}>
            {roleIn > 0 && (
              <span style={{ background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 6, padding: "0 6px", marginRight: 12, opacity: roleIn }}>
                {L.roleAdd}
              </span>
            )}
            <span>{COMPARES[0].plain}</span>
          </div>
          <Arrow x1={540} y1={mix(372, 420, roleIn)} x2={540} y2={mix(452, 482, roleIn)} p={beat(frame, S.s1, 0.8, 0.4)} />
          <div style={{ position: "absolute", left: 390, top: mix(462, 492, roleIn), width: 300, height: 120, borderRadius: 26, border: "5px solid var(--ink)", background: "var(--paper-2)", display: "grid", placeItems: "center", fontSize: 54, fontWeight: 700, opacity: beat(frame, S.s1, 0.9, 0.4) }}>
            {L.model}
          </div>
          <Arrow x1={540} y1={mix(594, 624, roleIn)} x2={540} y2={mix(664, 690, roleIn)} p={beat(frame, S.s1, 1.4, 0.4)} />
          <div style={{ position: "absolute", left: 80, top: 690, fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s1, 1.6, 0.4) }}>
            {L.next} <span style={{ fontSize: 28, color: "var(--ink-3)" }}>({L.example})</span>
          </div>
          {S1_BARS.map((r, i) => {
            const p = mix(r.a, r.b, morph);
            const y = 750 + i * 88;
            const g = beat(frame, S.s1, 1.8 + i * 0.15, 0.6);
            return (
              <div key={r.w} style={{ opacity: g }}>
                <Chip text={r.w} color={r.c} fs={40} x={80} y={y} />
                <div style={{ position: "absolute", left: 300, top: y + 16, height: 30, width: p * 900 * g, borderRadius: 15, background: `var(--hl-${r.c})` }} />
                <div style={{ position: "absolute", left: 314 + p * 900, top: y + 10, fontFamily: "var(--font-mono)", fontSize: 38 }}>{Math.round(p * 100)}%</div>
              </div>
            );
          })}
        </div>
      )}

      {/* s2–s5: four ingredients */}
      {COMPARES.map((c, k) => {
        const st = steps[k];
        const next = k < 3 ? steps[k + 1] : S.s6;
        if (frame < st.from || frame >= next.from + 15) return null;
        const on = beat(frame, st, 0.1, 0.4) * (1 - beat(frame, next, 0, 0.5));
        return (
          <div key={c.ing} style={{ opacity: on }}>
            <ComparePanel c={c} k={k} step={st} frame={frame} />
          </div>
        );
      })}

      {/* s6: what the four have in common */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: sixOn }}>
          {INGREDIENTS.map((w, i) => (
            <Chip key={w} text={w} color="yellow" fs={46} x={ingX[i]} y={200} style={{ opacity: beat(frame, S.s6, 0.4 + i * 0.25, 0.3) }} />
          ))}
          {INGREDIENTS.map((w, i) => (
            <Arrow key={w} x1={ingX[i] + ingW[i] / 2} y1={280} x2={mix(ingX[i] + ingW[i] / 2, 540, 0.6)} y2={384} p={beat(frame, S.s6, 1.6, 0.4)} width={5} />
          ))}
          <div style={{ position: "absolute", left: 250, top: 394, width: 580, height: 110, borderRadius: 24, border: "4px solid var(--ink)", background: "var(--paper)", display: "grid", placeItems: "center", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s6, 1.9, 0.4) }}>
            {L.change}
          </div>
          <Arrow x1={540} y1={512} x2={540} y2={590} p={beat(frame, S.s6, 2.6, 0.4)} />
          <div style={{ position: "absolute", left: 170, top: 600, width: 740, height: 110, borderRadius: 24, border: "4px solid var(--ink)", background: "var(--hl-mint)", color: "var(--chip-ink)", display: "grid", placeItems: "center", fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s6, 2.9, 0.4) }}>
            {L.then}
          </div>
          <Hand x={0} y={790} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.0, 0.4), rotate: "-2deg" }}>
            {L.notMagic}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontSize: 40, fontWeight: 500, color: "var(--ink-2)", opacity: beat(frame, S.s6, 5.4, 0.4) }}>{L.info}</div>
        </div>
      )}

      {/* s7: Part 9 toolbox */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontSize: 58, fontWeight: 700 }}>{L.done}</div>
          <div style={{ position: "absolute", left: 90, right: 90, top: 380, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
            {TOOLS9.map((t, i) => (
              <span
                key={t}
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  padding: "8px 22px",
                  borderRadius: 14,
                  background: ["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)", "var(--hl-pink)", "var(--hl-violet)", "var(--hl-orange)"][i % 6],
                  color: "var(--chip-ink)",
                  opacity: beat(frame, S.s7, 0.8 + i * 0.3, 0.3),
                  scale: String(mix(0.7, 1, beat(frame, S.s7, 0.8 + i * 0.3, 0.3))),
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontSize: 44, fontWeight: 700, opacity: beat(frame, S.s7, 4.4, 0.5) }}>{L.nextPart}</div>
          <PenUnderline x={540 - textWidth(L.nextPart, 44) / 2} y={824} w={textWidth(L.nextPart, 44)} p={beat(frame, S.s7, 5.0, 0.6)} />
          <Hand x={0} y={860} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.6, 0.5) }}>
            {L.nextCh}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch85.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
