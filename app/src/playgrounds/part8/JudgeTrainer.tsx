import { useEffect, useRef, useState } from "react";
import { ROUNDS } from "../../data/ch74";
import { FEATURES, PAIRS, TEST, TRAIN_STEPS, W0, scoreOf, trainStep, type Scored } from "../../data/ch75";
import "./style.css";

const TAGS = ["대답", "이유·방법", "틀림·해로움"];
const AUTO_STEPS = TRAIN_STEPS;
const fmt = (v: number) => (Math.abs(v) < 0.05 ? "0.0" : v < 0 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));
const shortOf = (q: number, id: string) => ROUNDS[q].answers.find((a) => a.id === id)?.short ?? id;

const Tags = ({ f }: { f: number[] }) => (
  <span className="p8-feat">
    {f.map((x, i) => (
      <span key={i} className={x ? `on${i === 2 ? " neg" : ""}` : ""}>
        {TAGS[i]}
      </span>
    ))}
  </span>
);

export function JudgeTrainer() {
  const [w, setW] = useState<number[]>(W0);
  const [steps, setSteps] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const ok = PAIRS.filter((p) => scoreOf(w, p.better.f) > scoreOf(w, p.worse.f)).length;
  const ranked = [...TEST.answers].map((a) => ({ ...a, s: scoreOf(w, a.f) })).sort((a, b) => b.s - a.s);

  const auto = () => {
    cancelAnimationFrame(raf.current);
    setRunning(true);
    let n = 0;
    const tick = () => {
      setW((v) => trainStep(v));
      setSteps((s) => s + 1);
      n += 1;
      if (n < AUTO_STEPS) raf.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const cell = (q: number, a: Scored) => (
    <span style={{ minWidth: 0 }}>
      <b>{a.id}</b> {shortOf(q, a.id)} <b className="num">({fmt(scoreOf(w, a.f))})</b>
      <Tags f={a.f} />
    </span>
  );

  return (
    <div>
      <h4 className="p8-h4" style={{ marginTop: 0 }}>
        채점관의 가중치 {steps > 0 && <span className="muted">· 연습 {steps}번</span>}
      </h4>
      <div className="p8-weights">
        {FEATURES.map((name, i) => (
          <label className="p8-weight" key={name}>
            <span>
              {name} <span className="muted">× 가중치</span>
            </span>
            <b>{fmt(w[i])}</b>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={w[i]}
              disabled={running}
              aria-label={`${name} 가중치`}
              onChange={(e) => setW(w.map((x, k) => (k === i ? Number(e.target.value) : x)))}
            />
          </label>
        ))}
      </div>
      <p className="lab-sum" style={{ margin: "8px 0 0" }}>
        점수 = 답에 있는 특징들의 가중치를 더한 값
      </p>

      <h4 className="p8-h4">
        사람이 정한 비교 (74장) · 맞힌 쌍 <b className="num">{ok}</b> / {PAIRS.length}
      </h4>
      <div className="p8-scored">
        {PAIRS.map((p, i) => {
          const good = scoreOf(w, p.better.f) > scoreOf(w, p.worse.f);
          return (
            <div className="p8-srow" key={i} style={{ gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr) 1.4em" }}>
              {cell(p.q, p.better)}
              <span className="p8-gt" style={{ fontWeight: 700 }}>
                &gt;
              </span>
              {cell(p.q, p.worse)}
              <span className={`p8-ok ${good ? "" : "bad"}`} aria-label={good ? "맞음" : "틀림"}>
                {good ? "○" : "×"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={auto} disabled={running}>
          자동으로 배우기 ({AUTO_STEPS}번 연습)
        </button>
        <button className="btn ghost" onClick={() => {
            setW(trainStep(w));
            setSteps((n) => n + 1);
          }}
          disabled={running}
        >
          한 번 연습
        </button>
        <button
          className="btn ghost"
          disabled={running}
          onClick={() => {
            setW(W0);
            setSteps(0);
          }}
        >
          처음 채점관으로
        </button>
      </div>

      <p className="lab-tip">
        {ok === PAIRS.length
          ? "6쌍 모두 사람과 같은 쪽에 더 높은 점수를 줬어요! '틀림·해로움' 가중치가 음수가 된 게 보이나요? 그 특징이 있으면 점수가 깎여요."
          : "×가 붙은 쌍을 보세요. 더 나은 답에만 있는 특징의 가중치는 올리고, 덜 나은 답에만 있는 특징의 가중치는 내려 보세요."}
      </p>

      <h4 className="p8-h4">처음 보는 질문: {TEST.q}</h4>
      <div className="p8-scored">
        {ranked.map((a, i) => (
          <div className="p8-srow" key={a.id} style={{ gridTemplateColumns: "1.6em minmax(0, 1fr) 3.4em" }}>
            <span className="p8-ok">{i + 1}</span>
            <span>
              {a.text}
              <Tags f={a.f} />
            </span>
            <span className="p8-num">{fmt(a.s)}</span>
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        장난감 채점관이라 특징 세 개만 봐요. 진짜 보상 모델은 트랜스포머가 스스로 찾은 수많은 특징으로 점수를 내요. 점수는 설명용 예시예요.
      </p>
    </div>
  );
}
