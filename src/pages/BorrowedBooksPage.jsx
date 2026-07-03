import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks, returnBook } from '../store/userSlice';
import { fetchBooks } from '../store/bookSlice';
import { fetchUsers } from '../store/userSlice';
import useAuth from '../hooks/useAuth';
import { addToast } from '../store/uiSlice';

export const BorrowedBooksPage = () => {
  const dispatch = useDispatch();
  const { user, isAdmin, isLibrarian } = useAuth();
  
  const { borrowedBooks } = useSelector((state) => state.users);
  const { books } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchBorrowedBooks());
    dispatch(fetchBooks());
    dispatch(fetchUsers());
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

  const handleReturn = async (recordId, bookId) => {
    const resultAction = await dispatch(returnBook({ borrowedRecordId: recordId, bookId }));
    if (returnBook.fulfilled.match(resultAction)) {
      dispatch(addToast({ message: 'Kitap başarıyla iade edildi.', type: 'success' }));
    } else {
      dispatch(addToast({ message: 'İade işlemi başarısız.', type: 'error' }));
    }
  };

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-center">
        <h1 className="font-display-lg text-primary text-3xl font-bold">Ödünç Alınan Kitaplar</h1>
        <span className="text-sm text-on-surface-variant font-label-sm">
          {showAll ? 'Tüm Ödünç İşlemleri (Yönetici Görünümü)' : 'Ödünç Aldığım Kitaplar'}
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
            {filteredBorrowed.length === 0 ? (
              <tr>
                <td colSpan={showAll ? 5 : 4} className="px-md py-lg text-center text-on-surface-variant">
                  Ödünç alınmış kitap bulunamadı.
                </td>
              </tr>
            ) : (
              filteredBorrowed.map((record) => (
                <tr key={record.id} className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-md py-sm font-metadata-mono text-label-xs text-on-surface-variant">{record.id}</td>
                  {showAll && <td className="px-md py-sm font-semibold">{getUserName(record.userId)}</td>}
                  <td className="px-md py-sm font-medium">{getBookTitle(record.bookId)}</td>
                  <td className="px-md py-sm">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                      record.status === 'active' ? 'bg-amber-orange/20 text-ember-orange' :
                      record.status === 'returned' ? 'bg-success/20 text-success' :
                      'bg-error/20 text-error'
                    }`}>
                      {record.status === 'active' ? 'Aktif' :
                       record.status === 'returned' ? 'İade Edildi' :
                       record.status === 'overdue' ? 'Gecikmiş' : record.status}
                    </span>
                  </td>
                  <td className="px-md py-sm text-right">
                    {record.status === 'active' && (
                      <button
                        onClick={() => handleReturn(record.id, record.bookId)}
                        className="px-sm py-1 bg-ember-orange text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all"
                      >
                        İade Et
                      </button>
                    )}
                    {record.status === 'overdue' && (
                      <button
                        onClick={() => handleReturn(record.id, record.bookId)}
                        className="px-sm py-1 bg-error text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all animate-pulse"
                      >
                        İade Al
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

export default BorrowedBooksPage;
