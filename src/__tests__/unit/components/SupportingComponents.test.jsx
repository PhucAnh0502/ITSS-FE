import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorMessage from '../../../components/ErrorMessage';
import EmptyState from '../../../components/EmptyState';

describe('LoadingIndicator', () => {
  it('renders loading text in Japanese', () => {
    render(<LoadingIndicator />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('renders spinner element', () => {
    const { container } = render(<LoadingIndicator />);
    expect(container.querySelector('.loading-indicator__spinner')).toBeInTheDocument();
  });
});

describe('ErrorMessage', () => {
  it('renders error message text', () => {
    render(<ErrorMessage message="Không thể tải dữ liệu" />);
    expect(screen.getByText('Không thể tải dữ liệu')).toBeInTheDocument();
  });

  it('has alert role for accessibility', () => {
    render(<ErrorMessage message="Lỗi" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders warning icon', () => {
    render(<ErrorMessage message="Lỗi" />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState message="Không tìm thấy không gian phù hợp với điều kiện" />);
    expect(screen.getByText('Không tìm thấy không gian phù hợp với điều kiện')).toBeInTheDocument();
  });

  it('renders empty state icon', () => {
    render(<EmptyState message="Thông báo" />);
    expect(screen.getByText('📭')).toBeInTheDocument();
  });
});
