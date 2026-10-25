import { useState } from "react";
import { FRIENDS } from "../../../data/ch07";
import { Arrow, MiniPlane } from "../../../playgrounds/MiniPlane";

export function TasteArrow() {
  const [me, setMe] = useState<[number, number]>([5, 6]);
  const set = (i: number, v: number) => setMe((m) => (i === 0 ? [v, m[1]] : [m[0], v]));

  return (
    <div className="plane-lab">
      <MiniPlane label={`我的口味向量 (${me[0]}, ${me[1]})`}>
        {FRIENDS.map((f) => (
          <g key={f.name} opacity={0.55}>
            <Arrow to={f.v} color={`var(--hl-${f.c})`} width={4} />
          </g>
        ))}
        <Arrow to={me} color="var(--ink)" width={5} />
      </MiniPlane>
      <div className="plane-side">
        <div className="vec-big">
          我 = (<b>{me[0]}</b>, <b>{me[1]}</b>)
        </div>
        {(["辣味", "甜味"] as const).map((name, i) => (
          <div className="lab-row" key={name}>
            <span>{name}</span>
            <input id={`taste-${i}`} type="range" min={0} max={10} step={1} value={me[i]} aria-label={`${name}分数`} onChange={(e) => set(i, Number(e.target.value))} />
            <span className="val">{me[i]}</span>
          </div>
        ))}
        <ul className="legend">
          {FRIENDS.map((f) => (
            <li key={f.name}>
              <span className={`swatch hl-${f.c}`} />
              {f.name} ({f.v.join(", ")})
            </li>
          ))}
        </ul>
        <p className="lab-tip">箭头方向相近的同学，就是口味相近的同学。</p>
      </div>
    </div>
  );
}
