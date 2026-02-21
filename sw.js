// sw.js — Service Worker do Cantinho Brasileiro
const CACHE_NAME = 'cantinho-v1';
const ASSETS_TO_CACHE = [
    '/index.html',
    '/style.css',
    '/app.js',
    '/supabaseClient.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap'
];

// Instala e faz cache dos assets estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch(() => {
                // Silencia erros de CORS em recursos externos
            });
        })
    );
    self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Estratégia: Network First, fallback para cache
self.addEventListener('fetch', (event) => {
    // Não intercepta chamadas ao Supabase (sempre online)
    if (event.request.url.includes('supabase.co')) return;

    event.respondWith(
        fetch(event.request)
            .then((res) => {
                // Atualiza cache com versão nova
                const resClone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
                return res;
            })
            .catch(() => caches.match(event.request))
    );
});

// Recebe notificações push
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'Cantinho Brasileiro', body: 'Novidade!' };
    event.waitUntil(
        self.registration.showNotification(data.title || 'Cantinho Brasileiro 🍕', {
            body: data.body,
            icon: 'https://media.bio.site/sites/79CC2018-24E6-48C4-A856-4C1E36908B60/AWwTtFWnmuqVysXARE2MRX.png',
            badge: 'https://media.bio.site/sites/79CC2018-24E6-48C4-A856-4C1E36908B60/AWwTtFWnmuqVysXARE2MRX.png',
            vibrate: [200, 100, 200],
            tag: 'pedido-update',
            renotify: true
        })
    );
});

// Click na notificação abre o app
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('/index.html');
        })
    );
});