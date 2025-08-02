import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { createUserProfileIfNotExists } from './firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWqkzo5_Xanzh-fNQ5gBzUtY6eNY0n2bA",
  authDomain: "sprintverse.firebaseapp.com",
  projectId: "sprintverse",
  storageBucket: "sprintverse.firebasestorage.app",
  messagingSenderId: "985612924718",
  appId: "1:985612924718:web:a3e523984481360296acbf"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      await createUserProfileIfNotExists(user);
    }
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    return null;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export { auth, db };
