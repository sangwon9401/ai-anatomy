// en fonts; see src/scenes/fonts.ts
import { getInfo as handInfo, loadFont as loadHand } from "@remotion/google-fonts/PatrickHand";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { getInfo as plexInfo, loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSans";

// Google Fonts for CJK and Korean are split into ~100 unicode-range slices. Loading all of them makes renders slow,
// so we load only the slices that contain characters the scenes actually draw (chunk keys like "[12]" are accepted at runtime).
function slicesFor(ranges: Record<string, string>, corpus: string) {
  const cps = [...new Set([...corpus].map((c) => c.codePointAt(0)!))];
  return Object.entries(ranges)
    .filter(([, r]) =>
      r.split(",").some((part) => {
        const [a, b] = part.trim().replace(/^U\+/i, "").split("-");
        const lo = parseInt(a, 16);
        const hi = parseInt(b ?? a, 16);
        return cps.some((cp) => cp >= lo && cp <= hi);
      }),
    )
    .map(([k]) => k);
}

export function loadSceneFonts(corpus: string) {
  const opts = { ignoreTooManyRequestsWarning: true } as const;
  loadPlex("normal", { weights: ["400", "500", "700"], subsets: slicesFor(plexInfo().unicodeRanges, corpus) as never[], ...opts });
  loadHand("normal", { weights: ["400"], subsets: slicesFor(handInfo().unicodeRanges, corpus) as never[], ...opts });
  loadMono("normal", { weights: ["500"], subsets: ["latin"] });
}
