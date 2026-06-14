import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, BookOpen, UsersRound, Lightbulb, Volume2, MapPin, Star } from 'lucide-react';
import { useRecommendation } from '../hooks/useRecommendation';
import { useTransition } from '../hooks/useTransition';
import { LOCALIZATION } from '../utils/localization';
import LoadingIndicator from '../components/LoadingIndicator';

const PEOPLE_OPTIONS = [
  { value: '1', label: '1人', icon: <User size={20} /> },
  { value: '2', label: '2人', icon: <Users size={20} /> },
  { value: '3-4', label: '3〜4人', icon: <UsersRound size={20} /> },
  { value: '5+', label: '5人以上', icon: <UsersRound size={20} /> },
];

const PURPOSE_OPTIONS = [
  { value: 'study-alone', label: LOCALIZATION.smartSearch.studyAlone, icon: <BookOpen size={20} /> },
  { value: 'group-work', label: LOCALIZATION.smartSearch.groupWork, icon: <UsersRound size={20} /> },
  { value: 'meeting', label: LOCALIZATION.smartSearch.meeting, icon: <Lightbulb size={20} /> },
];

const AMENITY_OPTIONS = [
  { value: 'near-outlet', label: LOCALIZATION.amenityLabels.nearOutlet },
  { value: 'many-outlets', label: LOCALIZATION.amenityLabels.manyOutlets },
  { value: 'ac', label: LOCALIZATION.amenityLabels.ac },
  { value: 'parking', label: LOCALIZATION.amenityLabels.parking },
  { value: 'food', label: LOCALIZATION.amenityLabels.food },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

const resultVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

/**
 * SmartSearchPage - Step-by-step questionnaire for workspace recommendations.
 * Japanese UI with green theme and framer-motion animations.
 */
function SmartSearchPage() {
  const navigate = useNavigate();
  const { direction, onNavigate } = useTransition();
  const { conditions, setConditions, submit, results, loading } = useRecommendation();
  const [hasSearched, setHasSearched] = useState(false);
  const [quietnessValue, setQuietnessValue] = useState(3);

  const handlePeopleSelect = (value) => {
    setConditions('peopleCount', value);
  };

  const handlePurposeSelect = (value) => {
    setConditions('purpose', value);
  };

  const handleQuietnessChange = (e) => {
    const level = parseInt(e.target.value);
    setQuietnessValue(level);
    setConditions('quietnessLevel', level);
  };

  const handleAmenityToggle = (amenity) => {
    const current = conditions.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setConditions('amenities', updated);
  };

  const handleSubmit = () => {
    setHasSearched(true);
    submit();
  };

  const handleResultClick = (workspace) => {
    onNavigate('forward');
    navigate(`/workspace/${workspace.id}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto md:p-4">
      <motion.h1
        className="text-[1.75rem] font-extrabold mb-2 text-brand-gradient text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {LOCALIZATION.headings.smartSearch}
      </motion.h1>
      <motion.p
        className="text-[0.9rem] text-gray-500 text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {LOCALIZATION.headings.smartSearchSubtitle}
      </motion.p>

      {/* People Count Section */}
      <motion.section
        className="mb-7"
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-base font-semibold mb-3 text-gray-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0"></span>
          {LOCALIZATION.smartSearch.people}
        </h2>
        <div className="flex gap-3 flex-wrap">
          {PEOPLE_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              className={`flex flex-col items-center justify-center gap-1 py-3.5 px-5 border-2 rounded-xl cursor-pointer transition-all min-w-[80px] ${
                conditions.peopleCount === option.value
                  ? 'border-transparent bg-brand-gradient text-white shadow-sm shadow-violet-500/30 hover:opacity-90'
                  : 'border-violet-200 bg-white text-inherit hover:border-violet-400 hover:bg-violet-50'
              }`}
              onClick={() => handlePeopleSelect(option.value)}
              type="button"
              aria-pressed={conditions.peopleCount === option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">{option.icon}</span>
              <span className="text-xs font-medium">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Purpose Section */}
      <motion.section
        className="mb-7"
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-base font-semibold mb-3 text-gray-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shrink-0"></span>
          {LOCALIZATION.smartSearch.purpose}
        </h2>
        <div className="flex gap-3 flex-wrap">
          {PURPOSE_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              className={`flex flex-col items-center justify-center gap-1 py-3.5 px-5 border-2 rounded-xl cursor-pointer transition-all min-w-[80px] ${
                conditions.purpose === option.value
                  ? 'border-transparent bg-brand-gradient text-white shadow-sm shadow-violet-500/30 hover:opacity-90'
                  : 'border-violet-200 bg-white text-inherit hover:border-violet-400 hover:bg-violet-50'
              }`}
              onClick={() => handlePurposeSelect(option.value)}
              type="button"
              aria-pressed={conditions.purpose === option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">{option.icon}</span>
              <span className="text-xs font-medium">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Quietness Section - Slider */}
      <motion.section
        className="mb-7"
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-base font-semibold mb-3 text-gray-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
          {LOCALIZATION.smartSearch.quietness}
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{LOCALIZATION.smartSearch.lively}</span>
            <span>{LOCALIZATION.smartSearch.quiet}</span>
          </div>
          <div className="px-1">
            <input
              type="range"
              min="1"
              max="5"
              value={quietnessValue}
              onChange={handleQuietnessChange}
              className="w-full h-1.5 appearance-none rounded-sm bg-gray-200 outline-none cursor-pointer accent-amber-500"
              aria-label={LOCALIZATION.smartSearch.quietness}
            />
          </div>
        </div>
      </motion.section>

      {/* Amenities Section */}
      <motion.section
        className="mb-7"
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-base font-semibold mb-3 text-gray-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0"></span>
          {LOCALIZATION.smartSearch.amenities}
        </h2>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              className={`px-4 py-2 border-2 rounded-[20px] cursor-pointer text-sm transition-all ${
                (conditions.amenities || []).includes(option.value)
                  ? 'border-transparent bg-brand-gradient text-white shadow-sm shadow-violet-500/30 hover:opacity-90'
                  : 'border-violet-200 bg-white text-inherit hover:border-violet-400 hover:bg-violet-50'
              }`}
              onClick={() => handleAmenityToggle(option.value)}
              type="button"
              aria-pressed={(conditions.amenities || []).includes(option.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Submit Button */}
      <motion.button
        className="block w-full py-4 border-none rounded-xl bg-brand-gradient text-white text-base font-semibold cursor-pointer transition-all mt-2 mb-6 shadow-lg shadow-violet-500/30 hover:opacity-95 hover:shadow-xl hover:shadow-fuchsia-500/30"
        onClick={handleSubmit}
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {LOCALIZATION.buttons.search}
      </motion.button>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingIndicator />
        </div>
      )}

      {/* Results Section */}
      <AnimatePresence>
        {!loading && hasSearched && results.length > 0 && (
          <motion.section
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <Volume2 size={18} />
              {LOCALIZATION.headings.results}
            </h2>
            <div className="flex flex-col gap-4">
              {results.map((workspace, index) => (
                <motion.article
                  key={workspace.id}
                  className="group flex gap-4 p-4 rounded-2xl bg-white ring-1 ring-violet-100 shadow-sm cursor-pointer transition-all hover:shadow-2xl hover:shadow-violet-500/20 hover:ring-violet-300 hover:-translate-y-1 focus:outline-2 focus:outline-violet-500 focus:outline-offset-2"
                  custom={index}
                  variants={resultVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleResultClick(workspace)}
                  role="button"
                  tabIndex={0}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleResultClick(workspace);
                    }
                  }}
                >
                  <div className="shrink-0 w-[120px] h-[90px] rounded-xl overflow-hidden">
                    {workspace.photos && workspace.photos[0] ? (
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        src={workspace.photos[0]}
                        alt={workspace.name || 'ワークスペース'}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 m-0 whitespace-nowrap overflow-hidden text-ellipsis">{workspace.name}</h3>
                    <div className="flex gap-3 text-[0.8125rem] text-gray-500 items-center">
                      <span className="flex items-center gap-1 text-fuchsia-500">
                        <MapPin size={12} /> {workspace.distanceFromHust != null ? `${workspace.distanceFromHust}km` : '—'}
                      </span>
                      <span className="text-amber-500 font-semibold flex items-center gap-1">
                        <Star size={12} fill="#f59e0b" stroke="#f59e0b" /> {typeof workspace.rating === 'number' ? workspace.rating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                    {workspace.featureTags && workspace.featureTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {workspace.featureTags.slice(0, 5).map((tag, index) => (
                          <span key={index} className="px-2 py-0.5 rounded-[10px] border border-violet-100 bg-violet-50 text-[0.6875rem] text-violet-700 font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* No Results State */}
      {!loading && hasSearched && results.length === 0 && (
        <motion.div
          className="text-center py-8 text-gray-500 text-[0.9375rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>{LOCALIZATION.empty.noRecommendations}</p>
        </motion.div>
      )}
    </div>
  );
}

export default SmartSearchPage;
