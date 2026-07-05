import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/bookSlice';
import { fetchFavorites, removeFavorite } from '../store/favoriteSlice';
import useAuth from '../hooks/useAuth';
import { addToast } from '../store/uiSlice';

export const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { books, status } = useSelector((state) => state.books);
  const { favorites, status: favStatus } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchBooks());
    if (user?.id) {
      dispatch(fetchFavorites(user.id));
    }
  }, [dispatch, user?.id]);

  const handleRemoveFavorite = async (favId) => {
    const result = await dispatch(removeFavorite(favId));
    if (removeFavorite.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Favorilerden kaldırıldı.', type: 'success' }));
    } else {
      dispatch(addToast({ message: 'Kaldırma başarısız.', type: 'error' }));
    }
  };

  const favoriteBooksList = favorites
    .map((fav) => {
      const book = books.find((b) => String(b.id) === String(fav.bookId));
      return book ? { ...book, favId: fav.id } : null;
    })
    .filter(Boolean);

  const loading = status === 'loading' || favStatus === 'loading';

  return (
    <div className="space-y-lg text-left">
      <div className="space-y-xs">
        <h1 className="font-display-lg text-primary text-3xl font-bold">Favorilerim</h1>
        <p className="font-body-md text-on-surface-variant">Beğendiğiniz ve daha sonra okumak üzere kaydettiğiniz kitaplar.</p>
      </div>

      {loading ? (
        <p className="font-body-md text-on-surface-variant">Yükleniyor...</p>
      ) : favoriteBooksList.length === 0 ? (
        <div className="glass-card p-xl rounded-xl border border-outline-variant text-center space-y-md">
          <span className="material-symbols-outlined text-outline text-5xl">favorite_border</span>
          <p className="font-body-md text-on-surface-variant">Favorilerinizde kitap bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {favoriteBooksList.map((book) => (
            <div
              key={book.id}
              className="glass-card p-md rounded-xl border border-outline-variant flex flex-col justify-between hover:border-vivid-purple transition-all duration-300 relative group"
            >
              <div className="space-y-sm">
                <div className="flex justify-between items-start gap-sm">
                  <h3 className="font-headline-h3 text-base font-bold text-on-surface line-clamp-1">{book.title}</h3>
                  <button
                    onClick={() => handleRemoveFavorite(book.favId)}
                    className="text-error hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined font-semibold text-lg">favorite</span>
                  </button>
                </div>
                <p className="font-label-xs text-xs text-on-surface-variant">ISBN: {book.isbn}</p>
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-accent-gold text-sm">star</span>
                  <span className="font-metadata-mono text-label-xs text-on-surface font-bold">{book.rating}</span>
                </div>
              </div>

              <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  book.status === 'available' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                }`}>
                  {book.status === 'available' ? 'Müsait' : 'Ödünçte'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
