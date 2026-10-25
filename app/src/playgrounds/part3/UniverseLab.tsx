import { useState } from "react";
import { ODD_ROUNDS, UNIVERSE, UNI_GROUPS, nearest, oddOne, wordAt } from "../../data/ch35";
import "./style.css";

const W = 340;
const H = 300;
const X = (x: number) => 12 + x * 30;
const Y = (y: number) => H - 12 - y * 29;

export function UniverseLab() {
  const [sel, setSel] = useState("강아지");
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
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 340, display: "block", background: "var(--paper-2)", borderRadius: 14 }} role="img" aria-label={`임베딩 지도, '${sel}'와 가까운 단어 표시`}>
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
            단어 검색 (지도 속 단어 31개)
          </label>
          <input id="p3-uni-q" className="code-input" value={query} placeholder="예: 배, 버스, 숙제" onChange={(e) => search(e.target.value)} />
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
            {sel === "배"
              ? "'배'의 이웃은 탈것, 과일, 몸이 섞여 있어요. 뜻이 여러 개라 무리들 사이에 있거든요(45장에서 해결)."
              : mixed
                ? "이웃 중에 다른 무리도 섞여 있네요. 무리 가장자리에 있는 단어예요."
                : `가까운 이웃이 모두 같은 무리(${me.g >= 0 ? UNI_GROUPS[me.g].name : ""})예요. 가까우면 닮았어요.`}
          </p>
        </div>
      </div>

      <div className="p3-odd">
        <div className="p3-sub">
          이상한 하나 찾기 · {(round % ODD_ROUNDS.length) + 1}/{ODD_ROUNDS.length} · 맞힌 수 {score}
        </div>
        <div className="p3-oh-words" role="group" aria-label="이상한 하나 고르기">
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
            <p className="lab-tip">{pick === answer ? `맞았어요! '${answer}'만 지도에서 멀리 떨어져 있어요.` : `아쉬워요. 지도에서 혼자 멀리 있는 건 '${answer}'예요.`}</p>
            <div className="lab-actions">
              <button
                className="btn ghost"
                onClick={() => {
                  setRound((r) => r + 1);
                  setPick(null);
                }}
              >
                다음 문제
              </button>
            </div>
          </>
        )}
      </div>
      <p className="lab-sum">지도와 거리는 설명용 예시예요. 진짜 임베딩은 수천 차원이라 이렇게 그릴 수 없어요.</p>
    </div>
  );
}
