'use strict';

addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    console.log(JSON.parse(event.data.text()));

    var notification = JSON.parse(event.data.text());

    const options = {
        body: notification.body,
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    }

    event.waitUntil(self.registration.showNotification(notification.title, options));
});

addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click received');

    event.notification.close();

    event.waitUntil(
        clients.openWindow("https://developers.google.com/web/")
    )
})
