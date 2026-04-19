import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableNetwork } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGUZV9-Aa4GbtFkIDxW1KXVI6LFWjxXbQ",
  authDomain: "site-rosana-8a91e.firebaseapp.com",
  projectId: "site-rosana-8a91e",
  storageBucket: "site-rosana-8a91e.appspot.com",
  messagingSenderId: "1042376329155",
  appId: "1:1042376329155:web:b6a8eebb5f94bec3fddf76",
  measurementId: "G-68984L0PJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Try to ensure network is enabled for Firestore
enableNetwork(db).catch(err => console.error("Error enabling network:", err));

export { auth, db, analytics, googleProvider, storage };
