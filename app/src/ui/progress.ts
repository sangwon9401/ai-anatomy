// Per-device progress: chapters opened, chapters whose quiz was finished, and the last one opened.
// It lives in localStorage, which can be missing or blocked, so every caller works without it.
const KEY = "ai-haebu:progress:v1";

export type Progress = { seen: number[]; done: number[]; last: number | null };

const empty = (): Progress => ({ seen: [], done: [], last: null });

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // private mode or storage full: progress just isn't remembered
  }
}

export function markSeen(id: number) {
  const p = loadProgress();
  if (!p.seen.includes(id)) p.seen.push(id);
  p.last = id;
  save(p);
}

export function markDone(id: number) {
  const p = loadProgress();
  if (!p.done.includes(id)) p.done.push(id);
  save(p);
}
