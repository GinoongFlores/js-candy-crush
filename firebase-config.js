// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADTweJOUc2DVlwFknlKl0hslsyUZqha8Q",
  authDomain: "websys-candy-crush.firebaseapp.com",
  projectId: "websys-candy-crush",
  storageBucket: "websys-candy-crush.firebasestorage.app",
  messagingSenderId: "376307042246",
  appId: "1:376307042246:web:fe64c3b5094ebe2c1994c7",
  measurementId: "G-9S6QX6VD94",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Shared function to initialize user data
async function initializeUserData(user) {
  //   console.log("Initializing user data for:", user.email);
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // console.log("Creating new user document");
    await setDoc(userRef, {
      email: user.email,
      highestScore: 0,
    });
  } else {
    // console.log("User document exists:", userDoc.data());
  }
  return userDoc;
}

export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  googleProvider,
  signInWithPopup,
  initializeUserData,
};
