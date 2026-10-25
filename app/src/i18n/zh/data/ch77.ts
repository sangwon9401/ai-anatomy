import type { ChapterSpec } from "../../../data/types";

// Scene: a three-bubble chat, the hidden system prompt, and the answer the model writes next.
export type Turn = { role: "user" | "bot"; words: string[] };
export const SYSTEM = ["你是", "一个亲切的", "助手。"];
export const TURNS: Turn[] = [
  { role: "user", words: ["你好！", "能帮我", "写作业吗？"] },
  { role: "bot", words: ["当然！", "什么", "作业？"] },
  { role: "user", words: ["光合作用", "是什么？"] },
];
export const REPLY = ["光合作用", "就是", "植物", "利用阳光", "制造", "养分。"];
// next-piece candidates at the open assistant slot (illustrative)
export const NEXT = [
  { w: "光合作用", p: 0.61 },
  { w: "植物", p: 0.22 },
  { w: "好", p: 0.09 },
  { w: "其他", p: 0.08 },
];

// ChatML-style example ("比如是这个样子"): [marker, text] per line. The markers are the real ChatML ones; only the text is translated.
export const CHATML: [string, string][] = [
  ["<|im_start|>system", ""],
  ["", "你是一个亲切的助手。"],
  ["<|im_start|>user", ""],
  ["", "你好！能帮我写作业吗？"],
  ["<|im_start|>assistant", ""],
  ["", "当然！什么作业？"],
  ["<|im_start|>user", ""],
  ["", "光合作用是什么？"],
  ["<|im_start|>assistant", ""],
];
export const IM_END = "<|im_end|>";

/** Playground: system prompts × user messages → illustrative replies */
export const SYSTEMS = [
  { key: "kind", name: "亲切的助手", text: "你是一个亲切的助手。请用高中生听得懂的话来解释。" },
  { key: "short", name: "一句话助手", text: "你是只用一句话回答的助手。" },
  { key: "eng", name: "英语老师", text: "你是英语老师。回答之后，教一个英语表达。" },
];
export const MESSAGES = [
  {
    text: "光合作用是什么？",
    reply: {
      kind: "光合作用就是植物吸收阳光，用水和二氧化碳制造养分。这个过程还会放出氧气。",
      short: "就是植物利用阳光制造养分。",
      eng: "就是植物利用阳光制造养分。英语叫 photosynthesis。",
    } as Record<string, string>,
    noMarker: "那它和呼吸作用有什么不同？",
  },
  {
    text: "周末做点什么好呢？",
    reply: {
      kind: "天气好的话，可以和朋友去散步或骑自行车；下雨的话，看一部一直想看的电影怎么样？",
      short: "去附近的公园散散步吧。",
      eng: "推荐去公园散步。英语里“散步”是 take a walk。",
    } as Record<string, string>,
    noMarker: "再告诉我一些可以和朋友去的地方。",
  },
  {
    text: "谢谢！",
    reply: {
      kind: "不客气！以后有问题，随时来问我。",
      short: "不客气。",
      eng: "不客气！英语可以说 You're welcome。",
    } as Record<string, string>,
    noMarker: "多亏了你，作业写完了！",
  },
];

export const ch77: ChapterSpec = {
  id: 77,
  part: 8,
  title: "对话其实是一份长文档",
  core: false,
  hook: "ChatGPT 怎么分清哪句是我说的，哪句是它自己说的？",
  steps: [
    { id: "s1", sec: 7, narration: "在聊天界面里，气泡一来一回：我问，ChatGPT 答，我再问。" },
    { id: "s2", sec: 7, narration: "可是进入模型时，并没有气泡。整段对话被接在一起，变成一篇长长的文字。" },
    { id: "s3", sec: 8, narration: "为了分清是谁说的，会插入特殊的标记词元，比如“从这里开始是用户”“从这里开始是助手”。" },
    { id: "s4", sec: 9, narration: "最前面还有一段用户看不到的系统提示词（system prompt），写着模型要扮演的角色和说话语气。" },
    { id: "s5", sec: 7, narration: "比如是这个样子。标记长什么样，各家公司、各个模型都不一样，但思路完全相同。" },
    { id: "s6", sec: 8, narration: "文字最后只放一个“轮到助手”的标记，后面空着。模型只是像第 1 章那样，预测下一个片段接着写。" },
    { id: "s7", sec: 8, narration: "写完就输出结束标记，停下来（第 2 章）。第 73 章的示范答案也是这个样子，所以这里会出现回答。" },
    { id: "s8", sec: 7, narration: "对话越长，这份文档也越长。模型每次都要把前面的对话全部重读一遍。第 83 章再细说。" },
  ],
  playgroundTitle: "模型看到的文字",
  playgroundIntro: "选一个系统提示词，然后发消息。在聊天界面和“模型看到的文字”之间切换，看看气泡怎样变成一整篇文字。",
  summary: [
    "对话会变成一篇用标记词元隔开的长文档，送进模型。",
    "最前面的系统提示词，是用户看不到的指令。",
    "在最后“轮到助手”的位置，模型只是接着写下一个片段。",
  ],
  unlocks: "聊天模板",
  unlockLabel: "又知道了 ChatGPT 的一个秘密",
  quiz: [
    {
      q: "进入模型时，对话是什么样子的？",
      choices: ["还是一个个气泡", "用标记词元隔开的一篇长文字", "只有最后一个问题"],
      answer: 1,
      explain: "气泡只在屏幕上。模型读到的是插着标记词元的一篇长文字。",
      review: "s3",
    },
    {
      q: "关于系统提示词，哪一项是对的？",
      choices: ["在模型写完回答之后才加上", "用户每次都要自己输入", "放在最前面，决定模型的角色和语气"],
      answer: 2,
      explain: "用户看不到它，但它就在文档的最前面，影响模型怎样往下写。",
      review: "s4",
    },
    {
      q: "如果文字最后漏掉了“轮到助手”的标记，可能会怎样？",
      choices: ["模型可能会接着用户的话往下写", "模型会回答得更准确", "没有任何区别"],
      answer: 0,
      explain: "模型只是像模像样地往下写。没有标记的话，它可能会继续写用户的句子（第 72 章）。",
      review: "playground",
    },
  ],
  labels: {
    tag: "第 77 章 对话其实是一份长文档",
    me: "我",
    bot: "ChatGPT",
    who: "这是谁说的？",
    oneDoc: "一篇长文字",
    user: "用户",
    assistant: "助手",
    system: "系统",
    end: "结束",
    markers: "标记词元",
    markerList: "= 用户 / 助手 / 结束",
    hidden: "用户看不到",
    sysPrompt: "系统提示词",
    shape: "比如是这个样子",
    chatml: "（ChatML 格式。标记的样子各家公司、各个模型都不同）",
    empty: "空着的位置",
    nextPiece: "下一个片段？",
    same1: "= 第 1 章的猜词游戏",
    example: "示意数据",
    stop: "出现结束标记就停下（第 2 章）",
    sft: "第 73 章的示范答案也是这个样子",
    grows: "对话越长，文档越长",
    reread: "每次都从头重读",
    turn: "轮对话",
    ch83: "第 83 章",
  },
};
