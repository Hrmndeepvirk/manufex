import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage as onMessageFirebase } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;

const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const messaging = app ? getMessaging(app) : null;

export const onMessage = (messagingInstance, callback) => {
  if (!messagingInstance) return () => {};
  return onMessageFirebase(messagingInstance, callback);
};

export const generateToken = async () => {
  if (!messaging) return;
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      localStorage.setItem("fcm", token);
      return token;
    }
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
