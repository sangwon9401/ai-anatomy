// What the student builds in Part 11, kept in memory while the app is open (no storage):
// 92 picks the corpus, 93 the BPE merges, 94 trains a model (the session lives here so leaving
// the chapter only pauses it), 95 writes with it, 96 puts it on the certificate.
import { CHECKPOINTS } from "../../data/part11-checkpoints";
import { corpusByKey, type CorpusKey } from "../../data/part11-corpus";
import { buildTokenizer, decode, encodeLine, type Merge, type Tokenizer } from "./bpe";
import { loadCheckpoint } from "./checkpoint";
import { MINI, createModel, createWork, forward, generate, makeRng, makeSampler, miniConfig, type Model, type Rng, type Work } from "./minigpt";

export type Diary = { step: number; loss: number; text: string };
/** a line from ch95 the student picked for the certificate, and which model wrote it */
export type Favorite = { text: string; who: string };

export type Session = {
  corpus: CorpusKey;
  merges: Merge[];
  tok: Tokenizer;
  lines: number[][];
  model: Model;
  work: Work;
  gen: Work;
  rng: Rng;
  sample: (w: Work, B: number) => void;
  /** ln V: the loss of guessing uniformly among all tokens ("아무거나 찍기") */
  start: number;
  /** history[0] = loss of the untrained model; history[k] = mean batch loss of steps 10k-9 … 10k */
  history: number[];
  pending: number[];
  diary: Diary[];
  /** training time only, in ms */
  ms: number;
  goal: number;
};

const state = {
  corpus: "proverb" as CorpusKey,
  merges: [] as Merge[],
  session: null as Session | null,
  favorite: null as Favorite | null,
  name: "",
};

const sameMerges = (a: Merge[], b: Merge[]) => a.length === b.length && a.every((m, i) => m[0] === b[i][0] && m[1] === b[i][1]);

export const getCorpus = () => state.corpus;
export function setCorpus(key: CorpusKey) {
  if (key === state.corpus) return;
  state.corpus = key;
  state.merges = [];
  state.session = null;
  state.favorite = null;
}

export const getMerges = () => state.merges;
export function setMerges(merges: Merge[]) {
  if (sameMerges(merges, state.merges)) return;
  state.merges = merges;
  state.session = null;
}

/** The tokenizer 94 will use: the student's merges from 93, or plain characters. */
export const currentTokenizer = () => buildTokenizer(corpusByKey(state.corpus).lines, state.merges);

export const getSession = () => state.session;

export function newSession(): Session {
  const corpus = state.corpus;
  const tok = currentTokenizer();
  const lines = corpusByKey(corpus).lines.map((l) => encodeLine(tok, l).ids);
  const cfg = miniConfig(tok.vocab.length);
  const rng = makeRng((Math.random() * 2 ** 32) >>> 0);
  const model = createModel(cfg, rng);
  const s: Session = {
    corpus,
    merges: state.merges,
    tok,
    lines,
    model,
    work: createWork(cfg, MINI.batch),
    gen: createWork(cfg, 1),
    rng,
    sample: makeSampler(lines, cfg.T, rng),
    start: Math.log(cfg.V),
    history: [],
    pending: [],
    diary: [],
    ms: 0,
    goal: 2000,
  };
  s.sample(s.work, MINI.batch);
  s.history.push(forward(model, s.work, MINI.batch, cfg.T, true));
  s.diary.push({ step: 0, loss: s.history[0], text: writeLine(s) });
  state.session = s;
  return s;
}

/** One line written by the session's model (temperature 0.8). */
export const writeLine = (s: Session, temp = 0.8) => decode(s.tok, generate(s.model, s.gen, [], temp, Math.random, 40));

export const dropSession = () => {
  state.session = null;
};

const pretrainedCache = new Map<CorpusKey, { model: Model; tok: Tokenizer; work: Work }>();
/** The offline checkpoint for the chosen corpus (character tokens, 1,500 steps). */
export function pretrained(key: CorpusKey = state.corpus) {
  let p = pretrainedCache.get(key);
  if (!p) {
    const { model, tok } = loadCheckpoint(CHECKPOINTS[key]);
    p = { model, tok, work: createWork(model.cfg, 1) };
    pretrainedCache.set(key, p);
  }
  return { ...p, steps: CHECKPOINTS[key].steps, loss: CHECKPOINTS[key].loss };
}

export const getFavorite = () => state.favorite;
export const setFavorite = (f: Favorite | null) => {
  state.favorite = f;
};

export const getName = () => state.name;
export const setName = (name: string) => {
  state.name = name;
};
