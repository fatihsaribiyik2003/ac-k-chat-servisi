# Sados Chat Servisi ve Log Paneli

Bu proje, Sados AI için bir chat proxy servisi ve cevaplanamayan soruları loglayan bir panel içerir.

## Özellikler

*   **Chat Proxy:** `/chat` endpoint'i üzerinden soruları yapay zeka servisine iletir.
*   **Loglama:** `/api/unanswered` endpoint'i ile cevaplanamayan soruları **Firestore** veritabanına kaydeder.
*   **Panel:** `/panel.html` adresinde kaydedilen soruları listeleyen bir yönetim paneli bulunur.

## Kurulum ve Çalıştırma

1.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
2.  **ÖNEMLİ:** `serviceAccountKey.json` dosyanızın proje ana dizininde olduğundan emin olun. (Bu dosya Firebase konsolundan indirilir).
3.  Sunucuyu başlatın:
    ```bash
    npm start
    ```
4.  Tarayıcıda test edin:
    *   Chat: `http://localhost:3000`
    *   Panel: `http://localhost:3000/panel.html`

## Google Cloud Run Dağıtımı (Deployment)

Bu projeyi Cloud Run'a yüklemek için şu adımları izleyin:

**ÖNEMLİ UYARI:** Projenin çalışması için `serviceAccountKey.json` dosyasının da Cloud Run'a yüklenmesi gerekir.

### Yöntem 1: Kaynak Koddan Doğrudan Yükleme (Önerilen)

Eğer kodunuz bilgisayarınızda hazırsa ve `gcloud` CLI yüklüyse:

1.  Terminalde proje klasörüne gidin.
2.  Şu komutu çalıştırın:
    ```bash
    gcloud run deploy --source .
    ```
3.  Servis ismini (örneğin `ac-k-chat-servisi`) onaylayın.
4.  Bölgeyi seçin (örneğin `europe-west3`).
5.  "Allow unauthenticated invocations?" sorusuna `y` (evet) diyerek herkesin erişimine açın.

Bu yöntem, klasördeki `serviceAccountKey.json` dahil tüm dosyaları güvenli bir şekilde Cloud Build'e yükler ve oradan container oluşturur.

### Yöntem 2: GitHub Entegrasyonu ile

Eğer GitHub üzerinden otomatik deploy yapıyorsanız:
*   `serviceAccountKey.json` dosyasını GitHub deposuna atmanız gerekir **ANCAK BU GÜVENLİK RİSKİ OLUŞTURUR**.
*   Daha güvenli yöntem: Dosya içeriğini Google Cloud Secret Manager'a koymak ve uygulama içinden oradan okumaktır.
*   Hızlı çözüm için: Repo gizliyse (Private) dosyayı repoya atabilirsiniz. Repo herkese açıksa (Public) **KESİNLİKLE ATMAYIN**.

## API Kullanımı

### Cevaplanamayan Soru Ekleme (POST)

WhatsApp botunuzdan bu adrese istek atın:

*   **URL:** `https://SENIN-CLOUD-RUN-ADRESIN.run.app/api/unanswered`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "phoneNumber": "905551234567",
      "userMessage": "Fiyatlarınız nedir?",
      "botMessage": "Üzgünüm, anlayamadım."
    }
    ```
