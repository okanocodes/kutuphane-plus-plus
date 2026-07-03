import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById, fetchAuthors, fetchCategories, fetchPublishers, clearSelectedBook } from '../store/bookSlice';
import { createReservation } from '../store/reservationSlice';
import { addToast } from '../store/uiSlice';
import useAuth from '../hooks/useAuth';

export const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useAuth();
  const { selectedBook, authors, categories, publishers, status } = useSelector((state) => state.books);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteRecordId, setFavoriteRecordId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBookById(id));
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
    dispatch(fetchPublishers());

    return () => {
      dispatch(clearSelectedBook());
    };
  }, [dispatch, id]);

  // Check if book is already in user's favorites
  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated || !user?.id || !selectedBook?.id) return;
      try {
        const res = await fetch(`http://localhost:5000/favorites?userId=${user.id}&bookId=${selectedBook.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setIsFavorite(true);
            setFavoriteRecordId(data[0].id);
          } else {
            setIsFavorite(false);
            setFavoriteRecordId(null);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkFavorite();
  }, [selectedBook, user?.id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      dispatch(addToast({ message: 'Lütfen önce giriş yapın.', type: 'warning' }));
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      if (isFavorite && favoriteRecordId) {
        const res = await fetch(`http://localhost:5000/favorites/${favoriteRecordId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsFavorite(false);
          setFavoriteRecordId(null);
          dispatch(addToast({ message: 'Kitap favorilerinizden kaldırıldı.', type: 'success' }));
        }
      } else {
        const res = await fetch(`http://localhost:5000/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: Number(user.id), bookId: Number(selectedBook.id) }),
        });
        if (res.ok) {
          const data = await res.json();
          setIsFavorite(true);
          setFavoriteRecordId(data.id);
          dispatch(addToast({ message: 'Kitap favorilerinize eklendi!', type: 'success' }));
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
      dispatch(fetchBookById(id)); // Refresh book status to 'reserved'
    } else {
      dispatch(addToast({ message: resultAction.payload || 'Rezervasyon başarısız.', type: 'error' }));
    }
    setActionLoading(false);
  };

  const authorName = authors.find(a => String(a.id) === String(selectedBook?.authorId))?.name || 'Yazar Bilinmiyor';
  const categoryName = categories.find(c => String(c.id) === String(selectedBook?.categoryId))?.name || 'Kategori Bilinmiyor';
  const publisherName = publishers.find(p => String(p.id) === String(selectedBook?.publisherId))?.name || 'Yayınevi Bilinmiyor';

  console.log('DEBUG - selectedBook:', selectedBook);

  if (status === 'loading' || !selectedBook) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant font-body-md">Detaylar yükleniyor...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
      <div className="mb-lg flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-xs text-on-surface-variant hover:text-ember-orange transition-all font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Geri Dön
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-label-sm text-label-sm">{selectedBook.title}</span>
        </div>

        <button
          onClick={handleFavoriteToggle}
          disabled={actionLoading}
          className={`flex items-center gap-xs font-label-sm text-sm font-semibold transition-all px-3 py-1.5 rounded-lg border ${isFavorite
              ? 'bg-error/15 border-error text-error'
              : 'border-outline-variant hover:bg-surface-container-high text-on-surface'
            }`}
        >
          <span className="material-symbols-outlined text-base">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
          <span>{isFavorite ? 'Favorilerde' : 'Favorilere Ekle'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-xxl">
        <div className="lg:col-span-4 flex flex-col gap-lg">
          <div className="relative group aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-container-highest border border-outline-variant shadow-glow-accent flex items-center justify-center">
            <span className="material-symbols-outlined text-outline text-7xl">book</span>
            {selectedBook.rating && (
              <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-accent-gold text-sm font-bold">star</span>
                <span className="font-metadata-mono text-sm text-on-surface font-semibold">{selectedBook.rating}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleReserve}
            disabled={selectedBook.status !== 'available' || actionLoading}
            className={`w-full py-4 text-white rounded-xl font-headline-h3 text-base font-bold flex items-center justify-center gap-md scale-95 active:scale-90 transition-all ${selectedBook.status === 'available'
                ? 'bg-ember-orange hover:shadow-[0_0_15px_rgba(255,93,58,0.4)] cursor-pointer'
                : 'bg-outline-variant/50 cursor-not-allowed opacity-60'
              }`}
          >
            <span className="material-symbols-outlined">bookmark</span>
            {selectedBook.status === 'available' ? 'Şimdi Rezerve Et' : 'Rezerve Edilemez (Ödünçte/Rezerve)'}
          </button>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-xl">
          <div className="space-y-md">
            <div className="flex gap-sm items-center">
              <span className="inline-block bg-vivid-purple/20 text-tertiary-fixed text-xs px-2.5 py-0.5 rounded-full font-label-xs uppercase font-bold tracking-wider">
                {categoryName}
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
                <p className="font-metadata-mono font-semibold">{selectedBook.pages}</p>
              </div>
              <div>
                <p className="text-label-xs text-on-surface-variant font-medium">Dil</p>
                <p className="font-metadata-mono font-semibold">{selectedBook.language || 'Türkçe'}</p>
              </div>
              <div>
                <p className="text-label-xs text-on-surface-variant font-medium">Yayınevi</p>
                <p className="font-metadata-mono font-semibold">{publisherName}</p>
              </div>
            </div>

            <div className="space-y-sm">
              <h2 className="font-headline-h2 text-xl font-bold border-l-4 border-ember-orange pl-md">Raf ve Konum Bilgisi</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Bu kitaba fiziksel olarak erişebileceğiniz kütüphane raf konumu:
                <span className="font-metadata-mono text-on-surface font-semibold ml-xs">Kat 2 - Salon A - Raf 14B</span>
              </p>
            </div>

            <div className="space-y-sm">
              <h2 className="font-headline-h2 text-xl font-bold border-l-4 border-ember-orange pl-md">Özet</h2>
              <p className="font-body-lg text-on-surface-variant text-base leading-relaxed">
                Bu eser, {categoryName} kategorisinde yayınlanmış olup, {authorName} tarafından kaleme alınmıştır. Kütüphanemiz bünyesinde bulunan basılı nüshasını yukarıdaki raf kodunu takip ederek teslim alabilir veya dijital işlemlerinizi panelinizden yönetebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookDetailPage;