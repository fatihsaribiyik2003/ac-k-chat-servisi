const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Firebase Admin SDK'yı başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3000;

// JSON body parser
app.use(express.json());

// Public klasörünü statik olarak sun
app.use(express.static('public'));

// Chat Proxy Endpoint
app.post('/chat', async (req, res) => {
  try {
    const { question } = req.body;

    // External servise istek at
    const response = await fetch('https://agentic-rag-service-700341739468.us-central1.run.app/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Yanıtı:', data); // Log başarısını gör
    res.json(data);

  } catch (error) {
    console.error('Proxy Hatası Detay:', error.message);
    if (error.cause) console.error('Hata Nedeni:', error.cause);

    res.status(500).json({
      answer: "Üzgünüm, sistemde bir hata oluştu. Lütfen bağlantınızı kontrol edin veya daha sonra tekrar deneyin."
    });
  }
});

// Cevaplanamayan Soruları Kaydet (POST)
app.post('/api/unanswered', async (req, res) => {
  try {
    const { phoneNumber, userMessage, botMessage } = req.body;

    const logEntry = {
      phoneNumber,
      userMessage,
      botMessage,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('unanswered_logs').add(logEntry);
    res.status(201).json({ message: 'Log kaydedildi' });

  } catch (error) {
    console.error('Loglama Hatası:', error);
    res.status(500).json({ error: 'Log kaydedilemedi' });
  }
});

// Cevaplanamayan Soruları Getir (GET)
app.get('/api/unanswered', async (req, res) => {
  try {
    const snapshot = await db.collection('unanswered_logs')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const logs = [];
    snapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });

    res.json(logs);

  } catch (error) {
    console.error('Log Çekme Hatası:', error);
    res.status(500).json({ error: 'Loglar çekilemedi' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
