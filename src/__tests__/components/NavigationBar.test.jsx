import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NavigationBar from '../../components/NavigationBar';

describe('NavigationBar', () => {
  const defaultProps = {
    activeTab: 'explore',
    onTabChange: vi.fn(),
  };

  it('renders 3 tabs with Japanese labels', () => {
    render(<NavigationBar {...defaultProps} />);

    expect(screen.getByText('探索')).toBeInTheDocument();
    expect(screen.getByText('おすすめ')).toBeInTheDocument();
    expect(screen.getByText('コミュニティ')).toBeInTheDocument();
  });

  it('renders the Rauchoi logo', () => {
    render(<NavigationBar {...defaultProps} />);
    expect(screen.getByText('Rauchoi')).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    render(<NavigationBar {...defaultProps} activeTab="recommend" />);

    const activeButton = screen.getByRole('tab', { name: /おすすめ/ });
    expect(activeButton).toHaveClass('navigation-bar__tab--active');
    expect(activeButton).toHaveAttribute('aria-selected', 'true');
  });

  it('does not highlight inactive tabs', () => {
    render(<NavigationBar {...defaultProps} activeTab="explore" />);

    const inactiveButton = screen.getByRole('tab', { name: /コミュニティ/ });
    expect(inactiveButton).not.toHaveClass('navigation-bar__tab--active');
    expect(inactiveButton).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onTabChange with the correct tab id when a tab is clicked', () => {
    const onTabChange = vi.fn();
    render(<NavigationBar activeTab="explore" onTabChange={onTabChange} />);

    fireEvent.click(screen.getByRole('tab', { name: /コミュニティ/ }));
    expect(onTabChange).toHaveBeenCalledWith('community');
  });

  it('renders a navigation landmark with proper aria-label', () => {
    render(<NavigationBar {...defaultProps} />);

    const nav = screen.getByRole('navigation', { name: 'メインナビゲーション' });
    expect(nav).toBeInTheDocument();
  });

  it('renders a tablist role on the tab container', () => {
    render(<NavigationBar {...defaultProps} />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});
