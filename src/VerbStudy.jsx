import { useCallback, useMemo, useState } from 'react';
import { conjugate, TENSES } from './conjugation/conjugate.js';
import { CATEGORIES, CATEGORY_GROUPS, ALL_VERBS_CATEGORY, categoryById } from './verbs/categories.js';
import { VERBS, verbsInCategory } from './verbs/verbBank.js';
import { practicableCount } from './verbs/practice.js';
import { tagLabel } from './tags.js';
import ConjugationPanel from './ConjugationPanel.jsx';
import useMyVerbs from './verbs/useMyVerbs.js';

const ENDING_CATEGORIES = ['ar', 'er', 'ir'];
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
// Search order: exact verb name, then names starting with the query, then the rest
const byRelevance = (verbs, q) => {
  const rank = (v) => {
    const name = fold(v.key);
    return name === q ? 0 : name.startsWith(q) ? 1 : 2;
  };
  return q ? [...verbs].sort((a, b) => rank(a) - rank(b)) : verbs;
};
const tenseChipLabel =(t) => (t.mood === 'Subjuntivo' ? `Subj. ${t.label.toLowerCase()}` : t.label);

export default function VerbStudy({ view, onViewChange, onPractice }) {
  const [conjVerb, setConjVerb] = useState(null);
  const [conjTense, setConjTense] = useState('presente');
  const closeConj = useCallback(() => setConjVerb(null), []);
  const myVerbs = useMyVerbs();

  const setTab = (tab) => onViewChange((v) => ({ ...v, tab, categoryId: null }));
  const openCategory = (categoryId) => onViewChange((v) => ({ ...v, tab: 'categories', categoryId }));
  const listProps = { onConjugate: setConjVerb, myVerbs };
  const category = view.categoryId ? categoryById(view.categoryId) : null;

  return (
    <div className="verbs">
      <h1>Verbos</h1>
      <p className="subtitle">Study verbs by pattern, look up any verb, and practice conjugating</p>

      <div className="segmented" role="tablist" aria-label="Verb study views">
        {[
          ['categories', 'Categories'],
          ['lookup', 'Verb lookup'],
          ['mine', `My verbs${myVerbs.verbs.length ? ` (${myVerbs.verbs.length})` : ''}`],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={view.tab === id}
            className={view.tab === id ? 'is-active' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {view.tab === 'lookup' ? (
        <VerbLookup {...listProps} onCategory={openCategory} />
      ) : view.tab === 'mine' ? (
        <MyVerbs
          {...listProps}
          tenses={view.myTenses ?? ['presente', 'preterito']}
          onTensesChange={(myTenses) => onViewChange((v) => ({ ...v, myTenses }))}
          onPractice={onPractice}
        />
      ) : category ? (
        <CategoryDetail
          key={category.id}
          category={category}
          onBack={() => openCategory(null)}
          {...listProps}
          onPractice={onPractice}
        />
      ) : (
        <CategoryGrid onOpen={openCategory} />
      )}

      {conjVerb && (
        <ConjugationPanel
          verb={{ conjugation: conjugate(conjVerb.infinitive, conjVerb.reflexive), complement: '' }}
          target={null}
          tense={conjTense}
          onTenseChange={setConjTense}
          onClose={closeConj}
        />
      )}
    </div>
  );
}

function CategoryGrid({ onOpen }) {
  return (
    <>
      <button className="cat-card cat-card-all" onClick={() => onOpen('all')}>
        <span className="cat-name">📚 {ALL_VERBS_CATEGORY.name}</span>
        <span className="cat-example">{ALL_VERBS_CATEGORY.rule}</span>
        <span className="set-count">{VERBS.length} verbs</span>
      </button>
      {CATEGORY_GROUPS.map((group) => (
        <section key={group} className="level-group">
          <h2 className="level-heading">{group}</h2>
          <div className="cat-grid">
            {CATEGORIES.filter((c) => c.group === group).map((c) => (
              <button key={c.id} className="cat-card" onClick={() => onOpen(c.id)}>
                <span className="cat-name">{c.name}</span>
                <span className="cat-example">{c.example}</span>
                <span className="set-count">{verbsInCategory(c.id).length} verbs</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function CategoryDetail({ category, onBack, onConjugate, myVerbs, onPractice }) {
  const verbs = verbsInCategory(category.id);
  const [tenses, setTenses] = useState(category.tenses);

  return (
    <div className="cat-detail">
      <button className="link-btn" onClick={onBack}>← All categories</button>
      <h2 className="cat-title">{category.name}</h2>
      <p className="cat-rule">{category.rule}</p>
      {category.example && <p className="cat-example-box">{category.example}</p>}

      <PracticeSetup
        title={category.name}
        verbs={verbs}
        tenses={tenses}
        onTensesChange={setTenses}
        onPractice={onPractice}
      />

      <h3 className="cat-subheading">{verbs.length} verbs</h3>
      <VerbList verbs={verbs} onConjugate={onConjugate} myVerbs={myVerbs} />
    </div>
  );
}

function PracticeSetup({ title, verbs, tenses, onTensesChange, onPractice }) {
  const toggle = (id) =>
    onTensesChange(tenses.includes(id) ? tenses.filter((x) => x !== id) : [...tenses, id]);
  const canStart = tenses.length > 0 && practicableCount(verbs, tenses);

  return (
    <div className="practice-setup">
      <h3>Practice these verbs</h3>
      <p className="muted">
        You'll see the English — like “you (tú) spoke” — and type the Spanish: <em>hablaste</em>.
      </p>
      <div className="chips" role="group" aria-label="Tenses to practice">
        {TENSES.map((t) => (
          <button
            key={t.id}
            className={`chip ${tenses.includes(t.id) ? 'is-active' : ''}`}
            aria-pressed={tenses.includes(t.id)}
            onClick={() => toggle(t.id)}
          >
            {tenseChipLabel(t)}
          </button>
        ))}
      </div>
      <button
        className="btn btn-correct"
        disabled={!canStart}
        onClick={() => onPractice({ title, entries: verbs, tenses })}
      >
        Start practice
      </button>
      {!canStart && (
        <p className="muted">
          {tenses.length === 0
            ? 'Pick at least one tense.'
            : 'None of these verbs can be practiced in the chosen tenses.'}
        </p>
      )}
    </div>
  );
}

function MyVerbs({ myVerbs, tenses, onTensesChange, onConjugate, onPractice }) {
  const { verbs, has, toggle, clear } = myVerbs;
  const [query, setQuery] = useState('');
  const matches = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return [];
    const found = VERBS.filter((v) => !has(v.key) && fold(`${v.key} ${v.en}`).includes(q));
    return byRelevance(found, q).slice(0, 8);
  }, [query, has]);

  const add = (key) => {
    toggle(key);
    setQuery('');
  };

  return (
    <div className="cat-detail">
      <div className="my-verbs-add">
        <input
          type="search"
          className="lookup-search"
          placeholder="Add a verb — search in Spanish or English…"
          aria-label="Add a verb to your list"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && matches[0] && add(matches[0].key)}
        />
        {query.trim() && (
          <ul className="my-verbs-suggestions">
            {matches.length > 0 ? (
              matches.map((v) => (
                <li key={v.key}>
                  <button className="my-verbs-suggestion" onClick={() => add(v.key)}>
                    <strong>{v.key}</strong> <span className="muted">{v.en}</span>
                    <span className="my-verbs-plus">+ Add</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="muted my-verbs-none">No matching verbs to add.</li>
            )}
          </ul>
        )}
      </div>

      {verbs.length === 0 ? (
        <div className="empty">
          <p>Your list is empty.</p>
          <p>Search above, or tap <strong>+ My verbs</strong> on any verb in Categories or Verb lookup.</p>
        </div>
      ) : (
        <>
          <PracticeSetup
            title="My verbs"
            verbs={verbs}
            tenses={tenses}
            onTensesChange={onTensesChange}
            onPractice={onPractice}
          />
          <div className="my-verbs-heading">
            <h3 className="cat-subheading">{verbs.length} verbs</h3>
            <button
              className="link-btn"
              onClick={() => window.confirm('Remove all verbs from your list?') && clear()}
            >
              Clear list
            </button>
          </div>
          <VerbList verbs={verbs} onConjugate={onConjugate} myVerbs={myVerbs} />
        </>
      )}
    </div>
  );
}

function VerbLookup({ onConjugate, myVerbs, onCategory }) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState(null);
  const [categoryId, setCategoryId] = useState('');

  const results = useMemo(() => {
    const q = fold(query.trim());
    const found = VERBS.filter(
      (v) =>
        (!level || v.levels.includes(level)) &&
        (!categoryId || v.categories.includes(categoryId)) &&
        (!q || fold(`${v.key} ${v.en} ${v.phrases.map((p) => `${p.es} ${p.en}`).join(' ')}`).includes(q))
    );
    return byRelevance(found, q);
  }, [query, level, categoryId]);

  return (
    <div className="lookup">
      <div className="filters">
        <input
          type="search"
          className="lookup-search"
          placeholder="Search in Spanish or English…"
          aria-label="Search verbs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="filter-row">
          <span className="filter-label">Level</span>
          <div className="chips">
            {[null, 1, 2, 3].map((l) => (
              <button
                key={l ?? 'all'}
                className={`chip ${level === l ? 'is-active' : ''}`}
                onClick={() => setLevel(l)}
              >
                {l ? tagLabel('difficulty', l) : 'All'}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-row">
          <label className="filter-label" htmlFor="lookup-category">Category</label>
          <select
            id="lookup-category"
            className="lookup-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORY_GROUPS.map((g) => (
              <optgroup key={g} label={g}>
                {CATEGORIES.filter((c) => c.group === g).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <p className="lookup-count">{results.length} of {VERBS.length} verbs</p>
      {results.length > 0 ? (
        <VerbList verbs={results} onConjugate={onConjugate} myVerbs={myVerbs} onCategory={onCategory} />
      ) : (
        <div className="empty">No verbs match your search.</div>
      )}
    </div>
  );
}

function VerbList({ verbs, onConjugate, myVerbs, onCategory }) {
  return (
    <ul className="verb-list">
      {verbs.map((v) => (
        <li key={v.key} className="verb-row">
          <div className="verb-main">
            <span className="verb-es">{v.key}</span>
            <span className="verb-en">{v.en}</span>
            {v.phrases.length > 0 && (
              <span className="verb-phrases">{v.phrases.map((p) => p.es).join(' · ')}</span>
            )}
            {onCategory && (
              <span className="tag-list verb-cats">
                {v.categories
                  .filter((id) => !ENDING_CATEGORIES.includes(id))
                  .map((id) => (
                    <button key={id} className="tag tag-btn" onClick={() => onCategory(id)}>
                      {categoryById(id).name}
                    </button>
                  ))}
              </span>
            )}
          </div>
          <div className="verb-side">
            <span className="verb-levels">
              {v.levels.map((l) => tagLabel('difficulty', l)).join(' · ')}
            </span>
            <button className="conj-btn" onClick={() => onConjugate(v)}>Conjugar</button>
            <button
              className={`conj-btn my-verb-toggle ${myVerbs.has(v.key) ? 'is-added' : ''}`}
              aria-pressed={myVerbs.has(v.key)}
              onClick={() => myVerbs.toggle(v.key)}
            >
              {myVerbs.has(v.key) ? '✓ My verbs' : '+ My verbs'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
