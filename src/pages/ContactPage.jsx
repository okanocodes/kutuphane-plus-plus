import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice';

export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      dispatch(addToast({ message: 'Lütfen tüm alanları doldurun.', type: 'warning' }));
      return;
    }
    
    // Simulate sending message
    dispatch(addToast({ message: 'Mesajınız başarıyla iletildi! En kısa sürede dönüş yapılacaktır.', type: 'success' }));
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl max-w-6xl mx-auto">
      <div className="space-y-lg">
        <div className="space-y-sm">
          <h1 className="font-display-lg text-primary text-4xl md:text-5xl font-bold tracking-tight">İletişim</h1>
          <p className="font-body-lg text-on-surface-variant leading-relaxed">
            Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="space-y-md font-body-md">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-ember-orange text-3xl">location_on</span>
            <div>
              <p className="text-on-surface font-semibold">Merkez Kütüphane Şubesi</p>
              <p className="text-on-surface-variant text-sm">Üniversite Bulvarı, No: 45, Kampüs / İstanbul</p>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-vivid-purple text-3xl">call</span>
            <div>
              <p className="text-on-surface font-semibold">Telefon</p>
              <p className="text-on-surface-variant text-sm">+90 (212) 555 0199</p>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl">mail</span>
            <div>
              <p className="text-on-surface font-semibold">E-posta</p>
              <p className="text-on-surface-variant text-sm">kutuphane@example.edu.tr</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-lg rounded-xl border border-outline-variant shadow-glow-accent">
        <h2 className="font-headline-h2 text-on-surface text-2xl font-bold mb-md">Bize Yazın</h2>
        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Ad Soyad</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">E-posta</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="eposta@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Mesajınız</label>
            <textarea
              rows="4"
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple focus:border-vivid-purple sm:text-sm"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Mesajınızı buraya yazın..."
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ember-orange hover:bg-ember-orange/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ember-orange active:scale-[0.98] transition-transform duration-100"
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
