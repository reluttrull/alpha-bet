'use client'

import { Tile } from "@/models/tile";
import type { DragEvent } from 'react';
import LetterTile from "./letter-tile";

interface TilesInPlayProps {
  tiles: Tile[];
  onDrop: (event: DragEvent<HTMLDivElement>, group: string, index: number) => void;
}

export default function TilesInPlay({ tiles, onDrop }: TilesInPlayProps) {
  return (
    <div
      id="tiles-in-play"
      onDragOver={event => event.preventDefault()}
      onDrop={event => onDrop(event, 'tiles-in-play', tiles.length)}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 0, minHeight: '200px', minWidth: '200px', border: '2px solid blue' }}
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
