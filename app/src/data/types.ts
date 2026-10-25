export type Step = {
  id: string;
  sec: number;
  narration: string;
  /** what the voice-over should say, when it differs from the caption */
  tts?: string;
};

export type QuizItem = {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  /** step id to replay, or "playground" to scroll to the hands-on section */
  review: string;
};

export type ChapterSpec = {
  id: number;
  part: number;
  title: string;
  core: boolean;
  hook: string;
  steps: Step[];
  playgroundTitle: string;
  playgroundIntro: string;
  summary: string[];
  unlocks: string;
  /** shown before the `unlocks` chip; defaults to the blueprint wording */
  unlockLabel?: string;
  quiz: QuizItem[];
  /** every string drawn inside the scene, so the video renderer can preload the right font slices */
  labels: Record<string, string>;
};

export type Highlighter = "yellow" | "mint" | "sky" | "pink" | "orange" | "violet";
