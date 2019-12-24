// Training tutorial:
// https://codelabs.developers.google.com/codelabs/pwa-integrating-push/index.html

// Ejecutar node  node/main.js para enviar una notificación.
// La página index.html (y js/main.js) NO deben estar abiertos, para que la notificación aparezca.
const webPush = require('web-push');

///// Cada vez que un usuario quite la subscripción y luego vuelva a SUSCRIBIRSE, debera ser actualizada esta constante.
const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/eJ4PTkZNvCk:APA91bEqRN564ZfzNL83hzyaDuJOXm0bPQudb5D_o5NQH06fQjyaaaUW8qGToXGOCplWX852eTaBGBJypHNzY1wwG7THNuQe63A_UNnAvqVo2ILmsIol3lCM4M_jC-3ve8o_L3G1xTVd","expirationTime":null,"keys":{"p256dh":"BGnc5oRfd9pcczwtfAkDFgPy5tKuiENhAlWt0VDsRXSbm8xCEsKPEuZX4bGK3E4DUUMDe7vUu7JodWbnbSKvRRA","auth":"OFVKFIu2ZPhOC3c5oqG8wQ"}};

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
