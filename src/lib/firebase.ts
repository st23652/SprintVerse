
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithPopup, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    Auth
} from 'firebase/auth';
import { getFirestore, initializeFirestore, memoryLocalCache, Firestore } from 'firebase/firestore';
import { createUserProfileIfNotExists } from './firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCWqkzo5_Xanzh-fNQ5gBzUtY6eNY0n2bA",
    authDomain: "sprintverse.firebaseapp.com",
    projectId: "sprintverse",
    storageBucket: "sprintverse.firebasestorage.app",
    messagingSenderId: "985612924718",
    appId: "1:985612924718:web:a3e523984481360296acbf"
};

// Initialize Firebase for Singleton Pattern
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, {
        localCache: memoryLocalCache()
    });
} else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
}


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
        1. Select your project: 'SprintVerse'.
        2. Go to the 'Authentication' section.
        3. Click on the 'Settings' tab.
        4. Under 'Authorized domains', click 'Add domain'.
        5. Add 'localhost' and the domain from the error message.
        
        Your app is running from a domain that is not on this list.
        The current authDomain is configured as: sprintverse.firebaseapp.com
        `);
        // Do not re-throw the error, just return null to prevent a crash.
        return null;
    }
    
    // Don't throw for common "user closed popup" errors.
    if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        console.error("Authentication Error: ", error);
        throw error;
    }
    
    return null;
}

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        // Manually update the user object before creating the profile
        const updatedUser = { ...result.user, displayName };
        return await handleAuthSuccess(updatedUser);
    } catch (error) {
        if ((error as any).code === 'auth/email-already-in-use') {
          throw error;
        }
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
