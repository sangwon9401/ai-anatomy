import { useEffect, useRef, useState } from "react";
import { ROUNDS } from "../../../../data/ch74";
import { FEATURES, PAIRS, TEST, TRAIN_STEPS, W0, scoreOf, trainStep, type Scored } from "../../../../data/ch75";
import "../../../../playgrounds/part8/style.css";

const TAGS = ["切题", "理由·方法", "错误·有害"];
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
        评分员的权重 {steps > 0 && <span className="muted">· 练习 {steps} 次</span>}
      </h4>
      <div className="p8-weights">
        {FEATURES.map((name, i) => (
          <label className="p8-weight" key={name}>
            <span>
              {name} <span className="muted">× 权重</span>
            </span>
            <b>{fmt(w[i])}</b>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={w[i]}
              disabled={running}
              aria-label={`${name}的权重`}
              onChange={(e) => setW(w.map((x, k) => (k === i ? Number(e.target.value) : x)))}
            />
          </label>
        ))}
      </div>
      <p className="lab-sum" style={{ margin: "8px 0 0" }}>
        分数 = 把答案具有的特征的权重加起来
      </p>

      <h4 className="p8-h4">
        人定下的比较（第 74 章）· 判对 <b className="num">{ok}</b> / {PAIRS.length} 对
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
              <span className={`p8-ok ${good ? "" : "bad"}`} aria-label={good ? "对" : "错"}>
                {good ? "○" : "×"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={auto} disabled={running}>
          自动学习（练习 {AUTO_STEPS} 次）
        </button>
        <button className="btn ghost" onClick={() => {
            setW(trainStep(w));
            setSteps((n) => n + 1);
          }}
          disabled={running}
        >
          练习一次
        </button>
        <button
          className="btn ghost"
          disabled={running}
          onClick={() => {
            setW(W0);
            setSteps(0);
          }}
        >
          回到最初的评分员
        </button>
      </div>

      <p className="lab-tip">
        {ok === PAIRS.length
          ? "6 对全都和人一样，给了更好的那个更高的分！看到“错误·有害”的权重变成负数了吗？有这个特征，分数就会被扣掉。"
          : "看看打了 × 的那几对。只有更好的答案才有的特征，把它的权重调高；只有差一点的答案才有的特征，把它的权重调低。"}
      </p>

      <h4 className="p8-h4">没见过的问题：{TEST.q}</h4>
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
        这是玩具评分员，只看三个特征。真正的奖励模型用 Transformer 自己找到的大量特征来打分。分数是示意数据。
      </p>
    </div>
  );
}
