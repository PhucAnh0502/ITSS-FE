import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewCard from '../../../components/ReviewCard';

const mockReview = {
  id: 'review-001',
  workspaceId: 'the-lab-coffee',
  reviewerName: 'Nguyễn Văn A',
  reviewerAvatar: 'https://i.pravatar.cc/150?img=1',
  badge: 'Top Reviewer',
  badgeLabelJa: 'Trusted Explorer',
  rating: 4.5,
  text: 'Không gian yên tĩnh, rất phù hợp để học tập. Wi-Fi ổn định và cà phê ngon.',
  media: [
    { url: 'https://picsum.photos/seed/rev001a/400/300', type: 'image' },
    { url: 'https://picsum.photos/seed/rev001b/400/300', type: 'video' },
  ],
  postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  helpfulCount: 12,
  comments: [
    { id: 'c1', authorName: 'Trần B', text: 'Bình luận', postedAt: '2024-12-15T14:00:00Z' },
    { id: 'c2', authorName: 'Lê C', text: 'Bình luận 2', postedAt: '2024-12-15T15:00:00Z' },
  ],
  category: 'cafe',
};

describe('ReviewCard', () => {
  it('renders reviewer avatar', () => {
    render(<ReviewCard review={mockReview} />);
    const avatar = screen.getByAltText('Nguyễn Văn A');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockReview.reviewerAvatar);
  });

  it('renders reviewer name and badge', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.getByText('Trusted Explorer')).toBeInTheDocument();
  });

  it('renders relative time in Japanese', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('2時間前')).toBeInTheDocument();
  });

  it('renders star rating', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders review text', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(mockReview.text)).toBeInTheDocument();
  });

  it('renders media images', () => {
    const { container } = render(<ReviewCard review={mockReview} />);
    const mediaImages = container.querySelectorAll('.review-card__media-image');
    expect(mediaImages.length).toBe(2);
  });

  it('renders "Short Video" label on video media', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('Short Video')).toBeInTheDocument();
  });

  it('renders helpful button with count', () => {
    render(<ReviewCard review={mockReview} helpfulCount={12} />);
    expect(screen.getByText('役に立った')).toBeInTheDocument();
    expect(screen.getByText('(12)')).toBeInTheDocument();
  });

  it('highlights helpful button when isHelpfulActive is true', () => {
    render(<ReviewCard review={mockReview} isHelpfulActive={true} helpfulCount={13} />);
    const btn = screen.getByText('役に立った').closest('button');
    expect(btn).toHaveClass('review-card__helpful-btn--active');
  });

  it('calls onHelpful when helpful button is clicked', () => {
    const onHelpful = vi.fn();
    render(<ReviewCard review={mockReview} onHelpful={onHelpful} helpfulCount={12} />);
    const btn = screen.getByText('役に立った').closest('button');
    fireEvent.click(btn);
    expect(onHelpful).toHaveBeenCalledWith('review-001');
  });

  it('renders comment count', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('コメント (2)')).toBeInTheDocument();
  });

  it('renders without media when media is empty', () => {
    const reviewNoMedia = { ...mockReview, media: [] };
    render(<ReviewCard review={reviewNoMedia} />);
    // Only avatar image
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(1);
  });

  it('renders relative time for days ago', () => {
    const reviewDaysAgo = {
      ...mockReview,
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    };
    render(<ReviewCard review={reviewDaysAgo} />);
    expect(screen.getByText('3日前')).toBeInTheDocument();
  });
});
