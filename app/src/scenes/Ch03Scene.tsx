import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ERAS, ch03, type Era } from "../data/ch03";
import { Caption, Narration, EASE_IO, Hand, InlineCircle, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "./kit";

const tl = buildTimeline(ch03);
const S = byId(tl);
const L = ch03.labels;

const TOP = 150;
const GAP = 178;
const LINE_X = 280;
const yOf = (j: number) => TOP + j * GAP;
const CONTENT_END = yOf(ERAS.length - 1) + 150;
const MAX_CAM = CONTENT_END - 1120;

const KIND: Record<Era["kind"], { dot: string; tag?: string; tagColor?: string }> = {
  learn: { dot: "var(--hl-mint)", tag: L.learn, tagColor: "var(--hl-mint)" },
  rule: { dot: "var(--hl-orange)", tag: L.rule, tagColor: "var(--hl-orange)" },
  winter: { dot: "var(--hl-sky)", tag: L.winter, tagColor: "var(--hl-sky)" },
  event: { dot: "var(--hl-violet)" },
  star: { dot: "var(--hl-yellow)" },
};

// camera: centre each step's events, clamped to the content
const cams = tl.map((s) => {
  const js = ERAS.map((e, j) => (e.step === s.id ? j : -1)).filter((j) => j >= 0);
  const focus = js.reduce((a, j) => a + yOf(j), 0) / js.length + 60;
  return Math.min(Math.max(focus - 480, 0), MAX_CAM);
});
const revealAt = ERAS.map((e, j) => {
  const k = ERAS.slice(0, j).filter((x) => x.step === e.step).length;
  return { step: e.step, t: (e.step === "s1" ? 2.2 : 0.6) + k * 2.2 };
});

export const Ch03Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const cur = Math.max(0, tl.findIndex((s) => frame >= s.from && frame < s.to));
  const curIdx = frame >= tl[tl.length - 1].to ? tl.length - 1 : cur;
  const cam = curIdx === 0 ? cams[0] : mix(cams[curIdx - 1], cams[curIdx], beat(frame, tl[curIdx], 0, 1.2, EASE_IO));

  const shown = ERAS.map((_, j) => beat(frame, S[revealAt[j].step], revealAt[j].t, 0.6));
  const lastShown = shown.reduce((acc, v, j) => (v > 0 ? j : acc), -1);
  const lineEnd = lastShown < 0 ? TOP : mix(yOf(Math.max(lastShown - 1, 0)) + 30, yOf(lastShown) + 30, shown[lastShown]);

  return (
    <Paper>
      <div style={{ position: "absolute", inset: 0, translate: `0px ${-cam}px` }}>
        <div style={{ position: "absolute", left: LINE_X - 3, top: TOP - 40, width: 6, height: Math.max(0, lineEnd - TOP + 40), background: "var(--ink)", borderRadius: 3 }} />
        {ERAS.map((e, j) => {
          const a = shown[j];
          const y = yOf(j);
          const k = KIND[e.kind];
          const winter = e.kind === "winter";
          const star = e.kind === "star";
          return (
            <div key={e.year + e.title} style={{ opacity: a }}>
              {winter && <div style={{ position: "absolute", left: 0, right: 0, top: y - 18, height: 156, background: "var(--paper-2)", opacity: 0.9 }} />}
              <div style={{ position: "absolute", left: 30, width: 220, top: y + 6, textAlign: "right", fontSize: e.year.length > 5 ? 34 : 44, fontWeight: 700, color: winter ? "var(--ink-2)" : "var(--ink)" }}>
                {e.year}
              </div>
              {k.tag && (
                <div style={{ position: "absolute", left: 30, width: 220, top: y + 66, textAlign: "right" }}>
                  <span style={{ fontSize: 26, background: k.tagColor, color: "var(--chip-ink)", borderRadius: 8, padding: "2px 10px" }}>{k.tag}</span>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  left: LINE_X - 15,
                  top: y + 15,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: k.dot,
                  border: "5px solid var(--ink)",
                  scale: String(mix(0.3, 1, a)),
                }}
              />
              <div style={{ position: "absolute", left: 330, width: 700, top: y, translate: `${mix(30, 0, a)}px 0px` }}>
                <div style={{ fontSize: star ? 46 : 40, fontWeight: 700, lineHeight: 1.3 }}>
                  <span style={star ? { background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 8px" } : undefined}>{e.title}</span>
                </div>
                <div style={{ fontSize: 31, color: "var(--ink-2)", lineHeight: 1.4, marginTop: 6 }}>{e.desc}</div>
              </div>
            </div>
          );
        })}

        {/* 2017: the T in GPT */}
        <Hand x={820} y={yOf(10) + 108} fs={44} style={{ opacity: beat(frame, S.s6, 2.4, 0.4), rotate: "-4deg" }}>
          <InlineCircle p={beat(frame, S.s6, 2.7, 0.5)}>{L.gpt}</InlineCircle>
        </Hand>
      </div>

      {/* cards scroll up under a paper band instead of colliding with the header */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 130, background: "linear-gradient(var(--paper) 62%, transparent)" }} />
      <div style={{ position: "absolute", right: 56, top: captions ? 36 : 30, fontSize: 26, color: "var(--ink-3)" }}>{L.note}</div>
      {captions && <Tag text={L.tag} />}
      <Narration tl={tl} chapter={ch03.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
