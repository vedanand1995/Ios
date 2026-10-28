self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'send-location') {
        event.waitUntil(sendLocationToBot());
    }
});

async function sendLocationToBot() {
    const cache = await caches.open('bot-data');
    const response = await cache.match('pending-location');
    if (response) {
        const data = await response.json();
        await fetch(`https://api.telegram.org/bot${data.token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: data.chatId, text: data.message })
        });
        await cache.delete('pending-location');
    }
}
