import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDX-Ci-DAD3mUCgPhMLgo2zSbw9_Ielz0U",
  authDomain: "selekcijakandidata.firebaseapp.com",
  projectId: "selekcijakandidata",
  storageBucket: "selekcijakandidata.firebasestorage.app",
  messagingSenderId: "31475400282",
  appId: "1:31475400282:web:aeee5b291f72f52b916263",
  measurementId: "G-6XYWMRN10Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
