import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import TransitionWrapper from '../components/TransitionWrapper';
import { useTransition } from '../hooks/useTransition';
import { useScrollRestore } from '../hooks/useScrollRestore';

/**
 * Maps route pathnames to NavigationBar tab IDs.
 */
function getActiveTab(pathname) {
  if (pathname === '/') return 'explore';
  if (pathname === '/smart-search') return 'recommend';
  if (pathname.startsWith('/reviews')) return 'community';
  return 'explore';
}

/**
 * Maps NavigationBar tab IDs to route paths.
 */
const tabRoutes = {
  explore: '/',
  recommend: '/smart-search',
  community: '/reviews',
  profile: null,
};

/**
 * MainLayout renders the horizontal NavigationBar at the top and an animated Outlet
 * wrapped in TransitionWrapper. It handles tab-based navigation and
 * determines animation direction via the useTransition hook.
 */
function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { direction, onNavigate } = useTransition();

  // Restore scroll position per route
  useScrollRestore();

  const activeTab = getActiveTab(location.pathname);

  const handleTabChange = (tabId) => {
    const route = tabRoutes[tabId];
    if (route && route !== location.pathname) {
      onNavigate('tab');
      navigate(route);
    }
  };

  return (
    <div className="main-layout">
      <NavigationBar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="main-layout__content">
        <TransitionWrapper direction={direction} locationKey={location.key}>
          <Outlet />
        </TransitionWrapper>
      </main>
    </div>
  );
}

export default MainLayout;
