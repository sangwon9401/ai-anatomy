import { useState } from "react";
import { GRADES } from "../../../data/ch10";

const EXTRA = [
  { name: "浩宇", row: [82, 88, 93] },
  { name: "一诺", row: [91, 77, 86] },
];

type Pick = { kind: "row" | "col"; i: number } | null;

export function GradeMatrix() {
  const [extra, setExtra] = useState(0);
  const [pick, setPick] = useState<Pick>({ kind: "row", i: 0 });
  const names = [...GRADES.students, ...EXTRA.slice(0, extra).map((e) => e.name)];
  const rows = [...GRADES.scores, ...EXTRA.slice(0, extra).map((e) => e.row)];
  const cols = GRADES.subjects;
  const picked = pick === null ? null : pick.kind === "row" ? { name: names[pick.i], v: rows[pick.i] } : { name: cols[pick.i], v: rows.map((r) => r[pick.i]) };

  return (
    <div>
      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th />
              {cols.map((c, j) => (
                <th key={c}>
                  <button aria-pressed={pick?.kind === "col" && pick.i === j} onClick={() => setPick({ kind: "col", i: j })}>
                    {c}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={names[i]}>
                <th>
                  <button aria-pressed={pick?.kind === "row" && pick.i === i} onClick={() => setPick({ kind: "row", i })}>
                    {names[i]}
                  </button>
                </th>
                {r.map((v, j) => (
                  <td key={j} data-on={(pick?.kind === "row" && pick.i === i) || (pick?.kind === "col" && pick.i === j)}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="matrix-info">
        <span className="vec-big num">
          {rows.length} × {cols.length} 矩阵
        </span>
        {picked && (
          <span className="num">
            {pick?.kind === "row" ? "行" : "列"}（{picked.name}） = ({picked.v.join(", ")})
          </span>
        )}
      </div>
      <div className="lab-actions">
        <button className="btn ghost" disabled={extra >= EXTRA.length} onClick={() => setExtra((x) => x + 1)}>
          再加一位同学
        </button>
        <button
          className="btn ghost"
          disabled={extra === 0}
          onClick={() => {
            setExtra(0);
            setPick({ kind: "row", i: 0 });
          }}
        >
          回到开始
        </button>
      </div>
      <p className="lab-tip">同学多了，行就变多；科目没变，所以列数不变。</p>
    </div>
  );
}
