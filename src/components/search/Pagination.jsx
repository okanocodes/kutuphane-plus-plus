export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-9 h-9 rounded-lg font-metadata-mono text-sm font-semibold transition-all active:scale-90 cursor-pointer ${
            currentPage === i
              ? 'bg-ember-orange text-white shadow-md'
              : 'bg-surface-container border border-outline-variant text-on-surface hover:border-vivid-purple'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-xs py-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all active:scale-90 ${
          currentPage === 1
            ? 'border-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed'
            : 'border-outline-variant text-on-surface hover:border-vivid-purple cursor-pointer'
        }`}
      >
        <span className="material-symbols-outlined text-sm">chevron_left</span>
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all active:scale-90 ${
          currentPage === totalPages
            ? 'border-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed'
            : 'border-outline-variant text-on-surface hover:border-vivid-purple cursor-pointer'
        }`}
      >
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
