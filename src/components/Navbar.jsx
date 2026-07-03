import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = location.pathname === '/admin';
    const isUser = location.pathname === '/profile';

    if (isAdmin) return null; // Admin has its own sidebar

    return (
        <header className="bg-surface-container dark:bg-surface-container shadow-sm docked full-width top-0 sticky z-50">
            <nav className="flex justify-between items-center px-margin-desktop py-md w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-xl">
                    <Link to="/" className="font-headline-h3 text-headline-h3 text-ember-orange font-bold">Kütüphane++</Link>
                    <div className="hidden md:flex items-center gap-lg">
                        <Link className={`font-label-sm text-label-sm ${location.pathname === '/' ? 'text-ember-orange font-bold border-b-2 border-ember-orange pb-1' : 'text-on-surface-variant font-medium hover:text-ember-orange'}`} to="/">Ana Sayfa</Link>
                        <Link className={`font-label-sm text-label-sm ${location.pathname === '/search' ? 'text-ember-orange font-bold border-b-2 border-ember-orange pb-1' : 'text-on-surface-variant font-medium hover:text-ember-orange'}`} to="/search">Kitap Ara</Link>
                        <Link className="text-on-surface-variant dark:text-on-surface-variant font-medium hover:text-ember-orange transition-colors duration-200 font-label-sm text-label-sm" to="#">Etkinlikler</Link>
                    </div>
                </div>
                <div className="flex items-center gap-md">
                    <div className="flex items-center gap-sm">
                        <button className="p-2 rounded-full hover:bg-surface-container-highest transition-all scale-95 active:opacity-80">
                            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                        </button>
                        <Link to="/admin" className="p-2 rounded-full hover:bg-surface-container-highest transition-all scale-95 active:opacity-80">
                            <span className="material-symbols-outlined text-on-surface-variant">settings</span>
                        </Link>
                    </div>
                    <button onClick={() => navigate('/profile')} className="bg-ember-orange text-on-primary-fixed font-bold px-lg py-sm rounded-lg hover:opacity-90 transition-all scale-95 active:opacity-80 font-label-sm text-label-sm">
                        {isUser ? 'Hesabım' : 'Giriş Yap'}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default NavBar