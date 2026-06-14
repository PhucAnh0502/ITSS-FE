import { Search } from 'lucide-react';
import { LOCALIZATION } from '../utils/localization';

/**
 * SearchBar - Text input with search icon for workspace search.
 */
export function SearchBar({ value, onChange, placeholder = LOCALIZATION.placeholders.search }) {
  return (
    <div className="flex items-center gap-2 bg-white/75 backdrop-blur-md border border-white/70 rounded-full px-5 py-3 shadow-xl shadow-blue-500/10 ring-1 ring-blue-100/60 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
      <span className="text-blue-500 shrink-0" aria-hidden="true">
        <Search size={20} />
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
