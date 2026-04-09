import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkudX7Hk-jlsAA4V7KArlnvu88B6lEYek",
  authDomain: "badr-store-8360c.firebaseapp.com",
  projectId: "badr-store-8360c",
  storageBucket: "badr-store-8360c.firebasestorage.app",
  messagingSenderId: "59012637023",
  appId: "1:59012637023:web:eb8a8639037cffb8d596ea"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

