import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTransition } from '../../hooks/useTransition';

describe('useTransition', () => {
  let addEventListenerSpy;
  let removeEventListenerSpy;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should have "fade" as the default direction', () => {
    const { result } = renderHook(() => useTransition());
    expect(result.current.direction).toBe('fade');
  });

  it('should set direction to "slide-left" when onNavigate is called with "forward"', () => {
    const { result } = renderHook(() => useTransition());

    act(() => {
      result.current.onNavigate('forward');
    });

    expect(result.current.direction).toBe('slide-left');
  });

  it('should set direction to "slide-right" when onNavigate is called with "backward"', () => {
    const { result } = renderHook(() => useTransition());

    act(() => {
      result.current.onNavigate('backward');
    });

    expect(result.current.direction).toBe('slide-right');
  });

  it('should set direction to "fade" when onNavigate is called with "tab"', () => {
    const { result } = renderHook(() => useTransition());

    // First set to something else
    act(() => {
      result.current.onNavigate('forward');
    });
    expect(result.current.direction).toBe('slide-left');

    // Then switch to tab
    act(() => {
      result.current.onNavigate('tab');
    });
    expect(result.current.direction).toBe('fade');
  });

  it('should default to "fade" for unknown navigation types', () => {
    const { result } = renderHook(() => useTransition());

    act(() => {
      result.current.onNavigate('forward');
    });
    expect(result.current.direction).toBe('slide-left');

    act(() => {
      result.current.onNavigate('unknown');
    });
    expect(result.current.direction).toBe('fade');
  });

  it('should listen to popstate events and set direction to "slide-right"', () => {
    const { result } = renderHook(() => useTransition());

    expect(addEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));

    // Simulate popstate event
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.direction).toBe('slide-right');
  });

  it('should remove popstate listener on unmount', () => {
    const { unmount } = renderHook(() => useTransition());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
  });

  it('should return a stable onNavigate function reference', () => {
    const { result, rerender } = renderHook(() => useTransition());

    const firstRef = result.current.onNavigate;
    rerender();
    const secondRef = result.current.onNavigate;

    expect(firstRef).toBe(secondRef);
  });
});
