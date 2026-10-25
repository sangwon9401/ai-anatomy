import { Composition } from "remotion";
import "../styles.css";
import { compId, type BuiltChapter } from "../scenes/built";
import { loadSceneFonts } from "../scenes/fonts";
import { FPS, H, W, totalFrames } from "../scenes/kit";

/** One composition per chapter; `audio` maps clip keys to URLs when narration clips exist. */
export const ChapterCompositions = ({ list, audio }: { list: BuiltChapter[]; audio?: Record<string, string> }) => (
  <>
    {list.map((c) => (
      <Composition
        key={c.spec.id}
        id={compId(c.spec.id)}
        component={c.Scene}
        durationInFrames={totalFrames(c.spec)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ captions: true, audio }}
      />
    ))}
  </>
);

/** A Remotion root holding only `list` (used by the per-Part entries in ./parts). */
export function chapterRoot(list: BuiltChapter[]) {
  loadSceneFonts(JSON.stringify(list.map((c) => [c.spec, c.corpus])));
  return () => <ChapterCompositions list={list} />;
}
