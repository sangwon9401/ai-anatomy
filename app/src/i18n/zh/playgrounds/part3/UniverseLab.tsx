// zh overlay of src/playgrounds/part3/UniverseLab.tsx (strings and the two word literals)
import { useState } from "react";
import { ODD_ROUNDS, UNIVERSE, UNI_GROUPS, nearest, oddOne, wordAt } from "../../../../data/ch35";
import "../../../../playgrounds/part3/style.css";

const W = 340;
const H = 300;
const X = (x: number) => 12 + x * 30;
const Y = (y: number) => H - 12 - y * 29;

export function UniverseLab() {
  const [sel, setSel] = useState("小狗");
  const [query, setQuery] = useState("");
  const [round, setRound] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const near = nearest(sel, 5);
  const me = wordAt(sel);
  const set = ODD_ROUNDS[round % ODD_ROUNDS.length];
  const answer = oddOne(set);
  const mixed = new Set(near.slice(0, 4).map((n) => n.g)).size > 1;

  const search = (q: string) => {
    setQuery(q);
    const hit = UNIVERSE.find((x) => x.w === q.trim());
    if (hit) setSel(hit.w);
  };

  return (
    <div>
      <div className="plane-lab">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 340, display: "block", background: "var(--paper-2)", borderRadius: 14 }} role="img" aria-label={`嵌入地图，标出离“${sel}”近的词`}>
          {near.map((n) => (
            <line key={n.w} x1={X(me.v[0])} y1={Y(me.v[1])} x2={X(n.v[0])} y2={Y(n.v[1])} stroke="var(--pen)" strokeWidth={1.5} strokeDasharray="3 3" />
          ))}
          {UNIVERSE.map((x) => {
            const on = x.w === sel;
            const isNear = near.some((n) => n.w === x.w);
            return (
              <g key={x.w} onClick={() => setSel(x.w)} style={{ cursor: "pointer" }} opacity={on || isNear ? 1 : 0.45}>
                <circle cx={X(x.v[0])} cy={Y(x.v[1])} r={on ? 7 : 5} fill={x.g < 0 ? "var(--paper)" : `var(--hl-${UNI_GROUPS[x.g].c})`} stroke={x.g < 0 ? "var(--pen)" : "var(--ink)"} strokeWidth={on ? 2.5 : 1.5} />
                <circle cx={X(x.v[0])} cy={Y(x.v[1])} r={14} fill="transparent" />
                <text x={X(x.v[0]) + 7} y={Y(x.v[1]) - 5} fontSize={10.5} fontWeight={on ? 700 : 400} fill="var(--ink)">
                  {x.w}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="plane-side">
          <label className="code-label" htmlFor="p3-uni-q" style={{ marginTop: 0 }}>
            搜索词（地图上有 31 个词）
          </label>
          <input id="p3-uni-q" className="code-input" value={query} placeholder="例如：包、钥匙、作业" onChange={(e) => search(e.target.value)} />
          <div className="vec-big num">
            {sel} = ({me.v.join(", ")})
          </div>
          <div className="bars">
            {near.map((n, i) => (
              <div className="bar-row" key={n.w}>
                <span className="label">
                  {i + 1}. {n.w}
                </span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${Math.max(5, 100 - n.d * 22)}%`, background: n.g < 0 ? "var(--pen)" : `var(--hl-${UNI_GROUPS[n.g].c})` }} />
                </span>
                <span className="val">{n.d.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p className="lab-tip">
            {sel === "包"
              ? "“包”的邻居里，随身物品、食物和身体混在一起。它有好几个意思，所以夹在几群词之间（第 45 章来解决）。"
              : mixed
                ? "邻居里混进了别的组。这是一个处在组边缘的词。"
                : `近邻都在同一组（${me.g >= 0 ? UNI_GROUPS[me.g].name : ""}）。离得近，意思就像。`}
          </p>
        </div>
      </div>

      <div className="p3-odd">
        <div className="p3-sub">
          找不同 · {(round % ODD_ROUNDS.length) + 1}/{ODD_ROUNDS.length} · 答对 {score} 题
        </div>
        <div className="p3-oh-words" role="group" aria-label="选出不同的一个">
          {set.map((w) => (
            <button
              key={w}
              className={`p3-wbtn${pick ? (w === answer ? " hl-mint" : w === pick ? " p3-wrong" : "") : ""}`}
              disabled={pick !== null}
              onClick={() => {
                setPick(w);
                if (w === answer) setScore((s) => s + 1);
                setSel(w);
              }}
            >
              {w}
            </button>
          ))}
        </div>
        {pick && (
          <>
            <p className="lab-tip">{pick === answer ? `答对了！只有“${answer}”在地图上离得很远。` : `差一点。在地图上孤零零离得远的是“${answer}”。`}</p>
            <div className="lab-actions">
              <button
                className="btn ghost"
                onClick={() => {
                  setRound((r) => r + 1);
                  setPick(null);
                }}
              >
                下一题
              </button>
            </div>
          </>
        )}
      </div>
      <p className="lab-sum">地图和距离是示意数据。真实的嵌入有几千维，没法这样画出来。</p>
    </div>
  );
}
