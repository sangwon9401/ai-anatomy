import { useState } from "react";
import { BITS, PARAM_PRESETS, PHONE_GB, RANGE, WEIGHTS, quantize, sizeGB } from "../../data/ch90";
import "./style.css";

const num = (x: number, d = 1) => x.toLocaleString("ko-KR", { maximumFractionDigits: d });
/** 120억, 7,000억, 1.4조 … */
const korean = (x: number) => (x >= 1e12 ? `${num(x / 1e12)}조` : `${num(x / 1e8)}억`);
const sgn = (v: number, d = 4) => `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(d)}`;

function verdict(gb: number, phone: number) {
  const r = gb / phone;
  if (r <= 0.5) return { key: "ok", text: "들어가요! (여유 있음)" };
  if (r <= 0.8) return { key: "tight", text: "들어가긴 하지만 빠듯해요" };
  return { key: "no", text: "안 들어가요" };
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
      ? `GPT-3는 ${bits}비트로 줄여도 ${num(gb)}GB예요. 폰에는 어림없죠. 그래서 폰에는 처음부터 작은 모델(증류)을 써요.`
      : v.key === "no"
        ? "아직 커요. 비트 수를 줄이거나(양자화) 더 작은 모델을 골라 보세요."
        : v.key === "tight"
          ? "들어가긴 해도 빠듯해요. 폰은 다른 앱도 메모리를 써야 하거든요."
          : bits <= 8
            ? `${preset.label} 모델이 ${num(gb)}GB! 이 정도면 폰에서 돌릴 수 있어요. 아래에서 숫자가 얼마나 어긋났는지도 보세요.`
            : `${num(gb)}GB면 들어가요. 비트를 더 줄이면 얼마나 작아질까요?`;

  return (
    <div>
      <h4 className="p10-h" style={{ marginTop: 0 }}>
        ① 파라미터 수
      </h4>
      <div className="ctx-presets" role="group" aria-label="파라미터 수">
        {PARAM_PRESETS.map((p) => (
          <button key={p.key} className="p10-seg" aria-pressed={pk === p.key} onClick={() => pickP(p.key)}>
            {p.label}
          </button>
        ))}
      </div>
      <h4 className="p10-h">② 숫자 하나에 쓰는 비트</h4>
      <div className="ctx-presets" role="group" aria-label="비트 수">
        {BITS.map((b) => (
          <button key={b} className="p10-seg" aria-pressed={bits === b} onClick={() => pickB(b)}>
            {b}비트
          </button>
        ))}
      </div>
      <h4 className="p10-h">③ 폰 메모리</h4>
      <div className="ctx-presets" role="group" aria-label="폰 메모리">
        {PHONE_GB.map((g) => (
          <button key={g} className="p10-seg" aria-pressed={phone === g} onClick={() => pickPhone(g)}>
            {g}GB
          </button>
        ))}
      </div>

      <p className="p10-formula">
        {preset.label.replace(" (GPT-3)", "")} × {bits / 8}바이트 = {korean(preset.n * (bits / 8))} 바이트 ≈ <b>{num(gb)}GB</b>
      </p>
      <div className="bars" style={{ marginTop: 10 }}>
        <div className="bar-row">
          <span className="label">모델</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${(gb / max) * 100}%`, background: v.key === "no" ? "var(--hl-pink)" : v.key === "tight" ? "var(--hl-orange)" : "var(--hl-mint)" }} />
          </span>
          <span className="val">{num(gb)}GB</span>
        </div>
        <div className="bar-row">
          <span className="label">폰 메모리</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${(phone / max) * 100}%`, background: "var(--ink-2)" }} />
          </span>
          <span className="val">{phone}GB</span>
        </div>
      </div>
      <p className={`p10-verdict ${v.key}`}>{v.text}</p>

      <h4 className="p10-h">{bits}비트 자로 재 보기 (−1.2 ~ 1.2, 눈금 {tickCount.toLocaleString("ko-KR")}개)</h4>
      <svg className="p10-ruler" viewBox="0 0 300 54" role="img" aria-label={`${bits}비트 눈금 자 위의 손잡이 값`}>
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
      <div className="p10-qtable" role="table" aria-label="양자화 전후 값">
        <div role="row" className="head">
          <span role="columnheader">원래 값</span>
          <span role="columnheader">자로 잰 값</span>
          <span role="columnheader">어긋남</span>
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
        손잡이 값 네 개는 설명용 예시예요. 32·16비트는 원래 소수점 방식이라 거의 그대로예요. 실제 모델은 계산하는 동안 쓰는 메모리도 더 필요해서, 폰 메모리의 절반 이하면 '여유'로 어림했어요.
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.fit}>{done.fit ? "✓" : "○"} 30억 개 모델을 폰에 여유 있게 넣기</li>
        <li data-done={done.gpt3}>{done.gpt3 ? "✓" : "○"} GPT-3도 넣어 보기 (될까요?)</li>
        <li data-done={done.four}>{done.four ? "✓" : "○"} 4비트 자로 재면 얼마나 어긋나는지 보기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
