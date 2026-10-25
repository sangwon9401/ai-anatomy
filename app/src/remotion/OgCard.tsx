import type { FC } from "react";
import { AbsoluteFill, Freeze } from "remotion";
import { partTitle } from "../data/curriculum";
import type { BuiltChapter } from "../scenes/built";
import { builtById } from "../scenes/registry";
import { H, Paper, W, buildTimeline } from "../scenes/kit";
import { SITE_NAME } from "../site";
import { T } from "../ui/strings";

// Link-preview image (1200 × 630) for a chapter page: its title and question beside a still from its animation.
export const OG_W = 1200;
export const OG_H = 630;
const SCALE = OG_H / H;

/** The end of the middle step (usually the chapter's central picture, fully drawn), or of `step` when given. */
export const ogFrame = (c: BuiltChapter, step?: number) => {
  const tl = buildTimeline(c.spec);
  return tl[step ?? Math.floor((tl.length - 1) / 2)].to - 1;
};

// the site's own card: ch61's opening blueprint with the course's running sentence
export const OG_HOME = { id: 61, step: 0, headline: T.ogHomeHeadline, sub: T.ogHomeSub };

export const OgCard: FC<{ id: number; step?: number; headline?: string; sub?: string }> = ({ id, step, headline, sub }) => {
  const chapter = builtById(id)!;
  const { spec, Scene } = chapter;
  return (
    <AbsoluteFill>
      <Paper>
        <div style={{ position: "absolute", left: 64, top: 56, width: OG_W - W * SCALE - 120, display: "grid", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px 14px", fontSize: 28, fontWeight: 700 }}>
            <span style={{ background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 8, padding: "2px 12px", whiteSpace: "nowrap" }}>{SITE_NAME}</span>
            <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>{sub ?? T.ogPart(spec.part, partTitle(spec.part))}</span>
          </div>
          <div style={{ fontSize: headline ? 60 : 64, fontWeight: 700, lineHeight: 1.22, wordBreak: "keep-all", letterSpacing: "-0.01em" }}>
            {headline ?? (
              <>
                <span style={{ color: "var(--pen)" }}>{T.ch(spec.id)}</span> {spec.title}
              </>
            )}
          </div>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 40, lineHeight: 1.3, color: "var(--ink-2)", wordBreak: "keep-all" }}>
            <span style={{ color: "var(--pen)", marginRight: 10 }}>Q.</span>
            {spec.hook}
          </div>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, width: W * SCALE, height: OG_H, overflow: "hidden", borderLeft: "3px solid var(--grid-major)" }}>
          <div style={{ position: "relative", width: W, height: H, transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
            <Freeze frame={ogFrame(chapter, step)}>
              <Scene captions={false} />
            </Freeze>
          </div>
        </div>
      </Paper>
    </AbsoluteFill>
  );
};
