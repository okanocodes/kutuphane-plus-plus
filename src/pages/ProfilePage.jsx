import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { updateUser } from '../store/userSlice';
import { addToast } from '../store/uiSlice';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      dispatch(addToast({ message: 'Lütfen geçerli bir isim girin.', type: 'warning' }));
      return;
    }

    setLoading(true);
    const resultAction = await dispatch(updateUser({ id: user.id, userData: { name } }));
    if (updateUser.fulfilled.match(resultAction)) {
      dispatch(addToast({ message: 'Profil güncellendi.', type: 'success' }));
      
      // Update local storage representation as well
      const savedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      savedUser.name = name;
      localStorage.setItem('auth_user', JSON.stringify(savedUser));
    } else {
      dispatch(addToast({ message: 'Güncelleme başarısız.', type: 'error' }));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-lg max-w-2xl">
      <div className="space-y-xs">
        <h1 className="font-display-lg text-primary text-3xl font-bold">Profil Ayarları</h1>
        <p className="font-body-md text-on-surface-variant">Hesap bilgilerinizi görüntüleyebilir ve güncelleyebilirsiniz.</p>
      </div>

      <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent">
        <form onSubmit={handleUpdate} className="space-y-md">
          <div className="grid grid-cols-1 gap-md">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Kullanıcı Adı</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsim Soyisim"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Rol</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-outline bg-surface-container/50 text-on-surface-variant rounded-lg cursor-not-allowed sm:text-sm font-metadata-mono capitalize"
                value={user?.role || ''}
                disabled
              />
              <p className="text-xs text-on-surface-variant/75 mt-1">Güvenlik gereği üyelik rolünüz değiştirilemez.</p>
            </div>
          </div>

          <div className="pt-sm">
            <button
              type="submit"
              disabled={loading}
              className="px-lg py-2 bg-ember-orange text-white text-sm font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              {loading ? 'Güncelleniyor...' : 'Profili Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;