# Render Deployment Instructions

1.  Bu kodları GitHub deposuna gönderin:
    ```bash
    git add .
    git commit -m "Initial commit for Render deployment"
    git push origin main
    ```

2.  [Render.com](https://render.com) adresine gidin ve hesabınıza giriş yapın.
3.  "New" butonuna tıklayıp **Web Service** seçeneğini seçin.
4.  GitHub hesabınızı bağlayın ve `ac-k-chat-servisi` deposunu seçin.
5.  Ayarları şu şekilde yapın:
    *   **Name:** (İstediğiniz bir isim)
    *   **Region:** Frankfurt (Türkiye'ye en yakın) veya varsayılan.
    *   **Branch:** `main`
    *   **Root Directory:** (Boş bırakın)
    *   **Runtime:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
6.  "Create Web Service" butonuna tıklayın.

Render projenizi derleyip yayınlayacaktır. Size verilen URL üzerinden "Hello World!" yazısını görebilirsiniz.
