import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { RECIPE, SERVICES, ch78 } from "../data/ch78";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, textWidth, type SceneProps } from "./kit";
import { Arrow, Bubble, Center, Note } from "./part8-kit";

const tl = buildTimeline(ch78);
const S = byId(tl);
const L = ch78.labels;

const commas = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// s5 chart (days, plain scale)
const CH_X = 300;
const CH_W = 520;
const MAX_DAYS = Math.max(...SERVICES.map((s) => s.days));

const ASK_W = textWidth(L.ask, 36) + 36 * 1.4 + 8;

export const Ch78Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const s1Out = 1 - beat(frame, S.s2, 0, 0.5);
  const s2Out = 1 - beat(frame, S.s3, 0, 0.5);
  const s3Out = 1 - beat(frame, S.s4, 0, 0.5);
  const s4Out = 1 - beat(frame, S.s5, 0, 0.5);
  const s5Out = 1 - beat(frame, S.s6, 0, 0.5);
  const s6Out = 1 - beat(frame, S.s7, 0, 0.5);

  // s4: five days, users counting up to a million
  const days = beat(frame, S.s4, 0.6, 3.2, (x) => x);
  const users = 1e6 * (days < 1 ? Math.pow(days, 2.2) : 1);
  const dots = Math.round(users / 1e4);

  // s6: one cell (a million) grows into a 10×10 grid (a hundred million)
  const grid = beat(frame, S.s6, 1.4, 2.2, (x) => x);
  const cells = Math.max(1, Math.round(grid * 100));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1: the date */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1Out }}>
          <div
            style={{
              position: "absolute",
              left: 320,
              top: 150,
              width: 440,
              height: 470,
              borderRadius: 24,
              border: "4px solid var(--ink)",
              background: "var(--paper)",
              overflow: "hidden",
              opacity: beat(frame, S.s1, 0.2, 0.4),
              rotate: "-2deg",
              boxShadow: "12px 12px 0 var(--grid-major)",
            }}
          >
            <div style={{ height: 110, background: "var(--pen)", color: "var(--paper)", display: "grid", placeItems: "center", fontSize: 50, fontWeight: 700 }}>{L.month}</div>
            <div style={{ textAlign: "center", fontSize: 220, fontWeight: 700, lineHeight: 1.15, marginTop: 10 }}>{L.day}</div>
            <div style={{ textAlign: "center", fontSize: 44, color: "var(--ink-2)" }}>{L.weekday}</div>
          </div>
          <Chip text={L.launch} color="yellow" fs={64} x={540 - chipWidth(L.launch, 64) / 2} y={690} style={{ opacity: beat(frame, S.s1, 1.4, 0.4), scale: String(mix(0.7, 1, beat(frame, S.s1, 1.4, 0.4))) }} />
          <Hand x={330} y={830} fs={56} style={{ opacity: beat(frame, S.s1, 3.4, 0.4), rotate: "-2deg" }}>
            {L.preview}
          </Hand>
        </div>
      )}

      {/* s2: what was inside */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2Out }}>
          {RECIPE.map((r, i) => {
            const a = beat(frame, S.s2, 0.4 + i * 1.0, 0.5);
            return (
              <div
                key={r.name}
                style={{
                  position: "absolute",
                  left: 170,
                  top: 150 + i * 170,
                  width: 740,
                  padding: "20px 34px",
                  borderRadius: 20,
                  background: `var(--hl-${r.color})`,
                  color: "var(--chip-ink)",
                  opacity: a,
                  translate: `0px ${mix(20, 0, a)}px`,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: 46, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 32, marginTop: 4 }}>{r.sub}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", opacity: beat(frame, S.s2, 3.6, 0.5), scale: String(mix(0.7, 1, beat(frame, S.s2, 3.6, 0.5))) }}>
            <span style={{ fontSize: 84, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 18, padding: "4px 34px" }}>{L.equals}</span>
          </div>
          <Note x={0} w={1080} align="center" y={880} o={beat(frame, S.s2, 4.6, 0.4)}>
            {L.sameWay}
          </Note>
        </div>
      )}

      {/* s3: just talk to it */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3Out }}>
          <div style={{ position: "absolute", left: 230, top: 130, width: 620, height: 760, borderRadius: 40, border: "5px solid var(--ink)", background: "var(--paper)", opacity: beat(frame, S.s3, 0.2, 0.4), boxSizing: "border-box" }}>
            <div style={{ height: 96, borderBottom: "3px solid var(--line)", display: "grid", placeItems: "center", fontSize: 40, fontWeight: 700 }}>{L.appName}</div>
          </div>
          <Bubble side="user" x={820 - ASK_W} y={280} w={ASK_W} fs={36} o={beat(frame, S.s3, 0.8, 0.4)}>
            {L.ask}
          </Bubble>
          <Bubble side="bot" x={260} y={400} w={480} fs={36} o={beat(frame, S.s3, 1.8, 0.4)}>
            {L.reply}
          </Bubble>
          <div style={{ position: "absolute", left: 260, top: 790, width: 560, height: 74, borderRadius: 37, border: "3px solid var(--line)", background: "var(--paper-2)", opacity: beat(frame, S.s3, 0.4, 0.4), boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 30, top: 14, fontSize: 32, color: "var(--ink-3)" }}>{L.input}</div>
            <div style={{ position: "absolute", right: 8, top: 7, width: 54, height: 54, borderRadius: 27, background: "var(--ink)", color: "var(--paper)", display: "grid", placeItems: "center", fontSize: 34, fontWeight: 700 }}>{L.send}</div>
          </div>
          <Hand x={560} y={920} fs={60} style={{ opacity: beat(frame, S.s3, 3.2, 0.4), rotate: "-3deg" }}>
            {L.justTalk}
          </Hand>
        </div>
      )}

      {/* s4: five days to a million */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4Out }}>
          {Array.from({ length: 5 }, (_, i) => {
            const on = days * 5 > i;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 135 + i * 170,
                  top: 140,
                  width: 140,
                  height: 100,
                  borderRadius: 16,
                  border: "3px solid var(--ink)",
                  background: on ? "var(--hl-yellow)" : "var(--paper)",
                  color: on ? "var(--chip-ink)" : "var(--ink)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 36,
                  fontWeight: 700,
                  opacity: beat(frame, S.s4, 0.2 + i * 0.05, 0.3),
                }}
              >
                {i + 1}
                {L.dayN}
              </div>
            );
          })}
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 300 + (i % 10) * 50,
                top: 300 + Math.floor(i / 10) * 50,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: i < dots ? "var(--hl-sky)" : "var(--grid-major)",
                opacity: beat(frame, S.s4, 0.4, 0.3),
              }}
            />
          ))}
          <div style={{ position: "absolute", left: 300, width: 500, top: 810, textAlign: "right", fontSize: 30, color: "var(--ink-2)", opacity: beat(frame, S.s4, 0.6, 0.3) }}>{L.dot}</div>
          <Center y={870} fs={72} style={{ fontFamily: "var(--font-mono)" }} o={beat(frame, S.s4, 0.6, 0.3) * (1 - beat(frame, S.s4, 4.0, 0.3))}>
            {commas(users)}
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 50 }}>{L.users}</span>
          </Center>
          <Center y={870} fs={72} o={beat(frame, S.s4, 4.0, 0.4)}>
            {L.million}
          </Center>
        </div>
      )}

      {/* s5: compared with other services */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5Out }}>
          <Center y={140} fs={48} o={beat(frame, S.s5, 0.2, 0.4)}>
            {L.chartTitle}
          </Center>
          {SERVICES.map((s, i) => {
            const y = 270 + i * 130;
            const g = beat(frame, S.s5, 0.8 + i * 0.4, 0.9, EASE_IO);
            const w = Math.max(8, (s.days / MAX_DAYS) * CH_W) * g;
            const me = s.name === "ChatGPT";
            return (
              <div key={s.name} style={{ opacity: beat(frame, S.s5, 0.6 + i * 0.4, 0.3) }}>
                <div style={{ position: "absolute", left: 60, width: 220, top: y + 6, textAlign: "right", fontSize: 40, fontWeight: me ? 700 : 500 }}>{s.name}</div>
                <div style={{ position: "absolute", left: CH_X, top: y, width: w, height: 64, borderRadius: 10, background: me ? "var(--pen)" : "var(--hl-sky)" }} />
                <div style={{ position: "absolute", left: CH_X + w + 16, top: y + 8, fontSize: 38, fontWeight: me ? 700 : 400, opacity: g, whiteSpace: "nowrap" }}>{s.label}</div>
              </div>
            );
          })}
          <PenCircle x={CH_X - 12} y={270 + 4 * 130 - 22} w={150} h={108} p={beat(frame, S.s5, 3.6, 0.6)} />
          <Hand x={CH_X + 170} y={270 + 4 * 130 - 4} fs={64} style={{ opacity: beat(frame, S.s5, 4.0, 0.4), rotate: "-4deg" }}>
            {L.wow}
          </Hand>
          <Note x={60} w={960} y={950} o={beat(frame, S.s5, 4.6, 0.4)}>
            {L.estimate}
          </Note>
        </div>
      )}

      {/* s6: about a hundred million a month */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6Out }}>
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 300 + (i % 10) * 48,
                top: 150 + Math.floor(i / 10) * 48,
                width: 42,
                height: 42,
                borderRadius: 6,
                background: i === 0 ? "var(--pen)" : "var(--hl-sky)",
                opacity: i < cells ? (i === 0 ? beat(frame, S.s6, 0.3, 0.4) : 1) : 0,
              }}
            />
          ))}
          <Hand x={20} y={146} fs={36} style={{ opacity: beat(frame, S.s6, 0.6, 0.4), width: 270, textAlign: "right" }}>
            {L.m1}
          </Hand>
          <Hand x={790} y={520} fs={40} style={{ opacity: beat(frame, S.s6, 3.6, 0.4), whiteSpace: "pre-line", lineHeight: 1.3 }}>
            {L.m100}
          </Hand>
          <div style={{ position: "absolute", left: 300, width: 474, top: 640, textAlign: "right", fontSize: 30, color: "var(--ink-2)", opacity: beat(frame, S.s6, 1.0, 0.4) }}>{L.cell}</div>
          <Center y={740} fs={54} o={beat(frame, S.s6, 4.0, 0.4)}>
            {L.monthly}
          </Center>
          <Hand x={260} y={850} fs={48} style={{ opacity: beat(frame, S.s6, 5.4, 0.4), rotate: "-2deg" }}>
            {L.fastest}
          </Hand>
        </div>
      )}

      {/* s7: problems showed up too */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.2, 0.5) }}>
          <Center y={150} fs={50}>
            {L.problems}
          </Center>
          {[
            { t: L.wrong, c: "orange" as const, y: 280, at: 0.8 },
            { t: L.danger, c: "pink" as const, y: 420, at: 2.6 },
          ].map((r) => (
            <Chip key={r.t} text={r.t} color={r.c} fs={52} x={540 - chipWidth(r.t, 52) / 2} y={r.y} style={{ opacity: beat(frame, S.s7, r.at, 0.4), scale: String(mix(0.7, 1, beat(frame, S.s7, r.at, 0.4))) }} />
          ))}
          <Arrow x1={540} y1={540} x2={540} y2={650} p={beat(frame, S.s7, 4.4, 0.4)} width={7} />
          <Chip text={L.safety} color="mint" fs={64} x={540 - chipWidth(L.safety, 64) / 2} y={680} style={{ opacity: beat(frame, S.s7, 5.0, 0.4), scale: String(mix(0.7, 1, beat(frame, S.s7, 5.0, 0.4))) }} />
          <Chip text={L.next} color="yellow" fs={44} x={540 - chipWidth(L.next, 44) / 2} y={830} style={{ opacity: beat(frame, S.s7, 6.0, 0.4) }} />
        </div>
      )}

      <Narration tl={tl} chapter={ch78.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
