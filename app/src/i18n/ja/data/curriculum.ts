// ja titles; the Korean original is src/data/curriculum.ts
export type CurriculumPart = {
  part: number;
  title: string;
  chapters: { n: number; title: string; core?: boolean }[];
};

export const CURRICULUM: CurriculumPart[] = [
  {
    part: 0,
    title: "ChatGPT、きみは誰？",
    chapters: [
      { n: 1, title: "次の言葉当てゲーム", core: true },
      { n: 2, title: "一語ずつ書いていくAI", core: true },
      { n: 3, title: "AI 70年の年表" },
      { n: 4, title: "ルールで vs データで" },
      { n: 5, title: "これから組み立てる設計図", core: true },
    ],
  },
  {
    part: 1,
    title: "AIの言葉は数字",
    chapters: [
      { n: 6, title: "すべては数字" },
      { n: 7, title: "ベクトル：数字の列", core: true },
      { n: 8, title: "近ければ似ている" },
      { n: 9, title: "内積：どれだけ同じ向き？", core: true },
      { n: 10, title: "行列：ベクトルの束" },
      { n: 11, title: "行列の積 = 空間の変換", core: true },
      { n: 12, title: "関数は入力→出力の機械" },
      { n: 13, title: "確率分布" },
      { n: 14, title: "スコアを確率に：ソフトマックス", core: true },
      { n: 15, title: "大きさをそろえる：正規化" },
    ],
  },
  {
    part: 2,
    title: "機械はどうやって学ぶのか",
    chapters: [
      { n: 16, title: "ニューロン1つ", core: true },
      { n: 17, title: "曲げてこそ：活性化関数" },
      { n: 18, title: "層を重ねると" },
      { n: 19, title: "順伝播" },
      { n: 20, title: "どれだけ間違えた？ 損失", core: true },
      { n: 21, title: "勾配降下法", core: true },
      { n: 22, title: "歩幅を決める：学習率" },
      { n: 23, title: "誤差逆伝播法：責任の分け合い", core: true },
      { n: 24, title: "問題集を分けて解く" },
      { n: 25, title: "過去問だけ覚えた生徒" },
      { n: 26, title: "体験：手書き数字" },
      { n: 27, title: "Part 2 ボス戦" },
    ],
  },
  {
    part: 3,
    title: "文字を数字に",
    chapters: [
      { n: 28, title: "コンピューターの中の文字" },
      { n: 29, title: "トークン：AIの文字の単位", core: true },
      { n: 30, title: "よく続くかけらをくっつける" },
      { n: 31, title: "日本語はトークンが多い？" },
      { n: 32, title: "番号札の限界" },
      { n: 33, title: "埋め込み：意味の座標", core: true },
      { n: 34, title: "まわりの単語が意味を教えてくれる" },
      { n: 35, title: "埋め込み宇宙の探検" },
      { n: 36, title: "順番はどうやってわかる？", core: true },
    ],
  },
  {
    part: 4,
    title: "トランスフォーマー以前の物語",
    chapters: [
      { n: 37, title: "言語モデル = 文の確率" },
      { n: 38, title: "直前の数語だけを見る" },
      { n: 39, title: "ニューラル言語モデル" },
      { n: 40, title: "RNN：メモのリレー" },
      { n: 41, title: "RNNの限界", core: true },
      { n: 42, title: "翻訳機のしくみ" },
      { n: 43, title: "アテンションの誕生", core: true },
    ],
  },
  {
    part: 5,
    title: "アテンション完全攻略",
    chapters: [
      { n: 44, title: "Attention Is All You Need" },
      { n: 45, title: "単語どうしが見つめ合う", core: true },
      { n: 46, title: "Query・Key・Value", core: true },
      { n: 47, title: "関連度スコア" },
      { n: 48, title: "割ってからソフトマックス" },
      { n: 49, title: "混ぜて新しい意味をつくる" },
      { n: 50, title: "一度にまとめて計算する", core: true },
      { n: 51, title: "未来をのぞき見しないで", core: true },
      { n: 52, title: "たくさんの目で見る" },
      { n: 53, title: "本物のGPTの頭の中をのぞく" },
    ],
  },
  {
    part: 6,
    title: "トランスフォーマーを組み立てる",
    chapters: [
      { n: 54, title: "トランスフォーマーブロックの設計図" },
      { n: 55, title: "考える層", core: true },
      { n: 56, title: "情報の高速道路" },
      { n: 57, title: "ゆれを抑える" },
      { n: 58, title: "ブロックを積み重ねると" },
      { n: 59, title: "エンコーダー vs デコーダー" },
      { n: 60, title: "ベクトルから単語へ" },
      { n: 61, title: "最初から最後までたどる", core: true },
      { n: 62, title: "Part 6 ボス戦：設計図の完成" },
    ],
  },
  {
    part: 7,
    title: "GPTに勉強させる：事前学習",
    chapters: [
      { n: 63, title: "教科書はインターネット" },
      { n: 64, title: "答えのない勉強", core: true },
      { n: 65, title: "驚きの大きさ", core: true },
      { n: 66, title: "訓練ループを1周", core: true },
      { n: 67, title: "かしこい下り坂" },
      { n: 68, title: "なぜGPUなの？" },
      { n: 69, title: "GPT-1 → 2 → 3" },
      { n: 70, title: "大きいほど賢くなる", core: true },
      { n: 71, title: "例を見せるだけで学ぶ" },
    ],
  },
  {
    part: 8,
    title: "ChatGPTの誕生",
    chapters: [
      { n: 72, title: "賢いけれど言うことを聞かないモデル", core: true },
      { n: 73, title: "模範解答をまねる", core: true },
      { n: 74, title: "人が順位をつける" },
      { n: 75, title: "AIの採点係" },
      { n: 76, title: "ほめて磨く", core: true },
      { n: 77, title: "会話は実は長い文書" },
      { n: 78, title: "2022年11月30日" },
      { n: 79, title: "安全なAIをつくる" },
    ],
  },
  {
    part: 9,
    title: "答えが生まれる瞬間",
    chapters: [
      { n: 80, title: "選び方" },
      { n: 81, title: "創造性のダイヤル", core: true },
      { n: 82, title: "候補をしぼる" },
      { n: 83, title: "AIの記憶の限界" },
      { n: 84, title: "もっともらしいウソ", core: true },
      { n: 85, title: "しくみがわかると見えるプロンプト" },
    ],
  },
  {
    part: 10,
    title: "ChatGPT以後の世界",
    chapters: [
      { n: 86, title: "目を持ったAI" },
      { n: 87, title: "考えてから答える", core: true },
      { n: 88, title: "調べてから答える" },
      { n: 89, title: "手足を持ったAI" },
      { n: 90, title: "スマホの中のAI" },
      { n: 91, title: "AIとわたしたち" },
    ],
  },
  {
    part: 11,
    title: "卒業プロジェクト",
    chapters: [
      { n: 92, title: "ミニGPTを設計する" },
      { n: 93, title: "自分のトークナイザーをつくる" },
      { n: 94, title: "ブラウザで訓練する", core: true },
      { n: 95, title: "文章を生成してみる" },
      { n: 96, title: "卒業式" },
    ],
  },
];

export const TOTAL_CHAPTERS = CURRICULUM.reduce((n, p) => n + p.chapters.length, 0);

export const partTitle = (part: number) => CURRICULUM.find((p) => p.part === part)?.title ?? "";
