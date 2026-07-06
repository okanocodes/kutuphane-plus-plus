import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchReservations, 
  updateReservationStatus, 
  fetchStudyDesks, 
  fetchMeetingRooms,
  cancelStudyDeskReservation,
  checkInStudyDesk,
  extendStudyDeskReservation,
  cancelMeetingRoomReservation
} from '../store/reservationSlice';
import { fetchBooks } from '../store/bookSlice';
import { fetchUsers } from '../store/userSlice';
import useAuth from '../hooks/useAuth';
import { addToast } from '../store/uiSlice';
import Modal from '../components/Modal';

export const ReservationsPage = () => {
  const dispatch = useDispatch();
  const { user, isAdmin, isLibrarian } = useAuth();
  
  const { reservations, studyDesks, meetingRooms } = useSelector((state) => state.reservations);
  const { books } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);

  // Tabs: 'books' | 'desks' | 'rooms'
  const [activeCategory, setActiveCategory] = useState('books');
  
  // Book sub-tabs: 'all' | 'pending' | 'approved' | 'canceled'
  const [bookSubTab, setBookSubTab] = useState('all');

  // Modal states
  const [selectedDeskForQR, setSelectedDeskForQR] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(fetchBooks());
    dispatch(fetchUsers());
    dispatch(fetchStudyDesks());
    dispatch(fetchMeetingRooms());
  }, [dispatch]);

  const showAll = isAdmin || isLibrarian;

  // Filters for book reservations
  const userReservations = showAll 
    ? reservations 
    : reservations.filter(r => String(r.userId) === String(user?.id));

  const filteredBookReservations = userReservations.filter(r => {
    if (bookSubTab === 'all') return true;
    return r.status === bookSubTab;
  });

  // Filters for desks
  const userDesks = showAll
    ? studyDesks.filter(d => d.status === 'reserved' || d.status === 'occupied')
    : studyDesks.filter(d => String(d.userId) === String(user?.id));

  // Filters for rooms
  const userRooms = showAll
    ? meetingRooms.filter(r => r.status === 'reserved')
    : meetingRooms.filter(r => String(r.userId) === String(user?.id));

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

  // Study Desk Actions
  const handleCancelDesk = async (deskId) => {
    if (window.confirm('Bu masa rezervasyonunu iptal etmek istediğinize emin misiniz?')) {
      const result = await dispatch(cancelStudyDeskReservation(deskId));
      if (cancelStudyDeskReservation.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Masa rezervasyonu başarıyla iptal edildi.', type: 'success' }));
      } else {
        dispatch(addToast({ message: 'İptal işlemi başarısız.', type: 'error' }));
      }
    }
  };

  const handleCheckInDesk = async (deskId) => {
    setSelectedDeskForQR(deskId);
    setIsQRModalOpen(true);
  };

  const confirmCheckIn = async () => {
    if (selectedDeskForQR) {
      const result = await dispatch(checkInStudyDesk(selectedDeskForQR));
      if (checkInStudyDesk.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Masaya giriş yapıldı (Check-in başarılı).', type: 'success' }));
      } else {
        dispatch(addToast({ message: 'Giriş işlemi başarısız.', type: 'error' }));
      }
    }
    setIsQRModalOpen(false);
    setSelectedDeskForQR(null);
  };

  const handleExtendDesk = async (deskId, currentTimeSlot) => {
    // Basic slots parser to add 2 hours
    let newSlot = currentTimeSlot;
    if (currentTimeSlot === '09:00 - 11:00') newSlot = '09:00 - 13:00';
    else if (currentTimeSlot === '11:00 - 13:00') newSlot = '11:00 - 15:00';
    else if (currentTimeSlot === '13:00 - 15:00') newSlot = '13:00 - 17:00';
    else if (currentTimeSlot === '15:00 - 17:00') newSlot = '15:00 - 19:00';
    else if (currentTimeSlot === '17:00 - 19:00') newSlot = '17:00 - 21:00';
    else {
      dispatch(addToast({ message: 'Bu rezervasyon süresi daha fazla uzatılamaz.', type: 'warning' }));
      return;
    }

    const result = await dispatch(extendStudyDeskReservation({ deskId, newTimeSlot: newSlot }));
    if (extendStudyDeskReservation.fulfilled.match(result)) {
      dispatch(addToast({ message: `Masa süresi uzatıldı. Yeni saat: ${newSlot}`, type: 'success' }));
    } else {
      dispatch(addToast({ message: 'Süre uzatma başarısız.', type: 'error' }));
    }
  };

  // Meeting Room Actions
  const handleCancelRoom = async (roomId) => {
    if (window.confirm('Bu oda rezervasyonunu iptal etmek istediğinize emin misiniz?')) {
      const result = await dispatch(cancelMeetingRoomReservation(roomId));
      if (cancelMeetingRoomReservation.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Toplantı odası rezervasyonu başarıyla iptal edildi.', type: 'success' }));
      } else {
        dispatch(addToast({ message: 'İptal işlemi başarısız.', type: 'error' }));
      }
    }
  };

  return (
    <div className="space-y-lg text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="space-y-xs">
          <h1 className="font-display-lg text-primary text-3xl font-bold">Rezervasyonlarım</h1>
          <p className="font-body-md text-on-surface-variant">
            {showAll ? 'Tüm Rezervasyonlar (Yönetici Görünümü)' : 'Kitap, çalışma masası ve toplantı odası rezervasyonlarınız.'}
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-outline-variant font-label-sm text-sm">
        <button 
          onClick={() => setActiveCategory('books')}
          className={`px-md py-sm border-b-2 font-bold transition-all flex items-center gap-xs cursor-pointer ${
            activeCategory === 'books' ? 'border-ember-orange text-ember-orange' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm">book</span>
          Kitap Rezervasyonları
        </button>
        <button 
          onClick={() => setActiveCategory('desks')}
          className={`px-md py-sm border-b-2 font-bold transition-all flex items-center gap-xs cursor-pointer ${
            activeCategory === 'desks' ? 'border-ember-orange text-ember-orange' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm">table_restaurant</span>
          Masa Rezervasyonları
        </button>
        <button 
          onClick={() => setActiveCategory('rooms')}
          className={`px-md py-sm border-b-2 font-bold transition-all flex items-center gap-xs cursor-pointer ${
            activeCategory === 'rooms' ? 'border-ember-orange text-ember-orange' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm">meeting_room</span>
          Oda Rezervasyonları
        </button>
      </div>

      {/* Book Reservations Tab content */}
      {activeCategory === 'books' && (
        <div className="space-y-md">
          {/* Book Sub-Tabs */}
          <div className="flex gap-sm font-label-xs text-xs">
            {['all', 'pending', 'approved', 'canceled'].map((tab) => {
              const labels = { all: 'Tümü', pending: 'Bekleyen', approved: 'Onaylı', canceled: 'İptal' };
              return (
                <button
                  key={tab}
                  onClick={() => setBookSubTab(tab)}
                  className={`px-3 py-1 rounded-full font-bold transition-all uppercase cursor-pointer ${
                    bookSubTab === tab 
                      ? 'bg-vivid-purple text-white' 
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          <div className="glass-card rounded-xl border border-outline-variant overflow-x-auto">
            <table className="min-w-full divide-y divide-outline-variant font-body-md text-sm text-left">
              <thead className="bg-surface-container-high text-on-surface font-semibold">
                <tr>
                  <th className="px-md py-sm">ID</th>
                  {showAll && <th className="px-md py-sm">Kullanıcı</th>}
                  <th className="px-md py-sm">Kitap</th>
                  <th className="px-md py-sm">Tarih</th>
                  <th className="px-md py-sm">Durum</th>
                  <th className="px-md py-sm text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredBookReservations.length === 0 ? (
                  <tr>
                    <td colSpan={showAll ? 6 : 5} className="px-md py-lg text-center text-on-surface-variant">
                      Rezervasyon bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredBookReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="px-md py-sm font-metadata-mono text-label-xs text-on-surface-variant">{res.id}</td>
                      {showAll && <td className="px-md py-sm font-semibold">{getUserName(res.userId)}</td>}
                      <td className="px-md py-sm font-medium">{getBookTitle(res.bookId)}</td>
                      <td className="px-md py-sm font-metadata-mono text-xs">{res.date || '—'}</td>
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
                                  className="px-sm py-1 bg-success text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                >
                                  Onayla
                                </button>
                                <button
                                  onClick={() => handleStatusChange(res.id, 'canceled', res.bookId)}
                                  className="px-sm py-1 bg-error text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                >
                                  Reddet
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(res.id, 'canceled', res.bookId)}
                                className="px-sm py-1 bg-outline text-white text-xs font-bold rounded hover:bg-error active:scale-95 transition-all cursor-pointer"
                              >
                                İptal Et
                              </button>
                            )}
                          </>
                        )}
                        {res.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'canceled', res.bookId)}
                            className="px-sm py-1 bg-outline text-white text-xs font-bold rounded hover:bg-error active:scale-95 transition-all cursor-pointer"
                          >
                            İptal Et
                          </button>
                        )}
                        {res.status === 'canceled' && (
                          <span className="text-xs text-on-surface-variant">İşlem Yapılamaz</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Study Desk Reservations content */}
      {activeCategory === 'desks' && (
        <div className="glass-card rounded-xl border border-outline-variant overflow-x-auto">
          <table className="min-w-full divide-y divide-outline-variant font-body-md text-sm text-left">
            <thead className="bg-surface-container-high text-on-surface font-semibold">
              <tr>
                <th className="px-md py-sm">Masa No</th>
                {showAll && <th className="px-md py-sm">Kullanıcı</th>}
                <th className="px-md py-sm">Kat</th>
                <th className="px-md py-sm">Salon</th>
                <th className="px-md py-sm">Tarih</th>
                <th className="px-md py-sm">Saat Aralığı</th>
                <th className="px-md py-sm">Durum</th>
                <th className="px-md py-sm text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {userDesks.length === 0 ? (
                <tr>
                  <td colSpan={showAll ? 8 : 7} className="px-md py-lg text-center text-on-surface-variant">
                    Masa rezervasyonu bulunamadı.
                  </td>
                </tr>
              ) : (
                userDesks.map((desk) => (
                  <tr key={desk.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="px-md py-sm font-semibold">Masa {desk.id}</td>
                    {showAll && <td className="px-md py-sm font-medium">{getUserName(desk.userId)}</td>}
                    <td className="px-md py-sm">{desk.floor || '—'}</td>
                    <td className="px-md py-sm">{desk.hall || '—'}</td>
                    <td className="px-md py-sm font-metadata-mono text-xs">{desk.date || '—'}</td>
                    <td className="px-md py-sm font-metadata-mono text-xs">{desk.timeSlot || '—'}</td>
                    <td className="px-md py-sm">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                        desk.status === 'occupied' ? 'bg-success/20 text-success' : 'bg-accent-gold/20 text-accent-gold'
                      }`}>
                        {desk.status === 'occupied' ? 'Kullanımda' : 'Rezerve'}
                      </span>
                    </td>
                    <td className="px-md py-sm text-right space-x-xs">
                      {desk.status === 'reserved' && (
                        <>
                          <button
                            onClick={() => handleCheckInDesk(desk.id)}
                            className="px-sm py-1 bg-success text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                          >
                            Giriş Yap
                          </button>
                          <button
                            onClick={() => handleExtendDesk(desk.id, desk.timeSlot)}
                            className="px-sm py-1 bg-vivid-purple text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                          >
                            Süre Uzat
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleCancelDesk(desk.id)}
                        className="px-sm py-1 bg-outline text-white text-xs font-bold rounded hover:bg-error active:scale-95 transition-all cursor-pointer"
                      >
                        İptal Et
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Meeting Room Reservations content */}
      {activeCategory === 'rooms' && (
        <div className="glass-card rounded-xl border border-outline-variant overflow-x-auto">
          <table className="min-w-full divide-y divide-outline-variant font-body-md text-sm text-left">
            <thead className="bg-surface-container-high text-on-surface font-semibold">
              <tr>
                <th className="px-md py-sm">Oda Adı</th>
                {showAll && <th className="px-md py-sm">Kullanıcı</th>}
                <th className="px-md py-sm">Kapasite</th>
                <th className="px-md py-sm">Tarih</th>
                <th className="px-md py-sm">Saat Aralığı</th>
                <th className="px-md py-sm">Durum</th>
                <th className="px-md py-sm text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {userRooms.length === 0 ? (
                <tr>
                  <td colSpan={showAll ? 7 : 6} className="px-md py-lg text-center text-on-surface-variant">
                    Oda rezervasyonu bulunamadı.
                  </td>
                </tr>
              ) : (
                userRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="px-md py-sm font-semibold">{room.name || `Oda ${room.id}`}</td>
                    {showAll && <td className="px-md py-sm font-medium">{getUserName(room.userId)}</td>}
                    <td className="px-md py-sm">{room.capacity} Kişilik</td>
                    <td className="px-md py-sm font-metadata-mono text-xs">{room.date || '—'}</td>
                    <td className="px-md py-sm font-metadata-mono text-xs">{room.timeSlot || '—'}</td>
                    <td className="px-md py-sm">
                      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase bg-accent-gold/20 text-accent-gold">
                        Rezerve
                      </span>
                    </td>
                    <td className="px-md py-sm text-right">
                      <button
                        onClick={() => handleCancelRoom(room.id)}
                        className="px-sm py-1 bg-outline text-white text-xs font-bold rounded hover:bg-error active:scale-95 transition-all cursor-pointer"
                      >
                        İptal Et
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Check-in QR Simulation Modal */}
      <Modal
        isOpen={isQRModalOpen}
        onClose={() => {
          setIsQRModalOpen(false);
          setSelectedDeskForQR(null);
        }}
        title="Masaya Giriş (Check-in)"
      >
        <div className="flex flex-col items-center justify-center p-lg text-center space-y-md">
          <p className="font-body-md text-sm text-on-surface-variant">
            Masaya ulaştığınızda bu QR kodu fiziksel masanın üzerindeki okuyucuya taratın veya simüle etmek için aşağıdaki butona tıklayın.
          </p>
          <div className="p-md bg-white rounded-xl shadow-lg border border-outline-variant">
            {/* Simulated QR Code using CSS and standard elements */}
            <div className="w-40 h-40 bg-slate-900 flex flex-wrap p-1 gap-[2px]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-[36px] h-[36px] ${
                    (i % 3 === 0 || i % 5 === 1 || i === 0 || i === 15) ? 'bg-white' : 'bg-slate-900'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          <p className="font-metadata-mono text-xs text-on-surface-variant uppercase tracking-wider">
            MASA-{selectedDeskForQR}-CHECKIN
          </p>
          <button
            onClick={confirmCheckIn}
            className="w-full py-2.5 bg-success text-white font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            Check-in işlemini Simüle Et
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ReservationsPage;
