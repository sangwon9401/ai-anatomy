import { Fragment, useState } from "react";
import { IM_END, MESSAGES, SYSTEMS } from "../../../../data/ch77";
import "../../../../playgrounds/part8/style.css";

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
        系统提示词（用户看不到）
      </p>
      <div className="p8-seg" role="group" aria-label="系统提示词">
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

      <div className="p8-seg" role="tablist" aria-label="查看方式" style={{ marginTop: 14 }}>
        <button role="tab" aria-selected={view === "chat"} aria-pressed={view === "chat"} onClick={() => setView("chat")}>
          聊天界面
        </button>
        <button role="tab" aria-selected={view === "doc"} aria-pressed={view === "doc"} onClick={() => setView("doc")}>
          模型看到的文字
        </button>
      </div>

      {view === "chat" ? (
        <div className="p8-chat" aria-live="polite">
          {log.length === 0 && <p className="lab-sum">在下面选一条消息发出去吧。</p>}
          {log.map((e, i) => (
            <Fragment key={i}>
              <div className="p8-bubble user">
                <span className="p8-who">我</span>
                {MESSAGES[e.msg].text}
              </div>
              <div className="p8-bubble">
                <span className="p8-who">{e.broken ? "没有“轮到助手”的标记……" : "ChatGPT"}</span>
                {e.broken ? `它接着我的话往下写了：“${MESSAGES[e.msg].noMarker.trim()}”` : MESSAGES[e.msg].reply[e.sys]}
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
            文档长度 {chars} 个字符 · 标记词元 {markers} 个。绿色的部分是模型刚刚接着写的。标记的样子是 ChatML 格式的例子。
          </p>
        </>
      )}

      <p className="p8-label">发送消息</p>
      <div className="p8-grid2" role="group" aria-label="要发送的消息">
        {MESSAGES.map((m, i) => (
          <button key={m.text} className="p8-opt" disabled={full} onClick={() => send(i)}>
            {m.text}
          </button>
        ))}
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, minHeight: 40, fontSize: 15 }}>
        <input type="checkbox" checked={marker} onChange={(e) => setMarker(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--ink)" }} />
        发送时在末尾加上 &lt;|im_start|&gt;assistant 标记
      </label>
      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setLog([])} disabled={log.length === 0}>
          重新开始对话
        </button>
      </div>

      <p className="lab-tip">
        {log.length > 0 && log[log.length - 1].broken
          ? "没有“轮到助手”的标记，模型就把用户的句子像模像样地接着写了下去。就像第 72 章的基础模型一样！重新开始对话试试。"
          : full
            ? "对话已经挺长了。看看“模型看到的文字”，前面的对话全都在里面。模型每次都要重读一遍。"
            : view === "chat"
              ? "发完消息后，点一下“模型看到的文字”。"
              : "没有气泡，只有一篇用标记词元隔开的长文字。看到最前面的系统提示词了吗？"}
      </p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={log.length >= 3}>{log.length >= 3 ? "○" : "□"} 在一次对话里发 3 条消息</li>
        <li data-done={sameQ}>{sameQ ? "○" : "□"} 只换系统提示词，发同一条消息</li>
        <li data-done={seen.includes("broken")}>{seen.includes("broken") ? "○" : "□"} 去掉助手标记再发送</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        回答是示意数据。
      </p>
    </div>
  );
}
