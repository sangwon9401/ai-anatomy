// Render a few frames per composition to PNG for a quick visual check.
// usage: node scripts/stills.mjs ch01:539,959 ch14:629
//        node scripts/stills.mjs --part 2 ch16:120,300   (bundles only that Part: faster, and unaffected by other Parts)
//        node scripts/stills.mjs --part 2 ch16:ends       ("ends" = the last frame of every step)
//        node scripts/stills.mjs --locale en --part 2 ch16:ends   (a translation; files are named en-ch16-…)
import fs from "node:fs";
import path from "node:path";
import { bundle, webpack } from "@remotion/bundler";
import { overlayFor, webpackLocaleOverlay } from "./locale-overlay.mjs";
import { renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const partFlag = args.indexOf("--part");
const part = partFlag >= 0 ? args.splice(partFlag, 2)[1] : null;
const localeFlag = args.indexOf("--locale");
const locale = localeFlag >= 0 ? args.splice(localeFlag, 2)[1] : "ko";
const prefix = locale === "ko" ? "" : `${locale}-`;
const entryPoint = path.resolve(part ? `src/remotion/parts/part${part}.ts` : "src/remotion/index.ts");
const jobs = args.map((a) => {
  const [id, frames] = a.split(":");
  return { id, frames };
});
// Parts are rendered by several builders at once, so their bundles skip the shared webpack cache.
const serveUrl = await bundle({
  entryPoint,
  publicDir: path.resolve("src/assets"),
  enableCaching: !part && locale === "ko",
  webpackOverride: webpackLocaleOverlay(locale, webpack),
});
fs.mkdirSync("out/stills", { recursive: true });
const inputProps = { captions: true };

// last frame of each step, read from the chapter spec's step lengths (no narration clips are bundled)
function endsOf(id) {
  const n = Number(id.replace("ch", ""));
  const base = path.resolve(`src/data/ch${String(n).padStart(2, "0")}.ts`);
  const src = fs.readFileSync(overlayFor(locale, base) ?? base, "utf8");
  const secs = [...src.matchAll(/\{\s*id:\s*"s\d+",\s*sec:\s*([\d.]+)/g)].map((m) => Number(m[1]));
  let f = 0;
  return secs.map((s) => (f += Math.round(s * 30)) - 1);
}
for (const { id, frames } of jobs) {
  const composition = await selectComposition({ serveUrl, id, inputProps });
  const list = frames === "ends" ? endsOf(id) : frames.split(",").map(Number);
  for (const frame of list) {
    const output = `out/stills/${prefix}${id}-${frame}.png`;
    await renderStill({ composition, serveUrl, output, frame, scale: 0.5, inputProps });
    console.log(output);
  }
}
