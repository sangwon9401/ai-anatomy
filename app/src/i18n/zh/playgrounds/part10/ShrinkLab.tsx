import { useState } from "react";
import { BITS, PARAM_PRESETS, PHONE_GB, RANGE, WEIGHTS, quantize, sizeGB } from "../../../../data/ch90";
import "../../../../playgrounds/part10/style.css";

const num = (x: number, d = 1) => x.toLocaleString("zh-CN", { maximumFractionDigits: d });
/** 120 亿, 7,000 亿, 1.4 万亿 … */
const korean = (x: number) => (x >= 1e12 ? `${num(x / 1e12)} 万亿` : `${num(x / 1e8)} 亿`);
const sgn = (v: number, d = 4) => `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(d)}`;

function verdict(gb: number, phone: number) {
  const r = gb / phone;
  if (r <= 0.5) return { key: "ok", text: "装得下！（还有余量）" };
  if (r <= 0.8) return { key: "tight", text: "装得下，但很勉强" };
  return { key: "no", text: "装不下" };
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
      ? `GPT-3 就算压到 ${bits} 位，也有 ${num(gb)}GB。手机根本装不下。所以手机上一开始就用小模型（蒸馏）。`
      : v.key === "no"
        ? "还是太大。减少位数（量化），或者换个更小的模型试试。"
        : v.key === "tight"
          ? "装是装得下，但很勉强。手机里别的应用也要用内存呢。"
          : bits <= 8
            ? `${preset.label}参数的模型只有 ${num(gb)}GB！这样就能在手机上跑了。再看看下面的数偏差了多少。`
            : `${num(gb)}GB 就装得下。位数再少一点，会变得多小？`;

  return (
    <div>
      <h4 className="p10-h" style={{ marginTop: 0 }}>
        ① 参数个数
      </h4>
      <div className="ctx-presets" role="group" aria-label="参数个数">
        {PARAM_PRESETS.map((p) => (
          <button key={p.key} className="p10-seg" aria-pressed={pk === p.key} onClick={() => pickP(p.key)}>
            {p.label}
          </button>
        ))}
      </div>
      <h4 className="p10-h">② 每个数用几位</h4>
      <div className="ctx-presets" role="group" aria-label="位数">
        {BITS.map((b) => (
          <button key={b} className="p10-seg" aria-pressed={bits === b} onClick={() => pickB(b)}>
            {b} 位
          </button>
        ))}
      </div>
      <h4 className="p10-h">③ 手机内存</h4>
      <div className="ctx-presets" role="group" aria-label="手机内存">
        {PHONE_GB.map((g) => (
          <button key={g} className="p10-seg" aria-pressed={phone === g} onClick={() => pickPhone(g)}>
            {g}GB
          </button>
        ))}
      </div>

      <p className="p10-formula">
        {preset.label.replace("（GPT-3）", "")} × {bits / 8} 字节 = {korean(preset.n * (bits / 8))}字节 ≈ <b>{num(gb)}GB</b>
      </p>
      <div className="bars" style={{ marginTop: 10 }}>
        <div className="bar-row">
          <span className="label">模型</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${(gb / max) * 100}%`, background: v.key === "no" ? "var(--hl-pink)" : v.key === "tight" ? "var(--hl-orange)" : "var(--hl-mint)" }} />
          </span>
          <span className="val">{num(gb)}GB</span>
        </div>
        <div className="bar-row">
          <span className="label">手机内存</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${(phone / max) * 100}%`, background: "var(--ink-2)" }} />
          </span>
          <span className="val">{phone}GB</span>
        </div>
      </div>
      <p className={`p10-verdict ${v.key}`}>{v.text}</p>

      <h4 className="p10-h">用 {bits} 位的尺子量一量（−1.2 ~ 1.2，{tickCount.toLocaleString("zh-CN")} 个刻度）</h4>
      <svg className="p10-ruler" viewBox="0 0 300 54" role="img" aria-label={`${bits} 位刻度尺上的旋钮值`}>
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
      <div className="p10-qtable" role="table" aria-label="量化前后的值">
        <div role="row" className="head">
          <span role="columnheader">原来的值</span>
          <span role="columnheader">量出的值</span>
          <span role="columnheader">偏差</span>
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
        四个旋钮值是示意数据。32 位、16 位本来就是浮点小数格式，几乎不变。真实模型在计算时还要占用额外的内存，所以这里粗略地把“不超过手机内存的一半”算作“有余量”。
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.fit}>{done.fit ? "✓" : "○"} 把 30 亿参数的模型宽松地装进手机</li>
        <li data-done={done.gpt3}>{done.gpt3 ? "✓" : "○"} 试着把 GPT-3 也装进去（行吗？）</li>
        <li data-done={done.four}>{done.four ? "✓" : "○"} 看看用 4 位尺子量会偏差多少</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
