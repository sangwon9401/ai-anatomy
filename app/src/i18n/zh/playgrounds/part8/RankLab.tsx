import { useState } from "react";
import { ROUNDS, pairsOf } from "../../../../data/ch74";
import "../../../../playgrounds/part8/style.css";

type Pair = { round: number; better: string; worse: string };

// answers that a careful rater would rarely put first (bad advice, a wrong fact)
const RISKY: Record<number, string> = { 0: "A", 3: "C" };

export function RankLab() {
  const [round, setRound] = useState(0);
  const [order, setOrder] = useState<string[]>([]);
  const [data, setData] = useState<Pair[]>([]);
  const finished = round >= ROUNDS.length;

  if (finished) {
    return (
      <div>
        <p className="p8-count">
          做出了 <b>{data.length} 对</b>比较数据。只不过给 {ROUNDS.length} 个问题各排了一次名次而已。
        </p>
        <div className="p8-pairs">
          {data.map((p, i) => {
            const r = ROUNDS[p.round];
            const short = (id: string) => r.answers.find((a) => a.id === id)!.short;
            return (
              <div className="p8-pair" key={i} style={{ animationDelay: `${i * 30}ms` }}>
                <span className="p8-win">
                  {p.round + 1}-{p.better} {short(p.better)}
                </span>
                <span className="p8-gt">&gt;</span>
                <span className="p8-lose">
                  {p.round + 1}-{p.worse} {short(p.worse)}
                </span>
              </div>
            );
          })}
        </div>
        <p className="lab-tip">这些比较对，就是下一章的评分员 AI 要学的教科书。真正做的时候，是很多人给几万个问题排名次。</p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setRound(0);
              setOrder([]);
              setData([]);
            }}
          >
            从头再来
          </button>
        </div>
      </div>
    );
  }

  const r = ROUNDS[round];
  const done = order.length === r.answers.length;
  const pairs = done ? pairsOf(order) : [];
  const risky = RISKY[round];

  const tap = (id: string) => {
    if (order.includes(id) || done) return;
    const next = [...order, id];
    setOrder(next);
    if (next.length === r.answers.length) setData((d) => [...d, ...pairsOf(next).map(([better, worse]) => ({ round, better, worse }))]);
  };

  return (
    <div>
      <div className="muted num" style={{ fontSize: 13 }}>
        问题 {round + 1} / {ROUNDS.length} · 目前收集的比较 {data.length} 对
      </div>
      <div className="p8-q-head">{r.q}</div>
      <div className="p8-answers" role="group" aria-label="按好坏顺序点答案">
        {r.answers.map((a) => {
          const k = order.indexOf(a.id);
          return (
            <button key={a.id} className="p8-ans" data-ranked={k >= 0} disabled={k >= 0 || done} onClick={() => tap(a.id)} aria-label={`${a.id}：${a.text}${k >= 0 ? `，第 ${k + 1} 名` : ""}`}>
              <span className="p8-letter">{a.id}</span>
              <span>
                {a.text}
                {done && <span style={{ display: "block", fontSize: 13, color: "var(--ink-2)", marginTop: 2 }}>{a.why}</span>}
              </span>
              <span className="p8-rank">{k >= 0 ? `第 ${k + 1} 名` : ""}</span>
            </button>
          );
        })}
      </div>

      {!done ? (
        <p className="lab-tip">{order.length === 0 ? "从最好的答案开始，依次点下去。" : `请选出第 ${order.length + 1} 名。`}</p>
      ) : (
        <>
          <h4 className="p8-h4">
            我的名次 {order.join(" > ")} → 比较数据 {pairs.length} 对
          </h4>
          <div className="p8-pairs">
            {pairs.map(([b, w], i) => (
              <div className="p8-pair" key={b + w} style={{ animationDelay: `${i * 90}ms` }}>
                <span className="p8-win">
                  更好的答案 {b}：{r.answers.find((a) => a.id === b)!.short}
                </span>
                <span className="p8-gt">&gt;</span>
                <span className="p8-lose">
                  差一点的答案 {w}：{r.answers.find((a) => a.id === w)!.short}
                </span>
              </div>
            ))}
          </div>
          <p className="lab-tip">
            {risky && order[0] === risky
              ? `你把 ${risky} 选成了第 1 名。用“是不是事实？”“有没有害处？”的标准再看一遍？每个人排的名次可能不同，所以要收集很多人的名次。`
              : r.answers.length === 4
                ? "有 4 个答案，所以出了 6 对比较。从 4 个里挑 2 个的组合：4 × 3 ÷ 2 = 6。"
                : "3 个答案的一次排名，变成了 3 对比较。每个人排的名次可能有点不同，所以要收集很多人的名次。"}
          </p>
          <div className="lab-actions">
            <button
              className="btn"
              onClick={() => {
                setRound((x) => x + 1);
                setOrder([]);
              }}
            >
              {round === ROUNDS.length - 1 ? "看看收集的数据" : "下一个问题"}
            </button>
          </div>
        </>
      )}
      {order.length > 0 && !done && (
        <div className="lab-actions">
          <button className="btn ghost" onClick={() => setOrder([])}>
            重新选
          </button>
        </div>
      )}
    </div>
  );
}
