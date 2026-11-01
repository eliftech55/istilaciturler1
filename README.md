# 🌊 KARADENİZ'İN KORUYUCULARI – ZETA: İstilacı Tür Avcısı
### Kapsamlı Oyun Rehberi, Teknik Mimari ve Kullanım Kılavuzu

Bu belge; **"KARADENİZ'İN KORUYUCULARI – ZETA: İstilacı Tür Avcısı"** 2D eğitsel web oyununun hikayesini, pedagojik hedeflerini, 5 seviyelik oyun mekaniklerini, Firebase Cloud Firestore veritabanı şemasını, güvenlik kurallarını, alan adı yapılandırmasını ve GitHub entegrasyonunu eksiksiz olarak açıklamaktadır.

---

## 1. 📖 Oyun Hikâyesi ve Pedagojik Amaç

- **Hedef Kitle:** Ortaokul öğrencileri (Fen Bilimleri, Biyoloji ve Çevre Bilinci).
- **Ana Karakter:** **ZETA**, Karadeniz Araştırma Enstitüsü tarafından deniz ekosistemini korumak ve araştırmak üzere geliştirilmiş sevimli, mavi-beyaz bir araştırma robotudur.
- **Problem Durumu:** Uluslararası yük gemileri, açık denizlerde dengede kalabilmek için balast tanklarına su alırlar. Karadeniz limanlarına ulaştıklarında bu suları tahliye ettiklerinde, okyanuslardan ve uzak denizlerden gelen istilacı yabancı türler kapalı bir havza olan Karadeniz'e yayılır. Doğal avcıları bulunmadığı için hızla çoğalan bu istilacılar; yerli hamsi larvalarını, balık yumurtalarını ve yerel midye yataklarını tüketerek biyoçeşitliliği çökme noktasına getirir.
- **ZETA'nın Görevi:** Karadeniz'in 5 farklı derinlik bölgesinde bulunan istilacı yabancı türleri tespit etmek, deniz yosunlarından fotosentez enerjisi toplayarak güçlenmek, canlılara doğrudan dokunmadan özel enerji ağıyla onları yakalayıp güvenli araştırma merkezine aktarmaktır.

---

## 2. 🎮 5 Seviye ve İstilacı Türler Tablosu

Oyundaki tüm seviyeler, Karadeniz'de gerçekte tespit edilmiş bilimsel istilacı tür verileri ve matematiksel eşiklerle kurgulanmıştır:

| Seviye | Bilimsel Adı | Türkçe / Yaygın Adı | Hedef Sayı | Başlangıç Gücü | Yakalama Eşiği | Güç Sınırı | Temas Hasarı | Kökeni & Ekolojik Tehdidi |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | *Rapana venosa* | Deniz Salyangozu | 5 Adet | 100⚡ | 100⚡ | 200⚡ | -50⚡ | Pasifik / Japon Denizi kökenli. Yerel kara midye ve istiridye yataklarını delerek yok eder. |
| **2** | *Mnemiopsis leidyi* | Deniz Cevizi (Taraklısı) | 2 Adet | 300⚡ | 200⚡ | 400⚡ | -100⚡ | Kuzey Amerika Atlantik kıyılarından geldi. Hamsi larvalarını ve planktonları tüketerek 1989 hamsi krizine yol açtı. |
| **3** | *Mya arenaria* | Kum Midyesi | 3 Adet | 500⚡ | 300⚡ | 600⚡ | -150⚡ | Kuzey Atlantik kökenli. Dip zemin kumuna gömülerek yerel dip canlılarının yaşam alanını işgal eder. |
| **4** | *Anadara kagoshimensis* | Dikenli / Kanlı Midye | 4 Adet | 700⚡ | 400⚡ | 800⚡ | -200⚡ | Batı Pasifik kökenli. Oksijensiz sularda bile hızla çoğalarak yerel midyeleri rekabette eler. |
| **5** | *Liza haematocheila* | Rus Kefali (So-iuy) | 5 Adet | 900⚡ | 500⚡ | 1000⚡ | -250⚡ | Japon Denizi ve Amur Nehri kökenli. Yırtıcı ve çok hızlıdır; yerli balıkların besin zincirini tüketir. |

---

## 3. 🕹️ Oyun Mekanikleri ve Kontroller

### A. Temel Kurallar ve Puanlama
1. **🌿 Yosun Toplama (+25 Güç, +10 Puan):** ZETA deniz tabanındaki yeşil yosunlara temas ettiğinde veya **"YOSUN"** butonuna basıldığında bataryasını +25 güç ile doldurur. Her seviyenin maksimum **Güç Sınırı** vardır (Örn. 1. Seviyede en fazla 200 Güç). Ayrıca toplanan her yosun, ağın 60 saniyelik dolum süresini **3 saniye hızlandırır**.
2. **🎯 Özel Ağ Fırlatma (+100 Puan):** ZETA uzaktan bir enerji ağı fırlatır.
   - Robotun gücü canlının **Yakalama Eşiği** değerine eşit veya üzerindeyse canlı güvenli araştırma kapsülüne alınır (**+100 Puan**).
   - Robotun gücü yetersizse canlı ağı püskürtür.
   - Ağ hedefini ıskalarsa **-10 Puan** ceza uygulanır.
   - Ağın bekleme / yeniden dolum süresi **60 saniyedir** (HUD ekranında saniye geri sayımıyla gösterilir).
3. **⚠️ Doğrudan Temas Yasaktır:** İstilacı canlıya gövdeyle çarpmak yasaktır. Çarpma anında canlı türüne göre **-50⚡ ile -250⚡** arasında elektrik hasarı alınır ve ZETA geri itilir. Robotun gücü 0'a düşerse **Oyun Biter (Game Over)**.
4. **🧠 Akıllı Canlı Yapay Zekâsı (AI):**
   - ZETA'nın gücü canlıdan yüksekse: Canlı ZETA'dan korkarak kaçar.
   - ZETA'nın gücü canlıdan düşükse: Güçlü istilacı ZETA'yı takip edip kovalar.
5. **🐟 Bonus Yerli Türler (+50 Puan):** Karadeniz'in yerli kırmızı **Barbun Balığı** su içinde yüzer. Ona dokunup tarama yapıldığında yerli tür korunduğu için **+50 Bonus Puan** kazanılır.
6. **🏆 Seviye Tamamlama (+200 Puan):** Seviyedeki tüm istilacılar yakalandığında sonraki seviyenin brifingine geçilir.

### B. Mobil ve Bilgisayar Kontrolleri
- **📱 Android / Mobil Ekran:**
  - **Sol Taraf:** 360 derece hareket sağlayan yumuşak analog Sanal Joystick.
  - **Sağ Taraf:** Büyük dokunmatik butonlar:
    - **AĞ AT:** Geri sayım göstergeli birincil aksiyon butonu.
    - **YOSUN:** Yosun toplama ve şarj butonu (+25⚡).
    - **DURAKLAT:** Oyunu beklemeye alma / devam ettirme.
- **⌨️ Bilgisayar / Klavye:**
  - **W, A, S, D** veya **Yön Tuşları:** ZETA'yı yüzdürme.
  - **Boşluk (Space):** Ağ Fırlatma.
  - **E Tuşu:** Yosun Toplama.
  - **P / Esc:** Duraklatma.

---

## 4. 🔥 Firebase ve Cloud Firestore Veritabanı Mimarisi

Oyun, oyuncu kayıtlarını, skorları, kilitleri ve küresel liderlik tablosunu Google Cloud altyapısındaki **Firebase Cloud Firestore** ve **Firebase Authentication** üzerinde kalıcı olarak tutar.

### A. Proje Kimlik Bilgileri
- **Firebase Proje ID:** `winter-ring-kxtlg`
- **Firestore Veritabanı ID:** `ai-studio-karadenizinkoruy-53e4fc8b-7ea9-4613-8678-3fb9615c75cb`
- **Firestore Bölgesi:** Otomatik bulut yapılandırması (Enterprise Firestore).

### B. Firestore Veritabanı Koleksiyonları ve Tutulan Bilgiler

#### 1. `/users/{userId}` (Oyuncu Profilleri)
Her oyuncunun kişisel ilerlemesini saklar.
```json
{
  "uid": "kullanici_benzersiz_id",
  "displayName": "Ahmet - Deniz Koruyucusu",
  "email": "ogrenci@gmail.com",
  "isAnonymous": false,
  "highScore": 850,
  "levelsUnlocked": 3,
  "totalInvasivesCaptured": 10,
  "createdAt": "2026-11-01T12:00:00.000Z",
  "updatedAt": "2026-11-01T12:15:00.000Z"
}
```

#### 2. `/leaderboard/{entryId}` (Canlı Liderlik Tablosu)
Tüm oyuncuların canlı olarak yarıştığı Top 15 sıralama tablosudur.
```json
{
  "id": "kullanici_id",
  "userId": "kullanici_id",
  "displayName": "ZETA Avcısı 55",
  "score": 1450,
  "levelReached": 5,
  "capturedTotal": 19,
  "updatedAt": "2026-11-01T12:15:00.000Z"
}
```

#### 3. `/users/{userId}/game_records/{recordId}` (Seviye Geçmişi)
Oyuncunun her tamamladığı oyun oturumunun detaylı analitiğini tutar.
```json
{
  "id": "kayit_id",
  "userId": "kullanici_id",
  "levelNumber": 1,
  "score": 350,
  "capturedCount": 5,
  "completed": true,
  "completedAt": "2026-11-01T12:05:00.000Z"
}
```

### C. Güvenlik Kuralları (`firestore.rules`)
- **Varsayılan Engel (Default-Deny):** İzin verilmeyen tüm yollar kapalıdır.
- **Yetki Kontrolü (Ownership):** Hiçbir kullanıcı başka bir oyuncunun profilini, oyun kaydını veya skorunu değiştiremez (`request.auth.uid == userId`).
- **Liderlik Tablosu Okuma:** Tüm oyuncular sıralamayı şeffaf biçimde anlık görebilir (`allow read: if true`).
- **Veri Tipi ve Boyut Güvenliği:** İsimler maksimum 64 karakterle sınırlandırılmıştır, negatif skorlar engellenmiştir.

### D. Kimlik Doğrulama (Auth)
- 🌐 **Google ile Giriş Yap:** Tek tıkla hesap bağlama (`signInWithPopup`).
- 👤 **Misafir Oyuncu Girişi:** E-posta vermeden takma ad belirleyerek hemen oynama (`signInAnonymously`).

---

## 5. 🌐 Alan Adları ve Yayınlama (Hosting)

### A. Doğrudan Çalışan Canlı Oyun Adresi (Önerilen)
Uygulama Google Cloud Run üzerinde 7/24 kesintisiz çalışmaktadır:
🔗 **Canlı Oyun:** `https://ais-pre-itjw37gwijw7ot2wyvf7ao-991064983469.europe-west2.run.app`  
*(Bu adres mobil tarayıcılarla %100 uyumludur, indirme veya kurulum gerektirmez).*

### B. Firebase Hosting Ücretsiz Alt Alan Adları
Projenize tahsis edilen ücretsiz Firebase adresleri:
- `https://winter-ring-kxtlg.web.app`
- `https://winter-ring-kxtlg.firebaseapp.com`

### C. Özel Alan Adı (.com, .com.tr vb.) Bağlama
1. Herhangi bir alan adı sağlayıcısından (Google Domains, Namecheap, Natro vb.) alan adınızı satın alın.
2. [console.firebase.google.com](https://console.firebase.google.com) adresinde `winter-ring-kxtlg` projesini açın.
3. **Hosting** ➔ **Özel Alan Adı Ekle** butonuna dokunun.
4. Firebase'in verdiği **A Kayıtlarını (IP Adresi)** alan adı panelinize ekleyin. Ücretsiz SSL sertifikası otomatik olarak aktifleşir.

---

## 6. 🐙 GitHub Deposu ve Dosya Yapısı

Proje dosyaları yerel Git üzerinde `main` dalında commit edilmiştir.

### Proje Dosya Ağacı:
```
├── firebase-applet-config.json    # Firebase API anahtarları ve veritabanı ID
├── firebase-blueprint.json        # Firestore koleksiyon ve veri şeması (IR)
├── firebase.json                  # Firebase Hosting ve kurallar yapılandırması
├── firestore.rules                # Güvenlik ve rol doğrulama kuralları
├── index.html                     # HTML5 mobil uyumlu giriş noktası
├── package.json                   # React 19, Tailwind v4, Firebase bağımlılıkları
├── public/
│   ├── karadeniz-koruyuculari-tek-dosya.html  # Tek dosya çevrimdışı sürüm
│   └── karadeniz-koruyuculari-zeta.zip        # Tüm projenin tek tıkla indirilebilir ZIP paketi
├── src/
│   ├── App.tsx                    # Ana oyun koordinatörü ve HUD
│   ├── components/
│   │   ├── GameCanvas.tsx         # 60 FPS HTML5 Canvas fizik ve render motoru
│   │   ├── VirtualControls.tsx    # Mobil sanal joystick ve dokunmatik tuşlar
│   │   ├── HowToPlayModal.tsx     # "Oyun Nasıl Oynanır?" kurallar modalı
│   │   ├── LevelBriefingModal.tsx # Seviye başı istilacı tür brifingi
│   │   ├── LeaderboardModal.tsx   # Canlı Cloud Firestore liderlik tablosu ve giriş
│   │   ├── SpeciesGuideModal.tsx  # 5 İstilacı türün saha rehberi
│   │   ├── SingleFileExportModal.tsx # Tek dosya HTML kopyalama modalı
│   │   └── GitHubExportModal.tsx  # Telefondan GitHub'a aktarma rehberi
│   ├── data/
│   │   └── gameData.ts            # 5 seviyenin parametreleri ve 3 soruluk eğitici test
│   ├── services/
│   │   └── firebase.ts            # Firestore CRUD, Auth ve skor kayıt servisleri
│   ├── utils/
│   │   ├── audio.ts               # Web Audio API prosedürel ses sentezleyicisi
│   │   └── transparentSprites.ts  # %100 şeffaf alfa kanallı canlı çizim motoru
│   └── types/
│       └── game.ts                # TypeScript veri modelleri
```

### Telefondan GitHub'a Aktarma Yöntemleri:
1. **AI Studio Üzerinden:** Ekranın sağ üstündeki **(⋮)** menüsünden **"Export to GitHub"** seçeneğini kullanın.
2. **ZIP Olarak Yükleme:** Oyunun sağ üstündeki **GitHub (🐙)** butonundan `karadeniz-koruyuculari-zeta.zip` dosyasını telefonunuza indirin; [github.com/new](https://github.com/new) adresinden yeni repo açıp yükleyin.
3. **Terminal Üzerinden Git Push:**
   ```bash
   git remote add origin https://github.com/KULLANICI_ADINIZ/karadeniz-koruyuculari-zeta.git
   git branch -M main
   git push -u origin main
   ```

---

## 7. 📱 Android Telefon İçin Çevrimdışı (İnternetsiz) Kullanım

Eğer internet bağlantınızın olmadığı bir ortamda (örneğin okul gezisinde veya teknede) oynamak isterseniz:
1. Oyunun sağ üstündeki **📱 Telefon** simgesine dokunun.
2. **"HTML Dosyasını İndir"** butonuna dokunun (`karadeniz_koruyuculari_zeta.html`).
3. İndirilen dosyayı telefonunuzun **Dosyalarım** uygulamasından açarak Chrome ile **sıfır internetle** 60 FPS akıcılıkta oynayabilirsiniz.

---
*Hazırlayan: Karadeniz Araştırma Enstitüsü & ZETA Geliştirme Ekibi*
