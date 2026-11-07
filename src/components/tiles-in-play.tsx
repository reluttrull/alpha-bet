'use client'

import { Tile } from "@/models/tile";
import LetterTile from "./letter-tile";
import { useDroppable } from "@dnd-kit/react";

interface TilesInPlayProps {
  tiles: Tile[];
}

export default function TilesInPlay({ tiles }: TilesInPlayProps) {
  const { ref } = useDroppable({
    id: 'tiles-in-play-dropzone',
    data: { group: 'tiles-in-play' },
    disabled: tiles.length > 0,
  });

  return (
    <div ref={ref} id="tiles-in-play" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', 
          gap: 0, minHeight: '200px', minWidth: '200px', border: '2px solid blue' }}>
      {tiles.map((tile, i) => (
        <LetterTile
          key={tile.index}
          id={tile.index}
          url={tile.url}
          index={i}
          group="tiles-in-play"
        />
      ))}
    </div>
  );
}
