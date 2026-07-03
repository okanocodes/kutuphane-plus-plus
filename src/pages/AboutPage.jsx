
export const AboutPage = () => {
  return (
    <div className="space-y-lg max-w-4xl mx-auto">
      <div className="space-y-sm text-center md:text-left">
        <h1 className="font-display-lg text-primary text-4xl md:text-5xl font-bold tracking-tight">Kütüphane++ Hakkında</h1>
        <p className="font-body-lg text-on-surface-variant text-lg leading-relaxed">
          Kütüphane++, klasik kütüphane yönetimini modern ed-tech ve dijital platform estetiğiyle birleştiren yeni nesil bir compiled-knowledge sistemidir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-md">
        <div className="glass-card p-lg rounded-xl border border-outline-variant">
          <h2 className="font-headline-h2 text-ember-orange text-xl font-semibold mb-sm">Vizyonumuz</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Bilgiyi daha erişilebilir, organize ve dinamik kılmak. Fiziksel kitapların dokusunu ve dijital kaynakların hızını tek bir çatı altında birleştiren, kullanıcı odaklı bir ekosistem inşa ediyoruz.
          </p>
        </div>
        <div className="glass-card p-lg rounded-xl border border-outline-variant">
          <h2 className="font-headline-h2 text-vivid-purple text-xl font-semibold mb-sm">Misyonumuz</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Öğrenciler, akademisyenler ve kütüphaneciler arasındaki etkileşimi kolaylaştıran gelişmiş arama algoritmaları, canlı masa rezervasyonları ve entegre ceza/ödünç takip sistemleri sunmak.
          </p>
        </div>
      </div>

      <div className="bg-surface-container p-lg rounded-xl border border-outline-variant space-y-sm">
        <h2 className="font-headline-h2 text-on-surface text-2xl font-bold">Çalışma Saatleri</h2>
        <div className="grid grid-cols-2 gap-sm max-w-md font-body-md">
          <span className="text-on-surface-variant">Hafta İçi:</span>
          <span className="text-on-surface font-semibold">08:30 - 22:00</span>
          <span className="text-on-surface-variant">Cumartesi:</span>
          <span className="text-on-surface font-semibold">09:00 - 18:00</span>
          <span className="text-on-surface-variant">Pazar:</span>
          <span className="text-on-surface text-ember-orange font-semibold">Kapalı</span>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
