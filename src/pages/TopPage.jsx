import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Bookmark } from 'lucide-react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useSearch } from '../hooks/useSearch';
import { useCategoryFilter } from '../hooks/useCategoryFilter';
import { useFilters } from '../hooks/useFilters';
import { useTransition } from '../hooks/useTransition';
import { LOCALIZATION } from '../utils/localization';
import WorkspaceCard from '../components/WorkspaceCard';
import { SearchBar } from '../components/SearchBar';
import { CategoryTags } from '../components/CategoryTags';
import { FilterPanel } from '../components/FilterPanel';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import './TopPage.css';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

/**
 * TopPage - Main workspace listing page with search, category tags, and filters.
 */
function TopPage() {
  const navigate = useNavigate();
  const { direction, onNavigate } = useTransition();
  const [showFilters, setShowFilters] = useState(false);

  // Data loading
  const { workspaces, loading, error } = useWorkspaces();

  // Search filtering
  const { query, setQuery, results: searchResults } = useSearch(workspaces);

  // Category filtering (applied after search)
  const {
    selectedCategory,
    setCategory,
    results: categoryResults,
  } = useCategoryFilter(searchResults);

  // Multi-criteria filtering (applied after category)
  const {
    filters,
    activeFilters,
    setFilter,
    clearFilters,
    results: filteredWorkspaces,
  } = useFilters(categoryResults);

  // Navigate to detail page on card click
  const handleCardClick = (workspace) => {
    onNavigate('forward');
    navigate(`/workspace/${workspace.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="top-page">
        <LoadingIndicator />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="top-page">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="top-page">
      {/* Search */}
      <SearchBar value={query} onChange={setQuery} />

      {/* Section Header */}
      <div className="top-page__section-header">
        <h2 className="top-page__section-title">{LOCALIZATION.headings.searchSpaces}</h2>
        <button
          className="top-page__filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={16} />
          {LOCALIZATION.buttons.filter}
        </button>
      </div>

      {/* Category Tags */}
      <CategoryTags
        tags={CategoryTags.defaultWorkspaceTags}
        selectedTag={selectedCategory}
        onSelect={setCategory}
      />

      {/* Filter Panel (toggleable with animation) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <FilterPanel
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={setFilter}
              onClear={clearFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Grid with staggered animation */}
      {filteredWorkspaces.length === 0 ? (
        <EmptyState message={LOCALIZATION.empty.noWorkspaces} />
      ) : (
        <div className="top-page__grid">
          {filteredWorkspaces.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <WorkspaceCard
                workspace={workspace}
                onClick={handleCardClick}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <motion.button
        className="top-page__fab"
        aria-label="ブックマーク"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bookmark size={24} />
      </motion.button>
    </div>
  );
}

export default TopPage;
