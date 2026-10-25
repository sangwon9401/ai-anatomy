import { useState } from "react";
import { FRESH, KNOWN, RULE_WORDS, scoreOf, type Msg } from "../../../data/ch04";

const Verdict = ({ spam, truth }: { spam: boolean; truth: boolean }) => (
  <span className="verdict-cell">
    <span className={`tag ${spam ? "spam" : "ok"}`}>{spam ? "垃圾短信" : "正常"}</span>
    <span className={`mark ${spam === truth ? "" : "bad"}`} aria-label={spam === truth ? "对" : "错"}>
      {spam === truth ? "○" : "×"}
    </span>
  </span>
);

export function SpamDuel() {
  const [rule, setRule] = useState<string[]>(["免费"]);
  const [tested, setTested] = useState(false);
  const ruleSays = (m: Msg) => rule.some((k) => m.text.includes(k));
  const modelSays = (m: Msg) => scoreOf(m.text) > 0;
  const hits = (list: Msg[], f: (m: Msg) => boolean) => list.filter((m) => f(m) === m.spam).length;

  return (
    <div>
      <div className="rule-pick" role="group" aria-label="放进规则的词">
        {RULE_WORDS.map((w) => (
          <button key={w} aria-pressed={rule.includes(w)} onClick={() => setRule((r) => (r.includes(w) ? r.filter((x) => x !== w) : [...r, w]))}>
            {w}
          </button>
        ))}
      </div>
      <p className="rule-line">
        我的规则：{rule.length ? `只要出现“${rule.join("”“")}”中的任何一个，就是垃圾短信` : "请至少选一个词"}
      </p>

      <div className="duel">
        <div className="duel-head">
          <span>见过的短信 {KNOWN.length} 条</span>
          <span>正确答案</span>
          <span>我的规则</span>
        </div>
        {KNOWN.map((m) => (
          <div className="duel-row" key={m.text}>
            <span className="msg">{m.text}</span>
            <span className="verdict-cell">
              <span className={`tag ${m.spam ? "spam" : "ok"}`}>{m.spam ? "垃圾短信" : "正常"}</span>
            </span>
            <Verdict spam={ruleSays(m)} truth={m.spam} />
          </div>
        ))}
      </div>
      <div className="duel-score">
        <span>
          我的规则 <b>{hits(KNOWN, ruleSays)}</b> / {KNOWN.length}
        </span>
      </div>

      {!tested ? (
        <div className="lab-actions">
          <button className="btn" onClick={() => setTested(true)}>
            用没见过的短信测试
          </button>
        </div>
      ) : (
        <>
          <div className="duel three">
            <div className="duel-head">
              <span>没见过的短信 {FRESH.length} 条</span>
              <span>正确答案</span>
              <span>我的规则</span>
              <span>学习模型</span>
            </div>
            {FRESH.map((m) => (
              <div className="duel-row" key={m.text}>
                <span className="msg">{m.text}</span>
                <span className="verdict-cell">
                  <span className={`tag ${m.spam ? "spam" : "ok"}`}>{m.spam ? "垃圾短信" : "正常"}</span>
                </span>
                <Verdict spam={ruleSays(m)} truth={m.spam} />
                <Verdict spam={modelSays(m)} truth={m.spam} />
              </div>
            ))}
          </div>
          <div className="duel-score">
            <span>
              我的规则 <b>{hits(FRESH, ruleSays)}</b> / {FRESH.length}
            </span>
            <span>
              学习模型 <b>{hits(FRESH, modelSays)}</b> / {FRESH.length}
            </span>
          </div>
          <p className="lab-tip">
            {hits(FRESH, ruleSays) < hits(FRESH, modelSays)
              ? "规则在见过的短信上很准，可一遇到新花招和例外就不灵了。每次都得由人再补写规则。"
              : "这次规则也撑住了！可明天又冒出新花招的话，谁来改规则呢？"}
          </p>
          <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
            学习模型把每个词的分数加起来做判断。分数是示意数据。
          </p>
        </>
      )}
    </div>
  );
}
