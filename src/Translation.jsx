import { useState } from 'react';
import { useSetting } from './settings.jsx';
import { EyeIcon, EyeOffIcon } from './icons.jsx';

/**
 * The English translation under a Spanish sentence, with an eye button to show
 * or hide it on this card. Whether it starts out shown comes from the global
 * "Show English translations" setting; it's also revealed once the card is
 * answered, unless the learner hid it.
 */
export default function Translation({ text, answered }) {
  const [showEnglish] = useSetting('showEnglish');
  const [choice, setChoice] = useState(null); // this card only: true / false, or null to follow the default
  const shown = choice ?? (showEnglish || answered);
  const label = shown ? 'Hide translation' : 'Show translation';

  return (
    <div className="translation">
      {shown && <span className="practice-note">{text}</span>}
      <button
        type="button"
        className="icon-btn"
        aria-label={label}
        aria-pressed={shown}
        data-tooltip={label}
        onClick={() => setChoice(!shown)}
      >
        {shown ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}
