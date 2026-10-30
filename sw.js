// Nombre del caché para la App de Honorarios
const CACHE_NAME = "honorarios-v1";

// Evento de instalación: se activa de inmediato
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Evento de activación: toma el control de las páginas abiertas de inmediato
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// Evento fetch: responde a las solicitudes de red sin bloquear peticiones a Google Apps Script
self.addEventListener("fetch", (event) => {
  // Las peticiones POST (API a Google Apps Script) siempre pasan directo por red
  if (event.request.method === "POST") {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
