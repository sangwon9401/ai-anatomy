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
  const fmt = (t: number) => (t < 10 ? t.toFixed(1) : Math.round(t).toLocaleString("ja-JP"));
  const finished = !running && sim >= tMax - 1e-9 && sim > 0;

  let tip = "大きさを選んで「スタート」を押してみましょう。";
  if (running) tip = "計算中…";
  else if (finished)
    tip =
      tc < ts
        ? `マスが${cells}個だけなら、速い計算機1台が勝ちます。生徒は1マス解くのに1秒もかかるからです。`
        : `生徒チームが${(tc / ts).toFixed(tc / ts < 10 ? 1 : 0)}倍速い！ マスが多いほど、一度に解くほうが有利です。`;

  const missions = [
    { key: "calcWins", text: "計算機1台が勝つ場合を見つける" },
    { key: "big", text: "生徒チームが100倍より速い場合を見つける" },
    { key: "few", text: "生徒が100人だけでも勝つ場合を見つける" },
  ];

  return (
    <div>
      <div className="lab-rows">
        <div>
          <p className="p7-label">行列の大きさ（答えのマスの数）</p>
          <div className="p7-seg" role="group" aria-label="行列の大きさ">
            {SIZES.map((s) => (
              <button key={s} aria-pressed={n === s} onClick={() => pick(() => setN(s))}>
                {s}×{s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="p7-label">生徒の人数（1人が1秒に1マス）</p>
          <div className="p7-seg" role="group" aria-label="生徒の人数">
            {CREWS.map((c) => (
              <button key={c} aria-pressed={crew === c} onClick={() => pick(() => setCrew(c))}>
                {c.toLocaleString("ja-JP")}人
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p7-race">
        <figure>
          <CellCanvas n={n} done={calcDone} busy={calcDone < cells && sim > 0 ? 1 : 0} color="--hl-orange" label={`計算機：${calcDone}マス完了`} />
          <figcaption>
            <b>計算機1台</b>（1秒に{CALC_RATE}マス）
            <br />
            <span className="num">
              {fmt(Math.min(sim, tc))}秒 · {calcDone.toLocaleString("ja-JP")}/{cells.toLocaleString("ja-JP")}マス
            </span>
          </figcaption>
        </figure>
        <figure>
          <CellCanvas n={n} done={studDone} busy={studBusy} color="--hl-yellow" label={`生徒チーム：${studDone}マス完了`} />
          <figcaption>
            <b>生徒{crew.toLocaleString("ja-JP")}人</b>
            <br />
            <span className="num">
              {fmt(Math.min(sim, ts))}秒 · {studDone.toLocaleString("ja-JP")}/{cells.toLocaleString("ja-JP")}マス
            </span>
          </figcaption>
        </figure>
      </div>
      <p className="lab-sum num">
        全部うめるのに：計算機 {fmt(tc)}秒 vs 生徒チーム {fmt(ts)}秒
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
          スタート！
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
      <p className="p7-note">説明用の例の速さです。時間は早送りで見せています。</p>
    </div>
  );
}
