// Import the functions you need from the SDKs you need
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import 'firebase/compat/auth';
import {initializeApp} from 'firebase/app'
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB3sY4q9TgbxhsDLw1ottcpQiVmbrzYzl8",
    authDomain: "appchatfe.firebaseapp.com",
    databaseURL: "https://appchatfe-default-rtdb.firebaseio.com",
    projectId: "appchatfe",
    storageBucket: "appchatfe.appspot.com",
    messagingSenderId: "818256455821",
    appId: "1:818256455821:web:3316083cca4fba96ab1ac4",
    measurementId: "G-YCV6M50X24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const  db = getFirestore();
const storage = getStorage();

export {auth,db,storage,provider};
