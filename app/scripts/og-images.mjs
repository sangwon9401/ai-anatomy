// Render the link-preview images (site/og/*.jpg) that make-pages.mjs copies next to each chapter page.
// usage: node scripts/og-images.mjs            (all)   |   node scripts/og-images.mjs og-ch14 og-home
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { getCompositions, openBrowser, renderStill } from "@remotion/renderer";

const only = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/remotion/index.ts"), publicDir: path.resolve("src/assets") });
const browser = await openBrowser("chrome");
const comps = (await getCompositions(serveUrl, { puppeteerInstance: browser })).filter((c) => c.id.startsWith("og-") && (!only.length || only.includes(c.id)));
fs.mkdirSync("site/og", { recursive: true });
for (const composition of comps) {
  const output = `site/og/${composition.id.slice(3)}.jpg`;
  await renderStill({ composition, serveUrl, output, imageFormat: "jpeg", jpegQuality: 84, puppeteerInstance: browser });
  console.log(output);
}
await browser.close({ silent: true });
