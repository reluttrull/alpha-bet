'use client'

import { Tile } from "@/models/tile";
import type { DragEvent } from 'react';
import styles from "@/app/page.module.css";
import LetterTile from "./letter-tile";

interface WordBuilderProps {
  tiles: Tile[];
  onDrop: (event: DragEvent<HTMLDivElement>, group: string, index: number) => void;
}

export default function WordBuilder({ tiles, onDrop }: WordBuilderProps) {
  return (
    <div
      id="word-builder"
      data-drop-group="word-builder"
      data-drop-index={tiles.length}
      onDragOver={event => event.preventDefault()}
      onDrop={event => onDrop(event, 'word-builder', tiles.length)}
      className={`${styles.wordBuilder} ${styles.tileArea}`}
    >
      {tiles.map((tile, i) => (
        <LetterTile
          key={tile.index}
          id={tile.index}
          url={tile.url}
          index={i}
          group="word-builder"
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}
