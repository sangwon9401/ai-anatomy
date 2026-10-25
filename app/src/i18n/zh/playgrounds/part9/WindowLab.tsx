import { useState } from "react";
import { CHAT, TURNS, noCache, withCache, type Msg } from "../../../../data/ch83";
import "../../../../playgrounds/part9/style.css";

const START: Msg[] = [CHAT[0], CHAT[1]];
const NAME = "小雨";
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function WindowLab() {
  const [msgs, setMsgs] = useState<Msg[]>(START);
  const [size, setSize] = useState(5);
  const [tip, setTip] = useState("先点几个话题把对话拉长，再按“我叫什么名字来着？”。");
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
    setTip("对话变长了。被挤出窗口的气泡会变淡。");
  };
  const ask = () => {
    const withQ = [...msgs, { me: true, text: "我叫什么名字来着？" }];
    const fi = Math.max(0, withQ.length - size);
    const sees = withQ.slice(fi).some((x) => x.text.includes(NAME) && x.text !== "我叫什么名字来着？");
    const reply = sees ? `你叫${NAME}呀！` : Math.random() < 0.5 ? "嗯……我不太确定。能再告诉我一次吗？" : "嗯……你是小敏吧？";
    add([...withQ, { me: false, text: reply }]);
    if (sees) {
      setTip("名字还在窗口里，所以答对了。");
      if (withQ.length > 5) setDone((d) => ({ ...d, remember: true }));
    } else setTip(reply.includes("小敏") ? "看不到窗口外的名字，就编了一个像模像样的名字。这就是第 84 章要讲的幻觉。" : "看不到窗口外的名字，所以说不知道。把窗口调大，或者再告诉它一次名字就行。");
  };

  return (
    <div>
      <div className="lab-row">
        <span>窗口大小</span>
        <input type="range" min={3} max={12} step={1} value={size} aria-label="窗口大小（气泡个数）" onChange={(e) => {
            const v = Number(e.target.value);
            setSize(v);
            if (msgs.findIndex((x) => x.text.includes(NAME)) < Math.max(0, msgs.length - v)) setDone((d) => ({ ...d, out: true }));
          }} />
        <span className="val">{size} 个</span>
      </div>

      <ol className="p9-chat" aria-live="polite">
        {msgs.map((x, i) => (
          <li key={i} data-me={x.me} data-out={i < firstIn} data-edge={i === firstIn && firstIn > 0}>
            <span className="bubble">{x.text}</span>
          </li>
        ))}
      </ol>
      <p className="p9-note">
        窗口内 {msgs.length - firstIn} 个 · 窗口外 {firstIn} 个{nameOut ? " · 名字在窗口外" : ""}
      </p>

      <div className="ctx-presets p9-tall" role="group" aria-label="继续对话">
        {TURNS.map((t, i) => (
          <button key={t.label} onClick={() => turn(i)}>
            + {t.label}
          </button>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={ask}>
          我叫什么名字来着？
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setMsgs(START);
            setTip("先点几个话题把对话拉长，再按“我叫什么名字来着？”。");
          }}
        >
          重新开始
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">真正的窗口大小按词元数来算（GPT-3：2,048 个词元）。这里为了简单，按气泡个数来数。</p>

      <h4 className="p9-h">KV 缓存省下的计算</h4>
      <div className="lab-rows">
        <div className="lab-row">
          <span>问题长度</span>
          <input type="range" min={10} max={2000} step={10} value={m} aria-label="问题长度（词元）" onChange={(e) => setLen(Number(e.target.value), n)} />
          <span className="val">{m}</span>
        </div>
        <div className="lab-row">
          <span>回答长度</span>
          <input type="range" min={1} max={500} step={1} value={n} aria-label="回答长度（词元）" onChange={(e) => setLen(m, Number(e.target.value))} />
          <span className="val">{n}</span>
        </div>
      </div>
      <div className="p9-kv">
        <div>
          <span className="muted">不用缓存</span>
          <b className="num">{fmt(noCache(m, n))} 次</b>
        </div>
        <div>
          <span className="muted">KV 缓存</span>
          <b className="num">{fmt(withCache(m, n))} 次</b>
        </div>
      </div>
      <p className="lab-sum">
        每生成一个回答片段，不用缓存就要把前面所有片段的 Key·Value 重算一遍；有缓存的话只算新片段的。现在相差约 {ratio.toFixed(1)} 倍。（按一层、一个头计算）
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.out}>{done.out ? "○" : "□"} 把对话拉长，让名字被挤出窗口</li>
        <li data-done={done.remember}>{done.remember ? "○" : "□"} 对话很长也能记住名字（试试改变窗口大小）</li>
        <li data-done={done.ratio}>{done.ratio ? "○" : "□"} 找到让 KV 缓存把计算减少 10 倍以上的长度</li>
      </ul>
    </div>
  );
}
