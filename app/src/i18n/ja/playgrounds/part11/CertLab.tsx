import { useState } from "react";
import { PIPELINE } from "../../../../data/ch05";
import { corpusByKey } from "../../../../data/part11-corpus";
import { getCorpus, getFavorite, getName, getSession, setName } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

const fmt = (n: number) => n.toLocaleString("ja-JP");

export function CertLab() {
  const [name, setLocal] = useState(getName);
  const session = getSession();
  const corpus = corpusByKey(getCorpus());
  const fav = getFavorite();
  const trained = !!session && session.model.step > 0;
  const now = new Date();
  const date = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  const clean = name.trim();

  return (
    <div>
      <label className="code-label" htmlFor="p11-name" style={{ marginTop: 0 }}>
        自分の名前
      </label>
      <input
        id="p11-name"
        className="code-input"
        value={name}
        maxLength={12}
        autoComplete="off"
        placeholder="名前を書いてください"
        onChange={(e) => {
          setLocal(e.target.value);
          setName(e.target.value);
        }}
      />

      <section className="p11-cert" aria-label="修了証">
        <h3 className="p11-cert-title">修了証</h3>
        <p className="p11-cert-school">AI解剖教室・全12部96章</p>
        <p className="p11-cert-name">
          <span>名前</span>
          <b className={clean ? "" : "empty"}>{clean || "　"}</b>
        </p>
        <p className="p11-cert-body">
          あなたは、次のかけら当てからトークナイザー、埋め込み、アテンション、フィードフォワード、ソフトマックス、事前学習と会話の練習まで、ChatGPTの設計図を最初から最後まで学び、自分だけのミニGPTを
          {trained ? "自分で訓練した" : "作ってみた"}ことをここに証します。
        </p>
        <dl className="p11-cert-model">
          <div>
            <dt>自分のミニGPT</dt>
            <dd>
              {trained
                ? `${corpus.name}のデータ・${session!.merges.length ? `BPE くっつけ${session!.merges.length}回` : "文字単位"}・${fmt(session!.model.step)}歩・損失 ${session!.history[session!.history.length - 1].toFixed(2)}`
                : `${corpus.name}のデータ・第94章で訓練すると記録が入ります`}
            </dd>
          </div>
          <div>
            <dt>{fav ? `${fav.who}が書いた文` : "ミニGPTが書いた文"}</dt>
            <dd>{fav ? `「${fav.text}」` : "第95章で☆を押して選んでみましょう"}</dd>
          </div>
        </dl>
        <div className="p11-cert-parts" aria-label="完成した設計図">
          {PIPELINE.map((p) => (
            <span key={p.key} className={`chip hl-${p.color}`}>
              {p.name}
            </span>
          ))}
        </div>
        <div className="p11-cert-foot">
          <span className="num">{date}</span>
          <span className="hand">AI解剖教室</span>
        </div>
        <span className="p11-stamp" aria-hidden="true">
          よくできました
        </span>
      </section>

      <p className="lab-tip">
        {clean ? `${clean}さん、修了おめでとうございます！画面を保存して、記念にとっておくのもいいですね。` : "名前を書くと修了証が完成します。"}
      </p>
    </div>
  );
}
