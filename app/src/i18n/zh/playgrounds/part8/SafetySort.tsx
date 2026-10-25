import { useState } from "react";
import { BANNED, REQUESTS, naiveRefuses } from "../../../../data/ch79";
import "../../../../playgrounds/part8/style.css";

const Tag = ({ help, wrong }: { help: boolean; wrong?: boolean }) => <span className={`p8-tag ${help ? "help" : "no"}${wrong ? " bad" : ""}`}>{help ? "帮忙" : "拒绝"}</span>;

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
            我<b>{me.ok} / {REQUESTS.length}</b>
            没问题却拒绝 {me.over} · 危险却帮忙 {me.under}
          </div>
          <div className="p8-stat">
            禁用词规则 AI<b>{rule.ok} / {REQUESTS.length}</b>
            没问题却拒绝 {rule.over} · 危险却帮忙 {rule.under}
          </div>
        </div>
        <p className="lab-sum" style={{ margin: "8px 0 0" }}>
          规则 AI 只要看到下面任何一个词就拒绝：{BANNED.map((w) => `“${w}”`).join("、")}
        </p>
        <div className="p8-sorted">
          {REQUESTS.map((r, k) => {
            const ruleHelp = !naiveRefuses(r.text);
            return (
              <div className="p8-sorted-row" key={r.text}>
                <span>{r.text}</span>
                <span style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span className="muted" style={{ fontSize: 12 }}>我</span>
                  <Tag help={mine[k]} wrong={mine[k] !== r.help} />
                  <span className="muted" style={{ fontSize: 12 }}>规则</span>
                  <Tag help={ruleHelp} wrong={ruleHelp !== r.help} />
                </span>
                <span className="p8-why">
                  合适的做法：{r.help ? "帮忙" : "拒绝，并指出别的路"}。{r.why}
                </span>
              </div>
            );
          })}
        </div>
        <p className="lab-tip">
          禁用词规则只看到“刀”“消灭”这样的词，就把没问题的请求挡住；没有禁用词的危险请求，却直接放过。这和第 4 章垃圾邮件过滤器的规则方法是同一个弱点。所以 ChatGPT 要通过人的示范和评价来学习，看整句话的意思来判断（第 73、76 章）。
        </p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setMine([]);
              setShown(false);
            }}
          >
            从头再来
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
        请求 {Math.min(i + (shown ? 0 : 1), REQUESTS.length)} / {REQUESTS.length}
      </div>
      {shown && prev && last !== null ? (
        <>
          <div className="p8-req" key={`f${i}`}>
            {prev.text}
            <small>
              我的选择：{last ? "帮忙" : "拒绝，并指出别的路"} {last === prev.help ? "○" : "×"}
            </small>
          </div>
          <p className="lab-tip">
            {last === prev.help ? "很好！" : prev.help ? "这是没问题的请求。" : "这是危险的请求。"}
            {prev.why}
          </p>
          <div className="lab-actions">
            <button className="btn" onClick={() => setShown(false)}>
              {i >= REQUESTS.length ? "看结果" : "下一个请求"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p8-req" key={`q${i}`}>
            {r.text}
            <small>如果你是 AI，会怎么做？</small>
          </div>
          <div className="p8-bins" role="group" aria-label="帮忙，还是拒绝">
            <button
              className="help"
              onClick={() => {
                setMine([...mine, true]);
                setShown(true);
              }}
            >
              帮忙
            </button>
            <button
              className="no"
              onClick={() => {
                setMine([...mine, false]);
                setShown(true);
              }}
            >
              拒绝，并指出别的路
            </button>
          </div>
        </>
      )}
    </div>
  );
}
