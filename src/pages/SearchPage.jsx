import { useNavigate } from "react-router-dom";

const SearchPage = () => {
    const navigate = useNavigate();
    return (
        <main className="max-w-7xl mx-auto px-margin-desktop py-xl flex gap-lg relative min-h-screen">
            <aside className="w-64 shrink-0 hidden lg:block sticky top-32 h-fit space-y-xl">
                <div>
                    <h3 className="font-headline-h3 text-label-sm uppercase tracking-wider text-on-surface-variant mb-md">Kategoriler</h3>
                    <div className="flex flex-col gap-xs">
                        {['Bilim Kurgu', 'Tarih', 'Felsefe', 'Teknoloji', 'Klasikler'].map(cat => (
                            <label key={cat} className="flex items-center justify-between group cursor-pointer py-1">
                                <span className="text-label-sm text-on-surface group-hover:text-ember-orange transition-colors">{cat}</span>
                                <input type="checkbox" defaultChecked={cat === 'Tarih'} className="rounded border-outline-variant bg-surface-container text-vivid-purple focus:ring-vivid-purple" />
                            </label>
                        ))}
                    </div>
                </div>
                <button className="w-full py-sm bg-vivid-purple text-white rounded-lg font-label-sm hover:opacity-90 active:scale-[0.97] transition-all">Filtreleri Uygula</button>
            </aside>
            <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
                    <div>
                        <h1 className="font-headline-h2 text-headline-h2">"Tarih" için sonuçlar</h1>
                        <p className="text-on-surface-variant text-label-sm mt-1">Toplam 42 kitap bulundu</p>
                    </div>
                    <div className="flex items-center gap-md w-full md:w-auto">
                        <select className="bg-surface-container border border-outline-variant rounded-lg text-label-sm py-2 pl-3 pr-8 focus:ring-2 focus:ring-vivid-purple transition-all outline-none">
                            <option>En Yeni</option>
                            <option>İsme Göre (A-Z)</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-lg">
                    {[
                        { title: 'İmparatorluğun En Uzun Yüzyılı', author: 'İlber Ortaylı', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_KewuFDEosM4W9PXVJElul2haszpEGTVBnqu66fCwjBLul-astliMf-1SEiWSXYT4bbMlRUQC_C30ukbDIqPSqr-s6we3DVswDn4ucERTMUBkDYKtK3G2U2EnpvokrLSEm-AuIiiduQQLp91Ha7nTtTMt5asOzlS9oN-8MnzFVPzcG-ogSU9GdKIwR195_Jf5vmGXHY1JkCaRSqQnBoXPllcrvahzFk3J_F1aRk34z_nYyOxGQSmoDN7FIy7sVwOoZ7vpjHivPuMT' },
                        { title: 'Sapiens', author: 'Yuval Noah Harari', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF4lMGZFi6nKancW07aaiU71zTOvbSnzIIEazj_vr6C8mmf_knS0AdmFd9k7cBcG15uhBQfyJ45cXSdcIQ4WCjc-ZVgMEmfWkaYIcTxKRJtdAl3X8S1OMximu5ReYSET9FTfkY3djbDnxEt4_pb4HlT8dg1MIwvb7b1Tz9ArD6iR0Pr4WlVaW5ulRDYzskfEtaVZvV2nKxT-d1FyQCJfEUfdgMFyRmGHt9bHTmg6llboOX1OIovaez4PhRw4jFFJoXxAuH1Cj5iD9N' },
                        { title: 'Avrupa Tarihi', author: 'Norman Davies', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkWgW9pbY-S7H8OjpFG83tLB-g8h2iqf_81lZgiAmI2cz-qIuRz0N1-_vZODagun0DmpQ1ULJbJUb2u472UTFMrm9z4YOsSZ78qcpR5a0f7fRSQ7pQzWFHC9dy9eORraLVMODfWItpvm6np4sAsu5SgVp3IT3UDYBMKyW_4ui9_8nXWGb-gmtpa1FUsQnERa6O75Ykt7MP64A7c-bzgiC3hcVsxTRFVqudVQzYgx5DSyKwm2qcHoyQJMA8S2nu6klXka3AbsEK5pbg' }
                    ].map((book, idx) => (
                        <div key={idx} onClick={() => navigate('/book/1')} className="book-card-hover group bg-surface-container-low rounded-xl overflow-hidden flex flex-col border border-outline-variant/30 cursor-pointer">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img src={book.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="bg-success/90 backdrop-blur-md text-white text-label-xs px-2 py-1 rounded-full shadow-lg">Mevcut</span>
                                </div>
                            </div>
                            <div className="p-md flex flex-col flex-1">
                                <h4 className="font-headline-h3 text-label-sm text-on-surface group-hover:text-ember-orange transition-colors">{book.title}</h4>
                                <p className="text-label-xs text-outline mt-1 font-medium uppercase tracking-tight">{book.author}</p>
                                <div className="mt-auto pt-md flex items-center justify-between border-t border-outline-variant/20">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-accent-gold text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="text-label-xs text-on-surface font-metadata-mono">4.9</span>
                                    </div>
                                    <button className="text-vivid-purple font-label-sm hover:underline">Detaylar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default SearchPage