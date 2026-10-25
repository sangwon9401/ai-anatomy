// zh: Chinese needs no particles, so these helpers return the word unchanged (same exports as the Korean ko.ts).
export const hasFinal = (w: string) => {
  const c = w.charCodeAt(w.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
};
/** Korean copula ending; none in Chinese */
export const ieyo = (w: string) => w + (hasFinal(w) ? "" : "");
/** Korean topic particle; none in Chinese */
export const eun = (w: string) => w + (hasFinal(w) ? "" : "");
/** Korean object particle; none in Chinese */
export const eul = (w: string) => w + (hasFinal(w) ? "" : "");
