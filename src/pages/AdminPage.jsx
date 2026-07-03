import { Link, useNavigate } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <aside className="h-screen w-64 bg-surface-container-low border-r border-outline-variant flex flex-col py-xl shrink-0">
                <div className="px-md mb-xxl">
                    <h1 className="font-headline-h2 text-ember-orange">Admin</h1>
                </div>
                <nav className="flex-grow flex flex-col gap-xs px-xs">
                    <a className="flex items-center gap-md text-ember-orange border-l-4 border-ember-orange px-md py-sm" href="#"><span className="material-symbols-outlined">dashboard</span> Panel</a>
                    <Link to="/" className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:text-on-surface"><span className="material-symbols-outlined">home</span> Siteye Dön</Link>
                </nav>
                <div className="px-md mt-auto"><button className="w-full bg-ember-orange text-white py-sm rounded-lg">Kitap Ekle</button></div>
            </aside>
            <main className="flex-grow p-margin-desktop overflow-y-auto">
                <h2 className="text-3xl font-bold mb-8">Sistem Özeti</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-8">
                    <div className="glass-card p-6 rounded-xl"><p className="text-ember-orange">14.280</p><p>Toplam Kitap</p></div>
                    <div className="glass-card p-6 rounded-xl"><p className="text-vivid-purple">3.412</p><p>Aktif Üye</p></div>
                    <div className="glass-card p-6 rounded-xl"><p className="text-accent-gold">842</p><p>Ödünçte</p></div>
                    <div className="glass-card p-6 rounded-xl"><p className="text-accent-pink">156</p><p>Geciken</p></div>
                </div>
                <div className="glass-card rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-surface-container-high/50 text-label-xs uppercase tracking-widest">
                            <tr><th className="px-6 py-4">İşlem</th><th className="px-6 py-4">Kitap</th><th className="px-6 py-4">Tarih</th></tr>
                        </thead>
                        <tbody>
                            <tr><td className="px-6 py-4">İade</td><td className="px-6 py-4">Sefiller</td><td className="px-6 py-4">24.05.2024</td></tr>
                            <tr><td className="px-6 py-4">Ödünç</td><td className="px-6 py-4">1984</td><td className="px-6 py-4">24.05.2024</td></tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};


export default AdminPage