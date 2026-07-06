import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { fetchNotifications, addToast } from '../store/uiSlice';
import { logoutUser } from '../store/authSlice';

export const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user, isAuthenticated, isAdmin, isLibrarian } = useAuth();
    const { notifications } = useSelector((state) => state.ui);

    const unreadNotifications = notifications.filter(n => !n.read);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            dispatch(fetchNotifications(user.id));
        }
    }, [isAuthenticated, user?.id, dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        dispatch(addToast({ message: 'Başarıyla çıkış yapıldı.', type: 'success' }));
        navigate('/');
    };

    // Check if path starts with /admin or /dashboard or /profile or /reservations or /favorites or /borrowed
    // If it does, we show the Navbar, but we can change links if needed
    const showAdminLink = isAdmin || isLibrarian;

    return (
        <header className="bg-surface-container shadow-sm border-b border-outline-variant sticky top-0 z-50">
            <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-xl">
                    <Link to="/" className="font-headline-h3 text-headline-h3 text-ember-orange font-bold">Kütüphane++</Link>
                    <div className="hidden md:flex items-center gap-lg">
                        <Link className={`font-label-sm text-label-sm ${location.pathname === '/' ? 'text-ember-orange font-bold border-b-2 border-ember-orange pb-1' : 'text-on-surface-variant font-medium hover:text-ember-orange'}`} to="/">Ana Sayfa</Link>
                        <Link className={`font-label-sm text-label-sm ${location.pathname === '/search' || location.pathname === '/books' ? 'text-ember-orange font-bold border-b-2 border-ember-orange pb-1' : 'text-on-surface-variant font-medium hover:text-ember-orange'}`} to="/search">Kitap Ara</Link>
                        <Link className={`font-label-sm text-label-sm ${location.pathname === '/digital-library' ? 'text-ember-orange font-bold border-b-2 border-ember-orange pb-1' : 'text-on-surface-variant font-medium hover:text-ember-orange'}`} to="/digital-library">Dijital Kütüphane</Link>
                        <Link className={`font-label-sm text-label-sm ${location.pathname === '/blog' ? 'text-ember-orange font-bold border-b-2 border-ember-orange pb-1' : 'text-on-surface-variant font-medium hover:text-ember-orange'}`} to="/blog">Blog</Link>
                        <Link className="text-on-surface-variant font-medium hover:text-ember-orange transition-colors duration-200 font-label-sm text-label-sm" to="/events">Etkinlikler</Link>
                    </div>
                </div>
                <div className="flex items-center gap-md">
                    <div className="flex items-center gap-sm">
                        {isAuthenticated && (
                            <button
                                onClick={() => navigate('/notifications')}
                                className="p-2 rounded-full hover:bg-surface-container-highest transition-all scale-95 active:opacity-80 relative"
                            >
                                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                                {unreadNotifications.length > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-ember-orange text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                                        {unreadNotifications.length}
                                    </span>
                                )}
                            </button>
                        )}
                        {showAdminLink && (
                            <Link to="/admin" className="p-2 rounded-full hover:bg-surface-container-highest transition-all scale-95 active:opacity-80">
                                <span className="material-symbols-outlined text-on-surface-variant">settings</span>
                            </Link>
                        )}
                    </div>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-sm">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-vivid-purple text-white font-bold px-lg py-sm rounded-lg hover:opacity-90 transition-all scale-95 active:opacity-80 font-label-sm text-label-sm flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">account_circle</span>
                                <span>{user.name}</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-surface-container-highest text-on-surface border border-outline hover:text-error hover:bg-error/10 font-bold px-md py-sm rounded-lg transition-all scale-95 active:opacity-80 font-label-sm text-label-sm flex items-center gap-1 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm text-error">logout</span>
                                <span className="hidden sm:inline">Çıkış Yap</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-ember-orange text-white font-bold px-lg py-sm rounded-lg hover:opacity-90 transition-all scale-95 active:opacity-80 font-label-sm text-label-sm"
                        >
                            Giriş Yap
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default NavBar;