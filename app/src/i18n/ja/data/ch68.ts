import type { ChapterSpec } from "../../../data/types";

export const MA = [
  [1, 2, 0, 1],
  [2, 0, 1, 3],
  [0, 1, 2, 1],
  [3, 1, 0, 2],
];
export const MB = [
  [2, 0, 1, 1],
  [1, 3, 0, 2],
  [0, 1, 2, 0],
  [1, 2, 1, 3],
];
export const matmul = (a: number[][], b: number[][]) => a.map((row) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)));
export const MC = matmul(MA, MB);

/** The cell picked out in the scene: row 2, column 3 (0-based 1, 2). */
export const PICK = { i: 1, j: 2 };
export const pickTerms = () => MA[PICK.i].map((a, k) => `${a}×${MB[k][PICK.j]}`).join(" + ");

/** GPT-3's attention matrices are d_model × d_model = 12,288 × 12,288 (canonical d_model). */
export const D_MODEL = 12288;
export const GPT3_CELLS = D_MODEL * D_MODEL;

// 説明用の例 speeds for the race
export const CALC_RATE = 20; // one fast calculator: 20 cells per second
export const STUDENT_RATE = 1; // one student: 1 cell per second
export const STUDENTS = 10000;
export const calcTime = (cells: number) => cells / CALC_RATE;
export const studentTime = (cells: number, students = STUDENTS) => Math.ceil(cells / students) / STUDENT_RATE;
export const RACE_CELLS = 10000;

export const ch68: ChapterSpec = {
  id: 68,
  part: 7,
  title: "なぜGPUなの？",
  core: false,
  hook: "AIの会社は、どうしてふつうのコンピューターではなく「グラフィックボード」を山ほど買うのでしょう？",
  steps: [
    { id: "s1", sec: 10, narration: "GPTの計算は、ほとんどが行列の積です（第11章）。GPT-3は1層だけでも12,288 × 12,288の行列がいくつもあります。" },
    { id: "s2", sec: 10, narration: "小さく、4 × 4の行列を2つかけてみましょう。答えのマスは16個。マスごとに行1本と列1本をかけて足します（第9章）。" },
    { id: "s3", sec: 10, narration: "CPUを、とても速い計算機1台としてみましょう。マスを1つずつ順番にうめるので、16マスなら16回順番を待ちます。" },
    { id: "s4", sec: 10, narration: "でも、マスどうしはおたがいを待つ必要がありません。どのマスも、自分の行と自分の列さえあればすぐ計算できるからです。" },
    { id: "s5", sec: 9, narration: "GPUは、単純な計算機が何千個も集まったものです。生徒1万人が1マスずつ受け持つように、全部のマスを一度にうめます。" },
    { id: "s6", sec: 11, narration: "説明用の例で、計算機は1秒に20マス、生徒は1秒に1マス。1万マスなら計算機は500秒、生徒1万人なら1秒で終わり！" },
    { id: "s7", sec: 11, narration: "だから大きなAIは、GPUを何千個もつないで学習します。単語を一度に計算するトランスフォーマーとGPUは、相性ばつぐんです（第41章）。" },
  ],
  playgroundTitle: "計算レース",
  playgroundIntro: "行列の大きさと生徒の人数を選んでスタート！ 速い計算機1台と、たくさんの生徒。全部のマスを先にうめるのはどっち？",
  summary: [
    "行列の積の答えのマスは、それぞれ「行1本・列1本」の計算。おたがいを待つ必要がない。",
    "CPU = 速い計算機が数台で順番に、GPU = 単純な計算機が何千個も同時に。",
    "マスが多いほどGPUが有利。だからAIの学習はGPUでする。",
  ],
  unlocks: "GPUの並列計算",
  unlockLabel: "学習の道具をもうひとつ手に入れました",
  quiz: [
    {
      q: "4 × 4の行列を2つかけると、答えのマスはいくつ？",
      choices: ["8個", "16個", "4個"],
      answer: 1,
      explain: "答えも4 × 4の行列なので16マスです。マスごとに行1本と列1本をかけて足します。",
      review: "s2",
    },
    {
      q: "GPUが行列の積を速くできるのはなぜ？",
      choices: ["マスを分担して同時に計算するから", "計算機1台がものすごくかしこいから", "計算をいくつか飛ばすから"],
      answer: 0,
      explain: "1つ1つは単純でも、何千個もの計算機が同時にマスを分けてうめます。",
      review: "s5",
    },
    {
      q: "行列の積の答えのマスを、同時に計算できるのはなぜ？",
      choices: ["答えが全部同じだから", "前のマスの答えがないと次のマスを計算できないから", "どのマスも自分の行と列さえあればいいから"],
      answer: 2,
      explain: "どのマスも、ほかのマスの答えを使いません。だから待たずに一度に計算できます。",
      review: "s4",
    },
  ],
  labels: {
    tag: "第68章 なぜGPUなの？",
    gpt3Layer: "GPT-3の1層にある行列1つ",
    size: "12,288 × 12,288",
    cells: "約1億5千万マス",
    times: "×",
    equals: "=",
    cellCount: "答えのマス16個",
    rowCol: "行・列 = マス1つ",
    cpu: "CPU：速い計算機1台",
    turn: "順番",
    wait: "16回待つ",
    noWait: "おたがいを待たなくていい！",
    onlyNeeds: "自分の行 + 自分の列があればOK",
    gpu: "GPU：単純な計算機が何千個",
    allAtOnce: "全部のマスを一度に！",
    example: "説明用の例",
    task: "1万マスをうめる",
    calc: "計算機1台（1秒に20マス）",
    students: "生徒1万人（1人が1秒に1マス）",
    sec1: "1秒",
    sec500: "500秒（約8分）",
    done: "終わり！",
    ff: "早送り ▶▶",
    sec: "秒",
    many: "GPUを何千個もつなぐ",
    gpuChip: "GPU",
    sentence: "私は 今日 学校に 行く",
    together: "トランスフォーマー：単語を一度に計算（第41章）",
    next: "第69章：GPTはどれだけ大きくなった？",
  },
};
