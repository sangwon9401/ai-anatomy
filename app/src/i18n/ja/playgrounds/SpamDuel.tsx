import { useState } from "react";
import { FRESH, KNOWN, RULE_WORDS, scoreOf, type Msg } from "../../../data/ch04";

const Verdict = ({ spam, truth }: { spam: boolean; truth: boolean }) => (
  <span className="verdict-cell">
    <span className={`tag ${spam ? "spam" : "ok"}`}>{spam ? "スパム" : "正常"}</span>
    <span className={`mark ${spam === truth ? "" : "bad"}`} aria-label={spam === truth ? "正しい" : "まちがい"}>
      {spam === truth ? "○" : "×"}
    </span>
  </span>
);

export function SpamDuel() {
  const [rule, setRule] = useState<string[]>(["無料"]);
  const [tested, setTested] = useState(false);
  const ruleSays = (m: Msg) => rule.some((k) => m.text.includes(k));
  const modelSays = (m: Msg) => scoreOf(m.text) > 0;
  const hits = (list: Msg[], f: (m: Msg) => boolean) => list.filter((m) => f(m) === m.spam).length;

  return (
    <div>
      <div className="rule-pick" role="group" aria-label="ルールに入れる単語">
        {RULE_WORDS.map((w) => (
          <button key={w} aria-pressed={rule.includes(w)} onClick={() => setRule((r) => (r.includes(w) ? r.filter((x) => x !== w) : [...r, w]))}>
            {w}
          </button>
        ))}
      </div>
      <p className="rule-line">
        自分のルール：{rule.length ? `「${rule.join("」「")}」のどれか1つでもあればスパム` : "単語を1つ以上選んでください"}
      </p>

      <div className="duel">
        <div className="duel-head">
          <span>知っているメッセージ {KNOWN.length}通</span>
          <span>正解</span>
          <span>自分のルール</span>
        </div>
        {KNOWN.map((m) => (
          <div className="duel-row" key={m.text}>
            <span className="msg">{m.text}</span>
            <span className="verdict-cell">
              <span className={`tag ${m.spam ? "spam" : "ok"}`}>{m.spam ? "スパム" : "正常"}</span>
            </span>
            <Verdict spam={ruleSays(m)} truth={m.spam} />
          </div>
        ))}
      </div>
      <div className="duel-score">
        <span>
          自分のルール <b>{hits(KNOWN, ruleSays)}</b> / {KNOWN.length}
        </span>
      </div>

      {!tested ? (
        <div className="lab-actions">
          <button className="btn" onClick={() => setTested(true)}>
            初めて見るメッセージで試す
          </button>
        </div>
      ) : (
        <>
          <div className="duel three">
            <div className="duel-head">
              <span>初めて見るメッセージ {FRESH.length}通</span>
              <span>正解</span>
              <span>自分のルール</span>
              <span>学習モデル</span>
            </div>
            {FRESH.map((m) => (
              <div className="duel-row" key={m.text}>
                <span className="msg">{m.text}</span>
                <span className="verdict-cell">
                  <span className={`tag ${m.spam ? "spam" : "ok"}`}>{m.spam ? "スパム" : "正常"}</span>
                </span>
                <Verdict spam={ruleSays(m)} truth={m.spam} />
                <Verdict spam={modelSays(m)} truth={m.spam} />
              </div>
            ))}
          </div>
          <div className="duel-score">
            <span>
              自分のルール <b>{hits(FRESH, ruleSays)}</b> / {FRESH.length}
            </span>
            <span>
              学習モデル <b>{hits(FRESH, modelSays)}</b> / {FRESH.length}
            </span>
          </div>
          <p className="lab-tip">
            {hits(FRESH, ruleSays) < hits(FRESH, modelSays)
              ? "ルールは知っているメッセージにはよく当たっても、新しいごまかしや例外には弱いのです。そのたびに人がルールを書き足さなければなりません。"
              : "今回はルールもよくがんばりました！でも明日新しいごまかしが出てきたら、そのルールはだれが直すのでしょう？"}
          </p>
          <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
            学習モデルは単語ごとの点数を足して判断します。点数は説明用の例です。
          </p>
        </>
      )}
    </div>
  );
}
