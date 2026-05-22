/**
 * Lead API
 * Lead tracking endpoints
 */

import axios from '../axios-helper';
import type { Lead, LeadSource } from '@/types';

export interface CreateLeadRequest {
  phone?: string;
  fullName?: string;
  cityIdentifier?: string;
  examTypeIdentifier?: string;
  searchedQuery?: string;
  visitedInstituteIdentifier?: string;
  visitedInstituteName?: string;
  source?: LeadSource;
}

export const leadApi = {
  /**
   * Create a lead (anonymous or authenticated)
   */
  create: async (data: CreateLeadRequest): Promise<Lead> => {
    const response = await axios.post<Lead>('/leads', data);
    return response.data;
  },

  /**
   * Get my leads (for logged-in student)
   */
  getMyLeads: async (): Promise<Lead[]> => {
    const response = await axios.get<Lead[]>('/leads/my');
    return response.data;
  },

  /**
   * Get leads by institute (for super admin)
   */
  getByInstitute: async (instituteIdentifier: string): Promise<Lead[]> => {
    const response = await axios.get<Lead[]>(`/leads/institute/${instituteIdentifier}`);
    return response.data;
  },
};
