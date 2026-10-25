// zh overlay of src/playgrounds/part3/OneHotLab.tsx (strings only; number format zh-CN)
import { useState } from "react";
import { VOCAB8, VOCAB_SIZES, dist, dot, oneHot } from "../../../../data/ch32";
import "../../../../playgrounds/part3/style.css";

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
      ? "只有同一个词和自己的距离是 0、点积是 1。不同的词之间永远是 √2 和 0。"
      : pairs >= 4
        ? `试了 ${pairs} 对不同的词，全都是 √2。在独热编码里，“小狗–小猫”和“小狗–公交车”一样远。`
        : "再选别的词对试试。距离会变吗？";
  const n = VOCAB_SIZES[size].n;

  return (
    <div>
      {(["a", "b"] as const).map((which) => (
        <div key={which} className="p3-oh-pick">
          <span className="p3-sub">{which === "a" ? "词 A" : "词 B"}</span>
          <div className="p3-oh-words" role="group" aria-label={which === "a" ? "选择词 A" : "选择词 B"}>
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

      <div className="p3-oh-table" role="table" aria-label="独热向量">
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
        距离 = <b>{d === 0 ? "0" : "√2 ≈ 1.41"}</b> · 点积 = <b>{p}</b>
      </div>
      <p className="lab-tip">{tip}</p>

      <div className="p3-sub" style={{ marginTop: 16 }}>
        词表变大会怎样？
      </div>
      <div className="seg p3-seg" role="group" aria-label="词表大小">
        {VOCAB_SIZES.map((s, i) => (
          <button key={s.name} aria-pressed={i === size} onClick={() => setSize(i)}>
            {s.name}
          </button>
        ))}
      </div>
      <p className="lab-sum num" style={{ marginTop: 8 }}>
        一个词 = <b>{n.toLocaleString("zh-CN")}</b> 个数字。其中 1 只有 1 个，0 有 {(n - 1).toLocaleString("zh-CN")} 个（只有 {((1 / n) * 100).toPrecision(2)}% 的格子有用）。
      </p>
    </div>
  );
}
