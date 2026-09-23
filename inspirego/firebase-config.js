// COREBIQ Firebase Configuration
// Firebase project: corebic--inspirego

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
// You MUST import Firestore so the dashboard can load data
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDShAm9FNnIj7sodlfzQFZ727pc9WhU-fc",
  authDomain: "corebic--inspirego.firebaseapp.com",
  projectId: "corebic--inspirego",
  storageBucket: "corebic--inspirego.firebasestorage.app",
  messagingSenderId: "1091888608027",
  appId: "1:1091888608027:web:6d4b56472871e3c48299be",
  measurementId: "G-FTT83137B0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Firestore Database (This was missing!)
const db = getFirestore(app);

// Export all so index.html and login.html can use them
export { app, auth, db, firebaseConfig };