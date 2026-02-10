const fetch = require('node-fetch'); // Eğer node-fetch yoksa 'axios' veya yerel 'fetch' (Node 18+) kullanılabilir.

// Node.js 18+ için yerel fetch kullanılır, yoksa uyarı verir.
if (!globalThis.fetch) {
    console.error("Bu scripti çalıştırmak için Node.js 18 veya üzeri gereklidir (veya node-fetch paketi).");
    process.exit(1);
}

async function testLog() {
    try {
        console.log("Test logu gönderiliyor...");

        const response = await fetch('http://localhost:3000/api/unanswered', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: '905551234567',
                userMessage: 'Test: Fiyatlarınız nedir?',
                botMessage: 'Cevap verilemedi (Test)'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("BAŞARILI! Sunucu yanıtı:", data);
            console.log("Şimdi http://localhost:3000/panel.html adresine gidip tabloyu kontrol edin.");
        } else {
            console.error("HATA! Sunucu hatası:", response.status, response.statusText);
            const text = await response.text();
            console.error("Detay:", text);
        }

    } catch (error) {
        console.error("BAĞLANTI HATASI:", error.message);
        console.log("Sunucunun (npm start) çalıştığından emin olun.");
    }
}

testLog();
