// ja overlay of src/playgrounds/part5/MatMulTrace.tsx (strings only)
import { useState } from "react";
import { K, OUT, Q, SCORE, V, WEIGHT, WORDS, dec3, fmt, fmtVec } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

type Tab = "qk" | "av";
const A3 = WEIGHT.map(dec3);
const MISSIONS: { tab: Tab; i: number; j: number; text: string }[] = [
  { tab: "qk", i: 2, j: 0, text: "スコア表で、「学校に」が「私は」につけたスコアを見つける" },
  { tab: "qk", i: 0, j: 1, text: "「私は」の行で1位のマスを見つける" },
  { tab: "av", i: 3, j: 0, text: "新しいベクトルで、第49章の2.25を見つける" },
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
  const cols = tab === "qk" ? WORDS.map((w) => w) : ["1番目の欄", "2番目の欄"];
  const value = (r: number, c: number) => (tab === "qk" ? fmt(SCORE[r][c]) : fmt(OUT[r][c]));

  let calc: string[];
  if (tab === "qk") {
    const q = Q[i];
    const k = K[j];
    calc = [`Qの「${WORDS[i]}」の行 ${fmtVec(q)}`, `Kᵀの「${WORDS[j]}」の列 ${fmtVec(k)}`, `= ${t(q[0], k[0])} + ${t(q[1], k[1])} = ${fmt(SCORE[i][j])}`];
  } else {
    const w = A3[i];
    const col = V.map((v) => v[j]);
    calc = [
      `割合の表の「${WORDS[i]}」の行 (${w.map((x) => x.toFixed(3)).join(", ")})`,
      `Vの${j + 1}番目の列 (${col.map((x) => fmt(x)).join(", ")})`,
      `= ${w.map((x, k) => t(x, col[k], 3)).join(" + ")} ≈ ${fmt(OUT[i][j])}`,
    ];
  }

  const tip = done.every(Boolean)
    ? "行列の積のマスは、いつも「前の行列の行・うしろの行列の列」です(第11章)。だから1回のかけ算で、すべての語を計算できます。"
    : tab === "qk"
      ? "マスを押すと、Qのどの行とKᵀのどの列の内積かが見えます。"
      : "新しいベクトルのマスは、割合の表の1行とVの1列の内積です。第49章の絵の具まぜと同じです。";

  return (
    <div>
      <div className="p5-seg" role="tablist" aria-label="どのかけ算">
        <button role="tab" aria-pressed={tab === "qk"} aria-selected={tab === "qk"} onClick={() => switchTab("qk")}>
          Q × Kᵀ = スコア表
        </button>
        <button role="tab" aria-pressed={tab === "av"} aria-selected={tab === "av"} onClick={() => switchTab("av")}>
          割合の表 × V = 新しいベクトル
        </button>
      </div>
      <div className="p5-table-wrap">
        <table className="p5-table" aria-label={tab === "qk" ? "スコア表" : "新しいベクトル"}>
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
                    <button onClick={() => pick(r, cj)} aria-label={`${w}の行、${c}のマス：${value(r, cj)}`}>
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
      <p className="p5-note">数は第46〜49章と同じ、説明用の例です。</p>
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
