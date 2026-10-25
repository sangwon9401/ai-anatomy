import { useState } from "react";
import { LOGITS, OTHERS, REST_N, outputProbs } from "../../data/ch60";
import "./style.css";
import { fmt } from "./util";

const START = LOGITS.map((l) => l.s);

/** 60장: scores → probabilities over the whole vocabulary, then draw one. */
export function LogitLab() {
  const [scores, setScores] = useState(START);
  const [whole, setWhole] = useState(true);
  const [drawn, setDrawn] = useState<string | null>(null);
  const [draws, setDraws] = useState(0);
  const [seen, setSeen] = useState({ ninety: false, four: false });
  const out = outputProbs(scores, whole);

  const setScore = (i: number, v: number) => {
    const next = scores.map((x, j) => (j === i ? v : x));
    setScores(next);
    if (outputProbs(next, whole).p[0] > 0.9) setSeen((s) => ({ ...s, ninety: true }));
  };
  const draw = () => {
    let r = Math.random();
    let pick = OTHERS[Math.floor(Math.random() * OTHERS.length)];
    for (let i = 0; i < out.p.length; i++) {
      if (r < out.p[i]) {
        pick = LOGITS[i].w;
        break;
      }
      r -= out.p[i];
    }
    setDrawn(pick);
    setDraws((d) => d + 1);
  };

  let tip = "'간다' 점수를 올려서 확률을 90% 넘게 만들어 보세요.";
  if (!whole) tip = "후보가 4개뿐이면 나머지 5만여 개가 가져가던 몫이 사라져서, 같은 점수인데도 확률이 더 커져요.";
  else if (out.p[0] > 0.9) tip = "점수 차이가 커질수록 1등이 확률을 거의 다 가져가요. 소프트맥스는 큰 점수를 더 크게 키우니까요(14장).";
  else if (draws >= 10) tip = "여러 번 뽑으면 대부분 '간다'지만 가끔 다른 말도 나와요. 그래서 ChatGPT의 답이 매번 조금씩 달라요.";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="후보 수">
        <button aria-pressed={whole} onClick={() => setWhole(true)}>
          후보 50,257개 (진짜)
        </button>
        <button
          aria-pressed={!whole}
          onClick={() => {
            setWhole(false);
            setSeen((s) => ({ ...s, four: true }));
          }}
        >
          후보 4개만
        </button>
      </div>

      <div className="lab-rows" style={{ marginTop: 14 }}>
        {LOGITS.map((l, i) => (
          <div className="lab-row" key={l.w}>
            <span className={`chip hl-${l.c}`}>{l.w}</span>
            <input type="range" min={-4} max={9} step={0.1} value={scores[i]} aria-label={`${l.w} 점수`} onChange={(e) => setScore(i, Number(e.target.value))} />
            <span className="val">{fmt(scores[i])}</span>
          </div>
        ))}
        {whole && (
          <p className="p6-note" style={{ margin: 0 }}>
            나머지 {REST_N.toLocaleString()}개 토큰의 점수는 대부분 약 −9.1점으로 고정했어요.
          </p>
        )}
      </div>

      <div className="lab-out">
        <div className="bars">
          {LOGITS.map((l, i) => (
            <div className="bar-row" key={l.w}>
              <span className="label">{l.w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${out.p[i] * 100}%`, background: `var(--hl-${l.c})` }} />
              </span>
              <span className="val">{(out.p[i] * 100).toFixed(1)}%</span>
            </div>
          ))}
          {whole && (
            <div className="bar-row">
              <span className="label">나머지</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${out.restP * 100}%`, background: "var(--ink-3)" }} />
              </span>
              <span className="val">{(out.restP * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="lab-sum num">
          e<sup>점수</sup>의 합 {out.sum.toFixed(2)}
          {whole ? ` (나머지 몫 ${out.rest.toFixed(2)} 포함)` : ""} → 확률 합 100%
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={draw}>
          하나 뽑기
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setScores(START);
            setWhole(true);
            setDrawn(null);
          }}
        >
          처음 값으로
        </button>
      </div>
      <p className="p6-msg" aria-live="polite">
        나는 오늘 학교에 <span className="bad">{drawn ?? "___"}</span>
      </p>
      <p className="p6-note">뽑은 횟수 {draws}번 · 점수는 설명용 예시예요.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.ninety}>{seen.ninety ? "✓" : "○"} '간다'를 90% 넘게 만들기</li>
        <li data-done={seen.four}>{seen.four ? "✓" : "○"} 후보를 4개만으로 바꿔 보기</li>
        <li data-done={draws >= 10}>{draws >= 10 ? "✓" : "○"} 열 번 뽑아 보기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
