import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBogczGVlTZoU89rHjGqJtaWtGYnvWU0gQ',
  authDomain: 'audio-app-1234.firebaseapp.com',
  projectId: 'audio-app-1234',
  storageBucket: 'audio-app-1234.appspot.com',
  messagingSenderId: '459668403662',
  appId: '1:459668403662:web:ea1ce9cf49b43d9ccf679f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

export const auth = getAuth();
export const db = getFirestore(app);

export const usersCollection = collection(db, 'users');
export const document = { doc, setDoc };
export const authenticate = {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
};
