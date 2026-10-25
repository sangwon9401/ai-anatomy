// Korean particles that depend on whether the last syllable has a final consonant (받침).
export const hasFinal = (w: string) => {
  const c = w.charCodeAt(w.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
};
/** "속담이에요" / "동요예요" */
export const ieyo = (w: string) => w + (hasFinal(w) ? "이에요" : "예요");
/** "모델은" / "토크나이저는" */
export const eun = (w: string) => w + (hasFinal(w) ? "은" : "는");
/** "속담을" / "동요를" */
export const eul = (w: string) => w + (hasFinal(w) ? "을" : "를");
