// ja overlay of the Korean particle helpers: Japanese particles don't depend on the last syllable,
// so these just append the particle (the playground overlays write their sentences around them).
export const hasFinal = (_w: string) => false;
/** "ことわざです" */
export const ieyo = (w: string) => w + "です";
/** "モデルは" */
export const eun = (w: string) => w + "は";
/** "ことわざを" */
export const eul = (w: string) => w + "を";
