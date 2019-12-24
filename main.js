const app = (() => {
  'use strict';

  let isSubscribed = false;
  let swRegistration = null;

  const notifyButton = document.querySelector('.js-notify-btn');
  const pushButton = document.querySelector('.js-push-btn');

  // Comprobar el soporte para notificaciones
  if (!('Notification' in window)) {
    console.log('¡ Este navegador no soporta notificaciones !');
    return;
  }

  // Mostrar estado de las notificaciones
  Notification.requestPermission(status => {
    console.log('Permiso de notificación:', status);
  });

  // Mostrar una notificación
  function displayNotification() {

    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(reg => {

        // Opciones de la notificación
        const options = {
          body: 'Notificación correcta.',
          icon: 'images/ok.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },

          // Añadimos acciones a la notificación
          actions: [
            {
              action: 'explore', title: 'Ir al sitio web',
              icon: 'images/checkmark.png'
            },
            {
              action: 'close', title: 'Cerrar',
              icon: 'images/xmark.png'
            },
          ] //,
          // Añadimos tag a la notificación
          // tag: 'id1'          
        };
        reg.showNotification('Notificación desde el Frontend', options);
      });
    }

  }

  function initializeUI() {

    // Click sobre botón de suscribir o no
    pushButton.addEventListener('click', () => {
      pushButton.disabled = true;
      if (isSubscribed) {
        unsubscribeUser();
      } else {
        subscribeUser();
      }
    });

    swRegistration.pushManager.getSubscription()
      .then(subscription => {
        isSubscribed = (subscription !== null);
        updateSubscriptionOnServer(subscription);
        if (isSubscribed) {
          console.log('Estás suscrito.');
        } else {
          console.log('NO estás suscrito.');
        }
        updateBtn();
      });

  }

  // VAPID public key
  const applicationServerPublicKey = 'BOtI2d9Ua0KWC0wyPj6VzLYFN5Ai1W7j0Ox9C19YQXgnCPn22St1204I1plBdt8pZE2-SaD-y1e59juNx9icigk';

  // Subscribir a servicio push
  function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(subscription => {
      console.log('Estás suscrito:', subscription);
      updateSubscriptionOnServer(subscription);
      isSubscribed = true;
      updateBtn();
    })
    .catch(err => {
      if (Notification.permission === 'denied') {
        console.warn('Se denegó el permiso para notificaciones');
      } else {
        console.error('Fallo en la subscripción: ', err);
      }
      updateBtn();
    });

  }

  // Quitar suscripción de servicio push
  function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
      .then(subscription => {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch(err => {
        console.log('Error al quitar subscripción', err);
      })
      .then(() => {
        updateSubscriptionOnServer(null);
        console.log('Ya no estás suscrito');
        isSubscribed = false;
        updateBtn();
      });

  }

  function updateSubscriptionOnServer(subscription) {
    // Aquí es donde enviarías la suscripción al servidor de aplicaciones

    const subscriptionJson = document.querySelector('.js-subscription-json');
    const endpointURL = document.querySelector('.js-endpoint-url');
    const subAndEndpoint = document.querySelector('.js-sub-endpoint');

    if (subscription) {
      subscriptionJson.textContent = JSON.stringify(subscription);
      endpointURL.textContent = subscription.endpoint;
      subAndEndpoint.style.display = 'block';
    } else {
      subAndEndpoint.style.display = 'none';
    }
  }

  function updateBtn() {
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Notificaciones Push bloqueadas';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
      return;
    }
    if (isSubscribed) {
      pushButton.textContent = 'Desactivar Notificaciones Push';
    } else {
      pushButton.textContent = 'Activar Notificaciones Push';
    }

    pushButton.disabled = false;
  }

  // 
  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }


  notifyButton.addEventListener('click', () => {
    displayNotification();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('Service Worker y Push están soportados');

      navigator.serviceWorker.register('sw.js')
        .then(swReg => {
          console.log('Service Worker está registrado', swReg);

          swRegistration = swReg;

          // Inicializamos UI
          initializeUI();
        })
        .catch(err => {
          console.error('Service Worker Error', err);
        });
    });
  } else {
    console.warn('Mensajes Push no están soportados');
    pushButton.textContent = 'Push No Soportado';
  }

})();
