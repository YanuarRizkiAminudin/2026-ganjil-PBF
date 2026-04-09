import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAQT4Myv772vxRRaUfZXWhgYW_ETVR2d8c",
  authDomain: "framework-next-20ef7.firebaseapp.com",
  projectId: "framework-next-20ef7",
  storageBucket: "framework-next-20ef7.firebasestorage.app",
  messagingSenderId: "829137568511",
  appId: "1:829137568511:web:9f69126c18ac0b7323c2ca"
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export default app;