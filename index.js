const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('./serviceAccountKey.json');
const fetch = require('node-fetch'); // node-fetch ekleniyor

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

// Panel Rotası (Temiz URL)
app.get('/panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'panel.html'));
});

// Manuel Ekleme Rotası
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

// Gizli Log Sayfası
app.get('/gizli-logs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'secret_logs.html'));
});

// Chat Proxy Endpoint
app.post('/chat', async (req, res) => {
  try {
    const { question, agent } = req.body;

    // Ajan seçimine göre URL belirle
    let apiUrl = 'https://agentic-rag-main-700341739468.us-central1.run.app/ask'; // Varsayılan: Ana Proje

    if (agent === 'edubride') {
      apiUrl = 'https://agentic-rag-edubride-700341739468.us-central1.run.app/ask';
    } else if (agent === 'medek') {
      apiUrl = 'https://agentic-rag-medek-700341739468.us-central1.run.app/ask';
    }

    // External servise istek at
    const response = await fetch(apiUrl, {
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

    // Loglama işlemi (Tüm konuşmalar)
    try {
      await db.collection('all_chat_logs').add({
        agent: agent || 'main',
        userMessage: question,
        botMessage: data.answer,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (logError) {
      console.error('Chat loglama hatası:', logError);
      // Loglama hatası chat akışını bozmamalı
    }

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



// Tüm Logları Getir (Gizli - GET)
app.get('/api/all-logs', async (req, res) => {
  try {
    const snapshot = await db.collection('all_chat_logs')
      .orderBy('timestamp', 'desc')
      .limit(100) // Son 100 kayıt
      .get();

    const logs = [];
    snapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });

    res.json(logs);

  } catch (error) {
    console.error('Tam Log Çekme Hatası:', error);
    res.status(500).json({ error: 'Loglar çekilemedi' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Chat: http://localhost:${port}`);
  console.log(`Panel: http://localhost:${port}/panel`);
  console.log(`Ekle: http://localhost:${port}/add`);
  console.log(`Gizli Loglar: http://localhost:${port}/gizli-logs`);
});
