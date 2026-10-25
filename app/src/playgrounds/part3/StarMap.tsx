import { useRef, useState } from "react";
import { GROUPS, RANDOM_START, STARS, dist3, dot3, lerp3, project, type V3 } from "../../data/ch33";
import "./style.css";

const SIZE = 340;
const C = SIZE / 2;
const R = 120;
const fmt = (x: number) => (x < 0 ? `−${Math.abs(x).toFixed(2)}` : x.toFixed(2));

export function StarMap() {
  const [yaw, setYaw] = useState(0.5);
  const [pitch, setPitch] = useState(0.4);
  const [train, setTrain] = useState(100);
  const [sel, setSel] = useState(0);
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number; moved: boolean } | null>(null);

  const t = train / 100;
  const pos: V3[] = STARS.map((s, i) => lerp3(RANDOM_START[i], s.v, t));
  const pts = pos.map((v, i) => ({ i, ...project(v, yaw, pitch) })).sort((a, b) => a.z - b.z);
  const me = pos[sel];
  const near = pos
    .map((v, i) => ({ i, d: dist3(me, v), dot: dot3(me, v) }))
    .filter((n) => n.i !== sel)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);
  const sameGroup = near.filter((n) => STARS[n.i].group === STARS[sel].group).length;

  const tip =
    t < 0.3
      ? `학습 전이라 이웃이 엉망이에요. '${STARS[sel].w}' 옆에 엉뚱한 단어가 있죠? 슬라이더를 오른쪽으로 밀어 보세요.`
      : sameGroup === 3
        ? `'${STARS[sel].w}'의 가까운 이웃이 모두 같은 무리(${GROUPS[STARS[sel].group].name})예요. 공간을 돌려 봐도 무리는 그대로예요.`
        : "학습이 진행될수록 비슷한 단어끼리 모여요.";

  return (
    <div className="plane-lab">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="p3-star-svg"
        role="img"
        aria-label="단어 별자리 3D 지도. 끌어서 돌릴 수 있어요"
        onPointerDown={(e) => {
          (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, yaw, pitch, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          const dy = e.clientY - d.y;
          if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
          setYaw(d.yaw + dx * 0.012);
          setPitch(Math.max(-1.2, Math.min(1.2, d.pitch + dy * 0.01)));
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d || d.moved) return;
          // a tap: pick the closest star to the pointer
          const box = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const sx = ((e.clientX - box.left) / box.width) * SIZE;
          const sy = ((e.clientY - box.top) / box.height) * SIZE;
          let best = -1;
          let bd = 22;
          pos.forEach((v, i) => {
            const p = project(v, yaw, pitch);
            const dd = Math.hypot(C + p.x * R - sx, C - p.y * R - sy);
            if (dd < bd) {
              bd = dd;
              best = i;
            }
          });
          if (best >= 0) setSel(best);
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        {([
          [1.1, 0, 0],
          [0, 1.1, 0],
          [0, 0, 1.1],
        ] as V3[]).map((a, k) => {
          const p = project(a, yaw, pitch);
          const q = project([-a[0], -a[1], -a[2]], yaw, pitch);
          return <line key={k} x1={C + q.x * R} y1={C - q.y * R} x2={C + p.x * R} y2={C - p.y * R} stroke="var(--ink-3)" strokeDasharray="4 4" />;
        })}
        {near.map((n) => {
          const a = project(me, yaw, pitch);
          const b = project(pos[n.i], yaw, pitch);
          return <line key={`n${n.i}`} x1={C + a.x * R} y1={C - a.y * R} x2={C + b.x * R} y2={C - b.y * R} stroke="var(--pen)" strokeWidth={1.5} strokeDasharray="3 3" />;
        })}
        {pts.map((p) => {
          const s = STARS[p.i];
          const k = 1 + 0.2 * p.z;
          const on = p.i === sel;
          return (
            <g key={p.i} opacity={0.55 + 0.45 * ((p.z + 1) / 2)}>
              <circle cx={C + p.x * R} cy={C - p.y * R} r={(on ? 8 : 6) * k} fill={`var(--hl-${GROUPS[s.group].c})`} stroke="var(--ink)" strokeWidth={on ? 2.5 : 1.5} />
              <text x={C + p.x * R + 9 * k} y={C - p.y * R + 4} fontSize={11 * k} fontWeight={on ? 700 : 400} fill="var(--ink)">
                {s.w}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="plane-side">
        <div className="vec-big num">
          {STARS[sel].w} = [{me.map(fmt).join(", ")}]
        </div>
        <div className="lab-row">
          <span>학습 진행</span>
          <input type="range" min={0} max={100} step={1} value={train} aria-label="학습 진행" onChange={(e) => setTrain(Number(e.target.value))} />
          <span className="val">{train}%</span>
        </div>
        <div className="p3-sub">가장 가까운 단어 (거리 · 내적)</div>
        <div className="bars">
          {near.map((n, k) => (
            <div className="bar-row" key={n.i}>
              <span className="label">
                {k + 1}. {STARS[n.i].w}
              </span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${Math.max(6, 100 - n.d * 45)}%`, background: `var(--hl-${GROUPS[STARS[n.i].group].c})` }} />
              </span>
              <span className="val">
                {n.d.toFixed(2)} · {n.dot.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <ul className="legend">
          {GROUPS.map((g) => (
            <li key={g.name}>
              <span className="swatch" style={{ background: `var(--hl-${g.c})` }} />
              {g.name}
            </li>
          ))}
        </ul>
        <p className="lab-tip">{tip}</p>
        <p className="lab-sum">숫자는 설명용 예시예요. 진짜 임베딩은 숫자가 수천 개라 그림으로 그릴 수 없어요.</p>
      </div>
    </div>
  );
}
