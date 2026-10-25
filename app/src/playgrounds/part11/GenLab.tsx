import { useEffect, useMemo, useRef, useState } from "react";
import { corpusByKey, type CorpusKey } from "../../data/part11-corpus";
import { encodeLine, type Tokenizer } from "./bpe";
import { nextProbs, sampleFrom, type Model, type Work } from "./minigpt";
import { getCorpus, getFavorite, getSession, pretrained, setFavorite } from "./store";
import "./style.css";

const PRESETS: Record<CorpusKey, string[]> = {
  proverb: ["가는 ", "하늘", "호랑이", "소 ", "세 살 "],
  song: ["달아 ", "토끼", "여우야 ", "꼬마야 "],
  textbook: ["물은 ", "달은 ", "사각형은 ", "나는 오늘 "],
};
const MAX_TOKENS = 40;
const fmt = (n: number) => n.toLocaleString("ko-KR");
const show = (t: string) => (t === "\n" ? "(줄 끝)" : t === " " ? "(띄어쓰기)" : t);

type Writer = { model: Model; tok: Tokenizer; work: Work; label: string; short: string };
type Line = { id: number; pieces: string[]; prompt: string; temp: number; done: boolean; copied: boolean; who: string; short: string };

export function GenLab() {
  const corpusKey = getCorpus();
  const corpus = corpusByKey(corpusKey);
  const session = getSession();
  const hasMine = !!session && session.model.step > 0;
  const [source, setSource] = useState<"mine" | "pre">(hasMine && session!.model.step >= 300 ? "mine" : "pre");
  const [prompt, setPrompt] = useState(PRESETS[corpusKey][0]);
  const [temp, setTemp] = useState(0.8);
  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const [fav, setFav] = useState<string | null>(() => getFavorite()?.text ?? null);
  const timer = useRef(0);
  const nextId = useRef(1);

  const writer: Writer = useMemo(() => {
    if (source === "mine" && session && hasMine)
      return { model: session.model, tok: session.tok, work: session.gen, label: `내 모델 (${fmt(session.model.step)}걸음)`, short: "내 모델" };
    const p = pretrained(corpusKey);
    return { model: p.model, tok: p.tok, work: p.work, label: `미리 훈련한 모델 (${fmt(p.steps)}걸음)`, short: "미리 훈련한 모델" };
  }, [source, session, hasMine, corpusKey]);

  const enc = useMemo(() => encodeLine(writer.tok, prompt), [writer, prompt]);
  const ctx = useMemo(() => [0, ...enc.ids], [enc]);
  const top = useMemo(() => {
    const p = nextProbs(writer.model, writer.work, ctx, temp);
    return [...p]
      .map((v, i) => ({ v, i }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 5)
      .map(({ v, i }) => ({ t: writer.tok.vocab[i], p: v }));
  }, [writer, ctx, temp]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const lineSet = useMemo(() => new Set(corpus.lines), [corpus]);

  /** Write lines one token at a time (so the student sees the loop of ch2), `count` lines in a row. */
  const write = (count: number) => {
    if (busy) return;
    setBusy(true);
    const w = writer;
    const t = temp;
    const startPrompt = prompt;
    let left = count;
    const begin = () => {
      const id = nextId.current++;
      const c = [...ctx];
      const pieces: string[] = [];
      setLines((ls) => [{ id, pieces: [], prompt: startPrompt, temp: t, done: false, copied: false, who: w.label, short: w.short }, ...ls].slice(0, 8));
      const step = () => {
        const tokId = sampleFrom(nextProbs(w.model, w.work, c, t), Math.random());
        const end = tokId === 0 || pieces.length >= MAX_TOKENS;
        if (!end) {
          c.push(tokId);
          pieces.push(w.tok.vocab[tokId]);
        }
        const text = startPrompt + pieces.join("");
        setLines((ls) => ls.map((l) => (l.id === id ? { ...l, pieces: [...pieces], done: end, copied: end && lineSet.has(text) } : l)));
        if (!end) timer.current = window.setTimeout(step, 60);
        else if (--left > 0) timer.current = window.setTimeout(begin, 200);
        else setBusy(false);
      };
      timer.current = window.setTimeout(step, 60);
    };
    begin();
  };

  const tempWord = temp <= 0.5 ? "뾰족 (한결같음)" : temp <= 1.2 ? "보통" : "평평 (엉뚱함)";
  const last = lines.find((l) => l.done);
  let tip = "'한 줄 쓰기'를 눌러 보세요. 모델이 한 토큰씩 뽑아 붙여요.";
  if (last) {
    if (last.copied) tip = "데이터에 있던 문장을 그대로 썼어요. 외운 거예요. 온도를 올려 보면 어떨까요?";
    else if (last.temp >= 1.4) tip = "온도가 높아서 낮은 막대도 자주 뽑혀요. 새롭지만 엉터리 말도 섞여요.";
    else if (last.temp <= 0.4) tip = "온도가 낮아서 1등만 계속 뽑혀요. 몇 번 써 봐도 비슷할 거예요.";
    else tip = "데이터에 없는 새 문장이에요! 그럴듯한가요, 엉터리인가요? 그럴듯한데 틀린 말이면 환각이에요(84장).";
  }

  return (
    <div>
      <div className="p11-source" role="group" aria-label="글을 쓸 모델">
        <button aria-pressed={source === "mine"} disabled={!hasMine} onClick={() => setSource("mine")}>
          <b>내 모델</b>
          <span>{hasMine ? `94장 · ${fmt(session!.model.step)}걸음 · 손실 ${session!.history[session!.history.length - 1].toFixed(2)}` : "94장에서 훈련하면 생겨요"}</span>
        </button>
        <button aria-pressed={source === "pre"} onClick={() => setSource("pre")}>
          <b>미리 훈련한 모델</b>
          <span>같은 코드 · {fmt(pretrained(corpusKey).steps)}걸음 · 글자 단위</span>
        </button>
      </div>

      <label className="code-label" htmlFor="p11-prompt">
        시작 글자 ({corpus.name} 데이터)
      </label>
      <input id="p11-prompt" className="code-input" value={prompt} maxLength={12} onChange={(e) => setPrompt(e.target.value)} placeholder="비우면 처음부터 써요" autoComplete="off" />
      <div className="ctx-presets">
        {PRESETS[corpusKey].map((p) => (
          <button key={p} onClick={() => setPrompt(p)} aria-label={p.endsWith(" ") ? `${p.trim()} 띄어쓰기` : p}>
            {p.trim()}
            {p.endsWith(" ") && <span className="p11-sp" aria-hidden="true" />}
          </button>
        ))}
        <button onClick={() => setPrompt("")}>비우기</button>
      </div>
      {enc.unknown.length > 0 && <p className="p11-note">모델이 모르는 글자는 뺐어요: {[...new Set(enc.unknown)].join(" ")} (데이터에 없던 글자)</p>}

      <div className="lab-row p11-temp">
        <label htmlFor="p11-temp">온도</label>
        <input id="p11-temp" type="range" min={0.1} max={2} step={0.1} value={temp} aria-label="온도" onChange={(e) => setTemp(Number(e.target.value))} />
        <span className="val">{temp.toFixed(1)}</span>
      </div>
      <p className="p11-note">
        분포: <b>{tempWord}</b> · 81장의 창의력 다이얼
      </p>

      <h4 className="p11-h4">'{prompt || "(처음)"}' 다음 토큰의 확률</h4>
      <div className="bars">
        {top.map((c, i) => (
          <div className="bar-row" key={c.t + i}>
            <span className="label">{show(c.t)}</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${c.p * 100}%`, background: ["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)", "var(--hl-pink)", "var(--hl-violet)"][i] }} />
            </span>
            <span className="val">{(c.p * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={() => write(1)} disabled={busy}>
          한 줄 쓰기
        </button>
        <button className="btn ghost" onClick={() => write(3)} disabled={busy}>
          세 줄 쓰기
        </button>
      </div>

      {lines.length > 0 && (
        <ol className="p11-out">
          {lines.map((l) => {
            const text = l.prompt + l.pieces.join("");
            return (
              <li key={l.id}>
                <div className="p11-out-line">
                  {l.prompt && <span className="p11-tok p11-prompt">{l.prompt}</span>}
                  {l.pieces.map((p, i) => (p === " " ? <span key={i} className="p11-gap" /> : <span key={i} className={`p11-tok hl-${["mint", "sky"][i % 2]}`}>{p}</span>))}
                  {!l.done && <span className="p11-caret" />}
                </div>
                {l.done && (
                  <div className="p11-out-meta">
                    <span className={`p11-badge ${l.copied ? "" : "new"}`}>{l.copied ? "외운 문장" : "새 문장"}</span>
                    <span>
                      온도 {l.temp.toFixed(1)} · 토큰 {l.pieces.length}개 · {l.who}
                    </span>
                    <button
                      className="p11-fav"
                      aria-pressed={fav === text}
                      onClick={() => {
                        setFavorite({ text, who: l.short });
                        setFav(text);
                      }}
                    >
                      {fav === text ? "★ 수료증에 넣었어요" : "☆ 수료증에 넣기"}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
