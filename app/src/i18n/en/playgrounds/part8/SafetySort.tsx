import { useState } from "react";
import { BANNED, REQUESTS, naiveRefuses } from "../../../../data/ch79";
import "../../../../playgrounds/part8/style.css";

const Tag = ({ help, wrong }: { help: boolean; wrong?: boolean }) => <span className={`p8-tag ${help ? "help" : "no"}${wrong ? " bad" : ""}`}>{help ? "helped" : "declined"}</span>;

const tally = (pick: (i: number) => boolean) => {
  let ok = 0;
  let over = 0;
  let under = 0;
  REQUESTS.forEach((r, i) => {
    const help = pick(i);
    if (help === r.help) ok += 1;
    else if (!help) over += 1;
    else under += 1;
  });
  return { ok, over, under };
};

export function SafetySort() {
  const [mine, setMine] = useState<boolean[]>([]);
  const [shown, setShown] = useState(false);
  const i = mine.length;
  // the last card's feedback is shown before the results
  const finished = i >= REQUESTS.length && !shown;

  if (finished) {
    const me = tally((k) => mine[k]);
    const rule = tally((k) => !naiveRefuses(REQUESTS[k].text));
    return (
      <div>
        <div className="p8-stats" style={{ marginTop: 0 }}>
          <div className="p8-stat">
            Me<b>{me.ok} / {REQUESTS.length}</b>
            fine but declined {me.over} · dangerous but helped {me.under}
          </div>
          <div className="p8-stat">
            Banned-words AI<b>{rule.ok} / {REQUESTS.length}</b>
            fine but declined {rule.over} · dangerous but helped {rule.under}
          </div>
        </div>
        <p className="lab-sum" style={{ margin: "8px 0 0" }}>
          The rule AI declines whenever any of these words appears: {BANNED.map((w) => `'${w}'`).join(", ")}
        </p>
        <div className="p8-sorted">
          {REQUESTS.map((r, k) => {
            const ruleHelp = !naiveRefuses(r.text);
            return (
              <div className="p8-sorted-row" key={r.text}>
                <span>{r.text}</span>
                <span style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span className="muted" style={{ fontSize: 12 }}>Me</span>
                  <Tag help={mine[k]} wrong={mine[k] !== r.help} />
                  <span className="muted" style={{ fontSize: 12 }}>Rule</span>
                  <Tag help={ruleHelp} wrong={ruleHelp !== r.help} />
                </span>
                <span className="p8-why">
                  Best choice: {r.help ? "help" : "decline and point to another way"}. {r.why}
                </span>
              </div>
            );
          })}
        </div>
        <p className="lab-tip">
          The banned-words rule blocks fine requests just for words like 'knife' or 'get rid of', and lets dangerous requests without those words straight through. It's the same weakness as chapter 4's rule-based spam filter. That's why ChatGPT learns from people's examples and ratings to judge the meaning of the whole sentence (ch. 73, 76).
        </p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setMine([]);
              setShown(false);
            }}
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  const r = REQUESTS[i];
  const last = shown ? mine[i - 1] : null;
  const prev = shown ? REQUESTS[i - 1] : null;

  return (
    <div>
      <div className="muted num" style={{ fontSize: 13, marginBottom: 6 }}>
        Request {Math.min(i + (shown ? 0 : 1), REQUESTS.length)} of {REQUESTS.length}
      </div>
      {shown && prev && last !== null ? (
        <>
          <div className="p8-req" key={`f${i}`}>
            {prev.text}
            <small>
              My choice: {last ? "help" : "decline and point to another way"} {last === prev.help ? "○" : "×"}
            </small>
          </div>
          <p className="lab-tip">
            {last === prev.help ? "Nice! " : prev.help ? "That one was fine. " : "That one was dangerous. "}
            {prev.why}
          </p>
          <div className="lab-actions">
            <button className="btn" onClick={() => setShown(false)}>
              {i >= REQUESTS.length ? "See results" : "Next request"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p8-req" key={`q${i}`}>
            {r.text}
            <small>What should the AI do?</small>
          </div>
          <div className="p8-bins" role="group" aria-label="Help or decline?">
            <button
              className="help"
              onClick={() => {
                setMine([...mine, true]);
                setShown(true);
              }}
            >
              Help
            </button>
            <button
              className="no"
              onClick={() => {
                setMine([...mine, false]);
                setShown(true);
              }}
            >
              Decline and point to another way
            </button>
          </div>
        </>
      )}
    </div>
  );
}
