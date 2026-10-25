import { useState } from "react";
import { BANNED, REQUESTS, naiveRefuses } from "../../data/ch79";
import "./style.css";

const Tag = ({ help, wrong }: { help: boolean; wrong?: boolean }) => <span className={`p8-tag ${help ? "help" : "no"}${wrong ? " bad" : ""}`}>{help ? "도와줌" : "거절"}</span>;

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
            나<b>{me.ok} / {REQUESTS.length}</b>
            괜찮은데 거절 {me.over} · 위험한데 도와줌 {me.under}
          </div>
          <div className="p8-stat">
            금지 단어 규칙 AI<b>{rule.ok} / {REQUESTS.length}</b>
            괜찮은데 거절 {rule.over} · 위험한데 도와줌 {rule.under}
          </div>
        </div>
        <p className="lab-sum" style={{ margin: "8px 0 0" }}>
          규칙 AI는 이 단어 중 하나라도 있으면 거절해요: {BANNED.map((w) => `'${w}'`).join(", ")}
        </p>
        <div className="p8-sorted">
          {REQUESTS.map((r, k) => {
            const ruleHelp = !naiveRefuses(r.text);
            return (
              <div className="p8-sorted-row" key={r.text}>
                <span>{r.text}</span>
                <span style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span className="muted" style={{ fontSize: 12 }}>나</span>
                  <Tag help={mine[k]} wrong={mine[k] !== r.help} />
                  <span className="muted" style={{ fontSize: 12 }}>규칙</span>
                  <Tag help={ruleHelp} wrong={ruleHelp !== r.help} />
                </span>
                <span className="p8-why">
                  알맞은 답: {r.help ? "도와준다" : "거절하고 다른 길 안내"}. {r.why}
                </span>
              </div>
            );
          })}
        </div>
        <p className="lab-tip">
          금지 단어 규칙은 '칼', '없애' 같은 단어만 보고 괜찮은 부탁을 막고, 금지 단어가 없는 위험한 부탁은 그냥 통과시켜요. 4장 스팸 필터의 규칙 방식과 똑같은 약점이죠. 그래서 ChatGPT는 문장 전체의 뜻을 보고 판단하도록, 사람의 예시와 평가로 배워요(73, 76장).
        </p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setMine([]);
              setShown(false);
            }}
          >
            처음부터 다시
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
        부탁 {Math.min(i + (shown ? 0 : 1), REQUESTS.length)} / {REQUESTS.length}
      </div>
      {shown && prev && last !== null ? (
        <>
          <div className="p8-req" key={`f${i}`}>
            {prev.text}
            <small>
              내 선택: {last ? "도와준다" : "거절하고 다른 길 안내"} {last === prev.help ? "○" : "×"}
            </small>
          </div>
          <p className="lab-tip">
            {last === prev.help ? "좋아요! " : prev.help ? "괜찮은 부탁이었어요. " : "위험한 부탁이었어요. "}
            {prev.why}
          </p>
          <div className="lab-actions">
            <button className="btn" onClick={() => setShown(false)}>
              {i >= REQUESTS.length ? "결과 보기" : "다음 부탁"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p8-req" key={`q${i}`}>
            {r.text}
            <small>AI라면 어떻게 할까요?</small>
          </div>
          <div className="p8-bins" role="group" aria-label="도와줄까, 거절할까">
            <button
              className="help"
              onClick={() => {
                setMine([...mine, true]);
                setShown(true);
              }}
            >
              도와준다
            </button>
            <button
              className="no"
              onClick={() => {
                setMine([...mine, false]);
                setShown(true);
              }}
            >
              거절하고 다른 길 안내
            </button>
          </div>
        </>
      )}
    </div>
  );
}
