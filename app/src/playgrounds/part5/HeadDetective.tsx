import { useState } from "react";
import { HEADS52 } from "../../data/ch52";
import { WORDS } from "../../data/part5-toy";
import "./style.css";

// the order the mystery heads come in
const ROUNDS = [2, 0, 1];
// what each answer means, in the same order as HEADS52
const ROLE = ["누가? (하는 사람을 찾아요)", "언제? (때를 찾아요)", "어디로? (장소를 찾아요)"];
const CELL = 52;
const PAD = 70;

function HeatMap({ map, color, label }: { map: number[][]; color: string; label: string }) {
  const size = PAD + 4 * CELL;
  return (
    <svg className="p5-heat" viewBox={`0 0 ${size + 6} ${size + 6}`} role="img" aria-label={label}>
      {WORDS.map((w, j) => (
        <text key={`c${w}`} x={PAD + j * CELL + CELL / 2} y={PAD - 12} fontSize={13} textAnchor="middle" fill="var(--ink-2)">
          {w}
        </text>
      ))}
      {WORDS.map((w, i) => (
        <text key={`r${w}`} x={PAD - 8} y={PAD + i * CELL + CELL / 2 + 5} fontSize={13} textAnchor="end" fill="var(--ink-2)">
          {w}
        </text>
      ))}
      {map.map((row, i) =>
        row.map((v, j) => (
          <g key={`${i}${j}`}>
            <rect
              x={PAD + j * CELL + 2}
              y={PAD + i * CELL + 2}
              width={CELL - 4}
              height={CELL - 4}
              rx={6}
              style={{ fill: j > i ? "var(--line)" : `color-mix(in srgb, ${color} ${v}%, var(--paper-2))` }}
            />
            {j <= i && (
              <text x={PAD + j * CELL + CELL / 2} y={PAD + i * CELL + CELL / 2 + 5} fontSize={12} textAnchor="middle" fill={v >= 45 ? "var(--chip-ink)" : "var(--ink)"}>
                {v}
              </text>
            )}
          </g>
        )),
      )}
    </svg>
  );
}

/** 52장: read a (made-up) head's attention map and guess what it looks for. */
export function HeadDetective() {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const finished = round >= ROUNDS.length;
  const h = HEADS52[ROUNDS[Math.min(round, ROUNDS.length - 1)]];
  const correct = picked !== null && HEADS52[picked].ask === h.ask;

  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    if (HEADS52[k].ask === h.ask) setScore((s) => s + 1);
  };
  const next = () => {
    setPicked(null);
    setRound((r) => r + 1);
  };
  const restart = () => {
    setPicked(null);
    setRound(0);
    setScore(0);
  };

  if (finished)
    return (
      <div>
        <p style={{ margin: 0, fontSize: 17 }}>
          {ROUNDS.length}문제 중 <b>{score}</b>개를 맞혔어요.
        </p>
        <p className="lab-tip">'간다' 줄(맨 아래)에서 가장 진한 칸을 보면 헤드가 찾는 것이 보여요. 실제 GPT의 헤드도 이렇게 지도를 읽어서 연구해요(53장).</p>
        <div className="lab-actions">
          <button className="btn" onClick={restart}>
            다시 하기
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 15 }}>
        수수께끼 헤드 {round + 1} / {ROUNDS.length}
        <span className="p5-ex">설명용 예시</span>
      </p>
      <HeatMap map={h.map} color={picked === null ? "var(--ink-3)" : `var(--hl-${h.c})`} label={`수수께끼 헤드 ${round + 1}의 어텐션 지도`} />
      <p className="p5-note">줄 = 쳐다보는 단어, 칸 = 쳐다보이는 단어. 숫자는 %예요. 회색 칸은 가림막(51장).</p>
      <div className="p5-quiz" role="group" aria-label="이 헤드가 찾는 것">
        {HEADS52.map((c, k) => (
          <button key={c.ask} onClick={() => choose(k)} data-state={picked === null ? undefined : c.ask === h.ask ? "right" : picked === k ? "wrong" : undefined} disabled={picked !== null}>
            {ROLE[k]}
          </button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className="lab-tip">
            {correct ? "정답!" : "아쉬워요."} 맨 아래 '간다' 줄에서 '{WORDS[h.target]}' 칸이 {h.map[3][h.target]}%로 가장 진해요. 이 헤드는 '{h.ask}'를 찾아요.
          </p>
          <div className="lab-actions">
            <button className="btn" onClick={next}>
              {round + 1 < ROUNDS.length ? "다음 헤드" : "결과 보기"}
            </button>
          </div>
        </>
      )}
      {picked === null && <p className="lab-tip">지도의 맨 아래 줄('간다')에서 가장 진한 칸을 찾아보세요.</p>}
    </div>
  );
}
