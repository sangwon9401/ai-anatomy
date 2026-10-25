import { useState } from "react";
import { PROBLEMS } from "../../../../data/ch87";
import "../../../../playgrounds/part10/style.css";

const chars = (s: string) => [...s.replace(/\s/g, "")].length;
/** the subject particle after a word (Japanese: always が) */
const iGa = (_w: string) => "が";

export function ThinkSteps() {
  const [pi, setPi] = useState(0);
  const [mine, setMine] = useState<string | null>(null);
  const [fast, setFast] = useState(false);
  const [shown, setShown] = useState(0);
  const [solved, setSolved] = useState<string[]>([]);
  const p = PROBLEMS[pi];
  const done = shown >= p.steps.length;
  const fastChars = chars(`答え：${p.fast}`);
  const slowChars = p.steps.reduce((a, s) => a + chars(s), 0) + chars(`答え：${p.answer}`);

  const choose = (i: number) => {
    setPi(i);
    setMine(null);
    setFast(false);
    setShown(0);
  };
  const next = () => {
    const n = shown + 1;
    setShown(n);
    if (n >= p.steps.length && !solved.includes(p.key)) setSolved([...solved, p.key]);
  };

  const tip =
    mine === null
      ? "まず自分の答えを選んでみましょう。思いついたまま、すばやく！"
      : !done
        ? shown > 0
          ? "1行書くたびに、モデルは前に書いた行を読み返します。続けて押してみましょう。"
          : fast
            ? "すぐ書いた答えはもっともらしいけれど、検算でひっかかりました。今度は1行ずつ解かせてみましょう。"
            : "では、モデルに2つの方法でやらせてみましょう。"
        : mine === p.answer
          ? `最初から正解でしたね！解き方を書けば、なぜ「${p.answer}」なのかも見せられます。`
          : `自分の最初の答えは「${mine}」、解いて書くと「${p.answer}」${iGa(p.answer)}出ました。${mine === p.fast ? "すぐ浮かぶ答えがわなだったのです！" : "解き方を書くと、どこで分かれたかが見えます。"}`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="問題を選ぶ">
        {PROBLEMS.map((q, i) => (
          <button key={q.key} className="p10-seg" aria-pressed={pi === i} onClick={() => choose(i)}>
            {solved.includes(q.key) ? "✓ " : ""}
            {q.title}
          </button>
        ))}
      </div>
      <p className="p10-q">{p.q}</p>

      <h4 className="p10-h">① まず自分の答え（すばやく！）</h4>
      <div className="p10-choices" role="group" aria-label="自分の答え">
        {p.choices.map((c) => (
          <button key={c} aria-pressed={mine === c} onClick={() => setMine(c)}>
            {c}
          </button>
        ))}
      </div>

      <h4 className="p10-h">② モデルにやらせてみる</h4>
      <div className="p10-duo">
        <section className="p10-panel">
          <h5>すぐ答える</h5>
          <button className="btn ghost" disabled={mine === null || fast} onClick={() => setFast(true)}>
            「答えだけ書いて」
          </button>
          {fast && (
            <>
              <p className="p10-line">
                <span className="chip hl-pink">答え：{p.fast}</span>
              </p>
              <p className="p10-line bad">{p.fastCheck}</p>
              <p className="lab-sum">書いた文字 {fastChars}字・説明用の例</p>
            </>
          )}
        </section>
        <section className="p10-panel">
          <h5>解いて答える</h5>
          <button className="btn" disabled={mine === null || done} onClick={next}>
            {shown === 0 ? "「順を追って解こう」" : "もう1行書く"}
          </button>
          <ol className="p10-think" aria-live="polite">
            {p.steps.slice(0, shown).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {done && (
            <>
              <p className="p10-line">
                <span className="chip hl-mint">答え：{p.answer}</span>
              </p>
              <p className="lab-sum">
                書いた文字 {slowChars}字・すぐ答える場合の約{Math.round(slowChars / fastChars)}倍
              </p>
            </>
          )}
        </section>
      </div>
      {done && (
        <p className="lab-sum">
          文字をたくさん書くほど、モデルを何回も動かします（第2章）。そのぶん時間はかかりますが、難しい計算を1行ずつ分けてできます。
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        {PROBLEMS.map((q) => (
          <li key={q.key} data-done={solved.includes(q.key)}>
            {solved.includes(q.key) ? "✓" : "○"} 「{q.title}」を解いて正解する
          </li>
        ))}
      </ul>
      <p className="lab-tip">{solved.length === PROBLEMS.length && done ? "3問とも解きました！3問とも「すぐ浮かぶ答え」がわなでした。だから大事な問題は、解き方を書いて検算します。" : tip}</p>
      <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
        モデルの「すぐ答える」は、説明のために作った例です。実際の大きなモデルは、こうした有名な問題に正解することもあります。
      </p>
    </div>
  );
}
