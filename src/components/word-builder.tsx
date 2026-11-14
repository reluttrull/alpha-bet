'use client'

import { Tile } from "@/models/tile";
import type { DragEvent } from 'react';
import LetterTile from "./letter-tile";

interface WordBuilderProps {
  tiles: Tile[];
  onDrop: (event: DragEvent<HTMLDivElement>, group: string, index: number) => void;
}

export default function WordBuilder({ tiles, onDrop }: WordBuilderProps) {
  return (
    <div
      id="word-builder"
      onDragOver={event => event.preventDefault()}
      onDrop={event => onDrop(event, 'word-builder', tiles.length)}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, minHeight: '200px', minWidth: '200px', border: '2px solid red' }}
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
