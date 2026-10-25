import { useState } from "react";
import { PAIRS, TOKENIZERS, type TokenizerKey } from "../../data/part3-tokens";
import { TokenChips } from "./TokenChips";
import "./style.css";

type Guess = "ko" | "en" | "same";
const GUESSES: { g: Guess; label: string }[] = [
  { g: "ko", label: "한국어가 많다" },
  { g: "en", label: "영어가 많다" },
  { g: "same", label: "똑같다" },
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
      <div className="ctx-presets p3-presets" role="group" aria-label="문장 고르기">
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
            {i === PAIRS.length - 1 ? "긴 글 (세 문장)" : q.ko}
          </button>
        ))}
      </div>

      <div className="p3-duel-text">
        <p>
          <span className="chip hl-pink">한국어</span> {p.ko}
        </p>
        <p>
          <span className="chip hl-sky">영어</span> {p.en}
        </p>
      </div>

      {guess === null ? (
        <div className="p3-guess">
          <p className="lab-sum">GPT-4o 토크나이저로 자르면 어느 쪽 토큰이 더 많을까요?</p>
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
            {guess === truth ? "맞혔어요! " : "아쉬워요. "}
            GPT-4o에선 한국어 {ko}개, 영어 {en}개{ko > en ? ` (약 ${(ko / en).toFixed(1)}배)` : ko === en ? ", 똑같아요" : ""}. 옛 토크나이저는 어땠을까요?
          </p>

          <div className="p3-duel-bars" role="table" aria-label="토크나이저별 토큰 수">
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

          <div className="seg p3-seg" role="group" aria-label="토크나이저 고르기">
            {TOKENIZERS.map((t) => (
              <button key={t.key} aria-pressed={t.key === tk} onClick={() => setTk(t.key)}>
                {t.model}
              </button>
            ))}
          </div>
          <div className="p3-duel-chips">
            <div className="p3-sub">
              {model} · 한국어 {p[tk].ko.length}조각
            </div>
            <TokenChips toks={p[tk].ko} />
            <div className="p3-sub" style={{ marginTop: 10 }}>
              {model} · 영어 {p[tk].en.length}조각
            </div>
            <TokenChips toks={p[tk].en} />
          </div>
        </>
      )}
      <p className="lab-sum">
        실제 토크나이저(GPT-3 r50k_base, GPT-4 cl100k_base, GPT-4o o200k_base)로 미리 센 결과예요. ×숫자 = 한국어 토큰이 영어의 몇 배인지. 점선 조각은 글자 하나의 바이트 일부예요.
      </p>
    </div>
  );
}
