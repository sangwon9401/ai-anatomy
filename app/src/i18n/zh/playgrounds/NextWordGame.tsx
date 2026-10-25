import { useState } from "react";
import { GAME_ROUNDS } from "../../../data/ch01";

const COLORS = ["yellow", "mint", "sky", "violet"];
const fmt = (p: number) => (p < 0.01 ? "不到 1%" : `${Math.round(p * 100)}%`);

export function NextWordGame() {
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);
  const finished = round >= GAME_ROUNDS.length;

  if (finished) {
    return (
      <div className="game-result">
        <p>
          {GAME_ROUNDS.length} 道题里，有 <b>{matches} 道</b>你和模型选得一样。比猜没猜中更重要的是：模型也不是只知道一个正确答案，而是给每个候选词都打上了概率。
        </p>
        <button
          className="btn ghost"
          onClick={() => {
            setRound(0);
            setChoice(null);
            setMatches(0);
          }}
        >
          从头再来
        </button>
      </div>
    );
  }

  const r = GAME_ROUNDS[round];
  const best = r.options.reduce((bi, o, i, a) => (o.p > a[bi].p ? i : bi), 0);
  const revealed = choice !== null;
  const sorted = r.options.map((o, i) => ({ ...o, i })).sort((a, b) => b.p - a.p);

  return (
    <div>
      <div className="game-sentence">
        <span>{r.sentence}</span>
        <span className="game-blank">{revealed ? r.options[choice].w : "?"}</span>
        <span className="muted num" style={{ fontSize: 14, marginLeft: "auto" }}>
          {round + 1} / {GAME_ROUNDS.length}
        </span>
      </div>
      <div className="game-options">
        {r.options.map((o, i) => (
          <button
            key={o.w}
            className="game-option"
            aria-pressed={choice === i}
            disabled={revealed}
            onClick={() => {
              setChoice(i);
              if (i === best) setMatches((m) => m + 1);
            }}
          >
            {o.w}
          </button>
        ))}
      </div>
      {revealed && (
        <div style={{ marginTop: 16 }}>
          <div className="bars">
            {sorted.map((o) => (
              <div className="bar-row" key={o.w}>
                <span className="label">
                  {o.w}
                  {o.i === choice ? "（我的选择）" : ""}
                </span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${Math.max(o.p * 100, 1)}%`, background: `var(--hl-${COLORS[o.i]})` }} />
                </span>
                <span className="val">{fmt(o.p)}</span>
              </div>
            ))}
          </div>
          <div className="game-result">
            <p className="muted" style={{ fontSize: 14 }}>
              {choice === best ? "模型也认为这个词最有可能。" : `模型认为“${r.options[best].w}”最有可能。`}概率是示意数据。
            </p>
            <button
              className="btn"
              onClick={() => {
                setRound((x) => x + 1);
                setChoice(null);
              }}
            >
              {round === GAME_ROUNDS.length - 1 ? "看结果" : "下一题"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
