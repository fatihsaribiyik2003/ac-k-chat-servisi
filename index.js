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
    res.json(data);

  } catch (error) {
    console.error('Proxy hatası:', error);
    res.status(500).json({ error: 'İşlem sırasında bir hata oluştu.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
