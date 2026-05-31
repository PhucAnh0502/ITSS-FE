import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook that saves and restores scroll position per route.
 * 
 * - Saves scroll position when leaving a route (keyed by pathname)
 * - Restores scroll position when returning to a previously visited route
 * - Uses a ref-based map to persist positions within the session
 */
export function useScrollRestore() {
  const location = useLocation();
  const scrollPositions = useRef(new Map());
  const previousPathname = useRef(null);

  useEffect(() => {
    // Save scroll position for the previous route before switching
    if (previousPathname.current !== null && previousPathname.current !== location.pathname) {
      scrollPositions.current.set(previousPathname.current, window.scrollY);
    }

    // Restore scroll position for the current route if previously visited
    const savedPosition = scrollPositions.current.get(location.pathname);
    if (savedPosition !== undefined) {
      // Use requestAnimationFrame to ensure DOM has updated before scrolling
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    } else {
      // New route - scroll to top
      window.scrollTo(0, 0);
    }

    // Update previous pathname
    previousPathname.current = location.pathname;
  }, [location.pathname]);
}

export default useScrollRestore;
