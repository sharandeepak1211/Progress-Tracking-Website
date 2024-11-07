// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyA2s8lZRLPIFyK_3E2CdZdCvK6LrZemldw",
	authDomain: "progress-tracker-febcd.firebaseapp.com",
	projectId: "progress-tracker-febcd",
	storageBucket: "progress-tracker-febcd.firebasestorage.app",
	messagingSenderId: "574224387858",
	appId: "1:574224387858:web:5f60b8ffe10e8c3015edcb",
	measurementId: "G-RL24M64LVJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
