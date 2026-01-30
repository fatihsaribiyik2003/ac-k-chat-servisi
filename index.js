const express = require('express');
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
