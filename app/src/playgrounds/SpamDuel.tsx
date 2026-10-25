import { useState } from "react";
import { FRESH, KNOWN, RULE_WORDS, scoreOf, type Msg } from "../data/ch04";

const Verdict = ({ spam, truth }: { spam: boolean; truth: boolean }) => (
  <span className="verdict-cell">
    <span className={`tag ${spam ? "spam" : "ok"}`}>{spam ? "스팸" : "정상"}</span>
    <span className={`mark ${spam === truth ? "" : "bad"}`} aria-label={spam === truth ? "맞음" : "틀림"}>
      {spam === truth ? "○" : "×"}
    </span>
  </span>
);

export function SpamDuel() {
  const [rule, setRule] = useState<string[]>(["무료"]);
  const [tested, setTested] = useState(false);
  const ruleSays = (m: Msg) => rule.some((k) => m.text.includes(k));
  const modelSays = (m: Msg) => scoreOf(m.text) > 0;
  const hits = (list: Msg[], f: (m: Msg) => boolean) => list.filter((m) => f(m) === m.spam).length;

  return (
    <div>
      <div className="rule-pick" role="group" aria-label="규칙에 넣을 단어">
        {RULE_WORDS.map((w) => (
          <button key={w} aria-pressed={rule.includes(w)} onClick={() => setRule((r) => (r.includes(w) ? r.filter((x) => x !== w) : [...r, w]))}>
            {w}
          </button>
        ))}
      </div>
      <p className="rule-line">
        내 규칙: {rule.length ? `'${rule.join("', '")}' 중 하나라도 있으면 스팸` : "단어를 하나 이상 골라 주세요"}
      </p>

      <div className="duel">
        <div className="duel-head">
          <span>아는 문자 {KNOWN.length}개</span>
          <span>정답</span>
          <span>내 규칙</span>
        </div>
        {KNOWN.map((m) => (
          <div className="duel-row" key={m.text}>
            <span className="msg">{m.text}</span>
            <span className="verdict-cell">
              <span className={`tag ${m.spam ? "spam" : "ok"}`}>{m.spam ? "스팸" : "정상"}</span>
            </span>
            <Verdict spam={ruleSays(m)} truth={m.spam} />
          </div>
        ))}
      </div>
      <div className="duel-score">
        <span>
          내 규칙 <b>{hits(KNOWN, ruleSays)}</b> / {KNOWN.length}
        </span>
      </div>

      {!tested ? (
        <div className="lab-actions">
          <button className="btn" onClick={() => setTested(true)}>
            처음 보는 문자로 시험하기
          </button>
        </div>
      ) : (
        <>
          <div className="duel three">
            <div className="duel-head">
              <span>처음 보는 문자 {FRESH.length}개</span>
              <span>정답</span>
              <span>내 규칙</span>
              <span>학습 모델</span>
            </div>
            {FRESH.map((m) => (
              <div className="duel-row" key={m.text}>
                <span className="msg">{m.text}</span>
                <span className="verdict-cell">
                  <span className={`tag ${m.spam ? "spam" : "ok"}`}>{m.spam ? "스팸" : "정상"}</span>
                </span>
                <Verdict spam={ruleSays(m)} truth={m.spam} />
                <Verdict spam={modelSays(m)} truth={m.spam} />
              </div>
            ))}
          </div>
          <div className="duel-score">
            <span>
              내 규칙 <b>{hits(FRESH, ruleSays)}</b> / {FRESH.length}
            </span>
            <span>
              학습 모델 <b>{hits(FRESH, modelSays)}</b> / {FRESH.length}
            </span>
          </div>
          <p className="lab-tip">
            {hits(FRESH, ruleSays) < hits(FRESH, modelSays)
              ? "규칙은 아는 문자에선 잘 맞아도, 새 꼼수와 예외 앞에선 무너져요. 그때마다 사람이 규칙을 또 써야 하죠."
              : "이번엔 규칙도 잘 버텼네요! 그런데 내일 새 꼼수가 나오면, 그 규칙은 누가 고칠까요?"}
          </p>
          <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
            학습 모델은 단어마다 점수를 더해 판단해요. 점수는 설명용 예시예요.
          </p>
        </>
      )}
    </div>
  );
}
