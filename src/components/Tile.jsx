import React from 'react';

const Tile = ({ letter, status, isRevealed, delay = 0 }) => {
  const style = {
    animationDelay: isRevealed ? `${delay}ms` : '0ms'
  };

  return (
    <div className="tile-container">
      <div className={`tile ${status} ${isRevealed ? 'flip' : ''}`} style={style}>
        {letter}
      </div>
    </div>
  );
};

export default Tile;