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
async function sendMessage(question, agent) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: question, agent: agent })
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
// Bekleme animasyonunu ekle
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typing-indicator';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        typingDiv.appendChild(dot);
    }

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Bekleme animasyonunu kaldır
function removeTyping() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) typingDiv.remove();
}

// Form gönderildiğinde
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const question = userInput.value.trim();

    if (!question) return;

    // Kullanıcı mesajını ekle
    addMessage(question, 'user');
    userInput.value = '';

    // Bot yazıyor efekti
    const btn = document.getElementById('send-btn');
    btn.disabled = true;

    // "Yapay zeka düşünüyor..." göster
    showTyping();

    // URL'den ajanı al
    const urlParams = new URLSearchParams(window.location.search);
    const agent = urlParams.get('agent') || 'main';

    // Bot cevabını al
    const answer = await sendMessage(question, agent);

    // Animasyonu kaldır ve cevabı yaz
    removeTyping();
    addMessage(answer, 'bot');

    btn.disabled = false;
    userInput.focus();
});

// Sayfa yüklendiğinde başlığı güncelle
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const agent = urlParams.get('agent') || 'main';

    // Sidebar active state
    const links = document.querySelectorAll('.sidebar-menu a');
    links.forEach(link => link.classList.remove('active'));

    if (agent === 'edubride') {
        document.querySelector('a[href="/?agent=edubride"]')?.classList.add('active');
        document.querySelector('header .logo').textContent = 'Edubride Asistanı';
        document.title = 'Edubride Chat - Fatih AI';
        // Mesajı güncelle
        const welcomeMsg = document.querySelector('.message.bot .message-content');
        if (welcomeMsg) welcomeMsg.textContent = 'Merhaba! Edubride kaynaklarında arama yapabilirim. Sorularınızı bekliyorum.';
    } else if (agent === 'medek') {
        document.querySelector('a[href="/?agent=medek"]')?.classList.add('active');
        document.querySelector('header .logo').textContent = 'Medek Asistanı';
        document.title = 'Medek Chat';
        // Mesajı güncelle
        const welcomeMsg = document.querySelector('.message.bot .message-content');
        if (welcomeMsg) welcomeMsg.textContent = 'Merhaba! Medek kaynaklarında arama yapabilirim. Sorularınızı bekliyorum.';
    } else {
        document.querySelector('a[href="/?agent=main"]')?.classList.add('active');
        document.querySelector('header .logo').textContent = 'İstanbul Uni Asistanı';
        document.title = 'İstanbul Uni Chat';
        // Mesajı güncelle
        const welcomeMsg = document.querySelector('.message.bot .message-content');
        if (welcomeMsg) welcomeMsg.textContent = 'Merhaba! İstanbul Üniversitesi kaynaklarında arama yapabilirim. Sorularınızı bekliyorum.';
    }
});
