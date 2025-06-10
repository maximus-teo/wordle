import React from 'react';

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