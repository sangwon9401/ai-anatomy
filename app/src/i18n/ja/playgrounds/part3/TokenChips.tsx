// ja overlay of src/playgrounds/part3/TokenChips.tsx (strings only)
import type { Tok } from "../../../../data/part3-tokens";
import "../../../../playgrounds/part3/style.css";

const COLORS = ["sky", "yellow", "mint", "pink", "violet", "orange"];

/** Token chips in reading order; `ids` shows the token numbers instead of the text. */
export function TokenChips({ toks, ids = false, label }: { toks: Tok[]; ids?: boolean; label?: string }) {
  return (
    <div className="p3-toks" role="list" aria-label={label ?? `トークン${toks.length}個`}>
      {toks.map((t, i) => {
        const partial = t.length === 3;
        return (
          <span
            role="listitem"
            key={i}
            className={`p3-tok${partial ? " part" : ` hl-${COLORS[i % COLORS.length]}`}${ids ? " num" : ""}`}
            title={partial ? "1文字のバイトの一部" : undefined}
          >
            {ids
              ? t[1]
              : [...t[0]].map((c, j) =>
                  c === " " ? (
                    <span key={j} className="p3-sp" aria-label="スペース">
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
