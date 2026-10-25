import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { viteLocaleOverlay } from "./scripts/locale-overlay.mjs";

// LOCALE=en|ja|zh builds that language (files under src/i18n/<locale>/ replace their Korean counterparts).
// `vite build --mode artifact` inlines everything into one HTML file (for sharing the prototype).
// `vite build --mode pages` is the public website, served by GitHub Pages from /ai-anatomy/ (BASE_PATH overrides it),
// with Korean at the root and other languages in /en/, /ja/, /zh/.
const LOCALE = process.env.LOCALE ?? "ko";
const sub = LOCALE === "ko" ? "" : `${LOCALE}/`;

export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? `${process.env.BASE_PATH ?? "/ai-anatomy/"}${sub}` : "/",
  plugins: [viteLocaleOverlay(LOCALE), react(), ...(mode === "artifact" ? [viteSingleFile()] : [])],
  build: { outDir: mode === "artifact" ? "dist-artifact" : `dist/${sub}` },
}));
