import { useState, type ReactNode } from "react";
import { ATT_PCT, D_ATT, D_FFN, EMB, FINAL, IDS, LOGITS, OUT, OUT_PCT, POS, REST_N, STATIONS, TOKENS, X0, X1, X2 } from "../../../../data/ch61";
import { OTHERS } from "../../../../data/ch60";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

const LAST = STATIONS.length - 1;

/** 第 61 章: walk 我 今天 去 through every part, one station at a time. */
export function TripLab() {
  const [at, setAt] = useState(0);
  const [seen, setSeen] = useState(0);
  const [tok, setTok] = useState(2);
  const [drawn, setDrawn] = useState<string | null>(null);
  const [draws, setDraws] = useState(0);
  const [lookedNaneun, setLookedNaneun] = useState(false);
  const st = STATIONS[at];

  const go = (i: number) => {
    const n = Math.max(0, Math.min(LAST, i));
    setAt(n);
    setSeen((s) => Math.max(s, n));
    if (STATIONS[n].key === "att" && tok === 0) setLookedNaneun(true);
  };
  const pickTok = (i: number) => {
    setTok(i);
    if (st.key === "att" && i === 0) setLookedNaneun(true);
  };
  const draw = () => {
    let r = Math.random();
    let pick = OTHERS[Math.floor(Math.random() * OTHERS.length)];
    for (let i = 0; i < OUT.p.length; i++) {
      if (r < OUT.p[i]) {
        pick = LOGITS[i].w;
        break;
      }
      r -= OUT.p[i];
    }
    setDrawn(pick);
    setDraws((d) => d + 1);
  };

  const tokenPicker = (
    <div className="p6-seg" role="group" aria-label="选一个词" style={{ marginBottom: 8 }}>
      {TOKENS.map((w, i) => (
        <button key={w} aria-pressed={i === tok} onClick={() => pickTok(i)}>
          {w}
        </button>
      ))}
    </div>
  );
  const sum = (a: number[], d: number[], b: number[], la: string, ld: string) => (
    <>
      {tokenPicker}
      <p className="p6-label">{la}</p>
      <Vec v={a} label={la} />
      <p className="p6-label">+ {ld}</p>
      <Vec v={d} label={ld} />
      <p className="p6-label">= 新向量</p>
      <Vec v={b} label="新向量" />
    </>
  );

  let body: ReactNode = null;
  if (st.key === "tok")
    body = (
      <div className="p6-sent">
        {TOKENS.map((w, i) => (
          <span key={w} className="p6-tok">
            <b>{w}</b>
            <small>#{IDS[i]}</small>
          </span>
        ))}
      </div>
    );
  else if (st.key === "emb")
    body = (
      <>
        {tokenPicker}
        <p className="p6-label">从第 #{IDS[tok]} 行取出的数字（真正的有 12,288 个）</p>
        <Vec v={EMB[tok]} label="嵌入" />
      </>
    );
  else if (st.key === "pos") body = sum(EMB[tok], POS[tok], X0[tok], "嵌入", `位置（第 ${tok + 1} 个）`);
  else if (st.key === "att")
    body = (
      <>
        {tokenPicker}
        <p className="p6-label">
          “{TOKENS[tok]}”看向各个词的比例
        </p>
        <div className="bars">
          {TOKENS.map((w, j) => (
            <div className="bar-row" key={w}>
              <span className="label">{w}</span>
              <span className="track">
                {j <= tok && <span className="fill" style={{ display: "block", width: `${ATT_PCT[tok][j]}%`, background: "var(--hl-yellow)" }} />}
              </span>
              <span className="val">{j <= tok ? `${ATT_PCT[tok][j]}%` : "帘子"}</span>
            </div>
          ))}
        </div>
      </>
    );
  else if (st.key === "add") body = sum(X0[tok], D_ATT[tok], X1[tok], "原来的向量（高速公路）", "注意力混合来的结果");
  else if (st.key === "ffn") body = sum(X1[tok], D_FFN[tok], X2[tok], "原来的向量（高速公路）", "前馈网络思考的结果");
  else if (st.key === "x96")
    body = (
      <>
        {tokenPicker}
        <p className="p6-label">走完 96 层的“{TOKENS[tok]}”</p>
        <Vec v={FINAL[tok]} label="96 层之后" />
        <p className="p6-note">下一个词由最后一个词“去”的向量来决定。</p>
      </>
    );
  else if (st.key === "out")
    body = (
      <ul className="p6-notes">
        {LOGITS.map((l) => (
          <li key={l.w} data-on="true">
            <span className="n">{l.w}</span>
            <span className="num">{fmt(l.s)} 分</span>
          </li>
        ))}
        <li data-on="true">
          <span className="n">其余</span>
          <span>{REST_N.toLocaleString()} 个，大多约 −9.1 分</span>
        </li>
      </ul>
    );
  else if (st.key === "soft")
    body = (
      <div className="bars">
        {[...LOGITS.map((l, i) => ({ w: l.w, c: `var(--hl-${l.c})`, pct: OUT_PCT[i] })), { w: "其余", c: "var(--ink-3)", pct: OUT_PCT[4] }].map((r) => (
          <div className="bar-row" key={r.w}>
            <span className="label">{r.w}</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${r.pct}%`, background: r.c }} />
            </span>
            <span className="val">{r.pct}%</span>
          </div>
        ))}
      </div>
    );
  else
    body = (
      <>
        <p className="p6-msg">
          我今天去<span className="bad">{drawn ?? "___"}</span>
        </p>
        <div className="lab-actions">
          <button className="btn" onClick={draw}>
            抽一个
          </button>
        </div>
        <p className="p6-note">已抽 {draws} 次。接好的句子会再送回最上面（分词器）。</p>
      </>
    );

  return (
    <div>
      <ol className="p6-stations" aria-label="部件顺序">
        {STATIONS.map((s, i) => (
          <li key={s.key}>
            <button aria-current={i === at ? "step" : undefined} data-color={s.color} disabled={i > seen} onClick={() => go(i)}>
              {i + 1}
            </button>
          </li>
        ))}
      </ol>
      <div className="p6-panel">
        <h4>
          {at + 1}. {st.name} <span className="hand pen">({st.where})</span>
        </h4>
        {body}
      </div>
      <div className="lab-actions">
        <button className="btn ghost" disabled={at === 0} onClick={() => go(at - 1)}>
          ◀ 上一步
        </button>
        {at < LAST ? (
          <button className="btn" onClick={() => go(at + 1)}>
            下一个部件 ▶
          </button>
        ) : (
          <button
            className="btn ghost"
            onClick={() => {
              go(0);
              setDrawn(null);
            }}
          >
            从头再来
          </button>
        )}
      </div>
      <p className="p6-note">数字都是示意数据（真正的向量有 12,288 个数字）。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen === LAST}>{seen === LAST ? "✓" : "○"} 一直走到最后一个部件</li>
        <li data-done={lookedNaneun}>{lookedNaneun ? "✓" : "○"} 在注意力这一步点“我”</li>
        <li data-done={draws >= 5}>{draws >= 5 ? "✓" : "○"} 抽五次试试</li>
      </ul>
      <p className="lab-tip">
        {st.key === "att" && tok === 0
          ? "“我”在最前面，只能看到自己。后面的词都被帘子挡住了（第 51 章）。"
          : st.key === "loop" && draws > 0
            ? "大多抽到“学校”，偶尔也会出现别的词。因为是按概率来抽的。"
            : "按按钮，一个部件一个部件地往下走。点上面的编号，可以回到走过的部件。"}
      </p>
    </div>
  );
}
