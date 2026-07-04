import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeetingRooms, reserveMeetingRoom } from '../store/reservationSlice';
import { addToast } from '../store/uiSlice';
import useAuth from '../hooks/useAuth';

const timeSlots = ['09:00 - 10:30', '10:30 - 12:00', '13:00 - 14:30', '14:30 - 16:00', '16:00 - 17:30'];

export const MeetingRoomsPage = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { meetingRooms } = useSelector((state) => state.reservations);

    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);

    useEffect(() => {
        dispatch(fetchMeetingRooms());
    }, [dispatch]);

    const selectedRoom = useMemo(() => {
        return meetingRooms.find((room) => String(room.id) === String(selectedRoomId));
    }, [meetingRooms, selectedRoomId]);

    const handleReserveRoom = async () => {
        if (!selectedRoomId) {
            dispatch(addToast({ message: 'Lütfen bir toplantı odası seçin.', type: 'warning' }));
            return;
        }

        if (selectedRoom?.status === 'reserved') {
            dispatch(addToast({ message: 'Bu oda zaten rezerve edilmiş.', type: 'error' }));
            return;
        }

        const resultAction = await dispatch(
            reserveMeetingRoom({
                roomId: selectedRoomId,
                userId: user?.id,
                date: selectedDate,
                timeSlot: selectedTimeSlot,
            })
        );

        if (reserveMeetingRoom.fulfilled.match(resultAction)) {
            dispatch(addToast({ message: 'Toplantı odası rezervasyonu oluşturuldu.', type: 'success' }));
            setSelectedRoomId(null);
        } else {
            dispatch(addToast({ message: resultAction.payload || 'Rezervasyon başarısız.', type: 'error' }));
        }
    };

    return (
        <div className="space-y-lg">
            <div className="space-y-xs">
                <h1 className="font-display-lg text-primary text-3xl font-bold">Toplantı Odası Rezervasyonu</h1>
                <p className="font-body-md text-on-surface-variant">
                    Grup çalışmaları ve toplantılar için uygun odayı seçerek rezervasyon oluşturabilirsiniz.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
                <section className="xl:col-span-8 space-y-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                        {meetingRooms.map((room) => {
                            const isSelected = String(selectedRoomId) === String(room.id);
                            const isReserved = room.status === 'reserved';

                            return (
                                <button
                                    key={room.id}
                                    onClick={() => !isReserved && setSelectedRoomId(room.id)}
                                    disabled={isReserved}
                                    className={`glass-card rounded-xl border p-lg text-left transition-all ${isSelected
                                            ? 'border-ember-orange ring-2 ring-ember-orange/40'
                                            : 'border-outline-variant hover:border-vivid-purple'
                                        } ${isReserved ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-xs">
                                            <p className="font-label-xs text-xs uppercase tracking-wider text-on-surface-variant">Toplantı Odası</p>
                                            <h2 className="font-headline-h3 text-2xl font-bold text-on-surface">{room.name || `Oda ${room.id}`}</h2>
                                        </div>
                                        <span className="material-symbols-outlined text-ember-orange text-3xl">meeting_room</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-sm mt-lg">
                                        <div className="rounded-lg bg-surface-container-high p-sm border border-outline-variant">
                                            <p className="text-xs text-on-surface-variant">Kapasite</p>
                                            <p className="font-bold text-on-surface">{room.capacity || 0} kişi</p>
                                        </div>
                                        <div className="rounded-lg bg-surface-container-high p-sm border border-outline-variant">
                                            <p className="text-xs text-on-surface-variant">Durum</p>
                                            <p className={`font-bold ${isReserved ? 'text-accent-gold' : 'text-success'}`}>
                                                {isReserved ? 'Rezerve' : 'Uygun'}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <aside className="xl:col-span-4 glass-card rounded-xl border border-outline-variant p-lg space-y-md h-fit">
                    <h2 className="font-headline-h3 text-xl font-bold text-on-surface">Rezervasyon Detayı</h2>

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
                        <p className="font-label-xs text-xs text-on-surface-variant uppercase">Seçilen Oda</p>
                        <p className="font-headline-h3 text-lg font-bold text-primary">
                            {selectedRoom ? selectedRoom.name || `Oda ${selectedRoom.id}` : 'Henüz oda seçilmedi'}
                        </p>
                    </div>

                    <button
                        onClick={handleReserveRoom}
                        disabled={!selectedRoomId}
                        className="w-full py-3 px-4 rounded-xl bg-ember-orange text-white font-bold hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow-accent"
                    >
                        Odayı Rezerve Et
                    </button>
                </aside>
            </div>
        </div>
    );
};

export default MeetingRoomsPage;