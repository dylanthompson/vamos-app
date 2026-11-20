const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü'];

/**
 * Typed-answer box shared by the practice exercises: text input, Check/Next
 * button, accented-letter keys (for keyboards without them) and "Show answer".
 * `extraKeys` adds more insertable keys (e.g. "–" for "nothing goes here").
 */
export default function AnswerForm({
  inputRef, value, onChange, answered, onSubmit, onShowAnswer, extraKeys = [],
}) {
  // Insert a character at the cursor
  const insert = (ch) => {
    const el = inputRef.current;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + ch + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  };

  return (
    <>
      <form className="practice-form" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className="practice-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={answered}
          placeholder="Escribe en español…"
          aria-label="Your answer in Spanish"
          lang="es"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button type="submit" className="btn btn-correct">
          {answered ? 'Next →' : 'Check'}
        </button>
      </form>

      {!answered && (
        <div className="accent-keys" aria-label="Insert accented letter">
          {[...ACCENT_KEYS, ...extraKeys].map((ch) => (
            <button
              key={ch}
              type="button"
              className="accent-key"
              onMouseDown={(e) => e.preventDefault()} // keep focus in the input
              onClick={() => insert(ch)}
            >
              {ch}
            </button>
          ))}
          <button type="button" className="link-btn" onClick={onShowAnswer}>
            Show answer
          </button>
        </div>
      )}
    </>
  );
}
