import { useState } from "react";
import { CHAT, TURNS, noCache, withCache, type Msg } from "../../../../data/ch83";
import "../../../../playgrounds/part9/style.css";

const START: Msg[] = [CHAT[0], CHAT[1]];
const NAME = "Mia";
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function WindowLab() {
  const [msgs, setMsgs] = useState<Msg[]>(START);
  const [size, setSize] = useState(5);
  const [tip, setTip] = useState("Press a few chat topics to make the chat long, then press 'What was my name?'");
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
    setTip("The chat got longer. Bubbles pushed out of the window are faded.");
  };
  const ask = () => {
    const withQ = [...msgs, { me: true, text: "What was my name?" }];
    const fi = Math.max(0, withQ.length - size);
    const sees = withQ.slice(fi).some((x) => x.text.includes(NAME) && x.text !== "What was my name?");
    const reply = sees ? `You're ${NAME}!` : Math.random() < 0.5 ? "Hmm… I'm not sure. Could you tell me again?" : "Hmm… is it Ava, maybe?";
    add([...withQ, { me: false, text: reply }]);
    if (sees) {
      setTip("The name was inside the window, so it answered correctly.");
      if (withQ.length > 5) setDone((d) => ({ ...d, remember: true }));
    } else setTip(reply.includes("Ava") ? "It can't see the name outside the window, so it made up a likely-sounding one. That's the hallucination we'll see in chapter 84." : "It can't see the name outside the window, so it said it doesn't know. Make the window bigger or tell it your name again.");
  };

  return (
    <div>
      <div className="lab-row">
        <span>Window</span>
        <input type="range" min={3} max={12} step={1} value={size} aria-label="Window size (number of bubbles)" onChange={(e) => {
            const v = Number(e.target.value);
            setSize(v);
            if (msgs.findIndex((x) => x.text.includes(NAME)) < Math.max(0, msgs.length - v)) setDone((d) => ({ ...d, out: true }));
          }} />
        <span className="val">{size}</span>
      </div>

      <ol className="p9-chat" aria-live="polite">
        {msgs.map((x, i) => (
          <li key={i} data-me={x.me} data-out={i < firstIn} data-edge={i === firstIn && firstIn > 0}>
            <span className="bubble">{x.text}</span>
          </li>
        ))}
      </ol>
      <p className="p9-note">
        {msgs.length - firstIn} inside the window · {firstIn} outside{nameOut ? " · the name is outside the window" : ""}
      </p>

      <div className="ctx-presets p9-tall" role="group" aria-label="Continue the chat">
        {TURNS.map((t, i) => (
          <button key={t.label} onClick={() => turn(i)}>
            + {t.label}
          </button>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={ask}>
          What was my name?
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setMsgs(START);
            setTip("Press a few chat topics to make the chat long, then press 'What was my name?'");
          }}
        >
          Start over
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">Real windows are measured in tokens (GPT-3: 2,048 tokens). Here we just count bubbles to keep it simple.</p>

      <h4 className="p9-h">Work the KV cache saves</h4>
      <div className="lab-rows">
        <div className="lab-row">
          <span>Question</span>
          <input type="range" min={10} max={2000} step={10} value={m} aria-label="Question length (tokens)" onChange={(e) => setLen(Number(e.target.value), n)} />
          <span className="val">{m}</span>
        </div>
        <div className="lab-row">
          <span>Answer</span>
          <input type="range" min={1} max={500} step={1} value={n} aria-label="Answer length (tokens)" onChange={(e) => setLen(m, Number(e.target.value))} />
          <span className="val">{n}</span>
        </div>
      </div>
      <div className="p9-kv">
        <div>
          <span className="muted">No cache</span>
          <b className="num">{fmt(noCache(m, n))} times</b>
        </div>
        <div>
          <span className="muted">KV cache</span>
          <b className="num">{fmt(withCache(m, n))} times</b>
        </div>
      </div>
      <p className="lab-sum">
        For every answer piece, without a cache the Key·Value of all earlier pieces are computed again; with the cache, only the new piece's are. Right now that's about {ratio.toFixed(1)}× less work. (One layer, one head.)
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.out}>{done.out ? "○" : "□"} Make the chat long enough to push the name out of the window</li>
        <li data-done={done.remember}>{done.remember ? "○" : "□"} Make it remember the name even in a long chat (try the window size)</li>
        <li data-done={done.ratio}>{done.ratio ? "○" : "□"} Find lengths where the KV cache saves more than 10× the work</li>
      </ul>
    </div>
  );
}
