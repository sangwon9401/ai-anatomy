import type { CSSProperties, FC, ReactNode } from "react";
import { BLOCK_ORDER, BLOCK_TEXT, KIND, OUTER, kindOf, type BlockKey } from "../data/part6-block";
import type { Highlighter } from "../data/types";
import { Chip, Hand, chipWidth, mix } from "./kit";

// Shared drawing for Part 6: the transformer block (always the same picture), the whole GPT blueprint
// around it, and small vector widgets. Everything is in canvas pixels and driven by 0→1 progress values.

export type BlockMode = "full" | "mini";
type Row = { y: number; h: number };

export type BlockGeo = {
  w: number;
  h: number;
  /** x of the highway (the residual stream) */
  hx: number;
  boxX: number;
  boxW: number;
  rows: Record<BlockKey, Row>;
  addR: number;
  road: number;
  nameFs: number;
  subFs: number;
  normFs: number;
  labelFs: number;
  sub: boolean;
};

const FULL: BlockGeo = {
  w: 660,
  h: 616,
  hx: 76,
  boxX: 160,
  boxW: 470,
  rows: {
    norm1: { y: 64, h: 58 },
    att: { y: 146, h: 104 },
    add1: { y: 268, h: 56 },
    norm2: { y: 340, h: 58 },
    ffn: { y: 422, h: 104 },
    add2: { y: 544, h: 56 },
  },
  addR: 28,
  road: 18,
  nameFs: 40,
  subFs: 28,
  normFs: 32,
  labelFs: 30,
  sub: true,
};

const MINI: BlockGeo = {
  w: 620,
  h: 424,
  hx: 62,
  boxX: 136,
  boxW: 454,
  rows: {
    norm1: { y: 46, h: 44 },
    att: { y: 106, h: 66 },
    add1: { y: 180, h: 44 },
    norm2: { y: 234, h: 44 },
    ffn: { y: 294, h: 66 },
    add2: { y: 368, h: 44 },
  },
  addR: 22,
  road: 14,
  nameFs: 34,
  subFs: 28,
  normFs: 28,
  labelFs: 28,
  sub: false,
};

export const blockGeo = (mode: BlockMode) => (mode === "full" ? FULL : MINI);

/** Centre of a part in block-local pixels. */
export function partCenter(g: BlockGeo, k: BlockKey): [number, number] {
  const r = g.rows[k];
  if (kindOf(k) === "add") return [g.hx, r.y + r.h / 2];
  return [g.boxX + g.boxW / 2, r.y + r.h / 2];
}

/** Rectangle of a part in block-local pixels (for pen circles and highlights). */
export function partRect(g: BlockGeo, k: BlockKey) {
  const r = g.rows[k];
  if (kindOf(k) === "add") return { x: g.hx - g.addR, y: r.y + r.h / 2 - g.addR, w: g.addR * 2, h: g.addR * 2 };
  return { x: g.boxX, y: r.y, w: g.boxW, h: r.h };
}

type Pt = [number, number];

/** The detour a vector takes through one sub-layer (1 = attention, 2 = feed-forward), block-local. */
export function sidePath(g: BlockGeo, which: 1 | 2): Pt[] {
  const [n, s, a] = which === 1 ? (["norm1", "att", "add1"] as const) : (["norm2", "ffn", "add2"] as const);
  const cx = g.boxX + g.boxW / 2;
  const ny = g.rows[n].y + g.rows[n].h / 2;
  const sb = g.rows[s].y + g.rows[s].h;
  const ay = g.rows[a].y + g.rows[a].h / 2;
  return [
    [g.hx, ny],
    [cx, ny],
    [cx, sb],
    [cx, ay],
    [g.hx, ay],
  ];
}

/** Point at fraction t along a polyline. */
export function along(pts: Pt[], t: number): Pt {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const u = seg[i] === 0 ? 0 : Math.min(1, d / seg[i]);
      return [mix(pts[i][0], pts[i + 1][0], u), mix(pts[i][1], pts[i + 1][1], u)];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
}

/** The whole route through one block: down the highway, out through both detours, back, and down again. */
export function blockRoute(g: BlockGeo): Pt[] {
  return [[g.hx, 0], ...sidePath(g, 1), ...sidePath(g, 2), [g.hx, g.h]];
}

const head = (x: number, y: number, dir: "right" | "down" | "left", s: number) => {
  if (dir === "right") return `M ${x - s} ${y - s * 0.7} L ${x} ${y} L ${x - s} ${y + s * 0.7}`;
  if (dir === "left") return `M ${x + s} ${y - s * 0.7} L ${x} ${y} L ${x + s} ${y + s * 0.7}`;
  return `M ${x - s * 0.7} ${y - s} L ${x} ${y} L ${x + s * 0.7} ${y - s}`;
};

export type Focus = { keys: BlockKey[]; t: number; dim?: number };

export type BlockProps = {
  x: number;
  y: number;
  mode?: BlockMode;
  /** 0 = empty dashed slot, 1 = part snapped in (default 1) */
  fill?: Partial<Record<BlockKey, number>>;
  /** fade the other parts while these are discussed */
  focus?: Focus;
  /** 0→1: the stack of layers drawn behind */
  layers?: number;
  o?: number;
  where?: boolean;
  /** extra drawing in block-local pixels, above the parts */
  children?: ReactNode;
};

export const Block: FC<BlockProps> = ({ x, y, mode = "full", fill = {}, focus, layers = 0, o = 1, where = true, children }) => {
  const g = blockGeo(mode);
  const f = (k: BlockKey) => fill[k] ?? 1;
  const vis = (k: BlockKey) => (focus ? mix(1, focus.keys.includes(k) ? 1 : focus.dim ?? 0.22, focus.t) : 1);
  const road = Math.max(f("add1"), f("add2"));
  const roadVis = Math.max(vis("add1"), vis("add2"));
  const cx = g.boxX + g.boxW / 2;
  const s = mode === "full" ? 14 : 11;

  return (
    <div style={{ position: "absolute", left: x, top: y, width: g.w, height: g.h, opacity: o }}>
      {[3, 2, 1].map((k) => {
        const p = Math.max(0, Math.min(1, layers * 3 - (3 - k)));
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: k * 12,
              top: k * 12,
              width: g.w,
              height: g.h,
              borderRadius: 22,
              border: "3px solid var(--grid-major)",
              background: "var(--paper)",
              opacity: p,
            }}
          />
        );
      })}
      <div style={{ position: "absolute", inset: 0, borderRadius: 22, border: "4px dashed var(--ink-3)", background: "var(--paper)" }} />
      <div style={{ position: "absolute", left: g.hx + 34, top: mode === "full" ? 12 : 6, fontSize: g.labelFs, fontWeight: 500, color: "var(--ink-2)" }}>{BLOCK_TEXT.block}</div>

      <svg width={g.w} height={g.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* highway: dashed while its part is missing, an orange road once it's in */}
        <line x1={g.hx} y1={-2} x2={g.hx} y2={g.h + 2} stroke="var(--ink-3)" strokeWidth={4} strokeDasharray="12 12" opacity={(1 - road) * roadVis} />
        <g opacity={road * roadVis}>
          <line x1={g.hx} y1={-2} x2={g.hx} y2={g.h + 2} stroke="var(--hl-orange)" strokeWidth={g.road} />
          <line x1={g.hx} y1={-2} x2={g.hx} y2={g.h + 2} stroke="var(--paper)" strokeWidth={3} strokeDasharray="14 14" />
        </g>
        {([1, 2] as const).map((w) => {
          const [n, sub] = w === 1 ? (["norm1", "att"] as const) : (["norm2", "ffn"] as const);
          const p = sidePath(g, w);
          const nb = g.rows[n].y + g.rows[n].h;
          const st = g.rows[sub].y;
          const op = Math.min(vis(n), vis(sub));
          return (
            <g key={w} opacity={op} fill="none" stroke="var(--ink-3)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
              <line x1={g.hx + g.road / 2} y1={p[0][1]} x2={g.boxX - 4} y2={p[0][1]} />
              <path d={head(g.boxX - 4, p[0][1], "right", s)} />
              <line x1={cx} y1={nb + 2} x2={cx} y2={st - 4} />
              <path d={head(cx, st - 4, "down", s * 0.8)} />
              <path d={`M ${cx} ${p[2][1] + 2} L ${cx} ${p[3][1]} L ${g.hx + g.addR + 6} ${p[3][1]}`} />
              <path d={head(g.hx + g.addR + 6, p[3][1], "left", s)} />
            </g>
          );
        })}
      </svg>

      {BLOCK_ORDER.map((k) => (
        <PartShape key={k} g={g} k={k} t={f(k)} vis={vis(k)} where={where} mode={mode} />
      ))}
      {children}
    </div>
  );
};

const PartShape: FC<{ g: BlockGeo; k: BlockKey; t: number; vis: number; where: boolean; mode: BlockMode }> = ({ g, k, t, vis, where, mode }) => {
  const kind = kindOf(k);
  const meta = KIND[kind];
  const r = partRect(g, k);
  const snap: CSSProperties = { opacity: t, translate: `${mix(kind === "add" ? 0 : 70, 0, t)}px 0px`, scale: String(mix(kind === "add" ? 1.6 : 1.06, 1, t)) };
  if (kind === "add") {
    const circle = (filled: boolean): CSSProperties => ({
      position: "absolute",
      left: r.x,
      top: r.y,
      width: r.w,
      height: r.h,
      borderRadius: "50%",
      boxSizing: "border-box",
      display: "grid",
      placeItems: "center",
      fontSize: g.addR * 1.5,
      fontWeight: 700,
      lineHeight: 1,
      ...(filled
        ? { background: `var(--hl-${meta.color})`, border: "4px solid var(--ink)", color: "var(--chip-ink)" }
        : { background: "var(--paper)", border: "3px dashed var(--ink-3)", color: "var(--ink-3)" }),
    });
    return (
      <div style={{ opacity: vis }}>
        <div style={{ ...circle(false), opacity: 1 - t }}>{BLOCK_TEXT.plus}</div>
        <div style={{ ...circle(true), ...snap }}>{BLOCK_TEXT.plus}</div>
      </div>
    );
  }
  const norm = kind === "norm";
  const box = (filled: boolean): CSSProperties => ({
    position: "absolute",
    left: r.x,
    top: r.y,
    width: r.w,
    height: r.h,
    boxSizing: "border-box",
    borderRadius: norm ? 12 : 16,
    padding: `0 ${mode === "full" ? 22 : 18}px`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    ...(filled
      ? { background: `var(--hl-${meta.color})`, color: "var(--chip-ink)" }
      : { background: "var(--paper)", border: "3px dashed var(--ink-3)", color: "var(--ink-3)" }),
  });
  const nameFs = norm ? g.normFs : g.nameFs;
  const content = (
    <>
      <div style={{ fontSize: nameFs, fontWeight: 700, lineHeight: 1.15 }}>{meta.name}</div>
      {g.sub && !norm && <div style={{ fontSize: g.subFs, lineHeight: 1.3, opacity: 0.85 }}>{meta.does}</div>}
    </>
  );
  return (
    <div style={{ opacity: vis }}>
      <div style={{ ...box(false), opacity: 1 - t }}>{content}</div>
      <div style={{ ...box(true), ...snap }}>
        {content}
        {where && (
          <Hand x={r.w - (mode === "full" ? 96 : 84)} y={(r.h - (mode === "full" ? 34 : 32)) / 2} fs={mode === "full" ? 30 : 28} color="var(--chip-ink)" style={{ opacity: 0.75 }}>
            {meta.where}
          </Hand>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// The whole GPT blueprint (ch05's order and colours) with the mini block in the middle.

export type OuterKey = "tok" | "emb" | "pos" | "out" | "loop";
export const BP_X = 230;
export const BP_W = 620;
const ROW_H = 60;

export function blueprintGeo(y0 = 176) {
  const block = y0 + 214;
  const out = block + MINI.h + 22;
  return { tok: y0, emb: y0 + 68, pos: y0 + 136, block, out, loop: out + 68, bottom: out + 68 + ROW_H } as Record<OuterKey | "block" | "bottom", number>;
}

export type BlueprintProps = {
  y0?: number;
  /** 0 = empty slot, 1 = filled (default 1); block keys fill the parts inside the block */
  fill?: Partial<Record<OuterKey | BlockKey, number>>;
  /** 0→1 appearance of each outer row and of the block */
  show?: Partial<Record<OuterKey | "block", number>>;
  focus?: { keys: (OuterKey | BlockKey)[]; t: number; dim?: number };
  layers?: number;
  o?: number;
};

export const Blueprint: FC<BlueprintProps> = ({ y0 = 176, fill = {}, show = {}, focus, layers = 0, o = 1 }) => {
  const G = blueprintGeo(y0);
  const dimOf = (k: OuterKey | BlockKey) => (focus ? mix(1, focus.keys.includes(k) ? 1 : focus.dim ?? 0.22, focus.t) : 1);
  const blockFill: Partial<Record<BlockKey, number>> = {};
  BLOCK_ORDER.forEach((k) => (blockFill[k] = fill[k] ?? 1));
  const blockFocus = focus ? { keys: BLOCK_ORDER.filter((k) => focus.keys.includes(k)), t: focus.t, dim: focus.dim } : undefined;
  const sb = show.block ?? 1;
  return (
    <div style={{ opacity: o }}>
      {OUTER.map((p) => {
        const k = p.key as OuterKey;
        const t = fill[k] ?? 1;
        const a = show[k] ?? 1;
        const base: CSSProperties = {
          position: "absolute",
          left: BP_X,
          top: G[k],
          width: BP_W,
          height: ROW_H,
          boxSizing: "border-box",
          borderRadius: 14,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          fontSize: 34,
          fontWeight: 700,
        };
        return (
          <div key={k} style={{ opacity: a * dimOf(k), translate: `${mix(-24, 0, a)}px 0px` }}>
            <div style={{ ...base, background: "var(--paper)", border: "3px dashed var(--ink-3)", color: "var(--ink-3)", opacity: 1 - t }}>{p.name}</div>
            <div style={{ ...base, background: `var(--hl-${p.color})`, color: "var(--chip-ink)", opacity: t, scale: String(mix(1.06, 1, t)) }}>{p.name}</div>
            <Hand x={BP_X + BP_W + 22} y={G[k] + 12} fs={30} color="var(--ink-2)">
              {p.where}
            </Hand>
          </div>
        );
      })}
      <div style={{ opacity: sb, translate: `${mix(-24, 0, sb)}px 0px` }}>
        <Block x={BP_X} y={G.block} mode="mini" fill={blockFill} focus={blockFocus} layers={layers} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// Vectors

/** Minus sign as the course writes it (U+2212), fixed decimals. */
export const fmt = (v: number, digits = 1) => {
  const r = Number(v.toFixed(digits));
  const s = Math.abs(r).toFixed(digits);
  return r < 0 ? `−${s}` : s;
};

export const signed = (v: number, digits = 1) => (Number(v.toFixed(digits)) > 0 ? `+${fmt(v, digits)}` : fmt(v, digits));

/** A vector drawn as a column (or row) of highlighter cells with its numbers. */
export const VecCells: FC<{
  x: number;
  y: number;
  v: number[];
  cw?: number;
  ch?: number;
  fs?: number;
  gap?: number;
  dir?: "col" | "row";
  digits?: number;
  o?: number;
  color?: Highlighter | ((v: number, i: number) => Highlighter | null);
  style?: CSSProperties;
}> = ({ x, y, v, cw = 120, ch = 50, fs = 30, gap = 6, dir = "col", digits = 1, o = 1, color, style }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, ...style }}>
    {v.map((n, i) => {
      const c = typeof color === "function" ? color(n, i) : color ?? (n >= 0 ? "sky" : "pink");
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dir === "col" ? 0 : i * (cw + gap),
            top: dir === "col" ? i * (ch + gap) : 0,
            width: cw,
            height: ch,
            borderRadius: 10,
            background: c ? `var(--hl-${c})` : "var(--paper-2)",
            color: c ? "var(--chip-ink)" : "var(--ink)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: fs,
            fontWeight: 500,
          }}
        >
          {fmt(n, digits)}
        </div>
      );
    })}
  </div>
);

export const vecSize = (n: number, cw = 120, ch = 50, gap = 6, dir: "col" | "row" = "col") =>
  dir === "col" ? { w: cw, h: n * ch + (n - 1) * gap } : { w: n * cw + (n - 1) * gap, h: ch };

/** A vector as little bars around a baseline at y; heights are value × scale, clipped to maxH. */
export const VecBars: FC<{ x: number; y: number; v: number[]; bw?: number; gap?: number; scale: number; maxH?: number; o?: number; pos?: Highlighter; neg?: Highlighter; base?: boolean }> = ({
  x,
  y,
  v,
  bw = 40,
  gap = 12,
  scale,
  maxH = 9999,
  o = 1,
  pos = "sky",
  neg = "pink",
  base = true,
}) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    {base && <div style={{ position: "absolute", left: -10, top: -1.5, width: v.length * (bw + gap) - gap + 20, height: 3, background: "var(--ink-3)" }} />}
    {v.map((n, i) => {
      const raw = Math.abs(n * scale);
      const h = Math.min(raw, maxH);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i * (bw + gap),
            top: n >= 0 ? -h - 1.5 : 1.5,
            width: bw,
            height: h,
            borderRadius: n >= 0 ? "6px 6px 2px 2px" : "2px 2px 6px 6px",
            background: raw > maxH ? "var(--pen)" : `var(--hl-${n >= 0 ? pos : neg})`,
          }}
        />
      );
    })}
  </div>
);

/** Outlined word chip, as the input words are drawn in ch05. */
export const WordChip: FC<{ text: string; x: number; y: number; fs?: number; o?: number; color?: Highlighter | null; style?: CSSProperties }> = ({ text, x, y, fs = 44, o = 1, color = null, style }) => (
  <Chip
    text={text}
    color={color}
    fs={fs}
    x={x}
    y={y}
    style={{
      opacity: o,
      ...(color ? {} : { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" }),
      ...style,
    }}
  />
);

export const wordW = (text: string, fs = 44) => chipWidth(text, fs);

/** Full-canvas SVG layer. */
export const Layer: FC<{ children: ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o }}>
    {children}
  </svg>
);

/** A pen-coloured arrow drawn on from (x1,y1) to (x2,y2). */
export const PenArrow: FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string; width?: number }> = ({ x1, y1, x2, y2, p, color = "var(--pen)", width = 6 }) => {
  if (p <= 0) return null;
  const ex = mix(x1, x2, p);
  const ey = mix(y1, y2, p);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = width * 3;
  return (
    <g stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1={x1} y1={y1} x2={ex} y2={ey} />
      <path d={`M ${ex - h * Math.cos(ang - 0.5)} ${ey - h * Math.sin(ang - 0.5)} L ${ex} ${ey} L ${ex - h * Math.cos(ang + 0.5)} ${ey - h * Math.sin(ang + 0.5)}`} />
    </g>
  );
};
