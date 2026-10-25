import { useEffect, useRef, useState } from "react";
import { STYLES, TESTS } from "../../data/ch73";
import "./style.css";

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
        ① 모범 답안 묶음 고르기
      </p>
      <div className="p8-seg" role="group" aria-label="모범 답안 말투">
        {STYLES.map((s) => (
          <button key={s.key} aria-pressed={style === s.key} disabled={running} onClick={() => setStyle(s.key)}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="p8-cards">
        {pack.demos.map((d) => (
          <div className="p8-card" key={d.q}>
            <div className="p8-q">질문: {d.q}</div>
            <div className="p8-a">
              <span className="chip hl-violet" style={{ fontSize: 12, marginRight: 6 }}>
                모범 답안
              </span>
              {d.a}
            </div>
          </div>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={train} disabled={running || trained === style}>
          {trained === style ? "이 묶음으로 미세조정 완료" : "② 이 모범 답안으로 미세조정"}
        </button>
        {trained && (
          <button
            className="btn ghost"
            disabled={running}
            onClick={() => {
              setTrained(null);
            }}
          >
            미세조정 전으로
          </button>
        )}
      </div>
      {running && (
        <div className="p8-progress" role="progressbar" aria-valuenow={Math.round((progress ?? 0) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="미세조정 진행">
          <span style={{ width: `${(progress ?? 0) * 100}%` }} />
        </div>
      )}

      <p className="p8-label">③ 처음 보는 질문 던지기</p>
      <div className="p8-seg" role="group" aria-label="시험 질문">
        {TESTS.map((x, i) => (
          <button key={x.q} aria-pressed={test === i} onClick={() => setTest(i)}>
            {x.q}
          </button>
        ))}
      </div>
      <div className="p8-chat" aria-live="polite">
        <div className="p8-bubble user">
          <span className="p8-who">나</span>
          {t.q}
        </div>
        <div className="p8-bubble" key={`${trained}-${test}`}>
          <span className="p8-who">{trained ? `'${trainedName}' 묶음으로 미세조정한 모델` : "미세조정 전 베이스 모델 (72장)"}</span>
          {trained ? t.replies[trained] : t.base}
        </div>
      </div>

      <p className="lab-tip">
        {running
          ? "모범 답안의 다음 조각을 맞히며 숫자를 살짝 다듬는 중…"
          : !trained
            ? "미세조정 전에는 질문을 받아도 비슷한 질문을 이어 써요. 모범 답안 묶음을 하나 골라 미세조정해 보세요."
            : tried.length < STYLES.length
              ? `시험 질문은 모범 답안에 없던 질문인데도 '${trainedName}' 말투로 대답해요. 다른 묶음으로도 해 보세요.`
              : "세 묶음 모두 해 봤어요! 모델은 답의 내용뿐 아니라 말투와 길이까지 따라 해요. 그래서 모범 답안을 누가, 어떻게 쓰느냐가 아주 중요해요."}
      </p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={tried.length >= 1}>{tried.length >= 1 ? "○" : "□"} 미세조정하고 처음 보는 질문 던지기</li>
        <li data-done={tried.length >= STYLES.length}>
          {tried.length >= STYLES.length ? "○" : "□"} 세 가지 말투로 모두 미세조정해 보기 ({tried.length}/{STYLES.length})
        </li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        대답은 설명용 예시예요. 진짜 SFT는 이런 질문과 모범 답안을 아주 많이 써요.
      </p>
    </div>
  );
}
