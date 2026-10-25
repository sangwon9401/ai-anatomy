# Translation guide (English, Japanese, Chinese)

The Korean course is the original. English (`en`), Japanese (`ja`) and Simplified Chinese (`zh`) are **adaptations** of it for high school students of about 15–16 in those countries: same chapters, same pictures, same playgrounds, same pedagogy, written as if a good teacher in that language had made it. Read `CHAPTER_GUIDE.md` first; everything there still applies (voice, honesty, illustrative-number labels, scene rules, the check loop).

## How a translation is stored

`app/src/i18n/<locale>/` mirrors `app/src/`. When the app (Vite), the video renders (Remotion) and the page generator build a locale, every import of `src/X` is replaced by `src/i18n/<locale>/X` **if that file exists** (`scripts/locale-overlay.mjs`). So you translate by creating overlay files at the mirrored path, for example:

| Korean original | English overlay |
|---|---|
| `src/data/ch16.ts` | `src/i18n/en/data/ch16.ts` |
| `src/data/part2-toy.ts` | `src/i18n/en/data/part2-toy.ts` |
| `src/playgrounds/part2/NeuronLab.tsx` | `src/i18n/en/playgrounds/part2/NeuronLab.tsx` |
| `src/scenes/Ch16Scene.tsx` (only if needed) | `src/i18n/en/scenes/Ch16Scene.tsx` |

Rules for overlay files:

- Start by copying the Korean file, then translate. Keep every export name, type and shape identical: the Korean scenes and playgrounds import these files and TypeScript checks them against that use.
- **Imports inside an overlay must point at the original location** with a path relative to the overlay file, e.g. in `src/i18n/en/data/ch16.ts`: `import type { ChapterSpec } from "../../../data/types";` and `import { NEURON } from "../../../data/part2-toy";`. The build swaps in the overlay of anything that has one. Same for CSS: `import "../../../../playgrounds/part2/style.css";`.
- Only create overlays for files that show text or hold language-specific data. Never edit Korean files, and never edit files outside `src/i18n/<your locale>/` (plus your scratch directory). Shared per-locale files already exist and are owned by the integrator: `locale.ts`, `locale.css`, `scenes/fonts.ts`, `ui/strings.ts`, `data/curriculum.ts` (all 96 chapter and part titles; use these exact titles).
- Playgrounds: copy, translate the visible strings, keep the logic byte-for-byte the same. Scenes: overlay a scene only when it draws literal Korean outside `labels`, or when translated labels cannot fit the layout. Change as little as possible.

## Chapter specs

- `id`, `part`, `core`, step `id`s, step count, quiz count and `answer` indices stay the same unless the adaptation truly needs otherwise (scenes look steps up by id).
- `title` = the title in this locale's `data/curriculum.ts`.
- **Never shorten a step's `sec`** (the scene's beats are timed inside it); lengthen it if the narration needs more time. Narration has to fit three caption lines: English ≤ about 130 characters, Japanese and Chinese ≤ about 70 characters.
- `labels`: every drawn string, translated, and it must fit where the Korean one was. English is usually wider than Korean: shorten the wording first; overlay the scene only if wording cannot fix it.
- `unlockLabel`: translate the Korean phrase, one phrase per Part as in Korean.
- The tag label is the locale's chapter title format: en `14. Scores into probabilities: softmax`, ja `第14章 スコアを確率に：ソフトマックス`, zh `第 14 章 把分数变成概率：Softmax`.

## Things that must be adapted, not translated

- **Running example.** Korean: `나는 오늘 학교에 → 간다 52%, 갔다 21%, 늦었다 12%`, scores `간다 3, 갔다 2, 늦었다 1, 피자 −1`, four-token sentence `나는 오늘 학교에 간다`.
  - en: `I walk to → school 52%, the 21%, work 12%`, scores `school 3, the 2, work 1, pizza −1`, sentence `I walk to school`.
  - ja: `私は 今日 学校に → 行く 52%, 行った 21%, 遅れた 12%`, scores `行く 3, 行った 2, 遅れた 1, ピザ −1`, sentence `私は 今日 学校に 行く`.
  - zh: `我 今天 去 → 学校 52%, 图书馆 21%, 公园 12%`, scores `学校 3, 图书馆 2, 公园 1, 披萨 −1`, sentence `我 今天 去 学校`.
  - Keep the numbers; where a chapter shows tokens/pieces of the sentence, use the locale's pieces.
- **People.** 민지 / 준호 / 서연 → en Mia / Noah / Emma, ja ゆい / はると / さくら, zh 小雨 / 小杰 / 小美.
- **Part 2's neuron** (떡볶이 맛집 판별: 맵기, 가격, 줄 길이) → en "Is this taco truck a hit?", ja 「このラーメン屋は当たり?」, zh 「这家火锅店好吃吗?」. Same inputs (spiciness, price, line length) and the same numbers.
- **Language-specific chapters:**
  - 6 (모든 것은 숫자다): the '배'/'밤' neighbouring-code example → letters that are neighbours in Unicode in this language (en `A` 65 / `B` 66; ja `あ` / `い`; zh pick two neighbouring 汉字). Check every code point with a script.
  - 28 (컴퓨터 속 글자, 한글 조합): rewrite around this language's writing system with the same goal ("characters become numbers, and some are built from parts"): en letters, ASCII → Unicode → UTF-8 bytes (é, emoji); ja ひらがな・カタカナ・漢字, Unicode blocks, UTF-8 bytes; zh 汉字, the CJK block, UTF-8 bytes, 部首 as building parts. Every number computed by script.
  - 29–31 (tokens): every split and count must come from the real tokenizers on this language's sentences (o200k_base for GPT-4o, cl100k_base for GPT-4, r50k_base for GPT-3). A Python venv with `tiktoken` already exists: `/private/tmp/claude-501/-Users-sangwon-workspace-my-platform/161ef54f-9060-4f0a-913b-a742884b9df8/scratchpad/part3/venv/bin/python`. Chapter 31 compares this language with English (en: compare English with Korean, Japanese, Chinese and say which costs more).
  - 34–35 (word maps): translate the words; make sure the vector arithmetic still lands on the right word with your numbers.
  - 36 (word order): en "Dog bites man" / "Man bites dog"; zh 狗咬人 / 人咬狗 (word order really carries meaning); ja has particles like Korean, so keep the Korean chapter's honest particle explanation and its time example (10時11分 / 11時10分).
  - 38 (n-gram): write an original small corpus in the language (no copyrighted text) and recompute the table by script.
  - 45 ('배' = fruit / boat / belly): pick a word in the language with three senses the icons can show (or overlay `scenes/icons.tsx` with new glyphs): en e.g. "bat" or "bank"; ja e.g. 「かみ」(紙・髪・神) written in kana; zh e.g. 「苹果」(水果/手机公司) or another. Chapters 46–51 continue from it, so keep them consistent with the running example above.
  - 53: the GPT-2 attention maps are real data on English sentences; keep the data, translate the explanation.
  - 69 (building heights: 롯데월드타워): use a famous building of that country with a correct floor count (en: a well-known US skyscraper; ja: e.g. あべのハルカス or 東京スカイツリー if you explain it is not floors; zh: 上海中心大厦). Recompute the ratios.
  - 92–95 (mini GPT): write corpora in the language: proverbs, traditional/public-domain nursery rhymes only (never copyrighted lyrics), and textbook-style sentences you write. Retrain the embedded checkpoints with the same code (`src/playgrounds/part11/minigpt.ts`; the original training scripts are in `/private/tmp/claude-501/-Users-sangwon-workspace-my-platform/161ef54f-9060-4f0a-913b-a742884b9df8/scratchpad/part11/`, e.g. `make-checkpoints.ts`) and update every number the scenes show (losses, step counts, parameter counts, sample outputs) from the real run.
  - School references (고1, 공통수학1, 2022 개정 교육과정) → "high school" in general terms for that country; do not claim a specific national curriculum unless sure.
  - Korean-only cultural references (food, places, holidays, school life) → natural equivalents.
- **Facts stay facts.** Dates, names, model sizes and the canonical facts in `CHAPTER_GUIDE.md` do not change.

## Language and terms

- en: friendly, second person, short sentences, no slang; US spelling. Terms: token, embedding, attention, softmax, loss, gradient descent, backpropagation, learning rate, overfitting, parameter, vector, dot product, matrix. Illustrative label: "illustrative example".
- ja: です・ます調, やさしい言い回し, 中高生に読める漢字. Full-width punctuation (、。？！：). Terms: トークン, 埋め込み, アテンション, ソフトマックス, ニューロン, 損失, 勾配降下法, 誤差逆伝播法, 学習率, 過学習, パラメータ, ベクトル, 内積, 行列. Illustrative label: 「説明用の例」.
- zh: 简体, 亲切自然的口吻, 高中生能懂. Full-width punctuation (，。？！：). Terms: 词元(token), 嵌入, 注意力, Softmax, 神经元, 损失, 梯度下降, 反向传播, 学习率, 过拟合, 参数, 向量, 点积, 矩阵. Illustrative label: 「示意数据」. Put a space between Chinese and Latin letters or numbers (第 14 章, GPT-3 有 1,750 亿个参数).
- Numbers: write large numbers the local way (en 175 billion, ja 1,750億, zh 1750 亿).

## Check loop (every chapter)

1. `cd app && npx tsc --noEmit -p . 2>&1 | grep -i "i18n/<locale>"` prints nothing for your files.
2. `node scripts/i18n-check.mjs <locale> <chapter ids…>` reports no Korean left for your chapters (Korean may stay only where the chapter deliberately shows Korean, e.g. comparing languages in 31).
3. `rm -f out/stills/<locale>-chNN-*; node scripts/stills.mjs --locale <locale> --part N chNN:ends` (Part 0–1 and 45: omit `--part`), then `python3 scripts/contact.py <scratch>/<locale>-chNN.png 4 out/stills/<locale>-chNN-*.png` and look at it with the Read tool: every string translated, nothing overflowing its box or the canvas, nothing below y 1080, line breaks sensible for the language. Fix and render again.
4. Re-read the playground overlay for untranslated strings and confirm its logic is unchanged (`diff` against the Korean file should show only strings).
