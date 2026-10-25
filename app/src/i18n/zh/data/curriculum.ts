// zh titles; the Korean original is src/data/curriculum.ts
export type CurriculumPart = {
  part: number;
  title: string;
  chapters: { n: number; title: string; core?: boolean }[];
};

export const CURRICULUM: CurriculumPart[] = [
  {
    part: 0,
    title: "ChatGPT，你是谁？",
    chapters: [
      { n: 1, title: "猜下一个词游戏", core: true },
      { n: 2, title: "一个词一个词往下写的 AI", core: true },
      { n: 3, title: "AI 七十年时间线" },
      { n: 4, title: "靠规则 vs 靠数据" },
      { n: 5, title: "我们要组装的设计图", core: true },
    ],
  },
  {
    part: 1,
    title: "AI 的语言是数字",
    chapters: [
      { n: 6, title: "一切都是数字" },
      { n: 7, title: "向量：一串数字", core: true },
      { n: 8, title: "离得近就相似" },
      { n: 9, title: "点积：方向有多一致？", core: true },
      { n: 10, title: "矩阵：一捆向量" },
      { n: 11, title: "矩阵乘法 = 空间变换", core: true },
      { n: 12, title: "函数是输入→输出的机器" },
      { n: 13, title: "概率分布" },
      { n: 14, title: "把分数变成概率：Softmax", core: true },
      { n: 15, title: "统一大小：归一化" },
    ],
  },
  {
    part: 2,
    title: "机器是怎样学习的",
    chapters: [
      { n: 16, title: "一个神经元", core: true },
      { n: 17, title: "要会拐弯：激活函数" },
      { n: 18, title: "把层叠起来" },
      { n: 19, title: "前向传播" },
      { n: 20, title: "错了多少：损失", core: true },
      { n: 21, title: "梯度下降", core: true },
      { n: 22, title: "决定步子大小：学习率" },
      { n: 23, title: "反向传播：分摊责任", core: true },
      { n: 24, title: "把练习册分开做" },
      { n: 25, title: "只背真题的学生" },
      { n: 26, title: "动手试试：手写数字" },
      { n: 27, title: "Part 2 Boss 战" },
    ],
  },
  {
    part: 3,
    title: "把文字变成数字",
    chapters: [
      { n: 28, title: "计算机里的文字" },
      { n: 29, title: "词元：AI 读文字的单位", core: true },
      { n: 30, title: "把常挨在一起的片段合并" },
      { n: 31, title: "中文的词元更多吗？" },
      { n: 32, title: "编号的局限" },
      { n: 33, title: "嵌入：意义的坐标", core: true },
      { n: 34, title: "周围的词透露意思" },
      { n: 35, title: "探索嵌入宇宙" },
      { n: 36, title: "怎么知道顺序？", core: true },
    ],
  },
  {
    part: 4,
    title: "Transformer 之前的故事",
    chapters: [
      { n: 37, title: "语言模型 = 句子的概率" },
      { n: 38, title: "只看前面几个词" },
      { n: 39, title: "神经网络语言模型" },
      { n: 40, title: "RNN：传纸条接力" },
      { n: 41, title: "RNN 的局限", core: true },
      { n: 42, title: "翻译器的结构" },
      { n: 43, title: "注意力的诞生", core: true },
    ],
  },
  {
    part: 5,
    title: "彻底搞懂注意力",
    chapters: [
      { n: 44, title: "Attention Is All You Need" },
      { n: 45, title: "词与词互相看", core: true },
      { n: 46, title: "Query · Key · Value", core: true },
      { n: 47, title: "相关度分数" },
      { n: 48, title: "先除再 Softmax" },
      { n: 49, title: "混合出新意思" },
      { n: 50, title: "一次全算完", core: true },
      { n: 51, title: "别偷看未来", core: true },
      { n: 52, title: "用很多双眼睛看" },
      { n: 53, title: "看看真 GPT 的脑袋里" },
    ],
  },
  {
    part: 6,
    title: "组装 Transformer",
    chapters: [
      { n: 54, title: "Transformer 模块设计图" },
      { n: 55, title: "会思考的层", core: true },
      { n: 56, title: "信息高速公路" },
      { n: 57, title: "稳住波动" },
      { n: 58, title: "把模块叠起来" },
      { n: 59, title: "编码器 vs 解码器" },
      { n: 60, title: "从向量到词" },
      { n: 61, title: "从头到尾走一遍", core: true },
      { n: 62, title: "Part 6 Boss 战：设计图完成" },
    ],
  },
  {
    part: 7,
    title: "让 GPT 学习：预训练",
    chapters: [
      { n: 63, title: "教科书是互联网" },
      { n: 64, title: "没有答案的学习", core: true },
      { n: 65, title: "惊讶有多大", core: true },
      { n: 66, title: "训练循环转一圈", core: true },
      { n: 67, title: "更聪明的下坡" },
      { n: 68, title: "为什么是 GPU？" },
      { n: 69, title: "GPT-1 → 2 → 3" },
      { n: 70, title: "越大越聪明", core: true },
      { n: 71, title: "只看例子也能学会" },
    ],
  },
  {
    part: 8,
    title: "ChatGPT 的诞生",
    chapters: [
      { n: 72, title: "聪明却不听话的模型", core: true },
      { n: 73, title: "照着标准答案学", core: true },
      { n: 74, title: "人来排名次" },
      { n: 75, title: "AI 评分员" },
      { n: 76, title: "用表扬来打磨", core: true },
      { n: 77, title: "对话其实是一份长文档" },
      { n: 78, title: "2022 年 11 月 30 日" },
      { n: 79, title: "打造安全的 AI" },
    ],
  },
  {
    part: 9,
    title: "回答诞生的瞬间",
    chapters: [
      { n: 80, title: "挑选的方法" },
      { n: 81, title: "创造力旋钮", core: true },
      { n: 82, title: "缩小候选范围" },
      { n: 83, title: "AI 的记忆上限" },
      { n: 84, title: "一本正经地胡说", core: true },
      { n: 85, title: "懂了结构就看懂提示词" },
    ],
  },
  {
    part: 10,
    title: "ChatGPT 之后的世界",
    chapters: [
      { n: 86, title: "长了眼睛的 AI" },
      { n: 87, title: "先思考再回答", core: true },
      { n: 88, title: "先查资料再回答" },
      { n: 89, title: "长出手脚的 AI" },
      { n: 90, title: "我手机里的 AI" },
      { n: 91, title: "AI 与我们" },
    ],
  },
  {
    part: 11,
    title: "毕业项目",
    chapters: [
      { n: 92, title: "设计迷你 GPT" },
      { n: 93, title: "做我自己的分词器" },
      { n: 94, title: "在浏览器里训练", core: true },
      { n: 95, title: "来生成吧" },
      { n: 96, title: "毕业典礼" },
    ],
  },
];

export const TOTAL_CHAPTERS = CURRICULUM.reduce((n, p) => n + p.chapters.length, 0);

export const partTitle = (part: number) => CURRICULUM.find((p) => p.part === part)?.title ?? "";
