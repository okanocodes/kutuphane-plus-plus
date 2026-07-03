import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex max-w-7xl mx-auto px-margin-desktop min-h-[calc(100vh-80px)]">
            <aside className="hidden lg:flex flex-col w-64 border-r border-outline-variant py-xl gap-md shrink-0">
                <div className="px-md mb-lg">
                    <h2 className="font-headline-h3 text-on-surface font-bold">Panelim</h2>
                    <p className="font-label-sm text-on-surface-variant">Hoş geldin, Arda.</p>
                </div>
                <nav className="flex flex-col gap-xs">
                    <a className="flex items-center gap-md text-ember-orange border-l-4 border-ember-orange px-md py-sm font-label-sm" href="#"><span className="material-symbols-outlined">dashboard</span> Panel</a>
                    <a className="flex items-center gap-md text-on-surface-variant px-md py-sm font-label-sm hover:text-on-surface" href="#"><span className="material-symbols-outlined">menu_book</span> Kitaplarım</a>
                </nav>
                <div className="mt-auto px-md">
                    <button onClick={() => navigate('/')} className="w-full py-3 px-4 bg-ember-orange text-white rounded-xl glow-accent flex items-center justify-center gap-2">Çıkış Yap</button>
                </div>
            </aside>
            <main className="flex-1 py-xl lg:pl-xl">
                <section className="relative w-full rounded-xxl overflow-hidden mb-xl p-xl glass-card">
                    <h1 className="font-headline-h1 text-on-surface mb-2">Merhaba, Arda!</h1>
                    <p className="text-body-lg text-on-surface-variant">Okuma Puanın: <span className="text-ember-orange font-bold">2,450</span></p>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
                    <div className="glass-card p-xl rounded-xxl"><p className="text-4xl font-bold">42</p><p>Okunan Kitaplar</p></div>
                    <div className="glass-card p-xl rounded-xxl"><p className="text-4xl font-bold">3</p><p>Aktif Ödünç</p></div>
                    <div className="glass-card p-xl rounded-xxl"><p className="text-4xl font-bold">5</p><p>Rezervasyonlar</p></div>
                </div>
            </main>
        </div>
    );
};


export default ProfilePage