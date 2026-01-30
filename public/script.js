const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('messages');

// Mesaj ekleme fonksiyonu
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = text;

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('message-time');
    const now = new Date();
    timeDiv.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    messagesContainer.appendChild(messageDiv);

    // En alta kaydır
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Backend'e istek atma fonksiyonu
async function sendMessage(question) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: question })
        });

        if (!response.ok) throw new Error('Sunucu hatası');

        const data = await response.json();
        return data.answer || "Üzgünüm, şu an cevap veremiyorum.";
    } catch (error) {
        console.error('Hata:', error);
        return "Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.";
    }
}

// Form gönderildiğinde
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const question = userInput.value.trim();
    if (!question) return;

    // Kullanıcı mesajını ekle
    addMessage(question, 'user');
    userInput.value = '';

    // Bot yazıyor efekti (opsiyonel basit hali)
    const btn = document.getElementById('send-btn');
    btn.disabled = true;

    // Bot cevabını al
    const answer = await sendMessage(question);

    // Bot mesajını ekle
    addMessage(answer, 'bot');

    btn.disabled = false;
    userInput.focus();
});
