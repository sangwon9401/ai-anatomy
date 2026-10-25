import type { ChapterSpec } from "./types";

// Scene: a three-bubble chat, the hidden system prompt, and the answer the model writes next.
export type Turn = { role: "user" | "bot"; words: string[] };
export const SYSTEM = ["너는", "친절한", "도우미야."];
export const TURNS: Turn[] = [
  { role: "user", words: ["안녕!", "숙제", "좀", "도와줄래?"] },
  { role: "bot", words: ["물론이죠!", "어떤", "숙제예요?"] },
  { role: "user", words: ["광합성이", "뭐야?"] },
];
export const REPLY = ["광합성은", "식물이", "햇빛으로", "양분을", "만드는", "일이에요."];
// next-piece candidates at the open assistant slot (illustrative)
export const NEXT = [
  { w: "광합성은", p: 0.61 },
  { w: "식물이", p: 0.22 },
  { w: "좋은", p: 0.09 },
  { w: "기타", p: 0.08 },
];

// ChatML-style example ("예를 들면 이런 모양"): [marker, text] per line
export const CHATML: [string, string][] = [
  ["<|im_start|>system", ""],
  ["", "너는 친절한 도우미야."],
  ["<|im_start|>user", ""],
  ["", "안녕! 숙제 좀 도와줄래?"],
  ["<|im_start|>assistant", ""],
  ["", "물론이죠! 어떤 숙제예요?"],
  ["<|im_start|>user", ""],
  ["", "광합성이 뭐야?"],
  ["<|im_start|>assistant", ""],
];
export const IM_END = "<|im_end|>";

/** Playground: system prompts × user messages → illustrative replies */
export const SYSTEMS = [
  { key: "kind", name: "친절한 도우미", text: "너는 친절한 도우미야. 고등학생 눈높이로 설명해." },
  { key: "short", name: "한 문장 도우미", text: "너는 한 문장으로만 답하는 도우미야." },
  { key: "eng", name: "영어 선생님", text: "너는 영어 선생님이야. 답한 뒤 영어 표현을 하나 알려 줘." },
];
export const MESSAGES = [
  {
    text: "광합성이 뭐야?",
    reply: {
      kind: "광합성은 식물이 햇빛을 받아 물과 이산화탄소로 양분을 만드는 일이에요. 이때 산소가 나와요.",
      short: "식물이 햇빛으로 양분을 만드는 일이에요.",
      eng: "식물이 햇빛으로 양분을 만드는 일이에요. 영어로는 photosynthesis라고 해요.",
    } as Record<string, string>,
    noMarker: " 그리고 호흡이랑은 뭐가 달라?",
  },
  {
    text: "주말에 뭐 하면 좋을까?",
    reply: {
      kind: "날씨가 좋으면 친구랑 산책이나 자전거를 타 보고, 비가 오면 보고 싶던 영화를 보는 건 어때요?",
      short: "가까운 공원에 산책 가 보세요.",
      eng: "공원 산책을 추천해요. 영어로 '산책하다'는 take a walk예요.",
    } as Record<string, string>,
    noMarker: " 친구들이랑 갈 만한 곳도 알려 줘.",
  },
  {
    text: "고마워!",
    reply: {
      kind: "천만에요! 또 궁금한 게 생기면 언제든 물어봐요.",
      short: "천만에요.",
      eng: "천만에요! 영어로는 You're welcome이라고 해요.",
    } as Record<string, string>,
    noMarker: " 덕분에 숙제 끝냈어!",
  },
];

export const ch77: ChapterSpec = {
  id: 77,
  part: 8,
  title: "대화는 사실 긴 문서",
  core: false,
  hook: "ChatGPT는 내가 한 말과 자기가 한 말을 어떻게 구별할까요?",
  steps: [
    { id: "s1", sec: 7, narration: "채팅 화면에서는 말풍선이 오가요. 내가 묻고, ChatGPT가 대답하고, 내가 또 물어요." },
    { id: "s2", sec: 7, narration: "그런데 모델에 들어갈 때는 말풍선이 없어요. 대화 전체가 이어 붙여져서 하나의 긴 글이 돼요." },
    { id: "s3", sec: 8, narration: "누가 한 말인지 알 수 있게 특별한 표시 토큰을 끼워 넣어요. '여기부터 사용자', '여기부터 어시스턴트' 같은 표시예요." },
    { id: "s4", sec: 9, narration: "맨 앞에는 사용자 눈에 안 보이는 시스템 프롬프트(system prompt)가 붙어요. 모델이 지킬 역할과 말투를 적어 둔 거예요." },
    { id: "s5", sec: 7, narration: "예를 들면 이런 모양이에요. 표시의 생김새는 회사나 모델마다 다르지만, 생각은 똑같아요." },
    { id: "s6", sec: 8, narration: "글 끝에는 '어시스턴트 차례' 표시만 놓고 비워 둬요. 그러면 모델은 1장처럼 다음 조각을 예측해 이어 쓸 뿐이에요." },
    { id: "s7", sec: 8, narration: "다 쓰면 끝 표시를 내고 멈춰요(2장). 73장의 모범 답안도 이 모양으로 학습해서, 이 자리에선 대답이 나와요." },
    { id: "s8", sec: 7, narration: "대화가 길어질수록 이 문서도 길어져요. 모델은 매번 앞의 대화를 전부 다시 읽어요. 83장에서 다시 봐요." },
  ],
  playgroundTitle: "모델이 보는 글",
  playgroundIntro: "시스템 프롬프트를 고르고 메시지를 보내 보세요. 채팅 화면과 '모델이 보는 글'을 번갈아 보면서, 말풍선이 어떻게 한 줄의 글이 되는지 확인해요.",
  summary: [
    "대화는 표시 토큰으로 구분한 하나의 긴 문서로 모델에 들어간다.",
    "맨 앞의 시스템 프롬프트는 사용자 눈에 안 보이는 지시문이다.",
    "끝의 '어시스턴트 차례' 자리에서 모델은 다음 조각을 이어 쓸 뿐이다.",
  ],
  unlocks: "채팅 템플릿",
  unlockLabel: "ChatGPT의 비밀을 하나 알았어요",
  quiz: [
    {
      q: "모델 안으로 들어갈 때 대화는 어떤 모양일까요?",
      choices: ["말풍선 그대로", "표시 토큰으로 구분한 하나의 긴 글", "마지막 질문 한 줄만"],
      answer: 1,
      explain: "말풍선은 화면에만 있어요. 모델은 표시 토큰이 끼워진 긴 글 하나를 읽어요.",
      review: "s3",
    },
    {
      q: "시스템 프롬프트에 대한 설명으로 맞는 것은?",
      choices: ["모델이 답을 다 쓴 뒤에 붙는다", "사용자가 매번 직접 입력해야 한다", "맨 앞에 붙어서 모델의 역할과 말투를 정해 준다"],
      answer: 2,
      explain: "사용자 눈에는 안 보이지만 문서 맨 앞에 붙어 있어서, 모델이 뒤를 이어 쓸 때 영향을 줘요.",
      review: "s4",
    },
    {
      q: "글 끝에 '어시스턴트 차례' 표시를 빼먹으면 어떻게 될 수 있을까요?",
      choices: ["모델이 사용자의 말을 이어서 써 버릴 수 있다", "모델이 더 정확하게 대답한다", "아무 차이가 없다"],
      answer: 0,
      explain: "모델은 그럴듯하게 이어 쓸 뿐이라, 표시가 없으면 사용자의 문장을 계속 쓸 수 있어요(72장).",
      review: "playground",
    },
  ],
  labels: {
    tag: "77장 대화는 사실 긴 문서",
    me: "나",
    bot: "ChatGPT",
    who: "누가 한 말이지?",
    oneDoc: "하나의 긴 글",
    user: "사용자",
    assistant: "어시스턴트",
    system: "시스템",
    end: "끝",
    markers: "표시 토큰",
    markerList: "= 사용자 / 어시스턴트 / 끝",
    hidden: "사용자 눈엔 안 보여요",
    sysPrompt: "시스템 프롬프트",
    shape: "예를 들면 이런 모양",
    chatml: "(ChatML 형식. 표시 모양은 회사·모델마다 달라요)",
    empty: "비워 둔 자리",
    nextPiece: "다음 조각?",
    same1: "1장과 똑같은 다음 조각 맞히기",
    example: "설명용 예시",
    stop: "끝 표시가 나오면 멈춤 (2장)",
    sft: "73장 모범 답안도 이 모양",
    grows: "대화가 길어질수록 문서도 길어져요",
    reread: "매번 처음부터 다시 읽어요",
    turn: "번째 대화",
    ch83: "83장",
  },
};
