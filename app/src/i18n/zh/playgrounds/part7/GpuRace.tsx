import { useEffect, useRef, useState } from "react";
import { CALC_RATE, STUDENT_RATE, calcTime, studentTime } from "../../../../data/ch68";
import "../../../../playgrounds/part7/style.css";

const SIZES = [4, 8, 16, 32, 64, 128];
const CREWS = [16, 100, 10000];
const ANIM_MS = 2600;

/** n × n grid on a canvas: `done` cells filled, then `busy` cells being worked on. */
function CellCanvas({ n, done, busy, color, label }: { n: number; done: number; busy: number; color: string; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const css = getComputedStyle(c);
    const size = c.clientWidth || 150;
    const dpr = window.devicePixelRatio || 1;
    c.width = size * dpr;
    c.height = size * dpr;
    const g = c.getContext("2d");
    if (!g) return;
    g.scale(dpr, dpr);
    const pad = n <= 16 ? 1 : n <= 32 ? 0.5 : 0;
    const cell = size / n;
    const empty = css.getPropertyValue("--paper-2").trim();
    const fill = css.getPropertyValue(color).trim();
    const ink = css.getPropertyValue("--line").trim();
    g.fillStyle = ink;
    g.fillRect(0, 0, size, size);
    for (let k = 0; k < n * n; k++) {
      const x = (k % n) * cell;
      const y = Math.floor(k / n) * cell;
      g.globalAlpha = k < done ? 1 : k < done + busy ? 0.4 : 1;
      g.fillStyle = k < done + busy ? fill : empty;
      g.fillRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2);
    }
    g.globalAlpha = 1;
  }, [n, done, busy, color]);
  return <canvas ref={ref} className="p7-cells" role="img" aria-label={label} />;
}

export function GpuRace() {
  const [n, setN] = useState(16);
  const [crew, setCrew] = useState(10000);
  const [sim, setSim] = useState(0);
  const [running, setRunning] = useState(false);
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const raf = useRef(0);
  const cells = n * n;
  const tc = calcTime(cells);
  const ts = studentTime(cells, crew);
  const tMax = Math.max(tc, ts);

  useEffect(() => {
    if (!running) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ANIM_MS);
      setSim(p * tMax);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        setRunning(false);
        setSeen((s) => ({ ...s, calcWins: s.calcWins || tc < ts, big: s.big || ts * 100 < tc, few: s.few || (crew === 100 && ts < tc) }));
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running, tMax, tc, ts, crew]);

  const pick = (fn: () => void) => {
    setRunning(false);
    setSim(0);
    fn();
  };
  const calcDone = Math.min(cells, Math.floor(sim * CALC_RATE + 1e-9));
  const rounds = Math.floor(sim * STUDENT_RATE + 1e-9);
  const studDone = Math.min(cells, rounds * crew);
  const studBusy = sim > 0 && studDone < cells ? Math.min(cells - studDone, crew) : 0;
  const fmt = (t: number) => (t < 10 ? t.toFixed(1) : Math.round(t).toLocaleString("zh-CN"));
  const finished = !running && sim >= tMax - 1e-9 && sim > 0;

  let tip = "选好大小，按“出发”。";
  if (running) tip = "计算中……";
  else if (finished)
    tip =
      tc < ts
        ? `只有 ${cells} 格时，一台快速计算器会赢。因为学生算一格要花整整 1 秒。`
        : `学生队快了 ${(tc / ts).toFixed(tc / ts < 10 ? 1 : 0)} 倍！格子越多，一起算的一方越占优势。`;

  const missions = [
    { key: "calcWins", text: "找出一台计算器获胜的情况" },
    { key: "big", text: "找出学生队快 100 倍以上的情况" },
    { key: "few", text: "找出只有 100 名学生也能赢的情况" },
  ];

  return (
    <div>
      <div className="lab-rows">
        <div>
          <p className="p7-label">矩阵大小（结果的格子数）</p>
          <div className="p7-seg" role="group" aria-label="矩阵大小">
            {SIZES.map((s) => (
              <button key={s} aria-pressed={n === s} onClick={() => pick(() => setN(s))}>
                {s}×{s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="p7-label">学生人数（每人每秒 1 格）</p>
          <div className="p7-seg" role="group" aria-label="学生人数">
            {CREWS.map((c) => (
              <button key={c} aria-pressed={crew === c} onClick={() => pick(() => setCrew(c))}>
                {c.toLocaleString("zh-CN")} 人
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p7-race">
        <figure>
          <CellCanvas n={n} done={calcDone} busy={calcDone < cells && sim > 0 ? 1 : 0} color="--hl-orange" label={`计算器：已完成 ${calcDone} 格`} />
          <figcaption>
            <b>1 台计算器</b>（每秒 {CALC_RATE} 格）
            <br />
            <span className="num">
              {fmt(Math.min(sim, tc))} 秒 · {calcDone.toLocaleString("zh-CN")}/{cells.toLocaleString("zh-CN")} 格
            </span>
          </figcaption>
        </figure>
        <figure>
          <CellCanvas n={n} done={studDone} busy={studBusy} color="--hl-yellow" label={`学生队：已完成 ${studDone} 格`} />
          <figcaption>
            <b>{crew.toLocaleString("zh-CN")} 名学生</b>
            <br />
            <span className="num">
              {fmt(Math.min(sim, ts))} 秒 · {studDone.toLocaleString("zh-CN")}/{cells.toLocaleString("zh-CN")} 格
            </span>
          </figcaption>
        </figure>
      </div>
      <p className="lab-sum num">
        填满用时：计算器 {fmt(tc)} 秒 vs 学生队 {fmt(ts)} 秒
      </p>
      <div className="lab-actions">
        <button
          className="btn"
          disabled={running}
          onClick={() => {
            setSim(0);
            setRunning(true);
          }}
        >
          出发！
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        {missions.map((m) => (
          <li key={m.key} data-done={!!seen[m.key]}>
            {seen[m.key] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">速度是示意数据。时间以快进方式显示。</p>
    </div>
  );
}
