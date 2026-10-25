import { useMemo, useState } from "react";
import { PALETTE, PIC, PIC_N, PIC_PATHS } from "../../../../data/ch86";
import "../../../../playgrounds/part10/style.css";

const SIZES = [32, 16, 8] as const;
const IMAGES = [64, 224, 448] as const;

/** A fixed shuffle of 0..n-1 for a given seed (no two runs differ for the same seed). */
function shuffled(n: number, seed: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  let s = seed * 9301 + 49297;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // make sure at least the first patch moves, so a shuffle always looks shuffled
  if (a[0] === 0) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

const Crop = ({ x, y, size, at, w }: { x: number; y: number; size: number; at?: [number, number]; w?: number }) => (
  <svg x={at?.[0]} y={at?.[1]} width={w ?? size} height={w ?? size} viewBox={`${x} ${y} ${size} ${size}`} shapeRendering="crispEdges">
    {PIC_PATHS.map((p) => (
      <path key={p.token} d={p.d} fill={p.token} />
    ))}
  </svg>
);

export function PatchCutter() {
  const [patch, setPatch] = useState<(typeof SIZES)[number]>(16);
  const [mixed, setMixed] = useState(false);
  const [seed, setSeed] = useState(1);
  const [pick, setPick] = useState<number | null>(null);
  const [img, setImg] = useState<(typeof IMAGES)[number]>(64);
  const [done, setDone] = useState({ small: false, mixed: false, vit: false });

  const per = PIC_N / patch;
  const count = per * per;
  const order = useMemo(() => (mixed ? shuffled(count, seed) : Array.from({ length: count }, (_, i) => i)), [mixed, count, seed]);
  const bigTokens = (img / patch) ** 2;

  const choosePatch = (p: (typeof SIZES)[number]) => {
    setPatch(p);
    setPick(null);
    if (p === 8) setDone((d) => ({ ...d, small: true }));
    if (p === 16 && img === 224) setDone((d) => ({ ...d, vit: true }));
  };
  const chooseImg = (s: (typeof IMAGES)[number]) => {
    setImg(s);
    if (s === 224 && patch === 16) setDone((d) => ({ ...d, vit: true }));
  };
  const toggleMix = () => {
    if (mixed) setSeed((s) => s + 1);
    setMixed(!mixed);
    if (!mixed) setDone((d) => ({ ...d, mixed: true }));
  };

  const pr = pick === null ? 0 : Math.floor(pick / per);
  const pc = pick === null ? 0 : pick % per;
  // the first few numbers of the picked patch, read left→right in its top row (light-theme colours)
  const firstNums =
    pick === null
      ? []
      : Array.from({ length: 3 }, (_, k) => PALETTE[Number(PIC[pr * patch][pc * patch + k])].rgb).flat();

  const tip = mixed
    ? "With the order shuffled, it's hard to see the cat, right? That's why each token gets told which place it came from (chapter 36)."
    : patch === 8
      ? `Smaller pieces mean more tokens (${count}). It sees more detail, but the line gets longer and so does the work (chapter 45).`
      : patch === 32
        ? "Big pieces give only 4 tokens! The line is short, but each piece has to squeeze in a lot."
        : pick === null
          ? "Tap a piece in the token line below to see how many numbers it holds."
          : `Piece ${pick + 1} is also one token of ${patch * patch * 3} numbers. Try cutting at other sizes too.`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="Patch size">
        {SIZES.map((s) => (
          <button key={s} aria-pressed={patch === s} className="p10-seg" onClick={() => choosePatch(s)}>
            Patch {s}×{s}
          </button>
        ))}
        <button className="p10-seg" aria-pressed={mixed} onClick={toggleMix}>
          {mixed ? "Put back" : "Shuffle pieces"}
        </button>
      </div>

      <div className="p10-patch-lab">
        <svg className="p10-pic" viewBox={`-1 -1 ${PIC_N + 2} ${PIC_N + 2}`} role="img" aria-label={`64×64 picture of a cat, ${count} pieces${mixed ? ", shuffled" : ""}`}>
          {order.map((src, slot) => {
            const sr = Math.floor(src / per);
            const sc = src % per;
            const at: [number, number] = [(slot % per) * patch, Math.floor(slot / per) * patch];
            return <Crop key={slot} x={sc * patch} y={sr * patch} size={patch} at={at} />;
          })}
          {Array.from({ length: per + 1 }, (_, k) => (
            <g key={k} stroke="var(--pen)" strokeWidth={0.5}>
              <line x1={k * patch} y1={0} x2={k * patch} y2={PIC_N} />
              <line x1={0} y1={k * patch} x2={PIC_N} y2={k * patch} />
            </g>
          ))}
          {pick !== null && !mixed && <rect x={pc * patch} y={pr * patch} width={patch} height={patch} fill="none" stroke="var(--ink)" strokeWidth={1.4} />}
        </svg>
        <div className="p10-side">
          <div className="p10-big">
            <b>{count}</b> tokens
          </div>
          <p className="lab-sum" style={{ margin: 0 }}>
            {per} × {per} pieces · each piece is {patch}×{patch} pixels × 3 colors = <b>{patch * patch * 3}</b> numbers
          </p>
          {pick !== null && (
            <p className="p10-nums">
              First numbers of piece {pick + 1} (row {pr + 1}, column {pc + 1}): {firstNums.join(", ")}, …
            </p>
          )}
        </div>
      </div>

      <h4 className="p10-h">The token line, in reading order</h4>
      <div className="p10-strip" data-size={patch}>
        {order.map((src, slot) => {
          const sr = Math.floor(src / per);
          const sc = src % per;
          return (
            <button key={slot} className="p10-tok" aria-pressed={pick === src} aria-label={`Token ${slot + 1}`} onClick={() => setPick(src)}>
              <svg viewBox={`0 0 ${patch} ${patch}`}>
                <Crop x={sc * patch} y={sr * patch} size={patch} />
              </svg>
              <span>{slot + 1}</span>
            </button>
          );
        })}
      </div>

      <h4 className="p10-h">What about real photo sizes?</h4>
      <div className="ctx-presets" role="group" aria-label="Photo size">
        {IMAGES.map((s) => (
          <button key={s} className="p10-seg" aria-pressed={img === s} onClick={() => chooseImg(s)}>
            {s}×{s}
          </button>
        ))}
      </div>
      <p className="lab-sum">
        Cut a {img}×{img} photo into {patch}×{patch} patches: {img / patch} × {img / patch} = <b>{bigTokens.toLocaleString()}</b> tokens
        {img === 224 && patch === 16 ? " (the default setting in the 2020 ViT paper)" : ""}
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.small}>{done.small ? "✓" : "○"} Cut it finely into 8×8 patches</li>
        <li data-done={done.mixed}>{done.mixed ? "✓" : "○"} Shuffle the pieces</li>
        <li data-done={done.vit}>{done.vit ? "✓" : "○"} Make 196 tokens, just like the real ViT</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
