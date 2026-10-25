import type { ChapterSpec } from "../../../data/types";

export type View = { who: string; say: string };
export type Card = {
  key: string;
  title: string;
  c: "yellow" | "sky" | "mint" | "violet";
  /** scene: the question and three short viewpoints */
  q: string;
  sceneViews: string[];
  /** playground */
  story: string;
  views: View[];
  fact: string;
  talk: string;
};

export const CARDS: Card[] = [
  {
    key: "copy",
    title: "著作权",
    c: "yellow",
    q: "AI 能拿别人的画学习吗？AI 画的画归谁？",
    sceneViews: ["人也是看着别人的作品学习的呀。", "应该先征得创作者同意，并给予报酬。", "写提示词的人能占几分功劳？"],
    story: "小琳想把用 AI 画的画，拿去参加学校的美术比赛。",
    views: [
      { who: "画家", say: "如果拿我的画来学习，就应该先征得同意，还要给报酬。" },
      { who: "AI 开发者", say: "人也是看着别人的作品学习的。我觉得学习本身没有问题。" },
      { who: "小琳", say: "提示词是我想了很久、改了很多遍的，里面也有我的努力。" },
      { who: "比赛评委", say: "最好写明有没有用 AI，并且提前定好规则。" },
    ],
    fact: "中国《著作权法》所说的作品，是指“文学、艺术和科学领域内具有独创性并能以一定形式表现的智力成果”。AI 生成的内容该怎么看待，很多国家还在讨论。",
    talk: "如果由我来办比赛，关于 AI 画作会定什么规则？",
  },
  {
    key: "bias",
    title: "偏见",
    c: "sky",
    q: "数据偏向一边，AI 也会跟着偏。该怎么办？",
    sceneViews: ["应该把数据收集得更均衡来纠正。", "什么才算“公平”，由谁来定？", "有时也需要如实反映现实。"],
    story: "让 AI 画十张“医生”，结果全是同一种性别。",
    views: [
      { who: "AI 开发者", say: "应该把数据收集得更均衡，再检查结果、加以修正。" },
      { who: "做统计的人", say: "有时如实呈现现实中的比例，才是对的。" },
      { who: "用户", say: "怎样才算“公平”，由谁来定？希望决定的过程也能公开。" },
      { who: "学生", say: "以后看 AI 的回答，要多想一步：“会不会有偏见？”" },
    ],
    fact: "模型会原样学会训练数据里的规律（第 4 章）。数据里出现得越多的样子，在结果里也越常出现。",
    talk: "想看看 AI 的回答有没有偏见，可以问它哪些问题？",
  },
  {
    key: "privacy",
    title: "个人信息",
    c: "mint",
    q: "我在聊天里写的事、朋友的照片会去哪？",
    sceneViews: ["方便嘛，什么都可以问。", "朋友的信息要先经过朋友同意。", "先查看保存和训练的设置。"],
    story: "小凯想把朋友们的合照传给 AI，让它“说说谁是谁”。",
    views: [
      { who: "小凯", say: "多方便啊。拿到回答就完了，有什么问题？" },
      { who: "照片里的朋友", say: "我也想知道我的脸和名字会存到哪里。先问问我嘛。" },
      { who: "服务公司", say: "对话可能会被保存或用来改进服务，所以我们写在了用户协议和设置里。" },
      { who: "老师", say: "上传之前，先想一想：“这是不是别人的信息？”" },
    ],
    fact: "不同的服务，保存对话的时长、是否用于训练都不一样，有些可以在设置里关闭。能认出某个人的脸和名字，也属于个人信息。",
    talk: "哪些可以放进 AI、哪些不能放，如果给我们班定规则会怎么定？",
  },
  {
    key: "career",
    title: "未来职业",
    c: "violet",
    q: "AI 替人做了很多工作，我该准备些什么？",
    sceneViews: ["会有很多工作消失。", "也会出现很多新工作。", "会用好 AI 的能力会越来越重要。"],
    story: "小乐的梦想是当漫画家，可看到 AI 会画画，开始发愁了。",
    views: [
      { who: "担心的人", say: "画画的工作机会可能会变少。" },
      { who: "期待的人", say: "把 AI 当工具，一个人也能做出更多作品。" },
      { who: "在职的漫画家", say: "编故事、和读者交流，这些很大程度上还得靠人。" },
      { who: "生涯规划老师", say: "不管做什么工作，懂 AI、会用 AI 的能力都会有帮助。" },
    ],
    fact: "AI 会对就业产生多大影响，专家们的预测并不一致。也有观点认为，比起整份工作消失，更常见的是工作方式发生变化。",
    talk: "在我梦想的职业里，哪些事可以交给 AI 帮忙，哪些事一定要我自己做？",
  },
];

/** Part 10 recap: what each chapter added (the unlock of each chapter). */
export const ABILITIES = [
  { ch: 86, t: "图块词元", c: "yellow" as const },
  { ch: 87, t: "写出解题过程", c: "mint" as const },
  { ch: 88, t: "先查资料再回答", c: "sky" as const },
  { ch: 89, t: "使用工具", c: "orange" as const },
  { ch: 90, t: "模型压缩", c: "violet" as const },
  { ch: 91, t: "与 AI 共处之道", c: "pink" as const },
];

export const ch91: ChapterSpec = {
  id: 91,
  part: 10,
  title: "AI 与我们",
  core: false,
  hook: "AI 画的画归谁？在 AI 时代，我该准备些什么？",
  steps: [
    { id: "s1", sec: 8, narration: "AI 现在能看、能思考、能查资料，还会用工具。这股力量怎么用，最终由人来决定。来翻开讨论卡吧！" },
    { id: "s2", sec: 9, narration: "第一，著作权。AI 学的是人们的文字和画。有人说“人也看着学”，有人说“要先同意、给报酬”。" },
    { id: "s3", sec: 9, narration: "第二，偏见。数据偏向一边，模型也会原样学去（第 4 章）。如果要纠正，什么才算“公平”，由谁来定？" },
    { id: "s4", sec: 9, narration: "第三，个人信息。聊天里写的事、朋友的照片会去哪里？各家服务保存和使用的方式不同，要查清楚。" },
    { id: "s5", sec: 9, narration: "第四，未来职业。AI 接手一些工作后，职业会怎么变？哪些会消失、哪些会出现，预测各不相同。" },
    { id: "s6", sec: 8, narration: "四张卡都没有唯一的正确答案。但只要懂得 AI 是怎么运作的，就能提出更好的问题，做出更好的判断。" },
    { id: "s7", sec: 8, narration: "在 Part 10，AI 得到了眼睛、解题、检索、工具和手机里的位置。Part 11 要亲手做出自己的迷你 GPT！" },
  ],
  playgroundTitle: "讨论卡",
  playgroundIntro: "挑一张卡，对几个人的想法按下“赞同 / 不好说 / 反对”。没有标准答案，和朋友聊一聊会更好。",
  summary: [
    "著作权、偏见、个人信息、未来职业：这些问题都没有唯一的正确答案。",
    "偏见来自数据。放进自己和朋友的信息之前，要多想一步。",
    "Part 10：眼睛（图块）、解题、检索（RAG）、工具、压缩。接下来是 Part 11 自己的迷你 GPT！",
  ],
  unlocks: "与 AI 共处之道",
  unlockLabel: "又得到一张新能力卡",
  quiz: [
    {
      q: "AI 给出带偏见的回答，最主要的原因是？",
      choices: ["训练数据里带偏见的内容很多", "AI 故意偏向某一方", "电脑太慢"],
      answer: 0,
      explain: "模型会原样学会数据里的规律（第 4 章）。数据偏了，回答也可能偏。",
      review: "s3",
    },
    {
      q: "把朋友的照片传给聊天 AI 之前，应该想到什么？",
      choices: ["AI 马上就会全部忘掉", "照片可能被保存或使用，而且需要朋友同意", "照片不算个人信息"],
      answer: 1,
      explain: "每种服务的保存方式都不同。能认出某个人的照片，就是那个人的个人信息。",
      review: "s4",
    },
    {
      q: "Part 10 学过的方法里，先找文档放进提示词再让它回答的是？",
      choices: ["量化", "ViT", "RAG（先查资料再回答）"],
      answer: 2,
      explain: "RAG 把检索到的文档和问题一起放进去，得到带出处的回答（第 88 章）。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 91 章 AI 与我们",
    cards: "讨论卡",
    weDecide: "怎么用，由我们来决定",
    n1: "①",
    n2: "②",
    n3: "③",
    n4: "④",
    some: "这种想法",
    other: "那种想法",
    another: "还有一种想法",
    me: "我是怎么想的？",
    biasEx: "例：“医生”的画全是同一种性别的话？",
    noOne: "正确答案不止一个",
    know: "懂得原理，就能提出更好的问题",
    recap: "在 Part 10 得到的能力",
    next: "下一站：Part 11 做出自己的迷你 GPT！",
    c: "C",
  },
};
