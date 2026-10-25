import { useMemo, useState } from "react";
import { CORPORA, corpusByKey, type CorpusKey } from "../../../../data/part11-corpus";
import { buildTokenizer, countTokens } from "../../../../playgrounds/part11/bpe";
import { miniConfig, paramCount } from "../../../../playgrounds/part11/minigpt";
import { eul, eun, ieyo } from "../../../../playgrounds/part11/ko";
import { getCorpus, getMerges, getSession, setCorpus } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

const COLORS: Record<CorpusKey, string> = { proverb: "yellow", song: "sky", textbook: "mint" };
const fmt = (n: number) => n.toLocaleString("zh-CN");

function stats(key: CorpusKey) {
  const c = corpusByKey(key);
  const tok = buildTokenizer(c.lines, []);
  const freq = new Map<string, number>();
  for (const line of c.lines) for (const ch of line) if (ch !== " ") freq.set(ch, (freq.get(ch) ?? 0) + 1);
  const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return {
    lines: c.lines.length,
    tokens: countTokens(c.lines, []),
    vocab: tok.vocab.length,
    params: paramCount(miniConfig(tok.vocab.length)),
    kb: new TextEncoder().encode(c.lines.join("\n")).length / 1024,
    top,
  };
}

const pickLines = (key: CorpusKey) => {
  const lines = corpusByKey(key).lines;
  const out = new Set<string>();
  while (out.size < 3) out.add(lines[Math.floor(Math.random() * lines.length)]);
  return [...out];
};

export function DatasetLab() {
  const [key, setKey] = useState<CorpusKey>(getCorpus);
  const [seen, setSeen] = useState<Set<CorpusKey>>(() => new Set([getCorpus()]));
  const [sample, setSample] = useState(() => pickLines(getCorpus()));
  const [lost, setLost] = useState<string | null>(null);
  const c = corpusByKey(key);
  const st = useMemo(() => stats(key), [key]);

  const choose = (k: CorpusKey) => {
    if (k === key) return;
    const had = getSession() ? "第 94 章训练的模型" : getMerges().length ? "第 93 章做的分词器" : null;
    setCorpus(k);
    setKey(k);
    setSeen((s) => new Set(s).add(k));
    setSample(pickLines(k));
    setLost(had);
  };

  return (
    <div>
      <div className="p11-picks" role="group" aria-label="挑选数据">
        {CORPORA.map((d) => (
          <button key={d.key} className="p11-pick" aria-pressed={d.key === key} data-color={COLORS[d.key]} onClick={() => choose(d.key)}>
            <b>{d.name}</b>
            <span>{d.lines.length} 行</span>
          </button>
        ))}
      </div>

      <div className="p11-card">
        <p className="p11-blurb">{c.blurb}</p>
        <ul className="p11-lines">
          {sample.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <button className="btn ghost" onClick={() => setSample(pickLines(key))}>
          换几行看看
        </button>

        <dl className="p11-stats">
          <div>
            <dt>行数</dt>
            <dd>{fmt(st.lines)}</dd>
          </div>
          <div>
            <dt>大小</dt>
            <dd>{st.kb.toFixed(1)}KB</dd>
          </div>
          <div>
            <dt>词元（按字切）</dt>
            <dd>{fmt(st.tokens)} 个</dd>
          </div>
          <div>
            <dt>词元种类</dt>
            <dd>{fmt(st.vocab)} 种</dd>
          </div>
        </dl>
        <p className="p11-note">
          词元有 {fmt(st.vocab)} 种，所以用这份数据做的迷你 GPT 有 <b className="num">{fmt(st.params)} 个</b>旋钮。因为每种词元都需要一个 32 格的嵌入（第 33 章）。
        </p>

        <h4 className="p11-h4">出现最多的字</h4>
        <div className="bars">
          {st.top.map(([ch, n]) => (
            <div className="bar-row" key={ch}>
              <span className="label">{ch}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${(n / st.top[0][1]) * 100}%`, background: `var(--hl-${COLORS[key]})` }} />
              </span>
              <span className="val">{n} 次</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        <li data-done={seen.size === 3}>
          {seen.size === 3 ? "✓" : "○"} 三份数据都看一遍（{seen.size}/3）
        </li>
      </ul>
      <p className="lab-tip">
        {lost
          ? `换了数据，${eun(lost)}已经清掉了。现在的数据是“${ieyo(c.name)}”。`
          : `现在选的数据是“${ieyo(c.name)}”。第 93～95 章都用这份数据。读完它的模型会写出${eul(c.expect)}。`}
      </p>
    </div>
  );
}
