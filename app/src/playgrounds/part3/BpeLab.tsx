import { useMemo, useState } from "react";
import { DIARY, SCHOOL, applyMerge, countPairs, encode, split0, totalPieces, type Corpus, type Pair } from "../../data/ch30";
import "./style.css";

const CORPORA: { key: string; name: string; c: Corpus; sample: string }[] = [
  { key: "diary", name: "일기장", c: DIARY, sample: "숙제했다 청소한다" },
  { key: "school", name: "학교 이야기", c: SCHOOL, sample: "학교에 친구가 왔다" },
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
    ? `'${wrong}'보다 더 자주 나온 짝이 있어요. 숫자가 가장 큰 짝을 찾아보세요.`
    : pairs.length === 0
      ? "더 합칠 짝이 없어요. 단어마다 한 조각이 됐어요!"
      : merges.length === 0
        ? "BPE는 언제나 가장 많이 나온 짝부터 합쳐요."
        : `합칠 때마다 조각이 줄어요: ${start}개 → ${now}개. 아래에 단어를 써서 내 토크나이저로 잘라 보세요.`;

  return (
    <div>
      <div className="ctx-presets p3-presets" role="group" aria-label="글 모음 고르기">
        {CORPORA.map((c, i) => (
          <button key={c.key} aria-pressed={i === ck} className={i === ck ? "p3-on" : undefined} onClick={() => reset(i)}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="p3-bpe">
        <div className="p3-corpus" aria-label="글 모음">
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
            조각 수 <b>{now}</b>개 (처음 {start}개)
          </div>
        </div>

        <div className="p3-pairs">
          <div className="p3-sub">짝 세기 · 눌러서 합치기</div>
          {pairs.slice(0, 6).map((p) => (
            <button key={`${p.a}+${p.b}`} className="p3-pair" data-wrong={wrong === `${p.a}+${p.b}`} onClick={() => pick(p)} aria-label={`${p.a} 더하기 ${p.b}, ${p.n}번`}>
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
          알아서 하나 합치기
        </button>
        <button className="btn ghost" onClick={() => reset()}>
          처음부터
        </button>
      </div>

      {learned.length > 0 && (
        <div className="p3-learned">
          <span className="muted">새 토큰:</span>
          {learned.map((m, i) => (
            <span key={i} className={`p3-tok hl-${COLORS[i % COLORS.length]}`}>
              {m}
            </span>
          ))}
        </div>
      )}
      <p className="lab-tip">{tip}</p>

      <label className="code-label" htmlFor="p3-bpe-try">
        연습용 토크나이저로 잘라 보기 (위에서 만든 합치기 규칙만 써요)
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
      <p className="lab-sum">진짜 GPT 토크나이저가 아니라, 이 글 모음으로만 배운 작은 연습용이에요. 진짜는 바이트에서 시작해 약 20만 조각까지 합쳐요.</p>
    </div>
  );
}
