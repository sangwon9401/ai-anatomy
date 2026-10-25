// zh overlay of src/playgrounds/part3/TokenDuel.tsx: strings, plus a note when Chinese has fewer tokens than English
import { useState } from "react";
import { PAIRS, TOKENIZERS, type TokenizerKey } from "../../../../data/part3-tokens";
import { TokenChips } from "./TokenChips";
import "../../../../playgrounds/part3/style.css";

type Guess = "ko" | "en" | "same";
const GUESSES: { g: Guess; label: string }[] = [
  { g: "ko", label: "中文多" },
  { g: "en", label: "英文多" },
  { g: "same", label: "一样多" },
];

export function TokenDuel() {
  const [k, setK] = useState(0);
  const [tk, setTk] = useState<TokenizerKey>("o200k_base");
  const [guess, setGuess] = useState<Guess | null>(null);
  const p = PAIRS[k];
  const ko = p.o200k_base.ko.length;
  const en = p.o200k_base.en.length;
  const truth: Guess = ko > en ? "ko" : ko < en ? "en" : "same";
  const max = Math.max(...TOKENIZERS.map((t) => p[t.key].ko.length));
  const model = TOKENIZERS.find((t) => t.key === tk)!.model;

  return (
    <div>
      <div className="ctx-presets p3-presets" role="group" aria-label="选择句子">
        {PAIRS.map((q, i) => (
          <button
            key={q.ko}
            aria-pressed={i === k}
            className={i === k ? "p3-on" : undefined}
            onClick={() => {
              setK(i);
              setGuess(null);
            }}
          >
            {i === PAIRS.length - 1 ? "长文字（三句话）" : q.ko}
          </button>
        ))}
      </div>

      <div className="p3-duel-text">
        <p>
          <span className="chip hl-pink">中文</span> {p.ko}
        </p>
        <p>
          <span className="chip hl-sky">英文</span> {p.en}
        </p>
      </div>

      {guess === null ? (
        <div className="p3-guess">
          <p className="lab-sum">用 GPT-4o 的分词器来切，哪边的词元更多？</p>
          <div className="lab-actions">
            {GUESSES.map((x) => (
              <button key={x.g} className="btn ghost" onClick={() => setGuess(x.g)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <p className="lab-tip">
            {guess === truth ? "猜对了！" : "差一点。"}
            GPT-4o 里中文 {ko} 个，英文 {en} 个{ko > en ? `（约 ${(ko / en).toFixed(1)} 倍）` : ko === en ? "，一样多" : "，中文更少"}。旧的分词器又是怎样的呢？
          </p>

          <div className="p3-duel-bars" role="table" aria-label="各分词器的词元数">
            {TOKENIZERS.map((t) => (
              <div className="p3-duel-row" role="row" key={t.key}>
                <span className="p3-duel-name" role="rowheader">
                  {t.model}
                </span>
                <span className="p3-duel-pair" role="cell">
                  <span className="p3-hbar hl-pink" style={{ width: `${(p[t.key].ko.length / max) * 100}%` }}>
                    {p[t.key].ko.length}
                  </span>
                  <span className="p3-hbar hl-sky" style={{ width: `${(p[t.key].en.length / max) * 100}%` }}>
                    {p[t.key].en.length}
                  </span>
                </span>
                <span className="p3-duel-ratio num" role="cell">
                  ×{(p[t.key].ko.length / p[t.key].en.length).toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          <div className="seg p3-seg" role="group" aria-label="选择分词器">
            {TOKENIZERS.map((t) => (
              <button key={t.key} aria-pressed={t.key === tk} onClick={() => setTk(t.key)}>
                {t.model}
              </button>
            ))}
          </div>
          <div className="p3-duel-chips">
            <div className="p3-sub">
              {model} · 中文 {p[tk].ko.length} 块
            </div>
            <TokenChips toks={p[tk].ko} />
            <div className="p3-sub" style={{ marginTop: 10 }}>
              {model} · 英文 {p[tk].en.length} 块
            </div>
            <TokenChips toks={p[tk].en} />
          </div>
        </>
      )}
      <p className="lab-sum">
        这是用真实的分词器（GPT-3 r50k_base、GPT-4 cl100k_base、GPT-4o o200k_base）预先数好的结果。×数字 = 中文词元是英文的几倍。虚线块是一个字的部分字节。
      </p>
    </div>
  );
}
