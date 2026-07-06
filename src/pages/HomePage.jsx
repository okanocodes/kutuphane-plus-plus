import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, fetchAuthors, fetchCategories } from '../store/bookSlice';
import BookCard from '../components/BookCard';

export const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => { document.title = 'Kütüphane++ — Anasayfa'; }, []);
    const [searchQuery, setSearchQuery] = useState('');
    const { books, authors, categories, status } = useSelector((state) => state.books);

    useEffect(() => {
        dispatch(fetchBooks());
        dispatch(fetchAuthors());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/search');
        }
    };

    const getAuthorName = (authorId) => {
        return authors.find(a => String(a.id) === String(authorId))?.name || 'Yazar Bilinmiyor';
    };

    const getCategoryName = (categoryId) => {
        return categories.find(c => String(c.id) === String(categoryId))?.name || 'Kategori Bilinmiyor';
    };

    // Grab the first 4 books as featured books
    const featuredBooks = books.slice(0, 4);

    return (
        <main className="space-y-xl">
            {/* Hero Section */}
            <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden pt-xxl pb-xxl rounded-2xl border border-outline-variant bg-gradient-to-br from-midnight-violet via-surface to-surface">
                <div className="absolute inset-0 bg-gradient-to-b from-vivid-purple/10 via-transparent to-surface/80"></div>
                <div className="relative z-10 w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center space-y-md">
                    <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface font-bold leading-tight">
                        Bilgi, <span className="text-ember-orange">derlendi.</span>
                    </h1>
                    <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                        Milyonlarca kaynak, akademik makaleler ve nadir eserler şimdi tek bir platformda. Öğrenmenin geleceğini keşfedin.
                    </p>
                    
                    {/* Hero Search Box */}
                    <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group pt-md">
                        <div className="absolute -inset-1 bg-gradient-to-r from-ember-orange to-vivid-purple rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative flex items-center bg-surface-container-highest border border-outline-variant/30 rounded-full px-lg py-sm shadow-xl transition-all focus-within:border-vivid-purple focus-within:ring-2 focus-within:ring-vivid-purple/20">
                            <span className="material-symbols-outlined text-on-surface-variant mr-md">search</span>
                            <input 
                                className="bg-transparent border-none outline-none focus:ring-0 text-on-surface w-full placeholder-on-surface-variant font-body-md text-sm" 
                                placeholder="Kitap, yazar veya ISBN ara..." 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button 
                                type="submit"
                                className="bg-ember-orange hover:bg-ember-orange/90 text-white px-xl py-sm rounded-full transition-all active:scale-95 font-label-sm text-label-sm ml-md whitespace-nowrap"
                            >
                                Ara
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Featured Books Section */}
            <section className="py-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-xl">
                        <div>
                            <h2 className="font-headline-h2 text-headline-h2 text-on-surface text-3xl font-bold">Öne Çıkan Kitaplar</h2>
                            <p className="text-on-surface-variant font-label-sm text-label-sm">Kütüphanemizin popüler eserleri</p>
                        </div>
                        <button 
                            onClick={() => navigate('/search')}
                            className="text-ember-orange hover:text-ember-orange/95 font-bold font-label-sm text-sm flex items-center gap-1 group"
                        >
                            Tümünü Gör 
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>

                    {status === 'loading' ? (
                        <p className="text-on-surface-variant">Yükleniyor...</p>
                    ) : featuredBooks.length === 0 ? (
                        <p className="text-on-surface-variant">Kitap bulunamadı.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
                            {featuredBooks.map(book => (
                                <BookCard 
                                    key={book.id} 
                                    book={book} 
                                    authorName={getAuthorName(book.authorId)} 
                                    categoryName={getCategoryName(book.categoryId)} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default HomePage;