import { Player, type CallbackListener, type PlayerRef } from "@remotion/player";
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { FPS, H, W, buildTimeline } from "../scenes/kit";
import type { BuiltChapter } from "../scenes/registry";
import { NARRATION_AUDIO } from "./narrationAudio";

export type ScenePlayerHandle = { playStep: (id: string) => void };
type Mode = "step" | "video";

const INPUT = { captions: false, audio: NARRATION_AUDIO };
// no clips are bundled right now (the macOS voice was too choppy), so the sound toggle stays hidden
const HAS_AUDIO = Object.keys(NARRATION_AUDIO).length > 0;

export const ScenePlayer = forwardRef<ScenePlayerHandle, { built: BuiltChapter }>(({ built }, ref) => {
  const tl = useMemo(() => buildTimeline(built.spec), [built]);
  const total = tl[tl.length - 1].to;
  const player = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(tl[0].to - 1);
  const [playing, setPlaying] = useState(false);
  const [mode, setModeState] = useState<Mode>("step");
  const [muted, setMuted] = useState(false);
  const modeRef = useRef<Mode>("step");
  const stopAt = useRef<number | null>(null);

  const cur = Math.max(0, tl.findIndex((s) => frame >= s.from && frame < s.to));
  const curIndex = frame >= total - 1 ? tl.length - 1 : cur;

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const onFrame: CallbackListener<"frameupdate"> = (e) => {
      const f = e.detail.frame;
      setFrame(f);
      if (stopAt.current !== null && f >= stopAt.current) {
        const target = stopAt.current;
        stopAt.current = null;
        p.pause();
        p.seekTo(target);
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    p.addEventListener("frameupdate", onFrame);
    p.addEventListener("play", onPlay);
    p.addEventListener("pause", onPause);
    p.addEventListener("ended", onPause);
    return () => {
      p.removeEventListener("frameupdate", onFrame);
      p.removeEventListener("play", onPlay);
      p.removeEventListener("pause", onPause);
      p.removeEventListener("ended", onPause);
    };
  }, []);

  const playStep = useCallback(
    (i: number) => {
      const p = player.current;
      if (!p) return;
      const s = tl[Math.min(Math.max(i, 0), tl.length - 1)];
      stopAt.current = modeRef.current === "step" ? s.to - 1 : null;
      p.seekTo(s.from);
      p.play();
    },
    [tl],
  );

  useImperativeHandle(ref, () => ({
    playStep: (id: string) => playStep(Math.max(0, tl.findIndex((s) => s.id === id))),
  }));

  const toggle = () => {
    const p = player.current;
    if (!p) return;
    if (playing) {
      stopAt.current = null;
      p.pause();
      return;
    }
    const step = tl[curIndex];
    const atStepEnd = frame >= step.to - 2;
    if (modeRef.current === "step") {
      if (atStepEnd) playStep(curIndex === tl.length - 1 ? 0 : curIndex + 1);
      else {
        stopAt.current = step.to - 1;
        p.play();
      }
    } else {
      if (frame >= total - 1) p.seekTo(0);
      p.play();
    }
  };

  const setMode = (m: Mode) => {
    modeRef.current = m;
    setModeState(m);
    stopAt.current = m === "step" && playing ? tl[curIndex].to - 1 : null;
  };

  const step = tl[curIndex];
  const stepDone = !playing && frame >= step.to - 2;
  const label = playing ? "일시정지" : mode === "step" && stepDone ? (curIndex === tl.length - 1 ? "처음부터" : "다음 장면") : "재생";

  return (
    <div>
      <div className="sheet stage-canvas" onClick={toggle}>
        <Player
          ref={player}
          component={built.Scene}
          inputProps={INPUT}
          durationInFrames={total}
          fps={FPS}
          compositionWidth={W}
          compositionHeight={H}
          initialFrame={tl[0].to - 1}
          style={{ width: "100%" }}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          acknowledgeRemotionLicense
        />
      </div>

      <div className="controls">
        <button className="icon-btn" onClick={() => playStep(curIndex - 1)} disabled={curIndex === 0} aria-label="이전 장면">
          <ChevronLeft size={22} />
        </button>
        <button className="icon-btn primary" onClick={toggle} aria-label={label} title={label}>
          {playing ? <Pause size={22} /> : mode === "step" && stepDone ? <ChevronRight size={24} /> : <Play size={22} />}
        </button>
        <button className="icon-btn" onClick={() => playStep(curIndex + 1)} disabled={curIndex === tl.length - 1} aria-label="다음 장면">
          <ChevronRight size={22} />
        </button>
        {HAS_AUDIO && (
          <button
            className="icon-btn"
            onClick={() => {
              const p = player.current;
              if (!p) return;
              if (muted) p.unmute();
              else p.mute();
              setMuted(!muted);
            }}
            aria-label={muted ? "소리 켜기" : "소리 끄기"}
            aria-pressed={!muted}
            title={muted ? "소리 켜기" : "소리 끄기"}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        )}
        <span className="spacer" />
        <div className="seg" role="group" aria-label="보기 방식">
          <button aria-pressed={mode === "step"} onClick={() => setMode("step")}>
            한 장면씩
          </button>
          <button aria-pressed={mode === "video"} onClick={() => setMode("video")}>
            이어서 보기
          </button>
        </div>
      </div>

      <div className="dots" role="group" aria-label="장면 목록">
        {tl.map((s, i) => (
          <button
            key={s.id}
            data-state={i < curIndex ? "done" : i === curIndex ? "now" : "todo"}
            onClick={() => playStep(i)}
            aria-label={`${i + 1}번째 장면`}
            aria-current={i === curIndex ? "step" : undefined}
          >
            <span />
          </button>
        ))}
      </div>
      <p className="caption" aria-live="polite">
        <span className="k">
          {curIndex + 1} / {tl.length}
        </span>
        {step.narration}
      </p>
    </div>
  );
});
