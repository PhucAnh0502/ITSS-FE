import { useState, useEffect, useRef } from 'react';
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
import PaginationControls from '../components/PaginationControls';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

const PAGE_SIZE = 6;

/**
 * TopPage - Main workspace listing page with search, category tags, and filters.
 */
function TopPage() {
  const navigate = useNavigate();
  const { direction, onNavigate } = useTransition();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef(null);

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

  // Reset to page 1 when search/filter/category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, activeFilters]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredWorkspaces.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedWorkspaces = filteredWorkspaces.slice(startIndex, startIndex + PAGE_SIZE);

  // Handle page change with scroll to grid
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Navigate to detail page on card click
  const handleCardClick = (workspace) => {
    onNavigate('forward');
    navigate(`/workspace/${workspace.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <LoadingIndicator />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto md:p-4">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-violet-100 shadow-sm mb-6 px-6 py-10 md:px-10 md:py-14">
        <div className="absolute inset-0 hero-mesh" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-faint opacity-70" aria-hidden="true" />
        <div className="relative">
          <motion.h1
            className="text-[2.5rem] md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05] m-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {LOCALIZATION.hero.title}
            <br />
            <span className="text-brand-gradient">{LOCALIZATION.hero.titleAccent}</span>
          </motion.h1>
          <motion.p
            className="mt-4 mb-7 max-w-xl text-gray-600 text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {LOCALIZATION.hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <SearchBar value={query} onChange={setQuery} />
          </motion.div>
        </div>
      </section>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <h2 className="text-2xl font-extrabold m-0 text-brand-gradient">{LOCALIZATION.headings.searchSpaces}</h2>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-violet-200 text-violet-600 text-sm font-medium cursor-pointer transition-all shadow-sm shadow-violet-500/10 hover:bg-violet-50 hover:border-violet-400 hover:shadow-md"
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 auto-rows-fr items-stretch" ref={gridRef}>
            {paginatedWorkspaces.map((workspace, index) => {
              const isFeatured = index === 0;
              return (
                <motion.div
                  key={workspace.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className={`h-full ${isFeatured ? 'md:col-span-2 lg:row-span-2' : ''}`}
                >
                  <WorkspaceCard
                    workspace={workspace}
                    onClick={handleCardClick}
                    featured={isFeatured}
                  />
                </motion.div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-brand-gradient text-white border-none flex items-center justify-center text-2xl shadow-lg shadow-violet-500/40 cursor-pointer z-50 hover:scale-105 hover:shadow-xl hover:shadow-fuchsia-500/50 transition-all md:bottom-6 md:right-6 md:w-12 md:h-12"
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
