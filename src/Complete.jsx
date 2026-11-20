import { useEffect, useState } from 'react';

const RETURN_SECONDS = 8;

export default function Complete({ title, noun, stats, onDone }) {
  const [secondsLeft, setSecondsLeft] = useState(RETURN_SECONDS);
  const perfect = stats.totalWrong === 0;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, onDone]);

  return (
    <div className="complete">
      <div className="trophy">🎉</div>
      <h1>¡Felicidades!</h1>
      <p className="subtitle">
        You mastered all {stats.count} {noun} in <strong>{title}</strong>!
      </p>
      <div className="stats">
        <div>
          <span className="stat-num">{stats.rounds}</span>
          <span className="stat-label">{stats.rounds === 1 ? 'round' : 'rounds'}</span>
        </div>
        <div>
          <span className="stat-num">{stats.totalWrong}</span>
          <span className="stat-label">misses</span>
        </div>
      </div>
      {perfect && <p className="perfect">Perfect score — ¡excelente!</p>}
      <button className="btn btn-correct" onClick={onDone}>Continue</button>
      <p className="subtitle countdown">Returning in {secondsLeft}s…</p>
    </div>
  );
}
