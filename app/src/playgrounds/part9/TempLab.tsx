import { useState } from "react";
import { SCORES81 } from "../../data/ch81";
import { TOY_PROMPT, generate, oddMask, softmaxT } from "../../data/part9-toy";
import "./style.css";

const SC = SCORES81.map((s) => s.s);
const PRESETS = [0, 0.5, 1, 2, 3];
const fmt = (v: number) => (v < -0.005 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));
const pct = (p: number) => (p > 0 && p < 0.001 ? "0.1% 미만" : `${(p * 100).toFixed(1)}%`);

type Run = { pieces: string[]; odd: boolean[] };

export function TempLab() {
  const [t, setT] = useState(1);
  const [runs, setRuns] = useState<{ t: number; list: Run[] } | null>(null);
  const [done, setDone] = useState({ same: false, diff: false, pizza: false });
  const p = softmaxT(SC, t);

  const write = () => {
    const list = Array.from({ length: 5 }, () => {
      const pieces = generate(t, Math.random);
      return { pieces, odd: oddMask(pieces) };
    });
    setRuns({ t, list });
    const uniq = new Set(list.map((r) => r.pieces.join(" "))).size;
    setDone((d) => ({
      same: d.same || uniq === 1,
      diff: d.diff || uniq === 5,
      pizza: d.pizza || list.some((r) => r.pieces[0] === "피자"),
    }));
  };

  const uniq = runs ? new Set(runs.list.map((r) => r.pieces.join(" "))).size : 0;
  const oddRuns = runs ? runs.list.filter((r) => r.odd.some(Boolean)).length : 0;

  const tip =
    t === 0
      ? "온도 0은 '그리디'로 약속해요. 1등만 100%라서 문장이 매번 똑같아요."
      : t < 0.6
        ? "뾰족해요. '간다'가 거의 다 가져가요. 문장도 비슷비슷해질 거예요."
        : t <= 1.3
          ? "보통 온도예요. 1등이 자주 뽑히지만 다른 말도 꽤 나와요."
          : "평평해요. 피자처럼 낮던 후보가 쑥 올라와요. 엉뚱한 문장이 늘어나요.";

  return (
    <div>
      <div className="lab-row">
        <span>온도</span>
        <input type="range" min={0} max={3} step={0.1} value={t} aria-label="온도" onChange={(e) => setT(Number(e.target.value))} />
        <span className="val">{t.toFixed(1)}</span>
      </div>
      <div className="p9-seg" role="group" aria-label="온도 빠르게 고르기" style={{ marginTop: 8 }}>
        {PRESETS.map((v) => (
          <button key={v} aria-pressed={Math.abs(t - v) < 0.05} onClick={() => setT(v)}>
            {v === 0 ? "0 (그리디)" : v.toFixed(1)}
          </button>
        ))}
      </div>

      <div className="lab-out">
        <div className="bars">
          {SCORES81.map((c, i) => (
            <div className="bar-row" key={c.w}>
              <span className="label">{c.w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${p[i] * 100}%`, background: `var(--hl-${c.c})` }} />
              </span>
              <span className="val">{pct(p[i])}</span>
            </div>
          ))}
        </div>
        <div className="lab-sum num">
          {t === 0 ? "온도 0 → 나누지 않고 1등에게 100%" : `점수 ÷ ${t.toFixed(1)} = ${SC.map((s) => fmt(s / t)).join(", ")} → 소프트맥스`}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={write}>
          이 온도로 문장 5개 쓰기
        </button>
      </div>

      {runs && (
        <>
          <p className="p9-note" style={{ marginTop: 12 }}>
            온도 {runs.t.toFixed(1)}에서 쓴 문장 · 서로 다른 문장 {uniq}개 · 엉뚱한 말이 섞인 문장 {oddRuns}개
          </p>
          <ol className="p9-runs" aria-live="polite">
            {runs.list.map((r, i) => (
              <li key={i}>
                <span className="muted">{TOY_PROMPT.join(" ")} </span>
                {r.pieces.map((w, k) => {
                  const sep = k === 0 || w === "." || w === "…" ? "" : " ";
                  return (
                    <span key={k}>
                      {sep}
                      <span className={r.odd[k] ? "p9-odd" : undefined}>{w}</span>
                    </span>
                  );
                })}
              </li>
            ))}
          </ol>
        </>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.same}>{done.same ? "○" : "□"} 5개가 전부 똑같은 문장이 나오게 하기</li>
        <li data-done={done.diff}>{done.diff ? "○" : "□"} 5개가 전부 다른 문장이 나오게 하기</li>
        <li data-done={done.pizza}>{done.pizza ? "○" : "□"} '나는 오늘 학교에 피자…'로 시작하는 문장 만들기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">점수는 14장과 같은 설명용 예시예요. 문장은 바로 앞 말만 보는 장난감 모델이 써요. 분홍색은 점수가 낮던 엉뚱한 말이에요.</p>
    </div>
  );
}
