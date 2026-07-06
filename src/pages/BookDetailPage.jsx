import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById, fetchAuthors, fetchCategories, fetchPublishers, fetchBooks, clearSelectedBook } from '../store/bookSlice';
import { createReservation } from '../store/reservationSlice';
import { fetchFavorites, addFavorite, removeFavorite, fetchReadingList, addReadingList, removeReadingList } from '../store/favoriteSlice';
import { addToast } from '../store/uiSlice';
import useAuth from '../hooks/useAuth';

// Subcomponents
import QRGenerator from '../components/book-detail/QRGenerator';
import PDFPreviewModal from '../components/book-detail/PDFPreviewModal';
import ReviewsSection from '../components/book-detail/ReviewsSection';
import SimilarBooks from '../components/book-detail/SimilarBooks';

export const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useAuth();
  const { selectedBook, books, authors, categories, publishers, status } = useSelector((state) => state.books);
  const { favorites, readingList } = useSelector((state) => state.favorites);

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBookById(id));
    dispatch(fetchBooks());
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
    dispatch(fetchPublishers());

    return () => {
      dispatch(clearSelectedBook());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchFavorites(user.id));
      dispatch(fetchReadingList(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  // Check if book is in favorites
  const favoriteRecord = (isAuthenticated && user?.id && selectedBook?.id)
    ? favorites.find((f) => String(f.bookId) === String(selectedBook.id) && String(f.userId) === String(user.id))
    : null;

  const isFavorite = !!favoriteRecord;

  // Check if book is in reading list
  const readingListRecord = (isAuthenticated && user?.id && selectedBook?.id)
    ? readingList.find((r) => String(r.bookId) === String(selectedBook.id) && String(r.userId) === String(user.id))
    : null;

  const inReadingList = !!readingListRecord;

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      dispatch(addToast({ message: 'Lütfen önce giriş yapın.', type: 'warning' }));
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      if (isFavorite) {
        const result = await dispatch(removeFavorite(favoriteRecord.id));
        if (removeFavorite.fulfilled.match(result)) {
          dispatch(addToast({ message: 'Kitap favorilerinizden kaldırıldı.', type: 'success' }));
        }
      } else {
        const result = await dispatch(addFavorite({ userId: user.id, bookId: selectedBook.id }));
        if (addFavorite.fulfilled.match(result)) {
          dispatch(addToast({ message: 'Kitap favorilerinize eklendi!', type: 'success' }));
        }
      }
    } catch {
      dispatch(addToast({ message: 'İşlem başarısız.', type: 'error' }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReadingListToggle = async () => {
    if (!isAuthenticated) {
      dispatch(addToast({ message: 'Lütfen önce giriş yapın.', type: 'warning' }));
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      if (inReadingList) {
        const result = await dispatch(removeReadingList(readingListRecord.id));
        if (removeReadingList.fulfilled.match(result)) {
          dispatch(addToast({ message: 'Kitap okuma listenizden kaldırıldı.', type: 'success' }));
        }
      } else {
        const result = await dispatch(addReadingList({ userId: user.id, bookId: selectedBook.id }));
        if (addReadingList.fulfilled.match(result)) {
          dispatch(addToast({ message: 'Kitap okuma listenize eklendi!', type: 'success' }));
        }
      }
    } catch {
      dispatch(addToast({ message: 'İşlem başarısız.', type: 'error' }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      dispatch(addToast({ message: 'Lütfen önce giriş yapın.', type: 'warning' }));
      navigate('/login');
      return;
    }

    setActionLoading(true);
    const reservationData = {
      userId: Number(user.id),
      bookId: Number(selectedBook.id),
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    const resultAction = await dispatch(createReservation(reservationData));
    if (createReservation.fulfilled.match(resultAction)) {
      dispatch(addToast({ message: 'Rezervasyon talebi başarıyla oluşturuldu.', type: 'success' }));
      dispatch(fetchBookById(id)); // Refresh book status
    } else {
      dispatch(addToast({ message: resultAction.payload || 'Rezervasyon başarısız.', type: 'error' }));
    }
    setActionLoading(false);
  };

  const authorName = authors.find(a => String(a.id) === String(selectedBook?.authorId))?.name || 'Yazar Bilinmiyor';
  const categoryName = categories.find(c => String(c.id) === String(selectedBook?.categoryId))?.name || 'Kategori Bilinmiyor';
  const publisherName = publishers.find(p => String(p.id) === String(selectedBook?.publisherId))?.name || 'Yayınevi Bilinmiyor';

  if (status === 'loading' || !selectedBook) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant font-body-md">Detaylar yükleniyor...</p>
      </div>
    );
  }

  // Format label mapper
  const formatLabels = {
    print: 'Basılı Kitap',
    pdf: 'PDF E-Kitap',
    epub: 'EPUB E-Kitap',
    audio: 'Sesli Kitap',
  };

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
      {/* Breadcrumb Header */}
      <div className="mb-lg flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div className="flex items-center gap-xs">
          <button onClick={() => navigate(-1)} className="flex items-center gap-xs text-on-surface-variant hover:text-ember-orange transition-all font-label-sm text-label-sm cursor-pointer">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Geri Dön
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-label-sm text-label-sm truncate max-w-[200px]">{selectedBook.title}</span>
        </div>

        <div className="flex items-center gap-sm">
          {/* Favorites Button */}
          <button
            onClick={handleFavoriteToggle}
            disabled={actionLoading}
            className={`flex items-center gap-xs font-label-sm text-xs font-bold transition-all px-3 py-2 rounded-xl border cursor-pointer ${isFavorite
                ? 'bg-error/15 border-error text-error hover:bg-error/25'
                : 'border-outline-variant hover:bg-surface-container-high text-on-surface'
              }`}
          >
            <span className="material-symbols-outlined text-base">
              {isFavorite ? 'favorite' : 'favorite_border'}
            </span>
            <span>{isFavorite ? 'Favorilerde' : 'Favorilere Ekle'}</span>
          </button>

          {/* Reading List / Later Read Button */}
          <button
            onClick={handleReadingListToggle}
            disabled={actionLoading}
            className={`flex items-center gap-xs font-label-sm text-xs font-bold transition-all px-3 py-2 rounded-xl border cursor-pointer ${inReadingList
                ? 'bg-vivid-purple/20 border-vivid-purple text-primary hover:bg-vivid-purple/30'
                : 'border-outline-variant hover:bg-surface-container-high text-on-surface'
              }`}
          >
            <span className="material-symbols-outlined text-base">
              {inReadingList ? 'bookmark' : 'bookmark_border'}
            </span>
            <span>{inReadingList ? 'Okuma Listesinde' : 'Sonra Oku'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-xxl">
        {/* Left Column: Book Image & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-md">
          <div className="relative group aspect-[2/3] w-full rounded-2xl overflow-hidden bg-surface-container-highest border border-outline-variant/60 shadow-glow-accent flex flex-col items-center justify-center p-lg text-center">
            {selectedBook.coverUrl ? (
              <img
                src={selectedBook.coverUrl}
                alt={selectedBook.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : selectedBook.format === 'audio' ? (
              <span className="material-symbols-outlined text-outline text-7xl text-vivid-purple animate-float">headphones</span>
            ) : selectedBook.format === 'pdf' || selectedBook.format === 'epub' ? (
              <span className="material-symbols-outlined text-outline text-7xl text-tertiary">menu_book</span>
            ) : (
              <span className="material-symbols-outlined text-outline text-7xl text-ember-orange">book</span>
            )}
            
            {!selectedBook.coverUrl && (
              <p className="text-xs font-metadata-mono text-on-surface-variant uppercase tracking-widest mt-md">
                {formatLabels[selectedBook.format] || 'Basılı Kitap'}
              </p>
            )}

            {selectedBook.rating && (
              <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-accent-gold text-sm font-bold">star</span>
                <span className="font-metadata-mono text-sm text-on-surface font-bold">{selectedBook.rating}</span>
              </div>
            )}
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-sm">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="py-3 bg-surface-container-high border border-outline-variant hover:border-ember-orange/50 hover:bg-surface-container-highest text-on-surface rounded-xl font-bold text-xs flex items-center justify-center gap-xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">qr_code_2</span>
              QR Kod Al
            </button>

            <button
              onClick={() => setIsPDFModalOpen(true)}
              className="py-3 bg-surface-container-high border border-outline-variant hover:border-vivid-purple/50 hover:bg-surface-container-highest text-on-surface rounded-xl font-bold text-xs flex items-center justify-center gap-xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              Önizleme Oku
            </button>
          </div>

          <button
            onClick={handleReserve}
            disabled={selectedBook.status !== 'available' || actionLoading}
            className={`w-full py-4 text-white rounded-xl font-bold text-base flex items-center justify-center gap-md scale-95 active:scale-90 transition-all ${selectedBook.status === 'available'
                ? 'bg-ember-orange hover:shadow-[0_0_15px_rgba(255,93,58,0.4)] cursor-pointer'
                : 'bg-outline-variant/50 cursor-not-allowed opacity-60'
              }`}
          >
            <span className="material-symbols-outlined">bookmark</span>
            {selectedBook.status === 'available' ? 'Şimdi Rezerve Et' : 'Rezerve Edilemez (Ödünçte/Rezerve)'}
          </button>
        </div>

        {/* Right Column: Book Metadata & Info */}
        <div className="lg:col-span-8 flex flex-col gap-xl">
          <div className="space-y-md text-left">
            <div className="flex flex-wrap gap-xs items-center">
              <span className="inline-block bg-vivid-purple/20 text-tertiary-fixed text-xs px-2.5 py-0.5 rounded-full font-label-xs uppercase font-bold tracking-wider">
                {categoryName}
              </span>
              <span className="inline-block bg-surface-container-highest text-on-surface-variant text-xs px-2.5 py-0.5 rounded-full font-label-xs uppercase font-bold tracking-wider">
                {formatLabels[selectedBook.format] || 'Basılı'}
              </span>
              <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-label-xs uppercase font-bold tracking-wider ${selectedBook.status === 'available' ? 'bg-success/20 text-success' :
                  selectedBook.status === 'borrowed' ? 'bg-error/20 text-error' :
                    selectedBook.status === 'reserved' ? 'bg-accent-gold/20 text-accent-gold' :
                      selectedBook.status === 'lost' ? 'bg-error/20 text-error' : 'bg-outline-variant/20 text-on-surface-variant'
                }`}>
                {selectedBook.status === 'available' ? 'Müsait' :
                  selectedBook.status === 'borrowed' ? 'Ödünçte' :
                    selectedBook.status === 'reserved' ? 'Rezerve' :
                      selectedBook.status === 'lost' ? 'Kayıp' :
                        selectedBook.status}
              </span>
            </div>
            
            <h1 className="font-display-lg text-4xl font-bold text-on-surface leading-tight">{selectedBook.title}</h1>
            <p className="font-headline-h3 text-xl text-primary font-semibold">{authorName}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-md py-md border-y border-outline-variant font-body-md text-sm">
              <div>
                <p className="text-label-xs text-on-surface-variant font-medium">ISBN</p>
                <p className="font-metadata-mono font-semibold">{selectedBook.isbn}</p>
              </div>
              <div>
                <p className="text-label-xs text-on-surface-variant font-medium">Sayfa Sayısı</p>
                <p className="font-metadata-mono font-semibold">{selectedBook.pages} Sayfa</p>
              </div>
              <div>
                <p className="text-label-xs text-on-surface-variant font-medium">Yayın Yılı</p>
                <p className="font-metadata-mono font-semibold">{selectedBook.publishYear || 'Bilinmiyor'}</p>
              </div>
              <div>
                <p className="text-label-xs text-on-surface-variant font-medium">Yayınevi</p>
                <p className="font-metadata-mono font-semibold">{publisherName}</p>
              </div>
            </div>

            {/* Raf ve Konum */}
            <div className="space-y-sm">
              <h2 className="font-headline-h2 text-xl font-bold border-l-4 border-ember-orange pl-md">Raf ve Konum Bilgisi</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Bu kitaba fiziksel olarak erişebileceğiniz kütüphane raf konumu:
                <span className="font-metadata-mono text-on-surface font-semibold ml-xs bg-surface-container px-2 py-1 rounded">
                  Kat 2 - Salon A - Raf 14B
                </span>
              </p>
            </div>

            {/* Özet */}
            <div className="space-y-sm">
              <h2 className="font-headline-h2 text-xl font-bold border-l-4 border-ember-orange pl-md">Kitap Özeti</h2>
              <p className="font-body-lg text-on-surface-variant text-base leading-relaxed">
                {selectedBook.description || `Bu eser, ${categoryName} kategorisinde yayınlanmış olup, ${authorName} tarafından kaleme alınmıştır. Kütüphanemiz bünyesinde bulunan basılı nüshasını yukarıdaki raf kodunu takip ederek teslim alabilir veya dijital işlemlerinizi panelinizden yönetebilirsiniz.`}
              </p>
            </div>

            {/* Anahtar Kelimeler */}
            {selectedBook.keywords && selectedBook.keywords.length > 0 && (
              <div className="space-y-sm pt-xs">
                <h3 className="text-sm font-semibold text-on-surface-variant">Anahtar Kelimeler:</h3>
                <div className="flex flex-wrap gap-xs">
                  {selectedBook.keywords.map((tag) => (
                    <span key={tag} className="text-xs bg-surface-container px-2.5 py-1 rounded-md text-on-surface border border-outline-variant/30 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yorumlar Bölümü */}
      <ReviewsSection
        bookId={selectedBook.id}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      {/* Benzer Kitaplar Bölümü */}
      <SimilarBooks
        currentBook={selectedBook}
        books={books}
        authors={authors}
        categories={categories}
      />

      {/* QR Code Modal Container */}
      <QRGenerator
        book={selectedBook}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      {/* PDF Preview Modal Container */}
      <PDFPreviewModal
        book={selectedBook}
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
      />
    </main>
  );
};

export default BookDetailPage;