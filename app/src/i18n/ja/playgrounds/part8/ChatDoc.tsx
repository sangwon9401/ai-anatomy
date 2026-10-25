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
        システムプロンプト（ユーザーには見えません）
      </p>
      <div className="p8-seg" role="group" aria-label="システムプロンプト">
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

      <div className="p8-seg" role="tablist" aria-label="表示" style={{ marginTop: 14 }}>
        <button role="tab" aria-selected={view === "chat"} aria-pressed={view === "chat"} onClick={() => setView("chat")}>
          チャット画面
        </button>
        <button role="tab" aria-selected={view === "doc"} aria-pressed={view === "doc"} onClick={() => setView("doc")}>
          モデルが見ている文章
        </button>
      </div>

      {view === "chat" ? (
        <div className="p8-chat" aria-live="polite">
          {log.length === 0 && <p className="lab-sum">下からメッセージを選んで送ってみましょう。</p>}
          {log.map((e, i) => (
            <Fragment key={i}>
              <div className="p8-bubble user">
                <span className="p8-who">私</span>
                {MESSAGES[e.msg].text}
              </div>
              <div className="p8-bubble">
                <span className="p8-who">{e.broken ? "アシスタントの番の目印がないので…" : "ChatGPT"}</span>
                {e.broken ? `私の言葉の続きを書いてしまいました：「${MESSAGES[e.msg].noMarker.trim()}」` : MESSAGES[e.msg].reply[e.sys]}
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
            文書の長さ {chars}文字 · 目印のトークン {markers}個。緑色が、モデルがいま続けて書いた部分です。目印の形はChatML形式の例です。
          </p>
        </>
      )}

      <p className="p8-label">メッセージを送る</p>
      <div className="p8-grid2" role="group" aria-label="送るメッセージ">
        {MESSAGES.map((m, i) => (
          <button key={m.text} className="p8-opt" disabled={full} onClick={() => send(i)}>
            {m.text}
          </button>
        ))}
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, minHeight: 40, fontSize: 15 }}>
        <input type="checkbox" checked={marker} onChange={(e) => setMarker(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--ink)" }} />
        送るとき、最後に &lt;|im_start|&gt;assistant の目印をつける
      </label>
      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setLog([])} disabled={log.length === 0}>
          新しい会話を始める
        </button>
      </div>

      <p className="lab-tip">
        {log.length > 0 && log[log.length - 1].broken
          ? "アシスタントの番の目印がないので、モデルはユーザーの文をそれらしく続けて書きました。第72章のベースモデルのように！ 新しい会話を始めてみましょう。"
          : full
            ? "会話がかなり長くなりました。「モデルが見ている文章」を見ると、前の会話が全部入っています。モデルはこれを毎回読み直します。"
            : view === "chat"
              ? "メッセージを送ったら、「モデルが見ている文章」を押してみましょう。"
              : "吹き出しはなく、目印のトークンで区切った長い文章が1つあるだけです。いちばん前のシステムプロンプトも見えますね？"}
      </p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={log.length >= 3}>{log.length >= 3 ? "○" : "□"} 1つの会話でメッセージを3回送る</li>
        <li data-done={sameQ}>{sameQ ? "○" : "□"} システムプロンプトだけを変えて、同じメッセージを送ってみる</li>
        <li data-done={seen.includes("broken")}>{seen.includes("broken") ? "○" : "□"} アシスタントの目印を外して送ってみる</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        答えは説明用の例です。
      </p>
    </div>
  );
}
