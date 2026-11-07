'use client'

import { useSortable } from '@dnd-kit/react/sortable';

interface LetterTileProps {
  url: string;
  index: number;
  id: number;
  group: string;
}

export default function LetterTile({ url, index, id, group }: LetterTileProps) {
  const { ref } = useSortable({ id, index, group });

  return (
    <div ref={ref}>
      <img src={url} draggable={false} />
    </div>
  );
}