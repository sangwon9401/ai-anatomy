import { useEffect, useMemo } from "react";
import { CURRICULUM, TOTAL_CHAPTERS, partTitle } from "../data/curriculum";
import { BUILT, builtById, compId } from "../scenes/registry";
import { loadProgress } from "./progress";

const HERO_BARS = [
  { w: "간다", p: 52, c: "yellow" },
  { w: "갔다", p: 21, c: "mint" },
  { w: "늦었다", p: 12, c: "sky" },
];

export function Home({ from }: { from: number | null }) {
  // once every chapter is open the roadmap is the table of contents, and the "open so far" list would only repeat it
  const allOpen = BUILT.length >= TOTAL_CHAPTERS;
  const progress = useMemo(loadProgress, []);
  const resume = progress.last === null ? undefined : builtById(progress.last);
  const fromPart = CURRICULUM.find((p) => p.chapters.some((c) => c.n === (from ?? progress.last)))?.part;
  useEffect(() => {
    if (from !== null) document.getElementById(`toc-${from}`)?.scrollIntoView({ block: "center" });
  }, [from]);
  return (
    <div className="wrap narrow">
      <header className="home-head">
        <div className="wordmark">
          AI 해부교실<small>ChatGPT는 어떻게 만들어졌을까, 96장</small>
        </div>
        <span className="badge">프로토타입 0.3</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-sentence" aria-label="나는 오늘 학교에, 다음 말은?">
          <span className="chip outline">나는</span>
          <span className="chip outline">오늘</span>
          <span className="chip outline">학교에</span>
          <span className="hero-blank">?</span>
        </div>
        <div className="hero-bars">
          {HERO_BARS.map((b, i) => (
            <div className="hero-bar" key={b.w}>
              <span>{b.w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${b.p}%`, background: `var(--hl-${b.c})`, animationDelay: `${200 + i * 140}ms` }} />
              </span>
              <span className="num">{b.p}%</span>
            </div>
          ))}
        </div>
        <h1 id="hero-title">다음 말 맞히기에서 시작해, ChatGPT를 끝까지 조립해요</h1>
        <p>토큰, 임베딩, 어텐션, 학습, RLHF까지. 한 장에 7~10분, 애니메이션을 보고 직접 만져 보면서 이해해요.</p>
        <div className="actions">
          {resume ? (
            <>
              <a className="btn" href={`#${compId(resume.spec.id)}`}>
                이어서 보기: {resume.spec.id}장 {resume.spec.title}
              </a>
              <a className="btn ghost" href={`#${compId(1)}`}>
                1장부터
              </a>
            </>
          ) : (
            <a className="btn" href={`#${compId(1)}`}>
              1장부터 시작하기
            </a>
          )}
        </div>
      </section>

      {!allOpen && (
        <section className="open-list" aria-labelledby="open-title">
          <h2 className="section-title" id="open-title">
            지금 볼 수 있는 장 <span className="hand">96장 중 {BUILT.length}장 열림</span>
          </h2>
          <ol>
            {BUILT.map(({ spec }) => (
              <li className="open-item" key={spec.id}>
                <a href={`#${compId(spec.id)}`}>
                  <span className="open-num">{spec.id}</span>
                  <span>
                    <div className="open-title">{spec.title}</div>
                    <div className="open-hook">{spec.hook}</div>
                  </span>
                  <span className="open-part">Part {spec.part}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="roadmap" aria-labelledby="road-title">
        <h2 className="section-title" id="road-title">
          {allOpen ? "목차" : "전체 커리큘럼"}{" "}
          <span className="hand">{progress.done.length > 0 ? `96장 중 ${progress.done.length}장 끝냄` : "12 Part, 96장"}</span>
        </h2>
        {CURRICULUM.map((part) => (
          <details key={part.part} open={allOpen ? part.part === (fromPart ?? 0) : part.chapters.some((c) => builtById(c.n))}>
            <summary>
              <span className="p-num">Part {part.part}</span>
              <span className="p-title">{partTitle(part.part)}</span>
              <span className="p-count">{part.chapters.length}장</span>
            </summary>
            <ol>
              {part.chapters.map((c) => (
                <li key={c.n} id={`toc-${c.n}`} data-last={c.n === from || undefined}>
                  <span className="n">{c.n}</span>
                  {builtById(c.n) ? <a href={`#${compId(c.n)}`}>{c.title}</a> : <span>{c.title}</span>}
                  {!allOpen && builtById(c.n) && <span className="open">열림</span>}
                  {c.core && <span className="core">핵심</span>}
                  {progress.done.includes(c.n) && (
                    <span className="done" aria-label="끝냄">
                      ✓
                    </span>
                  )}
                  {c.n === from && <span className="last">방금 본 장</span>}
                </li>
              ))}
            </ol>
          </details>
        ))}
      </section>
    </div>
  );
}
