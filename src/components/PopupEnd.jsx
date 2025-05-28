const PopupEnd = ({ result, solution, onRestart }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{result === 'win' ? '🎉' : '😢'}</h2>
        <h2>{result === 'win' ? 'You won!' : 'You lost'}</h2>
        {result === 'lose' && <p>The word was <strong>{solution}</strong></p>}
        <button onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
};

export default PopupEnd;