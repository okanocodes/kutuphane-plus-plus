import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks } from '../store/userSlice';
import { fetchReservations } from '../store/reservationSlice';
import { fetchBooks } from '../store/bookSlice';
import useAuth from '../hooks/useAuth';

export const HistoryPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const { borrowedBooks } = useSelector((state) => state.users);
  const { reservations } = useSelector((state) => state.reservations);
  const { books } = useSelector((state) => state.books);

  const [activeTab, setActiveTab] = useState('borrows'); // 'borrows' | 'reservations'

  useEffect(() => {
    dispatch(fetchBorrowedBooks());
    dispatch(fetchReservations());
    dispatch(fetchBooks());
  }, [dispatch]);

  // Filter history for current user
  const userBorrowHistory = borrowedBooks.filter(
    b => String(b.userId) === String(user?.id) && b.status === 'returned'
  );

  const userReservationHistory = reservations.filter(
    r => String(r.userId) === String(user?.id) && r.status === 'canceled'
  );

  const getBookTitle = (bookId) => {
    return books.find(b => String(b.id) === String(bookId))?.title || `Kitap #${bookId}`;
  };

  return (
    <div className="space-y-lg text-left">
      <div className="space-y-xs">
        <h1 className="font-display-lg text-primary text-3xl font-bold">İşlem Geçmişi</h1>
        <p className="font-body-md text-on-surface-variant">Kütüphanede gerçekleştirdiğiniz geçmiş ödünç alma ve rezervasyon işlemleri.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant font-label-sm text-sm">
        <button 
          onClick={() => setActiveTab('borrows')}
          className={`px-md py-sm border-b-2 font-bold transition-all flex items-center gap-xs cursor-pointer ${
            activeTab === 'borrows' ? 'border-ember-orange text-ember-orange' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm">history</span>
          Okuma Geçmişi ({userBorrowHistory.length})
        </button>
        <button 
          onClick={() => setActiveTab('reservations')}
          className={`px-md py-sm border-b-2 font-bold transition-all flex items-center gap-xs cursor-pointer ${
            activeTab === 'reservations' ? 'border-ember-orange text-ember-orange' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm">bookmark_border</span>
          Eski Rezervasyonlar ({userReservationHistory.length})
        </button>
      </div>

      {activeTab === 'borrows' && (
        <div className="glass-card rounded-xl border border-outline-variant overflow-x-auto">
          <table className="min-w-full divide-y divide-outline-variant font-body-md text-sm text-left">
            <thead className="bg-surface-container-high text-on-surface font-semibold">
              <tr>
                <th className="px-md py-sm">ID</th>
                <th className="px-md py-sm">Kitap Adı</th>
                <th className="px-md py-sm">Ödünç Tarihi</th>
                <th className="px-md py-sm">İade Tarihi</th>
                <th className="px-md py-sm">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {userBorrowHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-md py-lg text-center text-on-surface-variant">
                    Henüz tamamlanmış okuma geçmişiniz bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                userBorrowHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="px-md py-sm font-metadata-mono text-label-xs text-on-surface-variant">{record.id}</td>
                    <td className="px-md py-sm font-medium">{getBookTitle(record.bookId)}</td>
                    <td className="px-md py-sm font-metadata-mono text-xs">{record.borrowDate || '—'}</td>
                    <td className="px-md py-sm font-metadata-mono text-xs">{record.returnDate || '—'}</td>
                    <td className="px-md py-sm">
                      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase bg-success/20 text-success">
                        Okundu ve İade Edildi
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="glass-card rounded-xl border border-outline-variant overflow-x-auto">
          <table className="min-w-full divide-y divide-outline-variant font-body-md text-sm text-left">
            <thead className="bg-surface-container-high text-on-surface font-semibold">
              <tr>
                <th className="px-md py-sm">ID</th>
                <th className="px-md py-sm">Kitap Adı</th>
                <th className="px-md py-sm">Rezervasyon Tarihi</th>
                <th className="px-md py-sm">İşlem Durumu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {userReservationHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-md py-lg text-center text-on-surface-variant">
                    Geçmiş iptal edilmiş rezervasyonunuz bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                userReservationHistory.map((res) => (
                  <tr key={res.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="px-md py-sm font-metadata-mono text-label-xs text-on-surface-variant">{res.id}</td>
                    <td className="px-md py-sm font-medium">{getBookTitle(res.bookId)}</td>
                    <td className="px-md py-sm font-metadata-mono text-xs">{res.date || '—'}</td>
                    <td className="px-md py-sm">
                      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase bg-error/20 text-error">
                        İptal Edildi
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
