import { PREPOSITION_EXERCISES } from './prepositions/exercises.js';
import { tagLabel } from './tags.js';

// List of preposition exercises, grouped by level
export default function Prepositions({ onStart }) {
  const levels = [...new Set(PREPOSITION_EXERCISES.map((e) => e.level))].sort();
  return (
    <div className="menu">
      <h1>Preposiciones</h1>
      <p className="subtitle">Fill in the blank with the right preposition</p>
      {levels.map((level) => (
        <section key={level} className="level-group">
          <h2 className="level-heading">{tagLabel('difficulty', level)}</h2>
          <div className="cat-grid">
            {PREPOSITION_EXERCISES.filter((e) => e.level === level).map((ex) => (
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
