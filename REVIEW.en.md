# Review list (for teachers and specialists to check before release)

[한국어](REVIEW.md) · [English](REVIEW.en.md) · [日本語](REVIEW.ja.md) · [中文](REVIEW.zh.md)

This is a translation of `REVIEW.md` (Korean original). If they differ, the Korean original prevails.

These are the facts and simplifications marked "needs checking" while making chapters 16–96. Numbers shown as illustrative examples (probabilities, weights, scores) are left out here.

## Part 2 How machines learn (16–27)
- GPT-3 batch size of about 3.2 million tokens (Ch. 24); feed-forward width 49,152 = 4 × 12,288 (Ch. 18)
- GPT-3 first raised the learning rate and then gradually lowered it (Ch. 22); GPT uses GELU (Ch. 17)
- The description of nerve cells in step 1 of Ch. 16
- The handwriting network in Ch. 26 was trained with Adam, but the screen only calls it "fixing" (Adam first appears in Ch. 67)

## Part 3 Turning text into numbers (28–36)
- Unicode "has more than 150,000 characters" (Ch. 28)
- The GPT-3 tokenizer was built mainly from English text (Ch. 31)
- "The GPT-4o tokenizer was also built by merging like this, about 200,000 pieces" (Ch. 30): it is true that o200k_base is BPE, but how it was trained has not been published
- GPT-2/3 learn position patterns instead of using sine waves (Ch. 36); the softened wording "it's hard to know the order" in step 3 of Ch. 36

## Part 4 Before the transformer (37–43)
- In 1948 Shannon generated English sentences from word-pair statistics (Ch. 38)
- The authors of the 2014 attention paper, Bahdanau · Kyunghyun Cho (조경현) · Bengio, and "Kyunghyun Cho: he's a Korean researcher!" (Ch. 43)
- seq2seq "Sutskever's research team in 2014"; translations got worse the longer the sentence (Ch. 42)
- Word2Vec "focused only on making these vectors" (Ch. 39); LSTM = "a storage box and doors (gates)" (Ch. 41)

## Part 5 Mastering attention (44, 46–53)
- "Even the big model trained in 3.5 days on 8 GPUs", "top scores in English→German and English→French translation" (Ch. 44, from the paper's abstract)
- Ch. 48's "if it gets too peaked, learning stops" is a simplification of the paper's conjecture ("we suspect")
- Ch. 53 explains the way attention piles onto the first token as "still being researched". The attention maps are real measurements from GPT-2 small (L4H11, L7H2, L5H1, L4H3)

## Part 6 Assembling the transformer (54–62)
- Scores in Ch. 60–61: 간다 ("go") 3.0, 갔다 ("went") 2.1, 늦었다 ("was late") 1.5, 피자 ("pizza") −1.0, the other 50,253 about −9.1 → 52/21/12%. These differ from Ch. 14's 3/2/1/−1 (values fitted to the full vocabulary)
- Computed values for GPT-3: feed-forward about 116 billion vs attention about 58 billion, about 1.8 billion per layer
- ResNet (2015, 152 layers), BERT (2018, Google), GPT-2/3 normalize before each component (GPT-1 and the 2017 transformer normalize after)

## Part 7 Teaching GPT: pre-training (63–71)
- GPT-3 used Adam (Ch. 67); "big AIs are trained on thousands of GPUs linked together" (Ch. 68)
- Lotte World Tower, 123 floors (Ch. 69)
- The scaling graph in Ch. 70 is an illustrative straight line with ×10 tick marks on the horizontal axis only. The actual Kaplan graphs have ×10 tick marks on both axes (a power law)

## Part 8 The birth of ChatGPT (72–79)
- InstructGPT labelers ranked 4–9 answers for each prompt, using the criteria helpful, honest and harmless (Ch. 74)
- ChatGPT was fine-tuned from the GPT-3.5 series with the same method as InstructGPT and released as a free research preview (Ch. 78)
- The comparison of how long it took to reach 1 million users (Netflix 3.5 years, Twitter 2 years, Facebook 10 months, Instagram 2.5 months): labeled as widely cited estimates
- The mention of PPO in Ch. 76

## Part 9 The moment an answer is made (80–85)
- Whether the made-up book title in Ch. 84, 『토끼 행성의 마지막 도서관』 ("The Last Library of Rabbit Planet"), really does not exist
- "ChatGPT usually uses sampling" (the actual settings are not public); the order "temperature → cutting → roulette" follows open-source implementations
- Ch. 83: 2,048² ≈ 4.19 million cells (with the mask, the actual computation is about half of that)

## Part 10 The world after ChatGPT (86–91)
- Reasoning models "from around 2024"; giving points to correct solutions is "one of the known methods" (Ch. 87)
- ViT 224×224, 16-pixel patches → 196 (Ch. 86); "phones these days have 8–12 GB of memory" (Ch. 90)
- The quotation of Article 2, subparagraph 1 of Korea's Copyright Act, and the explanation of the Personal Information Protection Act (Ch. 91)

## Part 11 Graduation project (92–96)
- Whether all the songs used as traditional children's songs (전래동요) really are traditional songs of unknown authorship (두껍아, 달아 달아, 새야 새야, 여우야, 우리 집에 왜 왔니, 꼬마야 꼬마야, 해야 해야, 잠자리 꽁꽁, 자장 자장, 비야 비야)
- The wording of the proverbs; the textbook-style sentences we wrote ourselves (simplifications such as spiders vs insects, clouds)
- The loss in Ch. 94 is natural-log cross-entropy (5.82 = ln 337). Ch. 65 explains it as "one surprise each time the probability halves" (base 2)

## Things to check in the English edition (translation and adaptation)

The English edition adapts the Korean course for English-speaking high school students. A native-speaking teacher should look at:

- **Parts 0–2 (chapters 1–27):** how natural the chapter 4 spam texts and their word scores feel; whether "pieces", "knobs", "blame" (for gradients), "a hit / a miss" and "rate 0.01" read well for 15-year-olds; the idioms "past exams" and "the same yardstick"; the `<end>` token chip in chapter 2; calling a dog, cat and rabbit "pets" in chapter 8.
- **Parts 3–5 (chapters 28–53):** "rizzler" as the new-slang example (chapter 29); the Spanish in chapters 42–43; the Japanese and Chinese sentences in chapter 31; the hand-made ranking in chapter 37's toy model ("To school I walk"); the tone of the chapter 38 corpus; "trunk" (elephant / car / tree) as the many-meaning word in chapters 35 and 45.
- **Parts 6–8 (chapters 54–79):** the pun chain in chapter 56; the German sentence in chapter 59 and the Spanish words in chapters 74–75; the Shakespeare-style answers in chapter 73; Fahrenheit-first wording in chapters 72–73; the Empire State Building's 102 floors (chapter 69); short forms "Backprop", "×10 ruler", "175B".
- **Parts 9–11 (chapters 80–96):** the proverbs and nursery rhymes the mini GPT learns from (including the lines written for the course); the U.S.-centric copyright fact in chapter 91; "Washington, D.C." as the school-trip guess in chapter 88; on-screen "temp" for temperature, the "Q"/"A" boxes in chapter 87 and "<1" in the chapter 94 graph.
- **Mini GPT:** single letters are too weak a unit for English, so the ready-made English models use BPE with 300 merges (chapter 93 says so). Students who train with no merges will see garbled text; the playground suggests adding merges.
