import { useState } from "react";
import { LR23, blame, step } from "../../data/ch23";
import { NET, STORES, num, type Net } from "../../data/part2-toy";
import "./style.css";

const IN_NAMES = ["맵기", "줄", "가격"];
const H_NAMES = ["인기", "너무 매움"];
type Knob = { id: string; label: string; kind: "w" | "b" | "v" | "c"; j: number; i: number };
const KNOBS: Knob[] = [
  ...[0, 1].flatMap((j) => [0, 1, 2].map((i) => ({ id: `w${j}${i}`, label: `${IN_NAMES[i]}→${H_NAMES[j]}`, kind: "w" as const, j, i }))),
  { id: "b0", label: "인기 편향", kind: "b", j: 0, i: 0 },
  { id: "b1", label: "너무 매움 편향", kind: "b", j: 1, i: 0 },
  { id: "v0", label: "인기→별점", kind: "v", j: 0, i: 0 },
  { id: "v1", label: "너무 매움→별점", kind: "v", j: 1, i: 0 },
  { id: "c", label: "별점 편향", kind: "c", j: 0, i: 0 },
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
  if (knob.kind === "c") chain = `손실←별점 ${paren(g.dy)} × 1 = ${num(grad(knob), 3)}`;
  else if (knob.kind === "v") chain = `손실←별점 ${paren(g.dy)} × ${H_NAMES[knob.j]} 값 ${paren(g.f.h[knob.j])} = ${num(grad(knob), 3)}`;
  else {
    const last = knob.kind === "w" ? `입력 ${IN_NAMES[knob.i]} ${s.x[knob.i]}` : "1";
    chain = `손실←별점 ${paren(g.dy)} × 별점←${H_NAMES[knob.j]} ${paren(net.v[knob.j])} × ReLU ${on ? "켜짐 1" : "꺼짐 0"} × ${last} = ${num(grad(knob), 3)}`;
  }
  const dl = (blame(nudged(net, knob, 0.01), s.x, s.real).loss - g.loss);

  const tip =
    g.loss < 0.01
      ? `손실 ${num(g.loss, 4)}! 책임만큼 반대로 고치는 걸 되풀이했더니 거의 맞혔어요. 가게를 바꿔서도 해 보세요.`
      : !on && (knob.kind === "w" || knob.kind === "b")
        ? `${H_NAMES[knob.j]} 뉴런이 꺼져 있어서 이 손잡이의 책임은 0이에요. 고쳐도 소용없으니 그대로 둬요.`
        : "책임이 클수록(막대가 길수록) 많이 고쳐져요. '한 걸음 고치기'로 손실을 0.01 아래로 내려 보세요.";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="가게 고르기">
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
            {STORES[p].name} ({STORES[p].x.join(", ")}) 진짜 {num(STORES[p].real)}점
          </button>
        ))}
      </div>
      <p className="p2-calc">
        예측 <b>{num(g.f.y, 3)}</b>점 · 진짜 {num(s.real)}점 · 손실 <b>{num(g.loss, 4)}</b>
        <br />
        인기 = {num(g.f.h[0], 3)}, 너무 매움 = {num(g.f.h[1], 3)} {g.f.h[1] === 0 ? "(꺼짐)" : "(켜짐)"} · 고친 횟수 {steps}
      </p>

      <div className="p2-knobs" role="group" aria-label="손잡이 고르기">
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
      <p className="p2-note">왼쪽 숫자 = 손잡이 값, 오른쪽 빨간 숫자 = 책임. 가중치는 설명용 예시예요.</p>

      <div className="p2-calc">
        <b>{knob.label}</b>의 책임
        <br />
        {chain}
        <br />
        확인: 0.01 올려 보면 손실 {dl < 0 ? "−" : "+"}
        {num(Math.abs(dl), 4)} (≈ 책임 × 0.01 = {num(grad(knob) * 0.01, 4)})
      </div>

      <div className="lab-actions">
        <button
          className="btn"
          onClick={() => {
            setNet((n) => step(n, s.x, s.real, LRS[store]));
            setSteps((k) => k + 1);
          }}
        >
          한 걸음 고치기
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setNet(NET);
            setSteps(0);
          }}
        >
          처음으로
        </button>
      </div>
      <p className="p2-note">
        한 걸음 = 모든 손잡이를 동시에 "손잡이 − {LRS[store]} × 책임"으로 고치기.{store === 1 && " 가게 B는 입력이 커서 책임도 커요. 그래서 보폭(학습률)을 줄였어요(22장)."}
      </p>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
