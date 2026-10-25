import { useState } from "react";
import { FFN_WORDS, NEURON_NAMES, ffn } from "../../data/ch55";
import "./style.css";
import { fmt } from "./util";
import { Vec } from "./Vec";

/** 55장: one word through the toy 4 → 16 → 4 feed-forward layer. */
export function FfnLab() {
  const [wi, setWi] = useState(2);
  const [bend, setBend] = useState(true);
  const [pick, setPick] = useState<number | null>(null);
  const [tried, setTried] = useState<number[]>([2]);
  const [foundTop, setFoundTop] = useState(false);
  const [unbent, setUnbent] = useState(false);

  const word = FFN_WORDS[wi];
  const run = ffn(word.x, bend);
  const maxAbs = Math.max(...run.h.map(Math.abs), 1e-9);
  const top = run.h.indexOf(Math.max(...run.h));

  const choose = (i: number) => {
    setWi(i);
    setPick(null);
    if (!tried.includes(i)) setTried([...tried, i]);
  };
  const tapNeuron = (j: number) => {
    setPick(j);
    if (wi === 2 && bend && j === top) setFoundTop(true);
  };

  let tip = "가장 밝은 뉴런을 눌러 보세요. 무엇에 반응하는 뉴런일까요?";
  if (!bend) tip = "꺾지 않으면 음수(분홍)도 그대로 지나가요. 그러면 기계 전체가 직선 같은 함수 하나와 같아져서, 넓힌 보람이 없어요(17장).";
  else if (pick !== null && NEURON_NAMES[pick]) tip = `이 뉴런은 '${NEURON_NAMES[pick]}'에 반응해요. (설명용 이름표)`;
  else if (pick !== null) tip = "이름을 붙이기 어려운 뉴런이에요. 진짜 모델에도 이런 뉴런이 아주 많아요.";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="단어 고르기">
        {FFN_WORDS.map((w, i) => (
          <button key={w.w} aria-pressed={i === wi} onClick={() => choose(i)}>
            {w.w}
          </button>
        ))}
      </div>

      <p className="p6-label">들어온 벡터 (어텐션을 지난 뒤)</p>
      <Vec v={word.x} label="들어온 벡터" />

      <p className="p6-label">넓은 층: 뉴런 16개 (4배) · 눌러 보세요</p>
      <div className="p6-neurons" role="group" aria-label="뉴런 16개">
        {run.h.map((h, j) => {
          const a = Math.min(1, Math.abs(h) / maxAbs);
          const c = h >= 0 ? "var(--hl-yellow)" : "var(--hl-pink)";
          return (
            <button
              key={j}
              aria-pressed={pick === j}
              aria-label={`뉴런 ${j + 1}, 값 ${fmt(h, 2)}`}
              style={{ background: `color-mix(in srgb, ${c} ${Math.round(a * 100)}%, var(--paper))`, color: a > 0.45 ? "var(--chip-ink)" : "var(--ink)" }}
              onClick={() => tapNeuron(j)}
            >
              {fmt(h)}
            </button>
          );
        })}
      </div>

      <div className="lab-actions">
        <button
          className="btn ghost"
          aria-pressed={!bend}
          onClick={() => {
            setBend(!bend);
            if (bend) setUnbent(true);
          }}
        >
          {bend ? "GELU 꺾기 끄기" : "GELU 꺾기 다시 켜기"}
        </button>
      </div>

      <p className="p6-label">생각한 것 (4개로 다시 줄임)</p>
      <Vec v={run.y} label="생각한 것" />
      <p className="p6-label">원래 벡터 + 생각한 것 = 새 벡터</p>
      <Vec v={run.out} label="새 벡터" />
      <p className="p6-note">숫자와 뉴런 이름은 모두 설명용 예시예요. GPT-3는 12,288개 → 49,152개 → 12,288개예요.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={tried.length === 3}>{tried.length === 3 ? "✓" : "○"} 세 단어를 모두 넣어 보기</li>
        <li data-done={foundTop}>{foundTop ? "✓" : "○"} '학교에'에서 가장 밝은 뉴런 누르기</li>
        <li data-done={unbent}>{unbent ? "✓" : "○"} GELU 꺾기를 꺼 보기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
