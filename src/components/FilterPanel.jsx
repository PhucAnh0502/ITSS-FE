import { LOCALIZATION } from '../utils/localization';

/**
 * FilterPanel - Filter controls for workspace search criteria.
 *
 * @param {Object} props
 * @param {Object} props.filters - Current filter state object
 * @param {number} props.activeFilters - Count of currently active filters
 * @param {Function} props.onFilterChange - Callback(key, value) when a filter changes
 * @param {Function} props.onClear - Callback to reset all filters
 */
export function FilterPanel({ filters, activeFilters, onFilterChange, onClear }) {
  const availabilityOptions = [
    { value: 'available', label: LOCALIZATION.filters.available },
    { value: 'busy', label: LOCALIZATION.filters.busy },
  ];

  const quietnessLevels = [1, 2, 3, 4, 5];

  const handleAvailability = (value) => {
    onFilterChange('availability', filters.availability === value ? null : value);
  };

  const handleQuietness = (level) => {
    onFilterChange('quietnessLevel', filters.quietnessLevel === level ? null : level);
  };

  const handleWifi = () => {
    onFilterChange('hasWifi', filters.hasWifi ? null : true);
  };

  const handlePower = () => {
    onFilterChange('hasPowerOutlets', filters.hasPowerOutlets ? null : true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4" role="region" aria-label={LOCALIZATION.aria.filterRegion}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[0.9375rem] font-semibold text-gray-900">
          {LOCALIZATION.filters.title}
          {activeFilters > 0 && (
            <span className="ml-1 text-green-500">({activeFilters})</span>
          )}
        </span>
        {activeFilters > 0 && (
          <button className="text-[0.8125rem] text-green-500 font-medium px-2 py-1 rounded transition-colors hover:bg-green-500/10" onClick={onClear}>
            {LOCALIZATION.buttons.clear}
          </button>
        )}
      </div>

      <div className="mb-4">
        <span className="block text-[0.8125rem] font-medium text-gray-500 mb-2">{LOCALIZATION.filters.availability}</span>
        <div className="flex flex-wrap gap-2">
          {availabilityOptions.map((opt) => (
            <button
              key={opt.value}
              className={`px-3 py-1.5 rounded-full text-[0.8125rem] font-medium transition-all ${
                filters.availability === opt.value
                  ? 'bg-green-500 border border-green-500 text-white hover:bg-green-600 hover:border-green-600'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-500'
              }`}
              onClick={() => handleAvailability(opt.value)}
              aria-pressed={filters.availability === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="block text-[0.8125rem] font-medium text-gray-500 mb-2">{LOCALIZATION.filters.quietness}</span>
        <div className="flex flex-wrap gap-2">
          {quietnessLevels.map((level) => (
            <button
              key={level}
              className={`px-3 py-1.5 rounded-full text-[0.8125rem] font-medium transition-all ${
                filters.quietnessLevel === level
                  ? 'bg-green-500 border border-green-500 text-white hover:bg-green-600 hover:border-green-600'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-500'
              }`}
              onClick={() => handleQuietness(level)}
              aria-pressed={filters.quietnessLevel === level}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="block text-[0.8125rem] font-medium text-gray-500 mb-2">{LOCALIZATION.filters.wifi}</span>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-[0.8125rem] font-medium transition-all ${
              filters.hasWifi
                ? 'bg-green-500 border border-green-500 text-white hover:bg-green-600 hover:border-green-600'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-500'
            }`}
            onClick={handleWifi}
            aria-pressed={!!filters.hasWifi}
          >
            {LOCALIZATION.filters.wifiAvailable}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <span className="block text-[0.8125rem] font-medium text-gray-500 mb-2">{LOCALIZATION.filters.power}</span>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-[0.8125rem] font-medium transition-all ${
              filters.hasPowerOutlets
                ? 'bg-green-500 border border-green-500 text-white hover:bg-green-600 hover:border-green-600'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-500'
            }`}
            onClick={handlePower}
            aria-pressed={!!filters.hasPowerOutlets}
          >
            {LOCALIZATION.filters.powerAvailable}
          </button>
        </div>
      </div>
      <div>
        <span className="block text-[0.8125rem] font-medium text-gray-500 mb-2">{LOCALIZATION.filters.distance}</span>
        <div className="flex flex-wrap gap-2">
          {distanceOptions.map((opt) => (
            <button
              key={opt.value}
              className={`px-3 py-1.5 rounded-full text-[0.8125rem] font-medium transition-all ${
                filters.maxDistance === opt.value
                  ? 'bg-green-500 border border-green-500 text-white hover:bg-green-600 hover:border-green-600'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-500'
              }`}
              onClick={() => handleDistance(opt.value)}
              aria-pressed={filters.maxDistance === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
