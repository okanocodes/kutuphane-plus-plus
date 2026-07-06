import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks, returnBook, extendLoan, clearUserPenalty, fetchPenalties } from '../store/userSlice';
import { fetchBooks } from '../store/bookSlice';
import { fetchUsers } from '../store/userSlice';
import useAuth from '../hooks/useAuth';
import { addToast } from '../store/uiSlice';
import { calculatePenalty } from '../utils/calculatePenalty';
import Modal from '../components/Modal';

export const BorrowedBooksPage = () => {
  const dispatch = useDispatch();
  const { user, isAdmin, isLibrarian } = useAuth();
  useEffect(() => { document.title = 'Kütüphane++ — Ödünç Aldıklarım'; }, []);
  
  const { borrowedBooks, penalties, users } = useSelector((state) => state.users);
  const { books } = useSelector((state) => state.books);

  const [selectedBookForQR, setSelectedBookForQR] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBorrowedBooks());
    dispatch(fetchBooks());
    dispatch(fetchUsers());
    dispatch(fetchPenalties());
  }, [dispatch]);

  const showAll = isAdmin || isLibrarian;

  const filteredBorrowed = showAll 
    ? borrowedBooks 
    : borrowedBooks.filter(b => String(b.userId) === String(user?.id));

  const getBookTitle = (bookId) => {
    return books.find(b => String(b.id) === String(bookId))?.title || `Kitap #${bookId}`;
  };

  const getUserName = (userId) => {
    return users.find(u => String(u.id) === String(userId))?.name || `Kullanıcı #${userId}`;
  };

  const getDueDate = (borrowDateStr) => {
    if (!borrowDateStr) return null;
    const date = new Date(borrowDateStr);
    date.setDate(date.getDate() + 15); // 15 days loan limit
    return date.toISOString().split('T')[0];
  };

  const getRemainingDays = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const due = new Date(dueDateStr);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diff = due - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleReturn = async (recordId, bookId) => {
    const resultAction = await dispatch(returnBook({ borrowedRecordId: recordId, bookId }));
    if (returnBook.fulfilled.match(resultAction)) {
      dispatch(addToast({ message: 'Kitap başarıyla iade edildi.', type: 'success' }));
    } else {
      dispatch(addToast({ message: 'İade işlemi başarısız.', type: 'error' }));
    }
  };

  const handleExtend = async (recordId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const resultAction = await dispatch(extendLoan({ recordId, newBorrowDate: todayStr }));
    if (extendLoan.fulfilled.match(resultAction)) {
      dispatch(addToast({ message: 'Ödünç süresi 15 gün uzatıldı.', type: 'success' }));
    } else {
      dispatch(addToast({ message: 'Süre uzatma işlemi başarısız.', type: 'error' }));
    }
  };

  const handleShowQR = (record) => {
    setSelectedBookForQR(record);
    setIsQRModalOpen(true);
  };

  const handlePayPenalty = async (userId) => {
    const userPenaltyRec = penalties.find(p => String(p.userId) === String(userId));
    if (userPenaltyRec) {
      const result = await dispatch(clearUserPenalty(userPenaltyRec.id));
      if (clearUserPenalty.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Ceza borcu başarıyla ödendi.', type: 'success' }));
        dispatch(fetchPenalties()); // Refresh penalties
      } else {
        dispatch(addToast({ message: 'Ödeme başarısız.', type: 'error' }));
      }
    } else {
      dispatch(addToast({ message: 'Ödenecek ceza borcu bulunamadı.', type: 'info' }));
    }
  };

  return (
    <div className="space-y-lg text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="space-y-xs">
          <h1 className="font-display-lg text-primary text-3xl font-bold">Ödünç Alınan Kitaplar</h1>
          <p className="font-body-md text-on-surface-variant">
            {showAll ? 'Tüm Ödünç İşlemleri (Yönetici Görünümü)' : 'Şu an okumakta olduğunuz ve geçmişte aldığınız kitaplar.'}
          </p>
        </div>
        
        {/* User penalty quick widgets */}
        {!showAll && (
          <div className="flex items-center gap-md bg-surface-container border border-outline-variant p-md rounded-xl shadow-glow-accent">
            <div>
              <p className="text-xs text-on-surface-variant uppercase font-medium">Toplam Ceza Borcunuz</p>
              <p className="font-metadata-mono font-bold text-lg text-error">
                {penalties.filter(p => String(p.userId) === String(user?.id)).reduce((sum, curr) => sum + curr.amount, 0)} TL
              </p>
            </div>
            {penalties.some(p => String(p.userId) === String(user?.id)) && (
              <button 
                onClick={() => handlePayPenalty(user.id)}
                className="px-sm py-2 bg-error text-white font-bold text-xs rounded hover:opacity-90 active:scale-95 transition-all"
              >
                Cezayı Öde
              </button>
            )}
          </div>
        )}
      </div>

      <div className="glass-card rounded-xl border border-outline-variant overflow-x-auto">
        <table className="min-w-full divide-y divide-outline-variant font-body-md text-sm text-left">
          <thead className="bg-surface-container-high text-on-surface font-semibold">
            <tr>
              <th className="px-md py-sm">ID</th>
              {showAll && <th className="px-md py-sm">Kullanıcı</th>}
              <th className="px-md py-sm">Kitap</th>
              <th className="px-md py-sm">Ödünç Tarihi</th>
              <th className="px-md py-sm">Teslim Tarihi</th>
              <th className="px-md py-sm">Kalan Süre / Ceza</th>
              <th className="px-md py-sm">Durum</th>
              <th className="px-md py-sm text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredBorrowed.length === 0 ? (
              <tr>
                <td colSpan={showAll ? 8 : 7} className="px-md py-lg text-center text-on-surface-variant">
                  Ödünç alınmış kitap bulunamadı.
                </td>
              </tr>
            ) : (
              filteredBorrowed.map((record) => {
                const dueDate = getDueDate(record.borrowDate);
                const remaining = dueDate ? getRemainingDays(dueDate) : 0;
                
                // Live Penalty Calculation
                const isOverdue = record.status === 'overdue' || (record.status === 'active' && remaining < 0);
                const liveFine = isOverdue ? calculatePenalty(dueDate) : 0;

                return (
                  <tr key={record.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="px-md py-sm font-metadata-mono text-label-xs text-on-surface-variant">{record.id}</td>
                    {showAll && <td className="px-md py-sm font-semibold">{getUserName(record.userId)}</td>}
                    <td className="px-md py-sm font-medium">{getBookTitle(record.bookId)}</td>
                    <td className="px-md py-sm font-metadata-mono text-xs">{record.borrowDate || '—'}</td>
                    <td className="px-md py-sm font-metadata-mono text-xs">{dueDate || '—'}</td>
                    <td className="px-md py-sm">
                      {record.status === 'returned' ? (
                        <span className="text-on-surface-variant text-xs">—</span>
                      ) : remaining < 0 ? (
                        <span className="text-error font-bold font-metadata-mono animate-pulse">
                          Gecikti ({Math.abs(remaining)} gün) {liveFine > 0 && `/ +${liveFine} TL`}
                        </span>
                      ) : remaining <= 5 ? (
                        <span className="text-accent-gold font-bold font-metadata-mono">
                          {remaining} gün kaldı
                        </span>
                      ) : (
                        <span className="text-success font-medium font-metadata-mono">
                          {remaining} gün kaldı
                        </span>
                      )}
                    </td>
                    <td className="px-md py-sm">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                        record.status === 'active' ? 'bg-success/20 text-success' :
                        record.status === 'returned' ? 'bg-outline-variant/20 text-on-surface-variant' :
                        'bg-error/20 text-error'
                      }`}>
                        {record.status === 'active' ? 'Aktif' :
                         record.status === 'returned' ? 'İade Edildi' :
                         record.status === 'overdue' ? 'Gecikmiş' : record.status}
                      </span>
                    </td>
                    <td className="px-md py-sm text-right space-x-xs">
                      {record.status !== 'returned' && (
                        <>
                          <button
                            onClick={() => handleShowQR(record)}
                            className="px-sm py-1 bg-vivid-purple text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                          >
                            QR Kod
                          </button>
                          <button
                            onClick={() => handleExtend(record.id)}
                            className="px-sm py-1 bg-success text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                          >
                            Süre Uzat
                          </button>
                          <button
                            onClick={() => handleReturn(record.id, record.bookId)}
                            className="px-sm py-1 bg-ember-orange text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                          >
                            İade Et
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* QR Code Modal for Return */}
      <Modal
        isOpen={isQRModalOpen}
        onClose={() => {
          setIsQRModalOpen(false);
          setSelectedBookForQR(null);
        }}
        title="Kitap İade QR Kodu"
      >
        {selectedBookForQR && (
          <div className="flex flex-col items-center justify-center p-lg text-center space-y-md">
            <p className="font-body-md text-sm text-on-surface-variant">
              Kitabı teslim ederken kütüphane görevlisinin barkod/QR okuyucusuna aşağıdaki kodu taratın.
            </p>
            <div className="p-md bg-white rounded-xl shadow-lg border border-outline-variant">
              {/* Simulated QR Code using CSS grid */}
              <div className="w-40 h-40 bg-slate-900 flex flex-wrap p-2 gap-[2px]">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-[34px] h-[34px] ${
                      (i % 4 === 1 || i % 3 === 2 || i === 0 || i === 12 || i === 3) ? 'bg-white' : 'bg-slate-900'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            <p className="font-metadata-mono text-sm text-on-surface font-bold">
              {getBookTitle(selectedBookForQR.bookId)}
            </p>
            <p className="font-metadata-mono text-xs text-on-surface-variant uppercase tracking-wider">
              RETURN-REC-{selectedBookForQR.id}-USER-{selectedBookForQR.userId}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BorrowedBooksPage;
