import { useState } from "react";
import { CARDS } from "../../../../data/ch91";
import "../../../../playgrounds/part10/style.css";

type Rate = "agree" | "unsure" | "disagree";
const RATES: { k: Rate; t: string }[] = [
  { k: "agree", t: "赞同" },
  { k: "unsure", t: "不好说" },
  { k: "disagree", t: "反对" },
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
    ? "没有标准答案。一条条读这些意见，按下最接近你想法的按钮。"
    : count("disagree") > 0
      ? `你按了“反对”的意见，站在那个人的角度也有理由。想一想：如果你是他，为什么会这么说？`
      : count("agree") === mine.length
        ? "你全都赞同！可是这些意见互相冲突的时候，应该先顾哪一头？"
        : "按了“不好说”，说明你还想多了解一些。先读读下面的“值得知道的事实”吧。";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选择讨论卡">
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
            <div className="p10-rate" role="group" aria-label={`我对${v.who}意见的看法`}>
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
          我的看法：赞同 {count("agree")} · 不好说 {count("unsure")} · 反对 {count("disagree")}
        </p>
      )}

      <div className="p10-fact">
        <h4>值得知道的事实</h4>
        <p>{card.fact}</p>
      </div>
      <div className="p10-fact talk">
        <h4>可以和朋友聊聊的问题</h4>
        <p>{card.talk}</p>
      </div>

      <label className="code-label" htmlFor={`p10-note-${card.key}`}>
        我的想法笔记（不会保存）
      </label>
      <textarea
        id={`p10-note-${card.key}`}
        className="p10-note"
        rows={3}
        maxLength={300}
        value={notes[card.key] ?? ""}
        onChange={(e) => setNotes((n) => ({ ...n, [card.key]: e.target.value }))}
        placeholder="例：我更赞同○○的看法，因为……"
      />

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={explored === CARDS.length}>
          {explored === CARDS.length ? "✓" : "○"} 四张讨论卡都看一遍（{explored}/{CARDS.length}）
        </li>
      </ul>
      <p className="lab-tip">{explored === CARDS.length && all ? "四张卡都看完了！虽然没有标准答案，但能站在不同立场想问题，本身就是 AI 时代必不可少的能力。" : reflect}</p>
    </div>
  );
}
