import type { ChapterSpec } from "../../../data/types";

/** the first layer of chapter 18: two ReLU neurons on spiciness (illustrative example) */
export const FOLD_AT = 3;
export const FOLD_TABLE = [1, 2, 3, 4, 5].map((m) => {
  const h1 = Math.max(0, m - FOLD_AT);
  const h2 = Math.max(0, FOLD_AT - m);
  return { m, h1, h2, d: h1 + h2 };
});

export const ch18: ChapterSpec = {
  id: 18,
  part: 2,
  title: "Stacking layers",
  core: false,
  hook: "A problem one neuron can't solve: can a group of neurons solve it?",
  steps: [
    { id: "s1", sec: 9.5, narration: "How do we make chapter 17's V-shaped boundary? One neuron can only draw a straight line, so we group neurons into a layer." },
    { id: "s2", sec: 10, narration: "The first layer has two neurons. One computes spicy − 3, the other 3 − spicy, and both use ReLU to turn negatives into 0." },
    { id: "s3", sec: 10.5, narration: "Add the two values and you get \"how far from level 3\". Levels 1 and 5 both give 2; levels 2 and 4 both give 1." },
    { id: "s4", sec: 10, narration: "On the plane, it's like folding the paper in half along the level 3 line. The points on the left flip over onto the right." },
    { id: "s5", sec: 9.5, narration: "On the folded paper, the V straightens into a line. Now a single neuron in the next layer splits them with one straight line." },
    { id: "s6", sec: 8.5, narration: "Stack more layers and you can fold again and again. Two folds make a W; many folds make very complex boundaries." },
    { id: "s7", sec: 9, narration: "A network stacked in layers like this is called a multilayer perceptron (MLP). GPT-3 uses 49,152 of these neurons per layer." },
  ],
  playgroundTitle: "The paper-folding network",
  playgroundIntro: "Choose where to fold and push the fold slider. Success is splitting all 13 trucks with one straight line on the folded paper.",
  summary: [
    "Several neurons side by side = a layer. Several layers chained = a multilayer perceptron (MLP).",
    "Two ReLU neurons can \"fold\" the space. Folding turns a V into a straight line.",
    "The deeper the network, the more it can fold, making more complex boundaries.",
  ],
  unlocks: "Stacking layers (MLP)",
  unlockLabel: "You got a new learning tool",
  quiz: [
    {
      q: "When spiciness is 5, what are ReLU(spicy − 3) and ReLU(3 − spicy)?",
      choices: ["2 and 0", "2 and −2", "0 and 2"],
      answer: 0,
      explain: "5 − 3 = 2 is positive, so it stays 2. 3 − 5 = −2 is negative, so ReLU turns it into 0.",
      review: "s2",
    },
    {
      q: "What gets better when the first layer \"folds\" the plane along the level 3 line?",
      choices: ["There are fewer points", "The V becomes a straight line that one neuron can split", "All the hits disappear"],
      answer: 1,
      explain: "On the folded paper, the two arms of the V land on top of each other as one line. The next neuron only has to draw a straight line.",
      review: "s5",
    },
    {
      q: "How many neurons like these are in one layer of GPT-3? (feed-forward, chapter 55)",
      choices: ["12", "About 1,000", "49,152"],
      answer: 2,
      explain: "GPT-3 uses 49,152 neurons per layer, 4 times its 12,288-slot word vectors. And there are 96 such layers.",
      review: "s7",
    },
  ],
  labels: {
    tag: "18. Stacking layers",
    q1: "How to make a V?",
    q2: "one neuron = one line",
    spicy: "spicy",
    line: "line",
    example: "illustrative example",
    layer1: "First layer",
    n1: "spicy−3",
    n2: "3−spicy",
    relu: "ReLU",
    h1: "h1 too hot",
    h2: "h2 too mild",
    sumRow: "h1 + h2",
    far: "distance from level 3",
    fold: "Fold the paper at level 3",
    folded: "Folded: the V is a line!",
    layer2: "one more neuron finishes it",
    farAxis: "distance from level 3",
    once: "1 fold",
    twice: "2 folds",
    many: "many folds",
    deeper: "Deeper = more complex boundaries",
    mlp: "Multilayer perceptron (MLP)",
    input: "input",
    hidden: "layer",
    output: "output",
    gpt: "GPT-3: 49,152 per layer × 96 layers",
    ffn: "See you again in ch. 55, feed-forward",
  },
};
