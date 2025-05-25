import React, { useState, useEffect } from 'react';

const Tile = ({ letter, status, isRevealed, delay = 0 }) => {

  const style = {
    animationDelay: isRevealed ? `${delay}ms` : '0ms'
  };

  const [delayedStatus, setDelayedStatus] = useState('');

  useEffect(() => {
    if (isRevealed) {
      const timeout = setTimeout(() => {
        setDelayedStatus(status);
      }, delay + 300);
      return () => clearTimeout(timeout);
    }
  }, [isRevealed, status, delay]);

  return (
    <div className={`tile-container`}>
      <div
        className={`tile ${delayedStatus} ${isRevealed ? 'flip' : ''}`}
        style={style}
      >
        {letter}
      </div>
    </div>
  );
};

export default Tile;