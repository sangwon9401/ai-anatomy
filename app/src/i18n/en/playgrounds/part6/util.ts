// English has no Korean particles: the particle helpers return nothing (or the word itself), so any call stays harmless.

/** the Korean subject particle that fits w: none in English */
export const josa = (_w: string) => "";

/** word + subject particle: in English just the word */
export const iga = (w: string) => w;

/** the Korean topic particle that fits w: none in English */
export const eunNeun = (_w: string) => "";

/** Course-style number: U+2212 minus, fixed decimals. */
export const fmt = (v: number, digits = 1) => {
  const r = Number(v.toFixed(digits));
  const s = Math.abs(r).toFixed(digits);
  return r < 0 ? `−${s}` : s;
};

export const signClass = (v: number, digits = 1) => (Number(v.toFixed(digits)) > 0 ? "pos" : Number(v.toFixed(digits)) < 0 ? "neg" : "zero");
