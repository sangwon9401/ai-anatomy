import { useMemo, useState } from "react";
import { PALETTE, PIC, PIC_N, PIC_PATHS } from "../../data/ch86";
import "./style.css";

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
    ? "순서가 섞이니 고양이를 알아보기 힘들죠? 토큰마다 '원래 몇 번째 자리였는지'를 더해 주는 이유예요(36장)."
    : patch === 8
      ? `조각이 작을수록 토큰이 많아져요(${count}개). 더 자세히 보지만, 줄이 길어져서 계산도 늘어요(45장).`
      : patch === 32
        ? "조각이 크면 토큰은 4개뿐! 줄은 짧지만, 조각 하나에 많은 내용을 꾹 눌러 담아야 해요."
        : pick === null
          ? "아래 토큰 줄에서 조각을 하나 눌러 보세요. 그 조각에 숫자가 몇 개 들었는지 보여요."
          : `${pick + 1}번 조각도 숫자 ${patch * patch * 3}개짜리 토큰 하나예요. 다른 크기로도 잘라 보세요.`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="패치 크기">
        {SIZES.map((s) => (
          <button key={s} aria-pressed={patch === s} className="p10-seg" onClick={() => choosePatch(s)}>
            패치 {s}×{s}
          </button>
        ))}
        <button className="p10-seg" aria-pressed={mixed} onClick={toggleMix}>
          {mixed ? "제자리로" : "조각 섞기"}
        </button>
      </div>

      <div className="p10-patch-lab">
        <svg className="p10-pic" viewBox={`-1 -1 ${PIC_N + 2} ${PIC_N + 2}`} role="img" aria-label={`64×64 고양이 그림, ${count}조각${mixed ? ", 섞임" : ""}`}>
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
            토큰 <b>{count}</b>개
          </div>
          <p className="lab-sum" style={{ margin: 0 }}>
            {per} × {per}조각 · 조각 하나에 {patch}×{patch}픽셀 × 3색 = 숫자 <b>{patch * patch * 3}</b>개
          </p>
          {pick !== null && (
            <p className="p10-nums">
              {pick + 1}번 조각 ({pr + 1}행 {pc + 1}열)의 첫 숫자들: {firstNums.join(", ")}, …
            </p>
          )}
        </div>
      </div>

      <h4 className="p10-h">읽는 순서대로 세운 토큰 줄</h4>
      <div className="p10-strip" data-size={patch}>
        {order.map((src, slot) => {
          const sr = Math.floor(src / per);
          const sc = src % per;
          return (
            <button key={slot} className="p10-tok" aria-pressed={pick === src} aria-label={`${slot + 1}번째 토큰`} onClick={() => setPick(src)}>
              <svg viewBox={`0 0 ${patch} ${patch}`}>
                <Crop x={sc * patch} y={sr * patch} size={patch} />
              </svg>
              <span>{slot + 1}</span>
            </button>
          );
        })}
      </div>

      <h4 className="p10-h">진짜 사진 크기라면?</h4>
      <div className="ctx-presets" role="group" aria-label="사진 크기">
        {IMAGES.map((s) => (
          <button key={s} className="p10-seg" aria-pressed={img === s} onClick={() => chooseImg(s)}>
            {s}×{s}
          </button>
        ))}
      </div>
      <p className="lab-sum">
        {img}×{img} 사진을 {patch}×{patch} 패치로 자르면 {img / patch} × {img / patch} = <b>{bigTokens.toLocaleString()}</b>토큰
        {img === 224 && patch === 16 ? " (2020년 ViT 논문의 기본 설정이에요)" : ""}
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.small}>{done.small ? "✓" : "○"} 8×8 패치로 잘게 잘라 보기</li>
        <li data-done={done.mixed}>{done.mixed ? "✓" : "○"} 조각 섞어 보기</li>
        <li data-done={done.vit}>{done.vit ? "✓" : "○"} 진짜 ViT처럼 토큰 196개 만들기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
