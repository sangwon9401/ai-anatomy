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
          You made <b>{data.length} pairs</b> of comparison data, just by ranking answers to {ROUNDS.length} questions once each.
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
        <p className="lab-tip">These pairs are the textbook for the next chapter's AI grader. In reality, many people rank answers to tens of thousands of questions.</p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setRound(0);
              setOrder([]);
              setData([]);
            }}
          >
            Start over
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
        Question {round + 1} of {ROUNDS.length} · pairs collected so far: {data.length}
      </div>
      <div className="p8-q-head">{r.q}</div>
      <div className="p8-answers" role="group" aria-label="Tap the answers from best to worst">
        {r.answers.map((a) => {
          const k = order.indexOf(a.id);
          return (
            <button key={a.id} className="p8-ans" data-ranked={k >= 0} disabled={k >= 0 || done} onClick={() => tap(a.id)} aria-label={`${a.id}: ${a.text}${k >= 0 ? `, rank ${k + 1}` : ""}`}>
              <span className="p8-letter">{a.id}</span>
              <span>
                {a.text}
                {done && <span style={{ display: "block", fontSize: 13, color: "var(--ink-2)", marginTop: 2 }}>{a.why}</span>}
              </span>
              <span className="p8-rank">{k >= 0 ? `#${k + 1}` : ""}</span>
            </button>
          );
        })}
      </div>

      {!done ? (
        <p className="lab-tip">{order.length === 0 ? "Tap the answers in order, starting with the best." : `Now pick #${order.length + 1}.`}</p>
      ) : (
        <>
          <h4 className="p8-h4">
            My ranking {order.join(" > ")} → {pairs.length} pairs of comparison data
          </h4>
          <div className="p8-pairs">
            {pairs.map(([b, w], i) => (
              <div className="p8-pair" key={b + w} style={{ animationDelay: `${i * 90}ms` }}>
                <span className="p8-win">
                  Better {b}: {r.answers.find((a) => a.id === b)!.short}
                </span>
                <span className="p8-gt">&gt;</span>
                <span className="p8-lose">
                  Worse {w}: {r.answers.find((a) => a.id === w)!.short}
                </span>
              </div>
            ))}
          </div>
          <p className="lab-tip">
            {risky && order[0] === risky
              ? `You ranked ${risky} first. Shall we look again with 'Is it true?' and 'Is it harmless?' in mind? Rankings can differ from person to person, so many people's rankings are collected.`
              : r.answers.length === 4
                ? "With 4 answers you got 6 pairs: the number of ways to choose 2 of 4, 4 × 3 ÷ 2 = 6."
                : "One ranking of 3 answers became 3 pairs. Rankings differ a little from person to person, so many people's rankings are collected."}
          </p>
          <div className="lab-actions">
            <button
              className="btn"
              onClick={() => {
                setRound((x) => x + 1);
                setOrder([]);
              }}
            >
              {round === ROUNDS.length - 1 ? "See the collected data" : "Next question"}
            </button>
          </div>
        </>
      )}
      {order.length > 0 && !done && (
        <div className="lab-actions">
          <button className="btn ghost" onClick={() => setOrder([])}>
            Rank again
          </button>
        </div>
      )}
    </div>
  );
}
