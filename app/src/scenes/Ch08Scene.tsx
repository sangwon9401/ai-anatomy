import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { FRIENDS } from "../data/ch07";
import { CLASS, WORDS, ch08 } from "../data/ch08";
import { Caption, Chip, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Axes, Pt, Vec, at, type Plane } from "./plane";

const tl = buildTimeline(ch08);
const S = byId(tl);
const L = ch08.labels;

const PL: Plane = { ox: 170, oy: 1010, unit: 80 };
const WPL: Plane = { ox: 140, oy: 1000, unit: 85 };
const [MINJI, JUNHO, SEOYEON] = FRIENDS;

// s5: an abstract "song space"
const SONGS: [number, number][] = [
  [200, 420], [330, 760], [420, 300], [610, 860], [760, 360], [880, 700], [930, 470], [260, 960], [520, 470], [640, 690], [820, 960], [380, 560],
];
const LIKED: [number, number] = [560, 600];
const nearest = SONGS.map((s, i) => ({ i, d: Math.hypot(s[0] - LIKED[0], s[1] - LIKED[1]) }))
  .sort((a, b) => a.d - b.d)
  .slice(0, 2)
  .map((x) => x.i);

const Seg: FC<{ a: [number, number]; b: [number, number]; p: number; color: string; dash?: string; w?: number }> = ({ a, b, p, color, dash, w = 5 }) => (
  <line x1={a[0]} y1={a[1]} x2={mix(a[0], b[0], p)} y2={mix(a[1], b[1], p)} stroke={color} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" opacity={p > 0 ? 1 : 0} />
);

export const Ch08Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const planeOn = 1 - beat(frame, S.s5, 0, 0.5);
  const arrowsOff = beat(frame, S.s1, 2.6, 0.6);
  const linesOn = 1 - beat(frame, S.s4, 0, 0.5);
  const songsOn = beat(frame, S.s5, 0.4, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const wordsOn = beat(frame, S.s6, 0.4, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const p = (v: [number, number]) => at(PL, v);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s5.from + 20 && (
        <div style={{ opacity: planeOn }}>
          <Axes pl={PL} x={[0, 10.6]} y={[0, 10.4]} p={beat(frame, S.s1, 0, 0.6)} ticks={[0, 5, 10]} labelX={L.spicy} labelY={L.sweet} />
          {FRIENDS.map((f) => (
            <div key={f.name} style={{ opacity: 1 - arrowsOff }}>
              <Vec pl={PL} v={f.v} p={beat(frame, S.s1, 0.4, 0.8)} color={`var(--hl-${f.c})`} width={10} />
            </div>
          ))}
          {FRIENDS.map((f) => {
            const [x, y] = p(f.v);
            const o = beat(frame, S.s1, 2.4, 0.4);
            return (
              <div key={`p${f.name}`}>
                <Pt pl={PL} v={f.v} r={20} color={`var(--hl-${f.c})`} o={o} />
                <div style={{ position: "absolute", left: x + 26, top: y - 60, fontSize: 36, fontWeight: 700, opacity: o, whiteSpace: "nowrap" }}>
                  {f.name} <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 500 }}>({f.v.join(", ")})</span>
                </div>
              </div>
            );
          })}

          {/* s2–s3: measuring distance */}
          <div style={{ position: "absolute", right: 56, top: 120, fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s2, 2.0, 0.5) * linesOn }}>{L.pyth}</div>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: linesOn }}>
            <Seg a={p([7, 3])} b={p(MINJI.v)} p={beat(frame, S.s3, 0.4, 0.5)} color="var(--pen)" dash="8 8" />
            <Seg a={p([7, 3])} b={p(SEOYEON.v)} p={beat(frame, S.s3, 0.8, 0.5)} color="var(--pen)" dash="8 8" />
            <Seg a={p(MINJI.v)} b={p(SEOYEON.v)} p={beat(frame, S.s3, 1.3, 0.5)} color="var(--ink)" w={6} />
            <Seg a={p([2, 3])} b={p(MINJI.v)} p={beat(frame, S.s3, 3.6, 0.6)} color="var(--ink-3)" dash="8 8" />
            <Seg a={p([2, 3])} b={p(JUNHO.v)} p={beat(frame, S.s3, 3.9, 0.6)} color="var(--ink-3)" dash="8 8" />
            <Seg a={p(MINJI.v)} b={p(JUNHO.v)} p={beat(frame, S.s3, 4.5, 0.7)} color="var(--ink)" w={6} />
          </svg>
          <div style={{ position: "absolute", right: 56, top: 820, fontFamily: "var(--font-mono)", fontSize: 34, opacity: beat(frame, S.s3, 1.8, 0.4) * linesOn }}>
            {L.minji}–{L.seoyeon}: {L.d1}
          </div>
          <div style={{ position: "absolute", right: 56, top: 872, fontFamily: "var(--font-mono)", fontSize: 34, opacity: beat(frame, S.s3, 5.2, 0.4) * linesOn }}>
            {L.minji}–{L.junho}: {L.d2}
          </div>
          <Hand x={600} y={926} fs={46} style={{ opacity: beat(frame, S.s3, 6.4, 0.4) * linesOn, rotate: "-2deg" }}>
            {L.closer}
          </Hand>

          {/* s4: clusters */}
          {CLASS.map((c, i) => {
            const o = beat(frame, S.s4, 0.4 + i * 0.12, 0.3);
            const [x, y] = p(c.v);
            return (
              <div key={c.name}>
                <Pt pl={PL} v={c.v} r={13} color="var(--paper-2)" o={o} />
                <div style={{ position: "absolute", left: x + 16, top: y - 14, fontSize: 24, color: "var(--ink-2)", opacity: o }}>{c.name}</div>
              </div>
            );
          })}
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {[
              { cx: p([7.8, 2.9])[0], cy: p([7.8, 2.9])[1], rx: 170, ry: 140, t: 2.0 },
              { cx: p([2.5, 8.7])[0], cy: p([2.5, 8.7])[1], rx: 150, ry: 150, t: 2.6 },
            ].map((e, i) => (
              <ellipse
                key={i}
                cx={e.cx}
                cy={e.cy}
                rx={e.rx}
                ry={e.ry}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - beat(frame, S.s4, e.t, 0.7)}
                fill="none"
                stroke="var(--pen)"
                strokeWidth={5}
                opacity={beat(frame, S.s4, e.t, 0.05)}
              />
            ))}
          </svg>
          <Hand x={p([7.8, 2.9])[0] - 80} y={p([7.8, 2.9])[1] - 220} fs={48} style={{ opacity: beat(frame, S.s4, 2.6, 0.4) }}>
            {L.spicyTeam}
          </Hand>
          <Hand x={p([2.5, 8.7])[0] + 160} y={p([2.5, 8.7])[1] - 40} fs={48} style={{ opacity: beat(frame, S.s4, 3.2, 0.4) }}>
            {L.sweetTeam}
          </Hand>
        </div>
      )}

      {/* s5: recommendations are nearest neighbours */}
      {frame >= S.s5.from && frame < S.s6.from + 20 && (
        <div style={{ opacity: songsOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.recommend}</div>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {nearest.map((i, k) => (
              <Seg key={i} a={LIKED} b={SONGS[i]} p={beat(frame, S.s5, 2.0 + k * 0.4, 0.5)} color="var(--pen)" dash="8 10" />
            ))}
          </svg>
          {SONGS.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s[0] - 18,
                top: s[1] - 18,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: nearest.includes(i) && beat(frame, S.s5, 2.4, 0.1) > 0 ? "var(--hl-mint)" : "var(--paper-2)",
                border: "4px solid var(--ink)",
                opacity: beat(frame, S.s5, 0.6 + i * 0.05, 0.3),
              }}
            />
          ))}
          <div style={{ position: "absolute", left: LIKED[0] - 30, top: LIKED[1] - 30, width: 60, height: 60, borderRadius: "50%", background: "var(--hl-yellow)", border: "5px solid var(--ink)", opacity: beat(frame, S.s5, 1.2, 0.4) }} />
          <div style={{ position: "absolute", left: LIKED[0] + 46, top: LIKED[1] - 20, fontSize: 32, fontWeight: 700, opacity: beat(frame, S.s5, 1.4, 0.4) }}>← {L.song}</div>
          {nearest.map((i, k) => (
            <Hand key={i} x={SONGS[i][0] + 26} y={SONGS[i][1] - 56} fs={44} style={{ opacity: beat(frame, S.s5, 2.6 + k * 0.4, 0.4) }}>
              {L.suggest}
            </Hand>
          ))}
        </div>
      )}

      {/* s6: a (toy) word map */}
      {frame >= S.s6.from && frame < S.s7.from + 20 && (
        <div style={{ opacity: wordsOn }}>
          <div style={{ position: "absolute", right: 56, top: 120, fontSize: 28, color: "var(--ink-3)" }}>{L.wordMap}</div>
          {WORDS.map((w, i) => {
            const [x, y] = at(WPL, w.v);
            const o = beat(frame, S.s6, 0.8 + i * 0.25, 0.4);
            const c = i < 3 ? "pink" : i < 6 ? "yellow" : "sky";
            return <Chip key={w.w} text={w.w} color={c} fs={44} x={x - chipWidth(w.w, 44) / 2} y={y - 33} style={{ opacity: o, scale: String(mix(0.6, 1, o)) }} />;
          })}
          <Hand x={480} y={140} fs={52} style={{ opacity: beat(frame, S.s6, 3.6, 0.4) }}>
            {L.fruit}
          </Hand>
          <Hand x={930} y={210} fs={52} style={{ opacity: beat(frame, S.s6, 4.0, 0.4) }}>
            {L.animal}
          </Hand>
          <Hand x={360} y={850} fs={52} style={{ opacity: beat(frame, S.s6, 4.4, 0.4) }}>
            {L.ride}
          </Hand>
        </div>
      )}

      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontSize: 80, fontWeight: 700 }}>{L.sum}</div>
          <Hand x={0} y={640} fs={54} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 1.6, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch08.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
