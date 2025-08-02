
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
    RecaptchaVerifier,
    signInWithPhoneNumber,
    PhoneAuthProvider,
    signInWithCredential
} from 'firebase/auth';
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

const handleAuthSuccess = async (user: any) => {
    if (user) {
        await createUserProfileIfNotExists(user);
    }
    return user;
}

const handleAuthError = (error: any) => {
    if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        console.error("Authentication Error: ", error);
    }
    // Re-throw the error so the UI layer can handle it
    throw error;
}

export const signInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    return await handleAuthSuccess(result.user);
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signInWithGitHub = async () => {
  try {
    const githubProvider = new GithubAuthProvider();
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

const getRecaptchaVerifier = () => {
    if ((window as any).recaptchaVerifier) {
        return (window as any).recaptchaVerifier;
    }
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
    });
    (window as any).recaptchaVerifier = recaptchaVerifier;
    return recaptchaVerifier;
}


export const sendPhoneVerification = async (phoneNumber: string) => {
    const appVerifier = getRecaptchaVerifier();
    try {
        const verificationId = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        return verificationId;
    } catch(error) {
        // We will not log the billing error as the feature is now removed from UI.
        if (error.code !== 'auth/billing-not-enabled') {
            return handleAuthError(error);
        }
        return null;
    }
}

export const verifyPhoneCode = async (verificationId: string, code: string) => {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    try {
        const result = await signInWithCredential(auth, credential);
        return await handleAuthSuccess(result.user);
    } catch(error) {
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
