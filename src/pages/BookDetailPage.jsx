import { useNavigate } from "react-router-dom";

const BookDetailPage = () => {
    const navigate = useNavigate();
    return (
        <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
            <div className="mb-lg flex items-center gap-sm">
                <button onClick={() => navigate(-1)} className="flex items-center gap-xs text-on-surface-variant hover:text-ember-orange transition-all font-label-sm text-label-sm">
                    <span className="material-symbols-outlined">arrow_back</span> Geri Dön
                </button>
                <span className="text-outline-variant">/</span>
                <span className="text-primary font-label-sm text-label-sm">Geleceğin Kodları</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-xxl">
                <div className="lg:col-span-4 flex flex-col gap-lg">
                    <div className="relative group aspect-[2/3] w-full rounded-xl overflow-hidden shadow-glow-accent glow-accent transition-transform duration-300 hover:-translate-y-2">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp1NmIqj3R2a9Xw9GvF8_d_wtHskYTtslDheMXiosGz1LgBbncuwipUQ-PoXMk3LH-bmTtwwykLgG5OtqjyyRR2wbIOSYqnWva3FYKg42Mk3fZk_aopa2_0zbcgGCOgM17PqCag50PmRgSrGKkgRe5hQtjQAkgB2AAlv7bQCGx9kLAsqCyR2gs6zK3FG2jkg24_xmT2KeTuVTrlWfg0lK39DGjvkXbRMKKioX2lpkIEcl2_rHWkDPyUmxNVlBlhsMTbfhx9JWOoBz5" />
                    </div>
                    <button className="w-full py-4 bg-ember-orange text-white rounded-xl font-headline-h3 flex items-center justify-center gap-md scale-95 active:opacity-80 transition-all hover:shadow-[0_0_15px_rgba(255,93,58,0.4)]">
                        <span className="material-symbols-outlined">book</span> Şimdi Rezerve Et
                    </button>
                </div>
                <div className="lg:col-span-8 flex flex-col gap-xl">
                    <div className="space-y-md">
                        <h1 className="font-display-lg text-display-lg text-on-surface leading-tight">Geleceğin Kodları: İnsan ve Makine Hibritleşmesi</h1>
                        <p className="font-headline-h3 text-primary">Prof. Dr. Aras Tekin</p>
                        <div className="flex items-center gap-xl py-md border-y border-outline-variant">
                            <div className="text-center"><p className="text-label-xs text-on-surface-variant">Sayfa</p><p className="font-headline-h3">482</p></div>
                            <div className="text-center"><p className="text-label-xs text-on-surface-variant">Yıl</p><p className="font-headline-h3">2024</p></div>
                            <div className="text-center"><p className="text-label-xs text-on-surface-variant">Puan</p><p className="font-headline-h3 text-accent-gold">4.9</p></div>
                        </div>
                        <h2 className="font-headline-h2 border-l-4 border-ember-orange pl-md">Özet</h2>
                        <p className="font-body-lg text-on-surface-variant leading-relaxed">
                            "Geleceğin Kodları", 21. yüzyılın en büyük dönüşümünü mercek altına alıyor. Yapay zekanın sadece bir araç olmaktan çıkıp, insan bilinciyle nasıl entegre olabileceğini anlatıyor.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BookDetailPage