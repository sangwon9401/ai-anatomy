import type { ChapterSpec } from "../../../data/types";

/** bytes = parameters × bits ÷ 8; GB here means a billion (10⁹) bytes */
export const sizeGB = (params: number, bits: number) => (params * bits) / 8 / 1e9;

export const GPT3 = 175e9;
export const SMALL = 3e9; // a 3-billion-parameter model for the worked example
export const BITS = [32, 16, 8, 4] as const;
export const PHONE_GB = [8, 12] as const; // a typical range for phone memory (RAM) today

/**
 * Quantise onto a ruler with 2^bits evenly spaced ticks from −range to +range.
 * Returns the tick value nearest to w.
 */
export function quantize(w: number, bits: number, range: number) {
  const n = 2 ** bits - 1;
  const step = (2 * range) / n;
  const k = Math.round((w + range) / step);
  return -range + k * step;
}

export const WEIGHTS = [0.82, -0.35, 0.07, -1.2]; // illustrative knob values
export const RANGE = 1.2;

// distillation: teacher's next-piece probabilities for "I walk to" (ch01), and a student before/after
export const NEXT = ["school", "the", "work", "other"];
export const TEACHER = [0.52, 0.21, 0.12, 0.15];
export const STUDENT_BEFORE = [0.3, 0.1, 0.35, 0.25];
export const STUDENT_AFTER = [0.49, 0.22, 0.13, 0.16];

export const PARAM_PRESETS = [
  { key: "1b", label: "1 billion", n: 1e9 },
  { key: "3b", label: "3 billion", n: 3e9 },
  { key: "8b", label: "8 billion", n: 8e9 },
  { key: "gpt3", label: "175 billion (GPT-3)", n: GPT3 },
];

export const ch90: ChapterSpec = {
  id: 90,
  part: 10,
  title: "AI in my phone",
  core: false,
  hook: "How can a huge AI run inside my phone, even without the internet?",
  steps: [
    { id: "s1", sec: 8, narration: "GPT-3 has 175 billion knobs, its parameters (chapter 12). Store each as a 32-bit, or 4-byte, number. How big is that altogether?" },
    { id: "s2", sec: 8, narration: "175 billion × 4 bytes = 700 billion bytes, about 700 GB. Phones today have about 8 to 12 GB of memory. Not even close!" },
    { id: "s3", sec: 8, narration: "Way one: make a smaller model. Teach a small student model to copy the answers of a big teacher model. This is called distillation." },
    { id: "s4", sec: 9, narration: "It copies not just the right answer but the teacher's whole set of probability bars, learning that 'the' is fairly likely too." },
    { id: "s5", sec: 9, narration: "Way two: write numbers less precisely. 8 bits is like a ruler with 256 marks, 4 bits a ruler with 16. This is called quantization." },
    { id: "s6", sec: 8, narration: "Measure 0.82 with the 8-bit ruler and you get 0.824; with the 4-bit ruler, 0.88. A little off, but the model mostly works the same." },
    { id: "s7", sec: 8, narration: "Try a 3-billion-parameter model: 12 GB at 32 bits, 3 GB at 8 bits, 1.5 GB at 4 bits. Now it fits on a phone!" },
    { id: "s8", sec: 9, narration: "Running on the phone works without internet, and your text never leaves the phone. But a small model may struggle with hard questions." },
  ],
  playgroundTitle: "Model compression calculator",
  playgroundIntro: "Choose the number of parameters and bits to work out the model's size. Will it fit in a phone's memory? Below, see how far numbers shift on a coarse ruler.",
  summary: [
    "Model size = number of parameters × bytes per number. GPT-3 at 32 bits is about 700 GB.",
    "Distillation: a small student model learns by copying a big teacher model's probability bars.",
    "Quantization: write numbers roughly, in 8 or 4 bits instead of 32. Small model + quantization = AI in your phone.",
  ],
  unlocks: "Model compression",
  unlockLabel: "You got a new ability card",
  quiz: [
    {
      q: "How many GB is 3 billion parameters stored at 8 bits (1 byte) each?",
      choices: ["3 GB", "12 GB", "30 GB"],
      answer: 0,
      explain: "3 billion × 1 byte = 3 billion bytes = 3 GB. At 32 bits (4 bytes) it would be 12 GB.",
      review: "s7",
    },
    {
      q: "In distillation, what does the student model copy?",
      choices: ["How many parameters the teacher has", "The probability bars the teacher model gives", "The teacher model's name"],
      answer: 1,
      explain: "It copies the teacher's whole set of probability bars, which holds more than just the one right answer.",
      review: "s4",
    },
    {
      q: "What happens when you quantize a model?",
      choices: ["The model becomes more accurate", "The number of parameters goes up", "It gets smaller, and the numbers shift a little"],
      answer: 2,
      explain: "It's like measuring with a ruler that has fewer marks, so numbers shift a little. In return, the size drops a lot.",
      review: "s6",
    },
  ],
  labels: {
    tag: "90. AI in my phone",
    knobs: "175 billion knobs",
    oneKnob: "1 knob = 32 bits = 4 bytes",
    byte: "1 byte",
    bitsOf: "e.g. 0.82 written in 32 bits",
    gb700: "700 GB",
    eq: "175 billion × 4 bytes = 700 billion bytes",
    total: "≈ 700 GB",
    phone: "Phone: 8–12 GB",
    noWay: "Not even close!",
    teacher: "Teacher",
    student: "Student",
    big: "big and smart",
    small: "small and light",
    copy: "copy",
    distill: "Distillation",
    context: "I walk to ___",
    tBars: "Teacher's odds",
    sBars: "Student's odds",
    oneHot: "Right answer only: school 100%, the rest 0%",
    more: "Even that 'the' is plausible too!",
    example: "* illustrative example",
    r32: "32 bits: almost endlessly fine",
    r8: "8 bits: 256 marks",
    r4: "4 bits: 16 marks",
    quant: "Quantization",
    w: "0.82",
    q8: "→ 0.824",
    q4: "→ 0.88",
    off: "A little off, but it mostly works the same",
    model3: "A 3-billion-knob model",
    line: "Phone: 8 GB",
    fits: "It fits on a phone!",
    tight: "tight",
    gb12: "12 GB",
    gb6: "6 GB",
    gb3: "3 GB",
    gb15: "1.5 GB",
    b32: "32 bits",
    b16: "16 bits",
    b8: "8 bits",
    b4: "4 bits",
    offline: "Works without internet",
    private: "Your text stays private",
    npu: "Phone chips today even have AI parts (NPUs)",
    weak: "Weaker on hard questions",
    chatQ: "Plan my day",
    chatA: "Sure! Three things…",
    onDevice: "Computing on the phone",
  },
};
