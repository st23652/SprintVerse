
import type { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  totalSprints: number;
  streak: number;
  points: number;
}

export interface Session {
  id: string;
  title: string;
  creatorUid: string;
  status: 'waiting' | 'in-progress' | 'completed';
  createdAt: Timestamp;
  participants: Participant[];
  participantUids: string[];
}

export interface Participant {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  progress: number;
  status: 'in-progress' | 'completed' | 'waiting';
}
