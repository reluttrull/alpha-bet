'use client'

import { Tile } from "@/models/tile";
import type { DragEvent } from 'react';
import styles from "@/app/page.module.css";
import LetterTile from "./letter-tile";

interface TilesInPlayProps {
  tiles: Tile[];
  onDrop: (event: DragEvent<HTMLDivElement>, group: string, index: number) => void;
}

export default function TilesInPlay({ tiles, onDrop }: TilesInPlayProps) {
  return (
    <div
      id="tiles-in-play"
      data-drop-group="tiles-in-play"
      data-drop-index={tiles.length}
      onDragOver={event => event.preventDefault()}
      onDrop={event => onDrop(event, 'tiles-in-play', tiles.length)}
      className={`${styles.tilesInPlay} ${styles.tileArea}`}
    >
      {tiles.map((tile, i) => (
        <LetterTile
          key={tile.index}
          id={tile.index}
          url={tile.url}
          index={i}
          group="tiles-in-play"
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}
