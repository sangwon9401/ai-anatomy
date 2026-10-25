import { useState } from "react";
import { FRAMES, PROBES } from "../../../../data/ch72";
import "../../../../playgrounds/part8/style.css";

const TIPS: Record<string, string> = {
  plain: "只有一个问题时，它看起来像“问题合集”，所以很容易接着再写问题。",
  exam: "试卷上，第 1 题后面是第 2 题。答案不会写在试卷上。",
  qa: "“答：”后面空着，所以下一个片段最顺理成章的就是答案。",
  script: "对话里学生一提问，下一行就是老师的回答。是文字的样子把答案引了出来。",
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
      <div className="p8-seg" role="group" aria-label="选择问题">
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

      <p className="p8-label">用什么样的开头？</p>
      <div className="p8-grid2" role="group" aria-label="文字的开头">
        {FRAMES.map((x) => (
          <button key={x.key} className="p8-opt" aria-pressed={frame === x.key} onClick={() => pick(x.key)}>
            {x.name}
            {found.includes(x.key) && <span className="p8-sub">引出了回答 ○</span>}
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
          <p className="p8-doc-cap">绿色的部分是基础模型接着写的。</p>
          <div className="p8-meter">
            <span className="p8-name">下一个片段是答案的概率</span>
            <span className="p8-track">
              <span className="p8-fill" style={{ width: `${out.answer * 100}%`, background: out.isAnswer ? "var(--hl-mint)" : "var(--ink-3)" }} />
            </span>
            <span className="p8-val">{Math.round(out.answer * 100)}%</span>
          </div>
          <p className="lab-tip">{done ? `两种能引出回答的开头都找到了！模型没变，只是换了文字的样子，就引出了答案。${TIPS[f.key]}` : TIPS[f.key]}</p>
        </>
      ) : (
        <p className="lab-tip">在上面选一种开头吧。</p>
      )}
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={answerKeys.filter((k) => found.includes(k)).length >= 1}>{answerKeys.filter((k) => found.includes(k)).length >= 1 ? "○" : "□"} 找到一种能引出回答的开头</li>
        <li data-done={done}>{done ? "○" : "□"} 两种能引出回答的开头都找到</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        接着写的文字和概率，是模仿基础模型常见表现的示意数据。
      </p>
    </div>
  );
}
