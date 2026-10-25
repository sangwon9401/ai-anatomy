// ja overlay of src/playgrounds/part3/WordCalc.tsx (strings only)
import { useState } from "react";
import { MAPS, analogy, vecOf, type P2 } from "../../../../data/ch34";
import "../../../../playgrounds/part3/style.css";

const W = 340;
const H = 270;
const X = (x: number) => 24 + x * 36;
const Y = (y: number) => H - 24 - y * 32;

export function WordCalc() {
  const [mi, setMi] = useState(0);
  const map = MAPS[mi];
  const [abc, setAbc] = useState<[string, string, string]>(map.presets[0]);
  const [slot, setSlot] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const { r, best } = analogy(map, ...abc);
  const [va, vb] = [vecOf(map, abc[0]), vecOf(map, abc[1])];
  const mid: P2 = [va[0] - vb[0], va[1] - vb[1]];
  const good = best.d < 0.5;

  const pick = (w: string) => {
    const next = [...abc] as [string, string, string];
    next[slot] = w;
    if (new Set(next).size < 3) return;
    setAbc(next);
    setSlot((s) => (s + 1) % 3);
    const res = analogy(map, ...next);
    const key = `${next[0]} − ${next[1]} + ${next[2]} ≈ ${res.best.w}`;
    if (res.best.d < 0.5) setFound((f) => (f.includes(key) ? f : [...f, key]));
  };

  return (
    <div>
      <div className="seg p3-seg" role="group" aria-label="地図をえらぶ" style={{ marginTop: 0 }}>
        {MAPS.map((m, i) => (
          <button
            key={m.key}
            aria-pressed={i === mi}
            onClick={() => {
              setMi(i);
              setAbc(MAPS[i].presets[0]);
              setSlot(0);
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="p3-calc-line" role="group" aria-label="計算式">
        {abc.map((w, i) => (
          <span key={i} className="p3-calc-part">
            {i === 1 && <b>−</b>}
            {i === 2 && <b>+</b>}
            <button className={`p3-slot${slot === i ? " on" : ""}`} aria-pressed={slot === i} onClick={() => setSlot(i)} aria-label={`${["A", "B", "C"][i]}の欄：${w}`}>
              {w}
            </button>
          </span>
        ))}
        <span className="p3-calc-part">
          <b>≈</b> <span className={`chip ${good ? "hl-mint" : "hl-none"}`}>{best.w}</span>
        </span>
      </div>
      <p className="lab-sum">変えたい欄を押してから、下の単語をえらびましょう。(いまは{["A", "B", "C"][slot]}の欄)</p>
      <div className="p3-oh-words" role="group" aria-label="単語">
        {map.words.map((x) => (
          <button key={x.w} className={`p3-wbtn${abc.includes(x.w) ? " hl-yellow" : ""}`} aria-pressed={abc.includes(x.w)} onClick={() => pick(x.w)}>
            {x.w}
          </button>
        ))}
      </div>

      <div className="plane-lab" style={{ marginTop: 12 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 340, display: "block" }} role="img" aria-label={`${abc[0]} ひく ${abc[1]} たす ${abc[2]} の矢印`}>
          <defs>
            <marker id="p3-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink)" />
            </marker>
          </defs>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
            <line key={`gx${x}`} x1={X(x)} y1={Y(0)} x2={X(x)} y2={Y(7)} stroke="var(--grid-minor)" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((y) => (
            <line key={`gy${y}`} x1={X(0)} y1={Y(y)} x2={X(8.5)} y2={Y(y)} stroke="var(--grid-minor)" />
          ))}
          <line x1={X(va[0])} y1={Y(va[1])} x2={X(mid[0])} y2={Y(mid[1])} stroke="var(--ink)" strokeWidth={2} markerEnd="url(#p3-head)" />
          <line x1={X(mid[0])} y1={Y(mid[1])} x2={X(r[0])} y2={Y(r[1])} stroke="var(--ink)" strokeWidth={2} markerEnd="url(#p3-head)" />
          {map.words.map((x) => (
            <g key={x.w}>
              <circle cx={X(x.v[0])} cy={Y(x.v[1])} r={x.w === best.w ? 6.5 : 5} fill={x.w === best.w ? "var(--hl-mint)" : abc.includes(x.w) ? "var(--hl-yellow)" : "var(--paper-2)"} stroke="var(--ink)" strokeWidth={1.5} />
              <text x={X(x.v[0]) + 7} y={Y(x.v[1]) - 6} fontSize={11} fill="var(--ink)">
                {x.w}
              </text>
            </g>
          ))}
          <rect x={X(r[0]) - 5} y={Y(r[1]) - 5} width={10} height={10} transform={`rotate(45 ${X(r[0])} ${Y(r[1])})`} fill="var(--pen)" />
        </svg>
        <div className="plane-side">
          <div className="dot-formula num">
            ({va.join(", ")}) − ({vb.join(", ")}) + ({vecOf(map, abc[2]).join(", ")})
            <br />= (<b>{r.map((x) => +x.toFixed(2)).join(", ")}</b>)
          </div>
          <p className="lab-tip">{good ? `着いた点のすぐそばに「${best.w}」があります (距離${best.d.toFixed(2)})。関係が同じペアをえらべましたね！` : `いちばん近い「${best.w}」でも${best.d.toFixed(2)}はなれています。AとB、Cと答えの関係が同じになるようにえらんでみましょう。`}</p>
          {found.length > 0 && (
            <ul className="missions">
              {found.map((f) => (
                <li key={f} data-done>
                  ○ {f}
                </li>
              ))}
            </ul>
          )}
          <p className="lab-sum">説明用の例の地図です。本物のWord2Vecのベクトルは数百次元なので、こんなにぴったり合わないことも多いです。</p>
        </div>
      </div>
    </div>
  );
}
