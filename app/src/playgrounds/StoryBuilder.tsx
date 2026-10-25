import { useState } from "react";
import { END, STORY, STORY_MAX, STORY_START } from "../data/ch02";

export function StoryBuilder() {
  const [pieces, setPieces] = useState<string[]>([STORY_START]);
  const last = pieces[pieces.length - 1];
  const done = last === END;
  const runs = pieces.length - 1;
  const forced = !done && runs >= STORY_MAX;
  const options = done ? [] : forced ? [{ w: END, p: 1 }] : STORY[last];

  const add = (w: string) => setPieces((p) => [...p, w]);
  const sample = () => {
    let r = Math.random();
    for (const o of options) {
      r -= o.p;
      if (r <= 0) return add(o.w);
    }
    add(options[options.length - 1].w);
  };

  return (
    <div>
      <div className="story" aria-live="polite">
        {pieces.map((w, i) => (
          <span key={i} className={`chip ${i === 0 ? "outline" : w === END ? "end" : "hl-mint"}`}>
            {w}
          </span>
        ))}
        {!done && <span className="hero-blank" style={{ fontSize: 18 }}>?</span>}
      </div>

      {!done && (
        <div className="story-opts" role="group" aria-label="다음 조각 후보">
          {options.map((o) => (
            <button key={o.w} className="story-opt" onClick={() => add(o.w)}>
              <span>{o.w}</span>
              <span className="track">
                <span className="fill" style={{ width: `${o.p * 100}%`, background: o.w === END ? "var(--ink-2)" : undefined }} />
              </span>
              <span className="val">{Math.round(o.p * 100)}%</span>
            </button>
          ))}
        </div>
      )}

      <div className="story-meta">
        <p>
          {done
            ? `끝 토큰이 나와서 멈췄어요. 모델을 ${runs}번 돌렸어요. '확률대로 뽑기'로 다시 해 보면 매번 다른 이야기가 나와요.`
            : forced
              ? "이 장난감 모델은 짧은 이야기만 알아서, 이제 끝 토큰만 남았어요."
              : `지금까지 모델을 ${runs}번 돌렸어요. 다음 조각의 확률은 바로 앞 조각만 보고 정하는 장난감 모델이에요.`}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {!done && (
            <button className="btn" onClick={sample}>
              확률대로 뽑기
            </button>
          )}
          <button className="btn ghost" onClick={() => setPieces([STORY_START])}>
            처음부터
          </button>
        </div>
      </div>
    </div>
  );
}
