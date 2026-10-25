import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { GRADED, ch20 } from "../../../data/ch20";
import { num } from "../../../data/part2-toy";
import { Caption, Chip, EASE, EASE_IO, Hand, InlineUnderline, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "../../../scenes/kit";
import { Banner, FullSvg } from "../../../scenes/part2-kit";

const tl = buildTimeline(ch20);
const S = byId(tl);
const L = ch20.labels;

// ---- the big ruler (s1–s2) ----
const BIG = { x0: 140, unit: 160, y: 620 };
const bx = (v: number) => BIG.x0 + v * BIG.unit;
// ---- three small rulers (s3–s5) ----
const ROW_Y = [370, 560, 750];
const SMALL = { x0: 190, unit: 104 };
const sx = (v: number) => SMALL.x0 + v * SMALL.unit;
const COL = 780;
const A = GRADED[0];

const Target: FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r} fill="var(--hl-pink)" stroke="var(--ink)" strokeWidth={4} />
    <circle cx={x} cy={y} r={r * 0.64} fill="var(--paper)" stroke="var(--ink)" strokeWidth={3} />
    <circle cx={x} cy={y} r={r * 0.3} fill="var(--pen)" />
  </g>
);

/** a dart stuck at (x, y), flying in along its own direction as p goes 0→1 */
const Dart: FC<{ x: number; y: number; len: number; p: number; w?: number }> = ({ x, y, len, p, w = 7 }) => {
  if (p <= 0) return null;
  const ang = (-125 * Math.PI) / 180; // points down-right toward the tip
  const ux = Math.cos(ang);
  const uy = Math.sin(ang);
  const fly = (1 - p) * 420;
  const tx = x + ux * fly;
  const ty = y + uy * fly;
  const ex = tx + ux * len;
  const ey = ty + uy * len;
  const h = w * 3.8;
  const px = -uy;
  const py = ux;
  return (
    <g opacity={Math.min(1, p * 3)}>
      <line x1={tx + ux * h * 0.8} y1={ty + uy * h * 0.8} x2={ex} y2={ey} stroke="var(--ink)" strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${tx} ${ty} L ${tx + ux * h + px * h * 0.5} ${ty + uy * h + py * h * 0.5} L ${tx + ux * h - px * h * 0.5} ${ty + uy * h - py * h * 0.5} Z`} fill="var(--ink)" />
      {/* feathers: from a point on the shaft, sweeping back and out */}
      {[0, 0.45].map((k) => {
        const vx = ex - ux * h * (1.1 + k);
        const vy = ey - uy * h * (1.1 + k);
        return (
          <path
            key={k}
            d={`M ${vx} ${vy} l ${ux * h * 0.8 + px * h * 0.55} ${uy * h * 0.8 + py * h * 0.55} M ${vx} ${vy} l ${ux * h * 0.8 - px * h * 0.55} ${uy * h * 0.8 - py * h * 0.55}`}
            stroke="var(--pen)"
            strokeWidth={w * 0.8}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

const RulerLine: FC<{ x0: number; unit: number; y: number; p: number; fs: number; tick: number }> = ({ x0, unit, y, p, fs, tick }) => (
  <>
    <FullSvg>
      <line x1={x0} y1={y} x2={mix(x0, x0 + 5 * unit, p)} y2={y} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((v) => (
        <line key={v} x1={x0 + v * unit} y1={y - tick} x2={x0 + v * unit} y2={y + tick} stroke="var(--ink)" strokeWidth={3} opacity={p > 0.9 ? 1 : 0} />
      ))}
    </FullSvg>
    {[0, 1, 2, 3, 4, 5].map((v) => (
      <div key={v} style={{ position: "absolute", left: x0 + v * unit - 30, width: 60, top: y + tick + 6, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: fs, color: "var(--ink-2)", opacity: p > 0.9 ? 1 : 0 }}>
        {v}
      </div>
    ))}
  </>
);

export const Ch20Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const bigO = 1 - beat(frame, S.s3, 0, 0.5);
  const rowsO = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const gptO = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const endO = beat(frame, S.s7, 0.3, 0.5);
  const sq = beat(frame, S.s4, 0.8, 1.0, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s2: one store, one dart */}
      {frame < S.s3.from + 15 && (
        <div style={{ opacity: bigO }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 50, fontWeight: 700 }}>{L.titleA}</div>
          <Hand x={64 + 520} y={128} fs={38} color="var(--ink-3)">
            {L.example}
          </Hand>
          <RulerLine x0={BIG.x0} unit={BIG.unit} y={BIG.y} p={beat(frame, S.s1, 0.2, 0.6)} fs={34} tick={14} />
          <div style={{ position: "absolute", left: BIG.x0 - 20, top: BIG.y - 74, fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s1, 0.6, 0.4) }}>{L.star}</div>
          <FullSvg>
            <Target x={bx(A.real)} y={BIG.y} r={62} o={beat(frame, S.s1, 2.6, 0.4)} />
            <Dart x={bx(A.pred)} y={BIG.y} len={150} p={beat(frame, S.s1, 0.9, 0.8, EASE)} w={8} />
            {/* s2: the gap */}
            {(() => {
              const p = beat(frame, S.s2, 0.4, 0.6);
              const y = BIG.y + 110;
              return (
                <g opacity={p > 0 ? 1 : 0}>
                  <path d={`M ${bx(A.pred)} ${y - 16} L ${bx(A.pred)} ${y} L ${mix(bx(A.pred), bx(A.real), p)} ${y} ${p >= 1 ? `L ${bx(A.real)} ${y - 16}` : ""}`} fill="none" stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })()}
          </FullSvg>
          <div style={{ position: "absolute", left: bx(A.pred) - 200, width: 260, top: BIG.y - 250, textAlign: "center", fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s1, 1.6, 0.4) }}>
            {L.pred} <span style={{ fontFamily: "var(--font-mono)" }}>{num(A.pred)}</span>
          </div>
          <div style={{ position: "absolute", left: bx(A.real) - 150, width: 300, top: BIG.y - 150, textAlign: "center", fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s1, 3.0, 0.4) }}>
            {L.real} <span style={{ fontFamily: "var(--font-mono)" }}>{num(A.real)}</span>
          </div>
          <Hand x={bx(A.pred) - 10} y={BIG.y + 128} fs={44} style={{ opacity: beat(frame, S.s2, 1.0, 0.4) }}>
            {L.gap}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 50, fontWeight: 500, opacity: beat(frame, S.s2, 2.4, 0.5) }}>
            <InlineUnderline p={beat(frame, S.s2, 4.0, 0.6)}>{L.errFormula}</InlineUnderline>
          </div>
        </div>
      )}

      {/* s3–s5: three stores */}
      {frame >= S.s3.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: rowsO }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 50, fontWeight: 700 }}>{L.title3}</div>
          {frame >= S.s5.from && (
            <Hand x={640} y={128} fs={42} style={{ opacity: beat(frame, S.s5, 3.6, 0.4) }}>
              {L.zero}
            </Hand>
          )}
          <div style={{ position: "absolute", left: COL - 10, width: 240, top: 236, textAlign: "center", fontSize: 36, fontWeight: 700, color: "var(--ink-2)" }}>
            <span style={{ opacity: 1 - sq }}>{L.err}</span>
            <span style={{ position: "absolute", left: 0, right: 0, opacity: sq }}>{L.square}</span>
          </div>
          {GRADED.map((g, i) => {
            const y = ROW_Y[i];
            const o = beat(frame, S.s3, 0.4 + i * 0.5, 0.4);
            const side = Math.abs(g.err) * 92;
            return (
              <div key={g.name} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: 64, top: y - 30, fontSize: 40, fontWeight: 700 }}>{g.name.replace("Truck ", "")}</div>
                <RulerLine x0={SMALL.x0} unit={SMALL.unit} y={y} p={1} fs={28} tick={10} />
                <FullSvg>
                  <Target x={sx(g.real)} y={y} r={32} />
                  <Dart x={sx(g.pred)} y={y} len={86} p={beat(frame, S.s3, 0.6 + i * 0.5, 0.5, EASE)} w={6} />
                  <rect x={COL + 30} y={y - side / 2} width={side} height={side} fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={3} opacity={sq} transform={`translate(${(1 - sq) * 20} 0)`} />
                </FullSvg>
                <div style={{ position: "absolute", left: COL, width: 220, top: y - 32, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 700, color: "var(--pen)", opacity: beat(frame, S.s3, 1.0 + i * 0.5, 0.4) * (1 - sq) }}>
                  {g.err > 0 ? "+" : ""}
                  {num(g.err)}
                </div>
                <div style={{ position: "absolute", left: COL + 140, top: y - 30, fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 700, opacity: sq }}>{num(g.err ** 2)}</div>
              </div>
            );
          })}
          {/* bottom line: sum → squares → mean */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontSize: 44, fontWeight: 500 }}>
            <span style={{ position: "absolute", left: 0, right: 0, opacity: beat(frame, S.s3, 3.0, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>{L.sum}</span>
            <span style={{ position: "absolute", left: 0, right: 0, opacity: beat(frame, S.s4, 2.4, 0.4) * (1 - beat(frame, S.s5, 0, 0.3)) }}>{L.sqSum}</span>
            <span style={{ position: "absolute", left: 0, right: 0, opacity: beat(frame, S.s5, 0.4, 0.4) }}>{L.mean}</span>
          </div>
          <Hand x={0} y={960} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 4.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            {L.looks}
          </Hand>
          <Hand x={0} y={960} fs={48} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 4.0, 0.4) * (1 - beat(frame, S.s5, 0, 0.3)) }}>
            {L.big}
          </Hand>
          {frame >= S.s5.from && <Banner text={L.loss} y={966} fs={52} o={beat(frame, S.s5, 1.8, 0.5)} />}
        </div>
      )}

      {/* s6: GPT grades a word */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: gptO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 56, fontWeight: 700 }}>{L.gptTitle}</div>
          {(() => {
            const fs = 50;
            const w1 = chipWidth(L.sentence, fs);
            const w2 = chipWidth("school", fs);
            const x0 = 540 - (w1 + 24 + w2) / 2;
            return (
              <>
                <Chip text={L.sentence} color={null} fs={fs} x={x0} y={270} style={{ background: "var(--paper)", border: "3px solid var(--ink)", color: "var(--ink)" }} />
                <Chip text="school" color="yellow" fs={fs} x={x0 + w1 + 24} y={270} style={{ opacity: beat(frame, S.s6, 0.8, 0.4) }} />
              </>
            );
          })()}
          <Hand x={0} y={370} fs={42} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 1.2, 0.4) }}>
            {L.answer}
          </Hand>
          {[
            { w: "school", p: 0.52, c: "var(--hl-yellow)" },
            { w: "the", p: 0.21, c: "var(--hl-mint)" },
            { w: "work", p: 0.12, c: "var(--hl-sky)" },
          ].map((b, i) => (
            <div key={b.w} style={{ opacity: beat(frame, S.s6, 1.8 + i * 0.25, 0.4) }}>
              <div style={{ position: "absolute", left: 150, width: 150, top: 480 + i * 90, fontSize: 42, fontWeight: i === 0 ? 700 : 500 }}>{b.w}</div>
              <div style={{ position: "absolute", left: 310, top: 488 + i * 90, height: 48, width: b.p * 1100, borderRadius: 24, background: b.c }} />
              <div style={{ position: "absolute", left: 330 + b.p * 1100, top: 482 + i * 90, fontFamily: "var(--font-mono)", fontSize: 40 }}>{Math.round(b.p * 100)}%</div>
            </div>
          ))}
          <Hand x={640} y={420} fs={42} style={{ opacity: beat(frame, S.s6, 3.2, 0.4) }}>
            ↙ {L.gave}
          </Hand>
          <Banner text={L.ce} y={820} fs={50} color="var(--hl-violet)" o={beat(frame, S.s6, 4.4, 0.5)} />
          <Hand x={0} y={920} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 5.4, 0.4) }}>
            {L.surprise}
          </Hand>
        </div>
      )}

      {/* s7: the goal */}
      {frame >= S.s7.from && (
        <div style={{ opacity: endO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.goal1}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", opacity: beat(frame, S.s7, 1.4, 0.4) }}>
            <span style={{ fontSize: 50, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 22px" }}>{L.goal2}</span>
          </div>
          <Hand x={0} y={660} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.2, 0.5), rotate: "-2deg" }}>
            {L.how}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch20.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
