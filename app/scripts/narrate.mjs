// Generate one narration clip per scene step with macOS `say`, and record each clip's length
// in src/data/narration.json so the timeline can stretch a step to fit its voice-over.
// usage: node scripts/narrate.mjs            (VOICE=Yuna RATE=195 by default; unchanged lines are skipped)
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const VOICE = process.env.VOICE ?? "Yuna";
const RATE = process.env.RATE ?? "195";
const OUT = "src/assets/narration";
const MANIFEST = "src/data/narration.json";
const CACHE = path.join(OUT, "cache.json");

// how the voice should *say* things the screen writes differently
const SPOKEN = [
  [/ChatGPT/g, "챗지피티"],
  [/GPT-1/g, "지피티 원"],
  [/GPT-3/g, "지피티 쓰리"],
  [/GPT의 T/g, "지피티의 티"],
  [/GPT/g, "지피티"],
  [/\bAI\b/g, "에이아이"],
  [/Query/g, "쿼리"],
  [/Key/g, "키"],
  [/Value/g, "밸류"],
  [/−\s?(\d)/g, "마이너스 $1"],
  [/(\d)%/g, "$1퍼센트"],
  [/…/g, ", "],
];
const spoken = (step) => SPOKEN.reduce((t, [re, to]) => t.replace(re, to), step.tts ?? step.narration);

const files = fs.readdirSync("src/data").filter((f) => /^ch\d+\.ts$/.test(f)).sort();
const chapters = [];
for (const f of files) {
  const mod = await import(path.resolve("src/data", f));
  chapters.push(mod[f.replace(".ts", "")]);
}

const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};
const manifest = {};
let made = 0;
for (const ch of chapters) {
  manifest[ch.id] = {};
  for (const step of ch.steps) {
    const key = `ch${String(ch.id).padStart(2, "0")}-${step.id}`;
    const file = path.join(OUT, `${key}.m4a`);
    const text = spoken(step);
    const hash = createHash("sha1").update(`${VOICE}|${RATE}|${text}`).digest("hex");
    if (cache[key] !== hash || !fs.existsSync(file)) {
      execFileSync("say", ["-v", VOICE, "-r", RATE, "-o", file, "--file-format=m4af", "--data-format=aac", text]);
      cache[key] = hash;
      made++;
    }
    const info = execFileSync("afinfo", [file], { encoding: "utf8" });
    manifest[ch.id][step.id] = Number(Number(info.match(/estimated duration: ([\d.]+)/)[1]).toFixed(2));
  }
}
fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2) + "\n");
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`voice ${VOICE} @${RATE}: ${made} new clip(s), ${Object.values(manifest).reduce((a, m) => a + Object.keys(m).length, 0)} total`);
