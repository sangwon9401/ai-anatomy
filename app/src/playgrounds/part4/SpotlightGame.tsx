import { useState } from "react";
import { PAIRS, weightsOf } from "../../data/ch43";
import "./style.css";

/** a pick counts if the model looked there at least 60% as much as at its brightest word */
export const accepted = (w: number[], pick: number) => w[pick] >= 0.6 * Math.max(...w);
const heat = (w: number) => `color-mix(in srgb, var(--hl-yellow) ${Math.round(Math.min(1, w * 1.15) * 100)}%, var(--paper-2))`;

export function SpotlightGame() {
  const [pi, setPi] = useState(0);
  const pair = PAIRS[pi];
  const W = weightsOf(pair);
  const [t, setT] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(pair.tgt.map(() => null));
  const pick = picks[t];
  const revealed = pick !== null;
  const last = t === pair.tgt.length - 1;
  const done = last && revealed;
  const score = picks.filter((p, i) => p !== null && accepted(W[i].w, p)).length;

  const choosePair = (i: number) => {
    setPi(i);
    setT(0);
    setPicks(PAIRS[i].tgt.map(() => null));
  };

  let feedback = "";
  if (revealed) {
    const w = W[t].w;
    const best = w.indexOf(Math.max(...w));
    const second = w.map((v, i) => ({ v, i })).filter((x) => x.i !== best).sort((a, b) => b.v - a.v)[0];
    if (accepted(w, pick!) && pick !== best) feedback = `좋아요! 모델은 '${pair.src[best]}' ${W[t].pct[best]}%, '${pair.src[pick!]}' ${W[t].pct[pick!]}%로 둘 다 많이 봤어요.`;
    else if (pick === best)
      feedback =
        second.v >= 0.6 * w[best]
          ? `맞아요! 모델은 '${pair.src[best]}' ${W[t].pct[best]}%, '${pair.src[second.i]}' ${W[t].pct[second.i]}%로 둘을 함께 봤어요.`
          : `맞아요! 모델도 '${pair.src[best]}'를 가장 밝게 비췄어요 (${W[t].pct[best]}%).`;
    else feedback = `모델은 '${pair.src[best]}'를 가장 밝게 비췄어요 (${W[t].pct[best]}%). '${pair.tgt[t]}'의 뜻이 거기 있거든요.`;
  }

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="번역할 문장 고르기">
        {PAIRS.map((p, i) => (
          <button key={p.label} aria-pressed={i === pi} onClick={() => choosePair(i)} style={i === pi ? { borderStyle: "solid", color: "var(--ink)", borderColor: "var(--ink)" } : undefined}>
            {p.label}
          </button>
        ))}
      </div>

      <h4 className="p4-h4" style={{ marginTop: 14 }}>
        원문 (인코더가 남긴 쪽지들)
      </h4>
      <div className="p4-src" role="group" aria-label={`'${pair.tgt[t]}'를 쓸 때 비출 한국어 단어 고르기`}>
        {pair.src.map((s, i) => (
          <button
            key={s}
            className="p4-srcbtn"
            disabled={revealed}
            aria-pressed={pick === i}
            onClick={() => setPicks(picks.map((p, k) => (k === t ? i : p)))}
            style={revealed ? { background: heat(W[t].w[i]) } : undefined}
          >
            <span>{s}</span>
            {revealed && <span className="pct">{W[t].pct[i]}%</span>}
          </button>
        ))}
      </div>

      <h4 className="p4-h4" style={{ marginTop: 14 }}>
        디코더가 쓰는 영어
      </h4>
      <div className="p4-sentence" aria-live="polite">
        {pair.tgt.map((w, i) => (
          <span key={w} className={`chip ${i < t || (i === t && revealed) ? "hl-orange" : i === t ? "outline" : "p4-start"}`} style={i === t ? { outline: "2.5px solid var(--pen)", outlineOffset: 2 } : undefined}>
            {i <= t ? w : "?"}
          </span>
        ))}
      </div>

      <p className="lab-tip">{revealed ? feedback : `'${pair.tgt[t]}'를 쓰려면 원문의 어느 단어를 봐야 할까요? 위에서 눌러 보세요.`}</p>

      <div className="lab-actions">
        {revealed && !last && (
          <button className="btn" onClick={() => setT(t + 1)}>
            다음 단어
          </button>
        )}
        {done && (
          <button className="btn" onClick={() => choosePair((pi + 1) % PAIRS.length)}>
            다른 문장
          </button>
        )}
        <button className="btn ghost" onClick={() => choosePair(pi)}>
          처음부터
        </button>
      </div>

      {picks.some((p) => p !== null) && (
        <div className="matrix-wrap" style={{ marginTop: 14 }}>
          <table className="matrix" aria-label="정렬 표: 영어 단어마다 비춘 한국어 단어">
            <thead>
              <tr>
                <th className="p4-th" />
                {pair.src.map((s) => (
                  <th key={s} scope="col" className="p4-th">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pair.tgt.map((w, i) =>
                picks[i] === null ? null : (
                  <tr key={w}>
                    <th scope="row" className="p4-th">
                      {w}
                    </th>
                    {W[i].w.map((v, s) => (
                      <td key={s} style={{ background: heat(v), color: "var(--chip-ink)", outline: picks[i] === s ? "2px solid var(--pen)" : undefined, outlineOffset: -2 }}>
                        {W[i].pct[s]}%
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
      {done && (
        <p className="p4-verdict">
          {pair.tgt.length}개 중 {score}개를 모델과 같은 곳에 비췄어요. 표에서 밝은 칸을 이으면 순서가 엇갈려요. 이게 정렬이에요.
        </p>
      )}
      <p className="p4-note">* 비율은 설명용 예시예요. 관련도 점수를 소프트맥스(14장)로 바꿔서 합이 100%가 되게 했어요. 빨간 테두리는 내가 고른 칸이에요.</p>
    </div>
  );
}
