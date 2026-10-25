import { useState } from "react";
import { CARDS } from "../../../../data/ch91";
import "../../../../playgrounds/part10/style.css";

type Rate = "agree" | "unsure" | "disagree";
const RATES: { k: Rate; t: string }[] = [
  { k: "agree", t: "共感" },
  { k: "unsure", t: "うーん" },
  { k: "disagree", t: "反対" },
];
const NUMS = ["①", "②", "③", "④"];

export function DebateCards() {
  const [ci, setCi] = useState(0);
  const [rates, setRates] = useState<Record<string, (Rate | null)[]>>(() => Object.fromEntries(CARDS.map((c) => [c.key, c.views.map(() => null)])));
  const [notes, setNotes] = useState<Record<string, string>>({});
  const card = CARDS[ci];
  const mine = rates[card.key];
  const all = mine.every((r) => r !== null);
  const count = (k: Rate) => mine.filter((r) => r === k).length;
  const explored = CARDS.filter((c) => rates[c.key].every((r) => r !== null)).length;

  const rate = (vi: number, k: Rate) => setRates((rs) => ({ ...rs, [card.key]: rs[card.key].map((r, i) => (i === vi ? (r === k ? null : k) : r)) }));

  const reflect = !all
    ? "正解はありません。意見を1つずつ読んで、自分の気持ちに近いボタンを押してみましょう。"
    : count("disagree") > 0
      ? `「反対」を押した意見にも、その人の立場からの理由があります。その人ならなぜそう言うのか、1つ考えてみましょう。`
      : count("agree") === mine.length
        ? "全部に共感しましたね！では、これらの意見がぶつかるときは、何を先に大切にすればいいでしょう？"
        : "「うーん」があるのは、もっと知りたいというしるしです。下の「知っておくといい事実」から読んでみましょう。";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="討論カードを選ぶ">
        {CARDS.map((c, i) => (
          <button key={c.key} className="p10-seg" aria-pressed={ci === i} onClick={() => setCi(i)}>
            {rates[c.key].every((r) => r !== null) ? "✓ " : ""}
            {NUMS[i]} {c.title}
          </button>
        ))}
      </div>

      <div className="p10-card" data-c={card.c}>
        <p className="p10-story">{card.story}</p>
        <p className="p10-cardq">{card.q}</p>
      </div>

      <ul className="p10-views">
        {card.views.map((v, vi) => (
          <li key={v.who}>
            <p className="p10-say">
              <b>{v.who}</b> "{v.say}"
            </p>
            <div className="p10-rate" role="group" aria-label={`${v.who}の意見についての自分の考え`}>
              {RATES.map((r) => (
                <button key={r.k} data-k={r.k} aria-pressed={mine[vi] === r.k} onClick={() => rate(vi, r.k)}>
                  {r.t}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {all && (
        <p className="lab-sum">
          自分の考え：共感 {count("agree")}・うーん {count("unsure")}・反対 {count("disagree")}
        </p>
      )}

      <div className="p10-fact">
        <h4>知っておくといい事実</h4>
        <p>{card.fact}</p>
      </div>
      <div className="p10-fact talk">
        <h4>友だちと話してみたい問い</h4>
        <p>{card.talk}</p>
      </div>

      <label className="code-label" htmlFor={`p10-note-${card.key}`}>
        自分の考えのメモ（保存されません）
      </label>
      <textarea
        id={`p10-note-${card.key}`}
        className="p10-note"
        rows={3}
        maxLength={300}
        value={notes[card.key] ?? ""}
        onChange={(e) => setNotes((n) => ({ ...n, [card.key]: e.target.value }))}
        placeholder="例：わたしは○○の意見のほうに共感します。なぜなら…"
      />

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={explored === CARDS.length}>
          {explored === CARDS.length ? "✓" : "○"} 討論カードを4枚全部見る（{explored}/{CARDS.length}）
        </li>
      </ul>
      <p className="lab-tip">{explored === CARDS.length && all ? "4枚全部見ました！正解はありませんが、いろいろな立場から考えてみたこと自体が、AIの時代に欠かせない力です。" : reflect}</p>
    </div>
  );
}
