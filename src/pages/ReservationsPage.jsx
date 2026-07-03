import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservations, updateReservationStatus } from '../store/reservationSlice';
import { fetchBooks } from '../store/bookSlice';
import { fetchUsers } from '../store/userSlice';
import useAuth from '../hooks/useAuth';
import { addToast } from '../store/uiSlice';

export const ReservationsPage = () => {
  const dispatch = useDispatch();
  const { user, isAdmin, isLibrarian } = useAuth();
  
  const { reservations } = useSelector((state) => state.reservations);
  const { books } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(fetchBooks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const showAll = isAdmin || isLibrarian;

  const filteredReservations = showAll 
    ? reservations 
    : reservations.filter(r => String(r.userId) === String(user?.id));

  const getBookTitle = (bookId) => {
    return books.find(b => String(b.id) === String(bookId))?.title || `Kitap #${bookId}`;
  };

  const getUserName = (userId) => {
    return users.find(u => String(u.id) === String(userId))?.name || `Kullanıcı #${userId}`;
  };

  const handleStatusChange = async (id, newStatus, bookId) => {
    const resultAction = await dispatch(updateReservationStatus({ id, status: newStatus, bookId }));
    if (updateReservationStatus.fulfilled.match(resultAction)) {
      dispatch(addToast({ message: `Rezervasyon durumu '${newStatus}' olarak güncellendi.`, type: 'success' }));
    } else {
      dispatch(addToast({ message: 'Güncelleme başarısız.', type: 'error' }));
    }
  };

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-center">
        <h1 className="font-display-lg text-primary text-3xl font-bold">Rezervasyon Yönetimi</h1>
        <span className="text-sm text-on-surface-variant font-label-sm">
          {showAll ? 'Tüm Rezervasyonlar (Yönetici Görünümü)' : 'Rezervasyonlarım'}
        </span>
      </div>

      <div className="glass-card rounded-xl border border-outline-variant overflow-x-auto">
        <table className="min-w-full divide-y divide-outline-variant font-body-md text-sm text-left">
          <thead className="bg-surface-container-high text-on-surface font-semibold">
            <tr>
              <th className="px-md py-sm">ID</th>
              {showAll && <th className="px-md py-sm">Kullanıcı</th>}
              <th className="px-md py-sm">Kitap</th>
              <th className="px-md py-sm">Durum</th>
              <th className="px-md py-sm text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={showAll ? 5 : 4} className="px-md py-lg text-center text-on-surface-variant">
                  Rezervasyon bulunamadı.
                </td>
              </tr>
            ) : (
              filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-md py-sm font-metadata-mono text-label-xs text-on-surface-variant">{res.id}</td>
                  {showAll && <td className="px-md py-sm font-semibold">{getUserName(res.userId)}</td>}
                  <td className="px-md py-sm font-medium">{getBookTitle(res.bookId)}</td>
                  <td className="px-md py-sm">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                      res.status === 'approved' ? 'bg-success/20 text-success' :
                      res.status === 'pending' ? 'bg-accent-gold/20 text-accent-gold' :
                      'bg-error/20 text-error'
                    }`}>
                      {res.status === 'approved' ? 'Onaylandı' :
                       res.status === 'pending' ? 'Beklemede' :
                       res.status === 'canceled' ? 'İptal Edildi' : res.status}
                    </span>
                  </td>
                  <td className="px-md py-sm text-right space-x-xs">
                    {res.status === 'pending' && (
                      <>
                        {showAll ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(res.id, 'approved', res.bookId)}
                              className="px-sm py-1 bg-success text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleStatusChange(res.id, 'canceled', res.bookId)}
                              className="px-sm py-1 bg-error text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all"
                            >
                              Reddet
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(res.id, 'canceled', res.bookId)}
                            className="px-sm py-1 bg-outline text-white text-xs font-bold rounded hover:bg-error active:scale-95 transition-all"
                          >
                            İptal Et
                          </button>
                        )}
                      </>
                    )}
                    {res.status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange(res.id, 'canceled', res.bookId)}
                        className="px-sm py-1 bg-outline text-white text-xs font-bold rounded hover:bg-error active:scale-95 transition-all"
                      >
                        İptal Et
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsPage;
