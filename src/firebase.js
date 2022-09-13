import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoYhpaCH8evWHDflbOT87D3wLYQ_o0yfE",
  authDomain: "horse-chat-9d267.firebaseapp.com",
  projectId: "horse-chat-9d267",
  storageBucket: "horse-chat-9d267.appspot.com",
  messagingSenderId: "796505488602",
  appId: "1:796505488602:web:d9230018a8c3f41632f9e3",
  measurementId: "G-CR7PMC0WPJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { auth, storage, db };
