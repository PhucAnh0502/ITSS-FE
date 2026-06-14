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
    <div className="w-full overflow-hidden" role="group" aria-label="カテゴリフィルター">
      <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
        {tags.map((tag) => (
          <button
            key={tag.value}
            className={`shrink-0 px-4 py-2 rounded-full text-[0.8125rem] font-medium cursor-pointer transition-all whitespace-nowrap ${
              selectedTag === tag.value
                ? 'bg-green-500 border border-green-500 text-white hover:bg-green-600 hover:border-green-600'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-500'
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
