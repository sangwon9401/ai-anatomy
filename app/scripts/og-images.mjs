// Render the link-preview images (site/og/*.jpg) that make-pages.mjs copies next to each chapter page.
// usage: node scripts/og-images.mjs            (all)   |   node scripts/og-images.mjs og-ch14 og-home
//        LOCALE=en node scripts/og-images.mjs   (a translation, into site/og/en/)
import fs from "node:fs";
import path from "node:path";
import { bundle, webpack } from "@remotion/bundler";
import { getCompositions, openBrowser, renderStill } from "@remotion/renderer";
import { webpackLocaleOverlay } from "./locale-overlay.mjs";

const only = process.argv.slice(2);
const locale = process.env.LOCALE ?? "ko";
const outDir = locale === "ko" ? "site/og" : `site/og/${locale}`;
const serveUrl = await bundle({
  entryPoint: path.resolve("src/remotion/index.ts"),
  publicDir: path.resolve("src/assets"),
  enableCaching: locale === "ko",
  webpackOverride: webpackLocaleOverlay(locale, webpack),
});
const browser = await openBrowser("chrome");
const comps = (await getCompositions(serveUrl, { puppeteerInstance: browser })).filter((c) => c.id.startsWith("og-") && (!only.length || only.includes(c.id)));
fs.mkdirSync(outDir, { recursive: true });
for (const composition of comps) {
  const output = `${outDir}/${composition.id.slice(3)}.jpg`;
  await renderStill({ composition, serveUrl, output, imageFormat: "jpeg", jpegQuality: 84, puppeteerInstance: browser });
  console.log(output);
}
await browser.close({ silent: true });
