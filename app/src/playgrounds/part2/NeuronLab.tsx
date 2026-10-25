import { useState } from "react";
import { FEATURES, GOOD, NEURON, STORES, neuron, num } from "../../data/part2-toy";
import "./style.css";

const fmtW = (w: number) => (w < 0 ? `(${num(w)})` : num(w));

export function NeuronLab() {
  const [w, setW] = useState<number[]>([...NEURON.w]);
  const [b, setB] = useState(NEURON.b);
  const [sel, setSel] = useState(0);

  const rows = STORES.map((s) => {
    const score = neuron(s.x, w, b);
    const says = score >= GOOD;
    const truth = s.real >= GOOD;
    return { ...s, score, says, truth, ok: says === truth };
  });
  const okCount = rows.filter((r) => r.ok).length;
  const firstWrong = rows.find((r) => !r.ok);
  const cur = rows[sel];

  let tip: string;
  if (!firstWrong) tip = "다섯 곳 모두 친구들과 같아졌어요! 손잡이를 맞추는 것, 이게 '학습'이에요. 20장부터는 컴퓨터가 이걸 스스로 해요.";
  else if (firstWrong.truth) tip = `${okCount}곳이 맞아요. ${firstWrong.name}는 친구들이 맛집이래요. 어떤 손잡이를 돌려야 ${firstWrong.name}의 점수가 4점을 넘을까요?`;
  else tip = `${okCount}곳이 맞아요. ${firstWrong.name}는 친구들이 별로래요. 점수를 4점 아래로 내려 보세요. 다른 가게가 같이 바뀌는지도 살펴보세요.`;

  return (
    <div>
      <div className="lab-rows p2-sliders">
        {FEATURES.map((f, i) => (
          <div className="lab-row" key={f.key}>
            <span>{f.name} 가중치</span>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.5}
              value={w[i]}
              aria-label={`${f.name} 가중치`}
              onChange={(e) => {
                const v = Number(e.target.value);
                setW((prev) => prev.map((x, j) => (j === i ? v : x)));
              }}
            />
            <span className="val">{num(w[i])}</span>
          </div>
        ))}
        <div className="lab-row">
          <span>편향</span>
          <input type="range" min={-4} max={6} step={0.5} value={b} aria-label="편향" onChange={(e) => setB(Number(e.target.value))} />
          <span className="val">{num(b)}</span>
        </div>
      </div>

      <div className="p2-stores" role="group" aria-label="가게 고르기">
        <div className="p2-store-head">
          <span>가게</span>
          <span>맵기 · 줄 · 가격</span>
          <span>뉴런</span>
          <span>친구들</span>
        </div>
        {rows.map((r, i) => (
          <button key={r.name} className="p2-store" aria-pressed={i === sel} onClick={() => setSel(i)}>
            <span className="name">{r.name.replace("가게 ", "")}</span>
            <span className="ins">
              {r.x[0]} · {r.x[1]} · {r.x[2]}
            </span>
            <span className="score" style={{ background: r.says ? "var(--hl-mint)" : "var(--hl-pink)" }}>
              {num(r.score)} {r.says ? "맛집" : "아님"}
            </span>
            <span className="friend">
              {r.truth ? "맛집" : "아님"}
              <span className={`p2-mark${r.ok ? " ok" : ""}`}>{r.ok ? "○" : "✗"}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="p2-calc">
        {cur.name}: {cur.x.map((x, i) => `${x}×${fmtW(w[i])}`).join(" + ")} + {fmtW(b)} = <b>{num(cur.score)}</b>
        {" → "}
        {cur.score >= GOOD ? "4점 이상, 맛집" : "4점 미만, 맛집 아님"}
      </p>
      <p className="p2-note">맵기는 단계, 줄은 기다리는 팀 수, 가격은 천 원 단위예요. 가게와 숫자는 설명용 예시예요.</p>

      <div className="lab-actions">
        <button
          className="btn ghost"
          onClick={() => {
            setW([...NEURON.w]);
            setB(NEURON.b);
          }}
        >
          처음 값으로
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
