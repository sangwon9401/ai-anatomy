import { useState } from "react";
import { PIPELINE } from "../../../../data/ch05";
import { corpusByKey } from "../../../../data/part11-corpus";
import { getCorpus, getFavorite, getName, getSession, setName } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

const fmt = (n: number) => n.toLocaleString("en-US");

export function CertLab() {
  const [name, setLocal] = useState(getName);
  const session = getSession();
  const corpus = corpusByKey(getCorpus());
  const fav = getFavorite();
  const trained = !!session && session.model.step > 0;
  const now = new Date();
  const date = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const clean = name.trim();

  return (
    <div>
      <label className="code-label" htmlFor="p11-name" style={{ marginTop: 0 }}>
        My name
      </label>
      <input
        id="p11-name"
        className="code-input"
        value={name}
        maxLength={12}
        autoComplete="off"
        placeholder="Write your name"
        onChange={(e) => {
          setLocal(e.target.value);
          setName(e.target.value);
        }}
      />

      <section className="p11-cert" aria-label="Certificate">
        <h3 className="p11-cert-title">Certificate</h3>
        <p className="p11-cert-school">AI Anatomy Class · 12 Parts, 96 chapters</p>
        <p className="p11-cert-name">
          <span>Name</span>
          <b className={clean ? "" : "empty"}>{clean || "　"}</b>
        </p>
        <p className="p11-cert-body">
          This certifies that the student named above has learned ChatGPT's blueprint from start to finish, from guessing the next piece through the tokenizer, embedding, attention, feed-forward, softmax, pre-training and chat practice, and has
          {trained ? " trained" : " built"} a mini GPT of their own.
        </p>
        <dl className="p11-cert-model">
          <div>
            <dt>My mini GPT</dt>
            <dd>
              {trained
                ? `${corpus.name} data · ${session!.merges.length ? `BPE, ${session!.merges.length} merges` : "1 token per character"} · ${fmt(session!.model.step)} steps · loss ${session!.history[session!.history.length - 1].toFixed(2)}`
                : `${corpus.name} data · train in ch. 94 to add your record`}
            </dd>
          </div>
          <div>
            <dt>{fav ? `A line written by ${fav.who}` : "A line written by a mini GPT"}</dt>
            <dd>{fav ? `“${fav.text}”` : "Pick one with ☆ in ch. 95"}</dd>
          </div>
        </dl>
        <div className="p11-cert-parts" aria-label="The completed blueprint">
          {PIPELINE.map((p) => (
            <span key={p.key} className={`chip hl-${p.color}`}>
              {p.name}
            </span>
          ))}
        </div>
        <div className="p11-cert-foot">
          <span className="num">{date}</span>
          <span className="hand">AI Anatomy Class</span>
        </div>
        <span className="p11-stamp" aria-hidden="true">
          Well done!
        </span>
      </section>

      <p className="lab-tip">
        {clean ? `Congratulations on finishing, ${clean}! Take a screenshot to keep it.` : "Write your name to complete the certificate."}
      </p>
    </div>
  );
}
