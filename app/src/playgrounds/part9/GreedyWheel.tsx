import { useState } from "react";
import { PROMPT80, WHEEL } from "../../data/ch80";
import { generate, joinPieces, pickIndex } from "../../data/part9-toy";
import "./style.css";

const CX = 120;
const CY = 124;
const R = 100;
const P = WHEEL.map((c) => c.p);
const label = (w: string, c: string | null) => (c ? w : "기타");
const fill = (c: string | null) => (c ? `var(--hl-${c})` : "var(--paper-2)");

function starts() {
  let a = 0;
  return WHEEL.map((c) => {
    const s = a;
    a += c.p * 360;
    return s;
  });
}
const START = starts();
const pt = (r: number, deg: number) => [CX + r * Math.sin((deg * Math.PI) / 180), CY - r * Math.cos((deg * Math.PI) / 180)];

/** rotation that puts slice i under the pointer, ahead of `from` by `turns` full turns */
function landOn(i: number, from: number, turns: number, at: number) {
  const phi = START[i] + WHEEL[i].p * 360 * at;
  const target = (((-phi - from) % 360) + 360) % 360;
  return from + target + turns * 360;
}

type Line = { how: "그리디" | "샘플링"; text: string };

export function GreedyWheel() {
  const [rot, setRot] = useState(0);
  const [fast, setFast] = useState(false);
  const [last, setLast] = useState<number | null>(null);
  const [greedy, setGreedy] = useState<number[]>(() => WHEEL.map(() => 0));
  const [sample, setSample] = useState<number[]>(() => WHEEL.map(() => 0));
  const [lines, setLines] = useState<Line[]>([]);
  const [tip, setTip] = useState("먼저 '그리디로 고르기'를 몇 번 눌러 보세요.");

  const gTotal = greedy.reduce((a, b) => a + b, 0);
  const sTotal = sample.reduce((a, b) => a + b, 0);
  const sNotTop = sTotal - sample[0];
  const gLines = lines.filter((l) => l.how === "그리디");
  const sLines = lines.filter((l) => l.how === "샘플링");

  const pickGreedy = () => {
    setFast(true);
    setRot((r) => landOn(0, r, 0, 0.5));
    setLast(0);
    const next = greedy.map((n, i) => (i === 0 ? n + 1 : n));
    setGreedy(next);
    const total = next.reduce((a, b) => a + b, 0);
    setTip(total >= 3 ? `그리디로 ${total}번 골랐는데 전부 '간다'예요. 확률표가 같으면 1등도 늘 같아요.` : "또 눌러 보세요. 결과가 바뀔까요?");
  };
  const spin = (n: number) => {
    const next = [...sample];
    let i = 0;
    for (let k = 0; k < n; k++) {
      i = pickIndex(P, Math.random());
      next[i]++;
    }
    setFast(n > 1);
    setRot((r) => landOn(i, r, n > 1 ? 2 : 4, 0.15 + Math.random() * 0.7));
    setLast(i);
    setSample(next);
    const total = next.reduce((a, b) => a + b, 0);
    if (total >= 30) setTip(`${total}번 돌렸어요. '간다'가 가장 많지만 전부는 아니에요. 많이 돌릴수록 비율이 확률(52%, 21%…)에 가까워져요.`);
    else if (i !== 0) setTip(`이번엔 '${label(WHEEL[i].w, WHEEL[i].c)}'! 1등이 아니어도 칸이 있으면 뽑힐 수 있어요.`);
    else setTip("이번엔 '간다'. 몇 번 더 돌려 보세요.");
  };
  const write = (how: Line["how"]) => {
    const pieces = generate(how === "그리디" ? 0 : 1, Math.random);
    const text = joinPieces([...PROMPT80, ...pieces]);
    const nextLines = [{ how, text }, ...lines].slice(0, 6);
    setLines(nextLines);
    const g = nextLines.filter((l) => l.how === "그리디").length;
    const s = nextLines.filter((l) => l.how === "샘플링");
    if (how === "그리디") setTip(g >= 2 ? "그리디 문장은 매번 똑같고, '그리고 친구를 만났다'를 맴돌다 길이 제한에 걸려 잘려요(…)." : "이번엔 '샘플링으로 쓰기'도 눌러 보세요.");
    else setTip(new Set(s.map((l) => l.text)).size >= 2 ? "샘플링 문장은 누를 때마다 달라요. 같은 질문에 ChatGPT의 답이 조금씩 다른 이유예요." : "한 번 더 눌러 보세요. 같은 문장이 또 나올까요?");
  };
  const reset = () => {
    setGreedy(WHEEL.map(() => 0));
    setSample(WHEEL.map(() => 0));
    setLast(null);
    setLines([]);
    setTip("먼저 '그리디로 고르기'를 몇 번 눌러 보세요.");
  };

  const shown = last === null ? null : WHEEL[last];

  return (
    <div>
      <div className="p9-sent" aria-live="polite">
        {PROMPT80.map((w) => (
          <span key={w} className="chip outline">
            {w}
          </span>
        ))}
        {shown ? <span className={`chip ${shown.c ? `hl-${shown.c}` : "hl-none"}`}>{label(shown.w, shown.c)}</span> : <span className="p9-blank">?</span>}
      </div>

      <div className="p9-split" style={{ marginTop: 12 }}>
        <svg className={`p9-wheel${fast ? " fast" : ""}`} viewBox="0 0 240 240" role="img" aria-label="확률만큼 칸을 나눈 룰렛">
          <g className="spin" style={{ transform: `rotate(${rot}deg)` }}>
            {WHEEL.map((c, i) => {
              const a0 = START[i];
              const a1 = a0 + c.p * 360;
              const [x0, y0] = pt(R, a0);
              const [x1, y1] = pt(R, a1);
              const mid = a0 + c.p * 180;
              const [lx, ly] = pt(R * (c.p < 0.1 ? 0.78 : 0.6), mid);
              return (
                <g key={c.w}>
                  <path d={`M ${CX} ${CY} L ${x0} ${y0} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`} fill={fill(c.c)} stroke="var(--ink)" strokeWidth={1.5} />
                  {c.p >= 0.04 && (
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize={c.p < 0.1 ? 12 : 16} fontWeight={700} fill={c.c ? "var(--chip-ink)" : "var(--ink-2)"} transform={`rotate(${mid} ${lx} ${ly})`}>
                      {label(c.w, c.c)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
          <circle cx={CX} cy={CY} r={5} fill="var(--ink)" />
          <path d={`M ${CX - 9} 6 L ${CX + 9} 6 L ${CX} 30 Z`} fill="var(--pen)" />
        </svg>

        <div>
          <div className="p9-tally-head">
            <span>후보</span>
            <span>확률</span>
            <span>그리디</span>
            <span>룰렛</span>
          </div>
          <div className="bars" style={{ marginTop: 4 }}>
            {WHEEL.map((c, i) => (
              <div className="p9-tally-row" key={c.w} data-last={last === i}>
                <span className="label">{label(c.w, c.c)}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${c.p * 100}%`, background: c.c ? `var(--hl-${c.c})` : "var(--ink-3)" }} />
                </span>
                <span className="n">{greedy[i]}</span>
                <span className="n">{sample[i]}</span>
              </div>
            ))}
          </div>
          <p className="p9-note">확률은 설명용 예시예요 (1장과 같은 숫자).</p>
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={pickGreedy}>
          그리디로 고르기
        </button>
        <button className="btn" onClick={() => spin(1)}>
          룰렛 돌리기
        </button>
        <button className="btn ghost" onClick={() => spin(10)}>
          10번 돌리기
        </button>
      </div>

      <h4 className="p9-h">문장 끝까지 써 보기</h4>
      <div className="lab-actions" style={{ marginTop: 0 }}>
        <button className="btn ghost" onClick={() => write("그리디")}>
          그리디로 쓰기
        </button>
        <button className="btn ghost" onClick={() => write("샘플링")}>
          샘플링으로 쓰기
        </button>
        <button className="btn ghost" onClick={reset}>
          처음부터
        </button>
      </div>
      {lines.length > 0 && (
        <ul className="p9-history" aria-live="polite">
          {lines.map((l, i) => (
            <li key={i}>
              <span className="how">{l.how}</span>
              <span className="txt">{l.text}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="p9-note">문장은 바로 앞 말만 보고 다음 말을 정하는 장난감 모델이 써요. 길이는 10조각까지예요.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={gTotal >= 3}>{gTotal >= 3 ? "○" : "□"} 그리디로 세 번 고르기: 결과가 바뀌나요?</li>
        <li data-done={sNotTop > 0}>{sNotTop > 0 ? "○" : "□"} 룰렛으로 '간다'가 아닌 말 뽑기</li>
        <li data-done={gLines.length > 0 && sLines.length >= 2}>{gLines.length > 0 && sLines.length >= 2 ? "○" : "□"} 문장을 그리디로 한 번, 샘플링으로 두 번 써 보기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
