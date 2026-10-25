import { useMemo, useState } from "react";

export type OrderItem = { key: string; label: string; meta: string };

// A fixed shuffle so every student sees the same puzzle (and it never starts already sorted).
function shuffled<T>(items: T[]) {
  const out = [...items];
  let seed = 7;
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function OrderGame({ items, wrongHint, doneText }: { items: OrderItem[]; wrongHint: string; doneText: string }) {
  const pool = useMemo(() => shuffled(items), [items]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const done = placed.length === items.length;

  const tap = (key: string) => {
    if (key === items[placed.length].key) {
      setPlaced((p) => [...p, key]);
      setWrong(null);
    } else {
      setWrong(key);
      setMistakes((m) => m + 1);
    }
  };

  return (
    <div>
      <ol className="order-slots">
        {items.map((it, i) => {
          const filled = i < placed.length;
          return (
            <li key={it.key} className="order-slot" data-filled={filled}>
              <span className="n">{i + 1}</span>
              <span>{filled ? it.label : "?"}</span>
              <span className="meta">{filled ? it.meta : ""}</span>
            </li>
          );
        })}
      </ol>

      {!done && (
        <div className="order-pool" role="group" aria-label="剩下的卡片">
          {pool
            .filter((it) => !placed.includes(it.key))
            .map((it) => (
              <button key={it.key + (wrong === it.key ? mistakes : "")} data-wrong={wrong === it.key} onClick={() => tap(it.key)}>
                {it.label}
              </button>
            ))}
        </div>
      )}
      <p className="order-hint" aria-live="polite">
        {done ? `${doneText} ${mistakes === 0 ? "一次都没错！" : `错了 ${mistakes} 次。`}` : wrong ? wrongHint : ""}
      </p>
      {(done || placed.length > 0) && (
        <button
          className="btn ghost"
          onClick={() => {
            setPlaced([]);
            setWrong(null);
            setMistakes(0);
          }}
        >
          再来一次
        </button>
      )}
    </div>
  );
}
