// 27장 보스전: a tiny network (2 inputs → H ReLU neurons → 1 output) trained from scratch, in plain TypeScript.
// Loss = squared error against 맛집 1 / 별로 0 (20장); updates = minibatch gradient descent with backprop (21–24장).
import { mulberry32 } from "../../../data/part2-batch";
import { V_SPLIT } from "../../../data/part2-toy";

export type Dot = { x: number; y: number; t: 0 | 1 };
export type Dataset = { key: "map" | "target"; name: string; train: Dot[]; val: Dot[]; xr: [number, number]; yr: [number, number]; xLabel: string; yLabel: string; good: string; bad: string };

/** 17장's 맛집 지도 with 60 + 30 stores: 맛집 when 줄 > |맵기 − 3| + 1.5. Points too close to the V are left out. */
function mapSet(n: number, seed: number) {
  const rnd = mulberry32(seed);
  const out: Dot[] = [];
  while (out.length < n) {
    const x = 0.6 + rnd() * 4.8;
    const y = 0.1 + rnd() * 4.4;
    if (Math.abs(y - (Math.abs(x - 3) + 1.5)) < 0.22) continue;
    out.push({ x, y, t: V_SPLIT(x, y) ? 1 : 0 });
  }
  return out;
}
/** a target: dots inside the bullseye vs dots in the outer ring */
function targetSet(n: number, seed: number) {
  const rnd = mulberry32(seed);
  const out: Dot[] = [];
  while (out.length < n) {
    const x = -1 + rnd() * 2;
    const y = -1 + rnd() * 2;
    const r = Math.hypot(x, y);
    if (r > 0.95 || (r > 0.48 && r < 0.62)) continue;
    out.push({ x, y, t: r < 0.55 ? 1 : 0 });
  }
  return out;
}
export const DATASETS: Dataset[] = [
  { key: "map", name: "Taco truck map", train: mapSet(60, 271), val: mapSet(30, 272), xr: [0.5, 5.5], yr: [0, 4.6], xLabel: "spicy", yLabel: "line", good: "hit", bad: "miss" },
  { key: "target", name: "Target", train: targetSet(80, 273), val: targetSet(40, 274), xr: [-1, 1], yr: [-1, 1], xLabel: "across", yLabel: "up", good: "inside", bad: "outside" },
];

/** inputs are scaled to about −1…1 first (15장: 크기 맞추기) */
const scaleIn = (ds: Dataset, x: number, y: number): [number, number] => [
  ((x - ds.xr[0]) / (ds.xr[1] - ds.xr[0])) * 2 - 1,
  ((y - ds.yr[0]) / (ds.yr[1] - ds.yr[0])) * 2 - 1,
];

export type TinyNet = { W1: number[][]; b1: number[]; v: number[]; c: number };
export function initNet(h: number, seed: number): TinyNet {
  const rnd = mulberry32(seed);
  const g = () => (rnd() + rnd() + rnd() - 1.5) * 1.2;
  return {
    W1: Array.from({ length: h }, () => [g(), g()]),
    b1: Array.from({ length: h }, () => g() * 0.4),
    v: Array.from({ length: h }, () => g() * 0.5),
    c: 0.5,
  };
}
export function out(net: TinyNet, ds: Dataset, x: number, y: number) {
  const [a, b] = scaleIn(ds, x, y);
  let s = net.c;
  for (let j = 0; j < net.b1.length; j++) {
    const z = net.W1[j][0] * a + net.W1[j][1] * b + net.b1[j];
    if (z > 0) s += net.v[j] * z;
  }
  return s;
}
export const lossOf = (net: TinyNet, ds: Dataset, dots: Dot[]) => dots.reduce((s, d) => s + (out(net, ds, d.x, d.y) - d.t) ** 2, 0) / dots.length;
export const accOf = (net: TinyNet, ds: Dataset, dots: Dot[]) => dots.filter((d) => (out(net, ds, d.x, d.y) > 0.5 ? 1 : 0) === d.t).length / dots.length;

/** one epoch of minibatch gradient descent; mutates and returns `net` */
export function epoch(net: TinyNet, ds: Dataset, lr: number, batch: number, rnd: () => number) {
  const idx = ds.train.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const h = net.b1.length;
  for (let s = 0; s < idx.length; s += batch) {
    const rows = idx.slice(s, s + batch);
    const gW = Array.from({ length: h }, () => [0, 0]);
    const gb = new Array(h).fill(0);
    const gv = new Array(h).fill(0);
    let gc = 0;
    for (const r of rows) {
      const d = ds.train[r];
      const [a, b] = scaleIn(ds, d.x, d.y);
      const z = net.W1.map((w, j) => w[0] * a + w[1] * b + net.b1[j]);
      const hh = z.map((v) => (v > 0 ? v : 0));
      const y = hh.reduce((acc, v, j) => acc + v * net.v[j], net.c);
      const dy = 2 * (y - d.t); // 책임 of the output (23장)
      gc += dy;
      for (let j = 0; j < h; j++) {
        gv[j] += dy * hh[j];
        if (z[j] > 0) {
          const dz = dy * net.v[j];
          gW[j][0] += dz * a;
          gW[j][1] += dz * b;
          gb[j] += dz;
        }
      }
    }
    const k = lr / rows.length;
    for (let j = 0; j < h; j++) {
      net.W1[j][0] -= k * gW[j][0];
      net.W1[j][1] -= k * gW[j][1];
      net.b1[j] -= k * gb[j];
      net.v[j] -= k * gv[j];
    }
    net.c -= k * gc;
  }
  return net;
}

const clone = (n: TinyNet): TinyNet => ({ W1: n.W1.map((r) => [...r]), b1: [...n.b1], v: [...n.v], c: n.c });

/** a full training run, keeping snapshots at the given epochs (for the scene) */
export function run(ds: Dataset, h: number, lr: number, batch: number, epochs: number, keep: number[], seed = 27) {
  const net = initNet(h, seed);
  const rnd = mulberry32(seed + 1000);
  const loss: number[] = [lossOf(net, ds, ds.train)];
  const snaps: { epoch: number; net: TinyNet }[] = keep.includes(0) ? [{ epoch: 0, net: clone(net) }] : [];
  for (let e = 1; e <= epochs; e++) {
    epoch(net, ds, lr, batch, rnd);
    loss.push(lossOf(net, ds, ds.train));
    if (keep.includes(e)) snaps.push({ epoch: e, net: clone(net) });
  }
  return { net, loss, snaps };
}

/** marching squares: line segments where the network's output crosses 0.5, on a gx × gy grid over the data range */
export function boundary(net: TinyNet, ds: Dataset, gx = 48, gy = 44) {
  const X = (i: number) => ds.xr[0] + ((ds.xr[1] - ds.xr[0]) * i) / gx;
  const Y = (j: number) => ds.yr[0] + ((ds.yr[1] - ds.yr[0]) * j) / gy;
  const f: number[][] = [];
  for (let j = 0; j <= gy; j++) {
    const row: number[] = [];
    for (let i = 0; i <= gx; i++) row.push(out(net, ds, X(i), Y(j)) - 0.5);
    f.push(row);
  }
  const segs: [number, number, number, number][] = [];
  const lerp = (a: number, b: number) => a / (a - b);
  for (let j = 0; j < gy; j++)
    for (let i = 0; i < gx; i++) {
      const v = [f[j][i], f[j][i + 1], f[j + 1][i + 1], f[j + 1][i]];
      const p = [
        [X(i), Y(j)],
        [X(i + 1), Y(j)],
        [X(i + 1), Y(j + 1)],
        [X(i), Y(j + 1)],
      ];
      const cross: [number, number][] = [];
      for (let e = 0; e < 4; e++) {
        const a = v[e];
        const b = v[(e + 1) % 4];
        if ((a > 0) !== (b > 0)) {
          const t = lerp(a, b);
          cross.push([p[e][0] + (p[(e + 1) % 4][0] - p[e][0]) * t, p[e][1] + (p[(e + 1) % 4][1] - p[e][1]) * t]);
        }
      }
      if (cross.length === 2) segs.push([cross[0][0], cross[0][1], cross[1][0], cross[1][1]]);
      else if (cross.length === 4) {
        segs.push([cross[0][0], cross[0][1], cross[1][0], cross[1][1]]);
        segs.push([cross[2][0], cross[2][1], cross[3][0], cross[3][1]]);
      }
    }
  return segs;
}
