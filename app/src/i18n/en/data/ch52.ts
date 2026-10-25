import type { ChapterSpec, Highlighter } from "../../../data/types";

/**
 * illustrative example: three made-up heads on "I walk to school" (with the causal mask, ch. 51).
 * en: the second head ('what?') looks for the action ('walk') where the Korean one looked for the time word.
 * Each map is in percent, row = the word looking, column = the word looked at; every row adds up to 100.
 */
export const HEADS52: { name: string; ask: string; target: number; c: Highlighter; map: number[][] }[] = [
  {
    name: "Head 1",
    ask: "who?",
    target: 0,
    c: "pink",
    map: [
      [100, 0, 0, 0],
      [85, 15, 0, 0],
      [80, 8, 12, 0],
      [75, 5, 10, 10],
    ],
  },
  {
    name: "Head 2",
    ask: "what?",
    target: 1,
    c: "violet",
    map: [
      [100, 0, 0, 0],
      [20, 80, 0, 0],
      [10, 75, 15, 0],
      [8, 70, 12, 10],
    ],
  },
  {
    name: "Head 3",
    ask: "where?",
    target: 2,
    c: "orange",
    map: [
      [100, 0, 0, 0],
      [50, 50, 0, 0],
      [15, 10, 75, 0],
      [7, 5, 80, 8],
    ],
  },
];

export const ch52: ChapterSpec = {
  id: 52,
  part: 5,
  title: "Looking with many eyes",
  core: false,
  hook: "'school' wants to know who's coming and how. Is one look enough for all of that?",
  steps: [
    { id: "s1", sec: 8.5, narration: "One sentence holds several kinds of relationships: who's doing it, what they're doing, and where they're headed." },
    { id: "s2", sec: 10, narration: "But one round of attention sets just one set of shares. So we make several sets of Q, K and V. Each set is called a head." },
    { id: "s3", sec: 9, narration: "Say head 1 looks for 'who', head 2 for 'what', and head 3 for 'where'. The same 'school' looks in different places." },
    { id: "s4", sec: 9.5, narration: "The heads don't wait for each other: they compute at the same time, separately. Each one hands out its own new vector for 'school'." },
    { id: "s5", sec: 9, narration: "The results are joined side by side and mixed into one with one more matrix. What many eyes saw ends up in one vector." },
    { id: "s6", sec: 9, narration: "GPT-3 has 96 heads in every layer, each 128 entries long. 96 × 128 = 12,288, exactly the size of a word vector." },
    { id: "s7", sec: 9, narration: "Nobody decides what each head looks at. The jobs split up on their own during training. In chapter 53 we look at real heads." },
  ],
  playgroundTitle: "Head detective",
  playgroundIntro: "Look at an attention map and guess what this head is looking for. The darker the cell, the more it looks.",
  summary: [
    "One set of Q, K, V = one head. Each head looks at a different kind of relationship.",
    "The heads compute at the same time; their results are joined and mixed once more with a matrix.",
    "GPT-3: 96 heads per layer × 128 entries = 12,288. The jobs split up on their own during training.",
  ],
  unlocks: "Multi-head attention",
  unlockLabel: "You cracked one of attention's secrets",
  quiz: [
    {
      q: "What's the main reason for using several heads?",
      choices: ["To look at several kinds of relationships at the same time", "To cut down the calculation", "To add more words"],
      answer: 0,
      explain: "One head sets only one set of shares. Several heads each look at a different relationship.",
      review: "s2",
    },
    {
      q: "How many heads does one layer of GPT-3 have?",
      choices: ["12", "96", "128"],
      answer: 1,
      explain: "96. Each head is 128 entries, so 96 × 128 = 12,288.",
      review: "s6",
    },
    {
      q: "How is it decided what each head looks at?",
      choices: ["People set rules", "The jobs split up on their own during training", "By word order"],
      answer: 1,
      explain: "The matrices that make Q, K and V are learned, so the jobs are learned too (ch. 46).",
      review: "s7",
    },
  ],
  labels: {
    tag: "52. Looking with many eyes",
    // symbols drawn directly in the scene, listed so their font slices load
    glyphs: "·",
    many: "one sentence, many relationships",
    wants: "'school' wants to know all three",
    who: "who?",
    when: "what?",
    where: "where?",
    oneHead: "one attention = one row of shares",
    oneWay: "only one way of looking",
    sets: "several sets of Q, K, V",
    head: "head",
    headEn: "head",
    differ: "same 'school', different eyes",
    parallel: "at the same time, separately",
    result: "result",
    concat: "join",
    mixM: "× matrix",
    final: "new 'school'",
    gather: "what many eyes saw, in one vector",
    gpt3: "one GPT-3 layer",
    heads96: "96 heads",
    dim128: "one head = 128 entries",
    product: "96 × 128 = 12,288",
    tokenVec: "= word vector size (ch. 33)",
    learned: "the jobs are learned on their own",
    next: "Next: ch. 53, peeking inside a real GPT",
    ex: "illustrative example",
    q: "Q",
    k: "K",
    v: "V",
    w0: "I",
    w1: "walk",
    w2: "to",
    w3: "school",
  },
};
