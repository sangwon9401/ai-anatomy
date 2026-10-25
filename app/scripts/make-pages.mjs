// After `vite build --mode pages` for one language (LOCALE, default ko): give every chapter its own page
// (dist/[locale/]chNN/index.html) so a shared link previews that chapter (title, question, picture) and search
// engines can read its script. Also writes that language's web manifest and copies its preview images;
// the Korean run (the site root) also writes sitemap.xml (all published languages), robots.txt and 404.html.
import fs from "node:fs";
import { build } from "esbuild";
import { META, esbuildLocaleOverlay } from "./locale-overlay.mjs";

const LOCALE = process.env.LOCALE ?? "ko";
const ROOT = (process.env.SITE_URL ?? "https://sangwon9401.github.io/ai-anatomy/").replace(/\/?$/, "/");
const sub = (l) => (l === "ko" ? "" : `${l}/`);
const SITE = `${ROOT}${sub(LOCALE)}`;
const meta = META[LOCALE];
const published = Object.keys(META).filter((l) => META[l].ready || l === LOCALE);
const dist = `dist/${sub(LOCALE)}`.replace(/\/$/, "");
const ogDir = LOCALE === "ko" ? "site/og" : `site/og/${LOCALE}`;

// The chapter specs and UI strings are TypeScript (with this language's overlays); bundle them for Node.
const ids = fs
  .readdirSync("src/data")
  .map((f) => f.match(/^ch(\d\d)\.ts$/)?.[1])
  .filter(Boolean)
  .sort();
const entry = [
  ...ids.map((n) => `export { ch${n} } from "./src/data/ch${n}.ts";`),
  `export { partTitle } from "./src/data/curriculum.ts";`,
  `export { T } from "./src/ui/strings.ts";`,
].join("\n");
const bundled = await build({
  stdin: { contents: entry, resolveDir: process.cwd(), loader: "ts" },
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
  logLevel: "warning",
  plugins: [esbuildLocaleOverlay(LOCALE)],
});
const data = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);
const { T } = data;
const chapters = ids.map((n) => data[`ch${n}`]);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const shell = fs.readFileSync(`${dist}/index.html`, "utf8");
const chapterPath = (n) => `ch${String(n).padStart(2, "0")}/`;

function page({ title, desc, path, image, body, hash }) {
  const url = `${SITE}${path}`;
  const head = [
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...published.map((l) => `<link rel="alternate" hreflang="${META[l].lang}" href="${ROOT}${sub(l)}${path}" />`),
    `<link rel="alternate" hreflang="x-default" href="${ROOT}${path}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(meta.name)}" />`,
    `<meta property="og:locale" content="${meta.ogLocale}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    // a chapter page opens its chapter; a bare "#" (the table of contents) is left alone
    ...(hash ? [`<script>if (!location.hash && !location.href.endsWith("#")) history.replaceState(null, "", "#${hash}");</script>`] : []),
  ].join("\n    ");
  return shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, head)
    .replace('<div id="root"></div>', `<div id="root"><main class="wrap narrow">${body}</main></div>`);
}

// table of contents
const toc = chapters.map((c) => `<li><a href="${chapterPath(c.id)}">${esc(T.chTitle(c.id, c.title))}</a> ${esc(c.hook)}</li>`).join("");
const home = page({
  title: meta.title,
  desc: meta.description,
  path: "",
  image: `${SITE}og/home.jpg`,
  body: `<h1>${esc(meta.name)}</h1><p>${esc(meta.description)}</p><ol>${toc}</ol>`,
});
fs.writeFileSync(`${dist}/index.html`, home);

for (const c of chapters) {
  const dir = `${dist}/${chapterPath(c.id)}`;
  fs.mkdirSync(dir, { recursive: true });
  const body = [
    `<p><a href="../">${esc(meta.name)}</a> · ${esc(T.ogPart(c.part, data.partTitle(c.part)))}</p>`,
    `<h1>${esc(T.chTitle(c.id, c.title))}</h1>`,
    `<p>Q. ${esc(c.hook)}</p>`,
    `<ol>${c.steps.map((s) => `<li>${esc(s.narration)}</li>`).join("")}</ol>`,
    `<h2>${esc(T.pageSummary)}</h2><ul>${c.summary.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`,
  ].join("");
  fs.writeFileSync(
    `${dir}index.html`,
    page({
      title: `${T.chTitle(c.id, c.title)} · ${meta.name}`,
      desc: `${c.hook} ${c.summary[0] ?? ""}`.trim(),
      path: chapterPath(c.id),
      image: `${SITE}og/${chapterPath(c.id).slice(0, -1)}.jpg`,
      body,
      hash: chapterPath(c.id).slice(0, -1),
    }),
  );
}

if (fs.existsSync(ogDir)) {
  fs.mkdirSync(`${dist}/og`, { recursive: true });
  for (const f of fs.readdirSync(ogDir).filter((f) => f.endsWith(".jpg"))) fs.copyFileSync(`${ogDir}/${f}`, `${dist}/og/${f}`);
}
const manifest = JSON.parse(fs.readFileSync(`${dist}/manifest.webmanifest`, "utf8"));
fs.writeFileSync(`${dist}/manifest.webmanifest`, JSON.stringify({ ...manifest, name: meta.name, short_name: meta.name, description: meta.description, lang: meta.lang }, null, 2));

if (LOCALE === "ko") {
  fs.writeFileSync(`${dist}/404.html`, home);
  const urls = published.flatMap((l) => ["", ...chapters.map((c) => chapterPath(c.id))].map((p) => `${ROOT}${sub(l)}${p}`));
  fs.writeFileSync(`${dist}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
  fs.writeFileSync(`${dist}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${ROOT}sitemap.xml\n`);
}
console.log(`[${LOCALE}] wrote ${chapters.length} chapter pages for ${SITE}`);
