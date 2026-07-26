export type ItemType = 'lost' | 'found';

export type ItemStatus = 'active' | 'pending_match' | 'resolved';

export type ItemCategory =
  | 'Electronics'
  | 'Clothing & Apparel'
  | 'Keys & Cards'
  | 'Books & Notebooks'
  | 'Bags & Wallets'
  | 'Jewelry & Watches'
  | 'Sports & Gear'
  | 'Personal Accessories'
  | 'Other';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  color?: string;
  brand?: string;
  location: string;
  date: string; // YYYY-MM-DD
  time?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  imageUrl: string;
  status: ItemStatus;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  uniqueIdentifiers?: string[];
  resolvedAt?: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  department?: string;
  studentId?: string;
  avatarUrl?: string;
  phone?: string;
  role?: 'student' | 'faculty' | 'staff' | 'security';
}

export interface AIMatchCandidate {
  itemId: string;
  score: number; // 0 to 100
  reasoning: string;
  keySimilarities: string[];
  confidence: 'High Confidence' | 'Moderate Confidence' | 'Low Confidence';
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  location: string;
  color: string;
  type: 'all' | 'lost' | 'found';
  status: 'all' | 'active' | 'resolved';
  sortBy: 'newest' | 'oldest' | 'location';
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
