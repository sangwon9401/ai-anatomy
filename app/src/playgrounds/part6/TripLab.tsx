import { useState, type ReactNode } from "react";
import { ATT_PCT, D_ATT, D_FFN, EMB, FINAL, IDS, LOGITS, OUT, OUT_PCT, POS, REST_N, STATIONS, TOKENS, X0, X1, X2 } from "../../data/ch61";
import { OTHERS } from "../../data/ch60";
import "./style.css";
import { fmt, josa } from "./util";
import { Vec } from "./Vec";

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
    <div className="p6-seg" role="group" aria-label="단어 고르기" style={{ marginBottom: 8 }}>
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
      <p className="p6-label">= 새 벡터</p>
      <Vec v={b} label="새 벡터" />
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
        <p className="p6-label">#{IDS[tok]} 줄에서 꺼낸 숫자 (진짜는 12,288개)</p>
        <Vec v={EMB[tok]} label="임베딩" />
      </>
    );
  else if (st.key === "pos") body = sum(EMB[tok], POS[tok], X0[tok], "임베딩", `위치 (${tok + 1}번째)`);
  else if (st.key === "att")
    body = (
      <>
        {tokenPicker}
        <p className="p6-label">
          '{TOKENS[tok]}'{josa(TOKENS[tok])} 쳐다보는 비율
        </p>
        <div className="bars">
          {TOKENS.map((w, j) => (
            <div className="bar-row" key={w}>
              <span className="label">{w}</span>
              <span className="track">
                {j <= tok && <span className="fill" style={{ display: "block", width: `${ATT_PCT[tok][j]}%`, background: "var(--hl-yellow)" }} />}
              </span>
              <span className="val">{j <= tok ? `${ATT_PCT[tok][j]}%` : "가림막"}</span>
            </div>
          ))}
        </div>
      </>
    );
  else if (st.key === "add") body = sum(X0[tok], D_ATT[tok], X1[tok], "원래 벡터 (고속도로)", "어텐션이 섞어 온 것");
  else if (st.key === "ffn") body = sum(X1[tok], D_FFN[tok], X2[tok], "원래 벡터 (고속도로)", "피드포워드가 생각한 것");
  else if (st.key === "x96")
    body = (
      <>
        {tokenPicker}
        <p className="p6-label">96층을 다 지난 '{TOKENS[tok]}'</p>
        <Vec v={FINAL[tok]} label="96층 뒤" />
        <p className="p6-note">다음 말은 맨 끝 단어 '학교에'의 벡터로 정해요.</p>
      </>
    );
  else if (st.key === "out")
    body = (
      <ul className="p6-notes">
        {LOGITS.map((l) => (
          <li key={l.w} data-on="true">
            <span className="n">{l.w}</span>
            <span className="num">{fmt(l.s)}점</span>
          </li>
        ))}
        <li data-on="true">
          <span className="n">나머지</span>
          <span>{REST_N.toLocaleString()}개, 대부분 약 −9.1점</span>
        </li>
      </ul>
    );
  else if (st.key === "soft")
    body = (
      <div className="bars">
        {[...LOGITS.map((l, i) => ({ w: l.w, c: `var(--hl-${l.c})`, pct: OUT_PCT[i] })), { w: "나머지", c: "var(--ink-3)", pct: OUT_PCT[4] }].map((r) => (
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
          나는 오늘 학교에 <span className="bad">{drawn ?? "___"}</span>
        </p>
        <div className="lab-actions">
          <button className="btn" onClick={draw}>
            하나 뽑기
          </button>
        </div>
        <p className="p6-note">뽑은 횟수 {draws}번. 붙인 문장은 다시 맨 위(토크나이저)로 들어가요.</p>
      </>
    );

  return (
    <div>
      <ol className="p6-stations" aria-label="부품 순서">
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
          ◀ 이전
        </button>
        {at < LAST ? (
          <button className="btn" onClick={() => go(at + 1)}>
            다음 부품 ▶
          </button>
        ) : (
          <button
            className="btn ghost"
            onClick={() => {
              go(0);
              setDrawn(null);
            }}
          >
            처음부터 다시
          </button>
        )}
      </div>
      <p className="p6-note">숫자는 모두 설명용 예시예요 (진짜 벡터는 숫자 12,288개).</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen === LAST}>{seen === LAST ? "✓" : "○"} 마지막 부품까지 가 보기</li>
        <li data-done={lookedNaneun}>{lookedNaneun ? "✓" : "○"} 어텐션에서 '나는'을 눌러 보기</li>
        <li data-done={draws >= 5}>{draws >= 5 ? "✓" : "○"} 다섯 번 뽑아 보기</li>
      </ul>
      <p className="lab-tip">
        {st.key === "att" && tok === 0
          ? "'나는'은 맨 앞이라 자기 자신만 볼 수 있어요. 뒤 단어는 가림막에 가려 있죠(51장)."
          : st.key === "loop" && draws > 0
            ? "대부분 '간다'가 나오지만 가끔 다른 말도 나와요. 확률대로 뽑으니까요."
            : "버튼을 눌러 한 부품씩 지나가 보세요. 위 번호를 누르면 지나온 부품으로 돌아가요."}
      </p>
    </div>
  );
}
