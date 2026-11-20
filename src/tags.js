// Tag types that can be attached to a word set via `set.tags[<type id>]`.
// A tag value may be a single value or an array of values.
// To add a new tag type, add an entry here and tag the word sets with it —
// the menu picks it up automatically for badges and filtering.
export const TAG_TYPES = [
  {
    id: 'difficulty',
    label: 'Difficulty',
    values: [
      { value: 1, label: 'Spanish 1' },
      { value: 2, label: 'Spanish 2' },
      { value: 3, label: 'Spanish 3' },
      { value: 4, label: 'Spanish 4' },
      { value: 5, label: 'AP / College' },
    ],
  },
  {
    id: 'theme',
    label: 'Theme',
    values: [
      { value: 'basics', label: 'Basics' },
      { value: 'daily', label: 'Daily Life' },
      { value: 'nature', label: 'Nature & Environment' },
      { value: 'people', label: 'People & Society' },
      { value: 'work', label: 'Work & Careers' },
      { value: 'health', label: 'Health' },
      { value: 'arts', label: 'Arts & Media' },
      { value: 'verbs', label: 'Verbs' },
      { value: 'conjugation', label: 'Conjugation' },
      { value: 'grammar', label: 'Grammar' },
    ],
  },
];

export const tagValues = (set, typeId) => [].concat(set.tags?.[typeId] ?? []);

export const tagLabel = (typeId, value) =>
  TAG_TYPES.find((t) => t.id === typeId)?.values.find((v) => v.value === value)?.label ?? String(value);
