import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, fetchAuthors, fetchCategories, fetchBranches } from '../store/bookSlice';
import BookCard from '../components/BookCard';
import AdvancedFilters from '../components/search/AdvancedFilters';
import SortingOptions from '../components/search/SortingOptions';
import Pagination from '../components/search/Pagination';

export const SearchPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { books, authors, categories, branches, status } = useSelector((state) => state.books);

  // Read search query from URL parameter 'q'
  const urlQuery = useMemo(() => {
    return new URLSearchParams(location.search).get('q') || '';
  }, [location.search]);

  const [textSearch, setTextSearch] = useState(urlQuery);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [minYear, setMinYear] = useState(null);
  const [maxYear, setMaxYear] = useState(null);
  const [minPages, setMinPages] = useState(null);
  const [maxPages, setMaxPages] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [sortBy, setSortBy] = useState('title-az');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
    dispatch(fetchBranches());
  }, [dispatch]);

  useEffect(() => { document.title = 'Kütüphane++ — Arama'; }, []);

  // Sync state if URL query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setTextSearch(urlQuery);
    }, 0);
    return () => clearTimeout(timer);
  }, [urlQuery]);

  const handleCategoryChange = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
    setCurrentPage(1);
  };

  const handleFormatChange = (formatVal) => {
    setSelectedFormats(prev =>
      prev.includes(formatVal) ? prev.filter(f => f !== formatVal) : [...prev, formatVal]
    );
    setCurrentPage(1);
  };

  const handleLanguageChange = (langVal) => {
    setSelectedLanguages(prev =>
      prev.includes(langVal) ? prev.filter(l => l !== langVal) : [...prev, langVal]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedFormats([]);
    setSelectedLanguages([]);
    setSelectedStatus('all');
    setMinYear(null);
    setMaxYear(null);
    setMinPages(null);
    setMaxPages(null);
    setSelectedBranch('all');
    setSortBy('title-az');
    setCurrentPage(1);
    setTextSearch('');
    navigate('/search');
  };

  const getCategoryName = (categoryId) => {
    return categories.find(c => String(c.id) === String(categoryId))?.name || '';
  };

  // Filter books dynamically based on criteria
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // 1. Text Search matching title, author, isbn or keywords
      const searchLower = textSearch.toLowerCase();
      const matchedAuthor = authors.find(a => String(a.id) === String(book.authorId));
      const authorName = (matchedAuthor?.name || '').toLowerCase();

      const titleMatch = book.title.toLowerCase().includes(searchLower);
      const authorMatch = authorName.includes(searchLower);
      const isbnMatch = book.isbn ? book.isbn.includes(searchLower) : false;
      const keywordsMatch = book.keywords ? book.keywords.some(k => k.toLowerCase().includes(searchLower)) : false;
      const textMatch = titleMatch || authorMatch || isbnMatch || keywordsMatch;

      // 2. Category Filter
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(Number(book.categoryId)) || selectedCategories.includes(String(book.categoryId));

      // 3. Status Filter
      const statusMatch = selectedStatus === 'all' || book.status === selectedStatus;

      // 4. Format Filter
      const formatMatch = selectedFormats.length === 0 || selectedFormats.includes(book.format);

      // 5. Language Filter
      const languageMatch = selectedLanguages.length === 0 || selectedLanguages.includes(book.language);

      // 6. Year Filter
      const yearMatch = (!minYear || book.publishYear >= minYear) && (!maxYear || book.publishYear <= maxYear);

      // 7. Pages Filter
      const pagesMatch = (!minPages || book.pages >= minPages) && (!maxPages || book.pages <= maxPages);

      // 8. Branch Location Filter
      const branchMatch = selectedBranch === 'all' || String(book.branchId) === String(selectedBranch);

      return textMatch && categoryMatch && statusMatch && formatMatch && languageMatch && yearMatch && pagesMatch && branchMatch;
    }).sort((a, b) => {
      // Sorting
      if (sortBy === 'title-az') return a.title.localeCompare(b.title);
      if (sortBy === 'title-za') return b.title.localeCompare(a.title);
      if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'rating-asc') return (a.rating || 0) - (b.rating || 0);
      if (sortBy === 'pages-desc') return (b.pages || 0) - (a.pages || 0);
      if (sortBy === 'pages-asc') return (a.pages || 0) - (b.pages || 0);
      if (sortBy === 'year-desc') return (b.publishYear || 0) - (a.publishYear || 0);
      if (sortBy === 'year-asc') return (a.publishYear || 0) - (b.publishYear || 0);
      return 0;
    });
  }, [books, textSearch, selectedCategories, selectedStatus, selectedFormats, selectedLanguages, minYear, maxYear, minPages, maxPages, selectedBranch, sortBy, authors]);

  // Paginated books
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const currentBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(textSearch)}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-lg relative min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0 space-y-md lg:sticky lg:top-24 h-fit">
        <form onSubmit={handleSearchSubmit} className="relative group flex items-center">
          <input
            type="text"
            className="w-full pl-3 pr-14 py-2 border border-outline-variant bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-vivid-purple text-sm"
            placeholder="Kitap, yazar, isbn veya anahtar kelime..."
            value={textSearch}
            onChange={(e) => {
              setTextSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          {textSearch && (
            <button
              type="button"
              onClick={() => {
                setTextSearch('');
                setCurrentPage(1);
                navigate('/search');
              }}
              className="absolute right-8 text-on-surface-variant hover:text-ember-orange transition-colors cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
          <button type="submit" className="absolute right-2 text-on-surface-variant hover:text-ember-orange transition-colors cursor-pointer flex items-center justify-center">
            <span className="material-symbols-outlined text-base block">search</span>
          </button>
        </form>

        <div className="space-y-md">
          {/* Quick Categories Filter */}
          <div className="glass-card p-md rounded-xl border border-outline-variant">
            <h3 className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant mb-sm font-semibold">Kategoriler</h3>
            <div className="flex flex-col gap-xs max-h-48 overflow-y-auto pr-xs">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center justify-between group cursor-pointer py-1">
                  <span className="text-label-sm text-sm text-on-surface group-hover:text-ember-orange transition-colors">
                    {cat.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(Number(cat.id)) || selectedCategories.includes(String(cat.id))}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="rounded border-outline-variant bg-surface-container text-vivid-purple focus:ring-vivid-purple cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Quick Status Filter */}
          <div className="glass-card p-md rounded-xl border border-outline-variant">
            <h3 className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant mb-xs font-semibold">Kitap Durumu</h3>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-surface-container border border-outline-variant rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-vivid-purple transition-all outline-none text-on-surface cursor-pointer"
            >
              <option value="all">Hepsi</option>
              <option value="available">Müsait</option>
              <option value="borrowed">Ödünçte</option>
              <option value="reserved">Rezerve</option>
              <option value="lost">Kayıp</option>
            </select>
          </div>

          {/* Advanced Filters */}
          <AdvancedFilters
            selectedFormats={selectedFormats}
            onFormatChange={handleFormatChange}
            selectedLanguages={selectedLanguages}
            onLanguageChange={handleLanguageChange}
            minYear={minYear}
            setMinYear={(val) => { setMinYear(val); setCurrentPage(1); }}
            maxYear={maxYear}
            setMaxYear={(val) => { setMaxYear(val); setCurrentPage(1); }}
            minPages={minPages}
            setMinPages={(val) => { setMinPages(val); setCurrentPage(1); }}
            maxPages={maxPages}
            setMaxPages={(val) => { setMaxPages(val); setCurrentPage(1); }}
            selectedBranch={selectedBranch}
            onBranchChange={(val) => { setSelectedBranch(val); setCurrentPage(1); }}
            branches={branches}
            clearFilters={clearAllFilters}
          />
        </div>
      </aside>

      {/* Main Results Area */}
      <div className="flex-grow space-y-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h1 className="font-headline-h2 text-3xl font-bold text-on-surface">
              {textSearch ? `"${textSearch}" Arama Sonuçları` : 'Tüm Kitaplar'}
            </h1>
            <p className="text-on-surface-variant text-label-xs mt-1">
              Toplam {filteredBooks.length} kitap bulundu (Sayfa {currentPage}/{totalPages || 1})
            </p>
          </div>
          
          <SortingOptions sortBy={sortBy} setSortBy={(val) => { setSortBy(val); setCurrentPage(1); }} />
        </div>

        {status === 'loading' ? (
          <div className="flex justify-center py-20">
            <p className="text-on-surface-variant">Kitaplar aranıyor...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="glass-card p-xl rounded-xl border border-outline-variant text-center">
            <span className="material-symbols-outlined text-outline text-5xl mb-sm block">search_off</span>
            <p className="font-body-lg text-on-surface-variant">Aradığınız kriterlere uygun kitap bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
              {currentBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  authorName={authors.find(a => String(a.id) === String(book.authorId))?.name || 'Yazar Bilinmiyor'}
                  categoryName={getCategoryName(book.categoryId)}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;