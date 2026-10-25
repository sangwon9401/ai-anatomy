import { useState } from "react";
import { CARDS } from "../../data/ch91";
import "./style.css";

type Rate = "agree" | "unsure" | "disagree";
const RATES: { k: Rate; t: string }[] = [
  { k: "agree", t: "공감" },
  { k: "unsure", t: "글쎄" },
  { k: "disagree", t: "반대" },
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
    ? "정답은 없어요. 의견을 하나씩 읽고 내 마음에 가까운 버튼을 눌러 보세요."
    : count("disagree") > 0
      ? `'반대'를 누른 의견도 그 사람 입장에선 이유가 있어요. 그 사람이라면 왜 그렇게 말할지 하나 떠올려 보세요.`
      : count("agree") === mine.length
        ? "모두 공감했네요! 그런데 이 의견들이 서로 부딪힐 때는 무엇을 먼저 챙겨야 할까요?"
        : "'글쎄'가 있다는 건 더 알아보고 싶다는 뜻이에요. 아래 '알아 두면 좋은 사실'부터 읽어 보세요.";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="토론 카드 고르기">
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
            <div className="p10-rate" role="group" aria-label={`${v.who}의 의견에 대한 내 생각`}>
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
          내 생각: 공감 {count("agree")} · 글쎄 {count("unsure")} · 반대 {count("disagree")}
        </p>
      )}

      <div className="p10-fact">
        <h4>알아 두면 좋은 사실</h4>
        <p>{card.fact}</p>
      </div>
      <div className="p10-fact talk">
        <h4>친구와 이야기해 볼 질문</h4>
        <p>{card.talk}</p>
      </div>

      <label className="code-label" htmlFor={`p10-note-${card.key}`}>
        내 생각 메모 (저장되지 않아요)
      </label>
      <textarea
        id={`p10-note-${card.key}`}
        className="p10-note"
        rows={3}
        maxLength={300}
        value={notes[card.key] ?? ""}
        onChange={(e) => setNotes((n) => ({ ...n, [card.key]: e.target.value }))}
        placeholder="예: 나는 ○○ 쪽에 더 공감해요. 왜냐하면…"
      />

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={explored === CARDS.length}>
          {explored === CARDS.length ? "✓" : "○"} 토론 카드 네 장 모두 살펴보기 ({explored}/{CARDS.length})
        </li>
      </ul>
      <p className="lab-tip">{explored === CARDS.length && all ? "네 장 모두 살펴봤어요! 정답은 없지만, 여러 입장에서 생각해 본 것 자체가 AI 시대에 꼭 필요한 힘이에요." : reflect}</p>
    </div>
  );
}
