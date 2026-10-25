import { useState } from "react";
import { PROMPT80, WHEEL } from "../../../../data/ch80";
import { generate, joinPieces, pickIndex } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

const CX = 120;
const CY = 124;
const R = 100;
const P = WHEEL.map((c) => c.p);
const label = (w: string, c: string | null) => (c ? w : "その他");
const fill = (c: string | null) => (c ? `var(--hl-${c})` : "var(--paper-2)");

function starts() {
  let a = 0;
  return WHEEL.map((c) => {
    const s = a;
    a += c.p * 360;
    return s;
  });
}
const START = starts();
const pt = (r: number, deg: number) => [CX + r * Math.sin((deg * Math.PI) / 180), CY - r * Math.cos((deg * Math.PI) / 180)];

/** rotation that puts slice i under the pointer, ahead of `from` by `turns` full turns */
function landOn(i: number, from: number, turns: number, at: number) {
  const phi = START[i] + WHEEL[i].p * 360 * at;
  const target = (((-phi - from) % 360) + 360) % 360;
  return from + target + turns * 360;
}

type Line = { how: "グリーディ" | "サンプリング"; text: string };

export function GreedyWheel() {
  const [rot, setRot] = useState(0);
  const [fast, setFast] = useState(false);
  const [last, setLast] = useState<number | null>(null);
  const [greedy, setGreedy] = useState<number[]>(() => WHEEL.map(() => 0));
  const [sample, setSample] = useState<number[]>(() => WHEEL.map(() => 0));
  const [lines, setLines] = useState<Line[]>([]);
  const [tip, setTip] = useState("まず「グリーディで選ぶ」を何回か押してみましょう。");

  const gTotal = greedy.reduce((a, b) => a + b, 0);
  const sTotal = sample.reduce((a, b) => a + b, 0);
  const sNotTop = sTotal - sample[0];
  const gLines = lines.filter((l) => l.how === "グリーディ");
  const sLines = lines.filter((l) => l.how === "サンプリング");

  const pickGreedy = () => {
    setFast(true);
    setRot((r) => landOn(0, r, 0, 0.5));
    setLast(0);
    const next = greedy.map((n, i) => (i === 0 ? n + 1 : n));
    setGreedy(next);
    const total = next.reduce((a, b) => a + b, 0);
    setTip(total >= 3 ? `グリーディで${total}回選びましたが、全部「行く」です。確率の表が同じなら、1位もいつも同じです。` : "もう一度押してみましょう。結果は変わるでしょうか？");
  };
  const spin = (n: number) => {
    const next = [...sample];
    let i = 0;
    for (let k = 0; k < n; k++) {
      i = pickIndex(P, Math.random());
      next[i]++;
    }
    setFast(n > 1);
    setRot((r) => landOn(i, r, n > 1 ? 2 : 4, 0.15 + Math.random() * 0.7));
    setLast(i);
    setSample(next);
    const total = next.reduce((a, b) => a + b, 0);
    if (total >= 30) setTip(`${total}回回しました。「行く」がいちばん多いけれど、全部ではありません。たくさん回すほど、割合が確率（52%、21%…）に近づきます。`);
    else if (i !== 0) setTip(`今度は「${label(WHEEL[i].w, WHEEL[i].c)}」！1位でなくても、マスがあれば選ばれることがあります。`);
    else setTip("今度は「行く」。あと何回か回してみましょう。");
  };
  const write = (how: Line["how"]) => {
    const pieces = generate(how === "グリーディ" ? 0 : 1, Math.random);
    const text = joinPieces([...PROMPT80, ...pieces]);
    const nextLines = [{ how, text }, ...lines].slice(0, 6);
    setLines(nextLines);
    const g = nextLines.filter((l) => l.how === "グリーディ").length;
    const s = nextLines.filter((l) => l.how === "サンプリング");
    if (how === "グリーディ") setTip(g >= 2 ? "グリーディの文は毎回同じで、「そして 友と 会った」をぐるぐる回り、長さの上限で切れます（…）。" : "今度は「サンプリングで書く」も押してみましょう。");
    else setTip(new Set(s.map((l) => l.text)).size >= 2 ? "サンプリングの文は押すたびに変わります。同じ質問でもChatGPTの答えが少しずつちがう理由です。" : "もう一度押してみましょう。同じ文がまた出るでしょうか？");
  };
  const reset = () => {
    setGreedy(WHEEL.map(() => 0));
    setSample(WHEEL.map(() => 0));
    setLast(null);
    setLines([]);
    setTip("まず「グリーディで選ぶ」を何回か押してみましょう。");
  };

  const shown = last === null ? null : WHEEL[last];

  return (
    <div>
      <div className="p9-sent" aria-live="polite">
        {PROMPT80.map((w) => (
          <span key={w} className="chip outline">
            {w}
          </span>
        ))}
        {shown ? <span className={`chip ${shown.c ? `hl-${shown.c}` : "hl-none"}`}>{label(shown.w, shown.c)}</span> : <span className="p9-blank">?</span>}
      </div>

      <div className="p9-split" style={{ marginTop: 12 }}>
        <svg className={`p9-wheel${fast ? " fast" : ""}`} viewBox="0 0 240 240" role="img" aria-label="確率の大きさでマスを分けたルーレット">
          <g className="spin" style={{ transform: `rotate(${rot}deg)` }}>
            {WHEEL.map((c, i) => {
              const a0 = START[i];
              const a1 = a0 + c.p * 360;
              const [x0, y0] = pt(R, a0);
              const [x1, y1] = pt(R, a1);
              const mid = a0 + c.p * 180;
              const [lx, ly] = pt(R * (c.p < 0.1 ? 0.78 : 0.6), mid);
              return (
                <g key={c.w}>
                  <path d={`M ${CX} ${CY} L ${x0} ${y0} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`} fill={fill(c.c)} stroke="var(--ink)" strokeWidth={1.5} />
                  {c.p >= 0.04 && (
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize={c.p < 0.1 ? 12 : 16} fontWeight={700} fill={c.c ? "var(--chip-ink)" : "var(--ink-2)"} transform={`rotate(${mid} ${lx} ${ly})`}>
                      {label(c.w, c.c)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
          <circle cx={CX} cy={CY} r={5} fill="var(--ink)" />
          <path d={`M ${CX - 9} 6 L ${CX + 9} 6 L ${CX} 30 Z`} fill="var(--pen)" />
        </svg>

        <div>
          <div className="p9-tally-head">
            <span>候補</span>
            <span>確率</span>
            <span>欲張り</span>
            <span>くじ</span>
          </div>
          <div className="bars" style={{ marginTop: 4 }}>
            {WHEEL.map((c, i) => (
              <div className="p9-tally-row" key={c.w} data-last={last === i}>
                <span className="label">{label(c.w, c.c)}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${c.p * 100}%`, background: c.c ? `var(--hl-${c.c})` : "var(--ink-3)" }} />
                </span>
                <span className="n">{greedy[i]}</span>
                <span className="n">{sample[i]}</span>
              </div>
            ))}
          </div>
          <p className="p9-note">確率は説明用の例です（1章と同じ数字）。</p>
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={pickGreedy}>
          グリーディで選ぶ
        </button>
        <button className="btn" onClick={() => spin(1)}>
          ルーレットを回す
        </button>
        <button className="btn ghost" onClick={() => spin(10)}>
          10回回す
        </button>
      </div>

      <h4 className="p9-h">文の最後まで書いてみる</h4>
      <div className="lab-actions" style={{ marginTop: 0 }}>
        <button className="btn ghost" onClick={() => write("グリーディ")}>
          グリーディで書く
        </button>
        <button className="btn ghost" onClick={() => write("サンプリング")}>
          サンプリングで書く
        </button>
        <button className="btn ghost" onClick={reset}>
          最初から
        </button>
      </div>
      {lines.length > 0 && (
        <ul className="p9-history" aria-live="polite">
          {lines.map((l, i) => (
            <li key={i}>
              <span className="how">{l.how}</span>
              <span className="txt">{l.text}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="p9-note">文は、すぐ前の言葉だけを見て次の言葉を決める「おもちゃのモデル」が書きます。長さは10かけらまでです。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={gTotal >= 3}>{gTotal >= 3 ? "○" : "□"} グリーディで3回選ぶ：結果は変わる？</li>
        <li data-done={sNotTop > 0}>{sNotTop > 0 ? "○" : "□"} ルーレットで「行く」以外の言葉を引く</li>
        <li data-done={gLines.length > 0 && sLines.length >= 2}>{gLines.length > 0 && sLines.length >= 2 ? "○" : "□"} 文をグリーディで1回、サンプリングで2回書く</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
