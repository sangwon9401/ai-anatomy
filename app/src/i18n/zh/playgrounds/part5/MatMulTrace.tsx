// zh overlay of src/playgrounds/part5/MatMulTrace.tsx (strings only)
import { useState } from "react";
import { K, OUT, Q, SCORE, V, WEIGHT, WORDS, dec3, fmt, fmtVec } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

type Tab = "qk" | "av";
const A3 = WEIGHT.map(dec3);
const MISSIONS: { tab: Tab; i: number; j: number; text: string }[] = [
  { tab: "qk", i: 2, j: 0, text: "在分数表里找到“去”给“我”打的分" },
  { tab: "qk", i: 0, j: 1, text: "在“我”这一行找到第 1 名的格子" },
  { tab: "av", i: 3, j: 0, text: "在新向量里找到第 49 章的 2.25" },
];

const t = (a: number, b: number, d = 0) => `${d ? a.toFixed(d) : fmt(a)}×${b < 0 ? `(${fmt(b)})` : fmt(b)}`;

/** ch50: tap a cell of Q × Kᵀ or (ratio table) × V to see which row and column made it. */
export function MatMulTrace() {
  const [tab, setTab] = useState<Tab>("qk");
  const [sel, setSel] = useState<[number, number]>([3, 2]);
  const [done, setDone] = useState<boolean[]>(MISSIONS.map(() => false));

  const pick = (i: number, j: number) => {
    setSel([i, j]);
    setDone((d) => d.map((x, k) => x || (MISSIONS[k].tab === tab && MISSIONS[k].i === i && MISSIONS[k].j === j)));
  };
  const switchTab = (next: Tab) => {
    setTab(next);
    setSel(next === "qk" ? [3, 2] : [3, 0]);
  };

  const [i, j] = sel;
  const cols = tab === "qk" ? WORDS.map((w) => w) : ["第 1 格", "第 2 格"];
  const value = (r: number, c: number) => (tab === "qk" ? fmt(SCORE[r][c]) : fmt(OUT[r][c]));

  let calc: string[];
  if (tab === "qk") {
    const q = Q[i];
    const k = K[j];
    calc = [`Q 的“${WORDS[i]}”行 ${fmtVec(q)}`, `Kᵀ 的“${WORDS[j]}”列 ${fmtVec(k)}`, `= ${t(q[0], k[0])} + ${t(q[1], k[1])} = ${fmt(SCORE[i][j])}`];
  } else {
    const w = A3[i];
    const col = V.map((v) => v[j]);
    calc = [
      `比例表的“${WORDS[i]}”行 (${w.map((x) => x.toFixed(3)).join(", ")})`,
      `V 的第 ${j + 1} 列 (${col.map((x) => fmt(x)).join(", ")})`,
      `= ${w.map((x, k) => t(x, col[k], 3)).join(" + ")} ≈ ${fmt(OUT[i][j])}`,
    ];
  }

  const tip = done.every(Boolean)
    ? "矩阵乘法的每一格，永远是“前一个矩阵的行 · 后一个矩阵的列”（第 11 章）。所以一次乘法就能算完所有词。"
    : tab === "qk"
      ? "点一个格子，就能看到它是 Q 的哪一行和 Kᵀ 的哪一列做的点积。"
      : "新向量的每一格，是比例表的一行和 V 的一列做的点积，和第 49 章的调颜料一样。";

  return (
    <div>
      <div className="p5-seg" role="tablist" aria-label="哪一个乘法">
        <button role="tab" aria-pressed={tab === "qk"} aria-selected={tab === "qk"} onClick={() => switchTab("qk")}>
          Q × Kᵀ = 分数表
        </button>
        <button role="tab" aria-pressed={tab === "av"} aria-selected={tab === "av"} onClick={() => switchTab("av")}>
          比例表 × V = 新向量
        </button>
      </div>
      <div className="p5-table-wrap">
        <table className="p5-table" aria-label={tab === "qk" ? "分数表" : "新向量"}>
          <thead>
            <tr>
              <th className="row" />
              {cols.map((c, cj) => (
                <th key={c} style={{ color: cj === j ? "var(--pen)" : undefined }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WORDS.map((w, r) => (
              <tr key={w}>
                <th className="row" style={{ color: r === i ? "var(--pen)" : undefined }}>
                  {w}
                </th>
                {cols.map((c, cj) => (
                  <td key={c} data-hl={r === i && cj === j}>
                    <button onClick={() => pick(r, cj)} aria-label={`${w} 行 ${c} 列：${value(r, cj)}`}>
                      {value(r, cj)}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p5-calc">
        {calc.map((c) => (
          <div key={c}>{c}</div>
        ))}
      </div>
      <p className="p5-note">数字是和第 46～49 章相同的示意数据。</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        {MISSIONS.map((m, k) => (
          <li key={m.text} data-done={done[k]}>
            {done[k] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
