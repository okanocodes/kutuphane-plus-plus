import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { logoutUser } from '../store/authSlice';
import { addToast } from '../store/uiSlice';

export const Sidebar = () => {
  const { user, isAdmin, isLibrarian } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(addToast({ message: 'Başarıyla çıkış yapıldı.', type: 'success' }));
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Genel Bakış', icon: 'dashboard' },
    { path: '/profile', label: 'Profilim', icon: 'person' },
    { path: '/reservations', label: 'Rezervasyonlar', icon: 'bookmark' },
    { path: '/study-desks', label: 'Çalışma Masaları', icon: 'table_restaurant' },
    { path: '/meeting-rooms', label: 'Toplantı Odaları', icon: 'meeting_room' },
    { path: '/events', label: 'Etkinlikler', icon: 'event' },
    { path: '/notifications', label: 'Bildirimler', icon: 'notifications' },
    { path: '/borrowed', label: 'Ödünç Kitaplar', icon: 'library_books' },
    { path: '/favorites', label: 'Favorilerim', icon: 'favorite' },
    { path: '/history', label: 'Geçmiş İşlemler', icon: 'history' },
    { path: '/digital-library', label: 'Dijital Kütüphane', icon: 'auto_stories' },
    { path: '/blog', label: 'Blog & Haberler', icon: 'rss_feed' },
  ];

  // If Admin or Librarian, add Admin Panel link if not present
  if (isAdmin || isLibrarian) {
    menuItems.push({ path: '/admin', label: 'Yönetici Paneli', icon: 'admin_panel_settings' });
  }

  return (
    <aside className="w-64 bg-surface-container border-r border-outline-variant flex flex-col justify-between h-[calc(100vh-64px)] sticky top-16 z-40 p-md overflow-y-auto scrollbar-none">
      <div className="space-y-sm flex flex-col flex-1">
        <div className="px-sm py-md border-b border-outline-variant mb-md shrink-0">
          <p className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">Kullanıcı</p>
          <p className="font-headline-h3 text-base text-on-surface font-semibold truncate mt-xs">{user?.name || 'Giriş Yapılmamış'}</p>
          <span className="inline-block bg-vivid-purple/20 text-tertiary-fixed text-xs px-2 py-0.5 rounded-full font-label-xs mt-xs capitalize">
            {user?.role || 'Ziyaretçi'}
          </span>
        </div>

        <nav className="space-y-xs flex-1 overflow-y-auto scrollbar-none pr-[2px]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-md px-md py-sm rounded-md transition-all font-label-sm text-label-sm shrink-0 ${isActive
                  ? 'bg-surface-container-highest text-ember-orange font-bold border-l-4 border-ember-orange'
                  : 'text-on-surface-variant hover:text-ember-orange hover:bg-surface-container-high'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-md border-t border-outline-variant/30 mt-md shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-all font-label-sm text-label-sm w-full text-left"
        >
          <span className="material-symbols-outlined text-error">logout</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
