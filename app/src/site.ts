import META from "./i18n/meta.json";
import { LOCALE } from "./locale";
import { compId } from "./scenes/built";

type Meta = { ready: boolean; label: string; lang: string; name: string };
const LANGS = META as Record<string, Meta>;

/** Root of the public website; each language lives under it (Korean at the root, others at /en/, /ja/, /zh/). */
export const SITE_ROOT = "https://sangwon9401.github.io/ai-anatomy/";
export const siteUrlFor = (locale: string) => `${SITE_ROOT}${locale === "ko" ? "" : `${locale}/`}`;
/** This language's site. Share links point here, also when shared from inside the Android app. */
export const SITE_URL = siteUrlFor(LOCALE);
export const SITE_NAME = LANGS[LOCALE].name;

/** Each chapter has its own page there, so a shared link previews that chapter (title, question, picture). */
export const chapterUrl = (id: number) => `${SITE_URL}${compId(id)}/`;

/** Languages that are published, for the language links. */
export const PUBLISHED = Object.entries(LANGS)
  .filter(([, m]) => m.ready)
  .map(([code, m]) => ({ code, label: m.label, url: siteUrlFor(code) }));
