import { useState } from "react";
import { MISSING } from "../../../../data/ch54";
import { BLOCK_ORDER, KIND, kindOf, type BlockKey, type BlockKind } from "../../../../data/part6-block";
import "../../../../playgrounds/part6/style.css";
import { iga } from "../../../../playgrounds/part6/util";

const KINDS: BlockKind[] = ["att", "ffn", "add", "norm"];
const MISSION: Record<BlockKind, string> = {
  att: "アテンションを抜いてみる",
  ffn: "フィードフォワードを抜いてみる",
  add: "足し算（高速道路）を抜いてみる",
  norm: "正規化を抜いてみる",
};

/** 54장: pull parts out of the block and read what breaks. */
export function BlockLab() {
  const [out, setOut] = useState<BlockKey[]>([]);
  const [seen, setSeen] = useState<BlockKind[]>([]);
  const missingKinds = KINDS.filter((k) => out.some((o) => kindOf(o) === k));
  const allSeen = KINDS.every((k) => seen.includes(k));

  const toggle = (k: BlockKey) => {
    if (out.includes(k)) {
      setOut(out.filter((o) => o !== k));
    } else {
      setOut([...out, k]);
      if (!seen.includes(kindOf(k))) setSeen([...seen, kindOf(k)]);
    }
  };

  return (
    <div>
      <div className="p6-io">
        <span className="chip outline">私は</span>
        <span className="chip outline">今日</span>
        <span className="chip outline">学校に</span>
        <span>↓ 単語ベクトル3本</span>
      </div>
      <div className="p6-blk" role="group" aria-label="トランスフォーマーブロック1層">
        <span className="p6-blk-title">トランスフォーマーブロック</span>
        <span className="p6-road" data-on={!out.some((o) => kindOf(o) === "add")} aria-hidden="true" />
        {BLOCK_ORDER.map((k) => {
          const kind = kindOf(k);
          const meta = KIND[kind];
          const isIn = !out.includes(k);
          if (kind === "add")
            return (
              <button key={k} className="p6-add" aria-pressed={isIn} onClick={() => toggle(k)} aria-label={`足し算を${isIn ? "抜く" : "もとに戻す"}`}>
                <span className="plus">+</span>
                <span>{isIn ? `${meta.name}：${meta.does}` : "足し算が抜けています"}</span>
              </button>
            );
          return (
            <button key={k} className="p6-part" data-kind={kind} aria-pressed={isIn} onClick={() => toggle(k)} aria-label={`${meta.name}を${isIn ? "抜く" : "もとに戻す"}`}>
              <span>
                <b>{meta.name}</b>
                {kind !== "norm" && <small>{isIn ? meta.does : "抜けています"}</small>}
                {kind === "norm" && !isIn && <small>抜けています</small>}
              </span>
              <span className="ref">{meta.where}</span>
            </button>
          );
        })}
      </div>
      <div className="p6-io">
        <span>↓ 同じ形のベクトル3本</span>
      </div>

      <div className="p6-diag" aria-live="polite">
        {missingKinds.length === 0 && <p className="ok">全部の部品がそろっています。ブロックはちゃんと動きます。</p>}
        {missingKinds.map((k) => (
          <p key={k}>
            <b>{iga(KIND[k].name)}ないと：</b> {MISSING[k]}
          </p>
        ))}
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {KINDS.map((k) => (
          <li key={k} data-done={seen.includes(k)}>
            {seen.includes(k) ? "✓" : "○"} {MISSION[k]}
          </li>
        ))}
      </ul>
      <div className="lab-actions">
        <button className="btn ghost" disabled={out.length === 0} onClick={() => setOut([])}>
          全部もとに戻す
        </button>
      </div>
      <p className="lab-tip">
        {allSeen ? "4種類の部品が全部そろって、はじめてブロックはちゃんと動きます。第55章から1つずつ開けていきます！" : "部品を押して1つずつ抜いてみましょう。もう一度押すと元に戻ります。"}
      </p>
    </div>
  );
}
