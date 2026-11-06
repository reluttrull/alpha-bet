'use client'

import LettersInPlay from "@/components/letters-in-play";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Deck from "@/components/deck";

export default function Home() {
  const [textInput, setTextInput] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [error, setError] = useState<string|null>(null);
  const [result, setResult] = useState<boolean>(false);

  const handleInputChange = (event:any) => {
    setTextInput(event.target.value);
  }

  const handleButtonClick = () => {
    if (words.includes(textInput)) setResult(true)
    else setResult(false);
    if (textInput.length < 2) setResult(false);
  }

  useEffect(() => {
    async function fetchFile() {
      try {
        const response = await fetch('/data/enable1.txt');
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`);
        }
        const text = await response.text();
        const lineArray = text.split(/\r?\n/);
        setWords(lineArray);
      } catch (err:any) {
        setError(err.message);
      }
    }

    fetchFile();
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
        <LettersInPlay />
        <Deck />
      </div>
    </div>
  );
}
