const PopupEnd = ({ result, stats, solution, onRestart }) => {
  const {
    gamesPlayed = 0,
    gamesWon = 0,
    currentStreak = 0,
    maxStreak = 0,
    guessDistribution = []
  } = stats;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{result === 'win' ? '🎉' : '😢'}</h2>
        <h2>{result === 'win' ? 'You won!' : 'You lost'}</h2>
        {currentStreak >= 3 && <p>🔥You're on a {currentStreak}-win streak🔥</p>}
        {currentStreak === maxStreak && <p><strong>👑 New max streak record! 👑</strong></p>}
        {result === 'lose' && <p>The word was <strong>{solution}</strong></p>}
        <button onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
};

export default PopupEnd;