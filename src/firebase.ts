import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxZVpe5O2CKhmCD9Ob4e78M27l-LwbqmI",
  authDomain: "smash-rank-app-52c1e.firebaseapp.com",
  projectId: "smash-rank-app-52c1e",
  storageBucket: "smash-rank-app-52c1e.appspot.com",
  messagingSenderId: "49555915234",
  appId: "1:49555915234:web:7b925847f5eb8b98edb9bb",
  measurementId: "G-ZY8ER3CZBB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);