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
          比較データを<b>{data.length}組</b>作りました。{ROUNDS.length}つの質問に1回ずつ順位をつけただけなのに。
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
        <p className="lab-tip">この比較ペアが、次の章の採点係AIが勉強する教科書です。本物では、たくさんの人が何万もの質問に順位をつけます。</p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setRound(0);
              setOrder([]);
              setData([]);
            }}
          >
            最初からもう一度
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
        質問 {round + 1} / {ROUNDS.length} · これまでに集めた比較 {data.length}組
      </div>
      <div className="p8-q-head">{r.q}</div>
      <div className="p8-answers" role="group" aria-label="答えをよい順に押す">
        {r.answers.map((a) => {
          const k = order.indexOf(a.id);
          return (
            <button key={a.id} className="p8-ans" data-ranked={k >= 0} disabled={k >= 0 || done} onClick={() => tap(a.id)} aria-label={`${a.id}: ${a.text}${k >= 0 ? `、${k + 1}位` : ""}`}>
              <span className="p8-letter">{a.id}</span>
              <span>
                {a.text}
                {done && <span style={{ display: "block", fontSize: 13, color: "var(--ink-2)", marginTop: 2 }}>{a.why}</span>}
              </span>
              <span className="p8-rank">{k >= 0 ? `${k + 1}位` : ""}</span>
            </button>
          );
        })}
      </div>

      {!done ? (
        <p className="lab-tip">{order.length === 0 ? "いちばんよい答えから順に押してみましょう。" : `${order.length + 1}位を選んでください。`}</p>
      ) : (
        <>
          <h4 className="p8-h4">
            自分の順位 {order.join(" > ")} → 比較データ {pairs.length}組
          </h4>
          <div className="p8-pairs">
            {pairs.map(([b, w], i) => (
              <div className="p8-pair" key={b + w} style={{ animationDelay: `${i * 90}ms` }}>
                <span className="p8-win">
                  よい答え {b}：{r.answers.find((a) => a.id === b)!.short}
                </span>
                <span className="p8-gt">&gt;</span>
                <span className="p8-lose">
                  よくない答え {w}：{r.answers.find((a) => a.id === w)!.short}
                </span>
              </div>
            ))}
          </div>
          <p className="lab-tip">
            {risky && order[0] === risky
              ? `${risky}を1位にしましたね。「本当か？」「害がないか？」の基準で見直してみましょうか？ 人によって順位はちがうことがあるので、たくさんの人の順位を集めます。`
              : r.answers.length === 4
                ? "答えが4つなので、比較が6組もできました。4つから2つを選ぶ組み合わせ、4 × 3 ÷ 2 = 6です。"
                : "答え3つの順位1つが、比較3組になりました。人によって順位は少しずつちがうことがあるので、たくさんの人の順位を集めます。"}
          </p>
          <div className="lab-actions">
            <button
              className="btn"
              onClick={() => {
                setRound((x) => x + 1);
                setOrder([]);
              }}
            >
              {round === ROUNDS.length - 1 ? "集めたデータを見る" : "次の質問"}
            </button>
          </div>
        </>
      )}
      {order.length > 0 && !done && (
        <div className="lab-actions">
          <button className="btn ghost" onClick={() => setOrder([])}>
            選び直す
          </button>
        </div>
      )}
    </div>
  );
}
