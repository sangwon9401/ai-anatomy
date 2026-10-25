import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CANDS, LAPS, STATIONS, ch66 } from "../data/ch66";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Arrow, Box, Center, HBar, Knob, Layer, Meter, T } from "./part7-kit";

const tl = buildTimeline(ch66);
const S = byId(tl);
const L = ch66.labels;

// s1: the big loop
const CX = 540;
const CY = 610;
const R = 290;
const ANG = [-90, 0, 90, 180];
const polar = (deg: number, r = R): [number, number] => [CX + Math.cos((deg * Math.PI) / 180) * r, CY + Math.sin((deg * Math.PI) / 180) * r];
const arcPath = (a: number, b: number) => {
  const [x0, y0] = polar(a);
  const [x1, y1] = polar(b);
  return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`;
};

// s2+: the loop as a row on top
const TW = 210;
const TH = 104;
const TY = 120;
const TX = (i: number) => 60 + i * (TW + 40);

// detail rows
const ROW_Y = [460, 565, 670, 775];
const fmt = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));
const fmtB = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : `+${v.toFixed(2)}`);
const pct = (p: number) => `${Math.round(p * 100)}%`;
const [L0, L1] = LAPS;

// s4–s5 table columns
const TROW = [440, 530, 620, 710];
const COL = { w: 70, z: 225, b: 375, dir: 535, nz: 790 };

// s6 lap chart
const LAP_NAMES = [L.lap0, L.lap1, L.lap2, L.lap3];
const LBX = (k: number) => 110 + k * 100;
const LBASE = 920;
const LSY = (s: number) => LBASE - s * 130;
const LDX = (k: number) => 640 + k * 110;

// a tiny network for "flows backwards"
const NET = [
  [780, 870, 960],
  [480, 580, 680],
];

export const Ch66Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const bigOn = beat(frame, S.s1, 0, 0.4) * (1 - beat(frame, S.s2, 0, 0.4));
  const rowOn = beat(frame, S.s2, 0.2, 0.5);
  const barsOn = beat(frame, S.s2, 0.8, 0.4) * (1 - beat(frame, S.s4, 0, 0.4));
  const meterOn = beat(frame, S.s3, 0.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.4));
  const dimOthers = mix(1, 0.25, beat(frame, S.s3, 0.2, 0.4));
  const tableOn = beat(frame, S.s4, 0.3, 0.4) * (1 - beat(frame, S.s6, 0, 0.4));
  const netOn = beat(frame, S.s4, 2.0, 0.4) * (1 - beat(frame, S.s5, 0, 0.4));
  const lapsOn = beat(frame, S.s6, 0.3, 0.4) * (1 - beat(frame, S.s7, 0, 0.4));
  const endOn = beat(frame, S.s7, 0.3, 0.5);

  // which station is lit on the top row
  let active = -1;
  if (frame >= S.s2.from && frame < S.s6.from) active = [S.s2, S.s3, S.s4, S.s5].findIndex((s) => frame >= s.from && frame < s.to);
  const lapT = [1.0, 3.0, 5.0];
  if (frame >= S.s6.from && frame < S.s7.from) {
    const t = (frame - S.s6.from) / 30;
    const k = lapT.findIndex((t0) => t >= t0 && t < t0 + 1.6);
    active = k >= 0 ? Math.min(3, Math.floor(((t - lapT[k]) / 1.6) * 4)) : -1;
  }
  const lapShown = (k: number) => (k === 0 ? beat(frame, S.s6, 0.5, 0.4) : beat(frame, S.s6, lapT[k - 1] + 1.6, 0.4));

  // dot running round the big loop in s1
  const run = beat(frame, S.s1, 3.0, 3.4, EASE_IO);
  const [dx, dy] = polar(-90 + run * 360);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the big loop */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: bigOn }}>
          <Layer>
            {ANG.map((a, i) => (
              <g key={i} opacity={beat(frame, S.s1, 0.6 + i * 0.4, 0.4)}>
                <path d={arcPath(a + 26, ANG[(i + 1) % 4] + (i === 3 ? 360 : 0) - 30)} fill="none" stroke="var(--ink-3)" strokeWidth={6} strokeLinecap="round" />
                {(() => {
                  const end = ANG[(i + 1) % 4] + (i === 3 ? 360 : 0) - 30;
                  const [ex, ey] = polar(end);
                  const [px, py] = polar(end - 4);
                  return <Arrow x1={px} y1={py} x2={ex} y2={ey} color="var(--ink-3)" width={6} head={22} />;
                })()}
              </g>
            ))}
            {run > 0 && run < 1 && <circle cx={dx} cy={dy} r={20} fill="var(--pen)" />}
          </Layer>
          {STATIONS.map((s, i) => {
            const [x, y] = polar(ANG[i]);
            return (
              <Box key={s.n} x={x - 130} y={y - 60} w={260} h={120} fill={`var(--hl-${s.c})`} o={beat(frame, S.s1, 0.4 + i * 0.4, 0.4)}>
                <div style={{ color: "var(--chip-ink)" }}>
                  <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.2 }}>{s.n}</div>
                  <div style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.2 }}>{s.ref}</div>
                </div>
              </Box>
            );
          })}
          <Center y={CY - 70} fs={52} o={beat(frame, S.s1, 2.4, 0.4)}>
            {L.lap}
          </Center>
          <Hand x={0} y={CY + 6} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 6.6, 0.4) }}>
            {L.repeat}
          </Hand>
        </div>
      )}

      {/* s2–s7: the loop as a row */}
      {frame >= S.s2.from && (
        <div style={{ opacity: rowOn }}>
          {STATIONS.map((s, i) => {
            const on = active === i || frame >= S.s7.from + 20;
            return (
              <Box key={s.n} x={TX(i)} y={TY} w={TW} h={TH} r={16} bw={on ? 5 : 3} border={on ? "var(--ink)" : "var(--line)"} fill={on ? `var(--hl-${s.c})` : "var(--paper-2)"}>
                <div style={{ color: on ? "var(--chip-ink)" : "var(--ink-2)" }}>
                  <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2 }}>{s.n}</div>
                  <div style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.2 }}>{s.ref}</div>
                </div>
              </Box>
            );
          })}
          <Layer>
            {[0, 1, 2].map((i) => (
              <Arrow key={i} x1={TX(i) + TW + 6} y1={TY + TH / 2} x2={TX(i + 1) - 6} y2={TY + TH / 2} width={4} head={14} color="var(--ink-3)" />
            ))}
            <path d={`M ${TX(3) + TW / 2} ${TY + TH + 4} L ${TX(3) + TW / 2} ${TY + TH + 34} L ${TX(0) + TW / 2} ${TY + TH + 34} L ${TX(0) + TW / 2} ${TY + TH + 18}`} fill="none" stroke="var(--ink-3)" strokeWidth={4} strokeLinejoin="round" />
            <Arrow x1={TX(0) + TW / 2} y1={TY + TH + 22} x2={TX(0) + TW / 2} y2={TY + TH + 4} width={4} head={14} color="var(--ink-3)" />
          </Layer>
          <Hand x={0} y={TY + TH + 40} fs={34} color="var(--ink-2)" style={{ width: 1080, textAlign: "center" }}>
            {L.again}
          </Hand>
        </div>
      )}

      {/* s2–s3: prediction bars */}
      {frame >= S.s2.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: barsOn }}>
          <div style={{ position: "absolute", left: 80, top: 352, display: "flex", alignItems: "center", gap: 12, opacity: beat(frame, S.s2, 0.8, 0.4) }}>
            {[L.ctx1, L.ctx2, L.ctx3].map((w) => (
              <span key={w} style={{ fontSize: 40, fontWeight: 500, padding: "2px 16px", borderRadius: 10, background: "var(--paper-2)", border: "2px solid var(--line)" }}>
                {w}
              </span>
            ))}
            <span style={{ fontSize: 40, color: "var(--ink-3)" }}>→</span>
            <span style={{ fontSize: 40, fontWeight: 700, padding: "2px 22px", borderRadius: 12, border: "4px solid var(--ink)", background: "var(--hl-violet)", color: "var(--chip-ink)" }}>{L.gpt}</span>
          </div>
          <Chip text={L.example} color={null} fs={30} x={1024 - chipWidth(L.example, 30)} y={366} style={{ opacity: beat(frame, S.s2, 1.4, 0.4) }} />
          {CANDS.map((c, i) => (
            <HBar
              key={c.w}
              x={80}
              y={ROW_Y[i]}
              word={c.w}
              p={L0.p[i] * beat(frame, S.s2, 1.6 + i * 0.15, 0.7)}
              scale={520}
              color={`var(--hl-${c.c})`}
              wordW={150}
              fs={48}
              bold={i === 0}
              value={pct(L0.p[i])}
              o={i === 0 ? 1 : dimOthers}
            />
          ))}
          <div style={{ opacity: 1 - beat(frame, S.s3, 0, 0.4) }}>
            <Hand x={660} y={ROW_Y[2] - 4} fs={46} style={{ opacity: beat(frame, S.s2, 3.6, 0.4) }}>
              {L.lateFirst}
            </Hand>
            <Hand x={0} y={890} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 6.4, 0.4) }}>
              {L.mess}
            </Hand>
          </div>
          {/* s3: the loss */}
          <div style={{ opacity: meterOn }}>
            <PenCircle x={56} y={ROW_Y[0] - 24} w={520} h={110} p={beat(frame, S.s3, 0.8, 0.6)} />
            <Meter cx={860} cy={680} r={130} v={L0.loss * beat(frame, S.s3, 1.8, 1.0, EASE_IO)} max={4} />
            <T x={710} y={720} w={300} fs={62} mono bold align="center" o={beat(frame, S.s3, 2.8, 0.4)}>
              {L0.loss.toFixed(2)}
            </T>
            <T x={710} y={810} w={300} fs={40} bold align="center" o={beat(frame, S.s3, 3.4, 0.4)}>
              {L.lossIs}
            </T>
            <Hand x={0} y={910} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 5.6, 0.4) }}>
              {L.lossNote}
            </Hand>
          </div>
        </div>
      )}

      {/* s4–s5: blame and update table */}
      {frame >= S.s4.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: tableOn }}>
          {[
            { x: COL.w, w: 150, t: L.colW, o: 1 },
            { x: COL.z, w: 140, t: L.colZ, o: 1 },
            { x: COL.b, w: 150, t: L.colB, o: beat(frame, S.s4, 1.0, 0.4) },
            { x: COL.nz, w: 170, t: L.colNew, o: beat(frame, S.s5, 1.6, 0.4) },
          ].map((h) => (
            <T key={h.t} x={h.x} y={360} w={h.w} fs={32} bold align={h.x === COL.w ? "left" : "center"} color="var(--ink-2)" o={h.o}>
              {h.t}
            </T>
          ))}
          {CANDS.map((c, i) => {
            const b = L0.blame[i];
            const bo = beat(frame, S.s4, 1.2 + i * 0.4, 0.4);
            const nz = beat(frame, S.s5, 2.0 + i * 0.4, 0.5);
            return (
              <div key={c.w}>
                <Chip text={c.w} color={c.c} fs={40} x={COL.w} y={TROW[i]} />
                <T x={COL.z} y={TROW[i] + 4} w={140} fs={44} mono align="center">
                  {fmt(L0.z[i])}
                </T>
                <T x={COL.b} y={TROW[i] + 4} w={150} fs={44} mono bold align="center" color="var(--pen)" o={bo}>
                  {fmtB(b)}
                </T>
                <T x={COL.dir} y={TROW[i] + 8} w={180} fs={38} bold color={b < 0 ? "var(--ink)" : "var(--ink-2)"} o={bo * (1 - nz)}>
                  {b < 0 ? L.up : L.down}
                </T>
                <Knob x={COL.dir + 90} y={TROW[i] + 32} r={30} angle={mix(0, b < 0 ? 50 : -40 * (b / 0.52), nz)} o={nz} />
                <T x={COL.nz} y={TROW[i] + 4} w={170} fs={44} mono bold align="center" o={nz}>
                  {fmt(L1.z[i])}
                </T>
              </div>
            );
          })}
          {/* s4: flows backwards through the layers */}
          <div style={{ opacity: netOn }}>
            <Layer>
              {NET[0].slice(0, 2).map((x, a) =>
                NET[1].map((ya) =>
                  NET[1].map((yb) => <line key={`${a}-${ya}-${yb}`} x1={x} y1={ya} x2={NET[0][a + 1]} y2={yb} stroke="var(--line)" strokeWidth={3} />),
                ),
              )}
              {NET[0].map((x) => NET[1].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={16} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />))}
              <Arrow x1={995} y1={740} x2={750} y2={740} p={beat(frame, S.s4, 2.4, 0.9)} color="var(--pen)" width={6} />
            </Layer>
            <Hand x={740} y={400} fs={42}>
              {L.backward}
            </Hand>
          </div>
          <Center y={835} fs={34} bold={false} color="var(--ink-2)" o={beat(frame, S.s4, 4.4, 0.4) * (1 - beat(frame, S.s5, 0, 0.3))}>
            {L.blameRule}
          </Center>
          <Hand x={0} y={910} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s4, 6.4, 0.4) * (1 - beat(frame, S.s5, 0, 0.3)) }}>
            {L.real}
          </Hand>
          {/* s5: the update rule */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 835, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: beat(frame, S.s5, 0.6, 0.4) }}>
            <span style={{ fontSize: 40, fontWeight: 700 }}>{L.update}</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center", gap: 20, alignItems: "center", opacity: beat(frame, S.s5, 4.6, 0.4) }}>
            <span style={{ fontSize: 38, fontWeight: 700, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 12, padding: "2px 18px" }}>{L.lr}</span>
            <span style={{ fontSize: 32, color: "var(--ink-2)" }}>{L.mini}</span>
          </div>
        </div>
      )}

      {/* s6: lap after lap */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: lapsOn }}>
          <T x={80} y={350} fs={38} bold>
            {L.probGo}
          </T>
          <T x={600} y={350} fs={38} bold>
            {L.lossTitle}
          </T>
          <div style={{ position: "absolute", left: 80, top: LBASE - 2, width: 420, height: 4, background: "var(--ink)" }} />
          <div style={{ position: "absolute", left: 600, top: LBASE - 2, width: 420, height: 4, background: "var(--ink)" }} />
          <Layer>
            {LAPS.slice(0, 3).map((lp, k) => {
              const o = lapShown(k + 1);
              return <line key={k} x1={LDX(k)} y1={LSY(lp.loss)} x2={mix(LDX(k), LDX(k + 1), o)} y2={mix(LSY(lp.loss), LSY(LAPS[k + 1].loss), o)} stroke="var(--pen)" strokeWidth={5} opacity={o > 0 ? 1 : 0} />;
            })}
          </Layer>
          {LAPS.map((lp, k) => {
            const o = lapShown(k);
            const h = lp.p[0] * 560 * o;
            return (
              <div key={k} style={{ opacity: o > 0 ? 1 : 0 }}>
                <div style={{ position: "absolute", left: LBX(k) - 36, top: LBASE - h, width: 72, height: h, background: "var(--hl-yellow)", borderRadius: "10px 10px 2px 2px" }} />
                <T x={LBX(k) - 60} y={LBASE - h - 48} w={120} fs={34} mono align="center" o={o}>
                  {pct(lp.p[0])}
                </T>
                <T x={LBX(k) - 60} y={LBASE + 10} w={120} fs={28} align="center" color="var(--ink-2)" o={o}>
                  {LAP_NAMES[k]}
                </T>
                <div style={{ position: "absolute", left: LDX(k) - 14, top: LSY(lp.loss) - 14, width: 28, height: 28, borderRadius: "50%", background: "var(--hl-pink)", border: "4px solid var(--ink)", boxSizing: "border-box", opacity: o }} />
                <T x={LDX(k) + 2} y={LSY(lp.loss) - 56} w={120} fs={34} mono o={o}>
                  {lp.loss.toFixed(2)}
                </T>
                <T x={LDX(k) - 60} y={LBASE + 10} w={120} fs={28} align="center" color="var(--ink-2)" o={o}>
                  {LAP_NAMES[k]}
                </T>
              </div>
            );
          })}
        </div>
      )}

      {/* s7: pre-training */}
      {frame >= S.s7.from && (
        <div style={{ opacity: endOn }}>
          {Array.from({ length: 24 }, (_, i) => {
            const x = 180 + (i % 8) * 103;
            const y = 400 + Math.floor(i / 8) * 96;
            const wiggle = Math.sin(frame / 8 + i * 1.7) * 24 * beat(frame, S.s7, 1.6, 0.6);
            return <Knob key={i} x={x} y={y} r={34} angle={((i * 53) % 120) - 60 + wiggle} o={beat(frame, S.s7, 0.6 + i * 0.03, 0.3)} />;
          })}
          <Center y={665} fs={46} o={beat(frame, S.s7, 1.2, 0.4)}>
            {L.many}
          </Center>
          <Hand x={0} y={735} fs={46} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 0.8, 0.4) }}>
            {L.batch}
          </Hand>
          <Center y={815} fs={40} bold={false} o={beat(frame, S.s7, 3.4, 0.4)}>
            {L.loopAll}
          </Center>
          <div style={{ position: "absolute", left: 0, right: 0, top: 910, textAlign: "center", opacity: beat(frame, S.s7, 7.4, 0.5) }}>
            <span style={{ fontSize: 64, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 16, padding: "4px 28px" }}>
              {L.pretrain}
            </span>
          </div>
        </div>
      )}

      <Narration tl={tl} chapter={ch66.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};

