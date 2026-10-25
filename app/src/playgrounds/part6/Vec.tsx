import { fmt, signClass } from "./util";

/** A vector as a row of number cells (sky = plus, pink = minus). */
export function Vec({ v, label, digits = 1 }: { v: number[]; label: string; digits?: number }) {
  return (
    <div className="p6-vec" aria-label={label}>
      {v.map((n, i) => (
        <span key={i} className={signClass(n, digits)}>
          {fmt(n, digits)}
        </span>
      ))}
    </div>
  );
}
