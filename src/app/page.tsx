'use client'

import TilesInPlay from "@/components/tiles-in-play";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import distribution from "@/models/distribution.json";
import Deck from "@/components/deck";
import { Tile } from "@/models/tile";
import { seededShuffle } from "@/functions/shuffle";
import WordBuilder from "@/components/word-builder";

import type { DragEvent, PointerEvent as ReactPointerEvent } from "react";

export default function Home() {
  const touchDrag = useRef<{ pointerId: number; tileId: number; sourceGroup: string } | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<boolean|null>(null);

  const [seed, setSeed] = useState<number | null>(null);
  //const [seed, setSeed] = useState<number | null>(12345);
  const [deck, setDeck] = useState<Tile[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [wordTiles, setWordTiles] = useState<Tile[]>([]);
  const [turns, setTurns] = useState<number>(5);
  const [score, setScore] = useState<number|null>(null);

  const handleButtonClick = () => {
    const builtWord = wordTiles.map(tile => tile.letter).join('');
    console.log('checking word', builtWord);

    const success = isWord(builtWord);

    setResult(success);

    if (success) {
      setScore(prev => (prev ?? 0) + currentScore());
      setWordTiles([]);
      setTurns(prev => prev - 1);
      setResult(null);
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

  const handleShuffleHand = () => {
    setTiles(seededShuffle(tiles, seed));
  }

  const handleReturnToHand = () => {
    const tilesToMove = wordTiles;
    setTiles([...tiles, ...tilesToMove]);
    setWordTiles([]);
  }

  const moveTile = (tileId: number, sourceGroup: string, targetGroup: string, targetIndex: number) => {
    if (!Number.isInteger(tileId)) return;
    if (!['tiles-in-play', 'word-builder'].includes(sourceGroup) || !['tiles-in-play', 'word-builder'].includes(targetGroup)) return;

    const sourceList = sourceGroup === 'tiles-in-play' ? tiles : wordTiles;
    const movingTileIndex = sourceList.findIndex(tile => tile.index === tileId);

    if (movingTileIndex < 0) return;

    if (sourceGroup === targetGroup) {
      const updateTiles = (prev: Tile[]) => {
        const reordered = [...prev];
        const [movingTile] = reordered.splice(movingTileIndex, 1);
        const insertionIndex = movingTileIndex < targetIndex ? targetIndex - 1 : targetIndex;
        reordered.splice(Math.max(0, Math.min(insertionIndex, reordered.length)), 0, movingTile);
        return reordered;
      };

      if (sourceGroup === 'tiles-in-play') {
        setTiles(updateTiles);
      } else {
        setWordTiles(updateTiles);
      }
      return;
    }

    const movingTile = sourceList[movingTileIndex];
    const insertTile = (prev: Tile[]) => {
      const next = [...prev];
      next.splice(Math.max(0, Math.min(targetIndex, next.length)), 0, movingTile);
      return next;
    };

    if (sourceGroup === 'tiles-in-play') {
      setTiles(prev => prev.filter(tile => tile.index !== tileId));
      setWordTiles(insertTile);
    } else {
      setWordTiles(prev => prev.filter(tile => tile.index !== tileId));
      setTiles(insertTile);
    }
  };

  const handleTileDrop = (event: DragEvent<HTMLDivElement>, targetGroup: string, targetIndex: number) => {
    event.preventDefault();
    const tileId = Number(event.dataTransfer.getData('text/plain'));
    const sourceGroup = event.dataTransfer.getData('application/x-alpha-bet-group');
    moveTile(tileId, sourceGroup, targetGroup, targetIndex);
  };

  const handleTouchStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch' || !(event.target instanceof Element)) return;
    const tile = event.target.closest<HTMLElement>('[data-tile-id]');
    if (!tile) return;

    touchDrag.current = {
      pointerId: event.pointerId,
      tileId: Number(tile.dataset.tileId),
      sourceGroup: tile.dataset.dropGroup ?? '',
    };
  };

  const handleTouchEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch' || !touchDrag.current || event.pointerId !== touchDrag.current.pointerId) return;
    const movingTile = touchDrag.current;
    touchDrag.current = null;

    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-drop-group]');
    if (!target) return;

    const targetIndex = Number(target.dataset.dropIndex);
    moveTile(movingTile.tileId, movingTile.sourceGroup, target.dataset.dropGroup ?? '', targetIndex);
  };

  const handleTouchCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' && event.pointerId === touchDrag.current?.pointerId) {
      touchDrag.current = null;
    }
  };

  const isWord = (wordToCheck:string) => {
    return wordToCheck.length >= 2 && words.includes(wordToCheck);
  }

  const currentScore = () => {
      let calculatedScore = 0;
      wordTiles.forEach((tile:Tile) => {
        calculatedScore += tile.points;
      });
      tiles.forEach((tile:Tile) => {
        calculatedScore -= tile.points;
      });

      return calculatedScore;
  }

  useEffect(() => {
    if (wordTiles.length === 0) return;

    const builtWord = wordTiles.map(tile => tile.letter).join('');
    console.log('checking word', builtWord);

    const success = isWord(builtWord);

    setResult(success);
  }, [wordTiles])

  useEffect(() => {
    async function fetchWordData() {
      try {
        const response = await fetch('/alpha-bet/data/enable1.txt');

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
    <>
      {turns > 0 &&
      <div className={styles.page} onPointerDown={handleTouchStart} onPointerUp={handleTouchEnd} onPointerCancel={handleTouchCancel}>
        <h2 className={styles.section}>Turns remaining: {turns}</h2>
        <div className={styles.section}><WordBuilder tiles={wordTiles} onDrop={handleTileDrop} /></div>

        <button className={`${styles.btn} ${styles.actionBtn} ${styles.section}`} onClick={handleButtonClick}>Submit</button>
        <button className={styles.btn} style={{marginTop: '5px'}} onClick={handleReturnToHand}>Return</button>

        {result != null &&
          <>{result ? <>That's a word!</> : <>Not a word...</>}</>}

        <div className={`${styles.horizontal} ${styles.section}`}>
          <TilesInPlay tiles={tiles} onDrop={handleTileDrop} />
          <div>
            <Deck
              numberRemaining={deck.length}
              onDraw={handleDraw}
            />
            <button className={styles.btn} style={{marginTop: '5px'}} onClick={handleShuffleHand}>Shuffle</button>
          </div>
        </div>
        {score && <div>Score: {score}</div>}
      </div>}
      {turns < 1 && 
      <div className={styles.page}>
        <h2>Final score: {score}</h2>
      </div>}
    </>
  );
}
