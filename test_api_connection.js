const fetch = require('node-fetch');
const mainUrl = 'https://agentic-rag-main-700341739468.us-central1.run.app/ask';
const edubrideUrl = 'https://agentic-rag-edubride-700341739468.us-central1.run.app/ask';

async function testUrl(url, name) {
    console.log(`Testing ${name}: ${url}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'Merhaba' })
        });

        console.log(`${name} Status: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log(`${name} Response:`, data);
        } else {
            console.log(`${name} Error Text:`, await response.text());
        }
    } catch (error) {
        console.error(`${name} Failed:`, error.message);
    }
}

async function run() {
    await testUrl(mainUrl, 'Main');
    await testUrl(edubrideUrl, 'Edubride');
}

run();
