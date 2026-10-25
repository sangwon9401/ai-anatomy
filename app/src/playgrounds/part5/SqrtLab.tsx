import { useState } from "react";
import { FOCUS, PAINT, SCORE, WORDS, fmt, pct, randomScores, softmax } from "../../data/part5-toy";
import "./style.css";

const DIMS = [2, 8, 32, 128, 512];

/** 48장: how big dot products get as vectors get longer, and what dividing by √d does. */
export function SqrtLab() {
  const [d, setD] = useState(2);
  const [seed, setSeed] = useState(1);
  const [divide, setDivide] = useState(true);
  const [seen, setSeen] = useState({ peak: false, fixed: false });

  // d = 2 is the chapter's own example; longer vectors are drawn at random (+1 or −1 in every entry)
  const scores = d === 2 ? SCORE[FOCUS] : randomScores(d, seed);
  const root = Math.sqrt(d);
  const used = divide ? scores.map((s) => s / root) : scores;
  const p = softmax(used);
  const shown = pct(p);
  const top = Math.max(...p);
  const topWord = WORDS[p.indexOf(top)];

  if (d >= 128 && !divide && top > 0.9 && !seen.peak) setSeen((s) => ({ ...s, peak: true }));
  if (d >= 128 && divide && seen.peak && !seen.fixed) setSeen((s) => ({ ...s, fixed: true }));

  let tip = "d를 128로 올리고 '√d로 나누기'를 꺼 보세요.";
  if (d >= 32 && !divide) tip = top > 0.9 ? `'${topWord}'가 ${(top * 100).toFixed(1)}%를 가져갔어요. 거의 한 단어만 보죠. 이제 나누기를 켜 보세요.` : "'다시 뽑기'를 몇 번 눌러 보세요. 한 단어로 몰리는 경우가 많아요.";
  if (d >= 32 && divide) tip = `√${d} ≈ ${root.toFixed(1)}로 나누니 점수가 작아져서 비율이 고르게 나뉘었어요.`;
  if (d === 2) tip = divide ? "우리 예시예요(48장). 나누기를 끄면 14장과 같은 65.7%가 나와요." : "나누지 않으면 14장과 똑같아요. 칸이 2개뿐이라 차이가 작아요. d를 올려 보세요.";

  return (
    <div>
      <div className="p5-seg" role="group" aria-label="벡터의 칸 수 d">
        {DIMS.map((v) => (
          <button key={v} aria-pressed={d === v} onClick={() => setD(v)}>
            d = {v}
          </button>
        ))}
      </div>
      <label className="p5-toggle">
        <input type="checkbox" checked={divide} onChange={(e) => setDivide(e.target.checked)} />
        √d로 나누기 {divide && <span className="p5-vec muted">(÷ {root.toFixed(2)})</span>}
      </label>

      <div className="lab-out">
        <div className="p5-vec" style={{ fontSize: 14, color: "var(--ink-2)" }}>
          점수 (Q · K): {scores.map((s) => fmt(s)).join(", ")}
          {divide && <> → {used.map((s) => fmt(s)).join(", ")}</>}
          {d === 2 ? <span className="p5-ex">우리 예시</span> : <span className="p5-ex">설명용: 무작위 벡터</span>}
        </div>
        <div className="bars">
          {WORDS.map((w, i) => (
            <div className="bar-row" key={w}>
              <span className="label">{w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${p[i] * 100}%`, background: `var(--hl-${PAINT[i]})` }} />
              </span>
              <span className="val">{shown[i].toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setSeed((s) => s + 1)} disabled={d === 2}>
          다시 뽑기
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.peak}>{seen.peak ? "○" : "□"} d ≥ 128, 나누기 끄고 한 단어가 90% 넘게 가져가는 것 보기</li>
        <li data-done={seen.fixed}>{seen.fixed ? "○" : "□"} 그 상태에서 나누기를 켜서 고르게 만들기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
