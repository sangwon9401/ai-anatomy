# 003 — AI Anatomy Class: ChatGPT Edition

[한국어](PLAN.md) · [English](PLAN.en.md) · [日本語](PLAN.ja.md) · [中文](PLAN.zh.md)

This is a translation of `PLAN.md` (Korean original). If they differ, the Korean original prevails.

> An **Android app + website** in which a Korean 10th grader (고1, age 16) follows **"how ChatGPT was made"** through animations and videos
> and understands the entire transformer architecture step by step.

- Written: 2026-10-25
- Size: **12 Parts · 96 chapters** (★ core course: 33 chapters)
- 1 chapter = 7–10 minutes (animation + try it yourself + 3 quiz questions)

---

## 1. Learning design principles

### 1-1. Matching the math level of Korean 10th grade (고1) (based on Korea's 2022 revised national curriculum)

| Concept | When it is taught at school in Korea | How the app handles it |
|---|---|---|
| **Matrices** | **10th grade (고1), Common Mathematics 1 (공통수학1)** (back in the curriculum starting with the 2025 10th graders) | Used as is, with the hook "the matrices you learned at school are the heart of ChatGPT" |
| Functions | Middle school to 10th grade | Used as is |
| Vectors, dot product | 11th–12th grade (고2–3) Geometry (기하, an elective) | Start from intuition with arrows and "comparing tastes" |
| Exponentials, logarithms | 11th grade Algebra (대수) | Softmax as "inflating the scores", logarithm as "the size of surprise" |
| Differentiation | 11th grade Calculus I (미적분I) | Explained without the word "derivative": "gradient = how much the result changes when you change something slightly" |
| Probability distributions | 11th–12th grade Probability and Statistics (확률과 통계) | Only this much: the heights of the bars add up to 1 |

**Rule: formulas come after showing the intuition, and numbers always come in small examples (3–4 dimensions).**

### 1-2. Devices that tie the story together
- **Fixed example sentence**: the whole course keeps using `"나는 오늘 학교에" → "간다"` (Korean for "I, today, to school" → "go"; the English edition uses `"I walk to" → "school"`). The same sentence is shown changing through tokenization, embedding, attention and output.
- **Mascot**: a token character, "Tokeni" (토큰이, working name), acts as a guide traveling through the inside of the model.
- **Filling in the blueprint**: Chapter 5 shows a GPT blueprint full of blanks, and each time a Part is finished, a component (embedding, attention, FFN…) is filled in. The blueprint is complete in Chapter 96 = graduation.

### 1-3. Chapter template (common to all chapters)

| Order | Component | Time | Content |
|---|---|---|---|
| 1 | Hook question | 30 s | "How does the AI know what 'it' refers to?" |
| 2 | Main animation | 2–4 min | **Video mode** (autoplay + narration) / **Step mode** (each tap advances one step) |
| 3 | Try it yourself | 2–3 min | Manipulate the chapter's concept with sliders, dragging and typing |
| 4 | Chapter summary | 30 s | Summary card + earn a blueprint component |
| 5 | Quiz | 1 min | 3 questions (a wrong answer takes you back to the related step) |
| 6 | Next-chapter preview | 10 s | Show the next chapter's hook question in advance |

---

## 2. Curriculum (96 chapters)

★ = core course (33 chapters for students who want to go quickly; video production is also prioritized in this order)

### Part 0. Prologue — ChatGPT, who are you? (1–5)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 1 ★ | The next-word guessing game | The essence of ChatGPT = predicting the next token | The student picks a word for the blank and compares it with the model's probability bars |
| 2 ★ | An AI that writes one word at a time | Autoregressive generation | A loop in which each generated word goes back in as input |
| 3 | 70 years of AI on a timeline | Perceptron (1958) → deep learning (2012) → transformer (2017) → ChatGPT (2022) | A timeline whose scenes change era by era as you scroll |
| 4 | Rules vs data | Traditional programming vs machine learning | Try to write a spam filter with if statements, give up → switch to learning from examples |
| 5 ★ | The blueprint we will build | Preview of the whole GPT structure | A blueprint full of blanks (filled in Part by Part from then on) |

### Part 1. AI speaks in numbers — the math toolbox (6–15)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 6 | Everything is a number | Digital representation | Keep zooming into a photo until a grid of pixel numbers appears |
| 7 ★ | Vectors: rows of numbers | Vectors | Draw my food tastes (spiciness, sweetness…) as an arrow |
| 8 | Close means similar | Distance, similarity | Plot friends' tastes as points on a 2D plane → find the closest friend |
| 9 ★ | Dot product: how much the same direction? | Dot product | Rotating the arrow's angle changes a dot-product gauge |
| 10 | Matrices: bundles of vectors | Matrices (link to Common Mathematics 1) | A class grade sheet = a matrix |
| 11 ★ | Matrix multiplication = transforming space | Matrix multiplication | Transformation animation of a grid stretching and rotating |
| 12 | Functions are input→output machines | Functions | A conveyor belt: put a number in and a result comes out |
| 13 | Probability distributions | Probability | Bar chart of next-word candidates; the heights add up to 1 |
| 14 ★ | Scores into probabilities: softmax | Exponential function, softmax | Score bars → inflated with e^x → divided into a probability pie |
| 15 | Matching sizes: normalization | Mean, variance, normalization | Scattered numbers gather around 0 |

### Part 2. How machines learn — neural network basics (16–27)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 16 ★ | A single neuron | Weights, bias | A neuron that judges whether a tteokbokki (spicy rice cake) restaurant is a hit: inputs × weights, summed |
| 17 | Bend to survive: activation functions | ReLU, GELU | Data that one straight line can't separate → solved with a bent line |
| 18 | Stacking layers | Multilayer perceptron (MLP) | Space folds and the data separates |
| 19 | The forward pass | Forward pass | Numbers flow through the layers like particles of light |
| 20 ★ | How wrong was it? Loss | Loss function | The distance between the arrow and the bullseye |
| 21 ★ | Gradient descent | Gradient descent | A ball going down a foggy mountain by looking only at the slope under its feet |
| 22 | Choosing the step size: learning rate | Learning rate | Too big and it bounces away; too small and it crawls like a turtle |
| 23 ★ | Backpropagation: sharing the blame | Backprop, intuition for the chain rule | The error flows backwards, showing how much "blame" each weight carries |
| 24 | Splitting the workbook | Mini-batches, epochs | A scene of flipping through the workbook bundle by bundle |
| 25 | The student who memorized past exams | Overfitting, generalization | A graph in which the training and validation loss curves split apart |
| 26 | Hands-on: handwritten digits | Putting it all together | Draw a digit with your finger and a neural network in the browser guesses it |
| 27 | Part 2 boss battle | Full review | Train a mini neural network yourself to hit the target |

### Part 3. Turning text into numbers — representing language (28–36)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 28 | Letters inside a computer | Unicode, how Hangul syllables are composed | '한' = ㅎ+ㅏ+ㄴ → code number |
| 29 ★ | Tokens: the AI's unit of text | Tokenization | Type a sentence and it splits into colored pieces (a real tokenizer) |
| 30 | Merging pieces that often go together | BPE | Animation of character pairs being merged again and again |
| 31 | Do some languages need more tokens? | Token efficiency by language | Compare token counts of Korean and English sentences with the same meaning |
| 32 | The limits of ID numbers | One-hot encoding | A single 1 in a huge array of 0s |
| 33 ★ | Embeddings: coordinates of meaning | Embedding | Words float in 3D space like constellations |
| 34 | Neighbors reveal meaning | Word2Vec, distributional hypothesis | Arrow arithmetic: 'king − man + woman = queen' |
| 35 | Exploring the embedding universe | Hands-on | Search for a word → nearby words light up |
| 36 ★ | How does it know the order? | Positional encoding | 'The dog bit the man' vs 'The man bit the dog' + adding sine-wave patterns |

### Part 4. Before the transformer (37–43)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 37 | Language model = probability of a sentence | Definition of an LM | Compare the probabilities of a natural sentence and an awkward one |
| 38 | Looking at only the last few words | n-gram | Generate sentences from a word-pair frequency table (odd sentences come out) |
| 39 | The neural language model | NNLM (2003) | Predict the next word with embeddings + an MLP |
| 40 | RNN: passing notes in a relay | RNN, hidden state | At each word, rewrite the note and pass it on to the next cell |
| 41 ★ | The limits of RNNs | Long-range dependencies, sequential processing | In a long sentence the writing on the note fades + GPUs waiting in a single line |
| 42 | How a translator is built | Encoder-decoder (seq2seq) | Squeezing a whole sentence into a single vector → a bottleneck |
| 43 ★ | The birth of attention | Bahdanau attention (2014) | A spotlight over the source words during translation |

### Part 5. Mastering attention (44–53)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 44 | Attention Is All You Need | The story of the 2017 paper | Staging the story of the 8 authors and the Google research team |
| 45 ★ | Words look at each other | Intuition for self-attention | Connecting lines: "The animal was so tired that it didn't cross the road. **It**…" |
| 46 ★ | Query · Key · Value | QKV | Library analogy: question card, book label, book content |
| 47 | Relevance scores | Q·K dot product | A score table of word pairs filling in cell by cell |
| 48 | Divide, then softmax | √d scaling, softmax | Score row → probability row (review of Ch. 14) |
| 49 | Mixing to make new meaning | Weighted sum | Mixing paint: the Value colors in proportion |
| 50 ★ | Computing it all at once | Attention in matrix form | The previous steps collapse into three matrix multiplications (review of Ch. 11) |
| 51 ★ | No peeking at the future | Causal mask | A triangular screen comes down |
| 52 | Looking with many eyes | Multi-head attention | Differently colored connecting lines for each head (grammar / meaning / position) |
| 53 | Peeking inside a real GPT | Hands-on attention visualization | Explore the attention maps of a real small model (precomputed data) |

### Part 6. Assembling the transformer (54–62)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 54 | The transformer block blueprint | What a block is made of | Components slot in one by one |
| 55 ★ | The thinking layer | Feed-forward (FFN) | Each word passes through an MLP and gains "knowledge" |
| 56 | The information highway | Residual connections | The original information is preserved via a bypass road |
| 57 | Keeping things steady | Layer normalization | Review of Ch. 15: matching the sizes of word vectors |
| 58 | Stacking blocks | Depth | A color change showing word meanings growing richer as the layers get deeper |
| 59 | Encoder vs decoder | BERT vs GPT | Two-way arrows vs one-way arrows |
| 60 | From vector to word | Output layer, logits | Last vector → scores for about 50,000 tokens → softmax |
| 61 ★ | **Following it from start to finish** | The full forward pass | Full animation of `"나는 오늘 학교에" → "간다"` (**the flagship video**) |
| 62 | Part 6 boss battle: the finished blueprint | Synthesis | Assemble the components in the right order by drag and drop |

### Part 7. Teaching GPT: pre-training (63–71)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 63 | The internet is the textbook | Data collection, cleaning | A factory where web documents pass through filters (duplicates, harmful content) |
| 64 ★ | Studying without an answer key | Self-supervised learning | One sentence turns into dozens of questions |
| 65 ★ | Measuring surprise | Cross-entropy, intuition for logarithms | A "surprise meter" that grows as the probability of the right answer gets lower |
| 66 ★ | One lap of the training loop | Training loop | The predict → loss → backprop → update cycle |
| 67 | A smarter way downhill | Adam optimizer | A ball with momentum (review of Ch. 21) |
| 68 | Why GPUs? | Parallel computation | One calculator vs 10,000 students calculating at the same time |
| 69 | GPT-1 → 2 → 3 | History of the models | Model sizes compared as building heights |
| 70 ★ | Bigger is smarter | Scaling laws | Loss going down smoothly on a log graph |
| 71 | Learning from examples alone | In-context learning, few-shot | Accuracy changes with the number of examples in the prompt |

### Part 8. The birth of ChatGPT (72–79)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 72 ★ | Smart but doesn't listen | Limits of the base model | Ask it a question and, instead of answering, it keeps writing more questions |
| 73 ★ | Copying model answers | SFT (instruction fine-tuning) | Fine-tuning on Q&A written by people |
| 74 | People rank the answers | Human preference data | The student ranks answers A/B/C themselves |
| 75 | The AI grader | Reward model | A machine that puts out a score when you feed in an answer |
| 76 ★ | Polishing with praise | RLHF (intuition for PPO) | Dog-training analogy: moving toward higher scores |
| 77 | A chat is really one long document | Chat templates, system prompt | Speech bubbles unfold into one long line of tokens |
| 78 | November 30, 2022 | Launch of ChatGPT | Graph of 1 million users in 5 days |
| 79 | Making AI safe | Alignment, safety | Balancing between refusing dangerous requests and refusing too much |

### Part 9. The moment an answer is made — inference (80–85)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 80 | Ways to choose | Greedy vs sampling | Spinning a probability roulette wheel |
| 81 ★ | The creativity dial | Temperature | Turning the dial makes the distribution peaked ↔ flat, and the generated sentence changes too |
| 82 | Narrowing the candidates | Top-k, Top-p | Cutting off candidate bars |
| 83 | The AI's memory limit | Context window, KV cache | Earlier parts of the conversation get pushed out of the window |
| 84 ★ | Convincing lies | Hallucination | How stringing together plausible words produces a fake fact |
| 85 | Prompts make sense once you know the structure | Prompting principles | Same question, different prompts → compare the results |

### Part 10. The world after ChatGPT (86–91)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 86 | AI with eyes | Multimodal, ViT | A photo gets cut into patch tokens (links to Ch. 29) |
| 87 ★ | Think, then answer | Reasoning models, CoT | It generates its working internally first, then gives the answer |
| 88 | Look it up, then answer | RAG | Question → document search → put them in together and answer |
| 89 | AI with hands and feet | Tool use, agents | The flow of calling a calculator or search |
| 90 | AI in my phone | Distillation, quantization, on-device | A big model compressed into a small one |
| 91 | AI and us | Copyright, bias, careers | Discussion cards |

### Part 11. Graduation project — my own mini GPT (92–96)
| # | Title | Key concept | Animation / interaction |
|---|---|---|---|
| 92 | Designing a mini GPT | Project introduction | Choose a dataset (proverbs / children's songs / textbook sentences) |
| 93 | Building my own tokenizer | BPE practice | Do the BPE merges yourself by clicking |
| 94 ★ | Training in the browser | Training practice | The loss graph drops in real time, and the generated sentences become more and more plausible |
| 95 | Let's generate | Sampling practice | Generate sentences with your own model while changing the temperature |
| 96 | Graduation day | Full review | Fly through the finished blueprint from start to end + certificate of completion |

---

## 3. Screens (app + web)

| Screen | App (portrait) | Web (desktop) |
|---|---|---|
| **Home / roadmap** | Parts = a stage map, a "Continue" button, blueprint progress | Same layout + the full curriculum list |
| **Chapter player** | Top: animation canvas / bottom: captions + step controls; mode switch `Video ▶` `Step 👆` | Left: canvas (large) / right: explanation, formulas, quiz |
| **Try it** | Inside each chapter + collected in the Playground tab (tokenizer, temperature dial, embedding universe…) | Same |
| **My blueprint** | A transformer assembled from the collected components; tap a component to go to its chapter | Same |
| **Glossary** | Term → link to the chapter where it first appears | Same |
| **Class mode** (web only) | — | Full screen for a teacher to project + large text + remote-control shortcuts |

Canvas ratio: scenes are designed **at 4:5** (large on a phone held upright, and it also fits the web's left panel). For 9:16 Shorts and 16:9 YouTube, only the layout changes at render time.

---

## 4. Technical architecture — one codebase for app / web / video

```
            ┌────────────────────────────────────────────┐
            │  chapters/*.json  (script, steps, quiz)    │
            │  scenes/*.tsx     (Remotion compositions)  │
            └────────────────────┬───────────────────────┘
          ┌──────────────────────┼──────────────────────────┐
          ▼                      ▼                          ▼
   Web (Next.js static)   Android (Capacitor)        MP4 (Remotion render)
   @remotion/player       wraps the same web build   YouTube, Shorts, offline video
```

| Area | Choice | Reason |
|---|---|---|
| Animation scenes | **Remotion** (React) | In the app/web the same components play **interactively** through `@remotion/player` (slider values are passed as props), and they also render as they are into **MP4 video**. No need to make animations and videos separately |
| 3D scenes (embedding universe, etc.) | three.js (`@remotion/three`) | Usable inside Remotion |
| Web | Next.js (`output: 'export'` static build) | SEO for chapter pages; easy to put into Capacitor as is |
| Android | **Capacitor** | Wraps the web build for Play Store distribution; content is bundled in the app for offline playback |
| Saving progress | MVP: stored on the device → v1: Firebase (Auth + Firestore) to sync app↔web | Start without login at first |
| Narration | Google Cloud TTS (Korean) or our own recording | Captions with Remotion captions |
| Mini model for the hands-on parts | A small character-level GPT in browser JS/WebGPU | If the device is slow, fall back to replaying a checkpoint trained in advance |

**Important constraint**: Remotion scenes must be written **frame-based** with `useCurrentFrame()` + `interpolate()`, not with CSS transitions or time-based libraries, so that video rendering and step mode behave exactly the same. Step mode = moving between specific frame ranges.

**License check needed**: Remotion is free for individuals and companies of 3 or fewer people; anything larger needs a company license (check the official license page again before release).

---

## 5. Content production pipeline

1. **Chapter spec drafts**: generate drafts of `chapters/NN.json` for all 96 chapters with Claude (`claude -p`, Max plan) — hook, narration for each step, scene directions, quiz
2. **Accuracy review**: a teacher or subject specialist checks the content (since this is an educational app, this step cannot be skipped)
3. **Scene implementation**: write `scenes/NN.tsx` with Claude Code + the Remotion skill
4. **Narration + captions**: generate TTS → match the timing
5. **Release**: interactive playback in the app/web; ★ chapters rendered to MP4 and used for promotion as YouTube Shorts

Chapter spec example:
```json
{
  "id": 46,
  "part": 5,
  "title": "Query · Key · Value",
  "core": true,
  "hook": "How do you find the book you want in a library?",
  "steps": [
    { "narration": "Each word is holding a question card (Query).", "scene": "q-cards-appear" },
    { "narration": "The other words carry book labels (Key).", "scene": "k-labels-appear" }
  ],
  "playground": { "type": "qkv-matcher" },
  "summary": "Ask with Q, find with K, bring back V.",
  "quiz": [
    { "q": "What does the Key do?", "choices": ["Question", "Label", "Content"], "answer": 1 }
  ],
  "unlocks": "attention-head"
}
```

---

## 6. Skills available for design (checked 2026-10-25)

### Installed → ready to use
| Skill | Use |
|---|---|
| `frontend-design` | Setting the brand and visual direction (avoiding template-like AI design), landing page |
| `ui-ux-pro-max` | Design system generation (palettes, font pairings, 119 UX rules), per-stack guides (22 stacks including nextjs, react, react-native, flutter, threejs), 17 GSAP motion presets. Has an "Educational App" profile (Claymorphism + micro-interactions). Its Korean font data is limited to roughly Noto Sans KR, so fonts like Pretendard have to be specified by hand |
| `diagram-design`, `excalidraw-diagram`, `drawio` | Architecture diagrams, chapter storyboards |
| `dataviz` | Charts such as loss curves and scaling-law graphs |
| `artifact-design` | Share prototype screens as web pages to check them on a phone |
| `ppt-master` | Slide-based narrated videos (an alternative for making videos quickly at the MVP stage) |

### Not installed → search results (animation and video production)
| Skill | Install | Notes |
|---|---|---|
| **Official Remotion Agent Skills** (`remotion-best-practices`) | `npx skills add remotion-dev/skills` | Official. Rules for animation, timing, audio, captions, 3D. **The main one for this project** |
| Manim skills (`adithya-s-k/manim_skill`, etc.) | `npx skills add adithya-s-k/manim_skill` | 3Blue1Brown-style math videos. Third-party, so review the source before installing. Optional, for making just a few chapters in high quality, such as matrix transformations (Ch. 11) |

### Existing material to benchmark
- 3Blue1Brown's neural network series (the transformer episodes) — visual intuition
- Jay Alammar, *The Illustrated Transformer* — step-by-step diagrams
- Polo Club *Transformer Explainer* (poloclub.github.io/transformer-explainer) — interactive GPT-2 in the browser
- Brendan Bycroft *LLM Visualization* (bbycroft.net/llm) — 3D visualization of the structure
- Andrej Karpathy, *Let's build GPT* / nanoGPT — reference for the graduation project (Part 11)

---

## 7. Roadmap

| Stage | Scope | What to check |
|---|---|---|
| **0. Prototype** | Design system + 1 chapter (Ch. 14, softmax, is recommended: it has formulas, animation and sliders all in one) | Web → phone: whether step mode / video mode feel natural |
| **1. MVP** | Parts 0–1 (15 chapters) + the Ch. 61 flagship video, web + Android internal testing | Test with 5–10 Korean 10th graders (고1): completion rate, quiz accuracy |
| **2. v1** | Parts 2–6 (up to Ch. 62, the transformer complete) | Official Play Store launch |
| **3. v2** | Parts 7–11 + account sync + web class mode | For schools / teachers |
| **4. v3** | AI tutor ("Ask Tokeni") | Safety filters for minors, cost |

---

## 8. Open decisions

1. **App name / mascot** — "AI Anatomy Class" (Korean: "AI 해부교실"; decided 2026-10-25; because of the trademark, ChatGPT appears only in the subtitle); the mascot "Tokeni" (토큰이) is not decided yet
2. **Revenue model** — free / partly paid / B2B for schools
3. **Narration** — TTS vs our own recording (our own recording is more immersive but harder to revise)
4. **Accounts** — the target users are 14 or older, so they can sign up with their own consent, without a legal guardian's consent (under Korea's Personal Information Protection Act, a legal guardian's consent is required only for children under 14). Even so, keep the data collected to a minimum
5. **Remotion license** — paid once the team has 4 or more people
