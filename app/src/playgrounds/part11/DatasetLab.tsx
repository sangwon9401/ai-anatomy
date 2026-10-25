import { useMemo, useState } from "react";
import { CORPORA, corpusByKey, type CorpusKey } from "../../data/part11-corpus";
import { buildTokenizer, countTokens } from "./bpe";
import { miniConfig, paramCount } from "./minigpt";
import { eul, eun, ieyo } from "./ko";
import { getCorpus, getMerges, getSession, setCorpus } from "./store";
import "./style.css";

const COLORS: Record<CorpusKey, string> = { proverb: "yellow", song: "sky", textbook: "mint" };
const fmt = (n: number) => n.toLocaleString("ko-KR");

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
    const had = getSession() ? "94장에서 훈련한 모델" : getMerges().length ? "93장에서 만든 토크나이저" : null;
    setCorpus(k);
    setKey(k);
    setSeen((s) => new Set(s).add(k));
    setSample(pickLines(k));
    setLost(had);
  };

  return (
    <div>
      <div className="p11-picks" role="group" aria-label="데이터 고르기">
        {CORPORA.map((d) => (
          <button key={d.key} className="p11-pick" aria-pressed={d.key === key} data-color={COLORS[d.key]} onClick={() => choose(d.key)}>
            <b>{d.name}</b>
            <span>{d.lines.length}줄</span>
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
          다른 줄 보기
        </button>

        <dl className="p11-stats">
          <div>
            <dt>줄 수</dt>
            <dd>{fmt(st.lines)}</dd>
          </div>
          <div>
            <dt>크기</dt>
            <dd>{st.kb.toFixed(1)}KB</dd>
          </div>
          <div>
            <dt>토큰 (글자 단위)</dt>
            <dd>{fmt(st.tokens)}개</dd>
          </div>
          <div>
            <dt>토큰 종류</dt>
            <dd>{fmt(st.vocab)}가지</dd>
          </div>
        </dl>
        <p className="p11-note">
          토큰 종류가 {fmt(st.vocab)}가지라서, 이 데이터로 만드는 미니 GPT의 손잡이는 <b className="num">{fmt(st.params)}개</b>예요. 토큰마다 32칸짜리 임베딩이 하나씩 필요하거든요(33장).
        </p>

        <h4 className="p11-h4">가장 많이 나오는 글자</h4>
        <div className="bars">
          {st.top.map(([ch, n]) => (
            <div className="bar-row" key={ch}>
              <span className="label">{ch}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${(n / st.top[0][1]) * 100}%`, background: `var(--hl-${COLORS[key]})` }} />
              </span>
              <span className="val">{n}번</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        <li data-done={seen.size === 3}>
          {seen.size === 3 ? "✓" : "○"} 세 데이터를 모두 살펴보기 ({seen.size}/3)
        </li>
      </ul>
      <p className="lab-tip">
        {lost
          ? `데이터를 바꿔서 ${eun(lost)} 지워졌어요. 지금 데이터는 ${ieyo(c.name)}.`
          : `지금 고른 데이터는 ${ieyo(c.name)}. 93~95장에서 이 데이터로 만들어요. 다 읽은 모델은 ${eul(c.expect)} 쓰게 될 거예요.`}
      </p>
    </div>
  );
}
