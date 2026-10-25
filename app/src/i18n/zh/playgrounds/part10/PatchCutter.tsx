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
    ? "顺序一乱，就很难认出这是猫了吧？这就是要给每个词元加上“原来在第几个位置”的原因（第 36 章）。"
    : patch === 8
      ? `块切得越小，词元越多（${count} 个）。看得更细，但队伍变长，计算量也跟着增加（第 45 章）。`
      : patch === 32
        ? "块切得大，词元只有 4 个！队伍很短，但每一块都得塞进很多内容。"
        : pick === null
          ? "在下面的词元队伍里点一块，就能看到这一块里有多少个数。"
          : `第 ${pick + 1} 块也是一个装着 ${patch * patch * 3} 个数的词元。换个大小再切切看。`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="图块大小">
        {SIZES.map((s) => (
          <button key={s} aria-pressed={patch === s} className="p10-seg" onClick={() => choosePatch(s)}>
            图块 {s}×{s}
          </button>
        ))}
        <button className="p10-seg" aria-pressed={mixed} onClick={toggleMix}>
          {mixed ? "放回原位" : "打乱图块"}
        </button>
      </div>

      <div className="p10-patch-lab">
        <svg className="p10-pic" viewBox={`-1 -1 ${PIC_N + 2} ${PIC_N + 2}`} role="img" aria-label={`64×64 的猫咪图，${count} 块${mixed ? "，已打乱" : ""}`}>
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
            词元 <b>{count}</b> 个
          </div>
          <p className="lab-sum" style={{ margin: 0 }}>
            {per} × {per} 块 · 每块 {patch}×{patch} 像素 × 3 种颜色 = <b>{patch * patch * 3}</b> 个数
          </p>
          {pick !== null && (
            <p className="p10-nums">
              第 {pick + 1} 块（第 {pr + 1} 行第 {pc + 1} 列）开头的数：{firstNums.join(", ")}, …
            </p>
          )}
        </div>
      </div>

      <h4 className="p10-h">按阅读顺序排好的词元队伍</h4>
      <div className="p10-strip" data-size={patch}>
        {order.map((src, slot) => {
          const sr = Math.floor(src / per);
          const sc = src % per;
          return (
            <button key={slot} className="p10-tok" aria-pressed={pick === src} aria-label={`第 ${slot + 1} 个词元`} onClick={() => setPick(src)}>
              <svg viewBox={`0 0 ${patch} ${patch}`}>
                <Crop x={sc * patch} y={sr * patch} size={patch} />
              </svg>
              <span>{slot + 1}</span>
            </button>
          );
        })}
      </div>

      <h4 className="p10-h">换成真实照片的大小呢？</h4>
      <div className="ctx-presets" role="group" aria-label="照片大小">
        {IMAGES.map((s) => (
          <button key={s} className="p10-seg" aria-pressed={img === s} onClick={() => chooseImg(s)}>
            {s}×{s}
          </button>
        ))}
      </div>
      <p className="lab-sum">
        {img}×{img} 的照片切成 {patch}×{patch} 的图块：{img / patch} × {img / patch} = <b>{bigTokens.toLocaleString()}</b> 个词元
        {img === 224 && patch === 16 ? "（2020 年 ViT 论文的基本设置）" : ""}
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.small}>{done.small ? "✓" : "○"} 用 8×8 的图块切细一点</li>
        <li data-done={done.mixed}>{done.mixed ? "✓" : "○"} 把图块打乱看看</li>
        <li data-done={done.vit}>{done.vit ? "✓" : "○"} 像真正的 ViT 那样做出 196 个词元</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
