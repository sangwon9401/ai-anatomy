import { useState } from "react";
import { SPEEDS, TIME_A, TIME_B, TOK_VEC, WAVE_NAMES, add4, fmt, pe, type V4 } from "../../data/ch36";
import "./style.css";

const show = (t: string) => (t === " " ? "␣" : t);
const key = (v: V4) => v.map((x) => x.toFixed(3)).join(",");

export function PositionLab() {
  const [order, setOrder] = useState<0 | 1>(0);
  const [withPos, setWithPos] = useState(false);
  const [p, setP] = useState(3);
  const toks = order === 0 ? TIME_A : TIME_B;
  const inputs = (ts: string[]) => ts.map((t, i) => (withPos ? add4(TOK_VEC[t], pe(i)) : TOK_VEC[t]));
  const mine = inputs(toks);
  // compare the two sentences as unordered bags of input vectors
  const bagA = inputs(TIME_A).map(key).sort().join("|");
  const bagB = inputs(TIME_B).map(key).sort().join("|");
  const same = bagA === bagB;
  const tenA = inputs(TIME_A)[TIME_A.indexOf("10")];
  const tenB = inputs(TIME_B)[TIME_B.indexOf("10")];

  return (
    <div>
      <div className="lab-actions" style={{ marginTop: 0 }}>
        <div className="seg" role="group" aria-label="문장 고르기">
          <button aria-pressed={order === 0} onClick={() => setOrder(0)}>
            10시 11분
          </button>
          <button aria-pressed={order === 1} onClick={() => setOrder(1)}>
            11시 10분
          </button>
        </div>
        <button className={`btn${withPos ? "" : " ghost"}`} aria-pressed={withPos} onClick={() => setWithPos((v) => !v)}>
          위치 정보 더하기: {withPos ? "켬" : "끔"}
        </button>
      </div>

      <div className="p3-pos-table" role="table" aria-label="조각마다 모델에 들어가는 벡터">
        {toks.map((t, i) => (
          <div className="p3-pos-row" role="row" key={i}>
            <span className="p3-pos-tok" role="rowheader">
              <span className="p3-sub">{i}번</span> <b>{show(t)}</b>
            </span>
            {mine[i].map((x, k) => (
              <span key={k} role="cell" className={`p3-pos-cell num${t === "10" ? " hot" : ""}`}>
                {fmt(x)}
              </span>
            ))}
          </div>
        ))}
      </div>

      <p className="lab-tip">
        {same
          ? "두 문장의 벡터 묶음이 순서만 다르고 똑같아요. 모델 눈엔 '10'이 어디 있든 같은 '10'이라 순서를 알 수 없어요. 위치 정보를 켜 보세요."
          : `'10'의 벡터가 0번 자리에선 [${tenA.map(fmt).join(", ")}], 3번 자리에선 [${tenB.map(fmt).join(", ")}]. 자리가 벡터에 담겨서 순서를 구별할 수 있어요.`}
      </p>

      <div className="p3-sub" style={{ marginTop: 16 }}>
        위치 무늬 들여다보기 (빠른 바늘 1, 느린 바늘 1/{1 / SPEEDS[1]}씩 돌아요)
      </div>
      <div className="lab-row">
        <span>자리</span>
        <input type="range" min={0} max={15} step={1} value={p} aria-label="자리 번호" onChange={(e) => setP(Number(e.target.value))} />
        <span className="val">{p}</span>
      </div>
      <div className="p3-pos-viz">
        <svg viewBox="0 0 200 96" className="p3-dials" role="img" aria-label={`자리 ${p}의 두 바늘`}>
          {[0, 1].map((h) => {
            const cx = 50 + h * 100;
            const a = p * SPEEDS[h];
            return (
              <g key={h}>
                <circle cx={cx} cy={46} r={34} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
                <line x1={cx} y1={46} x2={cx + Math.sin(a) * 28} y2={46 - Math.cos(a) * 28} stroke={h ? "var(--hl-sky)" : "var(--hl-orange)"} strokeWidth={5} strokeLinecap="round" />
                <circle cx={cx} cy={46} r={3} fill="var(--ink)" />
                <text x={cx} y={94} textAnchor="middle" fontSize={10} fill="var(--ink-2)">
                  {h ? "느린 바늘" : "빠른 바늘"}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="bars" style={{ flex: "1 1 180px", minWidth: 0 }}>
          {pe(p).map((v, k) => (
            <div className="bar-row" key={k}>
              <span className="label">{WAVE_NAMES[k]}</span>
              <span className="track p3-center-track">
                <span className="fill" style={{ display: "block", marginLeft: v < 0 ? `${50 + v * 50}%` : "50%", width: `${Math.abs(v) * 50}%`, background: k < 2 ? "var(--hl-orange)" : "var(--hl-sky)" }} />
              </span>
              <span className="val num">{fmt(v)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="lab-sum">바늘 끝의 가로·세로 위치가 곧 sin, cos 값이에요. 조각 벡터는 설명용 예시이고, 진짜 트랜스포머는 훨씬 많은 빠르기를 써요. GPT-2·3은 이 무늬도 학습으로 정해요.</p>
    </div>
  );
}
