import { SER_ESTAR_EXERCISES, USES, mixedExercise } from './serEstar/exercises.js';
import { tagLabel } from './tags.js';

const usesOf = (verb) => Object.values(USES).filter((u) => u.verb === verb && !u.label.startsWith('Meaning'));

// Ser vs estar: a cheat sheet of uses, then the exercises grouped by level
export default function SerEstar({ onStart }) {
  const levels = [...new Set(SER_ESTAR_EXERCISES.map((e) => e.level))].sort();
  const total = SER_ESTAR_EXERCISES.reduce((n, e) => n + e.items.length, 0);

  return (
    <div className="menu">
      <h1>Ser y estar</h1>
      <p className="subtitle">Fill in the blank with the right form of ser or estar</p>

      <div className="se-rules">
        {['ser', 'estar'].map((verb) => (
          <section key={verb} className={`se-rule-card se-${verb}`}>
            <h2>{verb === 'ser' ? 'Ser — what it is' : 'Estar — how & where it is'}</h2>
            <ul>
              {usesOf(verb).map((u) => (
                <li key={u.label}><strong>{u.label}:</strong> {u.rule}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <button className="cat-card cat-card-all" onClick={() => onStart(mixedExercise())}>
        <span className="cat-name">🎲 Mix of everything</span>
        <span className="cat-example">25 random sentences from every set below.</span>
        <span className="set-count">{total} sentences in all</span>
      </button>

      {levels.map((level) => (
        <section key={level} className="level-group">
          <h2 className="level-heading">{tagLabel('difficulty', level)}</h2>
          <div className="cat-grid">
            {SER_ESTAR_EXERCISES.filter((e) => e.level === level).map((ex) => (
              <button key={ex.id} className="cat-card" onClick={() => onStart(ex)}>
                <span className="cat-name">{ex.emoji} {ex.name}</span>
                <span className="cat-example">{ex.description}</span>
                <span className="set-count">{ex.items.length} sentences</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
