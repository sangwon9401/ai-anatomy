// en: overlay of src/scenes/Ch33Scene.tsx: group-name positions and a shorter note under the table (s5).
import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { PIPELINE } from "../../../data/ch05";
import { GROUPS, RANDOM_START, STARS, ch33, lerp3, project, type V3 } from "../../../data/ch33";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, hl, mix, type SceneProps } from "../../../scenes/kit";
import { Blueprint, Line, Svg } from "../../../scenes/part3-kit";

const tl = buildTimeline(ch33);
const S = byId(tl);
const L = ch33.labels;

const CX = 540;
const CY = 620;
const R = 330;
const PITCH = 0.42;
const fmt = (x: number) => (x < 0 ? `−${Math.abs(x)}` : String(x));
const DOG = 0;
const CAT = 1;
const BUS = 8;
const TABLE_ROWS = [0, 1, 8, 4, 12];
// where the group names sit (screen px) for the settled views at the end of s3 and s6
// en: the English group names are longer, so 'fruit' and 'vehicles' move clear of the title and 'airplane'
const GROUP_AT: [number, number][] = [
  [860, 270],
  [300, 262],
  [830, 795],
  [210, 680],
];

const StarField: FC<{
  pos: V3[];
  yaw: number;
  o: number;
  focus?: number[];
  dim?: number;
  arrows?: number;
  groupLabels?: number;
}> = ({ pos, yaw, o, focus, dim = 0, arrows = 0, groupLabels = 0 }) => {
  const pts = pos.map((v, i) => ({ i, ...project(v, yaw, PITCH) })).sort((a, b) => a.z - b.z);
  const axes: V3[] = [
    [1.15, 0, 0],
    [0, 1.15, 0],
    [0, 0, 1.15],
  ];
  const AX = [L.ax1, L.ax2, L.ax3];
  return (
    <div style={{ opacity: o }}>
      <Svg>
        {axes.map((a, k) => {
          const p = project(a, yaw, PITCH);
          const q = project([-a[0], -a[1], -a[2]], yaw, PITCH);
          return <line key={k} x1={CX + q.x * R} y1={CY - q.y * R} x2={CX + p.x * R} y2={CY - p.y * R} stroke="var(--ink-3)" strokeWidth={3} strokeDasharray="10 10" />;
        })}
        {arrows > 0 &&
          (focus ?? []).map((i) => {
            const p = project(pos[i], yaw, PITCH);
            return <line key={i} x1={CX} y1={CY} x2={mix(CX, CX + p.x * R, arrows)} y2={mix(CY, CY - p.y * R, arrows)} stroke={i === BUS ? "var(--ink-2)" : "var(--pen)"} strokeWidth={7} strokeLinecap="round" />;
          })}
      </Svg>
      {axes.map((a, k) => {
        const p = project(a, yaw, PITCH);
        return (
          <div key={k} style={{ position: "absolute", left: CX + p.x * R + 8, top: CY - p.y * R - 20, fontSize: 28, color: "var(--ink-3)" }}>
            {AX[k]}
          </div>
        );
      })}
      {pts.map((p) => {
        const star = STARS[p.i];
        const s = 1 + 0.22 * p.z;
        const isFocus = focus?.includes(p.i);
        const op = (0.78 + 0.22 * ((p.z + 1) / 2)) * (focus && !isFocus ? mix(1, 0.2, dim) : 1);
        const x = CX + p.x * R;
        const y = CY - p.y * R;
        return (
          <div key={p.i} style={{ opacity: op }}>
            <div
              style={{
                position: "absolute",
                left: x - 15 * s,
                top: y - 15 * s,
                width: 30 * s,
                height: 30 * s,
                borderRadius: "50%",
                background: hl(GROUPS[star.group].c),
                border: "4px solid var(--ink)",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                position: "absolute",
                ...(star.side === "l" ? { right: 1080 - (x - 20 * s) } : { left: x + 20 * s }),
                top: y - 22 * s + (star.dy ?? 0),
                fontSize: Math.max(32, 36 * s),
                fontWeight: isFocus ? 700 : 500,
                whiteSpace: "nowrap",
              }}
            >
              {star.w}
            </div>
          </div>
        );
      })}
      {groupLabels > 0 &&
        GROUPS.map((g, k) => (
          <Hand key={g.name} x={GROUP_AT[k][0]} y={GROUP_AT[k][1]} fs={56} style={{ opacity: groupLabels }}>
            {g.name}
          </Hand>
        ))}
    </div>
  );
};

export const Ch33Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const mapOn = beat(frame, S.s2, 0.3, 0.6) * (1 - beat(frame, S.s5, 0, 0.5));
  const s5On = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const s6On = beat(frame, S.s6, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.2, 0.5) * (1 - beat(frame, S.s8, 0, 0.5));
  const s8On = beat(frame, S.s8, 0.2, 0.5);

  // one full turn in s2 that settles on a clear view, then small drifts that stay inside the checked range
  const yaw = -0.3 - 2 * Math.PI * (1 - beat(frame, S.s2, 0.4, 5.4, EASE_IO)) + 0.15 * beat(frame, S.s3, 0, 7.5, EASE_IO) - 0.1 * beat(frame, S.s4, 0, 8, EASE_IO);
  const train = beat(frame, S.s6, 1.6, 4.0, EASE_IO);
  const trainYaw = -0.4 + 0.2 * beat(frame, S.s6, 0, 8, EASE_IO);
  const pull = beat(frame, S.s5, 3.6, 0.9, EASE_IO);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: a word becomes a short row of numbers */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <Line y={190} fs={58}>
            {L.emb}
          </Line>
          <Chip text={L.dog} color="yellow" fs={68} x={540 - chipWidth(L.dog, 68) / 2} y={290} style={{ opacity: beat(frame, S.s1, 0.6, 0.4) }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 392, textAlign: "center", fontSize: 60, color: "var(--ink-3)", opacity: beat(frame, S.s1, 1.2, 0.3) }}>↓</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 476, display: "flex", justifyContent: "center", opacity: beat(frame, S.s1, 1.4, 0.5) }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 64, fontWeight: 500, padding: "6px 26px", borderRadius: 16, background: "var(--hl-mint)", color: "var(--chip-ink)", whiteSpace: "nowrap" }}>{L.dogVec}</span>
          </div>
          <div style={{ opacity: beat(frame, S.s1, 3.6, 0.5) }}>
            <div style={{ position: "absolute", left: 90, top: 680, width: 900, height: 64, borderRadius: 10, border: "3px solid var(--ink-3)", background: "var(--paper-2)" }} />
            <div style={{ position: "absolute", left: 90, width: 900, top: 688, textAlign: "center", fontSize: 36, color: "var(--ink-2)" }}>{L.oneHot}</div>
          </div>
          <div style={{ opacity: beat(frame, S.s1, 4.6, 0.5) }}>
            <div style={{ position: "absolute", left: 90, top: 800, width: 150, height: 64, borderRadius: 10, background: "var(--hl-mint)" }} />
            <div style={{ position: "absolute", left: 270, top: 806, fontSize: 40, fontWeight: 700 }}>{L.short}</div>
          </div>
        </div>
      )}

      {/* s2–s4: the star map */}
      {frame >= S.s2.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: mapOn }}>
          <Line y={140} fs={50} o={beat(frame, S.s2, 0.4, 0.4) * (1 - beat(frame, S.s3, 0, 0.4))}>
            {L.point}
          </Line>
          <Line y={140} fs={50} o={beat(frame, S.s3, 0.3, 0.4) * (1 - beat(frame, S.s4, 0, 0.4))}>
            <InlineCircle p={beat(frame, S.s3, 0.8, 0.6)}>{L.near}</InlineCircle>
          </Line>
          <StarField
            pos={STARS.map((s) => s.v)}
            yaw={yaw}
            o={1}
            focus={frame >= S.s4.from ? [DOG, CAT, BUS] : undefined}
            dim={beat(frame, S.s4, 0.3, 0.5)}
            arrows={beat(frame, S.s4, 1.0, 0.8)}
            groupLabels={beat(frame, S.s3, 1.6, 0.6) * (1 - beat(frame, S.s4, 0, 0.4))}
          />
          <Hand x={0} y={1010} fs={36} color="var(--ink-3)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 3.0, 0.5) }}>
            {L.example}
          </Hand>
          {/* s4: dot products */}
          <div style={{ position: "absolute", left: 60, top: 120, opacity: beat(frame, S.s4, 0.3, 0.4) }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>{L.dotTitle}</div>
            <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 42, opacity: beat(frame, S.s4, 2.0, 0.4) }}>
              <span style={{ background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 8px" }}>{L.dot1}</span>
            </div>
            <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 42, color: "var(--ink-2)", opacity: beat(frame, S.s4, 3.6, 0.4) }}>{L.dot2}</div>
          </div>
          <Hand x={640} y={176} fs={46} style={{ opacity: beat(frame, S.s4, 5.2, 0.4), rotate: "-3deg" }}>
            {L.sameDir}
          </Hand>
        </div>
      )}

      {/* s5: the embedding table */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5On }}>
          <Line y={130} fs={54}>
            {L.table}
          </Line>
          {(() => {
            const cols = [
              { x: 140, w: 120, t: L.id },
              { x: 260, w: 220, t: "" },
              { x: 480, w: 160, t: L.ax1 },
              { x: 640, w: 160, t: L.ax2 },
              { x: 800, w: 160, t: L.ax3 },
            ];
            return (
              <>
                {cols.map((c) => (
                  <div key={c.x} style={{ position: "absolute", left: c.x, width: c.w, top: 220, textAlign: "center", fontSize: 32, color: "var(--ink-2)" }}>
                    {c.t}
                  </div>
                ))}
                {TABLE_ROWS.map((si, r) => {
                  const star = STARS[si];
                  const y = 280 + r * 78;
                  const hot = r === 0 ? beat(frame, S.s5, 2.4, 0.4) : 0;
                  return (
                    <div key={si} style={{ opacity: beat(frame, S.s5, 0.5 + r * 0.2, 0.3) }}>
                      <div style={{ position: "absolute", left: 130, top: y, width: 840, height: 70, borderRadius: 12, background: hot ? "var(--hl-yellow)" : r % 2 ? "var(--paper-2)" : "var(--paper)", border: "2px solid var(--line)", opacity: hot ? mix(0.6, 1, hot) : 1 }} />
                      <div style={{ position: "absolute", left: 140, width: 120, top: y + 12, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 38 }}>{r}</div>
                      <div style={{ position: "absolute", left: 260, width: 220, top: y + 10, textAlign: "center", fontSize: 40, fontWeight: 700 }}>{star.w}</div>
                      {star.v.map((x, k) => (
                        <div key={k} style={{ position: "absolute", left: 480 + k * 160, width: 160, top: y + 12, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 38 }}>
                          {fmt(x)}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            );
          })()}
          <Hand x={150} y={688} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, S.s5, 1.6, 0.4) }}>
            {L.rowNote} · {L.example5}
          </Hand>
          {/* pull row 0 out */}
          <div style={{ position: "absolute", left: 0, right: 0, top: mix(280, 790, pull), display: "flex", justifyContent: "center", alignItems: "center", gap: 20, opacity: pull > 0 ? 1 : 0 }}>
            <span style={{ fontSize: 46, fontWeight: 700 }}>
              {L.id} 0 → {L.dog}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 50, padding: "4px 18px", borderRadius: 14, background: "var(--hl-mint)", color: "var(--chip-ink)" }}>{L.dogVec}</span>
          </div>
          <Hand x={0} y={900} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s5, 5.0, 0.4) }}>
            {L.matmul}
          </Hand>
        </div>
      )}

      {/* s6: training moves the stars */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          <Line y={140} fs={50} o={1 - beat(frame, S.s6, 2.8, 0.4)}>
            {L.before}
          </Line>
          <Line y={140} fs={50} o={beat(frame, S.s6, 3.0, 0.4)}>
            {L.after}
          </Line>
          <StarField pos={STARS.map((s, i) => lerp3(RANDOM_START[i], s.v, train))} yaw={trainYaw} o={1} groupLabels={beat(frame, S.s6, 5.8, 0.5)} />
        </div>
      )}

      {/* s7: the real table */}
      {frame >= S.s7.from && frame < S.s8.from + 15 && (
        <div style={{ opacity: s7On }}>
          <Line y={140} fs={54}>
            {L.real}
          </Line>
          <div
            style={{
              position: "absolute",
              left: 230,
              top: 300,
              width: mix(160, 700, beat(frame, S.s7, 1.6, 1.0, EASE_IO)),
              height: mix(80, 440, beat(frame, S.s7, 0.6, 1.0, EASE_IO)),
              borderRadius: 14,
              border: "4px solid var(--ink)",
              boxSizing: "border-box",
              background: "repeating-linear-gradient(0deg, var(--paper) 0 10px, var(--grid-major) 10px 12px), var(--paper)",
            }}
          />
          <div style={{ position: "absolute", left: 230, top: 236, fontSize: 38, fontWeight: 700, opacity: beat(frame, S.s7, 2.2, 0.4) }}>{L.cols} →</div>
          <div style={{ position: "absolute", left: 40, top: 480, width: 180, fontSize: 36, fontWeight: 700, textAlign: "right", whiteSpace: "normal", wordBreak: "keep-all", lineHeight: 1.3, opacity: beat(frame, S.s7, 1.0, 0.4) }}>
            ↓ {L.rows}
          </div>
          <Line y={800} fs={46} mono weight={500} o={beat(frame, S.s7, 4.0, 0.5)}>
            {L.total}
          </Line>
          <Hand x={0} y={880} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.4, 0.5), rotate: "-2deg" }}>
            {L.over}
          </Hand>
        </div>
      )}

      {/* s8: blueprint */}
      {frame >= S.s8.from && (
        <div style={{ opacity: s8On }}>
          <Line y={110} fs={52}>
            {L.bp}
          </Line>
          <Blueprint parts={PIPELINE} filled={["tok", "loop"]} fresh="emb" p={beat(frame, S.s8, 1.0, 0.8)} y0={210} emptyText={L.empty} />
          <Hand x={0} y={960} fs={46} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s8, 3.4, 0.5) }}>
            {L.next}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch33.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
