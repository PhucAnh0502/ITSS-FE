import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that determines animation direction based on navigation type.
 * 
 * - "forward" → "slide-left" (navigating deeper: TopPage→DetailPage, TopPage→SmartSearch, etc.)
 * - "backward" → "slide-right" (browser back, back arrow)
 * - "tab" → "fade" (Navigation_Bar tab switch)
 * 
 * Listens to browser popstate events to detect backward navigation.
 * Default direction is "fade".
 */
export function useTransition() {
  const [direction, setDirection] = useState('fade');

  // Listen for browser popstate (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setDirection('slide-right');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  /**
   * Sets the transition direction based on navigation type.
   * @param {"forward" | "backward" | "tab"} type - The navigation type
   */
  const onNavigate = useCallback((type) => {
    switch (type) {
      case 'forward':
        setDirection('slide-left');
        break;
      case 'backward':
        setDirection('slide-right');
        break;
      case 'tab':
        setDirection('fade');
        break;
      default:
        setDirection('fade');
        break;
    }
  }, []);

  return { direction, onNavigate };
}

export default useTransition;
