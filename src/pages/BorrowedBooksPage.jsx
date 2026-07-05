import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { extendBookDueDate } from '../store/dashboardSlice';

const BorrowedBooksPage = () => {
  const dispatch = useDispatch();
  // Redux store'dan ödünç alınan kitapları güvenli bir şekilde çekiyoruz
  const borrowedBooks = useSelector((state) => state.dashboard?.borrowedBooks) || [];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Ödünç Aldığım Kitaplar</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm font-semibold border-b border-slate-200">
              <th className="p-4">Kitap Adı</th>
              <th className="p-4">Yazar</th>
              <th className="p-4">Son Teslim Tarihi</th>
              <th className="p-4">Durum</th>
              <th className="p-4 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
            {borrowedBooks.map((book) => (
              <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4 text-amber-600 font-medium">{book.dueDate}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {book.status}
                  </span>
                </td>
                <td className="p-4 text-center space-x-2">
                  <button 
                    onClick={() => dispatch(extendBookDueDate(book.id))}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Süre Uzat
                  </button>
                  <span className="inline-block bg-slate-200 text-slate-700 px-2 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors hover:bg-slate-300">
                    QR Kod
                  </span>
                </td>
              </tr>
            ))}
            {borrowedBooks.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">
                  Henüz ödünç aldığınız bir kitap bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowedBooksPage;