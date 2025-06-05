import React, { useState, useEffect } from 'react';

const Tile = ({ letter, status, isRevealed, delay = 0 }) => {
  const [delayedStatus, setDelayedStatus] = useState('');
  const [pop, setPop] = useState(false);

  const style = {
    animationDelay: isRevealed ? `${delay}ms` : '0ms'
  };

  useEffect(() => {
    if (isRevealed) {
      const timeout = setTimeout(() => {
        setDelayedStatus(status);
      }, delay + 300);
      return () => clearTimeout(timeout);
    }
  }, [isRevealed, status, delay]);

  useEffect(() => {
    if (!isRevealed && letter) {
      setPop(true);
      const timer = setTimeout(() => setPop(false), 150);
      return () => clearTimeout(timer);
    }
  }, [letter, isRevealed]);

  return (
    <div className={`tile-container`}>
      <div
        className={`tile
          ${delayedStatus}
          ${isRevealed ? 'flip' : ''}
          ${pop ? 'pop' : ''}
          ${letter && !isRevealed ? 'filled' : ''}
        `}
        style={style}
      >
        {letter}
      </div>
    </div>
  );
};

export default Tile;