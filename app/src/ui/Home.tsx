import { useEffect, useMemo } from "react";
import { CURRICULUM, TOTAL_CHAPTERS, partTitle } from "../data/curriculum";
import { BUILT, builtById, compId } from "../scenes/registry";
import { Capacitor } from "@capacitor/core";
import { LOCALE } from "../locale";
import { PUBLISHED, SITE_NAME } from "../site";
import { GithubStarButton } from "./GithubLink";
import { loadProgress } from "./progress";
import { T } from "./strings";

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
          {SITE_NAME}
          <small>{T.tagline}</small>
        </div>
        <span className="home-actions">
          <GithubStarButton />
          <span className="badge">{T.badge}</span>
        </span>
      </header>
      {PUBLISHED.length > 1 && !Capacitor.isNativePlatform() && (
        <nav className="langs" aria-label={T.languages}>
          {PUBLISHED.map((l) => (
            <a key={l.code} href={l.url} hrefLang={l.code} aria-current={l.code === LOCALE ? "page" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
      )}

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-sentence" aria-label={T.heroAria}>
          {T.heroWords.map((w) => (
            <span className="chip outline" key={w}>
              {w}
            </span>
          ))}
          <span className="hero-blank">?</span>
        </div>
        <div className="hero-bars">
          {T.heroBars.map((b, i) => (
            <div className="hero-bar" key={b.w}>
              <span>{b.w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${b.p}%`, background: `var(--hl-${b.c})`, animationDelay: `${200 + i * 140}ms` }} />
              </span>
              <span className="num">{b.p}%</span>
            </div>
          ))}
        </div>
        <h1 id="hero-title">{T.heroTitle}</h1>
        <p>{T.heroText}</p>
        <div className="actions">
          {resume ? (
            <>
              <a className="btn" href={`#${compId(resume.spec.id)}`}>
                {T.resume(resume.spec.id, resume.spec.title)}
              </a>
              <a className="btn ghost" href={`#${compId(1)}`}>
                {T.fromStart}
              </a>
            </>
          ) : (
            <a className="btn" href={`#${compId(1)}`}>
              {T.startFirst}
            </a>
          )}
        </div>
      </section>

      {!allOpen && (
        <section className="open-list" aria-labelledby="open-title">
          <h2 className="section-title" id="open-title">
            {T.openList} <span className="hand">{T.openCount(BUILT.length, TOTAL_CHAPTERS)}</span>
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
          {allOpen ? T.toc : T.curriculum}{" "}
          <span className="hand">{progress.done.length > 0 ? T.doneCount(progress.done.length, TOTAL_CHAPTERS) : T.tocCount(CURRICULUM.length, TOTAL_CHAPTERS)}</span>
        </h2>
        {CURRICULUM.map((part) => (
          <details key={part.part} open={allOpen ? part.part === (fromPart ?? 0) : part.chapters.some((c) => builtById(c.n))}>
            <summary>
              <span className="p-num">Part {part.part}</span>
              <span className="p-title">{partTitle(part.part)}</span>
              <span className="p-count">{T.chapterCount(part.chapters.length)}</span>
            </summary>
            <ol>
              {part.chapters.map((c) => (
                <li key={c.n} id={`toc-${c.n}`} data-last={c.n === from || undefined}>
                  <span className="n">{c.n}</span>
                  {builtById(c.n) ? <a href={`#${compId(c.n)}`}>{c.title}</a> : <span>{c.title}</span>}
                  {!allOpen && builtById(c.n) && <span className="open">{T.open}</span>}
                  {c.core && <span className="core">{T.core}</span>}
                  {progress.done.includes(c.n) && (
                    <span className="done" aria-label={T.done}>
                      ✓
                    </span>
                  )}
                  {c.n === from && <span className="last">{T.last}</span>}
                </li>
              ))}
            </ol>
          </details>
        ))}
      </section>
    </div>
  );
}
