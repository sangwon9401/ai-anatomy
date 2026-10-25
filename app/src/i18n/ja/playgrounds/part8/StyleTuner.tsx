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
        ① お手本の答えのセットを選ぶ
      </p>
      <div className="p8-seg" role="group" aria-label="お手本の答えの話し方">
        {STYLES.map((s) => (
          <button key={s.key} aria-pressed={style === s.key} disabled={running} onClick={() => setStyle(s.key)}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="p8-cards">
        {pack.demos.map((d) => (
          <div className="p8-card" key={d.q}>
            <div className="p8-q">質問：{d.q}</div>
            <div className="p8-a">
              <span className="chip hl-violet" style={{ fontSize: 12, marginRight: 6 }}>
                お手本の答え
              </span>
              {d.a}
            </div>
          </div>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={train} disabled={running || trained === style}>
          {trained === style ? "このセットでファインチューニング完了" : "② このお手本でファインチューニング"}
        </button>
        {trained && (
          <button
            className="btn ghost"
            disabled={running}
            onClick={() => {
              setTrained(null);
            }}
          >
            ファインチューニング前に戻す
          </button>
        )}
      </div>
      {running && (
        <div className="p8-progress" role="progressbar" aria-valuenow={Math.round((progress ?? 0) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="ファインチューニングの進み具合">
          <span style={{ width: `${(progress ?? 0) * 100}%` }} />
        </div>
      )}

      <p className="p8-label">③ はじめて見る質問を投げる</p>
      <div className="p8-seg" role="group" aria-label="テストの質問">
        {TESTS.map((x, i) => (
          <button key={x.q} aria-pressed={test === i} onClick={() => setTest(i)}>
            {x.q}
          </button>
        ))}
      </div>
      <div className="p8-chat" aria-live="polite">
        <div className="p8-bubble user">
          <span className="p8-who">私</span>
          {t.q}
        </div>
        <div className="p8-bubble" key={`${trained}-${test}`}>
          <span className="p8-who">{trained ? `「${trainedName}」のセットでファインチューニングしたモデル` : "ファインチューニング前のベースモデル（第72章）"}</span>
          {trained ? t.replies[trained] : t.base}
        </div>
      </div>

      <p className="lab-tip">
        {running
          ? "お手本の答えの次のかけらを当てながら、数を少しずつ整えています…"
          : !trained
            ? "ファインチューニングの前は、質問されても似た質問を書き続けます。お手本のセットを1つ選んで、ファインチューニングしてみましょう。"
            : tried.length < STYLES.length
              ? `テストの質問はお手本になかった質問なのに、「${trainedName}」の話し方で答えます。ほかのセットでも試してみましょう。`
              : "3つのセットを全部試しました！ モデルは答えの内容だけでなく、話し方や長さまでまねします。だから、お手本をだれがどう書くかがとても大切です。"}
      </p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={tried.length >= 1}>{tried.length >= 1 ? "○" : "□"} ファインチューニングして、はじめて見る質問を投げる</li>
        <li data-done={tried.length >= STYLES.length}>
          {tried.length >= STYLES.length ? "○" : "□"} 3つの話し方すべてでファインチューニングしてみる ({tried.length}/{STYLES.length})
        </li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        答えは説明用の例です。本物のSFTでは、こういう質問とお手本の答えをとてもたくさん使います。
      </p>
    </div>
  );
}
