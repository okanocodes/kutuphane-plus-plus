# Proje Başlatma Rehberi (React + Vite + Tailwind CSS + JSON Server + Redux Toolkit + AG Grid)

Bu şablon, yeni bir yazılım projesine başlarken projenin tüm detaylarını (tasarım, renkler, sayfalar, veri modeli ve state yönetimi) belirlemek ve Antigravity'nin projeyi sıfırdan kurmasını sağlamak amacıyla hazırlanmıştır.

Projenizi başlatmadan önce aşağıdaki alanları kendi projenizin gereksinimlerine göre doldurun.

---

## 1. Genel Proje Bilgileri

- **Proje Adı:** `Kütüphane++`
- **Kısa Açıklama:** `Kapsamlı bir Kütüphane Yönetim ve Rezervasyon Sistemi için hem kullanıcıların hem de kütüphane görevlilerinin ihtiyaçlarını karşılayacak sayfalar aşağıdaki gibi olabilir.`
- **Hedef Kitle:** ` Kütüphane kullanıcıları (öğrenciler, akademisyenler, personel) ve kütüphane yöneticileri.`

- Features:

  ## 1. Ana Sayfa (Home)
  - **Hero Alanı:** Gelişmiş arama çubuğu ve karşılama metni.
  - **Kitap Vitrinleri:**
    - Popüler kitaplar
    - Yeni gelen kitaplar
    - En çok ödünç alınanlar
  - **Haberler & Sosyal:** Duyurular ve Etkinlikler.
  - **Hızlı Erişim & Durum:**
    - Canlı çalışma alanı doluluk durumu
    - Hızlı rezervasyon butonu
    - Kategori kartları (Görsel destekli)

  ## 2. Giriş / Kayıt
  - Giriş Yap / Kayıt Ol
  - Şifremi Unuttum & E-posta doğrulama
  - **Entegrasyonlar:** Google / Microsoft ile Tek Tıkla Giriş (SSO)

  ## 3. Kitap Arama (Gelişmiş Arama Filtreleri)

  Arama motoru oldukça gelişmiş bir yapıda olmalı ve aşağıdaki kırılımlara göre filtreleme yapabilmelidir:
  - **Metin Tabanlı:** Kitap adı, Yazar, ISBN, Anahtar kelimeler
  - **Yayın Bilgisi:** Yayın yılı, Dil, Yayınevi, Kategori
  - **Fiziksel Konum:** Raf konumu
  - **Format:** E-kitap, Sesli kitap, Basılı kitap (Sayfa sayısı filtresi ile)
  - **Durum Filtresi:**
    - 🟢 Müsait
    - 🔴 Ödünçte
    - 🟡 Rezerve

  ## 4. Kitap Detay Sayfası

  ### 📋 İçerik ve Künye Bilgileri
  - Kitap kapağı görseli
  - Kitap adı ve Yazar
  - ISBN ve Barkod numarası
  - Kategori ve Alt kategori
  - Yayın yılı ve Baskı sayısı
  - Sayfa sayısı ve Dil
  - Fiziksel raf bilgisi (Örn: _Kat 2 - Salon A - Raf 14B_)
  - Kitap özeti ve Anahtar kelimeler
  - Kullanıcı puanları ve Yorumlar
  - Benzer kitaplar öneri listesi
  - **Anlık Müsaitlik Durumu**

  ### ⚙️ Aksiyon Butonları
  - `Rezervasyon Yap`
  - `Favorilere Ekle` / `Okuma Listeme Ekle`
  - `Ödünç Geçmişi` (Bu kitabı daha önce kimler okudu/ben aldım mı?)
  - `QR Kod Oluştur` (Kütüphanede kitabı hızlıca bulmak veya teslim almak için)
  - `PDF Önizleme` (Dijital kopyası varsa ilk 10 sayfa önizleme)

  ## 5. Kitap Rezervasyon Sayfası
  - **Kullanıcı Adımları:** Kitap seçimi ➔ Tarih seçimi ➔ Teslim alma şubesi seçimi ➔ Rezervasyon süresi belirleme ➔ Onay.
  - **Gösterilecek Bilgiler:** Sıra numarası, Bekleme listesi sırası, Tahmini teslim tarihi ve Güncel rezervasyon durumu.

  ## 6. Çalışma Masası Rezervasyonu
  - **Hiyerarşik Seçim:** Kat seçimi ➔ Salon seçimi ➔ Masa seçimi ➔ Saat/Slot seçimi.
  - **Giriş & Kontrol:** QR kodlu giriş sistemi (Masaya gidildiğinde check-in yapmak için).
  - **Aksiyonlar:** Rezervasyonu iptal et veya (eğer arkasından gelen yoksa) Rezervasyonu uzat.

  ## 7. Toplantı / Grup Çalışma Odası Rezervasyonu
  - Oda seçimi ve Kapasite kontrolü (Örn: 6 Kişilik, 12 Kişilik).
  - Saat seçimi ve İnteraktif takvim görünümü.
  - Oda rezervasyon geçmişi.

  ## 8. Etkinlik Rezervasyonu
  - **Etkinlik Türleri:** Söyleşiler, Kitap kulüpleri, Seminerler, Eğitimler.
  - **Etkinlik Detayları:** Kontenjan ve Kalan yer durumu, Konuşmacı/Eğitmen bilgisi, Saat, Konum/Salon.

  ***

  ## 9. Kullanıcı Paneli (Dashboard)

  ### 📊 Bilgi Kartları (Widgets)
  - Aktif ödünç alınan kitaplar
  - Yaklaşan teslim tarihleri (Kalan gün sayısı ile)
  - Aktif rezervasyonlar
  - Varsa ceza borcu tutarı
  - Favori kitap sayısı

  ### 📈 İstatistik Grafikleri
  - Kişisel okuma istatistikleri (Yıllık/Aylık)
  - En çok okunan kategorilerin dağılımı (Pasta grafik)
  - Aylara göre okunan kitap sayısı (Bar grafik)

  ## 10. Rezervasyonlarım
  - **Durum Listesi:** Aktif, Bekleyen, İptal edilen, Tamamlanan rezervasyonlar.
  - **İşlemler:** İptal et, Tarih değiştir, Rezervasyon detaylarını gör.

  ## 11. Ödünç Aldığım Kitaplar
  - Kitap bazlı detaylar: Teslim tarihi, Kalan gün sayısı.
  - **Hızlı Aksiyonlar:** Süre Uzatma talebi, Ceza durumu sorgulama, Hızlı iade için QR Kod.

  ## 12. Favoriler & Listeler
  - Favori kitaplar
  - Kişisel okuma listeleri
  - "Daha sonra oku" sekmesi

  ## 13. Geçmiş
  - Okunan kitaplar (Kronolojik)
  - Önceki rezervasyon geçmişi
  - Eski ödünç işlemleri

  ## 14. Bildirimler
  - Rezervasyon onay/iptal bildirimleri
  - Teslim tarihi yaklaşıyor uyarısı (SMS/E-posta/Push)
  - Ceza bildirimi ve borç hatırlatması
  - Kütüphaneye eklenen yeni kitap bildirimleri
  - Etkinlik duyuruları

  ## 15. Profil & Ayarlar
  - **Bilgiler:** Profil fotoğrafı, Ad-Soyad, Öğrenci/Sicil numarası, Bölüm/Birim, Telefon, E-posta.
  - **Ayarlar:** Şifre değiştirme, Bildirim tercihleri (Aç/Kapat), Tema seçimi (Karanlık/Aydınlık), Dil seçimi.

  ## 16. Dijital Kütüphane
  - PDF kaynaklar, E-kitaplar, Sesli kitaplar.
  - Akademik makaleler ve Tezler.

  ## 17. Blog / Haberler
  - Editörün seçtiği yeni kitaplar ve Kitap önerileri.
  - Etkinlik haberleri ve resmi duyurular.

  ## 18. SSS (Sıkça Sorulan Sorular)
  - Nasıl rezervasyon yapılır?
  - Kitap ödünç süresi nasıl uzatılır?
  - Gecikme cezası online nasıl ödenir?

  ## 19. İletişim & 20. Hakkımızda
  - **İletişim:** İnteraktif harita, Telefon, E-posta, Bize Yazın (Mesaj gönderim formu).
  - **Hakkımızda:** Tarihçe, Misyon & Vizyon, Kütüphane çalışma saatleri.

  ***

  ## 21. Yönetici Paneli (Admin Dashboard)

  ### 📈 Genel İstatistikler
  - Günlük ziyaretçi sayısı
  - Günlük rezervasyon ve ödünç sayıları
  - En popüler/En çok aranan kitaplar

  ### 🛠️ Yönetim Modülleri

  | Modül Adı                  | İçerik ve İşlemler                                                                                                                |
  | :------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
  | **Kitap Yönetimi**         | Kitap ekle/güncelle/sil, Barkod/QR kod oluşturma, Excel ile toplu kitap içe aktarma.                                              |
  | **Kullanıcı Yönetimi**     | Öğrenci, Akademisyen ve Personel listeleri. Yetkilendirme, Hesap dondurma, Ceza tanımlama.                                        |
  | **Rezervasyon Yönetimi**   | Rezervasyon onaylama/iptal, Bekleme listesi yönetimi, Manuel süre uzatma.                                                         |
  | **Ödünç Yönetimi**         | Kitap teslim alma (İade) ve Teslim etme işlemleri, Gecikmelerin takibi, Ceza yansıtma.                                            |
  | **Etkinlik Yönetimi**      | Etkinlik oluşturma, Kontenjan belirleme, Katılımcı listesi yönetimi, Etkinlik kapısında QR ile giriş kontrolü.                    |
  | **Çalışma Alanı Yönetimi** | Kat/Salon bazlı masa ve oda tanımlama, Kapasite ayarları, Canlı doluluk takibi.                                                   |
  | **Raporlar Modülü**        | En çok okunan kitaplar, En aktif kullanıcılar, Gecikme ve Ceza raporları, PDF/Excel çıktıları.                                    |
  | **Sistem Ayarları**        | Çalışma saatleri, Maksimum ödünç limitleri, Rezervasyon süre sınırları, Günlük ceza miktarı, SMTP (E-posta) ve Bildirim ayarları. |

  ***

  ## 🗄️ Önerilen Veritabanı Modülleri (Tablolar)

  Sistemin backend mimarisinde bulunması gereken temel tablolar:

  ```sql
  -- Temel Veritabanı Tablo Yapısı Örneği
  - Users (Kullanıcılar) & Roles (Roller)
  - Books (Kitaplar), Authors (Yazarlar), Categories (Kategoriler), Publishers (Yayınevleri)
  - Shelves (Raflar / Konumlar)
  - Loans (Ödünç İşlemleri) & Reservations (Rezervasyonlar)
  - Desks (Çalışma Masaları) & MeetingRooms (Toplantı Odaları)
  - Events (Etkinlikler)
  - Notifications (Bildirimler)
  - Favorites (Favoriler), Comments (Yorumlar), Ratings (Puanlamalar)
  - Fines (Cezalar)
  - DigitalContents (Dijital İçerikler)
  - SystemLogs (Sistem Logları)
  ```

---

## 2. Shared Components:

### Button

### Input

### Select

### Multi Select

### Checkbox

### Radio

### Textarea

### Modal

### Drawer

### Dropdown

### Tabs

### Accordion

### Tooltip

### Badge

### Avatar

### Table

### Pagination

### Breadcrumb

### Card

### Alert

### Toast

### Loading

### Skeleton

### Empty State

### Search Bar

### Date Picker

### Calendar

### Rating

### QR Component

### Charts

---

## 3. Ortak Altyapı yapısı ve yapılacaklar:

- Proje kurulumu
- Folder structure
- Routing
- Layout
- Navbar
- Footer
- Sidebar
- Theme (Dark/Light)
- Responsive Layout
- Protected Routes
- 404 Page

---

## 4. Global State Yönetimi (Redux Toolkit):

### authSlice

### userSlice

### bookSlice

### reservationSlice

### favoriteSlice

### notificationSlice

### dashboardSlice

### adminSlice

### themeSlice

### searchSlice

---

## 6. AI Agent Geliştirme Sırası ve Talimatları (Library System – Fetch + Redux Architecture)

AI Agent (Antigravity) bu projede sadece frontend altyapısını hazır hale getirmekten sorumludur.

Amaç:

- Proje çalışır durumda olacak
- JSON server entegre olacak
- Routing + layout + Redux hazır olacak
- Feature development diğer ekip üyelerine bırakılacak
- API katmanı Redux üzerinden yönetilecek (fetch + thunk)

---

## ⚠️ MEVCUT DURUM

- React/Vite (veya framework) hazır
- Tüm bağımlılıklar zaten kurulu
- `db.json` proje kökünde mevcut
- Backend yerine `json-server` kullanılıyor
- API çağrıları **sadece fetch + Redux thunk** ile yapılacak

---

## 1. Adım: Basit Klasör Yapısını Kur

```
src/
  components/
  pages/
  layouts/
  store/
  hooks/
  utils/
  assets/
```

---

## 2. Adım: Router Setup

### Public Routes:

- `/`
- `/login`
- `/register`
- `/books`
- `/book/:id`
- `/about`
- `/contact`

### Private Routes:

- `/dashboard`
- `/profile`
- `/reservations`
- `/favorites`
- `/borrowed`
- `/admin`

---

## 3. Adım: Redux Store Yapısı (CORE)

`store/` içinde:

```
store/
  index.js
  authSlice.js
  bookSlice.js
  userSlice.js
  reservationSlice.js
  uiSlice.js
```

---

## 4. Adım: FETCH + createAsyncThunk KURALI

### ⚠️ KURAL:

- API çağrısı sadece Redux içinde yapılır
- Component içinde fetch yasaktır

---

### Örnek Book Slice:

```js
export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const res = await fetch("http://localhost:5000/books");
  return res.json();
});
```

---

## 5. Adım: API Endpoint Standartları

JSON Server endpointleri:

- `/books`
- `/users`
- `/reservations`
- `/borrowedBooks`
- `/authors`
- `/categories`
- `/events`
- `/studyDesks`
- `/notifications`

---

## 6. Adım: Layout Sistemi

```
layouts/
  MainLayout.jsx
  AuthLayout.jsx
  DashboardLayout.jsx
```

İçerik:

- Navbar
- Sidebar
- Footer

---

## 7. Adım: Pages Yapısı

### Public Pages:

- Home
- Login
- Register
- Books
- BookDetail
- About
- Contact

### Private Pages:

- Dashboard
- Profile
- Reservations
- Favorites
- BorrowedBooks
- Admin

---

## 8. Adım: Components (UI Layer)

```
components/
  Navbar
  Sidebar
  Button
  Input
  Modal
  Card
  BookCard
  Loader
  Toast
  EmptyState
```

---

## 9. Adım: Utils & Hooks

### utils/

- formatDate
- statusMapper
- calculatePenalty

### hooks/

- useAuth
- useSelector wrappers (optional)
- useDispatch wrappers (optional)

---

## 10. Adım: Redux Data Flow KURALI

### Data flow:

```
UI Component
   ↓
dispatch(action)
   ↓
createAsyncThunk
   ↓
fetch API
   ↓
json-server
   ↓
store update
   ↓
UI re-render
```

---

## 🎯 FINAL GOAL

Bu setup tamamlandığında:

✔ Proje çalışır durumda  
✔ JSON server bağlı  
✔ Redux store hazır  
✔ Fetch-only API layer  
✔ Layout sistemi kurulmuş  
✔ Routing hazır  
✔ Sayfalar boş ama erişilebilir  
✔ Component sistemi hazır

---

## ❌ YASAKLAR

- Axios kullanılmayacak
- services/ layer kullanılmayacak
- Component içinde fetch yazılmayacak
- Business logic UI içinde olmayacak
- Feature-based structure kullanılmayacak

---

## ✅ SONUÇ

Diğer ekip üyeleri:

- Redux üzerinden veri çekebilmeli
- Hazır page’lere direkt girebilmeli
- UI geliştirmeye hemen başlayabilmeli
- API ile uğraşmamalı
