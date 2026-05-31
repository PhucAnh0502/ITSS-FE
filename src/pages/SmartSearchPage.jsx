import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, BookOpen, UsersRound, Lightbulb, Volume2, MapPin, Star } from 'lucide-react';
import { useRecommendation } from '../hooks/useRecommendation';
import { useTransition } from '../hooks/useTransition';
import { LOCALIZATION } from '../utils/localization';
import LoadingIndicator from '../components/LoadingIndicator';
import './SmartSearchPage.css';

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
    <div className="smart-search-page">
      <motion.h1
        className="smart-search-page__heading"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {LOCALIZATION.headings.smartSearch}
      </motion.h1>
      <motion.p
        className="smart-search-page__subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {LOCALIZATION.headings.smartSearchSubtitle}
      </motion.p>

      {/* People Count Section */}
      <motion.section
        className="smart-search-page__section"
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="smart-search-page__section-title">
          <span className="smart-search-page__section-bullet"></span>
          {LOCALIZATION.smartSearch.people}
        </h2>
        <div className="smart-search-page__icon-buttons">
          {PEOPLE_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              className={`smart-search-page__icon-btn ${
                conditions.peopleCount === option.value ? 'smart-search-page__icon-btn--active' : ''
              }`}
              onClick={() => handlePeopleSelect(option.value)}
              type="button"
              aria-pressed={conditions.peopleCount === option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="smart-search-page__icon-btn-icon">{option.icon}</span>
              <span className="smart-search-page__icon-btn-label">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Purpose Section */}
      <motion.section
        className="smart-search-page__section"
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="smart-search-page__section-title">
          <span className="smart-search-page__section-bullet"></span>
          {LOCALIZATION.smartSearch.purpose}
        </h2>
        <div className="smart-search-page__icon-buttons">
          {PURPOSE_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              className={`smart-search-page__icon-btn ${
                conditions.purpose === option.value ? 'smart-search-page__icon-btn--active' : ''
              }`}
              onClick={() => handlePurposeSelect(option.value)}
              type="button"
              aria-pressed={conditions.purpose === option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="smart-search-page__icon-btn-icon">{option.icon}</span>
              <span className="smart-search-page__icon-btn-label">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Quietness Section - Slider */}
      <motion.section
        className="smart-search-page__section"
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="smart-search-page__section-title">
          <span className="smart-search-page__section-bullet"></span>
          {LOCALIZATION.smartSearch.quietness}
        </h2>
        <div className="smart-search-page__quietness">
          <div className="smart-search-page__quietness-labels">
            <span>{LOCALIZATION.smartSearch.lively}</span>
            <span>{LOCALIZATION.smartSearch.quiet}</span>
          </div>
          <div className="smart-search-page__slider-container">
            <input
              type="range"
              min="1"
              max="5"
              value={quietnessValue}
              onChange={handleQuietnessChange}
              className="smart-search-page__slider"
              aria-label={LOCALIZATION.smartSearch.quietness}
            />
          </div>
        </div>
      </motion.section>

      {/* Amenities Section */}
      <motion.section
        className="smart-search-page__section"
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="smart-search-page__section-title">
          <span className="smart-search-page__section-bullet"></span>
          {LOCALIZATION.smartSearch.amenities}
        </h2>
        <div className="smart-search-page__chips">
          {AMENITY_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              className={`smart-search-page__chip ${
                (conditions.amenities || []).includes(option.value) ? 'smart-search-page__chip--active' : ''
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
        className="smart-search-page__submit"
        onClick={handleSubmit}
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {LOCALIZATION.buttons.search}
      </motion.button>

      {/* Loading State */}
      {loading && (
        <div className="smart-search-page__loading">
          <LoadingIndicator />
        </div>
      )}

      {/* Results Section */}
      <AnimatePresence>
        {!loading && hasSearched && results.length > 0 && (
          <motion.section
            className="smart-search-page__results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="smart-search-page__results-title">
              <Volume2 size={18} className="smart-search-page__results-icon" />
              {LOCALIZATION.headings.results}
            </h2>
            <div className="smart-search-page__results-list">
              {results.map((workspace, index) => (
                <motion.article
                  key={workspace.id}
                  className="smart-search-page__result-card"
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
                  <div className="smart-search-page__result-image-container">
                    {workspace.photos && workspace.photos[0] ? (
                      <img
                        className="smart-search-page__result-image"
                        src={workspace.photos[0]}
                        alt={workspace.name || 'ワークスペース'}
                        loading="lazy"
                      />
                    ) : (
                      <div className="smart-search-page__result-image-placeholder" />
                    )}
                  </div>
                  <div className="smart-search-page__result-info">
                    <h3 className="smart-search-page__result-name">{workspace.name}</h3>
                    <div className="smart-search-page__result-meta">
                      <span className="smart-search-page__result-distance">
                        <MapPin size={12} /> {workspace.distanceFromHust != null ? `${workspace.distanceFromHust}km` : '—'}
                      </span>
                      <span className="smart-search-page__result-rating">
                        <Star size={12} fill="#f59e0b" stroke="#f59e0b" /> {typeof workspace.rating === 'number' ? workspace.rating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                    {workspace.featureTags && workspace.featureTags.length > 0 && (
                      <div className="smart-search-page__result-tags">
                        {workspace.featureTags.slice(0, 5).map((tag, index) => (
                          <span key={index} className="smart-search-page__result-tag">
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
          className="smart-search-page__no-results"
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
