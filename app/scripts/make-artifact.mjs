// Turn the single-file Vite build into an Artifact page: the host adds doctype/head/body itself,
// so keep only our <title>, metas, font links, styles and the inlined app script.
import fs from "node:fs";

const html = fs.readFileSync("dist-artifact/index.html", "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/i)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/i)[1];
const title = head.match(/<title>[\s\S]*?<\/title>/i)[0];
const rest = head
  .replace(title, "")
  .replace(/<meta charset[^>]*>/i, "")
  .replace(/<meta name="viewport"[^>]*>/i, "")
  // the artifact host has no manifest, icons or service worker
  .replace(/<link rel="(manifest|icon|apple-touch-icon)"[^>]*>\s*/gi, "")
  .replace(/<meta name="apple-mobile-web-app-[^>]*>\s*/gi, "");
fs.mkdirSync("../artifact", { recursive: true });
fs.writeFileSync("../artifact/index.html", `${title}\n${rest.trim()}\n${body.trim()}\n`);
console.log("wrote ../artifact/index.html", (fs.statSync("../artifact/index.html").size / 1024).toFixed(0), "KB");
