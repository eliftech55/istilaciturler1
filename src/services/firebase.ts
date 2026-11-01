import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut,
  onAuthStateChanged,
  updateProfile,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  getDocFromServer,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: Database ID specified
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Error Handling Definition
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase bağlantısı kontrol ediliyor.');
    }
  }
}
testConnection();

// --- Auth Helpers ---
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Giriş Hatası:', error);
    throw error;
  }
}

export async function loginAsGuest(guestName?: string) {
  try {
    const cred = await signInAnonymously(auth);
    const displayName = guestName || `Koruyucu-${Math.floor(1000 + Math.random() * 9000)}`;
    
    try {
      await updateProfile(cred.user, { displayName });
    } catch {}

    // Create guest profile in Firestore
    const userRef = doc(db, 'users', cred.user.uid);
    await setDoc(userRef, {
      uid: cred.user.uid,
      displayName,
      email: '',
      isAnonymous: true,
      highScore: 0,
      levelsUnlocked: 1,
      totalInvasivesCaptured: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return cred.user;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'users');
  }
}

export async function updateUsername(user: User, newName: string) {
  try {
    await updateProfile(user, { displayName: newName });
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      displayName: newName,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    const leaderboardRef = doc(db, 'leaderboard', user.uid);
    await setDoc(leaderboardRef, {
      displayName: newName,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

export async function logoutUser() {
  return signOut(auth);
}

// --- Leaderboard & Stats Services ---
export interface LeaderboardItem {
  id: string;
  userId: string;
  displayName: string;
  score: number;
  levelReached: number;
  capturedTotal: number;
  updatedAt?: string;
}

export function subscribeLeaderboard(onUpdate: (items: LeaderboardItem[]) => void) {
  const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(15));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const items: LeaderboardItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<LeaderboardItem, 'id'>) });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'leaderboard');
    }
  );
}

export async function recordScoreAndProgress(
  user: User,
  score: number,
  levelNumber: number,
  capturedCount: number
) {
  if (!user) return;
  const userId = user.uid;
  const displayName = user.displayName || `Koruyucu-${userId.slice(0, 5)}`;

  try {
    // 1. Get current profile to check high score
    const userDocRef = doc(db, 'users', userId);
    let currentHighScore = 0;
    let currentCaptured = 0;
    let unlocked = 1;

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        currentHighScore = data.highScore || 0;
        currentCaptured = data.totalInvasivesCaptured || 0;
        unlocked = data.levelsUnlocked || 1;
      }
    } catch {
      // New profile will be created
    }

    const newHighScore = Math.max(currentHighScore, score);
    const newTotalCaptured = currentCaptured + capturedCount;
    const newUnlocked = Math.max(unlocked, Math.min(5, levelNumber + 1));

    // 2. Update user profile
    await setDoc(userDocRef, {
      uid: userId,
      displayName,
      email: user.email || '',
      isAnonymous: user.isAnonymous,
      highScore: newHighScore,
      levelsUnlocked: newUnlocked,
      totalInvasivesCaptured: newTotalCaptured,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // 3. Update public leaderboard if score is high score
    const leaderboardRef = doc(db, 'leaderboard', userId);
    await setDoc(leaderboardRef, {
      id: userId,
      userId,
      displayName,
      score: newHighScore,
      levelReached: Math.max(levelNumber, unlocked),
      capturedTotal: newTotalCaptured,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // 4. Record level session record
    const recordRef = doc(collection(db, 'users', userId, 'game_records'));
    await setDoc(recordRef, {
      id: recordRef.id,
      userId,
      levelNumber,
      score,
      capturedCount,
      completed: true,
      completedAt: new Date().toISOString(),
    });

  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
  }
}
