import { Search } from 'lucide-react';
import { LOCALIZATION } from '../utils/localization';

/**
 * SearchBar - Text input with search icon for workspace search.
 */
export function SearchBar({ value, onChange, placeholder = LOCALIZATION.placeholders.search }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-2.5 shadow-sm shadow-violet-500/5 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/15 transition-all">
      <span className="text-violet-500 shrink-0" aria-hidden="true">
        <Search size={18} />
      </span>
      <input
        type="text"
        className="flex-1 border-none bg-transparent outline-none text-[0.9375rem] text-gray-900 placeholder:text-gray-500/70 min-w-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={LOCALIZATION.aria.search}
      />
    </div>
  );
}

export default SearchBar;
