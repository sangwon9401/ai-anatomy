import { useState } from "react";
import { FRAMES, PROBES } from "../../data/ch72";
import "./style.css";

const TIPS: Record<string, string> = {
  plain: "질문만 덩그러니 있으면 '질문 모음' 같은 글로 보여요. 그래서 질문이 또 이어지기 쉬워요.",
  exam: "시험지에서는 1번 문제 다음에 2번 문제가 오죠. 답은 시험지에 적혀 있지 않아요.",
  qa: "'답:' 자리가 비어 있으니, 그다음 조각으로는 답이 오는 게 가장 그럴듯해요.",
  script: "대본에서 학생이 물으면 다음 줄은 선생님의 대답이죠. 글의 모양이 답을 끌어냈어요.",
};

export function DocStarter() {
  const [probe, setProbe] = useState(0);
  const [frame, setFrame] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const p = PROBES[probe];
  const f = FRAMES.find((x) => x.key === frame);
  const out = frame ? p.out[frame] : null;
  const answerKeys = FRAMES.filter((x) => p.out[x.key].isAnswer).map((x) => x.key);
  const done = answerKeys.every((k) => found.includes(k));

  const pick = (key: string) => {
    setFrame(key);
    if (p.out[key].isAnswer && !found.includes(key)) setFound([...found, key]);
  };

  return (
    <div>
      <div className="p8-seg" role="group" aria-label="질문 고르기">
        {PROBES.map((x, i) => (
          <button
            key={x.q}
            aria-pressed={probe === i}
            onClick={() => {
              setProbe(i);
              setFrame(null);
            }}
          >
            {x.q}
          </button>
        ))}
      </div>

      <p className="p8-label">글을 어떤 모양으로 시작할까요?</p>
      <div className="p8-grid2" role="group" aria-label="글의 첫머리">
        {FRAMES.map((x) => (
          <button key={x.key} className="p8-opt" aria-pressed={frame === x.key} onClick={() => pick(x.key)}>
            {x.name}
            {found.includes(x.key) && <span className="p8-sub">답이 나왔어요 ○</span>}
          </button>
        ))}
      </div>

      {f && out ? (
        <>
          <div className="p8-doc" aria-live="polite">
            {f.before}
            {p.q}
            {f.after}
            <span key={`${probe}-${frame}`} className="p8-cont">
              {out.text}
            </span>
          </div>
          <p className="p8-doc-cap">초록색이 베이스 모델이 이어 쓴 부분이에요.</p>
          <div className="p8-meter">
            <span className="p8-name">다음 조각으로 답이 올 확률</span>
            <span className="p8-track">
              <span className="p8-fill" style={{ width: `${out.answer * 100}%`, background: out.isAnswer ? "var(--hl-mint)" : "var(--ink-3)" }} />
            </span>
            <span className="p8-val">{Math.round(out.answer * 100)}%</span>
          </div>
          <p className="lab-tip">{done ? `대답이 나오는 시작 두 가지를 모두 찾았어요! 모델은 그대로인데, 글의 모양만 바꿔서 답을 끌어냈어요. ${TIPS[f.key]}` : TIPS[f.key]}</p>
        </>
      ) : (
        <p className="lab-tip">위에서 글의 첫머리를 하나 골라 보세요.</p>
      )}
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={answerKeys.filter((k) => found.includes(k)).length >= 1}>{answerKeys.filter((k) => found.includes(k)).length >= 1 ? "○" : "□"} 대답이 나오는 시작 하나 찾기</li>
        <li data-done={done}>{done ? "○" : "□"} 대답이 나오는 시작 두 가지 모두 찾기</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        이어 쓴 글과 확률은 베이스 모델이 흔히 보이는 모습을 흉내 낸 설명용 예시예요.
      </p>
    </div>
  );
}
