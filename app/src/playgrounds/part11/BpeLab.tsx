import { useMemo, useState } from "react";
import { corpusByKey } from "../../data/part11-corpus";
import { buildTokenizer, countTokens, pairCounts, pieces, type Merge } from "./bpe";
import { eul, ieyo } from "./ko";
import { getCorpus, getMerges, getSession, setMerges } from "./store";
import "./style.css";

const MAX = 60;
const COLORS = ["yellow", "mint", "sky", "pink", "violet", "orange"];
const fmt = (n: number) => n.toLocaleString("ko-KR");

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
    setTip(hadModel ? `${message} 토크나이저가 바뀌어서 94장 모델은 처음부터 다시 훈련해요.` : message);
  };

  const mergePair = (a: string, b: string, n: number, isTop: boolean) => {
    if (merges.length >= MAX) return;
    const t = a + b;
    commit(
      [...merges, [a, b]],
      isTop
        ? `'${a}'+'${b}' → '${t}'. 토큰이 ${n}개 줄고, 토큰 종류가 하나 늘었어요.`
        : `${eul(`'${t}'`)} 합쳤어요. 진짜 BPE는 늘 1등 쌍(노란색)부터 합쳐요. 그래야 토큰이 가장 많이 줄거든요.`,
    );
  };

  const auto = (k: number) => {
    let next = merges;
    for (let i = 0; i < k && next.length < MAX; i++) {
      const p = pairCounts(lines, next)[0];
      if (!p) break;
      next = [...next, [p.a, p.b]];
    }
    commit(next, `가장 잦은 쌍을 ${next.length - merges.length}번 연달아 합쳤어요.`);
  };

  const saved = base.tokens - tokens;

  return (
    <div>
      <dl className="p11-stats p11-stats3">
        <div>
          <dt>병합</dt>
          <dd>{merges.length}번</dd>
        </div>
        <div>
          <dt>전체 토큰</dt>
          <dd>{fmt(tokens)}개</dd>
          <small>{saved > 0 ? `−${fmt(saved)} (${((saved / base.tokens) * 100).toFixed(1)}%)` : "글자 단위"}</small>
        </div>
        <div>
          <dt>토큰 종류</dt>
          <dd>{fmt(tok.vocab.length)}가지</dd>
          <small>{tok.vocab.length > base.vocab ? `+${tok.vocab.length - base.vocab}` : "글자 수"}</small>
        </div>
      </dl>

      <ul className="p11-tokline" aria-label="토큰으로 자른 줄">
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

      <h4 className="p11-h4">낱말 안에서 붙어 나오는 쌍</h4>
      <div className="p11-pairs" role="group" aria-label="합칠 쌍 고르기">
        {pairs.map((p, i) => (
          <button key={p.a + "|" + p.b} className="p11-pair" data-top={i === 0 || undefined} disabled={merges.length >= MAX} onClick={() => mergePair(p.a, p.b, p.n, i === 0)}>
            <span className="p11-pair-ab">
              <span className="p11-tok">{p.a}</span>+<span className="p11-tok">{p.b}</span>
            </span>
            <span className="p11-pair-to">→ {p.a + p.b}</span>
            <span className="val num">{p.n}번</span>
          </button>
        ))}
        {pairs.length === 0 && <p className="p11-note">더 합칠 쌍이 없어요.</p>}
      </div>

      <div className="lab-actions">
        <button className="btn" disabled={!top || merges.length >= MAX} onClick={() => top && mergePair(top.a, top.b, top.n, true)}>
          1등 쌍 합치기
        </button>
        <button className="btn ghost" disabled={!top || merges.length >= MAX} onClick={() => auto(10)}>
          10번 연달아
        </button>
        <button className="btn ghost" disabled={!merges.length} onClick={() => commit(merges.slice(0, -1), "마지막 병합을 되돌렸어요.")}>
          되돌리기
        </button>
        <button className="btn ghost" disabled={!merges.length} onClick={() => commit([], "글자 단위로 돌아왔어요. 글자 하나 = 토큰 하나예요.")}>
          처음부터
        </button>
      </div>

      {merges.length > 0 && (
        <div className="p11-history" aria-label="병합 순서">
          {merges.map((m, i) => (
            <span key={i} className={`chip hl-${COLORS[i % COLORS.length]}`}>
              {m[0] + m[1]}
            </span>
          ))}
        </div>
      )}

      <p className="p11-uses">
        94장 모델이 쓸 토크나이저:{" "}
        <b>{merges.length ? `BPE, 병합 ${merges.length}번 (토큰 종류 ${fmt(tok.vocab.length)}가지)` : `글자 단위 (토큰 종류 ${fmt(tok.vocab.length)}가지)`}</b>
      </p>
      <p className="lab-tip">
        {merges.length >= MAX
          ? `여기까지! 이 작은 데이터에서는 ${MAX}번이면 충분해요. 토큰 종류가 너무 늘면 모델이 익힐 것도 늘어요.`
          : (tip ?? `데이터는 ${ieyo(corpus.name)}. 노란 쌍을 눌러 첫 병합을 해 보세요.`)}
      </p>
    </div>
  );
}
