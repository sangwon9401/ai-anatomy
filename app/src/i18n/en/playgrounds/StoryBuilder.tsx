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
        <div className="story-opts" role="group" aria-label="Candidates for the next piece">
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
            ? `The end token came out, so it stopped. The model ran ${runs} times. Try again with "Draw by probability" and you'll get a different story each time.`
            : forced
              ? "This toy model only knows short stories, so the end token is all that's left."
              : `So far the model has run ${runs} times. It's a toy model: it decides the next piece's probabilities by looking only at the piece just before.`}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {!done && (
            <button className="btn" onClick={sample}>
              Draw by probability
            </button>
          )}
          <button className="btn ghost" onClick={() => setPieces([STORY_START])}>
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
