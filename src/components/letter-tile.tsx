'use client'

import { useId } from 'react';
import {useSortable} from '@dnd-kit/react/sortable';

interface LetterTileProps {
    url: string;
    index: number;
}

export default function LetterTile({ url, index }: LetterTileProps) {
  const {ref} = useSortable({
    id: useId(),
    index
  });

  return (
    <div ref={ref} key={`tile-${index}`}>
        <img src={url} />
    </div>
  );
}
