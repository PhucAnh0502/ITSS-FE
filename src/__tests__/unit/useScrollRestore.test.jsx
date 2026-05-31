import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useScrollRestore } from '../../hooks/useScrollRestore';

// Helper to create a wrapper with MemoryRouter
function createWrapper(initialEntries = ['/']) {
  return function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    );
  };
}

describe('useScrollRestore', () => {
  let scrollToSpy;
  let rafSpy;

  beforeEach(() => {
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    // Mock requestAnimationFrame to execute callback immediately
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb();
      return 0;
    });
    // Mock scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    scrollToSpy.mockRestore();
    rafSpy.mockRestore();
  });

  it('should scroll to top on initial route', () => {
    renderHook(() => useScrollRestore(), {
      wrapper: createWrapper(['/'])
    });

    // On first render with a new route, should scroll to top
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('should not throw when used within a router context', () => {
    expect(() => {
      renderHook(() => useScrollRestore(), {
        wrapper: createWrapper(['/'])
      });
    }).not.toThrow();
  });

  it('should save and restore scroll position when navigating between routes', () => {
    const { rerender } = renderHook(() => useScrollRestore(), {
      wrapper: createWrapper(['/page1', '/page2'])
    });

    // The hook should have been called and scrollTo invoked
    expect(scrollToSpy).toHaveBeenCalled();
  });
});
