/**
 * Faculty API
 * Faculty management for institutes
 */

import axios from '../axios-helper';
import { Faculty } from '@/types';

export const facultyApi = {
  /**
   * Create a new faculty
   */
  create: async (faculty: Omit<Faculty, 'identifier'>): Promise<Faculty> => {
    const response = await axios.post<Faculty>('/faculty', faculty);
    return response.data;
  },

  /**
   * Get faculty by identifier
   */
  getById: async (identifier: string): Promise<Faculty> => {
    const response = await axios.get<Faculty>(`/faculty/${identifier}`);
    return response.data;
  },

  /**
   * Get all faculty
   */
  getAll: async (): Promise<Faculty[]> => {
    const response = await axios.get<Faculty[]>('/faculty');
    return response.data;
  },

  /**
   * Delete faculty by identifier
   */
  delete: async (identifier: string): Promise<string> => {
    const response = await axios.delete<string>(`/faculty/${identifier}`);
    return response.data;
  },

  /**
   * Find faculty by institute identifier
   */
  findByInstituteIdentifier: async (instituteIdentifier: string): Promise<Faculty[]> => {
    const response = await axios.get<Faculty[]>(`/faculty/institute/${instituteIdentifier}`);
    return response.data;
  },

  /**
   * Find faculty with experience greater than specified years
   */
  findByExperienceYearsGreaterThan: async (years: number): Promise<Faculty[]> => {
    const response = await axios.get<Faculty[]>(`/faculty/experience-greater-than/${years}`);
    return response.data;
  },
};
