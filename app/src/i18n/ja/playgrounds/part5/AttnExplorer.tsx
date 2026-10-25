// ja overlay of src/playgrounds/part5/AttnExplorer.tsx (strings only; the GPT-2 data stays English)
import { useState } from "react";
import { GPT2_HEADS } from "../../../../data/ch53";
import { GPT2_MAPS, GPT2_SENTENCES } from "../../../../data/part5-gpt2";
import "../../../../playgrounds/part5/style.css";

const CELL = 26;
const PADL = 78;
const PADT = 74;

/** ch53: real GPT-2 small attention maps (precomputed). Pick a sentence and a head, tap a word's row. */
export function AttnExplorer() {
  const [sk, setSk] = useState("cat");
  const [hk, setHk] = useState("prev");
  const [row, setRow] = useState<number | null>(null);
  const [found, setFound] = useState({ copy: false, played: false, it: false });

  const sent = GPT2_SENTENCES.find((s) => s.key === sk)!;
  const head = GPT2_HEADS.find((h) => h.key === hk)!;
  const map = GPT2_MAPS[sk][hk];
  const n = sent.toks.length;
  const size = PADL + n * CELL + 8;
  const r = row !== null && row < n ? row : null;

  const pick = (i: number) => {
    setRow(i);
    setFound((f) => ({
      copy: f.copy || (sk === "dog" && hk === "copy" && i >= 6),
      played: f.played || (sk === "friend" && hk === "subj" && sent.toks[i] === "played"),
      it: f.it || (sk === "cat" && hk === "subj" && sent.toks[i] === "it"),
    }));
  };
  const chooseSent = (k: string) => {
    setSk(k);
    setRow(null);
  };

  const top = r === null ? [] : map[r].map((v, j) => ({ v, j })).sort((a, b) => b.v - a.v).slice(0, 3);

  return (
    <div>
      <div className="p5-seg" role="group" aria-label="文をえらぶ">
        {GPT2_SENTENCES.map((s) => (
          <button key={s.key} aria-pressed={sk === s.key} onClick={() => chooseSent(s.key)}>
            {s.toks.slice(0, 3).join(" ")} …
          </button>
        ))}
      </div>
      <div className="p5-seg" role="group" aria-label="ヘッドをえらぶ" style={{ marginTop: 8 }}>
        {GPT2_HEADS.map((h) => (
          <button key={h.key} aria-pressed={hk === h.key} onClick={() => setHk(h.key)}>
            {h.name}
          </button>
        ))}
      </div>
      <p className="p5-src">
        "{sent.text}" · GPT-2のいちばん小さいモデルの L{head.layer}H{head.head} ({head.layer}層 {head.head}番ヘッド、0から数える)
      </p>
      <svg className="p5-heat" viewBox={`0 0 ${size} ${PADT + n * CELL + 6}`} role="img" aria-label={`「${head.name}」ヘッドのアテンションの地図`}>
        {sent.toks.map((t, j) => (
          <text key={`c${j}`} transform={`translate(${PADL + j * CELL + CELL / 2 + 4} ${PADT - 6}) rotate(-60)`} fontSize={11} fill={r !== null && top[0]?.j === j ? "var(--pen)" : "var(--ink-2)"} fontFamily="var(--font-mono)">
            {t}
          </text>
        ))}
        {sent.toks.map((t, i) => (
          <g key={`r${i}`} className="cell" onClick={() => pick(i)}>
            <rect x={0} y={PADT + i * CELL} width={PADL - 4} height={CELL} fill="transparent" />
            <text x={PADL - 6} y={PADT + i * CELL + CELL / 2 + 4} fontSize={11} textAnchor="end" fontFamily="var(--font-mono)" fill={r === i ? "var(--pen)" : "var(--ink)"} fontWeight={r === i ? 700 : 400}>
              {t}
            </text>
          </g>
        ))}
        {sent.toks.map((_, i) =>
          sent.toks.map((__, j) => (
            <rect
              key={`${i}-${j}`}
              className="cell"
              x={PADL + j * CELL + 1}
              y={PADT + i * CELL + 1}
              width={CELL - 2}
              height={CELL - 2}
              rx={3}
              onClick={() => pick(i)}
              style={{ fill: j > i ? "var(--line)" : `color-mix(in srgb, var(--hl-${head.c}) ${map[i][j]}%, var(--paper-2))` }}
              stroke={r === i ? "var(--pen)" : "none"}
              strokeWidth={r === i ? 1.5 : 0}
            />
          )),
        )}
      </svg>
      <p className="p5-note">語を押すと、その語(行)がいちばんよく見ている語が出ます。灰色のマスは目かくし(第51章)。</p>
      <div className="p5-words" role="group" aria-label="見つめる語をえらぶ" style={{ marginTop: 8 }}>
        {sent.toks.map((t, i) => (
          <button key={`${t}${i}`} aria-pressed={r === i} onClick={() => pick(i)} className="p5-vec">
            {t}
          </button>
        ))}
      </div>
      <div className="lab-out">
        {r === null ? (
          <p style={{ margin: 0, fontSize: 15, color: "var(--ink-2)" }}>語(行)を1つ押してみましょう。</p>
        ) : (
          <div className="bars">
            <div style={{ fontSize: 15 }}>
              <b>「{sent.toks[r]}」</b>がいちばんよく見ている語
            </div>
            {top.map(({ v, j }) => (
              <div className="bar-row" key={j}>
                <span className="label p5-vec">
                  {sent.toks[j]}
                  {j === r ? " (自分)" : ""}
                </span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${v}%`, background: `var(--hl-${head.c})` }} />
                </span>
                <span className="val">{v}%</span>
              </div>
            ))}
          </div>
        )}
        <p className="lab-sum">{head.desc}</p>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={found.it}>{found.it ? "○" : "□"} 「The cat …」の文、「主語さがし？」ヘッドで「it」の行を見る</li>
        <li data-done={found.played}>{found.played ? "○" : "□"} 「My friend …」の文で、「played」がだれを見ているか見つける</li>
        <li data-done={found.copy}>{found.copy ? "○" : "□"} 「I love my …」の文、「まねっこ」ヘッドで2つめの文の語の行を見る</li>
      </ul>
      <p className="lab-tip">
        {found.it && found.played && found.copy
          ? "本物のヘッドも、それぞれ見方がちがいます。研究者も、こうして地図を読みながらヘッドの仕事を調べています。"
          : "「すぐ前の語」ヘッドは、どの文でも対角線のすぐ下だけがこくなります。ほかのヘッドとくらべてみましょう。"}
      </p>
    </div>
  );
}
