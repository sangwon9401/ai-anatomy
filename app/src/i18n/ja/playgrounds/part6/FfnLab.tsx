import { useState } from "react";
import { FFN_WORDS, NEURON_NAMES, ffn } from "../../../../data/ch55";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

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

  let tip = "いちばん明るいニューロンを押してみましょう。何に反応するニューロンでしょう？";
  if (!bend) tip = "曲げないと、マイナス（ピンク）もそのまま通ります。すると機械全体が直線のような関数ひとつと同じになって、広げた意味がなくなります（第17章）。";
  else if (pick !== null && NEURON_NAMES[pick]) tip = `このニューロンは「${NEURON_NAMES[pick]}」に反応します。（説明用の名札）`;
  else if (pick !== null) tip = "名前をつけにくいニューロンです。本物のモデルにも、こういうニューロンがとてもたくさんあります。";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="単語を選ぶ">
        {FFN_WORDS.map((w, i) => (
          <button key={w.w} aria-pressed={i === wi} onClick={() => choose(i)}>
            {w.w}
          </button>
        ))}
      </div>

      <p className="p6-label">入ってきたベクトル（アテンションを通ったあと）</p>
      <Vec v={word.x} label="入ってきたベクトル" />

      <p className="p6-label">広い層：ニューロン16個（4倍）・押してみよう</p>
      <div className="p6-neurons" role="group" aria-label="ニューロン16個">
        {run.h.map((h, j) => {
          const a = Math.min(1, Math.abs(h) / maxAbs);
          const c = h >= 0 ? "var(--hl-yellow)" : "var(--hl-pink)";
          return (
            <button
              key={j}
              aria-pressed={pick === j}
              aria-label={`ニューロン${j + 1}、値 ${fmt(h, 2)}`}
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
          {bend ? "GELUの曲げをオフ" : "GELUの曲げをまたオン"}
        </button>
      </div>

      <p className="p6-label">考えたこと（また4個に縮める）</p>
      <Vec v={run.y} label="考えたこと" />
      <p className="p6-label">元のベクトル + 考えたこと = 新しいベクトル</p>
      <Vec v={run.out} label="新しいベクトル" />
      <p className="p6-note">数もニューロンの名前も、すべて説明用の例です。GPT-3は12,288個 → 49,152個 → 12,288個です。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={tried.length === 3}>{tried.length === 3 ? "✓" : "○"} 3つの単語を全部入れてみる</li>
        <li data-done={foundTop}>{foundTop ? "✓" : "○"} 「学校に」でいちばん明るいニューロンを押す</li>
        <li data-done={unbent}>{unbent ? "✓" : "○"} GELUの曲げをオフにしてみる</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
