import { useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { BLOCK_CARDS, BLOCK_SLOTS, BP_CARDS, BP_SLOTS, DISTRACTOR_HINT, shuffled, type Card } from "../../../../data/ch62";
import { BLOCK_ORDER, KIND, kindOf } from "../../../../data/part6-block";
import "../../../../playgrounds/part6/style.css";
import { eunNeun } from "../../../../playgrounds/part6/util";

type Round = 1 | 2 | 3;
type Drag = { id: string; x0: number; y0: number; dx: number; dy: number; moving: boolean };

const ROUND = {
  1: { slots: BLOCK_SLOTS, cards: shuffled(BLOCK_CARDS, 11), done: "One block layer done!" },
  2: { slots: BP_SLOTS, cards: shuffled(BP_CARDS, 23), done: "Blueprint complete!" },
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

/** ch. 62 boss battle: build the block, then the whole blueprint. Drag a card onto a slot, or tap the card and then the slot. */
export function BossBuild() {
  const [round, setRound] = useState<Round>(1);
  const [placed, setPlaced] = useState<(string | null)[]>(() => BLOCK_SLOTS.map(() => null));
  const [picked, setPicked] = useState<string | null>(null);
  const [msg, setMsg] = useState("Drag a card onto an empty slot, or tap a card and then a slot.");
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
      setMsg("That slot is already filled. Try another empty slot.");
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
      setMsg(`Not slot ${slot + 1}. ${want.hint}`);
      return;
    }
    const next = placed.map((p, i) => (i === slot ? id : p));
    setPlaced(next);
    setPicked(null);
    setWrong(null);
    setMsg(next.every((p) => p !== null) ? live.done : `Nice! ${card.name}${eunNeun(card.name)} goes in slot ${slot + 1}.`);
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
    if (picked !== id) setMsg(`You picked the '${byId[id].name}' card. Now tap the slot to put it in.`);
  };
  const onSlotClick = (slot: number) => {
    if (picked) attempt(picked, slot);
    else if (placed[slot] === null) setMsg("First pick a card from below.");
  };

  const restart = () => {
    setRound(1);
    setPlaced(BLOCK_SLOTS.map(() => null));
    setPicked(null);
    setMistakes(0);
    setWrong(null);
    setMsg("Drag a card onto an empty slot, or tap a card and then a slot.");
  };
  const toRound2 = () => {
    setRound(2);
    setPlaced(BP_SLOTS.map(() => null));
    setPicked(null);
    setWrong(null);
    setMsg("Now the whole blueprint. Fill it in the order the text passes through.");
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
        aria-label={card ? `Slot ${i + 1}: ${card.name}` : `Empty slot ${i + 1}`}
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
      <p className="p6-label">{round === 1 ? "Step 1: one block layer" : round === 2 ? "Step 2: the whole GPT blueprint" : "The finished blueprint"}</p>
      {round === 1 ? (
        <div className="p6-blk p6-blk-slots" role="group" aria-label="Block slots">
          <span className="p6-blk-title">Transformer block</span>
          <span className="p6-road" aria-hidden="true" />
          {BLOCK_SLOTS.map((_, i) => slotView(i))}
        </div>
      ) : (
        <div className="p6-bp" role="group" aria-label="Blueprint slots">
          {BP_SLOTS.map((_, i) => slotView(i))}
        </div>
      )}

      {round !== 3 && !complete && (
        <div className="p6-tray" role="group" aria-label="Part cards">
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
        {round === 3 ? `From the tokenizer to pick and append, GPT's machine is complete! ${mistakes === 0 ? "Not a single mistake!" : `${mistakes} mistake${mistakes === 1 ? "" : "s"}.`}` : msg}
      </p>
      <div className="lab-actions">
        {round === 1 && complete && (
          <button className="btn" onClick={toRound2}>
            On to the blueprint ▶
          </button>
        )}
        {round === 2 && complete && (
          <button className="btn" onClick={() => setRound(3)}>
            See the finished blueprint ▶
          </button>
        )}
        <button className="btn ghost" onClick={restart}>
          Start over
        </button>
      </div>
    </div>
  );
}
