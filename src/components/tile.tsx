'use client'

import { useId } from 'react';
import {useSortable} from '@dnd-kit/react/sortable';

interface TileProps {
    url: string;
    index: number;
}

export default function Tile({ url, index }: TileProps) {
  const {ref} = useSortable({
    id: useId(),
    index
  });

  return (
    <div ref={ref}>
        <img src={url} />
    </div>
  );
}
