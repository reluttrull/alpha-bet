'use client'

import { Tile } from "@/models/tile";
import LetterTile from "./letter-tile";
import { useDroppable } from "@dnd-kit/react";

interface WordBuilderProps {
  tiles: Tile[];
}

export default function WordBuilder({ tiles }: WordBuilderProps) {
  const { ref } = useDroppable({
    id: 'word-builder-dropzone',
    data: { group: 'word-builder' },
    disabled: tiles.length > 0,
  });

  return (
    <div ref={ref} id="word-builder"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, minHeight: '200px', minWidth: '200px', border: '2px solid red' }}>
      {tiles.map((tile, i) => (
        <LetterTile
          key={tile.index}
          id={tile.index}
          url={tile.url}
          index={i}
          group="word-builder"
        />
      ))}
    </div>
  );
}
