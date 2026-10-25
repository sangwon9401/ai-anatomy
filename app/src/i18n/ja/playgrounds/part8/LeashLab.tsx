import { useEffect, useRef, useState } from "react";
import { percents } from "../../../../data/ch45";
import { KINDS, LEASH, QUESTION, drift, mean, tuned } from "../../../../data/ch76";
import "../../../../playgrounds/part8/style.css";

const TRAIN_MS = 1300;
const BEST = 3; // "알맞게"
const sgn = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : "0");
const fmt = (v: number) => (Math.abs(v) < 0.005 ? "0.00" : v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));

export function LeashLab() {
  const [leash, setLeash] = useState(0);
  const [t, setT] = useState(0);
  const [tried, setTried] = useState<Record<number, number>>({});
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const beta = LEASH[leash].beta;
  const p = tuned(beta, t);
  const pct = percents(p);
  const p0 = KINDS.map((k) => k.p0);
  const judge = mean(p, KINDS.map((k) => k.judge));
  const human = mean(p, KINDS.map((k) => k.human));
  const humanStart = mean(p0, KINDS.map((k) => k.human));
  const done = t >= 1;
  const running = t > 0 && t < 1;
  const bestTried = Object.entries(tried).sort((a, b) => b[1] - a[1])[0];

  const train = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const x = Math.min(1, (now - start) / TRAIN_MS);
      setT(x);
      if (x < 1) raf.current = requestAnimationFrame(tick);
      else setTried((r) => ({ ...r, [leash]: mean(tuned(beta), KINDS.map((k) => k.human)) }));
    };
    raf.current = requestAnimationFrame(tick);
  };

  const tip = !done
    ? running
      ? "採点係の点数が高い答えのほうへ移っているところ…"
      : "リードの長さを選んで「練習させる」を押してみましょう。点線は元のモデル（第73章）です。"
    : leash >= 5
      ? "採点係の点数はいちばん高いのに、人の満足度はかえって下がりました。リードが長すぎて「ほめ言葉ばかり」の答えに集まってしまいました。"
      : leash <= 1
        ? "ほとんど元のモデルのままです。リードが短すぎて、よくなる余地がありませんでした。"
        : leash === BEST
          ? "バランスが見つかりました！ 親切でくわしい答えが大きく増え、おかしな答えは少ししか増えていません。人の満足度がいちばん高いです。"
          : "悪くありません。リードを1目盛り長く、または短くして、人の満足度を比べてみましょう。";

  return (
    <div>
      <p className="p8-label" style={{ marginTop: 0 }}>
        質問：{QUESTION}
      </p>
      <label className="p8-range">
        <span>リードの長さ</span>
        <b>{LEASH[leash].name}</b>
        <input
          type="range"
          min={0}
          max={LEASH.length - 1}
          step={1}
          value={leash}
          disabled={running}
          aria-label="リードの長さ"
          onChange={(e) => {
            setLeash(Number(e.target.value));
            setT(0);
          }}
        />
        <span className="p8-ends">
          <span>短い：元のモデルの近く</span>
          <span>長い：点数だけを追う</span>
        </span>
      </label>
      <div className="lab-actions">
        <button className="btn" onClick={train} disabled={running || done}>
          {done ? "練習おわり" : "練習させる"}
        </button>
        {done && (
          <button className="btn ghost" onClick={() => setT(0)}>
            練習前に戻す
          </button>
        )}
      </div>

      <div className="p8-dist">
        {KINDS.map((k, i) => (
          <div className="p8-drow" key={k.short}>
            <span className="p8-txt">
              <b>{k.short}</b> <small>{k.excerpt}</small>
              <br />
              <small>
                採点係 {sgn(k.judge)} · 人 {sgn(k.human)}
              </small>
            </span>
            <span className="p8-twin" aria-hidden="true">
              <span className="p8-now" style={{ width: `${p[i] * 100}%`, background: i === 3 ? "var(--hl-pink)" : "var(--hl-yellow)" }} />
              <span className="p8-ghost" style={{ width: `${k.p0 * 100}%` }} />
            </span>
            <span className="p8-val">{pct[i]}%</span>
          </div>
        ))}
      </div>

      <div className="p8-stats">
        <div className="p8-stat">
          採点係の点数の平均<b>{fmt(judge)}</b>
        </div>
        <div className="p8-stat">
          人の満足度の平均<b>{fmt(human)}</b>
        </div>
        <div className="p8-stat" style={{ gridColumn: "1 / -1" }}>
          元のモデルから離れた度合い（KL）
          <span className="p8-track" style={{ display: "block", marginTop: 6 }}>
            <span className="p8-fill" style={{ width: `${Math.min(1, drift(p) / 3) * 100}%`, background: "var(--pen)" }} />
          </span>
        </div>
      </div>

      <p className="lab-tip">{tip}</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={Object.keys(tried).length >= 3}>
          {Object.keys(tried).length >= 3 ? "○" : "□"} リードの長さ3種類以上で練習させてみる ({Object.keys(tried).length}/3)
        </li>
        <li data-done={tried[BEST] !== undefined}>
          {tried[BEST] !== undefined ? "○" : "□"} 人の満足度がいちばん高い長さを見つける（元のモデル：{fmt(humanStart)}）
        </li>
      </ul>
      {bestTried && (
        <p className="lab-sum" style={{ margin: "6px 0 0" }}>
          これまででいちばんよかった長さ：{LEASH[Number(bestTried[0])].name}（人の満足度 {fmt(bestTried[1])}）
        </p>
      )}
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        点数と確率は説明用の例です。練習が終わったときにモデルが落ち着く場所を計算して見せています。点線は元のモデルの確率です。
      </p>
    </div>
  );
}
