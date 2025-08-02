import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc, getDocs, query, orderBy, limit, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from './firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import type { Session, User } from '@/types';

export const createUserProfileIfNotExists = async (firebaseUser: FirebaseUser) => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      totalSprints: 0,
      streak: 0,
      points: 0,
    };
    await setDoc(userRef, newUser);
  }
};

export const createSession = async (title: string, creator: User): Promise<string | null> => {
  try {
    const sessionData = {
      title,
      creatorUid: creator.uid,
      status: 'waiting',
      createdAt: serverTimestamp(),
      participants: [{
        uid: creator.uid,
        displayName: creator.displayName,
        photoURL: creator.photoURL,
        progress: 0,
        status: 'waiting',
      }],
    };
    const sessionRef = await addDoc(collection(db, 'sessions'), sessionData);
    return sessionRef.id;
  } catch (error) {
    console.error("Error creating session: ", error);
    return null;
  }
};

export const joinSession = async (sessionId: string, user: User) => {
    try {
        const sessionRef = doc(db, 'sessions', sessionId);
        const newParticipant = {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            progress: 0,
            status: 'waiting',
        };
        await updateDoc(sessionRef, {
            participants: arrayUnion(newParticipant)
        });
        return true;
    } catch (error) {
        console.error("Error joining session: ", error);
        return false;
    }
};


export const getLeaderboard = async (): Promise<User[]> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('points', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (error) {
        console.error("Error getting leaderboard: ", error);
        return [];
    }
}

export const completeSprint = async (userId: string, sessionId: string, points: number) => {
    try {
        const userRef = doc(db, 'users', userId);
        
        await updateDoc(userRef, {
            points: increment(points),
            totalSprints: increment(1),
            streak: increment(1)
        });
        
        // Note: Updating participant status within the session document is handled on the session page for simplicity.
        
        return true;
    } catch (error) {
        console.error("Error completing sprint: ", error);
        return false;
    }
};
