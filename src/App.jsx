// `npm run dev` to start program

import React, { useEffect, useState } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import Popup from './components/Popup';
import solutionWords from './data/solutionWords';
import validWords from './data/validWords';
import './App.css';
import confetti from 'canvas-confetti';

const getRandomWord = () => {
  return solutionWords[Math.floor(Math.random() * solutionWords.length)].toUpperCase();
};

function App() {
  const [solution, setSolution] = useState(getRandomWord());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [invalidGuess, setInvalidGuess] = useState(false);
  const [revealedRows, setRevealedRows] = useState([]);
  const [usedLetters, setUsedLetters] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'win' | 'lose' | null
  const [gameId, setGameId] = useState(0);

  const updateUsedLetters = (guess) => {
    const flipDelay = 300;
    const flipDuration = 300; 
    guess.split('').forEach((char, i) => {
      const delay = i * flipDelay + flipDuration;
      setTimeout(() => {
        setUsedLetters(prev => {
          const newUsed = {...prev};
          const currentStatus = newUsed[char];
          const newStatus = solution[i] === char
            ? 'correct'
            : solution.includes(char)
              ? 'present'
              : 'absent';
          
          const priority = { '':0, absent:1, present:2, correct:3 };
          if (priority[newStatus] > priority[currentStatus || '']) {
            newUsed[char] = newStatus;
          }
          return newUsed;
        });
      }, delay);
    });
  };

  const handleKeyPress = (key) => {
    if (key === 'Enter' && currentGuess.length === 5) {
      if (validWords.includes(currentGuess.toLowerCase())) {
        setGuesses([...guesses, currentGuess]);
        updateUsedLetters(currentGuess);
        setRevealedRows([...revealedRows, guesses.length]); // mark this row for animation
        setCurrentGuess('');
        if (currentGuess === solution) {
          setGameResult('win'); // confetti
          setTimeout(() => {
            setGameOver(true); // popup
          }, 2200);
        } else if (guesses.length + 1 >= 6) {
          setGameResult('lose');
          setTimeout(() => {
            setGameOver(true);
          }, 2000);
        }
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

  useEffect(() => {
  if (gameResult === 'win') {
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1500);
  }
  }, [gameResult]);

  const restartGame = () => {
    setSolution(getRandomWord());
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setGameResult(null);
    setUsedLetters({});
    setRevealedRows([]);
    setGameId(prev => prev + 1); // bump to force reset
  };

  return (
    <div className="app">
      <h1>Wordle</h1>
      <Grid
        key={gameId} // force full re-mount
        guesses={guesses}
        currentGuess={currentGuess}
        solution={solution}
        invalidGuess={invalidGuess}
        revealedRows={revealedRows}
      />
      <Keyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />
      {gameOver && <Popup result={gameResult} solution={solution} onRestart={restartGame} />}
    </div>
  );
}

export default App;
