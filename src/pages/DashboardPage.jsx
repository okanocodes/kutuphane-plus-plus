import React from 'react';

const DashboardPage = () => {
  // Global state entegrasyonu öncesi güvenli mock veriler
  const stats = {
    readBooks: 24,
    activeReservations: 2,
    borrowedBooksCount: 3,
    penaltyPoints: 0,
  };

  const monthlyData = [
    { month: 'Oca', count: 4, height: 'h-16' },
    { month: 'Şub', count: 7, height: 'h-28' },
    { month: 'Mar', count: 3, height: 'h-12' },
    { month: 'Nis', count: 5, height: 'h-20' },
    { month: 'May', count: 8, height: 'h-32' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Öğrenci Paneli</h1>

      {/* İstatistik Kartları - */}
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
          <p className="text-sm text-slate-500 font-medium">Ödünç Alınanlar</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{stats.borrowedBooksCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Ceza Puanı</p>
          <p className={`text-3xl font-bold mt-2 ${stats.penaltyPoints > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
            {stats.penaltyPoints}
          </p>
        </div>
      </div>

      {/* Grafik Alanı - */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Aylık Okuma Analizi</h3>
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
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Kütüphane++</h3>
            <p className="text-sm text-indigo-100">Teslim tarihi yaklaşan kitaplarınızı ve aktif salon rezervasyonlarınızı bu panelden takip edebilirsiniz.</p>
          </div>
          <button className="mt-4 bg-white text-indigo-700 font-semibold px-4 py-2 rounded-xl text-sm shadow hover:bg-indigo-50 transition-all">
            Detayları İncele
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;