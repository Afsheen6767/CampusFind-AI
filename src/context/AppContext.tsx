import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, User, FilterOptions, ToastNotification } from '../types';
import { INITIAL_MOCK_ITEMS, DEMO_USERS } from '../data/mockData';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  registerUserWithFirebase,
  loginUserWithFirebase,
  logoutUserFromFirebase,
  updateUserProfileInFirebase,
  subscribeToFirestoreItems,
  addDocToFirestoreItems,
  updateDocInFirestoreItems,
  deleteDocFromFirestoreItems,
  markDocResolvedInFirestore,
} from '../services/firebaseService';

export type PageView =
  | 'landing'
  | 'dashboard'
  | 'report_lost'
  | 'report_found'
  | 'browse'
  | 'ai_match'
  | 'my_reports'
  | 'profile'
  | 'login'
  | 'register';

interface AppContextType {
  items: Item[];
  currentUser: User | null;
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  selectedMatchItem: Item | null;
  setSelectedMatchItem: (item: Item | null) => void;
  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
  addItem: (
    itemData: Omit<Item, 'id' | 'createdAt' | 'status' | 'userId' | 'userName' | 'userEmail'>,
    imageSource?: string | File
  ) => Promise<Item>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  markAsResolved: (id: string) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    department?: string,
    studentId?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  switchDemoUser: (user: User) => void;
  selectedDetailItem: Item | null;
  setSelectedDetailItem: (item: Item | null) => void;
  isLoading: boolean;
  isFirebaseActive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ITEMS = 'campusfind_ai_items_v1';
const LOCAL_STORAGE_KEY_USER = 'campusfind_ai_user_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved items:', e);
    }
    return INITIAL_MOCK_ITEMS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    return DEMO_USERS[0];
  });

  const [currentView, setCurrentView] = useState<PageView>('landing');
  const [selectedMatchItem, setSelectedMatchItem] = useState<Item | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<Item | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(isFirebaseConfigured);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    category: '',
    location: '',
    color: '',
    type: 'all',
    status: 'all',
    sortBy: 'newest',
  });

  // Toast notifications helper
  const addToast = (title: string, message: string, type: ToastNotification['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Firebase Auth state
  useEffect(() => {
    if (auth) {
      const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const syncedUser: User = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Campus User',
            email: fbUser.email || 'user@university.edu',
            department: currentUser?.department || 'University Student',
            studentId: currentUser?.studentId || `STU-${fbUser.uid.substring(0, 6).toUpperCase()}`,
            avatarUrl:
              fbUser.photoURL ||
              `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
            role: 'student',
          };
          setCurrentUser(syncedUser);
        }
      });
      return () => unsubscribeAuth();
    }
  }, []);

  // Subscribe to real-time Firestore items
  useEffect(() => {
    if (db) {
      setIsFirebaseActive(true);
      const unsubscribeItems = subscribeToFirestoreItems(
        (fetchedItems) => {
          if (fetchedItems.length > 0) {
            setItems(fetchedItems);
          } else {
            // Seed Firestore with initial mock items if collection is empty
            INITIAL_MOCK_ITEMS.forEach((mockItem) => {
              addDocToFirestoreItems(mockItem).catch(() => {});
            });
            setItems(INITIAL_MOCK_ITEMS);
          }
        },
        (error) => {
          console.warn('Firestore subscription fallback:', error);
        }
      );
      return () => unsubscribeItems();
    }
  }, []);

  // Local storage fallback sync
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items to localStorage:', e);
    }
  }, [items]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
  }, [currentUser]);

  // CRUD & AUTH Operations
  const addItem = async (
    itemData: Omit<Item, 'id' | 'createdAt' | 'status' | 'userId' | 'userName' | 'userEmail'>,
    imageSource?: string | File
  ): Promise<Item> => {
    setIsLoading(true);
    try {
      const user = currentUser || DEMO_USERS[0];
      const payload = {
        ...itemData,
        userId: user.uid,
        userName: user.name,
        userEmail: user.email,
      };

      const newItem = await addDocToFirestoreItems(payload, imageSource);
      setItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);

      addToast(
        'Report Published! 🎉',
        `Your ${newItem.type} item "${newItem.title}" was saved to Cloud Firestore.`,
        'success'
      );
      return newItem;
    } catch (err) {
      console.error('Error adding item:', err);
      addToast('Error Creating Report', 'Failed to save item to database.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (id: string, updates: Partial<Item>): Promise<void> => {
    setIsLoading(true);
    try {
      await updateDocInFirestoreItems(id, updates);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      addToast('Report Updated', 'Your item details were saved in Firestore.', 'info');
    } catch (err) {
      console.error('Error updating item:', err);
      addToast('Update Failed', 'Could not save item updates.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await deleteDocFromFirestoreItems(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      addToast('Report Removed', 'Item report was deleted from Firestore.', 'warning');
    } catch (err) {
      console.error('Error deleting item:', err);
      addToast('Delete Failed', 'Could not delete report.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsResolved = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await markDocResolvedInFirestore(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'resolved', resolvedAt: new Date().toISOString() }
            : item
        )
      );
      addToast('Reunited! 🎉', 'Item marked as resolved & returned to owner.', 'success');
    } catch (err) {
      console.error('Error marking resolved:', err);
      addToast('Update Failed', 'Could not update item status.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const fbUser = await loginUserWithFirebase(email, password);
      setCurrentUser(fbUser);
      addToast('Welcome Back!', `Signed in as ${fbUser.email}`, 'success');
      setCurrentView('dashboard');
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      let errorTitle = 'Authentication Error';
      let errorMsg = err.message || 'Check email and password or create a new account.';
      if (err.code === 'auth/operation-not-allowed' || (typeof errorMsg === 'string' && errorMsg.includes('operation-not-allowed'))) {
        errorTitle = 'Enable Email/Password Auth';
        errorMsg = 'Email/Password provider is disabled in Firebase Console. Please go to Firebase Console → Authentication → Sign-in method → Email/Password and click Enable.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorTitle = 'Invalid Credentials';
        errorMsg = 'Incorrect email or password. Please check your login credentials or register a new account.';
      }
      addToast(errorTitle, errorMsg, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string,
    department?: string,
    studentId?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const newUser = await registerUserWithFirebase(
        name,
        email,
        password,
        department,
        studentId
      );
      setCurrentUser(newUser);
      addToast('Account Created! 🎉', `Created Firebase Auth user and stored Firestore profile for ${newUser.name}.`, 'success');
      setCurrentView('dashboard');
    } catch (err: any) {
      console.error('Register error:', err);
      let errorTitle = 'Registration Error';
      let errorMsg = err.message || 'Could not register user with Firebase Auth.';
      if (err.code === 'auth/operation-not-allowed' || (typeof errorMsg === 'string' && errorMsg.includes('operation-not-allowed'))) {
        errorTitle = 'Enable Email/Password Auth';
        errorMsg = 'Email/Password provider is disabled in Firebase Console. Please go to Firebase Console → Build → Authentication → Sign-in method → Email/Password and enable it.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorTitle = 'Email Already Registered';
        errorMsg = 'An account with this email already exists in Firebase Auth. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorTitle = 'Weak Password';
        errorMsg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorTitle = 'Invalid Email';
        errorMsg = 'Please enter a valid email address.';
      }
      addToast(errorTitle, errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await logoutUserFromFirebase();
      setCurrentUser(null);
      addToast('Logged Out', 'Signed out from CampusFind AI.', 'info');
      setCurrentView('landing');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const updated = { ...currentUser, ...updates };
      setCurrentUser(updated);
      if (currentUser.uid && db) {
        await updateUserProfileInFirebase(currentUser.uid, updates);
      }
      addToast('Profile Saved', 'Profile changes saved in Firestore.', 'success');
    } catch (err) {
      console.error('Error updating profile:', err);
      addToast('Profile Update Error', 'Failed to update user profile.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoUser = (user: User) => {
    setCurrentUser(user);
    addToast('Account Switched', `Switched to ${user.name} (${user.role})`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        items,
        currentUser,
        currentView,
        setCurrentView,
        filters,
        setFilters,
        selectedMatchItem,
        setSelectedMatchItem,
        toasts,
        addToast,
        removeToast,
        addItem,
        updateItem,
        deleteItem,
        markAsResolved,
        login,
        registerUser,
        logout,
        updateUserProfile,
        switchDemoUser,
        selectedDetailItem,
        setSelectedDetailItem,
        isLoading,
        isFirebaseActive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
