import { useState } from "react";
import { ROUNDS, pairsOf } from "../../data/ch74";
import "./style.css";

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
          비교 데이터 <b>{data.length}쌍</b>을 만들었어요. 질문 {ROUNDS.length}개에 순위를 한 번씩 매겼을 뿐인데요.
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
        <p className="lab-tip">이 비교 쌍들이 다음 장의 채점관 AI가 공부할 교과서예요. 진짜로는 여러 사람이 수만 개의 질문에 순위를 매겨요.</p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setRound(0);
              setOrder([]);
              setData([]);
            }}
          >
            처음부터 다시
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
        질문 {round + 1} / {ROUNDS.length} · 지금까지 모은 비교 {data.length}쌍
      </div>
      <div className="p8-q-head">{r.q}</div>
      <div className="p8-answers" role="group" aria-label="답을 좋은 순서대로 누르기">
        {r.answers.map((a) => {
          const k = order.indexOf(a.id);
          return (
            <button key={a.id} className="p8-ans" data-ranked={k >= 0} disabled={k >= 0 || done} onClick={() => tap(a.id)} aria-label={`${a.id}: ${a.text}${k >= 0 ? `, ${k + 1}등` : ""}`}>
              <span className="p8-letter">{a.id}</span>
              <span>
                {a.text}
                {done && <span style={{ display: "block", fontSize: 13, color: "var(--ink-2)", marginTop: 2 }}>{a.why}</span>}
              </span>
              <span className="p8-rank">{k >= 0 ? `${k + 1}등` : ""}</span>
            </button>
          );
        })}
      </div>

      {!done ? (
        <p className="lab-tip">{order.length === 0 ? "가장 좋은 답부터 차례로 눌러 보세요." : `${order.length + 1}등을 골라 주세요.`}</p>
      ) : (
        <>
          <h4 className="p8-h4">
            내 순위 {order.join(" > ")} → 비교 데이터 {pairs.length}쌍
          </h4>
          <div className="p8-pairs">
            {pairs.map(([b, w], i) => (
              <div className="p8-pair" key={b + w} style={{ animationDelay: `${i * 90}ms` }}>
                <span className="p8-win">
                  더 나은 답 {b}: {r.answers.find((a) => a.id === b)!.short}
                </span>
                <span className="p8-gt">&gt;</span>
                <span className="p8-lose">
                  덜 나은 답 {w}: {r.answers.find((a) => a.id === w)!.short}
                </span>
              </div>
            ))}
          </div>
          <p className="lab-tip">
            {risky && order[0] === risky
              ? `${risky}를 1등으로 골랐네요. '사실인가?', '해롭지 않나?' 기준으로 다시 볼까요? 사람마다 순위는 다를 수 있어서 여러 사람의 순위를 모아요.`
              : r.answers.length === 4
                ? "답이 4개라 비교가 6쌍이나 나왔어요. 4개 중 2개를 고르는 조합, 4 × 3 ÷ 2 = 6이에요."
                : "답 3개의 순위 하나가 비교 3쌍이 됐어요. 사람마다 순위가 조금씩 다를 수 있어서, 여러 사람의 순위를 모아요."}
          </p>
          <div className="lab-actions">
            <button
              className="btn"
              onClick={() => {
                setRound((x) => x + 1);
                setOrder([]);
              }}
            >
              {round === ROUNDS.length - 1 ? "모은 데이터 보기" : "다음 질문"}
            </button>
          </div>
        </>
      )}
      {order.length > 0 && !done && (
        <div className="lab-actions">
          <button className="btn ghost" onClick={() => setOrder([])}>
            다시 고르기
          </button>
        </div>
      )}
    </div>
  );
}
