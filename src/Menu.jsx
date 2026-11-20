import wordSets from './wordSets/index.js';
import { TAG_TYPES, tagValues, tagLabel } from './tags.js';

// filters: { [tagTypeId]: value[] } — an empty list means "any".
// Values within a tag type are OR'd; different tag types are AND'd.
const matches = (set, filters) =>
  Object.entries(filters).every(
    ([typeId, selected]) =>
      selected.length === 0 || tagValues(set, typeId).some((v) => selected.includes(v))
  );

export default function Menu({ filters, onFiltersChange, onSelect }) {
  const toggle = (typeId, value) =>
    onFiltersChange((prev) => {
      const current = prev[typeId] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [typeId]: next };
    });

  const clearType = (typeId) => onFiltersChange((prev) => ({ ...prev, [typeId]: [] }));
  const hasFilters = Object.values(filters).some((v) => v.length > 0);

  const visible = wordSets.filter((set) => matches(set, filters));

  // Group visible sets by difficulty level, in level order
  const levels = TAG_TYPES.find((t) => t.id === 'difficulty').values;
  const groups = levels
    .map((level) => ({
      level,
      sets: visible.filter((set) => tagValues(set, 'difficulty').includes(level.value)),
    }))
    .filter((g) => g.sets.length > 0);

  return (
    <div className="menu">
      <h1>¡Vamos a estudiar!</h1>
      <p className="subtitle">Choose a word set to begin</p>

      <div className="filters">
        {TAG_TYPES.map((type) => {
          // Only offer tag values that at least one word set actually uses
          const used = type.values.filter((v) =>
            wordSets.some((set) => tagValues(set, type.id).includes(v.value))
          );
          const selected = filters[type.id] ?? [];
          return (
            <div className="filter-row" key={type.id}>
              <span className="filter-label">{type.label}</span>
              <div className="chips">
                <button
                  className={`chip ${selected.length === 0 ? 'is-active' : ''}`}
                  onClick={() => clearType(type.id)}
                >
                  All
                </button>
                {used.map((v) => (
                  <button
                    key={v.value}
                    className={`chip ${selected.includes(v.value) ? 'is-active' : ''}`}
                    onClick={() => toggle(type.id, v.value)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {groups.length === 0 ? (
        <div className="empty">
          <p>No word sets match these filters.</p>
          {hasFilters && (
            <button className="link-btn" onClick={() => onFiltersChange({})}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        groups.map(({ level, sets }) => (
          <section key={level.value} className="level-group">
            <h2 className="level-heading">{level.label}</h2>
            <div className="set-grid">
              {sets.map((set) => (
                <button key={set.id} className="set-card" onClick={() => onSelect(set)}>
                  <span className="set-emoji">{set.emoji}</span>
                  <span className="set-name">{set.name}</span>
                  <span className="set-count">{set.words.length} words</span>
                  <span className="tag-list">
                    {tagValues(set, 'theme').map((v) => (
                      <span key={v} className="tag">{tagLabel('theme', v)}</span>
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
