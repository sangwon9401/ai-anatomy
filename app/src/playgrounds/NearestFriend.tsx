import { useState } from "react";
import { FRIENDS } from "../data/ch07";
import { CLASS, dist } from "../data/ch08";
import { MiniPlane, PX, PY } from "./MiniPlane";

const PEOPLE = [...FRIENDS.map((f) => ({ name: f.name, v: f.v })), ...CLASS];

export function NearestFriend() {
  const [me, setMe] = useState<[number, number]>([6, 6]);
  const ranked = PEOPLE.map((p) => ({ ...p, d: dist(me, p.v) })).sort((a, b) => a.d - b.d);
  const best = ranked[0];

  return (
    <div className="plane-lab">
      <MiniPlane label={`내 점 (${me[0]}, ${me[1]})과 친구들`} onPick={setMe}>
        <line x1={PX(me[0])} y1={PY(me[1])} x2={PX(best.v[0])} y2={PY(best.v[1])} stroke="var(--pen)" strokeWidth={2.5} strokeDasharray="4 4" />
        {PEOPLE.map((p) => (
          <g key={p.name}>
            <circle cx={PX(p.v[0])} cy={PY(p.v[1])} r={p.name === best.name ? 6.5 : 5} fill={p.name === best.name ? "var(--hl-mint)" : "var(--paper-2)"} stroke="var(--ink)" strokeWidth={1.5} />
            <text x={PX(p.v[0]) + 7} y={PY(p.v[1]) - 6} fontSize={10} fill="var(--ink-2)">
              {p.name}
            </text>
          </g>
        ))}
        <circle cx={PX(me[0])} cy={PY(me[1])} r={8} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={2} />
        <text x={PX(me[0]) + 10} y={PY(me[1]) + 4} fontSize={12} fontWeight={700} fill="var(--ink)">
          나
        </text>
      </MiniPlane>
      <div className="plane-side">
        <div className="vec-big">
          나 = (<b>{me[0]}</b>, <b>{me[1]}</b>)
        </div>
        <p className="lab-sum">평면을 눌러 내 점을 옮겨 보세요.</p>
        <div className="bars">
          {ranked.slice(0, 5).map((p, i) => (
            <div className="bar-row" key={p.name}>
              <span className="label">
                {i + 1}. {p.name}
              </span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${Math.max(4, 100 - p.d * 9)}%`, background: i === 0 ? "var(--hl-mint)" : "var(--grid-major)" }} />
              </span>
              <span className="val">{p.d.toFixed(1)}</span>
            </div>
          ))}
        </div>
        <p className="lab-tip">
          가장 닮은 친구: {best.name} (거리 {best.d.toFixed(1)})
        </p>
      </div>
    </div>
  );
}
