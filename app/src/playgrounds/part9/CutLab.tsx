import { useEffect, useState } from "react";
import { PRESETS82, keepTopK, keepTopP, renorm } from "../../data/ch82";
import { pickIndex } from "../../data/part9-toy";
import "./style.css";

type Mode = "k" | "p";
const pc = (p: number) => `${Math.round(p * 1000) / 10}%`;

export function CutLab() {
  const [key, setKey] = useState(PRESETS82[0].key);
  const [mode, setMode] = useState<Mode>("k");
  const [k, setK] = useState(3);
  const [p, setP] = useState(0.9);
  const [counts, setCounts] = useState<number[] | null>(null);
  const [seen, setSeen] = useState({ sure1: false, unsure6: false, pSure: false, pUnsure: false });

  const preset = PRESETS82.find((d) => d.key === key)!;
  const items = preset.items;
  const kk = Math.min(k, items.length);
  const keep = mode === "k" ? keepTopK(items, kk) : keepTopP(items, p);
  const probs = renorm(items, keep);
  const cum = items.map((_, i) => items.slice(0, i + 1).reduce((a, b) => a + b.p, 0));

  // missions stay done once reached
  const p90 = mode === "p" && Math.abs(p - 0.9) < 0.01;
  useEffect(() => {
    setSeen((s) => {
      const n = {
        sure1: s.sure1 || (key === "sure" && keep === 1),
        unsure6: s.unsure6 || (key === "unsure" && keep === 6),
        pSure: s.pSure || (key === "sure" && p90),
        pUnsure: s.pUnsure || (key === "unsure" && p90),
      };
      return n.sure1 === s.sure1 && n.unsure6 === s.unsure6 && n.pSure === s.pSure && n.pUnsure === s.pUnsure ? s : n;
    });
  }, [key, keep, p90]);
  const now = seen;

  const change = (f: () => void) => {
    f();
    setCounts(null);
  };
  const draw = () => {
    const c = items.map(() => 0);
    for (let i = 0; i < 10; i++) c[pickIndex(probs, Math.random())]++;
    setCounts(c);
  };

  const cutNames = items.slice(keep).map((it) => it.w);
  let tip: string;
  if (key === "school") tip = cutNames.includes("피자") ? `${cutNames.length}개를 잘랐어요. 피자와 기타 꼬리가 사라져서 엉뚱한 말이 뽑힐 일이 없어요.` : "아직 피자가 남아 있어요. 더 잘라 볼까요?";
  else if (key === "sure") tip = keep === 1 ? "정답 9만 남았어요. 모델이 확신할 땐 하나만 남기는 게 안전해요." : `${keep}개가 남았어요. 8이나 11 같은 틀린 답도 가끔 뽑혀요.`;
  else tip = keep <= 3 ? "포도·수박·복숭아처럼 멀쩡한 답까지 잘렸어요. Top-p 90%로 바꿔 보세요." : cutNames.includes("의자") ? `${keep}개가 남았어요. 엉뚱한 '의자'만 잘리고 여러 과일이 골고루 남았어요.` : "의자까지 남아 있어요. 조금만 더 잘라 볼까요?";

  return (
    <div>
      <div className="ctx-presets p9-tall" role="group" aria-label="문장 고르기" style={{ marginTop: 0 }}>
        {PRESETS82.map((d) => (
          <button key={d.key} aria-pressed={d.key === key} onClick={() => change(() => setKey(d.key))} style={d.key === key ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {d.name} ___
          </button>
        ))}
      </div>

      <div className="p9-seg" role="group" aria-label="자르는 방법" style={{ marginTop: 12 }}>
        <button aria-pressed={mode === "k"} onClick={() => change(() => setMode("k"))}>
          Top-k
        </button>
        <button aria-pressed={mode === "p"} onClick={() => change(() => setMode("p"))}>
          Top-p
        </button>
      </div>
      <div className="lab-row" style={{ marginTop: 10 }}>
        <span>{mode === "k" ? "k" : "p"}</span>
        {mode === "k" ? (
          <input type="range" min={1} max={items.length} step={1} value={kk} aria-label="남길 후보 수 k" onChange={(e) => change(() => setK(Number(e.target.value)))} />
        ) : (
          <input type="range" min={0.5} max={1} step={0.05} value={p} aria-label="더할 확률 기준 p" onChange={(e) => change(() => setP(Number(e.target.value)))} />
        )}
        <span className="val">{mode === "k" ? `${kk}개` : `${Math.round(p * 100)}%`}</span>
      </div>

      <div className="lab-out">
        <div className="p9-cut-head">
          <span>후보</span>
          <span>원래 확률</span>
          <span>{mode === "p" ? "더한 값" : ""}</span>
          <span>자른 뒤</span>
        </div>
        <div className="bars">
          {items.map((it, i) => {
            const kept = i < keep;
            return (
              <div className="p9-cut-row" key={it.w} data-cut={!kept}>
                <span className="label">{it.w}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${it.p * 100}%`, background: kept ? (it.c ? `var(--hl-${it.c})` : "var(--ink-3)") : "var(--line)" }} />
                </span>
                <span className="n muted">{mode === "p" && i <= keep - 1 ? pc(cum[i]) : ""}</span>
                <span className="n">{kept ? pc(probs[i]) : "잘림"}</span>
              </div>
            );
          })}
        </div>
        <div className="lab-sum">
          남은 후보 {keep}개 · 남은 확률 {pc(cum[keep - 1])}를 다시 나눠 합 100%
          {key === "school" ? " · 기타 = 수만 개 조각을 합친 것" : ""}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={draw}>
          남은 후보로 룰렛 10번
        </button>
      </div>
      {counts && (
        <p className="p9-draws" aria-live="polite">
          {items.map((it, i) =>
            counts[i] > 0 ? (
              <span key={it.w} className={`chip ${it.c ? `hl-${it.c}` : "hl-none"}`}>
                {it.w} {counts[i]}번
              </span>
            ) : null,
          )}
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={now.sure1}>{now.sure1 ? "○" : "□"} '1, 3, 5, 7,'에서 정답 9만 남기기</li>
        <li data-done={now.unsure6}>{now.unsure6 ? "○" : "□"} 과일 문장에서 엉뚱한 '의자'만 잘라 내기</li>
        <li data-done={now.pSure && now.pUnsure}>{now.pSure && now.pUnsure ? "○" : "□"} Top-p 90%로 두 문장(1, 3, 5, 7 / 과일)을 비교하기: 남는 개수가 같나요?</li>
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">확률은 설명용 예시예요.</p>
    </div>
  );
}
