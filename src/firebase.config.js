import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBdBNI8TJimgwqvrvGeK0VX8KZUkxYQBU4',
  authDomain: 'todo-hub-1509.firebaseapp.com',
  projectId: 'todo-hub-1509',
  storageBucket: 'todo-hub-1509.appspot.com',
  messagingSenderId: '349024400669',
  appId: '1:349024400669:web:761646c3cb81ac7f0b5df4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
