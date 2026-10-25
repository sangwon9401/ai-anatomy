import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { FLAVORS4, FRIENDS, ch07 } from "../data/ch07";
import { Caption, Chip, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, type SceneProps } from "./kit";
import { Axes, Vec, at, type Plane } from "./plane";

const tl = buildTimeline(ch07);
const S = byId(tl);
const L = ch07.labels;

const PL: Plane = { ox: 170, oy: 1010, unit: 80 };
const hlc = (c: string) => `var(--hl-${c})`;
// deterministic "embedding" heights for the long-vector strip
const STRIP = Array.from({ length: 84 }, (_, i) => Math.sin(i * 2.3 + 1) * 0.6 + Math.sin(i * 0.7) * 0.4);

export const Ch07Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const planeOn = 1 - beat(frame, S.s5, 0, 0.5);
  const barsOn = beat(frame, S.s5, 0.4, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const stripOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const [minji] = FRIENDS;
  const tip = (v: [number, number]) => at(PL, v);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s5.from + 20 && (
        <div style={{ opacity: planeOn }}>
          <Axes pl={PL} x={[0, 10.6]} y={[0, 10.4]} p={beat(frame, S.s1, 0.3, 1.0)} ticks={[0, 5, 10]} labelX={L.spicy} labelY={L.sweet} />

          {/* s2: the vector written as numbers */}
          <div style={{ position: "absolute", right: 60, top: 120, display: "flex", alignItems: "center", gap: 12, fontSize: 56, fontWeight: 700, opacity: beat(frame, S.s2, 0.4, 0.5) }}>
            <span>{L.minji} = (</span>
            <span style={{ background: "var(--hl-pink)", color: "var(--chip-ink)", borderRadius: 10, padding: "0 12px", opacity: beat(frame, S.s2, 0.9, 0.3) }}>8</span>
            <span>,</span>
            <span style={{ background: "var(--hl-pink)", color: "var(--chip-ink)", borderRadius: 10, padding: "0 12px", opacity: beat(frame, S.s2, 1.4, 0.3) }}>3</span>
            <span>)</span>
          </div>
          <div style={{ position: "absolute", right: 60, top: 210, display: "flex", gap: 34, fontSize: 30, color: "var(--ink-2)", opacity: beat(frame, S.s2, 1.8, 0.4) }}>
            <span>{L.spicy}</span>
            <span>{L.sweet}</span>
          </div>
          <Hand x={660} y={270} fs={52} style={{ opacity: beat(frame, S.s2, 3.0, 0.4), rotate: "-3deg" }}>
            = {L.vector}
          </Hand>

          {/* s3: the vector as an arrow */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: beat(frame, S.s3, 2.4, 0.5) * (1 - beat(frame, S.s4, 0, 0.4)) }}>
            <line x1={tip(minji.v)[0]} y1={tip(minji.v)[1]} x2={tip(minji.v)[0]} y2={PL.oy} stroke="var(--pen)" strokeWidth={4} strokeDasharray="10 10" />
            <line x1={tip(minji.v)[0]} y1={tip(minji.v)[1]} x2={PL.ox} y2={tip(minji.v)[1]} stroke="var(--pen)" strokeWidth={4} strokeDasharray="10 10" />
          </svg>
          <Hand x={PL.ox - 30} y={PL.oy + 60} fs={36} color="var(--ink-2)" style={{ opacity: beat(frame, S.s3, 0.4, 0.4) }}>
            {L.origin}
          </Hand>
          {FRIENDS.map((f, i) => {
            const t = i === 0 ? beat(frame, S.s3, 0.8, 1.2) : beat(frame, S.s4, 0.4 + (i - 1) * 1.6, 1.0);
            const [x, y] = tip(f.v);
            return (
              <div key={f.name}>
                <Vec pl={PL} v={f.v} p={t} color={hlc(f.c)} width={12} />
                <Vec pl={PL} v={f.v} p={t} color="var(--ink)" width={3} />
                <div style={{ position: "absolute", left: x + 18, top: y - 64, fontSize: 38, fontWeight: 700, opacity: t, whiteSpace: "nowrap" }}>
                  {f.name} <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 500 }}>({f.v.join(", ")})</span>
                </div>
              </div>
            );
          })}
          <Hand x={560} y={450} fs={48} style={{ opacity: beat(frame, S.s4, 4.0, 0.4), rotate: "-4deg" }}>
            {L.minji}·{L.seoyeon}: {L.similar} {L.arrowSE}
          </Hand>
        </div>
      )}

      {/* s5: more dimensions, shown as bars */}
      {frame >= S.s5.from && frame < S.s6.from + 20 && (
        <div style={{ opacity: barsOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 58, fontWeight: 700 }}>
            {L.minji} = (<span style={{ fontFamily: "var(--font-mono)" }}>{FLAVORS4.map((f) => f.v).join(", ")}</span>)
          </div>
          {FLAVORS4.map((f, i) => {
            const a = beat(frame, S.s5, 0.8 + i * 0.3, 0.6);
            const x = 210 + i * 190;
            const h = f.v * 44 * a;
            return (
              <div key={f.name}>
                <div style={{ position: "absolute", left: x, top: 820 - h, width: 140, height: h, background: ["var(--hl-pink)", "var(--hl-yellow)", "var(--hl-sky)", "var(--hl-mint)"][i], borderRadius: "14px 14px 3px 3px" }} />
                <div style={{ position: "absolute", left: x, width: 140, top: 820 - h - 56, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, opacity: a }}>{f.v}</div>
                <div style={{ position: "absolute", left: x - 20, width: 180, top: 838, textAlign: "center", fontSize: 34, fontWeight: 500, opacity: a }}>{f.name}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 180, top: 818, width: 760, height: 5, background: "var(--ink)" }} />
          <Hand x={220} y={300} fs={50} style={{ opacity: beat(frame, S.s5, 2.4, 0.4) }}>
            {L.dims} · {L.dimNote}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 920, textAlign: "center", fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s5, 3.6, 0.4) }}>{L.noDraw}</div>
        </div>
      )}

      {/* s6: GPT's word vectors are very long */}
      {frame >= S.s6.from && frame < S.s7.from + 20 && (
        <div style={{ opacity: stripOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.gpt}</div>
          <Chip text={L.word} color="yellow" fs={56} x={80} y={560} />
          <div style={{ position: "absolute", left: 250, top: 556, fontSize: 64, color: "var(--ink-3)" }}>→</div>
          {STRIP.map((v, i) => {
            const a = beat(frame, S.s6, 0.8 + i * 0.02, 0.2);
            const h = Math.abs(v) * 120 * a;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 330 + i * 7.6,
                  top: v > 0 ? 610 - h : 610,
                  width: 5.4,
                  height: h,
                  background: v > 0 ? "var(--hl-sky)" : "var(--hl-pink)",
                  borderRadius: 2,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 330, top: 608, width: 650, height: 3, background: "var(--ink-3)" }} />
          <div style={{ position: "absolute", left: 960, top: 580, fontSize: 44, color: "var(--ink-2)" }}>…</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", opacity: beat(frame, S.s6, 2.8, 0.5) }}>
            <span style={{ fontSize: 60, fontWeight: 700, fontFamily: "var(--font-mono)", background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 24px" }}>
              {L.count}
            </span>
          </div>
          <Hand x={380} y={930} fs={50} style={{ opacity: beat(frame, S.s6, 4.2, 0.4) }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s7: summary */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontSize: 64, fontWeight: 700 }}>{L.sum}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 56, opacity: beat(frame, S.s7, 1.2, 0.5) }}>
            {L.examples}
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch07.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
