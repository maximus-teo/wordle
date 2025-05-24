// `npm run dev` to start program

import React, { useEffect, useState } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import wordList from './data/validWords';
import './App.css';

const getRandomWord = () => {
  return wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
};

function App() {
  const [solution, setSolution] = useState(getRandomWord());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [invalidGuess, setInvalidGuess] = useState(false);
  const [revealedRows, setRevealedRows] = useState([]);
  const [usedLetters, setUsedLetters] = useState({});

  const handleKeyPress = (key) => {
    if (key === 'Enter' && currentGuess.length === 5) {
      if (wordList.includes(currentGuess.toLowerCase())) {
        setGuesses([...guesses, currentGuess]);
        updateUsedLetters(currentGuess);
        setRevealedRows([...revealedRows, guesses.length]); // mark this row for animation
        setCurrentGuess('');
      }
      else {
        setInvalidGuess(true); // trigger shake
        setTimeout(() => setInvalidGuess(false), 600); // reset after animation
      }
    } else if (key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  useEffect(() => {
    const listener = (e) => handleKeyPress(e.key);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [currentGuess, guesses]);

  const updateUsedLetters = (guess) => {
    const newUsed = { ...usedLetters };
    guess.split('').forEach((char, i) => {
      if (solution[i] === char) {
        newUsed[char] = 'correct';
      } else if (solution.includes(char) && newUsed[char] !== 'correct') {
        newUsed[char] = 'present';
      } else if (!solution.includes(char) && !newUsed[char]) {
        newUsed[char] = 'absent';
      }
    });
    setUsedLetters(newUsed);
  };

  return (
    <div className="app">
      <h1>Wordle</h1>
      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        solution={solution}
        invalidGuess={invalidGuess}
        revealedRows={revealedRows}
      />
      <Keyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />
    </div>
  );
}

export default App;
