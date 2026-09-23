// COREBIQ Firebase Authentication Configuration
// Firebase project: corebic--inspirego

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDShAm9FNnIj7sodlfzQF727pc9WhU-fc",
    authDomain: "corebic--inspirego.firebaseapp.com",
    projectId: "corebic--inspirego",
    storageBucket: "corebic--inspirego.firebasestorage.app",
    messagingSenderId: "1091888608027",
    appId: "1:1091888608027:web:6d4b56472871e3c48299be",
    measurementId: "G-FTT83137BO"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, auth, firebaseConfig };