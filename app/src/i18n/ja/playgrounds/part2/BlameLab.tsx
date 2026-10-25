import { useState } from "react";
import { LR23, blame, step } from "../../../../data/ch23";
import { NET, STORES, num, type Net } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

const IN_NAMES = ["辛さ", "待ち", "値段"];
const H_NAMES = ["人気", "辛すぎ"];
type Knob = { id: string; label: string; kind: "w" | "b" | "v" | "c"; j: number; i: number };
const KNOBS: Knob[] = [
  ...[0, 1].flatMap((j) => [0, 1, 2].map((i) => ({ id: `w${j}${i}`, label: `${IN_NAMES[i]}→${H_NAMES[j]}`, kind: "w" as const, j, i }))),
  { id: "b0", label: "人気のバイアス", kind: "b", j: 0, i: 0 },
  { id: "b1", label: "辛すぎのバイアス", kind: "b", j: 1, i: 0 },
  { id: "v0", label: "人気→星", kind: "v", j: 0, i: 0 },
  { id: "v1", label: "辛すぎ→星", kind: "v", j: 1, i: 0 },
  { id: "c", label: "星のバイアス", kind: "c", j: 0, i: 0 },
];
const PICK = [0, 1]; // 가게 A, 가게 B
// 가게 B has bigger inputs, so bigger 책임: a smaller 보폭 keeps it from bouncing out (22장)
const LRS = [LR23, 0.002];
const valueOf = (n: Net, k: Knob) => (k.kind === "w" ? n.W1[k.j][k.i] : k.kind === "b" ? n.b1[k.j] : k.kind === "v" ? n.v[k.j] : n.c);
const nudged = (n: Net, k: Knob, d: number): Net => {
  const m: Net = JSON.parse(JSON.stringify(n));
  if (k.kind === "w") m.W1[k.j][k.i] += d;
  else if (k.kind === "b") m.b1[k.j] += d;
  else if (k.kind === "v") m.v[k.j] += d;
  else m.c += d;
  return m;
};
const paren = (v: number) => (v < 0 ? `(${num(v, 3)})` : num(v, 3));

export function BlameLab() {
  const [store, setStore] = useState(0);
  const [net, setNet] = useState<Net>(NET);
  const [sel, setSel] = useState("w01");
  const [steps, setSteps] = useState(0);
  const s = STORES[PICK[store]];
  const g = blame(net, s.x, s.real);
  const knob = KNOBS.find((k) => k.id === sel)!;
  const grad = (k: Knob) => (k.kind === "w" ? g.dW1[k.j][k.i] : k.kind === "b" ? g.db1[k.j] : k.kind === "v" ? g.dv[k.j] : g.dc);
  const maxG = Math.max(...KNOBS.map((k) => Math.abs(grad(k))), 1e-9);
  const on = g.f.z[knob.j] > 0;

  // the chain for the selected knob, read from the output backwards
  let chain: string;
  if (knob.kind === "c") chain = `損失←星 ${paren(g.dy)} × 1 = ${num(grad(knob), 3)}`;
  else if (knob.kind === "v") chain = `損失←星 ${paren(g.dy)} × ${H_NAMES[knob.j]}の値 ${paren(g.f.h[knob.j])} = ${num(grad(knob), 3)}`;
  else {
    const last = knob.kind === "w" ? `入力 ${IN_NAMES[knob.i]} ${s.x[knob.i]}` : "1";
    chain = `損失←星 ${paren(g.dy)} × 星←${H_NAMES[knob.j]} ${paren(net.v[knob.j])} × ReLU ${on ? "オン 1" : "オフ 0"} × ${last} = ${num(grad(knob), 3)}`;
  }
  const dl = (blame(nudged(net, knob, 0.01), s.x, s.real).loss - g.loss);

  const tip =
    g.loss < 0.01
      ? `損失 ${num(g.loss, 4)}！責任の分だけ反対に直すのをくり返したら、ほぼ正解になりました。店を変えてもやってみましょう。`
      : !on && (knob.kind === "w" || knob.kind === "b")
        ? `${H_NAMES[knob.j]}ニューロンがオフなので、このつまみの責任は0です。直しても意味がないので、そのままにします。`
        : "責任が大きいほど（棒が長いほど）大きく直されます。「一歩直す」で損失を0.01より下げてみましょう。";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="店を選ぶ">
        {PICK.map((p, k) => (
          <button
            key={p}
            aria-pressed={store === k}
            style={store === k ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}
            onClick={() => {
              setStore(k);
              setNet(NET);
              setSteps(0);
            }}
          >
            {STORES[p].name} ({STORES[p].x.join(", ")}) 本当は{num(STORES[p].real)}
          </button>
        ))}
      </div>
      <p className="p2-calc">
        予想 <b>{num(g.f.y, 3)}</b>点 · 本当は{num(s.real)} · 損失 <b>{num(g.loss, 4)}</b>
        <br />
        人気 = {num(g.f.h[0], 3)}、辛すぎ = {num(g.f.h[1], 3)} {g.f.h[1] === 0 ? "（オフ）" : "（オン）"} · 直した回数 {steps}
      </p>

      <div className="p2-knobs" role="group" aria-label="つまみを選ぶ">
        {KNOBS.map((k) => {
          const gk = grad(k);
          return (
            <button key={k.id} className="p2-knob" aria-pressed={k.id === sel} onClick={() => setSel(k.id)}>
              <span className="lbl">{k.label}</span>
              <span className="num val">{num(valueOf(net, k), 3)}</span>
              <span className="bar" aria-hidden="true">
                <span style={{ width: `${(Math.abs(gk) / maxG) * 100}%` }} />
              </span>
              <span className="num g">{gk === 0 ? "0" : num(gk, 2)}</span>
            </button>
          );
        })}
      </div>
      <p className="p2-note">左の数字 = つまみの値、右の赤い数字 = 責任。重みは説明用の例です。</p>

      <div className="p2-calc">
        <b>{knob.label}</b>の責任
        <br />
        {chain}
        <br />
        確認：0.01上げてみると損失 {dl < 0 ? "−" : "+"}
        {num(Math.abs(dl), 4)} （≈ 責任 × 0.01 = {num(grad(knob) * 0.01, 4)}）
      </div>

      <div className="lab-actions">
        <button
          className="btn"
          onClick={() => {
            setNet((n) => step(n, s.x, s.real, LRS[store]));
            setSteps((k) => k + 1);
          }}
        >
          一歩直す
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setNet(NET);
            setSteps(0);
          }}
        >
          最初に戻す
        </button>
      </div>
      <p className="p2-note">
        一歩 = すべてのつまみを同時に「つまみ − {LRS[store]} × 責任」に直すこと。{store === 1 && "B店は入力が大きいので責任も大きくなります。だから歩幅（学習率）を小さくしました（第22章）。"}
      </p>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
