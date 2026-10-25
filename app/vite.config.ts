import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `vite build --mode artifact` inlines everything into one HTML file (for sharing the prototype).
// `vite build --mode pages` is the public website, served by GitHub Pages from /ai-anatomy/ (BASE_PATH overrides it).
export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? (process.env.BASE_PATH ?? "/ai-anatomy/") : "/",
  plugins: [react(), ...(mode === "artifact" ? [viteSingleFile()] : [])],
  build: { outDir: mode === "artifact" ? "dist-artifact" : "dist" },
}));
