// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfCcPl-Azyifng8cWiVQVXw7NoCB88oN8",
  authDomain: "pet-care-app-9c672.firebaseapp.com",
  projectId: "pet-care-app-9c672",
  storageBucket: "pet-care-app-9c672.firebasestorage.app",
  messagingSenderId: "588882894968",
  appId: "1:588882894968:web:86fae3533d240abc664d8d",
  measurementId: "G-LN9XVKMNFX"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const messaging = getMessaging(app);
 const db = getFirestore(app);

export { app, messaging ,db};