import React from 'react';

const QWERTY_KEY_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
];

const DVORAK_KEY_LAYOUT = [
  ['P', 'Y', 'F', 'G', 'C', 'R', 'L'],
  ['A', 'O', 'E', 'U', 'I', 'D', 'H', 'T', 'N', 'S'],
  ['Q', 'J', 'K', 'X', 'B', 'M', 'W', 'V', 'Z'],
  ['Enter', 'Backspace']
]

/*
const Keyboard = ({ onKeyPress, usedLetters }) => {
  const getStatus = (key) => usedLetters[key] || ''; // '' | 'correct' | 'present' | 'absent'

  return (
    <div className="keyboard">
      {QWERTY_KEY_LAYOUT.map((row, rowIdx) => (
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
export default Keyboard;*/

/*export default function Keyboard({ layout, onKeyPress, usedLetters }) {
  const getStatus = (key) => usedLetters[key] || ''; // '' | 'correct' | 'present' | 'absent'
  return (
    <div className="keyboard">
      {layout.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.split('').map(key => (
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
}*/

export default function Keyboard({ layout, onKeyPress, usedLetters }) {
  const getStatus = (key) => usedLetters[key] || ''; // '' | 'correct' | 'present' | 'absent'

  return (
    <div className="keyboard">
      {layout.map((row, i) => {
        // Flatten nested row like ['Enter', 'ZXCVBNM', 'Backspace'] into ['Enter', 'Z', ..., 'Backspace']
        const keys = Array.isArray(row)
          ? row.flatMap(r => (r === 'Enter' || r === 'Backspace') ? [r] : r.split(''))
          : row.split('');

        return (
          <div key={i} className="keyboard-row">
            {keys.map((key) => (
              <button
                key={key}
                className={`key ${getStatus(key)} ${key === 'Enter' ? 'enter-key' : ''} ${key === 'Backspace' ? 'backspace-key' : ''}`}
                onPointerDown={() => onKeyPress(key)}
                style={{ touchAction: 'manipulation' }}
              >
                {key === 'Backspace' ? '⌫' : key}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}