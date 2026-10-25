import { useState } from "react";
import { PIPELINE } from "../../../../data/ch05";
import { corpusByKey } from "../../../../data/part11-corpus";
import { getCorpus, getFavorite, getName, getSession, setName } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

const fmt = (n: number) => n.toLocaleString("zh-CN");

export function CertLab() {
  const [name, setLocal] = useState(getName);
  const session = getSession();
  const corpus = corpusByKey(getCorpus());
  const fav = getFavorite();
  const trained = !!session && session.model.step > 0;
  const now = new Date();
  const date = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日`;
  const clean = name.trim();

  return (
    <div>
      <label className="code-label" htmlFor="p11-name" style={{ marginTop: 0 }}>
        我的名字
      </label>
      <input
        id="p11-name"
        className="code-input"
        value={name}
        maxLength={12}
        autoComplete="off"
        placeholder="请写上名字"
        onChange={(e) => {
          setLocal(e.target.value);
          setName(e.target.value);
        }}
      />

      <section className="p11-cert" aria-label="结业证书">
        <h3 className="p11-cert-title">结业证书</h3>
        <p className="p11-cert-school">AI解剖课堂 · 12 个 Part 96 章</p>
        <p className="p11-cert-name">
          <span>姓名</span>
          <b className={clean ? "" : "empty"}>{clean || "　"}</b>
        </p>
        <p className="p11-cert-body">
          该同学从猜下一个片段开始，学完了分词器、嵌入、注意力、前馈网络、Softmax、预训练和对话练习，从头到尾弄懂了 ChatGPT 的设计图，并亲手
          {trained ? "训练了" : "做出了"}自己的迷你 GPT，特发此证。
        </p>
        <dl className="p11-cert-model">
          <div>
            <dt>我的迷你 GPT</dt>
            <dd>
              {trained
                ? `${corpus.name}数据 · ${session!.merges.length ? `BPE 合并 ${session!.merges.length} 次` : "按字切"} · ${fmt(session!.model.step)} 步 · 损失 ${session!.history[session!.history.length - 1].toFixed(2)}`
                : `${corpus.name}数据 · 在第 94 章训练后会记录在这里`}
            </dd>
          </div>
          <div>
            <dt>{fav ? `${fav.who}写的句子` : "迷你 GPT 写的句子"}</dt>
            <dd>{fav ? `“${fav.text}”` : "在第 95 章点 ☆ 挑一句吧"}</dd>
          </div>
        </dl>
        <div className="p11-cert-parts" aria-label="完成的设计图">
          {PIPELINE.map((p) => (
            <span key={p.key} className={`chip hl-${p.color}`}>
              {p.name}
            </span>
          ))}
        </div>
        <div className="p11-cert-foot">
          <span className="num">{date}</span>
          <span className="hand">AI解剖课堂</span>
        </div>
        <span className="p11-stamp" aria-hidden="true">
          真棒
        </span>
      </section>

      <p className="lab-tip">
        {clean ? `${clean}同学，恭喜结业！可以截个图留作纪念。` : "写上名字，结业证书就完成了。"}
      </p>
    </div>
  );
}
