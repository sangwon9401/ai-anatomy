import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { AFTER, B0, NET_AFTER, ch23 } from "../data/ch23";
import { NET, STORE_A, num } from "../data/part2-toy";
import { Caption, EASE_IO, Hand, Narration, Paper, PenCircle, Tag, beat, buildTimeline, byId, type SceneProps } from "./kit";
import { Banner, FullSvg } from "./part2-kit";
import { EdgeLine, HID, HR, IN_TAG_T, InputBox, Node, OR, OUT, Particle, Tag2, inEdge, on, outEdge, type Seg } from "./part2-net";

const tl = buildTimeline(ch23);
const S = byId(tl);
const L = ch23.labels;

const NAMES = [L.spicy, L.line, L.price];
const LOSS_BOX = { x: 830, y: 770, w: 170, h: 96 };
const LOSS_EDGE: Seg = { x1: OUT[0], y1: OUT[1] + OR, x2: OUT[0], y2: LOSS_BOX.y };
const rev = (s: Seg): Seg => ({ x1: s.x2, y1: s.y2, x2: s.x1, y2: s.y1 });
const wTag = (w: number) => `×${num(w, 3)}`;
const gTag = (g: number) => (g === 0 ? "0" : num(g));
const PEN_TAG = { bg: "var(--paper)", color: "var(--pen)", border: "3px solid var(--pen)" };

export const Ch23Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const sAfter = (k: keyof typeof S) => frame >= S[k].from;
  const netO = beat(frame, S.s1, 0.2, 0.5);

  // what is revealed so far
  const outBlame = beat(frame, S.s3, 2.0, 0.4);
  const h1Blame = beat(frame, S.s4, 2.6, 0.4);
  const lineBlame = beat(frame, S.s5, 2.4, 0.4);
  const h2Gate = beat(frame, S.s6, 2.0, 0.4);
  const allBlame = beat(frame, S.s7, 0.8, 0.6);
  const upd = beat(frame, S.s8, 2.4, 0.6);
  const updated = upd > 0.5;
  const net = updated ? NET_AFTER : NET;
  const f = updated ? AFTER.f : B0.f;
  const loss = updated ? AFTER.loss : B0.loss;

  // backward particles (pen colour)
  type P = { x: number; y: number; o: number };
  const parts: P[] = [];
  const push = (s: Seg, t: number, o = 1) => {
    if (t > 0 && t < 1) {
      const [x, y] = on(s, t);
      parts.push({ x, y, o });
    }
  };
  if (sAfter("s3") && !sAfter("s4")) push(rev(LOSS_EDGE), beat(frame, S.s3, 0.8, 1.0, EASE_IO));
  if (sAfter("s4") && !sAfter("s5")) push(rev(outEdge(0)), beat(frame, S.s4, 1.0, 1.4, EASE_IO));
  if (sAfter("s5") && !sAfter("s6")) push(rev(inEdge(1, 0)), beat(frame, S.s5, 0.8, 1.4, EASE_IO));
  if (sAfter("s6") && !sAfter("s7")) push(rev(outEdge(1)), beat(frame, S.s6, 0.4, 1.4, EASE_IO));
  if (sAfter("s7") && !sAfter("s8")) {
    const t = beat(frame, S.s7, 0.2, 1.2, EASE_IO);
    for (let i = 0; i < 3; i++) push(rev(inEdge(i, 0)), t);
  }

  // edge widths follow |책임| once everything is known
  const gW1 = B0.dW1;
  const edgeW = (g: number) => 5 + Math.abs(g) * 0.75 * allBlame * (1 - upd);
  const edgeC = (g: number) => (allBlame > 0.3 && !updated && g !== 0 ? "var(--pen)" : "var(--ink)");

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      <div style={{ opacity: netO }}>
        {/* header */}
        {!sAfter("s3") && (
          <>
            <div style={{ position: "absolute", left: 64, top: 118, fontSize: 50, fontWeight: 700 }}>{L.title}</div>
            <Hand x={400} y={132} fs={34} color="var(--ink-3)">
              {L.example}
            </Hand>
          </>
        )}
        {sAfter("s3") && !sAfter("s7") && <Banner text={L.backward} y={116} fs={48} color="var(--hl-pink)" o={beat(frame, S.s3, 0.2, 0.4)} />}
        {sAfter("s7") && !sAfter("s8") && <Banner text={L.bp} y={116} fs={48} o={beat(frame, S.s7, 0.2, 0.4)} />}
        {sAfter("s8") && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 122, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700, opacity: beat(frame, S.s8, 0.3, 0.4) }}>
            {L.update}
          </div>
        )}
        {sAfter("s3") && !sAfter("s4") && (
          <Hand x={0} y={196} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s3, 2.6, 0.4) }}>
            {L.nudge}
          </Hand>
        )}
        {sAfter("s7") && !sAfter("s8") && (
          <Hand x={0} y={196} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 2.4, 0.4) }}>
            {L.all} {L.big}
          </Hand>
        )}

        <FullSvg>
          {[0, 1].map((j) =>
            [0, 1, 2].map((i) => {
              const zero = NET.W1[j][i] === 0;
              const g = gW1[j][i];
              const hot = (j === 0 && i === 1 && lineBlame > 0 && !sAfter("s7")) || (j === 0 && allBlame > 0.3 && !updated);
              return (
                <EdgeLine
                  key={`e${i}${j}`}
                  s={inEdge(i, j)}
                  p={beat(frame, S.s1, 0.4, 0.5)}
                  color={zero ? "var(--ink-3)" : hot ? "var(--pen)" : edgeC(g)}
                  dash={zero ? "10 10" : undefined}
                  w={zero ? 3 : hot && !sAfter("s7") ? 9 : edgeW(g)}
                />
              );
            }),
          )}
          {[0, 1].map((j) => (
            <EdgeLine key={`o${j}`} s={outEdge(j)} p={beat(frame, S.s1, 0.6, 0.5)} color={(j === 0 && h1Blame > 0 && !updated) ? "var(--pen)" : "var(--ink)"} w={j === 0 ? (h1Blame > 0 && !sAfter("s7") ? 9 : edgeW(B0.dv[0])) : 5} />
          ))}
          <EdgeLine s={LOSS_EDGE} p={beat(frame, S.s1, 1.6, 0.4)} color={outBlame > 0 && !updated ? "var(--pen)" : "var(--ink)"} w={outBlame > 0 && !updated ? 8 : 5} />
          {parts.map((p, k) => (
            <Particle key={k} x={p.x} y={p.y} o={p.o} color="var(--pen)" />
          ))}
        </FullSvg>

        {NAMES.map((n, i) => (
          <InputBox key={n} i={i} name={n} value={STORE_A.x[i]} o={beat(frame, S.s1, 0.2, 0.4)} />
        ))}

        {/* weight tags: weights, then 책임, then new weights */}
        {[0, 1].map((j) =>
          [0, 1, 2].map((i) => {
            if (NET.W1[j][i] === 0) return null;
            const [x, y] = on(inEdge(i, j), IN_TAG_T[j]);
            const showBlame = (j === 0 && i === 1 && lineBlame > 0 && !sAfter("s8")) || (allBlame > 0 && !updated);
            const q = sAfter("s2") && !sAfter("s3") ? beat(frame, S.s2, 0.6 + i * 0.2 + j * 0.6, 0.3) : 0;
            return (
              <div key={`w${i}${j}`}>
                {showBlame ? (
                  <Tag2 x={x} y={y} text={gTag(gW1[j][i])} {...PEN_TAG} fs={32} />
                ) : (
                  <Tag2 x={x} y={y} text={q > 0.5 ? "?" : wTag(net.W1[j][i])} bg={updated && net.W1[j][i] !== NET.W1[j][i] ? "var(--hl-mint)" : undefined} />
                )}
              </div>
            );
          }),
        )}
        {[0, 1].map((j) => {
          const [x, y] = on(outEdge(j), 0.5);
          const showBlame = allBlame > 0 && !updated;
          const q = sAfter("s2") && !sAfter("s3") ? beat(frame, S.s2, 1.4 + j * 0.2, 0.3) : 0;
          return showBlame ? (
            <Tag2 key={`v${j}`} x={x} y={y} text={gTag(B0.dv[j])} {...PEN_TAG} fs={32} />
          ) : (
            <Tag2 key={`v${j}`} x={x} y={y} text={q > 0.5 ? "?" : wTag(net.v[j])} bg={updated && net.v[j] !== NET.v[j] ? "var(--hl-mint)" : undefined} />
          );
        })}
        {sAfter("s4") && !sAfter("s5") && (
          (() => {
            const [x, y] = on(outEdge(0), 0.5);
            return <PenCircle x={x - 62} y={y - 40} w={124} h={80} p={beat(frame, S.s4, 2.0, 0.5)} />;
          })()
        )}

        {/* nodes */}
        <Node c={HID[0]} r={HR} fill="var(--hl-yellow)" label={L.h1} o={beat(frame, S.s1, 0.3, 0.4)}>
          {num(f.h[0], 2)}
        </Node>
        <Node c={HID[1]} r={HR} fill="var(--paper-2)" ink="var(--ink-3)" label={L.h2} o={beat(frame, S.s1, 0.3, 0.4)}>
          {num(f.h[1])}
        </Node>
        <Node c={OUT} r={OR} fill="var(--hl-mint)" label={L.out} o={beat(frame, S.s1, 0.5, 0.4)}>
          <span style={{ fontSize: updated ? 44 : 50 }}>{num(f.y, 1)}</span>
        </Node>
        <div
          style={{
            position: "absolute",
            left: LOSS_BOX.x,
            top: LOSS_BOX.y,
            width: LOSS_BOX.w,
            height: LOSS_BOX.h,
            borderRadius: 16,
            border: "5px solid var(--ink)",
            boxSizing: "border-box",
            background: updated ? "var(--hl-mint)" : "var(--hl-pink)",
            color: "var(--chip-ink)",
            display: "grid",
            placeItems: "center",
            lineHeight: 1.05,
            textAlign: "center",
            opacity: beat(frame, S.s1, 1.8, 0.4),
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 700 }}>{L.loss}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700 }}>{num(loss, 2)}</span>
        </div>
        <Hand x={LOSS_BOX.x - 10} y={LOSS_BOX.y + LOSS_BOX.h + 8} fs={38} style={{ opacity: beat(frame, S.s1, 2.4, 0.4) }}>
          {L.target}
        </Hand>

        {/* 책임 tags on the nodes */}
        <Tag2 x={OUT[0]} y={OUT[1] - OR - 86} text={`${L.blame} ${gTag(B0.dy)}`} {...PEN_TAG} fs={30} o={outBlame * (1 - upd)} style={{ fontFamily: "var(--font-sans)", width: 170, left: OUT[0] - 85 }} />
        <Tag2 x={HID[0][0]} y={HID[0][1] + HR + 34} text={`${L.blame} ${gTag(B0.dz[0])}`} {...PEN_TAG} fs={30} o={h1Blame * (1 - upd)} style={{ fontFamily: "var(--font-sans)", width: 170, left: HID[0][0] - 85 }} />
        <Hand x={752} y={294} fs={36} style={{ opacity: h2Gate * (1 - upd) }}>
          {L.off}
        </Hand>

        {/* s2: so many knobs */}
        {sAfter("s2") && !sAfter("s3") && (
          <div style={{ opacity: beat(frame, S.s2, 0.3, 0.4) }}>
            <div style={{ position: "absolute", left: 64, top: 940, display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ fontSize: 46, fontWeight: 700, background: "var(--hl-yellow)", color: "var(--chip-ink)", borderRadius: 12, padding: "2px 18px" }}>{L.knobs}</span>
              <span style={{ fontSize: 34, color: "var(--ink-2)" }}>{L.knobsSub}</span>
            </div>
            <Hand x={64} y={1016} fs={44} style={{ opacity: beat(frame, S.s2, 3.0, 0.4) }}>
              {L.gpt} → {L.oneByOne}
            </Hand>
          </div>
        )}

        {/* s5–s6: the chain, as a sum you can check */}
        {sAfter("s5") && !sAfter("s7") && (
          <div style={{ opacity: beat(frame, S.s5, 3.2, 0.5) }}>
            <div style={{ position: "absolute", left: 64, top: 930, fontSize: 36, fontWeight: 700 }}>{L.chainTitle}</div>
            <div style={{ position: "absolute", left: 64, top: 986, display: "flex", alignItems: "center", gap: 14, fontFamily: "var(--font-mono)", fontSize: 46, fontWeight: 700 }}>
              {[
                { t: "−2", c: "var(--hl-pink)" },
                { t: "1.5", c: "var(--hl-yellow)" },
                { t: "2", c: "var(--hl-sky)" },
              ].map((k, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: beat(frame, S.s5, 3.6 + i * 0.5, 0.3) }}>
                  {i > 0 && <span>×</span>}
                  <span style={{ background: k.c, color: "var(--chip-ink)", borderRadius: 10, padding: "0 12px" }}>{k.t}</span>
                </span>
              ))}
              <span style={{ opacity: beat(frame, S.s5, 5.2, 0.3) }}>
                = <span style={{ color: "var(--pen)" }}>−6</span>
              </span>
            </div>
          </div>
        )}

        {/* s8: before → after */}
        {sAfter("s8") && (
          <div style={{ opacity: beat(frame, S.s8, 3.2, 0.5) }}>
            <div style={{ position: "absolute", left: 64, top: 930, display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700 }}>
              <span style={{ color: "var(--ink-2)" }}>{L.before}</span>
              <span>→</span>
              <span style={{ background: "var(--hl-mint)", color: "var(--chip-ink)", borderRadius: 12, padding: "2px 14px" }}>{L.after}</span>
            </div>
            <Hand x={64} y={1010} fs={42} style={{ opacity: beat(frame, S.s8, 5.0, 0.4) }}>
              {L.year}
            </Hand>
          </div>
        )}
      </div>

      <Narration tl={tl} chapter={ch23.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};

