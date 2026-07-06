export const SortingOptions = ({ sortBy, setSortBy }) => {
  const options = [
    { value: 'title-az', label: 'İsim (A-Z)' },
    { value: 'title-za', label: 'İsim (Z-A)' },
    { value: 'rating-desc', label: 'Puan (En Yüksek)' },
    { value: 'rating-asc', label: 'Puan (En Düşük)' },
    { value: 'pages-desc', label: 'Sayfa Sayısı (En Çok)' },
    { value: 'pages-asc', label: 'Sayfa Sayısı (En Az)' },
    { value: 'year-desc', label: 'Yayın Yılı (En Yeni)' },
    { value: 'year-asc', label: 'Yayın Yılı (En Eski)' },
  ];

  return (
    <div className="flex items-center gap-sm">
      <span className="text-sm font-medium text-on-surface-variant whitespace-nowrap hidden sm:inline">Sıralama:</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-surface-container border border-outline-variant rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-vivid-purple transition-all outline-none text-on-surface cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortingOptions;
