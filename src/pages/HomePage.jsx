import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <main>
            <section className="relative min-h-[870px] flex items-center justify-center overflow-hidden pt-xxl pb-xxl">
                <div className="absolute inset-0 bg-gradient-to-b from-midnight-violet/20 via-surface to-surface"></div>
                <div className="relative z-10 w-full max-w-7xl mx-auto px-margin-desktop text-center">

                    <h1 className="font-headline-h1 text-headline-h1 md:text-display-lg mb-md max-w-4xl mx-auto leading-tight">
                        Bilgi, <span className="text-ember-orange">derlendi.</span>
                    </h1>
                    <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-xxl">
                        Milyonlarca kaynak, akademik makaleler ve nadir eserler şimdi tek bir platformda. Öğrenmenin geleceğini keşfedin.
                    </p>
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-ember-orange to-vivid-purple rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-surface-container-highest border border-outline-variant/30 rounded-full px-lg py-md shadow-xl transition-all focus-within:border-vivid-purple focus-within:ring-2 focus-within:ring-vivid-purple/20">
                            <span className="material-symbols-outlined text-on-surface-variant mr-md">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-on-surface w-full placeholder-on-surface-variant font-body-md" placeholder="Kitap, yazar veya konu başlığı ara..." type="text" />
                            <button onClick={() => navigate('/search')} className="bg-vivid-purple hover:bg-vivid-purple/90 text-white px-xl py-sm rounded-full transition-all active:scale-95 font-label-sm text-label-sm ml-md">
                                Ara
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-xxl bg-surface">
                <div className="max-w-7xl mx-auto px-margin-desktop">
                    <div className="flex justify-between items-end mb-xl">
                        <div>
                            <h2 className="font-headline-h2 text-headline-h2 text-on-surface">Öne Çıkanlar</h2>
                            <p className="text-on-surface-variant font-label-sm text-label-sm">Küratörlerimizin haftalık seçkisi</p>
                        </div>
                        <div className="flex gap-sm">
                            <button className="p-2 border border-outline-variant rounded-full hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined">arrow_back</span></button>
                            <button className="p-2 border border-outline-variant rounded-full hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined">arrow_forward</span></button>
                        </div>
                    </div>
                    <div className="flex gap-lg overflow-x-auto no-scrollbar pb-lg snap-x">
                        {[
                            { id: 1, title: 'Geleceğin Kodları', author: 'Dr. Arda Yılmaz', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn6I_EPpTWm52VZ0EzuhV4I8noiuR0WkWNL-1aIWQQkJ95_llBWsz751cK5S5KYUpsw_KVVgeOkyciOM3qYMNHypkValxJGgp6-7e-YUlluQxDgk-DibdBlWN7zj8yNZYzqz9owXT7PfrRC8lUrzogQnYY1LQHbfObaq1HXxDtHY9TRAhnRugpaH7a9HA0W5G1oRr8PRGStNVqH6X4-I0cdTqXhIGfI7U-qz71lr18ypo6Gc7kJMKUY4t8TsCbE_8MTfREHTV5T843' },
                            { id: 2, title: 'Zamanın Felsefesi', author: 'Elif Şafak', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkroWYJb4x9aGmKqjm6BXu-UtcFdHYq2_WgPCw1Fc2ws5uiLzrCUZ8JoH7nUeMk_KbJHNAiBdf75RhHAMUT9c335jz1HK7CwmVrHL12KKI5EwerjxtiX6Y6XABhyY1egLt7sKbRnoADGfhF_0A7yjvre63FdhnaJvxvjGuOFbHBZMfRFeFGOMgNhkNFLd0jVitSkzHDselDyUZJtaeMf9YqqHbWxdWM1r4-v0nZkQlPdltI47P0l6Ote9IbOzdaJfZcMKCPBgX2Ue5' },
                            { id: 3, title: 'Işığın Anatomisi', author: 'Prof. Canan Öz', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp7K2232uaBL57mgmZNaeDHbphhSzOzoNaOEaobpX9SFkToyBnCFdwMrMAfziwj6itvZYBOr3qc2LhLv1rD4HMYJ6TythLxc2Ys6Pq04UA8JIpF-lwe-cGIi_GMaThxW8fpEPhijj4qI7Yl-h7tGNaQWRY4VO9227bW0C4nGkboQpMFBu1EQkEIUFYixVCOUS_IgO-zFnHZURvBZqB2QcnbbtGNnEcJL4WWkA8JMIDHbv7ll44FBF2i-aIKYbw0C5eXJ9p3Y2Q28dU' },
                            { id: 4, title: 'Antik Zekâ', author: 'Murat Başar', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOM_MKOOL1dnIyaUmG4TawTWvwV6sg37L9BWrmw4lqw9UQsk4Y7YGLm-ug16E614vz6gixkt23q0EJKaByb1lRESNx07mdpkpm52uED1UR2VJ4BtqxqucN736EsC8YOJBdV_HAbDeQ8bByNC022d6p96hUlbC10bmi0o0NQLO-e3EY4RyAksaWl5DSicwlQP4ZVryc76puqxLCHdsC5kqDwkYQm7fCr0CRsAp9wxpZBIXVg0hVnd4nhagj9eX7v58TELKQswp0B4tH' }
                        ].map(book => (
                            <div key={book.id} onClick={() => navigate('/book/1')} className="flex-none w-64 snap-start group cursor-pointer">
                                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-md shadow-lg transition-all group-hover:-translate-y-2 glow-ember">
                                    <img src={book.img} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-md">
                                        <button className="w-full bg-white text-midnight-violet py-sm rounded-lg font-bold text-label-sm">Detayları Gör</button>
                                    </div>
                                </div>
                                <h3 className="font-headline-h3 text-headline-h3 text-on-surface truncate">{book.title}</h3>
                                <p className="text-on-surface-variant font-label-sm text-label-sm">{book.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage