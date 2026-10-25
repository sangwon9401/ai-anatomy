import { useState } from "react";
import { MISSING } from "../../../../data/ch54";
import { BLOCK_ORDER, KIND, kindOf, type BlockKey, type BlockKind } from "../../../../data/part6-block";
import "../../../../playgrounds/part6/style.css";

const KINDS: BlockKind[] = ["att", "ffn", "add", "norm"];
const MISSION: Record<BlockKind, string> = {
  att: "拆掉注意力",
  ffn: "拆掉前馈网络",
  add: "拆掉相加（高速公路）",
  norm: "拆掉归一化",
};

/** 第 54 章: pull parts out of the block and read what breaks. */
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
        <span className="chip outline">我</span>
        <span className="chip outline">今天</span>
        <span className="chip outline">去</span>
        <span>↓ 3 个词向量</span>
      </div>
      <div className="p6-blk" role="group" aria-label="Transformer 模块的一层">
        <span className="p6-blk-title">Transformer 模块</span>
        <span className="p6-road" data-on={!out.some((o) => kindOf(o) === "add")} aria-hidden="true" />
        {BLOCK_ORDER.map((k) => {
          const kind = kindOf(k);
          const meta = KIND[kind];
          const isIn = !out.includes(k);
          if (kind === "add")
            return (
              <button key={k} className="p6-add" aria-pressed={isIn} onClick={() => toggle(k)} aria-label={`${meta.name}：${isIn ? "拆掉" : "装回去"}`}>
                <span className="plus">+</span>
                <span>{isIn ? `${meta.name}: ${meta.does}` : `${meta.name}被拆掉了`}</span>
              </button>
            );
          return (
            <button key={k} className="p6-part" data-kind={kind} aria-pressed={isIn} onClick={() => toggle(k)} aria-label={`${meta.name}：${isIn ? "拆掉" : "装回去"}`}>
              <span>
                <b>{meta.name}</b>
                {kind !== "norm" && <small>{isIn ? meta.does : "被拆掉了"}</small>}
                {kind === "norm" && !isIn && <small>被拆掉了</small>}
              </span>
              <span className="ref">{meta.where}</span>
            </button>
          );
        })}
      </div>
      <div className="p6-io">
        <span>↓ 形状相同的 3 个向量</span>
      </div>

      <div className="p6-diag" aria-live="polite">
        {missingKinds.length === 0 && <p className="ok">所有部件都在原位，模块运转正常。</p>}
        {missingKinds.map((k) => (
          <p key={k}>
            <b>没有{KIND[k].name}的话：</b> {MISSING[k]}
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
          全部装回去
        </button>
      </div>
      <p className="lab-tip">
        {allSeen ? "四种部件都在，模块才能正常运转。从第 55 章开始，我们一个个打开来看！" : "点一下部件，把它们一个个拆掉。再点一下就会装回原位。"}
      </p>
    </div>
  );
}
