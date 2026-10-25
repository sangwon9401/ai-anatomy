import { useState } from "react";
import { DISTS } from "../data/ch13";

function drawOne(items: { p: number }[]) {
  let r = Math.random();
  for (let i = 0; i < items.length; i++) {
    r -= items[i].p;
    if (r <= 0) return i;
  }
  return items.length - 1;
}

export function SamplingLab() {
  const [key, setKey] = useState(DISTS[1].key);
  const dist = DISTS.find((d) => d.key === key)!;
  const [counts, setCounts] = useState<number[]>(() => dist.items.map(() => 0));
  const [last, setLast] = useState<number | null>(null);
  const total = counts.reduce((a, b) => a + b, 0);

  const pick = (k: string) => {
    setKey(k);
    setCounts(DISTS.find((d) => d.key === k)!.items.map(() => 0));
    setLast(null);
  };
  const draw = (n: number) => {
    const next = [...counts];
    let i = 0;
    for (let k = 0; k < n; k++) {
      i = drawOne(dist.items);
      next[i]++;
    }
    setCounts(next);
    setLast(i);
  };

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="분포 고르기">
        {DISTS.map((d) => (
          <button key={d.key} aria-pressed={d.key === key} onClick={() => pick(d.key)} style={d.key === key ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {d.name}
          </button>
        ))}
      </div>
      <div className="sample-head">
        <span>후보</span>
        <span>확률</span>
        <span>뽑힌 비율</span>
      </div>
      <div className="bars">
        {dist.items.map((it, i) => (
          <div className="sample-row" key={it.w} data-last={last === i}>
            <span className="label">{it.w}</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${it.p * 100}%`, background: `var(--hl-${it.c})` }} />
            </span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${total ? (counts[i] / total) * 100 : 0}%`, background: "var(--ink-2)" }} />
            </span>
            <span className="val num">{counts[i]}</span>
          </div>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={() => draw(1)}>
          1번 뽑기
        </button>
        <button className="btn ghost" onClick={() => draw(100)}>
          100번 뽑기
        </button>
        <button className="btn ghost" onClick={() => pick(key)}>
          초기화
        </button>
      </div>
      <p className="lab-tip">
        {total === 0
          ? "뽑기를 눌러 보세요."
          : total < 50
            ? `${total}번 뽑았어요. 몇 번만 뽑으면 비율이 들쭉날쭉해요.`
            : `${total}번 뽑았어요. 많이 뽑을수록 회색 막대가 색 막대(확률)와 비슷해져요.`}
      </p>
    </div>
  );
}
