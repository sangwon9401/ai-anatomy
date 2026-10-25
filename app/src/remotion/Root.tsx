import { Composition, Folder, Still, staticFile } from "remotion";
import NARRATION from "../data/narration.json";
import "../styles.css";
import { loadSceneFonts } from "../scenes/fonts";
import { FPS, audioKey, totalFrames } from "../scenes/kit";
import { BUILT, builtById, compId } from "../scenes/registry";
import { AppIcon } from "./AppIcon";
import { ChapterCompositions } from "./chapterRoot";
import { CURRICULUM } from "../data/curriculum";
import { SITE_NAME } from "../site";
import { OG_H, OG_HOME, OG_W, OgCard } from "./OgCard";

loadSceneFonts(JSON.stringify([BUILT.map((c) => [c.spec, c.corpus]), CURRICULUM, OG_HOME, SITE_NAME]));

// clips are served from src/assets (see remotion.config.ts)
const AUDIO: Record<string, string> = {};
for (const [chapter, steps] of Object.entries(NARRATION as Record<string, Record<string, number>>)) {
  for (const step of Object.keys(steps)) {
    const key = audioKey(Number(chapter), step);
    AUDIO[key] = staticFile(`narration/${key}.m4a`);
  }
}

export const RemotionRoot = () => (
  <>
    <ChapterCompositions list={BUILT} audio={AUDIO} />
    <Folder name="og">
      {/* as long as the chapter, so the <Freeze> inside can reach any of its frames (frames are clamped to the composition) */}
      {[{ key: "home", props: OG_HOME }, ...BUILT.map((c) => ({ key: compId(c.spec.id), props: { id: c.spec.id } }))].map(({ key, props }) => (
        <Composition
          key={key}
          id={`og-${key}`}
          component={OgCard}
          width={OG_W}
          height={OG_H}
          fps={FPS}
          durationInFrames={totalFrames(builtById(props.id)!.spec)}
          defaultProps={props}
        />
      ))}
    </Folder>
    <Folder name="app-icon">
      <Still id="icon-fg" component={AppIcon} width={432} height={432} defaultProps={{ layer: "fg" as const, size: 432 }} />
      <Still id="icon-bg" component={AppIcon} width={432} height={432} defaultProps={{ layer: "bg" as const, size: 432 }} />
      <Still id="icon-full" component={AppIcon} width={512} height={512} defaultProps={{ layer: "full" as const, size: 512 }} />
      <Still id="splash" component={AppIcon} width={2732} height={2732} defaultProps={{ layer: "splash" as const, size: 2732 }} />
    </Folder>
  </>
);
