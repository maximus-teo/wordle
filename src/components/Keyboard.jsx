import React from 'react';
import './Keyboard.css';

const KEY_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
];

const Keyboard = ({ onKeyPress, usedLetters }) => {
  const getStatus = (key) => usedLetters[key] || ''; // '' | 'correct' | 'present' | 'absent'

  return (
    <div className="keyboard">
      {KEY_LAYOUT.map((row, rowIdx) => (
        <div key={rowIdx} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`key ${getStatus(key)} ${key === 'Enter' || key === 'Backspace' ? 'key-special' : ''}`}
              onPointerDown={() => onKeyPress(key)}
              style={{ touchAction: 'manipulation' }}
            >
              {key === 'Backspace' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;