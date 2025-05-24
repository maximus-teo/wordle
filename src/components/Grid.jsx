import React from 'react';
import Tile from './Tile';

const Grid = ({ guesses, currentGuess, solution, invalidGuess, revealedRows }) => {
  const totalRows = 6;
  const rows = [...guesses];

  while (rows.length < totalRows) {
    rows.push('');
  }

  return (
    <div className="grid">
      {rows.map((word, rowIdx) => {
        const isCurrentRow = rowIdx === guesses.length;
        const displayWord = isCurrentRow ? currentGuess : word;

        return (
          <div className={`row ${isCurrentRow && invalidGuess ? 'shake' : ''}`} key={rowIdx}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Tile
                key={i}
                letter={displayWord[i] || ''}
                status={!isCurrentRow ? getStatus(word[i], i, word, solution) : ''}
                isRevealed={revealedRows.includes(rowIdx)}
                delay={i * 300}
                />
            ))}
          </div>
        );
      })}
    </div>
  );
};


const getStatus = (letter, idx, word, solution) => {
  if (!letter) return '';
  if (solution[idx] === letter) return 'correct';
  if (solution.includes(letter)) return 'present';
  return 'absent';
};

export default Grid;