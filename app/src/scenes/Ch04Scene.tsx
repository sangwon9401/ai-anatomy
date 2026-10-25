import type { CSSProperties, FC } from "react";
import { useCurrentFrame } from "remotion";
import { WEIGHTS, ch04, words } from "../data/ch04";
import { Caption, Narration, Chip, Hand, InlineCircle, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, type SceneProps } from "./kit";

const tl = buildTimeline(ch04);
const S = byId(tl);
const L = ch04.labels;

const Verdict: FC<{ spam: boolean; x: number; y: number; o: number }> = ({ spam, x, y, o }) => (
  <Chip
    text={spam ? L.spam : L.ok}
    color={spam ? "pink" : "mint"}
    fs={38}
    x={x}
    y={y}
    style={{ opacity: o, scale: String(mix(0.6, 1, o)) }}
  />
);

const MsgRow: FC<{ text: string; y: number; o: number }> = ({ text, y, o }) => (
  <div
    style={{
      position: "absolute",
      left: 60,
      top: y,
      width: 720,
      padding: "18px 28px",
      fontSize: 38,
      background: "var(--paper)",
      border: "2.5px solid var(--ink)",
      borderRadius: "28px 28px 28px 8px",
      opacity: o,
      translate: `${mix(-30, 0, o)}px 0px`,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

// s5: learned word scores on a number line, staggered into rows so chips never overlap
const SCALE: { w: string; row: number }[] = [
  { w: "학교", row: 0 },
  { w: "급식", row: 1 },
  { w: "숙제", row: 0 },
  { w: "안내", row: 1 },
  { w: "무료", row: 0 },
  { w: "광고", row: 0 },
  { w: "쿠폰", row: 1 },
  { w: "당첨", row: 2 },
];
const LINE_Y = 700;
const M2X = rowLayout(words(L.m2).map((w) => chipWidth(w, 40)), 14);
const ROW_Y = [560, 770, 420];
const xOfWeight = (w: number) => 540 + w * 176;

const BOX: CSSProperties = {
  position: "absolute",
  height: 110,
  borderRadius: 18,
  border: "4px solid var(--ink)",
  display: "grid",
  placeItems: "center",
  fontSize: 42,
  fontWeight: 700,
  color: "var(--chip-ink)",
};

const SumRow: FC<{ text: string; y: number; frame: number; t: number }> = ({ text, y, frame, t }) => {
  const ws = words(text);
  const fs = 40;
  const widths = ws.map((w) => chipWidth(w, fs));
  const xs = rowLayout(widths, 14);
  const total = ws.reduce((a, w) => a + (WEIGHTS[w] ?? 0), 0);
  const spam = total > 0;
  return (
    <>
      {ws.map((w, i) => {
        const v = WEIGHTS[w] ?? 0;
        return (
          <div key={w + i}>
            <Chip text={w} color={v > 0 ? "pink" : v < 0 ? "mint" : null} fs={fs} x={xs[i]} y={y} style={{ opacity: beat(frame, S.s6, t + i * 0.12, 0.3) }} />
            <div
              style={{
                position: "absolute",
                left: xs[i],
                width: widths[i],
                top: y + 74,
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 32,
                color: v === 0 ? "var(--ink-3)" : "var(--ink)",
                opacity: beat(frame, S.s6, t + 1.0 + i * 0.12, 0.3),
              }}
            >
              {v > 0 ? `+${v.toFixed(1)}` : v < 0 ? `−${Math.abs(v).toFixed(1)}` : "0"}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: y + 140, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, opacity: beat(frame, S.s6, t + 1.9, 0.4) }}>
        <span style={{ fontSize: 40, fontWeight: 500 }}>
          {L.total} <span style={{ fontFamily: "var(--font-mono)" }}>{total > 0 ? "+" : "−"}{Math.abs(total).toFixed(1)}</span> →
        </span>
        <span
          style={{
            fontSize: 40,
            fontWeight: 500,
            padding: "4px 18px",
            borderRadius: 10,
            background: spam ? "var(--hl-pink)" : "var(--hl-mint)",
            color: "var(--chip-ink)",
            opacity: beat(frame, S.s6, t + 2.3, 0.3),
          }}
        >
          {spam ? L.spam : L.ok}
        </span>
      </div>
    </>
  );
};

export const Ch04Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const ruleOut = 1 - beat(frame, S.s4, 0, 0.5);
  const learnOut = 1 - beat(frame, S.s5, 0, 0.5);
  const scaleOut = 1 - beat(frame, S.s6, 0, 0.5);
  const sumOut = 1 - beat(frame, S.s7, 0, 0.5);
  const adds = [L.add1, L.add2, L.add3, L.add4];
  const addOn = adds.map((_, i) => beat(frame, S.s3, 2.8 + i * 0.55, 0.4));
  const ruleH = 176 + addOn.reduce((a, v) => a + v * 70, 0);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s3: a hand-written rule */}
      {frame < S.s4.from + 20 && (
        <div style={{ opacity: ruleOut }}>
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 110,
              width: 960,
              height: ruleH,
              padding: "20px 32px",
              borderRadius: 22,
              background: "var(--hl-orange)",
              color: "var(--chip-ink)",
              opacity: beat(frame, S.s1, 0.3, 0.5),
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 500, opacity: 0.75 }}>{L.ruleTitle}</div>
            <div style={{ fontSize: 46, fontWeight: 700, marginTop: 6 }}>{L.rule}</div>
            {adds.map((a, i) => (
              <div key={a} style={{ fontSize: 38, fontWeight: 500, marginTop: i === 0 ? 14 : 8, opacity: addOn[i] }}>
                {a}
              </div>
            ))}
          </div>
          <Hand x={720} y={128} fs={54} style={{ opacity: beat(frame, S.s3, 5.2, 0.4), rotate: "-4deg" }}>
            {L.endless}
          </Hand>

          <MsgRow text={L.m1} y={620} o={beat(frame, S.s2, 0.4, 0.4)} />
          <Verdict spam x={830} y={636} o={beat(frame, S.s2, 1.2, 0.3)} />
          <MsgRow text={L.m2} y={780} o={beat(frame, S.s2, 2.4, 0.4)} />
          <Verdict spam={false} x={830} y={796} o={beat(frame, S.s2, 3.2, 0.3)} />
          <Hand x={820} y={880} fs={46} style={{ opacity: beat(frame, S.s2, 4.0, 0.3) }}>
            {L.pass}
          </Hand>
          <MsgRow text={L.m3} y={960} o={beat(frame, S.s3, 0.4, 0.4)} />
          <Verdict spam x={830} y={976} o={beat(frame, S.s3, 1.2, 0.3)} />
          <Hand x={820} y={1064} fs={46} style={{ opacity: beat(frame, S.s3, 2.0, 0.3) }}>
            {L.blocked}
          </Hand>
        </div>
      )}

      {/* s4: show examples instead */}
      {frame >= S.s4.from && frame < S.s5.from + 20 && (
        <div style={{ opacity: learnOut }}>
          {[L.m1, L.m3, L.ex3, L.ex4, L.ex5].map((m, i) => {
            const spam = [true, false, true, false, true][i];
            const a = beat(frame, S.s4, 0.5 + i * 0.3, 0.4);
            return (
              <div
                key={m}
                style={{
                  position: "absolute",
                  left: 60 + i * 14,
                  top: 280 + i * 104,
                  width: 470,
                  padding: "14px 20px",
                  fontSize: 28,
                  background: "var(--paper)",
                  border: "2.5px solid var(--ink)",
                  borderRadius: 18,
                  rotate: `${(i % 2 ? 1 : -1) * 1.5}deg`,
                  opacity: a,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 24, padding: "2px 10px", borderRadius: 8, background: spam ? "var(--hl-pink)" : "var(--hl-mint)", color: "var(--chip-ink)" }}>
                  {spam ? L.spam : L.ok}
                </span>
                {m}
              </div>
            );
          })}
          <Hand x={90} y={830} fs={44} color="var(--ink-2)" style={{ opacity: beat(frame, S.s4, 2.2, 0.4) }}>
            {L.examples}
          </Hand>
          <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d="M 600 540 L 730 540"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - beat(frame, S.s4, 2.8, 0.5)}
              stroke="var(--ink)"
              strokeWidth={7}
              strokeLinecap="round"
              fill="none"
            />
            {beat(frame, S.s4, 3.2, 0.1) > 0 && <path d="M 712 522 L 732 540 L 712 558" stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
          </svg>
          <Hand x={606} y={470} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, S.s4, 3.0, 0.4) }}>
            {L.learn}
          </Hand>
          <div style={{ ...BOX, left: 760, top: 485, width: 260, background: "var(--hl-violet)", opacity: beat(frame, S.s4, 3.6, 0.4), scale: String(mix(0.7, 1, beat(frame, S.s4, 3.6, 0.4))) }}>
            {L.modelBox}
          </div>
          <Hand x={700} y={620} fs={44} style={{ opacity: beat(frame, S.s4, 4.6, 0.4), rotate: "-3deg" }}>
            {L.findRule}
          </Hand>
        </div>
      )}

      {/* s5: what the model learned */}
      {frame >= S.s5.from && frame < S.s6.from + 20 && (
        <div style={{ opacity: scaleOut }}>
          <div style={{ position: "absolute", left: 100, top: LINE_Y - 3, width: 880 * beat(frame, S.s5, 0.4, 0.8), height: 6, background: "var(--ink)", borderRadius: 3 }} />
          <div style={{ position: "absolute", left: 536, top: LINE_Y - 22, width: 8, height: 44, background: "var(--ink)", borderRadius: 4, opacity: beat(frame, S.s5, 0.8, 0.3) }} />
          <Hand x={90} y={LINE_Y + 200} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s5, 1.0, 0.4) }}>
            ← {L.scaleL}
          </Hand>
          <Hand x={800} y={LINE_Y + 200} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s5, 1.0, 0.4) }}>
            {L.scaleR} →
          </Hand>
          {SCALE.map((s, i) => {
            const v = WEIGHTS[s.w];
            const x = xOfWeight(v);
            const w = chipWidth(s.w, 38);
            const y = ROW_Y[s.row];
            const a = beat(frame, S.s5, 1.4 + i * 0.25, 0.4);
            const above = y < LINE_Y;
            return (
              <div key={s.w} style={{ opacity: a }}>
                <div
                  style={{
                    position: "absolute",
                    left: x - 2,
                    top: above ? y + 57 : LINE_Y,
                    width: 4,
                    height: above ? LINE_Y - y - 57 : y - LINE_Y,
                    background: "var(--ink-3)",
                  }}
                />
                <Chip text={s.w} color={v > 0 ? "pink" : "mint"} fs={38} x={x - w / 2} y={y} />
                <div style={{ position: "absolute", left: x - 60, width: 120, top: above ? y - 40 : y + 60, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28 }}>
                  {v > 0 ? `+${v.toFixed(1)}` : `−${Math.abs(v).toFixed(1)}`}
                </div>
              </div>
            );
          })}
          <Hand x={120} y={250} fs={50} style={{ opacity: beat(frame, S.s5, 4.6, 0.4), rotate: "-2deg" }}>
            {L.made}
          </Hand>
          <div style={{ position: "absolute", right: 60, top: 1010, fontSize: 28, color: "var(--ink-3)", opacity: beat(frame, S.s5, 5.2, 0.4) }}>* {L.example}</div>
        </div>
      )}

      {/* s6: add the scores up */}
      {frame >= S.s6.from && frame < S.s7.from + 20 && (
        <div style={{ opacity: sumOut }}>
          <div style={{ position: "absolute", left: 64, top: 150, fontSize: 32, color: "var(--ink-2)", opacity: beat(frame, S.s6, 0.4, 0.4) }}>{L.newMsg}</div>
          <SumRow text={L.m2} y={220} frame={frame} t={0.6} />
          <Hand x={M2X[1] - 10} y={150} fs={38} style={{ opacity: beat(frame, S.s6, 2.0, 0.4) }}>
            ↓ {L.unknown}
          </Hand>
          <SumRow text={L.m3} y={620} frame={frame} t={4.0} />
        </div>
      )}

      {/* s7: the flip */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          {[
            { label: L.rWay, y: 250, boxes: [L.input, L.rules, L.answer], colors: ["var(--hl-sky)", "var(--hl-orange)", "var(--hl-mint)"], t: 0.6 },
            { label: L.lWay, y: 640, boxes: [L.input, L.answer, L.model], colors: ["var(--hl-sky)", "var(--hl-mint)", "var(--hl-orange)"], t: 2.4 },
          ].map((row) => (
            <div key={row.label} style={{ opacity: beat(frame, S.s7, row.t, 0.5) }}>
              <div style={{ position: "absolute", left: 64, top: row.y - 70, fontSize: 40, fontWeight: 700 }}>{row.label}</div>
              {row.boxes.map((b, i) => {
                const x = [64, 330, 730][i];
                const w = i === 2 ? 290 : 210;
                return (
                  <div key={b + i}>
                    <div style={{ ...BOX, left: x, top: row.y, width: w, background: row.colors[i], fontSize: i === 2 && b.length > 3 ? 36 : 42 }}>{b}</div>
                    {i === 0 && <div style={{ position: "absolute", left: 284, top: row.y + 22, fontSize: 56, fontWeight: 700 }}>+</div>}
                    {i === 1 && <div style={{ position: "absolute", left: 590, top: row.y + 18, fontSize: 60, fontWeight: 700 }}>→</div>}
                  </div>
                );
              })}
            </div>
          ))}
          <Hand x={330} y={880} fs={48} style={{ opacity: beat(frame, S.s7, 4.4, 0.4), rotate: "-2deg" }}>
            <InlineCircle p={beat(frame, S.s7, 4.8, 0.6)}>{L.model}</InlineCircle>
            {L.dataMakes}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch04.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
