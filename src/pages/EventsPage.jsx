import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, reserveEvent } from '../store/reservationSlice';
import { addToast } from '../store/uiSlice';
import useAuth from '../hooks/useAuth';

export const EventsPage = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();
    const { events } = useSelector((state) => state.reservations);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    const handleJoinEvent = async (event) => {
        if (!isAuthenticated || !user?.id) {
            console.log('User is not authenticated. Cannot join event.');
            dispatch(addToast({ message: 'Etkinliğe katılmak için önce giriş yapmanız gerekir.', type: 'warning' }));
            return;
        }

        const resultAction = await dispatch(
            reserveEvent({
                event,
                userId: user?.id,
            })
        );

        if (reserveEvent.fulfilled.match(resultAction)) {
            dispatch(addToast({ message: 'Etkinlik rezervasyonunuz oluşturuldu.', type: 'success' }));
        } else {
            dispatch(addToast({ message: resultAction.payload || 'Etkinlik rezervasyonu başarısız.', type: 'error' }));
        }
    };

    const getRemainingSeats = (event) => {
        const capacity = Number(event.capacity || 0);
        const reservedSeats = Number(event.reservedSeats || 0);
        return Math.max(capacity - reservedSeats, 0);
    };

    const isUserJoined = (event) => {
        return (event.participants || []).map(String).includes(String(user?.id));
    };

    return (
        <div className="space-y-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                <div className="space-y-xs">
                    <h1 className="font-display-lg text-primary text-3xl font-bold">Etkinlikler</h1>
                    <p className="font-body-md text-on-surface-variant">
                        Kitap kulüpleri, seminerler ve kütüphane etkinliklerine katılım sağlayabilirsiniz.
                    </p>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="glass-card rounded-xl border border-outline-variant p-xl text-center">
                    <span className="material-symbols-outlined text-outline text-5xl">event_busy</span>
                    <p className="font-body-md text-on-surface-variant mt-md">Henüz etkinlik bulunmamaktadır.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                    {events.map((event) => {
                        const remainingSeats = getRemainingSeats(event);
                        const joined = isUserJoined(event);
                        const full = remainingSeats <= 0;

                        return (
                            <article key={event.id} className="glass-card rounded-xl border border-outline-variant p-lg space-y-md hover:border-vivid-purple transition-all">
                                <div className="flex justify-between items-start gap-md">
                                    <div className="space-y-xs">
                                        <p className="font-label-xs text-xs uppercase tracking-wider text-ember-orange">Kütüphane Etkinliği</p>
                                        <h2 className="font-headline-h3 text-2xl font-bold text-on-surface">{event.title}</h2>
                                    </div>
                                    <span className="material-symbols-outlined text-vivid-purple text-4xl">event</span>
                                </div>

                                <p className="font-body-md text-on-surface-variant text-sm">
                                    {event.description || 'Bu etkinlik için açıklama bilgisi henüz eklenmemiştir.'}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
                                    <div className="rounded-lg bg-surface-container-high p-sm border border-outline-variant">
                                        <p className="text-xs text-on-surface-variant">Kontenjan</p>
                                        <p className="font-bold text-on-surface">{event.capacity || 0}</p>
                                    </div>
                                    <div className="rounded-lg bg-surface-container-high p-sm border border-outline-variant">
                                        <p className="text-xs text-on-surface-variant">Kalan</p>
                                        <p className={`font-bold ${remainingSeats > 0 ? 'text-success' : 'text-error'}`}>{remainingSeats}</p>
                                    </div>
                                    <div className="rounded-lg bg-surface-container-high p-sm border border-outline-variant">
                                        <p className="text-xs text-on-surface-variant">Tarih</p>
                                        <p className="font-bold text-on-surface">{event.date || 'Planlanıyor'}</p>
                                    </div>
                                    <div className="rounded-lg bg-surface-container-high p-sm border border-outline-variant">
                                        <p className="text-xs text-on-surface-variant">Salon</p>
                                        <p className="font-bold text-on-surface">{event.location || 'Ana Salon'}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleJoinEvent(event)}
                                    disabled={joined || full}
                                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all active:scale-[0.98] ${joined
                                        ? 'bg-success/20 text-success cursor-not-allowed'
                                        : full
                                            ? 'bg-error/20 text-error cursor-not-allowed'
                                            : 'bg-ember-orange text-white hover:opacity-90 shadow-glow-accent'
                                        }`}
                                >
                                    {joined ? 'Katılım Sağlandı' : full ? 'Kontenjan Doldu' : 'Etkinliğe Katıl'}
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EventsPage;