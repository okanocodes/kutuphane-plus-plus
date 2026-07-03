import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudyDesks, reserveStudyDesk } from '../store/reservationSlice';
import { addToast } from '../store/uiSlice';
import useAuth from '../hooks/useAuth';

const floors = ['1. Kat', '2. Kat', '3. Kat'];
const halls = ['Sessiz Salon', 'Genel Çalışma Salonu', 'Akademik Salon'];
const timeSlots = ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00'];

export const StudyDeskPage = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { studyDesks, status } = useSelector((state) => state.reservations);

    const [selectedFloor, setSelectedFloor] = useState(floors[0]);
    const [selectedHall, setSelectedHall] = useState(halls[0]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);
    const [selectedDeskId, setSelectedDeskId] = useState(null);

    useEffect(() => {
        dispatch(fetchStudyDesks());
    }, [dispatch]);

    const selectedDesk = useMemo(() => {
        return studyDesks.find((desk) => String(desk.id) === String(selectedDeskId));
    }, [studyDesks, selectedDeskId]);

    const availableDeskCount = studyDesks.filter((desk) => desk.status === 'available').length;
    const reservedDeskCount = studyDesks.filter((desk) => desk.status === 'reserved').length;
    const occupiedDeskCount = studyDesks.filter((desk) => desk.status === 'occupied').length;

    const getDeskStatusLabel = (statusValue) => {
        const labels = {
            available: 'Müsait',
            reserved: 'Rezerve',
            occupied: 'Dolu',
        };

        return labels[statusValue] || statusValue;
    };

    const getDeskStatusClass = (statusValue) => {
        const classes = {
            available: 'border-success/40 bg-success/10 text-success hover:border-success',
            reserved: 'border-accent-gold/40 bg-accent-gold/10 text-accent-gold cursor-not-allowed opacity-70',
            occupied: 'border-error/40 bg-error/10 text-error cursor-not-allowed opacity-70',
        };

        return classes[statusValue] || 'border-outline-variant bg-surface-container text-on-surface-variant';
    };

    const handleReserveDesk = async () => {
        if (!selectedDeskId) {
            dispatch(addToast({ message: 'Lütfen bir masa seçin.', type: 'warning' }));
            return;
        }

        if (!selectedDesk || selectedDesk.status !== 'available') {
            dispatch(addToast({ message: 'Bu masa rezerve edilemez.', type: 'error' }));
            return;
        }

        const resultAction = await dispatch(
            reserveStudyDesk({
                deskId: selectedDeskId,
                userId: user?.id,
                date: selectedDate,
                timeSlot: selectedTimeSlot,
                floor: selectedFloor,
                hall: selectedHall,
            })
        );

        if (reserveStudyDesk.fulfilled.match(resultAction)) {
            dispatch(addToast({ message: 'Masa rezervasyonunuz başarıyla oluşturuldu.', type: 'success' }));
            setSelectedDeskId(null);
        } else {
            dispatch(addToast({ message: resultAction.payload || 'Masa rezervasyonu başarısız.', type: 'error' }));
        }
    };

    return (
        <div className="space-y-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                <div className="space-y-xs">
                    <h1 className="font-display-lg text-primary text-3xl font-bold">Çalışma Masası Rezervasyonu</h1>
                    <p className="font-body-md text-on-surface-variant">
                        Kat, salon, tarih ve saat seçerek çalışma masası rezervasyonu oluşturabilirsiniz.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-sm w-full md:w-auto">
                    <div className="glass-card border border-outline-variant rounded-xl px-md py-sm text-center">
                        <p className="font-label-xs text-xs text-on-surface-variant uppercase">Müsait</p>
                        <p className="font-headline-h3 text-success text-xl font-bold">{availableDeskCount}</p>
                    </div>
                    <div className="glass-card border border-outline-variant rounded-xl px-md py-sm text-center">
                        <p className="font-label-xs text-xs text-on-surface-variant uppercase">Rezerve</p>
                        <p className="font-headline-h3 text-accent-gold text-xl font-bold">{reservedDeskCount}</p>
                    </div>
                    <div className="glass-card border border-outline-variant rounded-xl px-md py-sm text-center">
                        <p className="font-label-xs text-xs text-on-surface-variant uppercase">Dolu</p>
                        <p className="font-headline-h3 text-error text-xl font-bold">{occupiedDeskCount}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
                <section className="xl:col-span-4 glass-card rounded-xl border border-outline-variant p-lg space-y-md">
                    <h2 className="font-headline-h3 text-xl font-bold text-on-surface">Rezervasyon Bilgileri</h2>

                    <div className="space-y-sm">
                        <label className="block text-sm font-medium text-on-surface-variant">Kat</label>
                        <select
                            value={selectedFloor}
                            onChange={(e) => setSelectedFloor(e.target.value)}
                            className="w-full bg-surface-container-high border border-outline-variant text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivid-purple"
                        >
                            {floors.map((floor) => (
                                <option key={floor} value={floor}>{floor}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-sm">
                        <label className="block text-sm font-medium text-on-surface-variant">Salon</label>
                        <select
                            value={selectedHall}
                            onChange={(e) => setSelectedHall(e.target.value)}
                            className="w-full bg-surface-container-high border border-outline-variant text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivid-purple"
                        >
                            {halls.map((hall) => (
                                <option key={hall} value={hall}>{hall}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-sm">
                        <label className="block text-sm font-medium text-on-surface-variant">Tarih</label>
                        <input
                            type="date"
                            value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-surface-container-high border border-outline-variant text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivid-purple"
                        />
                    </div>

                    <div className="space-y-sm">
                        <label className="block text-sm font-medium text-on-surface-variant">Saat Aralığı</label>
                        <select
                            value={selectedTimeSlot}
                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                            className="w-full bg-surface-container-high border border-outline-variant text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivid-purple"
                        >
                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>

                    <div className="rounded-xl border border-outline-variant bg-surface-container/50 p-md space-y-xs">
                        <p className="font-label-xs text-xs text-on-surface-variant uppercase">Seçilen Masa</p>
                        <p className="font-headline-h3 text-lg font-bold text-primary">
                            {selectedDesk ? `Masa ${selectedDesk.id}` : 'Henüz masa seçilmedi'}
                        </p>
                    </div>

                    <button
                        onClick={handleReserveDesk}
                        disabled={!selectedDeskId || status === 'loading'}
                        className="w-full py-3 px-4 rounded-xl bg-ember-orange text-white font-bold hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow-accent"
                    >
                        Rezervasyon Oluştur
                    </button>
                </section>

                <section className="xl:col-span-8 glass-card rounded-xl border border-outline-variant p-lg space-y-md">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-headline-h3 text-xl font-bold text-on-surface">Masa Seçimi</h2>
                            <p className="font-body-md text-sm text-on-surface-variant">
                                Müsait olan masalardan birini seçerek rezervasyonunuzu tamamlayın.
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-ember-orange text-3xl">table_restaurant</span>
                    </div>

                    {studyDesks.length === 0 ? (
                        <div className="text-center py-xl text-on-surface-variant">
                            Masa kaydı bulunamadı.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                            {studyDesks.map((desk) => {
                                const isSelected = String(selectedDeskId) === String(desk.id);
                                const isAvailable = desk.status === 'available';

                                return (
                                    <button
                                        key={desk.id}
                                        disabled={!isAvailable}
                                        onClick={() => setSelectedDeskId(desk.id)}
                                        className={`p-lg rounded-xl border text-left transition-all ${getDeskStatusClass(desk.status)} ${isSelected ? 'ring-2 ring-ember-orange scale-[1.02]' : ''
                                            }`}
                                    >
                                        <div className="flex justify-between items-start gap-md">
                                            <div>
                                                <p className="font-label-xs text-xs uppercase tracking-wider opacity-80">Çalışma Masası</p>
                                                <h3 className="font-headline-h3 text-2xl font-bold mt-xs">Masa {desk.id}</h3>
                                            </div>
                                            <span className="material-symbols-outlined text-3xl">
                                                {desk.status === 'available' ? 'event_available' : 'event_busy'}
                                            </span>
                                        </div>

                                        <div className="mt-md pt-sm border-t border-outline-variant/40">
                                            <span className="text-xs font-bold uppercase">
                                                {getDeskStatusLabel(desk.status)}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default StudyDeskPage;