// ja overlay of src/playgrounds/part5/HeadDetective.tsx (strings only)
import { useState } from "react";
import { HEADS52 } from "../../../../data/ch52";
import { WORDS } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

// the order the mystery heads come in
const ROUNDS = [2, 0, 1];
// what each answer means, in the same order as HEADS52
const ROLE = ["だれが？ (する人を探す)", "いつ？ (時を探す)", "どこへ？ (場所を探す)"];
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

/** ch52: read a (made-up) head's attention map and guess what it looks for. */
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
          {ROUNDS.length}問中<b>{score}</b>問正解でした。
        </p>
        <p className="lab-tip">「行く」の行(いちばん下)でいちばんこいマスを見ると、ヘッドが探しているものがわかります。本物のGPTのヘッドも、こうして地図を読んで研究します(第53章)。</p>
        <div className="lab-actions">
          <button className="btn" onClick={restart}>
            もう一度
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 15 }}>
        なぞのヘッド {round + 1} / {ROUNDS.length}
        <span className="p5-ex">説明用の例</span>
      </p>
      <HeatMap map={h.map} color={picked === null ? "var(--ink-3)" : `var(--hl-${h.c})`} label={`なぞのヘッド${round + 1}のアテンションの地図`} />
      <p className="p5-note">行 ＝ 見つめる語、列 ＝ 見つめられる語。数は%です。灰色のマスは目かくし(第51章)。</p>
      <div className="p5-quiz" role="group" aria-label="このヘッドが探しているもの">
        {HEADS52.map((c, k) => (
          <button key={c.ask} onClick={() => choose(k)} data-state={picked === null ? undefined : c.ask === h.ask ? "right" : picked === k ? "wrong" : undefined} disabled={picked !== null}>
            {ROLE[k]}
          </button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className="lab-tip">
            {correct ? "正解！" : "おしい！"} いちばん下の「行く」の行で、「{WORDS[h.target]}」のマスが{h.map[3][h.target]}%でいちばんこいです。このヘッドは「{h.ask}」を探しています。
          </p>
          <div className="lab-actions">
            <button className="btn" onClick={next}>
              {round + 1 < ROUNDS.length ? "次のヘッド" : "結果を見る"}
            </button>
          </div>
        </>
      )}
      {picked === null && <p className="lab-tip">地図のいちばん下の行(「行く」)で、いちばんこいマスを探してみましょう。</p>}
    </div>
  );
}
