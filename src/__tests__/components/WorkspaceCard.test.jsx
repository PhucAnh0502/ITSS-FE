import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WorkspaceCard from '../../components/WorkspaceCard';

const mockWorkspace = {
  id: 'test-workspace',
  name: 'The Lab Coffee',
  nameJa: 'Quán cà phê yên tĩnh với không gian đặc biệt',
  category: 'cafe',
  address: '26 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội',
  photos: [
    'https://picsum.photos/seed/lab1/800/600',
    'https://picsum.photos/seed/lab2/800/600',
  ],
  availability: 'available',
  rating: 4.5,
  reviewCount: 128,
  description: 'Cách HUST 5 phút đi bộ, quán cafe yên tĩnh. Wi-Fi tốc độ cao và ổ cắm đầy đủ.',
  featureTags: ['WIFI MẠNH', 'YÊN TĨNH', 'TEAM WORK', 'Ổ CẮM RIÊNG', 'THOÁNG ĐÃNG'],
};

describe('WorkspaceCard', () => {
  it('renders workspace photo from photos[0]', () => {
    render(<WorkspaceCard workspace={mockWorkspace} />);
    const img = screen.getByAltText('The Lab Coffee');
    expect(img).toHaveAttribute('src', mockWorkspace.photos[0]);
  });

  it('renders workspace name', () => {
    render(<WorkspaceCard workspace={mockWorkspace} />);
    expect(screen.getByText('The Lab Coffee')).toBeInTheDocument();
  });

  it('renders address with pin icon', () => {
    render(<WorkspaceCard workspace={mockWorkspace} />);
    expect(screen.getByText(mockWorkspace.address)).toBeInTheDocument();
    // MapPin renders as SVG via Lucide
    const { container } = render(<WorkspaceCard workspace={mockWorkspace} />);
    const pinIcon = container.querySelector('.workspace-card__pin-icon');
    expect(pinIcon).toBeInTheDocument();
  });

  it('renders availability badge with Japanese label for available', () => {
    render(<WorkspaceCard workspace={mockWorkspace} />);
    expect(screen.getByText('空席あり')).toBeInTheDocument();
  });

  it('renders availability badge with Japanese label for busy', () => {
    const busyWorkspace = { ...mockWorkspace, availability: 'busy' };
    render(<WorkspaceCard workspace={busyWorkspace} />);
    expect(screen.getByText('満席')).toBeInTheDocument();
  });

  it('renders star rating with numeric value', () => {
    render(<WorkspaceCard workspace={mockWorkspace} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<WorkspaceCard workspace={mockWorkspace} />);
    expect(screen.getByText(mockWorkspace.description)).toBeInTheDocument();
  });

  it('renders up to 5 feature tags', () => {
    render(<WorkspaceCard workspace={mockWorkspace} />);
    mockWorkspace.featureTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders at most 5 tags even if more are provided', () => {
    const manyTags = { ...mockWorkspace, featureTags: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] };
    render(<WorkspaceCard workspace={manyTags} />);
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.queryByText('F')).not.toBeInTheDocument();
    expect(screen.queryByText('G')).not.toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(<WorkspaceCard workspace={mockWorkspace} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button', { name: /The Lab Coffee/i }));
    expect(handleClick).toHaveBeenCalledWith(mockWorkspace);
  });

  it('calls onClick on Enter key press', () => {
    const handleClick = vi.fn();
    render(<WorkspaceCard workspace={mockWorkspace} onClick={handleClick} />);
    fireEvent.keyDown(screen.getByRole('button', { name: /The Lab Coffee/i }), { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledWith(mockWorkspace);
  });

  it('renders nothing when workspace is null', () => {
    const { container } = render(<WorkspaceCard workspace={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('handles missing photos gracefully', () => {
    const noPhotos = { ...mockWorkspace, photos: [] };
    const { container } = render(<WorkspaceCard workspace={noPhotos} />);
    expect(container.querySelector('.workspace-card__image-placeholder')).toBeInTheDocument();
  });

  it('handles missing featureTags gracefully', () => {
    const noTags = { ...mockWorkspace, featureTags: [] };
    const { container } = render(<WorkspaceCard workspace={noTags} />);
    expect(container.querySelector('.workspace-card__tags')).not.toBeInTheDocument();
  });

  it('renders favorite heart button', () => {
    render(<WorkspaceCard workspace={mockWorkspace} />);
    expect(screen.getByLabelText('お気に入り')).toBeInTheDocument();
  });
});
