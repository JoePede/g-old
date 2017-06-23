// from https://github.com/GoogleChrome/samples/blob/gh-pages/push-messaging-and-notifications/service-worker.js
/* eslint-disable comma-dangle */

self.addEventListener('push', (event) => {
  console.info('Received a push message', event.data.text());

  const title = 'NEW proposal on GOLD';
  const body = event.data.text();
  const icon = '/tile.png';
  const tag = 'proposal';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      tag,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  console.info('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    /* eslint-disable */
    clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
      /* eslint-enable */
  );
});
