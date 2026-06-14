import { Bell, User } from 'lucide-react';
import { LOCALIZATION } from '../utils/localization';

const tabs = [
  { id: 'explore', label: LOCALIZATION.nav.explore },
  { id: 'recommend', label: LOCALIZATION.nav.recommend },
  { id: 'community', label: LOCALIZATION.nav.community },
];

function NavigationBar({ activeTab, onTabChange }) {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-violet-100 sticky top-0 z-50 px-6 shadow-sm shadow-violet-500/5" aria-label={LOCALIZATION.aria.mainNavigation}>
      <div className="flex items-center justify-between max-w-6xl mx-auto h-16">
        {/* Logo */}
        <span
          className="text-2xl font-extrabold text-brand-gradient italic cursor-pointer shrink-0 tracking-tight"
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
                    ? 'text-violet-600 font-semibold'
                    : 'text-gray-500 hover:text-violet-600 hover:bg-violet-500/10'
                }`}
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                type="button"
              >
                <span className="text-[0.9375rem] font-inherit">{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute -bottom-1 left-[20%] right-[20%] h-[3px] bg-brand-gradient rounded-t" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-colors" aria-label={LOCALIZATION.aria.notification}>
            <Bell size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-gradient text-white border-none cursor-pointer shadow-sm shadow-violet-500/30 hover:opacity-90 transition-opacity" aria-label={LOCALIZATION.aria.profile}>
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
