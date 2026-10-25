import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { DIST82, PIPE, SURE, UNSURE, ch82, keepTopK, keepTopP, renorm, type Cand } from "../data/ch82";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenCircle, PenUnderline, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, textWidth, type SceneProps } from "./kit";
import { Arrow, OUTLINE } from "./part9-kit";

const tl = buildTimeline(ch82);
const S = byId(tl);
const L = ch82.labels;

const PROMPT = ["나는", "오늘", "학교에"];
const SFS = 44;
const BLANK = 170;
const SX = rowLayout([...PROMPT.map((w) => chipWidth(w, SFS)), BLANK], 16);

const Y0 = 300;
const ROW = 92;
const LFS = 42;
const LX = 90;
const BAR_X = 300;
const SCALE = 900;
const SUM_X = 890;
const CUT_K = keepTopK(DIST82, 3);
const CUT_P = keepTopP(DIST82, 0.9);
const RK = renorm(DIST82, CUT_K);
const CUM = DIST82.map((_, i) => DIST82.slice(0, i + 1).reduce((a, b) => a + b.p, 0));
const fmt = (p: number) => (Math.abs(p * 100 - Math.round(p * 100)) < 0.05 ? `${Math.round(p * 100)}%` : `${(p * 100).toFixed(1)}%`);
const barColor = (c: Cand["c"]) => (c ? `var(--hl-${c})` : "var(--grid-major)");

const CutLine: FC<{ y: number; x1?: number; x2?: number; p: number; color?: string }> = ({ y, x1 = 64, x2 = 1016, p, color = "var(--pen)" }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: p > 0 ? 1 : 0 }}>
    <line x1={x1} y1={y} x2={mix(x1, x2, p)} y2={y} stroke={color} strokeWidth={5} strokeDasharray="18 12" strokeLinecap="round" />
  </svg>
);

const Panel: FC<{ x0: number; items: Cand[]; title: string; sub: string; keep: string; frame: number; t0: number }> = ({ x0, items, title, sub, keep, frame, t0 }) => {
  const y0 = 290;
  const row = 76;
  const kK = keepTopK(items, 3);
  const kP = keepTopP(items, 0.9);
  const lineY = (n: number) => y0 + n * row - 8;
  const a = beat(frame, S.s6, t0, 0.5);
  return (
    <div style={{ opacity: a }}>
      <div style={{ position: "absolute", left: x0, top: 140, fontSize: 38, fontWeight: 700 }}>{title}</div>
      <Hand x={x0} y={198} fs={42}>
        {sub}
      </Hand>
      {items.map((it, i) => (
        <div key={it.w}>
          <Chip text={it.w} color={it.c} fs={34} x={x0} y={y0 + i * row} />
          <div style={{ position: "absolute", left: x0 + 130, top: y0 + i * row + 14, height: 26, width: it.p * 300, borderRadius: 13, background: barColor(it.c) }} />
          <div style={{ position: "absolute", left: x0 + 140 + it.p * 300, top: y0 + i * row + 8, fontFamily: "var(--font-mono)", fontSize: 30 }}>{fmt(it.p)}</div>
        </div>
      ))}
      <CutLine y={lineY(kK)} x1={x0 - 10} x2={x0 + 450} p={beat(frame, S.s6, t0 + 1.0, 0.5)} color="var(--ink-2)" />
      <div style={{ position: "absolute", left: x0 + 250, width: 200, textAlign: "right", top: lineY(kK) + 6, fontSize: 28, fontWeight: 700, color: "var(--ink-2)", opacity: beat(frame, S.s6, t0 + 1.2, 0.3) }}>{L.kLine}</div>
      <CutLine y={lineY(kP)} x1={x0 - 10} x2={x0 + 450} p={beat(frame, S.s6, t0 + 1.8, 0.5)} />
      <div style={{ position: "absolute", left: x0 + 250, width: 200, textAlign: "right", top: lineY(kP) + 6, fontSize: 28, fontWeight: 700, color: "var(--pen)", opacity: beat(frame, S.s6, t0 + 2.0, 0.3) }}>{L.pLine}</div>
      <div style={{ position: "absolute", left: x0, width: 460, top: 880, textAlign: "center", fontSize: 34, fontWeight: 500, opacity: beat(frame, S.s6, t0 + 2.4, 0.4) }}>{keep}</div>
    </div>
  );
};

export const Ch82Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const listOn = (1 - beat(frame, S.s2, 0, 0.5)) + beat(frame, S.s3, 0, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const sentOn = 1 - beat(frame, S.s6, 0, 0.5);
  const calcOn = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.4));
  const kOn = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s5, 0, 0.4));
  const pOn = beat(frame, S.s5, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.4));

  // cutting and sharing out again
  const kCut = beat(frame, S.s3, 2.6, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const kRenorm = beat(frame, S.s4, 0.6, 1.2, EASE_IO) * (1 - beat(frame, S.s5, 0, 0.5, EASE_IO));
  const pCut = beat(frame, S.s5, 4.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* the sentence */}
      {frame < S.s6.from + 15 && (
        <div style={{ opacity: sentOn }}>
          {PROMPT.map((w, i) => (
            <Chip key={w} text={w} color={null} fs={SFS} x={SX[i]} y={130} style={{ ...OUTLINE, opacity: beat(frame, S.s1, 0.1 + i * 0.15, 0.4) }} />
          ))}
          <div style={{ position: "absolute", left: SX[3], top: 130, width: BLANK, height: SFS * 1.5, border: "3px dashed var(--ink-3)", borderRadius: 12, opacity: beat(frame, S.s1, 0.6, 0.4) }} />
        </div>
      )}

      {/* the candidate list */}
      {frame < S.s6.from + 15 && (
        <div style={{ opacity: Math.min(1, listOn) }}>
          {DIST82.map((c, i) => {
            const y = Y0 + i * ROW;
            const a = beat(frame, S.s1, 0.3 + i * 0.15, 0.5);
            const g = beat(frame, S.s1, 0.7 + i * 0.12, 0.8);
            const cut = i >= CUT_K ? kCut : 0;
            const cutP = i >= CUT_P ? pCut : 0;
            const dim = 1 - 0.8 * Math.max(cut, cutP);
            const p = mix(c.p, RK[i] || c.p, i < CUT_K ? kRenorm : 0);
            return (
              <div key={c.w} style={{ opacity: a * dim }}>
                <Chip text={c.w} color={c.c} fs={LFS} x={LX} y={y} />
                <div style={{ position: "absolute", left: BAR_X, top: y + 18, height: 30, width: p * SCALE * g, borderRadius: 15, background: barColor(c.c) }} />
                <div style={{ position: "absolute", left: BAR_X + p * SCALE + 14, top: y + 12, fontFamily: "var(--font-mono)", fontSize: 38, opacity: g }}>{fmt(p)}</div>
                {Math.max(cut, cutP) > 0 && (
                  <div style={{ position: "absolute", left: LX - 8, top: y + LFS * 0.75 - 3, width: (chipWidth(c.w, LFS) + 16) * Math.max(cut, cutP), height: 6, borderRadius: 3, background: "var(--pen)" }} />
                )}
              </div>
            );
          })}

          {/* s1: the tail */}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: beat(frame, S.s1, 3.0, 0.4) * (1 - beat(frame, S.s2, 0, 0.3)) }}>
            <path d={`M 448 ${Y0 + 5 * ROW + 4} C 474 ${Y0 + 5 * ROW + 4}, 462 ${Y0 + 6 * ROW - 20}, 484 ${Y0 + 6 * ROW - 6} C 462 ${Y0 + 6 * ROW + 8}, 474 ${Y0 + 7 * ROW - 26}, 448 ${Y0 + 7 * ROW - 22}`} fill="none" stroke="var(--pen)" strokeWidth={5} strokeLinecap="round" />
          </svg>
          <Hand x={510} y={Y0 + 6 * ROW - 34} fs={48} style={{ opacity: beat(frame, S.s1, 3.3, 0.4) * (1 - beat(frame, S.s2, 0, 0.3)) }}>
            {L.tail}
          </Hand>
          <Hand x={LX} y={Y0 + 7 * ROW + 6} fs={34} color="var(--ink-3)" style={{ opacity: beat(frame, S.s1, 2.0, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
            {L.example} · {L.tailNote}
          </Hand>
        </div>
      )}

      {/* s2: why a small tail matters */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: calcOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontSize: 50, fontWeight: 700 }}>{L.long}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontSize: 40, color: "var(--ink-2)", opacity: beat(frame, S.s2, 0.9, 0.4) }}>{L.avoid}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 510, textAlign: "center", fontSize: 50, fontWeight: 500, opacity: beat(frame, S.s2, 1.5, 0.4) }}>{L.mult}</div>
          <Hand x={0} y={580} fs={46} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 1.9, 0.4) }}>
            {L.times}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center", fontSize: 56, fontWeight: 700, opacity: beat(frame, S.s2, 2.6, 0.4) }}>{L.approx}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontSize: 50, fontWeight: 700, opacity: beat(frame, S.s2, 3.8, 0.5) }}>{L.once}</div>
          <PenUnderline x={540 - textWidth(L.once, 50) / 2} y={872} w={textWidth(L.once, 50)} p={beat(frame, S.s2, 4.6, 0.7)} />
          <div style={{ position: "absolute", right: 70, top: 940, fontSize: 30, color: "var(--ink-3)", opacity: beat(frame, S.s2, 4.0, 0.4) }}>{L.calc}</div>
        </div>
      )}

      {/* s3–s4: Top-k */}
      {frame >= S.s3.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: kOn }}>
          <Chip text={L.way1} color={null} fs={32} x={LX} y={226} style={OUTLINE} />
          <div style={{ position: "absolute", left: LX + chipWidth(L.way1, 32) + 16, top: 214, fontSize: 52, fontWeight: 700 }}>{L.topk}</div>
          <Chip text={L.k3} color="sky" fs={34} x={LX + chipWidth(L.way1, 32) + 16 + textWidth(L.topk, 52) + 24} y={224} />
          <Hand x={560} y={222} fs={44} style={{ opacity: beat(frame, S.s3, 1.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            {L.topkNote}
          </Hand>
          <CutLine y={Y0 + CUT_K * ROW - 12} p={beat(frame, S.s3, 2.0, 0.6)} />
          <Hand x={860} y={Y0 + CUT_K * ROW - 2} fs={46} style={{ opacity: beat(frame, S.s3, 2.6, 0.3), rotate: "-4deg" }}>
            {L.snip}
          </Hand>
          <Hand x={660} y={Y0 + ROW + 8} fs={42} style={{ opacity: beat(frame, S.s4, 1.8, 0.4) }}>
            {L.renorm}
          </Hand>
        </div>
      )}

      {/* s5: Top-p */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: pOn }}>
          <Chip text={L.way2} color={null} fs={32} x={LX} y={226} style={OUTLINE} />
          <div style={{ position: "absolute", left: LX + chipWidth(L.way2, 32) + 16, top: 214, fontSize: 52, fontWeight: 700 }}>{L.topp}</div>
          <Chip text={L.p90} color="pink" fs={34} x={LX + chipWidth(L.way2, 32) + 16 + textWidth(L.topp, 52) + 24} y={224} />
          <div style={{ position: "absolute", left: SUM_X - 30, width: 150, top: 262, textAlign: "center", fontSize: 28, color: "var(--ink-2)", opacity: beat(frame, S.s5, 1.0, 0.4) }}>{L.sum}</div>
          {CUM.slice(0, CUT_P).map((c, i) => (
            <div key={i} style={{ position: "absolute", left: SUM_X - 30, width: 150, top: Y0 + i * ROW + 12, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 500, opacity: beat(frame, S.s5, 1.4 + i * 0.5, 0.3) }}>
              {Math.round(c * 100)}%
            </div>
          ))}
          <PenCircle x={SUM_X - 22} y={Y0 + (CUT_P - 1) * ROW - 4} w={136} h={74} p={beat(frame, S.s5, 3.3, 0.5)} />
          <Hand x={590} y={Y0 + (CUT_P - 1) * ROW + 6} fs={42} style={{ opacity: beat(frame, S.s5, 3.6, 0.4) }}>
            {L.over}
          </Hand>
          <CutLine y={Y0 + CUT_P * ROW - 12} p={beat(frame, S.s5, 3.9, 0.6)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 990, textAlign: "center", fontSize: 34, color: "var(--ink-2)", opacity: beat(frame, S.s5, 5.4, 0.4) }}>{L.toppRenorm}</div>
        </div>
      )}

      {/* s6: sure vs unsure */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: 1 - beat(frame, S.s7, 0, 0.5) }}>
          <Panel x0={60} items={SURE} title={L.sureQ} sub={L.sure} keep={L.keepSure} frame={frame} t0={0.4} />
          <Panel x0={570} items={UNSURE} title={L.unsureQ} sub={L.unsure} keep={L.keepUnsure} frame={frame} t0={2.4} />
          <div style={{ position: "absolute", left: 540, top: 150, width: 3, height: 780, background: "var(--line)" }} />
          <Hand x={0} y={960} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 5.6, 0.4) }}>
            {L.adapt}
          </Hand>
        </div>
      )}

      {/* s7: the whole path */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.pipeTitle}</div>
          {PIPE.map((b, i) => {
            const row = i < 3 ? 0 : 1;
            const col = row === 0 ? i : 5 - i;
            const x = 70 + col * 330;
            const y = 320 + row * 280;
            const a = beat(frame, S.s7, 0.8 + i * 0.7, 0.4);
            const here = i === 3;
            return (
              <div key={b.a} style={{ opacity: a, scale: String(mix(0.85, 1, a)) }}>
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 280,
                    height: 150,
                    borderRadius: 24,
                    border: `${here ? 5 : 3}px solid var(--ink)`,
                    background: here ? "var(--hl-yellow)" : i === 5 ? "var(--hl-mint)" : "var(--paper)",
                    color: here || i === 5 ? "var(--chip-ink)" : "var(--ink)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <div style={{ fontSize: 42, fontWeight: 700 }}>{b.a}</div>
                  {b.b && <div style={{ fontSize: 30, opacity: 0.75 }}>{b.b}</div>}
                </div>
              </div>
            );
          })}
          <Arrow x1={356} y1={395} x2={394} y2={395} p={beat(frame, S.s7, 1.3, 0.3)} />
          <Arrow x1={686} y1={395} x2={724} y2={395} p={beat(frame, S.s7, 2.0, 0.3)} />
          <Arrow x1={870} y1={476} x2={870} y2={594} p={beat(frame, S.s7, 2.7, 0.3)} />
          <Arrow x1={724} y1={675} x2={686} y2={675} p={beat(frame, S.s7, 3.4, 0.3)} />
          <Arrow x1={394} y1={675} x2={356} y2={675} p={beat(frame, S.s7, 4.1, 0.3)} />
          <Arrow x1={210} y1={594} x2={210} y2={478} p={beat(frame, S.s7, 5.0, 0.4)} color="var(--pen)" width={7} />
          <Hand x={0} y={810} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.3, 0.4) }}>
            {L.again}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch82.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
