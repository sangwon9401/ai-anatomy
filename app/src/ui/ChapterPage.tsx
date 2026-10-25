import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { ORDER_ITEMS } from "../data/ch03";
import { PIPELINE } from "../data/ch05";
import { TOTAL_CHAPTERS, partTitle } from "../data/curriculum";
import { ContextBuilder } from "../playgrounds/ContextBuilder";
import { DotDial } from "../playgrounds/DotDial";
import { FunctionFit } from "../playgrounds/FunctionFit";
import { GradeMatrix } from "../playgrounds/GradeMatrix";
import { MatrixWarp } from "../playgrounds/MatrixWarp";
import { NearestFriend } from "../playgrounds/NearestFriend";
import { NextWordGame } from "../playgrounds/NextWordGame";
import { NormalizeLab } from "../playgrounds/NormalizeLab";
import { OrderGame, type OrderItem } from "../playgrounds/OrderGame";
import { PixelPad } from "../playgrounds/PixelPad";
import { SamplingLab } from "../playgrounds/SamplingLab";
import { SoftmaxLab } from "../playgrounds/SoftmaxLab";
import { SpamDuel } from "../playgrounds/SpamDuel";
import { StoryBuilder } from "../playgrounds/StoryBuilder";
import { TasteArrow } from "../playgrounds/TasteArrow";
import { PART2_PLAYGROUNDS } from "../playgrounds/part2";
import { PART3_PLAYGROUNDS } from "../playgrounds/part3";
import { PART4_PLAYGROUNDS } from "../playgrounds/part4";
import { PART5_PLAYGROUNDS } from "../playgrounds/part5";
import { PART6_PLAYGROUNDS } from "../playgrounds/part6";
import { PART7_PLAYGROUNDS } from "../playgrounds/part7";
import { PART8_PLAYGROUNDS } from "../playgrounds/part8";
import { PART9_PLAYGROUNDS } from "../playgrounds/part9";
import { PART10_PLAYGROUNDS } from "../playgrounds/part10";
import { PART11_PLAYGROUNDS } from "../playgrounds/part11";
import { BUILT, compId, type BuiltChapter } from "../scenes/registry";
import { SITE_NAME, chapterUrl } from "../site";
import { markDone, markSeen } from "./progress";
import { shareLink, type ShareResult } from "./share";
import { T } from "./strings";
import { Quiz } from "./Quiz";
import { ScenePlayer, type ScenePlayerHandle } from "./ScenePlayer";

const TIMELINE: OrderItem[] = ORDER_ITEMS.map((i) => ({ key: i.key, label: i.label, meta: i.year }));
const BLUEPRINT: OrderItem[] = PIPELINE.map((p) => ({ key: p.key, label: T.pair(p.name, p.does), meta: p.where }));

const TimelineOrder: FC = () => <OrderGame items={TIMELINE} wrongHint={T.timelineWrong} doneText={T.timelineDone} />;
const BlueprintOrder: FC = () => (
  <OrderGame items={BLUEPRINT} wrongHint={T.blueprintWrong} doneText={T.blueprintDone} />
);

const PLAYGROUNDS: Record<number, FC> = {
  1: NextWordGame,
  2: StoryBuilder,
  3: TimelineOrder,
  4: SpamDuel,
  5: BlueprintOrder,
  6: PixelPad,
  7: TasteArrow,
  8: NearestFriend,
  9: DotDial,
  10: GradeMatrix,
  11: MatrixWarp,
  12: FunctionFit,
  13: SamplingLab,
  14: SoftmaxLab,
  15: NormalizeLab,
  45: ContextBuilder,
  ...PART2_PLAYGROUNDS,
  ...PART3_PLAYGROUNDS,
  ...PART4_PLAYGROUNDS,
  ...PART5_PLAYGROUNDS,
  ...PART6_PLAYGROUNDS,
  ...PART7_PLAYGROUNDS,
  ...PART8_PLAYGROUNDS,
  ...PART9_PLAYGROUNDS,
  ...PART10_PLAYGROUNDS,
  ...PART11_PLAYGROUNDS,
};

const ChapterLink: FC<{ to?: BuiltChapter; label: string; children: ReactNode }> = ({ to, label, children }) =>
  to ? (
    <a className="icon-btn" href={`#${compId(to.spec.id)}`} aria-label={`${label}: ${T.chTitle(to.spec.id, to.spec.title)}`}>
      {children}
    </a>
  ) : (
    <span className="icon-btn" aria-hidden="true" data-off="true">
      {children}
    </span>
  );

export function ChapterPage({ built }: { built: BuiltChapter }) {
  const { spec } = built;
  const player = useRef<ScenePlayerHandle>(null);
  const Playground = PLAYGROUNDS[spec.id];
  const idx = BUILT.indexOf(built);
  const prev = BUILT[idx - 1];
  const next = BUILT[idx + 1];
  useEffect(() => markSeen(spec.id), [spec.id]);
  const finish = useCallback(() => markDone(spec.id), [spec.id]);
  const [shared, setShared] = useState<ShareResult | null>(null);
  const share = async () => {
    const result = await shareLink({ title: `${T.chTitle(spec.id, spec.title)} · ${SITE_NAME}`, text: spec.hook, url: chapterUrl(spec.id) });
    setShared(result);
  };

  const review = (target: string) => {
    if (target === "playground") {
      document.getElementById("play")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!window.matchMedia("(min-width: 960px)").matches) {
      document.getElementById("stage")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    player.current?.playStep(target);
  };

  return (
    <div className="wrap">
      <nav className="ch-top" aria-label={T.chapterNav}>
        <a href="#">
          <ChevronLeft size={18} /> {T.toc}
        </a>
        <span className="spacer" />
        <ChapterLink to={prev} label={T.prev}>
          <ChevronLeft size={20} />
        </ChapterLink>
        <span className="ch-pos">
          {spec.id} / {TOTAL_CHAPTERS}
        </span>
        <ChapterLink to={next} label={T.next}>
          <ChevronRight size={20} />
        </ChapterLink>
        <button className="icon-btn" onClick={share} aria-label={T.share}>
          <Share2 size={18} />
        </button>
      </nav>
      {shared === "copied" && <p className="share-note">{T.shareCopied}</p>}
      {shared === "failed" && <p className="share-note">{T.shareFailed}</p>}
      <header className="ch-head">
        <div className="ch-meta">
          <span className="ch-num">{T.ch(spec.id)}</span>
          <span>
            Part {spec.part} {partTitle(spec.part)}
          </span>
          {spec.core && <span className="badge">{T.coreCourse}</span>}
        </div>
        <h1>{spec.title}</h1>
        <p className="hook">
          <b>Q.</b>
          {spec.hook}
        </p>
      </header>

      <div className="ch-grid">
        <section className="stage" id="stage" aria-label={T.animation}>
          <ScenePlayer ref={player} built={built} />
        </section>

        <div className="flow">
          <section id="play" aria-labelledby="play-title">
            <h2 className="section-title" id="play-title">
              {T.playground} <span className="hand">{spec.playgroundTitle}</span>
            </h2>
            <div className="play-box">
              <p className="play-intro">{spec.playgroundIntro}</p>
              <Playground />
            </div>
          </section>

          <section aria-labelledby="sum-title">
            <h2 className="section-title" id="sum-title">
              {T.summary}
            </h2>
            <div className="summary-note">
              <ul>
                {spec.summary.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="unlock">
              {spec.unlockLabel ?? T.unlockDefault} <span className="chip hl-mint">{spec.unlocks}</span>
            </div>
          </section>

          <section aria-labelledby="quiz-title">
            <h2 className="section-title" id="quiz-title">
              {T.quiz} <span className="hand">{T.questions(spec.quiz.length)}</span>
            </h2>
            <Quiz items={spec.quiz} onReview={review} onComplete={finish} />
          </section>

          <nav className="next-nav" aria-label={T.nextChapter}>
            {next && (
              <a className="next-card" href={`#${compId(next.spec.id)}`}>
                <span className="next-label">{T.nextChapter}</span>
                <span className="next-title">
                  {T.chTitle(next.spec.id, next.spec.title)}
                </span>
                <span className="next-hook">{next.spec.hook}</span>
                <ChevronRight className="next-arrow" size={24} />
              </a>
            )}
            <div className="next-row">
              {prev && (
                <a className="btn ghost" href={`#${compId(prev.spec.id)}`}>
                  <ChevronLeft size={16} /> {T.chTitle(prev.spec.id, prev.spec.title)}
                </a>
              )}
              <button className="btn ghost" onClick={share}>
                <Share2 size={16} /> {T.share}
              </button>
              <a className="btn ghost" href="#">
                {T.toToc}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
