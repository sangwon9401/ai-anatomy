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
        <div className="story-opts" role="group" aria-label="下一个片段的候选">
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
            ? `出现了结束词元，所以停下了。模型一共运行了 ${runs} 次。用“按概率抽”再来几次，每次都会编出不一样的故事。`
            : forced
              ? "这个玩具模型只会编短故事，现在只剩结束词元可选了。"
              : `到现在为止，模型运行了 ${runs} 次。这是个玩具模型：只看前一个片段，就决定下一个片段的概率。`}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {!done && (
            <button className="btn" onClick={sample}>
              按概率抽
            </button>
          )}
          <button className="btn ghost" onClick={() => setPieces([STORY_START])}>
            从头开始
          </button>
        </div>
      </div>
    </div>
  );
}
