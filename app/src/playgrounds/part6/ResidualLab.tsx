import { useState } from "react";
import { GARBLE, PHONE, TOY_X0, garble, runLayers } from "../../data/ch56";
import "./style.css";
import { fmt } from "./util";
import { Vec } from "./Vec";

/** 56장: push a vector through up to 48 layers with and without the highway. */
export function ResidualLab() {
  const [n, setN] = useState(4);
  const [highway, setHighway] = useState(false);
  const [done, setDone] = useState({ off: false, on: false });
  const r = runLayers(n, highway);
  const pct = Math.round(r.keep * 100);
  const msg = garble(PHONE[0], Math.round((1 - r.keep) * GARBLE.length));

  const update = (nextN: number, nextHw: boolean) => {
    setN(nextN);
    setHighway(nextHw);
    if (nextN === 48) setDone((d) => ({ off: d.off || !nextHw, on: d.on || nextHw }));
  };

  let tip = "먼저 고속도로를 끈 채로 층 수를 48까지 올려 보세요.";
  if (!highway && pct < 20) tip = "처음 정보가 거의 다 사라졌어요. 층마다 벡터를 통째로 바꾸면 이렇게 돼요.";
  else if (!highway) tip = "층을 더 쌓을수록 처음과 점점 달라져요.";
  else if (n >= 24) tip = `처음 정보가 ${pct}%나 남아 있어요! 그런데 숫자 크기가 ${fmt(r.size0)}에서 ${fmt(r.size)}로 커졌죠? 이건 57장에서 해결해요.`;
  else tip = "고속도로가 켜져 있으면 층을 쌓아도 처음 정보가 잘 남아요. 48층까지 올려 보세요.";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="고속도로">
        <button aria-pressed={!highway} onClick={() => update(n, false)}>
          고속도로 끄기 (바꿔치기)
        </button>
        <button aria-pressed={highway} onClick={() => update(n, true)}>
          고속도로 켜기 (더하기)
        </button>
      </div>

      <div className="lab-rows" style={{ marginTop: 14 }}>
        <div className="lab-row">
          <span>층 수</span>
          <input type="range" min={1} max={48} step={1} value={n} aria-label="층 수" onChange={(e) => update(Number(e.target.value), highway)} />
          <span className="val">{n}</span>
        </div>
      </div>

      <p className="p6-label">처음 벡터</p>
      <Vec v={TOY_X0} label="처음 벡터" />
      <p className="p6-label">{n}층을 지난 뒤</p>
      <Vec v={r.x} label={`${n}층을 지난 뒤`} />

      <div className="lab-out">
        <div className="bars">
          <div className="bar-row">
            <span className="label">닮은 정도</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${pct}%`, background: "var(--hl-mint)" }} />
            </span>
            <span className="val">{pct}%</span>
          </div>
        </div>
        <p className="p6-msg" aria-label="말 전달 게임 비유">
          {[...msg].map((ch, i) => (
            <span key={i} className={ch !== PHONE[0][i] ? "bad" : undefined}>
              {ch}
            </span>
          ))}
        </p>
        <p className="p6-note">닮은 정도는 처음 벡터와 방향이 얼마나 같은지(9장)예요. 문장은 그 정도만큼 말이 바뀐 말 전달 게임 비유예요. 숫자는 설명용 예시예요.</p>
      </div>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.off}>{done.off ? "✓" : "○"} 고속도로를 끄고 48층 쌓아 보기</li>
        <li data-done={done.on}>{done.on ? "✓" : "○"} 고속도로를 켜고 48층 쌓아 보기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
