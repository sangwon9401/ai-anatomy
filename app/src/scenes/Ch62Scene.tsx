import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { ch62, shuffled } from "../data/ch62";
import { BLOCK_ORDER, KIND, kindOf, type BlockKey } from "../data/part6-block";
import { Block, Blueprint, WordChip, blockGeo, blueprintGeo, partCenter, wordW } from "./part6-block";
import { Caption, Chip, EASE_IO, Hand, InlineCircle, Narration, Paper, Tag, beat, buildTimeline, byId, chipWidth, mix, type SceneProps } from "./kit";

const tl = buildTimeline(ch62);
const S = byId(tl);
const L = ch62.labels;
const G = blockGeo("full");
const BX = 100;
const BY = 230;

const CARD_FS = 36;
const CARD_H = CARD_FS * 1.5;
// where each part lies around in s1 (x, y, tilt)
const SCATTER: Record<BlockKey, [number, number, number]> = {
  norm1: [140, 330, -8],
  att: [600, 300, 6],
  add1: [380, 470, -4],
  norm2: [700, 560, 9],
  ffn: [180, 680, 5],
  add2: [560, 790, -7],
};
const TRAY = shuffled(BLOCK_ORDER, 5);
const TRAY_Y = (k: BlockKey) => 250 + TRAY.indexOf(k) * 92;
const FLY_AT = (i: number) => 1.2 + i * 1.0;

export const Ch62Scene: FC<SceneProps> = ({ captions, audio }) => {
  const frame = useCurrentFrame();
  const on12 = beat(frame, S.s1, 0.2, 0.5);
  const blockFrame = beat(frame, S.s2, 0.3, 0.6);
  const toTray = beat(frame, S.s2, 0.0, 0.8, EASE_IO);
  const blockOut = 1 - beat(frame, S.s4, 0, 0.6);
  const bpOn = beat(frame, S.s4, 0.2, 0.6);
  const dimNext = mix(1, 0.16, beat(frame, S.s7, 0.2, 0.6));

  const fill: Partial<Record<BlockKey, number>> = {};
  BLOCK_ORDER.forEach((k, i) => (fill[k] = frame >= S.s2.from ? beat(frame, S.s2, FLY_AT(i) + 0.6, 0.2) : 0));

  const BPG = blueprintGeo(176);

  return (
    <Paper>
      {captions && <Tag text={L.tag} />}

      {/* s1–s3: the block, assembled from the parts we collected */}
      {frame < S.s4.from + 20 && (
        <div style={{ opacity: on12 * blockOut }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 60, fontWeight: 700, opacity: 1 - blockFrame }}>{L.boss}</div>
          <Hand x={0} y={210} fs={44} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s1, 1.6, 0.4) * (1 - blockFrame) }}>
            {L.got}
          </Hand>
          {frame >= S.s2.from && (
            <div style={{ opacity: blockFrame }}>
              <Block x={BX} y={BY} fill={fill} layers={beat(frame, S.s3, 0.6, 1.2)} />
              <div style={{ position: "absolute", left: BX, top: 160, fontSize: 40, fontWeight: 700 }}>{L.oneLayer}</div>
            </div>
          )}
          {BLOCK_ORDER.map((k, i) => {
            const kind = kindOf(k);
            const meta = KIND[kind];
            const w = chipWidth(meta.name, CARD_FS);
            const [sx, sy, rot] = SCATTER[k];
            const a = beat(frame, S.s1, 0.4 + i * 0.25, 0.5);
            const tx = 1010 - w;
            const ty = TRAY_Y(k);
            const [pcx, pcy] = partCenter(G, k);
            const fly = frame >= S.s2.from ? beat(frame, S.s2, FLY_AT(i), 0.7, EASE_IO) : 0;
            const x = mix(mix(sx, tx, toTray), BX + pcx - w / 2, fly);
            const y = mix(mix(sy, ty, toTray), BY + pcy - CARD_H / 2, fly);
            const gone = fill[k] ?? 0;
            if (gone >= 1) return null;
            return (
              <Chip
                key={k}
                text={meta.name}
                color={meta.color}
                fs={CARD_FS}
                x={x}
                y={y}
                style={{ opacity: a * (1 - gone), rotate: `${mix(rot, 0, Math.max(toTray, fly))}deg`, boxShadow: "0 6px 0 var(--grid-major)", border: "3px solid var(--ink)" }}
              />
            );
          })}
          <Hand x={0} y={890} fs={38} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s2, 7.6, 0.4) * (1 - beat(frame, S.s3, 0, 0.3)) }}>
            {BLOCK_ORDER.map((k) => KIND[kindOf(k)].name).join(" → ")}
          </Hand>
          {/* s3: stack it */}
          <Hand x={820} y={BY + G.h - 120} fs={64} style={{ opacity: beat(frame, S.s3, 1.6, 0.4) }}>
            {L.layers}
          </Hand>
          <div style={{ opacity: beat(frame, S.s3, 3.0, 0.4) }}>
            <Chip text={L.road} color="orange" fs={34} x={540 - 16 - chipWidth(L.road, 34)} y={900} />
            <Chip text={L.norm} color="violet" fs={34} x={556} y={900} />
            <Hand x={0} y={970} fs={42} style={{ width: 1080, textAlign: "center" }}>
              {L.steady}
            </Hand>
          </div>
        </div>
      )}

      {/* s4–s7: the whole blueprint */}
      {frame >= S.s4.from && (
        <div style={{ opacity: bpOn * dimNext }}>
          {L.input.split(" ").map((w, i, arr) => (
            <WordChip key={w} text={w} x={230 + arr.slice(0, i).reduce((a, t) => a + wordW(t, 40) + 14, 0)} y={100} fs={40} o={beat(frame, S.s6, 0.4 + i * 0.15, 0.4)} />
          ))}
          <Blueprint
            y0={176}
            show={{
              tok: beat(frame, S.s4, 1.0, 0.5),
              emb: beat(frame, S.s4, 1.6, 0.5),
              pos: beat(frame, S.s4, 2.2, 0.5),
              block: 1,
              out: beat(frame, S.s5, 0.8, 0.5),
              loop: beat(frame, S.s5, 2.6, 0.5),
            }}
            layers={1}
          />
          <Hand x={870} y={BPG.block + 170} fs={48} style={{ opacity: bpOn }}>
            {L.layers}
          </Hand>
          <Chip text={L.output} color="mint" fs={40} x={540 - chipWidth(L.output, 40) / 2} y={BPG.bottom + 18} style={{ opacity: beat(frame, S.s6, 1.2, 0.4), scale: String(mix(0.6, 1, beat(frame, S.s6, 1.2, 0.4))) }} />
          <Hand x={52} y={BPG.block + 176} fs={56} style={{ opacity: beat(frame, S.s6, 2.4, 0.4), rotate: "-12deg" }}>
            <InlineCircle p={beat(frame, S.s6, 2.8, 0.7)} pad={18}>
              {L.done}
            </InlineCircle>
          </Hand>
        </div>
      )}

      {/* s7: what comes next */}
      {frame >= S.s7.from && (
        <div style={{ opacity: beat(frame, S.s7, 0.6, 0.6) }}>
          <div style={{ position: "absolute", left: 170, width: 740, top: 420, padding: "28px 34px", borderRadius: 24, background: "var(--hl-yellow)", color: "var(--chip-ink)", boxSizing: "border-box", boxShadow: "0 8px 0 var(--grid-major)" }}>
            <div style={{ fontSize: 52, fontWeight: 700 }}>{L.next}</div>
            <div style={{ fontSize: 36, marginTop: 10 }}>{L.nextSub}</div>
          </div>
          <Hand x={0} y={700} fs={52} style={{ width: 1080, textAlign: "center", opacity: beat(frame, S.s7, 1.8, 0.4), rotate: "-2deg" }}>
            <span style={{ background: "var(--paper)", padding: "0 16px", borderRadius: 10 }}>{L.mess}</span>
          </Hand>
        </div>
      )}

      <Narration tl={tl} chapter={ch62.id} audio={audio} />
      {captions && <Caption tl={tl} />}
    </Paper>
  );
};
