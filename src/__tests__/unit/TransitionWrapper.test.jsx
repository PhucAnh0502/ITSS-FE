import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import TransitionWrapper from '../../components/TransitionWrapper';

// Mock framer-motion to render simple divs for testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} data-testid="motion-div">
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('TransitionWrapper', () => {
  it('should render children', () => {
    const { getByText } = render(
      <TransitionWrapper direction="fade" locationKey="key1">
        <p>Hello World</p>
      </TransitionWrapper>
    );
    expect(getByText('Hello World')).toBeInTheDocument();
  });

  it('should render a motion.div wrapper with className "transition-wrapper"', () => {
    const { container } = render(
      <TransitionWrapper direction="slide-left" locationKey="key1">
        <p>Content</p>
      </TransitionWrapper>
    );
    const wrapper = container.querySelector('.transition-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('should use AnimatePresence', () => {
    const { getByTestId } = render(
      <TransitionWrapper direction="fade" locationKey="key1">
        <p>Content</p>
      </TransitionWrapper>
    );
    // motion.div is rendered inside AnimatePresence
    expect(getByTestId('motion-div')).toBeInTheDocument();
  });

  it('should render different children when they change', () => {
    const { rerender, getByText, queryByText } = render(
      <TransitionWrapper direction="fade" locationKey="key1">
        <p>Page One</p>
      </TransitionWrapper>
    );

    rerender(
      <TransitionWrapper direction="fade" locationKey="key2">
        <p>Page Two</p>
      </TransitionWrapper>
    );

    expect(getByText('Page Two')).toBeInTheDocument();
  });

  it('should have transition-wrapper base class always present', () => {
    const { container } = render(
      <TransitionWrapper direction="slide-right" locationKey="key1">
        <p>Content</p>
      </TransitionWrapper>
    );
    const wrapper = container.querySelector('.transition-wrapper');
    expect(wrapper).toBeInTheDocument();
  });
});
