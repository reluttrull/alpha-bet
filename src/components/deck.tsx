'use client'

import styles from "@/app/page.module.css";

interface DeckProps {
  numberRemaining: number;
  onDraw: () => void;
}

export default function Deck({ numberRemaining, onDraw }:DeckProps) {

  return (
    <div>
        <div>{numberRemaining} left in deck</div>
        <button className={styles.btn} onClick={onDraw}>Draw</button>
    </div>
  );
}
