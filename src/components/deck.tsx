'use client'

interface DeckProps {
  numberRemaining: number;
  onDraw: () => void;
}

export default function Deck({ numberRemaining, onDraw }:DeckProps) {

  return (
    <div>
        <div>{numberRemaining} left in deck</div>
        <button onClick={onDraw}>Draw</button>
    </div>
  );
}
