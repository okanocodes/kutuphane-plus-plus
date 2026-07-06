import { useState } from 'react';

export const AdvancedFilters = ({
  selectedFormats,
  onFormatChange,
  selectedLanguages,
  onLanguageChange,
  minYear,
  setMinYear,
  maxYear,
  setMaxYear,
  minPages,
  setMinPages,
  maxPages,
  setMaxPages,
  selectedBranch,
  onBranchChange,
  branches,
  clearFilters,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const formats = [
    { value: 'print', label: 'Basılı Kitap' },
    { value: 'pdf', label: 'PDF E-Kitap' },
    { value: 'epub', label: 'EPUB E-Kitap' },
    { value: 'audio', label: 'Sesli Kitap' },
  ];

  const languages = ['Türkçe', 'İngilizce', 'Almanca'];

  return (
    <div className="glass-card rounded-xl border border-outline-variant p-md space-y-md">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-headline-h3 text-base font-bold text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-ember-orange">tune</span>
          Gelişmiş Filtreler
        </h3>
        <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          expand_more
        </span>
      </div>

      {isOpen && (
        <div className="space-y-md pt-sm animate-fade-in">
          {/* Format Filter */}
          <div>
            <h4 className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant mb-xs font-semibold">Format</h4>
            <div className="flex flex-col gap-xs">
              {formats.map((f) => (
                <label key={f.value} className="flex items-center gap-sm text-sm text-on-surface hover:text-ember-orange cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFormats.includes(f.value)}
                    onChange={() => onFormatChange(f.value)}
                    className="rounded border-outline-variant bg-surface-container text-vivid-purple focus:ring-vivid-purple"
                  />
                  <span>{f.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* Languages Filter */}
          <div>
            <h4 className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant mb-xs font-semibold">Dil</h4>
            <div className="flex flex-col gap-xs">
              {languages.map((lang) => (
                <label key={lang} className="flex items-center gap-sm text-sm text-on-surface hover:text-ember-orange cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang)}
                    onChange={() => onLanguageChange(lang)}
                    className="rounded border-outline-variant bg-surface-container text-vivid-purple focus:ring-vivid-purple"
                  />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* Publish Year range */}
          <div>
            <h4 className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant mb-xs font-semibold">Yayın Yılı</h4>
            <div className="grid grid-cols-2 gap-xs">
              <input
                type="number"
                placeholder="Min"
                value={minYear || ''}
                onChange={(e) => setMinYear(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-2 py-1 bg-surface-container border border-outline-variant text-on-surface text-xs rounded outline-none focus:ring-1 focus:ring-vivid-purple"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxYear || ''}
                onChange={(e) => setMaxYear(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-2 py-1 bg-surface-container border border-outline-variant text-on-surface text-xs rounded outline-none focus:ring-1 focus:ring-vivid-purple"
              />
            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* Pages Range */}
          <div>
            <h4 className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant mb-xs font-semibold">Sayfa Sayısı</h4>
            <div className="grid grid-cols-2 gap-xs">
              <input
                type="number"
                placeholder="Min Sayfa"
                value={minPages || ''}
                onChange={(e) => setMinPages(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-2 py-1 bg-surface-container border border-outline-variant text-on-surface text-xs rounded outline-none focus:ring-1 focus:ring-vivid-purple"
              />
              <input
                type="number"
                placeholder="Max Sayfa"
                value={maxPages || ''}
                onChange={(e) => setMaxPages(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-2 py-1 bg-surface-container border border-outline-variant text-on-surface text-xs rounded outline-none focus:ring-1 focus:ring-vivid-purple"
              />
            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* Branch Location */}
          <div>
            <h4 className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant mb-xs font-semibold">Kütüphane Şubesi</h4>
            <select
              value={selectedBranch}
              onChange={(e) => onBranchChange(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant text-on-surface text-xs py-1.5 px-2 rounded outline-none focus:ring-1 focus:ring-vivid-purple"
            >
              <option value="all">Tüm Şubeler</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="w-full py-2 bg-outline-variant/30 hover:bg-outline-variant/50 text-on-surface text-xs font-semibold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
