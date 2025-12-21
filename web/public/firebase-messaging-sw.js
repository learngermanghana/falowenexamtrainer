/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js"
);

let messaging = null;

function initializeMessaging(config) {
  if (!config || messaging || !config.apiKey) return;

  firebase.initializeApp(config);
  messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.notification || {};
    if (!title) return;

    self.registration.showNotification(title, {
      body: body || "Falowen Learning Hub update",
      icon: "/logo192.png",
    });
  });
}

self.addEventListener("message", (event) => {
  if (event?.data?.type === "INIT_FIREBASE") {
    initializeMessaging(event.data.payload);
  }
});
