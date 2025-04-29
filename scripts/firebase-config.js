import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCJ9vaClojHn_IIY2YC8XOBlY7JtHmt5vM",
    authDomain: "check-e4504.firebaseapp.com",
    databaseURL: "https://check-e4504-default-rtdb.firebaseio.com",
    projectId: "check-e4504",
    storageBucket: "check-e4504.appspot.com",  // ✅ Fixed storageBucket
    messagingSenderId: "753492063096",
    appId: "1:753492063096:web:e499ee4f211f8f9f82ce8d",
    measurementId: "G-5TRQEHS5WM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
