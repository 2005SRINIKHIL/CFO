import { useState, useEffect, useCallback } from 'react';
import { RevenueStream } from '../types';
import { DatabaseService } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';

export const useRevenueStreams = () => {
  const { user } = useAuth();
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default revenue streams for new users
  const defaultStreams: Omit<RevenueStream, 'id'>[] = [
    {
      name: 'SaaS Subscriptions',
      type: 'subscription',
      monthlyRevenue: 35000,
      customers: 450,
      averageValue: 78,
      growthRate: 15,
      color: '#3B82F6'
    },
    {
      name: 'Enterprise Contracts',
      type: 'one-time',
      monthlyRevenue: 12000,
      customers: 8,
      averageValue: 1500,
      growthRate: 25,
      color: '#10B981'
    },
    {
      name: 'API Usage',
      type: 'usage-based',
      monthlyRevenue: 8500,
      customers: 120,
      averageValue: 71,
      growthRate: 30,
      color: '#F59E0B'
    }
  ];

  // Load revenue streams
  const loadRevenueStreams = useCallback(async () => {
    if (!user) {
      setRevenueStreams([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const streams = await DatabaseService.getRevenueStreams(user.uid);
      
      if (streams.length === 0) {
        // Create default streams for new users
        const createdStreams: RevenueStream[] = [];
        for (const stream of defaultStreams) {
          const id = await DatabaseService.saveRevenueStream(user.uid, stream);
          createdStreams.push({ ...stream, id });
        }
        setRevenueStreams(createdStreams);
      } else {
        setRevenueStreams(streams);
      }
    } catch (err) {
      console.error('Error loading revenue streams:', err);
      setError('Failed to load revenue streams');
      // Fallback to local default data with unique IDs
      setRevenueStreams(defaultStreams.map((stream, index) => ({ 
        ...stream, 
        id: `local-${Date.now()}-${index}` // Make IDs unique with timestamp
      })));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add new revenue stream
  const addRevenueStream = useCallback(async (stream: Omit<RevenueStream, 'id'>) => {
    if (!user) {
      console.warn('Cannot add revenue stream: user not authenticated');
      // For non-authenticated users, add with local ID
      const localId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newStream: RevenueStream = { ...stream, id: localId };
      setRevenueStreams(prev => [...prev, newStream]);
      return newStream;
    }

    try {
      const id = await DatabaseService.saveRevenueStream(user.uid, stream);
      const newStream: RevenueStream = { ...stream, id };
      setRevenueStreams(prev => [...prev, newStream]);
      return newStream;
    } catch (err) {
      console.error('Error adding revenue stream:', err);
      setError('Failed to add revenue stream');
      // Fallback: add locally with unique ID
      const localId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newStream: RevenueStream = { ...stream, id: localId };
      setRevenueStreams(prev => [...prev, newStream]);
      return newStream;
    }
  }, [user]);

  // Update revenue stream
  const updateRevenueStream = useCallback(async (id: string, updates: Partial<Omit<RevenueStream, 'id'>>) => {
    if (!user) {
      console.warn('Cannot update revenue stream: user not authenticated');
      return;
    }

    try {
      await DatabaseService.updateRevenueStream(user.uid, id, updates);
      setRevenueStreams(prev => 
        prev.map(stream => 
          stream.id === id ? { ...stream, ...updates } : stream
        )
      );
    } catch (err) {
      console.error('Error updating revenue stream:', err);
      setError('Failed to update revenue stream');
      throw err;
    }
  }, [user]);

  // Delete revenue stream
  const deleteRevenueStream = useCallback(async (id: string) => {
    if (!user) {
      console.warn('Cannot delete revenue stream: user not authenticated');
      return;
    }

    try {
      await DatabaseService.deleteRevenueStream(user.uid, id);
      setRevenueStreams(prev => prev.filter(stream => stream.id !== id));
    } catch (err) {
      console.error('Error deleting revenue stream:', err);
      setError('Failed to delete revenue stream');
      throw err;
    }
  }, [user]);

  // Load revenue streams when user changes
  useEffect(() => {
    loadRevenueStreams();
  }, [loadRevenueStreams]);

  return {
    revenueStreams,
    loading,
    error,
    addRevenueStream,
    updateRevenueStream,
    deleteRevenueStream,
    refreshStreams: loadRevenueStreams
  };
};
