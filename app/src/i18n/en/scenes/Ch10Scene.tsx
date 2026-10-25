import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { FRIENDS } from "../../../data/ch07";
import { SENTENCE_ROWS, ch10 } from "../../../data/ch10";
import { Caption, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, mix, type SceneProps } from "../../../scenes/kit";

const tl = buildTimeline(ch10);
const S = byId(tl);
const L = ch10.labels;

const CW = 170;
const RH = 110;
const MX = 400;
const MY = 380;
const fmt = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));

/** Square brackets around a w×h box at (x, y), drawn as `p` goes 0→1. */
const Brackets: FC<{ x: number; y: number; w: number; h: number; p: number }> = ({ x, y, w, h, p }) => {
  const side = { position: "absolute" as const, top: y - 14, height: (h + 28) * p, width: 26, borderTop: "6px solid var(--ink)", borderBottom: "6px solid var(--ink)" };
  return (
    <>
      <div style={{ ...side, left: x - 34, borderLeft: "6px solid var(--ink)" }} />
      <div style={{ ...side, left: x + w + 8, borderRight: "6px solid var(--ink)" }} />
    </>
  );
};

export const Ch10Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const tasteOn = 1 - beat(frame, S.s5, 0, 0.5);
  const parens = 1 - beat(frame, S.s2, 0, 0.5);
  const rowBand = beat(frame, S.s3, 0.6, 0.4) * (1 - beat(frame, S.s4, 4.0, 0.4));
  const colBand = beat(frame, S.s3, 2.0, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) + beat(frame, S.s4, 4.0, 0.4) * (1 - beat(frame, S.s5, 0, 0.3));
  const sentOn = beat(frame, S.s5, 0.4, 0.5) * (1 - beat(frame, S.s7, 0, 0.5));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {frame < S.s5.from + 20 && (
        <div style={{ opacity: tasteOn }}>
          {/* bands behind a row / a column */}
          <div style={{ position: "absolute", left: MX - 12, top: MY + 8, width: CW * 2 + 24, height: RH - 16, borderRadius: 14, background: "var(--hl-pink)", opacity: rowBand * 0.9 }} />
          <div style={{ position: "absolute", left: MX + 8, top: MY - 12, width: CW - 16, height: RH * 3 + 24, borderRadius: 14, background: "var(--hl-sky)", opacity: colBand * 0.8 }} />

          {["spicy", "sweet"].map((k, j) => (
            <div key={k} style={{ position: "absolute", left: MX + j * CW, width: CW, top: MY - 70, textAlign: "center", fontSize: 34, fontWeight: 700, opacity: beat(frame, S.s1, 1.6, 0.4) }}>
              {L[k]}
            </div>
          ))}
          {FRIENDS.map((f, i) => {
            const a = beat(frame, S.s1, 0.3 + i * 0.4, 0.6);
            return (
              <div key={f.name} style={{ opacity: a, translate: `${mix(-80, 0, a)}px 0px` }}>
                <div style={{ position: "absolute", left: 150, width: 200, top: MY + i * RH + 30, textAlign: "right", fontSize: 40, fontWeight: 700 }}>{f.name}</div>
                {f.v.map((v, j) => (
                  <div key={j} style={{ position: "absolute", left: MX + j * CW, width: CW, top: MY + i * RH + 18, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 64 }}>
                    {v}
                  </div>
                ))}
                <div style={{ position: "absolute", left: MX - 20, top: MY + i * RH + 14, fontSize: 64, opacity: parens }}>(</div>
                <div style={{ position: "absolute", left: MX + CW - 16, top: MY + i * RH + 14, fontSize: 64, opacity: parens }}>,</div>
                <div style={{ position: "absolute", left: MX + CW * 2 - 8, top: MY + i * RH + 14, fontSize: 64, opacity: parens }}>)</div>
              </div>
            );
          })}
          <Brackets x={MX} y={MY} w={CW * 2} h={RH * 3} p={beat(frame, S.s2, 0.4, 0.6)} />
          <div style={{ position: "absolute", left: MX - 40, top: 170, fontSize: 64, fontWeight: 700, opacity: beat(frame, S.s2, 1.0, 0.4) }}>{L.matrix}</div>
          {/* en: "Matrix" is wider than the Korean title, so the school chip moves right */}
          <div style={{ position: "absolute", left: MX + 196, top: 192, opacity: beat(frame, S.s2, 2.0, 0.4) }}>
            <span style={{ fontSize: 30, background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 8, padding: "4px 12px" }}>{L.school}</span>
          </div>

          {/* s3: rows, columns, size */}
          <Hand x={790} y={MY + 30} fs={44} style={{ opacity: beat(frame, S.s3, 0.9, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            ← {L.row}
          </Hand>
          <Hand x={MX - 40} y={MY + RH * 3 + 30} fs={44} style={{ opacity: beat(frame, S.s3, 2.3, 0.4) * (1 - beat(frame, S.s4, 0, 0.3)) }}>
            ↑ {L.col}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontSize: 60, fontWeight: 700, opacity: beat(frame, S.s3, 4.0, 0.5) }}>
            <InlineCircle p={beat(frame, S.s3, 4.6, 0.6)}>{L.size}</InlineCircle>
          </div>

          {/* s4: two ways to read it */}
          <div style={{ position: "absolute", left: 790, top: MY + 20, fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s4, 0.6, 0.4) * (1 - beat(frame, S.s4, 4.0, 0.3)) }}>
            {FRIENDS[0].name} = <span style={{ fontFamily: "var(--font-mono)" }}>(8, 3)</span>
          </div>
          <Hand x={790} y={MY + 80} fs={36} color="var(--ink-2)" style={{ opacity: beat(frame, S.s4, 1.2, 0.4) * (1 - beat(frame, S.s4, 4.0, 0.3)) }}>
            {/* en: the English label is too long for one line here, so its last word goes on a second line */}
            {[L.rowRead.slice(0, L.rowRead.lastIndexOf(" ")), L.rowRead.slice(L.rowRead.lastIndexOf(" ") + 1)].map((t) => (
              <div key={t}>{t}</div>
            ))}
          </Hand>
          <div style={{ position: "absolute", left: 160, top: 750, fontSize: 36, fontWeight: 700, opacity: beat(frame, S.s4, 4.4, 0.4) }}>
            {L.spicy}: <span style={{ fontFamily: "var(--font-mono)" }}>8, 2, 7</span>
          </div>
          <Hand x={160} y={800} fs={36} color="var(--ink-2)" style={{ opacity: beat(frame, S.s4, 5.0, 0.4) }}>
            {L.colRead}
          </Hand>
        </div>
      )}

      {/* s5–s6: a sentence is a matrix too */}
      {frame >= S.s5.from && frame < S.s7.from + 20 && (
        <div style={{ opacity: sentOn }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 54, fontWeight: 700 }}>{L.sentence}</div>
          {[3, 2, 1].map((k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: 236 + k * 18,
                top: 360 + k * 18,
                width: 760,
                height: 300,
                borderRadius: 16,
                border: "3px solid var(--grid-major)",
                background: "var(--paper)",
                opacity: beat(frame, S.s6, 1.6 + (3 - k) * 0.3, 0.4),
              }}
            />
          ))}
          <div style={{ position: "absolute", left: 236, top: 360, width: 760, height: 300, background: "var(--paper)", borderRadius: 16, opacity: beat(frame, S.s6, 1.6, 0.4) }} />
          {SENTENCE_ROWS.map((r, i) => {
            const a = beat(frame, S.s5, 0.8 + i * 0.4, 0.5);
            return (
              <div key={r.w} style={{ opacity: a }}>
                <div style={{ position: "absolute", left: 20, width: 172, top: 386 + i * 90, textAlign: "right", fontSize: 40, fontWeight: 700 }}>{r.w}</div>
                {r.v.map((v, j) => (
                  <div key={j} style={{ position: "absolute", left: 260 + j * 112, width: 110, top: 392 + i * 90, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 32 }}>
                    {fmt(v)}
                  </div>
                ))}
                <div style={{ position: "absolute", left: 940, top: 386 + i * 90, fontSize: 40, color: "var(--ink-3)" }}>…</div>
              </div>
            );
          })}
          <Brackets x={250} y={372} w={730} h={276} p={beat(frame, S.s5, 1.8, 0.6)} />
          <Hand x={600} y={700} fs={44} style={{ opacity: beat(frame, S.s5, 3.0, 0.4) }}>
            {L.more}
          </Hand>
          <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", opacity: beat(frame, S.s6, 0.6, 0.5) }}>
            <span style={{ fontSize: 60, fontWeight: 700, fontFamily: "var(--font-mono)", background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 14, padding: "4px 24px" }}>{L.gpt}</span>
          </div>
          <Hand x={360} y={920} fs={48} style={{ opacity: beat(frame, S.s6, 2.6, 0.4) }}>
            {L.layer}
          </Hand>
        </div>
      )}

      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontSize: 72, fontWeight: 700 }}>{L.sum}</div>
        </div>
      )}

      <Narration tl={tl} chapter={ch10.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
