// zh overlay of src/playgrounds/part3/BpeLab.tsx (strings only)
import { useMemo, useState } from "react";
import { DIARY, SCHOOL, applyMerge, countPairs, encode, split0, totalPieces, type Corpus, type Pair } from "../../../../data/ch30";
import "../../../../playgrounds/part3/style.css";

const CORPORA: { key: string; name: string; c: Corpus; sample: string }[] = [
  { key: "diary", name: "日记本", c: DIARY, sample: "跑步完了 打扫一下" },
  { key: "school", name: "校园生活", c: SCHOOL, sample: "在学校吃好吃的" },
];
const COLORS = ["yellow", "sky", "mint", "pink", "violet", "orange"];

export function BpeLab() {
  const [ck, setCk] = useState(0);
  const [merges, setMerges] = useState<Pair[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [text, setText] = useState(CORPORA[0].sample);
  const corpus = CORPORA[ck].c;

  const pieces = useMemo(() => merges.reduce((st, m) => st.map((ps) => applyMerge(ps, m.a, m.b)), corpus.map((c) => split0(c.w))), [merges, corpus]);
  const pairs = countPairs(pieces, corpus);
  const top = pairs[0]?.n ?? 0;
  const learned = merges.map((m) => m.a + m.b);
  const colorOf = (p: string) => {
    const i = learned.lastIndexOf(p);
    return i >= 0 ? `hl-${COLORS[i % COLORS.length]}` : "p3-plain";
  };
  const start = totalPieces(
    corpus.map((c) => split0(c.w)),
    corpus,
  );
  const now = totalPieces(pieces, corpus);
  const typed = encode(text, merges);

  const pick = (p: Pair) => {
    if (p.n < top) {
      setWrong(`${p.a}+${p.b}`);
      return;
    }
    setWrong(null);
    setMerges((ms) => [...ms, p]);
  };
  const reset = (k = ck) => {
    setCk(k);
    setMerges([]);
    setWrong(null);
    if (k !== ck) setText(CORPORA[k].sample);
  };

  const tip = wrong
    ? `还有比“${wrong}”出现得更多的一对。找找数字最大的那一对。`
    : pairs.length === 0
      ? "没有可以合并的对了。每个词都变成了一整块！"
      : merges.length === 0
        ? "BPE 总是先合并出现次数最多的一对。"
        : `每合并一次，块数就变少：${start} 块 → ${now} 块。在下面写一个词，用你的分词器切切看。`;

  return (
    <div>
      <div className="ctx-presets p3-presets" role="group" aria-label="选择文字集">
        {CORPORA.map((c, i) => (
          <button key={c.key} aria-pressed={i === ck} className={i === ck ? "p3-on" : undefined} onClick={() => reset(i)}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="p3-bpe">
        <div className="p3-corpus" aria-label="文字集">
          {corpus.map((c, i) => (
            <div className="p3-crow" key={c.w}>
              <span className="p3-toks p3-tight">
                {pieces[i].map((p, k) => (
                  <span key={k} className={`p3-tok ${colorOf(p)}`}>
                    {p}
                  </span>
                ))}
              </span>
              <span className="p3-times num">×{c.n}</span>
            </div>
          ))}
          <div className="lab-sum num">
            块数 <b>{now}</b> 块（一开始 {start} 块）
          </div>
        </div>

        <div className="p3-pairs">
          <div className="p3-sub">数对子 · 点一下就合并</div>
          {pairs.slice(0, 6).map((p) => (
            <button key={`${p.a}+${p.b}`} className="p3-pair" data-wrong={wrong === `${p.a}+${p.b}`} onClick={() => pick(p)} aria-label={`${p.a} 加 ${p.b}，${p.n} 次`}>
              <span className="p3-pair-name">
                {p.a}+{p.b}
              </span>
              <span className="track">
                <span className="fill" style={{ width: `${(p.n / Math.max(1, top)) * 100}%` }} />
              </span>
              <span className="num">{p.n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn ghost" disabled={!pairs.length} onClick={() => pairs[0] && pick(pairs[0])}>
          自动合并一对
        </button>
        <button className="btn ghost" onClick={() => reset()}>
          从头开始
        </button>
      </div>

      {learned.length > 0 && (
        <div className="p3-learned">
          <span className="muted">新词元：</span>
          {learned.map((m, i) => (
            <span key={i} className={`p3-tok hl-${COLORS[i % COLORS.length]}`}>
              {m}
            </span>
          ))}
        </div>
      )}
      <p className="lab-tip">{tip}</p>

      <label className="code-label" htmlFor="p3-bpe-try">
        用练习分词器切切看（只用上面做出的合并规则）
      </label>
      <input id="p3-bpe-try" className="code-input" value={text} maxLength={30} onChange={(e) => setText(e.target.value)} />
      <div className="p3-toks">
        {typed.map((ps, w) => (
          <span key={w} className="p3-word">
            {ps.map((p, k) => (
              <span key={k} className={`p3-tok ${colorOf(p)}`}>
                {p}
              </span>
            ))}
          </span>
        ))}
      </div>
      <p className="lab-sum">这不是真正的 GPT 分词器，而是只从这份文字里学出来的小练习版。真正的分词器从字节开始，一直合并到约 20 万块。</p>
    </div>
  );
}
