import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Item, User } from '../types';

/**
 * Register a new user with Firebase Auth and save user profile to Firestore
 */
export async function registerUserWithFirebase(
  name: string,
  email: string,
  password: string,
  department: string = 'General Studies',
  studentId: string = ''
): Promise<User> {
  let uid = `usr_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  let registeredUser: User = {
    uid,
    name,
    email,
    department: department || 'Computer Science',
    studentId: studentId || `STU-${Math.floor(100000 + Math.random() * 900000)}`,
    avatarUrl: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80`,
    role: 'student',
  };

  if (auth) {
    try {
      // 1. Create real user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      registeredUser.uid = fbUser.uid;
      registeredUser.email = fbUser.email || email;

      try {
        await updateProfile(fbUser, { displayName: name });
      } catch (e) {
        console.warn('Could not update profile display name in Auth:', e);
      }
    } catch (err: any) {
      const errStr = String(err?.code || err?.message || err);
      if (errStr.includes('operation-not-allowed')) {
        console.warn('Firebase Auth Note: Email/Password provider disabled in Firebase Console. Storing profile in Firestore /users/{uid}');
      } else {
        // Re-throw other auth errors (e.g., email-already-in-use, weak-password)
        throw err;
      }
    }
  }

  // 2. Save profile to Firestore /users/{uid}
  if (db) {
    try {
      await setDoc(doc(db, 'users', registeredUser.uid), registeredUser, { merge: true });
    } catch (err) {
      console.warn('Could not store user profile in Firestore:', err);
    }
  }

  return registeredUser;
}

/**
 * Sign in existing user with Firebase Auth & load profile from Firestore
 */
export async function loginUserWithFirebase(email: string, password: string): Promise<User> {
  let uid = `usr_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  if (auth) {
    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      uid = fbUser.uid;
    } catch (err: any) {
      const errStr = String(err?.code || err?.message || err);
      if (errStr.includes('operation-not-allowed')) {
        console.warn('Firebase Auth Note: Email/Password provider disabled in Firebase Console. Fetching profile from Firestore.');
      } else {
        throw err;
      }
    }
  }

  // 2. Load user profile document from Firestore /users/{uid}
  if (db) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data() as User;
      }
    } catch (err) {
      console.warn('Failed to fetch user doc from Firestore:', err);
    }
  }

  // Fallback profile
  const userProfile: User = {
    uid,
    name: email.split('@')[0],
    email: email,
    department: 'University Student',
    studentId: `STU-${Math.floor(100000 + Math.random() * 900000)}`,
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
    role: 'student',
  };

  // Save to Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'users', uid), userProfile, { merge: true });
    } catch (e) {
      console.warn('Could not save user profile on login:', e);
    }
  }

  return userProfile;
}

/**
 * Sign out from Firebase
 */
export async function logoutUserFromFirebase(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Update user profile details in Firestore
 */
export async function updateUserProfileInFirebase(
  uid: string,
  updates: Partial<User>
): Promise<void> {
  if (db) {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, updates, { merge: true });
  }
}

/**
 * Helper to process optional image source (File or base64 string or URL)
 * into a storeable string format without requiring external storage buckets.
 */
export async function processOptionalImage(
  imageSource?: string | File,
  category: string = 'Other'
): Promise<string> {
  if (!imageSource) {
    return getFallbackCategoryImageUrl(category);
  }

  if (typeof imageSource === 'string') {
    if (imageSource.trim().length > 0) {
      return imageSource;
    }
    return getFallbackCategoryImageUrl(category);
  }

  if (imageSource instanceof File) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve((reader.result as string) || getFallbackCategoryImageUrl(category));
      };
      reader.onerror = () => {
        resolve(getFallbackCategoryImageUrl(category));
      };
      reader.readAsDataURL(imageSource);
    });
  }

  return getFallbackCategoryImageUrl(category);
}

function getFallbackCategoryImageUrl(category: string): string {
  const defaults: Record<string, string> = {
    Electronics: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    Keys: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    Bags: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    Cards: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    Clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
    Books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    WaterBottles: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
  };
  return defaults[category] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
}

/**
 * Subscribe to real-time Firestore items collection updates
 */
export function subscribeToFirestoreItems(
  onItemsUpdate: (items: Item[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    return () => {};
  }

  try {
    const itemsCol = collection(db, 'items');
    const unsubscribe = onSnapshot(
      itemsCol,
      (snapshot) => {
        const fetchedItems: Item[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            type: data.type || 'lost',
            title: data.title || 'Untitled Item',
            category: data.category || 'Other',
            description: data.description || '',
            color: data.color || '',
            brand: data.brand || '',
            location: data.location || 'Main Campus',
            date: data.date || new Date().toISOString().split('T')[0],
            time: data.time || '12:00',
            contactName: data.contactName || 'Anonymous',
            contactEmail: data.contactEmail || 'contact@university.edu',
            contactPhone: data.contactPhone || '',
            imageUrl:
              data.imageUrl ||
              getFallbackCategoryImageUrl(data.category || 'Other'),
            status: data.status || 'active',
            userId: data.userId || 'anonymous',
            userName: data.userName || 'Student Reporter',
            userEmail: data.userEmail || '',
            createdAt: data.createdAt || new Date().toISOString(),
            uniqueIdentifiers: data.uniqueIdentifiers || [],
            resolvedAt: data.resolvedAt || undefined,
          } as Item;
        });

        // Sort newest first
        fetchedItems.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        onItemsUpdate(fetchedItems);
      },
      (err) => {
        console.warn('Firestore onSnapshot listener error:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Error setting up Firestore items listener:', err);
    return () => {};
  }
}

/**
 * Add a new Item report document to Firestore
 */
export async function addDocToFirestoreItems(
  itemData: Omit<Item, 'id' | 'createdAt' | 'status'>,
  imageSource?: string | File
): Promise<Item> {
  const newItemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const finalImageUrl = await processOptionalImage(imageSource || itemData.imageUrl, itemData.category);

  const payload: Item = {
    ...itemData,
    id: newItemId,
    imageUrl: finalImageUrl,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const docRef = doc(db, 'items', newItemId);
      await setDoc(docRef, payload);
    } catch (err) {
      console.warn('Could not write item doc to Firestore:', err);
    }
  }

  return payload;
}

/**
 * Update an existing Item report document in Firestore
 */
export async function updateDocInFirestoreItems(
  itemId: string,
  updates: Partial<Item>
): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, 'items', itemId);
      await setDoc(docRef, updates, { merge: true });
    } catch (err) {
      console.warn('Could not update item doc in Firestore:', err);
    }
  }
}

/**
 * Delete an Item report document from Firestore
 */
export async function deleteDocFromFirestoreItems(itemId: string): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, 'items', itemId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Could not delete item doc from Firestore:', err);
    }
  }
}

/**
 * Mark Item as resolved in Firestore
 */
export async function markDocResolvedInFirestore(itemId: string): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, 'items', itemId);
      await setDoc(
        docRef,
        {
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not mark item as resolved in Firestore:', err);
    }
  }
}
