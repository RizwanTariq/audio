import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBogczGVlTZoU89rHjGqJtaWtGYnvWU0gQ',
  authDomain: 'audio-app-1234.firebaseapp.com',
  projectId: 'audio-app-1234',
  storageBucket: 'audio-app-1234.appspot.com',
  messagingSenderId: '459668403662',
  appId: '1:459668403662:web:ea1ce9cf49b43d9ccf679f',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export default app;
