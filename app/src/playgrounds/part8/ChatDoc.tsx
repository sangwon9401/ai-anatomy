import { Fragment, useState } from "react";
import { IM_END, MESSAGES, SYSTEMS } from "../../data/ch77";
import "./style.css";

type Entry = { msg: number; sys: string; broken: boolean };
const MAX = 4;

const Role = ({ role, sys }: { role: string; sys?: boolean }) => <span className={`p8-role${sys ? " sys" : ""}`}>{`<|im_start|>${role}`}</span>;
const End = () => <span className="p8-role">{IM_END}</span>;

export function ChatDoc() {
  const [sys, setSys] = useState(SYSTEMS[0].key);
  const [log, setLog] = useState<Entry[]>([]);
  const [view, setView] = useState<"chat" | "doc">("chat");
  const [marker, setMarker] = useState(true);
  const [seen, setSeen] = useState<string[]>([]);
  const system = SYSTEMS.find((s) => s.key === sys)!;
  const full = log.length >= MAX || (log.length > 0 && log[log.length - 1].broken);

  const send = (msg: number) => {
    setLog([...log, { msg, sys, broken: !marker }]);
    setSeen((x) => [...new Set([...x, `${sys}:${msg}`, ...(marker ? [] : ["broken"])])]);
  };

  // the document the model reads, built from the conversation so far
  const docText =
    `<|im_start|>system\n${system.text}${IM_END}\n` +
    log.map((e) => `<|im_start|>user\n${MESSAGES[e.msg].text}${e.broken ? MESSAGES[e.msg].noMarker : `${IM_END}\n<|im_start|>assistant\n${MESSAGES[e.msg].reply[e.sys]}${IM_END}`}`).join("\n");
  const markers = (docText.match(/<\|im_(start|end)\|>/g) ?? []).length;
  const chars = docText.length;
  const sameQ = MESSAGES.some((_, i) => SYSTEMS.filter((s) => seen.includes(`${s.key}:${i}`)).length >= 2);

  return (
    <div>
      <p className="p8-label" style={{ marginTop: 0 }}>
        시스템 프롬프트 (사용자 눈엔 안 보여요)
      </p>
      <div className="p8-seg" role="group" aria-label="시스템 프롬프트">
        {SYSTEMS.map((s) => (
          <button
            key={s.key}
            aria-pressed={sys === s.key}
            onClick={() => {
              setSys(s.key);
              setLog([]);
            }}
          >
            {s.name}
          </button>
        ))}
      </div>
      <p className="lab-sum" style={{ margin: "6px 0 0" }}>
        “{system.text}”
      </p>

      <div className="p8-seg" role="tablist" aria-label="보기" style={{ marginTop: 14 }}>
        <button role="tab" aria-selected={view === "chat"} aria-pressed={view === "chat"} onClick={() => setView("chat")}>
          채팅 화면
        </button>
        <button role="tab" aria-selected={view === "doc"} aria-pressed={view === "doc"} onClick={() => setView("doc")}>
          모델이 보는 글
        </button>
      </div>

      {view === "chat" ? (
        <div className="p8-chat" aria-live="polite">
          {log.length === 0 && <p className="lab-sum">아래에서 메시지를 골라 보내 보세요.</p>}
          {log.map((e, i) => (
            <Fragment key={i}>
              <div className="p8-bubble user">
                <span className="p8-who">나</span>
                {MESSAGES[e.msg].text}
              </div>
              <div className="p8-bubble">
                <span className="p8-who">{e.broken ? "어시스턴트 차례 표시가 없어서…" : "ChatGPT"}</span>
                {e.broken ? `내 말을 이어 썼어요: “${MESSAGES[e.msg].noMarker.trim()}”` : MESSAGES[e.msg].reply[e.sys]}
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <>
          <div className="p8-doc" aria-live="polite">
            <Role role="system" sys />
            {"\n"}
            <span className="p8-hidden">{system.text}</span>
            <End />
            {log.map((e, i) => {
              const m = MESSAGES[e.msg];
              const last = i === log.length - 1;
              return (
                <Fragment key={i}>
                  {"\n"}
                  <Role role="user" />
                  {"\n"}
                  {m.text}
                  {e.broken ? (
                    <span className="p8-cont">{m.noMarker}</span>
                  ) : (
                    <>
                      <End />
                      {"\n"}
                      <Role role="assistant" />
                      {"\n"}
                      {last ? <span className="p8-cont">{m.reply[e.sys]}</span> : m.reply[e.sys]}
                      <End />
                    </>
                  )}
                </Fragment>
              );
            })}
          </div>
          <p className="p8-doc-cap">
            문서 길이 {chars}글자 · 표시 토큰 {markers}개. 초록색이 모델이 방금 이어 쓴 부분이에요. 표시 모양은 ChatML 형식의 예시예요.
          </p>
        </>
      )}

      <p className="p8-label">메시지 보내기</p>
      <div className="p8-grid2" role="group" aria-label="보낼 메시지">
        {MESSAGES.map((m, i) => (
          <button key={m.text} className="p8-opt" disabled={full} onClick={() => send(i)}>
            {m.text}
          </button>
        ))}
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, minHeight: 40, fontSize: 15 }}>
        <input type="checkbox" checked={marker} onChange={(e) => setMarker(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--ink)" }} />
        보낼 때 끝에 &lt;|im_start|&gt;assistant 표시 붙이기
      </label>
      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setLog([])} disabled={log.length === 0}>
          대화 새로 시작
        </button>
      </div>

      <p className="lab-tip">
        {log.length > 0 && log[log.length - 1].broken
          ? "어시스턴트 차례 표시가 없으니, 모델은 사용자의 문장을 그럴듯하게 이어 썼어요. 72장의 베이스 모델처럼요! 대화를 새로 시작해 보세요."
          : full
            ? "대화가 꽤 길어졌어요. '모델이 보는 글'을 보면 앞의 대화가 전부 들어 있어요. 모델은 이걸 매번 다시 읽어요."
            : view === "chat"
              ? "메시지를 보낸 뒤 '모델이 보는 글'을 눌러 보세요."
              : "말풍선은 없고, 표시 토큰으로 구분한 긴 글 하나만 있어요. 맨 앞의 시스템 프롬프트도 보이죠?"}
      </p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={log.length >= 3}>{log.length >= 3 ? "○" : "□"} 한 대화에서 메시지 3번 보내기</li>
        <li data-done={sameQ}>{sameQ ? "○" : "□"} 시스템 프롬프트만 바꿔서 같은 메시지 보내 보기</li>
        <li data-done={seen.includes("broken")}>{seen.includes("broken") ? "○" : "□"} 어시스턴트 표시를 빼고 보내 보기</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        대답은 설명용 예시예요.
      </p>
    </div>
  );
}
