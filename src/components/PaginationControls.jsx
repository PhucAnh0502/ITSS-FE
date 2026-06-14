import { motion } from 'framer-motion';

/**
 * PaginationControls - ページネーションコンポーネント
 * @param {number} currentPage - 現在のページ番号 (1-indexed)
 * @param {number} totalPages - 総ページ数
 * @param {function} onPageChange - ページ変更コールバック
 */
export default function PaginationControls({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const btnBase = 'flex items-center justify-center min-w-[40px] h-10 px-3 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all select-none';
  const btnHover = 'hover:border-green-500 hover:text-green-500 hover:bg-green-50';
  const btnDisabled = 'disabled:opacity-40 disabled:cursor-not-allowed';
  const btnActive = 'bg-green-500 border-green-500 text-black font-semibold hover:bg-green-600 hover:border-green-600 hover:text-white';

  return (
    <nav className="flex items-center justify-center gap-2 mt-8 py-4 flex-wrap" aria-label="ページネーション">
      {/* Previous button */}
      <motion.button
        className={`${btnBase} ${btnHover} ${btnDisabled}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
      >
        前へ
      </motion.button>

      {/* Page number buttons */}
      {pageNumbers.map((page) => (
        <motion.button
          key={page}
          className={`${btnBase} ${page === currentPage ? btnActive : `${btnHover} ${btnDisabled}`}`}
          onClick={() => onPageChange(page)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </motion.button>
      ))}

      {/* Next button */}
      <motion.button
        className={`${btnBase} ${btnHover} ${btnDisabled}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
      >
        次へ
      </motion.button>

      {/* Page indicator */}
      <span className="text-sm text-gray-500 ml-3 whitespace-nowrap">
        ページ {currentPage} / {totalPages}
      </span>
    </nav>
  );
}
