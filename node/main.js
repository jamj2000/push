// Training tutorial:
// https://codelabs.developers.google.com/codelabs/pwa-integrating-push/index.html

// Ejecutar node  node/main.js para enviar una notificación.
// La página index.html (y js/main.js) NO deben estar abiertos, para que la notificación aparezca.
const webPush = require('web-push');

///// Cada vez que un usuario quite la subscripción y luego vuelva a SUSCRIBIRSE, debera ser actualizada esta constante.
const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/fQ1HJGhytoU:APA91bHZcpXAsOb8J5dTZ8tUCjSayVMgnW04ZtnzlBoQLcZx7OQbvTW2zapqUY9jOHDRV2ITCI2Trz0IvZg2B7NbjPFy2R75uFQeE7I8ZzfDPgr2opc9ph9nTgC1jkuKoyJ-e46GB-JG","expirationTime":null,"keys":{"p256dh":"BJgS8NIf793osghnWRcvmluznassNYj7Ny8-bGkPQSY4ohzwa-BjD3G7lWpZkGbjpZgkwyriQckNCJOWrR2GkZM","auth":"YkxByakK5yGftQBkU3ZWoA"}};

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
