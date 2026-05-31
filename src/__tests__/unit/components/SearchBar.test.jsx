import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../../../components/SearchBar';

describe('SearchBar', () => {
  it('renders with default Japanese placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', '理想の学習スペースを探す...');
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="カスタム検索" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'カスタム検索');
  });

  it('displays the search icon', () => {
    const { container } = render(<SearchBar value="" onChange={() => {}} />);
    // Lucide Search icon renders as SVG
    const svg = container.querySelector('.search-bar__icon svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="test" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test');
  });

  it('calls onChange with input value on every keystroke', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'cafe' } });
    expect(handleChange).toHaveBeenCalledWith('cafe');
  });

  it('has accessible label in Japanese', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByLabelText('検索')).toBeInTheDocument();
  });
});
