import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryTags } from '../../../components/CategoryTags';

const defaultTags = [
  { value: 'near-hust', label: 'Gần HUST' },
  { value: 'people', label: 'Số người' },
  { value: 'quiet', label: 'Yên tĩnh' },
  { value: 'wifi', label: 'Wifi' },
];

describe('CategoryTags', () => {
  it('renders all tags', () => {
    render(<CategoryTags tags={defaultTags} selectedTag={null} onSelect={() => {}} />);
    expect(screen.getByText('Gần HUST')).toBeInTheDocument();
    expect(screen.getByText('Số người')).toBeInTheDocument();
    expect(screen.getByText('Yên tĩnh')).toBeInTheDocument();
    expect(screen.getByText('Wifi')).toBeInTheDocument();
  });

  it('highlights the selected tag', () => {
    render(<CategoryTags tags={defaultTags} selectedTag="near-hust" onSelect={() => {}} />);
    const tag = screen.getByText('Gần HUST');
    expect(tag).toHaveClass('category-tags__tag--active');
    expect(tag).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onSelect with tag value when clicking unselected tag', () => {
    const handleSelect = vi.fn();
    render(<CategoryTags tags={defaultTags} selectedTag={null} onSelect={handleSelect} />);
    fireEvent.click(screen.getByText('Số người'));
    expect(handleSelect).toHaveBeenCalledWith('people');
  });

  it('calls onSelect with null when clicking already-selected tag (toggle off)', () => {
    const handleSelect = vi.fn();
    render(<CategoryTags tags={defaultTags} selectedTag="near-hust" onSelect={handleSelect} />);
    fireEvent.click(screen.getByText('Gần HUST'));
    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it('non-selected tags do not have active class', () => {
    render(<CategoryTags tags={defaultTags} selectedTag="near-hust" onSelect={() => {}} />);
    const tag = screen.getByText('Số người');
    expect(tag).not.toHaveClass('category-tags__tag--active');
    expect(tag).toHaveAttribute('aria-pressed', 'false');
  });

  it('has accessible group label in Japanese', () => {
    render(<CategoryTags tags={defaultTags} selectedTag={null} onSelect={() => {}} />);
    expect(screen.getByRole('group', { name: 'カテゴリフィルター' })).toBeInTheDocument();
  });
});
