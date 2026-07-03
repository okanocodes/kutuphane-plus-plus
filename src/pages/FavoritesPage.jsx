import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/bookSlice';
import useAuth from '../hooks/useAuth';
import { addToast } from '../store/uiSlice';

export const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { books } = useSelector((state) => state.books);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());

    let active = true;
    const fetchUserFavorites = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/favorites?userId=${user.id}`);
        if (res.ok && active) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchUserFavorites();

    return () => {
      active = false;
    };
  }, [dispatch, user?.id]);

  const handleRemoveFavorite = async (favId) => {
    try {
      const res = await fetch(`http://localhost:5000/favorites/${favId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        dispatch(addToast({ message: 'Favorilerden kaldırıldı.', type: 'success' }));
        setFavorites(curr => curr.filter(f => f.id !== favId));
      } else {
        dispatch(addToast({ message: 'Kaldırma başarısız.', type: 'error' }));
      }
    } catch (err) {
      console.error(err);
      dispatch(addToast({ message: 'Bir hata oluştu.', type: 'error' }));
    }
  };

  const getFavoriteBooks = () => {
    return favorites.map(fav => {
      const book = books.find(b => String(b.id) === String(fav.bookId));
      return book ? { ...book, favId: fav.id } : null;
    }).filter(Boolean);
  };

  const favoriteBooksList = getFavoriteBooks();

  return (
    <div className="space-y-lg">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {favoriteBooksList.map((book) => (
            <div key={book.id} className="glass-card p-md rounded-xl border border-outline-variant flex flex-col justify-between hover:border-vivid-purple transition-all duration-300">
              <div className="space-y-sm">
                <div className="flex justify-between items-start gap-sm">
                  <h3 className="font-headline-h3 text-base font-bold text-on-surface line-clamp-1">{book.title}</h3>
                  <button 
                    onClick={() => handleRemoveFavorite(book.favId)}
                    className="text-error hover:scale-110 active:scale-95 transition-transform"
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
