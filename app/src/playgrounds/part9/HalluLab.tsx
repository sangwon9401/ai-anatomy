import { useState } from "react";
import { HONEST, QUESTION84, TREE, type Opt } from "../../data/ch84";
import { pickIndex } from "../../data/part9-toy";
import "./style.css";

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
        <span className="muted">질문</span> {QUESTION84}
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
          <div className="p9-opts" role="group" aria-label="다음 조각 후보">
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
              확률대로 뽑기
            </button>
          </div>
        </>
      )}

      {finished && (
        <div className="lab-actions">
          {!checked && (
            <button className="btn" onClick={() => setChecked(true)}>
              사실 확인하기
            </button>
          )}
          <button className="btn ghost" onClick={reset}>
            다시 답하기
          </button>
        </div>
      )}
      {finished && checked && (
        <p className="lab-tip">
          {isHonest
            ? "정직한 답이에요! 이 책은 설명을 위해 지어낸 제목이라 세상에 없거든요. 하지만 이 길로 갈 확률은 첫 조각에서 4%뿐이었어요."
            : "이 책은 지어낸 제목이라 세상에 없어요. 조각 하나하나는 그럴듯했지만, 이어 붙인 답은 가짜 사실이에요. 이번엔 '그런 책은'으로 시작해 보세요."}
        </p>
      )}

      <h4 className="p9-h">100번 대답시키기</h4>
      <p className="muted" style={{ margin: 0, fontSize: 15 }}>
        같은 질문을 100번 하고, 매번 확률대로 뽑아 답하게 해요.
      </p>
      <div className="lab-actions">
        <button className="btn" onClick={run100}>
          100번 대답시키기
        </button>
      </div>
      {sim && (
        <div className="lab-out" aria-live="polite">
          <div className="bars">
            <div className="bar-row">
              <span className="label">지어낸 답</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${sim.fake}%`, background: "var(--hl-pink)" }} />
              </span>
              <span className="val">{sim.fake}번</span>
            </div>
            <div className="bar-row">
              <span className="label">모른다는 답</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${sim.honest}%`, background: "var(--hl-mint)" }} />
              </span>
              <span className="val">{sim.honest}번</span>
            </div>
          </div>
          <ul className="p9-examples">
            {sim.examples.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <p className="lab-tip" style={{ marginTop: 4 }}>
            지어낸 답은 연도도, 장르도 그때그때 달라요. 같은 질문에 답이 매번 바뀐다면 지어냈을 수 있다는 신호예요. 그래도 확실한 방법은 직접 찾아보는 거예요.
          </p>
        </div>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.fake}>{done.fake ? "○" : "□"} 그럴듯한 조각만 골라 가짜 소개 완성하기</li>
        <li data-done={done.honest}>{done.honest ? "○" : "□"} '그런 책은'으로 시작하는 정직한 답 만들기</li>
        <li data-done={done.sim}>{done.sim ? "○" : "□"} 100번 대답시켜서 몇 번 지어내는지 세기</li>
      </ul>
      <p className="p9-note">책 제목과 확률은 설명을 위해 지어낸 예시예요.</p>
    </div>
  );
}
