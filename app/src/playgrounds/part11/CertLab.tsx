import { useState } from "react";
import { PIPELINE } from "../../data/ch05";
import { corpusByKey } from "../../data/part11-corpus";
import { getCorpus, getFavorite, getName, getSession, setName } from "./store";
import "./style.css";

const fmt = (n: number) => n.toLocaleString("ko-KR");

export function CertLab() {
  const [name, setLocal] = useState(getName);
  const session = getSession();
  const corpus = corpusByKey(getCorpus());
  const fav = getFavorite();
  const trained = !!session && session.model.step > 0;
  const now = new Date();
  const date = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  const clean = name.trim();

  return (
    <div>
      <label className="code-label" htmlFor="p11-name" style={{ marginTop: 0 }}>
        내 이름
      </label>
      <input
        id="p11-name"
        className="code-input"
        value={name}
        maxLength={12}
        autoComplete="off"
        placeholder="이름을 써 주세요"
        onChange={(e) => {
          setLocal(e.target.value);
          setName(e.target.value);
        }}
      />

      <section className="p11-cert" aria-label="수료증">
        <h3 className="p11-cert-title">수료증</h3>
        <p className="p11-cert-school">AI 해부교실 · 12개 Part 96장</p>
        <p className="p11-cert-name">
          <span>이름</span>
          <b className={clean ? "" : "empty"}>{clean || "　"}</b>
        </p>
        <p className="p11-cert-body">
          위 학생은 다음 조각 맞히기부터 토크나이저, 임베딩, 어텐션, 피드포워드, 소프트맥스, 사전학습과 대화 연습까지 ChatGPT의 설계도를 처음부터 끝까지 익히고, 나만의 미니 GPT를 직접
          {trained ? " 훈련시켰기에" : " 만들어 보았기에"} 이 증서를 드립니다.
        </p>
        <dl className="p11-cert-model">
          <div>
            <dt>나의 미니 GPT</dt>
            <dd>
              {trained
                ? `${corpus.name} 데이터 · ${session!.merges.length ? `BPE 병합 ${session!.merges.length}번` : "글자 단위"} · ${fmt(session!.model.step)}걸음 · 손실 ${session!.history[session!.history.length - 1].toFixed(2)}`
                : `${corpus.name} 데이터 · 94장에서 훈련하면 기록이 들어가요`}
            </dd>
          </div>
          <div>
            <dt>{fav ? `${fav.who}이 쓴 문장` : "미니 GPT가 쓴 문장"}</dt>
            <dd>{fav ? `“${fav.text}”` : "95장에서 ☆을 눌러 골라 보세요"}</dd>
          </div>
        </dl>
        <div className="p11-cert-parts" aria-label="완성한 설계도">
          {PIPELINE.map((p) => (
            <span key={p.key} className={`chip hl-${p.color}`}>
              {p.name}
            </span>
          ))}
        </div>
        <div className="p11-cert-foot">
          <span className="num">{date}</span>
          <span className="hand">AI 해부교실</span>
        </div>
        <span className="p11-stamp" aria-hidden="true">
          참 잘했어요
        </span>
      </section>

      <p className="lab-tip">
        {clean ? `${clean} 님, 수료를 축하해요! 화면을 캡처해서 간직해도 좋아요.` : "이름을 쓰면 수료증이 완성돼요."}
      </p>
    </div>
  );
}
