// Part 2's running example (illustrative example): the "Is this taco truck a hit?" neuron from chapter 16 grows up through the Part.
// en: same inputs (spiciness, line, price) and the same numbers as the Korean tteokbokki shop; price 4 = $4 a taco.
// Every chapter takes its numbers from here so they agree. Checked by a script (see the Part 2 report).

export type Feature = { key: "spicy" | "line" | "price"; name: string; unit: string };
export const FEATURES: Feature[] = [
  { key: "spicy", name: "Spicy", unit: "level" },
  { key: "line", name: "Line", unit: "people" },
  { key: "price", name: "Price", unit: "dollars" },
];

/** inputs in FEATURES order: spiciness (level 1–5), line (people waiting), price (dollars); `real` = the star rating friends gave after eating there */
export type Store = { name: string; x: [number, number, number]; real: number };
export const STORES: Store[] = [
  { name: "Truck A", x: [3, 2, 4], real: 4.5 },
  { name: "Truck B", x: [5, 4, 7], real: 4 },
  { name: "Truck C", x: [1, 0, 4], real: 1 },
  { name: "Truck D", x: [3, 3, 6], real: 4.5 },
  { name: "Truck E", x: [2, 0, 3], real: 2 },
];
export const STORE_A = STORES[0];

/** 4 stars or more = a hit */
export const GOOD = 4;

/** the chapter 16 neuron: weights in FEATURES order, bias = base score */
export const NEURON = { w: [0.5, 1, -0.5] as [number, number, number], b: 2 };
/** ch. 16 s6 and ch. 21: turning the line knob to 1.5 makes Truck A score 4.5, exactly its real rating */
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

/** ch. 19 and 23: a small network, 3 inputs → 2 hidden (ReLU) → star rating. Weights are before training. */
export const NET = {
  W1: [
    [0.5, 1, -0.5], // h1 "popular" neuron: the chapter 16 neuron with a different bias
    [1, 0, 0], // h2 "too spicy" alarm: turns on above spiciness 4
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

/** ch. 17 and 18: trucks with the same price on the (spicy, line) plane. A hit when line > |spicy − 3| + 1.5 — a V shape. */
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
