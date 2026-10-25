// 25장: 줄(팀) → 별점 data for overfitting (설명용 예시, seeded), and polynomial models fitted to it.
import { mulberry32 } from "./part2-batch";

export type Pt = [number, number];
const truth = (x: number) => 1.5 + 0.45 * x;
const noisy = (xs: number[], seed: number): Pt[] => {
  const rnd = mulberry32(seed);
  return xs.map((x) => [x, Math.round((truth(x) + (rnd() + rnd() + rnd() - 1.5) * 0.7) * 10) / 10] as Pt);
};
// one shared generator call keeps TRAIN and VAL the numbers checked in the Part 2 notes
export const { TRAIN, VAL } = (() => {
  const rnd = mulberry32(25);
  const n = () => (rnd() + rnd() + rnd() - 1.5) * 0.7;
  const T = [0.3, 1.1, 1.8, 2.6, 3.3, 4.1, 4.8, 5.6].map((x) => [x, Math.round((truth(x) + n()) * 10) / 10] as Pt);
  const V = [0.7, 1.5, 2.2, 3.0, 3.7, 4.5, 5.2].map((x) => [x, Math.round((truth(x) + n()) * 10) / 10] as Pt);
  return { TRAIN: T, VAL: V };
})();
/** more training data: 24 stores from the same rule */
export const TRAIN_BIG: Pt[] = noisy(
  Array.from({ length: 24 }, (_, i) => Math.round((0.25 + (i * 5.4) / 23) * 100) / 100),
  2525,
);

const u = (x: number) => (x - 3) / 3; // 0…6 → −1…1
/** Legendre polynomials P0…Pn at t (a well-behaved basis for fitting) */
export function legendre(n: number, t: number) {
  const p = [1, t];
  for (let k = 2; k <= n; k++) p.push(((2 * k - 1) * t * p[k - 1] - (k - 1) * p[k - 2]) / k);
  return p.slice(0, n + 1);
}
export const evalPoly = (c: number[], x: number) => legendre(c.length - 1, u(x)).reduce((s, v, i) => s + v * c[i], 0);
export const mseOf = (c: number[], pts: Pt[]) => pts.reduce((s, [x, y]) => s + (evalPoly(c, x) - y) ** 2, 0) / pts.length;

function solve(A: number[][], b: number[]) {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++)
      if (r !== c) {
        const f = M[r][c] / M[c][c];
        for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
      }
  }
  return M.map((r, i) => r[n] / r[i]);
}
/** least-squares polynomial of the given degree */
export function fitPoly(deg: number, pts: Pt[]) {
  const X = pts.map(([x]) => legendre(deg, u(x)));
  const A = X[0].map((_, i) => X[0].map((_, j) => X.reduce((s, r) => s + r[i] * r[j], 0)));
  const b = X[0].map((_, i) => X.reduce((s, r, k) => s + r[i] * pts[k][1], 0));
  return solve(A, b);
}

/** 25장 s3/s5: gradient descent on a degree-7 model, snapshots at these iteration counts */
export const GD_ITERS = [0, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
export const GD_RUN = (() => {
  let c = new Array(8).fill(0);
  const out: { it: number; c: number[]; train: number; val: number }[] = [];
  const lr = 0.35;
  for (let it = 0; it <= GD_ITERS[GD_ITERS.length - 1]; it++) {
    if (GD_ITERS.includes(it)) out.push({ it, c: [...c], train: mseOf(c, TRAIN), val: mseOf(c, VAL) });
    const g = new Array(8).fill(0);
    for (const [x, y] of TRAIN) {
      const f = legendre(7, u(x));
      const e = f.reduce((s, v, i) => s + v * c[i], 0) - y;
      for (let i = 0; i < 8; i++) g[i] += (2 * e * f[i]) / TRAIN.length;
    }
    c = c.map((v, i) => v - lr * g[i]);
  }
  return out;
})();
