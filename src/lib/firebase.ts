
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    GithubAuthProvider,
    signInWithPopup, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
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

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one.
      // The other tabs will still work normally.
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firestore persistence is not available in this browser.');
    }
  });


const handleAuthSuccess = async (user: any) => {
    if (user) {
        await createUserProfileIfNotExists(user);
    }
    return user;
}

const handleAuthError = (error: any) => {
    if (error.code === 'auth/unauthorized-domain') {
        console.error(`
        FIREBASE AUTH ERROR: The domain of this web app is not authorized to use Firebase Authentication.
        
        To fix this, please go to the Firebase Console:
        1. Select your project: 'sprintverse'.
        2. Go to the 'Authentication' section.
        3. Click on the 'Settings' tab.
        4. Under 'Authorized domains', click 'Add domain'.
        5. Add 'localhost' and the domain from the error message.
        
        Your app is running from a domain that is not on this list.
        The current authDomain is configured as: ${auth.config.authDomain}
        `);
    } else if (error.code !== 'auth/billing-not-enabled' && error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        console.error("Authentication Error: ", error);
    }
    // Don't re-throw for common "user closed popup" errors
    if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        throw error;
    }
    return null;
}

export const signInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    auth.tenantId = firebaseConfig.authDomain;
    const result = await signInWithPopup(auth, googleProvider);
    return await handleAuthSuccess(result.user);
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signInWithGitHub = async () => {
  try {
    const githubProvider = new GithubAuthProvider();
    auth.tenantId = firebaseConfig.authDomain;
    const result = await signInWithPopup(auth, githubProvider);
    return await handleAuthSuccess(result.user);
  } catch (error) {
    return handleAuthError(error);
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        // Manually update the user object before creating the profile
        const updatedUser = { ...result.user, displayName };
        return await handleAuthSuccess(updatedUser);
    } catch (error) {
        return handleAuthError(error);
    }
}

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return await handleAuthSuccess(result.user);
    } catch (error) {
        return handleAuthError(error);
    }
}

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export { auth, db };
