import { useState } from "react";
import { GAME_ROUNDS } from "../data/ch01";

const COLORS = ["yellow", "mint", "sky", "violet"];
const fmt = (p: number) => (p < 0.01 ? "1% 미만" : `${Math.round(p * 100)}%`);

export function NextWordGame() {
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);
  const finished = round >= GAME_ROUNDS.length;

  if (finished) {
    return (
      <div className="game-result">
        <p>
          {GAME_ROUNDS.length}문제 중 <b>{matches}개</b>를 모델과 똑같이 골랐어요. 맞히고 못 맞히고보다 중요한 건, 모델도 정답 하나를 아는 게 아니라 후보마다 확률을 매긴다는 점이에요.
        </p>
        <button
          className="btn ghost"
          onClick={() => {
            setRound(0);
            setChoice(null);
            setMatches(0);
          }}
        >
          처음부터 다시
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
                  {o.i === choice ? " (내 선택)" : ""}
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
              {choice === best ? "모델도 이 말을 가장 높게 봤어요." : `모델은 '${r.options[best].w}'를 가장 높게 봤어요.`} 확률은 설명용 예시예요.
            </p>
            <button
              className="btn"
              onClick={() => {
                setRound((x) => x + 1);
                setChoice(null);
              }}
            >
              {round === GAME_ROUNDS.length - 1 ? "결과 보기" : "다음 문제"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
