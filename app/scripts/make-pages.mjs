// After `vite build --mode pages`: give every chapter its own page (dist/chNN/index.html) so a shared link
// previews that chapter (title, question, picture) and search engines can read its script. Also writes
// sitemap.xml, robots.txt, a 404 fallback and copies the preview images from site/og.
import fs from "node:fs";
import { build } from "esbuild";

const SITE = (process.env.SITE_URL ?? "https://sangwon9401.github.io/ai-anatomy/").replace(/\/?$/, "/");
const NAME = "AI 해부교실";
const DESC = "고1 눈높이로 ChatGPT가 어떻게 만들어졌는지 96장의 애니메이션과 직접 해보기로 배워요. 토큰, 임베딩, 어텐션, 학습, RLHF까지.";
const dist = "dist";

// The chapter specs are TypeScript; bundle them into one module Node can import.
const ids = fs
  .readdirSync("src/data")
  .map((f) => f.match(/^ch(\d\d)\.ts$/)?.[1])
  .filter(Boolean)
  .sort();
const entry = [...ids.map((n) => `export { ch${n} } from "./src/data/ch${n}.ts";`), `export { partTitle } from "./src/data/curriculum.ts";`].join("\n");
const bundled = await build({ stdin: { contents: entry, resolveDir: process.cwd(), loader: "ts" }, bundle: true, format: "esm", platform: "node", write: false, logLevel: "warning" });
const data = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);
const chapters = ids.map((n) => data[`ch${n}`]);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const shell = fs.readFileSync(`${dist}/index.html`, "utf8");

function page({ title, desc, url, image, body, hash }) {
  const meta = [
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${NAME}" />`,
    `<meta property="og:locale" content="ko_KR" />`,
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
    .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, meta)
    .replace('<div id="root"></div>', `<div id="root"><main class="wrap narrow">${body}</main></div>`);
}

const chapterPath = (n) => `ch${String(n).padStart(2, "0")}/`;

// table of contents
const toc = chapters.map((c) => `<li><a href="${chapterPath(c.id)}">${c.id}장 ${esc(c.title)}</a> ${esc(c.hook)}</li>`).join("");
const home = page({
  title: `${NAME}: ChatGPT는 어떻게 만들어졌을까`,
  desc: DESC,
  url: SITE,
  image: `${SITE}og/home.jpg`,
  body: `<h1>${NAME}</h1><p>${esc(DESC)}</p><ol>${toc}</ol>`,
});
fs.writeFileSync(`${dist}/index.html`, home);
fs.writeFileSync(`${dist}/404.html`, home);

for (const c of chapters) {
  const dir = `${dist}/${chapterPath(c.id)}`;
  fs.mkdirSync(dir, { recursive: true });
  const body = [
    `<p><a href="../">${NAME}</a> · Part ${c.part} ${esc(data.partTitle(c.part))}</p>`,
    `<h1>${c.id}장 ${esc(c.title)}</h1>`,
    `<p>Q. ${esc(c.hook)}</p>`,
    `<ol>${c.steps.map((s) => `<li>${esc(s.narration)}</li>`).join("")}</ol>`,
    `<h2>한 장 요약</h2><ul>${c.summary.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`,
  ].join("");
  fs.writeFileSync(
    `${dir}index.html`,
    page({
      title: `${c.id}장 ${c.title} · ${NAME}`,
      desc: `${c.hook} ${c.summary[0] ?? ""}`.trim(),
      url: `${SITE}${chapterPath(c.id)}`,
      image: `${SITE}og/${chapterPath(c.id).slice(0, -1)}.jpg`,
      body,
      hash: chapterPath(c.id).slice(0, -1),
    }),
  );
}

fs.cpSync("site/og", `${dist}/og`, { recursive: true });
const urls = [SITE, ...chapters.map((c) => `${SITE}${chapterPath(c.id)}`)];
fs.writeFileSync(`${dist}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(`${dist}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${SITE}sitemap.xml\n`);
console.log(`wrote ${chapters.length} chapter pages, sitemap and robots for ${SITE}`);
