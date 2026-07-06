# Kütüphane++ (Kütüphane Plus Plus) — Detaylı Proje Raporu

Bu belge, **Kütüphane++** dijital kütüphane yönetim ve rezervasyon platformunun tasarım hedeflerini, kapsamını, teknik mimarisini ve proje boyunca uygulanan mühendislik çözümlerini detaylandırmak amacıyla hazırlanmıştır.

---

## 1. Proje Hakkında Genel Bilgi

**Kütüphane++**, geleneksel kütüphane yönetim sistemlerini modern dijital kullanıcı alışkanlıklarına göre yeniden yorumlayan, kullanıcı dostu ve yüksek etkileşimli bir web uygulamasıdır.

Sistem; okuyucuların (öğrenciler, akademisyenler) kütüphane kaynaklarına kolayca erişebilmesini sağlarken, kütüphane yöneticileri ve kütüphaneciler için de operasyonel süreçleri kolaylaştıracak gelişmiş araçlar sunar. "Midnight & Ember" temasıyla zenginleştirilmiş koyu mod tasarımı, kullanıcılara modern bir dijital yayın platformu estetiği sunar.

---

## 2. Temel Arayüz Özellikleri ve Sayfalar

Uygulama, zengin özellik setiyle tek sayfa uygulama (SPA) yapısında kurgulanmış olup şu ana bölümlerden oluşmaktadır:

- **Kontrol Paneli (Dashboard):** Kullanıcının aktif ödünç aldığı kitap sayılarını, aylık okuma hedeflerini, güncel ceza durumlarını, masa ve oda rezervasyonlarını anlık olarak takip edebildiği kişiselleştirilmiş panosudur.
- **Kitap Kataloğu ve Detay Sayfası:** Kütüphanedeki tüm kitapların kategori, yazar, format (PDF/Basılı) ve yayın yılına göre filtrelenebildiği alandır. Kitap detayında kullanıcılar kitaba puan verebilir, yorum yazabilir veya kitabı rezerve edebilirler.
- **Ödünç Kitaplar Yönetimi (Borrowed Books):** Kullanıcıların aktif okudukları kitapları ve iade sürelerini izlediği ekrandır. Gecikmiş kitaplar için canlı ceza hesaplaması yapılır. Süre uzatma talebi veya iade işlemi için dinamik QR kod simülasyonu sunulur.
- **Çalışma Alanı & Masa Rezervasyonu:** Kütüphane katlarında ve salonlarında yer alan çalışma masalarının doluluk durumunu interaktif olarak gösteren ve kullanıcılara saat aralığı seçerek masa ayırtma olanağı tanıyan modüldür.
- **Toplantı Odası Rezervasyonu:** Akademik çalışma veya grup projeleri için toplantı odalarının (Oda A, Oda B vb.) tarihe ve saat dilimine göre rezerve edilmesini sağlayan sistemdir.
- **Etkinlik Yönetimi:** Kütüphane bünyesinde düzenlenen kitap kulüpleri, paneller ve yazar buluşmalarının listelendiği, kullanıcıların kontenjan sınırına göre katılım rezervasyonu yapabildiği ekrandır.
- **Bildirim Merkezi (Notification Center):** Rezervasyon onayları, iptalleri, iade ve ödünç alma işlemleri için tarih, saat ve detaylı açıklama barındıran, en yeni bildirimleri en üstte gösterecek şekilde sıralanmış bildirim ekranıdır.

---

## 3. Yönetim Paneli (Admin Panel)

Yöneticiler ve kütüphaneciler için geliştirilen bu özel arayüz, platformun operasyonel kalbidir:

- **AG Grid Entegrasyonu:** Kitaplar, Kullanıcılar, Rezervasyonlar, Ödünç Alınanlar, Masalar/Odalar ve Etkinlikler gibi yoğun veri tabloları AG Grid kütüphanesiyle listelenir. Bu sayede tüm kolonlarda anında arama, sıralama ve sayfalama yapılır.
- **Onay & İptal Mekanizmaları:** Kullanıcılardan gelen kitap rezervasyon talepleri tek tıkla onaylanabilir veya reddedilebilir. Onaylanan rezervasyonlar sistem tarafından otomatik olarak aktif ödünç kaydına dönüştürülür.
- **Ceza Yönetimi:** İade süresini geçiren öğrencilerin biriken cezaları yönetici paneli üzerinden incelenebilir ve tahsilat durumunda sıfırlanabilir.
- **Envanter ve Etkinlik Girişi:** Yeni kitap tanımlama, mevcut masaların durumunu güncelleme veya yeni kütüphane etkinlikleri oluşturma işlemleri doğrudan bu panelden gerçekleştirilir.

---

## 4. Teknik Altyapı ve Teknoloji Yığını

Uygulamamız, modülerlik ve ölçeklenebilirlik ilkelerine bağlı kalınarak şu teknolojilerle geliştirilmiştir:

- **Ön Yüz (Frontend):**
  - **React 19 & Vite:** Bileşen bazlı geliştirme ve hızlı sıcak yükleme (Hot Module Replacement) desteği.
  - **Redux Toolkit:** Uygulama genelinde ortak kullanılan kullanıcı kimlik doğrulaması (`authSlice`), kitap envanteri (`bookSlice`), çalışma alanı/rezervasyonlar (`reservationSlice`), bildirim ve toast mesajları (`uiSlice`) ile kullanıcı cezalarının/ödünçlerinin (`userSlice`) durum yönetimini üstlenir.
  - **React Router DOM:** Sayfa geçişlerini yenilenmeden tamamlayan yönlendirme mekanizması.
  - **Vanilla CSS:** "Midnight & Ember" tasarım yönergelerine uygun olarak yazılmış, karanlık mod odaklı, yumuşak geçişli gölgeler (ambient glows), responsive grid yerleşimleri ve modern cam moru/canlı turuncu görsel dille harmanlanmış özelleştirilmiş stil kütüphanesi.
  - **AG Grid React:** Yönetici panellerinde kullanılan performanslı veri grid bileşeni.
- **Mock Veritabanı ve Sunucu:**
  - **json-server:** Projenin tüm veri yapısını (books, users, reservations, borrowedBooks, notifications, events, studyDesks, meetingRooms) saklayan ve REST API standartlarında çalışmasını sağlayan simüle edilmiş JSON sunucusu.

---

## 5. Mühendislik ve Mimari Yaklaşımlar

Geliştirme sürecinde karşılaşılan teknik zorluklar ve uygulanan gelişmiş çözümler şunlardır:

### A. Yazma Yarışı Önleme (LowDB Write Collision Prevention)

`json-server` (alt yapısında `lowdb` kullanan) hızlı art arda gelen HTTP POST/PATCH isteklerinde dosya yazma işlemini tamamlayamadan yeni bir istek aldığında veri kaybı yaşayabilmektedir. Bu çakışmayı engellemek amacıyla; rezervasyon onayı, kitap ödünç alma ve iade etme gibi zincirleme yazma işlemlerinin arasına asenkron **150ms gecikme (delay)** entegre edilmiştir. Bu sayede her bir veri yazma işleminin diske güvenli bir şekilde işlenmesi garanti altına alınmıştır.

### B. Çift Yönlü Redux Store Senkronizasyonu (Cross-Slice ExtraReducers)

Yönetici panelinden bir kitap rezervasyonu onaylandığında, `reservationSlice` içindeki `updateReservationStatus` thunk'ı tetiklenir. Bu thunk hem rezervasyon durumunu günceller hem de veritabanında yeni bir ödünç kaydı (`borrowLog`) oluşturur.
`userSlice` altındaki kullanıcı ödünç listesinin sayfayı yenilemeden güncellenebilmesi için, `userSlice`'ta `extraReducers` kullanılarak `updateReservationStatus.fulfilled` eylemi dinlenmiş ve oluşturulan ödünç kaydı doğrudan kullanıcının yerel Redux durumuna enjekte edilmiştir.

### C. Gelişmiş Bildirim Formatı ve Sıralama

Tüm kullanıcı bildirimleri; işlemin gerçekleştiği tarih, saat ve etkilenen kaynak ismi (kitap adı, masa numarası veya oda ismi) ile zenginleştirilerek `[GG.AA.YYYY SA:DK]` formatında oluşturulur. Bildirimler listelenirken tarih ve veritabanı eklenme sırasına göre en yeni bildirim en üstte görünecek şekilde azalan düzende (descending) sıralanmaktadır.
