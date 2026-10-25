// ja: Japanese particles do not change with the word, so the Korean particle helpers become constants.

/** the subject particle that fits w (always が in Japanese) */
export const josa = (_w: string) => "が";

/** "アテンションが", "正規化が" */
export const iga = (w: string) => w + josa(w);

/** the topic particle that fits w (always は in Japanese) */
export const eunNeun = (_w: string) => "は";

/** Course-style number: U+2212 minus, fixed decimals. */
export const fmt = (v: number, digits = 1) => {
  const r = Number(v.toFixed(digits));
  const s = Math.abs(r).toFixed(digits);
  return r < 0 ? `−${s}` : s;
};

export const signClass = (v: number, digits = 1) => (Number(v.toFixed(digits)) > 0 ? "pos" : Number(v.toFixed(digits)) < 0 ? "neg" : "zero");
