import { useState } from "react";
import { CHAT, TURNS, noCache, withCache, type Msg } from "../../data/ch83";
import "./style.css";

const START: Msg[] = [CHAT[0], CHAT[1]];
const NAME = "민지";
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function WindowLab() {
  const [msgs, setMsgs] = useState<Msg[]>(START);
  const [size, setSize] = useState(5);
  const [tip, setTip] = useState("대화 주제를 몇 개 눌러서 대화를 길게 만든 다음, '내 이름이 뭐였지?'를 눌러 보세요.");
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
    setTip("대화가 길어졌어요. 창 밖으로 밀려난 말풍선은 흐리게 보여요.");
  };
  const ask = () => {
    const withQ = [...msgs, { me: true, text: "내 이름이 뭐였지?" }];
    const fi = Math.max(0, withQ.length - size);
    const sees = withQ.slice(fi).some((x) => x.text.includes(NAME) && x.text !== "내 이름이 뭐였지?");
    const reply = sees ? `${NAME} 님이죠!` : Math.random() < 0.5 ? "음… 잘 모르겠어요. 다시 알려 줄래요?" : "음… 혹시 지수 님이었나요?";
    add([...withQ, { me: false, text: reply }]);
    if (sees) {
      setTip("이름이 창 안에 있어서 제대로 답했어요.");
      if (withQ.length > 5) setDone((d) => ({ ...d, remember: true }));
    } else setTip(reply.includes("지수") ? "창 밖의 이름을 못 보니까, 그럴듯한 이름을 지어냈어요. 이게 84장에서 볼 환각이에요." : "창 밖의 이름을 못 봐서 모른다고 했어요. 창을 키우거나 이름을 다시 알려 주면 돼요.");
  };

  return (
    <div>
      <div className="lab-row">
        <span>창 크기</span>
        <input type="range" min={3} max={12} step={1} value={size} aria-label="창 크기 (말풍선 개수)" onChange={(e) => {
            const v = Number(e.target.value);
            setSize(v);
            if (msgs.findIndex((x) => x.text.includes(NAME)) < Math.max(0, msgs.length - v)) setDone((d) => ({ ...d, out: true }));
          }} />
        <span className="val">{size}개</span>
      </div>

      <ol className="p9-chat" aria-live="polite">
        {msgs.map((x, i) => (
          <li key={i} data-me={x.me} data-out={i < firstIn} data-edge={i === firstIn && firstIn > 0}>
            <span className="bubble">{x.text}</span>
          </li>
        ))}
      </ol>
      <p className="p9-note">
        창 안 {msgs.length - firstIn}개 · 창 밖 {firstIn}개{nameOut ? " · 이름이 창 밖에 있어요" : ""}
      </p>

      <div className="ctx-presets p9-tall" role="group" aria-label="대화 이어 가기">
        {TURNS.map((t, i) => (
          <button key={t.label} onClick={() => turn(i)}>
            + {t.label}
          </button>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={ask}>
          내 이름이 뭐였지?
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setMsgs(START);
            setTip("대화 주제를 몇 개 눌러서 대화를 길게 만든 다음, '내 이름이 뭐였지?'를 눌러 보세요.");
          }}
        >
          처음부터
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">실제 창 크기는 토큰 수로 정해요 (GPT-3: 2,048토큰). 여기선 쉽게 말풍선 개수로 셌어요.</p>

      <h4 className="p9-h">KV 캐시가 아껴 주는 계산</h4>
      <div className="lab-rows">
        <div className="lab-row">
          <span>질문 길이</span>
          <input type="range" min={10} max={2000} step={10} value={m} aria-label="질문 길이 (토큰)" onChange={(e) => setLen(Number(e.target.value), n)} />
          <span className="val">{m}</span>
        </div>
        <div className="lab-row">
          <span>답 길이</span>
          <input type="range" min={1} max={500} step={1} value={n} aria-label="답 길이 (토큰)" onChange={(e) => setLen(m, Number(e.target.value))} />
          <span className="val">{n}</span>
        </div>
      </div>
      <div className="p9-kv">
        <div>
          <span className="muted">캐시 없이</span>
          <b className="num">{fmt(noCache(m, n))}번</b>
        </div>
        <div>
          <span className="muted">KV 캐시</span>
          <b className="num">{fmt(withCache(m, n))}번</b>
        </div>
      </div>
      <p className="lab-sum">
        답 조각을 하나 만들 때마다, 캐시 없이는 앞 조각 전부의 Key·Value를 다시 계산하고, 캐시가 있으면 새 조각 것만 계산해요. 지금은 약 {ratio.toFixed(1)}배 차이예요. (층 하나, 헤드 하나 기준)
      </p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.out}>{done.out ? "○" : "□"} 대화를 길게 해서 이름을 창 밖으로 밀어내기</li>
        <li data-done={done.remember}>{done.remember ? "○" : "□"} 대화가 길어도 이름을 기억하게 하기 (창 크기를 바꿔 보세요)</li>
        <li data-done={done.ratio}>{done.ratio ? "○" : "□"} KV 캐시가 계산을 10배 넘게 줄이는 길이 찾기</li>
      </ul>
    </div>
  );
}
