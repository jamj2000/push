

// NOTIFICATIONCLOSE
self.addEventListener('notificationclose', event => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;

    console.log('Notificación cerrada: ' + primaryKey);
    console.log(event.notification.data);
});


// NOTIFICATIONCLICK
self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const action = event.action;

    if (action === 'close') {
        notification.close();
    } else {
        event.waitUntil(
            clients.matchAll().then(clis => {
                const client = clis.find(c => {
                    return c.visibilityState === 'visible';
                });
                if (client !== undefined) {
                    client.navigate('index.html');
                    client.focus();
                } else {
                    // No hay ventana abierta. Abrimos una.
                    clients.openWindow('index.html');
                    notification.close();
                }
            })
        );
    }

    // Cerrar todas las notificaciones cuando se haga click en una 
    self.registration.getNotifications().then(notifications => {
        notifications.forEach(notification => {
            notification.close();
        });
    });

});

// PUSH
self.addEventListener('push', event => {
    let body;

    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Contenido de la notificación';
    }

    const options = {
        body: body,
        icon: 'images/notification-flat.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore', title: 'Ir a sitio web',
                icon: 'images/checkmark.png'
            },
            {
                action: 'close', title: 'Cerrar la notificación',
                icon: 'images/xmark.png'
            },
        ]
    };

    event.waitUntil(
        clients.matchAll().then(c => {
            console.log(c);
            if (c.length === 0) {
                // Mostrar notificación
                self.registration.showNotification('Notificación desde el Backend', options);
            } else {
                // Send a message to the page to update the UI
                console.log('¡La applicación está ya abierta!   No haremos nada.');
                self.registration.showNotification();
                
            }
        })
    );
});


////// https://github.com/mozilla/serviceworker-cookbook/tree/master/push-subscription-management

// Listen to  `pushsubscriptionchange` event which is fired when
// subscription expires. Subscribe again and register the new subscription
// in the server by sending a POST request with endpoint. Real world
// application would probably use also user identification.
self.addEventListener('pushsubscriptionchange', function(event) {
    console.log('Subscription expired');
    event.waitUntil(
      self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .then(function(subscription) {
        console.log('Suscrito después de vencimiento', subscription.endpoint);
        return fetch('register', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      })
    );
  });