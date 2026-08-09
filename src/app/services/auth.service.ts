import { Injectable, signal } from '@angular/core';
import { 
  User, 
  signInWithPopup, 
  signInAnonymously,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from './firebase.service';
import { Character, EquipmentSlot, Item, Quest, Skill } from '../models/game.models';

export interface SavedCharacterFull {
  id: string;
  userId: string;
  character: Character;
  equipped: Record<EquipmentSlot, Item | null>;
  inventory: Item[];
  currentTownId: string;
  quests: Quest[];
  learnedSkills: Skill[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly userCharacters = signal<SavedCharacterFull[]>([]);
  readonly isLoadingAuth = signal<boolean>(true);
  readonly authError = signal<string | null>(null);
  readonly isCreatingNewChar = signal<boolean>(false);

  private googleProvider = new GoogleAuthProvider();
  private snapshotUnsubscribe: (() => void) | null = null;

  constructor() {
    // Check local session first
    if (typeof localStorage !== 'undefined') {
      const storedSession = localStorage.getItem('L2_FIRESTORE_SESSION');
      if (storedSession) {
        try {
          const parsedUser = JSON.parse(storedSession) as User;
          if (parsedUser && parsedUser.uid) {
            this.currentUser.set(parsedUser);
            this.syncUserCharacters(parsedUser.uid);
          }
        } catch {
          localStorage.removeItem('L2_FIRESTORE_SESSION');
        }
      }
    }

    onAuthStateChanged(auth, (user) => {
      // If Firebase Auth user arrives (e.g. Google sign in), use it
      if (user) {
        this.currentUser.set(user);
        this.syncUserCharacters(user.uid);
        if (typeof localStorage !== 'undefined') {
          const sessionUser = {
            uid: user.uid,
            email: user.email,
            isAnonymous: user.isAnonymous,
            displayName: user.displayName || user.email?.split('@')[0] || 'Warrior'
          };
          localStorage.setItem('L2_FIRESTORE_SESSION', JSON.stringify(sessionUser));
        }
      }
      this.isLoadingAuth.set(false);
    });
  }

  // Helper to sanitize email string for Firestore document ID
  private getEmailDocKey(email: string): string {
    return email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  // --- AUTH ACTIONS VIA FIRESTORE DATABASE STORAGE ---
  async registerWithEmail(email: string, pass: string) {
    this.authError.set(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const msg = 'Please enter a valid email address.';
      this.authError.set(msg);
      throw new Error(msg);
    }

    if (!pass || pass.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      this.authError.set(msg);
      throw new Error(msg);
    }

    const emailKey = this.getEmailDocKey(cleanEmail);

    try {
      // 1. Check if account already exists in Firestore DB 'accounts' collection
      const accountRef = doc(db, 'accounts', emailKey);
      const accountSnap = await getDoc(accountRef);

      if (accountSnap.exists()) {
        const msg = 'An account with this email address already exists. Please Sign In.';
        this.authError.set(msg);
        throw new Error(msg);
      }

      // 2. Create user UID for Firestore database user profile
      const userUid = 'usr_' + emailKey + '_' + Math.random().toString(36).substring(2, 8);

      // 3. Save User profile in Firestore DB
      const userDocRef = doc(db, 'users', userUid);
      await setDoc(userDocRef, {
        uid: userUid,
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 4. Save Account credentials in Firestore DB
      await setDoc(accountRef, {
        uid: userUid,
        email: cleanEmail,
        passwordHash: btoa(pass), // Basic base64 string encoding for DB credential verification
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 5. Construct custom User object and update state
      const customUser = {
        uid: userUid,
        email: cleanEmail,
        isAnonymous: false,
        displayName: cleanEmail.split('@')[0]
      } as unknown as User;

      this.currentUser.set(customUser);
      this.syncUserCharacters(userUid);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('L2_FIRESTORE_SESSION', JSON.stringify({
          uid: userUid,
          email: cleanEmail,
          isAnonymous: false,
          displayName: cleanEmail.split('@')[0]
        }));
      }

      return customUser;
    } catch (err: unknown) {
      console.error('Registration in Firestore error:', err);
      if (err instanceof Error) {
        if (!this.authError()) {
          this.authError.set(err.message);
        }
        throw err;
      }
      const genericMsg = 'Failed to create account in Firestore database.';
      this.authError.set(genericMsg);
      throw new Error(genericMsg);
    }
  }

  async loginWithEmail(email: string, pass: string) {
    this.authError.set(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !pass) {
      const msg = 'Please enter both email address and password.';
      this.authError.set(msg);
      throw new Error(msg);
    }

    const emailKey = this.getEmailDocKey(cleanEmail);

    try {
      // 1. Check account in Firestore DB 'accounts' collection
      const accountRef = doc(db, 'accounts', emailKey);
      const accountSnap = await getDoc(accountRef);

      if (!accountSnap.exists()) {
        const msg = 'No account found with this email. Please register a new account.';
        this.authError.set(msg);
        throw new Error(msg);
      }

      const accData = accountSnap.data();
      const storedHash = accData['passwordHash'];

      if (storedHash !== btoa(pass)) {
        const msg = 'Incorrect password. Please try again.';
        this.authError.set(msg);
        throw new Error(msg);
      }

      const userUid = accData['uid'] || ('usr_' + emailKey);

      const customUser = {
        uid: userUid,
        email: cleanEmail,
        isAnonymous: false,
        displayName: cleanEmail.split('@')[0]
      } as unknown as User;

      this.currentUser.set(customUser);
      this.syncUserCharacters(userUid);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('L2_FIRESTORE_SESSION', JSON.stringify({
          uid: userUid,
          email: cleanEmail,
          isAnonymous: false,
          displayName: cleanEmail.split('@')[0]
        }));
      }

      return customUser;
    } catch (err: unknown) {
      console.error('Firestore login error:', err);
      if (err instanceof Error) {
        if (!this.authError()) {
          this.authError.set(err.message);
        }
        throw err;
      }
      const genericMsg = 'Login failed. Please check your credentials.';
      this.authError.set(genericMsg);
      throw new Error(genericMsg);
    }
  }

  async loginWithGoogle() {
    this.authError.set(null);
    try {
      const credential = await signInWithPopup(auth, this.googleProvider);
      const userDocRef = doc(db, 'users', credential.user.uid);
      await setDoc(userDocRef, {
        uid: credential.user.uid,
        email: credential.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return credential.user;
    } catch (err: unknown) {
      console.error('Google login error:', err);
      const errObj = err as { code?: string; message?: string };
      this.authError.set(this.formatAuthErrorMessage(errObj?.code || errObj?.message || ''));
      throw err;
    }
  }

  async loginAsGuest() {
    this.authError.set(null);
    try {
      const credential = await signInAnonymously(auth);
      return credential.user;
    } catch (err: unknown) {
      console.warn('Firebase Anonymous auth disabled, entering local guest session:', err);
      const guestUid = 'guest_user_' + Date.now();
      const localGuestUser = {
        uid: guestUid,
        email: 'guest@realm.local',
        isAnonymous: true,
        displayName: 'Guest Wanderer'
      } as unknown as User;

      this.currentUser.set(localGuestUser);
      this.loadLocalGuestCharacters(guestUid);
      return localGuestUser;
    }
  }

  private loadLocalGuestCharacters(guestUid: string) {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem('L2_CHRONICLE_SAVE_V1');
    if (!raw) {
      this.userCharacters.set([]);
      return;
    }
    try {
      const data = JSON.parse(raw);
      if (data && data.character) {
        this.userCharacters.set([{
          id: data.id || 'char_guest',
          userId: guestUid,
          character: data.character,
          equipped: data.equipped || {},
          inventory: data.inventory || [],
          currentTownId: data.currentTownId || 'talking_island',
          quests: data.quests || [],
          learnedSkills: data.learnedSkills || [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        }]);
      }
    } catch {
      this.userCharacters.set([]);
    }
  }

  async logout() {
    this.authError.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('L2_FIRESTORE_SESSION');
    }
    if (this.snapshotUnsubscribe) {
      this.snapshotUnsubscribe();
      this.snapshotUnsubscribe = null;
    }
    try {
      await signOut(auth);
      this.currentUser.set(null);
      this.userCharacters.set([]);
    } catch (err: unknown) {
      console.error('Logout error:', err);
      this.currentUser.set(null);
      this.userCharacters.set([]);
    }
  }

  // --- FIRESTORE CHARACTER MANAGEMENT ---
  private syncUserCharacters(userId: string) {
    if (this.snapshotUnsubscribe) {
      this.snapshotUnsubscribe();
      this.snapshotUnsubscribe = null;
    }
    try {
      const charsRef = collection(db, 'users', userId, 'characters');
      this.snapshotUnsubscribe = onSnapshot(charsRef, (snapshot) => {
        const charsList: SavedCharacterFull[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as SavedCharacterFull;
          if (data && data.character) {
            charsList.push(data);
          }
        });
        this.userCharacters.set(charsList);
      }, (error) => {
        console.warn('Firestore character sync warning:', error);
      });
    } catch (error) {
      console.warn('Firestore collection access warning:', error);
    }
  }

  async saveCharacterToFirestore(savedChar: SavedCharacterFull): Promise<void> {
    const user = this.currentUser();
    if (!user) return;

    // If local offline guest user, skip firestore write or handle silently
    if (user.email === 'guest@realm.local') return;

    try {
      const charRef = doc(db, 'users', user.uid, 'characters', savedChar.id);
      const payload: SavedCharacterFull = {
        ...savedChar,
        userId: user.uid,
        updatedAt: new Date().toISOString()
      };
      await setDoc(charRef, payload, { merge: true });
    } catch (error) {
      console.warn('Failed to save character to Firestore:', error);
    }
  }

  async deleteCharacterFromFirestore(charId: string): Promise<void> {
    const user = this.currentUser();
    if (!user) return;

    if (user.email === 'guest@realm.local') {
      this.userCharacters.update(list => list.filter(c => c.id !== charId));
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('L2_CHRONICLE_SAVE_V1');
      }
      return;
    }

    try {
      const charRef = doc(db, 'users', user.uid, 'characters', charId);
      await deleteDoc(charRef);
    } catch (error) {
      console.warn('Failed to delete character from Firestore:', error);
    }
  }

  private formatAuthErrorMessage(code: string): string {
    if (!code) return 'An unknown authentication error occurred.';
    if (code.includes('auth/operation-not-allowed')) {
      return 'Email/Password authentication is disabled in Firebase Console for this project. Please use "Play as Guest" or Google Sign-In below!';
    }
    if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password')) {
      return 'Invalid email or password. Please try again.';
    }
    if (code.includes('auth/user-not-found')) {
      return 'No account found with this email address.';
    }
    if (code.includes('auth/email-already-in-use')) {
      return 'An account already exists with this email address.';
    }
    if (code.includes('auth/weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (code.includes('auth/invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (code.includes('auth/popup-closed-by-user')) {
      return 'Google Sign-In popup was closed before completing.';
    }
    return code;
  }
}
