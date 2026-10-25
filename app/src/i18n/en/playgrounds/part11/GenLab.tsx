import { useEffect, useMemo, useRef, useState } from "react";
import { corpusByKey, type CorpusKey } from "../../../../data/part11-corpus";
import { encodeLine, type Tokenizer } from "../../../../playgrounds/part11/bpe";
import { nextProbs, sampleFrom, type Model, type Work } from "../../../../playgrounds/part11/minigpt";
import { getCorpus, getFavorite, getSession, pretrained, setFavorite } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

const PRESETS: Record<CorpusKey, string[]> = {
  proverb: ["A ", "Every ", "Don't ", "The ", "Time "],
  song: ["Little ", "Humpty ", "Twinkle, ", "Hop, "],
  textbook: ["Water ", "The moon ", "A square has ", "I walk to "],
};
const MAX_TOKENS = 40;
const fmt = (n: number) => n.toLocaleString("en-US");
const show = (t: string) => (t === "\n" ? "(line end)" : t === " " ? "(space)" : t);

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
      return { model: session.model, tok: session.tok, work: session.gen, label: `my model (${fmt(session.model.step)} steps)`, short: "my model" };
    const p = pretrained(corpusKey);
    return { model: p.model, tok: p.tok, work: p.work, label: `ready-made model (${fmt(p.steps)} steps)`, short: "the ready-made model" };
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

  const tempWord = temp <= 0.5 ? "sharp (steady)" : temp <= 1.2 ? "normal" : "flat (odd)";
  const last = lines.find((l) => l.done);
  let tip = "Press 'Write a line'. The model picks one token at a time and appends it.";
  if (last) {
    if (last.copied) tip = "It wrote a line exactly as it is in the data. It memorized it. Why not raise the temperature?";
    else if (last.temp >= 1.4) tip = "The temperature is high, so low bars get picked often. New, but with nonsense mixed in.";
    else if (last.temp <= 0.4) tip = "The temperature is low, so first place keeps winning. Try a few times: the lines will look alike.";
    else tip = "A new line that isn't in the data! Is it plausible or nonsense? If it sounds plausible but is false, it's a hallucination (chapter 84).";
  }

  return (
    <div>
      <div className="p11-source" role="group" aria-label="Which model writes">
        <button aria-pressed={source === "mine"} disabled={!hasMine} onClick={() => setSource("mine")}>
          <b>My model</b>
          <span>{hasMine ? `ch. 94 · ${fmt(session!.model.step)} steps · loss ${session!.history[session!.history.length - 1].toFixed(2)}` : "Appears once you train in ch. 94"}</span>
        </button>
        <button aria-pressed={source === "pre"} onClick={() => setSource("pre")}>
          <b>Ready-made model</b>
          <span>same code · {fmt(pretrained(corpusKey).steps)} steps · BPE, {pretrained(corpusKey).tok.merges.length} merges</span>
        </button>
      </div>

      <label className="code-label" htmlFor="p11-prompt">
        Start text ({corpus.name} data)
      </label>
      <input id="p11-prompt" className="code-input" value={prompt} maxLength={24} onChange={(e) => setPrompt(e.target.value)} placeholder="Leave empty to start from scratch" autoComplete="off" />
      <div className="ctx-presets">
        {PRESETS[corpusKey].map((p) => (
          <button key={p} onClick={() => setPrompt(p)} aria-label={p.endsWith(" ") ? `${p.trim()} space` : p}>
            {p.trim()}
            {p.endsWith(" ") && <span className="p11-sp" aria-hidden="true" />}
          </button>
        ))}
        <button onClick={() => setPrompt("")}>Clear</button>
      </div>
      {enc.unknown.length > 0 && <p className="p11-note">Characters the model doesn't know were left out: {[...new Set(enc.unknown)].join(" ")} (not in the data)</p>}

      <div className="lab-row p11-temp">
        <label htmlFor="p11-temp">Temp</label>
        <input id="p11-temp" type="range" min={0.1} max={2} step={0.1} value={temp} aria-label="Temperature" onChange={(e) => setTemp(Number(e.target.value))} />
        <span className="val">{temp.toFixed(1)}</span>
      </div>
      <p className="p11-note">
        Distribution: <b>{tempWord}</b> · the creativity dial of ch. 81
      </p>

      <h4 className="p11-h4">Odds of the token after '{prompt || "(start)"}'</h4>
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
          Write a line
        </button>
        <button className="btn ghost" onClick={() => write(3)} disabled={busy}>
          Write 3 lines
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
                    <span className={`p11-badge ${l.copied ? "" : "new"}`}>{l.copied ? "memorized" : "new line"}</span>
                    <span>
                      temp {l.temp.toFixed(1)} · {l.pieces.length} tokens · {l.who}
                    </span>
                    <button
                      className="p11-fav"
                      aria-pressed={fav === text}
                      onClick={() => {
                        setFavorite({ text, who: l.short });
                        setFav(text);
                      }}
                    >
                      {fav === text ? "★ On your certificate" : "☆ Put on certificate"}
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
