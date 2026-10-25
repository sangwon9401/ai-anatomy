import { useMemo, useState } from "react";
import { corpusByKey } from "../../../../data/part11-corpus";
import { buildTokenizer, countTokens, pairCounts, pieces, type Merge } from "../../../../playgrounds/part11/bpe";
import { eul, ieyo } from "../../../../playgrounds/part11/ko";
import { getCorpus, getMerges, getSession, setMerges } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

const MAX = 60;
const COLORS = ["yellow", "mint", "sky", "pink", "violet", "orange"];
const fmt = (n: number) => n.toLocaleString("ja-JP");

export function BpeLab() {
  const corpus = corpusByKey(getCorpus());
  const lines = corpus.lines;
  const [merges, setLocal] = useState<Merge[]>(getMerges);
  const [tip, setTip] = useState<string | null>(null);

  const base = useMemo(() => ({ tokens: countTokens(lines, []), vocab: buildTokenizer(lines, []).vocab.length }), [lines]);
  const tok = useMemo(() => buildTokenizer(lines, merges), [lines, merges]);
  const tokens = useMemo(() => countTokens(lines, merges), [lines, merges]);
  const pairs = useMemo(() => pairCounts(lines, merges).slice(0, 5), [lines, merges]);
  const top = pairs[0];
  const last = merges.length ? merges[merges.length - 1].join("") : null;
  const mergedIndex = useMemo(() => new Map(merges.map((m, i) => [m.join(""), i])), [merges]);

  // lines that show the last merge and the next candidate
  const shown = useMemo(() => {
    const has = (t: string) => (l: string) => l.split(" ").some((w) => w.includes(t));
    const out: string[] = [];
    if (last) out.push(...lines.filter(has(last)).slice(0, 2));
    if (top) for (const l of lines.filter(has(top.a + top.b))) if (out.length < 3 && !out.includes(l)) out.push(l);
    for (const l of lines) if (out.length < 3 && !out.includes(l)) out.push(l);
    return out;
  }, [lines, last, top]);

  const commit = (next: Merge[], message: string) => {
    const hadModel = getSession() !== null;
    setLocal(next);
    setMerges(next);
    setTip(hadModel ? `${message} トークナイザーが変わったので、第94章のモデルは最初から訓練し直します。` : message);
  };

  const mergePair = (a: string, b: string, n: number, isTop: boolean) => {
    if (merges.length >= MAX) return;
    const t = a + b;
    commit(
      [...merges, [a, b]],
      isTop
        ? `「${a}」+「${b}」→「${t}」。トークンが${n}個減り、トークンの種類が1つ増えました。`
        : `${eul(`「${t}」`)}くっつけました。本物のBPEは、いつも1位のペア（黄色）からくっつけます。そのほうがトークンがいちばん減るからです。`,
    );
  };

  const auto = (k: number) => {
    let next = merges;
    for (let i = 0; i < k && next.length < MAX; i++) {
      const p = pairCounts(lines, next)[0];
      if (!p) break;
      next = [...next, [p.a, p.b]];
    }
    commit(next, `いちばん多いペアを${next.length - merges.length}回続けてくっつけました。`);
  };

  const saved = base.tokens - tokens;

  return (
    <div>
      <dl className="p11-stats p11-stats3">
        <div>
          <dt>くっつけ</dt>
          <dd>{merges.length}回</dd>
        </div>
        <div>
          <dt>トークン全体</dt>
          <dd>{fmt(tokens)}個</dd>
          <small>{saved > 0 ? `−${fmt(saved)} (${((saved / base.tokens) * 100).toFixed(1)}%)` : "文字単位"}</small>
        </div>
        <div>
          <dt>トークンの種類</dt>
          <dd>{fmt(tok.vocab.length)}種類</dd>
          <small>{tok.vocab.length > base.vocab ? `+${tok.vocab.length - base.vocab}` : "文字の数"}</small>
        </div>
      </dl>

      <ul className="p11-tokline" aria-label="トークンに切った行">
        {shown.map((l) => (
          <li key={l}>
            {pieces(tok, l).map((p, i, arr) => {
              if (p === " ") return <span key={i} className="p11-gap" />;
              const mi = mergedIndex.get(p);
              const cand = top && ((p === top.a && arr[i + 1] === top.b) || (p === top.b && arr[i - 1] === top.a));
              return (
                <span key={i} className={`p11-tok ${mi !== undefined ? `hl-${COLORS[mi % COLORS.length]}` : ""}`} data-cand={cand || undefined} data-new={p === last || undefined}>
                  {p}
                </span>
              );
            })}
          </li>
        ))}
      </ul>

      <h4 className="p11-h4">となり合って出てくるペア</h4>
      <div className="p11-pairs" role="group" aria-label="くっつけるペアを選ぶ">
        {pairs.map((p, i) => (
          <button key={p.a + "|" + p.b} className="p11-pair" data-top={i === 0 || undefined} disabled={merges.length >= MAX} onClick={() => mergePair(p.a, p.b, p.n, i === 0)}>
            <span className="p11-pair-ab">
              <span className="p11-tok">{p.a}</span>+<span className="p11-tok">{p.b}</span>
            </span>
            <span className="p11-pair-to">→ {p.a + p.b}</span>
            <span className="val num">{p.n}回</span>
          </button>
        ))}
        {pairs.length === 0 && <p className="p11-note">くっつけられるペアはもうありません。</p>}
      </div>

      <div className="lab-actions">
        <button className="btn" disabled={!top || merges.length >= MAX} onClick={() => top && mergePair(top.a, top.b, top.n, true)}>
          1位のペアをくっつける
        </button>
        <button className="btn ghost" disabled={!top || merges.length >= MAX} onClick={() => auto(10)}>
          10回続けて
        </button>
        <button className="btn ghost" disabled={!merges.length} onClick={() => commit(merges.slice(0, -1), "最後のくっつけを取り消しました。")}>
          取り消す
        </button>
        <button className="btn ghost" disabled={!merges.length} onClick={() => commit([], "文字単位にもどりました。1文字 = 1トークンです。")}>
          最初から
        </button>
      </div>

      {merges.length > 0 && (
        <div className="p11-history" aria-label="くっつけた順番">
          {merges.map((m, i) => (
            <span key={i} className={`chip hl-${COLORS[i % COLORS.length]}`}>
              {m[0] + m[1]}
            </span>
          ))}
        </div>
      )}

      <p className="p11-uses">
        第94章のモデルが使うトークナイザー：
        <b>{merges.length ? `BPE、くっつけ${merges.length}回（トークンの種類 ${fmt(tok.vocab.length)}）` : `文字単位（トークンの種類 ${fmt(tok.vocab.length)}）`}</b>
      </p>
      <p className="lab-tip">
        {merges.length >= MAX
          ? `ここまで！この小さなデータなら${MAX}回で十分です。トークンの種類が増えすぎると、モデルが覚えることも増えます。`
          : (tip ?? `データは${ieyo(corpus.name)}。日本語には空白がないので、行の中ならどこでもくっつけられます。黄色のペアを押して、最初のくっつけをしてみましょう。`)}
      </p>
    </div>
  );
}
