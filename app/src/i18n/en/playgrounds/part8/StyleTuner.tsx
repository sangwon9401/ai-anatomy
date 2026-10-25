import { useEffect, useRef, useState } from "react";
import { STYLES, TESTS } from "../../../../data/ch73";
import "../../../../playgrounds/part8/style.css";

const TRAIN_MS = 1400;

export function StyleTuner() {
  const [style, setStyle] = useState(STYLES[0].key);
  const [trained, setTrained] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [test, setTest] = useState(0);
  const [tried, setTried] = useState<string[]>([]);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const pack = STYLES.find((s) => s.key === style)!;
  const t = TESTS[test];
  const running = progress !== null;
  const trainedName = STYLES.find((s) => s.key === trained)?.name;

  const train = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / TRAIN_MS);
      setProgress(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setProgress(null);
        setTrained(style);
        setTried((x) => (x.includes(style) ? x : [...x, style]));
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <div>
      <p className="p8-label" style={{ marginTop: 0 }}>
        ① Pick a set of model answers
      </p>
      <div className="p8-seg" role="group" aria-label="Model answer style">
        {STYLES.map((s) => (
          <button key={s.key} aria-pressed={style === s.key} disabled={running} onClick={() => setStyle(s.key)}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="p8-cards">
        {pack.demos.map((d) => (
          <div className="p8-card" key={d.q}>
            <div className="p8-q">Question: {d.q}</div>
            <div className="p8-a">
              <span className="chip hl-violet" style={{ fontSize: 12, marginRight: 6 }}>
                Model answer
              </span>
              {d.a}
            </div>
          </div>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={train} disabled={running || trained === style}>
          {trained === style ? "Fine-tuned with this set" : "② Fine-tune with these answers"}
        </button>
        {trained && (
          <button
            className="btn ghost"
            disabled={running}
            onClick={() => {
              setTrained(null);
            }}
          >
            Undo fine-tuning
          </button>
        )}
      </div>
      {running && (
        <div className="p8-progress" role="progressbar" aria-valuenow={Math.round((progress ?? 0) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Fine-tuning progress">
          <span style={{ width: `${(progress ?? 0) * 100}%` }} />
        </div>
      )}

      <p className="p8-label">③ Ask a question it has never seen</p>
      <div className="p8-seg" role="group" aria-label="Test question">
        {TESTS.map((x, i) => (
          <button key={x.q} aria-pressed={test === i} onClick={() => setTest(i)}>
            {x.q}
          </button>
        ))}
      </div>
      <div className="p8-chat" aria-live="polite">
        <div className="p8-bubble user">
          <span className="p8-who">Me</span>
          {t.q}
        </div>
        <div className="p8-bubble" key={`${trained}-${test}`}>
          <span className="p8-who">{trained ? `Model fine-tuned on '${trainedName}'` : "Base model before fine-tuning (ch. 72)"}</span>
          {trained ? t.replies[trained] : t.base}
        </div>
      </div>

      <p className="lab-tip">
        {running
          ? "Lightly touching up the numbers by guessing the next pieces of the model answers…"
          : !trained
            ? "Before fine-tuning, it answers a question by writing similar questions. Pick a set of model answers and fine-tune."
            : tried.length < STYLES.length
              ? `The test question wasn't in the model answers, yet it answers in the '${trainedName}' style. Try another set too.`
              : "You tried all three sets! The model copies not just the content but the tone and length too. That's why it matters so much who writes the model answers, and how."}
      </p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={tried.length >= 1}>{tried.length >= 1 ? "○" : "□"} Fine-tune, then ask a new question</li>
        <li data-done={tried.length >= STYLES.length}>
          {tried.length >= STYLES.length ? "○" : "□"} Fine-tune with all three styles ({tried.length}/{STYLES.length})
        </li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        The replies are illustrative examples. Real SFT uses a huge number of questions and model answers like these.
      </p>
    </div>
  );
}
