import { useState } from "react";
import { BANNED, REQUESTS, naiveRefuses } from "../../../../data/ch79";
import "../../../../playgrounds/part8/style.css";

const Tag = ({ help, wrong }: { help: boolean; wrong?: boolean }) => <span className={`p8-tag ${help ? "help" : "no"}${wrong ? " bad" : ""}`}>{help ? "手伝う" : "断る"}</span>;

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
            私<b>{me.ok} / {REQUESTS.length}</b>
            大丈夫なのに断った {me.over} · 危ないのに手伝った {me.under}
          </div>
          <div className="p8-stat">
            禁止ワードのルールAI<b>{rule.ok} / {REQUESTS.length}</b>
            大丈夫なのに断った {rule.over} · 危ないのに手伝った {rule.under}
          </div>
        </div>
        <p className="lab-sum" style={{ margin: "8px 0 0" }}>
          ルールAIは、この言葉が1つでもあれば断ります：{BANNED.map((w) => `「${w}」`).join("")}
        </p>
        <div className="p8-sorted">
          {REQUESTS.map((r, k) => {
            const ruleHelp = !naiveRefuses(r.text);
            return (
              <div className="p8-sorted-row" key={r.text}>
                <span>{r.text}</span>
                <span style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span className="muted" style={{ fontSize: 12 }}>私</span>
                  <Tag help={mine[k]} wrong={mine[k] !== r.help} />
                  <span className="muted" style={{ fontSize: 12 }}>ルール</span>
                  <Tag help={ruleHelp} wrong={ruleHelp !== r.help} />
                </span>
                <span className="p8-why">
                  ふさわしい答え：{r.help ? "手伝う" : "断って、ほかの道を案内する"}。{r.why}
                </span>
              </div>
            );
          })}
        </div>
        <p className="lab-tip">
          禁止ワードのルールは、「包丁」「退治」のような言葉だけを見て大丈夫なお願いを止め、禁止ワードのない危ないお願いはそのまま通してしまいます。第4章のスパムフィルターのルール方式と同じ弱点ですね。だからChatGPTは、文全体の意味を見て判断できるように、人の例と評価で学びます（第73・76章）。
        </p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setMine([]);
              setShown(false);
            }}
          >
            最初からもう一度
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
        お願い {Math.min(i + (shown ? 0 : 1), REQUESTS.length)} / {REQUESTS.length}
      </div>
      {shown && prev && last !== null ? (
        <>
          <div className="p8-req" key={`f${i}`}>
            {prev.text}
            <small>
              自分の選択：{last ? "手伝う" : "断って、ほかの道を案内"} {last === prev.help ? "○" : "×"}
            </small>
          </div>
          <p className="lab-tip">
            {last === prev.help ? "いいですね！ " : prev.help ? "大丈夫なお願いでした。" : "危ないお願いでした。"}
            {prev.why}
          </p>
          <div className="lab-actions">
            <button className="btn" onClick={() => setShown(false)}>
              {i >= REQUESTS.length ? "結果を見る" : "次のお願い"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p8-req" key={`q${i}`}>
            {r.text}
            <small>AIならどうする？</small>
          </div>
          <div className="p8-bins" role="group" aria-label="手伝う？ 断る？">
            <button
              className="help"
              onClick={() => {
                setMine([...mine, true]);
                setShown(true);
              }}
            >
              手伝う
            </button>
            <button
              className="no"
              onClick={() => {
                setMine([...mine, false]);
                setShown(true);
              }}
            >
              断って、ほかの道を案内
            </button>
          </div>
        </>
      )}
    </div>
  );
}
