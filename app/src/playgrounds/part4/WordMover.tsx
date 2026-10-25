import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { DOG, KNOWN, NEXT, NEXT_COLORS, nnlm } from "../../data/ch39";
import "./style.css";

// plane: x, y in −1…1 drawn in a 300 × 300 box
const U = 130;
const X = (x: number) => 150 + x * U;
const Y = (y: number) => 150 - y * U;
const clamp = (v: number) => Math.max(-1, Math.min(1, Math.round(v * 100) / 100));
const dist = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const START: [number, number] = [0, 0];

const topWord = (q: readonly [number, number]) => {
  const { p } = nnlm(q);
  return NEXT[p.indexOf(Math.max(...p))];
};
/** which missions this position completes */
const missionsAt = (q: readonly [number, number]) => {
  const t = topWord(q);
  return [dist(KNOWN[0].e, q) < 0.22, t === "온다" || t === "분다", t === "공부한다" || t === "가르친다"];
};
const MISSIONS = [
  "강아지가를 고양이가 바로 옆에 두고, 예측이 고양이가와 비슷한지 보기",
  "'온다'나 '분다'가 1등이 되는 자리 찾기",
  "'공부한다'나 '가르친다'가 1등이 되는 자리 찾기",
];

const PRESETS: { label: string; at: [number, number] }[] = [
  { label: "고양이가 옆으로", at: [-0.45, 0.6] },
  { label: "학생이 옆으로", at: [0.38, 0.42] },
  { label: "비가 옆으로", at: [-0.3, -0.42] },
  { label: "한가운데로", at: START },
];

export function WordMover() {
  const svg = useRef<SVGSVGElement>(null);
  const [pos, setPos] = useState<[number, number]>(START);
  const [drag, setDrag] = useState(false);
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const move = (q: [number, number]) => {
    setPos(q);
    const now = missionsAt(q);
    setDone((d) => d.map((x, i) => x || now[i]));
  };
  const { h, p } = nnlm(pos);
  const ranked = p.map((v, i) => ({ w: NEXT[i], p: v, c: NEXT_COLORS[i] })).sort((a, b) => b.p - a.p);
  const near = KNOWN.map((k) => ({ k, d: dist(k.e, pos) })).sort((a, b) => a.d - b.d)[0];

  const fromPointer = (e: PointerEvent<SVGSVGElement>): [number, number] => {
    const r = svg.current!.getBoundingClientRect();
    const sx = ((e.clientX - r.left) / r.width) * 300;
    const sy = ((e.clientY - r.top) / r.height) * 300;
    return [clamp((sx - 150) / U), clamp((150 - sy) / U)];
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const step = 0.05;
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const m = d[e.key];
    if (!m) return;
    e.preventDefault();
    move([clamp(pos[0] + m[0]), clamp(pos[1] + m[1])]);
  };


  const tip =
    near.d > 0.45
      ? "어느 무리와도 멀어서 예측이 애매해요. 점을 단어들 가까이 옮겨 보세요."
      : near.k.group === "동물"
        ? "고양이가 옆이라, 한 번도 배운 적 없는 '강아지가'도 잔다·먹는다·달린다를 높게 쳐요."
        : near.k.group === "사람"
          ? "사람 단어 옆으로 왔더니 '공부한다', '가르친다'가 올라왔어요. 벡터 자리가 곧 뜻이에요."
          : "날씨 단어 옆이에요. 이제 신경망은 '강아지가 온다/분다'를 짐작해요. 자리를 잘못 잡으면 이렇게 엉뚱해져요.";

  return (
    <div>
      <div className="plane-lab">
        <svg
          ref={svg}
          viewBox="0 0 300 300"
          style={{ width: "100%", maxWidth: 340, display: "block", touchAction: "none", cursor: drag ? "grabbing" : "pointer" }}
          role="img"
          tabIndex={0}
          aria-label={`단어 벡터 평면. 강아지가의 자리 (${pos[0]}, ${pos[1]}). 화살표 키로 옮길 수 있어요.`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDrag(true);
            move(fromPointer(e));
          }}
          onPointerMove={(e) => drag && move(fromPointer(e))}
          onPointerUp={() => setDrag(false)}
          onPointerCancel={() => setDrag(false)}
        >
          <rect x={X(-1)} y={Y(1)} width={2 * U} height={2 * U} fill="var(--paper-2)" rx={10} />
          <line x1={X(-1)} y1={Y(0)} x2={X(1)} y2={Y(0)} stroke="var(--line)" strokeWidth={1.5} />
          <line x1={X(0)} y1={Y(-1)} x2={X(0)} y2={Y(1)} stroke="var(--line)" strokeWidth={1.5} />
          {KNOWN.map((k) => {
            const right = k.e[0] > 0.3;
            return (
              <g key={k.w}>
                <circle cx={X(k.e[0])} cy={Y(k.e[1])} r={6} fill="var(--ink)" />
                <text x={X(k.e[0]) + (right ? -10 : 10)} y={Y(k.e[1]) + 4} textAnchor={right ? "end" : "start"} fontSize={12} fill="var(--ink-2)">
                  {k.w}
                </text>
              </g>
            );
          })}
          <line x1={X(pos[0])} y1={Y(pos[1])} x2={X(near.k.e[0])} y2={Y(near.k.e[1])} stroke="var(--pen)" strokeWidth={1.5} strokeDasharray="4 4" />
          <circle cx={X(pos[0])} cy={Y(pos[1])} r={11} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={2.5} />
          <text x={X(pos[0])} y={Y(pos[1]) - 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
            {DOG.w}
          </text>
        </svg>

        <div className="plane-side">
          <div className="vec-big num">
            {DOG.w} = ({pos[0].toFixed(2)}, {pos[1].toFixed(2)})
          </div>
          <div className="p4-neurons" aria-label="뉴런 3개의 출력">
            <span className="muted">뉴런 3개</span>
            {h.map((v, i) => (
              <span key={i} className="p4-neuron" style={{ background: v >= 0 ? "var(--hl-yellow)" : "var(--hl-sky)", opacity: 0.35 + 0.65 * Math.abs(v) }}>
                {v.toFixed(2)}
              </span>
            ))}
          </div>
          <div className="bars">
            {ranked.slice(0, 5).map((r) => (
              <div className="bar-row" key={r.w}>
                <span className="label">{r.w}</span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${r.p * 100}%`, background: `var(--hl-${r.c})` }} />
                </span>
                <span className="val">{(r.p * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <p className="p4-note" style={{ marginTop: 0 }}>
            n-gram이라면? '{DOG.w}' 다음을 센 적이 0번이라 확률을 못 정해요.
          </p>
        </div>
      </div>

      <div className="ctx-presets">
        {PRESETS.map((pr) => (
          <button key={pr.label} onClick={() => move(pr.at)}>
            {pr.label}
          </button>
        ))}
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {MISSIONS.map((m, i) => (
          <li key={m} data-done={done[i]}>
            {done[i] ? "○" : "□"} {m}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p4-note">* 단어 자리와 학습 문장은 설명용 예시예요. 신경망(뉴런 3개)은 그 문장들로 실제로 학습시킨 거예요.</p>
    </div>
  );
}
