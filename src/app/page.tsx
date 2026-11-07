'use client'

import TilesInPlay from "@/components/tiles-in-play";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import distribution from "@/models/distribution.json";
import Deck from "@/components/deck";
import { Tile } from "@/models/tile";
import { seededShuffle } from "@/functions/shuffle";
import WordBuilder from "@/components/word-builder";

import { DragDropProvider, type DragEndEvent, type DragOverEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<boolean>(false);

  const [seed, setSeed] = useState<number | null>(12345);
  const [deck, setDeck] = useState<Tile[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [wordTiles, setWordTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState<number|null>(null);

  const handleButtonClick = () => {
    const builtWord = wordTiles.map(tile => tile.letter).join('');
    console.log('checking word', builtWord);

    const success = builtWord.length >= 2 && words.includes(builtWord);

    setResult(success);

    if (success) {
      let calculatedScore = 0;
      wordTiles.forEach((tile:Tile) => {
        calculatedScore += tile.points;
      });
      tiles.forEach((tile:Tile) => {
        calculatedScore -= tile.points;
      });

      setScore(calculatedScore);
    }
  };

  const handleDraw = () => {
    if (deck.length === 0) {
      setError('Deck is empty! Cannot draw.');
      return;
    }

    setTiles(prev => [...prev, deck[0]]);
    setDeck(prev => prev.slice(1));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { source } = event.operation;

    if (event.canceled || !source || !isSortable(source) || source.initialGroup !== 'word-builder' || source.group !== 'word-builder') return;

    const fromIndex = source.initialIndex;
    const toIndex = source.index;

    if (fromIndex === toIndex) return;

    setWordTiles(prev => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) {
        return prev;
      }

      const reordered = [...prev];
      const [movedTile] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, movedTile);
      return reordered;
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { source, target } = event.operation;

    if (!source || !target || !isSortable(source)) return;

    const tileId = source.id;
    const sourceContainer = source.group;
    const targetContainer = isSortable(target)
      ? target.group
      : target.data.group;

    if (typeof sourceContainer !== 'string' || typeof targetContainer !== 'string') return;
    if (sourceContainer === targetContainer) return;

    const sourceIsTiles = sourceContainer === 'tiles-in-play';
    const targetIsTiles = targetContainer === 'tiles-in-play';
    const sourceIsWord = sourceContainer === 'word-builder';
    const targetIsWord = targetContainer === 'word-builder';

    if (!(sourceIsTiles && targetIsWord) && !(sourceIsWord && targetIsTiles)) return;

    const sourceList = sourceIsTiles ? tiles : wordTiles;
    const movingTile = sourceList.find(tile => tile.index === tileId);

    if (!movingTile) return;

    if (sourceIsTiles) {
      setTiles(prev => prev.filter(tile => tile.index !== tileId));
      setWordTiles(prev => [...prev, movingTile]);
    } else {
      setWordTiles(prev => prev.filter(tile => tile.index !== tileId));
      setTiles(prev => [...prev, movingTile]);
    }
  };

  useEffect(() => {
    async function fetchWordData() {
      try {
        const response = await fetch('/data/enable1.txt');

        if (!response.ok) {
          throw new Error(`Failed to load words file: ${response.statusText}`);
        }

        const text = await response.text();
        setWords(text.split(/\r?\n/));
      } catch (err: any) {
        setError(err.message);
      }
    }

    const tilesToAdd: Tile[] = [];
    let index = 1;

    distribution.forEach(node => {
      for (let i = 0; i < node.frequency; i++) {
        tilesToAdd.push({ index, letter: node.letter, url: node.url, points: node.points });
        index++;
      }
    });

    setDeck(seededShuffle(tilesToAdd, seed));

    fetchWordData();
  }, []);

  return (
    <DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className={styles.page}>
        <WordBuilder tiles={wordTiles} />

        <button onClick={handleButtonClick}>Check</button>

        {result ? <>That's a word!</> : <>Not a word...</>}

        <div className={styles.horizontal}>
          <TilesInPlay tiles={tiles} />
          <Deck
            numberRemaining={deck.length}
            onDraw={handleDraw}
          />
        </div>
        {score && <div>Score: {score}</div>}
      </div>
    </DragDropProvider>
  );
}
