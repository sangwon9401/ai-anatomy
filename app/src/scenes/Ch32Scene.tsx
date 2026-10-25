import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ID_E, ID_NANEUN, VOCAB5, ch32, oneHot } from "../data/ch32";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, hl, mix, type SceneProps } from "./kit";
import { Line, NumBox, PenArrow, Svg } from "./part3-kit";

const tl = buildTimeline(ch32);
const S = byId(tl);
const L = ch32.labels;

const CELL = 112;
const CGAP = 12;
const TX = 330; // table left
const RY = (r: number) => 330 + r * 108;

/** One row of one-hot cells. */
const Cells: FC<{ i: number; x: number; y: number; cell?: number; gap?: number; o?: number; fs?: number }> = ({ i, x, y, cell = CELL, gap = CGAP, o = 1, fs = 44 }) => (
  <>
    {oneHot(i, VOCAB5.length).map((v, k) => (
      <div
        key={k}
        style={{
          position: "absolute",
          left: x + k * (cell + gap),
          top: y,
          width: cell,
          height: 84,
          borderRadius: 12,
          border: v ? "4px solid var(--ink)" : "2px solid var(--line)",
          background: v ? hl(VOCAB5[i].c) : "var(--paper)",
          color: v ? "var(--chip-ink)" : "var(--ink-3)",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: fs,
          fontWeight: v ? 700 : 400,
          boxSizing: "border-box",
          opacity: o,
        }}
      >
        {v}
      </div>
    ))}
  </>
);

// s6: the three words sit on an equilateral triangle
const TRI: [number, number][] = [
  [540, 300],
  [290, 735],
  [790, 735],
];
const TRI_WORDS = [0, 1, 2];

export const Ch32Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1On = beat(frame, S.s1, 0.2, 0.5) * (1 - beat(frame, S.s2, 0, 0.5));
  const s2On = beat(frame, S.s2, 0.2, 0.5) * (1 - beat(frame, S.s3, 0, 0.5));
  const s3On = beat(frame, S.s3, 0.2, 0.5) * (1 - beat(frame, S.s4, 0, 0.5));
  const s4On = beat(frame, S.s4, 0.2, 0.5) * (1 - beat(frame, S.s5, 0, 0.5));
  const s5On = beat(frame, S.s5, 0.2, 0.5) * (1 - beat(frame, S.s6, 0, 0.5));
  const s6On = beat(frame, S.s6, 0.2, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));
  const s7On = beat(frame, S.s7, 0.2, 0.5);

  // s4: the row of cells keeps growing
  const grow = beat(frame, S.s4, 2.6, 2.4, EASE_IO);
  const nCells = Math.round(5 * Math.pow(80, grow));
  const solid = beat(frame, S.s4, 5.0, 0.4);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: ids straight into the model? */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          {[
            { w: L.naneun, id: ID_NANEUN, x: 300, c: "sky" as const, t: 0.4 },
            { w: L.e, id: ID_E, x: 780, c: "yellow" as const, t: 1.2 },
          ].map((r) => (
            <div key={r.w} style={{ opacity: beat(frame, S.s1, r.t, 0.4) }}>
              <Chip text={r.w} color={r.c} fs={64} x={r.x - chipWidth(r.w, 64) / 2} y={230} />
              <div style={{ position: "absolute", left: r.x - 20, top: 340, fontSize: 40, color: "var(--ink-3)" }}>↓</div>
              <NumBox x={r.x - 130} y={400} w={260} h={96} fs={52} color={r.c}>
                {r.id}
              </NumBox>
            </div>
          ))}
          <div style={{ position: "absolute", left: 340, top: 700, width: 400, height: 150, borderRadius: 26, border: "5px solid var(--ink)", background: "var(--hl-violet)", color: "var(--chip-ink)", display: "grid", placeItems: "center", fontSize: 54, fontWeight: 700, opacity: beat(frame, S.s1, 2.4, 0.4) }}>
            {L.model}
          </div>
          <Svg>
            <PenArrow x1={300} y1={510} x2={460} y2={690} p={beat(frame, S.s1, 2.8, 0.5)} bend={-30} />
            <PenArrow x1={780} y1={510} x2={620} y2={690} p={beat(frame, S.s1, 3.0, 0.5)} bend={-30} />
          </Svg>
          <Hand x={0} y={890} fs={56} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 3.6, 0.4) }}>
            {L.into}
          </Hand>
        </div>
      )}

      {/* s2: size means nothing */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          {[
            { w: L.naneun, id: ID_NANEUN, y: 260, c: "var(--hl-sky)" },
            { w: L.e, id: ID_E, y: 400, c: "var(--hl-yellow)" },
          ].map((r, i) => {
            const g = beat(frame, S.s2, 0.6 + i * 0.6, 1.0, EASE_IO);
            return (
              <div key={r.w}>
                <div style={{ position: "absolute", left: 70, top: r.y + 10, width: 120, fontSize: 48, fontWeight: 700 }}>{r.w}</div>
                <div style={{ position: "absolute", left: 200, top: r.y, height: 84, width: Math.max(10, (r.id / ID_NANEUN) * 780 * g), borderRadius: 14, background: r.c }} />
                <div style={{ position: "absolute", left: 200 + Math.max(10, (r.id / ID_NANEUN) * 780 * g) + 16, top: r.y + 16, fontFamily: "var(--font-mono)", fontSize: 42, opacity: g }}>{i === 1 ? r.id : ""}</div>
                {i === 0 && (
                  <div style={{ position: "absolute", left: 220, top: r.y + 16, fontFamily: "var(--font-mono)", fontSize: 42, color: "var(--chip-ink)", opacity: g }}>
                    {r.id}
                  </div>
                )}
              </div>
            );
          })}
          <Line y={590} fs={54} mono weight={500} o={beat(frame, S.s2, 2.6, 0.4)}>
            {L.ratio}
          </Line>
          <Hand x={0} y={690} fs={58} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 3.8, 0.4), rotate: "-2deg" }}>
            {L.bigger}
          </Hand>
          <Line y={840} fs={44} weight={500} color="var(--ink-2)" o={beat(frame, S.s2, 5.6, 0.5)}>
            {L.noMeaning}
          </Line>
        </div>
      )}

      {/* s3: one-hot table */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          <Line y={160} fs={56}>
            {L.seat}
          </Line>
          {VOCAB5.map((v, k) => (
            <div key={`h${k}`} style={{ position: "absolute", left: TX + k * (CELL + CGAP) - 10, width: CELL + 20, top: 272, textAlign: "center", fontSize: 28, color: "var(--ink-2)", opacity: beat(frame, S.s3, 0.6, 0.4) }}>
              {k + 1}
            </div>
          ))}
          {VOCAB5.map((v, r) => {
            const a = beat(frame, S.s3, 1.2 + r * 0.6, 0.4);
            return (
              <div key={v.w} style={{ opacity: a }}>
                <Chip text={v.w} color={v.c} fs={46} x={TX - 30 - chipWidth(v.w, 46)} y={RY(r) + 7} />
                <Cells i={r} x={TX} y={RY(r)} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 940, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 30, opacity: beat(frame, S.s3, 5.0, 0.4) }}>
            <span style={{ fontSize: 52, fontWeight: 700 }}>
              <InlineCircle p={beat(frame, S.s3, 5.6, 0.6)}>{L.oneHot}</InlineCircle>
            </span>
          </div>
          <Hand x={760} y={852} fs={42} style={{ opacity: beat(frame, S.s3, 3.8, 0.4) }}>
            ↑ {L.onlyOne}
          </Hand>
        </div>
      )}

      {/* s4: far too long */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          <Line y={170} fs={56}>
            {L.prob1}
          </Line>
          <div style={{ opacity: beat(frame, S.s4, 0.6, 0.4) }}>
            <div
              style={{
                position: "absolute",
                left: 90,
                top: 460,
                width: 900,
                height: 110,
                borderRadius: 10,
                border: "3px solid var(--ink)",
                boxSizing: "border-box",
                background:
                  solid > 0.5
                    ? "var(--paper-2)"
                    : `repeating-linear-gradient(90deg, var(--paper) 0px, var(--paper) ${Math.max(1, 900 / nCells - 2)}px, var(--ink-3) ${Math.max(1, 900 / nCells - 2)}px, var(--ink-3) ${900 / nCells}px)`,
              }}
            />
            <div style={{ position: "absolute", left: 630, top: 452, width: 14, height: 126, borderRadius: 4, background: "var(--pen)", opacity: beat(frame, S.s4, 5.4, 0.3) }} />
            <div style={{ position: "absolute", left: 90, width: 900, top: 360, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 44, color: "var(--ink-2)", opacity: 1 - solid }}>
              {Math.min(nCells, 400)}
            </div>
          </div>
          <Hand x={560} y={600} fs={54} style={{ opacity: beat(frame, S.s4, 5.8, 0.4) }}>
            ↑ {L.justOne}
          </Hand>
          <Line y={350} fs={60} o={solid}>
            {L.cells}
          </Line>
          <Line y={780} fs={32} mono weight={500} color="var(--ink-3)" o={beat(frame, S.s4, 6.4, 0.4)}>
            {L.zeros}
          </Line>
        </div>
      )}

      {/* s5: everyone is equally far apart */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5On }}>
          <Line y={160} fs={56}>
            {L.prob2}
          </Line>
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ opacity: beat(frame, S.s5, 0.5 + r * 0.4, 0.4) }}>
              <Chip text={VOCAB5[r].w} color={VOCAB5[r].c} fs={44} x={TX - 30 - chipWidth(VOCAB5[r].w, 44)} y={270 + r * 104 + 8} />
              <Cells i={r} x={TX} y={270 + r * 104} />
            </div>
          ))}
          {[
            { a: 0, b: 1, y: 640, t: 2.2 },
            { a: 0, b: 2, y: 760, t: 3.6 },
          ].map((p) => (
            <div key={p.y} style={{ position: "absolute", left: 0, right: 0, top: p.y, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, fontSize: 42, fontWeight: 700, opacity: beat(frame, S.s5, p.t, 0.4) }}>
              <span style={{ padding: "0 14px", borderRadius: 10, background: hl(VOCAB5[p.a].c), color: "var(--chip-ink)" }}>{VOCAB5[p.a].w}</span>·
              <span style={{ padding: "0 14px", borderRadius: 10, background: hl(VOCAB5[p.b].c), color: "var(--chip-ink)" }}>{VOCAB5[p.b].w}</span>
              <span style={{ fontWeight: 500 }}>
                {L.distLbl} <b style={{ fontFamily: "var(--font-mono)" }}>{L.sqrt2}</b>, {L.dotLbl} <b style={{ fontFamily: "var(--font-mono)" }}>0</b>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* s6: an equilateral triangle */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          <Svg>
            {[
              [0, 1],
              [1, 2],
              [0, 2],
            ].map(([a, b], k) => {
              const p = beat(frame, S.s6, 0.8 + k * 0.4, 0.5);
              return (
                <line key={k} x1={TRI[a][0]} y1={TRI[a][1]} x2={mix(TRI[a][0], TRI[b][0], p)} y2={mix(TRI[a][1], TRI[b][1], p)} stroke="var(--ink-3)" strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" opacity={p > 0 ? 1 : 0} />
              );
            })}
          </Svg>
          {[
            [0, 1],
            [1, 2],
            [0, 2],
          ].map(([a, b], k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: (TRI[a][0] + TRI[b][0]) / 2 - 70 + (k === 0 ? -70 : k === 2 ? 70 : 0),
                top: (TRI[a][1] + TRI[b][1]) / 2 - 30 + (k === 1 ? 40 : 0),
                width: 140,
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 48,
                fontWeight: 500,
                color: "var(--pen)",
                opacity: beat(frame, S.s6, 1.6 + k * 0.3, 0.3),
              }}
            >
              {L.r2}
            </div>
          ))}
          {TRI_WORDS.map((w, k) => (
            <Chip key={w} text={VOCAB5[w].w} color={VOCAB5[w].c} fs={56} x={TRI[k][0] - chipWidth(VOCAB5[w].w, 56) / 2} y={TRI[k][1] - 42} style={{ opacity: beat(frame, S.s6, 0.3 + k * 0.2, 0.4) }} />
          ))}
          <Hand x={0} y={880} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 3.4, 0.4) }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s7: we need something short and meaningful */}
      {frame >= S.s7.from && (
        <div style={{ opacity: s7On }}>
          <Line y={190} fs={52}>
            {L.need}
          </Line>
          <div style={{ position: "absolute", left: 90, top: 340, width: 900, height: 80, borderRadius: 10, border: "3px solid var(--ink-3)", background: "var(--paper-2)", opacity: beat(frame, S.s7, 0.5, 0.4) }} />
          <div style={{ position: "absolute", left: 90, width: 900, top: 352, textAlign: "center", fontSize: 36, color: "var(--ink-2)", opacity: beat(frame, S.s7, 0.5, 0.4) }}>
            {L.oneHot}: {L.cells}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", fontSize: 64, color: "var(--ink-3)", opacity: beat(frame, S.s7, 1.4, 0.4) }}>↓</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 580, display: "flex", justifyContent: "center", opacity: beat(frame, S.s7, 2.0, 0.5), scale: String(mix(0.8, 1, beat(frame, S.s7, 2.0, 0.5))) }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 68, fontWeight: 500, padding: "10px 30px", borderRadius: 16, background: "var(--hl-mint)", color: "var(--chip-ink)" }}>{L.sample}</span>
          </div>
          <Hand x={0} y={760} fs={60} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 3.4, 0.5), rotate: "-2deg" }}>
            {L.emb}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch32.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
