import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { BOSS, BOSS_DS, BOSS_RUN, KNOBS, SNAPS, TOOLS2, ch27 } from "../../../data/ch27";
import { Caption, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "../../../scenes/kit";
import { ArrowLine, Banner, ClassMark, FullSvg } from "../../../scenes/part2-kit";

const tl = buildTimeline(ch27);
const S = byId(tl);
const L = ch27.labels;

// the 맛집 지도 plane
const X = (m: number) => 130 + (m - 0.5) * 170;
const Y = (l: number) => 800 - l * 105;
const segD = (segs: [number, number, number, number][]) => segs.map(([a, b, c, d]) => `M ${X(a).toFixed(1)} ${Y(b).toFixed(1)} L ${X(c).toFixed(1)} ${Y(d).toFixed(1)}`).join(" ");
const SNAP_D = SNAPS.map((s) => segD(s.segs));
// loss chart under the plane (s4)
const LX = (e: number) => 170 + (e / BOSS.epochs) * 800;
const LY = (l: number) => 1050 - (Math.min(l, 0.4) / 0.4) * 150;
const LOSS_PTS = BOSS_RUN.loss.map((l, e) => [LX(e), LY(l)] as [number, number]);

// s2 network
const NIN: [number, number][] = [
  [200, 470],
  [200, 690],
];
const NH = Array.from({ length: 8 }, (_, j) => [540, 280 + j * 78] as [number, number]);
const NOUT: [number, number] = [860, 580];

// s3 loop
const LOOP_C: [number, number] = [540, 620];
const LOOP_R = 300;
const LOOP = [
  { t: L.l1, s: L.l1s, a: -90, c: "var(--hl-yellow)" },
  { t: L.l2, s: L.l2s, a: 0, c: "var(--hl-pink)" },
  { t: L.l3, s: L.l3s, a: 90, c: "var(--hl-violet)" },
  { t: L.l4, s: L.l4s, a: 180, c: "var(--hl-mint)" },
];
const polar = (deg: number, r = LOOP_R): [number, number] => [LOOP_C[0] + r * Math.cos((deg * Math.PI) / 180), LOOP_C[1] + r * Math.sin((deg * Math.PI) / 180)];

const PlaneAxes: FC<{ p: number }> = ({ p }) => (
  <>
    <FullSvg>
      <line x1={X(0.5)} y1={Y(0)} x2={mix(X(0.5), X(5.62), p)} y2={Y(0)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      <line x1={X(0.5)} y1={Y(0)} x2={X(0.5)} y2={mix(Y(0), Y(4.7), p)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      {[1, 2, 3, 4, 5].map((t) => (
        <line key={t} x1={X(t)} y1={Y(0) - 8} x2={X(t)} y2={Y(0) + 8} stroke="var(--ink)" strokeWidth={3} opacity={p} />
      ))}
      {[1, 2, 3, 4].map((t) => (
        <line key={`y${t}`} x1={X(0.5) - 8} y1={Y(t)} x2={X(0.5) + 8} y2={Y(t)} stroke="var(--ink)" strokeWidth={3} opacity={p} />
      ))}
    </FullSvg>
    {[1, 2, 3, 4, 5].map((t) => (
      <div key={t} style={{ position: "absolute", left: X(t) - 30, width: 60, top: Y(0) + 12, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-2)", opacity: p }}>
        {t}
      </div>
    ))}
    {[1, 2, 3, 4].map((t) => (
      <div key={`y${t}`} style={{ position: "absolute", left: X(0.5) - 62, width: 44, top: Y(t) - 18, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-2)", opacity: p }}>
        {t}
      </div>
    ))}
    <div style={{ position: "absolute", left: X(5.62) - 200, width: 190, top: Y(0) + 44, textAlign: "right", fontSize: 30, fontWeight: 700, opacity: p }}>{L.spicy} →</div>
    <div style={{ position: "absolute", left: X(0.5) - 20, top: Y(4.7) - 50, fontSize: 30, fontWeight: 700, opacity: p }}>↑ {L.line}</div>
  </>
);

export const Ch27Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const mapO = (frame < S.s2.from + 15 ? beat(frame, S.s1, 0.1, 0.5) * (1 - beat(frame, S.s2, 0, 0.5)) : 0) || (frame >= S.s4.from && frame < S.s6.from + 15 ? beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5)) : 0);
  const netO = beat(frame, S.s2, 0.3, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const loopO = beat(frame, S.s3, 0.3, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const gptO = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const endO = beat(frame, S.s7, 0.3, 0.5);

  const inTrain = frame >= S.s4.from;
  const inVal = frame >= S.s5.from;
  // s4: training time runs 0 → 300 epochs (slow at first, when most happens); everything shows the latest snapshot
  const ep = inVal ? BOSS.epochs : mix(0, BOSS.epochs, beat(frame, S.s4, 0.4, 6.6, (t) => t * t));
  let snap = 0;
  SNAPS.forEach((s, i) => (s.epoch <= ep + 1e-9 ? (snap = i) : null));
  const shownEpoch = SNAPS[snap].epoch;
  const lossLine = LOSS_PTS.slice(0, Math.max(1, Math.min(BOSS.epochs, shownEpoch)) + 1)
    .map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1, s4–s5: the 맛집 지도 */}
      {mapO > 0 && (
        <div style={{ opacity: mapO }}>
          {!inTrain ? (
            <>
              <Banner text={L.boss} y={108} fs={44} x={64} color="var(--hl-pink)" />
              <div style={{ position: "absolute", left: 64, top: 186, fontSize: 40, fontWeight: 700 }}>{L.map}</div>
              <Hand x={560} y={192} fs={40} style={{ opacity: beat(frame, S.s1, 3.4, 0.4) }}>
                {L.self}
              </Hand>
            </>
          ) : (
            <div style={{ position: "absolute", left: 64, top: 118, display: "flex", gap: 30, alignItems: "baseline", fontSize: 42, fontWeight: 700 }}>
              <span>{inVal ? L.valTitle : L.trainTitle}</span>
              {!inVal && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 38 }}>
                  {L.epoch} {shownEpoch} · {L.acc} {Math.round(SNAPS[snap].acc * 100)}%
                </span>
              )}
            </div>
          )}
          <PlaneAxes p={inTrain ? 1 : beat(frame, S.s1, 0.2, 0.6)} />
          <FullSvg>
            {inTrain && <path d={SNAP_D[snap]} fill="none" stroke="var(--pen)" strokeWidth={7} strokeLinecap="round" />}
            {BOSS_DS.train.map((d, i) => (
              <ClassMark key={i} x={X(d.x)} y={Y(d.y)} good={d.t === 1} r={15} o={inVal ? 0.35 : inTrain ? 1 : beat(frame, S.s1, 0.8 + i * 0.03, 0.3)} />
            ))}
            {inVal &&
              BOSS_DS.val.map((d, i) => {
                const o = beat(frame, S.s5, 0.6 + i * 0.05, 0.3);
                const x = X(d.x);
                const y = Y(d.y);
                return (
                  <path
                    key={`v${i}`}
                    d={`M ${x} ${y - 16} L ${x + 16} ${y} L ${x} ${y + 16} L ${x - 16} ${y} Z`}
                    fill={d.t === 1 ? "var(--hl-mint)" : "var(--hl-pink)"}
                    stroke="var(--ink)"
                    strokeWidth={4}
                    opacity={o}
                  />
                );
              })}
          </FullSvg>
          {/* legend */}
          <div style={{ position: "absolute", left: 700, top: inTrain ? 186 : 120, display: "flex", gap: 24, alignItems: "center", fontSize: 32, fontWeight: 500 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width={36} height={36}>
                <ClassMark x={18} y={18} good r={14} />
              </svg>
              {BOSS_DS.good}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width={36} height={36}>
                <ClassMark x={18} y={18} good={false} r={14} />
              </svg>
              {BOSS_DS.bad}
            </span>
          </div>
          {!inTrain && (
            <Hand x={64} y={1010} fs={34} color="var(--ink-3)">
              {L.example}
            </Hand>
          )}

          {/* s4: the loss curve */}
          {inTrain && !inVal && (
            <>
              <FullSvg>
                <line x1={LX(0)} y1={LY(0)} x2={LX(BOSS.epochs) + 20} y2={LY(0)} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
                <line x1={LX(0)} y1={LY(0)} x2={LX(0)} y2={LY(0.4) - 10} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
                <path d={lossLine} fill="none" stroke="var(--hl-orange)" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={LOSS_PTS[Math.min(BOSS.epochs, shownEpoch)][0]} cy={LOSS_PTS[Math.min(BOSS.epochs, shownEpoch)][1]} r={11} fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={3} />
              </FullSvg>
              <div style={{ position: "absolute", left: 64, top: LY(0.4) - 26, fontSize: 30, fontWeight: 700 }}>{L.lossT}</div>
              <div style={{ position: "absolute", left: LX(BOSS.epochs) - 160, width: 180, top: LY(0) + 6, textAlign: "right", fontSize: 28, color: "var(--ink-2)" }}>
                {L.epoch} {BOSS.epochs}
              </div>
            </>
          )}
          {inVal && (
            <>
              <Banner text={L.valOk} y={860} fs={46} color="var(--hl-mint)" o={beat(frame, S.s5, 2.6, 0.4)} />
              <Hand x={0} y={960} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 4.4, 0.4) }}>
                {L.learned}
              </Hand>
            </>
          )}
        </div>
      )}

      {/* s2: the little network */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: netO }}>
          <div style={{ position: "absolute", left: 64, top: 118, fontSize: 48, fontWeight: 700 }}>{L.netTitle}</div>
          <FullSvg>
            {NIN.map((a, i) => NH.map((b, j) => <line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ink-3)" strokeWidth={3} opacity={beat(frame, S.s2, 0.6, 0.4)} />))}
            {NH.map((b, j) => (
              <line key={`o${j}`} x1={b[0]} y1={b[1]} x2={NOUT[0]} y2={NOUT[1]} stroke="var(--ink-3)" strokeWidth={3} opacity={beat(frame, S.s2, 1.0, 0.4)} />
            ))}
            {NIN.map((a, i) => (
              <circle key={`i${i}`} cx={a[0]} cy={a[1]} r={44} fill="var(--paper)" stroke="var(--ink)" strokeWidth={5} />
            ))}
            {NH.map((b, j) => (
              <circle key={`h${j}`} cx={b[0]} cy={b[1]} r={30} fill="var(--hl-violet)" stroke="var(--ink)" strokeWidth={4} opacity={beat(frame, S.s2, 0.6 + j * 0.06, 0.3)} />
            ))}
            <circle cx={NOUT[0]} cy={NOUT[1]} r={54} fill="var(--hl-mint)" stroke="var(--ink)" strokeWidth={5} opacity={beat(frame, S.s2, 1.2, 0.4)} />
          </FullSvg>
          {/* en: "spicy" is wider than the Korean word, so the input labels are a little smaller to stay inside the circles */}
          {[L.in1, L.in2].map((t, i) => (
            <div key={t} style={{ position: "absolute", left: NIN[i][0] - 60, width: 120, top: NIN[i][1] - 18, textAlign: "center", fontSize: 28, fontWeight: 700 }}>
              {t}
            </div>
          ))}
          <div style={{ position: "absolute", left: NH[0][0] - 100, width: 200, top: NH[7][1] + 40, textAlign: "center", fontSize: 30, fontWeight: 700, color: "var(--ink-2)", whiteSpace: "nowrap" }}>ReLU × 8</div>
          <div style={{ position: "absolute", left: NOUT[0] - 110, width: 220, top: NOUT[1] + 66, textAlign: "center", fontSize: 32, fontWeight: 700, opacity: beat(frame, S.s2, 1.4, 0.4) }}>{L.out}</div>
          <Hand x={NOUT[0] - 130} y={NOUT[1] + 112} fs={38} style={{ width: 260, textAlign: "center", opacity: beat(frame, S.s2, 5.6, 0.4) }}>
            {L.rule}
          </Hand>
          <div style={{ position: "absolute", left: 64, top: 960, display: "flex", alignItems: "baseline", gap: 20, opacity: beat(frame, S.s2, 3.0, 0.4) }}>
            <span style={{ fontSize: 44, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 12, padding: "2px 18px" }}>{L.knobs}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, color: "var(--ink-2)" }}>2×8 + 8 + 8 + 1 = {KNOBS}</span>
          </div>
          <Hand x={64} y={1030} fs={38} style={{ opacity: beat(frame, S.s2, 4.2, 0.4) }}>
            {L.random}
          </Hand>
        </div>
      )}

      {/* s3: the training loop */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: loopO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.loopTitle}</div>
          <FullSvg>
            <circle cx={LOOP_C[0]} cy={LOOP_C[1]} r={LOOP_R} fill="none" stroke="var(--ink-3)" strokeWidth={5} strokeDasharray="16 14" />
            {LOOP.map((n, i) => {
              const [x, y] = polar(n.a + 45);
              const ang = n.a + 45 + 90;
              const hx = (d: number) => x + 22 * Math.cos(((ang + d) * Math.PI) / 180);
              const hy = (d: number) => y + 22 * Math.sin(((ang + d) * Math.PI) / 180);
              return <path key={i} d={`M ${hx(150)} ${hy(150)} L ${x} ${y} L ${hx(-150)} ${hy(-150)}`} fill="none" stroke="var(--ink-3)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />;
            })}
            {(() => {
              const a = -90 + ((frame - S.s3.from) / 30) * 120 * beat(frame, S.s3, 1.6, 0.3);
              const [x, y] = polar(a);
              return <circle cx={x} cy={y} r={18} fill="var(--pen)" opacity={beat(frame, S.s3, 1.6, 0.3)} />;
            })()}
          </FullSvg>
          {LOOP.map((n, i) => {
            const [x, y] = polar(n.a);
            return (
              <div key={n.t} style={{ position: "absolute", left: x - 140, top: y - 56, width: 280, height: 112, borderRadius: 20, border: "4px solid var(--ink)", background: n.c, color: "var(--chip-ink)", display: "grid", placeItems: "center", textAlign: "center", lineHeight: 1.1, opacity: beat(frame, S.s3, 0.5 + i * 0.6, 0.4) }}>
                <span style={{ fontSize: 40, fontWeight: 700 }}>{n.t}</span>
                <span style={{ fontSize: 28 }}>{n.s}</span>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: LOOP_C[0] - 180, width: 360, top: LOOP_C[1] - 46, textAlign: "center", fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s3, 3.4, 0.4) }}>
            {L.center}
            <div style={{ fontSize: 30, fontWeight: 500, color: "var(--ink-2)" }}>{L.centerS}</div>
          </div>
        </div>
      )}

      {/* s6: GPT learns the same way */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: gptO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.gptTitle}</div>
          <div style={{ position: "absolute", left: 80, top: 360, width: 930, display: "grid", gridTemplateColumns: "1fr 0.9fr 1.3fr", rowGap: 30, columnGap: 20, alignItems: "center", fontSize: 38, whiteSpace: "nowrap" }}>
            <span />
            <span style={{ fontSize: 34, fontWeight: 700, color: "var(--ink-2)" }}>{L.colKnobs}</span>
            <span style={{ fontSize: 34, fontWeight: 700, color: "var(--ink-2)" }}>{L.colData}</span>
            <span style={{ fontWeight: 700, opacity: beat(frame, S.s6, 0.6, 0.4) }}>{L.rowBoss}</span>
            <span style={{ fontFamily: "var(--font-mono)", opacity: beat(frame, S.s6, 0.6, 0.4) }}>{L.bossKnobs}</span>
            <span style={{ opacity: beat(frame, S.s6, 0.6, 0.4) }}>{L.bossData}</span>
            <span style={{ fontWeight: 700, opacity: beat(frame, S.s6, 2.4, 0.4) }}>{L.rowGpt}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, opacity: beat(frame, S.s6, 2.4, 0.4) }}>
              <span style={{ background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 10, padding: "0 10px" }}>{L.gptKnobs}</span>
            </span>
            <span style={{ fontWeight: 700, opacity: beat(frame, S.s6, 3.4, 0.4) }}>
              <span style={{ background: "var(--hl-sky)", color: "var(--chip-ink)", borderRadius: 10, padding: "0 10px" }}>{L.gptData}</span>
            </span>
          </div>
          <FullSvg>
            <ArrowLine x1={540} y1={640} x2={540} y2={760} p={beat(frame, S.s6, 4.2, 0.5)} w={6} />
          </FullSvg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", fontSize: 44, fontWeight: 700, opacity: beat(frame, S.s6, 4.6, 0.4) }}>
            {L.l1} → {L.l2} → {L.l3} → {L.l4}
          </div>
        </div>
      )}

      {/* s7: Part 2 complete */}
      {frame >= S.s7.from && (
        <div style={{ opacity: endO }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontSize: 58, fontWeight: 700 }}>{L.done}</div>
          <div style={{ position: "absolute", left: 80, right: 80, top: 370, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
            {TOOLS2.map((t, i) => (
              <span
                key={t}
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  padding: "8px 22px",
                  borderRadius: 14,
                  background: ["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)", "var(--hl-pink)", "var(--hl-violet)"][i % 5],
                  color: "var(--chip-ink)",
                  opacity: beat(frame, S.s7, 0.6 + i * 0.18, 0.3),
                  scale: String(mix(0.7, 1, beat(frame, S.s7, 0.6 + i * 0.18, 0.3))),
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {/* en: the English tool chips wrap to one more row, so the closing note sits a little lower */}
          <Hand x={0} y={900} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.4, 0.5), rotate: "-2deg" }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch27.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};

