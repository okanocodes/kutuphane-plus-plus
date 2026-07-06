import { useState } from 'react';

export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Kitap rezervasyonu nasıl yapılır?",
      answer: "Kütüphane kataloğundan veya arama çubuğundan istediğiniz kitabı bularak detay sayfasına gidin. Eğer kitap 'Müsait' durumdaysa, sağ panelde yer alan 'Şimdi Rezerve Et' butonuna tıklayarak rezervasyon talebi oluşturabilirsiniz. Talebiniz kütüphane personeli tarafından onaylandığında bildirim alırsınız."
    },
    {
      question: "Ödünç aldığım kitabın süresini nasıl uzatabilirim?",
      answer: "Panelinizde yer alan 'Ödünç Kitaplar' sekmesine gidin. Aktif olarak ödünç aldığınız kitapların yanında yer alan 'Süre Uzat' butonuna tıklayarak iade tarihini 15 gün daha uzatabilirsiniz. Kitap rezerve edilmişse veya gecikmişse süre uzatılamayabilir."
    },
    {
      question: "Gecikme cezası borcunu nasıl ödeyebilirim?",
      answer: "Kütüphane kurallarına göre geciken kitaplar için günlük 5 TL gecikme cezası yansıtılır. Toplam ceza borcunuzu Dashboard panelinde görebilir, 'Ödünç Kitaplar' sayfasındaki 'Cezayı Öde' simülasyonunu kullanarak kartla online olarak hızlıca ödeyebilirsiniz."
    },
    {
      question: "Çalışma masasında check-in işlemi nasıl yapılır?",
      answer: "Rezervasyon yaptıktan sonra masanıza ulaştığınızda 'Rezervasyonlarım' sayfasında ilgili masanın yanındaki 'Giriş Yap' butonuna tıklayarak QR kod ekranını açıp check-in işleminizi tamamlamalısınız. 15 dakika içinde check-in yapılmayan masaların rezervasyonu otomatik iptal edilir."
    },
    {
      question: "Grup çalışma odalarını kimler rezerve edebilir?",
      answer: "Grup çalışma ve toplantı odaları tüm akademisyenler ve en az 3 kişilik çalışma grupları oluşturan öğrenciler tarafından rezerve edilebilir. Rezervasyonlar maksimum 1.5 saatlik slotlar halinde planlanır."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-lg max-w-4xl mx-auto text-left">
      <div className="space-y-xs text-center md:text-left">
        <h1 className="font-display-lg text-primary text-4xl md:text-5xl font-bold tracking-tight">Sıkça Sorulan Sorular (SSS)</h1>
        <p className="font-body-lg text-on-surface-variant text-lg leading-relaxed">
          Kütüphane sistemi, rezervasyonlar ve cezalarla ilgili en sık sorulan soruların cevaplarını aşağıda bulabilirsiniz.
        </p>
      </div>

      <div className="space-y-md pt-md">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="glass-card rounded-xl border border-outline-variant/60 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-lg py-md flex justify-between items-center text-left hover:bg-surface-container/30 transition-colors font-bold text-on-surface text-base md:text-lg cursor-pointer"
              >
                <span>{faq.question}</span>
                <span className={`material-symbols-outlined text-ember-orange transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  keyboard_arrow_down
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[300px] border-t border-outline-variant/30 py-md px-lg' : 'max-h-0 overflow-hidden'
                }`}
              >
                <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQPage;
