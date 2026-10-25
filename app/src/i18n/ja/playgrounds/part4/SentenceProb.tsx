// ja overlay of src/playgrounds/part4/SentenceProb.tsx (strings only; 万/億 units as in Korean)
import { useState } from "react";
import { LM_COLORS, fmtPct, nextProbs, sentenceProb } from "../../../../data/ch37";
import "../../../../playgrounds/part4/style.css";

const LEN = 4;
const BEST = "私は 今日 学校に 行く";

/** "約385回に1回" style count, with Japanese 万/億 units for big numbers. */
function oneIn(p: number) {
  const n = Math.round(1 / p);
  if (n < 10_000) return `約${n.toLocaleString("ja-JP")}回に1回`;
  if (n < 100_000_000) return `約${Math.round(n / 10_000).toLocaleString("ja-JP")}万回に1回`;
  return `約${Math.round(n / 100_000_000).toLocaleString("ja-JP")}億回に1回`;
}

type Rec = { s: string; p: number };

export function SentenceProb() {
  const [words, setWords] = useState<string[]>([]);
  const [records, setRecords] = useState<Rec[]>([]);
  const done = words.length === LEN;
  const { options, rest } = nextProbs(words);
  const { p, factors } = sentenceProb(words);
  const text = words.join(" ");

  const add = (w: string) => {
    const next = [...words, w];
    setWords(next);
    if (next.length === LEN) {
      const s = next.join(" ");
      const pr = sentenceProb(next).p;
      setRecords((r) => (r.some((x) => x.s === s) ? r : [...r, { s, p: pr }].sort((a, b) => b.p - a.p)));
    }
  };

  const missions = [
    { label: "確率がいちばん高い文を見つける", done: records.some((r) => r.s === BEST) },
    { label: "同じ語で順番だけ変えて、0.1%をこえる文をもう1つ", done: records.some((r) => r.s !== BEST && r.p >= 0.001) },
    { label: "「ピザ」が入った文の確率を見る", done: records.some((r) => r.s.includes("ピザ")) },
  ];

  let tip: string;
  if (!done && words.length === 0) tip = "最初の語からえらんでみましょう。棒が長いほど、その場所によく来る語です。";
  else if (!done) tip = `「${words[words.length - 1]}」まで来ました。次の候補の確率は、前の${words.length}語を全部見て決まります。`;
  else if (text === BEST) tip = "1位の文です！ どの語も確率が高いので、かけてもいちばん大きくなります。";
  else if (text.includes("ピザ")) tip = "「ピザ」が入ったとたん、確率がぐっと下がりました。1語だけ不自然でも、かけた結果全体が小さくなります。";
  else if (p >= 0.001) tip = "自然な順番です。日本語は順番を少し変えても文になりますね。それでも1位よりは少し低いです。";
  else if (p < 0.00001) tip = "不自然な順番なので語ごとの確率が低く、かけるとものすごく小さくなりました。";
  else tip = "文にはなるけれど、よくある順番ではないので確率が低いです。";

  return (
    <div>
      <div className="p4-sentence" aria-live="polite" aria-label="作った文">
        {words.map((w) => (
          <span key={w} className={`chip hl-${LM_COLORS[w]}`}>
            {w}
          </span>
        ))}
        {Array.from({ length: LEN - words.length }, (_, i) => (
          <span key={i} className="p4-blank">
            {i === 0 ? "?" : ""}
          </span>
        ))}
      </div>

      {!done && (
        <div className="p4-opts" role="group" aria-label="次の語の候補">
          {options.map((o) => (
            <button key={o.w} className="p4-opt" onClick={() => add(o.w)} aria-label={`${o.w}, ${fmtPct(o.p)}`}>
              <span>{o.w}</span>
              <span className="track">
                <span className="fill" style={{ width: `${Math.max(o.p * 100, 1)}%`, background: `var(--hl-${LM_COLORS[o.w]})` }} />
              </span>
              <span className="val">{fmtPct(o.p)}</span>
            </button>
          ))}
          <div className="p4-opt p4-rest" aria-label={`ほかの語ぜんぶ、${fmtPct(rest)}`}>
            <span>ほかの語</span>
            <span className="track">
              <span className="fill" style={{ width: `${rest * 100}%`, background: "var(--line)" }} />
            </span>
            <span className="val">{fmtPct(rest)}</span>
          </div>
        </div>
      )}

      <p className="p4-product" aria-live="polite">
        {words.length === 0 ? (
          "文の確率 = (えらんだ語の確率を順番にかけた値)"
        ) : (
          <>
            {factors.map((f, i) => (
              <span key={i}>
                {i > 0 && <span className="p4-x">×</span>}
                {fmtPct(f)}
              </span>
            ))}
            <span className="p4-x">=</span>
            <b>{fmtPct(p)}</b>
          </>
        )}
      </p>
      {done && (
        <p className="p4-result">
          「{text}」の確率は<b>{fmtPct(p)}</b>。4語の文が{oneIn(p)}の割合で出てきます。
        </p>
      )}

      <div className="lab-actions">
        {done ? (
          <button className="btn" onClick={() => setWords([])}>
            新しい文を作る
          </button>
        ) : (
          <button className="btn ghost" disabled={words.length === 0} onClick={() => setWords(words.slice(0, -1))}>
            1語消す
          </button>
        )}
        {records.length > 0 && (
          <button
            className="btn ghost"
            onClick={() => {
              setWords([]);
              setRecords([]);
            }}
          >
            記録を消す
          </button>
        )}
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {missions.map((m) => (
          <li key={m.label} data-done={m.done}>
            {m.done ? "○" : "□"} {m.label}
          </li>
        ))}
      </ul>

      {records.length > 0 && (
        <div className="p4-records">
          <h4>自分で作った文 (確率の高い順)</h4>
          <ol>
            {records.slice(0, 6).map((r, i) => (
              <li key={r.s} data-now={done && r.s === text}>
                <span className="n">{i + 1}</span>
                <span>{r.s}</span>
                <span className="v">{fmtPct(r.p)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="lab-tip">{tip}</p>
      <p className="p4-note">* 確率は説明用の例です。本物の言語モデルは、何万もの語の候補に確率をつけます。</p>
    </div>
  );
}
