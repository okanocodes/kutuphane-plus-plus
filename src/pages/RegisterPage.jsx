import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearAuthError } from "../store/authSlice";
import { addToast } from "../store/uiSlice";
import Input from "../components/Input";

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Kütüphane++ — Kayıt Ol";
  }, []);
  const { status } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      dispatch(addToast({ message: "Lütfen adınızı girin.", type: "warning" }));
      return;
    }

    dispatch(clearAuthError());
    const resultAction = await dispatch(registerUser({ name, role }));
    if (registerUser.fulfilled.match(resultAction)) {
      dispatch(
        addToast({ message: "Kayıt işlemi başarılı!", type: "success" }),
      );
      navigate("/dashboard");
    } else {
      dispatch(
        addToast({
          message: resultAction.payload || "Kayıt başarısız.",
          type: "error",
        }),
      );
    }
  };

  const roles = [
    { value: "student", label: "Öğrenci", icon: "school" },
    { value: "academic", label: "Akademisyen", icon: "menu_book" },
    { value: "librarian", label: "Kütüphaneci", icon: "local_library" },
    { value: "admin", label: "Yönetici", icon: "admin_panel_settings" },
  ];

  return (
    <div className="space-y-lg">
      <div className="text-center">
        <h2 className="font-headline-h2 text-2xl font-bold text-on-surface">
          Yeni Hesap Oluşturun
        </h2>
        <p className="font-body-md text-sm text-on-surface-variant">
          Kütüphane sistemine katılmak için bilgilerinizi girin
        </p>
      </div>

      <form className="space-y-lg" onSubmit={handleSubmit}>
        <div className="space-y-md">
          <Input
            id="name"
            name="name"
            type="text"
            required
            label="Ad Soyad"
            placeholder="Adınızı ve soyadınızı girin"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-xs">
            <label className="block text-sm font-medium text-on-surface-variant font-label-sm">
              Üyelik Rolü
            </label>
            <div className="grid grid-cols-2 gap-sm">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                    role === r.value
                      ? "border-vivid-purple bg-vivid-purple/10 text-primary shadow-[0_0_15px_rgba(91,33,182,0.2)] font-semibold"
                      : "border-outline-variant hover:border-outline bg-surface-container-high/40 text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl mb-1">
                    {r.icon}
                  </span>
                  <span className="font-label-xs text-xs tracking-wide">
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-ember-orange hover:bg-ember-orange/90 hover:shadow-[0_0_15px_rgba(255,93,58,0.3)] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Kaydediliyor..." : "Hesap Oluştur ve Başla"}
        </button>

        <div className="text-center text-sm font-label-sm">
          <span className="text-on-surface-variant">
            Zaten hesabınız var mı?{" "}
          </span>
          <Link
            to="/login"
            className="font-semibold text-vivid-purple hover:text-ember-orange transition-colors"
          >
            Giriş Yapın
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
