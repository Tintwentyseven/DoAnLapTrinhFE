// Import the functions you need from the SDKs you need
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import 'firebase/compat/auth';
import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBJdkT_57OtCMhR75eHDhCxsuwYjM9WbZw",
    authDomain: "appchat-4fabb.firebaseapp.com",
    projectId: "appchat-4fabb",
    storageBucket: "appchat-4fabb.appspot.com",
    messagingSenderId: "587294163073",
    appId: "1:587294163073:web:80c282b393ec57e1fecd80",
    measurementId: "G-KELT5BRS1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export {auth}