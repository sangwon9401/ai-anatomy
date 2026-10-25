import type { CSSProperties, FC } from "react";
import { useCurrentFrame } from "remotion";
import { STRIP_CALC, STRIP_SEARCH, ch89 } from "../data/ch89";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, wrapLayout, type SceneProps } from "./kit";
import { Arrow, Box, Bubble, CurveArrow, FullSvg, PenCheck, PenCross } from "./part10-kit";

const tl = buildTimeline(ch89);
const S = byId(tl);
const L = ch89.labels;

const FS = 40;
const OUTLINE: CSSProperties = { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" };
const MONO: CSSProperties = { fontFamily: "var(--font-mono)" };
type Piece = { text: string; color: "orange" | "sky" | "mint" | null; style?: CSSProperties };
const piecesOf = (s: typeof STRIP_CALC): Piece[] => [
  { text: s.q, color: null, style: OUTLINE },
  { text: s.call, color: "orange" },
  { text: s.result, color: "sky" },
  { text: s.answer[0], color: "mint" },
  { text: s.answer[1], color: "mint" },
];
const CALC = piecesOf(STRIP_CALC);
const SRCH = piecesOf(STRIP_SEARCH);
const layout = (ps: Piece[]) => wrapLayout(ps.map((p) => chipWidth(p.text, FS)), { y0: 150, lineH: 76 });
const CALC_AT = layout(CALC);
const SRCH_AT = layout(SRCH);
const OUT = { x: 350, y: 652 }; // where pieces pop out under the model (centre x)
const TOOL = { x: 720, y: 440, w: 290, h: 320 };

/** A pocket calculator: display + 12 keys. */
const Calculator: FC<{ o: number; display: string; dispO: number }> = ({ o, display, dispO }) => (
  <div style={{ position: "absolute", left: TOOL.x, top: TOOL.y, width: TOOL.w, height: TOOL.h, borderRadius: 26, background: "var(--hl-violet)", border: "5px solid var(--ink)", opacity: o, boxSizing: "border-box" }}>
    <div style={{ position: "absolute", left: 18, right: 18, top: 18, height: 76, borderRadius: 12, background: "var(--paper)", border: "3px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 12px", fontFamily: "var(--font-mono)", fontSize: 34 }}>
      <span style={{ opacity: dispO }}>{display}</span>
    </div>
    {Array.from({ length: 12 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: 22 + (i % 4) * 62, top: 116 + Math.floor(i / 4) * 60, width: 50, height: 46, borderRadius: 10, background: i % 4 === 3 ? "var(--hl-orange)" : "var(--paper)", border: "3px solid var(--ink)", boxSizing: "border-box" }} />
    ))}
  </div>
);

const SearchPanel: FC<{ o: number; resultO: number }> = ({ o, resultO }) => (
  <div style={{ position: "absolute", left: TOOL.x, top: TOOL.y, width: TOOL.w, height: TOOL.h, borderRadius: 26, background: "var(--paper)", border: "5px solid var(--ink)", opacity: o, boxSizing: "border-box", overflow: "hidden" }}>
    <svg width={120} height={110} style={{ position: "absolute", left: 20, top: 14 }}>
      <circle cx={48} cy={46} r={30} fill="none" stroke="var(--ink)" strokeWidth={8} />
      <line x1={70} y1={68} x2={100} y2={98} stroke="var(--ink)" strokeWidth={12} strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: 130, top: 40, fontSize: 40, fontWeight: 700 }}>{L.searchTool}</div>
    <div style={{ position: "absolute", left: 18, right: 18, top: 140, borderRadius: 12, border: "3px solid var(--ink)", overflow: "hidden", opacity: resultO }}>
      <div style={{ background: "var(--hl-yellow)", color: "var(--chip-ink)", fontSize: 28, fontWeight: 700, padding: "8px 12px" }}>{L.found}</div>
      <div style={{ padding: "10px 12px", fontSize: 28, lineHeight: 1.35, wordBreak: "keep-all" }}>{L.foundText}</div>
    </div>
  </div>
);

/** Pieces of a strip: `show[i]` is 0→1 appearance, `fly[i]` 0→1 travel from the pop-out spot (or `from`) into the strip. */
const Strip: FC<{ ps: Piece[]; at: { x: number; y: number }[]; show: number[]; fly: number[]; from: ({ x: number; y: number } | null)[] }> = ({ ps, at, show, fly, from }) => (
  <>
    {ps.map((p, i) => {
      if (show[i] <= 0) return null;
      const w = chipWidth(p.text, FS);
      const src = from[i] ?? { x: OUT.x - w / 2, y: OUT.y };
      const f = fly[i];
      return (
        <Chip
          key={i}
          text={p.text}
          color={p.color}
          fs={FS}
          x={mix(src.x, at[i].x, f)}
          y={mix(src.y, at[i].y, f)}
          style={{ ...p.style, opacity: show[i], scale: String(mix(0.6, 1, show[i])) }}
        />
      );
    })}
  </>
);

// s6 loop geometry
const C = { x: 540, y: 600, r: 230 };
const pt = (deg: number) => ({ x: C.x + C.r * Math.cos((deg * Math.PI) / 180), y: C.y + C.r * Math.sin((deg * Math.PI) / 180) });
const NODES = [
  { deg: -90, label: L.think, c: "var(--hl-yellow)" },
  { deg: 30, label: L.callTool, c: "var(--hl-orange)" },
  { deg: 150, label: L.see, c: "var(--hl-sky)" },
];
const arc = (a: number, b: number) => {
  const p = pt(a);
  const q = pt(b);
  return `M ${p.x} ${p.y} A ${C.r} ${C.r} 0 0 1 ${q.x} ${q.y}`;
};
const arcHead = (b: number) => {
  const q = pt(b);
  const t = ((b + 90) * Math.PI) / 180; // tangent direction (clockwise)
  const h = 20;
  const l = { x: q.x - h * Math.cos(t - 0.5), y: q.y - h * Math.sin(t - 0.5) };
  const r = { x: q.x - h * Math.cos(t + 0.5), y: q.y - h * Math.sin(t + 0.5) };
  return `M ${l.x} ${l.y} L ${q.x} ${q.y} L ${r.x} ${r.y}`;
};

const Lock: FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={70} height={80} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <path d="M 18 34 V 22 a 17 17 0 0 1 34 0 V 34" fill="none" stroke="var(--ink)" strokeWidth={7} />
    <rect x={8} y={34} width={54} height={40} rx={8} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={5} />
    <circle cx={35} cy={52} r={5} fill="var(--ink)" />
  </svg>
);

export const Ch89Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1On = 1 - beat(frame, S.s2, 0, 0.4);
  const rigOn = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));
  const calcPhase = 1 - beat(frame, S.s5, 0, 0.4);
  const srchPhase = beat(frame, S.s5, 0.3, 0.4);
  const loopOn = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.4));

  // calculator strip timing
  const calcShow = [beat(frame, S.s2, 0.3, 0.4), beat(frame, S.s2, 1.4, 0.4), beat(frame, S.s4, 0.2, 0.3), beat(frame, S.s4, 3.2, 0.3), beat(frame, S.s4, 4.0, 0.3)];
  const calcFly = [1, beat(frame, S.s2, 2.4, 0.9, EASE_IO), beat(frame, S.s4, 0.5, 0.9, EASE_IO), beat(frame, S.s4, 3.6, 0.8, EASE_IO), beat(frame, S.s4, 4.4, 0.8, EASE_IO)];
  const fromCalc = { x: TOOL.x + 10, y: TOOL.y + 26 };
  const srchShow = [beat(frame, S.s5, 0.3, 0.3), beat(frame, S.s5, 0.9, 0.3), beat(frame, S.s5, 3.0, 0.3), beat(frame, S.s5, 4.0, 0.3), beat(frame, S.s5, 4.3, 0.3)];

  const callAt = CALC_AT[1];
  const callW = chipWidth(CALC[1].text, FS);

  // s6: a dot runs round the loop twice, then leaves for the answer
  const run = beat(frame, S.s6, 1.4, 4.6, EASE_IO);
  const dot = pt(-90 + 720 * run);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: what text alone cannot do */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Bubble x={560} y={150} w={460} side="user" fs={42} text={L.q1} o={beat(frame, S.s1, 0.3, 0.4)} style={MONO} />
          <Bubble x={60} y={270} w={520} side="ai" fs={42} text={L.a1} o={beat(frame, S.s1, 1.0, 0.4)} />
          <PenCross x={650} y={316} r={36} p={beat(frame, S.s1, 2.0, 0.4)} />
          <Hand x={720} y={290} fs={44} style={{ opacity: beat(frame, S.s1, 2.2, 0.4) }}>
            {L.hard}
          </Hand>
          <Bubble x={560} y={480} w={460} side="user" fs={42} text={L.q2} o={beat(frame, S.s1, 3.4, 0.4)} />
          <Bubble x={60} y={600} w={520} side="ai" fs={42} text={L.a2} o={beat(frame, S.s1, 4.0, 0.4)} />
          <Hand x={620} y={620} fs={44} style={{ opacity: beat(frame, S.s1, 4.8, 0.4) }}>
            {L.blind}
          </Hand>
          <Hand x={0} y={830} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 5.6, 0.4) }}>
            {L.textOnly}
          </Hand>
          <div style={{ position: "absolute", right: 60, top: 1010, fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s1, 1.4, 0.4) }}>{L.example}</div>
        </div>
      )}

      {/* s2–s5: model inside a program, with a tool on the side */}
      {frame >= S.s2.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: rigOn }}>
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 420,
              width: 600,
              height: 360,
              borderRadius: 28,
              border: "4px dashed var(--ink-2)",
              opacity: beat(frame, S.s3, 0.3, 0.4),
            }}
          />
          <Chip text={L.program} color={null} fs={32} x={90} y={396} style={{ background: "var(--ink)", color: "var(--paper)", opacity: beat(frame, S.s3, 0.5, 0.4) }} />
          <Box x={140} y={470} w={420} h={140} label={L.model} fs={58} />

          {/* calculator round (s2–s4) */}
          <div style={{ opacity: calcPhase }}>
            <Strip ps={CALC} at={CALC_AT} show={calcShow} fly={calcFly} from={[null, null, fromCalc, null, null]} />
            {frame < S.s3.from + 15 && (
              <div style={{ opacity: 1 - beat(frame, S.s3, 0, 0.3) }}>
                <PenCircle x={callAt.x - 16} y={callAt.y - 12} w={callW + 32} h={FS * 1.5 + 24} p={beat(frame, S.s2, 3.8, 0.6)} />
                <Hand x={80} y={860} fs={46} style={{ opacity: beat(frame, S.s2, 4.4, 0.4) }}>
                  {L.promise}
                </Hand>
              </div>
            )}
            {frame >= S.s3.from && (
              <>
                <Hand x={420} y={640} fs={54} style={{ opacity: beat(frame, S.s3, 0.9, 0.3) * (1 - beat(frame, S.s4, 0, 0.3)), rotate: "-6deg" }}>
                  {L.stop}
                </Hand>
                <CurveArrow
                  d={`M ${callAt.x + callW - 30} ${callAt.y + FS * 1.5 + 6} C ${callAt.x + callW + 60} ${callAt.y + 160}, 860 330, 860 430`}
                  end={[860, 430]}
                  ang={Math.PI / 2}
                  p={beat(frame, S.s3, 1.4, 0.7) * (1 - beat(frame, S.s4, 0, 0.3))}
                  color="var(--ink)"
                  width={5}
                />
                <Calculator o={beat(frame, S.s3, 1.2, 0.4)} display={STRIP_CALC.result.replace("→ ", "")} dispO={beat(frame, S.s3, 2.6, 0.3)} />
                <Hand x={TOOL.x + 40} y={TOOL.y + TOOL.h + 20} fs={44} style={{ opacity: beat(frame, S.s3, 3.4, 0.4) }}>
                  {L.real}
                </Hand>
              </>
            )}
            {frame >= S.s4.from && (
              <>
                <Arrow x1={350} y1={CALC_AT[4].y + 78} x2={350} y2={462} p={beat(frame, S.s4, 1.6, 0.5)} color="var(--pen)" />
                <Hand x={80} y={860} fs={48} style={{ opacity: beat(frame, S.s4, 2.2, 0.4) }}>
                  {L.again}
                </Hand>
                <PenCheck x={CALC_AT[4].x + chipWidth(CALC[4].text, FS) + 44} y={CALC_AT[4].y + 30} r={26} p={beat(frame, S.s4, 5.4, 0.4)} />
              </>
            )}
          </div>

          {/* search round (s5) */}
          {frame >= S.s5.from && (
            <div style={{ opacity: srchPhase }}>
              <Strip ps={SRCH} at={SRCH_AT} show={srchShow} fly={[1, 1, 1, 1, 1]} from={[null, null, null, null, null]} />
              <CurveArrow
                d={`M ${SRCH_AT[1].x + chipWidth(SRCH[1].text, FS) + 10} ${SRCH_AT[1].y + 30} C 920 ${SRCH_AT[1].y + 30}, 880 330, 860 430`}
                end={[860, 430]}
                ang={Math.atan2(100, -20)}
                p={beat(frame, S.s5, 1.4, 0.6)}
                color="var(--ink)"
                width={5}
              />
              <SearchPanel o={beat(frame, S.s5, 1.8, 0.4)} resultO={beat(frame, S.s5, 2.4, 0.4)} />
              <Hand x={80} y={860} fs={48} style={{ opacity: beat(frame, S.s5, 5.4, 0.4) }}>
                {L.rag}
              </Hand>
            </div>
          )}
        </div>
      )}

      {/* s6: the agent loop */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: loopOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 58, fontWeight: 700 }}>{L.agent}</div>
          <FullSvg>
            {NODES.map((n, i) => {
              const a = n.deg + 32;
              const b = NODES[(i + 1) % 3].deg + (i === 2 ? 360 : 0) - 32;
              const p = beat(frame, S.s6, 0.8 + i * 0.2, 0.5);
              return (
                <g key={i} opacity={p > 0 ? 1 : 0}>
                  <path d={arc(a, b)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" />
                  {p > 0.95 && <path d={arcHead(b)} fill="none" stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
                </g>
              );
            })}
            {run > 0 && run < 1 && <circle cx={dot.x} cy={dot.y} r={18} fill="var(--pen)" />}
          </FullSvg>
          {NODES.map((n) => {
            const p = pt(n.deg);
            return <Box key={n.label} x={p.x - 130} y={p.y - 50} w={260} h={100} label={n.label} fs={42} color={n.c} />;
          })}
          <Arrow x1={680} y1={370} x2={800} y2={370} p={beat(frame, S.s6, 6.0, 0.4)} color="var(--pen)" />
          <Hand x={812} y={344} fs={44} style={{ opacity: beat(frame, S.s6, 6.2, 0.4) }}>
            {L.done}
          </Hand>
          <Hand x={0} y={930} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 3.0, 0.4) }}>
            {L.loops}
          </Hand>
        </div>
      )}

      {/* s7: safety */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          {[
            { t: L.calc, x: 80, y: 200, ok: true },
            { t: L.searchTool, x: 580, y: 200, ok: true },
            { t: L.mail, x: 80, y: 500, ok: false },
            { t: L.pay, x: 580, y: 500, ok: false },
          ].map((c, i) => {
            const a = beat(frame, S.s7, 0.6 + i * 0.5, 0.4);
            return (
              <div key={c.t} style={{ opacity: a }}>
                <Box x={c.x} y={c.y} w={420} h={150} fs={44} color={c.ok ? "var(--hl-mint)" : "var(--hl-pink)"} style={{ placeItems: "center start", paddingLeft: 36 }} label={c.t} />
                <div style={{ position: "absolute", left: c.x + 36, top: c.y + 166, fontSize: 34, fontWeight: 500, color: "var(--ink-2)" }}>{c.ok ? L.ok : L.human}</div>
                {c.ok ? <PenCheck x={c.x + 350} y={c.y + 75} r={30} p={beat(frame, S.s7, 0.9 + i * 0.5, 0.4)} /> : <Lock x={c.x + 320} y={c.y + 36} />}
              </div>
            );
          })}
          <Hand x={0} y={860} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.6, 0.4) }}>
            {L.careful}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch89.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
