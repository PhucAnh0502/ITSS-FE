import { Search } from 'lucide-react';
import { LOCALIZATION } from '../utils/localization';

/**
 * SearchBar - Text input with search icon for workspace search.
 */
export function SearchBar({ value, onChange, placeholder = LOCALIZATION.placeholders.search }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">
        <Search size={18} />
      </span>
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={LOCALIZATION.aria.search}
      />
    </div>
  );
}

export default SearchBar;
