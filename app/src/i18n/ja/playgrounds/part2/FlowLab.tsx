import { useEffect, useRef, useState } from "react";
import { FEATURES, NET, STORE_A, forward, num } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

// network drawing in a 320×236 viewBox
const IN: [number, number][] = [
  [42, 46],
  [42, 118],
  [42, 190],
];
const HIDN: [number, number][] = [
  [172, 72],
  [172, 164],
];
const OUTN: [number, number] = [282, 118];
const R = 22;
const RANGES: [number, number][] = [
  [1, 5],
  [0, 4],
  [3, 7],
];
const fmtW = (w: number) => (w < 0 ? `(${num(w)})` : num(w));
const signed = (b: number) => (b < 0 ? `− ${num(-b)}` : `+ ${num(b)}`);
const NAMES = ["人気", "辛すぎ"];

/** stage 0: only inputs, 1: layer 1 done, 2: output done; `p` is the travel progress of the running phase */
type Run = { stage: 0 | 1 | 2; moving: 0 | 1 | 2; p: number };

export function FlowLab() {
  const [x, setX] = useState<number[]>([...STORE_A.x]);
  const [run, setRun] = useState<Run>({ stage: 0, moving: 0, p: 0 });
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const f = forward(NET, x);
  const go = () => {
    cancelAnimationFrame(raf.current);
    const phase: 1 | 2 = run.stage === 1 ? 2 : 1;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 750);
      if (p < 1) {
        setRun({ stage: phase === 1 ? 0 : 1, moving: phase, p });
        raf.current = requestAnimationFrame(tick);
      } else setRun({ stage: phase, moving: 0, p: 0 });
    };
    raf.current = requestAnimationFrame(tick);
  };
  const reset = () => {
    cancelAnimationFrame(raf.current);
    setRun({ stage: 0, moving: 0, p: 0 });
  };

  const edges1 = NET.W1.flatMap((row, j) => row.map((w, i) => ({ i, j, w, a: IN[i], b: HIDN[j] })));
  const edges2 = NET.v.map((w, j) => ({ j, w, a: HIDN[j], b: OUTN }));
  const lerp = (a: [number, number], b: [number, number], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  const h2On = f.h[1] > 0;
  const nowDone = [run.stage === 2 && h2On, run.stage === 2 && f.y >= 4];
  const [ever, setEver] = useState([false, false]);
  useEffect(() => {
    if (nowDone.some((d, i) => d && !ever[i])) setEver((prev) => prev.map((d, i) => d || nowDone[i]));
  }, [nowDone[0], nowDone[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  const missions = [
    { done: ever[0], text: "「辛すぎ」ニューロンをオンにして、出力まで流す" },
    { done: ever[1], text: "予想の星を4以上にする" },
  ];
  const tip =
    run.stage === 0
      ? "「流す」を押すと、1つ目の層から順番に計算します。"
      : run.stage === 1
        ? f.h[1] === 0
          ? "「辛すぎ」は計算結果が0以下なので、ReLUがオフにしました。もう一度押して、出力まで流してみましょう。"
          : "2つのニューロンがどちらもオンになりました。もう一度押して、出力まで流してみましょう。"
        : nowDone.every(Boolean)
          ? "警報がオンなのに4以上！待ちが長ければ減点に勝てます。このように前へだけ流れる計算が順伝播です。"
          : missions.every((m) => m.done)
            ? "2つのミッション成功！今度は、警報をオンにしたまま4以上も同時に作ってみましょう。"
          : `予想の星 ${num(f.y)}。入力を変えると、最初から流し直します。`;

  return (
    <div>
      <div className="lab-rows p2-sliders">
        {FEATURES.map((ft, i) => (
          <div className="lab-row" key={ft.key}>
            <span>
              {ft.name} ({ft.unit})
            </span>
            <input
              type="range"
              min={RANGES[i][0]}
              max={RANGES[i][1]}
              step={1}
              value={x[i]}
              aria-label={ft.name}
              onChange={(e) => {
                const v = Number(e.target.value);
                setX((prev) => prev.map((q, k) => (k === i ? v : q)));
                reset();
              }}
            />
            <span className="val">{x[i]}</span>
          </div>
        ))}
      </div>

      <svg viewBox="0 0 320 236" className="p2-net" role="img" aria-label={`ネットワーク：予想の星 ${run.stage === 2 ? num(f.y) : "計算前"}`}>
        {edges1.map((e) => (
          <line key={`a${e.i}${e.j}`} x1={e.a[0] + R} y1={e.a[1]} x2={e.b[0] - R} y2={e.b[1]} stroke={e.w === 0 ? "var(--ink-3)" : "var(--ink)"} strokeWidth={e.w === 0 ? 1 : 1.6} strokeDasharray={e.w === 0 ? "3 3" : undefined} />
        ))}
        {edges2.map((e) => (
          <line key={`b${e.j}`} x1={e.a[0] + R} y1={e.a[1]} x2={e.b[0] - R} y2={e.b[1]} stroke="var(--ink)" strokeWidth={1.6} />
        ))}
        {edges1
          .filter((e) => e.w !== 0)
          .map((e) => {
            const [tx, ty] = lerp([e.a[0] + R, e.a[1]], [e.b[0] - R, e.b[1]], e.j === 0 ? 0.32 : 0.62);
            return (
              <text key={`wa${e.i}${e.j}`} x={tx} y={ty - 3} textAnchor="middle" fontSize={11} fill="var(--ink-2)" className="p2-halo">
                ×{num(e.w)}
              </text>
            );
          })}
        {edges2.map((e) => {
          const [tx, ty] = lerp([e.a[0] + R, e.a[1]], [e.b[0] - R, e.b[1]], 0.5);
          return (
            <text key={`wb${e.j}`} x={tx} y={ty - 4} textAnchor="middle" fontSize={11} fill="var(--ink-2)" className="p2-halo">
              ×{num(e.w)}
            </text>
          );
        })}
        {/* moving particles */}
        {run.moving === 1 &&
          edges1.map((e) => {
            const [px, py] = lerp([e.a[0] + R, e.a[1]], [e.b[0] - R, e.b[1]], run.p);
            return <circle key={`p${e.i}${e.j}`} cx={px} cy={py} r={4.5} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={1} opacity={e.w === 0 ? 0.3 : 1} />;
          })}
        {run.moving === 2 &&
          edges2.map((e) => {
            const [px, py] = lerp([e.a[0] + R, e.a[1]], [e.b[0] - R, e.b[1]], run.p);
            return <circle key={`q${e.j}`} cx={px} cy={py} r={4.5} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={1} opacity={f.h[e.j] === 0 ? 0.3 : 1} />;
          })}
        {IN.map(([cx, cy], i) => (
          <g key={`i${i}`}>
            <circle cx={cx} cy={cy} r={R} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.8} />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--ink)">
              {x[i]}
            </text>
            <text x={cx} y={cy - R - 4} textAnchor="middle" fontSize={11} fill="var(--ink-2)">
              {FEATURES[i].name}
            </text>
          </g>
        ))}
        {HIDN.map(([cx, cy], j) => {
          const shown = run.stage >= 1;
          const off = shown && f.h[j] === 0;
          return (
            <g key={`h${j}`}>
              <circle cx={cx} cy={cy} r={R} fill={!shown ? "var(--paper-2)" : off ? "var(--paper-2)" : j === 1 ? "var(--hl-orange)" : "var(--hl-yellow)"} stroke="var(--ink)" strokeWidth={1.8} />
              <text x={cx} y={cy + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={off ? "var(--ink-3)" : "var(--chip-ink)"}>
                {shown ? num(f.h[j]) : "?"}
              </text>
              <text x={cx} y={cy - R - 4} textAnchor="middle" fontSize={11} fill="var(--ink-2)">
                {NAMES[j]}
              </text>
            </g>
          );
        })}
        <circle cx={OUTN[0]} cy={OUTN[1]} r={R + 2} fill={run.stage === 2 ? "var(--hl-mint)" : "var(--paper-2)"} stroke="var(--ink)" strokeWidth={1.8} />
        <text x={OUTN[0]} y={OUTN[1] + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--chip-ink)">
          {run.stage === 2 ? num(f.y) : "?"}
        </text>
        <text x={OUTN[0]} y={OUTN[1] - R - 6} textAnchor="middle" fontSize={11} fill="var(--ink-2)">
          予想の星
        </text>
      </svg>

      <div className="p2-calc">
        {run.stage >= 1 ? (
          <>
            人気 = {x.map((v, i) => `${v}×${fmtW(NET.W1[0][i])}`).join(" + ")} {signed(NET.b1[0])} = {num(f.z[0])} → ReLU → <b>{num(f.h[0])}</b>
            <br />
            辛すぎ = {x[0]}×{fmtW(NET.W1[1][0])} {signed(NET.b1[1])} = {num(f.z[1])} → ReLU → <b>{num(f.h[1])}</b>
          </>
        ) : (
          "層のニューロン：(入力 × 重み)の合計 + バイアス → ReLU"
        )}
        {run.stage === 2 && (
          <>
            <br />
            星 = {num(f.h[0])}×{fmtW(NET.v[0])} + {num(f.h[1])}×{fmtW(NET.v[1])} + {num(NET.c)} = <b>{num(f.y)}</b>
          </>
        )}
      </div>
      <p className="p2-note">バイアス：人気 −0.5、辛すぎ −4、星 +2。重みは学習前の値です（説明用の例）。</p>

      <div className="lab-actions">
        <button className="btn" disabled={run.moving !== 0 || run.stage === 2} onClick={go}>
          流す ▶
        </button>
        <button className="btn ghost" disabled={run.stage === 0 && run.moving === 0} onClick={reset}>
          最初から
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        {missions.map((m) => (
          <li key={m.text} data-done={m.done}>
            {m.done ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
