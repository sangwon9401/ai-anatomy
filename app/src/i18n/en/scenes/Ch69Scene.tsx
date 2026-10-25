// en overlay of src/scenes/Ch69Scene.tsx: the yardstick building's name takes three lines in English, so its label sits higher.
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { MODELS, TOWER, ch69, floors } from "../../../data/ch69";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, type SceneProps } from "../../../scenes/kit";
import { Arrow, Layer, T } from "../../../scenes/part7-kit";

const tl = buildTimeline(ch69);
const S = byId(tl);
const L = ch69.labels;

const GROUND = 1000;
const H_NEAR = 46; // px per floor before zooming out
const H_FAR = 0.44; // px per floor once GPT-3 fits
const BLD = [
  { x: 120, w: 170 },
  { x: 390, w: 200 },
  { x: 720, w: 250 },
];
const FL = MODELS.map((m) => floors(m.params));
const FLOOR_TEXT = [L.f1, L.f2, L.f3];

const Building: FC<{ x: number; w: number; height: number; h: number; color: string; o?: number }> = ({ x, w, height, h, color, o = 1 }) => {
  const top = Math.max(GROUND - height, -60);
  const lines = h >= 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top,
        width: w,
        height: GROUND - top,
        boxSizing: "border-box",
        border: height > 3 ? "4px solid var(--ink)" : "2px solid var(--ink)",
        borderBottom: "none",
        borderRadius: "8px 8px 0 0",
        backgroundColor: `var(--hl-${color})`,
        backgroundImage: lines
          ? `repeating-linear-gradient(to top, transparent 0 ${h - 4}px, var(--ink-3) ${h - 4}px ${h}px), repeating-linear-gradient(90deg, transparent 0 22px, var(--paper) 22px 40px, transparent 40px 52px)`
          : undefined,
        backgroundPosition: "0 100%, 14px 0",
        opacity: o,
      }}
    />
  );
};

// a stack of tower glyphs (s6), each one 123 floors tall at the far zoom
const TOWER_H = TOWER.floors * H_FAR;
const N_TOWERS = Math.round(FL[2] / TOWER.floors);
const TowerGlyph: FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <path d={`M ${x - 34} ${y} L ${x - 12} ${y - TOWER_H + 6} L ${x} ${y - TOWER_H} L ${x + 12} ${y - TOWER_H + 6} L ${x + 34} ${y} Z`} fill="var(--hl-violet)" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" opacity={o} />
);

const YEAR_X = [220, 540, 860];
const DOT_R = [14, 24, 40];

export const Ch69Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const lineOn = beat(frame, S.s1, 0, 0.4) * (1 - beat(frame, S.s2, 0, 0.4));
  const bldOn = beat(frame, S.s2, 0.2, 0.4);
  const zoom = beat(frame, S.s4, 3.0, 3.4, EASE_IO);
  const h = H_NEAR * Math.pow(H_FAR / H_NEAR, zoom);
  const grow = [beat(frame, S.s2, 0.6, 0.8), beat(frame, S.s3, 0.3, 1.4, EASE_IO), beat(frame, S.s4, 0.3, 0.8)];
  const smallOn = 1 - beat(frame, S.s6, 0, 0.4);
  const s7 = beat(frame, S.s7, 0.3, 0.5);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: timeline */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: lineOn }}>
          <div style={{ position: "absolute", left: 110, top: 558, width: 860 * beat(frame, S.s1, 0.2, 0.8), height: 5, background: "var(--ink)", borderRadius: 3 }} />
          {MODELS.map((m, i) => {
            const o = beat(frame, S.s1, 1.6 + i * 1.8, 0.4);
            return (
              <div key={m.key} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: YEAR_X[i] - DOT_R[i], top: 560 - DOT_R[i], width: DOT_R[i] * 2, height: DOT_R[i] * 2, borderRadius: "50%", background: `var(--hl-${m.c})`, border: "4px solid var(--ink)", boxSizing: "border-box" }} />
                <Chip text={m.name} color={m.c} fs={50} x={YEAR_X[i] - chipWidth(m.name, 50) / 2} y={400} />
                <T x={YEAR_X[i] - 100} y={620} w={200} fs={46} mono align="center">
                  {m.year}
                </T>
              </div>
            );
          })}
          <Hand x={0} y={780} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 7.4, 0.5) }}>
            {L.grow}
          </Hand>
        </div>
      )}

      {/* s2–s7: buildings */}
      {frame >= S.s2.from && (
        <div style={{ opacity: bldOn }}>
          <div style={{ position: "absolute", left: 60, top: GROUND, width: 960, height: 5, background: "var(--ink)" }} />
          <Chip text={L.floorRule} color={null} fs={36} x={540 - chipWidth(L.floorRule, 36) / 2} y={GROUND + 20} style={{ opacity: beat(frame, S.s2, 1.0, 0.4) * (1 - s7) }} />

          {MODELS.map((m, i) => {
            const st = [S.s2, S.s3, S.s4][i];
            if (frame < st.from) return null;
            const height = FL[i] * h * grow[i];
            const keep = i === 2 ? 1 : smallOn;
            const labelTop = Math.max(GROUND - Math.min(height, 2000), 230) - 112;
            const labelO = beat(frame, st, 0.8, 0.4) * (i === 2 ? (zoom > 0.98 ? 1 : 0) : 1);
            return (
              <div key={m.key} style={{ opacity: keep }}>
                <Building x={BLD[i].x} w={BLD[i].w} height={height} h={h} color={m.c} />
                <div style={{ position: "absolute", left: BLD[i].x - 40, width: BLD[i].w + 80, top: i === 2 ? 108 : labelTop, textAlign: "center", opacity: labelO }}>
                  <div style={{ fontSize: 40, fontWeight: 700 }}>
                    {m.name} <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 32, color: "var(--ink-2)" }}>{m.year}</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 500 }}>
                    {m.paramsText} {FLOOR_TEXT[i]}
                  </div>
                </div>
              </div>
            );
          })}

          <Hand x={330} y={880} fs={50} style={{ opacity: beat(frame, S.s2, 5.6, 0.4) * (1 - beat(frame, S.s3, 0, 0.4)), rotate: "-4deg" }}>
            {L.tiny}
          </Hand>

          {/* s3: 13× */}
          <Hand x={150} y={420} fs={54} style={{ opacity: beat(frame, S.s3, 3.4, 0.4) * (1 - beat(frame, S.s4, 0, 0.4)), rotate: "-4deg" }}>
            {L.x13}
          </Hand>

          {/* s4: off the screen */}
          {frame >= S.s4.from && frame < S.s5.from + 10 && (
            <div style={{ opacity: (1 - zoom) * (1 - beat(frame, S.s5, 0, 0.3)) }}>
              <Layer>
                <Arrow x1={845} y1={330} x2={845} y2={150} width={7} color="var(--pen)" />
              </Layer>
              <Hand x={735} y={350} fs={54} style={{ width: 220, textAlign: "center", background: "var(--paper)", borderRadius: 14, padding: "4px 0" }}>
                {L.howTall}
              </Hand>
              <Hand x={735} y={450} fs={40} color="var(--ink)" style={{ width: 220, textAlign: "center", background: "var(--paper)", borderRadius: 14, padding: "4px 0" }}>
                {L.offScreen}
              </Hand>
            </div>
          )}
          <Hand x={120} y={300} fs={46} color="var(--ink-2)" style={{ opacity: beat(frame, S.s4, 2.4, 0.4) * (zoom < 0.5 ? 1 : 1 - (zoom - 0.5) * 2) }}>
            {L.back}
          </Hand>

          {/* s5: how much bigger */}
          {frame >= S.s5.from && frame < S.s6.from + 10 && (
            <div style={{ opacity: 1 - beat(frame, S.s6, 0, 0.3) }}>
              <Hand x={90} y={330} fs={54} style={{ opacity: beat(frame, S.s5, 1.6, 0.4) }}>
                {L.x117}
              </Hand>
              <Hand x={90} y={420} fs={54} style={{ opacity: beat(frame, S.s5, 3.4, 0.4) }}>
                {L.x1500}
              </Hand>
              <Layer o={beat(frame, S.s5, 5.6, 0.4)}>
                <Arrow x1={205} y1={790} x2={205} y2={880} width={5} color="var(--ink-2)" dashed />
              </Layer>
              <Hand x={70} y={720} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, S.s5, 5.6, 0.4) }}>
                {L.dot}
              </Hand>
            </div>
          )}

          {/* s6: stacked towers */}
          {frame >= S.s6.from && (
            <div style={{ opacity: 1 - s7 }}>
              <Layer>
                {Array.from({ length: N_TOWERS }, (_, k) => (
                  <TowerGlyph key={k} x={560} y={GROUND - k * TOWER_H} o={beat(frame, S.s6, 0.6 + k * 0.16, 0.2)} />
                ))}
                <Arrow x1={360} y1={GROUND - 40} x2={510} y2={GROUND - 26} width={4} color="var(--ink-2)" p={beat(frame, S.s6, 0.6, 0.4)} />
              </Layer>
              <T x={70} y={GROUND - 200} w={300} fs={34} bold align="right" o={beat(frame, S.s6, 0.6, 0.4)}>
                {L.tower}
              </T>
              <Hand x={300} y={470} fs={64} style={{ opacity: beat(frame, S.s6, 3.4, 0.4) }}>
                {L.x14}
              </Hand>
              <Hand x={140} y={600} fs={50} style={{ opacity: beat(frame, S.s6, 4.6, 0.4), rotate: "-3deg" }}>
                {L.huge}
              </Hand>
            </div>
          )}

          {/* s7: what size bought */}
          {frame >= S.s7.from && (
            <div style={{ opacity: s7 }}>
              <T x={70} y={360} w={560} fs={44} bold>
                {L.fewShot}
              </T>
              <Hand x={70} y={560} fs={56} style={{ opacity: beat(frame, S.s7, 4.4, 0.4) }}>
                {L.why}
              </Hand>
              <Hand x={70} y={680} fs={44} color="var(--ink-2)" style={{ opacity: beat(frame, S.s7, 6.4, 0.4) }}>
                {L.next}
              </Hand>
            </div>
          )}
        </div>
      )}

      <Narration tl={tl} chapter={ch69.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};

