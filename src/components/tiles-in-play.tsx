'use client'

import { Tile } from "@/models/tile";
import LetterTile from "./letter-tile";

interface TilesInPlayProps {
  tiles: Tile[];
}

export default function TilesInPlay({ tiles }: TilesInPlayProps) {

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0 }}>
      {tiles.map((tile:Tile) => <LetterTile url={tile.url} index={tile.index} />)}
    </div>
  );
}
