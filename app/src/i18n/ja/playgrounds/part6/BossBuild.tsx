import { useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { BLOCK_CARDS, BLOCK_SLOTS, BP_CARDS, BP_SLOTS, DISTRACTOR_HINT, shuffled, type Card } from "../../../../data/ch62";
import { BLOCK_ORDER, KIND, kindOf } from "../../../../data/part6-block";
import "../../../../playgrounds/part6/style.css";
import { eunNeun } from "../../../../playgrounds/part6/util";

type Round = 1 | 2 | 3;
type Drag = { id: string; x0: number; y0: number; dx: number; dy: number; moving: boolean };

const ROUND = {
  1: { slots: BLOCK_SLOTS, cards: shuffled(BLOCK_CARDS, 11), done: "ブロック1層の完成！" },
  2: { slots: BP_SLOTS, cards: shuffled(BP_CARDS, 23), done: "設計図の完成！" },
};

/** The six parts of the block, small, as they sit inside the finished blueprint. */
const MiniBlock = () => (
  <span className="p6-miniblock" aria-hidden="true">
    {BLOCK_ORDER.map((k) => (
      <span key={k} data-kind={kindOf(k)}>
        {KIND[kindOf(k)].name}
      </span>
    ))}
  </span>
);

/** 62장 보스전: build the block, then the whole blueprint. Drag a card onto a slot, or tap the card and then the slot. */
export function BossBuild() {
  const [round, setRound] = useState<Round>(1);
  const [placed, setPlaced] = useState<(string | null)[]>(() => BLOCK_SLOTS.map(() => null));
  const [picked, setPicked] = useState<string | null>(null);
  const [msg, setMsg] = useState("カードを空欄までドラッグするか、カードを押してから空欄を押してみましょう。");
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState<{ id: string; n: number } | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const justDragged = useRef(false);

  const live = round === 3 ? ROUND[2] : ROUND[round];
  const cards = live.cards;
  const byId = useMemo(() => Object.fromEntries([...BLOCK_CARDS, ...BP_CARDS].map((c) => [c.id, c])) as Record<string, Card>, []);
  const complete = round !== 3 && placed.every((p) => p !== null);

  const attempt = (id: string, slot: number) => {
    if (round === 3 || placed[slot] !== null) {
      setMsg("もう埋まっているマスです。ほかの空欄に置いてみましょう。");
      return;
    }
    const card = byId[id];
    const want = live.slots[slot];
    if (DISTRACTOR_HINT[card.kind]) {
      setMistakes((m) => m + 1);
      setWrong({ id, n: (wrong?.n ?? 0) + 1 });
      setMsg(DISTRACTOR_HINT[card.kind]);
      return;
    }
    if (card.kind !== want.kind) {
      setMistakes((m) => m + 1);
      setWrong({ id, n: (wrong?.n ?? 0) + 1 });
      setMsg(`${slot + 1}番のマスではありません。${want.hint}`);
      return;
    }
    const next = placed.map((p, i) => (i === slot ? id : p));
    setPlaced(next);
    setPicked(null);
    setWrong(null);
    setMsg(next.every((p) => p !== null) ? live.done : `いいですね！ ${card.name}${eunNeun(card.name)}${slot + 1}番のマスです。`);
  };

  const onDown = (e: RPointerEvent<HTMLButtonElement>, id: string) => {
    justDragged.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, moving: false });
  };
  const onMove = (e: RPointerEvent<HTMLButtonElement>) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0;
    const dy = e.clientY - drag.y0;
    setDrag({ ...drag, dx, dy, moving: drag.moving || Math.hypot(dx, dy) > 8 });
  };
  const onUp = (e: RPointerEvent<HTMLButtonElement>) => {
    if (!drag) return;
    if (drag.moving) {
      justDragged.current = true;
      const slotEl = document.elementsFromPoint(e.clientX, e.clientY).find((el) => (el as HTMLElement).dataset?.slot !== undefined) as HTMLElement | undefined;
      if (slotEl) attempt(drag.id, Number(slotEl.dataset.slot));
    }
    setDrag(null);
  };
  const onCardClick = (id: string) => {
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }
    setPicked(picked === id ? null : id);
    if (picked !== id) setMsg(`「${byId[id].name}」のカードを選びました。次に、入れる空欄を押してください。`);
  };
  const onSlotClick = (slot: number) => {
    if (picked) attempt(picked, slot);
    else if (placed[slot] === null) setMsg("先に、下からカードを1枚選んでください。");
  };

  const restart = () => {
    setRound(1);
    setPlaced(BLOCK_SLOTS.map(() => null));
    setPicked(null);
    setMistakes(0);
    setWrong(null);
    setMsg("カードを空欄までドラッグするか、カードを押してから空欄を押してみましょう。");
  };
  const toRound2 = () => {
    setRound(2);
    setPlaced(BP_SLOTS.map(() => null));
    setPicked(null);
    setWrong(null);
    setMsg("今度は設計図全体です。文章が通る順番にうめてみましょう。");
  };

  const slotView = (i: number) => {
    const id = round === 3 ? BP_CARDS.find((c) => c.kind === BP_SLOTS[i].kind)!.id : placed[i];
    const card = id ? byId[id] : null;
    const isBlock = (round === 2 || round === 3) && BP_SLOTS[i].kind === "block";
    return (
      <button
        key={i}
        className="p6-slot"
        data-slot={i}
        data-filled={!!card}
        data-color={card?.color ?? undefined}
        data-tall={isBlock || undefined}
        aria-label={card ? `${i + 1}番のマス：${card.name}` : `${i + 1}番の空欄`}
        onClick={() => onSlotClick(i)}
      >
        <span className="n">{i + 1}</span>
        <span className="name">{card ? card.name : "?"}</span>
        {card && isBlock && <MiniBlock />}
      </button>
    );
  };

  return (
    <div>
      <p className="p6-label">{round === 1 ? "ステップ1：ブロック1層" : round === 2 ? "ステップ2：GPTの設計図全体" : "完成した設計図"}</p>
      {round === 1 ? (
        <div className="p6-blk p6-blk-slots" role="group" aria-label="ブロックの空欄">
          <span className="p6-blk-title">トランスフォーマーブロック</span>
          <span className="p6-road" aria-hidden="true" />
          {BLOCK_SLOTS.map((_, i) => slotView(i))}
        </div>
      ) : (
        <div className="p6-bp" role="group" aria-label="設計図の空欄">
          {BP_SLOTS.map((_, i) => slotView(i))}
        </div>
      )}

      {round !== 3 && !complete && (
        <div className="p6-tray" role="group" aria-label="部品カード">
          {cards
            .filter((c) => !placed.includes(c.id))
            .map((c) => {
              const dragging = drag?.id === c.id && drag.moving;
              return (
                <button
                  key={c.id + (wrong?.id === c.id ? wrong.n : "")}
                  className="p6-card"
                  data-color={c.color ?? undefined}
                  aria-pressed={picked === c.id}
                  data-wrong={wrong?.id === c.id}
                  style={dragging ? { translate: `${drag.dx}px ${drag.dy}px`, zIndex: 5 } : undefined}
                  onPointerDown={(e) => onDown(e, c.id)}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={() => setDrag(null)}
                  onClick={() => onCardClick(c.id)}
                >
                  {c.name}
                </button>
              );
            })}
        </div>
      )}

      <p className="lab-tip" aria-live="polite">
        {round === 3 ? `トークナイザーから「選んでつなげる」まで、GPTの機械の部分が完成しました！ ${mistakes === 0 ? "一度もまちがえませんでした！" : `${mistakes}回まちがえました。`}` : msg}
      </p>
      <div className="lab-actions">
        {round === 1 && complete && (
          <button className="btn" onClick={toRound2}>
            設計図の組み立てへ ▶
          </button>
        )}
        {round === 2 && complete && (
          <button className="btn" onClick={() => setRound(3)}>
            完成した設計図を見る ▶
          </button>
        )}
        <button className="btn ghost" onClick={restart}>
          最初からもう一度
        </button>
      </div>
    </div>
  );
}
