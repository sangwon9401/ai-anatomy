import { useState } from "react";
import { VOCAB8, VOCAB_SIZES, dist, dot, oneHot } from "../../data/ch32";
import "./style.css";

const N = VOCAB8.length;

export function OneHotLab() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [tried, setTried] = useState<Set<string>>(new Set(["0-1"]));
  const [size, setSize] = useState(0);
  const va = oneHot(a, N);
  const vb = oneHot(b, N);
  const d = dist(va, vb);
  const p = dot(va, vb);

  const choose = (which: "a" | "b", i: number) => {
    const na = which === "a" ? i : a;
    const nb = which === "b" ? i : b;
    if (which === "a") setA(i);
    else setB(i);
    setTried((t) => new Set(t).add(`${Math.min(na, nb)}-${Math.max(na, nb)}`));
  };

  const pairs = [...tried].filter((k) => k.split("-")[0] !== k.split("-")[1]).length;
  const tip =
    a === b
      ? "같은 단어끼리만 거리 0, 내적 1이에요. 다른 단어끼리는 언제나 √2와 0이에요."
      : pairs >= 4
        ? `다른 짝 ${pairs}개를 해 봤는데 전부 √2예요. 원-핫에선 '강아지–고양이'도 '강아지–버스'만큼 멀어요.`
        : "다른 짝도 골라 보세요. 거리가 달라지나요?";
  const n = VOCAB_SIZES[size].n;

  return (
    <div>
      {(["a", "b"] as const).map((which) => (
        <div key={which} className="p3-oh-pick">
          <span className="p3-sub">{which === "a" ? "단어 A" : "단어 B"}</span>
          <div className="p3-oh-words" role="group" aria-label={which === "a" ? "단어 A 고르기" : "단어 B 고르기"}>
            {VOCAB8.map((w, i) => {
              const on = (which === "a" ? a : b) === i;
              return (
                <button key={w} className={`p3-wbtn${on ? (which === "a" ? " hl-yellow" : " hl-sky") : ""}`} aria-pressed={on} onClick={() => choose(which, i)}>
                  {w}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="p3-oh-table" role="table" aria-label="원-핫 벡터">
        <div className="p3-oh-row" role="row">
          <span role="rowheader" />
          {VOCAB8.map((w) => (
            <span key={w} className="p3-oh-head" role="columnheader">
              {w}
            </span>
          ))}
        </div>
        {[
          { w: VOCAB8[a], v: va, c: "hl-yellow" },
          { w: VOCAB8[b], v: vb, c: "hl-sky" },
        ].map((r, i) => (
          <div key={i} className="p3-oh-row" role="row">
            <span role="rowheader" className="p3-oh-name">
              {r.w}
            </span>
            {r.v.map((x, k) => (
              <span key={k} role="cell" className={`p3-oh-cell num${x ? ` on ${r.c}` : ""}`}>
                {x}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="dot-formula" style={{ marginTop: 12 }}>
        거리 = <b>{d === 0 ? "0" : "√2 ≈ 1.41"}</b> · 내적 = <b>{p}</b>
      </div>
      <p className="lab-tip">{tip}</p>

      <div className="p3-sub" style={{ marginTop: 16 }}>
        어휘가 커지면?
      </div>
      <div className="seg p3-seg" role="group" aria-label="어휘 크기">
        {VOCAB_SIZES.map((s, i) => (
          <button key={s.name} aria-pressed={i === size} onClick={() => setSize(i)}>
            {s.name}
          </button>
        ))}
      </div>
      <p className="lab-sum num" style={{ marginTop: 8 }}>
        단어 하나 = 숫자 <b>{n.toLocaleString("ko-KR")}</b>개. 그중 1은 딱 1개, 0이 {(n - 1).toLocaleString("ko-KR")}개 ({((1 / n) * 100).toPrecision(2)}%만 쓸모 있는 칸).
      </p>
    </div>
  );
}
