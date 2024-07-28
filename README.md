# Todo App  -  Buradan Deneyin ==> https://todoapp-ob02ynfjo-adem-kocas-projects.vercel.app/

Bu proje, kullanıcıların görevlerini yönetmelerine olanak tanıyan bir Todo uygulamasıdır. Kullanıcılar görev ekleyebilir, güncelleyebilir, tamamlanmış görevleri görebilir ve görevleri silebilir. Ayrıca, kullanıcılar profil bilgilerini güncelleyebilir ve profil resmi olarak bir emoji seçebilirler.

## Özellikler

- **Kullanıcı Kimlik Doğrulama**: Kayıt olma, giriş yapma ve çıkış yapma.
- **Görev Yönetimi**: Görev ekleme, güncelleme, tamamlanmış ve tamamlanmamış görevleri görüntüleme, görev silme.
- **Profil Yönetimi**: Kullanıcı profilini güncelleme ve emoji seçimi.
- **Kategori ve Tarih Filtreleme**: Görevleri kategoriye göre filtreleme ve tarihe göre sıralama.
- **Responsive Tasarım**: Tüm sayfalar ve bileşenler mobil uyumlu.

## Teknolojiler

- **Next.js**: React tabanlı framework.
- **Firebase**: Kimlik doğrulama ve veritabanı yönetimi.
- **React Bootstrap**: UI bileşenleri için.
- **TypeScript**: JavaScript'in statik tipi.

## Kurulum

### 1. Depoyu Klonlayın

```bash
bashKodu kopyala
git clone https://github.com/kullaniciadi/todo-app.git
cd todo-app

```

### 2. Bağımlılıkları Yükleyin

```bash
bashKodu kopyala
npm install

```

### 3. Firebase Yapılandırması

Firebase projesini oluşturun ve yapılandırma bilgilerinizi `.env` dosyasına ekleyin. Örnek `.env` dosyası:

```
envKodu kopyala
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

```

### 4. Geliştirme Sunucusunu Başlatın

```bash
bashKodu kopyala
npm run dev

```

Tarayıcınızda http://localhost:3000 adresini açarak uygulamayı görüntüleyebilirsiniz.

## Kullanım

### Kimlik Doğrulama

- **Kayıt Ol**: Yeni kullanıcılar `Kayıt Ol` sayfasından kayıt olabilir.
- **Giriş Yap**: Kayıtlı kullanıcılar `Giriş Yap` sayfasından giriş yapabilir.
- **Çıkış Yap**: Giriş yapmış kullanıcılar `Çıkış Yap` butonuna tıklayarak çıkış yapabilir.

### Görev Yönetimi

- **Görev Ekleme**: Anasayfadaki formu kullanarak yeni bir görev ekleyin.
- **Görev Güncelleme**: Görevleri tamamlamak için `Tamamla` butonuna tıklayın.
- **Görev Silme**: Görevleri silmek için `Sil` butonuna tıklayın.
- **Tamamlanmamış Görevler**: Anasayfada tamamlanmamış görevleri görüntüleyin.
- **Tamamlanmış Görevler**: `Tamamlanmış` sekmesinde tamamlanmış görevleri görüntüleyin.
- **Kategori ve Tarih Filtreleme**: Görevleri kategoriye göre filtreleyin ve tarihe göre sıralayın.

### Profil Yönetimi

- **Profil Güncelleme**: Profil sayfasında kullanıcı adınızı ve e-postanızı güncelleyin.
- **Emoji Seçimi**: Profil sayfasında profil resmi olarak bir emoji seçin.

## Firestore Güvenlik Kuralları

Aşağıdaki kurallar, kullanıcıların kendi verilerine erişmesini ve yönetmesini sağlar:

```json
jsonKodu kopyala
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }
    match /todos/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}

```

## Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen bir `pull request` gönderin. Tüm katkılar memnuniyetle karşılanır.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.


