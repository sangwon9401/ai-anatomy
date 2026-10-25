import { useState, type ReactNode } from "react";
import { ATT_PCT, D_ATT, D_FFN, EMB, FINAL, IDS, LOGITS, OUT, OUT_PCT, POS, REST_N, STATIONS, TOKENS, X0, X1, X2 } from "../../../../data/ch61";
import { OTHERS } from "../../../../data/ch60";
import "../../../../playgrounds/part6/style.css";
import { fmt, josa } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

const LAST = STATIONS.length - 1;

/** 61장: walk '나는 오늘 학교에' through every part, one station at a time. */
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
    <div className="p6-seg" role="group" aria-label="単語を選ぶ" style={{ marginBottom: 8 }}>
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
      <p className="p6-label">= 新しいベクトル</p>
      <Vec v={b} label="新しいベクトル" />
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
        <p className="p6-label">#{IDS[tok]}の行から取り出した数（本物は12,288個）</p>
        <Vec v={EMB[tok]} label="埋め込み" />
      </>
    );
  else if (st.key === "pos") body = sum(EMB[tok], POS[tok], X0[tok], "埋め込み", `位置（${tok + 1}番目）`);
  else if (st.key === "att")
    body = (
      <>
        {tokenPicker}
        <p className="p6-label">
          「{TOKENS[tok]}」{josa(TOKENS[tok])}見る割合
        </p>
        <div className="bars">
          {TOKENS.map((w, j) => (
            <div className="bar-row" key={w}>
              <span className="label">{w}</span>
              <span className="track">
                {j <= tok && <span className="fill" style={{ display: "block", width: `${ATT_PCT[tok][j]}%`, background: "var(--hl-yellow)" }} />}
              </span>
              <span className="val">{j <= tok ? `${ATT_PCT[tok][j]}%` : "目かくし"}</span>
            </div>
          ))}
        </div>
      </>
    );
  else if (st.key === "add") body = sum(X0[tok], D_ATT[tok], X1[tok], "元のベクトル（高速道路）", "アテンションが混ぜてきたもの");
  else if (st.key === "ffn") body = sum(X1[tok], D_FFN[tok], X2[tok], "元のベクトル（高速道路）", "フィードフォワードが考えたこと");
  else if (st.key === "x96")
    body = (
      <>
        {tokenPicker}
        <p className="p6-label">96層を全部通った「{TOKENS[tok]}」</p>
        <Vec v={FINAL[tok]} label="96層のあと" />
        <p className="p6-note">次の言葉は、最後の単語「学校に」のベクトルで決めます。</p>
      </>
    );
  else if (st.key === "out")
    body = (
      <ul className="p6-notes">
        {LOGITS.map((l) => (
          <li key={l.w} data-on="true">
            <span className="n">{l.w}</span>
            <span className="num">{fmt(l.s)}点</span>
          </li>
        ))}
        <li data-on="true">
          <span className="n">その他</span>
          <span>{REST_N.toLocaleString()}個、ほとんど約−9.1点</span>
        </li>
      </ul>
    );
  else if (st.key === "soft")
    body = (
      <div className="bars">
        {[...LOGITS.map((l, i) => ({ w: l.w, c: `var(--hl-${l.c})`, pct: OUT_PCT[i] })), { w: "その他", c: "var(--ink-3)", pct: OUT_PCT[4] }].map((r) => (
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
          私は 今日 学校に <span className="bad">{drawn ?? "___"}</span>
        </p>
        <div className="lab-actions">
          <button className="btn" onClick={draw}>
            1つ選ぶ
          </button>
        </div>
        <p className="p6-note">選んだ回数 {draws}回。つなげた文は、またいちばん上（トークナイザー）に入ります。</p>
      </>
    );

  return (
    <div>
      <ol className="p6-stations" aria-label="部品の順番">
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
          ◀ 前へ
        </button>
        {at < LAST ? (
          <button className="btn" onClick={() => go(at + 1)}>
            次の部品 ▶
          </button>
        ) : (
          <button
            className="btn ghost"
            onClick={() => {
              go(0);
              setDrawn(null);
            }}
          >
            最初からもう一度
          </button>
        )}
      </div>
      <p className="p6-note">数はすべて説明用の例です（本物のベクトルは数12,288個）。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen === LAST}>{seen === LAST ? "✓" : "○"} 最後の部品まで行ってみる</li>
        <li data-done={lookedNaneun}>{lookedNaneun ? "✓" : "○"} アテンションで「私は」を押してみる</li>
        <li data-done={draws >= 5}>{draws >= 5 ? "✓" : "○"} 5回選んでみる</li>
      </ul>
      <p className="lab-tip">
        {st.key === "att" && tok === 0
          ? "「私は」は先頭なので、自分自身しか見られません。後ろの単語は目かくしで隠れています（第51章）。"
          : st.key === "loop" && draws > 0
            ? "ほとんどは「行く」が出ますが、ときどきほかの言葉も出ます。確率どおりに選ぶからです。"
            : "ボタンを押して、部品を1つずつ通ってみましょう。上の番号を押すと、通ってきた部品に戻れます。"}
      </p>
    </div>
  );
}
