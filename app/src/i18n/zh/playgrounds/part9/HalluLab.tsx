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
        if (examples.size < 4) examples.add(a.join(""));
      }
    }
    setSim({ fake, honest, examples: [...examples] });
    setDone((d) => ({ ...d, sim: true }));
  };

  return (
    <div>
      <p className="p9-q">
        <span className="muted">问题</span> {QUESTION84}
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
          <div className="p9-opts" role="group" aria-label="下一个片段的候选">
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
              按概率抽一个
            </button>
          </div>
        </>
      )}

      {finished && (
        <div className="lab-actions">
          {!checked && (
            <button className="btn" onClick={() => setChecked(true)}>
              核对事实
            </button>
          )}
          <button className="btn ghost" onClick={reset}>
            重新回答
          </button>
        </div>
      )}
      {finished && checked && (
        <p className="lab-tip">
          {isHonest
            ? "这是诚实的回答！这本书是为了讲解编出来的，世上根本没有。不过在第一个片段，走上这条路的概率只有 4%。"
            : "这本书是编出来的，世上根本没有。每个片段单看都很像样，连起来却是假事实。这次试试用“我没听说过”开头。"}
        </p>
      )}

      <h4 className="p9-h">让它回答 100 次</h4>
      <p className="muted" style={{ margin: 0, fontSize: 15 }}>
        同一个问题问 100 次，每次都按概率抽词来回答。
      </p>
      <div className="lab-actions">
        <button className="btn" onClick={run100}>
          让它回答 100 次
        </button>
      </div>
      {sim && (
        <div className="lab-out" aria-live="polite">
          <div className="bars">
            <div className="bar-row">
              <span className="label">编造</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${sim.fake}%`, background: "var(--hl-pink)" }} />
              </span>
              <span className="val">{sim.fake} 次</span>
            </div>
            <div className="bar-row">
              <span className="label">说不知道</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${sim.honest}%`, background: "var(--hl-mint)" }} />
              </span>
              <span className="val">{sim.honest} 次</span>
            </div>
          </div>
          <ul className="p9-examples">
            {sim.examples.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <p className="lab-tip" style={{ marginTop: 4 }}>
            编出来的答案，年份和体裁每次都不一样。同一个问题答案总在变，可能就是在瞎编的信号。不过最可靠的办法，还是自己去查。
          </p>
        </div>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.fake}>{done.fake ? "○" : "□"} 只挑像样的片段，拼出一段假介绍</li>
        <li data-done={done.honest}>{done.honest ? "○" : "□"} 拼出以“我没听说过”开头的诚实回答</li>
        <li data-done={done.sim}>{done.sim ? "○" : "□"} 让它回答 100 次，数数编了几次</li>
      </ul>
      <p className="p9-note">书名和概率都是为了讲解编出来的示意数据。</p>
    </div>
  );
}
