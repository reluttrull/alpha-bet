'use client'

import TilesInPlay from "@/components/tiles-in-play";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import distribution from "@/models/distribution.json"
import Deck from "@/components/deck";
import { Tile } from "@/models/tile";
import { seededShuffle } from "@/functions/shuffle";

export default function Home() {
  const [textInput, setTextInput] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [error, setError] = useState<string|null>(null);
  const [result, setResult] = useState<boolean>(false);

  const [seed, setSeed] = useState<number|null>(12345);
  const [deck, setDeck] = useState<Tile[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);

  const handleInputChange = (event:any) => {
    setTextInput(event.target.value);
  }

  const handleButtonClick = () => {
    if (words.includes(textInput.toLowerCase())) setResult(true)
    else setResult(false);
    if (textInput.length < 2) setResult(false);
  }

  const handleDraw = () => {
    if (deck.length === 0) { 
      setError('Deck is empty! Cannot draw.');
      return;
    }
    setTiles((prev) => [...prev, deck[0]]);
    setDeck((prev) => prev.slice(1))
  }

  useEffect(() => {
    async function fetchWordData() {
      try {
        const response = await fetch('/data/enable1.txt');
        if (!response.ok) {
          throw new Error(`Failed to load words file: ${response.statusText}`);
        }
        const text = await response.text();
        const lineArray = text.split(/\r?\n/);
        setWords(lineArray);
      } catch (err:any) {
        setError(err.message);
      }
    }
    async function fetchTileData() {
      let index = 1;
      let tilesToAdd:Tile[] = [];
      distribution.forEach((node:{letter:string, url:string, points:number; frequency:number }) => {
        for (let i = 0; i < node.frequency; i++) {
          tilesToAdd.push({ index, letter: node.letter, url: node.url, points: node.points });
          index++;
        }
      })
      setDeck(seededShuffle(tilesToAdd, seed));
    }

    fetchWordData();
    fetchTileData();
  }, []);

  return (
    <div className={styles.page}>
      <label>
        Input a word
        <input value={textInput} onChange={handleInputChange} />
      </label>
      <button onClick={handleButtonClick}>Check</button>
      {result ? <>That's a word!</> : <>Not a word...</>}
      <div className={styles.horizontal}>
        <TilesInPlay tiles={tiles} />
        <Deck numberRemaining={deck.length} onDraw={handleDraw} />
      </div>
    </div>
  );
}
