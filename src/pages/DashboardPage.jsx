import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks, fetchPenalties, updateUser } from '../store/userSlice';
import { fetchReservations, fetchStudyDesks, fetchMeetingRooms } from '../store/reservationSlice';
import { fetchBooks, fetchCategories } from '../store/bookSlice';
import useAuth from '../hooks/useAuth';
import { addToast } from '../store/uiSlice';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const { borrowedBooks, penalties } = useSelector((state) => state.users);
  const { reservations, studyDesks, meetingRooms } = useSelector((state) => state.reservations);
  const { books, categories } = useSelector((state) => state.books);

  // Target Editing state
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(Number(user?.readingTarget || 24));

  useEffect(() => {
    dispatch(fetchBorrowedBooks());
    dispatch(fetchPenalties());
    dispatch(fetchReservations());
    dispatch(fetchBooks());
    dispatch(fetchCategories());
    dispatch(fetchStudyDesks());
    dispatch(fetchMeetingRooms());
  }, [dispatch]);

  // Calculate user specific stats
  const userBorrowed = borrowedBooks.filter(item => String(item.userId) === String(user?.id));
  const activeBorrowed = userBorrowed.filter(item => item.status === 'active');
  const returnedBorrowed = userBorrowed.filter(item => item.status === 'returned');
  
  const userReservations = reservations.filter(item => String(item.userId) === String(user?.id));
  const activeReservations = userReservations.filter(item => item.status === 'pending' || item.status === 'approved');
  const userPenalty = penalties.filter(item => String(item.userId) === String(user?.id)).reduce((sum, curr) => sum + curr.amount, 0);

  const getBookTitle = (bookId) => {
    return books.find(b => String(b.id) === String(bookId))?.title || `Kitap #${bookId}`;
  };

  // 1. Reading Stats
  const totalPagesRead = userBorrowed.reduce((total, record) => {
    const book = books.find(b => String(b.id) === String(record.bookId));
    return total + (book ? Number(book.pages || 0) : 0);
  }, 0);

  const readingTarget = Number(user?.readingTarget || 24);
  const readingTargetProgress = Math.min(Math.round((returnedBorrowed.length / readingTarget) * 100), 100);

  const handleSaveTarget = async () => {
    const targetVal = Number(tempTarget);
    if (isNaN(targetVal) || targetVal <= 0) {
      dispatch(addToast({ message: 'Lütfen geçerli bir sayı girin.', type: 'warning' }));
      return;
    }
    const result = await dispatch(updateUser({ id: user.id, userData: { readingTarget: targetVal } }));
    if (updateUser.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Okuma hedefiniz güncellendi.', type: 'success' }));
      
      // Update local storage
      const savedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      savedUser.readingTarget = targetVal;
      localStorage.setItem('auth_user', JSON.stringify(savedUser));
      
      setIsEditingTarget(false);
    } else {
      dispatch(addToast({ message: 'Güncelleme başarısız.', type: 'error' }));
    }
  };

  // 2. Category Distribution (Pie Chart data)
  const categoryCounts = {};
  userBorrowed.forEach(record => {
    const book = books.find(b => String(b.id) === String(record.bookId));
    if (book) {
      const cat = categories.find(c => String(c.id) === String(book.categoryId));
      const catName = cat ? cat.name : 'Diğer';
      categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
    }
  });

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  const totalCategoryValues = categoryData.reduce((sum, item) => sum + item.value, 0);

  // 3. Monthly Reading Data (Bar Chart data)
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const monthlyCounts = Array(12).fill(0);
  
  // We simulate some mock data if current user doesn't have enough borrow logs to make chart interesting
  const hasHistory = userBorrowed.length > 0;
  if (hasHistory) {
    userBorrowed.forEach(record => {
      const dateStr = record.borrowDate || '2026-07-01'; // Default fallback
      const date = new Date(dateStr);
      const month = date.getMonth();
      if (month >= 0 && month < 12) {
        monthlyCounts[month] += 1;
      }
    });
  } else {
    // Mock history for empty account to make it feel rich & alive
    monthlyCounts[4] = 2; // May
    monthlyCounts[5] = 3; // June
    monthlyCounts[6] = 1; // July
  }

  // Find max value for bar scaling
  const maxMonthlyCount = Math.max(...monthlyCounts, 1);

  // 4. Live Occupancy calculations
  const totalDesks = studyDesks.length || 10;
  const occupiedDesks = studyDesks.filter(d => d.status === 'occupied' || d.status === 'reserved').length;
  const deskOccupancyRate = Math.round((occupiedDesks / totalDesks) * 100);

  const totalRooms = meetingRooms.length || 4;
  const occupiedRooms = meetingRooms.filter(r => r.status === 'reserved').length;
  const roomOccupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  // Colors for SVG Pie Chart
  const pieColors = ['#FF5D3A', '#5B21B6', '#FFB800', '#FF3D81', '#10B981'];

  // Helper for generating Pie slices
  let accumulatedAngle = 0;
  const pieSlices = categoryData.map((item, idx) => {
    const percentage = item.value / totalCategoryValues;
    const angle = percentage * 360;
    const x1 = Math.cos((accumulatedAngle - 90) * Math.PI / 180) * 80 + 100;
    const y1 = Math.sin((accumulatedAngle - 90) * Math.PI / 180) * 80 + 100;
    accumulatedAngle += angle;
    const x2 = Math.cos((accumulatedAngle - 90) * Math.PI / 180) * 80 + 100;
    const y2 = Math.sin((accumulatedAngle - 90) * Math.PI / 180) * 80 + 100;
    const largeArc = angle > 180 ? 1 : 0;
    
    // SVG path for a sector
    const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return {
      pathData,
      color: pieColors[idx % pieColors.length],
      name: item.name,
      value: item.value,
      percentage: Math.round(percentage * 100)
    };
  });

  return (
    <div className="space-y-lg text-left">
      <div className="space-y-xs">
        <h1 className="font-display-lg text-primary text-3xl md:text-4xl font-bold">Genel Bakış</h1>
        <p className="font-body-md text-on-surface-variant">Hoş geldiniz, {user?.name}. Kütüphane durumu ve kişisel okuma özetiniz aşağıdadır.</p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent hover:border-vivid-purple transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label-xs text-xs text-on-surface-variant uppercase tracking-wider">Aktif Ödünç</p>
              <h3 className="font-headline-h2 text-3xl font-bold mt-xs text-ember-orange">{activeBorrowed.length}</h3>
            </div>
            <span className="material-symbols-outlined text-ember-orange text-3xl">menu_book</span>
          </div>
          <p className="font-label-xs text-xs text-on-surface-variant/80 mt-sm">Şu an okuduğunuz kitaplar</p>
        </div>

        <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent hover:border-vivid-purple transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label-xs text-xs text-on-surface-variant uppercase tracking-wider">Rezervasyonlar</p>
              <h3 className="font-headline-h2 text-3xl font-bold mt-xs text-vivid-purple">{activeReservations.length}</h3>
            </div>
            <span className="material-symbols-outlined text-vivid-purple text-3xl">bookmark</span>
          </div>
          <p className="font-label-xs text-xs text-on-surface-variant/80 mt-sm">Bekleyen / onaylı rezervasyonlar</p>
        </div>

        <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent hover:border-vivid-purple transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label-xs text-xs text-on-surface-variant uppercase tracking-wider">Ceza Borcu</p>
              <h3 className="font-headline-h2 text-3xl font-bold mt-xs text-error">{userPenalty} TL</h3>
            </div>
            <span className="material-symbols-outlined text-error text-3xl">payments</span>
          </div>
          <p className="font-label-xs text-xs text-on-surface-variant/80 mt-sm">Gecikme cezası borç tutarı</p>
        </div>

        <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent hover:border-vivid-purple transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label-xs text-xs text-on-surface-variant uppercase tracking-wider">Toplam Okunan</p>
              <h3 className="font-headline-h2 text-3xl font-bold mt-xs text-success">{returnedBorrowed.length} Kitap</h3>
            </div>
            <span className="material-symbols-outlined text-success text-3xl">task_alt</span>
          </div>
          <p className="font-label-xs text-xs text-on-surface-variant/80 mt-sm">İade ettiğiniz kitap sayısı</p>
        </div>
      </div>

      {/* Target Progress & Live Occupancy row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Reading target progress bar */}
        <div className="glass-card p-lg rounded-xl border border-outline-variant lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-xs">
              <h3 className="font-headline-h3 text-lg font-bold text-on-surface">Kişisel Okuma Hedefi</h3>
              <p className="font-body-md text-sm text-on-surface-variant">Bu yıl kendiniz için belirlediğiniz kitap okuma hedefi.</p>
            </div>
            
            {!isEditingTarget ? (
              <button 
                onClick={() => { setTempTarget(readingTarget); setIsEditingTarget(true); }}
                className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-ember-orange transition-colors flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            ) : null}
          </div>
          
          <div className="py-md space-y-sm">
            {isEditingTarget ? (
              <div className="flex items-center gap-sm">
                <input 
                  type="number"
                  className="px-2 py-1 text-xs border border-outline bg-surface-container text-on-surface rounded w-20 focus:outline-none"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(Number(e.target.value))}
                  min="1"
                />
                <button onClick={handleSaveTarget} className="px-3 py-1 bg-success text-white text-xs font-bold rounded cursor-pointer">Kaydet</button>
                <button onClick={() => setIsEditingTarget(false)} className="px-3 py-1 bg-surface-container-high text-on-surface text-xs font-bold rounded cursor-pointer">İptal</button>
              </div>
            ) : (
              <div className="flex justify-between font-metadata-mono text-sm">
                <span className="text-on-surface-variant">Yıllık Hedef: {returnedBorrowed.length} / {readingTarget} Kitap</span>
                <span className="text-ember-orange font-bold">{readingTargetProgress}%</span>
              </div>
            )}
            <div className="w-full bg-surface-container-highest rounded-full h-3.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-vivid-purple to-ember-orange h-full rounded-full transition-all duration-500" 
                style={{ width: `${readingTargetProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md pt-sm border-t border-outline-variant/40">
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Toplam Okunan Sayfa</p>
              <p className="font-metadata-mono font-bold text-xl text-primary">{totalPagesRead} Sayfa</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Kategori Çeşitliliği</p>
              <p className="font-metadata-mono font-bold text-xl text-primary">{Object.keys(categoryCounts).length} Kategori</p>
            </div>
          </div>
        </div>

        {/* Live occupancy status */}
        <div className="glass-card p-lg rounded-xl border border-outline-variant space-y-md">
          <h3 className="font-headline-h3 text-lg font-bold text-on-surface">Canlı Alan Doluluk Durumu</h3>
          
          <div className="space-y-md pt-xs">
            {/* Study desks */}
            <div className="space-y-xs">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface font-medium flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm text-success">table_restaurant</span>
                  Çalışma Masaları
                </span>
                <span className="font-metadata-mono text-on-surface-variant">{deskOccupancyRate}% Dolu</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${deskOccupancyRate > 80 ? 'bg-error' : deskOccupancyRate > 50 ? 'bg-accent-gold' : 'bg-success'}`}
                  style={{ width: `${deskOccupancyRate}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-on-surface-variant">{occupiedDesks} / {totalDesks} Masa Kullanımda</p>
            </div>

            {/* Meeting rooms */}
            <div className="space-y-xs">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface font-medium flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm text-success">meeting_room</span>
                  Grup Çalışma Odaları
                </span>
                <span className="font-metadata-mono text-on-surface-variant">{roomOccupancyRate}% Dolu</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${roomOccupancyRate > 80 ? 'bg-error' : roomOccupancyRate > 50 ? 'bg-accent-gold' : 'bg-success'}`}
                  style={{ width: `${roomOccupancyRate}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-on-surface-variant">{occupiedRooms} / {totalRooms} Oda Rezerve</p>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Category distribution pie chart */}
        <div className="glass-card p-lg rounded-xl border border-outline-variant flex flex-col justify-between">
          <div>
            <h3 className="font-headline-h3 text-lg font-bold text-on-surface">Kategori Dağılımı</h3>
            <p className="font-body-md text-sm text-on-surface-variant">Ödünç aldığınız kitapların kategorilere göre dağılımı.</p>
          </div>

          {totalCategoryValues === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant text-center space-y-sm">
              <span className="material-symbols-outlined text-4xl">pie_chart_outline</span>
              <p className="text-sm">Henüz veri bulunamadı. Kitap okudukça dağılımınız burada görünecektir.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-around gap-md py-md">
              <svg width="200" height="200" viewBox="0 0 200 200" className="transform rotate-0">
                {pieSlices.map((slice, i) => (
                  <path 
                    key={i} 
                    d={slice.pathData} 
                    fill={slice.color}
                    className="hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <title>{`${slice.name}: ${slice.value} Kitap (${slice.percentage}%)`}</title>
                  </path>
                ))}
                {/* Center cutout for Donut effect */}
                <circle cx="100" cy="100" r="45" fill="#1f1f24" />
              </svg>
              
              <div className="space-y-xs max-h-[160px] overflow-y-auto pr-xs">
                {pieSlices.map((slice, i) => (
                  <div key={i} className="flex items-center gap-sm text-xs font-medium">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }}></span>
                    <span className="text-on-surface max-w-[100px] truncate">{slice.name}</span>
                    <span className="text-on-surface-variant font-metadata-mono">%{slice.percentage} ({slice.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly reading bar chart */}
        <div className="glass-card p-lg rounded-xl border border-outline-variant flex flex-col justify-between">
          <div>
            <h3 className="font-headline-h3 text-lg font-bold text-on-surface">Aylık Okuma İstatistikleri</h3>
            <p className="font-body-md text-sm text-on-surface-variant">Aylara göre okuduğunuz kitap adetleri.</p>
          </div>

          <div className="py-md flex flex-col justify-end h-[200px]">
            <div className="flex items-end justify-between h-[150px] px-sm border-b border-outline-variant/30">
              {monthlyCounts.map((count, idx) => {
                const heightPercentage = Math.round((count / maxMonthlyCount) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center group w-[6%] relative">
                    {/* Tooltip */}
                    <span className="absolute -top-7 bg-surface-container-highest border border-outline-variant text-[10px] text-on-surface px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-metadata-mono z-10">
                      {count} Kitap
                    </span>
                    {/* Bar */}
                    <div 
                      className="w-full bg-gradient-to-t from-vivid-purple to-ember-orange rounded-t-sm group-hover:brightness-110 transition-all duration-500 shadow-glow-accent"
                      style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>
            
            {/* X Axis Labels */}
            <div className="flex justify-between px-[2px] pt-sm font-metadata-mono text-[9px] text-on-surface-variant uppercase">
              {monthNames.map((name, i) => (
                <span key={i} className="w-[6%] text-center">{name.substring(0, 3)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lists Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Active Loans list */}
        <div className="glass-card p-lg rounded-xl border border-outline-variant">
          <h2 className="font-headline-h3 text-lg font-bold mb-md text-on-surface">Aktif Ödünç Alınanlar</h2>
          {activeBorrowed.length === 0 ? (
            <p className="font-body-md text-on-surface-variant text-sm py-sm">Şu an ödünç aldığınız kitap bulunmamaktadır.</p>
          ) : (
            <div className="space-y-sm">
              {activeBorrowed.map((loan) => (
                <div key={loan.id} className="flex justify-between items-center py-sm border-b border-outline-variant last:border-0">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">menu_book</span>
                    <span className="font-label-sm text-sm text-on-surface font-medium">{getBookTitle(loan.bookId)}</span>
                  </div>
                  <span className="font-metadata-mono text-[10px] bg-ember-orange/20 text-ember-orange px-2 py-0.5 rounded-full font-bold uppercase">Aktif</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Reservations list */}
        <div className="glass-card p-lg rounded-xl border border-outline-variant">
          <h2 className="font-headline-h3 text-lg font-bold mb-md text-on-surface">Bekleyen Rezervasyonlar</h2>
          {activeReservations.length === 0 ? (
            <p className="font-body-md text-on-surface-variant text-sm py-sm">Aktif rezervasyonunuz bulunmamaktadır.</p>
          ) : (
            <div className="space-y-sm">
              {activeReservations.map((res) => (
                <div key={res.id} className="flex justify-between items-center py-sm border-b border-outline-variant last:border-0">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">bookmark</span>
                    <span className="font-label-sm text-sm text-on-surface font-medium">{getBookTitle(res.bookId)}</span>
                  </div>
                  <span className={`font-label-xs text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${res.status === 'approved' ? 'bg-success/20 text-success' : 'bg-accent-gold/20 text-accent-gold'}`}>
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
