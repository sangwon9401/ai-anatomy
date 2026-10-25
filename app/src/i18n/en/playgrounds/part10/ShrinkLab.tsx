import { useState } from "react";
import { BITS, PARAM_PRESETS, PHONE_GB, RANGE, WEIGHTS, quantize, sizeGB } from "../../../../data/ch90";
import "../../../../playgrounds/part10/style.css";

const num = (x: number, d = 1) => x.toLocaleString("en-US", { maximumFractionDigits: d });
/** 12 billion, 700 billion, 1.4 trillion … (English number words instead of the Korean 억/조) */
const words = (x: number) => (x >= 1e12 ? `${num(x / 1e12)} trillion` : `${num(x / 1e9)} billion`);
const sgn = (v: number, d = 4) => `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(d)}`;

function verdict(gb: number, phone: number) {
  const r = gb / phone;
  if (r <= 0.5) return { key: "ok", text: "It fits! (with room to spare)" };
  if (r <= 0.8) return { key: "tight", text: "It fits, but only just" };
  return { key: "no", text: "It doesn't fit" };
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
      ? `Even shrunk to ${bits} bits, GPT-3 is ${num(gb)} GB. No way it fits on a phone. That's why phones use a small model from the start (distillation).`
      : v.key === "no"
        ? "Still too big. Use fewer bits (quantization) or pick a smaller model."
        : v.key === "tight"
          ? "It fits, but it's tight. Other apps on the phone need memory too."
          : bits <= 8
            ? `${preset.label} parameters in ${num(gb)} GB! That can run on a phone. Below, see how much the numbers shifted.`
            : `${num(gb)} GB fits. How small does it get with even fewer bits?`;

  return (
    <div>
      <h4 className="p10-h" style={{ marginTop: 0 }}>
        ① Number of parameters
      </h4>
      <div className="ctx-presets" role="group" aria-label="Number of parameters">
        {PARAM_PRESETS.map((p) => (
          <button key={p.key} className="p10-seg" aria-pressed={pk === p.key} onClick={() => pickP(p.key)}>
            {p.label}
          </button>
        ))}
      </div>
      <h4 className="p10-h">② Bits per number</h4>
      <div className="ctx-presets" role="group" aria-label="Number of bits">
        {BITS.map((b) => (
          <button key={b} className="p10-seg" aria-pressed={bits === b} onClick={() => pickB(b)}>
            {b} bits
          </button>
        ))}
      </div>
      <h4 className="p10-h">③ Phone memory</h4>
      <div className="ctx-presets" role="group" aria-label="Phone memory">
        {PHONE_GB.map((g) => (
          <button key={g} className="p10-seg" aria-pressed={phone === g} onClick={() => pickPhone(g)}>
            {g} GB
          </button>
        ))}
      </div>

      <p className="p10-formula">
        {preset.label.replace(" (GPT-3)", "")} × {bits / 8} bytes = {words(preset.n * (bits / 8))} bytes ≈ <b>{num(gb)} GB</b>
      </p>
      <div className="bars" style={{ marginTop: 10 }}>
        <div className="bar-row">
          <span className="label">Model</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${(gb / max) * 100}%`, background: v.key === "no" ? "var(--hl-pink)" : v.key === "tight" ? "var(--hl-orange)" : "var(--hl-mint)" }} />
          </span>
          <span className="val">{num(gb)} GB</span>
        </div>
        <div className="bar-row">
          <span className="label">Phone</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${(phone / max) * 100}%`, background: "var(--ink-2)" }} />
          </span>
          <span className="val">{phone} GB</span>
        </div>
      </div>
      <p className={`p10-verdict ${v.key}`}>{v.text}</p>

      <h4 className="p10-h">Measure with a {bits}-bit ruler (−1.2 to 1.2, {tickCount.toLocaleString("en-US")} marks)</h4>
      <svg className="p10-ruler" viewBox="0 0 300 54" role="img" aria-label={`Knob values on a ${bits}-bit ruler`}>
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
      <div className="p10-qtable" role="table" aria-label="Values before and after quantization">
        <div role="row" className="head">
          <span role="columnheader">Original</span>
          <span role="columnheader">On the ruler</span>
          <span role="columnheader">Off by</span>
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
        The four knob values are illustrative. 32 and 16 bits use floating-point numbers, so they stay almost the same. A real model also needs memory while it computes, so here 'room to spare' roughly means half the phone's memory or less.
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.fit}>{done.fit ? "✓" : "○"} Fit the 3-billion model on a phone with room to spare</li>
        <li data-done={done.gpt3}>{done.gpt3 ? "✓" : "○"} Try GPT-3 too (will it fit?)</li>
        <li data-done={done.four}>{done.four ? "✓" : "○"} See how far off the 4-bit ruler is</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
