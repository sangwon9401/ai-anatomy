import type { CSSProperties, FC } from "react";
import { useCurrentFrame } from "remotion";
import { CHATML, IM_END, NEXT, REPLY, SYSTEM, TURNS, ch77 } from "../data/ch77";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, wrapLayout, type SceneProps } from "./kit";
import { Arrow, Center, DARK, Note, OUTLINE } from "./part8-kit";

const tl = buildTimeline(ch77);
const S = byId(tl);
const L = ch77.labels;

const FS = 38;
const CH = FS * 1.5;
type Kind = "word" | "marker" | "sysMarker" | "sys" | "reply";
type Item = { key: string; text: string; kind: Kind; role?: "user" | "bot" };

const roleName = (r: "user" | "bot") => (r === "user" ? L.user : L.assistant);
const SYS_ITEMS: Item[] = [
  { key: "m-sys", text: L.system, kind: "sysMarker" },
  ...SYSTEM.map((w, j) => ({ key: `s${j}`, text: w, kind: "sys" as const })),
  { key: "m-end-s", text: L.end, kind: "marker" },
];
const TURN_ITEMS: Item[] = TURNS.flatMap((t, i) => [
  { key: `m-r${i}`, text: roleName(t.role), kind: "marker" as const },
  ...t.words.map((w, j) => ({ key: `t${i}-${j}`, text: w, kind: "word" as const, role: t.role })),
  { key: `m-e${i}`, text: L.end, kind: "marker" as const },
]);
const OPEN: Item = { key: "m-open", text: L.assistant, kind: "marker" };
const REPLY_ITEMS: Item[] = [...REPLY.map((w, j) => ({ key: `r${j}`, text: w, kind: "reply" as const })), { key: "m-end-r", text: L.end, kind: "marker" }];

const OPTS = { x0: 64, y0: 140, maxW: 952, gap: 12, lineH: 76 };
function layout(items: Item[]) {
  const pos = wrapLayout(
    items.map((it) => chipWidth(it.text, FS)),
    OPTS,
  );
  return Object.fromEntries(items.map((it, i) => [it.key, pos[i]])) as Record<string, { x: number; y: number }>;
}
const L0 = layout(TURN_ITEMS.filter((it) => it.kind === "word"));
const L1 = layout([...TURN_ITEMS, OPEN]);
const ALL = [...SYS_ITEMS, ...TURN_ITEMS, OPEN, ...REPLY_ITEMS];
const L2 = layout(ALL);
const LAST_Y = Math.max(...Object.values(L2).map((p) => p.y));

// s1: where each word sits inside its chat bubble
const BUB_Y = [260, 450, 640];
const BUB_PAD = 22;
const BUBBLES = TURNS.map((t, i) => {
  const ws = t.words.map((w) => chipWidth(w, FS));
  const inner = ws.reduce((a, b) => a + b, 0) + 6 * (ws.length - 1);
  const w = inner + BUB_PAD * 2;
  const x = t.role === "user" ? 1020 - w : 60;
  const xs = rowLayout(ws, 6, x + w / 2);
  return { x, y: BUB_Y[i], w, h: CH + 28, role: t.role, xs };
});
const B0: Record<string, { x: number; y: number }> = {};
TURNS.forEach((t, i) => t.words.forEach((_, j) => (B0[`t${i}-${j}`] = { x: BUBBLES[i].xs[j], y: BUBBLES[i].y + 14 })));

const styleOf = (it: Item): CSSProperties => {
  if (it.kind === "marker") return DARK;
  if (it.kind === "sysMarker") return { background: "var(--hl-violet)", color: "var(--chip-ink)", fontWeight: 700 };
  if (it.kind === "sys") return { background: "var(--paper)", border: "2.5px dashed var(--ink-2)", color: "var(--ink-2)" };
  if (it.kind === "reply") return {};
  return OUTLINE;
};

const BAR_Y = 640;

export const Ch77Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const bubbleBg = 1 - beat(frame, S.s2, 0.1, 0.4);
  const restyle = beat(frame, S.s2, 0.3, 0.5);
  const unfold = beat(frame, S.s2, 0.5, 1.3, EASE_IO);
  const g1 = beat(frame, S.s3, 0.4, 1.0, EASE_IO);
  const g2 = beat(frame, S.s4, 0.4, 1.0, EASE_IO);
  const stripOn = frame < S.s6.from ? 1 - beat(frame, S.s5, 0, 0.5) : beat(frame, S.s6, 0, 0.5);
  const chatmlOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const barsOn = beat(frame, S.s6, 2.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.4));
  const s7Notes = 1 - beat(frame, S.s8, 0, 0.4);
  const shrink = beat(frame, S.s8, 0.2, 0.8, EASE_IO);

  const posOf = (it: Item) => {
    const p2 = L2[it.key];
    if (it.kind === "word") {
      const a = { x: mix(B0[it.key].x, L0[it.key].x, unfold), y: mix(B0[it.key].y, L0[it.key].y, unfold) };
      const b = { x: mix(a.x, L1[it.key].x, g1), y: mix(a.y, L1[it.key].y, g1) };
      return { x: mix(b.x, p2.x, g2), y: mix(b.y, p2.y, g2) };
    }
    if (L1[it.key]) return { x: mix(L1[it.key].x, p2.x, g2), y: mix(L1[it.key].y, p2.y, g2) };
    return p2;
  };
  const appear = (it: Item) => {
    if (it.kind === "word") return 1;
    if (it.kind === "reply" || it.key === "m-end-r") {
      const k = it.key === "m-end-r" ? REPLY.length : Number(it.key.slice(1));
      return beat(frame, S.s7, 0.3 + k * 0.45, 0.3);
    }
    if (L1[it.key]) {
      const k = [...TURN_ITEMS, OPEN].filter((x) => x.kind === "marker").findIndex((x) => x.key === it.key);
      return beat(frame, S.s3, 1.3 + k * 0.18, 0.3);
    }
    return beat(frame, S.s4, 1.3 + SYS_ITEMS.findIndex((x) => x.key === it.key) * 0.2, 0.3);
  };

  const slot = L2.r0;
  const blink = Math.floor(frame / 15) % 2 === 0;
  const docH = LAST_Y + CH - 120;

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: bubbles */}
      {frame < S.s3.from && (
        <div style={{ opacity: bubbleBg }}>
          {BUBBLES.map((b, i) => (
            <div key={i} style={{ opacity: beat(frame, S.s1, 0.2 + i * 1.2, 0.4) }}>
              <div
                style={{
                  position: "absolute",
                  left: b.x,
                  top: b.y,
                  width: b.w,
                  height: b.h,
                  borderRadius: b.role === "user" ? "34px 34px 8px 34px" : "34px 34px 34px 8px",
                  background: b.role === "user" ? "var(--hl-sky)" : "var(--paper-2)",
                  border: b.role === "bot" ? "2px solid var(--line)" : undefined,
                  boxSizing: "border-box",
                }}
              />
              <div style={{ position: "absolute", left: b.role === "user" ? b.x + b.w - 120 : b.x + 6, width: 114, textAlign: b.role === "user" ? "right" : "left", top: b.y - 40, fontSize: 28, color: "var(--ink-3)" }}>
                {b.role === "user" ? L.me : L.bot}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* s1–s4, s6–s8: the document */}
      {frame < S.s5.from + 15 || frame >= S.s6.from ? (
        <div style={{ opacity: stripOn, scale: String(mix(1, 0.62, shrink)), transformOrigin: "64px 140px" }}>
          {ALL.map((it) => {
            const a = appear(it);
            if (a <= 0) return null;
            const p = posOf(it);
            if (it.kind === "word") {
              const t = TURNS[Number(it.key[1])];
              const bubbleIn = beat(frame, S.s1, 0.4 + Number(it.key[1]) * 1.2, 0.4);
              return (
                <div key={it.key} style={{ opacity: bubbleIn }}>
                  <Chip text={it.text} color={null} fs={FS} x={p.x} y={p.y} style={{ background: "transparent", color: t.role === "user" ? "var(--chip-ink)" : "var(--ink)", opacity: 1 - restyle }} />
                  <Chip text={it.text} color={null} fs={FS} x={p.x} y={p.y} style={{ ...OUTLINE, opacity: restyle }} />
                </div>
              );
            }
            return <Chip key={it.key} text={it.text} color={it.kind === "reply" ? "mint" : null} fs={FS} x={p.x} y={p.y} style={{ ...styleOf(it), opacity: a, scale: String(mix(0.6, 1, a)) }} />;
          })}
          {/* the open slot */}
          {frame >= S.s6.from && (
            <div
              style={{
                position: "absolute",
                left: slot.x,
                top: slot.y,
                width: 190,
                height: CH,
                border: "3px dashed var(--pen)",
                borderRadius: 12,
                opacity: beat(frame, S.s6, 0.6, 0.4) * (1 - beat(frame, S.s7, 0.3, 0.3)),
                boxSizing: "border-box",
              }}
            >
              <div style={{ position: "absolute", left: 18, top: 10, width: 5, height: CH - 26, background: "var(--ink)", opacity: blink ? 1 : 0 }} />
            </div>
          )}
        </div>
      ) : null}

      {/* captions on the document */}
      {frame >= S.s2.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: 1 - beat(frame, S.s5, 0, 0.4) }}>
          <div style={{ opacity: beat(frame, S.s2, 1.9, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
            <Hand x={120} y={420} fs={54} style={{ rotate: "-2deg" }}>
              {L.oneDoc}
            </Hand>
            <Hand x={420} y={520} fs={50}>
              {L.who}
            </Hand>
          </div>
          <div style={{ opacity: beat(frame, S.s3, 2.6, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            <Chip text={L.markers} color={null} fs={40} x={120} y={540} style={DARK} />
            <Hand x={120 + chipWidth(L.markers, 40) + 20} y={546} fs={48}>
              {L.markerList}
            </Hand>
          </div>
          <div style={{ opacity: beat(frame, S.s4, 2.4, 0.4) }}>
            <Chip text={L.sysPrompt} color="violet" fs={44} x={120} y={560} />
            <Hand x={120} y={660} fs={50} style={{ rotate: "-2deg" }}>
              ↑ {L.hidden}
            </Hand>
          </div>
        </div>
      )}

      {/* s5: what it looks like for real (ChatML-style example) */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: chatmlOn }}>
          <Center y={130} fs={48}>
            {L.shape}
          </Center>
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 230,
              width: 840,
              padding: "26px 34px",
              background: "var(--paper)",
              border: "3px solid var(--ink)",
              borderRadius: 12,
              boxShadow: "10px 10px 0 var(--grid-major)",
              fontSize: 34,
              lineHeight: 1.55,
              boxSizing: "border-box",
              whiteSpace: "nowrap",
            }}
          >
            {CHATML.map(([m, text], i) => {
              const a = beat(frame, S.s5, 0.6 + i * 0.22, 0.3);
              const isSys = i < 2;
              return (
                <div key={i} style={{ opacity: a }}>
                  {m && <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, background: isSys ? "var(--hl-violet)" : "var(--ink)", color: isSys ? "var(--chip-ink)" : "var(--paper)", borderRadius: 6, padding: "0 8px" }}>{m}</span>}
                  {text && <span>{text}</span>}
                  {text && <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, background: "var(--ink)", color: "var(--paper)", borderRadius: 6, padding: "0 8px", marginLeft: 6 }}>{IM_END}</span>}
                </div>
              );
            })}
          </div>
          <Note x={0} w={1080} align="center" y={880} o={beat(frame, S.s5, 3.0, 0.4)}>
            {L.chatml}
          </Note>
        </div>
      )}

      {/* s6: next piece at the open slot */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: barsOn }}>
          <Arrow x1={slot.x + 95} y1={slot.y + CH + 12} x2={slot.x + 95} y2={BAR_Y - 30} p={1} color="var(--pen)" />
          <Hand x={slot.x + 120} y={slot.y + CH + 20} fs={42}>
            {L.nextPiece}
          </Hand>
          {NEXT.map((c, i) => {
            const y = BAR_Y + i * 78;
            const g = beat(frame, S.s6, 2.6 + i * 0.15, 0.6);
            return (
              <div key={c.w}>
                <Chip text={c.w} color={i === 0 ? "mint" : null} fs={38} x={120} y={y} />
                <div style={{ position: "absolute", left: 340, top: y + 14, height: 30, width: c.p * 800 * g, borderRadius: 15, background: i === 0 ? "var(--hl-mint)" : "var(--grid-major)" }} />
                <div style={{ position: "absolute", left: 350 + c.p * 800, top: y + 8, fontFamily: "var(--font-mono)", fontSize: 36, opacity: g }}>{Math.round(c.p * 100)}%</div>
              </div>
            );
          })}
          <Hand x={560} y={BAR_Y + 4 * 78 + 10} fs={44} style={{ opacity: beat(frame, S.s6, 4.0, 0.4) }}>
            {L.same1}
          </Hand>
          <Note x={120} y={BAR_Y + 4 * 78 + 80} o={beat(frame, S.s6, 4.4, 0.4)}>
            * {L.example}
          </Note>
        </div>
      )}

      {/* s7: written, then stop */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7Notes }}>
          <Hand x={120} y={LAST_Y + 120} fs={50} style={{ opacity: beat(frame, S.s7, 3.4, 0.4), rotate: "-2deg" }}>
            {L.stop}
          </Hand>
          <Chip text={L.sft} color="violet" fs={40} x={120} y={LAST_Y + 230} style={{ opacity: beat(frame, S.s7, 4.6, 0.4) }} />
        </div>
      )}

      {/* s8: the document keeps growing */}
      {frame >= S.s8.from && (
        <div>
          {Array.from({ length: 6 }, (_, i) => {
            const y = 140 + docH * 0.62 + 40 + i * 70;
            const a = beat(frame, S.s8, 1.0 + i * 0.4, 0.3);
            return (
              <div key={i} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: 64, top: y, width: 110, height: 40, borderRadius: 8, background: i % 2 ? "var(--ink-2)" : "var(--ink)" }} />
                <div style={{ position: "absolute", left: 190, top: y + 8, width: [520, 640, 380, 700, 460, 600][i], height: 24, borderRadius: 12, background: i % 2 ? "var(--hl-mint)" : "var(--grid-major)" }} />
              </div>
            );
          })}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d={`M 1000 150 L 1000 ${mix(150, 960, beat(frame, S.s8, 3.6, 1.4))}`}
              stroke="var(--pen)"
              strokeWidth={7}
              strokeLinecap="round"
              opacity={beat(frame, S.s8, 3.6, 0.1)}
            />
            {beat(frame, S.s8, 5.0, 0.1) > 0 && <path d="M 984 940 L 1000 962 L 1016 940" fill="none" stroke="var(--pen)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
          <Hand x={640} y={190} fs={40} style={{ opacity: beat(frame, S.s8, 4.0, 0.4), textAlign: "right", width: 340, whiteSpace: "normal" }}>
            {L.reread}
          </Hand>
          <Hand x={120} y={990} fs={48} style={{ opacity: beat(frame, S.s8, 0.8, 0.4), rotate: "-1deg" }}>
            {L.grows} ({L.ch83})
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch77.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
