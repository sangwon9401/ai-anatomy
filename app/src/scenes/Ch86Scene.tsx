import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { GRID, PATCH, PIC_N, PIC_PATHS, QUESTION_TOKENS, TEXT_TOKENS, ZOOM_PATCH, ch86 } from "../data/ch86";
import { Caption, Chip, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";
import { Arrow, Box, Bubble, CurveArrow, FullSvg, Line } from "./part10-kit";

const tl = buildTimeline(ch86);
const S = byId(tl);
const L = ch86.labels;

type Place = { x: number; y: number; s: number };
const COUNT = GRID * GRID;
const rc = (i: number) => ({ r: Math.floor(i / GRID), c: i % GRID });

// where each patch sits in each layout
const grid = (x0: number, y0: number, s: number, gap: number) => (i: number): Place => {
  const { r, c } = rc(i);
  return { x: x0 + c * (s + gap), y: y0 + r * (s + gap), s };
};
const L1 = grid(80, 200, 128, 0);
const L2 = grid(284, 150, 128, 0);
const L3 = grid(260, 150, 128, 16);
const STRIP_S = 104;
const STRIP_GAP = 12;
const STRIP_X = 540 - (8 * STRIP_S + 7 * STRIP_GAP) / 2;
const L5 = (i: number): Place => ({ x: STRIP_X + (i % 8) * (STRIP_S + STRIP_GAP), y: 240 + Math.floor(i / 8) * 190, s: STRIP_S });
const L7 = (i: number): Place => ({ x: 540 - (16 * 56 + 15 * 4) / 2 + i * 60, y: 296, s: 56 });
const lerp = (a: Place, b: Place, t: number): Place => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), s: mix(a.s, b.s, t) });

/** One patch of the picture, drawn by cropping the full picture with a viewBox (nested in a FullSvg). */
const PatchImg: FC<{ i: number; at: Place; o?: number }> = ({ i, at, o = 1 }) => {
  const { r, c } = rc(i);
  return (
    <svg x={at.x} y={at.y} width={at.s} height={at.s} viewBox={`${c * PATCH} ${r * PATCH} ${PATCH} ${PATCH}`} shapeRendering="crispEdges" opacity={o}>
      {PIC_PATHS.map((p) => (
        <path key={p.token} d={p.d} fill={p.token} />
      ))}
    </svg>
  );
};

const gridPath = (x0: number, y0: number, size: number, n: number) => {
  let d = "";
  for (let k = 0; k <= n; k++) {
    const t = (size * k) / n;
    d += `M ${x0 + t} ${y0} V ${y0 + size} M ${x0} ${y0 + t} H ${x0 + size} `;
  }
  return d;
};
const PIXEL_GRID = gridPath(284, 150, 512, PIC_N);
const BARS = Array.from({ length: 10 }, (_, i) => 26 + Math.abs(Math.sin(i * 2.1 + 0.7)) * 90);
const TEXT_W = TEXT_TOKENS.map((w) => chipWidth(w, 44));
const Q_W = QUESTION_TOKENS.map((w) => chipWidth(w, 44));

export const Ch86Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();

  const t12 = beat(frame, S.s2, 0, 1.0, EASE_IO);
  const t23 = beat(frame, S.s3, 1.8, 1.0, EASE_IO);
  const t57 = beat(frame, S.s7, 0.1, 0.9, EASE_IO);
  const fadeA = beat(frame, S.s4, 0, 0.5);
  const backB = beat(frame, S.s5, 0, 0.5);
  const outC = beat(frame, S.s6, 0, 0.5);
  const inD = beat(frame, S.s7, 0.1, 0.5);
  const patchO = frame < S.s5.from ? 1 - fadeA : frame < S.s6.from ? backB : frame < S.s7.from ? 1 - outC : inD;

  const place = (i: number): Place => {
    let p = lerp(lerp(L1(i), L2(i), t12), L3(i), t23);
    if (frame >= S.s5.from) p = lerp(L3(i), L5(i), beat(frame, S.s5, 0.4 + i * 0.07, 0.9, EASE_IO));
    if (frame >= S.s7.from) p = lerp(L5(i), L7(i), t57);
    return p;
  };
  const showPatches = frame < S.s6.from + 15 || frame >= S.s7.from;
  const zoomT = beat(frame, S.s4, 0.2, 0.9, EASE_IO);
  const zoomAt = lerp(L3(ZOOM_PATCH), { x: 80, y: 300, s: 400 }, zoomT);
  const zoomO = frame < S.s4.from ? 0 : 1 - backB;

  const s1On = 1 - beat(frame, S.s2, 0, 0.4);
  const s2On = beat(frame, S.s2, 0.8, 0.5) * (1 - beat(frame, S.s3, 0, 0.4));
  const cutLines = beat(frame, S.s3, 0.3, 0.8) * (1 - beat(frame, S.s3, 1.8, 0.4));
  const s3On = 1 - beat(frame, S.s4, 0, 0.4);
  const s4On = 1 - beat(frame, S.s5, 0, 0.4);
  const s5On = 1 - beat(frame, S.s6, 0, 0.4);
  const s6On = beat(frame, S.s6, 0.3, 0.5) * (1 - beat(frame, S.s7, 0, 0.4));

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* the picture, always drawn as 16 patches so it can come apart */}
      {showPatches && (
        <FullSvg>
          {Array.from({ length: COUNT }, (_, i) => (
            <PatchImg key={i} i={i} at={place(i)} o={i === ZOOM_PATCH && frame >= S.s4.from && frame < S.s5.from ? 0 : patchO} />
          ))}
          {frame >= S.s2.from && frame < S.s3.from + 15 && <path d={PIXEL_GRID} stroke="var(--ink)" strokeOpacity={0.28} strokeWidth={1} fill="none" opacity={beat(frame, S.s2, 1.2, 0.6) * (1 - beat(frame, S.s3, 0, 0.4))} />}
          {cutLines > 0 &&
            [1, 2, 3].map((k) => (
              <g key={k}>
                <line x1={284 + k * 128} y1={150} x2={284 + k * 128} y2={150 + 512 * beat(frame, S.s3, 0.3 + k * 0.12, 0.6)} stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" opacity={cutLines} />
                <line x1={284} y1={150 + k * 128} x2={284 + 512 * beat(frame, S.s3, 0.66 + k * 0.12, 0.6)} y2={150 + k * 128} stroke="var(--pen)" strokeWidth={6} strokeLinecap="round" opacity={cutLines} />
              </g>
            ))}
          {frame >= S.s4.from && frame < S.s5.from + 15 && (
            <g opacity={zoomO}>
              <PatchImg i={ZOOM_PATCH} at={zoomAt} />
              <path d={gridPath(zoomAt.x, zoomAt.y, zoomAt.s, PATCH)} stroke="var(--ink)" strokeOpacity={0.35} strokeWidth={1.5} fill="none" opacity={beat(frame, S.s4, 1.2, 0.5)} />
              <rect x={zoomAt.x} y={zoomAt.y} width={zoomAt.s} height={zoomAt.s} fill="none" stroke="var(--ink)" strokeWidth={5} />
            </g>
          )}
        </FullSvg>
      )}

      {/* s1: a model that reads tokens meets a picture */}
      {frame < S.s2.from + 15 && (
        <div style={{ opacity: s1On }}>
          <div style={{ position: "absolute", left: 640, top: 196, fontSize: 30, color: "var(--ink-3)", opacity: beat(frame, S.s1, 0.8, 0.4) }}>AI</div>
          <Bubble x={630} y={240} w={390} side="ai" fs={42} text={L.answer} o={beat(frame, S.s1, 0.9, 0.5)} />
          {TEXT_TOKENS.map((w, i) => (
            <Chip key={w} text={w} color="mint" fs={44} x={80 + TEXT_W.slice(0, i).reduce((a, b) => a + b + 14, 0)} y={856} style={{ opacity: beat(frame, S.s1, 2.0 + i * 0.2, 0.4) }} />
          ))}
          <Arrow x1={520} y1={889} x2={680} y2={889} p={beat(frame, S.s1, 2.8, 0.4)} />
          <Box x={700} y={810} w={300} h={160} label={L.model} fs={56} o={beat(frame, S.s1, 1.8, 0.5)} />
          <Hand x={80} y={990} fs={42} color="var(--ink-2)" style={{ opacity: beat(frame, S.s1, 3.2, 0.4) }}>
            {L.readsTokens}
          </Hand>
          <CurveArrow d="M 600 600 Q 760 640 840 800" end={[840, 800]} ang={Math.atan2(160, 80)} p={beat(frame, S.s1, 4.4, 0.7)} />
          <Hand x={690} y={530} fs={52} style={{ opacity: beat(frame, S.s1, 4.8, 0.4), rotate: "-4deg" }}>
            {L.how}
          </Hand>
        </div>
      )}

      {/* s2: thousands of pixels */}
      {frame >= S.s2.from && frame < S.s3.from + 15 && (
        <div style={{ opacity: s2On }}>
          <Line y={690} fs={50}>
            {L.pixels}
          </Line>
          <Line y={770} fs={40} weight={500} color="var(--ink-2)" o={beat(frame, S.s2, 2.2, 0.4)}>
            {L.onePer}
          </Line>
          {Array.from({ length: 102 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 100 + (i % 34) * 26,
                top: 840 + Math.floor(i / 34) * 26,
                width: 22,
                height: 22,
                borderRadius: 4,
                background: "var(--hl-sky)",
                border: "1.5px solid var(--ink-3)",
                boxSizing: "border-box",
                opacity: beat(frame, S.s2, 2.8 + i * 0.02, 0.1),
              }}
            />
          ))}
          <div style={{ position: "absolute", left: 700, width: 300, top: 926, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 34, opacity: beat(frame, S.s2, 5.0, 0.4) }}>{L.pixelsMore}</div>
          <Hand x={100} y={930} fs={48} style={{ opacity: beat(frame, S.s2, 5.4, 0.4), rotate: "-2deg" }}>
            {L.tooLong}
          </Hand>
        </div>
      )}

      {/* s3: cut into 16×16 patches */}
      {frame >= S.s3.from && frame < S.s4.from + 15 && (
        <div style={{ opacity: s3On }}>
          <PenCircle x={L3(13).x - 22} y={L3(13).y - 18} w={172} h={164} p={beat(frame, S.s3, 3.2, 0.6)} />
          <Hand x={L3(13).x + 30} y={752} fs={48} style={{ opacity: beat(frame, S.s3, 3.6, 0.4) }}>
            {L.cut}
          </Hand>
          <Chip text={L.count} color="yellow" fs={52} x={540 - chipWidth(L.count, 52) / 2} y={840} style={{ opacity: beat(frame, S.s3, 4.8, 0.4) }} />
        </div>
      )}

      {/* s4: one patch = 768 numbers = one vector */}
      {frame >= S.s4.from && frame < S.s5.from + 15 && (
        <div style={{ opacity: s4On }}>
          <Hand x={80} y={730} fs={44} color="var(--ink-2)" style={{ width: 400, textAlign: "center", opacity: beat(frame, S.s4, 1.4, 0.4) }}>
            {L.zoom}
          </Hand>
          <Line x={540} w={480} y={290} fs={46} o={beat(frame, S.s4, 1.4, 0.4)}>
            {L.px}
          </Line>
          <Line x={540} w={480} y={360} fs={38} weight={500} o={beat(frame, S.s4, 2.2, 0.4)}>
            {L.rgb}
          </Line>
          <Chip text={L.nums} color="yellow" fs={48} x={780 - chipWidth(L.nums, 48) / 2} y={430} style={{ opacity: beat(frame, S.s4, 3.0, 0.4) }} />
          <Arrow x1={780} y1={520} x2={780} y2={588} p={beat(frame, S.s4, 4.0, 0.4)} />
          <Box x={610} y={600} w={340} h={110} label={L.matmul} fs={40} color="var(--hl-violet)" o={beat(frame, S.s4, 4.2, 0.4)} />
          <Arrow x1={780} y1={722} x2={780} y2={790} p={beat(frame, S.s4, 5.0, 0.4)} />
          {BARS.map((h, i) => {
            const g = beat(frame, S.s4, 5.3 + i * 0.05, 0.4);
            return <div key={i} style={{ position: "absolute", left: 610 + i * 34, top: 920 - h * g, width: 26, height: h * g, borderRadius: "6px 6px 2px 2px", background: i % 2 ? "var(--hl-sky)" : "var(--hl-mint)" }} />;
          })}
          <Hand x={590} y={940} fs={44} style={{ opacity: beat(frame, S.s4, 6.2, 0.4) }}>
            {L.vec}
          </Hand>
        </div>
      )}

      {/* s5: patches in reading order, with positions */}
      {frame >= S.s5.from && frame < S.s6.from + 15 && (
        <div style={{ opacity: s5On }}>
          <Hand x={STRIP_X} y={166} fs={44} color="var(--ink-2)" style={{ opacity: beat(frame, S.s5, 1.0, 0.4) }}>
            {L.order}
          </Hand>
          {Array.from({ length: COUNT }, (_, i) => {
            const p = L5(i);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: p.x,
                  width: p.s,
                  top: p.y + p.s + 8,
                  height: 44,
                  borderRadius: 10,
                  background: "var(--hl-yellow)",
                  color: "var(--chip-ink)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 30,
                  opacity: beat(frame, S.s5, 2.6 + i * 0.06, 0.3),
                }}
              >
                {i + 1}
              </div>
            );
          })}
          <Hand x={620} y={636} fs={44} style={{ opacity: beat(frame, S.s5, 3.6, 0.4) }}>
            {L.pos}
          </Hand>
          {TEXT_TOKENS.map((w, i) => (
            <Chip key={w} text={w} color="mint" fs={44} x={STRIP_X + TEXT_W.slice(0, i).reduce((a, b) => a + b + 14, 0)} y={760} style={{ opacity: beat(frame, S.s5, 4.4 + i * 0.15, 0.4) }} />
          ))}
          <Hand x={STRIP_X} y={850} fs={46} style={{ opacity: beat(frame, S.s5, 5.0, 0.4) }}>
            {L.same}
          </Hand>
        </div>
      )}

      {/* s6: the 2020 paper */}
      {frame >= S.s6.from && frame < S.s7.from + 15 && (
        <div style={{ opacity: s6On }}>
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 220,
              width: 780,
              height: 420,
              borderRadius: 18,
              background: "var(--paper)",
              border: "4px solid var(--ink)",
              rotate: "-1.5deg",
              boxShadow: "12px 12px 0 var(--line)",
            }}
          >
            <div style={{ position: "absolute", left: 40, top: 34, fontSize: 32, color: "var(--ink-2)" }}>{L.year}</div>
            <div style={{ position: "absolute", left: 40, right: 40, top: 110, fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>
              {L.title1}
              <br />
              <span style={{ background: "var(--hl-yellow)", color: "var(--chip-ink)", padding: "0 10px", borderRadius: 10 }}>{L.title2}</span>
            </div>
            <Hand x={40} y={318} fs={52} style={{ opacity: beat(frame, S.s6, 2.2, 0.4) }}>
              {L.gloss}
            </Hand>
          </div>
          <Line y={730} fs={44} mono o={beat(frame, S.s6, 3.6, 0.4)} weight={500}>
            {L.vit}
          </Line>
          <Hand x={0} y={830} fs={44} color="var(--ink-2)" style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s6, 4.6, 0.4) }}>
            {L.real}
          </Hand>
        </div>
      )}

      {/* s7: picture tokens + text tokens in one line */}
      {frame >= S.s7.from && (
        <div style={{ opacity: inD }}>
          <Hand x={L7(0).x} y={236} fs={40} color="var(--ink-2)">
            {L.imgTok}
          </Hand>
          {QUESTION_TOKENS.map((w, i) => (
            <Chip key={w} text={w} color="mint" fs={44} x={L7(0).x + Q_W.slice(0, i).reduce((a, b) => a + b + 14, 0)} y={384} style={{ opacity: beat(frame, S.s7, 1.0 + i * 0.15, 0.4) }} />
          ))}
          <Hand x={L7(0).x + Q_W.reduce((a, b) => a + b + 14, 0) + 10} y={388} fs={40} color="var(--ink-2)" style={{ opacity: beat(frame, S.s7, 1.6, 0.4) }}>
            {L.txtTok}
          </Hand>
          <Arrow x1={540} y1={480} x2={540} y2={560} p={beat(frame, S.s7, 2.2, 0.4)} />
          <Box x={340} y={570} w={400} h={140} label={L.model} fs={56} o={beat(frame, S.s7, 2.4, 0.4)} />
          <Arrow x1={540} y1={722} x2={540} y2={790} p={beat(frame, S.s7, 3.2, 0.4)} />
          <Bubble x={345} y={800} w={390} side="ai" fs={42} text={L.answer} o={beat(frame, S.s7, 3.6, 0.5)} />
          <Hand x={0} y={960} fs={50} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 5.0, 0.4) }}>
            {L.multi}
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch86.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
