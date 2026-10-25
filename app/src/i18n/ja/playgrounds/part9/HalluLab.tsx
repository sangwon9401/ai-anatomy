import { useState } from "react";
import { HONEST, QUESTION84, TREE, type Opt } from "../../../../data/ch84";
import { pickIndex } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

type Sim = { fake: number; honest: number; examples: string[] };

function sampleAnswer() {
  const out: string[] = [];
  let node = "start";
  while (node !== "end") {
    const opts = TREE[node];
    const o = opts[pickIndex(opts.map((x) => x.p), Math.random())];
    out.push(o.w);
    node = o.next ?? "end";
  }
  return out;
}

export function HalluLab() {
  const [path, setPath] = useState<string[]>([]);
  const [node, setNode] = useState("start");
  const [checked, setChecked] = useState(false);
  const [sim, setSim] = useState<Sim | null>(null);
  const [done, setDone] = useState({ fake: false, honest: false, sim: false });

  const finished = node === "end";
  const isHonest = path[0] === HONEST;
  const opts = finished ? [] : TREE[node];

  const choose = (o: Opt) => {
    const next = [...path, o.w];
    setPath(next);
    const nn = o.next ?? "end";
    setNode(nn);
    if (nn === "end") setDone((d) => ({ ...d, fake: d.fake || next[0] !== HONEST, honest: d.honest || next[0] === HONEST }));
  };
  const auto = () => choose(opts[pickIndex(opts.map((x) => x.p), Math.random())]);
  const reset = () => {
    setPath([]);
    setNode("start");
    setChecked(false);
  };
  const run100 = () => {
    let fake = 0;
    let honest = 0;
    const examples = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const a = sampleAnswer();
      if (a[0] === HONEST) honest++;
      else {
        fake++;
        if (examples.size < 4) examples.add(a.join(" "));
      }
    }
    setSim({ fake, honest, examples: [...examples] });
    setDone((d) => ({ ...d, sim: true }));
  };

  return (
    <div>
      <p className="p9-q">
        <span className="muted">質問</span> {QUESTION84}
      </p>
      <div className="p9-sent" aria-live="polite" style={{ marginTop: 8 }}>
        <span className="muted" style={{ fontSize: 14 }}>
          AI:
        </span>
        {path.length === 0 && <span className="p9-blank">?</span>}
        {path.map((w, i) => (
          <span key={i} className={`chip ${checked && !isHonest ? "p9-false" : "hl-yellow"}`}>
            {w}
          </span>
        ))}
        {!finished && path.length > 0 && <span className="p9-blank">?</span>}
      </div>

      {!finished && (
        <>
          <div className="p9-opts" role="group" aria-label="次のかけらの候補">
            {opts.map((o) => (
              <button key={o.w} className="p9-opt" onClick={() => choose(o)}>
                <span>{o.w}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${o.p * 100}%`, background: `var(--hl-${o.c ?? "yellow"})` }} />
                </span>
                <span className="val">{Math.round(o.p * 100)}%</span>
              </button>
            ))}
          </div>
          <div className="lab-actions">
            <button className="btn ghost" onClick={auto}>
              確率どおりに選ぶ
            </button>
          </div>
        </>
      )}

      {finished && (
        <div className="lab-actions">
          {!checked && (
            <button className="btn" onClick={() => setChecked(true)}>
              事実を確かめる
            </button>
          )}
          <button className="btn ghost" onClick={reset}>
            もう一度答える
          </button>
        </div>
      )}
      {finished && checked && (
        <p className="lab-tip">
          {isHonest
            ? "正直な答えです！この本は説明のために作った題名なので、実在しません。でも、この道に進む確率は最初のかけらで4%だけでした。"
            : "この本は作った題名なので、実在しません。かけら1つ1つはもっともらしいのに、つなげた答えはウソの事実です。今度は「そんな本は」で始めてみましょう。"}
        </p>
      )}

      <h4 className="p9-h">100回答えさせる</h4>
      <p className="muted" style={{ margin: 0, fontSize: 15 }}>
        同じ質問を100回して、毎回確率どおりに選んで答えさせます。
      </p>
      <div className="lab-actions">
        <button className="btn" onClick={run100}>
          100回答えさせる
        </button>
      </div>
      {sim && (
        <div className="lab-out" aria-live="polite">
          <div className="bars">
            <div className="bar-row">
              <span className="label">作り話</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${sim.fake}%`, background: "var(--hl-pink)" }} />
              </span>
              <span className="val">{sim.fake}回</span>
            </div>
            <div className="bar-row">
              <span className="label">知らないと答えた</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${sim.honest}%`, background: "var(--hl-mint)" }} />
              </span>
              <span className="val">{sim.honest}回</span>
            </div>
          </div>
          <ul className="p9-examples">
            {sim.examples.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <p className="lab-tip" style={{ marginTop: 4 }}>
            作り話は、年もジャンルもそのたびにちがいます。同じ質問への答えが毎回変わるなら、作り話かもしれないというサインです。それでも、いちばん確かなのは自分で調べることです。
          </p>
        </div>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.fake}>{done.fake ? "○" : "□"} もっともらしいかけらだけを選んで、ウソの紹介を完成させる</li>
        <li data-done={done.honest}>{done.honest ? "○" : "□"} 「そんな本は」で始まる正直な答えをつくる</li>
        <li data-done={done.sim}>{done.sim ? "○" : "□"} 100回答えさせて、何回作り話をするか数える</li>
      </ul>
      <p className="p9-note">本の題名と確率は、説明のために作った例です。</p>
    </div>
  );
}
