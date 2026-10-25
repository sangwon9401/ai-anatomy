import { useState } from "react";
import { MISSING } from "../../data/ch54";
import { BLOCK_ORDER, KIND, kindOf, type BlockKey, type BlockKind } from "../../data/part6-block";
import "./style.css";
import { iga } from "./util";

const KINDS: BlockKind[] = ["att", "ffn", "add", "norm"];
const MISSION: Record<BlockKind, string> = {
  att: "어텐션 빼 보기",
  ffn: "피드포워드 빼 보기",
  add: "더하기(고속도로) 빼 보기",
  norm: "정규화 빼 보기",
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
        <span className="chip outline">나는</span>
        <span className="chip outline">오늘</span>
        <span className="chip outline">학교에</span>
        <span>↓ 단어 벡터 3개</span>
      </div>
      <div className="p6-blk" role="group" aria-label="트랜스포머 블록 한 층">
        <span className="p6-blk-title">트랜스포머 블록</span>
        <span className="p6-road" data-on={!out.some((o) => kindOf(o) === "add")} aria-hidden="true" />
        {BLOCK_ORDER.map((k) => {
          const kind = kindOf(k);
          const meta = KIND[kind];
          const isIn = !out.includes(k);
          if (kind === "add")
            return (
              <button key={k} className="p6-add" aria-pressed={isIn} onClick={() => toggle(k)} aria-label={`더하기 ${isIn ? "빼기" : "다시 끼우기"}`}>
                <span className="plus">+</span>
                <span>{isIn ? `${meta.name}: ${meta.does}` : "더하기가 빠졌어요"}</span>
              </button>
            );
          return (
            <button key={k} className="p6-part" data-kind={kind} aria-pressed={isIn} onClick={() => toggle(k)} aria-label={`${meta.name} ${isIn ? "빼기" : "다시 끼우기"}`}>
              <span>
                <b>{meta.name}</b>
                {kind !== "norm" && <small>{isIn ? meta.does : "빠졌어요"}</small>}
                {kind === "norm" && !isIn && <small>빠졌어요</small>}
              </span>
              <span className="ref">{meta.where}</span>
            </button>
          );
        })}
      </div>
      <div className="p6-io">
        <span>↓ 같은 모양의 벡터 3개</span>
      </div>

      <div className="p6-diag" aria-live="polite">
        {missingKinds.length === 0 && <p className="ok">모든 부품이 제자리에 있어요. 블록이 잘 돌아가요.</p>}
        {missingKinds.map((k) => (
          <p key={k}>
            <b>{iga(KIND[k].name)} 없으면:</b> {MISSING[k]}
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
          전부 다시 끼우기
        </button>
      </div>
      <p className="lab-tip">
        {allSeen ? "네 가지 부품이 다 있어야 블록이 제대로 돌아가요. 55장부터 하나씩 열어 볼게요!" : "부품을 눌러서 하나씩 빼 보세요. 다시 누르면 제자리로 돌아와요."}
      </p>
    </div>
  );
}
