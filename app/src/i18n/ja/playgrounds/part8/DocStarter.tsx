import { useState } from "react";
import { FRAMES, PROBES } from "../../../../data/ch72";
import "../../../../playgrounds/part8/style.css";

const TIPS: Record<string, string> = {
  plain: "質問だけがぽつんとあると、「質問集」のような文章に見えます。だから、また質問が続きやすいのです。",
  exam: "テスト用紙では、第1問の次に第2問が来ますね。答えはテスト用紙に書いてありません。",
  qa: "「答え：」の場所が空いているので、その次のかけらとしては答えが来るのがいちばんそれらしいのです。",
  script: "台本で生徒が質問したら、次の行は先生の答えですね。文章の形が答えを引き出しました。",
};

export function DocStarter() {
  const [probe, setProbe] = useState(0);
  const [frame, setFrame] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const p = PROBES[probe];
  const f = FRAMES.find((x) => x.key === frame);
  const out = frame ? p.out[frame] : null;
  const answerKeys = FRAMES.filter((x) => p.out[x.key].isAnswer).map((x) => x.key);
  const done = answerKeys.every((k) => found.includes(k));

  const pick = (key: string) => {
    setFrame(key);
    if (p.out[key].isAnswer && !found.includes(key)) setFound([...found, key]);
  };

  return (
    <div>
      <div className="p8-seg" role="group" aria-label="質問を選ぶ">
        {PROBES.map((x, i) => (
          <button
            key={x.q}
            aria-pressed={probe === i}
            onClick={() => {
              setProbe(i);
              setFrame(null);
            }}
          >
            {x.q}
          </button>
        ))}
      </div>

      <p className="p8-label">文章をどんな形で始めましょうか？</p>
      <div className="p8-grid2" role="group" aria-label="文章の書き出し">
        {FRAMES.map((x) => (
          <button key={x.key} className="p8-opt" aria-pressed={frame === x.key} onClick={() => pick(x.key)}>
            {x.name}
            {found.includes(x.key) && <span className="p8-sub">答えが出ました ○</span>}
          </button>
        ))}
      </div>

      {f && out ? (
        <>
          <div className="p8-doc" aria-live="polite">
            {f.before}
            {p.q}
            {f.after}
            <span key={`${probe}-${frame}`} className="p8-cont">
              {out.text}
            </span>
          </div>
          <p className="p8-doc-cap">緑色が、ベースモデルが続けて書いた部分です。</p>
          <div className="p8-meter">
            <span className="p8-name">次のかけらに答えが来る確率</span>
            <span className="p8-track">
              <span className="p8-fill" style={{ width: `${out.answer * 100}%`, background: out.isAnswer ? "var(--hl-mint)" : "var(--ink-3)" }} />
            </span>
            <span className="p8-val">{Math.round(out.answer * 100)}%</span>
          </div>
          <p className="lab-tip">{done ? `答えが出る書き出しを2つとも見つけました！ モデルはそのままなのに、文章の形を変えるだけで答えを引き出せました。${TIPS[f.key]}` : TIPS[f.key]}</p>
        </>
      ) : (
        <p className="lab-tip">上から、文章の書き出しを1つ選んでみましょう。</p>
      )}
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={answerKeys.filter((k) => found.includes(k)).length >= 1}>{answerKeys.filter((k) => found.includes(k)).length >= 1 ? "○" : "□"} 答えが出る書き出しを1つ見つける</li>
        <li data-done={done}>{done ? "○" : "□"} 答えが出る書き出しを2つとも見つける</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        続きの文章と確率は、ベースモデルがよく見せるふるまいをまねた説明用の例です。
      </p>
    </div>
  );
}
