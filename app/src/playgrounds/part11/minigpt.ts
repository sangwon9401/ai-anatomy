// A real, tiny GPT for ch94–95, trained in the browser. Pure TypeScript on Float32Arrays, no imports,
// so the same file runs in Node for the gradient check and the offline checkpoints.
//
//   x0 = 토큰 임베딩[id] + 위치 임베딩[t]
//   x1 = x0 + 어텐션(LN(x0))          one causal (masked) self-attention head
//   x2 = x1 + 피드포워드(LN(x1))       Linear d→h, GELU, Linear h→d
//   logits = LN(x2) · 토큰 임베딩ᵀ + bias   (output weights tied to the token embedding, as in GPT-2)
//   loss = cross-entropy with the next token, averaged over every position
//
// Training: Adam with global-norm gradient clipping. Token 0 is the line break (see bpe.ts).

export type Config = { V: number; T: number; d: number; h: number };

/** The size used in Part 11, in the browser and for the offline checkpoints. V comes from the tokenizer. */
export const MINI = { T: 24, d: 32, h: 128, batch: 8 };
export const miniConfig = (V: number): Config => ({ V, T: MINI.T, d: MINI.d, h: MINI.h });

const NAMES = ["wte", "wpe", "ln1g", "ln1b", "wq", "wk", "wv", "wo", "ln2g", "ln2b", "w1", "b1", "w2", "b2", "lnfg", "lnfb", "bo"] as const;
type Name = (typeof NAMES)[number];

export function layout(c: Config) {
  const sizes: Record<Name, number> = {
    wte: c.V * c.d,
    wpe: c.T * c.d,
    ln1g: c.d,
    ln1b: c.d,
    wq: c.d * c.d,
    wk: c.d * c.d,
    wv: c.d * c.d,
    wo: c.d * c.d,
    ln2g: c.d,
    ln2b: c.d,
    w1: c.d * c.h,
    b1: c.h,
    w2: c.h * c.d,
    b2: c.d,
    lnfg: c.d,
    lnfb: c.d,
    bo: c.V,
  };
  const off = {} as Record<Name, number>;
  let n = 0;
  for (const k of NAMES) {
    off[k] = n;
    n += sizes[k];
  }
  return { sizes, off, total: n };
}

export const paramCount = (c: Config) => layout(c).total;

type Views = Record<Name, Float32Array>;
const views = (buf: Float32Array, c: Config): Views => {
  const { sizes, off } = layout(c);
  return Object.fromEntries(NAMES.map((k) => [k, buf.subarray(off[k], off[k] + sizes[k])])) as Views;
};

/** Small seeded random numbers (mulberry32), so Node runs are repeatable. */
export function makeRng(seed: number) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const normal = () => {
    const u = next() || 1e-12;
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * next());
  };
  return { next, normal };
}
export type Rng = ReturnType<typeof makeRng>;

export type Model = {
  cfg: Config;
  params: Float32Array;
  grads: Float32Array;
  m: Float32Array;
  v: Float32Array;
  P: Views;
  G: Views;
  /** Adam steps taken */
  step: number;
};

export function createModel(cfg: Config, rng: Rng): Model {
  const n = layout(cfg).total;
  const params = new Float32Array(n);
  const grads = new Float32Array(n);
  const P = views(params, cfg);
  const G = views(grads, cfg);
  const fill = (a: Float32Array, std: number) => {
    for (let i = 0; i < a.length; i++) a[i] = rng.normal() * std;
  };
  fill(P.wte, 0.02);
  fill(P.wpe, 0.02);
  fill(P.wq, 0.02);
  fill(P.wk, 0.02);
  fill(P.wv, 0.02);
  fill(P.wo, 0.02 / Math.SQRT2);
  fill(P.w1, 0.02);
  fill(P.w2, 0.02 / Math.SQRT2);
  P.ln1g.fill(1);
  P.ln2g.fill(1);
  P.lnfg.fill(1);
  return { cfg, params, grads, m: new Float32Array(n), v: new Float32Array(n), P, G, step: 0 };
}

/** A model that shares `params` (for loading a checkpoint); its optimiser state starts fresh. */
export function modelFromParams(cfg: Config, params: Float32Array): Model {
  const n = layout(cfg).total;
  if (params.length !== n) throw new Error(`expected ${n} params, got ${params.length}`);
  const grads = new Float32Array(n);
  return { cfg, params, grads, m: new Float32Array(n), v: new Float32Array(n), P: views(params, cfg), G: views(grads, cfg), step: 0 };
}

/** Activations for a batch of B sequences of up to T tokens, kept for the backward pass. */
export type Work = ReturnType<typeof createWork>;
export function createWork(cfg: Config, B: number) {
  const { V, T, d, h } = cfg;
  const N = B * T;
  const f = (n: number) => new Float32Array(n);
  return {
    B,
    idx: new Int32Array(N),
    tgt: new Int32Array(N),
    x0: f(N * d),
    xh1: f(N * d),
    rs1: f(N),
    a1: f(N * d),
    q: f(N * d),
    k: f(N * d),
    v: f(N * d),
    att: f(B * T * T),
    ya: f(N * d),
    x1: f(N * d),
    xh2: f(N * d),
    rs2: f(N),
    a2: f(N * d),
    hp: f(N * h),
    ha: f(N * h),
    x2: f(N * d),
    xhf: f(N * d),
    rsf: f(N),
    af: f(N * d),
    logits: f(N * V),
    // gradients of activations
    dA: f(N * d),
    dB: f(N * d),
    dX: f(N * d),
    dH: f(N * h),
    dq: f(N * d),
    dk: f(N * d),
    dv: f(N * d),
    datt: f(T),
  };
}

// ---------- building blocks ----------

function layerNorm(x: Float32Array, xh: Float32Array, rs: Float32Array, out: Float32Array, g: Float32Array, b: Float32Array, n: number, d: number) {
  for (let r = 0; r < n; r++) {
    const o = r * d;
    let mean = 0;
    for (let i = 0; i < d; i++) mean += x[o + i];
    mean /= d;
    let vr = 0;
    for (let i = 0; i < d; i++) {
      const c = x[o + i] - mean;
      vr += c * c;
    }
    const rstd = 1 / Math.sqrt(vr / d + 1e-5);
    rs[r] = rstd;
    for (let i = 0; i < d; i++) {
      const xhat = (x[o + i] - mean) * rstd;
      xh[o + i] = xhat;
      out[o + i] = xhat * g[i] + b[i];
    }
  }
}

/** dx += LN backward(dout); accumulates dg, db. */
function layerNormBack(dout: Float32Array, xh: Float32Array, rs: Float32Array, g: Float32Array, dg: Float32Array, db: Float32Array, dx: Float32Array, n: number, d: number) {
  for (let r = 0; r < n; r++) {
    const o = r * d;
    let m1 = 0;
    let m2 = 0;
    for (let i = 0; i < d; i++) {
      const dxh = dout[o + i] * g[i];
      m1 += dxh;
      m2 += dxh * xh[o + i];
      dg[i] += dout[o + i] * xh[o + i];
      db[i] += dout[o + i];
    }
    m1 /= d;
    m2 /= d;
    const rstd = rs[r];
    for (let i = 0; i < d; i++) dx[o + i] += rstd * (dout[o + i] * g[i] - m1 - xh[o + i] * m2);
  }
}

/** out[n×m] = x[n×k] · w[k×m] (+ bias) */
function matmul(x: Float32Array, w: Float32Array, out: Float32Array, n: number, k: number, m: number, bias?: Float32Array) {
  for (let r = 0; r < n; r++) {
    const oo = r * m;
    if (bias) for (let j = 0; j < m; j++) out[oo + j] = bias[j];
    else out.fill(0, oo, oo + m);
    const xo = r * k;
    for (let i = 0; i < k; i++) {
      const a = x[xo + i];
      if (a === 0) continue;
      const wo = i * m;
      for (let j = 0; j < m; j++) out[oo + j] += a * w[wo + j];
    }
  }
}

/** Backward of out = x·w + b: dw += xᵀ·dout, db += Σ dout, dx (+)= dout·wᵀ. */
function matmulBack(dout: Float32Array, x: Float32Array, w: Float32Array, dx: Float32Array | null, dw: Float32Array, n: number, k: number, m: number, db?: Float32Array, accumulate = false) {
  for (let r = 0; r < n; r++) {
    const oo = r * m;
    const xo = r * k;
    if (db) for (let j = 0; j < m; j++) db[j] += dout[oo + j];
    for (let i = 0; i < k; i++) {
      const a = x[xo + i];
      const wo = i * m;
      let s = 0;
      for (let j = 0; j < m; j++) {
        const g = dout[oo + j];
        dw[wo + j] += a * g;
        s += g * w[wo + j];
      }
      if (dx) dx[xo + i] = accumulate ? dx[xo + i] + s : s;
    }
  }
}

const GC = Math.sqrt(2 / Math.PI);
const gelu = (x: number) => 0.5 * x * (1 + Math.tanh(GC * (x + 0.044715 * x * x * x)));
const geluGrad = (x: number) => {
  const t = Math.tanh(GC * (x + 0.044715 * x * x * x));
  return 0.5 * (1 + t) + 0.5 * x * (1 - t * t) * GC * (1 + 3 * 0.044715 * x * x);
};

// ---------- forward / backward ----------

/**
 * Runs the model on w.idx (B sequences of length L ≤ T). Fills w.logits.
 * With `withLoss`, also returns the mean cross-entropy against w.tgt and turns w.logits into dlogits-ready probabilities.
 */
export function forward(model: Model, w: Work, B: number, L: number, withLoss = false): number {
  const { V, T, d, h } = model.cfg;
  const P = model.P;
  const n = B * L;
  // rows are packed as b*L + t
  for (let b = 0; b < B; b++)
    for (let t = 0; t < L; t++) {
      const r = b * L + t;
      const id = w.idx[r];
      const eo = id * d;
      const po = t * d;
      const xo = r * d;
      for (let i = 0; i < d; i++) w.x0[xo + i] = P.wte[eo + i] + P.wpe[po + i];
    }
  layerNorm(w.x0, w.xh1, w.rs1, w.a1, P.ln1g, P.ln1b, n, d);
  matmul(w.a1, P.wq, w.q, n, d, d);
  matmul(w.a1, P.wk, w.k, n, d, d);
  matmul(w.a1, P.wv, w.v, n, d, d);
  const scale = 1 / Math.sqrt(d);
  for (let b = 0; b < B; b++) {
    for (let t = 0; t < L; t++) {
      const qo = (b * L + t) * d;
      const ao = (b * T + t) * T;
      let mx = -Infinity;
      for (let s = 0; s <= t; s++) {
        const ko = (b * L + s) * d;
        let dot = 0;
        for (let i = 0; i < d; i++) dot += w.q[qo + i] * w.k[ko + i];
        dot *= scale;
        w.att[ao + s] = dot;
        if (dot > mx) mx = dot;
      }
      let sum = 0;
      for (let s = 0; s <= t; s++) {
        const e = Math.exp(w.att[ao + s] - mx);
        w.att[ao + s] = e;
        sum += e;
      }
      const yo = qo;
      for (let i = 0; i < d; i++) w.ya[yo + i] = 0;
      for (let s = 0; s <= t; s++) {
        const p = w.att[ao + s] / sum;
        w.att[ao + s] = p;
        const vo = (b * L + s) * d;
        for (let i = 0; i < d; i++) w.ya[yo + i] += p * w.v[vo + i];
      }
    }
  }
  matmul(w.ya, P.wo, w.x1, n, d, d);
  for (let i = 0; i < n * d; i++) w.x1[i] += w.x0[i];
  layerNorm(w.x1, w.xh2, w.rs2, w.a2, P.ln2g, P.ln2b, n, d);
  matmul(w.a2, P.w1, w.hp, n, d, h, P.b1);
  for (let i = 0; i < n * h; i++) w.ha[i] = gelu(w.hp[i]);
  matmul(w.ha, P.w2, w.x2, n, h, d, P.b2);
  for (let i = 0; i < n * d; i++) w.x2[i] += w.x1[i];
  layerNorm(w.x2, w.xhf, w.rsf, w.af, P.lnfg, P.lnfb, n, d);
  // logits = af · wteᵀ + bo
  for (let r = 0; r < n; r++) {
    const ao = r * d;
    const lo = r * V;
    for (let c = 0; c < V; c++) {
      const eo = c * d;
      let s = P.bo[c];
      for (let i = 0; i < d; i++) s += w.af[ao + i] * P.wte[eo + i];
      w.logits[lo + c] = s;
    }
  }
  if (!withLoss) return 0;
  let loss = 0;
  for (let r = 0; r < n; r++) {
    const lo = r * V;
    let mx = -Infinity;
    for (let c = 0; c < V; c++) if (w.logits[lo + c] > mx) mx = w.logits[lo + c];
    let sum = 0;
    for (let c = 0; c < V; c++) {
      const e = Math.exp(w.logits[lo + c] - mx);
      w.logits[lo + c] = e;
      sum += e;
    }
    for (let c = 0; c < V; c++) w.logits[lo + c] /= sum;
    loss -= Math.log(Math.max(w.logits[lo + w.tgt[r]], 1e-30));
  }
  return loss / n;
}

/** Backward pass after forward(..., withLoss = true). Accumulates into model.grads (zero them first). */
export function backward(model: Model, w: Work, B: number, L: number) {
  const { V, T, d, h } = model.cfg;
  const P = model.P;
  const G = model.G;
  const n = B * L;
  const inv = 1 / n;
  // dlogits = (p - onehot) / n, written in place over the probabilities
  const dl = w.logits;
  for (let r = 0; r < n; r++) {
    const lo = r * V;
    dl[lo + w.tgt[r]] -= 1;
    for (let c = 0; c < V; c++) dl[lo + c] *= inv;
  }
  // through the tied output layer: dbo, dwte, daf (into dA)
  const daf = w.dA;
  daf.fill(0, 0, n * d);
  for (let r = 0; r < n; r++) {
    const lo = r * V;
    const ao = r * d;
    for (let c = 0; c < V; c++) {
      const g = dl[lo + c];
      G.bo[c] += g;
      const eo = c * d;
      for (let i = 0; i < d; i++) {
        G.wte[eo + i] += g * w.af[ao + i];
        daf[ao + i] += g * P.wte[eo + i];
      }
    }
  }
  // final layer norm → dx2 (dX)
  const dx = w.dX;
  dx.fill(0, 0, n * d);
  layerNormBack(daf, w.xhf, w.rsf, P.lnfg, G.lnfg, G.lnfb, dx, n, d);
  // feed-forward: x2 = x1 + W2·gelu(W1·a2 + b1) + b2
  matmulBack(dx, w.ha, P.w2, w.dH, G.w2, n, h, d, G.b2);
  for (let i = 0; i < n * h; i++) w.dH[i] *= geluGrad(w.hp[i]);
  const da2 = w.dA;
  matmulBack(w.dH, w.a2, P.w1, da2, G.w1, n, d, h, G.b1);
  layerNormBack(da2, w.xh2, w.rs2, P.ln2g, G.ln2g, G.ln2b, dx, n, d); // dx now = dx1
  // attention output projection: x1 = x0 + ya·Wo
  const dya = w.dB;
  matmulBack(dx, w.ya, P.wo, dya, G.wo, n, d, d);
  const scale = 1 / Math.sqrt(d);
  w.dq.fill(0, 0, n * d);
  w.dk.fill(0, 0, n * d);
  w.dv.fill(0, 0, n * d);
  const datt = w.datt;
  for (let b = 0; b < B; b++) {
    for (let t = 0; t < L; t++) {
      const yo = (b * L + t) * d;
      const ao = (b * T + t) * T;
      let dot = 0;
      for (let s = 0; s <= t; s++) {
        const vo = (b * L + s) * d;
        const p = w.att[ao + s];
        let g = 0;
        for (let i = 0; i < d; i++) {
          g += dya[yo + i] * w.v[vo + i];
          w.dv[vo + i] += p * dya[yo + i];
        }
        datt[s] = g;
        dot += g * p;
      }
      for (let s = 0; s <= t; s++) {
        const ds = w.att[ao + s] * (datt[s] - dot) * scale;
        if (ds === 0) continue;
        const ko = (b * L + s) * d;
        for (let i = 0; i < d; i++) {
          w.dq[yo + i] += ds * w.k[ko + i];
          w.dk[ko + i] += ds * w.q[yo + i];
        }
      }
    }
  }
  const da1 = w.dA;
  matmulBack(w.dq, w.a1, P.wq, da1, G.wq, n, d, d);
  matmulBack(w.dk, w.a1, P.wk, da1, G.wk, n, d, d, undefined, true);
  matmulBack(w.dv, w.a1, P.wv, da1, G.wv, n, d, d, undefined, true);
  layerNormBack(da1, w.xh1, w.rs1, P.ln1g, G.ln1g, G.ln1b, dx, n, d); // dx now = dx0
  for (let b = 0; b < B; b++)
    for (let t = 0; t < L; t++) {
      const r = b * L + t;
      const eo = w.idx[r] * d;
      const po = t * d;
      const xo = r * d;
      for (let i = 0; i < d; i++) {
        G.wte[eo + i] += dx[xo + i];
        G.wpe[po + i] += dx[xo + i];
      }
    }
}

export type Adam = { lr: number; b1: number; b2: number; eps: number; clip: number };
export const ADAM: Adam = { lr: 0.006, b1: 0.9, b2: 0.99, eps: 1e-8, clip: 1 };

/** One Adam step on model.grads (clipped to a global norm of `clip`). Returns the gradient norm before clipping. */
export function adamStep(model: Model, opt: Adam = ADAM, lr = opt.lr) {
  const { params, grads, m, v } = model;
  let norm = 0;
  for (let i = 0; i < grads.length; i++) norm += grads[i] * grads[i];
  norm = Math.sqrt(norm);
  const c = norm > opt.clip ? opt.clip / norm : 1;
  model.step++;
  const bc1 = 1 - Math.pow(opt.b1, model.step);
  const bc2 = 1 - Math.pow(opt.b2, model.step);
  for (let i = 0; i < params.length; i++) {
    const g = grads[i] * c;
    m[i] = opt.b1 * m[i] + (1 - opt.b1) * g;
    v[i] = opt.b2 * v[i] + (1 - opt.b2) * g * g;
    params[i] -= (lr * (m[i] / bc1)) / (Math.sqrt(v[i] / bc2) + opt.eps);
  }
  return norm;
}

// ---------- data ----------

/**
 * Random training windows from the corpus. Lines are shuffled into one long stream
 * ("\n" line "\n" line …) that is reshuffled every few batches, so the model never learns the line order.
 */
export function makeSampler(lines: number[][], T: number, rng: Rng) {
  let stream: number[] = [];
  let uses = 0;
  const rebuild = () => {
    const order = lines.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    stream = [];
    for (const i of order) stream.push(0, ...lines[i]);
    stream.push(0);
    uses = 0;
  };
  rebuild();
  return (w: Work, B: number) => {
    if (uses++ >= 8) rebuild();
    for (let b = 0; b < B; b++) {
      const s = Math.floor(rng.next() * (stream.length - T - 1));
      for (let t = 0; t < T; t++) {
        w.idx[b * T + t] = stream[s + t];
        w.tgt[b * T + t] = stream[s + t + 1];
      }
    }
  };
}

/** One training step: sample a batch, forward, backward, Adam. Returns the batch loss. */
export function trainStep(model: Model, w: Work, sample: (w: Work, B: number) => void, lr?: number) {
  const B = w.B;
  const T = model.cfg.T;
  sample(w, B);
  model.grads.fill(0);
  const loss = forward(model, w, B, T, true);
  backward(model, w, B, T);
  adamStep(model, ADAM, lr);
  return loss;
}

/** Mean loss over every position of the whole corpus stream (no shuffling), in windows of T. */
export function evalLoss(model: Model, w: Work, lines: number[][]) {
  const T = model.cfg.T;
  const stream: number[] = [];
  for (const l of lines) stream.push(0, ...l);
  stream.push(0);
  let total = 0;
  let count = 0;
  for (let s = 0; s + 1 < stream.length; s += T) {
    const L = Math.min(T, stream.length - 1 - s);
    for (let t = 0; t < L; t++) {
      w.idx[t] = stream[s + t];
      w.tgt[t] = stream[s + t + 1];
    }
    total += forward(model, w, 1, L, true) * L;
    count += L;
  }
  return total / count;
}

// ---------- generation ----------

/** Probabilities of the next token after `ctx` (the last T tokens are used), at a temperature. */
export function nextProbs(model: Model, w: Work, ctx: number[], temp = 1) {
  const { V, T } = model.cfg;
  const c = ctx.slice(-T);
  const L = c.length;
  for (let t = 0; t < L; t++) w.idx[t] = c[t];
  forward(model, w, 1, L, false);
  const lo = (L - 1) * V;
  const p = new Float32Array(V);
  let mx = -Infinity;
  for (let i = 0; i < V; i++) mx = Math.max(mx, w.logits[lo + i] / temp);
  let sum = 0;
  for (let i = 0; i < V; i++) {
    p[i] = Math.exp(w.logits[lo + i] / temp - mx);
    sum += p[i];
  }
  for (let i = 0; i < V; i++) p[i] /= sum;
  return p;
}

export function sampleFrom(p: Float32Array, r: number) {
  for (let i = 0; i < p.length; i++) {
    r -= p[i];
    if (r <= 0) return i;
  }
  return p.length - 1;
}

/** Writes one line: starts after a line break (+ prompt) and stops at the next line break or after `max` tokens. */
export function generate(model: Model, w: Work, prompt: number[], temp: number, rand: () => number, max = 40) {
  const ctx = [0, ...prompt];
  const out: number[] = [];
  for (let i = 0; i < max; i++) {
    const id = sampleFrom(nextProbs(model, w, ctx, temp), rand());
    if (id === 0) break;
    ctx.push(id);
    out.push(id);
  }
  return out;
}

// ---------- checkpoints (int8, one scale per tensor) ----------

export function quantize(model: Model) {
  const { off, sizes } = layout(model.cfg);
  const q = new Int8Array(model.params.length);
  const scales: number[] = [];
  for (const k of NAMES) {
    const a = model.params.subarray(off[k], off[k] + sizes[k]);
    let mx = 0;
    for (let i = 0; i < a.length; i++) mx = Math.max(mx, Math.abs(a[i]));
    const s = mx / 127 || 1;
    scales.push(s);
    for (let i = 0; i < a.length; i++) q[off[k] + i] = Math.round(a[i] / s);
  }
  return { q, scales };
}

export function dequantize(cfg: Config, q: Int8Array, scales: number[]) {
  const { off, sizes, total } = layout(cfg);
  const p = new Float32Array(total);
  NAMES.forEach((k, j) => {
    for (let i = 0; i < sizes[k]; i++) p[off[k] + i] = q[off[k] + i] * scales[j];
  });
  return p;
}
