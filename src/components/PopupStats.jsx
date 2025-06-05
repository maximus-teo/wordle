import { useEffect } from 'react';

export default function PopupStats({ stats, onClose }) {
  /*useEffect(() => {
    console.log("Popup mounted!");
    return () => console.log("Popup unmounted!");
  }, []);*/

  if (!stats) return (
    <div className="popup">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        <h2>Stats</h2>
        <p>Loading stats...</p>
      </div>
    </div>
  );

  const {
    gamesPlayed = 0,
    gamesWon = 0,
    currentStreak = 0,
    maxStreak = 0,
    guessDistribution = []
  } = stats;

  const maxCount = Math.max(...stats.guessDistribution, 1); // prevent divide-by-zero

  return (
    <div className="popup">
      <div className="popup-stats">
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        <h3>Your Stats</h3>
        <p>Games Played: {gamesPlayed}</p>
        <p>Wins: {gamesWon} ({gamesPlayed ? Math.round((gamesWon / gamesPlayed) * 100) : 0}%)</p>
        <p>Current Streak: {currentStreak}</p>
        <p>Max Streak: {maxStreak}</p>

        <h3>Guess Distribution</h3>
        <div className="guess-bars">
          {guessDistribution.map((count, i) => {
            const widthPercent = (count / maxCount) * 100;
            return (
              <div key={i} className="guess-row">
                <span className="guess-label">{i + 1}</span>
                <div className="guess-bar" style={{ width: `${widthPercent}%` }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
