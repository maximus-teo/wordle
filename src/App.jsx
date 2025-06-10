// `npm run dev` to start program

import React, { useEffect, useState, useRef } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import PopupEnd from './components/PopupEnd';
import PopupSettings from './components/PopupSettings';
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

  const [highContrast, setHighContrast] = useState(() =>
    localStorage.getItem('theme') === 'hicon'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('hicon');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'hicon');
    }
    else if (darkMode) {
      root.classList.remove('hicon');
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('hicon');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode, highContrast]);

  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [keyboardLayout, setKeyboardLayout] = useState('QWERTY');
  const layouts = {
    QWERTY: ['QWERTYUIOP', 'ASDFGHJKL', ['Enter', 'ZXCVBNM', 'Backspace']],
    AZERTY: ['AZERTYUIOP', 'QSDFGHJKLM', ['Enter', 'WXCVBN', 'Backspace']],
    DVORAK: ['PYFGCRL', 'AOEUIDHTNS', ['Enter', 'QJKXBMWVZ', 'Backspace']]
  };

  useEffect(() => {
    if (keyboardLayout === 'QWERTY') {
      localStorage.setItem('keyboardLayout', 'QWERTY');
    } else if (keyboardLayout === 'AZERTY') {
      localStorage.setItem('keyboardLayout', 'AZERTY');
    } else {
      localStorage.setItem('keyboardLayout', 'DVORAK');
    }
  }, [keyboardLayout])

  const [solution, setSolution] = useState(getRandomWord());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [invalidGuess, setInvalidGuess] = useState(false);
  const [revealedRows, setRevealedRows] = useState([]);
  const [usedLetters, setUsedLetters] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'win' | 'lose' | null
  const [showConfetti, setShowConfetti] = useState(true);
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
    const keySound = document.getElementById("key-press");
    if (key === 'Enter' && currentGuess.length === 5) {
      keySound.currentTime = 0;
      keySound.play();
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
      keySound.currentTime = 0;
      keySound.play();
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
      keySound.currentTime = 0;
      keySound.play();
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  // handle key press
  useEffect(() => {
    const listener = (e) => handleKeyPress(e.key);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [currentGuess, guesses]);

  useEffect(() => {
    if (showConfetti) localStorage.setItem("showConfetti", "true");
    else localStorage.setItem("showConfetti", "false");
  }, [showConfetti]);

  // handle win and lose events
  useEffect(() => {
    if (gameResult === 'win') {
      updateStats(true, guesses.length);
      setTimeout(() => {
        if (showConfetti) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.8 }
          });
        }
      }, 1500);
      setTimeout(() => setGameOver(true), 2200);
    } else if (gameResult === 'lose') {
      updateStats(false);
      setTimeout(() => setGameOver(true), 2000);
    }
  }, [gameResult, showConfetti]);

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
  
  const resetStats = () => {
    localStorage.removeItem("userStats");
    setStats(defaultStats);
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
      <h1 className="title">WORDLE</h1>
      <div className="desktop-icon-bar">
        <button onClick={() => setDarkMode(prev => !prev)}>
          <i className="fa-solid fa-circle-half-stroke"></i>
        </button>
        <button onClick={() => setShowSettings(true)}>
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
        <button onClick={() => setDarkMode(prev => !prev)}>
          <i className="fa-solid fa-circle-half-stroke"></i>
        </button>
        <button onClick={() => setShowSettings(true)}>
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
      <audio id="key-press" src="wordle\src\assets\key_press.wav" preload="auto"></audio>
      <Keyboard layout={layouts[keyboardLayout]} onKeyPress={handleKeyPress} usedLetters={usedLetters}/>

      {showStats && <PopupStats stats={stats} onClose={() => setShowStats(false)} />}
      {showSettings &&
        <PopupSettings
          onReset={resetStats}
          darkMode={() => setDarkMode(prev => !prev)}
          highContrast={() => setHighContrast(prev => !prev)}
          layouts={layouts}
          keyboardLayout={keyboardLayout}
          setKeyboardLayout={setKeyboardLayout}
          confetti={showConfetti}
          showConfetti={() => setShowConfetti(prev => !prev)}
          onClose={() => setShowSettings(false)}/>}
      {gameOver && <PopupEnd result={gameResult} stats={stats} solution={solution} onRestart={restartGame} />}
    </div>
  );
}

export default App;

// <Keyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />
