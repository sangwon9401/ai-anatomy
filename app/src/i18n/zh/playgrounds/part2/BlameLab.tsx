import { useState } from "react";
import { LR23, blame, step } from "../../../../data/ch23";
import { NET, STORES, num, type Net } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

const IN_NAMES = ["辣度", "排队", "价格"];
const H_NAMES = ["人气", "太辣"];
type Knob = { id: string; label: string; kind: "w" | "b" | "v" | "c"; j: number; i: number };
const KNOBS: Knob[] = [
  ...[0, 1].flatMap((j) => [0, 1, 2].map((i) => ({ id: `w${j}${i}`, label: `${IN_NAMES[i]}→${H_NAMES[j]}`, kind: "w" as const, j, i }))),
  { id: "b0", label: "人气偏置", kind: "b", j: 0, i: 0 },
  { id: "b1", label: "太辣偏置", kind: "b", j: 1, i: 0 },
  { id: "v0", label: "人气→评分", kind: "v", j: 0, i: 0 },
  { id: "v1", label: "太辣→评分", kind: "v", j: 1, i: 0 },
  { id: "c", label: "评分偏置", kind: "c", j: 0, i: 0 },
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
  if (knob.kind === "c") chain = `损失←评分 ${paren(g.dy)} × 1 = ${num(grad(knob), 3)}`;
  else if (knob.kind === "v") chain = `损失←评分 ${paren(g.dy)} × ${H_NAMES[knob.j]}的值 ${paren(g.f.h[knob.j])} = ${num(grad(knob), 3)}`;
  else {
    const last = knob.kind === "w" ? `输入${IN_NAMES[knob.i]} ${s.x[knob.i]}` : "1";
    chain = `损失←评分 ${paren(g.dy)} × 评分←${H_NAMES[knob.j]} ${paren(net.v[knob.j])} × ReLU ${on ? "亮 1" : "关 0"} × ${last} = ${num(grad(knob), 3)}`;
  }
  const dl = (blame(nudged(net, knob, 0.01), s.x, s.real).loss - g.loss);

  const tip =
    g.loss < 0.01
      ? `损失 ${num(g.loss, 4)}！按责任朝反方向一次次调整，几乎猜对了。换一家店也试试。`
      : !on && (knob.kind === "w" || knob.kind === "b")
        ? `“${H_NAMES[knob.j]}”神经元是关着的，所以这个旋钮的责任是 0。改了也没用，就不动它。`
        : "责任越大（条越长），改得越多。用“改一步”把损失降到 0.01 以下。";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选择店铺">
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
            {STORES[p].name} ({STORES[p].x.join(", ")}) 真实 {num(STORES[p].real)} 分
          </button>
        ))}
      </div>
      <p className="p2-calc">
        预测 <b>{num(g.f.y, 3)}</b> 分 · 真实 {num(s.real)} 分 · 损失 <b>{num(g.loss, 4)}</b>
        <br />
        人气 = {num(g.f.h[0], 3)}，太辣 = {num(g.f.h[1], 3)} {g.f.h[1] === 0 ? "（关）" : "（亮）"} · 已调整 {steps} 次
      </p>

      <div className="p2-knobs" role="group" aria-label="选择旋钮">
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
      <p className="p2-note">左边的数 = 旋钮的值，右边的红色数字 = 责任。权重是示意数据。</p>

      <div className="p2-calc">
        <b>{knob.label}</b>的责任
        <br />
        {chain}
        <br />
        验证：调高 0.01，损失 {dl < 0 ? "−" : "+"}
        {num(Math.abs(dl), 4)} （≈ 责任 × 0.01 = {num(grad(knob) * 0.01, 4)}）
      </div>

      <div className="lab-actions">
        <button
          className="btn"
          onClick={() => {
            setNet((n) => step(n, s.x, s.real, LRS[store]));
            setSteps((k) => k + 1);
          }}
        >
          改一步
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setNet(NET);
            setSteps(0);
          }}
        >
          回到开始
        </button>
      </div>
      <p className="p2-note">
        一步 = 把所有旋钮同时改成“旋钮 − {LRS[store]} × 责任”。{store === 1 && "B 店的输入大，责任也大，所以把步长（学习率）调小了（第 22 章）。"}
      </p>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
