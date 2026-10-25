import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { SENT, ch59 } from "../data/ch59";
import { Block, Layer, PenArrow, WordChip, blockGeo, partRect, wordW } from "./part6-block";
import { Caption, Chip, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";

const tl = buildTimeline(ch59);
const S = byId(tl);
const L = ch59.labels;
const G = blockGeo("full");

const Stack: FC<{ x: number; y: number; w: number; n: number; color: string; o?: number; bar?: number; gap?: number }> = ({ x, y, w, n, color, o = 1, bar = 48, gap = 12 }) => (
  <div style={{ opacity: o }}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y + i * (bar + gap), width: w, height: bar, borderRadius: 12, background: color, border: "3px solid var(--ink)", boxSizing: "border-box" }} />
    ))}
  </div>
);

// s3–s4: the sentence rows
const SFS = 48;
const SW = SENT.map((w) => wordW(w, SFS));
const BLANK_W = 150;
const rowX = (() => {
  const widths = SW.map((w, i) => (i === 2 ? BLANK_W : w));
  const total = widths.reduce((a, b) => a + b, 0) + 24 * 3;
  let x = 540 - total / 2;
  return widths.map((w) => {
    const at = x;
    x += w + 24;
    return { x: at, w, cx: at + w / 2 };
  });
})();
const arc = (x1: number, x2: number, y: number, h: number) => `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y - h} ${x2} ${y}`;

// s5 grids
const CELL = 80;
const CG = 6;
const GRID_Y = 340;

const Grid: FC<{ x: number; mode: "bert" | "gpt"; o: number; p: number }> = ({ x, mode, o, p }) => (
  <div style={{ opacity: o }}>
    {SENT.map((w, i) => (
      <div key={`r${i}`}>
        <div style={{ position: "absolute", left: x - 116, width: 104, top: GRID_Y + i * (CELL + CG) + 22, textAlign: "right", fontSize: 30, fontWeight: 500 }}>{w}</div>
        <div style={{ position: "absolute", left: x + i * (CELL + CG) - 4, width: CELL + 8, top: GRID_Y - 46, textAlign: "center", fontSize: 28, color: "var(--ink-2)" }}>{w}</div>
        {SENT.map((_, j) => {
          const open = mode === "bert" || j <= i;
          const show = Math.max(0, Math.min(1, p * 16 - (i * 4 + j)));
          return (
            <div
              key={j}
              style={{
                position: "absolute",
                left: x + j * (CELL + CG),
                top: GRID_Y + i * (CELL + CG),
                width: CELL,
                height: CELL,
                borderRadius: 10,
                boxSizing: "border-box",
                background: open ? `var(--hl-${mode === "bert" ? "sky" : "yellow"})` : "var(--ink-3)",
                border: open ? "none" : "3px solid var(--ink-3)",
                opacity: show * (open ? 1 : 0.55),
              }}
            />
          );
        })}
      </div>
    ))}
  </div>
);

const Magnifier: FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={90} height={90} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <circle cx={38} cy={38} r={26} fill="var(--paper)" stroke="var(--ink)" strokeWidth={6} />
    <line x1={58} y1={58} x2={82} y2={82} stroke="var(--ink)" strokeWidth={9} strokeLinecap="round" />
  </svg>
);
const Pencil: FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={90} height={90} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <g transform="rotate(-45 45 45)">
      <rect x={14} y={34} width={56} height={22} rx={3} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={5} />
      <path d="M 70 34 L 86 45 L 70 56 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={5} strokeLinejoin="round" />
    </g>
  </svg>
);

export const Ch59Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const on1 = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const on2 = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const on34 = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const on5 = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const on6 = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const on7 = beat(frame, S.s7, 0.3, 0.6);
  const attR = partRect(G, "att");

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the 2017 translator */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: on1 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontSize: 50, fontWeight: 700 }}>{L.y2017}</div>
          <WordChip text={L.src} x={290 - wordW(L.src, 34) / 2} y={214} fs={34} o={beat(frame, S.s1, 0.6, 0.4)} />
          {[
            { x: 110, name: L.enc, does: L.encDo, color: "var(--hl-sky)", t: 0.9 },
            { x: 610, name: L.dec, does: L.decDo, color: "var(--hl-yellow)", t: 2.4 },
          ].map((c) => {
            const o = beat(frame, S.s1, c.t, 0.5);
            return (
              <div key={c.name} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: c.x, width: 360, top: 300, textAlign: "center", fontSize: 44, fontWeight: 700 }}>
                  {c.name} <span style={{ fontFamily: "var(--font-hand)", fontWeight: 400, color: "var(--pen)" }}>{L.x6}</span>
                </div>
                <Stack x={c.x} y={372} w={360} n={6} color={c.color} />
                <div style={{ position: "absolute", left: c.x, width: 360, top: 740, textAlign: "center", fontSize: 32, color: "var(--ink-2)" }}>{c.does}</div>
              </div>
            );
          })}
          <Layer>
            <PenArrow x1={290} y1={272} x2={290} y2={296} p={beat(frame, S.s1, 0.9, 0.4)} color="var(--ink-3)" width={5} />
            <PenArrow x1={482} y1={540} x2={598} y2={540} p={beat(frame, S.s1, 3.6, 0.6)} width={7} />
            <PenArrow x1={790} y1={796} x2={790} y2={840} p={beat(frame, S.s1, 4.6, 0.4)} color="var(--ink-3)" width={5} />
          </Layer>
          <Chip text={L.dst} color="yellow" fs={38} x={790 - chipWidth(L.dst, 38) / 2} y={852} style={{ opacity: beat(frame, S.s1, 5.0, 0.5) }} />
        </div>
      )}

      {/* s2: split apart */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: on2 }}>
          {[
            { cx: 290, name: L.bert, by: L.bertBy, only: L.encOnly, c: "sky" as const, t: 0.6 },
            { cx: 790, name: L.gpt, by: L.gptBy, only: L.decOnly, c: "yellow" as const, t: 2.4 },
          ].map((m) => {
            const o = beat(frame, S.s2, m.t, 0.5);
            return (
              <div key={m.name} style={{ opacity: o, translate: `${mix(m.cx < 540 ? 40 : -40, 0, o)}px 0px` }}>
                <Chip text={m.name} color={m.c} fs={64} x={m.cx - chipWidth(m.name, 64) / 2} y={200} />
                <div style={{ position: "absolute", left: m.cx - 200, width: 400, top: 316, textAlign: "center", fontSize: 32, color: "var(--ink-2)" }}>({m.by})</div>
                <Stack x={m.cx - 170} y={400} w={340} n={6} color={`var(--hl-${m.c})`} bar={44} gap={10} />
                <div style={{ position: "absolute", left: m.cx - 220, width: 440, top: 740, textAlign: "center", fontSize: 40, fontWeight: 700 }}>{m.only}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* s3–s4: fill the blank vs guess the next word */}
      {frame >= S.s3.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: on34 }}>
          {[
            { mode: "bert" as const, y: 300, step: S.s3, name: L.bert, job: L.fill, note: L.both, c: "sky" as const },
            { mode: "gpt" as const, y: 740, step: S.s4, name: L.gpt, job: L.next, note: L.front, c: "yellow" as const },
          ].map((r) => {
            const o = beat(frame, r.step, 0.3, 0.5);
            const from = r.mode === "bert" ? [0, 1, 3] : [0, 1];
            const fillIn = r.mode === "bert" ? beat(frame, r.step, 4.6, 0.5) : 0;
            return (
              <div key={r.mode} style={{ opacity: o }}>
                <Chip text={r.name} color={r.c} fs={44} x={90} y={r.y - 160} />
                <div style={{ position: "absolute", left: 110 + chipWidth(r.name, 44), top: r.y - 152, fontSize: 42, fontWeight: 700 }}>{r.job}</div>
                <Layer>
                  {from.map((i, k) => {
                    const p = beat(frame, r.step, 1.4 + k * 0.5, 0.7);
                    const x1 = rowX[i].cx;
                    const x2 = rowX[2].cx + (i < 2 ? -24 + i * 10 : 24);
                    return (
                      <path
                        key={i}
                        d={arc(x1, x2, r.y - 8, 60 + Math.abs(x1 - x2) * 0.25)}
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - p}
                        fill="none"
                        stroke="var(--pen)"
                        strokeWidth={6}
                        strokeLinecap="round"
                        opacity={p > 0 ? 1 : 0}
                      />
                    );
                  })}
                </Layer>
                {SENT.map((w, i) => {
                  if (i === 2)
                    return (
                      <div key={w}>
                        <div style={{ position: "absolute", left: rowX[2].x, top: r.y, width: BLANK_W, height: SFS * 1.5, borderRadius: 12, border: "4px dashed var(--pen)", boxSizing: "border-box", display: "grid", placeItems: "center", fontSize: SFS, fontWeight: 700, color: "var(--pen)", opacity: 1 - fillIn }}>
                          {L.blank}
                        </div>
                        <Chip text={w} color={r.c} fs={SFS - 8} x={rowX[2].cx - chipWidth(w, SFS - 8) / 2} y={r.y + 6} style={{ opacity: fillIn }} />
                      </div>
                    );
                  return <WordChip key={w} text={w} x={rowX[i].x} y={r.y} fs={SFS} />;
                })}
                {r.mode === "gpt" && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        left: rowX[3].x - 12,
                        top: r.y - 12,
                        width: rowX[3].w + 24,
                        height: SFS * 1.5 + 24,
                        borderRadius: 14,
                        background: "var(--ink-3)",
                        opacity: 0.92 * beat(frame, S.s4, 0.8, 0.5),
                      }}
                    />
                    <Hand x={rowX[3].x - 30} y={r.y + 96} fs={36} style={{ opacity: beat(frame, S.s4, 1.0, 0.4) }}>
                      {L.mask}
                    </Hand>
                  </>
                )}
                <Hand x={0} y={r.y + 104} fs={44} style={{ width: r.mode === "gpt" ? 640 : 1080, textAlign: "center", opacity: beat(frame, r.step, 3.2, 0.4) }}>
                  {r.note}
                </Hand>
              </div>
            );
          })}
        </div>
      )}

      {/* s5: the attention tables */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: on5 }}>
          <Chip text={L.bert} color="sky" fs={48} x={176 + 169 - chipWidth(L.bert, 48) / 2} y={180} />
          <Chip text={L.gpt} color="yellow" fs={48} x={660 + 169 - chipWidth(L.gpt, 48) / 2} y={180} />
          <Grid x={176} mode="bert" o={1} p={beat(frame, S.s5, 0.6, 1.4, (t) => t)} />
          <Grid x={660} mode="gpt" o={1} p={beat(frame, S.s5, 2.6, 1.4, (t) => t)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s5, 4.4, 0.4) }}>
            {L.rows} · {L.cols}
          </div>
          <Hand x={660} y={790} fs={40} style={{ width: 340, textAlign: "center", opacity: beat(frame, S.s5, 5.0, 0.4) }}>
            {L.mask}
          </Hand>
        </div>
      )}

      {/* s6: what each is good at */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: on6 }}>
          {[
            { x: 90, name: L.bert, c: "sky" as const, big: L.understand, ex: L.understandEx, Icon: Magnifier, t: 0.5 },
            { x: 570, name: L.gpt, c: "yellow" as const, big: L.write, ex: L.writeEx, Icon: Pencil, t: 2.4 },
          ].map((k) => {
            const o = beat(frame, S.s6, k.t, 0.5);
            return (
              <div key={k.name} style={{ opacity: o, translate: `0px ${mix(20, 0, o)}px` }}>
                <div style={{ position: "absolute", left: k.x, top: 260, width: 420, height: 440, borderRadius: 24, border: "4px solid var(--ink)", background: "var(--paper)" }} />
                <Chip text={k.name} color={k.c} fs={52} x={k.x + 210 - chipWidth(k.name, 52) / 2} y={300} />
                <k.Icon x={k.x + 165} y={410} />
                <div style={{ position: "absolute", left: k.x, width: 420, top: 540, textAlign: "center", fontSize: 50, fontWeight: 700 }}>{k.big}</div>
                <div style={{ position: "absolute", left: k.x, width: 420, top: 620, textAlign: "center", fontSize: 34, color: "var(--ink-2)" }}>{k.ex}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* s7: our block is the decoder block */}
      {frame >= S.s7.from && (
        <div style={{ opacity: on7 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 50, fontWeight: 700 }}>{L.decoderBlock}</div>
          <Block x={100} y={240} layers={beat(frame, S.s7, 0.8, 1.0)} />
          <svg width={90} height={90} style={{ position: "absolute", left: 800, top: 240 + attR.y + 6, overflow: "visible", opacity: beat(frame, S.s7, 2.2, 0.4) }}>
            <path d="M 4 4 L 4 86 L 86 86 Z" fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
            <path d="M 4 4 L 86 4 L 86 86 Z" fill="var(--ink-3)" opacity={0.6} />
          </svg>
          <Hand x={792} y={240 + attR.y + 104} fs={36} style={{ width: 230, whiteSpace: "normal", wordBreak: "keep-all", opacity: beat(frame, S.s7, 2.6, 0.4) }}>
            {L.masked}
          </Hand>
          <Hand x={0} y={940} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 4.6, 0.4), rotate: "-2deg" }}>
            {L.chatgpt}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch59.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
