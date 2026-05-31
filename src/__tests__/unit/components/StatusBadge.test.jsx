import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../../../components/StatusBadge';

describe('StatusBadge', () => {
  it('renders green badge with "空席あり" for available status', () => {
    render(<StatusBadge status="available" />);
    const badge = screen.getByText('空席あり');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-badge--available');
  });

  it('renders orange badge with "満席" for busy status', () => {
    render(<StatusBadge status="busy" />);
    const badge = screen.getByText('満席');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-badge--busy');
  });

  it('renders gray badge with "閉店" for closed status', () => {
    render(<StatusBadge status="closed" />);
    const badge = screen.getByText('閉店');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-badge--closed');
  });

  it('defaults to closed for unknown status', () => {
    render(<StatusBadge status="unknown" />);
    const badge = screen.getByText('閉店');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-badge--closed');
  });
});
