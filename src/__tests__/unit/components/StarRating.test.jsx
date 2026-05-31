import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StarRating from '../../../components/StarRating';

describe('StarRating', () => {
  it('renders 5 stars', () => {
    const { container } = render(<StarRating rating={3} />);
    const stars = container.querySelectorAll('.star');
    expect(stars.length).toBe(5);
  });

  it('fills correct number of stars based on rating', () => {
    const { container } = render(<StarRating rating={4} />);
    const filled = container.querySelectorAll('.star--filled');
    const empty = container.querySelectorAll('.star--empty');
    expect(filled.length).toBe(4);
    expect(empty.length).toBe(1);
  });

  it('displays numeric rating value', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('displays count when provided', () => {
    render(<StarRating rating={4.0} count={25} />);
    expect(screen.getByText('(25件)')).toBeInTheDocument();
  });

  it('does not display count when not provided', () => {
    render(<StarRating rating={4.0} />);
    expect(screen.queryByText(/件/)).not.toBeInTheDocument();
  });

  it('rounds rating for star display', () => {
    const { container } = render(<StarRating rating={3.7} />);
    const filled = container.querySelectorAll('.star--filled');
    expect(filled.length).toBe(4); // 3.7 rounds to 4
  });
});
