import { useState } from "react";
import { GAME_ROUNDS } from "../../../data/ch01";

const COLORS = ["yellow", "mint", "sky", "violet"];
const fmt = (p: number) => (p < 0.01 ? "1%未満" : `${Math.round(p * 100)}%`);

export function NextWordGame() {
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);
  const finished = round >= GAME_ROUNDS.length;

  if (finished) {
    return (
      <div className="game-result">
        <p>
          {GAME_ROUNDS.length}問中<b>{matches}問</b>で、モデルと同じ言葉を選びました。当たったかどうかより大事なのは、モデルも正解を1つ知っているのではなく、候補ごとに確率をつけているということです。
        </p>
        <button
          className="btn ghost"
          onClick={() => {
            setRound(0);
            setChoice(null);
            setMatches(0);
          }}
        >
          最初からもう一度
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
                  {o.i === choice ? "（自分の選択）" : ""}
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
              {choice === best ? "モデルもこの言葉をいちばん高く見積もっていました。" : `モデルは「${r.options[best].w}」をいちばん高く見積もっていました。`} 確率は説明用の例です。
            </p>
            <button
              className="btn"
              onClick={() => {
                setRound((x) => x + 1);
                setChoice(null);
              }}
            >
              {round === GAME_ROUNDS.length - 1 ? "結果を見る" : "次の問題"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
