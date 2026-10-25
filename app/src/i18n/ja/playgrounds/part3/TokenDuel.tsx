// ja overlay of src/playgrounds/part3/TokenDuel.tsx (strings only; the data's `ko` field holds the Japanese sentence)
import { useState } from "react";
import { PAIRS, TOKENIZERS, type TokenizerKey } from "../../../../data/part3-tokens";
import { TokenChips } from "../../../../playgrounds/part3/TokenChips";
import "../../../../playgrounds/part3/style.css";

type Guess = "ko" | "en" | "same";
const GUESSES: { g: Guess; label: string }[] = [
  { g: "ko", label: "日本語が多い" },
  { g: "en", label: "英語が多い" },
  { g: "same", label: "同じ" },
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
      <div className="ctx-presets p3-presets" role="group" aria-label="文をえらぶ">
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
            {i === PAIRS.length - 1 ? "長い文章 (3文)" : q.ko}
          </button>
        ))}
      </div>

      <div className="p3-duel-text">
        <p>
          <span className="chip hl-pink">日本語</span> {p.ko}
        </p>
        <p>
          <span className="chip hl-sky">英語</span> {p.en}
        </p>
      </div>

      {guess === null ? (
        <div className="p3-guess">
          <p className="lab-sum">GPT-4oのトークナイザーで切ると、どちらのトークンが多いでしょう？</p>
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
            {guess === truth ? "当たり！ " : "おしい！ "}
            GPT-4oでは日本語{ko}個、英語{en}個{ko > en ? ` (約${(ko / en).toFixed(1)}倍)` : ko === en ? "で同じです" : ""}。昔のトークナイザーはどうだったでしょう？
          </p>

          <div className="p3-duel-bars" role="table" aria-label="トークナイザーごとのトークン数">
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

          <div className="seg p3-seg" role="group" aria-label="トークナイザーをえらぶ">
            {TOKENIZERS.map((t) => (
              <button key={t.key} aria-pressed={t.key === tk} onClick={() => setTk(t.key)}>
                {t.model}
              </button>
            ))}
          </div>
          <div className="p3-duel-chips">
            <div className="p3-sub">
              {model} · 日本語 {p[tk].ko.length}かけら
            </div>
            <TokenChips toks={p[tk].ko} />
            <div className="p3-sub" style={{ marginTop: 10 }}>
              {model} · 英語 {p[tk].en.length}かけら
            </div>
            <TokenChips toks={p[tk].en} />
          </div>
        </>
      )}
      <p className="lab-sum">
        本物のトークナイザー(GPT-3 r50k_base、GPT-4 cl100k_base、GPT-4o o200k_base)で前もって数えた結果です。×数字＝日本語のトークンが英語の何倍か。点線のかけらは1文字のバイトの一部です。
      </p>
    </div>
  );
}
