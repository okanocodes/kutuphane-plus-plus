import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearAuthError } from '../store/authSlice';
import { addToast } from '../store/uiSlice';
import Input from '../components/Input';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('student');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  useEffect(() => { document.title = 'Kütüphane++ — Giriş'; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      dispatch(addToast({ message: 'Lütfen kullanıcı adınızı girin.', type: 'warning' }));
      return;
    }

    dispatch(clearAuthError());
    const resultAction = await dispatch(loginUser({ username, role }));
    if (loginUser.fulfilled.match(resultAction)) {
      dispatch(addToast({ message: `Hoş geldiniz, ${resultAction.payload.name}!`, type: 'success' }));
      navigate('/dashboard');
    } else {
      dispatch(addToast({ message: resultAction.payload || 'Giriş başarısız.', type: 'error' }));
    }
  };

  const roles = [
    { value: 'student', label: 'Öğrenci', icon: 'school' },
    { value: 'academic', label: 'Akademisyen', icon: 'menu_book' },
    { value: 'librarian', label: 'Kütüphaneci', icon: 'local_library' },
    { value: 'admin', label: 'Yönetici', icon: 'admin_panel_settings' }
  ];

  const quickFills = [
    { name: 'Okan Şahin', role: 'student', label: 'Okan (Öğrenci)' },
    { name: 'Eren Demir', role: 'academic', label: 'Eren (Akad.)' },
    { name: 'Sudenaz Kaya', role: 'librarian', label: 'Sudenaz (Küt.)' },
    { name: 'Admin', role: 'admin', label: 'Admin (Yön.)' }
  ];

  const handleQuickFill = (name, roleVal) => {
    setUsername(name);
    setRole(roleVal);
    dispatch(addToast({ message: `'${name}' bilgileri forma yüklendi.`, type: 'info' }));
  };

  return (
    <div className="space-y-lg">
      <div className="text-center">
        <h2 className="font-headline-h2 text-2xl font-bold text-on-surface">Hesabınıza Giriş Yapın</h2>
        <p className="font-body-md text-sm text-on-surface-variant">Devam etmek için bilgilerinizi girin</p>
      </div>

      <form className="space-y-lg" onSubmit={handleSubmit}>
        <div className="space-y-md">
          <Input
            id="username"
            name="username"
            type="text"
            required
            label="Kullanıcı Adı"
            placeholder="Kullanıcı adınızı girin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="space-y-xs">
            <label className="block text-sm font-medium text-on-surface-variant font-label-sm">
              Giriş Rolü
            </label>
            <div className="grid grid-cols-2 gap-sm">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                    role === r.value
                      ? 'border-vivid-purple bg-vivid-purple/10 text-primary shadow-[0_0_15px_rgba(91,33,182,0.2)] font-semibold'
                      : 'border-outline-variant hover:border-outline bg-surface-container-high/40 text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl mb-1">{r.icon}</span>
                  <span className="font-label-xs text-xs tracking-wide">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-ember-orange hover:bg-ember-orange/90 hover:shadow-[0_0_15px_rgba(255,93,58,0.3)] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap'}
        </button>

        <div className="text-center text-sm font-label-sm">
          <span className="text-on-surface-variant">Hesabınız yok mu? </span>
          <Link to="/register" className="font-semibold text-vivid-purple hover:text-ember-orange transition-colors">
            Hemen Kaydolun
          </Link>
        </div>

        {/* Quick Fills */}
        <div className="bg-surface-container-high/30 border border-outline-variant/40 p-4 rounded-2xl space-y-md">
          <div className="flex items-center gap-xs text-xs font-bold text-on-surface">
            <span className="material-symbols-outlined text-base text-accent-gold">bolt</span>
            <span>Hızlı Giriş Test Hesapları</span>
          </div>
          <div className="grid grid-cols-2 gap-xs">
            {quickFills.map((fill) => (
              <button
                key={fill.name}
                type="button"
                onClick={() => handleQuickFill(fill.name, fill.role)}
                className="px-2.5 py-1.5 text-[11px] font-medium rounded-lg bg-surface-container-highest/60 hover:bg-surface-container-highest border border-outline-variant hover:border-outline text-on-surface-variant hover:text-on-surface text-left transition-all truncate cursor-pointer"
              >
                {fill.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
