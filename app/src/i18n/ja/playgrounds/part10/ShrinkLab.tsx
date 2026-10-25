import { useState } from "react";
import { BITS, PARAM_PRESETS, PHONE_GB, RANGE, WEIGHTS, quantize, sizeGB } from "../../../../data/ch90";
import "../../../../playgrounds/part10/style.css";

const num = (x: number, d = 1) => x.toLocaleString("ja-JP", { maximumFractionDigits: d });
/** 120億, 7,000億, 1.4兆 … */
const korean = (x: number) => (x >= 1e12 ? `${num(x / 1e12)}兆` : `${num(x / 1e8)}億`);
const sgn = (v: number, d = 4) => `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(d)}`;

function verdict(gb: number, phone: number) {
  const r = gb / phone;
  if (r <= 0.5) return { key: "ok", text: "入ります！（余裕あり）" };
  if (r <= 0.8) return { key: "tight", text: "入るけれど、ぎりぎりです" };
  return { key: "no", text: "入りません" };
}

export function ShrinkLab() {
  const [pk, setPk] = useState("3b");
  const [bits, setBits] = useState<(typeof BITS)[number]>(32);
  const [phone, setPhone] = useState<(typeof PHONE_GB)[number]>(8);
  const [done, setDone] = useState({ fit: false, gpt3: false, four: false });
  const preset = PARAM_PRESETS.find((p) => p.key === pk)!;
  const gb = sizeGB(preset.n, bits);
  const v = verdict(gb, phone);
  const max = Math.max(gb, phone);

  const update = (k: string, b: number, ph: number) => {
    const g = sizeGB(PARAM_PRESETS.find((p) => p.key === k)!.n, b);
    setDone((d) => ({
      fit: d.fit || (k === "3b" && verdict(g, ph).key === "ok"),
      gpt3: d.gpt3 || k === "gpt3",
      four: d.four || b === 4,
    }));
  };
  const pickP = (k: string) => {
    setPk(k);
    update(k, bits, phone);
  };
  const pickB = (b: (typeof BITS)[number]) => {
    setBits(b);
    update(pk, b, phone);
  };
  const pickPhone = (ph: (typeof PHONE_GB)[number]) => {
    setPhone(ph);
    update(pk, bits, ph);
  };

  const qs = WEIGHTS.map((w) => ({ w, q: quantize(w, bits, RANGE) }));
  const tickCount = 2 ** bits;
  const rx = (x: number) => 10 + ((x + RANGE) / (2 * RANGE)) * 280;

  const tip =
    pk === "gpt3"
      ? `GPT-3は${bits}ビットにしても${num(gb)}GBです。スマホにはとても入りません。だからスマホでは、はじめから小さなモデル（蒸留）を使います。`
      : v.key === "no"
        ? "まだ大きいです。ビット数を減らすか（量子化）、もっと小さなモデルを選んでみましょう。"
        : v.key === "tight"
          ? "入るけれど、ぎりぎりです。スマホは、ほかのアプリもメモリを使うからです。"
          : bits <= 8
            ? `${preset.label}のモデルが${num(gb)}GB！これならスマホで動かせます。下で、数字がどれくらいずれたかも見てみましょう。`
            : `${num(gb)}GBなら入ります。ビットをもっと減らすと、どれくらい小さくなるでしょう？`;

  return (
    <div>
      <h4 className="p10-h" style={{ marginTop: 0 }}>
        ① パラメータの数
      </h4>
      <div className="ctx-presets" role="group" aria-label="パラメータの数">
        {PARAM_PRESETS.map((p) => (
          <button key={p.key} className="p10-seg" aria-pressed={pk === p.key} onClick={() => pickP(p.key)}>
            {p.label}
          </button>
        ))}
      </div>
      <h4 className="p10-h">② 数字1つに使うビット</h4>
      <div className="ctx-presets" role="group" aria-label="ビット数">
        {BITS.map((b) => (
          <button key={b} className="p10-seg" aria-pressed={bits === b} onClick={() => pickB(b)}>
            {b}ビット
          </button>
        ))}
      </div>
      <h4 className="p10-h">③ スマホのメモリ</h4>
      <div className="ctx-presets" role="group" aria-label="スマホのメモリ">
        {PHONE_GB.map((g) => (
          <button key={g} className="p10-seg" aria-pressed={phone === g} onClick={() => pickPhone(g)}>
            {g}GB
          </button>
        ))}
      </div>

      <p className="p10-formula">
        {preset.label.replace("（GPT-3）", "")} × {bits / 8}バイト = {korean(preset.n * (bits / 8))}バイト ≈ <b>{num(gb)}GB</b>
      </p>
      <div className="bars" style={{ marginTop: 10 }}>
        <div className="bar-row">
          <span className="label">モデル</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${(gb / max) * 100}%`, background: v.key === "no" ? "var(--hl-pink)" : v.key === "tight" ? "var(--hl-orange)" : "var(--hl-mint)" }} />
          </span>
          <span className="val">{num(gb)}GB</span>
        </div>
        <div className="bar-row">
          <span className="label">スマホのメモリ</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${(phone / max) * 100}%`, background: "var(--ink-2)" }} />
          </span>
          <span className="val">{phone}GB</span>
        </div>
      </div>
      <p className={`p10-verdict ${v.key}`}>{v.text}</p>

      <h4 className="p10-h">{bits}ビットのものさしで測る（−1.2〜1.2、目盛り{tickCount.toLocaleString("ja-JP")}個）</h4>
      <svg className="p10-ruler" viewBox="0 0 300 54" role="img" aria-label={`${bits}ビットの目盛りのものさしにのせた、つまみの値`}>
        <line x1={10} y1={30} x2={290} y2={30} stroke="var(--ink)" strokeWidth={2} />
        {tickCount <= 256 ? (
          Array.from({ length: tickCount }, (_, k) => {
            const x = 10 + (280 * k) / (tickCount - 1);
            return <line key={k} x1={x} y1={tickCount > 16 ? 25 : 22} x2={x} y2={tickCount > 16 ? 35 : 38} stroke="var(--ink)" strokeWidth={tickCount > 16 ? 0.4 : 1.5} />;
          })
        ) : (
          <rect x={10} y={25} width={280} height={10} fill="var(--ink-3)" />
        )}
        {qs.map(({ w, q }) => (
          <g key={w}>
            <circle cx={rx(w)} cy={14} r={4} fill="var(--pen)" />
            <line x1={rx(w)} y1={18} x2={rx(q)} y2={30} stroke="var(--pen)" strokeWidth={1} />
            <circle cx={rx(q)} cy={30} r={4.5} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={1.5} />
          </g>
        ))}
      </svg>
      <div className="p10-qtable" role="table" aria-label="量子化の前とあとの値">
        <div role="row" className="head">
          <span role="columnheader">もとの値</span>
          <span role="columnheader">ものさしの値</span>
          <span role="columnheader">ずれ</span>
        </div>
        {qs.map(({ w, q }) => (
          <div role="row" key={w}>
            <span role="cell">{sgn(w, 2)}</span>
            <span role="cell">{sgn(q)}</span>
            <span role="cell" className={Math.abs(q - w) > 0.005 ? "big" : ""}>
              {Math.abs(q - w).toFixed(4)}
            </span>
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
        4つのつまみの値は説明用の例です。32・16ビットはもともと小数の書き方なので、ほとんどそのままです。本物のモデルは計算中に使うメモリも必要なので、ここではスマホのメモリの半分以下を「余裕あり」と見積もりました。
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.fit}>{done.fit ? "✓" : "○"} 30億個のモデルを、余裕をもってスマホに入れる</li>
        <li data-done={done.gpt3}>{done.gpt3 ? "✓" : "○"} GPT-3も入れてみる（入るかな？）</li>
        <li data-done={done.four}>{done.four ? "✓" : "○"} 4ビットのものさしで測ると、どれくらいずれるか見る</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
