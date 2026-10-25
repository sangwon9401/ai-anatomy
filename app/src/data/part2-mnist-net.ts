// 26장: run the embedded MNIST network (part2-mnist.ts) and turn any grayscale drawing into an MNIST-style 28×28 input.
// Pure functions, no DOM: the playground and the Node accuracy test share this file.
import { B1, B2, MNIST_HIDDEN, S1, S2, SAMPLES_B64, W1_B64, W2_B64 } from "./part2-mnist";

const N_IN = 784;
const N_OUT = 10;

function bytes(b64: string) {
  const s = atob(b64);
  const a = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return a;
}
function dequant(b64: string, scales: number[], rowLen: number) {
  const q = new Int8Array(bytes(b64).buffer);
  const w = new Float32Array(q.length);
  for (let i = 0; i < q.length; i++) w[i] = q[i] * scales[Math.floor(i / rowLen)];
  return w;
}
let cache: { w1: Float32Array; w2: Float32Array } | null = null;
const weights = () => (cache ??= { w1: dequant(W1_B64, S1, N_IN), w2: dequant(W2_B64, S2, MNIST_HIDDEN) });

/** x: 784 pixels, 0 (paper) … 1 (ink), row by row. Returns hidden activations, scores and probabilities. */
export function predict(x: Float32Array) {
  const { w1, w2 } = weights();
  const hidden = new Float32Array(MNIST_HIDDEN);
  for (let j = 0; j < MNIST_HIDDEN; j++) {
    let s = B1[j];
    const o = j * N_IN;
    for (let i = 0; i < N_IN; i++) s += w1[o + i] * x[i];
    hidden[j] = s > 0 ? s : 0;
  }
  const scores = new Array<number>(N_OUT);
  for (let k = 0; k < N_OUT; k++) {
    let s = B2[k];
    for (let j = 0; j < MNIST_HIDDEN; j++) s += w2[k * MNIST_HIDDEN + j] * hidden[j];
    scores[k] = s;
  }
  const m = Math.max(...scores);
  const ex = scores.map((s) => Math.exp(s - m));
  const sum = ex.reduce((a, b) => a + b, 0);
  const probs = ex.map((e) => e / sum);
  return { hidden, scores, probs, best: probs.indexOf(Math.max(...probs)) };
}

/** MNIST test image for digit k (0–9) */
export function sampleDigit(k: number) {
  const b = bytes(SAMPLES_B64[k]);
  const x = new Float32Array(N_IN);
  for (let i = 0; i < N_IN; i++) x[i] = b[i] / 255;
  return x;
}

/** box-filter resample of a w×h image to ow×oh (each output pixel averages the input area it covers) */
function resample(src: Float32Array, w: number, h: number, ow: number, oh: number) {
  const sx = w / ow;
  const sy = h / oh;
  const tmp = new Float32Array(ow * h);
  for (let y = 0; y < h; y++)
    for (let j = 0; j < ow; j++) {
      const a = j * sx;
      const b = a + sx;
      let s = 0;
      for (let k = Math.floor(a); k < Math.min(w, Math.ceil(b)); k++) s += src[y * w + k] * (Math.min(b, k + 1) - Math.max(a, k));
      tmp[y * ow + j] = s / sx;
    }
  const out = new Float32Array(ow * oh);
  for (let i = 0; i < oh; i++) {
    const a = i * sy;
    const b = a + sy;
    for (let x = 0; x < ow; x++) {
      let s = 0;
      for (let k = Math.floor(a); k < Math.min(h, Math.ceil(b)); k++) s += tmp[k * ow + x] * (Math.min(b, k + 1) - Math.max(a, k));
      out[i * ow + x] = s / sy;
    }
  }
  return out;
}

/**
 * The MNIST recipe: crop to the ink, scale the longer side to 20 px keeping the aspect ratio,
 * put it in a 28×28 field and shift it so the centre of mass sits at (14, 14).
 * `gray` is 0 (paper) … 1 (ink). Returns null when there is no ink.
 */
export function toMnist(gray: Float32Array, w: number, h: number, inkAt = 0.08) {
  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (gray[y * w + x] > inkAt) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 < 0) return null;
  const cw = x1 - x0 + 1;
  const ch = y1 - y0 + 1;
  const crop = new Float32Array(cw * ch);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) crop[y * cw + x] = gray[(y0 + y) * w + x0 + x];
  const f = 20 / Math.max(cw, ch);
  const ow = Math.max(1, Math.min(20, Math.round(cw * f)));
  const oh = Math.max(1, Math.min(20, Math.round(ch * f)));
  const small = resample(crop, cw, ch, ow, oh);
  // centre of mass of the small image, then place it so that point lands on (14, 14)
  let m = 0;
  let mx = 0;
  let my = 0;
  for (let y = 0; y < oh; y++)
    for (let x = 0; x < ow; x++) {
      const v = small[y * ow + x];
      m += v;
      mx += v * x;
      my += v * y;
    }
  const ox = m > 0 ? Math.round(14 - mx / m) : Math.floor((28 - ow) / 2);
  const oy = m > 0 ? Math.round(14 - my / m) : Math.floor((28 - oh) / 2);
  const out = new Float32Array(N_IN);
  for (let y = 0; y < oh; y++)
    for (let x = 0; x < ow; x++) {
      const tx = x + ox;
      const ty = y + oy;
      if (tx >= 0 && tx < 28 && ty >= 0 && ty < 28) out[ty * 28 + tx] = Math.min(1, small[y * ow + x]);
    }
  return out;
}
