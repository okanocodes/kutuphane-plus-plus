import { useLocation, Link } from "react-router-dom";

const Footer = () => {
    const location = useLocation();
    if (location.pathname === '/admin') return null;
    return (
        <footer className="bg-surface-container-highest dark:bg-surface-container-highest w-full relative bottom-0">
            <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-lg w-full max-w-7xl mx-auto">
                <div className="mb-lg md:mb-0">
                    <span className="font-headline-h3 text-headline-h3 text-primary">Kütüphane++</span>
                    <p className="font-label-xs text-label-xs text-on-surface-variant mt-sm">© 2024 Kütüphane++. Tüm hakları saklıdır.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-lg">
                    <Link className="font-label-xs text-label-xs text-on-surface-variant hover:text-ember-orange underline transition-all opacity-80 hover:opacity-100" to="/about">Hakkımızda</Link>
                    <Link className="font-label-xs text-label-xs text-on-surface-variant hover:text-ember-orange underline transition-all opacity-80 hover:opacity-100" to="/faq">Sıkça Sorulan Sorular</Link>
                    <Link className="font-label-xs text-label-xs text-on-surface-variant hover:text-ember-orange underline transition-all opacity-80 hover:opacity-100" to="/contact">İletişim</Link>
                </div>
                <div className="mt-lg md:mt-0 flex gap-md">
                    <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-ember-orange transition-colors group">
                        <span className="material-symbols-outlined text-sm group-hover:text-white">language</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-ember-orange transition-colors group">
                        <span className="material-symbols-outlined text-sm group-hover:text-white">share</span>
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default Footer