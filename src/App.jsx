// `npm run dev` to start program

import React, { useEffect, useState, useRef } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import PopupEnd from './components/PopupEnd';
import PopupStats from './components/PopupStats';
import solutionWords from './data/solutionWords';
import validWords from './data/validWords';
import './App.css';
import confetti from 'canvas-confetti';
import GoogleLogin from "./components/GoogleLogin";

const getRandomWord = () => {
  return solutionWords[Math.floor(Math.random() * solutionWords.length)].toUpperCase();
};

function App() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const [showStats, setShowStats] = useState(false);

  const [solution, setSolution] = useState(getRandomWord());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [invalidGuess, setInvalidGuess] = useState(false);
  const [revealedRows, setRevealedRows] = useState([]);
  const [usedLetters, setUsedLetters] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'win' | 'lose' | null
  const [gameId, setGameId] = useState(0);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    console.log("User Info:", userData);
    setUser(userData);
    localStorage.setItem("wordleUser", JSON.stringify(userData));
  };

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
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        updateUsedLetters(currentGuess);
        setRevealedRows([...revealedRows, guesses.length]); // mark this row for animation
        setCurrentGuess('');
        if (currentGuess === solution) {
          setGameResult('win'); // confetti
        } else if (guesses.length + 1 >= 6) {
          setGameResult('lose');
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
      updateStats(true, guesses.length);
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }, 1500);
      setTimeout(() => setGameOver(true), 2200);
    } else if (gameResult === 'lose') {
      updateStats(false);
      setTimeout(() => setGameOver(true), 2000);
    }
  }, [gameResult]);

  const statsUpdatedRef = useRef(false);

  const restartGame = () => {
    statsUpdatedRef.current = false;
    setSolution(getRandomWord());
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setGameResult(null);
    setUsedLetters({});
    setRevealedRows([]);
    setGameId(prev => prev + 1); // bump to force reset
  };

  const defaultStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  };

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem("userStats");
      if (!saved) {
        localStorage.setItem("userStats", JSON.stringify(defaultStats));
        return JSON.parse(saved);
      } else {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to parse userStats from localStorage:", e);
      return defaultStats;
    }

  });

  useEffect(() => {
    if (stats) localStorage.setItem("userStats", JSON.stringify(stats));
  }, [stats]);

  function updateStats(isWin, guessesUsed) {
    if (statsUpdatedRef.current) return;
    statsUpdatedRef.current = true;

    let updatedStats;

    setStats(prev => {
      const newStats = { ...prev }; // take most recent stats

      newStats.gamesPlayed++;
      if (isWin) {
        newStats.gamesWon++;
        newStats.currentStreak++;
        newStats.maxStreak = Math.max(newStats.currentStreak, newStats.maxStreak);
        newStats.guessDistribution = [...newStats.guessDistribution]; // avoid direct mutation
        newStats.guessDistribution[guessesUsed - 1]++;
      } else {
        newStats.currentStreak = 0;
      }

      updatedStats = newStats; // store in outer scope for side effect
      return newStats;
    });

    // Wait for state to settle, then safely persist once
    setTimeout(() => {
      if (updatedStats) {
        localStorage.setItem("userStats", JSON.stringify(updatedStats));
      }
    }, 0);
  }

  return (
    <div className="app">
      {!user ? (
        <GoogleLogin onSuccess={handleLogin} />
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          <img src={user.picture} alt="profile" />
        </div>
      )}
      <button className="dev-reset" onClick={() => {
        localStorage.removeItem("userStats");
        setStats(defaultStats);
      }}>Reset Stats</button>
      <h1 className="title">WORDLE</h1>
      <div className="desktop-icon-bar">
        <button onClick={() => setDarkMode(prev => !prev)}>
          <i className="fa-solid fa-circle-half-stroke"></i>
        </button>
        <button>
          <i className="fa-solid fa-gear"></i>
        </button>
        <button onClick={() => setShowStats(true)}>
          <i className="fa-solid fa-chart-simple"></i>
        </button>
        <button>
          <i className="fa-solid fa-question-circle"></i>
        </button>
      </div>
      <div className="mobile-icon-bar">
        <h1>WORDLE</h1>
        <button className="dev-reset" onClick={() => {
          localStorage.removeItem("userStats");
          setStats(defaultStats);
        }}>Reset Stats</button>
        <button onClick={() => setDarkMode(prev => !prev)}>
          <i className="fa-solid fa-circle-half-stroke"></i>
        </button>
        <button>
          <i className="fa-solid fa-gear"></i>
        </button>
        <button onClick={() => setShowStats(true)}>
          <i className="fa-solid fa-chart-simple"></i>
        </button>
        <button>
          <i className="fa-solid fa-question-circle"></i>
        </button>
      </div>
      <hr className="bar-line"></hr>

      <Grid
        key={gameId} // force full re-mount
        guesses={guesses}
        currentGuess={currentGuess}
        solution={solution}
        invalidGuess={invalidGuess}
        revealedRows={revealedRows}
      />
      <Keyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />
      {showStats && <PopupStats stats={stats} onClose={() => setShowStats(false)} />}
      {gameOver && <PopupEnd result={gameResult} solution={solution} onRestart={restartGame} />}
    </div>
  );
}

export default App;
