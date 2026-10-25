import { useState } from "react";
import { K, OUT, Q, SCORE, V, WEIGHT, WORDS, dec3, fmt, fmtVec } from "../../data/part5-toy";
import "./style.css";

type Tab = "qk" | "av";
const A3 = WEIGHT.map(dec3);
const MISSIONS: { tab: Tab; i: number; j: number; text: string }[] = [
  { tab: "qk", i: 2, j: 0, text: "점수표에서 '학교에'가 '나는'에게 매긴 점수 찾기" },
  { tab: "qk", i: 0, j: 1, text: "'나는' 줄에서 1등 칸 찾기" },
  { tab: "av", i: 3, j: 0, text: "새 벡터에서 49장의 2.25 찾기" },
];

const t = (a: number, b: number, d = 0) => `${d ? a.toFixed(d) : fmt(a)}×${b < 0 ? `(${fmt(b)})` : fmt(b)}`;

/** 50장: tap a cell of Q × Kᵀ or (ratio table) × V to see which row and column made it. */
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
  const cols = tab === "qk" ? WORDS.map((w) => w) : ["1번 칸", "2번 칸"];
  const value = (r: number, c: number) => (tab === "qk" ? fmt(SCORE[r][c]) : fmt(OUT[r][c]));

  let calc: string[];
  if (tab === "qk") {
    const q = Q[i];
    const k = K[j];
    calc = [`Q의 '${WORDS[i]}' 줄 ${fmtVec(q)}`, `Kᵀ의 '${WORDS[j]}' 열 ${fmtVec(k)}`, `= ${t(q[0], k[0])} + ${t(q[1], k[1])} = ${fmt(SCORE[i][j])}`];
  } else {
    const w = A3[i];
    const col = V.map((v) => v[j]);
    calc = [
      `비율표의 '${WORDS[i]}' 줄 (${w.map((x) => x.toFixed(3)).join(", ")})`,
      `V의 ${j + 1}번 열 (${col.map((x) => fmt(x)).join(", ")})`,
      `= ${w.map((x, k) => t(x, col[k], 3)).join(" + ")} ≈ ${fmt(OUT[i][j])}`,
    ];
  }

  const tip = done.every(Boolean)
    ? "행렬 곱의 칸은 언제나 '앞 행렬의 줄 · 뒤 행렬의 열'이에요(11장). 그래서 한 번의 곱셈으로 모든 단어를 계산해요."
    : tab === "qk"
      ? "칸을 누르면 Q의 어느 줄과 Kᵀ의 어느 열을 내적했는지 보여요."
      : "새 벡터의 칸은 비율표의 한 줄과 V의 한 열을 내적한 값이에요. 49장의 물감 섞기와 같아요.";

  return (
    <div>
      <div className="p5-seg" role="tablist" aria-label="어느 곱셈">
        <button role="tab" aria-pressed={tab === "qk"} aria-selected={tab === "qk"} onClick={() => switchTab("qk")}>
          Q × Kᵀ = 점수표
        </button>
        <button role="tab" aria-pressed={tab === "av"} aria-selected={tab === "av"} onClick={() => switchTab("av")}>
          비율표 × V = 새 벡터
        </button>
      </div>
      <div className="p5-table-wrap">
        <table className="p5-table" aria-label={tab === "qk" ? "점수표" : "새 벡터"}>
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
                    <button onClick={() => pick(r, cj)} aria-label={`${w} 줄 ${c} 칸: ${value(r, cj)}`}>
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
      <p className="p5-note">숫자는 46~49장과 같은 설명용 예시예요.</p>
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
