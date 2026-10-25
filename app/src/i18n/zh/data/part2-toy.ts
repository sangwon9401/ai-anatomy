// Part 2's running example (示意数据): the 16장 neuron, adapted in zh to 「这家火锅店好吃吗?」 with the same numbers.
// zh units: 辣度 in 级 (1–5), 排队 in 桌 (tables waiting), 价格 in units of 10 元 (4 = 人均 40 元).
// Every chapter takes its numbers from here so they agree. Checked by a script (see the Part 2 report).

export type Feature = { key: "spicy" | "line" | "price"; name: string; unit: string };
export const FEATURES: Feature[] = [
  { key: "spicy", name: "辣度", unit: "级" },
  { key: "line", name: "排队", unit: "桌" },
  { key: "price", name: "价格", unit: "×10 元" },
];

/** inputs in FEATURES order: 맵기 (1–5단계), 줄 (기다리는 팀 수), 가격 (천 원); `real` = 친구들이 먹어 보고 매긴 별점 */
export type Store = { name: string; x: [number, number, number]; real: number };
export const STORES: Store[] = [
  { name: "A 店", x: [3, 2, 4], real: 4.5 },
  { name: "B 店", x: [5, 4, 7], real: 4 },
  { name: "C 店", x: [1, 0, 4], real: 1 },
  { name: "D 店", x: [3, 3, 6], real: 4.5 },
  { name: "E 店", x: [2, 0, 3], real: 2 },
];
export const STORE_A = STORES[0];

/** 4점 이상이면 맛집 */
export const GOOD = 4;

/** the 16장 neuron: weights in FEATURES order, bias = 기본 점수 */
export const NEURON = { w: [0.5, 1, -0.5] as [number, number, number], b: 2 };
/** 16장 s6 and 21장: turning the 줄 knob to 1.5 makes 가게 A score 4.5, exactly its real rating */
export const TUNED_LINE_W = 1.5;

export const neuron = (x: readonly number[], w: readonly number[], b: number) => x.reduce((s, xi, i) => s + xi * w[i], 0) + b;

export const relu = (z: number) => Math.max(0, z);

/** GELU(x) = x·Φ(x), with Φ the standard normal CDF (erf via Abramowitz–Stegun 7.1.26, error < 1.5e-7) */
export function gelu(x: number) {
  const z = x / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-z * z);
  const erf = z >= 0 ? y : -y;
  return 0.5 * x * (1 + erf);
}

/** 19장 and 23장: a small network, 3 inputs → 2 hidden (ReLU) → 별점. Weights are 학습 전 values. */
export const NET = {
  W1: [
    [0.5, 1, -0.5], // h1 "人气" neuron: the 16章 neuron with a different bias
    [1, 0, 0], // h2 "太辣" alarm: turns on above 辣度 4
  ] as [number, number, number][],
  b1: [-0.5, -4] as [number, number],
  v: [1.5, -1] as [number, number],
  c: 2,
};
export type Net = typeof NET;

export function forward(net: Net, x: readonly number[]) {
  const z = net.W1.map((row, j) => neuron(x, row, net.b1[j]));
  const h = z.map(relu);
  const y = h.reduce((s, hj, j) => s + hj * net.v[j], 0) + net.c;
  return { z, h, y };
}

/** 17장 and 18장: 가격이 같은 가게들 on the (맵기, 줄) plane. 맛집 when 줄 > |맵기 − 3| + 1.5 — a V shape. */
export const V_SPLIT = (spicy: number, line: number) => line > Math.abs(spicy - 3) + 1.5;
export const SPICE_PTS: [number, number][] = [
  [1, 1], [1, 3], [1, 4],
  [2, 2], [2, 3],
  [3, 1], [3, 2], [3, 4],
  [4, 2], [4, 3],
  [5, 1], [5, 3], [5, 4],
];

/** "−2", "0.5", "1.5" — U+2212 minus, no trailing zeros */
export function num(v: number, digits = 2) {
  const r = Math.round(v * 10 ** digits) / 10 ** digits;
  const s = String(Math.abs(r));
  return r < 0 ? `−${s}` : s;
}
