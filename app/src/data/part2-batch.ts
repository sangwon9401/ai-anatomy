// 24장: a seeded "문제집" of 60 떡볶이 stores (설명용 예시) and minibatch training of the 16장 neuron's
// two knobs (줄 가중치 w, 편향 b); 맵기 and 가격 keep their 16장 weights (0.5, −0.5).
import { NEURON } from "./part2-toy";

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Row = { x: [number, number, number]; real: number };
export const BOOK: Row[] = (() => {
  const rnd = mulberry32(24);
  const rows: Row[] = [];
  for (let k = 0; k < 60; k++) {
    const x: [number, number, number] = [1 + Math.floor(rnd() * 5), Math.floor(rnd() * 5), 3 + Math.floor(rnd() * 5)];
    const noise = (rnd() + rnd() + rnd() - 1.5) * 0.6;
    const r = 0.5 * x[0] + 0.5 * x[1] - 0.5 * x[2] + 3 + noise;
    rows.push({ x, real: Math.min(5, Math.max(0.5, Math.round(r * 2) / 2)) });
  }
  return rows;
})();

const pred = (r: Row, w: number, b: number) => NEURON.w[0] * r.x[0] + w * r.x[1] + NEURON.w[2] * r.x[2] + b;
export const bookLoss = (w: number, b: number, rows: Row[] = BOOK) => rows.reduce((s, r) => s + (pred(r, w, b) - r.real) ** 2, 0) / rows.length;

/** minibatch gradient descent; returns the knobs after every update */
export function train(batch: number, epochs: number, lr: number, start: [number, number] = [NEURON.w[1], NEURON.b]) {
  let [w, b] = start;
  const path: [number, number][] = [[w, b]];
  const order = BOOK.map((_, i) => i);
  const rnd = mulberry32(7 + batch);
  for (let e = 0; e < epochs; e++) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    for (let s = 0; s < order.length; s += batch) {
      const rows = order.slice(s, s + batch).map((i) => BOOK[i]);
      let gw = 0;
      let gb = 0;
      for (const r of rows) {
        const e2 = 2 * (pred(r, w, b) - r.real);
        gw += e2 * r.x[1];
        gb += e2;
      }
      w -= (lr * gw) / rows.length;
      b -= (lr * gb) / rows.length;
      path.push([w, b]);
    }
  }
  return path;
}

/** the bottom of the bowl (least squares for w, b) */
export const BEST = (() => {
  // solve the 2×2 normal equations
  let sxx = 0;
  let sx = 0;
  let sxy = 0;
  let sy = 0;
  for (const r of BOOK) {
    const t = r.real - NEURON.w[0] * r.x[0] - NEURON.w[2] * r.x[2];
    sxx += r.x[1] * r.x[1];
    sx += r.x[1];
    sxy += r.x[1] * t;
    sy += t;
  }
  const n = BOOK.length;
  const det = sxx * n - sx * sx;
  return [(sxy * n - sx * sy) / det, (sxx * sy - sx * sxy) / det] as [number, number];
})();

/** the bowl's shape: loss(w, b) = minimum + Δᵀ M Δ around BEST */
export const BOWL_M = (() => {
  const n = BOOK.length;
  const sxx = BOOK.reduce((a, r) => a + r.x[1] * r.x[1], 0) / n;
  const sx = BOOK.reduce((a, r) => a + r.x[1], 0) / n;
  return [sxx, sx, 1] as [number, number, number];
})();
export const BEST_LOSS = bookLoss(...BEST);
/** points of the contour loss = level */
export function contour(level: number, n = 64): [number, number][] {
  const [a, b2, c] = BOWL_M;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    const u = Math.cos(t);
    const v = Math.sin(t);
    const q = a * u * u + 2 * b2 * u * v + c * v * v;
    const r = Math.sqrt(Math.max(0, level - BEST_LOSS) / q);
    return [BEST[0] + r * u, BEST[1] + r * v] as [number, number];
  });
}

/** one shuffled pass over the book from (w, b); returns the knobs after every update */
export function epochSteps(w0: number, b0: number, batch: number, lr: number, seed: number) {
  let w = w0;
  let b = b0;
  const order = BOOK.map((_, i) => i);
  const rnd = mulberry32(seed);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const out: [number, number][] = [];
  for (let s = 0; s < order.length; s += batch) {
    const rows = order.slice(s, s + batch).map((i) => BOOK[i]);
    let gw = 0;
    let gb = 0;
    for (const r of rows) {
      const e2 = 2 * (pred(r, w, b) - r.real);
      gw += e2 * r.x[1];
      gb += e2;
    }
    w -= (lr * gw) / rows.length;
    b -= (lr * gb) / rows.length;
    out.push([w, b]);
  }
  return out;
}
