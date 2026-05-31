/**
 * CategoryTags - Horizontal scrollable tag list with toggle behavior.
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.tags - Array of tag objects with value and label
 * @param {string|null} props.selectedTag - Currently selected tag value, or null if none selected
 * @param {Function} props.onSelect - Callback called with tag value on select, or null on deselect
 */
export function CategoryTags({ tags, selectedTag, onSelect }) {
  const handleClick = (tagValue) => {
    if (tagValue === selectedTag) {
      onSelect(null);
    } else {
      onSelect(tagValue);
    }
  };

  return (
    <div className="category-tags" role="group" aria-label="カテゴリフィルター">
      <div className="category-tags__scroll">
        {tags.map((tag) => (
          <button
            key={tag.value}
            className={`category-tags__tag ${
              selectedTag === tag.value ? 'category-tags__tag--active' : ''
            }`}
            onClick={() => handleClick(tag.value)}
            aria-pressed={selectedTag === tag.value}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Default workspace category tags (Japanese) */
CategoryTags.defaultWorkspaceTags = [
  { value: 'near-hust', label: 'HUST周辺' },
  { value: 'people', label: '人数' },
  { value: 'quiet', label: '静かさ' },
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'power', label: '電源' },
];

export default CategoryTags;
