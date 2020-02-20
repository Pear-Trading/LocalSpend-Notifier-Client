self.addEventListener('push', event => {
	console.log('[Service Worker] Push received');
	console.log('[Service Worker] Push data:', event.data.text());

	const data = JSON.parse(event.data.text());
	console.log('[Service Worker] Parsed push data:', data);

	const title = `ESTA - ${data.sellerName}`,
		options = {
			body: data.description,
			icon: './images/ESTA-transparent.png',
			badge: './images/ESTA-transparent.png',
			data: {
				url: data.url
			}
		};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
	console.log('[Service Worker] Notification clicked');
	console.log('[Service Worker] Notification event:', event);
	event.notification.close();
	event.waitUntil(
		clients.openWindow(event.notification.data.url)
	);
});