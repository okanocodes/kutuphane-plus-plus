import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";
import { updateUser } from "../store/userSlice";
import { addToast, toggleTheme } from "../store/uiSlice";

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { theme } = useSelector((state) => state.ui);
  useEffect(() => {
    document.title = "Kütüphane++ — Profil";
  }, []);

  // Profile Info States
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "eposta@example.com");
  const [phone, setPhone] = useState(user?.phone || "+90 (555) 000 00 00");

  // Password States
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Prefs (from user object or fallback)
  const [notifPrefs, setNotifPrefs] = useState(
    user?.notificationPrefs || { sms: true, email: true, push: false },
  );

  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      dispatch(
        addToast({
          message: "Lütfen geçerli bir isim girin.",
          type: "warning",
        }),
      );
      return;
    }

    setLoading(true);
    const resultAction = await dispatch(
      updateUser({
        id: user.id,
        userData: {
          name,
          email,
          phone,
        },
      }),
    );

    if (updateUser.fulfilled.match(resultAction)) {
      dispatch(
        addToast({ message: "Profil bilgileri güncellendi.", type: "success" }),
      );

      // Update local storage representation as well
      const savedUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
      savedUser.name = name;
      savedUser.email = email;
      savedUser.phone = phone;
      localStorage.setItem("auth_user", JSON.stringify(savedUser));
    } else {
      dispatch(addToast({ message: "Güncelleme başarısız.", type: "error" }));
    }
    setLoading(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      dispatch(
        addToast({
          message: "Lütfen tüm şifre alanlarını doldurun.",
          type: "warning",
        }),
      );
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      dispatch(
        addToast({ message: "Yeni şifreler eşleşmiyor.", type: "error" }),
      );
      return;
    }

    // Simulated Password Change
    dispatch(
      addToast({ message: "Şifreniz başarıyla güncellendi.", type: "success" }),
    );
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleTogglePref = async (key) => {
    const updatedPrefs = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updatedPrefs);

    // Save to server
    const resultAction = await dispatch(
      updateUser({
        id: user.id,
        userData: { notificationPrefs: updatedPrefs },
      }),
    );

    if (updateUser.fulfilled.match(resultAction)) {
      // Update local storage
      const savedUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
      savedUser.notificationPrefs = updatedPrefs;
      localStorage.setItem("auth_user", JSON.stringify(savedUser));
    }
  };

  return (
    <div className="space-y-lg max-w-4xl text-left">
      <div className="space-y-xs">
        <h1 className="font-display-lg text-primary text-3xl font-bold">
          Profil & Ayarlar
        </h1>
        <p className="font-body-md text-on-surface-variant">
          Hesap bilgilerinizi, şifrenizi ve sistem tercihlerini buradan yönetin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {/* Profile Info Form */}
        <section className="glass-card p-lg rounded-xl border border-outline-variant space-y-md">
          <h2 className="font-headline-h2 text-xl font-bold text-on-surface border-l-4 border-ember-orange pl-sm">
            Profil Bilgileri
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-md">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsim Soyisim"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                E-posta
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm font-metadata-mono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eposta@universite.edu.tr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                Telefon
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm font-metadata-mono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 (555) 000 00 00"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                Rol
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-outline bg-surface-container/30 text-on-surface-variant rounded-lg cursor-not-allowed sm:text-sm font-metadata-mono capitalize"
                value={user?.role || ""}
                disabled
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-ember-orange text-white text-sm font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-glow-accent"
            >
              {loading ? "Kaydediliyor..." : "Profil Bilgilerini Güncelle"}
            </button>
          </form>
        </section>

        {/* Change Password Form */}
        <section className="glass-card p-lg rounded-xl border border-outline-variant space-y-md">
          <h2 className="font-headline-h2 text-xl font-bold text-on-surface border-l-4 border-ember-orange pl-sm">
            Şifre Değiştir
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-md">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                Mevcut Şifre
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm font-metadata-mono"
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, oldPassword: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                Yeni Şifre
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm font-metadata-mono"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm font-metadata-mono"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-vivid-purple text-white text-sm font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              Şifreyi Güncelle
            </button>
          </form>
        </section>

        {/* Notification Preferences */}
        <section className="glass-card p-lg rounded-xl border border-outline-variant space-y-md">
          <h2 className="font-headline-h2 text-xl font-bold text-on-surface border-l-4 border-ember-orange pl-sm">
            Bildirim Tercihleri
          </h2>
          <div className="space-y-sm font-body-md text-sm">
            <p className="text-on-surface-variant text-xs pb-xs">
              Kütüphane duyuruları, kitap iade uyarıları ve rezervasyon
              bildirimlerini alacağınız kanallar:
            </p>

            <div className="flex justify-between items-center py-sm border-b border-outline-variant/30">
              <div>
                <p className="text-on-surface font-semibold">
                  SMS Bildirimleri
                </p>
                <p className="text-xs text-on-surface-variant">
                  Telefon numarasına SMS gönderilir.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePref("sms")}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${notifPrefs.sms ? "bg-ember-orange" : "bg-surface-container-highest"}`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${notifPrefs.sms ? "translate-x-6" : "translate-x-0"}`}
                ></div>
              </button>
            </div>

            <div className="flex justify-between items-center py-sm border-b border-outline-variant/30">
              <div>
                <p className="text-on-surface font-semibold">
                  E-posta Bildirimleri
                </p>
                <p className="text-xs text-on-surface-variant">
                  E-posta adresinize bülten ve hatırlatmalar gönderilir.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePref("email")}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${notifPrefs.email ? "bg-ember-orange" : "bg-surface-container-highest"}`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${notifPrefs.email ? "translate-x-6" : "translate-x-0"}`}
                ></div>
              </button>
            </div>

            <div className="flex justify-between items-center py-sm">
              <div>
                <p className="text-on-surface font-semibold">
                  Push Bildirimleri
                </p>
                <p className="text-xs text-on-surface-variant">
                  Tarayıcı veya uygulama içi anlık bildirimler.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePref("push")}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${notifPrefs.push ? "bg-ember-orange" : "bg-surface-container-highest"}`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${notifPrefs.push ? "translate-x-6" : "translate-x-0"}`}
                ></div>
              </button>
            </div>
          </div>
        </section>

        {/* System Settings (Theme only) */}
        <section className="glass-card p-lg rounded-xl border border-outline-variant space-y-md">
          <h2 className="font-headline-h2 text-xl font-bold text-on-surface border-l-4 border-ember-orange pl-sm">
            Sistem Tercihleri
          </h2>
          <div className="space-y-md font-body-md text-sm">
            <div className="flex justify-between items-center py-xs">
              <div>
                <p className="text-on-surface font-semibold">Görünüm Teması</p>
                <p className="text-xs text-on-surface-variant">
                  Midnight (Karanlık) / Day (Aydınlık) modu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(toggleTheme())}
                className="px-md py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 rounded-lg text-xs font-bold text-on-surface flex items-center gap-xs cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-sm">
                  {theme === "dark" ? "light_mode" : "dark_mode"}
                </span>
                <span>
                  {theme === "dark" ? "Aydınlık Mod" : "Karanlık Mod"}
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
