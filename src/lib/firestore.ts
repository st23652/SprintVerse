
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc, getDocs, query, orderBy, limit, updateDoc, arrayUnion, increment, onSnapshot, Unsubscribe, where } from 'firebase/firestore';
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
      participantUids: [creator.uid],
    };
    const sessionRef = await addDoc(collection(db, 'sessions'), sessionData);
    return sessionRef.id;
  } catch (error) {
    console.error("Error creating session: ", error);
    return null;
  }
};

export const joinSession = async (sessionId: string, user: User): Promise<boolean> => {
  const sessionRef = doc(db, 'sessions', sessionId);
  try {
    const sessionSnap = await getDoc(sessionRef);
    if (!sessionSnap.exists()) {
      console.error("Session not found!");
      return false;
    }

    const sessionData = sessionSnap.data() as Session;
    const participantUids = sessionData.participantUids || [];

    if (participantUids.includes(user.uid)) {
      return true;
    }

    const newParticipant = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      progress: 0,
      status: 'waiting',
    };

    await updateDoc(sessionRef, {
      participants: arrayUnion(newParticipant),
      participantUids: arrayUnion(user.uid)
    });
    
    return true;
  } catch (error) {
    console.error("Error joining session: ", error);
    return false;
  }
};


export const onLeaderboardUpdate = (callback: (users: User[]) => void): Unsubscribe => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('points', 'desc'), limit(10));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users = querySnapshot.docs.map(doc => doc.data() as User);
        callback(users);
    }, (error) => {
        console.error("Error listening to leaderboard updates: ", error);
        callback([]);
    });

    return unsubscribe;
}

export const getSessionHistory = async (userId: string): Promise<Session[]> => {
    try {
        const sessionsRef = collection(db, 'sessions');
        // This query now avoids the composite index error by not ordering on the backend.
        const q = query(
            sessionsRef,
            where('participantUids', 'array-contains', userId),
            limit(50) // Fetch a larger number to sort on the client
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
    } catch (error) {
        // The failed-precondition error should no longer happen, but keeping the catch block is good practice.
        if ((error as any).code === 'failed-precondition') {
             console.error(`
                FIRESTORE ERROR: A composite index is required for this query. This should not happen with the current code.
            `);
        } else {
            console.error("Error getting session history: ", error);
        }
        return [];
    }
}


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
        
        return true;
    } catch (error) {
        console.error("Error completing sprint: ", error);
        return false;
    }
};
