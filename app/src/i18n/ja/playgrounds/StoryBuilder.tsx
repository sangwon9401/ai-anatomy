import { useState } from "react";
import { END, STORY, STORY_MAX, STORY_START } from "../../../data/ch02";

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
        <div className="story-opts" role="group" aria-label="次のかけらの候補">
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
            ? `終了トークンが出たので止まりました。モデルを${runs}回動かしました。「確率で選ぶ」でやり直すと、毎回ちがう物語ができます。`
            : forced
              ? "このおもちゃのモデルは短いお話しか知らないので、もう終了トークンしか残っていません。"
              : `ここまでモデルを${runs}回動かしました。次のかけらの確率を、すぐ前のかけらだけを見て決めるおもちゃのモデルです。`}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {!done && (
            <button className="btn" onClick={sample}>
              確率で選ぶ
            </button>
          )}
          <button className="btn ghost" onClick={() => setPieces([STORY_START])}>
            最初から
          </button>
        </div>
      </div>
    </div>
  );
}
