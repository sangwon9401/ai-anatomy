import type { ChapterSpec, Highlighter } from "../../../data/types";

export const SOURCES = ["News", "Wikis", "Blogs", "Books", "Code", "Forums"];

export type Kind = "ok" | "dup" | "quality" | "harm";

/** Illustrative mix of 100 collected units (labelled illustrative in the scene); real ratios differ by dataset. */
export const MIX: { kind: Kind; n: number; c: Highlighter }[] = [
  { kind: "dup", n: 40, c: "violet" },
  { kind: "quality", n: 30, c: "orange" },
  { kind: "harm", n: 5, c: "pink" },
  { kind: "ok", n: 25, c: "sky" },
];

/** "−40", "−30", "−5": what each filter removes (drawn on the bins). */
export const BIN_CUTS = MIX.slice(0, 3).map((m) => `−${m.n}`);

export type FactoryDoc = { text: string; kind: Kind; why: string };

/** Playground: snippets the student sorts before the filters check them. */
export const FACTORY_DOCS: FactoryDoc[] = [
  { text: "Photosynthesis is how plants use light energy to make their food.", kind: "ok", why: "An encyclopedia text with something to learn" },
  { text: "★★MEGA SALE★★ Click now! Click! Get your free coupon", kind: "quality", why: "An ad: nothing to learn" },
  { text: "School lunch today was chili. It was so good I went back for seconds.", kind: "ok", why: "Ordinary everyday writing is a good textbook too" },
  { text: "Photosynthesis is how plants use light energy to make their food.", kind: "dup", why: "An exact copy of text 1" },
  { text: "hahahahahahahahahahahahahahaha", kind: "quality", why: "A meaningless string of letters" },
  { text: "for (let i = 0; i < 10; i++) { sum += i; }", kind: "ok", why: "Code is something to learn too" },
  { text: "Posting my classmate's phone number here: (555) XXX-XXXX", kind: "harm", why: "Text with someone's personal information" },
  { text: "The Declaration of Independence was adopted in 1776.", kind: "ok", why: "Text with history knowledge" },
  { text: "you @#$% idiot, this is @#$% garbage", kind: "harm", why: "Insults and swearing" },
  { text: "School lunch today was chili. It was so good I went back for seconds.", kind: "dup", why: "An exact copy of text 3" },
];

export const KIND_NAME: Record<Kind, string> = { ok: "Keep", dup: "Copies", quality: "Low quality", harm: "Harmful" };

export const ch63: ChapterSpec = {
  id: 63,
  part: 7,
  title: "The internet is the textbook",
  core: false,
  hook: "What books did ChatGPT actually study?",
  steps: [
    { id: "s1", sec: 10, narration: "ChatGPT's textbook is the internet. News, encyclopedias, blogs, books, even code: a huge pile of text written by people." },
    { id: "s2", sec: 10, narration: "But you can't use it as is. The same text is copied countless times, and ads, broken text and nasty words are mixed in." },
    { id: "s3", sec: 9, narration: "So it goes through a text factory. Step one: remove duplicates. Of texts that are the same or nearly the same, keep just one." },
    { id: "s4", sec: 9, narration: "Step two: the quality filter. It sifts out text with nothing to learn, like ads, random letters, or the same words repeated." },
    { id: "s5", sec: 9, narration: "Step three: the harmful content filter. Out go insults, dangerous content, and personal info like phone numbers." },
    { id: "s6", sec: 8, narration: "As an illustrative example: collect 100, and only 25 are left. Real ratios differ from dataset to dataset." },
    { id: "s7", sec: 11, narration: "GPT-3 studied about 300 billion tokens of text chosen this way. As we saw in chapter 4, good data makes a good model." },
  ],
  playgroundTitle: "Text factory inspector",
  playgroundIntro: "For each text, first decide whether to keep it or toss it. When you've done them all, the factory's three filters show the answers.",
  summary: [
    "ChatGPT's textbook = the internet's huge amount of text (news, encyclopedias, books, code…).",
    "It isn't used as is: remove duplicates → quality filter → harmful content filter.",
    "Filtering shrinks the pile, but good data makes a good model.",
  ],
  unlocks: "Data cleaning",
  unlockLabel: "You picked up one more learning tool",
  quiz: [
    {
      q: "If the same text has been copied 1,000 times, what do you do?",
      choices: ["Keep just one and delete the rest", "Study all 1,000 copies", "Delete every copy"],
      answer: 0,
      explain: "Seeing the same text again and again makes it easy to memorize it word for word. Keeping just one is called removing duplicates.",
      review: "s3",
    },
    {
      q: "Which text would the quality filter remove?",
      choices: ["An encyclopedia article explaining photosynthesis", "A post full of nothing but 'hahahaha'", "A blog post reviewing the school lunch"],
      answer: 1,
      explain: "A meaningless string of letters has nothing to teach. Ordinary everyday writing makes a good textbook.",
      review: "s4",
    },
    {
      q: "After all the filters, how much text is left?",
      choices: ["The same amount", "More than before", "Quite a bit less"],
      answer: 2,
      explain: "Lots of text drops out at the duplicate, quality and harm filters. There's less of it, but it makes a much better textbook.",
      review: "s6",
    },
  ],
  labels: {
    tag: "63. The internet is the textbook",
    collected: "Collected text (1 box = 1%)",
    people: "Tons of text\nwritten by people",
    dup: "Copies",
    dupX: "×1000",
    junk: "Ads · broken text",
    bad: "Insults · phone #s",
    good: "Worth learning",
    mixed: "Can't use it as a textbook like this",
    f1: "① Remove copies",
    f2: "② Quality filter",
    f3: "③ Harm filter",
    bin1: "Copies",
    bin2: "Quality",
    bin3: "Harmful",
    sameText: "Sunny today",
    keepOne: "Keep just one",
    junk1: "hahahahahahaha",
    junk2: "★SALE★ Click!",
    noLearn: "Nothing to learn",
    harm1: "@#$% insults",
    harm2: "555-XXX-XXXX",
    harmNote: "No dangerous stuff",
    ratio: "100 → 25",
    example: "Illustrative ratio",
    differs: "Real ratios differ\nby dataset",
    book: "A clean textbook",
    gpt3: "What GPT-3 studied",
    tokens: "about 300 billion tokens",
    goodData: "Good data → good model",
    next: "Ch. 64: how do you study from it?",
  },
};
