import { percents } from "../../../data/ch45";
import { ffn } from "../../../data/ch55";
import { UNLOCK6 } from "../../../data/ch54";
import { layerNorm } from "../../../data/ch57";
import { LAST_VEC, LOGITS, REST_N, outputProbs } from "../../../data/ch60";
import type { ChapterSpec } from "../../../data/types";

// The whole forward pass of I walk to → school with toy 4-number vectors (illustrative).
// Every stage is rounded to one decimal before the next, so the sums on screen add up exactly.
const r1 = (v: number) => Math.round(v * 10) / 10;

export const TOKENS = ["I", "walk", "to"];
/** GPT-3's real token numbers (r50k_base) for "I", " walk", " to"; the vectors below are illustrative */
export const IDS = [40, 2513, 284];
export const EMB = [
  [0.8, -0.2, 0.1, 0.4],
  [-0.1, 0.9, 0.2, -0.3],
  [0.2, 0.1, 0.9, 0.6],
];
export const POS = [
  [0.2, 0.1, 0.0, 0.1],
  [0.1, 0.2, 0.1, 0.0],
  [0.0, 0.1, 0.2, 0.1],
];
export const X0 = EMB.map((e, i) => e.map((v, k) => r1(v + POS[i][k])));

/** attention scores; each word only sees itself and the words before it (ch. 51) */
const SCORES = [[0], [0.5, 0.9], [0.6, 0.8, 1.2]];
export const ATT_W = SCORES.map((row) => {
  const ex = row.map(Math.exp);
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / s);
});
export const ATT_PCT = ATT_W.map((w) => percents(w));
const MIX = ATT_W.map((w) => [0, 1, 2, 3].map((k) => w.reduce((a, wj, j) => a + wj * X0[j][k], 0)));
export const D_ATT = MIX.map((m) => m.map((v) => r1(0.5 * v)));
export const X1 = X0.map((x, i) => x.map((v, k) => r1(v + D_ATT[i][k])));
export const D_FFN = X1.map((x) => ffn(layerNorm(x).z).y.map((v) => r1(0.4 * v)));
export const X2 = X1.map((x, i) => x.map((v, k) => r1(v + D_FFN[i][k])));
/** after all 96 layers (illustrative); the last one is the vector ch. 60 scores */
export const FINAL = [[1.3, -0.8, 0.9, 1.6], [-0.5, 2.4, 0.7, 0.4], LAST_VEC];

export const OUT = outputProbs(LOGITS.map((l) => l.s));
export const OUT_PCT = percents([...OUT.p, OUT.restP]);
export { LOGITS, REST_N };

/** The stations of the trip, in order (used by the scene's header and the playground). */
export const STATIONS = [
  { key: "tok", name: "Tokenizer", where: "ch. 29", color: "sky" },
  { key: "emb", name: "Embedding", where: "ch. 33", color: "sky" },
  { key: "pos", name: "Position info", where: "ch. 36", color: "sky" },
  { key: "att", name: "Normalize → attention", where: "ch. 57, 45", color: "yellow" },
  { key: "add", name: "Add to the original", where: "ch. 56", color: "yellow" },
  { key: "ffn", name: "Normalize → feed-forward → add", where: "ch. 55", color: "yellow" },
  { key: "x96", name: "Block × 96 layers", where: "ch. 58", color: "yellow" },
  { key: "out", name: "Output: scoring", where: "ch. 60", color: "mint" },
  { key: "soft", name: "Softmax", where: "ch. 14", color: "mint" },
  { key: "loop", name: "Pick and append", where: "ch. 1, 2", color: "mint" },
] as const;

export const ch61: ChapterSpec = {
  id: 61,
  part: 6,
  title: "Following it from start to finish",
  core: true,
  hook: "While ChatGPT writes a single word, what exactly happens inside?",
  steps: [
    { id: "s1", sec: 8, narration: "Let's feed 'I walk to' into the GPT we've assembled and follow it from start to finish." },
    { id: "s2", sec: 8.5, narration: "First, the tokenizer cuts the text into pieces (tokens). Each piece gets its number in the vocabulary (chapter 29)." },
    { id: "s3", sec: 10, narration: "The embedding fetches a row of meaningful numbers for each number. In GPT-3, one piece is 12,288 numbers (chapter 33)." },
    { id: "s4", sec: 9.5, narration: "Then we add position info that tells which piece comes where (chapter 36). Now 3 vectors head into the block." },
    { id: "s5", sec: 10.5, narration: "Inside the block: normalize, then attention! 'to' looks at 'I', at 'walk', and at itself (chapter 45)." },
    { id: "s6", sec: 9, narration: "What it mixed in is added to the original vector on the highway (chapter 56). See how the numbers shifted a little?" },
    { id: "s7", sec: 9.5, narration: "Normalize again, and feed-forward adds a thought to each word. That result is added to the original vector too (chapter 55)." },
    { id: "s8", sec: 9.5, narration: "That's one layer of the block. Repeat it 96 times, and context piles up in every vector (chapter 58)." },
    { id: "s9", sec: 10, narration: "The 'to' vector from layer 96 scores all 50,257 tokens: school 3.0, the 2.1, work 1.5 (chapter 60)." },
    { id: "s10", sec: 9.5, narration: "Softmax turns them into probabilities: school 52%, the 21%, work 12%. Everything adds up to 100% (chapter 14)." },
    { id: "s11", sec: 9, narration: "Pick one by probability: 'school'! Append it, and the text becomes 'I walk to school' (chapter 1)." },
    { id: "s12", sec: 10, narration: "Then this text goes back in at the top to make the next piece (chapter 2). Every ChatGPT answer comes from this trip." },
  ],
  playgroundTitle: "Follow it step by step",
  playgroundIntro: "Use the 'Next part' button to send 'I walk to' through GPT. At attention, tap a word to see who it looks at.",
  summary: [
    "Tokenizer → embedding + position info → [normalize · attention · add · normalize · feed-forward · add] × 96 → output + softmax → pick and append.",
    "Word vectors gain context with every layer, and the last word's vector decides the next word.",
    "One next piece = one trip. Then the longer text starts again from the top.",
  ],
  unlocks: "The full forward pass",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "In what order does 'I walk to' pass through GPT?",
      choices: [
        "Embedding → tokenizer → block → position info → softmax",
        "Tokenizer → embedding + position info → block × 96 → output + softmax",
        "Block × 96 → tokenizer → softmax → embedding",
      ],
      answer: 1,
      explain: "Cut up the text (tokenizer), turn it into numbers (embedding + position), go through 96 block layers, then turn the scores into probabilities.",
      review: "s1",
    },
    {
      q: "Inside the block, which part lets 'to' look at the words before it?",
      choices: ["Attention", "Feed-forward", "Softmax"],
      answer: 0,
      explain: "Attention looks at the earlier words and mixes in their meaning (ch. 45). Feed-forward thinks about each word on its own.",
      review: "s5",
    },
    {
      q: "After the next word is picked and appended, what happens?",
      choices: ["It just stops", "A person corrects the answer", "The longer text goes back in at the top"],
      answer: 2,
      explain: "The longer text makes the whole trip again to produce the next piece (ch. 2, writing one piece at a time).",
      review: "s12",
    },
  ],
  labels: {
    tag: "61. Following it from start to finish",
    title: "Following it from start to finish",
    sentence: "I walk to",
    q: "?",
    arrow: "→",
    idToy: "Real GPT-3 token numbers for this sentence",
    vocab: "Vocabulary (50,257 tokens)",
    vdots: "⋮",
    table: "Embedding table: 50,257 rows × 12,288 columns",
    lookup: "Pull out that number's row",
    real: "really 12,288 numbers",
    toy: "illustrative example",
    nth: "",
    posNote: "+ which position it's in",
    toBlock: "Into the block!",
    norm: "Normalize",
    looks: "How much 'to' looks at each word",
    mask: "mask (ch. 51)",
    addNote: "Add what it mixed in to the original vector",
    ffn: "Feed-forward",
    ffnNote: "Each word adds its own thought",
    layer: "×",
    same: "The same thing, 96 times",
    lastVec: "'to' after 96 layers",
    compare: "Compare with every token (ch.\u00a09)",
    rest: "the rest",
    restN: "50,253",
    restScore: "≈ −9.1",
    pt: "",
    total: "total = 100%",
    pick: "Pick!",
    again: "back to the top",
    oneWord: "One word = one trip",
    all: "All 175 billion numbers take part in the math",
    w4: "school",
  },
};
