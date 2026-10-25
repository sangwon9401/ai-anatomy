import type { ChapterSpec } from "../../../data/types";

// 64×64 pixel-art picture drawn for this chapter (generated from simple shapes, no outside image).
// Each digit is a colour index into PALETTE.
export const PIC_N = 64;
export const PIC: string[] = [
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000666600000000000000000000000000000000000000000000000",
  "0000000000066666666000000000000000000000000000000022222200000000",
  "0000000006666666666600000000000000000000000000002222222222000000",
  "0000000666666666666660000000000000000000000000002222222222000000",
  "0000006666666666666666600000000000000000000000022222222222200000",
  "0000006666666666666666660000000000000000000000022222222222200000",
  "0000006666666666666666660000000000000000000000022222222222200000",
  "0000006666666666666666660000000000000000000000022222222222200000",
  "0000000666666000066666600000000000000000000000022222222222200000",
  "0000000006600000000460000000000000004000000000022222222222200000",
  "0000000000000000000440000000000000044000000000002222222222000000",
  "0000000000000000004354000000000000453400000000002222222222000000",
  "0000000000000000004353400000000004353400000000000022222200000000",
  "0000000000000000004355340000000043553400000000000000000000000000",
  "0000000000000000004355534444444435553400000000000000000000000000",
  "0000000000000000004355553333333355553400000000000000000000000000",
  "0000000000000000004353333333333333353400000000000000000000000000",
  "0000000000000000043333333333333333333340000000000000000000000000",
  "0000000000000000043333333333333333333340000000000000000000000000",
  "0000000000000000043333333333333333333340000000000000000000000000",
  "0000000000000000043333333333333333333340000000000000000000000000",
  "0000000000000000433333333333333333333334000000000000000000000000",
  "0000000000000000433333333333333333333334000000000000000000000000",
  "0000000000000000433333346433333346433334000000000000000000000000",
  "0000000000000000433333344433333344433334000000000000000000000000",
  "0000000000000000433333344433333344433334000000000000000000000000",
  "0000000000000000433333344433333344433334000000000000000000000000",
  "0000000000000000433333333333333333333334000000000000000000000000",
  "0000000000000000444444333335553333344444400000000000000000000000",
  "0000000000000000043333333333533333333340000000000044400000000000",
  "0000000000000000043444333333433333344440000000000043340000000000",
  "0000000000000000444333333344344333333444400000000043340000000000",
  "0000000000000000000433333333333333334000000000000004334000000000",
  "0000000000000000000043333333333333334000000000000004333400000000",
  "0000000000000000000004333333333333333440000000000000433400000000",
  "0000000000000000000043333333333333333334000000000000043400000000",
  "0000000000000000000433333333333333333333400000000000433400000000",
  "0000000000000000004333333333333333333333340000000000433400000000",
  "0000000000000000043333333333333333333333334000000000433400000000",
  "0000000000000000043333333333333333333333334000000000433400000000",
  "0000000000000000433333343333333333334333333400000000433400000000",
  "0000000000000000433333334333333333343333333400000000433400000000",
  "0000000000000000433333333433333333433333333400000004333400000000",
  "0000000000000000433333333333333333333333333400000043334000000000",
  "0000000000000000433333333333333333333333333400000433340000000000",
  "0000000000000000433333333333333333333333333400004333400000000000",
  "0000000000000000043333333333333333333333333344443334000000000000",
  "0000000000000000043333333333333333333333333333333334000000001111",
  "1110000000000000014333333333333333333333333333333440001111111111",
  "1111111111111111111433333333333333333333333444444111111111111111",
  "1111111111111111111143333333333333333334444111111111111111111111",
  "1111111111111111111114436663333366633441111111111111111111111111",
  "1111111111111111111111144444444444444111111111111111111111111111",
  "1111111111111111111111111111111111111111111111111111111111111111",
  "1111111111111111111111111111111111111111111111111111111111111111",
  "1111111111111111111111111111111111111111111111111111111111111111",
  "1111111111111111111111111111111111111111111111111111111111111111",
  "1111111111111111111111111111111111111111111111111111111111111111",
  "1111111111111111111111111111111111111111111111111111111111111111",
  "1111111111111111111111111111111111111111111111111111111111111111"
,
];

/** Colour of each index, as a scene token, plus the light-theme RGB numbers shown in the playground. */
export const PALETTE: { token: string; name: string; rgb: [number, number, number] }[] = [
  { token: "var(--hl-sky)", name: "sky", rgb: [157, 208, 255] },
  { token: "var(--hl-mint)", name: "grass", rgb: [141, 227, 191] },
  { token: "var(--hl-yellow)", name: "sun", rgb: [255, 227, 90] },
  { token: "var(--hl-orange)", name: "fur", rgb: [255, 194, 122] },
  { token: "var(--ink)", name: "lines", rgb: [28, 42, 74] },
  { token: "var(--hl-pink)", name: "nose", rgb: [255, 163, 196] },
  { token: "var(--paper)", name: "white", rgb: [251, 252, 254] },
];

/** One SVG path per colour (horizontal runs of pixels), in picture pixel units. */
export const PIC_PATHS: { token: string; d: string }[] = PALETTE.map((p, ci) => {
  let d = "";
  PIC.forEach((row, y) => {
    let x = 0;
    while (x < PIC_N) {
      if (Number(row[x]) !== ci) {
        x++;
        continue;
      }
      let e = x;
      while (e < PIC_N && Number(row[e]) === ci) e++;
      d += `M${x} ${y}h${e - x}v1h${x - e}z`;
      x = e;
    }
  });
  return { token: p.token, d };
}).filter((p) => p.d);

export const PATCH = 16; // pixels per patch side, as in ViT
export const GRID = PIC_N / PATCH; // 4 × 4 patches
export const ZOOM_PATCH = 5; // row 1, col 1: the cat's left eye
export const QUESTION_TOKENS = ["What's", "in", "this", "photo?"];
export const TEXT_TOKENS = ["I", "walk", "to"];

export const ch86: ChapterSpec = {
  id: 86,
  part: 10,
  title: "AI with eyes",
  core: false,
  hook: "How can an AI that only read text look at a photo and describe it?",
  steps: [
    { id: "s1", sec: 8, narration: "AI today can tell you what's in a photo. But a model is a machine that reads tokens (chapter 29). How do you put a photo in?" },
    { id: "s2", sec: 8, narration: "A photo is pixel numbers (chapter 6). Even a small 64×64 photo has 4,096 pixels. One token per pixel makes the line far too long." },
    { id: "s3", sec: 8, narration: "So we cut the photo like a checkerboard into 16×16-pixel pieces called patches. A 64×64 photo becomes 4×4 = 16 pieces." },
    { id: "s4", sec: 9, narration: "Each patch is 16×16 pixels × 3 colors (red, green, blue) = 768 numbers. Matrix multiplication (chapter 11) makes them one vector." },
    { id: "s5", sec: 8, narration: "Line the patches up in reading order and add position information (chapter 36). Now it looks just like a line of word tokens." },
    { id: "s6", sec: 8, narration: "A 2020 paper put this idea right in its title: 'An Image is Worth 16x16 Words'. The model is called ViT." },
    { id: "s7", sec: 9, narration: "Many photo-chatting AIs read image tokens, then word tokens, in one line. Handling text and images together is called multimodal." },
  ],
  playgroundTitle: "Cutting a photo into patches",
  playgroundIntro: "Change the patch size and cut up the photo. Each piece is one token. What happens if you shuffle the pieces?",
  summary: [
    "Cut a photo into 16×16-pixel pieces (patches), and each piece becomes one token.",
    "A matrix multiplication turns a patch's 768 numbers into a vector, and position information is added.",
    "Read image tokens and word tokens in one line, and you get a multimodal AI (ViT, 2020).",
  ],
  unlocks: "Patch tokens",
  unlockLabel: "You got a new ability card",
  quiz: [
    {
      q: "How does ViT turn a photo into tokens?",
      choices: ["One token for every pixel", "It cuts the photo into 16×16-pixel pieces (patches)", "It first describes the photo in words"],
      answer: 1,
      explain: "A token for every pixel makes the line far too long. One 16×16-pixel piece is one token.",
      review: "s3",
    },
    {
      q: "How many numbers are in one 16×16-pixel color patch?",
      choices: ["768", "256", "16"],
      answer: 0,
      explain: "16 × 16 = 256 pixels, and each pixel has red, green and blue, so 256 × 3 = 768 (chapter 6).",
      review: "s4",
    },
    {
      q: "Why add position information to the line of patch tokens?",
      choices: ["To make the patch colors stronger", "To reduce the number of patches", "To tell where in the photo each piece came from"],
      answer: 2,
      explain: "If the pieces get shuffled, the picture can't be recognized. Like word tokens, they need position information (chapter 36).",
      review: "playground",
    },
  ],
  labels: {
    tag: "86. AI with eyes",
    answer: "There's a cat!",
    model: "Model",
    readsTokens: "A model reads tokens (ch. 29)",
    how: "And photos?",
    pixels: "64 × 64 = 4,096 pixels",
    onePer: "1 pixel = 1 token?",
    tooLong: "Way too long!",
    pixelsMore: "… 4,096 in all",
    cut: "↑ 16 × 16 pixels = 1 patch",
    count: "4 × 4 = 16 pieces",
    px: "16 × 16 pixels",
    zoom: "One patch, zoomed in",
    rgb: "× 3 (red · green · blue)",
    nums: "= 768 numbers",
    matmul: "× matrix (ch. 11)",
    vec: "1 vector = 1 token",
    order: "In reading order →",
    pos: "+ position (ch. 36)",
    same: "↑ Same shape as a line of word tokens",
    year: "A 2020 paper",
    title1: "An Image is Worth",
    title2: "16x16 Words",
    gloss: "= one picture = 16×16 words",
    vit: "ViT = Vision Transformer",
    real: "In practice: 224×224 photo → 14×14 = 196 pieces",
    imgTok: "16 image tokens",
    txtTok: "← word tokens",
    multi: "Multimodal = text + images together",
  },
};
