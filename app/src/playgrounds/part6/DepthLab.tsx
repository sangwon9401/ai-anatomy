import { useState } from "react";
import { DEPTH_NOTES, peekAt } from "../../data/ch58";
import "./style.css";

/** 간다 is ahead of every other single word (by more than a rounding hair) */
const ganLeads = (layer: number) => {
  const p = peekAt(layer);
  return p[0].now > Math.max(...p.slice(1).map((r) => r.now)) + 0.2;
};
const FIRST_GAN = Array.from({ length: 96 }, (_, i) => i + 1).find(ganLeads) ?? 96;

/** 58장: walk down the 96 layers and watch '학교에' fill up. */
export function DepthLab() {
  const [layer, setLayer] = useState(1);
  const [found, setFound] = useState(false);
  const [bottom, setBottom] = useState(false);
  const peek = peekAt(layer);
  const rest = 100 - peek.reduce((a, r) => a + r.now, 0);
  const leads = ganLeads(layer);
  const tint = Math.round(12 + (layer / 96) * 88);

  const move = (v: number) => {
    setLayer(v);
    if (v === FIRST_GAN) setFound(true);
    if (v === 96) setBottom(true);
  };

  let tip = "슬라이더를 천천히 내려 보세요. '간다'가 1등이 되는 층은 어디일까요?";
  if (layer === FIRST_GAN) tip = `바로 ${layer}층부터 '간다'가 1등이에요!`;
  else if (leads && layer === 96) tip = "96층을 다 지나면 간다 52%, 갔다 21%, 늦었다 12%. 1장에서 본 그 숫자예요!";
  else if (leads) tip = "'간다'가 1등이에요. 더 깊이 갈수록 더 자신 있어져요.";
  else if (layer < 12) tip = "얕은 층에서는 아직 감이 없어요. 후보들이 다 고만고만하죠.";

  return (
    <div>
      <div className="lab-rows">
        <div className="lab-row">
          <span>층</span>
          <input type="range" min={1} max={96} step={1} value={layer} aria-label="몇 번째 층" onChange={(e) => move(Number(e.target.value))} />
          <span className="val">{layer}</span>
        </div>
      </div>

      <div className="p6-depth">
        <span
          className="chip"
          style={{ fontSize: 20, background: `color-mix(in srgb, var(--hl-yellow) ${tint}%, var(--paper))`, color: tint > 50 ? "var(--chip-ink)" : "var(--ink)", border: "2px solid var(--ink)" }}
        >
          학교에
        </span>
        <span className="muted">{layer}층을 지난 벡터</span>
      </div>

      <p className="p6-label">이 벡터에 쌓인 정보 (설명용)</p>
      <ul className="p6-notes">
        {DEPTH_NOTES.map((d) => (
          <li key={d.layer} data-on={layer >= d.layer}>
            <span className="n">{d.layer}층~</span>
            <span>{layer >= d.layer ? d.note : "?"}</span>
          </li>
        ))}
      </ul>

      <p className="p6-label">여기서 다음 말을 미리 들여다보면</p>
      <div className="bars">
        {peek.map((r) => (
          <div className="bar-row" key={r.w}>
            <span className="label">{r.w}</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${r.now}%`, background: `var(--hl-${r.c})` }} />
            </span>
            <span className="val">{Math.round(r.now)}%</span>
          </div>
        ))}
        <div className="bar-row">
          <span className="label">나머지</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${rest}%`, background: "var(--line)" }} />
          </span>
          <span className="val">{Math.round(rest)}%</span>
        </div>
      </div>
      <p className="p6-note">'나머지'는 약 5만 개 토큰을 다 합친 몫이에요. 층별 숫자는 설명용 예시예요.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={found}>{found ? "✓" : "○"} '간다'가 처음 1등이 되는 층 찾기</li>
        <li data-done={bottom}>{bottom ? "✓" : "○"} 96층까지 내려가 보기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
