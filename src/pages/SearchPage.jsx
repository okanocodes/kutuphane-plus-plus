import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, fetchAuthors, fetchCategories } from '../store/bookSlice';
import BookCard from '../components/BookCard';

export const SearchPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { books, authors, categories, status } = useSelector((state) => state.books);

  // Read search query from URL parameter 'q'
  const urlQuery = useMemo(() => {
    return new URLSearchParams(location.search).get('q') || '';
  }, [location.search]);

  const [textSearch, setTextSearch] = useState(urlQuery);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('title-az'); // 'title-az' | 'rating-desc'
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'available' | 'borrowed' | 'reserved'

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Sync state if URL query changes asynchronously to avoid sync setState warnings
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
  };

  const getCategoryName = (categoryId) => {
    return categories.find(c => String(c.id) === String(categoryId))?.name || '';
  };

  // Filter books dynamically based on criteria
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // 1. Text Search matching Book title, Author name, or ISBN
      const searchLower = textSearch.toLowerCase();
      const matchedAuthor = authors.find(a => String(a.id) === String(book.authorId));
      const authorName = (matchedAuthor?.name || '').toLowerCase();

      const titleMatch = book.title.toLowerCase().includes(searchLower);
      const authorMatch = authorName.includes(searchLower);
      const isbnMatch = book.isbn ? book.isbn.includes(searchLower) : false;
      const textMatch = titleMatch || authorMatch || isbnMatch;

      // 2. Category Filter
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(book.categoryId);

      // 3. Status Filter
      const statusMatch = selectedStatus === 'all' || book.status === selectedStatus;

      return textMatch && categoryMatch && statusMatch;
    }).sort((a, b) => {
      // 4. Sort
      if (sortBy === 'title-az') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'rating-desc') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });
  }, [books, textSearch, selectedCategories, selectedStatus, sortBy, authors]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(textSearch)}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-lg relative min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0 space-y-md lg:sticky lg:top-24 h-fit">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <input
            type="text"
            className="w-full px-3 py-2 border border-outline-variant bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-vivid-purple text-sm"
            placeholder="Arama..."
            value={textSearch}
            onChange={(e) => setTextSearch(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-base block">search</span>
          </button>
        </form>

        <div className="glass-card p-md rounded-xl border border-outline-variant space-y-md">
          {/* Categories Filter */}
          <div>
            <h3 className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant mb-sm">Kategoriler</h3>
            <div className="flex flex-col gap-xs max-h-48 overflow-y-auto pr-xs">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center justify-between group cursor-pointer py-1">
                  <span className="text-label-sm text-sm text-on-surface group-hover:text-ember-orange transition-colors">
                    {cat.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="rounded border-outline-variant bg-surface-container text-vivid-purple focus:ring-vivid-purple cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* Status Filter */}
          <div>
            <h3 className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant mb-sm">Kitap Durumu</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-vivid-purple transition-all outline-none"
            >
              <option value="all">Hepsi</option>
              <option value="available">Müsait</option>
              <option value="borrowed">Ödünçte</option>
              <option value="reserved">Rezerve</option>
              <option value="lost">Kayıp</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Results area */}
      <div className="flex-grow space-y-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h1 className="font-headline-h2 text-3xl font-bold text-on-surface">
              {textSearch ? `"${textSearch}" Arama Sonuçları` : 'Tüm Kitaplar'}
            </h1>
            <p className="text-on-surface-variant text-label-xs mt-1">
              Toplam {filteredBooks.length} kitap bulundu
            </p>
          </div>
          <div className="flex items-center gap-md w-full md:w-auto">
            <span className="text-sm font-medium text-on-surface-variant whitespace-nowrap">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container border border-outline-variant rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-vivid-purple transition-all outline-none"
            >
              <option value="title-az">İsim (A-Z)</option>
              <option value="rating-desc">Puan (En Yüksek)</option>
            </select>
          </div>
        </div>

        {status === 'loading' ? (
          <p className="text-on-surface-variant">Kitaplar aranıyor...</p>
        ) : filteredBooks.length === 0 ? (
          <div className="glass-card p-xl rounded-xl border border-outline-variant text-center">
            <span className="material-symbols-outlined text-outline text-5xl mb-sm block">search_off</span>
            <p className="font-body-lg text-on-surface-variant">Aradığınız kriterlere uygun kitap bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
            {filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                authorName={authors.find(a => String(a.id) === String(book.authorId))?.name || 'Yazar Bilinmiyor'}
                categoryName={getCategoryName(book.categoryId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;