// Narration clips for the in-app player. Vite turns these into URLs (or inline data: URIs in the artifact build).
const files = import.meta.glob("../assets/narration/*.m4a", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export const NARRATION_AUDIO: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split("/").pop()!.replace(".m4a", ""), url]),
);
