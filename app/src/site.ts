import { compId } from "./scenes/built";

/** Public web address. Share links point here, also when shared from inside the Android app. */
export const SITE_URL = "https://sangwon9401.github.io/ai-anatomy/";
export const SITE_NAME = "AI 해부교실";

/** Each chapter has its own page there, so a shared link previews that chapter (title, question, picture). */
export const chapterUrl = (id: number) => `${SITE_URL}${compId(id)}/`;
