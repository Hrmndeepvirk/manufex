importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyCel152VrXzWOzcmQ_AnqLdo1IrXNVR_Iw",
  authDomain: "impact-zone-295e2.firebaseapp.com",
  projectId: "impact-zone-295e2",
  storageBucket: "impact-zone-295e2.firebasestorage.app",
  messagingSenderId: "645472928127",
  appId: "1:645472928127:web:dca335f5dc438802fd1a4a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((message) => {
  console.log("[firebase-messaging-sw.js] Received background message", message);
  const data = message.data;
  const notificationTitle = data.title;
  const notificationOptions = {
    body: data.body,
    icon: data.image || "/android-chrome-192x192.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
