import { useMemo, useState } from "react";
import { corpusByKey } from "../../../../data/part11-corpus";
import { buildTokenizer, countTokens, pairCounts, pieces, type Merge } from "../../../../playgrounds/part11/bpe";
import { eul, ieyo } from "../../../../playgrounds/part11/ko";
import { getCorpus, getMerges, getSession, setMerges } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

const MAX = 60;
const COLORS = ["yellow", "mint", "sky", "pink", "violet", "orange"];
const fmt = (n: number) => n.toLocaleString("zh-CN");

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
    setTip(hadModel ? `${message}分词器变了，所以第 94 章的模型要从头重新训练。` : message);
  };

  const mergePair = (a: string, b: string, n: number, isTop: boolean) => {
    if (merges.length >= MAX) return;
    const t = a + b;
    commit(
      [...merges, [a, b]],
      isTop
        ? `“${a}”+“${b}” → “${t}”。词元少了 ${n} 个，词元种类多了一种。`
        : `合并了${eul(`“${t}”`)}。真正的 BPE 总是先合并第 1 名的那一对（黄色），这样词元减少得最多。`,
    );
  };

  const auto = (k: number) => {
    let next = merges;
    for (let i = 0; i < k && next.length < MAX; i++) {
      const p = pairCounts(lines, next)[0];
      if (!p) break;
      next = [...next, [p.a, p.b]];
    }
    commit(next, `把最常见的一对连续合并了 ${next.length - merges.length} 次。`);
  };

  const saved = base.tokens - tokens;

  return (
    <div>
      <dl className="p11-stats p11-stats3">
        <div>
          <dt>合并</dt>
          <dd>{merges.length} 次</dd>
        </div>
        <div>
          <dt>词元总数</dt>
          <dd>{fmt(tokens)} 个</dd>
          <small>{saved > 0 ? `−${fmt(saved)} (${((saved / base.tokens) * 100).toFixed(1)}%)` : "按字切"}</small>
        </div>
        <div>
          <dt>词元种类</dt>
          <dd>{fmt(tok.vocab.length)} 种</dd>
          <small>{tok.vocab.length > base.vocab ? `+${tok.vocab.length - base.vocab}` : "字数"}</small>
        </div>
      </dl>

      <ul className="p11-tokline" aria-label="切成词元的句子">
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

      <h4 className="p11-h4">挨在一起出现的一对</h4>
      <div className="p11-pairs" role="group" aria-label="选择要合并的一对">
        {pairs.map((p, i) => (
          <button key={p.a + "|" + p.b} className="p11-pair" data-top={i === 0 || undefined} disabled={merges.length >= MAX} onClick={() => mergePair(p.a, p.b, p.n, i === 0)}>
            <span className="p11-pair-ab">
              <span className="p11-tok">{p.a}</span>+<span className="p11-tok">{p.b}</span>
            </span>
            <span className="p11-pair-to">→ {p.a + p.b}</span>
            <span className="val num">{p.n} 次</span>
          </button>
        ))}
        {pairs.length === 0 && <p className="p11-note">没有可以再合并的一对了。</p>}
      </div>

      <div className="lab-actions">
        <button className="btn" disabled={!top || merges.length >= MAX} onClick={() => top && mergePair(top.a, top.b, top.n, true)}>
          合并第 1 名
        </button>
        <button className="btn ghost" disabled={!top || merges.length >= MAX} onClick={() => auto(10)}>
          连续 10 次
        </button>
        <button className="btn ghost" disabled={!merges.length} onClick={() => commit(merges.slice(0, -1), "撤销了最后一次合并。")}>
          撤销
        </button>
        <button className="btn ghost" disabled={!merges.length} onClick={() => commit([], "回到按字切了：一个字 = 一个词元。")}>
          重新开始
        </button>
      </div>

      {merges.length > 0 && (
        <div className="p11-history" aria-label="合并顺序">
          {merges.map((m, i) => (
            <span key={i} className={`chip hl-${COLORS[i % COLORS.length]}`}>
              {m[0] + m[1]}
            </span>
          ))}
        </div>
      )}

      <p className="p11-uses">
        第 94 章模型要用的分词器：{" "}
        <b>{merges.length ? `BPE，合并 ${merges.length} 次（词元 ${fmt(tok.vocab.length)} 种）` : `按字切（词元 ${fmt(tok.vocab.length)} 种）`}</b>
      </p>
      <p className="lab-tip">
        {merges.length >= MAX
          ? `就到这里！这么小的数据，合并 ${MAX} 次就够了。词元种类太多，模型要学的东西也会变多。`
          : (tip ?? `数据是“${ieyo(corpus.name)}”。点黄色的那一对，做第一次合并吧。`)}
      </p>
    </div>
  );
}
