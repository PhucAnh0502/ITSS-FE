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
    <div className="filter-panel" role="region" aria-label={LOCALIZATION.aria.filterRegion}>
      <div className="filter-panel__header">
        <span className="filter-panel__title">
          {LOCALIZATION.filters.title}
          {activeFilters > 0 && (
            <span className="filter-panel__count">({activeFilters})</span>
          )}
        </span>
        {activeFilters > 0 && (
          <button className="filter-panel__clear" onClick={onClear}>
            {LOCALIZATION.buttons.clear}
          </button>
        )}
      </div>

      <div className="filter-panel__section">
        <span className="filter-panel__label">{LOCALIZATION.filters.availability}</span>
        <div className="filter-panel__buttons">
          {availabilityOptions.map((opt) => (
            <button
              key={opt.value}
              className={`filter-panel__btn ${
                filters.availability === opt.value ? 'filter-panel__btn--active' : ''
              }`}
              onClick={() => handleAvailability(opt.value)}
              aria-pressed={filters.availability === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel__section">
        <span className="filter-panel__label">{LOCALIZATION.filters.quietness}</span>
        <div className="filter-panel__buttons">
          {quietnessLevels.map((level) => (
            <button
              key={level}
              className={`filter-panel__btn ${
                filters.quietnessLevel === level ? 'filter-panel__btn--active' : ''
              }`}
              onClick={() => handleQuietness(level)}
              aria-pressed={filters.quietnessLevel === level}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel__section">
        <span className="filter-panel__label">{LOCALIZATION.filters.wifi}</span>
        <div className="filter-panel__buttons">
          <button
            className={`filter-panel__btn filter-panel__btn--toggle ${
              filters.hasWifi ? 'filter-panel__btn--active' : ''
            }`}
            onClick={handleWifi}
            aria-pressed={!!filters.hasWifi}
          >
            {LOCALIZATION.filters.wifiAvailable}
          </button>
        </div>
      </div>

      <div className="filter-panel__section">
        <span className="filter-panel__label">{LOCALIZATION.filters.power}</span>
        <div className="filter-panel__buttons">
          <button
            className={`filter-panel__btn filter-panel__btn--toggle ${
              filters.hasPowerOutlets ? 'filter-panel__btn--active' : ''
            }`}
            onClick={handlePower}
            aria-pressed={!!filters.hasPowerOutlets}
          >
            {LOCALIZATION.filters.powerAvailable}
          </button>
        </div>
      </div>

    </div>
  );
}

export default FilterPanel;
