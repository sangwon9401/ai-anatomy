// Languages other than Korean are overlays: src/i18n/<locale>/ mirrors src/, holding only the files that differ
// (chapter data, UI strings, fonts, sometimes a scene or playground). When building a locale, every import of
// src/X is swapped for src/i18n/<locale>/X if that file exists. An overlay may still import the file it replaces.
// The same rule is applied to Vite (the app), webpack (Remotion renders) and esbuild (page generation).
import fs from "node:fs";
import path from "node:path";

export const SRC = path.resolve(import.meta.dirname, "../src");
export const I18N = path.join(SRC, "i18n");
export const META = JSON.parse(fs.readFileSync(path.join(I18N, "meta.json"), "utf8"));
export const LOCALES = Object.keys(META);

/** The overlay for a resolved file (keeping any ?query), or null when there is none. */
export function overlayFor(locale, resolved, importer) {
  if (!locale || locale === "ko" || !resolved) return null;
  const file = resolved.split("?")[0];
  if (!file.startsWith(SRC + path.sep) || file.startsWith(I18N + path.sep)) return null;
  const candidate = path.join(I18N, locale, path.relative(SRC, file));
  if (importer && importer.split("?")[0] === candidate) return null;
  return fs.existsSync(candidate) ? candidate + resolved.slice(file.length) : null;
}

export function viteLocaleOverlay(locale) {
  const meta = META[locale];
  return {
    name: "locale-overlay",
    enforce: "pre",
    async resolveId(source, importer, options) {
      if (locale === "ko" || !importer) return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (!resolved || resolved.external) return resolved;
      return overlayFor(locale, resolved.id, importer) ?? resolved;
    },
    transformIndexHtml(html) {
      return html
        .replace(/<html lang="[^"]*">/, `<html lang="${meta.lang}">`)
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
        .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${meta.description}" />`)
        .replace(/<meta name="apple-mobile-web-app-title" content="[^"]*" \/>/, `<meta name="apple-mobile-web-app-title" content="${meta.name}" />`)
        .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*" \/>/, `<link rel="stylesheet" href="${meta.fonts}" />`);
    },
  };
}

/** For Remotion's bundle({ webpackOverride }). Rewrites relative requests before webpack resolves them, so loaders
 * (e.g. for CSS) see one consistent path. All imports inside src/ are relative. */
export function webpackLocaleOverlay(locale, webpack) {
  const EXT = ["", ".ts", ".tsx", ".js", ".mjs", ".json", ".css", "/index.ts", "/index.tsx"];
  return (config) => {
    if (locale === "ko") return config;
    const swap = new webpack.NormalModuleReplacementPlugin(/^\.\.?\//, (result) => {
      if (!result.context || typeof result.request !== "string") return;
      const [bare, query = ""] = result.request.split("?");
      const base = path.resolve(result.context, bare);
      for (const ext of EXT) {
        const file = base + ext;
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
        const next = overlayFor(locale, file, result.contextInfo?.issuer);
        if (next) result.request = next + (query ? `?${query}` : "");
        return;
      }
    });
    return { ...config, plugins: [...(config.plugins ?? []), swap] };
  };
}

/** For esbuild.build({ plugins }). */
export function esbuildLocaleOverlay(locale) {
  return {
    name: "locale-overlay",
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        if (locale === "ko" || args.pluginData?.overlaySkip) return undefined;
        const r = await build.resolve(args.path, { resolveDir: args.resolveDir, kind: args.kind, importer: args.importer, pluginData: { overlaySkip: true } });
        if (r.errors.length) return { errors: r.errors };
        const next = overlayFor(locale, r.path, args.importer);
        return next ? { path: next } : { path: r.path, external: r.external };
      });
    },
  };
}
