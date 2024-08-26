// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdpJv68dX9ZsaAu8qSsRLVzteLMB1hsWs",
  authDomain: "alter-f3ed6.firebaseapp.com",
  databaseURL: "https://alter-f3ed6-default-rtdb.firebaseio.com",
  projectId: "alter-f3ed6",
  storageBucket: "alter-f3ed6.appspot.com",
  messagingSenderId: "745212942732",
  appId: "1:745212942732:web:abfdbc7a13861e7fbd5ea9",
  measurementId: "G-99CD8ECVHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export {app, analytics, auth}