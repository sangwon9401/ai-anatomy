import { useState } from "react";

const N = 8;
const CYCLE: Record<number, number> = { 255: 128, 128: 0, 0: 255 };
const START = [
  "........",
  "..#..#..",
  "..#..#..",
  "........",
  ".#....#.",
  "..####..",
  "........",
  "........",
].map((row) => [...row].map((c) => (c === "#" ? 0 : 255)));

export function PixelPad() {
  const [px, setPx] = useState<number[][]>(START);
  const [text, setText] = useState("Hi, AI!");
  const tap = (r: number, c: number) => setPx((g) => g.map((row, i) => row.map((v, j) => (i === r && j === c ? CYCLE[v] : v))));

  return (
    <div>
      <div className="pixel-wrap">
        <div className="pixel-grid" role="group" aria-label="8×8 drawing pad">
          {px.map((row, r) =>
            row.map((v, c) => (
              <button key={`${r}-${c}`} style={{ background: `rgb(${v} ${v} ${v})` }} aria-label={`Row ${r + 1}, column ${c + 1}, brightness ${v}`} onClick={() => tap(r, c)} />
            )),
          )}
        </div>
        <div className="pixel-nums" aria-hidden="true">
          {px.map((row, r) => (
            <div key={r}>{row.map((v) => String(v).padStart(3, " ")).join(" ")}</div>
          ))}
        </div>
      </div>
      <p className="lab-sum" style={{ marginTop: 8 }}>
        Each tap turns a square white (255) → gray (128) → black (0). {N * N} squares = {N * N} numbers.
      </p>

      <label className="code-label" htmlFor="code-input">
        Type some letters
      </label>
      <input id="code-input" className="code-input" value={text} maxLength={12} onChange={(e) => setText(e.target.value)} />
      <div className="code-out">
        {[...text].map((ch, i) => (
          <span key={i} className="code-cell">
            <span className="ch">{ch === " " ? "␣" : ch}</span>
            <span className="num">{ch.codePointAt(0)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
