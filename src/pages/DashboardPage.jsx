import React from 'react';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
  // Redux store'dan verileri güvenli çekiyoruz, eğer store henüz hazır değilse varsayılan veriler devreye girer
  const dashboardState = useSelector((state) => state.dashboard) || {};
  const stats = dashboardState.stats || { readBooks: 24, activeReservations: 2, borrowedBooksCount: 3, penaltyPoints: 0 };
  const monthlyData = dashboardState.monthlyStats || [];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Kullanıcı Paneli Özet Ekranı</h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Okunan Kitaplar</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.readBooks}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Aktif Rezervasyonlar</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.activeReservations}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Ödünç Aldığım Kitaplar</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{stats.borrowedBooksCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Aktif Ceza Puanı</p>
          <p className={`text-3xl font-bold mt-2 ${stats.penaltyPoints > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
            {stats.penaltyPoints}
          </p>
        </div>
      </div>

      {/* Grafik Alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Aylık Okuma Grafiği</h3>
          <div className="flex items-end justify-between h-48 pt-4 px-4 border-b border-slate-100">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div className={`w-8 bg-indigo-500 rounded-t-lg transition-all duration-300 group-hover:bg-indigo-600 ${item.height}`}></div>
                <span className="text-xs text-slate-600 mt-2 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bilgilendirme Kartı */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Kütüphane++ Bilgi</h3>
            <p className="text-sm text-slate-300">Ödünç aldığınız kitapların sürelerini paneliniz üzerinden tek tıkla uzatabilirsiniz.</p>
          </div>
          <div className="text-xs text-indigo-400 font-semibold bg-slate-700/50 p-3 rounded-xl border border-slate-700 text-center">
            Sistem Kararlı ve Aktif
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;