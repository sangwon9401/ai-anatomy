import { useState } from "react";
import { FRESH, KNOWN, RULE_WORDS, scoreOf, type Msg } from "../../../data/ch04";

const Verdict = ({ spam, truth }: { spam: boolean; truth: boolean }) => (
  <span className="verdict-cell">
    <span className={`tag ${spam ? "spam" : "ok"}`}>{spam ? "spam" : "OK"}</span>
    <span className={`mark ${spam === truth ? "" : "bad"}`} aria-label={spam === truth ? "right" : "wrong"}>
      {spam === truth ? "○" : "×"}
    </span>
  </span>
);

export function SpamDuel() {
  const [rule, setRule] = useState<string[]>(["free"]);
  const [tested, setTested] = useState(false);
  const ruleSays = (m: Msg) => rule.some((k) => m.text.includes(k));
  const modelSays = (m: Msg) => scoreOf(m.text) > 0;
  const hits = (list: Msg[], f: (m: Msg) => boolean) => list.filter((m) => f(m) === m.spam).length;

  return (
    <div>
      <div className="rule-pick" role="group" aria-label="Words for your rule">
        {RULE_WORDS.map((w) => (
          <button key={w} aria-pressed={rule.includes(w)} onClick={() => setRule((r) => (r.includes(w) ? r.filter((x) => x !== w) : [...r, w]))}>
            {w}
          </button>
        ))}
      </div>
      <p className="rule-line">
        My rule: {rule.length ? `spam if it contains any of "${rule.join('", "')}"` : "Pick at least one word"}
      </p>

      <div className="duel">
        <div className="duel-head">
          <span>{KNOWN.length} known messages</span>
          <span>Answer</span>
          <span>My rule</span>
        </div>
        {KNOWN.map((m) => (
          <div className="duel-row" key={m.text}>
            <span className="msg">{m.text}</span>
            <span className="verdict-cell">
              <span className={`tag ${m.spam ? "spam" : "ok"}`}>{m.spam ? "spam" : "OK"}</span>
            </span>
            <Verdict spam={ruleSays(m)} truth={m.spam} />
          </div>
        ))}
      </div>
      <div className="duel-score">
        <span>
          My rule <b>{hits(KNOWN, ruleSays)}</b> / {KNOWN.length}
        </span>
      </div>

      {!tested ? (
        <div className="lab-actions">
          <button className="btn" onClick={() => setTested(true)}>
            Test on new messages
          </button>
        </div>
      ) : (
        <>
          <div className="duel three">
            <div className="duel-head">
              <span>{FRESH.length} new messages</span>
              <span>Answer</span>
              <span>My rule</span>
              <span>Trained model</span>
            </div>
            {FRESH.map((m) => (
              <div className="duel-row" key={m.text}>
                <span className="msg">{m.text}</span>
                <span className="verdict-cell">
                  <span className={`tag ${m.spam ? "spam" : "ok"}`}>{m.spam ? "spam" : "OK"}</span>
                </span>
                <Verdict spam={ruleSays(m)} truth={m.spam} />
                <Verdict spam={modelSays(m)} truth={m.spam} />
              </div>
            ))}
          </div>
          <div className="duel-score">
            <span>
              My rule <b>{hits(FRESH, ruleSays)}</b> / {FRESH.length}
            </span>
            <span>
              Trained model <b>{hits(FRESH, modelSays)}</b> / {FRESH.length}
            </span>
          </div>
          <p className="lab-tip">
            {hits(FRESH, ruleSays) < hits(FRESH, modelSays)
              ? "Rules may work on messages you already know, but they fall apart against new tricks and exceptions. Every time, a person has to write another rule."
              : "Your rule held up well this time! But when a new trick shows up tomorrow, who will fix the rule?"}
          </p>
          <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
            The trained model adds up a score for each word. The scores are an illustrative example.
          </p>
        </>
      )}
    </div>
  );
}
