import { useState } from "react";
import { CHAT, TURNS, noCache, withCache, type Msg } from "../../../../data/ch83";
import "../../../../playgrounds/part9/style.css";

const START: Msg[] = [CHAT[0], CHAT[1]];
const NAME = "ゆい";
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function WindowLab() {
  const [msgs, setMsgs] = useState<Msg[]>(START);
  const [size, setSize] = useState(5);
  const [tip, setTip] = useState("話題をいくつか押して会話を長くしてから、「私の名前、何だっけ？」を押してみましょう。");
  const [done, setDone] = useState({ out: false, remember: false, ratio: false });
  const [m, setM] = useState(100);
  const [n, setN] = useState(1);

  const firstIn = Math.max(0, msgs.length - size);
  const nameOut = msgs.findIndex((x) => x.text.includes(NAME)) < firstIn;
  const ratio = noCache(m, n) / withCache(m, n);
  const setLen = (mm: number, nn: number) => {
    setM(mm);
    setN(nn);
    if (noCache(mm, nn) / withCache(mm, nn) >= 10) setDone((d) => ({ ...d, ratio: true }));
  };

  const add = (next: Msg[]) => {
    setMsgs(next);
    const fi = Math.max(0, next.length - size);
    if (next.findIndex((x) => x.text.includes(NAME)) < fi) setDone((d) => ({ ...d, out: true }));
  };
  const turn = (i: number) => {
    const t = TURNS[i];
    add([...msgs, { me: true, text: t.me }, { me: false, text: t.ai }]);
    setTip("会話が長くなりました。窓の外へ押し出された吹き出しは、うすく表示されます。");
  };
  const ask = () => {
    const withQ = [...msgs, { me: true, text: "私の名前、何だっけ？" }];
    const fi = Math.max(0, withQ.length - size);
    const sees = withQ.slice(fi).some((x) => x.text.includes(NAME) && x.text !== "私の名前、何だっけ？");
    const reply = sees ? `${NAME}さんですよね！` : Math.random() < 0.5 ? "うーん…よくわかりません。もう一度教えてくれますか？" : "えっと…あやかさん？";
    add([...withQ, { me: false, text: reply }]);
    if (sees) {
      setTip("名前が窓の中にあるので、ちゃんと答えられました。");
      if (withQ.length > 5) setDone((d) => ({ ...d, remember: true }));
    } else setTip(reply.includes("あやか") ? "窓の外の名前が見えないので、もっともらしい名前を作ってしまいました。これが84章で見るハルシネーションです。" : "窓の外の名前が見えないので、わからないと答えました。窓を大きくするか、名前をもう一度伝えれば大丈夫です。");
  };

  return (
    <div>
      <div className="lab-row">
        <span>窓の大きさ</span>
        <input type="range" min={3} max={12} step={1} value={size} aria-label="窓の大きさ（吹き出しの数）" onChange={(e) => {
            const v = Number(e.target.value);
            setSize(v);
            if (msgs.findIndex((x) => x.text.includes(NAME)) < Math.max(0, msgs.length - v)) setDone((d) => ({ ...d, out: true }));
          }} />
        <span className="val">{size}個</span>
      </div>

      <ol className="p9-chat" aria-live="polite">
        {msgs.map((x, i) => (
          <li key={i} data-me={x.me} data-out={i < firstIn} data-edge={i === firstIn && firstIn > 0}>
            <span className="bubble">{x.text}</span>
          </li>
        ))}
      </ol>
      <p className="p9-note">
        窓の中 {msgs.length - firstIn}個・窓の外 {firstIn}個{nameOut ? "・名前が窓の外にあります" : ""}
      </p>

      <div className="ctx-presets p9-tall" role="group" aria-label="会話を続ける">
        {TURNS.map((t, i) => (
          <button key={t.label} onClick={() => turn(i)}>
            + {t.label}
          </button>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={ask}>
          私の名前、何だっけ？
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setMsgs(START);
            setTip("話題をいくつか押して会話を長くしてから、「私の名前、何だっけ？」を押してみましょう。");
          }}
        >
          最初から
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">本物の窓の大きさはトークン数で決まります（GPT-3：2,048トークン）。ここではわかりやすく吹き出しの数で数えています。</p>

      <h4 className="p9-h">KVキャッシュが節約する計算</h4>
      <div className="lab-rows">
        <div className="lab-row">
          <span>質問の長さ</span>
          <input type="range" min={10} max={2000} step={10} value={m} aria-label="質問の長さ（トークン）" onChange={(e) => setLen(Number(e.target.value), n)} />
          <span className="val">{m}</span>
        </div>
        <div className="lab-row">
          <span>答えの長さ</span>
          <input type="range" min={1} max={500} step={1} value={n} aria-label="答えの長さ（トークン）" onChange={(e) => setLen(m, Number(e.target.value))} />
          <span className="val">{n}</span>
        </div>
      </div>
      <div className="p9-kv">
        <div>
          <span className="muted">キャッシュなし</span>
          <b className="num">{fmt(noCache(m, n))}回</b>
        </div>
        <div>
          <span className="muted">KVキャッシュ</span>
          <b className="num">{fmt(withCache(m, n))}回</b>
        </div>
      </div>
      <p className="lab-sum">
        答えのかけらを1つ作るたびに、キャッシュがないと前のかけら全部のKey・Valueを計算し直し、キャッシュがあれば新しいかけらの分だけ計算します。いまは約{ratio.toFixed(1)}倍の差です（層1つ、ヘッド1つの場合）。
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.out}>{done.out ? "○" : "□"} 会話を長くして、名前を窓の外へ押し出す</li>
        <li data-done={done.remember}>{done.remember ? "○" : "□"} 会話が長くても名前を覚えているようにする（窓の大きさを変えてみよう）</li>
        <li data-done={done.ratio}>{done.ratio ? "○" : "□"} KVキャッシュが計算を10倍以上へらす長さを見つける</li>
      </ul>
    </div>
  );
}
