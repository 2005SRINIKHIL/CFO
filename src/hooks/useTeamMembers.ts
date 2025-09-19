import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '../types';
import { DatabaseService } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';

export const useTeamMembers = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default team members for new users
  const defaultMembers: Omit<TeamMember, 'id'>[] = [
    {
      name: 'John Doe',
      role: 'CEO',
      department: 'Leadership',
      salary: 12000,
      startDate: new Date('2023-01-01'),
      equity: 25,
      status: 'active'
    },
    {
      name: 'Jane Smith',
      role: 'CTO',
      department: 'Technology',
      salary: 10000,
      startDate: new Date('2023-02-01'),
      equity: 15,
      status: 'active'
    },
    {
      name: 'Mike Johnson',
      role: 'Lead Developer',
      department: 'Technology',
      salary: 8500,
      startDate: new Date('2023-03-01'),
      equity: 2,
      status: 'active'
    },
    {
      name: 'Sarah Wilson',
      role: 'Marketing Manager',
      department: 'Marketing',
      salary: 7000,
      startDate: new Date('2023-04-01'),
      equity: 1,
      status: 'active'
    }
  ];

  // Load team members
  const loadTeamMembers = useCallback(async () => {
    if (!user) {
      setTeamMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const members = await DatabaseService.getTeamMembers(user.uid);
      
      if (members.length === 0) {
        // Create default members for new users
        const createdMembers: TeamMember[] = [];
        for (const member of defaultMembers) {
          const id = await DatabaseService.saveTeamMember(user.uid, member);
          createdMembers.push({ ...member, id });
        }
        setTeamMembers(createdMembers);
      } else {
        setTeamMembers(members);
      }
    } catch (err) {
      console.error('Error loading team members:', err);
      setError('Failed to load team members');
      // Fallback to local default data
      setTeamMembers(defaultMembers.map((member, index) => ({ 
        ...member, 
        id: `local-${index}` 
      })));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add new team member
  const addTeamMember = useCallback(async (member: Omit<TeamMember, 'id'>) => {
    if (!user) {
      console.warn('Cannot add team member: user not authenticated');
      return;
    }

    try {
      const id = await DatabaseService.saveTeamMember(user.uid, member);
      const newMember: TeamMember = { ...member, id };
      setTeamMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err) {
      console.error('Error adding team member:', err);
      setError('Failed to add team member');
      throw err;
    }
  }, [user]);

  // Update team member
  const updateTeamMember = useCallback(async (id: string, updates: Partial<Omit<TeamMember, 'id'>>) => {
    if (!user) {
      console.warn('Cannot update team member: user not authenticated');
      return;
    }

    try {
      await DatabaseService.updateTeamMember(user.uid, id, updates);
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === id ? { ...member, ...updates } : member
        )
      );
    } catch (err) {
      console.error('Error updating team member:', err);
      setError('Failed to update team member');
      throw err;
    }
  }, [user]);

  // Delete team member
  const deleteTeamMember = useCallback(async (id: string) => {
    if (!user) {
      console.warn('Cannot delete team member: user not authenticated');
      return;
    }

    try {
      await DatabaseService.deleteTeamMember(user.uid, id);
      setTeamMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      console.error('Error deleting team member:', err);
      setError('Failed to delete team member');
      throw err;
    }
  }, [user]);

  // Load team members when user changes
  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  // Calculate total salary cost
  const getTotalSalaryCost = useCallback(() => {
    return teamMembers.reduce((total, member) => 
      member.status === 'active' ? total + member.salary : total, 0
    );
  }, [teamMembers]);

  // Get active team size
  const getActiveTeamSize = useCallback(() => {
    return teamMembers.filter(member => member.status === 'active').length;
  }, [teamMembers]);

  return {
    teamMembers,
    loading,
    error,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refreshMembers: loadTeamMembers,
    getTotalSalaryCost,
    getActiveTeamSize
  };
};
