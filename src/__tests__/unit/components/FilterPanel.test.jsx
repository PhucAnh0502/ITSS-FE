import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '../../../components/FilterPanel';

const defaultFilters = {
  availability: null,
  quietnessLevel: null,
  hasWifi: null,
  hasPowerOutlets: null,
  maxDistance: null,
};

describe('FilterPanel', () => {
  it('renders all filter sections with Japanese labels', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.getByText('空き状況')).toBeInTheDocument();
    expect(screen.getByText('静かさ')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('電源')).toBeInTheDocument();
  });

  it('renders availability buttons in Japanese', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.getByText('空席あり')).toBeInTheDocument();
    expect(screen.getByText('満席')).toBeInTheDocument();
  });

  it('renders Wi-Fi and power toggle buttons in Japanese', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.getByText('Wi-Fiあり')).toBeInTheDocument();
    expect(screen.getByText('電源あり')).toBeInTheDocument();
  });

  it('renders distance options', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    );
  });

  it('calls onFilterChange with key and value when availability is clicked', () => {
    const handleChange = vi.fn();
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={handleChange}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText('空席あり'));
    expect(handleChange).toHaveBeenCalledWith('availability', 'available');
  });

  it('toggles availability off when clicking already-selected value', () => {
    const handleChange = vi.fn();
    const filters = { ...defaultFilters, availability: 'available' };
    render(
      <FilterPanel
        filters={filters}
        activeFilters={1}
        onFilterChange={handleChange}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText('空席あり'));
    expect(handleChange).toHaveBeenCalledWith('availability', null);
  });

  it('calls onFilterChange for quietness level', () => {
    const handleChange = vi.fn();
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={handleChange}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText('3'));
    expect(handleChange).toHaveBeenCalledWith('quietnessLevel', 3);
  });

  it('calls onFilterChange for Wi-Fi toggle', () => {
    const handleChange = vi.fn();
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={handleChange}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText('Wi-Fiあり'));
    expect(handleChange).toHaveBeenCalledWith('hasWifi', true);
  });

  it('calls onFilterChange for power outlets toggle', () => {
    const handleChange = vi.fn();
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={handleChange}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText('電源あり'));
    expect(handleChange).toHaveBeenCalledWith('hasPowerOutlets', true);
  });

  it('calls onFilterChange for distance', () => {
    const handleChange = vi.fn();
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={handleChange}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText('2km'));
    expect(handleChange).toHaveBeenCalledWith('maxDistance', 2);
  });

  it('shows active filter count', () => {
    render(
      <FilterPanel
        filters={{ ...defaultFilters, hasWifi: true, availability: 'available' }}
        activeFilters={2}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.getByText('(2)')).toBeInTheDocument();
  });

  it('shows clear button when filters are active', () => {
    render(
      <FilterPanel
        filters={{ ...defaultFilters, hasWifi: true }}
        activeFilters={1}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.getByText('クリア')).toBeInTheDocument();
  });

  it('does not show clear button when no filters are active', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        activeFilters={0}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.queryByText('クリア')).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const handleClear = vi.fn();
    render(
      <FilterPanel
        filters={{ ...defaultFilters, hasWifi: true }}
        activeFilters={1}
        onFilterChange={() => {}}
        onClear={handleClear}
      />
    );
    fireEvent.click(screen.getByText('クリア'));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('highlights active filter buttons', () => {
    const filters = { ...defaultFilters, availability: 'available', hasWifi: true };
    render(
      <FilterPanel
        filters={filters}
        activeFilters={2}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.getByText('空席あり')).toHaveClass('filter-panel__btn--active');
    expect(screen.getByText('Wi-Fiあり')).toHaveClass('filter-panel__btn--active');
    expect(screen.getByText('満席')).not.toHaveClass('filter-panel__btn--active');
  });
});
