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
import { Quiz } from "./Quiz";
import { ScenePlayer, type ScenePlayerHandle } from "./ScenePlayer";

const TIMELINE: OrderItem[] = ORDER_ITEMS.map((i) => ({ key: i.key, label: i.label, meta: i.year }));
const BLUEPRINT: OrderItem[] = PIPELINE.map((p) => ({ key: p.key, label: `${p.name}: ${p.does}`, meta: p.where }));

const TimelineOrder: FC = () => <OrderGame items={TIMELINE} wrongHint="그보다 먼저 일어난 일이 있어요." doneText="연표 완성!" />;
const BlueprintOrder: FC = () => (
  <OrderGame items={BLUEPRINT} wrongHint="글이 그 부품에 닿기 전에 먼저 지나는 부품이 있어요." doneText="설계도 완성!" />
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
    <a className="icon-btn" href={`#${compId(to.spec.id)}`} aria-label={`${label}: ${to.spec.id}장 ${to.spec.title}`}>
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
    const result = await shareLink({ title: `${spec.id}장 ${spec.title} · ${SITE_NAME}`, text: spec.hook, url: chapterUrl(spec.id) });
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
      <nav className="ch-top" aria-label="장 이동">
        <a href="#">
          <ChevronLeft size={18} /> 목차
        </a>
        <span className="spacer" />
        <ChapterLink to={prev} label="이전">
          <ChevronLeft size={20} />
        </ChapterLink>
        <span className="ch-pos">
          {spec.id} / {TOTAL_CHAPTERS}
        </span>
        <ChapterLink to={next} label="다음">
          <ChevronRight size={20} />
        </ChapterLink>
        <button className="icon-btn" onClick={share} aria-label="이 장 공유하기">
          <Share2 size={18} />
        </button>
      </nav>
      {shared === "copied" && <p className="share-note">링크를 복사했어요. 친구에게 붙여 넣어 보내세요.</p>}
      {shared === "failed" && <p className="share-note">공유하지 못했어요. 주소창의 링크를 복사해 보내 주세요.</p>}
      <header className="ch-head">
        <div className="ch-meta">
          <span className="ch-num">{spec.id}장</span>
          <span>
            Part {spec.part} {partTitle(spec.part)}
          </span>
          {spec.core && <span className="badge">핵심 코스</span>}
        </div>
        <h1>{spec.title}</h1>
        <p className="hook">
          <b>Q.</b>
          {spec.hook}
        </p>
      </header>

      <div className="ch-grid">
        <section className="stage" id="stage" aria-label="애니메이션">
          <ScenePlayer ref={player} built={built} />
        </section>

        <div className="flow">
          <section id="play" aria-labelledby="play-title">
            <h2 className="section-title" id="play-title">
              직접 해보기 <span className="hand">{spec.playgroundTitle}</span>
            </h2>
            <div className="play-box">
              <p className="play-intro">{spec.playgroundIntro}</p>
              <Playground />
            </div>
          </section>

          <section aria-labelledby="sum-title">
            <h2 className="section-title" id="sum-title">
              한 장 요약
            </h2>
            <div className="summary-note">
              <ul>
                {spec.summary.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="unlock">
              {spec.unlockLabel ?? "설계도에 부품이 하나 채워졌어요"} <span className="chip hl-mint">{spec.unlocks}</span>
            </div>
          </section>

          <section aria-labelledby="quiz-title">
            <h2 className="section-title" id="quiz-title">
              확인 퀴즈 <span className="hand">{spec.quiz.length}문제</span>
            </h2>
            <Quiz items={spec.quiz} onReview={review} onComplete={finish} />
          </section>

          <nav className="next-nav" aria-label="다음 장">
            {next && (
              <a className="next-card" href={`#${compId(next.spec.id)}`}>
                <span className="next-label">다음 장</span>
                <span className="next-title">
                  {next.spec.id}장 {next.spec.title}
                </span>
                <span className="next-hook">{next.spec.hook}</span>
                <ChevronRight className="next-arrow" size={24} />
              </a>
            )}
            <div className="next-row">
              {prev && (
                <a className="btn ghost" href={`#${compId(prev.spec.id)}`}>
                  <ChevronLeft size={16} /> {prev.spec.id}장 {prev.spec.title}
                </a>
              )}
              <button className="btn ghost" onClick={share}>
                <Share2 size={16} /> 이 장 공유하기
              </button>
              <a className="btn ghost" href="#">
                목차로
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
