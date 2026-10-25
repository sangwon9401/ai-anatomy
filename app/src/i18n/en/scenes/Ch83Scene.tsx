import type { FC } from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { CHAT, GUESS, KV_PROMPT, KV_ROUNDS, KV_TOKENS, WINDOW_SLOTS, ch83, type Msg } from "../../../data/ch83";
import { Caption, Chip, EASE_IO, FPS, Hand, InlineCircle, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, textWidth, type SceneProps } from "../../../scenes/kit";
import { Card } from "../../../scenes/part9-kit";

const tl = buildTimeline(ch83);
const S = byId(tl);
const L = ch83.labels;

// chat layout: newest bubble sits at the bottom of the window frame
const BFS = 36;
const BH = 78;
const SLOT = 94;
const NEWEST_Y = 838;
const FRAME = { x: 56, y: 440, w: 968, h: 490 };
const OUT_GAP = 84; // bubbles that left the window jump past the frame's top edge
const bubbleW = (t: string) => textWidth(t, BFS) + 60;

const Bubble: FC<{ m: Msg; y: number; o: number; bg?: string }> = ({ m, y, o, bg }) => {
  const w = bubbleW(m.text);
  return (
    <div
      style={{
        position: "absolute",
        left: m.me ? 1000 - w : 80,
        top: y,
        width: w,
        height: BH,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: BFS,
        fontWeight: 500,
        whiteSpace: "nowrap",
        background: bg ?? (m.me ? "var(--hl-sky)" : "var(--paper-2)"),
        color: m.me || bg ? "var(--chip-ink)" : "var(--ink)",
        border: m.me || bg ? "none" : "2px solid var(--line)",
        borderRadius: m.me ? "30px 30px 8px 30px" : "30px 30px 30px 8px",
        opacity: o,
      }}
    >
      {m.text}
    </div>
  );
};

// KV rows
const KFS = 32;
const KW = KV_TOKENS.map((w) => chipWidth(w, KFS));
const KX = KW.map((_, i) => 168 + KW.slice(0, i).reduce((a, b) => a + b + 10, 0));
const KROW_Y = (r: number) => 300 + r * 112;

const fmtInt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const Ch83Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  // how many chat bubbles are in (fractional while one slides in)
  const arrivals: [typeof S.s1, number][] = [
    [S.s1, 0.3],
    [S.s1, 1.0],
    [S.s1, 1.7],
    [S.s1, 2.4],
    [S.s3, 0.6],
    [S.s3, 2.6],
    [S.s4, 0.5],
  ];
  const count = arrivals.reduce((a, [st, t]) => a + beat(frame, st, t, 0.5, EASE_IO), 0);
  const chatOn = 1 - beat(frame, S.s5, 0, 0.5);
  const frameOn = beat(frame, S.s2, 0.4, 0.5);
  const reply = beat(frame, S.s4, 2.6, 0.5);

  const gridOn = beat(frame, S.s5, 0.4, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const kvOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const cache = beat(frame, S.s7, 1.2, 1.0, EASE_IO);
  const memoOn = beat(frame, S.s8, 0.3, 0.5);
  const tok = interpolate(frame, [S.s8.from + 0.6 * FPS, S.s8.from + 4.0 * FPS], [0, 2048], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s4: the chat and its window */}
      {frame < S.s5.from + 15 && (
        <div style={{ opacity: chatOn }}>
          {CHAT.map((m, i) => {
            const slot = count - 1 - i;
            const appear = Math.min(1, Math.max(0, count - i));
            if (appear <= 0) return null;
            const outside = Math.min(1, Math.max(0, slot - (WINDOW_SLOTS - 1)));
            return <Bubble key={i} m={m} y={NEWEST_Y - slot * SLOT - outside * OUT_GAP + (1 - appear) * 30} o={appear * (1 - 0.65 * outside)} />;
          })}
          <Hand x={80} y={200} fs={46} style={{ opacity: beat(frame, S.s1, 3.4, 0.4) * (1 - beat(frame, S.s2, 0, 0.3)) }}>
            {L.longText}
          </Hand>

          {/* the window */}
          <div style={{ position: "absolute", left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h, border: "6px solid var(--ink)", borderRadius: 28, opacity: frameOn }} />
          <Chip text={L.window} color="yellow" fs={36} x={FRAME.x + 30} y={FRAME.y - 28} style={{ opacity: frameOn }} />
          <div style={{ position: "absolute", left: FRAME.x + 50 + chipWidth(L.window, 36), top: FRAME.y - 22, fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s2, 1.6, 0.4), background: "var(--paper)", padding: "0 10px" }}>{L.gpt3}</div>
          <Hand x={1024} y={FRAME.y - 96} fs={38} color="var(--ink-2)" style={{ translate: "-100% 0", opacity: beat(frame, S.s2, 3.0, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
            {L.toy}
          </Hand>
          <Hand x={80} y={130} fs={46} style={{ opacity: beat(frame, S.s3, 3.4, 0.4) }}>
            {L.out}
          </Hand>

          {/* s4: the forgotten name */}
          <PenCircle x={1000 - bubbleW(CHAT[0].text) - 18} y={NEWEST_Y - 6 * SLOT - OUT_GAP - 12} w={bubbleW(CHAT[0].text) + 36} h={BH + 24} p={beat(frame, S.s4, 1.6, 0.6)} />
          <Hand x={1000 - bubbleW(CHAT[0].text) - 250} y={NEWEST_Y - 6 * SLOT - OUT_GAP + 14} fs={42} style={{ opacity: beat(frame, S.s4, 2.0, 0.4) }}>
            {L.here}
          </Hand>
          {reply > 0 && <Bubble m={{ me: false, text: GUESS }} y={950} o={reply} bg="var(--hl-pink)" />}
          <Hand x={80 + bubbleW(GUESS) + 24} y={962} fs={40} style={{ opacity: beat(frame, S.s4, 3.4, 0.4) }}>
            {L.mayMake}
          </Hand>
        </div>
      )}

      {/* s5: the score table grows as the square of the length */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: gridOn }}>
          {[
            { n: 4, cell: 62, x0: 110, label: L.t4, cells: L.c16, t: 0.6 },
            { n: 8, cell: 50, x0: 590, label: L.t8, cells: L.c64, t: 1.6 },
          ].map((g) => (
            <div key={g.n}>
              <div style={{ position: "absolute", left: g.x0, width: g.n * g.cell, top: 214, textAlign: "center", fontSize: 40, fontWeight: 700 }}>{g.label}</div>
              {Array.from({ length: g.n * g.n }, (_, k) => {
                const r = Math.floor(k / g.n);
                const c = k % g.n;
                const a = beat(frame, S.s5, g.t + (r + c) * 0.04, 0.3);
                return (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      left: g.x0 + c * g.cell,
                      top: 290 + r * g.cell,
                      width: g.cell - 6,
                      height: g.cell - 6,
                      borderRadius: 8,
                      background: "var(--hl-yellow)",
                      opacity: a * (0.35 + 0.65 * random(`c${g.n}-${k}`)),
                    }}
                  />
                );
              })}
              <div style={{ position: "absolute", left: g.x0, width: g.n * g.cell, top: 290 + g.n * g.cell + 14, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500, opacity: beat(frame, S.s5, g.t + 0.8, 0.4) }}>
                {g.cells}
              </div>
            </div>
          ))}
          <Hand x={0} y={770} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 3.2, 0.4) }}>
            {L.x4}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontSize: 54, fontWeight: 700, opacity: beat(frame, S.s5, 4.6, 0.5) }}>{L.big}</div>
          <Hand x={0} y={950} fs={44} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 5.6, 0.4) }}>
            {L.every}
          </Hand>
        </div>
      )}

      {/* s6–s7: recomputing vs reusing Key·Value */}
      {frame >= S.s6.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: kvOn }}>
          <div style={{ position: "absolute", left: 60, top: 150, fontSize: 48, fontWeight: 700 }}>{L.kv}</div>
          <div style={{ position: "absolute", left: 60, top: 222, display: "flex", gap: 28, fontSize: 32, alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, background: "var(--hl-orange)", display: "inline-block" }} />
              {L.calc}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, opacity: beat(frame, S.s7, 0.8, 0.4) }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, background: "var(--hl-mint)", display: "inline-block" }} />
              {L.memo}
            </span>
          </div>
          <Hand x={1020} y={150} fs={44} style={{ translate: "-100% 0", opacity: beat(frame, S.s7, 0.4, 0.4), rotate: "-2deg" }}>
            {L.cacheName}
          </Hand>
          {Array.from({ length: KV_ROUNDS }, (_, r) => {
            const n = KV_PROMPT + r;
            const a = beat(frame, S.s6, 0.6 + r * 0.8, 0.4);
            const y = KROW_Y(r);
            const computed = r === 0 ? n : mix(n, 1, cache);
            return (
              <div key={r} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: 56, top: y + 8, fontSize: 32, color: "var(--ink-2)" }}>
                  {L.round}
                  <span style={{ fontFamily: "var(--font-mono)" }}>{r + 1}</span>
                </div>
                {KV_TOKENS.slice(0, n).map((w, i) => {
                  const reused = r > 0 && i < n - 1;
                  const t = reused ? cache : 0;
                  return (
                    <div
                      key={w}
                      style={{
                        position: "absolute",
                        left: KX[i],
                        top: y,
                        width: KW[i],
                        height: KFS * 1.5,
                        borderRadius: 10,
                        display: "grid",
                        placeItems: "center",
                        fontSize: KFS,
                        fontWeight: 500,
                        color: "var(--chip-ink)",
                        background: t > 0.5 ? "var(--hl-mint)" : "var(--hl-orange)",
                        scale: String(reused ? mix(1, 0.94, Math.sin(Math.PI * t)) : 1),
                      }}
                    >
                      {w}
                    </div>
                  );
                })}
                <div style={{ position: "absolute", left: 900, width: 120, top: y + 2, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 500 }}>{Math.round(computed)}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 60, top: 770, fontSize: 42, fontWeight: 500, opacity: beat(frame, S.s6, 4.2, 0.4) * (1 - 0.55 * cache) }}>{L.noCacheSum}</div>
          <div style={{ position: "absolute", left: 60, top: 850, fontSize: 46, fontWeight: 700, opacity: beat(frame, S.s7, 2.6, 0.4) }}>
            {L.cacheSum.split(L.cacheN)[0]}
            <span style={{ marginLeft: 22 }}>
              <InlineCircle p={beat(frame, S.s7, 3.2, 0.6)}>{L.cacheN}</InlineCircle>
            </span>
          </div>
          <Hand x={60} y={950} fs={46} style={{ opacity: beat(frame, S.s7, 4.6, 0.4) }}>
            {L.why}
          </Hand>
        </div>
      )}

      {/* s8: the memo grows */}
      {frame >= S.s8.from && (
        <div style={{ opacity: memoOn }}>
          <Chip text={L.cacheName} color="mint" fs={44} x={540 - chipWidth(L.cacheName, 44) / 2} y={140} />
          {Array.from({ length: 16 }, (_, i) => {
            const on = tok >= ((i + 0.5) / 16) * 2048;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 120 + (i % 2) * 8,
                  top: 900 - (i + 1) * 40,
                  width: 320,
                  height: 34,
                  borderRadius: 6,
                  background: "var(--hl-mint)",
                  border: "2px solid var(--ink)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 28,
                  color: "var(--chip-ink)",
                  opacity: on ? 1 : 0,
                  translate: `0px ${on ? 0 : -10}px`,
                }}
              >
                K · V
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 120, width: 330, top: 912, textAlign: "center", fontSize: 32, color: "var(--ink-2)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, color: "var(--ink)" }}>{fmtInt(tok)}</span> {L.tokens}
          </div>
          <Hand x={540} y={290} fs={48} style={{ opacity: beat(frame, S.s8, 1.4, 0.4) }}>
            {L.stack}
          </Hand>
          <Hand x={540} y={370} fs={54} style={{ opacity: beat(frame, S.s8, 4.2, 0.3), rotate: "-4deg" }}>
            {L.full}
          </Hand>
          <div style={{ opacity: beat(frame, S.s8, 5.0, 0.5) }}>
            <Card x={520} y={560} w={480} h={300} style={{ background: "var(--paper-2)" }} />
            <div style={{ position: "absolute", left: 556, top: 590, fontSize: 40, fontWeight: 700 }}>{L.tipTitle}</div>
            <div style={{ position: "absolute", left: 556, top: 670, width: 420, fontSize: 34, lineHeight: 1.45, wordBreak: "keep-all" }}>
              · {L.tip1}
              <br />· {L.tip2}
            </div>
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch83.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
