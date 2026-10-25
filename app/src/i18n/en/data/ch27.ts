import { DATASETS, accOf, boundary, run } from "../../../data/part2-boss";
import type { ChapterSpec } from "../../../data/types";

/** the scene's run: taco truck map, 8 hidden neurons, learning rate 0.1, minibatches of 10, 300 epochs (seed chosen so the story reads cleanly) */
export const BOSS_DS = DATASETS[0];
export const BOSS = { hidden: 8, lr: 0.1, batch: 10, epochs: 300, seed: 21 };
/** dense snapshots so the scene can show the boundary, epoch and accuracy of the same moment */
export const SNAP_EPOCHS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 13, 16, 20, 25, 30, 40, 50, 60, 80, 100, 130, 160, 200, 250, 300];
export const BOSS_RUN = run(BOSS_DS, BOSS.hidden, BOSS.lr, BOSS.batch, BOSS.epochs, SNAP_EPOCHS, BOSS.seed);
export const SNAPS = BOSS_RUN.snaps.map((s) => ({ epoch: s.epoch, acc: accOf(s.net, BOSS_DS, BOSS_DS.train), segs: boundary(s.net, BOSS_DS) }));
export const FINAL_VAL = accOf(BOSS_RUN.net, BOSS_DS, BOSS_DS.val);
export const KNOBS = BOSS.hidden * 2 + BOSS.hidden + BOSS.hidden + 1;

export const TOOLS2 = ["Neuron", "Activation functions", "Stacking layers", "Forward pass", "Loss", "Gradient descent", "Learning rate", "Backpropagation", "Minibatch · epoch", "Preventing overfitting", "Handwriting reader"];

export const ch27: ChapterSpec = {
  id: 27,
  part: 2,
  title: "Part 2 boss battle",
  core: false,
  hook: "Put together everything so far: can we train a neural network from scratch?",
  steps: [
    { id: "s1", sec: 9.5, narration: "It's the Part 2 boss battle! Chapter 17's truck map now has 60 trucks. This time, the network finds the boundary by itself." },
    { id: "s2", sec: 9.5, narration: "2 inputs → 8 ReLU neurons → 1 output (chapter 18). Its 33 knobs start out random. A score over 0.5 means a hit." },
    { id: "s3", sec: 9, narration: "Run the training loop: forward pass, loss, backpropagation to share the blame, and gradient descent to fix (chapters 19–23)." },
    { id: "s4", sec: 10, narration: "Minibatches of 10, for 300 epochs (chapter 24). As the loss drops, the boundary grows into a V, and accuracy goes from 23% to 100%." },
    { id: "s5", sec: 9, narration: "We check with 30 new trucks set aside (chapter 25). All 30 are right: it didn't memorize; it learned the V-shaped rule." },
    { id: "s6", sec: 9, narration: "GPT learns exactly the same way, only with 175 billion knobs instead of 33, and 300 billion tokens instead of 60 trucks." },
    { id: "s7", sec: 10, narration: "Part 2's learning tools are complete! In Part 3, we learn how to turn text into numbers so we can feed it to a network." },
  ],
  playgroundTitle: "Train a network yourself",
  playgroundIntro: "Pick a problem, set the number of neurons and the learning rate, then press \"Start training\". Watch the loss curve fall and the boundary grow. The final boss is the target!",
  summary: [
    "Training loop: forward pass → loss → backpropagation → fix by gradient descent, repeated in minibatches, epoch after epoch.",
    "People choose the number of neurons, the learning rate and the epochs. Training finds the knobs (weights, biases).",
    "Real skill shows on validation data. GPT learns the same way, just far bigger.",
  ],
  unlocks: "The training loop (Part 2 complete)",
  unlockLabel: "You got a new learning tool",
  quiz: [
    {
      q: "Which is the right order for one lap of the training loop?",
      choices: ["Loss → forward pass → fix → backpropagation", "Forward pass → loss → backpropagation → fix", "Backpropagation → forward pass → loss → fix"],
      answer: 1,
      explain: "First predict (forward pass), measure how wrong (loss), share the blame (backpropagation), then fix the knobs (gradient descent).",
      review: "s3",
    },
    {
      q: "How many knobs (weights + biases) does a 2 inputs → 8 neurons → 1 output network have?",
      choices: ["11", "24", "33"],
      answer: 2,
      explain: "First-layer weights 2 × 8 = 16, biases 8, output weights 8, output bias 1. 33 in all.",
      review: "s2",
    },
    {
      q: "What happens to this network if the learning rate is far too big (say, 1)?",
      choices: ["The loss jumps around and training breaks down", "It reaches 100% much faster", "Nothing changes"],
      answer: 0,
      explain: "With too big a step, it overshoots the bottom and bounces away (chapter 22). Try it in the hands-on section.",
      review: "playground",
    },
  ],
  labels: {
    tag: "27. Part 2 boss battle",
    boss: "Part 2 boss battle",
    map: "Truck map: 60 trucks",
    self: "the network finds the line itself!",
    spicy: "spicy",
    line: "line",
    example: "illustrative example",
    netTitle: "A small neural network",
    in1: "spicy",
    in2: "line",
    out: "hit score",
    rule: "over 0.5 = a hit",
    knobs: "33 knobs",
    random: "random at first",
    loopTitle: "The training loop",
    l1: "① forward",
    l2: "② loss",
    l3: "③ backprop",
    l4: "④ fix",
    l1s: "ch. 19",
    l2s: "ch. 20",
    l3s: "ch. 23",
    l4s: "ch. 21 · 22",
    center: "batch × epoch",
    centerS: "ch. 24",
    epoch: "epoch",
    acc: "accuracy",
    lossT: "loss",
    trainTitle: "Training",
    valTitle: "30 new trucks",
    valOk: "Validation: 30 of 30 correct!",
    learned: "It learned the rule, not the answers",
    gptTitle: "GPT learns the same way, just bigger",
    rowBoss: "boss network",
    rowGpt: "GPT-3",
    colKnobs: "knobs",
    colData: "training data",
    bossKnobs: "33",
    bossData: "60 trucks",
    gptKnobs: "175 billion",
    gptData: "300 billion tokens",
    done: "Part 2 learning tools complete!",
    next: "Next: Part 3, turning text into numbers",
  },
};
