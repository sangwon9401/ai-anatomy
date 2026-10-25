// Render the last frame of every step of every chapter; flag frames that error or hang.
// usage: OUT=out/check node scripts/check-scenes.mjs [firstId] [lastId]
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { getCompositions, openBrowser, renderStill } from "@remotion/renderer";

const [lo = 1, hi = 96] = process.argv.slice(2).map(Number);
const outDir = process.env.OUT;
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/remotion/index.ts"), publicDir: path.resolve("src/assets"), enableCaching: false });
const inputProps = { captions: true };
const browser = await openBrowser("chrome");
const comps = await getCompositions(serveUrl, { inputProps, puppeteerInstance: browser });

function endsOf(n) {
  const src = fs.readFileSync(`src/data/ch${String(n).padStart(2, "0")}.ts`, "utf8");
  const secs = [...src.matchAll(/\{\s*id:\s*"s\d+",\s*sec:\s*([\d.]+)/g)].map((m) => Number(m[1]));
  let f = 0;
  return secs.map((s) => (f += Math.round(s * 30)) - 1);
}

const problems = [];
for (const c of comps.filter((c) => /^ch\d+$/.test(c.id))) {
  const n = Number(c.id.slice(2));
  if (n < lo || n > hi) continue;
  const frames = endsOf(n);
  if (frames.at(-1) !== c.durationInFrames - 1) problems.push(`${c.id}: parsed end ${frames.at(-1)} != duration-1 ${c.durationInFrames - 1}`);
  for (const frame of frames) {
    const output = `${outDir}/${c.id}-${String(frame).padStart(5, "0")}.png`;
    const t0 = Date.now();
    try {
      await Promise.race([
        renderStill({ composition: c, serveUrl, output, frame, scale: 0.4, inputProps, puppeteerInstance: browser, timeoutInMilliseconds: 20000 }),
        new Promise((_, rej) => setTimeout(() => rej(new Error("HANG >45s")), 45000)),
      ]);
      const ms = Date.now() - t0;
      if (ms > 8000) problems.push(`${c.id}@${frame}: slow ${ms}ms`);
    } catch (e) {
      problems.push(`${c.id}@${frame}: ${String(e.message).split("\n")[0]}`);
      if (String(e.message).includes("HANG")) break;
    }
  }
  console.log(c.id, frames.length);
}
console.log("PROBLEMS", JSON.stringify(problems, null, 1));
await browser.close({ silent: true });
process.exit(0);
