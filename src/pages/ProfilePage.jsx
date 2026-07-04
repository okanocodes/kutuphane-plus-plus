import React, { useState } from 'react';

const ProfilePage = () => {
  // Form Yönetimi -
  const [user, setUser] = useState({
    name: 'Sudenaz Sangür', //
    email: 'sudenaz@nisantasi.edu.tr', //
    department: 'Management Information Systems', //
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Alert yerine UI içi güvenli mesaj durumları
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: '', msg: '' });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordStatus({ type: 'error', msg: 'Yeni şifreler uyuşmuyor!' });
      return;
    }
    setPasswordStatus({ type: 'success', msg: 'Şifreniz başarıyla değiştirildi.' });
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordStatus({ type: '', msg: '' }), 3000);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Profil Bilgileri</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kullanıcı Bilgileri Formu - */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Genel Bilgiler</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Ad Soyad</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={user.name} 
                onChange={(e) => setUser({...user, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">E-posta</label>
              <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed" value={user.email} disabled />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Bölüm</label>
              <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed" value={user.department} disabled />
            </div>
            {profileSuccess && <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl">Değişiklikler kaydedildi.</div>}
            <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2 rounded-xl hover:bg-indigo-700 transition-colors">Kaydet</button>
          </form>
        </div>

        {/* Şifre Değiştirme Formu - */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Şifre Değiştir</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Mevcut Şifre</label>
              <input type="password" required className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Yeni Şifre</label>
              <input type="password" required className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Yeni Şifre Tekrar</label>
              <input type="password" required className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} />
            </div>
            {passwordStatus.msg && <div className={`p-3 text-sm rounded-xl ${passwordStatus.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{passwordStatus.msg}</div>}
            <button type="submit" className="w-full bg-slate-800 text-white font-medium py-2 rounded-xl hover:bg-slate-900 transition-colors">Şifreyi Güncelle</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;