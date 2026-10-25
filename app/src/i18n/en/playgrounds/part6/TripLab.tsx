import { useState, type ReactNode } from "react";
import { ATT_PCT, D_ATT, D_FFN, EMB, FINAL, IDS, LOGITS, OUT, OUT_PCT, POS, REST_N, STATIONS, TOKENS, X0, X1, X2 } from "../../../../data/ch61";
import { OTHERS } from "../../../../data/ch60";
import "../../../../playgrounds/part6/style.css";
import { fmt, josa } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

const LAST = STATIONS.length - 1;

/** ch. 61: walk 'I walk to' through every part, one station at a time. */
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
    <div className="p6-seg" role="group" aria-label="Choose a word" style={{ marginBottom: 8 }}>
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
      <p className="p6-label">= new vector</p>
      <Vec v={b} label="New vector" />
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
        <p className="p6-label">Numbers from row #{IDS[tok]} (really 12,288 of them)</p>
        <Vec v={EMB[tok]} label="Embedding" />
      </>
    );
  else if (st.key === "pos") body = sum(EMB[tok], POS[tok], X0[tok], "Embedding", `Position (#${tok + 1})`);
  else if (st.key === "att")
    body = (
      <>
        {tokenPicker}
        <p className="p6-label">
          How much '{TOKENS[tok]}'{josa(TOKENS[tok])} looks at each word
        </p>
        <div className="bars">
          {TOKENS.map((w, j) => (
            <div className="bar-row" key={w}>
              <span className="label">{w}</span>
              <span className="track">
                {j <= tok && <span className="fill" style={{ display: "block", width: `${ATT_PCT[tok][j]}%`, background: "var(--hl-yellow)" }} />}
              </span>
              <span className="val">{j <= tok ? `${ATT_PCT[tok][j]}%` : "masked"}</span>
            </div>
          ))}
        </div>
      </>
    );
  else if (st.key === "add") body = sum(X0[tok], D_ATT[tok], X1[tok], "Original vector (highway)", "What attention mixed in");
  else if (st.key === "ffn") body = sum(X1[tok], D_FFN[tok], X2[tok], "Original vector (highway)", "What feed-forward thought");
  else if (st.key === "x96")
    body = (
      <>
        {tokenPicker}
        <p className="p6-label">'{TOKENS[tok]}' after all 96 layers</p>
        <Vec v={FINAL[tok]} label="After 96 layers" />
        <p className="p6-note">The next word is decided by the vector of the last word, 'to'.</p>
      </>
    );
  else if (st.key === "out")
    body = (
      <ul className="p6-notes">
        {LOGITS.map((l) => (
          <li key={l.w} data-on="true">
            <span className="n">{l.w}</span>
            <span className="num">{fmt(l.s)}</span>
          </li>
        ))}
        <li data-on="true">
          <span className="n">the rest</span>
          <span>{REST_N.toLocaleString()} tokens, mostly about −9.1</span>
        </li>
      </ul>
    );
  else if (st.key === "soft")
    body = (
      <div className="bars">
        {[...LOGITS.map((l, i) => ({ w: l.w, c: `var(--hl-${l.c})`, pct: OUT_PCT[i] })), { w: "the rest", c: "var(--ink-3)", pct: OUT_PCT[4] }].map((r) => (
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
          I walk to <span className="bad">{drawn ?? "___"}</span>
        </p>
        <div className="lab-actions">
          <button className="btn" onClick={draw}>
            Pick one
          </button>
        </div>
        <p className="p6-note">Picks so far: {draws}. The longer text goes back in at the top (the tokenizer).</p>
      </>
    );

  return (
    <div>
      <ol className="p6-stations" aria-label="Order of parts">
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
          ◀ Back
        </button>
        {at < LAST ? (
          <button className="btn" onClick={() => go(at + 1)}>
            Next part ▶
          </button>
        ) : (
          <button
            className="btn ghost"
            onClick={() => {
              go(0);
              setDrawn(null);
            }}
          >
            Start over
          </button>
        )}
      </div>
      <p className="p6-note">The vector numbers are illustrative examples (real vectors have 12,288 numbers). The token numbers are GPT-3's real ones.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen === LAST}>{seen === LAST ? "✓" : "○"} Go all the way to the last part</li>
        <li data-done={lookedNaneun}>{lookedNaneun ? "✓" : "○"} At attention, tap 'I'</li>
        <li data-done={draws >= 5}>{draws >= 5 ? "✓" : "○"} Pick five times</li>
      </ul>
      <p className="lab-tip">
        {st.key === "att" && tok === 0
          ? "'I' comes first, so it can only see itself. The later words are behind the mask (ch. 51)."
          : st.key === "loop" && draws > 0
            ? "Mostly 'school' comes out, but sometimes another word does. It picks by probability."
            : "Tap the button to go through one part at a time. Tap a number above to go back to a part you've passed."}
      </p>
    </div>
  );
}
