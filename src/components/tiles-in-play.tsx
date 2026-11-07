'use client'

import Tile from "./tile";

export default function TilesInPlay() {

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0 }}>
        <Tile url='/assets/tiles/a.png' index={1} />
        <Tile url='/assets/tiles/b.png' index={2} />
        <Tile url='/assets/tiles/c.png' index={3} />
        <Tile url='/assets/tiles/a.png' index={4} />
        <Tile url='/assets/tiles/b.png' index={5} />
        <Tile url='/assets/tiles/c.png' index={6} />
        <Tile url='/assets/tiles/a.png' index={7} />
        <Tile url='/assets/tiles/b.png' index={8} />
        <Tile url='/assets/tiles/c.png' index={9} />
        <Tile url='/assets/tiles/a.png' index={10} />
        <Tile url='/assets/tiles/b.png' index={11} />
        <Tile url='/assets/tiles/c.png' index={12} />
    </div>
  );
}
