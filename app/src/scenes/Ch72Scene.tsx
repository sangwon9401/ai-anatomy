import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { CONTINUE, QLIKE, READ, ch72 } from "../data/ch72";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, rowLayout, textWidth, type SceneProps } from "./kit";
import { Arrow, Bubble, Center, Machine, Mark, Note } from "./part8-kit";

const tl = buildTimeline(ch72);
const S = byId(tl);
const L = ch72.labels;

const MX = 290;
const MY = 300;
const MW = 500;
const MH = 190;

const RFS = 46;
const ROWS = [READ.slice(0, 3), READ.slice(3)];
const RX = ROWS.map((r) => rowLayout(r.map((w) => chipWidth(w, RFS)), 18));
const RCOL = ["sky", "mint", "violet", "yellow", "pink", "orange"] as const;

const QFS = 42;
const QW = textWidth(L.question, QFS) + QFS * 1.4 + 8;

const typed = (s: string, t: number) => {
  const cs = Array.from(s);
  return cs.slice(0, Math.round(cs.length * t)).join("");
};

// the output sheet: continuation lines (s3), later read as an exam paper (s4)
const LFS = 44;
const LINE_H = LFS * 1.55;

const QL_FS = 40;
const QL_X = rowLayout(QLIKE.map((w) => chipWidth(w, QL_FS)), 16);

const BAR_X = 150;
const BAR_W = 700;

export const Ch72Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const s1Out = 1 - beat(frame, S.s2, 0, 0.5);
  const machineOn = beat(frame, S.s1, 1.6, 0.6) * (1 - beat(frame, S.s4, 0, 0.6));
  const askOn = 1 - beat(frame, S.s4, 0, 0.6);
  const expectOut = 1 - beat(frame, S.s3, 0, 0.4);
  // s4: the sheet slides up and becomes an exam paper
  const lift = beat(frame, S.s4, 0.3, 1.0, EASE_IO);
  const examIn = beat(frame, S.s4, 1.1, 0.6);
  const sheetOut = 1 - beat(frame, S.s5, 0, 0.5);
  const s5Out = 1 - beat(frame, S.s6, 0, 0.5);
  const s6Out = 1 - beat(frame, S.s7, 0, 0.5);

  const sheetY = mix(580, 150, lift);
  const boxY = mix(400, MY, beat(frame, S.s2, 0, 0.8, EASE_IO));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: what the base model read */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1Out }}>
          {ROWS.map((row, r) =>
            row.map((w, i) => {
              const k = r * 3 + i;
              const a = beat(frame, S.s1, 0.2 + k * 0.18, 0.4);
              return <Chip key={w} text={w} color={RCOL[k]} fs={RFS} x={RX[r][i]} y={170 + r * 92} style={{ opacity: a, translate: `0px ${mix(-20, 0, a)}px` }} />;
            }),
          )}
          <Hand x={170} y={660} fs={54} style={{ opacity: beat(frame, S.s1, 2.8, 0.5) }}>
            {L.studied}
          </Hand>
          <Center y={760} fs={34} weight={400} color="var(--ink-2)" o={beat(frame, S.s1, 4.2, 0.5)}>
            {L.gpt3Read}
          </Center>
        </div>
      )}

      {/* the machine (s1–s3) */}
      {frame < S.s4.from + 20 && (
        <div style={{ opacity: machineOn }}>
          <Machine x={MX} y={boxY} w={MW} h={MH} fs={58}>
            {L.model}
            <span style={{ fontSize: 30, fontWeight: 500, color: "var(--ink-2)", marginTop: 6 }}>{L.modelEn}</span>
          </Machine>
          <Arrow x1={540} y1={340} x2={540} y2={392} p={beat(frame, S.s1, 1.4, 0.4) * s1Out} />
        </div>
      )}

      {/* s2–s3: ask a question */}
      {frame >= S.s2.from && frame < S.s4.from + 20 && (
        <div style={{ opacity: askOn }}>
          <Bubble side="user" x={1020 - QW} y={118} w={QW} fs={QFS} o={beat(frame, S.s2, 0.4, 0.5)}>
            {L.question}
          </Bubble>
          <Arrow x1={540} y1={212} x2={540} y2={MY - 8} p={beat(frame, S.s2, 1.2, 0.4)} />
          <Arrow x1={540} y1={MY + MH + 8} x2={540} y2={566} p={beat(frame, S.s2, 1.8, 0.4)} />

          {/* what we expect */}
          <div style={{ opacity: expectOut }}>
            <Bubble side="bot" x={330} y={580} w={chipWidth(L.expect, 42) + 40} fs={42} o={beat(frame, S.s2, 2.4, 0.5)} style={{ border: "3px dashed var(--ink-3)", background: "var(--paper)" }}>
              {L.expect}
            </Bubble>
            <Hand x={640} y={598} fs={46} style={{ opacity: beat(frame, S.s2, 3.2, 0.5) }}>
              {L.expectNote}
            </Hand>
          </div>
        </div>
      )}

      {/* s3–s4: what it actually writes, then read as an exam paper */}
      {frame >= S.s3.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: sheetOut }}>
          <div
            style={{
              position: "absolute",
              left: 120,
              top: sheetY,
              width: 840,
              padding: "22px 34px",
              background: "var(--paper)",
              border: "3px solid var(--ink)",
              borderRadius: 10,
              boxShadow: "10px 10px 0 var(--grid-major)",
              fontSize: LFS,
              lineHeight: 1.55,
              opacity: beat(frame, S.s3, 0.2, 0.4),
              boxSizing: "border-box",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ height: examIn * (LINE_H + 10), overflow: "hidden", opacity: examIn, fontWeight: 700 }}>{L.examTitle}</div>
            <div style={{ height: examIn * LINE_H, overflow: "hidden", opacity: examIn }}>
              <span style={{ color: "var(--ink-3)", marginRight: 12 }}>{L.n1}</span>
              <span style={{ background: "var(--hl-sky)", color: "var(--chip-ink)", borderRadius: 8, padding: "0 8px" }}>{L.question}</span>
            </div>
            {CONTINUE.map((line, i) => {
              const t = beat(frame, S.s3, 0.6 + i * 1.5, 1.2, (x) => x);
              return (
                <div key={line} style={{ height: LINE_H }}>
                  <span style={{ display: "inline-block", width: examIn * 52, overflow: "hidden", verticalAlign: "bottom", color: "var(--ink-3)", opacity: examIn }}>{[L.n2, L.n3, L.n4][i]}</span>
                  <span style={{ background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 8, padding: t > 0 ? "0 8px" : 0 }}>{typed(line, t)}</span>
                </div>
              );
            })}
            <div style={{ height: LINE_H, color: "var(--ink-3)", opacity: beat(frame, S.s3, 5.2, 0.3) }}>{L.dots}</div>
          </div>
          <div style={{ opacity: 1 - lift }}>
            <Hand x={560} y={950} fs={60} style={{ opacity: beat(frame, S.s3, 5.0, 0.4), rotate: "-3deg" }}>
              {L.huh}
            </Hand>
            <Note x={120} y={970} o={beat(frame, S.s3, 5.6, 0.4)}>
              * {L.example}
            </Note>
          </div>
          <div style={{ opacity: beat(frame, S.s4, 2.0, 0.5) }}>
            <Hand x={812} y={150 + 22 + LINE_H + 10 + 4} fs={40}>
              ← {L.mine}
            </Hand>
            <Hand x={380} y={640} fs={60} style={{ rotate: "-2deg" }}>
              {L.looks}
            </Hand>
          </div>
          <div style={{ opacity: beat(frame, S.s4, 3.6, 0.5) }}>
            <Center y={780} fs={40} weight={500} color="var(--ink-2)">
              {L.qlike}
            </Center>
            {QLIKE.map((w, i) => (
              <Chip key={w} text={w} color={null} fs={QL_FS} x={QL_X[i]} y={860} style={{ opacity: beat(frame, S.s4, 4.0 + i * 0.3, 0.4), border: "2px solid var(--ink-3)" }} />
            ))}
            <Note x={120} y={1000} o={beat(frame, S.s4, 4.0, 0.4)}>
              * {L.example}
            </Note>
          </div>
        </div>
      )}

      {/* s5: what it learned vs what we wanted */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5Out }}>
          {[
            { y: 210, head: L.learned, what: L.learnedWhat, color: "var(--hl-mint)", t: 0.4 },
            { y: 640, head: L.wanted, what: L.wantedWhat, color: "var(--hl-yellow)", t: 2.2 },
          ].map((c) => {
            const a = beat(frame, S.s5, c.t, 0.5);
            return (
              <div
                key={c.head}
                style={{
                  position: "absolute",
                  left: 140,
                  top: c.y,
                  width: 800,
                  padding: "26px 40px",
                  borderRadius: 22,
                  background: c.color,
                  color: "var(--chip-ink)",
                  opacity: a,
                  translate: `0px ${mix(20, 0, a)}px`,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: 34, fontWeight: 500, opacity: 0.8 }}>{c.head}</div>
                <div style={{ fontSize: 60, fontWeight: 700, marginTop: 6 }}>{c.what}</div>
              </div>
            );
          })}
          <Center y={448} fs={120} color="var(--pen)" o={beat(frame, S.s5, 3.4, 0.4)} style={{ lineHeight: 1 }}>
            {L.neq}
          </Center>
          <Hand x={300} y={890} fs={46} style={{ opacity: beat(frame, S.s5, 4.4, 0.5) }}>
            {L.ch2}
          </Hand>
        </div>
      )}

      {/* s6: the old trick */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6Out }}>
          <div
            style={{
              position: "absolute",
              left: 140,
              top: 140,
              width: 800,
              padding: "22px 34px",
              background: "var(--paper)",
              border: "3px solid var(--ink)",
              borderRadius: 10,
              boxShadow: "10px 10px 0 var(--grid-major)",
              fontSize: 42,
              lineHeight: 1.7,
              opacity: beat(frame, S.s6, 0.3, 0.4),
              boxSizing: "border-box",
              whiteSpace: "nowrap",
            }}
          >
            <div>
              <b style={{ color: "var(--pen)", marginRight: 14 }}>{L.qaQ}</b>
              {L.question}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <b style={{ color: "var(--pen)", opacity: beat(frame, S.s6, 1.0, 0.4) }}>{L.qaA}</b>
              <span style={{ position: "relative", display: "inline-block", width: 270, height: 60 }}>
                <span style={{ position: "absolute", inset: 0, border: "3px dashed var(--ink-3)", borderRadius: 12, opacity: beat(frame, S.s6, 1.2, 0.4) * (1 - beat(frame, S.s6, 5.2, 0.3)) }} />
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: 60,
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 10,
                    background: "var(--hl-mint)",
                    color: "var(--chip-ink)",
                    fontWeight: 500,
                    opacity: beat(frame, S.s6, 5.2, 0.4),
                    scale: String(mix(0.7, 1, beat(frame, S.s6, 5.2, 0.4))),
                  }}
                >
                  {L.qaFill}
                </span>
              </span>
            </div>
          </div>

          <Center y={430} fs={40} o={beat(frame, S.s6, 2.0, 0.4)}>
            {L.chanceTitle}
          </Center>
          {[
            { y: 520, name: L.plainRow, p: 0.08, v: L.p1, t: 2.6, color: "var(--grid-major)" },
            { y: 660, name: L.qaRow, p: 0.81, v: L.p2, t: 3.6, color: "var(--hl-mint)" },
          ].map((r) => {
            const g = beat(frame, S.s6, r.t + 0.3, 0.9);
            return (
              <div key={r.name} style={{ opacity: beat(frame, S.s6, r.t, 0.4) }}>
                <div style={{ position: "absolute", left: BAR_X, top: r.y, fontSize: 36, fontWeight: 500 }}>{r.name}</div>
                <div style={{ position: "absolute", left: BAR_X, top: r.y + 60, width: BAR_W, height: 44, borderRadius: 22, background: "var(--paper-2)" }} />
                <div style={{ position: "absolute", left: BAR_X, top: r.y + 60, width: Math.max(44, r.p * BAR_W) * g, height: 44, borderRadius: 22, background: r.color }} />
                <div style={{ position: "absolute", left: BAR_X + BAR_W + 20, top: r.y + 56, fontFamily: "var(--font-mono)", fontSize: 40, opacity: g }}>{r.v}</div>
              </div>
            );
          })}
          <Note x={0} w={1024} align="right" y={800} o={beat(frame, S.s6, 4.6, 0.4)}>
            * {L.example}
          </Note>
          <Hand x={150} y={880} fs={52} style={{ opacity: beat(frame, S.s6, 5.8, 0.5), rotate: "-2deg" }}>
            {L.trick}
          </Hand>
        </div>
      )}

      {/* s7: what Part 8 will do */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.3, 0.5) }}>
          <Machine x={70} y={300} w={400} h={200} fs={52}>
            {L.model}
          </Machine>
          {[
            { y: 540, name: L.smart, ok: true, t: 1.2 },
            { y: 620, name: L.listens, ok: false, t: 2.2 },
          ].map((r) => (
            <div key={r.name} style={{ opacity: beat(frame, S.s7, r.t, 0.4) }}>
              <div style={{ position: "absolute", left: 100, top: r.y, fontSize: 42, fontWeight: 500 }}>{r.name}</div>
              <Mark x={340} y={r.y - 2} size={60} ok={r.ok} p={beat(frame, S.s7, r.t + 0.3, 0.5)} />
            </div>
          ))}
          <Arrow x1={500} y1={400} x2={690} y2={400} p={beat(frame, S.s7, 3.4, 0.5)} width={7} />
          <Chip text={L.chatgpt} color="yellow" fs={58} x={710} y={357} style={{ opacity: beat(frame, S.s7, 3.8, 0.5), scale: String(mix(0.7, 1, beat(frame, S.s7, 3.8, 0.5))) }} />
          <Hand x={560} y={240} fs={46} style={{ opacity: beat(frame, S.s7, 4.4, 0.4) }}>
            {L.todo}
          </Hand>
          <Chip text={L.sft} color="violet" fs={40} x={540 - chipWidth(L.sft, 40) / 2} y={780} style={{ opacity: beat(frame, S.s7, 5.0, 0.4) }} />
          <Chip text={L.rlhf} color="pink" fs={40} x={540 - chipWidth(L.rlhf, 40) / 2} y={870} style={{ opacity: beat(frame, S.s7, 5.6, 0.4) }} />
        </div>
      )}

      <Narration tl={tl} chapter={ch72.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
