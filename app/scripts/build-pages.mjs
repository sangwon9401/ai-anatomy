// Build the public website: every published language (`ready` in src/i18n/meta.json) into dist/,
// Korean at the root and the others in dist/<locale>/. LOCALES=ko,en overrides the list (for testing).
import { execSync } from "node:child_process";
import { META } from "./locale-overlay.mjs";

const only = process.env.LOCALES?.split(",");
const locales = Object.keys(META)
  .filter((l) => (only ? only.includes(l) : META[l].ready))
  // Korean first: its build empties dist/
  .sort((a, b) => (a === "ko" ? -1 : b === "ko" ? 1 : 0));

for (const locale of locales) {
  const env = { ...process.env, LOCALE: locale };
  execSync("npx vite build --mode pages --logLevel warn", { stdio: "inherit", env });
  execSync("node scripts/make-pages.mjs", { stdio: "inherit", env });
}
