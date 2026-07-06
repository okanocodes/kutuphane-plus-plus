import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationRead, deleteNotification, addToast } from '../store/uiSlice';
import useAuth from '../hooks/useAuth';

export const NotificationsPage = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { notifications } = useSelector((state) => state.ui);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchNotifications(user.id));
        }
    }, [dispatch, user?.id]);

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    const getNotificationIcon = (type) => {
        const icons = {
            rezervasyon: 'bookmark',
            reservation: 'bookmark',
            event: 'event',
            warning: 'warning',
            penalty: 'payments',
            info: 'info',
        };

        return icons[type] || 'notifications';
    };

    const handleReadNotification = async (notificationId) => {
        const resultAction = await dispatch(markNotificationRead(notificationId));

        if (markNotificationRead.fulfilled.match(resultAction)) {
            dispatch(addToast({ message: 'Bildirim okundu olarak işaretlendi.', type: 'success' }));
        } else {
            dispatch(addToast({ message: 'Bildirim güncellenemedi.', type: 'error' }));
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        const resultAction = await dispatch(deleteNotification(notificationId));

        if (deleteNotification.fulfilled.match(resultAction)) {
            dispatch(addToast({ message: 'Bildirim başarıyla silindi.', type: 'success' }));
        } else {
            dispatch(addToast({ message: 'Bildirim silinemedi.', type: 'error' }));
        }
    };

    const handleReadAll = () => {
        notifications
            .filter((notification) => !notification.read)
            .forEach((notification) => {
                dispatch(markNotificationRead(notification.id));
            });

        dispatch(addToast({ message: 'Tüm bildirimler okundu olarak işaretlendi.', type: 'success' }));
    };

    const handleDeleteAllRead = () => {
        const readNotifications = notifications.filter((notification) => notification.read);
        if (readNotifications.length === 0) return;

        readNotifications.forEach((notification) => {
            dispatch(deleteNotification(notification.id));
        });

        dispatch(addToast({ message: 'Tüm okunan bildirimler silindi.', type: 'success' }));
    };

    return (
        <div className="space-y-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                <div className="space-y-xs">
                    <h1 className="font-display-lg text-primary text-3xl font-bold">Bildirim Merkezi</h1>
                    <p className="font-body-md text-on-surface-variant">
                        Rezervasyon, etkinlik ve kütüphane işlemlerinize ait bildirimleri buradan takip edebilirsiniz.
                    </p>
                </div>

                <div className="flex gap-sm shrink-0">
                    <button
                        onClick={handleReadAll}
                        disabled={unreadCount === 0}
                        className="px-lg py-2 bg-vivid-purple text-white rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        Tümünü Okundu Yap
                    </button>
                    <button
                        onClick={handleDeleteAllRead}
                        disabled={notifications.length - unreadCount === 0}
                        className="px-lg py-2 bg-error text-white rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        Tüm Okunanları Sil
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="glass-card rounded-xl border border-outline-variant p-lg">
                    <p className="font-label-xs text-xs text-on-surface-variant uppercase">Toplam Bildirim</p>
                    <h2 className="font-headline-h2 text-3xl font-bold text-on-surface mt-xs">{notifications.length}</h2>
                </div>

                <div className="glass-card rounded-xl border border-outline-variant p-lg">
                    <p className="font-label-xs text-xs text-on-surface-variant uppercase">Okunmamış</p>
                    <h2 className="font-headline-h2 text-3xl font-bold text-ember-orange mt-xs">{unreadCount}</h2>
                </div>

                <div className="glass-card rounded-xl border border-outline-variant p-lg">
                    <p className="font-label-xs text-xs text-on-surface-variant uppercase">Okunan</p>
                    <h2 className="font-headline-h2 text-3xl font-bold text-success mt-xs">{notifications.length - unreadCount}</h2>
                </div>
            </div>

            <div className="space-y-sm">
                {(() => {
                    const sortedNotifications = [...notifications]
                        .map((n, index) => ({ ...n, originalIndex: index }))
                        .sort((a, b) => {
                            const dateA = a.date || '';
                            const dateB = b.date || '';
                            if (dateA !== dateB) {
                                return dateB.localeCompare(dateA);
                            }
                            return b.originalIndex - a.originalIndex;
                        });

                    if (sortedNotifications.length === 0) {
                        return (
                            <div className="glass-card rounded-xl border border-outline-variant p-xl text-center">
                                <span className="material-symbols-outlined text-outline text-5xl">notifications_off</span>
                                <p className="font-body-md text-on-surface-variant mt-md">Henüz bildiriminiz bulunmamaktadır.</p>
                            </div>
                        );
                    }

                    return sortedNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`glass-card rounded-xl border p-md flex flex-col md:flex-row justify-between gap-md transition-all ${notification.read
                                    ? 'border-outline-variant opacity-75'
                                    : 'border-ember-orange/40 shadow-glow-accent'
                                }`}
                        >
                            <div className="flex gap-md items-start">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${notification.read ? 'bg-surface-container-high text-on-surface-variant' : 'bg-ember-orange/20 text-ember-orange'
                                    }`}>
                                    <span className="material-symbols-outlined">{getNotificationIcon(notification.type)}</span>
                                </div>

                                <div className="space-y-xs">
                                    <div className="flex items-center gap-sm">
                                        <h2 className="font-headline-h3 text-lg font-bold text-on-surface">{notification.title}</h2>
                                        {!notification.read && (
                                            <span className="bg-ember-orange text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                                                Yeni
                                            </span>
                                        )}
                                    </div>

                                    <p className="font-body-md text-sm text-on-surface-variant">
                                        {notification.message || 'Bu bildirim için detay açıklaması bulunmamaktadır.'}
                                    </p>

                                    <p className="font-label-xs text-xs text-on-surface-variant uppercase">
                                        Tür: {notification.type || 'Genel'}
                                    </p>
                                </div>
                            </div>

                            {notification.read ? (
                                <button
                                    onClick={() => handleDeleteNotification(notification.id)}
                                    className="self-start md:self-center px-md py-sm rounded-lg border border-error/30 text-error hover:bg-error/10 hover:border-error/50 transition-all text-sm font-bold flex items-center gap-xs cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                    Sil
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleReadNotification(notification.id)}
                                    className="self-start md:self-center px-md py-sm rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-all text-sm font-bold cursor-pointer"
                                >
                                    Okundu Yap
                                </button>
                            )}
                        </div>
                    ));
                })()}
            </div>
        </div>
    );
};

export default NotificationsPage;