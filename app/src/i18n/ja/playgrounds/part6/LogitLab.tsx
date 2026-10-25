import { useState } from "react";
import { LOGITS, OTHERS, REST_N, outputProbs } from "../../../../data/ch60";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";

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

  let tip = "「行く」の点数を上げて、確率を90%より大きくしてみましょう。";
  if (!whole) tip = "候補が4個だけだと、その他の5万個あまりが持っていっていた分がなくなるので、同じ点数でも確率が大きくなります。";
  else if (out.p[0] > 0.9) tip = "点数の差が大きくなるほど、1位が確率をほとんど全部持っていきます。ソフトマックスは大きい点数をもっと大きくするからです（第14章）。";
  else if (draws >= 10) tip = "何回も選ぶと、ほとんどは「行く」ですが、ときどきほかの言葉も出ます。だからChatGPTの答えは毎回少しずつちがうのです。";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="候補の数">
        <button aria-pressed={whole} onClick={() => setWhole(true)}>
          候補50,257個（本物）
        </button>
        <button
          aria-pressed={!whole}
          onClick={() => {
            setWhole(false);
            setSeen((s) => ({ ...s, four: true }));
          }}
        >
          候補4個だけ
        </button>
      </div>

      <div className="lab-rows" style={{ marginTop: 14 }}>
        {LOGITS.map((l, i) => (
          <div className="lab-row" key={l.w}>
            <span className={`chip hl-${l.c}`}>{l.w}</span>
            <input type="range" min={-4} max={9} step={0.1} value={scores[i]} aria-label={`${l.w}の点数`} onChange={(e) => setScore(i, Number(e.target.value))} />
            <span className="val">{fmt(scores[i])}</span>
          </div>
        ))}
        {whole && (
          <p className="p6-note" style={{ margin: 0 }}>
            その他{REST_N.toLocaleString()}個のトークンの点数は、ほとんど約−9.1点に固定しました。
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
              <span className="label">その他</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${out.restP * 100}%`, background: "var(--ink-3)" }} />
              </span>
              <span className="val">{(out.restP * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="lab-sum num">
          e<sup>点数</sup>の合計 {out.sum.toFixed(2)}
          {whole ? `（その他の分 ${out.rest.toFixed(2)} をふくむ）` : ""} → 確率の合計 100%
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={draw}>
          1つ選ぶ
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setScores(START);
            setWhole(true);
            setDrawn(null);
          }}
        >
          最初の値に戻す
        </button>
      </div>
      <p className="p6-msg" aria-live="polite">
        私は 今日 学校に <span className="bad">{drawn ?? "___"}</span>
      </p>
      <p className="p6-note">選んだ回数 {draws}回 · 点数は説明用の例です。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.ninety}>{seen.ninety ? "✓" : "○"} 「行く」を90%より大きくする</li>
        <li data-done={seen.four}>{seen.four ? "✓" : "○"} 候補を4個だけに変えてみる</li>
        <li data-done={draws >= 10}>{draws >= 10 ? "✓" : "○"} 10回選んでみる</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
