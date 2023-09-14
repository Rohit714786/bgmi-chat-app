// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDz5lz4FfqU2RKnoQ39QBE1xiO19T19Pg",
  authDomain: "react-chat-app-15070.firebaseapp.com",
  projectId: "react-chat-app-15070",
  storageBucket: "react-chat-app-15070.appspot.com",
  messagingSenderId: "442214239146",
  appId: "1:442214239146:web:d0a4d0d1b8c2eb2533b9d3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
