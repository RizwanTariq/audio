import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  deleteDoc,
} from 'firebase/firestore';

import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

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
const storage = getStorage();
export const firebaseStorage = {
  storage,
  sRef,
  uploadAudio: uploadBytesResumable,
  getDownloadURL,
  deleteObject,
};

export const usersCollection = collection(db, 'users');
export const songsCollection = collection(db, 'songs');
export const commentsCollection = collection(db, 'comments');
export const document = {
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
  startAfter,
  orderBy,
  limit,
};
export const authenticate = {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
};
