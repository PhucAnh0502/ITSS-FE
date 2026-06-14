import { Bell, User } from 'lucide-react';
import { LOCALIZATION } from '../utils/localization';

const tabs = [
  { id: 'explore', label: LOCALIZATION.nav.explore },
  { id: 'recommend', label: LOCALIZATION.nav.recommend },
  { id: 'community', label: LOCALIZATION.nav.community },
];

function NavigationBar({ activeTab, onTabChange }) {
  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 px-6" aria-label={LOCALIZATION.aria.mainNavigation}>
      <div className="flex items-center justify-between max-w-6xl mx-auto h-16">
        {/* Logo */}
        <span
          className="text-2xl font-bold text-green-500 italic cursor-pointer shrink-0"
          onClick={() => onTabChange('explore')}
        >
          Rauchoi
        </span>

        {/* Center Tabs */}
        <ul className="flex list-none m-0 p-0 gap-2 items-center" role="tablist">
          {tabs.map((tab) => (
            <li key={tab.id} role="presentation" className="flex">
              <button
                role="tab"
                className={`flex items-center justify-center px-5 py-2 border-none bg-transparent cursor-pointer text-[0.9375rem] font-medium leading-tight relative transition-colors rounded-full whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-green-500 font-semibold'
                    : 'text-gray-500 hover:text-green-500 hover:bg-green-500/10'
                }`}
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                type="button"
              >
                <span className="text-[0.9375rem] font-inherit">{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute -bottom-1 left-[20%] right-[20%] h-[3px] bg-green-500 rounded-t" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-gray-900 hover:bg-slate-50 transition-colors" aria-label={LOCALIZATION.aria.notification}>
            <Bell size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-gray-900 hover:bg-slate-50 transition-colors" aria-label={LOCALIZATION.aria.profile}>
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
