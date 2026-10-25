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
        ① 选一组示范答案
      </p>
      <div className="p8-seg" role="group" aria-label="示范答案的语气">
        {STYLES.map((s) => (
          <button key={s.key} aria-pressed={style === s.key} disabled={running} onClick={() => setStyle(s.key)}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="p8-cards">
        {pack.demos.map((d) => (
          <div className="p8-card" key={d.q}>
            <div className="p8-q">问：{d.q}</div>
            <div className="p8-a">
              <span className="chip hl-violet" style={{ fontSize: 12, marginRight: 6 }}>
                示范答案
              </span>
              {d.a}
            </div>
          </div>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={train} disabled={running || trained === style}>
          {trained === style ? "已用这组完成微调" : "② 用这组示范答案微调"}
        </button>
        {trained && (
          <button
            className="btn ghost"
            disabled={running}
            onClick={() => {
              setTrained(null);
            }}
          >
            回到微调之前
          </button>
        )}
      </div>
      {running && (
        <div className="p8-progress" role="progressbar" aria-valuenow={Math.round((progress ?? 0) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="微调进度">
          <span style={{ width: `${(progress ?? 0) * 100}%` }} />
        </div>
      )}

      <p className="p8-label">③ 问一个没见过的问题</p>
      <div className="p8-seg" role="group" aria-label="测试问题">
        {TESTS.map((x, i) => (
          <button key={x.q} aria-pressed={test === i} onClick={() => setTest(i)}>
            {x.q}
          </button>
        ))}
      </div>
      <div className="p8-chat" aria-live="polite">
        <div className="p8-bubble user">
          <span className="p8-who">我</span>
          {t.q}
        </div>
        <div className="p8-bubble" key={`${trained}-${test}`}>
          <span className="p8-who">{trained ? `用“${trainedName}”这组微调后的模型` : "微调前的基础模型（第 72 章）"}</span>
          {trained ? t.replies[trained] : t.base}
        </div>
      </div>

      <p className="lab-tip">
        {running
          ? "正在猜示范答案的下一个片段，稍微修整数字……"
          : !trained
            ? "微调之前，它收到问题也只会接着写类似的问题。选一组示范答案来微调吧。"
            : tried.length < STYLES.length
              ? `测试问题明明不在示范答案里，它却用“${trainedName}”的语气来回答。换一组也试试。`
              : "三组都试过了！模型不光模仿回答的内容，连语气和长短也会模仿。所以由谁、怎样写示范答案非常重要。"}
      </p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={tried.length >= 1}>{tried.length >= 1 ? "○" : "□"} 微调后问一个没见过的问题</li>
        <li data-done={tried.length >= STYLES.length}>
          {tried.length >= STYLES.length ? "○" : "□"} 三种语气都微调一遍（{tried.length}/{STYLES.length}）
        </li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        回答是示意数据。真正的 SFT 会用非常多这样的问题和示范答案。
      </p>
    </div>
  );
}
