import { Bell, User } from 'lucide-react';
import './NavigationBar.css';
import { LOCALIZATION } from '../utils/localization';

const tabs = [
  { id: 'explore', label: LOCALIZATION.nav.explore },
  { id: 'recommend', label: LOCALIZATION.nav.recommend },
  { id: 'community', label: LOCALIZATION.nav.community },
];

function NavigationBar({ activeTab, onTabChange }) {
  return (
    <nav className="navigation-bar" aria-label={LOCALIZATION.aria.mainNavigation}>
      <div className="navigation-bar__inner">
        {/* Logo */}
        <span className="navigation-bar__logo" onClick={() => onTabChange('explore')}>
          Rauchoi
        </span>

        {/* Center Tabs */}
        <ul className="navigation-bar__tabs" role="tablist">
          {tabs.map((tab) => (
            <li key={tab.id} role="presentation">
              <button
                role="tab"
                className={`navigation-bar__tab ${activeTab === tab.id ? 'navigation-bar__tab--active' : ''}`}
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                type="button"
              >
                <span className="navigation-bar__label">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="navigation-bar__right">
          <button className="navigation-bar__icon-btn" aria-label={LOCALIZATION.aria.notification}>
            <Bell size={20} />
          </button>
          <button className="navigation-bar__icon-btn" aria-label={LOCALIZATION.aria.profile}>
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
