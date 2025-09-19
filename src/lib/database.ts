import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { 
  FinancialData, 
  UsageMetrics, 
  RevenueStream, 
  TeamMember, 
  UserSettings 
} from '../types';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  companyName: string;
  companySize: string;
  industry: string;
}

export class DatabaseService {
  // Financial Data Methods
  static async getFinancialData(userId: string): Promise<FinancialData | null> {
    if (!isFirebaseConfigured) {
      // Firebase not configured: behave as if no remote data yet
      return null;
    }
    try {
      const docRef = doc(db, 'financial_data', userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as FinancialData : null;
    } catch (error) {
      console.error('Error fetching financial data:', error);
      // If Firestore rules are not set up, return null gracefully
      if (error instanceof Error && error.message.includes('permission')) {
        console.warn('Firestore permission denied. Please set up security rules.');
        return null;
      }
      throw error;
    }
  }

  static async saveFinancialData(userId: string, data: Partial<FinancialData>): Promise<void> {
    if (!isFirebaseConfigured) {
      // Skip persistence when not configured
      return;
    }
    try {
      const docRef = doc(db, 'financial_data', userId);
      await setDoc(docRef, { 
        ...data, 
        updated_at: serverTimestamp() 
      }, { merge: true });
    } catch (error) {
      console.error('Error saving financial data:', error);
      // Graceful fallback for permission issues
      if (error instanceof Error && error.message.includes('permission')) {
        console.warn('Firestore permission denied. Data not saved. Please set up security rules.');
        return;
      }
      throw error;
    }
  }

  // Revenue Streams Methods
  static async getRevenueStreams(userId: string): Promise<RevenueStream[]> {
    if (!isFirebaseConfigured) {
      return [];
    }
    try {
      const colRef = collection(db, 'revenue_streams', userId, 'streams');
      const querySnapshot = await getDocs(query(colRef, orderBy('name')));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RevenueStream[];
    } catch (error) {
      console.error('Error fetching revenue streams:', error);
      // Graceful fallback for permission issues
      if (error instanceof Error && error.message.includes('permission')) {
        console.warn('Firestore permission denied. Using default data. Please set up security rules.');
      }
      return [];
    }
  }

  static async saveRevenueStream(userId: string, stream: Omit<RevenueStream, 'id'>): Promise<string> {
    if (!isFirebaseConfigured) {
      return `local-${Date.now()}`;
    }
    try {
      const colRef = collection(db, 'revenue_streams', userId, 'streams');
      const docRef = await addDoc(colRef, {
        ...stream,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving revenue stream:', error);
      // Graceful fallback for permission issues
      if (error instanceof Error && error.message.includes('permission')) {
        console.warn('Firestore permission denied. Data not saved. Please set up security rules.');
        return `local-${Date.now()}`;
      }
      throw error;
    }
  }

  static async updateRevenueStream(userId: string, streamId: string, updates: Partial<RevenueStream>): Promise<void> {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const docRef = doc(db, 'revenue_streams', userId, 'streams', streamId);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating revenue stream:', error);
      throw error;
    }
  }

  static async deleteRevenueStream(userId: string, streamId: string): Promise<void> {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const docRef = doc(db, 'revenue_streams', userId, 'streams', streamId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting revenue stream:', error);
      throw error;
    }
  }

  // Team Members Methods
  static async getTeamMembers(userId: string): Promise<TeamMember[]> {
    if (!isFirebaseConfigured) {
      return [];
    }
    try {
      const colRef = collection(db, 'team_data', userId, 'members');
      const querySnapshot = await getDocs(query(colRef, orderBy('name')));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date()
      })) as TeamMember[];
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }

  static async saveTeamMember(userId: string, member: Omit<TeamMember, 'id'>): Promise<string> {
    if (!isFirebaseConfigured) {
      return `local-${Date.now()}`;
    }
    try {
      const colRef = collection(db, 'team_data', userId, 'members');
      const docRef = await addDoc(colRef, {
        ...member,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving team member:', error);
      throw error;
    }
  }

  static async updateTeamMember(userId: string, memberId: string, updates: Partial<TeamMember>): Promise<void> {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const docRef = doc(db, 'team_data', userId, 'members', memberId);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }

  static async deleteTeamMember(userId: string, memberId: string): Promise<void> {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const docRef = doc(db, 'team_data', userId, 'members', memberId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  }

  // Usage Metrics Methods
  static async getUsageMetrics(userId: string): Promise<UsageMetrics | null> {
    if (!isFirebaseConfigured) {
      return null;
    }
    try {
      const docRef = doc(db, 'usage_metrics', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          sessionsCount: data.sessionsCount || 0,
          scenariosRun: data.scenariosRun || 0,
          reportsGenerated: data.reportsGenerated || 0,
          lastActive: data.lastActive?.toDate() || new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching usage metrics:', error);
      throw error;
    }
  }

  static async trackUsage(userId: string, action: keyof UsageMetrics): Promise<void> {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const docRef = doc(db, 'usage_metrics', userId);
      await updateDoc(docRef, {
        [action]: increment(1),
        lastActive: serverTimestamp()
      });
    } catch (error) {
      // If document doesn't exist, create it
      try {
        const docRef = doc(db, 'usage_metrics', userId);
        await setDoc(docRef, {
          sessionsCount: action === 'sessionsCount' ? 1 : 0,
          scenariosRun: action === 'scenariosRun' ? 1 : 0,
          reportsGenerated: action === 'reportsGenerated' ? 1 : 0,
          lastActive: serverTimestamp()
        });
      } catch (createError) {
        console.error('Error creating usage metrics:', createError);
        throw createError;
      }
    }
  }

  // User Settings Methods
  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    if (!isFirebaseConfigured) {
      return null;
    }
    try {
      const docRef = doc(db, 'user_settings', userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as UserSettings : null;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  // User Profile Methods
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!isFirebaseConfigured) {
      return null;
    }
    try {
      const docRef = doc(db, 'user_profiles', userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as UserProfile : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error instanceof Error && error.message.includes('permission')) {
        console.warn('Firestore permission denied. Please set up security rules.');
        return null;
      }
      throw error;
    }
  }

  static async saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const docRef = doc(db, 'user_profiles', userId);
      await setDoc(docRef, {
        ...profile,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  static async saveUserSettings(userId: string, settings: UserSettings): Promise<void> {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const docRef = doc(db, 'user_settings', userId);
      await setDoc(docRef, {
        ...settings,
        updated_at: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }
  }
}
