import { useState } from "react";
import { FEATURES, GOOD, NEURON, STORES, neuron, num } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

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
  if (!firstWrong) tip = "5軒すべてで友だちと同じになりました！つまみを合わせること、これが「学習」です。第20章からは、コンピューターがこれを自分でやります。";
  else if (firstWrong.truth) tip = `${okCount}軒が合っています。${firstWrong.name}は、友だちによると当たりだそうです。どのつまみを回せば、${firstWrong.name}の点数が4点を超えるでしょう？`;
  else tip = `${okCount}軒が合っています。${firstWrong.name}は、友だちによるとはずれだそうです。点数を4点より下げてみましょう。ほかの店もいっしょに変わらないか見てみましょう。`;

  return (
    <div>
      <div className="lab-rows p2-sliders">
        {FEATURES.map((f, i) => (
          <div className="lab-row" key={f.key}>
            <span>{f.name}の重み</span>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.5}
              value={w[i]}
              aria-label={`${f.name}の重み`}
              onChange={(e) => {
                const v = Number(e.target.value);
                setW((prev) => prev.map((x, j) => (j === i ? v : x)));
              }}
            />
            <span className="val">{num(w[i])}</span>
          </div>
        ))}
        <div className="lab-row">
          <span>バイアス</span>
          <input type="range" min={-4} max={6} step={0.5} value={b} aria-label="バイアス" onChange={(e) => setB(Number(e.target.value))} />
          <span className="val">{num(b)}</span>
        </div>
      </div>

      <div className="p2-stores" role="group" aria-label="店を選ぶ">
        <div className="p2-store-head">
          <span>店</span>
          <span>辛さ · 待ち · 値段</span>
          <span>ニューロン</span>
          <span>友だち</span>
        </div>
        {rows.map((r, i) => (
          <button key={r.name} className="p2-store" aria-pressed={i === sel} onClick={() => setSel(i)}>
            <span className="name">{r.name.replace("店", "")}</span>
            <span className="ins">
              {r.x[0]} · {r.x[1]} · {r.x[2]}
            </span>
            <span className="score" style={{ background: r.says ? "var(--hl-mint)" : "var(--hl-pink)" }}>
              {num(r.score)} {r.says ? "当たり" : "はずれ"}
            </span>
            <span className="friend">
              {r.truth ? "当たり" : "はずれ"}
              <span className={`p2-mark${r.ok ? " ok" : ""}`}>{r.ok ? "○" : "✗"}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="p2-calc">
        {cur.name}: {cur.x.map((x, i) => `${x}×${fmtW(w[i])}`).join(" + ")} + {fmtW(b)} = <b>{num(cur.score)}</b>
        {" → "}
        {cur.score >= GOOD ? "4点以上、当たり" : "4点未満、はずれ"}
      </p>
      <p className="p2-note">辛さは段階、待ちは待っている組の数、値段は100円単位です。店と数字は説明用の例です。</p>

      <div className="lab-actions">
        <button
          className="btn ghost"
          onClick={() => {
            setW([...NEURON.w]);
            setB(NEURON.b);
          }}
        >
          最初の値に戻す
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
