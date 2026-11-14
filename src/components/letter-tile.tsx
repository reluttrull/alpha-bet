'use client'

import type { DragEvent } from 'react';

interface LetterTileProps {
  url: string;
  index: number;
  id: number;
  group: string;
  onDrop: (event: DragEvent<HTMLDivElement>, group: string, index: number) => void;
}

export default function LetterTile({ url, index, id, group, onDrop }: LetterTileProps) {
  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', String(id));
    event.dataTransfer.setData('application/x-alpha-bet-group', group);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDrop(event, group, index);
  };

  return (
    <div draggable onDragStart={handleDragStart} onDragOver={event => event.preventDefault()} onDrop={handleDrop}>
      <img src={url} draggable={false} />
    </div>
  );
}