// Find Korean text that would still show in a translation: bundles the app with LOCALE's overlays (comments are
// dropped, so what remains is real strings) and reports Hangul per source file.
// usage: node scripts/i18n-check.mjs en                 (whole app)
//        node scripts/i18n-check.mjs en 16 17 18        (only files whose path mentions those chapters / their Part)
import { build } from "esbuild";
import { esbuildLocaleOverlay } from "./locale-overlay.mjs";

const [locale, ...ids] = process.argv.slice(2);
if (!locale || locale === "ko") throw new Error("usage: node scripts/i18n-check.mjs <en|ja|zh> [chapter ids]");
const out = await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  format: "esm",
  write: false,
  packages: "external",
  loader: { ".css": "empty", ".png": "empty", ".m4a": "empty" },
  jsx: "automatic",
  logLevel: "error",
  charset: "utf8",
  define: { "import.meta.env.MODE": '"pages"', "import.meta.env.BASE_URL": '"/"' },
  plugins: [esbuildLocaleOverlay(locale)],
});
const parts = ids.map((n) => Math.floor(Number(n)));
const wanted = (file) => {
  if (!ids.length) return true;
  const ch = file.match(/ch(\d+)/i);
  if (ch && parts.includes(Number(ch[1]))) return true;
  return false;
};
let file = "?";
const hits = new Map();
for (const line of out.outputFiles[0].text.split("\n")) {
  const m = line.match(/^\/\/ (src\/\S+)$/);
  if (m) {
    file = m[1];
    continue;
  }
  if (/[가-힣]/.test(line) && wanted(file)) {
    if (!hits.has(file)) hits.set(file, []);
    hits.get(file).push(line.trim().slice(0, 140));
  }
}
if (!hits.size) console.log(`[${locale}] no Korean left${ids.length ? ` in chapters ${ids.join(", ")}` : ""}`);
for (const [f, lines] of hits) {
  console.log(`\n${f}  (${lines.length} lines)`);
  for (const l of lines.slice(0, 6)) console.log(`   ${l}`);
}
