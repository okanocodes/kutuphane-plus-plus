import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks, fetchPenalties } from '../store/userSlice';
import { fetchReservations } from '../store/reservationSlice';
import { fetchBooks } from '../store/bookSlice';
import useAuth from '../hooks/useAuth';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const { borrowedBooks, penalties } = useSelector((state) => state.users);
  const { reservations } = useSelector((state) => state.reservations);
  const { books } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBorrowedBooks());
    dispatch(fetchPenalties());
    dispatch(fetchReservations());
    dispatch(fetchBooks());
  }, [dispatch]);

  // Calculate user specific stats
  const userBorrowed = borrowedBooks.filter(item => String(item.userId) === String(user?.id));
  const activeBorrowed = userBorrowed.filter(item => item.status === 'active');
  const userReservations = reservations.filter(item => String(item.userId) === String(user?.id));
  const activeReservations = userReservations.filter(item => item.status === 'pending' || item.status === 'approved');
  const userPenalty = penalties.filter(item => String(item.userId) === String(user?.id)).reduce((sum, curr) => sum + curr.amount, 0);

  const getBookTitle = (bookId) => {
    return books.find(b => String(b.id) === String(bookId))?.title || `Kitap #${bookId}`;
  };

  return (
    <div className="space-y-lg">
      <div className="space-y-xs">
        <h1 className="font-display-lg text-primary text-3xl md:text-4xl font-bold">Genel Bakış</h1>
        <p className="font-body-md text-on-surface-variant">Hoş geldiniz, {user?.name}. Kütüphane durumu ve rezervasyon özetiniz aşağıdadır.</p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label-xs text-label-xs text-on-surface-variant uppercase">Aktif Ödünç</p>
              <h3 className="font-headline-h2 text-3xl font-bold mt-xs">{activeBorrowed.length}</h3>
            </div>
            <span className="material-symbols-outlined text-ember-orange text-3xl">menu_book</span>
          </div>
          <p className="font-label-xs text-label-xs text-on-surface-variant mt-sm">Şu an okumakta olduğunuz kitaplar</p>
        </div>

        <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label-xs text-label-xs text-on-surface-variant uppercase">Rezervasyonlar</p>
              <h3 className="font-headline-h2 text-3xl font-bold mt-xs">{activeReservations.length}</h3>
            </div>
            <span className="material-symbols-outlined text-vivid-purple text-3xl">bookmark</span>
          </div>
          <p className="font-label-xs text-label-xs text-on-surface-variant mt-sm">Bekleyen / Onaylı rezervasyonlarınız</p>
        </div>

        <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label-xs text-label-xs text-on-surface-variant uppercase">Toplam Ceza</p>
              <h3 className="font-headline-h2 text-3xl font-bold mt-xs text-error">{userPenalty} TL</h3>
            </div>
            <span className="material-symbols-outlined text-error text-3xl">payments</span>
          </div>
          <p className="font-label-xs text-label-xs text-on-surface-variant mt-sm">Gecikme cezası borç tutarı</p>
        </div>

        <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label-xs text-label-xs text-on-surface-variant uppercase">Üyelik Tipi</p>
              <h3 className="font-headline-h2 text-2xl font-bold mt-xs text-accent-gold capitalize">{user?.role}</h3>
            </div>
            <span className="material-symbols-outlined text-accent-gold text-3xl">workspace_premium</span>
          </div>
          <p className="font-label-xs text-label-xs text-on-surface-variant mt-sm">Hesap yetkilendirme seviyesi</p>
        </div>
      </div>

      {/* Lists Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Active Loans list */}
        <div className="glass-card p-lg rounded-xl border border-outline-variant">
          <h2 className="font-headline-h3 text-lg font-bold mb-md">Aktif Ödünç Alınanlar</h2>
          {activeBorrowed.length === 0 ? (
            <p className="font-body-md text-on-surface-variant text-sm py-sm">Şu an ödünç aldığınız kitap bulunmamaktadır.</p>
          ) : (
            <div className="space-y-sm">
              {activeBorrowed.map((loan) => (
                <div key={loan.id} className="flex justify-between items-center py-sm border-b border-outline-variant last:border-0">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">menu_book</span>
                    <span className="font-label-sm text-label-sm text-on-surface">{getBookTitle(loan.bookId)}</span>
                  </div>
                  <span className="font-metadata-mono text-label-xs text-amber-orange">Aktif</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Reservations list */}
        <div className="glass-card p-lg rounded-xl border border-outline-variant">
          <h2 className="font-headline-h3 text-lg font-bold mb-md">Bekleyen Rezervasyonlar</h2>
          {activeReservations.length === 0 ? (
            <p className="font-body-md text-on-surface-variant text-sm py-sm">Aktif rezervasyonunuz bulunmamaktadır.</p>
          ) : (
            <div className="space-y-sm">
              {activeReservations.map((res) => (
                <div key={res.id} className="flex justify-between items-center py-sm border-b border-outline-variant last:border-0">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">bookmark</span>
                    <span className="font-label-sm text-label-sm text-on-surface">{getBookTitle(res.bookId)}</span>
                  </div>
                  <span className={`font-label-xs text-xs px-2 py-0.5 rounded-full uppercase ${res.status === 'approved' ? 'bg-success/20 text-success' : 'bg-accent-gold/20 text-accent-gold'}`}>
                    {res.status === 'approved' ? 'Onaylandı' : 'Beklemede'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
