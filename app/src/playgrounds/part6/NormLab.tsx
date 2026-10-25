import { useState } from "react";
import { layerNorm, wordsAt } from "../../data/ch57";
import "./style.css";
import { fmt } from "./util";
import { Vec } from "./Vec";

const LIMIT = 20;

/** 57장: grow the word vectors layer by layer, then switch layer normalisation on. */
export function NormLab() {
  const [layer, setLayer] = useState(1);
  const [on, setOn] = useState(false);
  const [gain, setGain] = useState(1);
  const [seen, setSeen] = useState({ big: false, fixed: false, gain: false });

  const words = wordsAt(layer);
  const rows = words.map((w) => {
    const n = layerNorm(w.v, gain);
    const into = on ? n.out : w.v;
    return { ...w, ...n, into, max: Math.max(...into.map(Math.abs)) };
  });
  const worst = Math.max(...rows.map((r) => r.max));
  const shaky = worst > LIMIT;

  const mark = (next: Partial<typeof seen>) => setSeen((s) => ({ big: s.big || !!next.big, fixed: s.fixed || !!next.fixed, gain: s.gain || !!next.gain }));
  const setL = (v: number) => {
    setLayer(v);
    if (v === 96) mark({ big: !on, fixed: on });
  };
  const setNorm = (v: boolean) => {
    setOn(v);
    if (layer === 96) mark({ big: !v, fixed: v });
  };

  let tip = "먼저 정규화를 끈 채로 층 슬라이더를 96까지 올려 보세요.";
  if (!on && shaky) tip = "숫자가 너무 커졌어요! 단어마다 크기도 제각각이라 부품이 흔들려요. 레이어 정규화를 켜 보세요.";
  else if (!on) tip = "층이 깊어질수록 숫자가 점점 커지고 단어마다 크기가 달라져요.";
  else if (gain !== 1) tip = `배율 ${fmt(gain)}배: 정규화한 값에 배율을 곱했어요. 실제로는 이 값을 숫자마다 따로, 학습으로 정해요.`;
  else tip = "몇 층이든 단어마다 평균 0, 퍼진 정도 1로 맞춰졌어요. 배율도 바꿔 보세요.";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="레이어 정규화">
        <button aria-pressed={!on} onClick={() => setNorm(false)}>
          정규화 끄기
        </button>
        <button aria-pressed={on} onClick={() => setNorm(true)}>
          레이어 정규화 켜기
        </button>
      </div>
      <div className="lab-rows" style={{ marginTop: 14 }}>
        <div className="lab-row">
          <span>층</span>
          <input type="range" min={1} max={96} step={1} value={layer} aria-label="몇 번째 층" onChange={(e) => setL(Number(e.target.value))} />
          <span className="val">{layer}</span>
        </div>
        <div className="lab-row">
          <span>배율</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={gain}
            disabled={!on}
            aria-label="배율"
            onChange={(e) => {
              setGain(Number(e.target.value));
              mark({ gain: true });
            }}
          />
          <span className="val">{fmt(gain)}</span>
        </div>
      </div>

      <div className="p6-rows">
        {rows.map((r) => (
          <div className="p6-wrow" key={r.w}>
            <div className="p6-wrow-head">
              <span className="chip outline">{r.w}</span>
              <span className="muted">
                평균 {fmt(r.mean)} · 퍼진 정도 {fmt(r.sd)}
              </span>
            </div>
            <Vec v={r.v} label={`${r.w} 벡터`} />
            {on && (
              <>
                <p className="p6-label">↓ 부품에 들어가는 값</p>
                <Vec v={r.into} label={`${r.w} 정규화한 값`} />
              </>
            )}
            <div className="bars" style={{ marginTop: 6 }}>
              <div className="bar-row">
                <span className="label">크기</span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${Math.min(100, (r.max / 80) * 100)}%`, background: r.max > LIMIT ? "var(--pen)" : "var(--hl-mint)" }} />
                </span>
                <span className="val">{fmt(r.max)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="p6-note">'크기'는 부품에 들어가는 숫자 중 가장 큰 값(부호 무시)이에요. 숫자는 설명용 예시예요.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.big}>{seen.big ? "✓" : "○"} 정규화를 끄고 96층까지 올려 보기</li>
        <li data-done={seen.fixed}>{seen.fixed ? "✓" : "○"} 96층에서 레이어 정규화 켜기</li>
        <li data-done={seen.gain}>{seen.gain ? "✓" : "○"} 배율 바꿔 보기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
