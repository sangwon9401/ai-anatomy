/** whether the last sound of w has a final consonant (digits read as Sino-Korean numbers) */
const hasBatchim = (w: string) => {
  const ch = w.trim().slice(-1);
  if (/[0-9]/.test(ch)) return "0136789".includes(ch);
  const c = ch.charCodeAt(0);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
};

/** the subject particle (이/가) that fits w */
export const josa = (w: string) => (hasBatchim(w) ? "이" : "가");

/** "어텐션이", "정규화가" */
export const iga = (w: string) => w + josa(w);

/** the topic particle (은/는) that fits w */
export const eunNeun = (w: string) => (hasBatchim(w) ? "은" : "는");

/** Course-style number: U+2212 minus, fixed decimals. */
export const fmt = (v: number, digits = 1) => {
  const r = Number(v.toFixed(digits));
  const s = Math.abs(r).toFixed(digits);
  return r < 0 ? `−${s}` : s;
};

export const signClass = (v: number, digits = 1) => (Number(v.toFixed(digits)) > 0 ? "pos" : Number(v.toFixed(digits)) < 0 ? "neg" : "zero");
