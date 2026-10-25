# Chapter build guide

How every chapter of AI 해부교실 (ChatGPT편) is made. Chapters 1–15 and 45 are the approved reference: the owner signed off on their look, tone and depth ("딱 좋다"), so new chapters copy them closely rather than inventing a new style. Read `PLAN.md` §1–2 for the course design and the per-chapter plan table.

## Audience and voice

- 고1 (만 16세), 2022 개정 교육과정. They know 함수 and 행렬 (공통수학1). They have **not** learned 벡터·내적, 지수·로그, 미분 or 확률분포 at school, so use the plain-language framings in PLAN.md §1-1 ("기울기 = 살짝 바꿨을 때 결과가 얼마나 변하나", 로그 = "놀람의 크기"). Never say 미분 or 편미분.
- Korean 해요체, short sentences, everyday analogy first, formula after the intuition, and always with small numbers (2–4 dimensions, 3–5 words).
- Introduce an English term once, in parentheses: 손실(loss). After that use the Korean word.
- Point back to earlier chapters when reusing an idea: "(14장)". Point forward sparingly: "Part 5에서 자세히".
- The running example of the course is `나는 오늘 학교에 → 간다`. Reuse it where it fits, with the same numbers: probabilities 간다 52%, 갔다 21%, 늦었다 12% (ch01) and scores 간다 3, 갔다 2, 늦었다 1, 피자 −1 (ch14).
- Illustrative numbers (made-up probabilities, weights, scores, attention values) are labelled **설명용 예시** both in the scene and in the playground. Real-world facts must be real; see "Canonical facts". If you are not sure of a fact, leave it out and list it in your report.

## Chapter anatomy (`ChapterSpec`, src/data/types.ts)

| Field | Rule |
|---|---|
| `id`, `part`, `title`, `core` | Exactly as in `src/data/curriculum.ts`. |
| `hook` | One question a student would actually ask. |
| `steps` | 5–8 steps. Write each as `{ id: "s1", sec: 7, narration: "..." }` on one object literal (the stills script reads `sec` from this shape). Narration: 1–3 sentences, at most ~75 Korean characters, so it fits three caption lines. `sec` ≈ characters × 0.14 + 1.5, between 5 and 11. |
| `playgroundTitle`, `playgroundIntro` | Short title (handwritten next to "직접 해보기") and a one or two sentence instruction. |
| `summary` | 3 lines, each a complete thought, written like a student's notebook. |
| `unlocks`, `unlockLabel` | See below. |
| `quiz` | 3 questions, 3 choices each (4 only if needed). Vary the answer index. `explain` says why, with a chapter reference if useful. `review` is the step id that teaches it, or `"playground"`. |
| `labels` | **Every** string drawn inside the scene. Strings that live in other data objects instead must be passed as `corpus` when registering. Otherwise MP4 renders miss the Korean font slices. |

Unlocks: the five chapters that complete a GPT blueprint part (ch05 `PIPELINE`) use the part's exact name and omit `unlockLabel` (default text "설계도에 부품이 하나 채워졌어요"): 29 `토크나이저`, 33 `임베딩`, 36 `위치 정보`, 55 `피드포워드`, 60 `출력 + 소프트맥스`. Every other chapter unlocks a concept with a short `unlockLabel` in the style of Part 1 ("수학 도구를 하나 얻었어요"); keep one phrase per Part, for example Part 2 "학습 도구를 하나 얻었어요". The last chapter of a Part wraps the Part up the way ch15 does (a recap of what the Part gave, ending on what comes next).

## Files: what you own

A Part is built by one person (or agent) at a time, in parallel with other Parts. To avoid collisions you create and edit **only** your Part's files:

- `src/data/chNN.ts` (two digits) for your chapters, plus optional `src/data/partN-*.ts` helpers
- `src/scenes/ChNNScene.tsx`, plus optional `src/scenes/partN-*.tsx` helpers
- `src/scenes/parts/partN.ts`: your registration list, in chapter order: `{ spec: ch16, Scene: Ch16Scene, corpus: [DATA] }`
- `src/playgrounds/partN/`: your playground components, `index.ts` (the `{ 16: NeuronLab }` map) and one `style.css`
- `out/stills/chNN-*` renders

Read-only for you: everything else, in particular `kit.tsx`, `plane.tsx`, `icons.tsx`, `fonts.ts`, `built.ts`, `registry.ts`, `styles.css`, `src/ui/*`, `src/remotion/*`, `package.json`, the 16 existing chapters and other Parts' files. Import shared code freely; if you need different behaviour, copy it into a `partN-*` helper. If shared code has a bug, work around it and mention it in your report.

Do not install packages into `app/` or edit `package.json`, `android/` or `artifact/`. Do not run `npm run build`, `build:artifact`, `cap sync` or Gradle, and do not start dev servers or use a browser: the integrator does builds and browser QA once all Parts are in. To precompute data (tokenizer counts, trained weights, a model's attention maps) you may install tools in your own scratch directory and embed the small result in your data files.

## Scenes (Remotion)

Start from `Ch12Scene.tsx` (simple) and `Ch14Scene.tsx` / `Ch45Scene.tsx` (rich). The pattern:

```tsx
const tl = buildTimeline(chNN);
const S = byId(tl);
const L = chNN.labels;
// a step's layer mounts slightly early and cross-fades out at the next step
{frame >= S.s3.from && frame < S.s4.from + 15 && <div style={{ opacity: on }}>...</div>}
```

- **Frame-driven only.** `useCurrentFrame()` with `beat()` / `interpolate()`. No CSS transitions or keyframes, no timers, no `Math.random()` (use `random(seed)` from `remotion`), no `Date`. The same code renders the MP4 and the in-app player, which seeks to arbitrary frames.
- **Canvas** 1080 × 1350. Keep content inside x 56–1024, y 100–1080. In MP4 renders the caption band covers everything below ~1090 and the chapter tag sits at the top left; in the app both are hidden (captions show as HTML under the canvas), so the picture must make sense without the caption.
- **Step ends are what students see.** Step mode pauses on each step's last frame, and the app's poster is the last frame of step 1. Every step must end on a complete, readable state: nothing half-faded, nothing overlapping the next step.
- **Colours** only through tokens, so dark mode (칠판) works: `--ink`, `--ink-2`, `--ink-3`, `--paper`, `--paper-2`, `--line`, `--pen`, `--grid-minor`, `--grid-major`, `--hl-yellow|mint|sky|pink|orange|violet`, `--chip-ink` (text on highlighter colours). Never a hex value.
- **Type**: `--font-sans` for text, `--font-hand` (Gamja Flower, via `<Hand>`) for red-pen notes, `--font-mono` for numbers and code. The canvas is shown at about a third of its size on a phone, so nothing smaller than 28 px; body 36–52 px, headlines 56–64 px. Use `textWidth()` / `chipWidth()` to make sure strings fit, and give multi-line text an explicit width, `textAlign` and `wordBreak: "keep-all"`.
- **Visual language**: graph paper (`<Paper>`), highlighter chips (`<Chip>`), red pen for marking (`PenCircle`, `PenUnderline`, `InlineCircle`, `InlineUnderline`, ○ and slashes), handwritten asides (`<Hand>`), coordinate planes from `plane.tsx`. One focal idea per step, few and large elements, generous space.
- Every scene ends with `<Narration tl={tl} chapter={chNN.id} audio={audio} />` and `{captions && <Caption tl={tl} />}`, and starts with `{captions && <Tag text={L.tag} />}`; `L.tag` is `"NN장 제목"`.
- It plays on phones: keep a frame under ~400 DOM/SVG elements.

## Playgrounds ("직접 해보기")

- One React component per chapter in `src/playgrounds/partN/`, registered in that folder's `index.ts`.
- Reuse the existing classes in `src/styles.css` (`.btn`, `.btn.ghost`, `.lab-row`, `.lab-actions`, `.lab-tip`, `.lab-sum`, `.plane-lab`, `.plane-side`, `.ctx-presets`, `.bars`/`.bar-row`, `.missions`, `.chip.hl-*`, `.matrix`, …). New styles go in `src/playgrounds/partN/style.css`, imported by the components that use it, with every selector prefixed `.pN-`.
- Works at 360–390 px wide with no horizontal page scroll (grid columns as `minmax(0, 1fr)`, long words wrap); touch targets at least 40 px; pointer events, with `touch-action: none` on anything you draw or drag on; real `<button>`s, `aria-label` on sliders and SVGs; colours through the same tokens.
- Give the student a goal ("두 점을 모두 지나게") and feedback in `.lab-tip`. Label illustrative numbers.
- Plain React state; no network, no storage. CSS transitions are fine here. Long computations (training loops) run in small chunks via `requestAnimationFrame` and stop on unmount.
- Existing playgrounds (`OrderGame`, `MiniPlane`, `SamplingLab`, …) may be imported if one fits, never modified.
- Keep each chapter's embedded data under ~150 KB.

## Check loop (every chapter, before moving on)

1. **Types**: `npx tsc --noEmit -p . 2>&1 | grep -iE "ch(16|17)|part2"` (your chapters and Part; `-i` so it also catches `ChNNScene.tsx`) prints nothing. The project has `noUnusedLocals`. Other Parts are being written at the same time; ignore their errors.
2. **Numbers**: compute every number on screen (sums, softmax, dot products, losses, token counts) with a small script, never by hand.
3. **Register** the chapter in `src/scenes/parts/partN.ts` and its playground in `src/playgrounds/partN/index.ts` as soon as they compile.
4. **Look at it**: `rm -f out/stills/chNN-*; node scripts/stills.mjs --part N chNN:ends chNN:150,420` (`ends` = last frame of every step; add mid-step frames for important motion), then `python3 scripts/contact.py <scratchpad>/chNN.png 4 out/stills/chNN-*.png` and open the sheet with the Read tool. Look for overlaps, clipping at the edges, content below y 1080, text overflowing its box, steps that look empty or crowded, text too small to read, wrong numbers. Fix and render again until it is clean. Rendering several chapters in one `stills.mjs` call saves bundling time.
5. **Playground**: you cannot open a browser, so re-read it for state bugs, test non-trivial logic with a small script (Node 26 runs `.ts` files directly), and check the layout for a 360 px column.
6. Re-read this guide against the chapter.

## Canonical facts

Use these values so every chapter agrees.

- GPT-3 (2020): 1,750억 parameters, 96 layers, 12,288-dimensional token vectors, 96 attention heads (128 dims each), about 5만 tokens in the vocabulary (50,257), context 2,048 tokens, trained on about 3,000억 tokens.
- GPT-1 (2018) 1.17억 parameters, 12 layers. GPT-2 (2019) 15억, 48 layers. GPT-3 (2020) 1,750억.
- Transformer: "Attention Is All You Need", 2017, NeurIPS 2017. 8 authors, the work done at Google (Brain and Research); the paper notes that the author order is random. Base model: 6 encoder + 6 decoder layers, d_model 512, 8 heads.
- Perceptron 1958 (Rosenblatt). Backprop widely known 1986 (Rumelhart, Hinton, Williams). LSTM 1997. AlexNet 2012. NNLM 2003 (Bengio). Word2Vec 2013 (Mikolov). seq2seq 2014 (Sutskever). Attention for translation 2014 (Bahdanau). Adam 2014 (Kingma, Ba). BERT 2018. GPT-3 / scaling laws 2020 (Kaplan). ViT 2020 ("An Image is Worth 16x16 Words"). RAG 2020. Chain-of-thought prompting 2022 (Wei). InstructGPT 2022 (a 13억 InstructGPT was preferred over the 1,750억 GPT-3). Chinchilla 2022 (about 20 training tokens per parameter).
- ChatGPT: released 2022-11-30; 100만 users within 5 days; estimated 1억 monthly users about two months later.
- MNIST: 28×28 grayscale digits, 60,000 training and 10,000 test images.
- The blueprint parts and where they are taught: 토크나이저 29, 임베딩 33, 위치 정보 36, 어텐션 45, 피드포워드 55, 출력 + 소프트맥스 60 (with 14), 뽑아서 붙이기 1–2. Training: 학습 데이터 4 / 63, 사전학습 Part 2 and 7, 대화 연습 73 / 76.
