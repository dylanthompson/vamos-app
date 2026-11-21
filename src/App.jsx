import { useCallback, useState } from 'react';
import SettingsDialog from './SettingsDialog.jsx';
import { GearIcon } from './icons.jsx';
import Menu from './Menu.jsx';
import FlashcardSession from './FlashcardSession.jsx';
import VerbStudy from './VerbStudy.jsx';
import VerbPractice from './VerbPractice.jsx';
import Prepositions from './Prepositions.jsx';
import PrepositionPractice from './PrepositionPractice.jsx';
import SerEstar from './SerEstar.jsx';
import SerEstarPractice from './SerEstarPractice.jsx';
import Complete from './Complete.jsx';

const TABS = [
  { screen: 'menu', label: '🃏 Flashcards' },
  { screen: 'verbs', label: '📘 Verbos' },
  { screen: 'serEstar', label: '⚖️ Ser y estar' },
  { screen: 'prepositions', label: '🧭 Preposiciones' },
];

export default function App() {
  // screen: 'menu' | 'study' | 'verbs' | 'practice' | 'serEstar' | 'serEstarPractice'
  //   | 'prepositions' | 'prepPractice' | 'complete'
  const [screen, setScreen] = useState('menu');
  const [wordSet, setWordSet] = useState(null);
  const [practice, setPractice] = useState(null); // { title, entries, tenses, run }
  const [prepExercise, setPrepExercise] = useState(null);
  const [serEstarExercise, setSerEstarExercise] = useState(null);
  const [result, setResult] = useState(null); // { title, noun, stats, returnTo }
  // These live here (not in the pages) so they survive a study session
  const [filters, setFilters] = useState({});
  const [verbView, setVerbView] = useState({ tab: 'categories', categoryId: null });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const startSet = (set) => {
    setWordSet(set);
    setScreen('study');
  };

  const startPractice = (config) => {
    setPractice({ ...config, run: (practice?.run ?? 0) + 1 });
    setScreen('practice');
  };

  const finish = (details) => (stats) => {
    setResult({ ...details, stats });
    setScreen('complete');
  };

  return (
    <div className="app">
      <button
        className="icon-btn settings-btn"
        aria-label="Settings"
        data-tooltip="Settings"
        onClick={() => setSettingsOpen(true)}
      >
        <GearIcon />
      </button>
      {settingsOpen && <SettingsDialog onClose={closeSettings} />}
      {TABS.some((t) => t.screen === screen) && (
        <nav className="top-nav" aria-label="Sections">
          {TABS.map((t) => (
            <button
              key={t.screen}
              className={`top-nav-tab ${screen === t.screen ? 'is-active' : ''}`}
              aria-current={screen === t.screen ? 'page' : undefined}
              onClick={() => setScreen(t.screen)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      )}

      {screen === 'menu' && (
        <Menu filters={filters} onFiltersChange={setFilters} onSelect={startSet} />
      )}
      {screen === 'study' && (
        <FlashcardSession
          key={wordSet.id}
          wordSet={wordSet}
          onComplete={finish({ title: wordSet.name, noun: 'words', returnTo: 'menu' })}
          onQuit={() => setScreen('menu')}
        />
      )}
      {screen === 'verbs' && (
        <VerbStudy view={verbView} onViewChange={setVerbView} onPractice={startPractice} />
      )}
      {screen === 'practice' && (
        <VerbPractice
          key={practice.run}
          config={practice}
          onComplete={finish({ title: practice.title, noun: 'verb forms', returnTo: 'verbs' })}
          onQuit={() => setScreen('verbs')}
        />
      )}
      {screen === 'serEstar' && (
        <SerEstar
          onStart={(ex) => {
            setSerEstarExercise(ex);
            setScreen('serEstarPractice');
          }}
        />
      )}
      {screen === 'serEstarPractice' && (
        <SerEstarPractice
          key={serEstarExercise.id}
          exercise={serEstarExercise}
          onComplete={finish({ title: serEstarExercise.name, noun: 'sentences', returnTo: 'serEstar' })}
          onQuit={() => setScreen('serEstar')}
        />
      )}
      {screen === 'prepositions' && (
        <Prepositions
          onStart={(ex) => {
            setPrepExercise(ex);
            setScreen('prepPractice');
          }}
        />
      )}
      {screen === 'prepPractice' && (
        <PrepositionPractice
          key={prepExercise.id}
          exercise={prepExercise}
          onComplete={finish({ title: prepExercise.name, noun: 'sentences', returnTo: 'prepositions' })}
          onQuit={() => setScreen('prepositions')}
        />
      )}
      {screen === 'complete' && (
        <Complete {...result} onDone={() => setScreen(result.returnTo)} />
      )}
    </div>
  );
}
