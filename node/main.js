// Training tutorial:
// https://codelabs.developers.google.com/codelabs/pwa-integrating-push/index.html

// Ejecutar node  node/main.js para enviar una notificación.
// La página index.html (y js/main.js) NO deben estar abiertos, para que la notificación aparezca.
const webPush = require('web-push');

///// Cada vez que un usuario quite la subscripción y luego vuelva a SUSCRIBIRSE, debera ser actualizada esta constante.
const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/fqsqH_42Zu8:APA91bHLmI5VNUgELuKfgLRusGesGAyWZRL5LgEa3ExyFuZrob0eg7PPMUmzr_qHYtCjxjWeEhirUoCeDuIeLMhbui7P05QAUPU9WiBRKusn2pdYjjZDjGshUki5dG4PQJgRqlYmqO3M","expirationTime":null,"keys":{"p256dh":"BAiSADJvMbVy_gtS8km8NNzWvIA3-suGoxOf-Oqh0kv_HayxCl27a7ucHlGlFU5f7gNpJSrrsrmqMuHHhXc7va4","auth":"hlnLgr8Ee3A3tByuPDRKpA"}};

// Para generar VAPID keys ejecutar en un terminal de texto:
//    npx  web-push  generate-vapid-keys
const vapidPublicKey = 'BOtI2d9Ua0KWC0wyPj6VzLYFN5Ai1W7j0Ox9C19YQXgnCPn22St1204I1plBdt8pZE2-SaD-y1e59juNx9icigk';
const vapidPrivateKey = '3K4JJxctagCITK-EYf7qP0RBs2nqKp4O2rx2rAIjEco';

const payload = 'Notificación correcta';

const options = {
  TTL: 60,
  vapidDetails: {
    subject: 'mailto: jamj2000@gmail.com',
    publicKey: vapidPublicKey,
    privateKey: vapidPrivateKey
  }
};


webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
