import { useState } from "react";
import { CARDS } from "../../../../data/ch91";
import "../../../../playgrounds/part10/style.css";

type Rate = "agree" | "unsure" | "disagree";
const RATES: { k: Rate; t: string }[] = [
  { k: "agree", t: "Agree" },
  { k: "unsure", t: "Not sure" },
  { k: "disagree", t: "Disagree" },
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
    ? "There are no right answers. Read each view and press the button closest to how you feel."
    : count("disagree") > 0
      ? `Even a view you disagreed with has its reasons from that person's side. Think of one reason they might say it.`
      : count("agree") === mine.length
        ? "You agreed with all of them! But when these views clash, what should come first?"
        : "'Not sure' means you'd like to know more. Start with 'Good to know' below.";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="Choose a discussion card">
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
            <div className="p10-rate" role="group" aria-label={`My reaction to the view of: ${v.who}`}>
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
          My reactions: agree {count("agree")} · not sure {count("unsure")} · disagree {count("disagree")}
        </p>
      )}

      <div className="p10-fact">
        <h4>Good to know</h4>
        <p>{card.fact}</p>
      </div>
      <div className="p10-fact talk">
        <h4>A question to talk over with friends</h4>
        <p>{card.talk}</p>
      </div>

      <label className="code-label" htmlFor={`p10-note-${card.key}`}>
        My notes (not saved)
      </label>
      <textarea
        id={`p10-note-${card.key}`}
        className="p10-note"
        rows={3}
        maxLength={300}
        value={notes[card.key] ?? ""}
        onChange={(e) => setNotes((n) => ({ ...n, [card.key]: e.target.value }))}
        placeholder="e.g. I agree more with ___, because…"
      />

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={explored === CARDS.length}>
          {explored === CARDS.length ? "✓" : "○"} Look at all four discussion cards ({explored}/{CARDS.length})
        </li>
      </ul>
      <p className="lab-tip">{explored === CARDS.length && all ? "You've looked at all four! There are no right answers, but thinking from many sides is exactly the skill the AI age needs." : reflect}</p>
    </div>
  );
}
