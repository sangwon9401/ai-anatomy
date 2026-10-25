import type { Tok } from "../../data/part3-tokens";
import "./style.css";

const COLORS = ["sky", "yellow", "mint", "pink", "violet", "orange"];

/** Token chips in reading order; `ids` shows the token numbers instead of the text. */
export function TokenChips({ toks, ids = false, label }: { toks: Tok[]; ids?: boolean; label?: string }) {
  return (
    <div className="p3-toks" role="list" aria-label={label ?? `토큰 ${toks.length}개`}>
      {toks.map((t, i) => {
        const partial = t.length === 3;
        return (
          <span
            role="listitem"
            key={i}
            className={`p3-tok${partial ? " part" : ` hl-${COLORS[i % COLORS.length]}`}${ids ? " num" : ""}`}
            title={partial ? "글자 하나의 바이트 일부" : undefined}
          >
            {ids
              ? t[1]
              : [...t[0]].map((c, j) =>
                  c === " " ? (
                    <span key={j} className="p3-sp" aria-label="띄어쓰기">
                      ␣
                    </span>
                  ) : (
                    c
                  ),
                )}
          </span>
        );
      })}
    </div>
  );
}
